const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const root = path.resolve(__dirname, '..')
const provider = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json.in'), 'utf8')).id
const field = provider === 'netbird' ? 'setup_key' : 'auth_key'
const componentNames = ['NAlert', 'NButton', 'NInput', 'NInputNumber', 'NModal', 'NSpin', 'NSwitch', 'NTag']
const tick = () => new Promise(resolve => setImmediate(resolve))

function descendants(node) {
  if (!node) return []
  if (Array.isArray(node)) return node.flatMap(descendants)
  if (typeof node !== 'object') return []
  const children = typeof node.children === 'object' && !Array.isArray(node.children)
    ? Object.values(node.children || {}).flatMap(slot => typeof slot === 'function' ? descendants(slot()) : [])
    : descendants(node.children)
  return [node, ...children]
}

async function fixture(initialKey = '', locale = 'zh', redactSecrets = false) {
  let definition, adapter, mount, unmount, poll, messages
  let currentStatus = provider === 'netbird'
    ? { online: true, daemonStatus: 'Disconnected', authURL: '', authState: 'idle' }
    : { online: true, backendState: 'NeedsLogin', loggedIn: false, addresses: [], authURL: '', authState: 'idle' }
  const settings = provider === 'netbird'
    ? { setup_key: initialKey, hostname: 'onekvm', management_url: '', wireguard_port: 51820 }
    : { auth_key: initialKey, control_url: '', accept_routes: false, shields_up: false, port: 41641 }
  const effects = [], notices = []
  let saveResult = true, keyError = null, keyResult = null
  const host = {
    extension: { value: { settings } },
    registerSettings: value => { adapter = value; return () => {} },
    saveSettings: async () => {
      effects.push({ method: 'save', settings: adapter.collect() })
      if (saveResult) {
        const settings = adapter.collect()
        if (redactSecrets) delete settings[field]
        adapter.reset(settings)
      }
      return saveResult
    },
    invoke: async method => {
      if (method === 'status') return currentStatus
      effects.push({ method })
      if (method === 'connect_key') {
        if (keyError) throw keyError
        if (keyResult) await keyResult
        currentStatus = { ...currentStatus, authState: 'connecting' }
      }
      if (method === 'disconnect') currentStatus = { ...currentStatus, authState: 'idle' }
      return { started: true }
    },
  }
  const vue = {
    computed: getter => ({ get value() { return getter() } }),
    defineComponent: value => value,
    ref: value => ({ value }),
    onMounted: fn => { mount = fn }, onBeforeUnmount: fn => { unmount = fn },
    h: (type, props, children) => {
      if (children === undefined && (typeof props !== 'object' || Array.isArray(props))) return { type, props: {}, children: props }
      return { type, props: props || {}, children }
    },
  }
  const runtime = {
    vue, naive: { ...Object.fromEntries(componentNames.map(name => [name, name])), useMessage: () => ({ success: text => notices.push(text) }) },
    i18n: { createMessages: catalog => { messages = catalog; return catalog[locale] } },
    register: (id, value) => { assert.equal(id, provider); definition = value },
  }
  vm.runInNewContext(fs.readFileSync(path.join(root, 'web/page.js'), 'utf8'), {
    window: { OneKVMPluginUI: { v1: runtime }, setInterval: fn => { poll = fn; return 1 }, clearInterval: () => {} },
    navigator: {}, Error, Date,
  })
  const render = definition.component.setup({ host })
  mount(); await tick()
  const dialog = () => descendants(render()).find(node => node.type?.name?.endsWith('KeyConnectDialog'))
  const open = () => {
    const button = descendants(render()).find(node => node.type === 'NButton' && node.children.default() === messages[locale].keyConnect)
    assert.ok(button && !button.props.disabled)
    button.props.onClick()
  }
  return {
    effects, notices, messages, adapter, dialog, open, render,
    draft: value => dialog().props['onUpdate:value'](value),
    submit: () => dialog().props.onSubmit(), close: () => dialog().props.onClose(),
    poll: async () => { poll(); await tick() },
    status: value => { currentStatus = { ...currentStatus, ...value } },
    saveResult: value => { saveResult = value }, keyError: value => { keyError = value }, keyResult: value => { keyResult = value },
    browser: () => descendants(render()).find(node => node.type === 'NButton' && node.children.default() === messages[locale].browserConnect).props.onClick(),
    unmount,
  }
}

