(() => {
  const runtime = window.OneKVMPluginUI.v1
  const { computed, defineComponent, h, onBeforeUnmount, onMounted, ref } = runtime.vue
  const { NAlert, NButton, NInput, NInputNumber, NSpin, NTag, useMessage } = runtime.naive
  const labels = runtime.i18n.createMessages({
    'zh-TW': { title: 'NetBird', description: '使用瀏覽器登入 NetBird，或填寫 Setup Key 進行無人值守連線。', status: '連線狀態', checking: '正在取得狀態…', offline: 'NetBird 服務尚未就緒', ipv4: 'NetBird IPv4', ipv6: 'NetBird IPv6', fqdn: '完整網域名稱', management: '管理伺服器', none: '尚未分配', browserConnect: '使用瀏覽器連線', starting: '正在準備登入…', loginTimeout: '取得登入連結逾時，請重試。', openLogin: '開啟登入頁面', copyURL: '複製登入連結', copied: '登入連結已複製。', connectStarted: '瀏覽器登入已啟動。', disconnect: '中斷連線', logout: '登出並移除裝置', disconnected: '已中斷 NetBird 連線。', loggedOut: '已從 NetBird 登出並移除裝置。', refresh: '重新整理', settings: '連線設定', setupKey: 'Setup Key（可選）', keyHint: '適合無人值守部署；留空即可使用瀏覽器登入。', hostname: '裝置主機名稱', managementURL: '管理伺服器 URL（可選）', port: 'WireGuard 連接埠', save: '儲存設定', saved: 'NetBird 設定已儲存。' },
    zh: { title: 'NetBird', description: '使用浏览器登录 NetBird，或填写 Setup Key 进行无人值守连接。', status: '连接状态', checking: '正在获取状态…', offline: 'NetBird 服务尚未就绪', ipv4: 'NetBird IPv4', ipv6: 'NetBird IPv6', fqdn: '完整域名', management: '管理服务器', none: '尚未分配', browserConnect: '使用浏览器连接', starting: '正在准备登录…', loginTimeout: '获取登录链接超时，请重试。', openLogin: '打开登录页面', copyURL: '复制登录链接', copied: '登录链接已复制。', connectStarted: '浏览器登录已启动。', disconnect: '断开连接', logout: '退出并移除设备', disconnected: '已断开 NetBird 连接。', loggedOut: '已从 NetBird 退出并移除设备。', refresh: '刷新', settings: '连接设置', setupKey: 'Setup Key（可选）', keyHint: '适合无人值守部署；留空即可使用浏览器登录。', hostname: '设备主机名', managementURL: '管理服务器 URL（可选）', port: 'WireGuard 端口', save: '保存设置', saved: 'NetBird 设置已保存。' },
    en: { title: 'NetBird', description: 'Sign in to NetBird in a browser, or use a setup key for unattended enrollment.', status: 'Connection status', checking: 'Checking status…', offline: 'The NetBird service is not ready', ipv4: 'NetBird IPv4', ipv6: 'NetBird IPv6', fqdn: 'Fully qualified domain name', management: 'Management server', none: 'Not assigned yet', browserConnect: 'Connect in browser', starting: 'Preparing sign-in…', loginTimeout: 'Timed out waiting for the sign-in link. Please try again.', openLogin: 'Open sign-in page', copyURL: 'Copy sign-in link', copied: 'Sign-in link copied.', connectStarted: 'Browser sign-in started.', disconnect: 'Disconnect', logout: 'Log out and remove device', disconnected: 'NetBird disconnected.', loggedOut: 'Device logged out and removed from NetBird.', refresh: 'Refresh', settings: 'Connection settings', setupKey: 'Setup key (optional)', keyHint: 'Use for unattended enrollment, or leave empty for browser sign-in.', hostname: 'Device hostname', managementURL: 'Management server URL (optional)', port: 'WireGuard port', save: 'Save settings', saved: 'NetBird settings saved.' },
  })

  const Page = defineComponent({
    name: 'NetBirdPage',
    props: { host: { type: Object, required: true } },
    setup(props) {
      const initial = props.host.extension.value.settings
      const setupKey = ref(String(initial.setup_key || ''))
      const hostname = ref(String(initial.hostname ?? 'onekvm'))
      const managementURL = ref(String(initial.management_url || ''))
      const wireguardPort = ref(Number(initial.wireguard_port ?? 51820))
      const status = ref({ online: false, daemonStatus: 'Offline', netbirdIp: '', netbirdIpv6: '', fqdn: '', managementURL: '', managementConnected: false, authURL: '' })
      const statusReady = ref(false)
      const loading = ref(false)
      const awaitingAuthURL = ref(false)
      const busy = ref('')
      const error = ref('')
      const saved = ref('')
      const message = useMessage()
      let timer = null
      let authDeadline = 0

      const snapshot = () => JSON.stringify([setupKey.value, hostname.value, managementURL.value, wireguardPort.value])
      saved.value = snapshot()
      const dirty = computed(() => snapshot() !== saved.value)
      const valid = computed(() => setupKey.value.length <= 4096 && hostname.value.length <= 253 && managementURL.value.length <= 2048 && Number.isInteger(wireguardPort.value) && wireguardPort.value >= 0 && wireguardPort.value <= 65535)
      const daemonState = computed(() => String(status.value.daemonStatus || '').trim().toLowerCase())
      const connected = computed(() => daemonState.value === 'connected' || (status.value.managementConnected === true && Boolean(status.value.netbirdIp)))

      const unregister = props.host.registerSettings({
        dirty,
        valid,
        showHostActions: false,
        collect: () => ({ setup_key: setupKey.value, hostname: hostname.value, management_url: managementURL.value, wireguard_port: wireguardPort.value }),
        reset: (settings) => {
          setupKey.value = String(settings.setup_key || '')
          hostname.value = String(settings.hostname ?? 'onekvm')
          managementURL.value = String(settings.management_url || '')
          wireguardPort.value = Number(settings.wireguard_port ?? 51820)
          saved.value = snapshot()
        },
      })

      async function refresh(showSpinner = false) {
        if (loading.value) return
        loading.value = true
        if (showSpinner) busy.value = 'refresh'
        try {
          status.value = await props.host.invoke('status')
          statusReady.value = true
          error.value = ''
          if (status.value.authURL || connected.value) {
            awaitingAuthURL.value = false
            authDeadline = 0
          } else if (awaitingAuthURL.value && Date.now() >= authDeadline) {
            awaitingAuthURL.value = false
            authDeadline = 0
            error.value = labels.loginTimeout
          }
        } catch (reason) {
          error.value = reason instanceof Error ? reason.message : String(reason)
        } finally {
          loading.value = false
          if (busy.value === 'refresh') busy.value = ''
        }
      }

      async function action(name, success) {
        if (busy.value) return
        busy.value = name
        try {
          await props.host.invoke(name)
          message.success(success)
          await refresh()
        } catch (reason) {
          error.value = reason instanceof Error ? reason.message : String(reason)
        } finally {
          busy.value = ''
        }
      }

      async function connect() {
        if (busy.value || awaitingAuthURL.value) return
        busy.value = 'connect'
        awaitingAuthURL.value = true
        authDeadline = Date.now() + 60000
        try {
          await props.host.invoke('connect')
          message.success(labels.connectStarted)
          await refresh()
        } catch (reason) {
          awaitingAuthURL.value = false
          authDeadline = 0
          error.value = reason instanceof Error ? reason.message : String(reason)
        } finally {
          busy.value = ''
        }
      }

      async function copyURL() {
        if (!status.value.authURL) return
        try {
          await navigator.clipboard.writeText(status.value.authURL)
          message.success(labels.copied)
        } catch (reason) {
          error.value = reason instanceof Error ? reason.message : String(reason)
        }
      }

      async function saveSettings() {
        if (!valid.value || busy.value) return
        busy.value = 'save'
        try {
          if (await props.host.saveSettings()) {
            saved.value = snapshot()
            message.success(labels.saved)
            await refresh()
          }
        } finally {
          busy.value = ''
        }
      }

      onMounted(() => {
        void refresh(true)
        timer = window.setInterval(() => { void refresh(false) }, 3000)
      })
      onBeforeUnmount(() => {
        unregister()
        if (timer !== null) window.clearInterval(timer)
      })

      const valueRow = (label, value) => h('div', { class: 'nb-value' }, [h('small', label), value ? h('code', value) : h('span', { class: 'nb-muted' }, labels.none)])

      return () => h('section', { class: 'nb-page' }, [
        h('div', { class: 'nb-heading' }, [
          h('div', [h('h2', labels.title), h('p', labels.description)]),
          h(NButton, { secondary: true, loading: busy.value === 'refresh', disabled: Boolean(busy.value && busy.value !== 'refresh'), onClick: () => refresh(true) }, { default: () => labels.refresh }),
        ]),
        error.value ? h(NAlert, { type: 'error', showIcon: false }, { default: () => error.value }) : null,
        h(NSpin, { show: (!statusReady.value && !error.value) || awaitingAuthURL.value }, { default: () => h('article', { class: 'nb-status' }, [
          h('div', { class: 'nb-status-title' }, [h('strong', labels.status), h(NTag, { type: statusReady.value ? connected.value ? 'success' : status.value.online ? 'warning' : 'error' : 'default', bordered: false }, { default: () => statusReady.value ? status.value.daemonStatus || labels.offline : labels.checking })]),
          statusReady.value ? h('div', { class: 'nb-values' }, [
            valueRow(labels.ipv4, status.value.netbirdIp),
            valueRow(labels.ipv6, status.value.netbirdIpv6),
            valueRow(labels.fqdn, status.value.fqdn),
            valueRow(labels.management, status.value.managementURL),
          ]) : null,
          statusReady.value && status.value.authURL ? h('div', { class: 'nb-auth' }, [
            h('code', status.value.authURL),
            h('div', { class: 'nb-actions' }, [
              h('a', { href: status.value.authURL, target: '_blank', rel: 'noopener noreferrer' }, [h(NButton, { type: 'primary' }, { default: () => labels.openLogin })]),
              h(NButton, { secondary: true, onClick: copyURL }, { default: () => labels.copyURL }),
            ]),
          ]) : null,
          statusReady.value ? h('div', { class: 'nb-actions' }, [
            !connected.value && !status.value.authURL ? h(NButton, { type: 'primary', loading: busy.value === 'connect' || awaitingAuthURL.value, disabled: awaitingAuthURL.value || Boolean(busy.value && busy.value !== 'connect'), onClick: connect }, { default: () => awaitingAuthURL.value ? labels.starting : labels.browserConnect }) : null,
            connected.value ? h(NButton, { secondary: true, loading: busy.value === 'disconnect', disabled: Boolean(busy.value && busy.value !== 'disconnect'), onClick: () => action('disconnect', labels.disconnected) }, { default: () => labels.disconnect }) : null,
            status.value.online ? h(NButton, { type: 'error', secondary: true, loading: busy.value === 'logout', disabled: Boolean(busy.value && busy.value !== 'logout'), onClick: () => action('logout', labels.loggedOut) }, { default: () => labels.logout }) : null,
          ]) : null,
        ]) }),
        h('article', { class: 'nb-settings' }, [
          h('strong', labels.settings),
          h('label', [h('span', labels.setupKey), h(NInput, { value: setupKey.value, type: 'password', showPasswordOn: 'click', maxlength: 4096, disabled: Boolean(busy.value), 'onUpdate:value': (value) => { setupKey.value = value } }), h('small', labels.keyHint)]),
          h('div', { class: 'nb-grid' }, [
            h('label', [h('span', labels.hostname), h(NInput, { value: hostname.value, maxlength: 253, disabled: Boolean(busy.value), 'onUpdate:value': (value) => { hostname.value = value } })]),
            h('label', [h('span', labels.managementURL), h(NInput, { value: managementURL.value, maxlength: 2048, disabled: Boolean(busy.value), 'onUpdate:value': (value) => { managementURL.value = value } })]),
            h('label', [h('span', labels.port), h(NInputNumber, { value: wireguardPort.value, min: 0, max: 65535, disabled: Boolean(busy.value), 'onUpdate:value': (value) => { wireguardPort.value = value ?? 0 } })]),
          ]),
          h('div', { class: 'nb-save' }, [h(NButton, { type: 'primary', loading: busy.value === 'save', disabled: !dirty.value || !valid.value || Boolean(busy.value && busy.value !== 'save'), onClick: saveSettings }, { default: () => labels.save })]),
        ]),
      ])
    },
  })

  runtime.register('netbird', {
    apiVersion: 1,
    component: Page,
    styles: [`
      .nb-page { display: grid; gap: 14px; }
      .nb-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
      .nb-heading h2 { margin: 0; font-size: 18px; }
      .nb-heading p { margin: 5px 0 0; color: var(--n-text-color-3, #888); }
      .nb-status, .nb-settings { display: grid; gap: 12px; padding: 14px; border: 1px solid var(--n-border-color, #444); border-radius: 8px; }
      .nb-status-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .nb-values { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px 22px; }
      .nb-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 13px; }
      .nb-value, .nb-settings > label, .nb-grid > label { display: grid; gap: 7px; min-width: 0; }
      .nb-value code, .nb-auth > code { overflow-wrap: anywhere; color: var(--n-text-color-1, #e5e7eb); font-family: var(--onekvm-font-mono, ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", monospace); font-size: 13px; font-feature-settings: "tnum" 1, "zero" 1; font-variant-numeric: tabular-nums slashed-zero; font-weight: 500; line-height: 1.5; letter-spacing: .01em; }
      .nb-value small, .nb-settings small, .nb-muted { color: var(--n-text-color-3, #888); }
      .nb-auth { display: grid; gap: 9px; padding: 12px; border-radius: 7px; background: var(--n-color-modal, rgba(127,127,127,.08)); }
      .nb-auth code { overflow-wrap: anywhere; }
      .nb-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
      .nb-actions a { text-decoration: none; }
      .nb-save { display: flex; justify-content: flex-end; }
      @media (max-width: 720px) { .nb-values { grid-template-columns: 1fr; } }
    `],
  })
})()