;(async () => {
  for (const locale of ['zh', 'zh-TW', 'en']) {
    const f = await fixture('', locale)
    assert.deepEqual(Object.keys(f.messages[locale]).sort(), Object.keys(f.messages.en).sort())
    f.open(); assert.equal(f.dialog().props.show, true)
    const vnode = f.dialog()
    const renderDialog = vnode.type.setup(vnode.props, { emit: () => {} })
    const modal = renderDialog()
    assert.equal(modal.type, 'NModal'); assert.equal(modal.props.maskClosable, false)
    const input = descendants(modal).find(node => node.type === 'NInput')
    assert.equal(input.props.type, 'password'); assert.equal(input.props.inputProps.autocomplete, 'off')
    const submit = descendants(modal).find(node => node.type === 'NButton' && node.props.attrType === 'submit')
    assert.equal(submit.props.disabled, true)
    f.unmount()
  }
  {
    const f = await fixture('stored-key'); f.open(); f.draft('draft-secret')
    assert.equal(f.adapter.collect()[field], 'stored-key', 'typing must not persist a credential')
    await f.close(); assert.equal(f.dialog().props.value, ''); assert.equal(f.effects.length, 0)
    f.open(); assert.equal(f.dialog().props.value, '', 'reopening must not expose saved or cancelled keys')
    for (const value of ['', '   ', 'invalid key', 'x'.repeat(4097)]) { f.draft(value); await f.submit() }
    assert.equal(f.effects.length, 0)
  }
  {
    const f = await fixture(); f.open(); f.draft('  test-secret  '); await f.submit()
    assert.deepEqual(f.effects.map(effect => effect.method), ['save', 'connect_key'])
    assert.equal(f.effects[0].settings[field], 'test-secret')
    assert.equal(f.dialog().props.pending, true); assert.equal(f.dialog().props.show, true)
    assert.equal(f.notices.length, 0, 'request acceptance must not report connection success')
    await f.submit(); assert.equal(f.effects.length, 2, 'pending requests must not be submitted twice')
    await f.close(); assert.equal(f.effects.at(-1).method, 'disconnect'); assert.equal(f.dialog().props.show, false)
  }
  {
    const f = await fixture(); f.saveResult(false); f.open(); f.draft('new-secret'); await f.submit()
    assert.deepEqual(f.effects.map(effect => effect.method), ['save'])
    assert.equal(f.adapter.collect()[field], ''); assert.ok(f.dialog().props.error)
    assert.equal(f.dialog().props.value, 'new-secret'); assert.equal(f.dialog().props.show, true)
  }
  {
    const f = await fixture(); f.open(); f.draft('same-secret'); f.keyError(new Error('API unavailable')); await f.submit()
    assert.equal(f.dialog().props.error, 'API unavailable'); await f.poll()
    assert.equal(f.dialog().props.error, 'API unavailable', 'status polling must not erase operation failures')
    f.keyError(null); await f.submit()
    assert.deepEqual(f.effects.map(effect => effect.method), ['save', 'connect_key', 'connect_key'], 'same saved key must remain retryable')
    f.status({ authState: 'failed' }); await f.poll()
    assert.equal(f.dialog().props.pending, false); assert.ok(f.dialog().props.error); assert.equal(f.dialog().props.show, true)
    await f.submit()
    f.status(provider === 'netbird' ? { daemonStatus: 'Connected', authState: 'idle' } : { backendState: 'Running', loggedIn: true, authState: 'idle' })
    await f.poll()
    assert.equal(f.dialog().props.show, false); assert.equal(f.dialog().props.value, ''); assert.equal(f.notices.length, 1)
  }
  {
    const f = await fixture('old-key'); await f.browser()
    assert.deepEqual(f.effects.map(effect => effect.method), ['save', 'connect'])
    assert.equal(f.effects[0].settings[field], '', 'browser sign-in must not trigger enrollment with an old key')
  }
  {
    const f = await fixture('', 'zh', true)
    await f.browser()
    assert.deepEqual(f.effects.map(effect => effect.method), ['save', 'connect'])
    assert.equal(f.effects[0].settings[field], '', 'redacted saved keys still need an explicit clear before browser sign-in')
  }
  {
    const f = await fixture('', 'zh', true); f.open(); f.draft('same-secret')
    f.keyError(new Error('Unavailable')); await f.submit(); await f.submit()
    assert.deepEqual(f.effects.map(effect => effect.method), ['save', 'connect_key', 'save', 'connect_key'])
    assert.ok(f.effects.filter(effect => effect.method === 'save').every(effect => effect.settings[field] === 'same-secret'))
    assert.equal(f.dialog().props.value, 'same-secret', 'secret redaction must not erase a failed attempt draft')
  }
  console.log(`${provider}: key dialog validation, secret isolation, save failures, retries, cancellation, success and browser sign-in passed`)
})().catch(error => { console.error(error); process.exitCode = 1 })
