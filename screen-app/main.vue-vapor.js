(() => {
  // tmp/pocketjs/framework/src/scheduler-polyfill.ts
  if (typeof globalThis.queueMicrotask !== "function") {
    globalThis.queueMicrotask = (fn) => {
      Promise.resolve().then(fn);
    };
  }
  if (typeof globalThis.setTimeout !== "function") {
    globalThis.setTimeout = (fn) => {
      queueMicrotask(fn);
      return 0;
    };
  }
  if (typeof globalThis.clearTimeout !== "function") {
    globalThis.clearTimeout = () => {};
  }
  if (typeof globalThis.console !== "object") {
    globalThis.console = {
      log() {},
      warn() {},
      error() {}
    };
  }

  // tmp/pocketjs/contracts/spec/spec.ts
  var SCREEN_W = 480;
  var SCREEN_H = 272;
  var NODE_TYPE = {
    view: 0,
    text: 1,
    image: 2,
    surface: 3
  };
  var ROOT_ID = 1;
  var STYLE_ID_NONE = -1;
  var PROP = {
    width: 1,
    height: 2,
    minW: 3,
    minH: 4,
    maxW: 5,
    maxH: 6,
    paddingT: 8,
    paddingR: 9,
    paddingB: 10,
    paddingL: 11,
    marginT: 12,
    marginR: 13,
    marginB: 14,
    marginL: 15,
    gap: 16,
    flexDir: 17,
    justify: 18,
    align: 19,
    grow: 20,
    shrink: 21,
    basis: 22,
    flexWrap: 23,
    posType: 24,
    insetT: 25,
    insetR: 26,
    insetB: 27,
    insetL: 28,
    display: 29,
    overflow: 30,
    zIndex: 31,
    hitPass: 32,
    bgColor: 64,
    gradFrom: 65,
    gradTo: 66,
    gradDir: 67,
    radius: 68,
    opacity: 69,
    borderColor: 70,
    borderWidth: 71,
    shadow: 72,
    bevelOuterLight: 77,
    bevelOuterDark: 78,
    bevelInnerLight: 79,
    bevelInnerDark: 80,
    bevelWidth: 81,
    gradVia: 82,
    gradViaPos: 83,
    textColor: 96,
    fontSlot: 97,
    textAlign: 98,
    lineHeight: 99,
    tracking: 100,
    translateX: 128,
    translateY: 129,
    scale: 130,
    rotate: 131,
    scaleX: 132,
    scaleY: 133,
    originX: 134,
    originY: 135,
    rotateX: 136,
    rotateY: 137,
    translateZ: 138,
    perspective: 139,
    arcStart: 140,
    arcSweep: 141,
    arcWidth: 142
  };
  var ANIMATABLE = ["width", "height", "paddingT", "paddingR", "paddingB", "paddingL", "marginT", "marginR", "marginB", "marginL", "gap", "basis", "insetT", "insetR", "insetB", "insetL", "bgColor", "gradFrom", "gradTo", "radius", "opacity", "borderColor", "borderWidth", "textColor", "lineHeight", "tracking", "translateX", "translateY", "scale", "rotate", "scaleX", "scaleY", "rotateX", "rotateY", "translateZ", "arcStart", "arcSweep", "arcWidth"];
  function animBit(prop) {
    return ANIMATABLE.indexOf(prop);
  }
  var VALUE_KIND = {
    f32: 0,
    color: 1,
    int: 2
  };
  var PROP_VALUE_KIND = {
    width: VALUE_KIND.f32,
    height: VALUE_KIND.f32,
    minW: VALUE_KIND.f32,
    minH: VALUE_KIND.f32,
    maxW: VALUE_KIND.f32,
    maxH: VALUE_KIND.f32,
    paddingT: VALUE_KIND.f32,
    paddingR: VALUE_KIND.f32,
    paddingB: VALUE_KIND.f32,
    paddingL: VALUE_KIND.f32,
    marginT: VALUE_KIND.f32,
    marginR: VALUE_KIND.f32,
    marginB: VALUE_KIND.f32,
    marginL: VALUE_KIND.f32,
    gap: VALUE_KIND.f32,
    flexDir: VALUE_KIND.int,
    justify: VALUE_KIND.int,
    align: VALUE_KIND.int,
    grow: VALUE_KIND.f32,
    shrink: VALUE_KIND.f32,
    basis: VALUE_KIND.f32,
    flexWrap: VALUE_KIND.int,
    posType: VALUE_KIND.int,
    insetT: VALUE_KIND.f32,
    insetR: VALUE_KIND.f32,
    insetB: VALUE_KIND.f32,
    insetL: VALUE_KIND.f32,
    display: VALUE_KIND.int,
    overflow: VALUE_KIND.int,
    zIndex: VALUE_KIND.int,
    hitPass: VALUE_KIND.int,
    bgColor: VALUE_KIND.color,
    gradFrom: VALUE_KIND.color,
    gradTo: VALUE_KIND.color,
    gradDir: VALUE_KIND.int,
    radius: VALUE_KIND.f32,
    opacity: VALUE_KIND.f32,
    borderColor: VALUE_KIND.color,
    borderWidth: VALUE_KIND.f32,
    shadow: VALUE_KIND.int,
    bevelOuterLight: VALUE_KIND.color,
    bevelOuterDark: VALUE_KIND.color,
    bevelInnerLight: VALUE_KIND.color,
    bevelInnerDark: VALUE_KIND.color,
    bevelWidth: VALUE_KIND.f32,
    gradVia: VALUE_KIND.color,
    gradViaPos: VALUE_KIND.f32,
    textColor: VALUE_KIND.color,
    fontSlot: VALUE_KIND.int,
    textAlign: VALUE_KIND.int,
    lineHeight: VALUE_KIND.f32,
    tracking: VALUE_KIND.f32,
    translateX: VALUE_KIND.f32,
    translateY: VALUE_KIND.f32,
    scale: VALUE_KIND.f32,
    rotate: VALUE_KIND.f32,
    scaleX: VALUE_KIND.f32,
    scaleY: VALUE_KIND.f32,
    originX: VALUE_KIND.f32,
    originY: VALUE_KIND.f32,
    rotateX: VALUE_KIND.f32,
    rotateY: VALUE_KIND.f32,
    translateZ: VALUE_KIND.f32,
    perspective: VALUE_KIND.f32,
    arcStart: VALUE_KIND.f32,
    arcSweep: VALUE_KIND.f32,
    arcWidth: VALUE_KIND.f32
  };
  var ENUMS = {
    FlexDir: {
      Row: 0,
      Col: 1
    },
    Justify: {
      Start: 0,
      Center: 1,
      End: 2,
      Between: 3,
      Around: 4
    },
    Align: {
      Start: 0,
      Center: 1,
      End: 2,
      Stretch: 3
    },
    PosType: {
      Relative: 0,
      Absolute: 1
    },
    Display: {
      Flex: 0,
      None: 1
    },
    Overflow: {
      Visible: 0,
      Hidden: 1
    },
    TextAlign: {
      Left: 0,
      Center: 1,
      Right: 2
    },
    GradDir: {
      ToTop: 0,
      ToBottom: 1,
      ToLeft: 2,
      ToRight: 3
    },
    Easing: {
      Linear: 0,
      EaseIn: 1,
      EaseOut: 2,
      EaseInOut: 3,
      OutBack: 4,
      Spring: 5,
      SpringBouncy: 6,
      CubicBezier: 7
    }
  };
  var PSM = {
    PSM_5650: 0,
    PSM_4444: 2,
    PSM_8888: 3,
    PSM_T8: 5
  };
  var IMG_FLAG_RLE = 1 << 0;
  var IMG_FLAG_LINEAR = 1 << 1;
  var TILESET_FLAG_RLE = 1 << 0;
  var TILESET_FLAG_LINEAR = 1 << 1;
  var SVC_IMG_MAX_BYTES = 128 * 1024;
  var STREAM_FLAG_ENDED = 1 << 0;
  var WIRE_MAX_PAYLOAD = 256 * 1024;
  var WIRE_SLOT_FLAG_RLE = 1 << 0;
  var WIRE_MARK_FLAG_ENDED = 1 << 0;
  var STYLE_VARIANT_BASE = 1 << 0;
  var STYLE_VARIANT_FOCUS = 1 << 1;
  var STYLE_VARIANT_ACTIVE = 1 << 2;
  var STYLE_HAS_TRANSITION = 1 << 3;
  var STYLE_HAS_ANIMATION = 1 << 4;
  var ANIM_FILL_BACKWARDS = 1 << 0;
  var ANIM_FILL_FORWARDS = 1 << 1;
  function abgr(r, g, b, a = 255) {
    return ((a & 255) << 24 | (b & 255) << 16 | (g & 255) << 8 | r & 255) >>> 0;
  }
  var FONT_FLAG_BOLD = 1 << 0;
  var PAK_MAGIC = 1263551300;
  var PAK_VERSION = 1;
  var PAK_HEADER_SIZE = 32;
  var PAK_ENTRY_SIZE = 24;
  var BTN = {
    SELECT: 1,
    START: 8,
    UP: 16,
    RIGHT: 32,
    DOWN: 64,
    LEFT: 128,
    LTRIGGER: 256,
    RTRIGGER: 512,
    ZL: 1024,
    ZR: 2048,
    TRIANGLE: 4096,
    CIRCLE: 8192,
    CROSS: 16384,
    SQUARE: 32768
  };
  var ANALOG_CENTER = 32896;
  var FIXED_DT = 1 / 60;

  // tmp/pocketjs/framework/src/host.ts
  function hostViewport(ops) {
    return ops.__viewport ?? null;
  }
  var current = null;
  function embeddedBuildHostContract() {
    const target = "";
    const hostAbi = 0;
    return target && hostAbi > 0 ? {
      target,
      hostAbi
    } : null;
  }
  function assertNativeHostContract(ops, expected = embeddedBuildHostContract()) {
    const baked = 60;
    const declared = ops.__tickHz ?? 60;
    if (declared !== baked) {
      throw new Error(ops.__tickHz === undefined ? `PocketJS: this bundle bakes ${baked} Hz virtual time but the host declares no ui.__tickHz, ` + "which means the 60 Hz default — declare the rate before mount and drive the surface at it " + "(pocket_apple set_tick_rate before eval_bundle; PocketSurfaceView.tickRate)" : `PocketJS: tick-rate mismatch (bundle baked at ${baked} Hz, host drives ${declared} Hz) — ` + "a bundle only runs correctly at the rate it was built with (`--hz`), like glyphs at their density");
    }
    if (!expected)
      return;
    if (typeof ops.__host !== "string") {
      throw new Error(`PocketJS: this bundle targets "${expected.target}" but the native host predates platform ` + "contracts — add __host/__hostAbi to its ui namespace (see framework/src/host.ts HostOps)");
    }
    if (ops.__host !== expected.target) {
      throw new Error(`PocketJS: native target mismatch (bundle=${expected.target}, host=${ops.__host})`);
    }
    if (ops.__hostAbi !== expected.hostAbi) {
      throw new Error(`PocketJS: native host ABI mismatch (bundle=${expected.hostAbi}, host=${ops.__hostAbi ?? "missing"})`);
    }
  }
  function detectHost(injected) {
    const native = globalThis.ui;
    const nativeMarked = native !== undefined && (typeof native.__host === "string" || native.__textures !== undefined);
    if (injected) {
      if (native !== undefined && injected === native && nativeMarked) {
        assertNativeHostContract(native);
        return {
          ops: injected,
          kind: "native",
          target: native.__host ?? "unknown",
          strict: false
        };
      }
      return {
        ops: injected,
        kind: "injected",
        target: injected.__host ?? "injected",
        strict: true
      };
    }
    if (native !== undefined && nativeMarked) {
      assertNativeHostContract(native);
      return {
        ops: native,
        kind: "native",
        target: native.__host ?? "unknown",
        strict: false
      };
    }
    if (native) {
      return {
        ops: native,
        kind: "injected",
        target: "injected",
        strict: true
      };
    }
    throw new Error("PocketJS: no host — pass HostOps to render() (web/test) or run under a native runtime (globalThis.ui)");
  }
  function installHost(host) {
    current = host;
  }
  function getHost() {
    if (!current) {
      throw new Error("PocketJS: host not installed — call render() first");
    }
    return current;
  }
  function getOps() {
    return getHost().ops;
  }
  function installFrameHandler(fn) {
    globalThis.frame = fn;
  }
  function installResizeViewportHook(resizeViewport) {
    const globals = globalThis;
    const previous = globals.__pocketResizeViewport;
    const hook = (width, height) => resizeViewport(width, height);
    globals.__pocketResizeViewport = hook;
    return () => {
      if (globals.__pocketResizeViewport !== hook)
        return;
      if (previous)
        globals.__pocketResizeViewport = previous;
      else
        delete globals.__pocketResizeViewport;
    };
  }
  function parseHexColor(s) {
    let hex = s.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6 && hex.length !== 8) {
      throw new Error(`PocketJS: bad color '${s}' (expected #rgb/#rrggbb/#rrggbbaa)`);
    }
    if (!/^[0-9a-fA-F]+$/.test(hex))
      throw new Error(`PocketJS: bad color '${s}'`);
    const n = parseInt(hex, 16);
    if (hex.length === 6) {
      return abgr(n >>> 16 & 255, n >>> 8 & 255, n & 255, 255);
    }
    return abgr(n >>> 24 & 255, n >>> 16 & 255, n >>> 8 & 255, n & 255);
  }
  function encodePropValue(prop, value) {
    const kind = PROP_VALUE_KIND[prop];
    if (typeof value === "string") {
      if (kind === VALUE_KIND.color)
        return parseHexColor(value);
      const n = Number(value);
      if (Number.isNaN(n)) {
        throw new Error(`PocketJS: non-numeric value '${value}' for prop '${prop}'`);
      }
      value = n;
    }
    if (kind === VALUE_KIND.color || kind === VALUE_KIND.int)
      return value >>> 0;
    return value;
  }

  // tmp/pocketjs/framework/src/clock.ts
  var TICKS_PER_SECOND = validTickHz(60);
  function validTickHz(hz) {
    if (!Number.isInteger(hz) || hz < 1 || hz > 240) {
      throw new Error(`PocketJS: __POCKET_TICK_HZ__ must be an integer from 1 through 240, got ${hz}`);
    }
    return hz;
  }
  var VALID_HZ = divisorsOf(TICKS_PER_SECOND);
  function divisorsOf(n) {
    const out = [];
    for (let d = 1;d <= n; d++) {
      if (n % d === 0)
        out.push(d);
    }
    return out;
  }
  var hz = TICKS_PER_SECOND;
  var frame = -1;
  var timerSeq = 0;
  var timers = [];
  function normalizeHz(raw) {
    if (!Number.isFinite(raw) || raw <= 0)
      return TICKS_PER_SECOND;
    let best = VALID_HZ[0];
    for (const v of VALID_HZ) {
      if (Math.abs(v - raw) < Math.abs(best - raw))
        best = v;
    }
    return best;
  }
  function simulationHz() {
    return hz;
  }
  function ticksPerFrame() {
    return TICKS_PER_SECOND / hz;
  }
  function virtualFrame() {
    return frame < 0 ? 0 : frame;
  }
  function resetClock() {
    const raw = globalThis.__simHz;
    hz = typeof raw === "number" ? normalizeHz(raw) : TICKS_PER_SECOND;
    frame = -1;
    timers = [];
    timerSeq = 0;
  }
  function __advanceClock() {
    frame = frame < 0 ? 0 : frame + 1;
    if (timers.length === 0)
      return;
    const due = timers.filter((t) => t.at <= frame).sort((a, b) => a.at - b.at || a.seq - b.seq);
    if (due.length === 0)
      return;
    timers = timers.filter((t) => t.at > frame);
    for (const t of due)
      t.cb();
  }

  // tmp/pocketjs/node_modules/solid-js/dist/solid.js
  var IS_DEV = false;
  var equalFn = (a, b) => a === b;
  var $PROXY = Symbol("solid-proxy");
  var $TRACK = Symbol("solid-track");
  var $DEVCOMP = Symbol("solid-dev-component");
  var signalOptions = {
    equals: equalFn
  };
  var ERROR = null;
  var runEffects = runQueue;
  var STALE = 1;
  var PENDING = 2;
  var Owner = null;
  var Transition = null;
  var Scheduler = null;
  var ExternalSourceConfig = null;
  var Listener = null;
  var Updates = null;
  var Effects = null;
  var ExecCount = 0;
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s = {
      value,
      observers: null,
      observerSlots: null,
      comparator: options.equals || undefined
    };
    const setter = (value) => {
      if (typeof value === "function") {
        if (Transition && Transition.running && Transition.sources.has(s))
          value = value(s.tValue);
        else
          value = value(s.value);
      }
      return writeSignal(s, value);
    };
    return [readSignal.bind(s), setter];
  }
  function untrack(fn) {
    if (!ExternalSourceConfig && Listener === null)
      return fn();
    const listener = Listener;
    Listener = null;
    try {
      if (ExternalSourceConfig)
        return ExternalSourceConfig.untrack(fn);
      return fn();
    } finally {
      Listener = listener;
    }
  }
  var [transPending, setTransPending] = /* @__PURE__ */ createSignal(false);
  function readSignal() {
    const runningTransition = Transition && Transition.running;
    if (this.sources && (runningTransition ? this.tState : this.state)) {
      if ((runningTransition ? this.tState : this.state) === STALE)
        updateComputation(this);
      else {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(this), false);
        Updates = updates;
      }
    }
    if (Listener) {
      const observers = this.observers;
      if (!observers || observers[observers.length - 1] !== Listener) {
        const sSlot = observers ? observers.length : 0;
        if (!Listener.sources) {
          Listener.sources = [this];
          Listener.sourceSlots = [sSlot];
        } else {
          Listener.sources.push(this);
          Listener.sourceSlots.push(sSlot);
        }
        if (!observers) {
          this.observers = [Listener];
          this.observerSlots = [Listener.sources.length - 1];
        } else {
          observers.push(Listener);
          this.observerSlots.push(Listener.sources.length - 1);
        }
      }
    }
    if (runningTransition && Transition.sources.has(this))
      return this.tValue;
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    let current = Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value;
    if (!node.comparator || !node.comparator(current, value)) {
      if (Transition) {
        const TransitionRunning = Transition.running;
        if (TransitionRunning || !isComp && Transition.sources.has(node)) {
          Transition.sources.add(node);
          node.tValue = value;
        }
        if (!TransitionRunning)
          node.value = value;
      } else
        node.value = value;
      if (node.observers && node.observers.length) {
        runUpdates(() => {
          for (let i = 0;i < node.observers.length; i += 1) {
            const o = node.observers[i];
            const TransitionRunning = Transition && Transition.running;
            if (TransitionRunning && Transition.disposed.has(o))
              continue;
            if (TransitionRunning ? !o.tState : !o.state) {
              if (o.pure)
                Updates.push(o);
              else
                Effects.push(o);
              if (o.observers)
                markDownstream(o);
            }
            if (!TransitionRunning)
              o.state = STALE;
            else
              o.tState = STALE;
          }
          if (Updates.length > 1e6) {
            Updates = [];
            if (IS_DEV)
              ;
            throw new Error;
          }
        }, false);
      }
    }
    return value;
  }
  function updateComputation(node) {
    if (!node.fn)
      return;
    cleanNode(node);
    const time = ExecCount;
    runComputation(node, Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value, time);
    if (Transition && !Transition.running && Transition.sources.has(node)) {
      queueMicrotask(() => {
        runUpdates(() => {
          Transition && (Transition.running = true);
          Listener = Owner = node;
          runComputation(node, node.tValue, time);
          Listener = Owner = null;
        }, false);
      });
    }
  }
  function runComputation(node, value, time) {
    let nextValue;
    const owner = Owner, listener = Listener;
    Listener = Owner = node;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      if (node.pure) {
        if (Transition && Transition.running) {
          node.tState = STALE;
          node.tOwned && node.tOwned.forEach(cleanNode);
          node.tOwned = undefined;
        } else {
          node.state = STALE;
          node.owned && node.owned.forEach(cleanNode);
          node.owned = null;
        }
      }
      node.updatedAt = time + 1;
      return handleError(err);
    } finally {
      Listener = listener;
      Owner = owner;
    }
    if (!node.updatedAt || node.updatedAt <= time) {
      if (node.updatedAt != null && "observers" in node) {
        writeSignal(node, nextValue, true);
      } else if (Transition && Transition.running && node.pure) {
        if (!Transition.sources.has(node))
          node.value = nextValue;
        Transition.sources.add(node);
        node.tValue = nextValue;
      } else
        node.value = nextValue;
      node.updatedAt = time;
    }
  }
  function runTop(node) {
    const runningTransition = Transition && Transition.running;
    if ((runningTransition ? node.tState : node.state) === 0)
      return;
    if ((runningTransition ? node.tState : node.state) === PENDING)
      return lookUpstream(node);
    if (node.suspense && untrack(node.suspense.inFallback))
      return node.suspense.effects.push(node);
    const ancestors = [node];
    while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
      if (runningTransition && Transition.disposed.has(node))
        return;
      if (runningTransition ? node.tState : node.state)
        ancestors.push(node);
    }
    for (let i = ancestors.length - 1;i >= 0; i--) {
      node = ancestors[i];
      if (runningTransition) {
        let top = node, prev = ancestors[i + 1];
        while ((top = top.owner) && top !== prev) {
          if (Transition.disposed.has(top))
            return;
        }
      }
      if ((runningTransition ? node.tState : node.state) === STALE) {
        updateComputation(node);
      } else if ((runningTransition ? node.tState : node.state) === PENDING) {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(node, ancestors[0]), false);
        Updates = updates;
      }
    }
  }
  function runUpdates(fn, init) {
    if (Updates)
      return fn();
    let wait = false;
    if (!init)
      Updates = [];
    if (Effects)
      wait = true;
    else
      Effects = [];
    ExecCount++;
    try {
      const res = fn();
      completeUpdates(wait);
      return res;
    } catch (err) {
      if (!wait)
        Effects = null;
      Updates = null;
      handleError(err);
    }
  }
  function completeUpdates(wait) {
    if (Updates) {
      if (Scheduler && Transition && Transition.running)
        scheduleQueue(Updates);
      else
        runQueue(Updates);
      Updates = null;
    }
    if (wait)
      return;
    let res;
    if (Transition) {
      if (!Transition.promises.size && !Transition.queue.size) {
        const sources = Transition.sources;
        const disposed = Transition.disposed;
        Effects.push.apply(Effects, Transition.effects);
        res = Transition.resolve;
        for (const e of Effects) {
          "tState" in e && (e.state = e.tState);
          delete e.tState;
        }
        Transition = null;
        runUpdates(() => {
          for (const d of disposed)
            cleanNode(d);
          for (const v of sources) {
            v.value = v.tValue;
            if (v.owned) {
              for (let i = 0, len = v.owned.length;i < len; i++)
                cleanNode(v.owned[i]);
            }
            if (v.tOwned)
              v.owned = v.tOwned;
            delete v.tValue;
            delete v.tOwned;
            v.tState = 0;
          }
          setTransPending(false);
        }, false);
      } else if (Transition.running) {
        Transition.running = false;
        Transition.effects.push.apply(Transition.effects, Effects);
        Effects = null;
        setTransPending(true);
        return;
      }
    }
    const e = Effects;
    Effects = null;
    if (e.length)
      runUpdates(() => runEffects(e), false);
    if (res)
      res();
  }
  function runQueue(queue) {
    for (let i = 0;i < queue.length; i++)
      runTop(queue[i]);
  }
  function scheduleQueue(queue) {
    for (let i = 0;i < queue.length; i++) {
      const item = queue[i];
      const tasks = Transition.queue;
      if (!tasks.has(item)) {
        tasks.add(item);
        Scheduler(() => {
          tasks.delete(item);
          runUpdates(() => {
            Transition.running = true;
            runTop(item);
          }, false);
          Transition && (Transition.running = false);
        });
      }
    }
  }
  function lookUpstream(node, ignore) {
    const runningTransition = Transition && Transition.running;
    if (runningTransition)
      node.tState = 0;
    else
      node.state = 0;
    for (let i = 0;i < node.sources.length; i += 1) {
      const source = node.sources[i];
      if (source.sources) {
        const state = runningTransition ? source.tState : source.state;
        if (state === STALE) {
          if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount))
            runTop(source);
        } else if (state === PENDING)
          lookUpstream(source, ignore);
      }
    }
  }
  function markDownstream(node) {
    const runningTransition = Transition && Transition.running;
    for (let i = 0;i < node.observers.length; i += 1) {
      const o = node.observers[i];
      if (runningTransition ? !o.tState : !o.state) {
        if (runningTransition)
          o.tState = PENDING;
        else
          o.state = PENDING;
        if (o.pure)
          Updates.push(o);
        else
          Effects.push(o);
        o.observers && markDownstream(o);
      }
    }
  }
  function cleanNode(node) {
    let i;
    if (node.sources) {
      while (node.sources.length) {
        const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
        if (obs && obs.length) {
          const n = obs.pop(), s = source.observerSlots.pop();
          if (index < obs.length) {
            n.sourceSlots[s] = index;
            obs[index] = n;
            source.observerSlots[index] = s;
          }
        }
      }
    }
    if (node.tOwned) {
      for (i = node.tOwned.length - 1;i >= 0; i--)
        cleanNode(node.tOwned[i]);
      delete node.tOwned;
    }
    if (Transition && Transition.running && node.pure) {
      reset(node, true);
    } else if (node.owned) {
      for (i = node.owned.length - 1;i >= 0; i--)
        cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i = node.cleanups.length - 1;i >= 0; i--)
        node.cleanups[i]();
      node.cleanups = null;
    }
    if (Transition && Transition.running)
      node.tState = 0;
    else
      node.state = 0;
  }
  function reset(node, top) {
    if (!top) {
      node.tState = 0;
      Transition.disposed.add(node);
    }
    if (node.owned) {
      for (let i = 0;i < node.owned.length; i++)
        reset(node.owned[i]);
    }
  }
  function castError(err) {
    if (err instanceof Error)
      return err;
    return new Error(typeof err === "string" ? err : "Unknown error", {
      cause: err
    });
  }
  function runErrors(err, fns, owner) {
    try {
      for (const f of fns)
        f(err);
    } catch (e) {
      handleError(e, owner && owner.owner || null);
    }
  }
  function handleError(err, owner = Owner) {
    const fns = ERROR && owner && owner.context && owner.context[ERROR];
    const error = castError(err);
    if (!fns)
      throw error;
    if (Effects)
      Effects.push({
        fn() {
          runErrors(error, fns, owner);
        },
        state: STALE
      });
    else
      runErrors(error, fns, owner);
  }
  var FALLBACK = Symbol("fallback");

  // tmp/pocketjs/framework/src/analog.ts
  var ANALOG_DEADZONE = 0.12;
  var analogPacked = ANALOG_CENTER;
  var rightPacked = ANALOG_CENTER;
  function __setAnalog(packed, right = undefined) {
    analogPacked = packed === undefined ? ANALOG_CENTER : packed & 65535;
    rightPacked = right === undefined ? ANALOG_CENTER : right & 65535;
  }
  function __resetAnalog() {
    analogPacked = rightPacked = ANALOG_CENTER;
  }
  function axis(raw) {
    const value = Math.max(-1, Math.min(1, (raw - 128) / 127));
    const magnitude = Math.abs(value);
    if (magnitude < ANALOG_DEADZONE)
      return 0;
    return Math.sign(value) * (magnitude - ANALOG_DEADZONE) / (1 - ANALOG_DEADZONE);
  }
  function analogX() {
    return axis(analogPacked >> 8 & 255);
  }
  function analogY() {
    return axis(analogPacked & 255);
  }

  // tmp/pocketjs/framework/src/frame.ts
  var callbacks = new Set;

  // tmp/pocketjs/framework/src/pak.ts
  var map = null;
  var bytes = null;
  function readKey(u8, off, len) {
    let s = "";
    for (let i = 0;i < len; i++)
      s += String.fromCharCode(u8[off + i]);
    return s;
  }
  function parse(ab) {
    const dv = new DataView(ab);
    if (ab.byteLength < PAK_HEADER_SIZE || dv.getUint32(0, true) !== PAK_MAGIC) {
      throw new Error("pak: bad magic");
    }
    const version = dv.getUint16(4, true);
    if (version !== PAK_VERSION) {
      throw new Error("pak: unsupported version " + version);
    }
    const entryCount = dv.getUint32(8, true);
    const dirOff = dv.getUint32(12, true);
    const namesOff = dv.getUint32(16, true);
    const u8 = new Uint8Array(ab);
    const m = new Map;
    for (let i = 0;i < entryCount; i++) {
      const e = dirOff + i * PAK_ENTRY_SIZE;
      const blobOff = dv.getUint32(e + 4, true);
      const byteLen = dv.getUint32(e + 8, true);
      const nameOff = dv.getUint32(e + 12, true);
      const nameLen = dv.getUint16(e + 16, true);
      const dtype = u8[e + 18];
      m.set(readKey(u8, namesOff + nameOff, nameLen), {
        off: blobOff,
        len: byteLen,
        dtype
      });
    }
    map = m;
    bytes = u8;
  }
  function loadPack(ab) {
    parse(ab);
  }
  function ensureLoaded() {
    if (map)
      return;
    const ab = globalThis.__pak;
    if (!ab)
      return;
    parse(ab);
  }
  function hasPack() {
    ensureLoaded();
    return map !== null;
  }
  function entries(prefix = "") {
    ensureLoaded();
    if (!map)
      return [];
    const out = [];
    for (const key of map.keys()) {
      if (key.length >= prefix.length && key.slice(0, prefix.length) === prefix) {
        out.push(key);
      }
    }
    out.sort();
    return out;
  }
  function get(key, start = 0, end) {
    ensureLoaded();
    const e = map ? map.get(key) : undefined;
    if (!e) {
      throw new Error("pak: missing key " + key + " (no __pak provided, or the pack is incomplete)");
    }
    const stop = end ?? e.len;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(stop) || start < 0 || stop < start || stop > e.len)
      throw new RangeError("pak: invalid byte range");
    return bytes.slice(e.off + start, e.off + stop);
  }

  // tmp/pocketjs/framework/src/input.ts
  var root = null;
  var focused = null;
  var pressedNode = null;
  var prevButtons = 0;
  var focusScopeStack = [];
  var focusGridStack = [];
  var focusControllerStack = [];
  function setInputRoot(r) {
    root = r;
    focused = null;
    pressedNode = null;
    prevButtons = 0;
    focusScopeStack.length = 0;
    focusGridStack.length = 0;
    focusControllerStack.length = 0;
    if (cursor) {
      cursor.pressTarget = null;
      cursor.target = null;
      cursor.spriteDirty = true;
      cursor.fresh = true;
      cursor.vw = 0;
      if (cursor.tex >= 0) {
        const ops = getOps();
        ops.setCursor?.(-1, 0, 0, 0, 0);
        ops.freeTexture?.(cursor.tex);
        cursor.tex = -1;
      }
    }
  }
  function registerPress(node, fn) {
    node.onPress = fn ?? undefined;
  }
  function registerFocusable(node, on) {
    node.focusable = on;
    __notifyTreeMutation();
    if (!on && focused === node) {
      focusNode(null);
    }
  }
  function focusNode(node) {
    if (pressedNode && pressedNode !== node)
      setPressedNode(null);
    focused = node;
    getOps().setFocus(node ? node.id : 0);
  }
  function setPressedNode(node) {
    if (pressedNode === node)
      return;
    const ops = getOps();
    if (pressedNode)
      ops.setActive?.(pressedNode.id, 0);
    pressedNode = node;
    if (node)
      ops.setActive?.(node.id, 1);
  }
  function activeFocusRoot() {
    return focusScopeStack.length > 0 ? focusScopeStack[focusScopeStack.length - 1] : root;
  }
  function collectFocusables(node, out) {
    if (!node)
      return;
    if (node.focusable)
      out.push(node);
    if (!Array.isArray(node.children))
      return;
    for (let i = 0;i < node.children.length; i++) {
      collectFocusables(node.children[i], out);
    }
  }
  function focusables() {
    const out = [];
    const r = activeFocusRoot();
    if (r)
      collectFocusables(r, out);
    return out;
  }
  function linearDirection(direction) {
    return direction === "down" || direction === "right" ? 1 : -1;
  }
  function moveLinearFocus(direction) {
    const dir = linearDirection(direction);
    const list = focusables();
    if (list.length === 0) {
      if (focused)
        focusNode(null);
      return;
    }
    const i = focused ? list.indexOf(focused) : -1;
    if (i < 0) {
      focusNode(dir === 1 ? list[0] : list[list.length - 1]);
      return;
    }
    const j = i + dir;
    if (j < 0 || j >= list.length)
      return;
    focusNode(list[j]);
  }
  function activeGrid() {
    if (!focused)
      return null;
    const active = activeFocusRoot();
    if (active && !isWithin(focused, active))
      return null;
    for (let i = focusGridStack.length - 1;i >= 0; i--) {
      const grid = focusGridStack[i];
      if (active && !isWithin(grid.node, active) && !isWithin(active, grid.node))
        continue;
      if (isWithin(focused, grid.node))
        return grid;
    }
    return null;
  }
  function moveGridFocus(direction) {
    const grid = activeGrid();
    if (!grid)
      return false;
    const list = [];
    collectFocusables(grid.node, list);
    if (list.length === 0) {
      if (focused)
        focusNode(null);
      return true;
    }
    const columns = grid.columns;
    const i = focused ? list.indexOf(focused) : -1;
    if (i < 0) {
      focusNode(linearDirection(direction) === 1 ? list[0] : list[list.length - 1]);
      return true;
    }
    let j = i;
    switch (direction) {
      case "right":
        if (i + 1 < list.length && i % columns < columns - 1)
          j = i + 1;
        else if (grid.wrap)
          j = Math.floor(i / columns) * columns;
        break;
      case "left":
        if (i % columns > 0)
          j = i - 1;
        else if (grid.wrap)
          j = Math.min(list.length - 1, Math.floor(i / columns) * columns + columns - 1);
        break;
      case "down":
        if (i + columns < list.length)
          j = i + columns;
        else if (grid.wrap)
          j = i % columns;
        break;
      case "up":
        if (i - columns >= 0)
          j = i - columns;
        else if (grid.wrap) {
          const col = i % columns;
          j = col;
          while (j + columns < list.length)
            j += columns;
        }
        break;
    }
    if (j !== i)
      focusNode(list[j]);
    return true;
  }
  function activeController() {
    if (!focused)
      return null;
    const active = activeFocusRoot();
    if (active && !isWithin(focused, active))
      return null;
    for (let i = focusControllerStack.length - 1;i >= 0; i--) {
      const ctl = focusControllerStack[i];
      if (active && !isWithin(ctl.node, active) && !isWithin(active, ctl.node))
        continue;
      if (isWithin(focused, ctl.node))
        return ctl;
    }
    return null;
  }
  function moveFocus(direction) {
    const ctl = activeController();
    if (ctl && ctl.move(direction))
      return;
    if (moveGridFocus(direction))
      return;
    moveLinearFocus(direction);
  }
  function firePress() {
    firePressFrom(focused);
  }
  function firePressFrom(start) {
    let n = start;
    while (n) {
      if (n.onPress) {
        n.onPress();
        return;
      }
      n = n.parent;
    }
  }
  function setActiveNode(node) {
    setPressedNode(node);
  }
  function pressNode(node) {
    focusNode(node);
    firePressFrom(node);
  }
  function isWithin(node, ancestor) {
    if (!node || !ancestor)
      return false;
    let n = node;
    while (n) {
      if (n === ancestor)
        return true;
      n = n.parent;
    }
    return false;
  }
  function firstFocusable(node) {
    if (!node)
      return null;
    if (node.focusable)
      return node;
    if (!Array.isArray(node.children))
      return null;
    for (let i = 0;i < node.children.length; i++) {
      const f = firstFocusable(node.children[i]);
      if (f)
        return f;
    }
    return null;
  }
  function pushFocusScope(node, opts = {}) {
    const previous = focused;
    focusScopeStack.push(node);
    __notifyTreeMutation();
    if (opts.autoFocus !== false && (!focused || !isWithin(focused, node))) {
      focusNode(firstFocusable(node));
    }
    let disposed = false;
    return () => {
      if (disposed)
        return;
      disposed = true;
      const i = focusScopeStack.lastIndexOf(node);
      if (i >= 0)
        focusScopeStack.splice(i, 1);
      __notifyTreeMutation();
      const active = activeFocusRoot();
      if (opts.restoreFocus !== false && previous && (!active || isWithin(previous, active))) {
        focusNode(previous);
        return;
      }
      if (active && (!focused || !isWithin(focused, active))) {
        focusNode(firstFocusable(active));
      } else if (!active && focused) {
        focusNode(null);
      }
    };
  }
  function pushFocusGrid(node, opts) {
    const registration = {
      node,
      columns: Math.max(1, Math.floor(opts.columns)),
      wrap: opts.wrap ?? false
    };
    focusGridStack.push(registration);
    let disposed = false;
    return () => {
      if (disposed)
        return;
      disposed = true;
      const i = focusGridStack.lastIndexOf(registration);
      if (i >= 0)
        focusGridStack.splice(i, 1);
    };
  }
  function notifyDetached(node) {
    if (!focused || !isWithin(focused, node))
      return;
    const parent = node.parent;
    if (parent) {
      const idx = parent.children.indexOf(node);
      for (let i = idx + 1;i < parent.children.length; i++) {
        const f = firstFocusable(parent.children[i]);
        if (f) {
          focusNode(f);
          return;
        }
      }
      for (let i = idx - 1;i >= 0; i--) {
        const f = firstFocusable(parent.children[i]);
        if (f) {
          focusNode(f);
          return;
        }
      }
      let a = parent;
      while (a) {
        if (a.focusable) {
          focusNode(a);
          return;
        }
        a = a.parent;
      }
    }
    focusNode(null);
  }
  var cursor = null;
  var inputGen = 0;
  function __notifyTreeMutation() {
    inputGen++;
  }
  var ARROW_OUTLINE = [1, 3, 5, 9, 17, 33, 65, 129, 257, 513, 1985, 73, 149, 147, 288, 480];
  var ARROW_FILL = [0, 0, 2, 6, 14, 30, 62, 126, 254, 510, 62, 54, 98, 96, 192, 0];
  function defaultArrowRGBA() {
    const px = new Uint8Array(16 * 16 * 4);
    for (let y = 0;y < 16; y++) {
      for (let x = 0;x < 16; x++) {
        const outline = ARROW_OUTLINE[y] >> x & 1;
        const fill = ARROW_FILL[y] >> x & 1;
        if (!outline && !fill)
          continue;
        const i = (y * 16 + x) * 4;
        const v = fill ? 255 : 0;
        px[i] = v;
        px[i + 1] = v;
        px[i + 2] = v;
        px[i + 3] = 255;
      }
    }
    return px;
  }
  function cursorInitSprite(c, ops) {
    const sprite = c.sprite;
    c.spriteDirty = false;
    const old = c.tex;
    let tex = -1;
    let blob = null;
    if (typeof sprite.image === "string") {
      try {
        blob = get(sprite.image);
      } catch (err) {
        if (getHost().strict)
          throw err;
        blob = null;
      }
    } else if (sprite.image) {
      blob = sprite.image;
    }
    if (blob) {
      tex = ops.uploadImgEntry ? ops.uploadImgEntry(blob) : uploadImgFallback(ops, blob);
      if (tex < 0 && getHost().strict) {
        throw new Error("enableCursor: cursor image rejected (malformed or RLE-only IMG entry)");
      }
    }
    if (tex < 0) {
      tex = ops.uploadTexture(defaultArrowRGBA(), 16, 16, PSM.PSM_8888);
    }
    c.tex = tex;
    ops.setCursor(tex, sprite.hotspot[0], sprite.hotspot[1], sprite.size[0], sprite.size[1]);
    if (old >= 0 && old !== tex)
      ops.freeTexture?.(old);
  }
  function uploadImgFallback(ops, blob) {
    if (blob.length < 8)
      return -1;
    const dv = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
    if (blob[5] & IMG_FLAG_RLE)
      return -1;
    return ops.uploadTexture(blob.subarray(8), dv.getUint16(0, true), dv.getUint16(2, true), blob[4]);
  }
  function findMirror(node, id) {
    if (!node || id === 0)
      return null;
    if (node.id === id)
      return node;
    const kids = node.children;
    if (!Array.isArray(kids))
      return null;
    for (let i = 0;i < kids.length; i++) {
      const found = findMirror(kids[i], id);
      if (found)
        return found;
    }
    return null;
  }
  var hitRoot = null;
  var auxiliaryHitRoot = null;
  function setHitRoot(r) {
    hitRoot = r;
  }
  function setAuxiliaryHitRoot(r) {
    auxiliaryHitRoot = r;
  }
  function cursorTarget(hit) {
    const scope = focusScopeStack.length > 0 ? focusScopeStack[focusScopeStack.length - 1] : null;
    let n = hit;
    while (n) {
      if (n.focusable && (!scope || isWithin(n, scope)))
        return n;
      n = n.parent;
    }
    return null;
  }
  function touchFocusable(x, y, fact, surface = "primary") {
    return cursorTarget(resolveTouchHit(x, y, fact, surface));
  }
  function resolveTouchHit(x, y, fact, surface = "primary") {
    const searchRoot = surface === "auxiliary" ? auxiliaryHitRoot : hitRoot ?? root;
    if (!searchRoot)
      return null;
    if (fact !== undefined) {
      return fact === 0 ? null : findMirror(searchRoot, fact);
    }
    const ops = getOps();
    const query = surface === "auxiliary" ? ops.hitTestBoundsAuxiliary ?? ops.hitTestAuxiliary : ops.hitTestBounds ?? ops.hitTest;
    if (!query)
      return null;
    return findMirror(searchRoot, query(x, y));
  }
  function cursorFrame(buttons, pressed, released) {
    const c = cursor;
    const ops = getOps();
    if (!ops.hitTest || !ops.setCursor || !ops.setCursorPos)
      return false;
    if (c.vw === 0) {
      const vp = hostViewport(ops);
      c.vw = vp ? vp.w : SCREEN_W;
      c.vh = vp ? vp.h : SCREEN_H;
      if (c.x < 0) {
        c.x = Math.floor(c.vw / 2);
        c.y = Math.floor(c.vh / 2);
      }
    }
    if (c.spriteDirty)
      cursorInitSprite(c, ops);
    let vx = analogX() * c.speed;
    let vy = analogY() * c.speed;
    if (c.dpadSpeed > 0 && vx === 0 && vy === 0) {
      if (buttons & BTN.LEFT)
        vx = -c.dpadSpeed;
      if (buttons & BTN.RIGHT)
        vx = c.dpadSpeed;
      if (buttons & BTN.UP)
        vy = -c.dpadSpeed;
      if (buttons & BTN.DOWN)
        vy = c.dpadSpeed;
    }
    let moved = c.fresh;
    if (vx !== 0 || vy !== 0) {
      const dt = ticksPerFrame() / TICKS_PER_SECOND;
      const nx = Math.min(Math.max(c.x + vx * dt, 0), c.vw - 1);
      const ny = Math.min(Math.max(c.y + vy * dt, 0), c.vh - 1);
      if (nx !== c.x || ny !== c.y) {
        c.x = nx;
        c.y = ny;
        moved = true;
      }
    }
    if (moved)
      ops.setCursorPos(c.x, c.y);
    const edges = (pressed | released) & c.button;
    const gen = inputGen;
    if (moved || edges !== 0 || gen !== c.gen) {
      c.gen = gen;
      c.fresh = false;
      c.target = cursorTarget(findMirror(hitRoot ?? root, ops.hitTest(c.x, c.y)));
    }
    const target = c.target;
    if (target !== focused)
      focusNode(target);
    if (pressed & c.button && target) {
      c.pressTarget = target;
    }
    if (c.pressTarget) {
      setPressedNode(target === c.pressTarget ? c.pressTarget : null);
      if (released & c.button) {
        const fire = target === c.pressTarget;
        c.pressTarget = null;
        setPressedNode(null);
        if (fire)
          firePress();
      }
    } else if (released & c.button) {
      setPressedNode(null);
    }
    return true;
  }
  function handleFrame(buttons) {
    const pressed = buttons & ~prevButtons;
    const released = prevButtons & ~buttons;
    prevButtons = buttons;
    if (cursor && cursorFrame(buttons, pressed, released))
      return;
    if (released & BTN.CIRCLE)
      setPressedNode(null);
    if (pressed === 0)
      return;
    if (pressed & BTN.DOWN)
      moveFocus("down");
    if (pressed & BTN.RIGHT)
      moveFocus("right");
    if (pressed & BTN.UP)
      moveFocus("up");
    if (pressed & BTN.LEFT)
      moveFocus("left");
    if (pressed & BTN.CIRCLE) {
      setPressedNode(focused);
      firePress();
    }
  }

  // tmp/pocketjs/framework/src/native-tree.ts
  var treeMutationHook = null;
  function setTreeMutationHook(fn) {
    treeMutationHook = fn;
  }
  function treeMutated() {
    __notifyTreeMutation();
    if (treeMutationHook)
      treeMutationHook();
  }
  function setDebugName(node, name) {
    node.debugName = name || undefined;
    treeMutated();
  }
  var rootMirror = {
    id: ROOT_ID,
    type: NODE_TYPE.view,
    parent: null,
    children: [],
    domNodeType: 1,
    domTag: "root"
  };
  var nativeRoots = new Set([rootMirror]);
  var DOM_NODE = Symbol.for("pocketjs.native-node");
  var DOM_ELEMENT = 1;
  var DOM_TEXT = 3;
  var DOM_COMMENT = 8;
  var NATIVE_ATTRIBUTE_NAMES = new Set(["class", "className", "style", "src", "onPress", "on:press", "focusable", "debugName", "ref", "nodeRef", "key", "children"]);
  function domAttrs(node) {
    return node.domAttrs ??= {};
  }
  function isNativeNode(value) {
    return !!value && typeof value === "object" && value[DOM_NODE] === true;
  }
  function cloneNativeNode(node, deep) {
    const nodeType = node.domNodeType ?? (isTextNode(node) ? DOM_TEXT : DOM_ELEMENT);
    const clone = nodeType === DOM_TEXT ? createTextNode(node.text ?? "") : nodeType === DOM_COMMENT ? createCommentNode(node.domData ?? "") : createElement(node.domTag ?? tagName(node));
    for (const key of Object.keys(node.domAttrs ?? {})) {
      setDomAttribute(clone, key, node.domAttrs[key]);
    }
    if (deep) {
      for (const child of node.children)
        insertNode(clone, cloneNativeNode(child, true));
    }
    return clone;
  }
  function setDomAttribute(node, name, value) {
    if (NATIVE_ATTRIBUTE_NAMES.has(name)) {
      setProp(node, name, value, node.domAttrs?.[name]);
      return;
    }
    if (value == null)
      delete domAttrs(node)[name];
    else
      domAttrs(node)[name] = value;
  }
  function decorateNativeNode(node) {
    if (node[DOM_NODE] === true)
      return node;
    Object.defineProperty(node, DOM_NODE, {
      value: true
    });
    Object.defineProperties(node, {
      nodeType: {
        configurable: true,
        get() {
          return node.domNodeType ?? (isTextNode(node) ? DOM_TEXT : DOM_ELEMENT);
        }
      },
      nodeValue: {
        configurable: true,
        get() {
          return node.domNodeType === DOM_COMMENT ? node.domData ?? "" : node.text ?? "";
        },
        set(value) {
          if (node.domNodeType === DOM_COMMENT)
            node.domData = String(value ?? "");
          else
            replaceText(node, String(value ?? ""));
        }
      },
      data: {
        configurable: true,
        get() {
          return node.domNodeType === DOM_COMMENT ? node.domData ?? "" : node.text ?? "";
        },
        set(value) {
          if (node.domNodeType === DOM_COMMENT)
            node.domData = String(value ?? "");
          else
            replaceText(node, String(value ?? ""));
        }
      },
      textContent: {
        configurable: true,
        get() {
          if (node.domNodeType === DOM_COMMENT)
            return node.domData ?? "";
          if (isTextNode(node))
            return node.text ?? "";
          return node.children.map((child) => child.text ?? "").join("");
        },
        set(value) {
          const text = String(value ?? "");
          if (node.domNodeType === DOM_COMMENT) {
            node.domData = text;
          } else if (isTextNode(node)) {
            replaceText(node, text);
          } else {
            clearContainer(node);
            if (text)
              insertNode(node, createTextNode(text));
          }
        }
      },
      parentNode: {
        configurable: true,
        get() {
          return node.parent;
        }
      },
      parentElement: {
        configurable: true,
        get() {
          return node.parent;
        }
      },
      childNodes: {
        configurable: true,
        get() {
          return node.children;
        }
      },
      firstChild: {
        configurable: true,
        get() {
          return node.children[0] ?? null;
        }
      },
      lastChild: {
        configurable: true,
        get() {
          return node.children[node.children.length - 1] ?? null;
        }
      },
      nextSibling: {
        configurable: true,
        get() {
          return getNextSibling(node) ?? null;
        }
      },
      previousSibling: {
        configurable: true,
        get() {
          const parent = node.parent;
          if (!parent)
            return null;
          const index = parent.children.indexOf(node);
          return index > 0 ? parent.children[index - 1] : null;
        }
      },
      tagName: {
        configurable: true,
        get() {
          return (node.domTag ?? tagName(node)).toUpperCase();
        }
      },
      nodeName: {
        configurable: true,
        get() {
          if (node.domNodeType === DOM_TEXT)
            return "#text";
          if (node.domNodeType === DOM_COMMENT)
            return "#comment";
          return (node.domTag ?? tagName(node)).toUpperCase();
        }
      },
      className: {
        configurable: true,
        get() {
          return String(node.domAttrs?.class ?? "");
        },
        set(value) {
          setProp(node, "class", value, node.domAttrs?.class);
        }
      },
      isConnected: {
        configurable: true,
        get() {
          let current = node;
          while (current) {
            if (nativeRoots.has(current))
              return true;
            current = current.parent;
          }
          return false;
        }
      }
    });
    const methods = {
      appendChild(child) {
        insertNode(node, child);
        return child;
      },
      insertBefore(child, anchor) {
        insertNode(node, child, anchor ?? null);
        return child;
      },
      removeChild(child) {
        removeNode(node, child);
        return child;
      },
      replaceChild(next, current) {
        insertNode(node, next, current);
        removeNode(node, current);
        return current;
      },
      cloneNode(deep = false) {
        return cloneNativeNode(node, !!deep);
      },
      remove() {
        if (node.parent)
          removeNode(node.parent, node);
      },
      setAttribute(name, value) {
        setDomAttribute(node, name, value);
      },
      removeAttribute(name) {
        setDomAttribute(node, name, undefined);
      },
      getAttribute(name) {
        const value = node.domAttrs?.[name];
        return value == null ? null : String(value);
      },
      hasAttribute(name) {
        return node.domAttrs?.[name] != null;
      },
      hasChildNodes() {
        return node.children.length > 0;
      },
      contains(other) {
        let current = other ?? null;
        while (current) {
          if (current === node)
            return true;
          current = current.parent;
        }
        return false;
      },
      addEventListener() {},
      removeEventListener() {}
    };
    Object.assign(node, methods, {
      style: {
        length: 0,
        item: () => ""
      },
      classList: {
        add() {},
        remove() {}
      }
    });
    return node;
  }
  decorateNativeNode(rootMirror);
  var styleResolver = null;
  function setStyleResolver(fn) {
    styleResolver = fn;
  }
  var missCounters = {
    unknownClass: 0,
    unknownTexture: 0,
    unknownSurface: 0
  };
  var textures = new Map;
  function registerTexture(key, handle) {
    textures.set(key, handle);
  }
  var sprites = new Map;
  function registerSprite(key, meta) {
    sprites.set(key, meta);
  }
  var sweepSet = new Set;
  var retained = new Set;
  function subtreeHasRetained(node) {
    if (!node)
      return false;
    if (retained.has(node))
      return true;
    if (node.children) {
      for (let i = 0;i < node.children.length; i++) {
        if (subtreeHasRetained(node.children[i]))
          return true;
      }
    }
    return false;
  }
  function runSweep() {
    if (sweepSet.size === 0)
      return;
    const ops = getOps();
    const keep = [];
    for (const node of sweepSet) {
      if (!node)
        continue;
      if (node.parent !== null)
        continue;
      if (nativeRoots.has(node))
        continue;
      if (subtreeHasRetained(node)) {
        keep.push(node);
        continue;
      }
      ops.destroyNode(node.id);
    }
    sweepSet.clear();
    for (let i = 0;i < keep.length; i++)
      sweepSet.add(keep[i]);
  }
  function adoptNativeRoot(id, tag = "native-root") {
    if (!Number.isInteger(id) || id <= ROOT_ID) {
      throw new Error(`PocketJS: invalid adopted native root id ${id}`);
    }
    const root = decorateNativeNode({
      id,
      type: NODE_TYPE.view,
      parent: null,
      children: [],
      domNodeType: DOM_ELEMENT,
      domTag: tag
    });
    nativeRoots.add(root);
    return root;
  }
  function releaseNativeRoot(root) {
    if (root === rootMirror)
      return;
    if (root.children.length > 0) {
      throw new Error("PocketJS: cannot release a native root with mounted children");
    }
    nativeRoots.delete(root);
    sweepSet.delete(root);
    retained.delete(root);
  }
  function createElement(tag) {
    const type = NODE_TYPE[tag];
    if (type === undefined) {
      throw new Error(`PocketJS: unknown element <${tag}> - only view/text/image/surface exist`);
    }
    return decorateNativeNode({
      id: getOps().createNode(type),
      type,
      parent: null,
      children: [],
      domNodeType: DOM_ELEMENT,
      domTag: tag
    });
  }
  function createTextNode(value) {
    const ops = getOps();
    const id = ops.createNode(NODE_TYPE.text);
    ops.setText(id, value);
    return decorateNativeNode({
      id,
      type: NODE_TYPE.text,
      parent: null,
      children: [],
      text: value,
      domNodeType: DOM_TEXT,
      domTag: "#text"
    });
  }
  function createCommentNode(data = "") {
    const node = createTextNode("");
    node.domNodeType = DOM_COMMENT;
    node.domTag = "#comment";
    node.domData = data;
    return node;
  }
  function replaceText(node, value) {
    getOps().replaceText(node.id, value);
    node.text = value;
    treeMutated();
  }
  function isTextNode(node) {
    return node.type === NODE_TYPE.text;
  }
  function unlink(node) {
    const p = node.parent;
    if (!p)
      return;
    const i = p.children.indexOf(node);
    if (i >= 0)
      p.children.splice(i, 1);
    node.parent = null;
  }
  function insertNode(parent, node, anchor) {
    const ops = getOps();
    if (anchor && (anchor.parent !== parent || !parent.children.includes(anchor))) {
      throw new Error("PocketJS: insert anchor is not a child of parent");
    }
    if (anchor === node) {
      sweepSet.delete(node);
      return;
    }
    unlink(node);
    sweepSet.delete(node);
    ops.insertBefore(parent.id, node.id, anchor ? anchor.id : 0);
    if (anchor) {
      const i = parent.children.indexOf(anchor);
      parent.children.splice(i, 0, node);
    } else {
      parent.children.push(node);
    }
    node.parent = parent;
    treeMutated();
  }
  function removeNode(parent, node) {
    if (!node)
      return;
    notifyDetached(node);
    getOps().removeChild(parent.id, node.id);
    unlink(node);
    sweepSet.add(node);
    treeMutated();
  }
  function detachNode(parent, node) {
    removeNode(parent, node);
  }
  function getNextSibling(node) {
    const p = node.parent;
    if (!p)
      return;
    const i = p.children.indexOf(node);
    return i >= 0 ? p.children[i + 1] : undefined;
  }
  function setClass(node, value) {
    const ops = getOps();
    treeMutated();
    if (value == null || value === "") {
      ops.setStyle(node.id, STYLE_ID_NONE);
      return;
    }
    if (typeof value !== "string") {
      throw new Error("PocketJS: class must be a string literal of utilities");
    }
    const styleId = styleResolver ? styleResolver(value) : undefined;
    if (styleId === undefined) {
      if (getHost().strict) {
        throw new Error(`PocketJS: unknown class "${value}" - not in the compiled style table ` + "(dynamic classes must be ternaries of full literals)");
      }
      missCounters.unknownClass++;
      return;
    }
    ops.setStyle(node.id, styleId);
  }
  function setSrc(node, value) {
    const ops = getOps();
    if (value == null || value === "") {
      ops.setImage(node.id, -1);
      return;
    }
    if (typeof value !== "string") {
      throw new Error("PocketJS: src must be a string key");
    }
    const handle = textures.get(value);
    if (handle === undefined) {
      if (getHost().strict) {
        throw new Error(`PocketJS: unknown image src "${value}" - no texture registered under that key`);
      }
      missCounters.unknownTexture++;
      return;
    }
    ops.setImage(node.id, handle);
  }
  function setSpriteSrc(node, value) {
    const ops = getOps();
    if (value == null || value === "") {
      ops.setSprite(node.id, -1, 0, 0, 0);
      return;
    }
    if (typeof value !== "string") {
      throw new Error("PocketJS: sprite must be a string key");
    }
    const meta = sprites.get(value);
    if (meta === undefined) {
      if (getHost().strict) {
        throw new Error(`PocketJS: unknown sprite "${value}" - no sprite atlas registered under that key`);
      }
      missCounters.unknownTexture++;
      return;
    }
    ops.setSprite(node.id, meta.handle, meta.frames, meta.cols, meta.step);
  }
  function setCompositorBinding(node) {
    const ops = getOps();
    const bind = ops.setCompositorSurface;
    if (!bind) {
      return;
    }
    if (!ops.__surfaces) {
      return;
    }
    const packageId = node.domAttrs?.package;
    const focused = node.domAttrs?.focused === true ? 1 : 0;
    if (packageId == null || packageId === "") {
      bind(node.id, -1, focused);
      return;
    }
    if (typeof packageId !== "string") {
      throw new Error("PocketJS: compositor surface package must be a string id");
    }
    const handle = ops.__surfaces[packageId];
    if (handle === undefined) {
      if (getHost().strict) {
        throw new Error(`PocketJS: package ${JSON.stringify(packageId)} is not installed in this Pocket System`);
      }
      missCounters.unknownSurface++;
      bind(node.id, -1, focused);
      return;
    }
    bind(node.id, handle, focused);
  }
  function setStyleObject(node, value, prev) {
    const ops = getOps();
    const next = value ?? {};
    const before = prev ?? {};
    let changed = false;
    for (const key in next) {
      const v = next[key];
      if (before[key] === v)
        continue;
      const propId = PROP[key];
      if (propId === undefined) {
        throw new Error(`PocketJS: unknown style prop '${key}' (see spec PROP)`);
      }
      ops.setProp(node.id, propId, encodePropValue(key, v));
      changed = true;
    }
    if (changed)
      treeMutated();
  }
  function setProp(node, name, value, prev) {
    if (value === prev && name !== "style")
      return value;
    if (name === "className")
      name = "class";
    if (name !== "children" && name !== "key" && name !== "ref" && name !== "nodeRef") {
      if (value == null)
        delete domAttrs(node)[name];
      else
        domAttrs(node)[name] = value;
    }
    switch (name) {
      case "class":
        setClass(node, value);
        return value;
      case "onPress":
      case "on:press":
        registerPress(node, value);
        return value;
      case "src":
        setSrc(node, value);
        return value;
      case "sprite":
        setSpriteSrc(node, value);
        return value;
      case "package":
      case "focused":
        setCompositorBinding(node);
        return value;
      case "style":
        setStyleObject(node, value, prev);
        return value;
      case "focusable":
        registerFocusable(node, !!value);
        return value;
      case "debugName":
        setDebugName(node, value == null ? undefined : String(value));
        return value;
      case "ref":
      case "nodeRef":
      case "key":
      case "children":
        return value;
      default:
        break;
    }
    if (name === "classList") {
      throw new Error("PocketJS: classList is not supported - use ternaries of full class literals");
    }
    if (name.startsWith("on:") || name.startsWith("bool:") || name.startsWith("prop:")) {
      throw new Error(`PocketJS: unsupported namespaced attribute '${name}'`);
    }
    throw new Error(`PocketJS: unknown property '${name}' on <${tagName(node)}>`);
  }
  function clearContainer(container) {
    for (const child of [...container.children])
      removeNode(container, child);
  }
  function tagName(node) {
    for (const key of Object.keys(NODE_TYPE)) {
      if (NODE_TYPE[key] === node.type)
        return key;
    }
    return String(node.type);
  }

  // tmp/pocketjs/framework/src/vue-vapor-dom.ts
  function parseAttrs(raw, node) {
    const re = /([A-Za-z_:][-A-Za-z0-9_:]*)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let match;
    while (match = re.exec(raw)) {
      const value = match[2] ?? match[3] ?? match[4] ?? "";
      setProp(node, match[1], value, undefined);
    }
  }
  function parseTemplateHtml(html) {
    if (!html)
      return [];
    if (html.startsWith("<!--")) {
      const end = html.indexOf("-->");
      if (end >= 0) {
        return [createCommentNode(html.slice(4, end)), ...parseTemplateHtml(html.slice(end + 3))];
      }
    }
    if (!html.startsWith("<"))
      return [createTextNode(html)];
    const match = html.match(/^<([A-Za-z][A-Za-z0-9_-]*)([^>]*)>([\s\S]*)$/);
    if (!match)
      return [createTextNode(html)];
    const [, tag, attrs, rest] = match;
    const node = createElement(tag.toLowerCase());
    parseAttrs(attrs, node);
    const text = rest.replace(new RegExp(`</${tag}>$`, "i"), "");
    if (text)
      insertNode(node, createTextNode(text));
    return [node];
  }
  function createTemplate() {
    const content = {
      childNodes: [],
      get firstChild() {
        return this.childNodes[0] ?? null;
      }
    };
    let current = "";
    return {
      content,
      get innerHTML() {
        return current;
      },
      set innerHTML(value) {
        current = value;
        content.childNodes = parseTemplateHtml(value);
      }
    };
  }
  function createPocketDocument() {
    return {
      createElement(tag) {
        return tag === "template" ? createTemplate() : createElement(tag.toLowerCase());
      },
      createElementNS(_namespace, tag) {
        return createElement(tag.toLowerCase());
      },
      createTextNode(value = "") {
        return createTextNode(value);
      },
      createComment(value = "") {
        return createCommentNode(value);
      },
      querySelector() {
        return null;
      },
      addEventListener() {},
      removeEventListener() {}
    };
  }
  function makeDomClass(predicate) {
    return class {
      static [Symbol.hasInstance](value) {
        return predicate(value);
      }
    };
  }
  function installDomClass(target, name, predicate) {
    const existing = target[name];
    if (!existing) {
      target[name] = makeDomClass(predicate);
      return;
    }
    if (typeof existing !== "function")
      return;
    const nativeHasInstance = Function.prototype[Symbol.hasInstance].bind(existing);
    try {
      Object.defineProperty(existing, Symbol.hasInstance, {
        configurable: true,
        value(value) {
          return predicate(value) || nativeHasInstance(value);
        }
      });
    } catch {}
  }
  function installVueVaporDom() {
    const g = globalThis;
    installDomClass(g, "Node", isNativeNode);
    installDomClass(g, "Element", (value) => isNativeNode(value) && value.domNodeType === 1);
    if (!g.HTMLElement)
      g.HTMLElement = g.Element;
    else
      installDomClass(g, "HTMLElement", (value) => isNativeNode(value) && value.domNodeType === 1);
    installDomClass(g, "Text", (value) => isNativeNode(value) && value.domNodeType === 3);
    installDomClass(g, "Comment", (value) => isNativeNode(value) && value.domNodeType === 8);
    if (!g.window)
      g.window = globalThis;
    g.__pocketDocument = createPocketDocument();
    if (!g.document)
      g.document = g.__pocketDocument;
  }

  // tmp/pocketjs/framework/src/prelude.ts
  installVueVaporDom();

  // tmp/pocketjs/framework/src/display.ts
  var roots = null;
  function layer(width, height, overlay) {
    const node = createElement("view");
    setProp(node, "style", overlay ? {
      width,
      height,
      posType: ENUMS.PosType.Absolute,
      insetT: 0,
      insetR: 0,
      insetB: 0,
      insetL: 0,
      zIndex: 1000,
      hitPass: 1
    } : {
      width,
      height,
      overflow: ENUMS.Overflow.Hidden
    }, undefined);
    return node;
  }
  function mountAuxiliarySurface(ops) {
    const descriptor = ops.__auxiliarySurface;
    if (!descriptor) {
      roots = null;
      return null;
    }
    if (!Number.isInteger(descriptor.root) || descriptor.root <= 1 || !Number.isFinite(descriptor.w) || descriptor.w <= 0 || !Number.isFinite(descriptor.h) || descriptor.h <= 0) {
      throw new Error("PocketJS: invalid ui.__auxiliarySurface descriptor");
    }
    const native = adoptNativeRoot(descriptor.root, "auxiliary-root");
    const app = layer(descriptor.w, descriptor.h, false);
    const overlay = layer(descriptor.w, descriptor.h, true);
    insertNode(native, app);
    insertNode(native, overlay);
    roots = {
      native,
      app,
      overlay,
      viewport: Object.freeze({
        width: descriptor.w,
        height: descriptor.h
      })
    };
    return roots;
  }
  function unmountAuxiliarySurface(ops) {
    const mounted = roots;
    roots = null;
    if (!mounted)
      return;
    for (const child of mounted.native.children.splice(0)) {
      child.parent = null;
      ops.destroyNode(child.id);
    }
    releaseNativeRoot(mounted.native);
  }
  function hasAuxiliarySurface() {
    return roots !== null;
  }
  function getAuxiliarySurfaceRoots() {
    if (!roots) {
      throw new Error("PocketJS: AuxiliarySurface requires a resolved display.auxiliary capability");
    }
    return roots;
  }

  // tmp/pocketjs/framework/src/devtools.ts
  var TAPE_CAP = 36000;
  var TREE_THROTTLE = 30;
  var STATS_EVERY = 30;
  var state = {
    ops: null,
    transport: null,
    app: undefined,
    frame: 0,
    tape: new Uint16Array(TAPE_CAP),
    tapeAnalog: new Uint16Array(TAPE_CAP),
    tapeRightAnalog: null,
    tapeTouch: null,
    tapeTouchSurfaces: null,
    tapeStart: 0,
    tapeLen: 0,
    tapeFirstFrame: 0,
    replayMasks: null,
    replayAnalog: null,
    replayRightAnalog: null,
    replayTouch: null,
    replayTouchSurfaces: null,
    replayAt: 0,
    paused: false,
    stepQueued: 0,
    inspectReportId: null,
    inspectAskedAt: 0,
    treeDirty: true,
    treeSentAt: -TREE_THROTTLE,
    saidHello: false,
    hostCalls: 0
  };
  function initDevtools(ops) {
    const g = globalThis;
    if (!g.console)
      g.console = {
        log() {},
        warn() {},
        error() {}
      };
    state.ops = ops;
    state.frame = 0;
    state.tapeStart = 0;
    state.tapeLen = 0;
    state.tapeFirstFrame = 0;
    state.tapeTouch = null;
    state.tapeRightAnalog = null;
    state.tapeTouchSurfaces = null;
    state.replayMasks = null;
    state.replayAnalog = null;
    state.replayRightAnalog = null;
    state.replayTouch = null;
    state.replayTouchSurfaces = null;
    state.paused = false;
    state.stepQueued = 0;
    state.inspectReportId = null;
    state.inspectAskedAt = 0;
    state.treeDirty = true;
    state.treeSentAt = -TREE_THROTTLE;
    state.saidHello = false;
    state.hostCalls = 0;
    state.app = globalThis.__pocketApp;
    const injected = globalThis.__pocketDevtoolsTransport;
    if (injected) {
      state.transport = injected;
    } else if (ops.__dbgActive?.() && ops.__dbgPoll && ops.__dbgSend) {
      state.transport = {
        send: (l) => ops.__dbgSend(l),
        recv: () => ops.__dbgPoll(),
        everyFrames: 10
      };
    } else {
      state.transport = null;
    }
    if (state.transport) {
      setTreeMutationHook(() => {
        state.treeDirty = true;
      });
      bridgeConsole();
    } else {
      setTreeMutationHook(null);
    }
    globalThis.__pocketDevtools = api;
  }
  function wrapFrameHandler(h) {
    return (buttons, analogArg, touchArg, hitsArg, touchSurfacesArg, rightAnalogArg) => {
      state.hostCalls++;
      if (state.transport) {
        pollTransport();
        flushInspectReport();
      }
      let mask = buttons;
      let analog = analogArg === undefined ? ANALOG_CENTER : analogArg & 65535;
      let rightAnalog = rightAnalogArg === undefined ? ANALOG_CENTER : rightAnalogArg & 65535;
      let touch = touchArg;
      let hits = hitsArg;
      let touchSurfaces = touchSurfacesArg;
      if (state.replayMasks) {
        if (state.replayAt < state.replayMasks.length) {
          mask = state.replayMasks[state.replayAt];
          analog = state.replayAnalog ? state.replayAnalog[state.replayAt] : ANALOG_CENTER;
          rightAnalog = state.replayRightAnalog ? state.replayRightAnalog[state.replayAt] : ANALOG_CENTER;
          touch = state.replayTouch ? state.replayTouch[state.replayAt] : undefined;
          touchSurfaces = state.replayTouchSurfaces ? state.replayTouchSurfaces[state.replayAt] : undefined;
          hits = undefined;
          state.replayAt++;
        } else {
          state.replayMasks = null;
          state.replayAnalog = null;
          state.replayRightAnalog = null;
          state.replayTouch = null;
          state.replayTouchSurfaces = null;
          send({
            t: "replayDone",
            frame: state.frame
          });
        }
      }
      if (state.paused) {
        if (state.stepQueued <= 0)
          return;
        state.stepQueued--;
        state.ops?.debugStep?.();
      }
      recordMask(mask, analog, touch, touchSurfaces, rightAnalog);
      state.frame++;
      try {
        h(mask, analog, touch, hits, touchSurfaces, rightAnalog);
      } catch (e) {
        send({
          t: "error",
          frame: state.frame,
          message: e instanceof Error ? e.message : String(e),
          stack: e instanceof Error ? e.stack : undefined
        });
        throw e;
      }
      if (state.transport)
        afterFrame();
    };
  }
  function recordMask(mask, analog, touch, touchSurfaces, rightAnalog) {
    const right = rightAnalog ?? ANALOG_CENTER;
    if (right !== ANALOG_CENTER && !state.tapeRightAnalog)
      state.tapeRightAnalog = new Uint16Array(TAPE_CAP).fill(ANALOG_CENTER);
    const contacts = touch && touch.length > 0 ? touch.slice(0, 16) : null;
    if (contacts && !state.tapeTouch) {
      state.tapeTouch = new Array(TAPE_CAP).fill(null);
    }
    const surfaces = contacts && touchSurfaces ? touchSurfaces.slice(0, contacts.length).map((surface) => surface === 1 ? 1 : 0) : null;
    if (surfaces?.some((surface) => surface === 1) && !state.tapeTouchSurfaces) {
      state.tapeTouchSurfaces = new Array(TAPE_CAP).fill(null);
    }
    if (state.tapeLen < TAPE_CAP) {
      const at = (state.tapeStart + state.tapeLen) % TAPE_CAP;
      state.tape[at] = mask;
      state.tapeAnalog[at] = analog;
      if (state.tapeRightAnalog)
        state.tapeRightAnalog[at] = right;
      if (state.tapeTouch)
        state.tapeTouch[at] = contacts;
      if (state.tapeTouchSurfaces)
        state.tapeTouchSurfaces[at] = surfaces;
      state.tapeLen++;
    } else {
      state.tape[state.tapeStart] = mask;
      state.tapeAnalog[state.tapeStart] = analog;
      if (state.tapeRightAnalog)
        state.tapeRightAnalog[state.tapeStart] = right;
      if (state.tapeTouch)
        state.tapeTouch[state.tapeStart] = contacts;
      if (state.tapeTouchSurfaces)
        state.tapeTouchSurfaces[state.tapeStart] = surfaces;
      state.tapeStart = (state.tapeStart + 1) % TAPE_CAP;
      state.tapeFirstFrame++;
    }
  }
  function rlePairs(ring) {
    const out = [];
    for (let i = 0;i < state.tapeLen; i++) {
      const v = ring[(state.tapeStart + i) % TAPE_CAP];
      const last = out[out.length - 1];
      if (last && last[0] === v)
        last[1]++;
      else
        out.push([v, 1]);
    }
    return out;
  }
  function exportTape() {
    const tape = {
      v: 1,
      app: state.app,
      frames: state.tapeLen,
      masks: rlePairs(state.tape),
      startFrame: state.tapeFirstFrame
    };
    const analog = rlePairs(state.tapeAnalog);
    if (analog.length > 1 || analog.length === 1 && analog[0][0] !== ANALOG_CENTER) {
      tape.analog = analog;
    }
    if (state.tapeRightAnalog) {
      const right = rlePairs(state.tapeRightAnalog);
      if (right.some(([value]) => value !== ANALOG_CENTER))
        tape.rightAnalog = right;
    }
    if (state.tapeTouch) {
      const touch = [];
      for (let i = 0;i < state.tapeLen; i++) {
        const contacts = state.tapeTouch[(state.tapeStart + i) % TAPE_CAP];
        if (contacts)
          touch.push([i, contacts.slice()]);
      }
      if (touch.length > 0) {
        tape.v = 2;
        tape.touch = touch;
      }
    }
    if (state.tapeTouchSurfaces) {
      const touchSurfaces = [];
      for (let i = 0;i < state.tapeLen; i++) {
        const surfaces = state.tapeTouchSurfaces[(state.tapeStart + i) % TAPE_CAP];
        if (surfaces)
          touchSurfaces.push([i, surfaces.slice()]);
      }
      if (touchSurfaces.length > 0) {
        tape.v = 3;
        tape.touchSurfaces = touchSurfaces;
      }
    }
    return tape;
  }
  function expandPairs(pairs, fill, total) {
    const out = new Uint16Array(total).fill(fill);
    let at = 0;
    for (const [v, n] of pairs) {
      out.fill(v, at, Math.min(at + n, total));
      at += n;
    }
    return out;
  }
  function expandTape(tape) {
    let total = 0;
    for (const [, n] of tape.masks)
      total += n;
    return expandPairs(tape.masks, 0, total);
  }
  function expandTapeAnalog(tape) {
    let total = 0;
    for (const [, n] of tape.masks)
      total += n;
    return expandPairs(tape.analog ?? [], ANALOG_CENTER, total);
  }
  function expandTapeRightAnalog(tape) {
    return expandPairs(tape.rightAnalog ?? [], ANALOG_CENTER, tape.masks.reduce((n, [, count]) => n + count, 0));
  }
  function expandTapeTouch(tape) {
    let total = 0;
    for (const [, n] of tape.masks)
      total += n;
    const out = new Array(total).fill(undefined);
    for (const [frame, contacts] of tape.touch ?? []) {
      if (frame >= 0 && frame < total)
        out[frame] = contacts;
    }
    return out;
  }
  function expandTapeTouchSurfaces(tape) {
    let total = 0;
    for (const [, n] of tape.masks)
      total += n;
    const out = new Array(total).fill(undefined);
    for (const [frame, surfaces] of tape.touchSurfaces ?? []) {
      if (frame >= 0 && frame < total)
        out[frame] = surfaces;
    }
    return out;
  }
  function send(msg) {
    try {
      state.transport?.send(JSON.stringify(msg));
    } catch {}
  }
  function pollTransport() {
    const t = state.transport;
    const every = t.everyFrames ?? 1;
    if (every > 1 && state.hostCalls % every !== 0)
      return;
    if (!state.saidHello) {
      state.saidHello = true;
      send({
        t: "hello",
        app: state.app,
        host: hostKind(),
        frame: state.frame
      });
    }
    for (let guard = 0;guard < 64; guard++) {
      const chunk = t.recv();
      if (!chunk)
        break;
      for (const line of chunk.split(`
`)) {
        if (line.trim())
          handleMessage(line);
      }
    }
  }
  function handleMessage(line) {
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      return;
    }
    const ops = state.ops;
    switch (msg.t) {
      case "inspect": {
        const id = typeof msg.id === "number" ? msg.id : 0;
        ops?.debugInspect?.(id);
        state.inspectReportId = id || null;
        state.inspectAskedAt = state.hostCalls;
        if (!id)
          send({
            t: "inspect",
            id: 0,
            rect: null
          });
        break;
      }
      case "pause":
        state.paused = true;
        state.stepQueued = 0;
        ops?.debugPause?.(true);
        sendStats();
        break;
      case "resume":
        state.paused = false;
        ops?.debugPause?.(false);
        sendStats();
        break;
      case "step":
        state.stepQueued += typeof msg.n === "number" && msg.n > 0 ? msg.n : 1;
        break;
      case "getTree":
        sendTree();
        break;
      case "eval": {
        let ok = true;
        let value;
        try {
          value = fmt((0, eval)(String(msg.code)));
        } catch (e) {
          ok = false;
          value = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
        }
        send({
          t: "evalResult",
          id: msg.id,
          ok,
          value
        });
        break;
      }
      case "dumpTape":
        send({
          t: "tape",
          tape: exportTape()
        });
        break;
      case "devStats": {
        let data = null;
        const raw = ops?.debugStats?.();
        if (raw) {
          try {
            data = JSON.parse(raw);
          } catch {
            data = null;
          }
        }
        send({
          t: "devStats",
          frame: state.frame,
          data
        });
        break;
      }
      case "screenshot": {
        if (ops?.__dbgShot?.()) {
          send({
            t: "screenshotRaw",
            file: "shot.raw",
            w: 480,
            h: 272,
            stride: 512,
            frame: state.frame
          });
        } else {
          send({
            t: "log",
            level: "warn",
            args: ["screenshot: not supported on this host"]
          });
        }
        break;
      }
      case "replay": {
        const tape = msg.tape;
        if (tape && Array.isArray(tape.masks)) {
          state.replayMasks = expandTape(tape);
          state.replayAnalog = tape.analog ? expandTapeAnalog(tape) : null;
          state.replayRightAnalog = tape.rightAnalog ? expandTapeRightAnalog(tape) : null;
          state.replayTouch = tape.touch ? expandTapeTouch(tape) : null;
          state.replayTouchSurfaces = tape.touchSurfaces ? expandTapeTouchSurfaces(tape) : null;
          state.replayAt = 0;
        }
        break;
      }
      default:
        break;
    }
  }
  function afterFrame() {
    if (state.treeDirty && state.frame - state.treeSentAt >= TREE_THROTTLE) {
      sendTree();
    }
    if (state.frame % STATS_EVERY === 0)
      sendStats();
  }
  function flushInspectReport() {
    const id = state.inspectReportId;
    if (id == null)
      return;
    const ops = state.ops;
    if (!ops?.debugRectXY || !ops.debugRectWH) {
      state.inspectReportId = null;
      return;
    }
    const xy = ops.debugRectXY();
    if (xy === -1) {
      if (state.hostCalls - state.inspectAskedAt > 60) {
        state.inspectReportId = null;
        send({
          t: "inspect",
          id,
          rect: null
        });
      }
      return;
    }
    const wh = ops.debugRectWH();
    state.inspectReportId = null;
    send({
      t: "inspect",
      id,
      rect: [xy << 16 >> 16, xy >> 16, wh & 65535, wh >> 16 & 65535]
    });
  }
  function sendStats() {
    send({
      t: "stats",
      frame: state.frame,
      nodes: countMountedNodes(),
      tapeLen: state.tapeLen,
      paused: state.paused
    });
  }
  function sendTree() {
    state.treeDirty = false;
    state.treeSentAt = state.frame;
    send({
      t: "tree",
      frame: state.frame,
      root: serializeMountedTree()
    });
  }
  function isTreeMirror(value) {
    if (value == null || typeof value !== "object")
      return false;
    const candidate = value;
    return typeof candidate.id === "number" && typeof candidate.type === "number";
  }
  function forEachTreeMirror(value, visit) {
    if (Array.isArray(value)) {
      for (const entry of value)
        forEachTreeMirror(entry, visit);
      return;
    }
    if (isTreeMirror(value)) {
      visit(value);
      return;
    }
    if (value != null && typeof value === "object") {
      const nodes = value.nodes;
      if (nodes !== undefined)
        forEachTreeMirror(nodes, visit);
    }
  }
  function forEachTreeChild(node, visit) {
    const children = Array.isArray(node.children) ? node.children : [];
    for (const child of children)
      forEachTreeMirror(child, visit);
  }
  function serializeNode(node) {
    const out = {
      i: node.id,
      t: node.domTag ?? String(node.type)
    };
    if (node.debugName)
      out.n = node.debugName;
    const cls = node.domAttrs?.class;
    if (typeof cls === "string" && cls)
      out.c = cls;
    if (node.text)
      out.x = node.text.length > 80 ? node.text.slice(0, 79) + "…" : node.text;
    const kids = [];
    forEachTreeChild(node, (child) => {
      if (child.domNodeType === 8)
        return;
      kids.push(serializeNode(child));
    });
    if (kids.length)
      out.k = kids;
    return out;
  }
  function namedSurfaceRoot(node, name) {
    const out = serializeNode(node);
    if (!out.n)
      out.n = name;
    return out;
  }
  function serializeMountedTree() {
    if (!hasAuxiliarySurface())
      return serializeNode(rootMirror);
    return {
      i: 0,
      t: "surfaces",
      v: 1,
      n: "Displays",
      k: [namedSurfaceRoot(rootMirror, "Primary display"), namedSurfaceRoot(getAuxiliarySurfaceRoots().native, "Auxiliary display")]
    };
  }
  function countNodes(node) {
    let n = 1;
    forEachTreeChild(node, (child) => {
      n += countNodes(child);
    });
    return n;
  }
  function countMountedNodes() {
    let count = countNodes(rootMirror);
    if (hasAuxiliarySurface())
      count += countNodes(getAuxiliarySurfaceRoots().native);
    return count;
  }
  function bridgeConsole() {
    const g = globalThis;
    if (!g.console)
      g.console = {};
    const c = g.console;
    if (c.__pocketBridged)
      return;
    c.__pocketBridged = true;
    for (const level of ["log", "warn", "error"]) {
      const original = c[level];
      c[level] = (...args) => {
        send({
          t: "log",
          level,
          args: args.map((a) => fmt(a))
        });
        original?.apply(c, args);
      };
    }
  }
  function fmt(v, depth = 0) {
    if (v === undefined)
      return "undefined";
    if (v === null)
      return "null";
    const t = typeof v;
    if (t === "string") {
      const s = v;
      return depth === 0 ? clip(s) : JSON.stringify(clip(s));
    }
    if (t === "number" || t === "boolean" || t === "bigint")
      return String(v);
    if (t === "function") {
      const name = v.name;
      return name ? `[function ${name}]` : "[function]";
    }
    if (depth >= 3)
      return Array.isArray(v) ? "[…]" : "{…}";
    if (Array.isArray(v)) {
      const items = v.slice(0, 20).map((x) => fmt(x, depth + 1));
      if (v.length > 20)
        items.push(`… ${v.length - 20} more`);
      return `[${items.join(", ")}]`;
    }
    if (v instanceof Error)
      return `${v.name}: ${v.message}`;
    const entries = Object.entries(v).slice(0, 20);
    const body = entries.map(([k, x]) => `${k}: ${fmt(x, depth + 1)}`).join(", ");
    return `{${body}}`;
  }
  function clip(s) {
    return s.length > 200 ? s.slice(0, 199) + "…" : s;
  }
  function hostKind() {
    const ops = state.ops;
    if (typeof ops?.__host === "string")
      return ops.__host;
    if (ops?.__textures !== undefined)
      return "psp";
    if (typeof globalThis.document !== "undefined")
      return "web";
    return "headless";
  }
  var api = {
    get frame() {
      return state.frame;
    },
    dumpTape: () => exportTape(),
    replay: (tape) => {
      state.replayMasks = expandTape(tape);
      state.replayAnalog = tape.analog ? expandTapeAnalog(tape) : null;
      state.replayRightAnalog = tape.rightAnalog ? expandTapeRightAnalog(tape) : null;
      state.replayTouch = tape.touch ? expandTapeTouch(tape) : null;
      state.replayTouchSurfaces = tape.touchSurfaces ? expandTapeTouchSurfaces(tape) : null;
      state.replayAt = 0;
    }
  };

  // tmp/pocketjs/node_modules/vue/dist/vue.runtime-with-vapor.esm-browser.prod.js
  function e(e) {
    let t = Object.create(null);
    for (let n of e.split(`,`))
      t[n] = 1;
    return (e) => (e in t);
  }
  var t = {};
  var n = [];
  var r = () => {};
  var i = () => false;
  var a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97);
  var o = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123;
  var s = (e) => e.startsWith(`onUpdate:`);
  var c = Object.assign;
  var u = Object.prototype.hasOwnProperty;
  var d = (e, t) => u.call(e, t);
  var f = Array.isArray;
  var p = (e) => C(e) === `[object Map]`;
  var m = (e) => C(e) === `[object Set]`;
  var g = (e) => C(e) === `[object RegExp]`;
  var _ = (e) => typeof e == `function`;
  var v = (e) => typeof e == `string`;
  var y = (e) => typeof e == `symbol`;
  var b = (e) => typeof e == `object` && !!e;
  var x = (e) => (b(e) || _(e)) && _(e.then) && _(e.catch);
  var S = Object.prototype.toString;
  var C = (e) => S.call(e);
  var ee = (e) => C(e).slice(8, -1);
  var w = (e) => C(e) === `[object Object]`;
  var T = (e) => v(e) && e !== `NaN` && e[0] !== `-` && `` + parseInt(e, 10) === e;
  var E = e(`,key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted`);
  var te = e(`slot,component`);
  var ne = (e) => {
    let t = Object.create(null);
    return (n) => t[n] || (t[n] = e(n));
  };
  var re = /-(\w)/g;
  var ie = (e, t) => t ? t.toUpperCase() : ``;
  var D = ne((e) => e.replace(re, ie));
  var ae = /\B([A-Z])/g;
  var oe = ne((e) => e.replace(ae, `-$1`).toLowerCase());
  var se = ne((e) => e.charAt(0).toUpperCase() + e.slice(1));
  var ce = ne((e) => e ? `on${se(e)}` : ``);
  var le = (e) => `${e === `modelValue` || e === `model-value` ? `model` : e}Modifiers${e === `model` ? `$` : ``}`;
  var O = (e, t) => !Object.is(e, t);
  var ue = (e, ...t) => {
    for (let n = 0;n < e.length; n++)
      e[n](...t);
  };
  var de = (e, t, n, r = false) => {
    Object.defineProperty(e, t, { configurable: true, enumerable: false, writable: r, value: n });
  };
  var fe = (e) => {
    let t = parseFloat(e);
    return isNaN(t) ? e : t;
  };
  var pe = (e) => {
    let t = v(e) ? Number(e) : NaN;
    return isNaN(t) ? e : t;
  };
  var me;
  var he = () => me || (me = typeof globalThis < `u` ? globalThis : typeof self < `u` ? self : typeof window < `u` ? window : typeof global < `u` ? global : {});
  function ge(e) {
    return e !== `PROGRESS` && !e.includes(`-`);
  }
  var _e = e(`Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol`);
  function ve(e) {
    if (f(e)) {
      let t = {};
      for (let n = 0;n < e.length; n++) {
        let r = e[n], i = v(r) ? Se(r) : ve(r);
        if (i)
          for (let e in i)
            t[e] = i[e];
      }
      return t;
    } else if (v(e) || b(e))
      return e;
  }
  var ye = /;(?![^(]*\))/g;
  var be = /:([^]+)/;
  var xe = /\/\*[^]*?\*\//g;
  function Se(e) {
    let t = {};
    return e.replace(xe, ``).split(ye).forEach((e) => {
      if (e) {
        let n = e.split(be);
        n.length > 1 && (t[n[0].trim()] = n[1].trim());
      }
    }), t;
  }
  function Ce(e) {
    let t = ``;
    if (v(e))
      t = e;
    else if (f(e))
      for (let n = 0;n < e.length; n++) {
        let r = Ce(e[n]);
        r && (t += r + ` `);
      }
    else if (b(e))
      for (let n in e)
        e[n] && (t += n + ` `);
    return t.trim();
  }
  var Te = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  var Ee = e(Te);
  var De = e(Te + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
  function Oe(e) {
    return !!e || e === ``;
  }
  var ke = e(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
  var Ae = e(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xmlns:xlink,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
  function Me(e, t) {
    return t === `spellcheck` || t === `draggable` || t === `translate` || t === `autocorrect` || t === `form` || t === `list` && e === `INPUT` || t === `type` && e === `TEXTAREA` || (t === `width` || t === `height`) && (e === `IMG` || e === `VIDEO` || e === `CANVAS` || e === `SOURCE`) || t === `sandbox` && e === `IFRAME`;
  }
  var Ie = (e) => !!(e && e.__v_isRef === true);
  var Le = (e) => {
    switch (typeof e) {
      case `string`:
        return e;
      case `object`:
        if (e) {
          if (Ie(e))
            return Le(e.value);
          if (f(e) || e.toString === S || !_(e.toString))
            return JSON.stringify(e, Re, 2);
        }
      default:
        return e == null ? `` : String(e);
    }
  };
  var Re = (e, t) => Ie(t) ? Re(e, t.value) : p(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ze(t, r) + ` =>`] = n, e), {}) } : m(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ze(e)) } : y(t) ? ze(t) : b(t) && !f(t) && !w(t) ? String(t) : t;
  var ze = (e, t = ``) => {
    var n;
    return y(e) ? `Symbol(${(n = e.description) == null ? t : n})` : e;
  };
  var He = [];
  var Ue = 0;
  var We;
  var Ge = 0;
  function Ke() {
    ++Ge;
  }
  function qe() {
    --Ge;
  }
  var Je = 0;
  var Ye = 0;
  var Xe = 0;
  function k(e) {
    try {
      return We;
    } finally {
      We = e;
    }
  }
  function Ze() {
    ++Ue;
  }
  function Qe() {
    !--Ue && Xe && it();
  }
  function $e(e, t) {
    let n = t.depsTail;
    if (n !== undefined && n.dep === e)
      return;
    let r = n === undefined ? t.deps : n.nextDep;
    if (r !== undefined && r.dep === e) {
      r.version = Je, t.depsTail = r;
      return;
    }
    let i = e.subsTail;
    if (i !== undefined && i.version === Je && i.sub === t)
      return;
    let a = t.depsTail = e.subsTail = { version: Je, dep: e, sub: t, prevDep: n, nextDep: r, prevSub: i, nextSub: undefined };
    r !== undefined && (r.prevDep = a), n === undefined ? t.deps = a : n.nextDep = a, i === undefined ? e.subs = a : i.nextSub = a;
  }
  function et(e, t = e.sub) {
    let { dep: n, prevDep: r, nextDep: i, nextSub: a, prevSub: o } = e;
    if (i === undefined ? t.depsTail = r : i.prevDep = r, r === undefined ? t.deps = i : r.nextDep = i, a === undefined ? n.subsTail = o : a.prevSub = o, o !== undefined)
      o.nextSub = a;
    else if ((n.subs = a) === undefined) {
      let e = n.deps;
      if (e !== undefined) {
        do
          e = et(e, n);
        while (e !== undefined);
        n.flags |= 16;
      }
    }
    return i;
  }
  function tt(e) {
    let t = e.nextSub, n;
    top:
      do {
        let r = e.sub, i = r.flags;
        if (i & 3 && (i & 60 ? i & 12 ? i & 4 ? !(i & 48) && st(e, r) ? (r.flags = i | 40, i &= 1) : i = 0 : r.flags = i & -9 | 32 : i = 0 : (r.flags = i | 32, Ge && (r.flags |= 8)), i & 2 && (He[Xe++] = r), i & 1)) {
          let i = r.subs;
          if (i !== undefined) {
            e = i, i.nextSub !== undefined && (n = { value: t, prev: n }, t = e.nextSub);
            continue;
          }
        }
        if ((e = t) !== undefined) {
          t = e.nextSub;
          continue;
        }
        for (;n !== undefined; )
          if (e = n.value, n = n.prev, e !== undefined) {
            t = e.nextSub;
            continue top;
          }
        break;
      } while (true);
  }
  function nt(e) {
    return ++Je, e.depsTail = undefined, e.flags = e.flags & -57 | 4, k(e);
  }
  function rt(e, t) {
    We = t;
    let n = e.depsTail, r = n === undefined ? e.deps : n.nextDep;
    for (;r !== undefined; )
      r = et(r, e);
    e.flags &= -5;
  }
  function it() {
    for (;Ye < Xe; ) {
      let e = He[Ye];
      He[Ye++] = undefined, e.notify();
    }
    Ye = 0, Xe = 0;
  }
  function at(e, t) {
    let n, r = 0;
    top:
      do {
        let i = e.dep, a = i.flags, o = false;
        if (t.flags & 16)
          o = true;
        else if ((a & 17) == 17) {
          let e = i.subs;
          i.update() && (e.nextSub !== undefined && ot(e), o = true);
        } else if ((a & 33) == 33) {
          n = { value: e, prev: n }, e = i.deps, t = i, ++r;
          continue;
        }
        if (!o && e.nextDep !== undefined) {
          e = e.nextDep;
          continue;
        }
        for (;r; ) {
          if (--r, e = n.value, n = n.prev, o) {
            let n = t.subs;
            if (t.update()) {
              n.nextSub !== undefined && ot(n), t = e.sub;
              continue;
            }
          } else
            t.flags &= -33;
          if (t = e.sub, e.nextDep !== undefined) {
            e = e.nextDep;
            continue top;
          }
          o = false;
        }
        return o && !!t.flags;
      } while (true);
  }
  function ot(e) {
    do {
      let t = e.sub, n = e.nextSub, r = t.flags;
      (r & 48) == 32 && (t.flags = r | 16), e = n;
    } while (e !== undefined);
  }
  function st(e, t) {
    let n = t.depsTail;
    for (;n !== undefined; ) {
      if (n === e)
        return true;
      n = n.prevDep;
    }
    return false;
  }
  var ct = class {
    constructor(e, t) {
      this.map = e, this.key = t, this._subs = undefined, this.subsTail = undefined, this.flags = 0;
    }
    get subs() {
      return this._subs;
    }
    set subs(e) {
      this._subs = e, e === undefined && this.map.delete(this.key);
    }
  };
  var lt = new WeakMap;
  var ut = Symbol(``);
  var dt = Symbol(``);
  var ft = Symbol(``);
  function pt(e, t, n) {
    if (We !== undefined) {
      let t = lt.get(e);
      t || lt.set(e, t = new Map);
      let r = t.get(n);
      r || t.set(n, r = new ct(t, n)), $e(r, We);
    }
  }
  function mt(e, t, n, r, i, a) {
    let o = lt.get(e);
    if (!o)
      return;
    let s = (e) => {
      e !== undefined && e.subs !== undefined && (tt(e.subs), ot(e.subs));
    };
    if (Ze(), t === `clear`)
      o.forEach(s);
    else {
      let i = f(e), a = i && T(n);
      if (i && n === `length`) {
        let e = Number(r);
        o.forEach((t, n) => {
          (n === `length` || n === ft || !y(n) && n >= e) && s(t);
        });
      } else
        switch ((n !== undefined || o.has(undefined)) && s(o.get(n)), a && s(o.get(ft)), t) {
          case `add`:
            i ? a && s(o.get(`length`)) : (s(o.get(ut)), p(e) && s(o.get(dt)));
            break;
          case `delete`:
            i || (s(o.get(ut)), p(e) && s(o.get(dt)));
            break;
          case `set`:
            p(e) && s(o.get(ut));
            break;
        }
    }
    Qe();
  }
  function gt(e) {
    let t = A(e);
    return t === e ? t : (pt(t, `iterate`, ft), an(e) ? t : t.map(cn));
  }
  function _t(e) {
    return pt(e = A(e), `iterate`, ft), e;
  }
  function vt(e, t) {
    return rn(e) ? ln(nn(e) ? cn(t) : t) : cn(t);
  }
  var yt = { __proto__: null, [Symbol.iterator]() {
    return bt(this, Symbol.iterator, (e) => vt(this, e));
  }, concat(...e) {
    return gt(this).concat(...e.map((e) => f(e) ? gt(e) : e));
  }, entries() {
    return bt(this, `entries`, (e) => (e[1] = vt(this, e[1]), e));
  }, every(e, t) {
    return St(this, `every`, e, t, undefined, arguments);
  }, filter(e, t) {
    return St(this, `filter`, e, t, (e) => e.map((e) => vt(this, e)), arguments);
  }, find(e, t) {
    return St(this, `find`, e, t, (e) => vt(this, e), arguments);
  }, findIndex(e, t) {
    return St(this, `findIndex`, e, t, undefined, arguments);
  }, findLast(e, t) {
    return St(this, `findLast`, e, t, (e) => vt(this, e), arguments);
  }, findLastIndex(e, t) {
    return St(this, `findLastIndex`, e, t, undefined, arguments);
  }, forEach(e, t) {
    return St(this, `forEach`, e, t, undefined, arguments);
  }, includes(...e) {
    return wt(this, `includes`, e);
  }, indexOf(...e) {
    return wt(this, `indexOf`, e);
  }, join(e) {
    return gt(this).join(e);
  }, lastIndexOf(...e) {
    return wt(this, `lastIndexOf`, e);
  }, map(e, t) {
    return St(this, `map`, e, t, undefined, arguments);
  }, pop() {
    return Tt(this, `pop`);
  }, push(...e) {
    return Tt(this, `push`, e);
  }, reduce(e, ...t) {
    return Ct(this, `reduce`, e, t);
  }, reduceRight(e, ...t) {
    return Ct(this, `reduceRight`, e, t);
  }, shift() {
    return Tt(this, `shift`);
  }, some(e, t) {
    return St(this, `some`, e, t, undefined, arguments);
  }, splice(...e) {
    return Tt(this, `splice`, e);
  }, toReversed() {
    return gt(this).toReversed();
  }, toSorted(e) {
    return gt(this).toSorted(e);
  }, toSpliced(...e) {
    return gt(this).toSpliced(...e);
  }, unshift(...e) {
    return Tt(this, `unshift`, e);
  }, values() {
    return bt(this, `values`, (e) => vt(this, e));
  } };
  function bt(e, t, n) {
    let r = _t(e), i = r[t]();
    return r !== e && !an(e) && (i._next = i.next, i.next = () => {
      let e = i._next();
      return e.done || (e.value = n(e.value)), e;
    }), i;
  }
  var xt = Array.prototype;
  function St(e, t, n, r, i, a) {
    let o = _t(e), s = o !== e && !an(e), c = o[t];
    if (c !== xt[t]) {
      let t = c.apply(e, a);
      return s ? cn(t) : t;
    }
    let l = n;
    o !== e && (s ? l = function(t, r) {
      return n.call(this, vt(e, t), r, e);
    } : n.length > 2 && (l = function(t, r) {
      return n.call(this, t, r, e);
    }));
    let u = c.call(o, l, r);
    return s && i ? i(u) : u;
  }
  function Ct(e, t, n, r) {
    let i = _t(e), a = i !== e && !an(e), o = n, s = false;
    i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
      return s && (s = false, t = vt(e, t)), n.call(this, t, vt(e, r), i, e);
    }) : n.length > 3 && (o = function(t, r, i) {
      return n.call(this, t, r, i, e);
    }));
    let c = i[t](o, ...r);
    return s ? vt(e, c) : c;
  }
  function wt(e, t, n) {
    let r = A(e);
    pt(r, `iterate`, ft);
    let i = r[t](...n);
    return (i === -1 || i === false) && on(n[0]) ? (n[0] = A(n[0]), r[t](...n)) : i;
  }
  function Tt(e, t, n = []) {
    Ze();
    let r = k(), i = A(e)[t].apply(e, n);
    return k(r), Qe(), i;
  }
  var Et = e(`__proto__,__v_isRef,__isVue`);
  var Dt = new Set(Object.getOwnPropertyNames(Symbol).filter((e) => e !== `arguments` && e !== `caller`).map((e) => Symbol[e]).filter(y));
  function Ot(e) {
    y(e) || (e = String(e));
    let t = A(this);
    return pt(t, `has`, e), t.hasOwnProperty(e);
  }
  var kt = class {
    constructor(e = false, t = false) {
      this._isReadonly = e, this._isShallow = t;
    }
    get(e, t, n) {
      if (t === `__v_skip`)
        return e.__v_skip;
      let r = this._isReadonly, i = this._isShallow;
      if (t === `__v_isReactive`)
        return !r;
      if (t === `__v_isReadonly`)
        return r;
      if (t === `__v_isShallow`)
        return i;
      if (t === `__v_raw`)
        return n === (r ? i ? Yt : Jt : i ? qt : Kt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : undefined;
      let a = f(e);
      if (!r) {
        let e;
        if (a && (e = yt[t]))
          return e;
        if (t === `hasOwnProperty`)
          return Ot;
      }
      let o = j(e), s = Reflect.get(e, t, o ? e : n);
      if (o && t !== `value` || (y(t) ? Dt.has(t) : Et(t)) || (r || pt(e, `get`, t), i))
        return s;
      if (j(s)) {
        let e = a && T(t) ? s : s.value;
        return r && b(e) ? $t(e) : e;
      }
      return b(s) ? r ? $t(s) : Zt(s) : s;
    }
  };
  var At = class extends kt {
    constructor(e = false) {
      super(false, e);
    }
    set(e, t, n, r) {
      let i = e[t], a = f(e) && T(t);
      if (!this._isShallow) {
        let e = rn(i);
        if (!an(n) && !rn(n) && (i = A(i), n = A(n)), !a && j(i) && !j(n))
          return e || (i.value = n), true;
      }
      let o = a ? Number(t) < e.length : d(e, t), s = Reflect.set(e, t, n, j(e) ? e : r);
      return e === A(r) && s && (o ? O(n, i) && mt(e, `set`, t, n, i) : mt(e, `add`, t, n)), s;
    }
    deleteProperty(e, t) {
      let n = d(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
      return i && n && mt(e, `delete`, t, undefined, r), i;
    }
    has(e, t) {
      let n = Reflect.has(e, t);
      return (!y(t) || !Dt.has(t)) && pt(e, `has`, t), n;
    }
    ownKeys(e) {
      return pt(e, `iterate`, f(e) ? `length` : ut), Reflect.ownKeys(e);
    }
  };
  var jt = class extends kt {
    constructor(e = false) {
      super(true, e);
    }
    set(e, t) {
      return true;
    }
    deleteProperty(e, t) {
      return true;
    }
  };
  var Mt = new At;
  var Nt = new jt;
  var Pt = new At(true);
  var Ft = new jt(true);
  var It = (e) => e;
  var Lt = (e) => Reflect.getPrototypeOf(e);
  function Rt(e, t, n) {
    return function(...r) {
      let i = this.__v_raw, a = A(i), o = p(a), s = e === `entries` || e === Symbol.iterator && o, l = e === `keys` && o, u = i[e](...r), d = n ? It : t ? ln : cn;
      return !t && pt(a, `iterate`, l ? dt : ut), c(Object.create(u), { next() {
        let { value: e, done: t } = u.next();
        return t ? { value: e, done: t } : { value: s ? [d(e[0]), d(e[1])] : d(e), done: t };
      } });
    };
  }
  function zt(e) {
    return function(...t) {
      return e === `delete` ? false : e === `clear` ? undefined : this;
    };
  }
  function Bt(e, t) {
    let n = { get(n) {
      let r = this.__v_raw, i = A(r), a = A(n);
      e || (O(n, a) && pt(i, `get`, n), pt(i, `get`, a));
      let { has: o } = Lt(i), s = t ? It : e ? ln : cn;
      if (o.call(i, n))
        return s(r.get(n));
      if (o.call(i, a))
        return s(r.get(a));
      r !== i && r.get(n);
    }, get size() {
      let t = this.__v_raw;
      return !e && pt(A(t), `iterate`, ut), t.size;
    }, has(t) {
      let n = this.__v_raw, r = A(n), i = A(t);
      return e || (O(t, i) && pt(r, `has`, t), pt(r, `has`, i)), t === i ? n.has(t) : n.has(t) || n.has(i);
    }, forEach(n, r) {
      let i = this, a = i.__v_raw, o = A(a), s = t ? It : e ? ln : cn;
      return !e && pt(o, `iterate`, ut), a.forEach((e, t) => n.call(r, s(e), s(t), i));
    } };
    return c(n, e ? { add: zt(`add`), set: zt(`set`), delete: zt(`delete`), clear: zt(`clear`) } : { add(e) {
      let n = A(this), r = Lt(n), i = A(e), a = !t && !an(e) && !rn(e) ? i : e;
      return r.has.call(n, a) || O(e, a) && r.has.call(n, e) || O(i, a) && r.has.call(n, i) || (n.add(a), mt(n, `add`, a, a)), this;
    }, set(e, n) {
      !t && !an(n) && !rn(n) && (n = A(n));
      let r = A(this), { has: i, get: a } = Lt(r), o = i.call(r, e);
      o || (e = A(e), o = i.call(r, e));
      let s = a.call(r, e);
      return r.set(e, n), o ? O(n, s) && mt(r, `set`, e, n, s) : mt(r, `add`, e, n), this;
    }, delete(e) {
      let t = A(this), { has: n, get: r } = Lt(t), i = n.call(t, e);
      i || (e = A(e), i = n.call(t, e));
      let a = r ? r.call(t, e) : undefined, o = t.delete(e);
      return i && mt(t, `delete`, e, undefined, a), o;
    }, clear() {
      let e = A(this), t = e.size !== 0, n = e.clear();
      return t && mt(e, `clear`, undefined, undefined, undefined), n;
    } }), [`keys`, `values`, `entries`, Symbol.iterator].forEach((r) => {
      n[r] = Rt(r, e, t);
    }), n;
  }
  function Vt(e, t) {
    let n = Bt(e, t);
    return (t, r, i) => r === `__v_isReactive` ? !e : r === `__v_isReadonly` ? e : r === `__v_raw` ? t : Reflect.get(d(n, r) && r in t ? n : t, r, i);
  }
  var Ht = { get: Vt(false, false) };
  var Ut = { get: Vt(false, true) };
  var Wt = { get: Vt(true, false) };
  var Gt = { get: Vt(true, true) };
  var Kt = new WeakMap;
  var qt = new WeakMap;
  var Jt = new WeakMap;
  var Yt = new WeakMap;
  function Xt(e) {
    switch (e) {
      case `Object`:
      case `Array`:
        return 1;
      case `Map`:
      case `Set`:
      case `WeakMap`:
      case `WeakSet`:
        return 2;
      default:
        return 0;
    }
  }
  function Zt(e) {
    return rn(e) ? e : tn(e, false, Mt, Ht, Kt);
  }
  function $t(e) {
    return tn(e, true, Nt, Wt, Jt);
  }
  function tn(e, t, n, r, i) {
    if (!b(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
      return e;
    let a = i.get(e);
    if (a)
      return a;
    let o = Xt(ee(e));
    if (o === 0)
      return e;
    let s = new Proxy(e, o === 2 ? r : n);
    return i.set(e, s), s;
  }
  function nn(e) {
    return rn(e) ? nn(e.__v_raw) : !!(e && e.__v_isReactive);
  }
  function rn(e) {
    return !!(e && e.__v_isReadonly);
  }
  function an(e) {
    return !!(e && e.__v_isShallow);
  }
  function on(e) {
    return e ? !!e.__v_raw : false;
  }
  function A(e) {
    let t = e && e.__v_raw;
    return t ? A(t) : e;
  }
  function sn(e) {
    return !d(e, `__v_skip`) && Object.isExtensible(e) && de(e, `__v_skip`, true), e;
  }
  var cn = (e) => b(e) ? Zt(e) : e;
  var ln = (e) => b(e) ? $t(e) : e;
  function j(e) {
    return e ? e.__v_isRef === true : false;
  }
  function dn(e) {
    return fn(e);
  }
  function fn(e, t) {
    return j(e) ? e : new pn(e, t);
  }
  var pn = class {
    constructor(e, t) {
      this.subs = undefined, this.subsTail = undefined, this.flags = 1, this.__v_isRef = true, this.__v_isShallow = false, this._oldValue = this._rawValue = t ? A(e) : e, this._value = t ? t(e) : e, this._wrap = t, this.__v_isShallow = !t;
    }
    get dep() {
      return this;
    }
    get value() {
      if (hn(this), this.flags & 16 && this.update()) {
        let e = this.subs;
        e !== undefined && ot(e);
      }
      return this._value;
    }
    set value(e) {
      let t = this._rawValue, n = this.__v_isShallow || an(e) || rn(e);
      if (e = n ? e : A(e), O(e, t)) {
        this.flags |= 16, this._rawValue = e, this._value = !n && this._wrap ? this._wrap(e) : e;
        let t = this.subs;
        t !== undefined && (tt(t), Ue || it());
      }
    }
    update() {
      return this.flags &= -17, O(this._oldValue, this._oldValue = this._rawValue);
    }
  };
  function hn(e) {
    We !== undefined && $e(e, We);
  }
  function gn(e) {
    return j(e) ? e.value : e;
  }
  var vn = { get: (e, t, n) => t === `__v_raw` ? e : gn(Reflect.get(e, t, n)), set: (e, t, n, r) => {
    let i = e[t];
    return j(i) && !j(n) ? (i.value = n, true) : Reflect.set(e, t, n, r);
  } };
  function yn(e) {
    return nn(e) ? e : new Proxy(e, vn);
  }
  var Dn = class {
    fn() {}
    constructor(e) {
      this.deps = undefined, this.depsTail = undefined, this.subs = undefined, this.subsTail = undefined, this.flags = 18, this.cleanups = [], this.cleanupsLength = 0, e !== undefined && (this.fn = e), In && $e(this, In);
    }
    get active() {
      return !(this.flags & 1024);
    }
    pause() {
      this.flags |= 256;
    }
    resume() {
      (this.flags &= -257) & 48 && this.notify();
    }
    notify() {
      !(this.flags & 256) && this.dirty && this.run();
    }
    run() {
      if (!this.active)
        return this.fn();
      Nn(this);
      let e = nt(this);
      Ke();
      try {
        return this.fn();
      } finally {
        qe(), rt(this, e);
        let t = this.flags;
        (t & 136) == 136 && (this.flags = t & -9, this.notify());
      }
    }
    stop() {
      if (!this.active)
        return;
      this.flags = 1024;
      let e = this.deps;
      for (;e !== undefined; )
        e = et(e, this);
      let t = this.subs;
      t !== undefined && et(t), Nn(this);
    }
    get dirty() {
      let e = this.flags;
      if (e & 16)
        return true;
      if (e & 32) {
        if (at(this.deps, this))
          return this.flags = e | 16, true;
        this.flags = e & -33;
      }
      return false;
    }
  };
  var An = [];
  function jn() {
    An.push(We), k();
  }
  function Mn() {
    An.length ? k(An.pop()) : k();
  }
  function Nn(e) {
    let t = e.cleanupsLength;
    if (t) {
      for (let n = 0;n < t; n++)
        e.cleanups[n]();
      e.cleanupsLength = 0;
    }
  }
  function Pn(e, t = false) {
    We instanceof Dn && (We.cleanups[We.cleanupsLength++] = () => Fn(e));
  }
  function Fn(e) {
    let t = k();
    try {
      e();
    } finally {
      k(t);
    }
  }
  var In;
  var Ln = class {
    constructor(e = false) {
      this.deps = undefined, this.depsTail = undefined, this.subs = undefined, this.subsTail = undefined, this.flags = 0, this.cleanups = [], this.cleanupsLength = 0, !e && In && $e(this, In);
    }
    get active() {
      return !(this.flags & 1024);
    }
    pause() {
      if (!(this.flags & 256)) {
        this.flags |= 256;
        for (let e = this.deps;e !== undefined; e = e.nextDep) {
          let t = e.dep;
          `pause` in t && t.pause();
        }
      }
    }
    resume() {
      let e = this.flags;
      if (e & 256) {
        this.flags = e & -257;
        for (let e = this.deps;e !== undefined; e = e.nextDep) {
          let t = e.dep;
          `resume` in t && t.resume();
        }
      }
    }
    run(e) {
      let t = In;
      try {
        return In = this, e();
      } finally {
        In = t;
      }
    }
    stop() {
      if (!this.active)
        return;
      this.flags = 1024, this.reset();
      let e = this.subs;
      e !== undefined && et(e);
    }
    reset() {
      let e = this.deps;
      for (;e !== undefined; ) {
        let t = e.dep;
        `stop` in t ? (e = e.nextDep, t.stop()) : e = et(e, this);
      }
      Nn(this);
    }
  };
  function zn() {
    return In;
  }
  function Bn(e) {
    try {
      return In;
    } finally {
      In = e;
    }
  }
  function Vn(e, t = false) {
    In !== undefined && (In.cleanups[In.cleanupsLength++] = e);
  }
  var Hn = class {
    get effect() {
      return this;
    }
    get dep() {
      return this;
    }
    get _dirty() {
      let e = this.flags;
      if (e & 16)
        return true;
      if (e & 32) {
        if (at(this.deps, this))
          return this.flags = e | 16, true;
        this.flags = e & -33;
      }
      return false;
    }
    set _dirty(e) {
      e ? this.flags |= 16 : this.flags &= -49;
    }
    constructor(e, t) {
      this.fn = e, this.setter = t, this._value = undefined, this.subs = undefined, this.subsTail = undefined, this.deps = undefined, this.depsTail = undefined, this.flags = 17, this.__v_isRef = true, this.__v_isReadonly = !t;
    }
    get value() {
      let e = this.flags;
      if (e & 16 || e & 32 && at(this.deps, this)) {
        if (this.update()) {
          let e = this.subs;
          e !== undefined && ot(e);
        }
      } else
        e & 32 && (this.flags = e & -33);
      return We === undefined ? In !== undefined && $e(this, In) : $e(this, We), this._value;
    }
    set value(e) {
      this.setter && this.setter(e);
    }
    update() {
      let e = nt(this);
      try {
        let e = this._value, t = this.fn(e);
        return O(e, t) ? (this._value = t, true) : false;
      } finally {
        rt(this, e);
      }
    }
  };
  function Un(e, t, n = false) {
    let r, i;
    return _(e) ? r = e : (r = e.get, i = e.set), new Hn(r, i);
  }
  var Kn = {};
  var qn;
  function Yn(e, t = false, n = qn) {
    if (n) {
      let { call: t } = n.options;
      t ? n.cleanups[n.cleanupsLength++] = () => t(e, 4) : n.cleanups[n.cleanupsLength++] = e;
    }
  }
  var Xn = class extends Dn {
    constructor(e, n, i = t) {
      let { deep: a, once: o, call: s, onWarn: c } = i, l, u = false, d = false;
      if (j(e) ? (l = () => e.value, u = an(e)) : nn(e) ? (l = () => Zn(e, a), u = true) : f(e) ? (d = true, u = e.some((e) => nn(e) || an(e)), l = () => e.map((e) => {
        if (j(e))
          return e.value;
        if (nn(e))
          return Zn(e, a);
        if (_(e))
          return s ? s(e, 2) : e();
      })) : l = _(e) ? n ? s ? () => s(e, 2) : e : () => {
        if (this.cleanupsLength) {
          let e = k();
          try {
            Nn(this);
          } finally {
            k(e);
          }
        }
        let t = qn;
        qn = this;
        try {
          return s ? s(e, 3, [this.boundCleanup]) : e(this.boundCleanup);
        } finally {
          qn = t;
        }
      } : r, n && a) {
        let e = l, t = a === true ? 1 / 0 : a;
        l = () => $n(e(), t);
      }
      if (super(l), this.cb = n, this.options = i, this.boundCleanup = (e) => Yn(e, false, this), this.forceTrigger = u, this.isMultiSource = d, o && n) {
        let e = n;
        n = (...t) => {
          let n = e(...t);
          return this.stop(), n;
        };
      }
      this.cb = n, this.oldValue = d ? Array(e.length).fill(Kn) : Kn;
    }
    run(e = false) {
      let t = this.oldValue, n = this.oldValue = super.run();
      if (!this.cb)
        return;
      let { immediate: r, deep: i, call: a } = this.options;
      if (!(e && !r) && (e || i || this.forceTrigger || (this.isMultiSource ? n.some((e, n) => O(e, t[n])) : O(n, t)))) {
        Nn(this);
        let e = qn;
        qn = this;
        try {
          let e = [n, t === Kn ? undefined : this.isMultiSource && t[0] === Kn ? [] : t, this.boundCleanup];
          a ? a(this.cb, 3, e) : this.cb(...e);
        } finally {
          qn = e;
        }
      }
    }
  };
  function Zn(e, t) {
    return t ? e : an(e) || t === false || t === 0 ? $n(e, 1) : $n(e);
  }
  function Qn(e, n, r = t) {
    let i = new Xn(e, n, r);
    i.run(true);
    let a = i.stop.bind(i);
    return a.pause = i.pause.bind(i), a.resume = i.resume.bind(i), a.stop = a, a;
  }
  function $n(e, t = 1 / 0, n) {
    if (t <= 0 || !b(e) || e.__v_skip || (n = n || new Map, (n.get(e) || 0) >= t))
      return e;
    if (n.set(e, t), t--, j(e))
      $n(e.value, t, n);
    else if (f(e))
      for (let r = 0;r < e.length; r++)
        $n(e[r], t, n);
    else if (m(e) || p(e))
      e.forEach((e) => {
        $n(e, t, n);
      });
    else if (w(e)) {
      for (let r in e)
        $n(e[r], t, n);
      for (let r of Object.getOwnPropertySymbols(e))
        Object.prototype.propertyIsEnumerable.call(e, r) && $n(e[r], t, n);
    }
    return e;
  }
  function fr(e, t, n, r) {
    try {
      return r ? e(...r) : e();
    } catch (e) {
      mr(e, t, n);
    }
  }
  function pr(e, t, n, r) {
    if (_(e)) {
      let i = fr(e, t, n, r);
      return i && x(i) && i.catch((e) => {
        mr(e, t, n);
      }), i;
    }
    if (f(e)) {
      let i = [];
      for (let a = 0;a < e.length; a++)
        i.push(pr(e[a], t, n, r));
      return i;
    }
  }
  function mr(e, n, r, i = true) {
    let { errorHandler: a, throwUnhandledErrorInProduction: o } = n && n.appContext.config || t;
    if (n) {
      let t = n.parent, i = n.proxy || n, o = `https://vuejs.org/error-reference/#runtime-${r}`;
      for (;t; ) {
        let n = t.ec;
        if (n) {
          for (let t = 0;t < n.length; t++)
            if (n[t](e, i, o) === false)
              return;
        }
        t = t.parent;
      }
      if (a) {
        let t = k();
        fr(a, null, 10, [e, i, o]), k(t);
        return;
      }
    }
    hr(e, r, n, i, o);
  }
  function hr(e, t, n, r = true, i = false) {
    if (i)
      throw e;
    console.error(e);
  }
  var _r = [];
  var vr = [];
  var yr = null;
  var br = null;
  var xr = 0;
  var Sr = 0;
  var Cr = 0;
  var wr = Promise.resolve();
  function Tr(e) {
    let t = br || wr;
    return e ? t.then(this ? e.bind(this) : e) : t;
  }
  function Er(e, t, n, r) {
    for (;n < r; ) {
      let i = n + r >>> 1;
      t[i].order <= e ? n = i + 1 : r = i;
    }
    return n;
  }
  function Dr(e, t, n = false, r = 0) {
    Or(e, t === undefined ? n ? -2 : 1 / 0 : n ? t * 2 : r ? t * 2 + 1 + r / (r + 1) : t * 2 + 1, _r, xr, Sr) && (xr++, Ar());
  }
  function Or(e, t, n, r, i) {
    let a = e.flags;
    return a & 1 ? false : (e.flags = a | 1, e.order = t, i === r || t >= n[r - 1].order ? n[r] = e : n.splice(Er(t, n, i, r), 0, e), true);
  }
  var kr = () => {
    try {
      Fr();
    } catch (e) {
      throw br = null, e;
    }
  };
  function Ar() {
    br || (br = wr.then(kr));
  }
  function M(e, t = 1 / 0) {
    if (!f(e))
      yr && t === -1 ? yr.splice(Cr, 0, e) : Or(e, t, vr, vr.length, 0);
    else
      for (let n of e)
        Or(n, t, vr, vr.length, 0);
    Ar();
  }
  function jr(e, t) {
    for (let t = Sr;t < xr; t++) {
      let n = _r[t];
      n.order & 1 || n.order === 1 / 0 || e && n.order !== e.uid * 2 || (_r.splice(t, 1), t--, xr--, n.flags & 2 && (n.flags &= -2), n(), n.flags & 2 || (n.flags &= -2));
    }
  }
  function Mr(e) {
    if (vr.length) {
      if (yr) {
        yr.push(...vr), vr.length = 0;
        return;
      }
      for (yr = vr, vr = [];Cr < yr.length; ) {
        let e = yr[Cr++];
        if (e.flags & 2 && (e.flags &= -2), !(e.flags & 4))
          try {
            e();
          } finally {
            e.flags &= -2;
          }
      }
      yr = null, Cr = 0;
    }
  }
  var Nr = false;
  function Pr(e) {
    Nr || (Nr = true, jr(e), Mr(), Nr = false);
  }
  function Fr(e) {
    try {
      for (;Sr < xr; ) {
        let e = _r[Sr];
        if (_r[Sr++] = undefined, !(e.flags & 4)) {
          e.flags & 2 && (e.flags &= -2);
          try {
            e();
          } catch (t) {
            mr(t, e.i, e.i ? 15 : 14);
          } finally {
            e.flags & 2 || (e.flags &= -2);
          }
        }
      }
    } finally {
      for (;Sr < xr; )
        _r[Sr].flags &= -2, _r[Sr++] = undefined;
      Sr = 0, xr = 0, _r.length = 0, Mr(e), br = null, (xr || vr.length) && Fr(e);
    }
  }
  var Ir = new Map;
  var Vr = [];
  function Hr(e, ...t) {
    Vr.push({ event: e, args: t });
  }
  var Ur = Wr(`component:added`);
  function Wr(e) {
    return (t) => {
      Hr(e, t.appContext.app, t.uid, t.parent ? t.parent.uid : undefined, t);
    };
  }
  var Gr = null;
  var Kr = null;
  var ni = Symbol.for(`v-scx`);
  function ii(e, t) {
    return li(e, null, t);
  }
  function si(e, t, n) {
    return li(e, t, n);
  }
  var ci = class extends Xn {
    constructor(e, t, n, r, i) {
      super(t, n, r), this.flush = i;
      let a = () => {
        this.dirty && this.run();
      };
      n && (this.flags |= 128, a.flags |= 2), e && (a.i = e), this.job = a;
    }
    notify() {
      if (!(this.flags & 256)) {
        let e = this.flush, t = this.job;
        e === `post` ? F(t, undefined, t.i ? t.i.suspense : null) : e === `pre` ? Dr(t, t.i ? t.i.uid : undefined, true) : t();
      }
    }
  };
  function li(e, n, r = t) {
    let { immediate: i, deep: a, flush: o = `pre`, once: s } = r, l = c({}, r), u = B;
    l.call = (e, t, n) => pr(e, u, t, n);
    let d = new ci(u, e, n, l, o);
    n ? d.run(true) : o === `post` ? F(d.job, undefined, u && u.suspense) : d.run(true);
    let f = d.stop.bind(d);
    return f.pause = d.pause.bind(d), f.resume = d.resume.bind(d), f.stop = f, f;
  }
  function ui(e, t, n) {
    let r = this.proxy, i = v(e) ? e.includes(`.`) ? di(r, e) : () => r[e] : e.bind(r, r), a;
    _(t) ? a = t : (a = t.handler, n = t);
    let o = V(this), s = li(i, a.bind(r), n);
    return V(...o), s;
  }
  function di(e, t) {
    let n = t.split(`.`);
    return () => {
      let t = e;
      for (let e = 0;e < n.length && t; e++)
        t = t[n[e]];
      return t;
    };
  }
  var fi = new WeakMap;
  var pi = Symbol(`_vte`);
  var mi = (e) => e.__isTeleport;
  var hi = (e) => e && (e.disabled || e.disabled === ``);
  var gi = (e) => e && (e.defer || e.defer === ``);
  var yi = (e, t) => {
    let n = e && e.to;
    return v(n) ? t ? t(n) : null : n;
  };
  var Ei = Symbol(`_leaveCb`);
  var Di = Symbol(`_enterCb`);
  function Oi() {
    let e = { isMounted: false, isLeaving: false, isUnmounting: false, leavingNodes: new Map };
    return $a(() => {
      e.isMounted = true;
    }), no(() => {
      e.isUnmounting = true;
    }), e;
  }
  var ki = [Function, Array];
  var Ai = { mode: String, appear: Boolean, persisted: Boolean, onBeforeEnter: ki, onEnter: ki, onAfterEnter: ki, onEnterCancelled: ki, onBeforeLeave: ki, onLeave: ki, onAfterLeave: ki, onLeaveCancelled: ki, onBeforeAppear: ki, onAppear: ki, onAfterAppear: ki, onAppearCancelled: ki };
  var ji = (e) => {
    let t = yc(e.type) ? e.block : e.subTree;
    return t.component ? ji(t.component) : t;
  };
  var Mi = { name: `BaseTransition`, props: Ai, setup(e, { slots: t }) {
    let n = dl(), r = Oi();
    return () => {
      let i = t.default && Vi(t.default(), true), a = i && i.length ? Ni(i) : n.subTree ? il() : undefined;
      if (!a)
        return;
      let o = A(e), { mode: s } = o;
      if (r.isLeaving)
        return Ri(a);
      let c = zi(a);
      if (!c)
        return Ri(a);
      let l = Ii(c, o, r, n, (e) => l = e);
      c.type !== L && Bi(c, l);
      let u = n.subTree && zi(n.subTree);
      if (u && u.type !== L && !qc(u, c) && ji(n).type !== L) {
        let e = Ii(u, o, r, n);
        if (Bi(u, e), s === `out-in` && c.type !== L)
          return r.isLeaving = true, e.afterLeave = () => {
            r.isLeaving = false, n.job.flags & 4 || n.update(), delete e.afterLeave, u = undefined;
          }, Ri(a);
        s === `in-out` && c.type !== L ? e.delayLeave = (e, t, n) => {
          let i = Fi(r, u);
          i[String(u.key)] = u, e[Ei] = () => {
            t(), e[Ei] = undefined, delete l.delayedLeave, u = undefined;
          }, l.delayedLeave = () => {
            n(), delete l.delayedLeave, u = undefined;
          };
        } : u = undefined;
      } else
        u && (u = undefined);
      return a;
    };
  } };
  function Ni(e) {
    let t = e[0];
    if (e.length > 1) {
      for (let n of e)
        if (n.type !== L) {
          t = n;
          break;
        }
    }
    return t;
  }
  var Pi = Mi;
  function Fi(e, t) {
    let { leavingNodes: n } = e, r = n.get(t.type);
    return r || (r = Object.create(null), n.set(t.type, r)), r;
  }
  function Ii(e, t, n, r, i) {
    let a = String(e.key), o = Fi(n, e);
    return Li({ isLeaving: () => o[a] === e, setLeavingNodeCache: () => {
      o[a] = e;
    }, unsetLeavingNodeCache: () => {
      o[a] === e && delete o[a];
    }, earlyRemove: () => {
      let t = o[a];
      t && qc(e, t) && t.el[Ei] && t.el[Ei]();
    }, cloneHooks: (e) => {
      let a = Ii(e, t, n, r, i);
      return i && i(a), a;
    } }, t, n, r);
  }
  function Li(e, t, n, r) {
    let { isLeaving: i, setLeavingNodeCache: a, unsetLeavingNodeCache: o, earlyRemove: s, cloneHooks: c } = e, { appear: l, mode: u, persisted: d = false, onBeforeEnter: p, onEnter: m, onAfterEnter: h, onEnterCancelled: g, onBeforeLeave: _, onLeave: v, onAfterLeave: y, onLeaveCancelled: b, onBeforeAppear: x, onAppear: S, onAfterAppear: C, onAppearCancelled: ee } = t, w = (e, t) => {
      e && pr(e, r, 9, t);
    }, T = (e, t) => {
      let n = t[1];
      w(e, t), f(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
    }, E = { mode: u, persisted: d, beforeEnter(e) {
      let t = p;
      if (!n.isMounted)
        if (l)
          t = x || p;
        else
          return;
      e[Ei] && e[Ei](true), s(), w(t, [e]);
    }, enter(e) {
      if (i())
        return;
      let t = m, r = h, a = g;
      if (!n.isMounted)
        if (l)
          t = S || m, r = C || h, a = ee || g;
        else
          return;
      let o = false;
      e[Di] = (t) => {
        o || (o = true, w(t ? a : r, [e]), E.delayedLeave && E.delayedLeave(), e[Di] = undefined);
      };
      let s = e[Di].bind(null, false);
      t ? T(t, [e, s]) : s();
    }, leave(e, t) {
      if (e[Di] && e[Di](true), n.isUnmounting)
        return t();
      w(_, [e]);
      let r = false;
      e[Ei] = (n) => {
        r || (r = true, t(), w(n ? b : y, [e]), e[Ei] = undefined, o(e));
      }, a(e);
      let i = e[Ei].bind(null, false);
      v ? T(v, [e, i]) : i();
    }, clone(e) {
      return c(e);
    } };
    return E;
  }
  function Ri(e) {
    if (za(e))
      return e = el(e), e.children = null, e;
  }
  function zi(e) {
    if (!za(e))
      return mi(e.type) && e.children ? Ni(e.children) : e;
    if (e.component)
      return e.component.subTree;
    let { shapeFlag: t, children: n } = e;
    if (n) {
      if (t & 16)
        return n[0];
      if (t & 32 && _(n.default))
        return n.default();
    }
  }
  function Bi(e, t) {
    e.shapeFlag & 6 && e.component ? yc(e.type) ? vc(e.component, e).setTransitionHooks(e.component, t) : (e.transition = t, Bi(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
  }
  function Vi(e, t = false, n) {
    let r = [], i = 0;
    for (let a = 0;a < e.length; a++) {
      let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
      o.type === I ? (o.patchFlag & 128 && i++, r = r.concat(Vi(o.children, t, s))) : (t || o.type !== L) && r.push(s == null ? o : el(o, { key: s }));
    }
    if (i > 1)
      for (let e = 0;e < r.length; e++)
        r[e].patchFlag = -2;
    return r;
  }
  function Gi(e) {
    e.ids = [e.ids[0] + e.ids[2]++ + `-`, 0, 0];
  }
  var Ki = new WeakSet;
  var Yi = new WeakMap;
  var ta = false;
  var na = false;
  var ra = () => {
    na || (console.error(`Hydration completed but contains mismatches.`), na = true);
  };
  var la = (e) => e.nodeType === 1 && e.tagName === `TEMPLATE`;
  var _a = `data-allow-mismatch`;
  var ya = { 0: `text`, 1: `children`, 2: `class`, 3: `style`, 4: `attribute` };
  function ba(e, t) {
    if (t === 0 || t === 1)
      for (;e && !e.hasAttribute(_a); )
        e = e.parentElement;
    return xa(e && e.getAttribute(_a), t);
  }
  function xa(e, t) {
    if (e == null)
      return false;
    if (e === ``)
      return true;
    {
      let n = e.split(`,`);
      return t === 0 && n.includes(`children`) ? true : n.includes(ya[t]);
    }
  }
  var P = (e) => !!e.type.__asyncLoader;
  var za = (e) => e.type.__isKeepAlive;
  function Va(e, t) {
    return f(e) ? e.some((e) => Va(e, t)) : v(e) ? e.split(`,`).includes(t) : g(e) ? (e.lastIndex = 0, e.test(t)) : false;
  }
  function Ka(e) {
    e.shapeFlag &= -257, e.shapeFlag &= -513;
  }
  function Xa(e, t, n = B, r = false) {
    if (n) {
      let i = n[e] || (n[e] = []), a = t.__weh || (t.__weh = (...r) => {
        let i = k(), a = V(n);
        try {
          return pr(t, n, e, r);
        } finally {
          V(...a), k(i);
        }
      });
      return r ? i.unshift(a) : i.push(a), a;
    }
  }
  var Za = (e) => (t, n = B) => {
    (!fl || e === `sp`) && Xa(e, (...e) => t(...e), n);
  };
  var Qa = Za(`bm`);
  var $a = Za(`m`);
  var eo = Za(`bu`);
  var to = Za(`u`);
  var no = Za(`bum`);
  var ro = Za(`um`);
  var io = Za(`sp`);
  var ao = Za(`rtg`);
  var oo = Za(`rtc`);
  var lo = Symbol.for(`v-ndc`);
  function uo(e) {
    return v(e) ? po(`components`, e, false) || e : e || lo;
  }
  function po(e, t, n = true, r = false) {
    let i = Gr || B;
    if (i) {
      let n = i.type;
      if (e === `components`) {
        let e = Ll(n, false);
        if (e && (e === t || e === D(t) || e === se(D(t))))
          return n;
      }
      let a = mo(i[e] || n[e], t) || mo(i.appContext[e], t);
      return !a && r ? n : a;
    }
  }
  function mo(e, t) {
    return e && (e[t] || e[D(t)] || e[se(D(t))]);
  }
  var xo = (e) => !e || e.vapor ? null : Sl(e) ? Pl(e) : xo(e.parent);
  var So;
  var Co = () => (So || (So = c(Object.create(null), { $: (e) => e, $el: (e) => e.vnode.el, $data: (e) => e.data, $props: (e) => e.props, $attrs: (e) => e.attrs, $slots: (e) => e.slots, $refs: (e) => e.refs, $parent: (e) => xo(e.parent), $root: (e) => xo(e.root), $host: (e) => e.ce, $emit: (e) => e.emit, $options: (e) => qo(e), $forceUpdate: (e) => e.f || (e.f = () => {
    Dr(e.update);
  }), $nextTick: (e) => e.n || (e.n = Tr.bind(e.proxy)), $watch: (e) => ui.bind(e) })), So);
  var wo = (e, n) => e !== t && !e.__isScriptSetup && d(e, n);
  var To = { get({ _: e }, n) {
    if (n === `__v_skip`)
      return true;
    let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
    if (n[0] !== `$`) {
      let e = s[n];
      if (e !== undefined)
        switch (e) {
          case 1:
            return i[n];
          case 2:
            return a[n];
          case 4:
            return r[n];
          case 3:
            return o[n];
        }
      else if (wo(i, n))
        return s[n] = 1, i[n];
      else if (a !== t && d(a, n))
        return s[n] = 2, a[n];
      else if (d(o, n))
        return s[n] = 3, o[n];
      else if (r !== t && d(r, n))
        return s[n] = 4, r[n];
      else
        Ho && (s[n] = 0);
    }
    let u = Co()[n], f, p;
    if (u)
      return n === `$attrs` && pt(e.attrs, `get`, ``), u(e);
    if ((f = c.__cssModules) && (f = f[n]))
      return f;
    if (r !== t && d(r, n))
      return s[n] = 4, r[n];
    if (p = l.config.globalProperties, d(p, n))
      return p[n];
  }, set({ _: e }, n, r) {
    let { data: i, setupState: a, ctx: o } = e;
    return wo(a, n) ? (a[n] = r, true) : i !== t && d(i, n) ? (i[n] = r, true) : d(e.props, n) || n[0] === `$` && (n.slice(1) in e) ? false : (o[n] = r, true);
  }, has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
    let l;
    return !!(r[c] || e !== t && c[0] !== `$` && d(e, c) || wo(n, c) || d(o, c) || d(i, c) || d(Co(), c) || d(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
  }, defineProperty(e, t, n) {
    return n.get == null ? d(n, `value`) && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
  } };
  var Eo = c({}, To, { get(e, t) {
    if (t !== Symbol.unscopables)
      return To.get(e, t, e);
  }, has(e, t) {
    return t[0] !== `_` && !_e(t);
  } });
  function Lo(e) {
    return f(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
  }
  var Ho = true;
  function qo(e) {
    let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
    return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Jo(c, e, o, true)), Jo(c, t, o)), b(t) && a.set(t, c), c;
  }
  function Jo(e, t, n, r = false) {
    let { mixins: i, extends: a } = t;
    a && Jo(e, a, n, true), i && i.forEach((t) => Jo(e, t, n, true));
    for (let i in t)
      if (!(r && i === `expose`)) {
        let r = Yo[i] || n && n[i];
        e[i] = r ? r(e[i], t[i]) : t[i];
      }
    return e;
  }
  var Yo = { data: Xo, props: ts, emits: ts, methods: es, computed: es, beforeCreate: $o, created: $o, beforeMount: $o, mounted: $o, beforeUpdate: $o, updated: $o, beforeDestroy: $o, beforeUnmount: $o, destroyed: $o, unmounted: $o, activated: $o, deactivated: $o, errorCaptured: $o, serverPrefetch: $o, components: es, directives: es, watch: ns, provide: Xo, inject: Zo };
  function Xo(e, t) {
    return t ? e ? function() {
      return c(_(e) ? e.call(this, this) : e, _(t) ? t.call(this, this) : t);
    } : t : e;
  }
  function Zo(e, t) {
    return es(Qo(e), Qo(t));
  }
  function Qo(e) {
    if (f(e)) {
      let t = {};
      for (let n = 0;n < e.length; n++)
        t[e[n]] = e[n];
      return t;
    }
    return e;
  }
  function $o(e, t) {
    return e ? [...new Set([].concat(e, t))] : t;
  }
  function es(e, t) {
    return e ? c(Object.create(null), e, t) : t;
  }
  function ts(e, t) {
    return e ? f(e) && f(t) ? [...new Set([...e, ...t])] : c(Object.create(null), Lo(e), Lo(t == null ? {} : t)) : t;
  }
  function ns(e, t) {
    if (!e)
      return t;
    if (!t)
      return e;
    let n = c(Object.create(null), e);
    for (let r in t)
      n[r] = $o(e[r], t[r]);
    return n;
  }
  function rs() {
    return { app: null, config: { isNativeTag: i, performance: false, globalProperties: {}, optionMergeStrategies: {}, errorHandler: undefined, warnHandler: undefined, compilerOptions: {} }, mixins: [], components: {}, directives: {}, provides: Object.create(null), optionsCache: new WeakMap, propsCache: new WeakMap, emitsCache: new WeakMap };
  }
  var is = 0;
  function as(e, t, n, r) {
    return function(r, i = null) {
      _(r) || (r = c({}, r)), i != null && !b(i) && (i = null);
      let a = rs(), o = new WeakSet, s = [], l = false, u = a.app = { _uid: is++, _component: r, _props: i, _container: null, _context: a, _instance: null, version: Gl, get config() {
        return a.config;
      }, set config(e) {}, use(e, ...t) {
        return o.has(e) || (e && _(e.install) ? (o.add(e), e.install(u, ...t)) : _(e) && (o.add(e), e(u, ...t))), u;
      }, mixin(e) {
        return a.mixins.includes(e) || a.mixins.push(e), u;
      }, component(e, t) {
        return t ? (a.components[e] = t, u) : a.components[e];
      }, directive(e, t) {
        return t ? (a.directives[e] = t, u) : a.directives[e];
      }, mount(t, r, i) {
        if (!l) {
          let a = e(u, t, r, i);
          return l = true, u._container = t, t.__vue_app__ = u, n(a);
        }
      }, onUnmount(e) {
        s.push(e);
      }, unmount() {
        l && (pr(s, u._instance, 16), t(u), delete u._container.__vue_app__);
      }, provide(e, t) {
        return a.provides[e] = t, u;
      }, runWithContext(e) {
        let t = os;
        os = u;
        try {
          return e();
        } finally {
          os = t;
        }
      } };
      return u;
    };
  }
  var os = null;
  var cs = (e, t, n) => n(e, le(t)) || n(e, `${D(t)}Modifiers`) || n(e, `${oe(t)}Modifiers`);
  function us(e, t, n, r, ...i) {
    if (e.isUnmounted)
      return;
    let a = i, o = r.startsWith(`update:`), s = o && cs(t, r.slice(7), n);
    s && (s.trim && (a = i.map((e) => v(e) ? e.trim() : e)), s.number && (a = i.map(fe)));
    let c, l = n(t, c = ce(r)) || n(t, c = ce(D(r)));
    !l && o && (l = n(t, c = ce(oe(r)))), l && pr(l, e, 6, a);
    let u = n(t, c + `Once`);
    if (u) {
      if (!e.emitted)
        e.emitted = {};
      else if (e.emitted[c])
        return;
      e.emitted[c] = true, pr(u, e, 6, a);
    }
  }
  var fs = new WeakMap;
  function ms(e, t) {
    return !e || !a(t) ? false : (t = t.slice(2), t = t === `Once` ? t : t.replace(/Once$/, ``), d(e, t[0].toLowerCase() + t.slice(1)) || d(e, oe(t)) || d(e, t));
  }
  var vs = (e) => {
    let t;
    for (let n in e)
      (n === `class` || n === `style` || a(n)) && ((t || (t = {}))[n] = e[n]);
    return t;
  };
  var ws = {};
  var Es = (e) => Object.getPrototypeOf(e) === ws;
  function As(e, t, n, r, i, a = false) {
    let o = e[t];
    if (o != null) {
      let e = d(o, `default`);
      if (e && n === undefined) {
        let e = o.default;
        if (o.type !== Function && !o.skipFactory && _(e)) {
          let a = r.propsDefaults || (r.propsDefaults = {});
          n = d(a, t) ? a[t] : a[t] = i(e, r, t);
        } else
          n = e;
        r.ce && r.ce._setProp(t, n);
      }
      o[0] && (a && !e ? n = false : o[1] && (n === `` || n === oe(t)) && (n = true));
    }
    return n;
  }
  var Ms = new WeakMap;
  function Ps(e, n, r) {
    if (f(e))
      for (let r = 0;r < e.length; r++) {
        let i = D(e[r]);
        Fs(i) && (n[i] = t);
      }
    else if (e)
      for (let t in e) {
        let i = D(t);
        if (Fs(i)) {
          let a = e[t], o = n[i] = f(a) || _(a) ? { type: a } : c({}, a), s = o.type, l = false, u = true;
          if (f(s))
            for (let e = 0;e < s.length; ++e) {
              let t = s[e], n = _(t) && t.name;
              if (n === `Boolean`) {
                l = true;
                break;
              } else
                n === `String` && (u = false);
            }
          else
            l = _(s) && s.name === `Boolean`;
          o[0] = l, o[1] = u, (l || d(o, `default`)) && r.push(i);
        }
      }
  }
  function Fs(e) {
    return e[0] !== `$` && !E(e);
  }
  var zs = e(`String,Number,Boolean,Function,Symbol,BigInt`);
  var F = Mc;
  function fc(e, t) {
    return (!e || e && !e.pendingBranch) && t && !t.persisted;
  }
  function hc(e) {
    if (e)
      for (let t = 0;t < e.length; t++)
        e[t].flags |= 4;
  }
  function gc(e, t, n, r, i = false) {
    if (i && t.persisted && !e[Ei]) {
      n();
      return;
    }
    i || fc(r, t) ? (t.beforeEnter(e), n(), F(() => t.enter(e), undefined, r)) : n();
  }
  function _c(e, t, n, r = true, i = false) {
    let a = () => {
      n(), t && !t.persisted && t.afterLeave && t.afterLeave();
    };
    if (i || r && t && !t.persisted) {
      let { leave: n, delayLeave: r } = t, o = () => {
        e._isLeaving && i && e[Ei](true), n(e, a);
      };
      r ? r(e, a, o) : o();
    } else
      a();
  }
  function vc(e, t) {
    let n = e ? e.appContext : t.appContext;
    return n && n.vapor;
  }
  function yc(e) {
    return e.__vapor;
  }
  function bc(e, t) {
    let n = [], r = t, i = e;
    for (;r; ) {
      let e = r.subTree;
      if (!e)
        break;
      if (i === e || Sc(e.type) && (e.ssContent === i || e.ssFallback === i)) {
        let e = r.vnode;
        e.scopeId && n.push(e.scopeId), e.slotScopeIds && n.push(...e.slotScopeIds), i = e, r = r.parent;
      } else
        break;
    }
    return n;
  }
  var Sc = (e) => e.__isSuspense;
  function Mc(e, t, n) {
    n && n.pendingBranch ? f(e) ? n.effects.push(...e) : n.effects.push(e) : M(e, t);
  }
  var I = Symbol.for(`v-fgt`);
  var Fc = Symbol.for(`v-txt`);
  var L = Symbol.for(`v-cmt`);
  var Ic = Symbol.for(`v-stc`);
  var Lc = Symbol.for(`v-vps`);
  var Rc = [];
  var zc = null;
  function Bc(e = false) {
    Rc.push(zc = e ? null : []);
  }
  function Vc() {
    Rc.pop(), zc = Rc[Rc.length - 1] || null;
  }
  var Hc = 1;
  function Uc(e, t = false) {
    Hc += e, e < 0 && zc && t && (zc.hasOnce = true);
  }
  function Wc(e) {
    return e.dynamicChildren = Hc > 0 ? zc || n : null, Vc(), Hc > 0 && zc && zc.push(e), e;
  }
  function Kc(e, t, n, r, i) {
    return Wc(z(e, t, n, r, i, true));
  }
  function R(e) {
    return e ? e.__v_isVNode === true : false;
  }
  function qc(e, t) {
    return e.type === t.type && e.key === t.key;
  }
  var Yc = ({ key: e }) => e == null ? null : e;
  var Xc = ({ ref: e, ref_key: t, ref_for: n }, r = Gr) => (typeof e == `number` && (e = `` + e), e == null ? null : v(e) || j(e) || _(e) ? { i: r, r: e, k: t, f: !!n } : e);
  function Zc(e, t = null, n = null, r = 0, i = null, a = e === I ? 0 : 1, o = false, s = false) {
    let c = { __v_isVNode: true, __v_skip: true, type: e, props: t, key: t && Yc(t), ref: t && Xc(t), scopeId: Kr, slotScopeIds: null, children: n, component: null, suspense: null, ssContent: null, ssFallback: null, dirs: null, transition: null, el: null, anchor: null, target: null, targetStart: null, targetAnchor: null, staticCount: 0, shapeFlag: a, patchFlag: r, dynamicProps: i, dynamicChildren: null, appContext: null, ctx: Gr };
    return s ? (sl(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= v(n) ? 8 : 16), Hc > 0 && !o && zc && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && zc.push(c), c;
  }
  var z = Qc;
  function Qc(e, t = null, n = null, r = 0, i = null, a = false) {
    if ((!e || e === lo) && (e = L), R(e)) {
      let r = el(e, t, true);
      return n && sl(r, n), Hc > 0 && !a && zc && (r.shapeFlag & 6 ? zc[zc.indexOf(e)] = r : zc.push(r)), r.patchFlag = -2, r;
    }
    if (zl(e) && (e = e.__vccOpts), t) {
      t = $c(t);
      let { class: e, style: n } = t;
      e && !v(e) && (t.class = Ce(e)), b(n) && (on(n) && !f(n) && (n = c({}, n)), t.style = ve(n));
    }
    let o = v(e) ? 1 : Sc(e) ? 128 : mi(e) ? 64 : b(e) ? 4 : _(e) ? 2 : 0;
    return Zc(e, t, n, r, i, o, a, true);
  }
  function $c(e) {
    return e ? on(e) || Es(e) ? c({}, e) : e : null;
  }
  function el(e, t, n = false, r = false) {
    let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? cl(i || {}, t) : i, u = { __v_isVNode: true, __v_skip: true, type: e.type, props: l, key: l && Yc(l), ref: t && t.ref ? n && a ? f(a) ? a.concat(Xc(t)) : [a, Xc(t)] : Xc(t) : a, scopeId: e.scopeId, slotScopeIds: e.slotScopeIds, children: s, target: e.target, targetStart: e.targetStart, targetAnchor: e.targetAnchor, staticCount: e.staticCount, shapeFlag: e.shapeFlag, patchFlag: t && e.type !== I ? o === -1 ? 16 : o | 16 : o, dynamicProps: e.dynamicProps, dynamicChildren: e.dynamicChildren, appContext: e.appContext, dirs: e.dirs, transition: c, component: e.component, suspense: e.suspense, ssContent: e.ssContent && el(e.ssContent), ssFallback: e.ssFallback && el(e.ssFallback), placeholder: e.placeholder, el: e.el, anchor: e.anchor, ctx: e.ctx, ce: e.ce, vi: e.vi, vs: tl(e), vb: e.vb };
    return c && r && Bi(u, c.clone(u)), u;
  }
  function tl(e) {
    let t = e.vs;
    if (!t)
      return t;
    let n = { slot: t.slot, fallback: t.fallback, outletFallback: t.outletFallback };
    return e.el && (n.state = t.state, n.ref = t.ref, n.scope = t.scope), n;
  }
  function nl(e = ` `, t = 0) {
    return z(Fc, null, e, t);
  }
  function il(e = ``, t = false) {
    return t ? (Bc(), Kc(L, null, e)) : z(L, null, e);
  }
  function sl(e, t) {
    let n = 0, { shapeFlag: r } = e;
    if (t == null)
      t = null;
    else if (f(t))
      n = 16;
    else if (typeof t == `object`)
      if (r & 65) {
        let n = t.default;
        n && (n._c && (n._d = false), sl(e, n()), n._c && (n._d = true));
        return;
      } else {
        n = 32;
        let r = t._;
        !r && !Es(t) ? t._ctx = Gr : r === 3 && Gr && (Gr.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
      }
    else if (_(t)) {
      if (r & 65) {
        sl(e, { default: t });
        return;
      }
      t = { default: t, _ctx: Gr }, n = 32;
    } else
      t = String(t), r & 64 ? (n = 16, t = [nl(t)]) : n = 8;
    e.children = t, e.shapeFlag |= n;
  }
  function cl(...e) {
    let t = {};
    for (let n = 0;n < e.length; n++) {
      let r = e[n];
      for (let e in r)
        if (e === `class`)
          t.class !== r.class && (t.class = Ce([t.class, r.class]));
        else if (e === `style`)
          t.style = ve([t.style, r.style]);
        else if (a(e)) {
          let n = t[e], i = r[e];
          i && n !== i && !(f(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !s(e) && (t[e] = i);
        } else
          e !== `` && (t[e] = r[e]);
    }
    return t;
  }
  var B = null;
  var dl = () => B && !B.vapor ? B : Gr;
  var fl = false;
  var pl;
  var ml = (e) => {
    B = e;
  };
  pl = (e) => {
    fl = e;
  };
  var V = (e, t = e === null ? undefined : e.scope) => {
    try {
      return [B, Bn(t)];
    } finally {
      ml(e);
    }
  };
  var _l = rs();
  var vl = 0;
  function yl() {
    return vl++;
  }
  function Sl(e) {
    return e.vnode.shapeFlag & 4;
  }
  function Nl(e, t) {
    e.exposed = t || {};
  }
  function Pl(e) {
    return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(yn(sn(e.exposed)), { get(t, n) {
      if (n in t)
        return t[n];
      {
        let t = Co();
        if (n in t)
          return t[n](e);
      }
    }, has(e, t) {
      let n = Co();
      return t in e || t in n;
    } })) : e.proxy;
  }
  function Ll(e, t = true) {
    return _(e) ? e.displayName || e.name : e.name || t && e.__name;
  }
  function zl(e) {
    return _(e) && `__vccOpts` in e;
  }
  function Vl(e, t, n) {
    try {
      Uc(-1);
      let r = arguments.length;
      return r === 2 ? b(t) && !f(t) ? R(t) ? z(e, null, [t]) : z(e, t) : z(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && R(n) && (n = [n]), z(e, t, n));
    } finally {
      Uc(1);
    }
  }
  var Gl = `3.6.0-rc.1`;
  var eu;
  var tu = typeof window < `u` && window.trustedTypes;
  if (tu)
    try {
      eu = tu.createPolicy(`vue`, { createHTML: (e) => e });
    } catch (e) {}
  var nu = eu ? (e) => eu.createHTML(e) : (e) => e;
  var ru = `http://www.w3.org/2000/svg`;
  var iu = typeof globalThis.__pocketDocument < `u` ? globalThis.__pocketDocument : null;
  var au = iu && iu.createElement(`template`);
  var ou = { insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  }, remove: (e) => {
    let t = e.parentNode;
    t && t.removeChild(e);
  }, createElement: (e, t, n, r) => {
    let i = t === `svg` ? iu.createElementNS(ru, e) : t === `mathml` ? iu.createElementNS(`http://www.w3.org/1998/Math/MathML`, e) : n ? iu.createElement(e, { is: n }) : iu.createElement(e);
    return e === `select` && r && r.multiple != null && i.setAttribute(`multiple`, r.multiple), i;
  }, createText: (e) => iu.createTextNode(e), createComment: (e) => iu.createComment(e), setText: (e, t) => {
    e.nodeValue = t;
  }, setElementText: (e, t) => {
    e.textContent = t;
  }, parentNode: (e) => e.parentNode, nextSibling: (e) => e.nextSibling, querySelector: (e) => iu.querySelector(e), setScopeId(e, t) {
    e.setAttribute(t, ``);
  }, insertStaticContent(e, t, n, r, i, a) {
    let o = n ? n.previousSibling : t.lastChild;
    if (i && (i === a || i.nextSibling))
      for (;t.insertBefore(i.cloneNode(true), n), !(i === a || !(i = i.nextSibling)); )
        ;
    else {
      au.innerHTML = nu(r === `svg` ? `<svg>${e}</svg>` : r === `mathml` ? `<math>${e}</math>` : e);
      let i = au.content;
      if (r === `svg` || r === `mathml`) {
        let e = i.firstChild;
        for (;e.firstChild; )
          i.appendChild(e.firstChild);
        i.removeChild(e);
      }
      t.insertBefore(i, n);
    }
    return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
  } };
  var su = `transition`;
  var cu = `animation`;
  var lu = Symbol(`_vtc`);
  var uu = { name: String, type: String, css: { type: Boolean, default: true }, duration: [String, Number, Object], enterFromClass: String, enterActiveClass: String, enterToClass: String, appearFromClass: String, appearActiveClass: String, appearToClass: String, leaveFromClass: String, leaveActiveClass: String, leaveToClass: String };
  var du = c({}, Ai, uu);
  var fu = ((e) => (e.displayName = `Transition`, e.props = du, e))((e, { slots: t }) => Vl(Pi, hu(e), t));
  var pu = (e, t = []) => {
    f(e) ? e.forEach((e) => e(...t)) : e && e(...t);
  };
  var mu = (e) => e ? f(e) ? e.some((e) => e.length > 1) : e.length > 1 : false;
  function hu(e) {
    let t = {};
    for (let n in e)
      n in uu || (t[n] = e[n]);
    if (e.css === false)
      return t;
    let { name: n = `v`, type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: l = a, appearActiveClass: u = o, appearToClass: d = s, leaveFromClass: f = `${n}-leave-from`, leaveActiveClass: p = `${n}-leave-active`, leaveToClass: m = `${n}-leave-to` } = e, h = gu(i), g = h && h[0], _ = h && h[1], { onBeforeEnter: v, onEnter: y, onEnterCancelled: b, onLeave: x, onLeaveCancelled: S, onBeforeAppear: C = v, onAppear: ee = y, onAppearCancelled: w = b } = t, T = (e, t, n, r) => {
      e._enterCancelled = r, yu(e, t ? d : s), yu(e, t ? u : o), n && n();
    }, E = (e, t) => {
      e._isLeaving = false, yu(e, f), yu(e, m), yu(e, p), t && t();
    }, te = (e) => (t, n) => {
      let i = e ? ee : y, o = () => T(t, e, n);
      pu(i, [t, o]), bu(() => {
        yu(t, e ? l : a), vu(t, e ? d : s), mu(i) || Su(t, r, g, o);
      });
    };
    return c(t, { onBeforeEnter(e) {
      pu(v, [e]), vu(e, a), vu(e, o);
    }, onBeforeAppear(e) {
      pu(C, [e]), vu(e, l), vu(e, u);
    }, onEnter: te(false), onAppear: te(true), onLeave(e, t) {
      e._isLeaving = true;
      let n = () => E(e, t);
      vu(e, f), e._enterCancelled ? (vu(e, p), Eu(e)) : (Eu(e), vu(e, p)), bu(() => {
        e._isLeaving && (yu(e, f), vu(e, m), mu(x) || Su(e, r, _, n));
      }), pu(x, [e, n]);
    }, onEnterCancelled(e) {
      T(e, false, undefined, true), pu(b, [e]);
    }, onAppearCancelled(e) {
      T(e, true, undefined, true), pu(w, [e]);
    }, onLeaveCancelled(e) {
      E(e), pu(S, [e]);
    } });
  }
  function gu(e) {
    if (e == null)
      return null;
    if (b(e))
      return [_u(e.enter), _u(e.leave)];
    {
      let t = _u(e);
      return [t, t];
    }
  }
  function _u(e) {
    return pe(e);
  }
  function vu(e, t) {
    t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[lu] || (e[lu] = new Set)).add(t);
  }
  function yu(e, t) {
    t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
    let n = e[lu];
    n && (n.delete(t), n.size || (e[lu] = undefined));
  }
  function bu(e) {
    requestAnimationFrame(() => {
      requestAnimationFrame(e);
    });
  }
  var xu = 0;
  function Su(e, t, n, r) {
    let i = e._endId = ++xu, a = () => {
      i === e._endId && r();
    };
    if (n != null)
      return setTimeout(a, n);
    let { type: o, timeout: s, propCount: c } = Cu(e, t);
    if (!o)
      return r();
    let l = o + `end`, u = 0, d = () => {
      e.removeEventListener(l, f), a();
    }, f = (t) => {
      t.target === e && ++u >= c && d();
    };
    setTimeout(() => {
      u < c && d();
    }, s + 1), e.addEventListener(l, f);
  }
  function Cu(e, t) {
    let n = window.getComputedStyle(e), r = (e) => (n[e] || ``).split(`, `), i = r(`${su}Delay`), a = r(`${su}Duration`), o = wu(i, a), s = r(`${cu}Delay`), c = r(`${cu}Duration`), l = wu(s, c), u = null, d = 0, f = 0;
    t === su ? o > 0 && (u = su, d = o, f = a.length) : t === cu ? l > 0 && (u = cu, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? su : cu : null, f = u ? u === su ? a.length : c.length : 0);
    let p = u === su && /\b(?:transform|all)(?:,|$)/.test(r(`${su}Property`).toString());
    return { type: u, timeout: d, propCount: f, hasTransform: p };
  }
  function wu(e, t) {
    for (;e.length < t.length; )
      e = e.concat(e);
    return Math.max(...t.map((t, n) => Tu(t) + Tu(e[n])));
  }
  function Tu(e) {
    return e === `auto` ? 0 : Number(e.slice(0, -1).replace(`,`, `.`)) * 1000;
  }
  function Eu(e) {
    return (e ? e.ownerDocument : globalThis.__pocketDocument).body.offsetHeight;
  }
  function Du(e, t, n) {
    let r = e[lu];
    r && (t = (t ? [t, ...r] : [...r]).join(` `)), t == null ? e.removeAttribute(`class`) : n ? e.setAttribute(`class`, t) : e.className = t;
  }
  var Ou = Symbol(`_vod`);
  var ku = Symbol(`_vsh`);
  var Mu = Symbol(``);
  var Lu = /(?:^|;)\s*display\s*:/;
  function Ru(e, t, n) {
    let r = e.style, i = v(n), a = false;
    if (n && !i) {
      if (t)
        if (v(t))
          for (let e of t.split(`;`)) {
            let t = e.slice(0, e.indexOf(`:`)).trim();
            n[t] == null && Bu(r, t, ``);
          }
        else
          for (let e in t)
            n[e] == null && Bu(r, e, ``);
      for (let i in n) {
        i === `display` && (a = true);
        let o = n[i];
        o == null ? Bu(r, i, ``) : Wu(e, i, !v(t) && t ? t[i] : undefined, o) || Bu(r, i, o);
      }
    } else if (i) {
      if (t !== n) {
        let e = r[Mu];
        e && (n += `;` + e), r.cssText = n, a = Lu.test(n);
      }
    } else
      t && e.removeAttribute(`style`);
    Ou in e && (e[Ou] = a ? r.display : ``, e[ku] && (r.display = `none`));
  }
  var zu = /\s*!important$/;
  function Bu(e, t, n) {
    if (f(n))
      n.forEach((n) => Bu(e, t, n));
    else {
      let r = n == null ? `` : String(n);
      if (t.startsWith(`--`))
        e.setProperty(t, r);
      else {
        let n = Uu(e, t);
        zu.test(r) ? e.setProperty(oe(n), r.replace(zu, ``), `important`) : e[n] = r;
      }
    }
  }
  var Vu = [`Webkit`, `Moz`, `ms`];
  var Hu = {};
  function Uu(e, t) {
    let n = Hu[t];
    if (n)
      return n;
    let r = D(t);
    if (r !== `filter` && r in e)
      return Hu[t] = r;
    r = se(r);
    for (let n = 0;n < Vu.length; n++) {
      let i = Vu[n] + r;
      if (i in e)
        return Hu[t] = i;
    }
    return t;
  }
  function Wu(e, t, n, r) {
    return e.tagName === `TEXTAREA` && (t === `width` || t === `height`) && v(r) && n === r;
  }
  var Gu = `http://www.w3.org/1999/xlink`;
  function Ku(e, t, n, r, i, a = Ee(t)) {
    r && t.startsWith(`xlink:`) ? n == null ? e.removeAttributeNS(Gu, t.slice(6, t.length)) : e.setAttributeNS(Gu, t, n) : n == null || a && !Oe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? `` : y(n) ? String(n) : n);
  }
  function qu(e, t, n, r, i) {
    if (t === `innerHTML` || t === `textContent`) {
      n != null && (e[t] = t === `innerHTML` ? nu(n) : n);
      return;
    }
    let a = e.tagName;
    if (t === `value` && ge(a)) {
      let r = a === `OPTION` ? e.getAttribute(`value`) || `` : e.value, i = n == null ? e.type === `checkbox` ? `on` : `` : String(n);
      (r !== i || !(`_value` in e)) && (e.value = i), n == null && e.removeAttribute(t), e._value = n;
      return;
    }
    let o = false;
    if (n === `` || n == null) {
      let r = typeof e[t];
      r === `boolean` ? n = Oe(n) : n == null && r === `string` ? (n = ``, o = true) : r === `number` && (n = 0, o = true);
    }
    try {
      e[t] = n;
    } catch (e) {}
    o && e.removeAttribute(i || t);
  }
  function Ju(e, t, n, r) {
    e.addEventListener(t, n, r);
  }
  function Yu(e, t, n, r) {
    e.removeEventListener(t, n, r);
  }
  var Xu = Symbol(`_vei`);
  function Zu(e, t, n, r, i = null) {
    let a = e[Xu] || (e[Xu] = {}), o = a[t];
    if (r && o)
      o.value = r;
    else {
      let [n, s] = ed(t);
      r ? Ju(e, n, a[t] = id(r, i), s) : o && (Yu(e, n, o, s), a[t] = undefined);
    }
  }
  var Qu = /(Once|Passive|Capture)$/;
  var $u = /^on:?(?:Once|Passive|Capture)$/;
  function ed(e) {
    let t, n;
    for (;(n = e.match(Qu)) && !$u.test(e); )
      t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = true;
    return [e[2] === `:` ? e.slice(3) : oe(e.slice(2)), t];
  }
  var td = 0;
  var nd = Promise.resolve();
  var rd = () => td || (nd.then(() => td = 0), td = Date.now());
  function id(e, t) {
    let n = (e) => {
      if (!e._vts)
        e._vts = Date.now();
      else if (e._vts <= n.attached)
        return;
      let r = n.value;
      if (f(r)) {
        let n = e.stopImmediatePropagation;
        e.stopImmediatePropagation = () => {
          n.call(e), e._stopped = true;
        };
        let i = r.slice(), a = [e];
        for (let n = 0;n < i.length && !e._stopped; n++) {
          let e = i[n];
          e && pr(e, t, 5, a);
        }
      } else
        pr(r, t, 5, [e]);
    };
    return n.value = e, n.attached = rd(), n;
  }
  var ad = (e, t, n, r, i, o) => {
    let c = i === `svg`;
    t === `class` ? Du(e, r, c) : t === `style` ? Ru(e, n, r) : a(t) ? s(t) || Zu(e, t, n, r, o) : (t[0] === `.` ? (t = t.slice(1), true) : t[0] === `^` ? (t = t.slice(1), false) : od(e, t, r, c)) ? (qu(e, t, r, o), !e.tagName.includes(`-`) && (t === `value` || t === `checked` || t === `selected`) && Ku(e, t, r, c, o, t !== `value`)) : e._isVueCE && (sd(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(r))) ? qu(e, D(t), r, o, t) : (t === `true-value` ? e._trueValue = r : t === `false-value` && (e._falseValue = r), Ku(e, t, r, c, o));
  };
  function od(e, t, n, r) {
    return r ? !!(t === `innerHTML` || t === `textContent` || (t in e) && o(t) && _(n)) : Me(e.tagName, t) || o(t) && v(n) ? false : (t in e);
  }
  function sd(e, t) {
    let n = e._def.props;
    if (!n)
      return false;
    let r = D(t);
    return Array.isArray(n) ? n.some((e) => D(e) === r) : Object.keys(n).some((e) => D(e) === r);
  }
  var _d = new WeakMap;
  var vd = new WeakMap;
  var yd = Symbol(`_moveCb`);
  var bd = Symbol(`_enterCb`);
  var xd = ((e) => (delete e.props.mode, e))({ name: `TransitionGroup`, props: c({}, du, { tag: String, moveClass: String }), setup(e, { slots: t }) {
    let n = dl(), r = Oi(), i, a;
    return to(() => {
      if (!i.length)
        return;
      let t = e.moveClass || `${e.name || `v`}-move`;
      if (!Dd(i[0].el, n.vnode.el, t)) {
        i = [];
        return;
      }
      i.forEach((e) => Sd(e.el)), i.forEach(Cd);
      let r = i.filter(wd);
      Eu(n.vnode.el), r.forEach((e) => {
        let n = e.el;
        Od(n, t);
      }), i = [];
    }), () => {
      let o = A(e), s = hu(o), c = o.tag || I;
      if (i = [], a)
        for (let e = 0;e < a.length; e++) {
          let t = a[e];
          t.el && t.el instanceof Element && !t.el[ku] && (i.push(t), Bi(t, Ii(t, s, r, n)), _d.set(t, Ed(t.el)));
        }
      a = t.default ? Vi(t.default()) : [];
      for (let e = 0;e < a.length; e++) {
        let t = a[e];
        t.key != null && Bi(t, Ii(t, s, r, n));
      }
      return z(c, null, a);
    };
  } });
  function Sd(e) {
    e[yd] && e[yd](), e[bd] && e[bd]();
  }
  function Cd(e) {
    vd.set(e, Ed(e.el));
  }
  function wd(e) {
    if (Td(_d.get(e), vd.get(e), e.el))
      return e;
  }
  function Td(e, t, n) {
    let r = e.left - t.left, i = e.top - t.top;
    if (r || i) {
      let e = n.style, t = n.getBoundingClientRect(), a = 1, o = 1;
      return n.offsetWidth && (a = t.width / n.offsetWidth), n.offsetHeight && (o = t.height / n.offsetHeight), (!Number.isFinite(a) || a === 0) && (a = 1), (!Number.isFinite(o) || o === 0) && (o = 1), Math.abs(a - 1) < 0.01 && (a = 1), Math.abs(o - 1) < 0.01 && (o = 1), e.transform = e.webkitTransform = `translate(${r / a}px,${i / o}px)`, e.transitionDuration = `0s`, true;
    }
    return false;
  }
  function Ed(e) {
    let t = e.getBoundingClientRect();
    return { left: t.left, top: t.top };
  }
  function Dd(e, t, n) {
    let r = e.cloneNode(), i = e[lu];
    i && i.forEach((e) => {
      e.split(/\s+/).forEach((e) => e && r.classList.remove(e));
    }), n.split(/\s+/).forEach((e) => e && r.classList.add(e)), r.style.display = `none`;
    let a = t.nodeType === 1 ? t : t.parentNode;
    a.appendChild(r);
    let { hasTransform: o } = Cu(r);
    return a.removeChild(r), o;
  }
  var Od = (e, t) => {
    let n = e.style;
    vu(e, t), n.transform = n.webkitTransform = n.transitionDuration = ``;
    let r = e[yd] = (n) => {
      n && n.target !== e || (!n || n.propertyName.endsWith(`transform`)) && (e.removeEventListener(`transitionend`, r), e[yd] = null, yu(e, t));
    };
    e.addEventListener(`transitionend`, r);
  };
  var Md = Symbol(`_assign`);
  var ef = c({ patchProp: ad }, ou);
  function df(e) {
    return v(e) ? globalThis.__pocketDocument.querySelector(e) : e;
  }
  var mf;
  var hf;
  var gf;
  function vf() {
    mf = hf = gf = undefined;
  }
  var bf = false;
  var H = null;
  var U = false;
  function Sf(e) {
    if (!bf && !ta)
      return false;
    try {
      return U;
    } finally {
      U = e;
    }
  }
  var Cf = 0;
  function wf() {
    return Cf > 0;
  }
  function Tf(e) {
    Cf++;
    try {
      return e();
    } finally {
      Cf--;
    }
  }
  function Ef(e) {
    let t = Sf(false);
    try {
      return e();
    } finally {
      Sf(t);
    }
  }
  var Mf;
  var Nf;
  var W = (e, t) => e.nodeType === 8 && e.data === t;
  function G(e) {
    H = e;
  }
  function Pf(e) {
    let t = e.nextSibling;
    if (!(t && H === t)) {
      for (;!t; ) {
        let n = e.parentNode;
        if (!n)
          break;
        e = n, t = e.nextSibling;
      }
      H !== t && (H = t);
    }
  }
  function Ff(e = false) {
    let t = mf ? H : undefined;
    return Nf(e), { start: H, resume: t };
  }
  function If() {
    return { start: null, resume: mf ? H : undefined };
  }
  function Lf(e) {
    e && e.resume !== undefined && G(e.resume);
  }
  function zf(e) {
    return W(e, `[`) ? Vf(e).nextSibling : W(e, `teleport start`) ? Vf(e, `teleport start`, `teleport end`).nextSibling : e.nextSibling;
  }
  function Vf(e, t = `[`, n = `]`) {
    if (e.$fe)
      return e.$fe;
    let r = [e];
    for (;(e = up(e)) && r.length > 0; )
      if (e.nodeType === 8) {
        if (e.data === t)
          r.push(e);
        else if (e.data === n) {
          let t = r.pop();
          if (t.$fe = e, r.length === 0)
            return e;
        }
      }
    return null;
  }
  function Hf(e, t = null) {
    let n = t;
    if (!n || !W(n, `]`))
      if (W(e, `]`))
        n = e;
      else {
        let t = zf(e);
        for (;t && !W(t, `]`); )
          t = zf(t);
        n = t;
      }
    return n || e;
  }
  function Gf(e, t) {
    if (e.nodeType !== 3)
      return false;
    let n = e;
    if (n.data === t)
      return true;
    let r = n.parentElement;
    return r && !ba(r, 0) && ra(), n.data = t, true;
  }
  function qf(e, t) {
    let n = q(e);
    if (!n)
      return;
    let r = t || Vf(e);
    for (;; ) {
      let t = up(e);
      if (t && t !== r)
        Q(t, n);
      else
        break;
    }
  }
  function Jf(e, t = null) {
    let n = q(e);
    if (n) {
      if (W(e, `[`)) {
        let n = Vf(e);
        qf(e, n || undefined);
        let r = n && q(n);
        n && n !== t && r && Q(n, r);
      } else if (W(e, `teleport start`)) {
        let n = Vf(e, `teleport start`, `teleport end`);
        qf(e, n || undefined);
        let r = n && q(n);
        n && n !== t && r && Q(n, r);
      }
      Q(e, n);
    }
  }
  function Yf(e, t, n = null) {
    if (n) {
      let t = e, r = false;
      for (;t && t !== n; )
        Zf(t) || (r = true), t = zf(t);
      if (!t)
        return;
      if (!r) {
        G(n);
        return;
      }
    }
    let r = t || e.parentElement;
    if (r instanceof Element && tp(r), !t && !n) {
      Jf(e);
      return;
    }
    let i = e;
    for (;i && i !== n && (!t || i.parentNode === t); ) {
      let e = zf(i);
      Zf(i) || Jf(i, n), i = e;
    }
    n && G(n);
  }
  function Xf(e) {
    return e.$vha = 1, e;
  }
  function Zf(e) {
    return !!e && e.$vha === 1;
  }
  function $f(e) {
    return !!e && e.$rcn === 1;
  }
  function ep(e) {
    for (;; ) {
      if (Zf(e))
        return e;
      if (e.nodeType === 8 && (e.data === `[` || e.data === `]` || e.data === `teleport start` || e.data === `teleport end`)) {
        let t = e.nextSibling;
        if (!t)
          return e;
        e = t;
        continue;
      }
      return e;
    }
  }
  function tp(e) {
    e && !ba(e, 1) && ra();
  }
  function np(e) {
    return () => {
      let t = H;
      e && t && t !== e && Yf(t, undefined, e);
    };
  }
  function rp(e) {
    return globalThis.__pocketDocument.createElement(e);
  }
  function K(e = ``) {
    return globalThis.__pocketDocument.createTextNode(e);
  }
  function ip(e) {
    return globalThis.__pocketDocument.querySelector(e);
  }
  function q(e) {
    return e.parentNode;
  }
  function lp(e) {
    return e.firstChild;
  }
  function up(e) {
    return e.nextSibling;
  }
  var J = false;
  var pp = Symbol(`interop`);
  function mp(e) {
    let t = e.__emitsOptions;
    if (t)
      return t;
    let n = e.emits;
    if (!n)
      return null;
    let r;
    if (f(n)) {
      r = {};
      for (let e of n)
        r[e] = null;
    } else
      r = n;
    return e.__emitsOptions = r;
  }
  function hp(e, n, ...r) {
    us(e, e.rawProps || t, gp, n, ...r);
  }
  function gp(e, t) {
    let n = e.$;
    if (n) {
      let e = n.length;
      for (;e--; ) {
        let r = vp(n[e]);
        if (r && d(r, t))
          return J && n[pp] || a(t) && _(n[e]) ? r[t] : vp(r[t]);
      }
    }
    return e[t] && vp(e[t]);
  }
  var _p = class extends Dn {
    constructor(e, t = false) {
      super(t ? e : undefined), this.render = e;
      let n = B;
      this.order = n ? n.effectCount++ : 0;
      let r = () => {
        this.dirty && this.run();
      };
      n && (r.i = n), this.job = r, this.i = n, this.flags |= 128, this.job.flags |= 2;
    }
    fn() {
      let e = this.i, t = this.subs ? this.subs.sub : undefined, n = e && (e.bu || e.u), r = V(e, t);
      try {
        if (n && e.isMounted && !e.isUpdating) {
          e.isUpdating = true;
          try {
            e.bu && ue(e.bu), this.render();
          } catch (t) {
            throw e.isUpdating = false, t;
          }
          let t = this.updateJob;
          t || (t = this.updateJob = () => {
            e.isUpdating = false, e.u && ue(e.u);
          }), M(t);
        } else
          this.render();
      } finally {
        V(...r);
      }
    }
    notify() {
      this.flags & 256 || Dr(this.job, this.i ? this.i.uid : undefined, false, this.order);
    }
  };
  function Y(e, t = false) {
    if (Gm)
      return e();
    new _p(e, t).run();
  }
  function vp(e) {
    return _(e) ? yp(e) : e;
  }
  function yp(e) {
    if (e._cache)
      return e._cache.value;
    let t = B && B.parent;
    return t ? (e._cache = Un((n) => {
      let r = V(t);
      try {
        return xp(n, e());
      } finally {
        V(...r);
      }
    }), Vn(() => e._cache = undefined), e._cache.value) : e();
  }
  function bp(e) {
    let t = Object.create(null);
    for (let n in e)
      if (n !== `$`) {
        let r = vp(e[n]);
        t[n] = () => r;
      }
    let n = e.$;
    if (n) {
      let e = [];
      for (let t = 0;t < n.length; t++) {
        let r = n[t], i = Object.create(null);
        if (_(r)) {
          let n = yp(r);
          for (let e in n)
            i[e] = n[e];
          e[t] = () => i;
        } else {
          for (let e in r) {
            let t = vp(r[e]);
            i[e] = () => t;
          }
          e[t] = i;
        }
      }
      let r = Object.getOwnPropertySymbols(n);
      for (let t = 0;t < r.length; t++)
        e[r[t]] = n[r[t]];
      t.$ = e;
    }
    return t;
  }
  function xp(e, t) {
    if (!w(e) || !w(t))
      return t;
    let n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length)
      return t;
    for (let n = 0;n < r.length; n++) {
      let i = r[n];
      if (!d(e, i) || !Object.is(e[i], t[i]))
        return t;
    }
    return e;
  }
  function Sp(e) {
    if (e.__propsHandlers)
      return e.__propsHandlers;
    let t = Ep(e)[0], n = mp(e), r = t ? (e) => v(e) && d(t, D(e)) : i, a = t || n ? (e) => v(e) && e !== `$` && !r(e) && !ms(n, e) : (e) => v(e), o = (e, n) => {
      if (n === `__v_isReactive`)
        return true;
      if (!r(n))
        return;
      let i = e.rawProps, a = i.$;
      if (a) {
        let r = a.length, i, o, s;
        for (;r--; )
          for (s in i = a[r], o = _(i), i = o ? yp(i) : i, i)
            if (D(s) === n)
              return As(t, n, o ? i[s] : vp(i[s]), e, Dp);
      }
      for (let r in i)
        if (D(r) === n)
          return As(t, n, vp(i[r]), e, Dp);
      return As(t, n, undefined, e, Dp, true);
    }, s = (e) => (t, n) => {
      let r = t.oncePropsCache || (t.oncePropsCache = Object.create(null));
      if (!d(r, n)) {
        jn();
        try {
          r[n] = e(t, n);
        } finally {
          Mn();
        }
      }
      return r[n];
    }, c = s(o), l = (e, t) => (e.isOnce ? c : o)(e, t), u = t ? { get: l, has: (e, t) => r(t), ownKeys: () => Object.keys(t), getOwnPropertyDescriptor(e, t) {
      if (r(t))
        return { configurable: true, enumerable: true, get: () => l(e, t) };
    } } : null, f = (e, t) => {
      if (v(t) && !r(t) && !ms(n, t))
        return Cp(e, t);
    }, p = (e, t) => a(t) ? wp(e, t) : false, m = s((e, t) => f(e.rawProps, t)), h = Symbol(), g = (e) => Tp(e.rawProps).filter(a), y = (e) => {
      let t = e.oncePropsCache || (e.oncePropsCache = Object.create(null));
      if (!d(t, h)) {
        jn();
        try {
          let n = g(e);
          t[h] = n;
          for (let r = 0;r < n.length; r++) {
            let i = n[r];
            d(t, i) || (t[i] = f(e.rawProps, i));
          }
        } finally {
          Mn();
        }
      }
      return t[h];
    }, b = (e) => e.isOnce ? y(e) : g(e), x = (e, t) => e.isOnce ? y(e).includes(t) ? m(e, t) : undefined : f(e.rawProps, t);
    return e.__propsHandlers = [u, { get: x, has: (e, t) => e.isOnce ? y(e).includes(t) : p(e.rawProps, t), ownKeys: b, getOwnPropertyDescriptor(e, t) {
      if (v(t) && (e.isOnce ? y(e).includes(t) : p(e.rawProps, t)))
        return { configurable: true, enumerable: true, get: () => x(e, t) };
    } }];
  }
  function Cp(e, t) {
    if (t === `$`)
      return;
    let n = t === `class` || t === `style` ? [] : undefined, r = e.$;
    if (r) {
      let e = r.length, i, a;
      for (;e--; )
        if (i = r[e], a = _(i), i = a ? yp(i) : i, i && d(i, t)) {
          let e = a ? i[t] : vp(i[t]);
          if (n)
            n.push(e);
          else
            return e;
        }
    }
    if (d(e, t)) {
      let r = vp(e[t]);
      if (n)
        n.push(r);
      else
        return r;
    }
    if (n && n.length)
      return n;
  }
  function wp(e, t) {
    if (t === `$`)
      return false;
    let n = e.$;
    if (n) {
      let e = n.length;
      for (;e--; ) {
        let r = vp(n[e]);
        if (r && d(r, t))
          return true;
      }
    }
    return d(e, t);
  }
  function Tp(e) {
    let t = [];
    for (let n in e)
      n !== `$` && t.push(n);
    let n = e.$;
    if (n) {
      let e = n.length, r;
      for (;e--; ) {
        r = _(n[e]) ? yp(n[e]) : n[e];
        for (let e in r)
          t.push(e);
      }
    }
    return Array.from(new Set(t));
  }
  function Ep(e) {
    let t = e.__propsOptions;
    if (t)
      return t;
    let r = e.props;
    if (!r)
      return n;
    let i = {}, a = [];
    return Ps(r, i, a), e.__propsOptions = [i, a];
  }
  function Dp(e, t) {
    let n = V(t), r = e.call(null, t.props);
    return V(...n), r;
  }
  function Op(e, t) {
    if (t) {
      if (t.$ || !e.props)
        return true;
      {
        let n = Ep(e)[0];
        for (let e in t)
          if (!d(n, D(e)))
            return true;
      }
    }
    return false;
  }
  function kp(e) {
    let t = {};
    for (let n in e)
      n !== `$` && (t[n] = vp(e[n]));
    if (e.$)
      for (let n of e.$) {
        let e = _(n), r = e ? yp(n) : n;
        for (let i in r) {
          let a = e ? r[i] : vp(n[i]);
          if (i === `class` || i === `style`) {
            let e = t[i];
            f(e) ? e.push(a) : t[i] = [e, a];
          } else
            t[i] = a;
        }
      }
    return t;
  }
  var Ap = { get: Cp, has: wp, ownKeys: Tp, getOwnPropertyDescriptor(e, t) {
    if (wp(e, t))
      return { configurable: true, enumerable: true, get: () => Cp(e, t) };
  } };
  var jp = null;
  function Mp(e) {
    try {
      return jp;
    } finally {
      jp = e;
    }
  }
  function Pp(e, t) {
    let n = jp;
    if (!n)
      return;
    t && Fp(n, t, e);
    let r;
    (e.onBeforeUpdate || (e.onBeforeUpdate = [])).push(() => {
      r = eg(e);
    }), (e.onUpdated || (e.onUpdated = [])).push(() => {
      eg(e) !== r && n.markDirty();
    });
  }
  function Fp(e, t, n) {
    let r = e.onContentInvalid || (e.onContentInvalid = []);
    r.push(t), (n.onRemove || (n.onRemove = [])).push(() => {
      let e = r.indexOf(t);
      e > -1 && r.splice(e, 1);
    });
  }
  function Lp(e, t, n, r) {
    return e.addEventListener(t, n, r), () => e.removeEventListener(t, n, r);
  }
  function zp(e, t, n, r = {}) {
    if (f(n))
      n.forEach((n) => zp(e, t, n, r));
    else {
      if (!n)
        return;
      Pn(Lp(e, t, qp(n), r));
    }
  }
  var Vp = Object.create(null);
  function qp(e) {
    let t = B;
    return (...n) => pr(e, t, 5, n);
  }
  var Jp = (e, t) => {
    let n = B;
    return !gg && e.$root && n.hasFallthrough && n.type.inheritAttrs !== false && t in n.attrs;
  };
  function Xp(e, t, n, r = false) {
    if (!Jp(e, t)) {
      if (t === `true-value` ? e._trueValue = n : t === `false-value` && (e._falseValue = n), U && !$f(e)) {
        e[`$${t}`] = n;
        return;
      }
      n !== e[`$${t}`] && (e[`$${t}`] = n, r && t.startsWith(`xlink:`) ? n == null ? e.removeAttributeNS(Gu, t.slice(6, t.length)) : e.setAttributeNS(Gu, t, n) : n == null ? e.removeAttribute(t) : e.setAttribute(t, y(n) ? String(n) : n));
    }
  }
  function Zp(e, t, n, r = false, i) {
    if (Jp(e, t) || U && !$f(e) && !r && !gm(e, t))
      return;
    let a = e[t];
    if (n === a)
      return;
    let o = false;
    if (n === `` || n == null) {
      let e = typeof a;
      e === `boolean` ? n = Oe(n) : n == null && e === `string` ? (n = ``, o = true) : e === `number` && (n = 0, o = true);
    }
    try {
      e[t] = n;
    } catch (e) {}
    o && e.removeAttribute(i || t);
  }
  function Qp(e, t, n = false, r = false) {
    if (e.$clsFlags !== undefined && (e.$clsFlags = undefined), e.$root)
      em(e, t, r);
    else {
      if (r || (t = Ce(t)), U && !$f(e)) {
        e.$cls = t;
        return;
      }
      t !== e.$cls && (n ? e.setAttribute(`class`, e.$cls = t) : e.className = e.$cls = t);
    }
  }
  function em(e, t, n = false) {
    let r = `$clsi${gg ? `$` : ``}`, i = n ? t : Ce(t);
    if (U && !$f(e)) {
      e[r] = i;
      return;
    }
    let a = e[r];
    if ((t = e[r] = i) !== a) {
      let n = t.split(/\s+/);
      if (t && e.classList.add(...n), a)
        for (let t of a.split(/\s+/))
          n.includes(t) || e.classList.remove(t);
    }
  }
  function tm(e, t) {
    if (e.$root)
      nm(e, t);
    else {
      let n = ve(t);
      if (U && !$f(e)) {
        e.$sty = n;
        return;
      }
      Ru(e, e.$sty, e.$sty = n);
    }
  }
  function nm(e, t) {
    let n = `$styi${gg ? `$` : ``}`, r = v(t) ? Se(t) : ve(t);
    if (U && !$f(e)) {
      e[n] = r;
      return;
    }
    Ru(e, e[n], e[n] = r);
  }
  function rm(e, t, n = false) {
    if (Jp(e, `value`) || (e._value = t, U && !$f(e) && !n && !gm(e, `value`)))
      return;
    let r = e.tagName === `OPTION` ? e.getAttribute(`value`) : e.value, i = t == null ? `` : t;
    r !== i && (e.value = i), t == null && e.removeAttribute(`value`);
  }
  function am(e, t) {
    if (t = Le(t), U && !$f(e)) {
      let n = hm(e, t);
      if (e.textContent === n) {
        e.$txt = n;
        return;
      }
      ba(e, 0) || ra();
    }
    e.$txt !== t && (e.textContent = e.$txt = t);
  }
  function cm(e, t) {
    if (t = t == null ? `` : nu(t), U && !$f(e)) {
      e.$html = t;
      return;
    }
    e.$html !== t && (e.innerHTML = e.$html = t);
  }
  function dm(e, n, r) {
    let i = n.length > 1 ? cl(...n) : n[0] || t, o = `$dprops${gg ? `$` : ``}`, s = e[o], c = Object.create(null);
    if (s)
      for (let t in s)
        t in i || fm(e, t, null, r);
    for (let t of Object.keys(i)) {
      let n = i[t];
      c[t] = n, !(s && (t in s) && !a(t) && (typeof n != `object` || !n) && Object.is(s[t], n)) && fm(e, t, n, r);
    }
    e[o] = c;
  }
  function fm(e, t, n, r = false) {
    let i = false;
    if (t === `class`)
      Qp(e, n, r);
    else if (t === `style`)
      tm(e, n);
    else if (a(t)) {
      if (Jp(e, t))
        return;
      let [r, i] = ed(t);
      zp(e, r, n, i);
    } else
      ((i = t[0] === `.`) ? (t = t.slice(1), true) : t[0] === `^` ? (t = t.slice(1), false) : od(e, t, n, r)) ? t === `innerHTML` ? cm(e, n) : t === `textContent` ? am(e, n) : t === `value` && ge(e.tagName) ? rm(e, n, i) : Zp(e, t, n, i) : e._isVueCE && (sd(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(n))) ? Zp(e, D(t), n, i, t) : Xp(e, t, n, r);
    return n;
  }
  var pm = false;
  function mm() {
    if (pm)
      return;
    pm = true;
    let e = Element.prototype;
    e.$transition = undefined, e.$key = undefined, e.$fc = e.$evtclick = undefined, e.$root = false, e.$clsFlags = undefined, e.$html = e.$cls = e.$sty = ``, Text.prototype.$txt = undefined;
  }
  function hm(e, t) {
    return t[0] === `
` && (e.tagName === `PRE` || e.tagName === `TEXTAREA`) && (t = t.slice(1)), t;
  }
  function gm(e, t) {
    let { tagName: n } = e;
    return (n === `INPUT` || n === `OPTION`) && (t.endsWith(`value`) || t === `indeterminate`) || n.includes(`-`);
  }
  function _m(e, t) {
    if (e instanceof Element)
      for (let n of t)
        e.setAttribute(n, ``);
    else if ($(e))
      _m(e.block, t);
    else if (f(e))
      for (let n of e)
        _m(n, t);
    else
      X(e) && (ym(e, t, false), _m(e.nodes, t));
  }
  var vm = new WeakMap;
  function ym(e, t, n = true) {
    J && Wh(e) ? xm(e, t) : bm(e, t) && (e.onBeforeInsert || (e.onBeforeInsert = [])).push((e) => _m(e, t)), n && Sm(e.nodes, t);
  }
  function bm(e, t) {
    let n = t.join(` `), r = vm.get(e);
    if (!r)
      r = new Set, vm.set(e, r);
    else if (r.has(n))
      return false;
    return r.add(n), true;
  }
  function xm(e, t) {
    let n = e.vnode;
    if (!n)
      return;
    let r = n.slotScopeIds;
    if (!r) {
      n.slotScopeIds = t;
      return;
    }
    for (let e = 0;e < t.length; e++)
      r.includes(t[e]) || r.push(t[e]);
  }
  function Sm(e, t) {
    if ($(e))
      Sm(e.block, t);
    else if (f(e))
      for (let n of e)
        Sm(n, t);
    else
      X(e) && ym(e, t);
  }
  var Cm = new WeakMap;
  function wm(e, t) {
    let n = Cm.get(t);
    if (!n)
      n = new WeakSet, Cm.set(t, n);
    else if (n.has(e))
      return;
    n.add(e), (t.onUpdated || (t.onUpdated = [])).push(() => Tm(e));
  }
  function Tm(e) {
    let { scopeId: t } = e;
    if (!t)
      return;
    let n = Og(e, (t) => wm(e, t));
    return n && n.setAttribute(t, ``), n;
  }
  function Em(e) {
    let { parent: t, scopeId: n } = e;
    !t || !n || Og(e, (t) => wm(e, t));
  }
  function Dm(e) {
    let { parent: t, scopeId: n } = e;
    if (!t || !n)
      return;
    let r = Tm(e);
    if (J && r && t.subTree && t.subTree.component === e && t.vnode.scopeId) {
      r.setAttribute(t.vnode.scopeId, ``);
      let e = bc(t.vnode, t.parent);
      for (let t = 0;t < e.length; t++)
        r.setAttribute(e[t], ``);
    }
  }
  function Om() {
    let e = ih();
    return e ? e.type.__scopeId : undefined;
  }
  var km = null;
  function jm() {
    return km ? km.endAnchor : null;
  }
  function Nm(e, t, n = 0) {
    let r = e.pendingAnchors;
    if (!r)
      return;
    let i = n ? r.splice(n) : r;
    n || (e.pendingAnchors = null);
    for (let e = 0;e < i.length; e++) {
      let n = i[e];
      t ? n.onContent() : n.onFallback();
    }
  }
  function Pm(e) {
    let t = km;
    t && t.pending && (t.pendingAnchors || (t.pendingAnchors = [])).push(e);
  }
  function Im() {
    let e = km;
    e && e.pending && (Nm(e, true), e.pending = false);
  }
  function Lm() {
    let e = km;
    return !!(e && e.pending);
  }
  function Rm(e, t, n, r) {
    M(() => {
      let i = t && q(t) === e ? t : null;
      !i && r && q(r) === e && (i = r), e.insertBefore(n(), i);
    });
  }
  function zm(e, t) {
    return !!e && (W(e, ``) || W(e, `]`) || t !== undefined && W(e, t));
  }
  function Bm(e, t) {
    let n = q(e);
    return Zf(e) && n ? { kind: `create`, parent: n, next: e.nextSibling, resetNodes: t } : { kind: `reuse`, node: e, resetNodes: t };
  }
  function Vm(e, t) {
    let n = wf() && t && !e.isSlot && !$h(e.nodes), r = n && !!e.anchor && !!e.anchor.parentNode;
    if (n) {
      let t = null, n = e.anchor || (H === (t = jm()) ? t : null);
      n && G(Xf(n));
    }
    return r;
  }
  function Hm(e, t) {
    let n = e.anchorLabel, r = !!e.nativeChildren, i = n !== undefined || r;
    if (r && Zf(H) && q(H))
      return { kind: `reuse`, node: H };
    if (t) {
      if (Lm()) {
        let e = jm();
        return { kind: `pending`, parent: q(H || e), slotEnd: e };
      }
      if (zm(H))
        return Bm(H);
      if (n && H && W(H, `teleport anchor`)) {
        let e = q(H);
        if (e)
          return { kind: `create`, parent: e, next: H, mark: H };
      }
      if (!e.isSlot && i && H && !W(H, `]`)) {
        let e = q(H);
        if (r && e)
          return { kind: `create-cleanup`, parent: e, next: null, cleanupStart: H, cleanupUntil: null, cleanupContainer: e };
        if (e) {
          let t = zf(H);
          return zm(t, n) && q(t) ? Bm(t, true) : { kind: `create-cleanup`, parent: e, next: t, cleanupStart: H, cleanupUntil: t };
        }
      }
    }
    if (i && !$h(e.nodes) && e.nodes instanceof Comment && zm(e.nodes, n) && q(e.nodes))
      return Bm(e.nodes, true);
    if (i && !$h(e.nodes) && e.nodes instanceof Comment && !q(e.nodes) && H) {
      let e = q(H), t = zf(H);
      if (e)
        return { kind: `create-cleanup`, parent: e, next: t, cleanupStart: H, cleanupUntil: t };
    }
    let a = jm(), o = e.isSlot ? a : null;
    if (e.isSlot || n === `if` && f(e.nodes) && e.nodes.length > 1) {
      let e = Hf(o || H, o || null);
      if (W(e, `]`))
        return Bm(e);
    }
    let s = sg(e.nodes), { parentNode: c, nextNode: l } = s, u = null;
    return a && l === H && c && q(a) === c && (u = a), { kind: `create`, parent: c, next: l, fallbackNext: u };
  }
  function Um(e, t) {
    let n = null, r, i = () => e.anchor = Xf(K());
    try {
      switch (t.kind) {
        case `reuse`:
          t.resetNodes && (e.nodes = Zh), e.anchor = Xf(t.node), H === e.anchor ? Pf(e.anchor) : (r = np(e.anchor), n = e.anchor);
          break;
        case `pending`: {
          let n = t.slotEnd;
          Pm({ onContent: () => {
            let r = H, a = r && q(r);
            if (r && a === t.parent && zm(r, e.anchorLabel)) {
              if (Zf(r)) {
                let e = r.nextSibling;
                Pf(r), a.insertBefore(i(), e);
              } else
                e.anchor = Xf(r), Pf(r);
              return;
            }
            let o = r && a === t.parent ? r : n, s = q(o);
            s && s.insertBefore(i(), o);
          }, onFallback: () => {
            i();
          } });
          break;
        }
        case `create`:
          t.resetNodes && (e.nodes = Zh), t.mark && Xf(t.mark), Rm(t.parent, t.next, i, t.fallbackNext);
          break;
        case `create-cleanup`:
          e.nodes = Zh, t.cleanupUntil ? r = np(t.cleanupUntil) : (Yf(t.cleanupStart, t.cleanupContainer), G(null)), Rm(t.parent, t.next, i);
          break;
      }
    } finally {
      r && r(), n && H === n && Pf(n);
    }
  }
  function Wm(e, t = false) {
    Um(e, Hm(e, t));
  }
  var Gm = false;
  function Km(e, t = true) {
    let n = Gm;
    try {
      return Gm = t, e();
    } finally {
      Gm = n;
    }
  }
  var Ym = new WeakMap;
  var Xm = new WeakMap;
  function Zm(e) {
    if (!e)
      return e;
    let t = _(e) ? { default: e } : e;
    return Ym.has(t) || Ym.set(t, ih()), t;
  }
  function Qm(e, t) {
    if (!Ym.has(e))
      return t();
    let n = rh(Ym.get(e) || null);
    try {
      return t();
    } finally {
      rh(n);
    }
  }
  function $m(e, t, n) {
    if (!Ym.has(e))
      return n;
    let r = Xm.get(e);
    r || Xm.set(e, r = new Map);
    let i = r.get(t);
    if (i && i.slot === n)
      return i.wrapped;
    let a = (...t) => Qm(e, () => n(...t));
    return a._ = n._, r.set(t, { slot: n, wrapped: a }), a;
  }
  var eh = { get: th, has: (e, t) => !!th(e, t), getOwnPropertyDescriptor(e, t) {
    let n = th(e, t);
    if (n)
      return { configurable: true, enumerable: true, value: n };
  }, ownKeys(e) {
    let t = new Set(Object.keys(e).filter((e) => e !== `$`)), n = e.$;
    if (n)
      for (let r of n)
        if (_(r)) {
          let n = Qm(e, () => yp(r));
          if (n)
            if (f(n))
              for (let e of n)
                t.add(String(e.name));
            else
              t.add(String(n.name));
        } else
          for (let e of Object.keys(r))
            t.add(e);
    return [...t];
  }, set: i, deleteProperty: i };
  function th(e, t) {
    if (t === `$`)
      return;
    let n = e.$;
    if (n) {
      let r = n.length, i;
      for (;r--; )
        if (i = n[r], _(i)) {
          let n = Qm(e, () => yp(i));
          if (n) {
            if (f(n)) {
              for (let r = n.length - 1;r >= 0; r--)
                if (String(n[r].name) === t)
                  return $m(e, t, n[r].fn);
            } else if (String(n.name) === t)
              return $m(e, t, n.fn);
          }
        } else if (d(i, t))
          return $m(e, t, i[t]);
    }
    if (d(e, t))
      return $m(e, t, e[t]);
  }
  var nh = null;
  function rh(e) {
    try {
      return nh;
    } finally {
      nh = e;
    }
  }
  function ih() {
    return nh || B;
  }
  var sh;
  var ch;
  var lh;
  var uh = false;
  function dh(e, t, n) {
    uh = true, sh = e, ch = t, lh = n;
  }
  var fh = `VaporTransition`;
  function ph(e) {
    return Ll(e) === fh;
  }
  var mh = false;
  var hh;
  function gh() {
    mh = true;
  }
  function _h(e) {
    return gh(), e;
  }
  function vh(e) {
    let t = e;
    for (;t && t.vapor && P(t); )
      t = t.parent;
    return t && t.vapor && za(t) ? t.ctx : null;
  }
  function yh(e, t) {
    let n = hh;
    hh = e;
    try {
      return t();
    } finally {
      hh = n;
    }
  }
  function bh(e, t) {
    e && (e instanceof Node ? e.$key = t : $(e) ? (e.$key = t, (!mh || !za(e)) && e.block && bh(e.block, t)) : f(e) ? e.length === 1 && bh(e[0], t) : (e.$key = t, J && e.vnode && (e.vnode.key = t), bh(e.nodes, t)));
  }
  var Ih = class {
    constructor(e) {
      this.__vf = true, this.nodes = e;
    }
  };
  var Lh = class extends Ih {
    constructor(e) {
      super(e), this.renderInstance = B, this.slotOwner = nh, this.slotBoundary = jp, mh && (this.keepAliveCtx = vh(B));
    }
    runWithRenderCtx(e, t) {
      return Rh(this, e, t);
    }
  };
  function Rh(e, t, n) {
    let r = V(e.renderInstance, n);
    try {
      return zh(e, t);
    } finally {
      V(...r);
    }
  }
  function zh(e, t) {
    if (nh === e.slotOwner && jp === e.slotBoundary)
      return t();
    let n = rh(e.slotOwner), r = Mp(e.slotBoundary);
    try {
      return t();
    } finally {
      Mp(r), rh(n);
    }
  }
  var Bh = class extends Ih {
    constructor(e, t, n) {
      super(e), t && Pp(this, n);
    }
    onReset(e) {
      (this.resetListeners || (this.resetListeners = [])).push(e);
    }
  };
  var Vh = class extends Ih {
    constructor(e, t, n, r, i, a) {
      super(e), this.scope = t, this.itemRef = n, this.keyRef = r, this.indexRef = i, this.key = a;
    }
  };
  var Hh = class extends Lh {
    constructor(e, t = false, n = true, r = false, i) {
      super(Zh), this.__df = true, t && (this.keyed = true), uh && B && ph(B.type) && (this.inTransition = true), U ? (this.anchorLabel = e, n && Nf()) : this.anchor = K(), r && Pp(this, i);
    }
    get autoHydrate() {
      return true;
    }
    update(e, t = e, n = false) {
      if (t === this.current) {
        U && this.autoHydrate && Wm(this, true);
        return;
      }
      let r = uh ? this.$transition : undefined, i = this.current !== undefined;
      if (i) {
        let e = this.onBeforeUpdate;
        if (e)
          for (let t = 0;t < e.length; t++)
            e[t]();
      }
      if (r && ch(this, e, t, n))
        return;
      let a = k(), o = U ? null : this.getBranchParent();
      if (i) {
        let i = this.scope;
        if (i) {
          let e = false, t = this.onBeforeRemove;
          if (t)
            for (let n = 0;n < t.length; n++)
              e = t[n](i) || e;
          e || i.stop();
        }
        if (r && lh(this, r, o, e, t, n)) {
          k(a);
          return;
        }
        Q(this.nodes, o || undefined);
      }
      let s = U ? Vm(this, !!e) : false;
      this.renderBranch(e, r, o, t, n, i || !!o), k(a), U && this.autoHydrate && !s && Wm(this, e == null);
    }
    getBranchParent() {
      return this.anchor.parentNode;
    }
    renderBranch(e, t, n, r, i = false, a = !!n) {
      if (this.current = r, e) {
        let r = mh ? this.keepAliveCtx : null, a = !i || !!this.hasFallthroughAttrs;
        if (a) {
          let e = r && r.acquireBranchScope(this.current);
          e ? this.scope = e : this.scope = new Ln;
        } else
          this.scope = undefined;
        let o = () => {
          try {
            this.nodes = this.runWithRenderCtx(() => (a ? this.scope.run(e) : e()) || Zh, this.scope);
          } finally {
            let e = this.keyed ? this.current : this.$key;
            e !== undefined && (t || this.inTransition || r) && bh(this.nodes, e), uh && t && (this.$transition = sh(this.nodes, t));
          }
        };
        if (r ? r.runBranchRender(this, o) : o(), n) {
          let e = this.onBeforeInsert;
          e && e.forEach((e) => e(this.nodes)), Z(this.nodes, n, this.anchor);
        }
      } else
        this.scope = undefined, this.nodes = Zh;
      let o = this.onUpdated;
      a && o && o.forEach((e) => e(this.nodes));
    }
  };
  function X(e) {
    return !!(e && e.__vf);
  }
  function Wh(e) {
    return X(e) && e.vnode !== undefined;
  }
  function Gh(e) {
    return !!(e && e.__df);
  }
  function Kh(e) {
    return Gh(e) && !!e.isSlot;
  }
  var qh = false;
  function Jh(e) {
    return qh = true, e;
  }
  function Yh(e) {
    return !!(e && e.__isTeleport && e.__vapor);
  }
  function Xh(e) {
    return !!(e && e.__tf);
  }
  var Zh = n;
  function $h(e, t = false) {
    return e ? e instanceof Node ? !(e instanceof Comment) : $(e) ? t || $h(e.block, t) : f(e) ? e.length > 0 && e.some((e) => $h(e, t)) : J && e.isBlockValid ? e.isBlockValid(t) : $h(e.nodes, t) : false;
  }
  function eg(e) {
    return $h(e, true);
  }
  function Z(e, t, n = null, r) {
    if (e instanceof Node) {
      tg(e, t, n, r);
      return;
    }
    if ($(e))
      n = n === 0 ? t.$fc || lp(t) : n, e.isMounted && !e.isDeactivated ? Z(e.block, t, n) : Tg(e, t, n);
    else if (f(e)) {
      n = n === 0 ? t.$fc || lp(t) : n;
      for (let r of e)
        Z(r, t, n);
    } else
      ng(e, t, n, r);
  }
  function tg(e, t, n = null, r) {
    n = n === 0 ? t.$fc || lp(t) : n, U || (uh && e instanceof Element && e.$transition && !e.$transition.disabled ? gc(e, e.$transition, () => t.insertBefore(e, n), r) : t.insertBefore(e, n));
  }
  function ng(e, t, n = null, r) {
    n = n === 0 ? t.$fc || lp(t) : n, e.anchor && (tg(e.anchor, t, n, r), n = e.anchor), e.insert ? e.insert(t, n, e.$transition) : Z(e.nodes, t, n, r);
  }
  function rg(e, t, n = null, r = 1, i, a) {
    if (n = n === 0 ? t.$fc || lp(t) : n, e instanceof Node)
      uh && e instanceof Element && e.$transition && !e.$transition.disabled && r !== 2 ? r === 0 ? gc(e, e.$transition, () => t.insertBefore(e, n), a, true) : _c(e, e.$transition, () => {
        r === 1 && i && i.isUnmounted ? e.remove() : t.insertBefore(e, n);
      }, a, true) : t.insertBefore(e, n);
    else if ($(e))
      e.isMounted ? rg(e.block, t, n, r, i, a) : Tg(e, t, n);
    else if (f(e))
      for (let o of e)
        rg(o, t, n, r, i, a);
    else
      e.anchor && (rg(e.anchor, t, n, r, i, a), n = e.anchor), e.insert ? e.insert(t, n, e.$transition) : rg(e.nodes, t, n, r, i, a);
  }
  function Q(e, t) {
    if (e instanceof Node)
      ag(e, t);
    else if ($(e))
      Eg(e, t);
    else if (f(e))
      for (let n = 0;n < e.length; n++)
        Q(e[n], t);
    else
      og(e, t);
  }
  function ag(e, t) {
    uh && e.$transition && e instanceof Element ? _c(e, e.$transition, () => t && t.removeChild(e)) : t && t.removeChild(e);
  }
  function og(e, t) {
    let n = e.onRemove;
    if (n)
      for (let e = 0;e < n.length; e++)
        n[e]();
    e.remove ? e.remove(t, e.$transition) : Q(e.nodes, t), e.anchor && ag(e.anchor, t), e.scope && e.scope.stop();
  }
  function sg(e) {
    let t = cg(e), { parentNode: n, nextSibling: r } = t;
    return r && W(r, `]`) && lg(e) && !W(t, `]`) && !(t.nodeType === 3 && !t.data) && (r = r.nextSibling), { parentNode: n, nextNode: r };
  }
  function cg(e) {
    return e && e instanceof Node ? e : f(e) ? cg(e[e.length - 1]) : $(e) ? cg(e.block) : e.anchor ? e.anchor : cg(e.nodes);
  }
  function lg(e) {
    return f(e) ? true : $(e) ? lg(e.block) : X(e) ? lg(e.nodes) : false;
  }
  var ug = false;
  var dg = null;
  function pg(e) {
    try {
      return dg;
    } finally {
      dg = e;
    }
  }
  function mg(e, n, r, i, a, o = B && B.appContext || yg, s = false, c) {
    let l = Gm;
    l && (a = true);
    let u = mf, d = hf, f = null, p = null, m, h = false, g = () => {
      m && m(), f && H === f && Pf(f);
    };
    U ? (Im(), p = Ff(), e.__multiRoot && W(H, `[`) && (f = Vf(H), m = np(f && Xf(f)), G(H.nextSibling))) : vf();
    let _ = null, v = false;
    try {
      if (ug && B && B.suspense && (_ = pg(B.suspense), v = true), (i || uh && B && ph(B.type)) && e.inheritAttrs !== false && $(B) && B.hasFallthrough) {
        let e = B.attrs;
        n && n !== t ? (n.$ || (n.$ = [])).push(() => e) : n = { $: [() => e] };
      }
      if (mh && B && B.vapor && za(B)) {
        let t = B.ctx.getCachedComponent(e);
        if (t)
          return t;
      }
      if (J && o.vapor && !e.__vapor) {
        let t = o.vapor.vdomMount(e, B, n, Zm(r), a);
        return U ? t.hydrate() : u && Z(t, u, d), t;
      }
      if (qh && Yh(e)) {
        let t = e.process(n, Zm(r));
        return u && Vn(() => t.dispose(), true), U ? t.hydrate() : u && Z(t, u, d), t;
      }
      let m = new bg(e, n, r, o, a, c);
      if (mh && !P(m)) {
        let e = vh(B);
        e && e.processShapeFlag(m);
      }
      let y = rh(null);
      try {
        if (U && P(m) && e.__asyncHydrate && !e.__asyncResolved) {
          let t = () => hg(m, e);
          e.__asyncHydrate(H, m, l ? () => Km(t, false) : t);
        } else
          l ? Km(() => hg(m, e), false) : hg(m, e);
      } finally {
        rh(y), ug && v && (pg(_), v = false);
      }
      return Vn(() => Eg(m), true), !s && (u || U) && Tg(m, u, d), ug && U && f && m.suspense && m.asyncDep && !m.asyncResolved && m.restoreAsyncContext && (h = true, m.deferredHydrationBoundary = () => {
        m.block && f && sg(m.block).nextNode === f.nextSibling && G(f), g();
      }, Lf(p)), m;
    } finally {
      v && pg(_), U && !h && (g(), Lf(p));
    }
  }
  function hg(e, n) {
    let r = V(e), i = k(), a = _(n) ? n : n.setup, o = a && fr(a, e, 0, [e.props, e]) || t, s = x(o);
    (s || e.sp) && !P(e) && Gi(e), s ? e.asyncDep = o : kg(o, n, e), k(i), V(...r);
  }
  var gg = false;
  function _g(e, t) {
    gg = true;
    try {
      dm(e, [t]);
    } finally {
      gg = false;
    }
  }
  function vg(e, t, n) {
    return fr(e, t, 1, [n, t.props, t.emit, t.attrs, t.slots]);
  }
  var yg = { app: null, config: {}, provides: Object.create(null) };
  var bg = class {
    constructor(e, n, r, i, a, o) {
      if (this.effectCount = 0, this.accessedAttrs = false, this.vapor = true, this.uid = yl(), this.type = e, this.parent = B, B ? (this.root = B.root, this.appContext = B.appContext, this.provides = B.provides, this.ids = B.ids) : (this.root = this, this.appContext = i || yg, this.provides = Object.create(this.appContext.provides), this.ids = [``, 0, 0]), this.block = null, this.scope = new Ln(true), this.isOnce = !!a, this.emit = hp.bind(null, this), this.expose = Nl.bind(null, this), this.refs = t, this.emitted = this.exposed = this.exposeProxy = this.propsDefaults = null, this.suspense = null, this.suspenseId = 0, ug && (this.suspense = dg, this.suspenseId = dg ? dg.pendingId : 0), this.asyncDep = null, this.asyncResolved = false, this.isMounted = this.isUnmounted = this.isUpdating = this.isDeactivated = false, this.rawProps = this.isOnce && n ? bp(n) : n || t, this.hasFallthrough = Op(e, this.rawProps), n || e.props) {
        let [n, r] = Sp(e);
        this.attrs = new Proxy(this, r), this.props = e.props ? new Proxy(this, n) : _(e) ? this.attrs : t;
      } else
        this.props = this.attrs = t;
      let s = Zm(r);
      this.rawSlots = s || t, this.slots = s ? new Proxy(s, eh) : t, this.scopeId = Om(), o && o(this);
    }
    rawKeys() {
      return Tp(this.rawProps);
    }
  };
  function $(e) {
    return e instanceof bg;
  }
  function Sg(e, t, n, r, i, a) {
    if (e === lo) {
      if (U && H) {
        if (Cg(H)) {
          let e = H;
          return W(e, ``) && Pf(e), e;
        }
        let e = zf(H);
        if (e && Cg(e))
          return e;
      }
      return K(``);
    }
    return v(e) ? wg(e, t, n, r, i) : mg(e, t, n, r, i, a);
  }
  function Cg(e) {
    return W(e, ``) || W(e, `dynamic-component`) || W(e, `async component`) || W(e, `keyed`);
  }
  function wg(e, t, n, r, i) {
    n = Zm(n);
    let a = mf, o = hf, s = null;
    U ? (Im(), s = Ff()) : vf();
    let c = n && th(n, `default`), l = !!n && !!n.$, u = !!c, d = l && !c ? `<${e}><!></${e}>` : `<${e}/>`, f = U ? Mf(H, d, u) : rp(e);
    if (f.$root = r, !U) {
      let e = Om();
      e && _m(f, [e]);
    }
    if (t) {
      let e = () => dm(f, [kp(t)]);
      i ? e() : Y(e);
    }
    if (n) {
      let e = null;
      if (U) {
        e = zf(f);
        let t = f.firstChild;
        n.$ && !t && (t = f.appendChild(Xf(K()))), G(t);
      }
      if (n.$) {
        let e = new Hh(U ? `` : undefined);
        e.nativeChildren = true, Y(() => e.update(th(n, `default`))), U || Z(e, f);
      } else {
        let e = th(n, `default`);
        if (e) {
          let t = e();
          U || Z(t, f);
        }
      }
      U && G(e);
    }
    return U ? Lf(s) : a && Z(f, a, o), f;
  }
  function Tg(e, t, n) {
    if (ug && e.suspense && e.asyncDep && !e.asyncResolved) {
      let r = e.type;
      e.suspense.registerDep(e, (i) => {
        let a = e.restoreAsyncContext && e.restoreAsyncContext();
        try {
          U ? Tf(() => {
            kg(i, r, e), Tg(e, t, n), e.deferredHydrationBoundary && e.deferredHydrationBoundary();
          }) : (kg(i, r, e), Tg(e, t, n));
        } finally {
          U && (e.deferredHydrationBoundary = undefined), e.restoreAsyncContext = undefined, a && a();
        }
      });
      return;
    }
    if (mh && e.shapeFlag & 512) {
      e.parent.ctx.activate(e, t, n);
      return;
    }
    let { root: r, type: i } = e;
    r && r.ce && r.ce._hasShadowRoot() && r.ce._injectChildStyle(i, e.parent ? e.parent.type : undefined), e.bm && ue(e.bm), U ? Em(e) : (Z(e.block, t, n), Dm(e)), e.m && M(e.m), mh && e.shapeFlag & 256 && e.a && M(e.a), e.isMounted = true;
  }
  function Eg(e, t) {
    if (mh && e.shapeFlag & 256 && e.parent && e.parent.vapor && e.parent.ctx) {
      t && e.parent.ctx.deactivate(e);
      return;
    }
    !e.isUnmounted && (e.isMounted || e.asyncDep && !e.asyncResolved) && (hc(e.m), hc(e.a), e.bum && ue(e.bum), e.scope.stop(), e.um && M(e.um), e.isUnmounted = true), t && e.block && Q(e.block, t);
  }
  function Dg(e) {
    if (e.exposed)
      return e.exposeProxy || (e.exposeProxy = new Proxy(sn(e.exposed), { get: (e, t) => gn(e[t]) }));
  }
  function Og(e, t, n = true) {
    if (e instanceof Element)
      return e;
    if (n && $(e))
      return Og(e.block, t, n);
    if (X(e) && !(qh && Xh(e))) {
      Gh(e) && t && t(e);
      let { nodes: r } = e;
      return r instanceof Element && r.$root ? r : Og(r, t, n);
    }
    if (f(e)) {
      let r, i = false;
      for (let a of e) {
        if (a instanceof Comment) {
          i = true;
          continue;
        }
        let e = Og(a, t, n);
        if (!e || r)
          return;
        r = e;
      }
      return i ? r : undefined;
    }
  }
  function kg(e, n, r) {
    if (e === t && n.render ? r.block = vg(n.render, r, e) : r.block = e, r.hasFallthrough && n.inheritAttrs !== false && Object.keys(r.attrs).length) {
      let e = _(n) && !(uh && ph(n)) ? () => vs(r.attrs) : () => r.attrs;
      Ag(r.block, r, e);
    }
  }
  function Ag(e, t, n, r) {
    let i = false, a, o = Og(e, (e) => {
      e.isSlot ? i = true : (a || (a = [])).push(e);
    }, false), s = o ? undefined : jg(e), c = o ? a : s && s.fragments;
    if (c)
      for (let e of c)
        e.isSlot || Mg(e, t, n);
    if (o && !i) {
      let e = () => Y(() => {
        let e = n();
        e && _g(o, e);
      });
      r ? r.run(e) : e();
    }
  }
  function jg(e) {
    if (Gh(e)) {
      let { nodes: t } = e, n = jg(t);
      return { fragments: n ? [e, ...n.fragments] : [e], hasNonSingleRoot: n ? n.hasNonSingleRoot : f(t) && t.some((e) => !(e instanceof Comment)) };
    }
    if (X(e) && !(qh && Xh(e)))
      return jg(e.nodes);
    if (f(e)) {
      let t, n = false;
      for (let r of e) {
        if (r instanceof Comment) {
          n = true;
          continue;
        }
        let e = jg(r);
        if (!e || t)
          return;
        t = e;
      }
      return n ? t : undefined;
    }
  }
  function Mg(e, t, n) {
    e.hasFallthroughAttrs || (e.hasFallthroughAttrs = true, (e.onBeforeInsert || (e.onBeforeInsert = [])).push((r) => Ag(r, t, n, e.scope)));
  }
  var Ng;
  var Pg = new WeakMap;
  var Fg = (e, t) => {
    mm(), t.nodeType === 1 && (t.textContent = ``);
    let n = e._ceComponent || mg(e._component, e._props, null, false, false, e._context);
    return Tg(n, t), Pr(), Pg.set(e, n), n;
  };
  var Rg = (e) => {
    Eg(Pg.get(e), e._container), Pg.delete(e);
  };
  function zg() {
    let e = he();
    e.__VUE__ = true;
  }
  function Bg(e) {
    e.vapor = true;
    let t = e.mount;
    e.mount = (e, ...n) => {
      if (e = df(e), !e)
        return;
      let r = t(e, ...n);
      return e instanceof Element && (e.removeAttribute(`v-cloak`), e.setAttribute(`data-v-app`, ``)), r;
    };
  }
  var Vg = (e, t) => {
    zg(), Ng || (Ng = as(Fg, Rg, Dg));
    let n = Ng(e, t);
    return Bg(n), n;
  };
  function Ug(e, t) {
    return _(e) ? c({ name: e.name }, t, { setup: e, __vapor: true }) : (e.__vapor = true, e);
  }
  var qg = null;
  function Jg(e) {
    try {
      return qg;
    } finally {
      qg = e;
    }
  }
  var Zg = false;
  var Qg = () => {
    Zg || (Zg = true, dh(u_, m_, h_));
  };
  var $g = () => {
    if (!H || !la(H))
      return;
    let { content: e, parentNode: t } = H, { firstChild: n } = e;
    if (n) {
      let r;
      for (let e = n;e; e = e.nextSibling)
        if (e instanceof Element) {
          r = e;
          break;
        }
      if (t.insertBefore(e, H), t.removeChild(H), G(n), r instanceof HTMLElement || r instanceof SVGElement) {
        let e = r.style.display;
        return r.style.display = `none`, (t) => {
          t.beforeEnter(r), r.style.display = e, M(() => t.enter(r));
        };
      }
    }
  };
  var e_ = ((e) => (e.displayName = fh, e.props = du, e.__vapor = true, e))((e, { slots: t, expose: n }) => {
    n(), Qg();
    let r = U ? $g() : undefined, i = Oi(), a = B, { mode: o } = e, s = Un(() => hu(e)), c = new Proxy({}, { get(e, t) {
      return s.value[t];
    } }), l = !U && !!e.appear, u = !!e.appear && !!r;
    if (a.rawSlots.$) {
      let e = new Hh(`transition`), n = false;
      return Y(() => {
        e.$transition ? e.$transition.mode = s.value.mode : e.$transition = l_(e, c, i, a);
        let [, o] = A_(l && !n, () => e.update(t.default)), d = false, f = g_(e.nodes, (e) => {
          d || (d = f_(e));
        });
        j_(e.$transition, f, o, d), !n && u && r(e.$transition), n = true;
      }), e;
    }
    let [d, f] = A_(l, () => t.default && t.default() || []), p = { state: i, props: c, instance: a }, m = false;
    return Y(() => {
      let { hooks: e, root: t, hasStructuralRoot: n } = d_(d, p);
      p = e, m || (m = true, j_(e, t, f, n), u && r(e));
    }), d;
  });
  var t_ = new WeakMap;
  var n_ = new WeakMap;
  var r_ = 0;
  var i_ = 0;
  function a_(e) {
    let t = t_.get(e);
    if (t !== undefined)
      return t;
    if (e instanceof Element)
      return e.localName;
    if (J && X(e) && e.vnode) {
      let t = Vi([e.vnode]);
      if (t.length === 1)
        return t[0].type;
    }
    return e;
  }
  function o_(e, t) {
    let { leavingNodes: n } = e, r = a_(t), i = n.get(r);
    return i || (i = Object.create(null), n.set(r, i)), i;
  }
  function s_(e) {
    let t = k_(e);
    if (t)
      return t;
    if (X(e) && !f(e.nodes) && (e.nodes instanceof Element || X(e.nodes)))
      return s_(e.nodes);
  }
  var c_ = (e, t, n, r, i) => {
    let a = String(e.$key), o = o_(n, e);
    return { isLeaving: () => o[a] === e, setLeavingNodeCache: () => {
      o[a] = e;
    }, unsetLeavingNodeCache: () => {
      o[a] === e && delete o[a];
    }, earlyRemove: () => {
      let t = o[a];
      if (t && t.$key === e.$key) {
        let e = s_(t);
        e && e[Ei] && e[Ei]();
      }
    }, cloneHooks: (e) => {
      let a = l_(e, t, n, r, i);
      return i && i(a), a;
    } };
  };
  function l_(e, t, n, r, i) {
    let a = Li(c_(e, t, n, r, i), t, n, r);
    return a.state = n, a.props = t, a.instance = r, a;
  }
  function u_(e, t) {
    return d_(e, t).hooks;
  }
  function d_(e, t) {
    if (f(e)) {
      if (e = e.filter((e) => !(e instanceof Comment)), e.length === 1)
        e = e[0];
      else if (e.length === 0)
        return { hooks: t, hasStructuralRoot: false };
    }
    if (t.applyGroup && (e instanceof Bh || Kh(e) || $(e) && Kh(e.block)))
      return t.applyGroup(e, t.props, t.state, t.instance), { hooks: t, hasStructuralRoot: false };
    let n = [], r = false, i = g_(e, (e) => {
      n.push(e), r || (r = f_(e));
    });
    if (!i)
      return n.forEach((e) => e.$transition = t), { hooks: t, hasStructuralRoot: r };
    let { props: a, instance: o, state: s, delayedLeave: c } = t, l = l_(i, a, s, o, (e) => l = e);
    return l.persisted = l.persisted || !r && t.persisted && M_(i), l.delayedLeave = c, i.$transition = l, n.forEach((e) => e.$transition = l), { hooks: l, root: i, hasStructuralRoot: r };
  }
  function f_(e) {
    return !!(e instanceof Hh && !Kh(e) && e.inTransition);
  }
  function p_(e, t, n) {
    let r = g_(e);
    if (!r)
      return;
    let { props: i, state: a, instance: o } = t, s = l_(r, i, a, o);
    r.$transition = s;
    let { mode: c } = i;
    c === `out-in` ? (a.isLeaving = true, s.afterLeave = () => {
      a.isLeaving = false, n(), r.$transition = undefined, delete s.afterLeave;
    }) : c === `in-out` && (s.delayLeave = (e, n, i) => {
      let o = o_(a, r), s = String(r.$key);
      o[s] = r;
      let c = () => {
        i(), r.$transition = undefined, t.delayedLeave === c && delete t.delayedLeave;
      };
      e[Ei] = () => {
        n(), e[Ei] = undefined, r.$transition = undefined, o[s] === r && delete o[s], t.delayedLeave === c && delete t.delayedLeave;
      }, t.delayedLeave = c;
    });
  }
  function m_(e, t, n, r) {
    if (!e.$transition.state.isLeaving)
      return false;
    e.current = n;
    let i = e.pending;
    return i ? (i.render = t, i.key = n, i.noScope = r) : e.pending = { render: t, key: n, noScope: r }, true;
  }
  function h_(e, t, n, r, i, a) {
    let o = t.mode;
    if (o && (o !== `in-out` || r) && (o !== `out-in` || $h(e.nodes))) {
      let s = B;
      if (p_(e.nodes, t, () => {
        let o = V(s);
        try {
          let o = e.pending;
          o ? (e.pending = undefined, e.renderBranch(o.render, t, n, o.key, o.noScope, true)) : e.renderBranch(r, t, n, i, a, true);
        } finally {
          V(...o);
        }
      }), o === `out-in`)
        return e.current = i, n && Q(e.nodes, n), true;
    }
    return false;
  }
  function g_(e, t) {
    return v_(e, { mode: `single`, onFragment: t })[0];
  }
  function __(e, t, n) {
    return v_(e, { mode: `group`, onFragment: t, onUpdateOwner: n });
  }
  function v_(e, t) {
    let n = [], r = i_;
    i_ = ++r_;
    try {
      return y_(e, t, n), n;
    } finally {
      i_ = r;
    }
  }
  function y_(e, t, n) {
    e instanceof Node ? e instanceof Element && n.push(e) : $(e) ? b_(e, t, n) : f(e) ? x_(e, t, n) : X(e) && S_(e, t, n);
  }
  function b_(e, t, n) {
    if (t.mode === `group`) {
      let r = e.block && Kh(e.block);
      t.onUpdateOwner && !r && t.onUpdateOwner(e);
      let i = n.length;
      if (y_(e.block, r ? t : { mode: t.mode, onFragment: t.onFragment }, n), !r)
        for (let t = i;t < n.length; t++)
          t_.set(n[t], e.type);
      w_(n, i, e.$key);
      return;
    }
    if (P(e)) {
      if (!e.type.__asyncResolved) {
        t.onFragment && t.onFragment(e.block);
        return;
      }
      let r = n.length;
      y_(e.block.nodes, t, n), C_(n[r], e);
      return;
    }
    if (e.type === e_)
      return;
    let r = n.length;
    y_(e.block, t, n), C_(n[r], e);
  }
  function x_(e, t, n) {
    if (t.mode === `group`) {
      for (let r of e) {
        let e = n.length;
        if (y_(r, t, n), r instanceof Vh) {
          let t = n.length - e;
          for (let i = e;i < n.length; i++)
            n[i].$key = r.key != null && t > 1 ? `${r.key}:${i - e}` : r.key;
        }
      }
      return;
    }
    for (let r of e) {
      if (r instanceof Comment)
        continue;
      let e = [];
      y_(r, t, e), e.length && n.push(e[0]);
      break;
    }
  }
  function S_(e, t, n) {
    if (t.mode === `group`) {
      if (t.onFragment && t.onFragment(e), t.onUpdateOwner && t.onUpdateOwner(e), J && e.vnode)
        n.push(e);
      else {
        let r = n.length;
        y_(e.nodes, t, n), w_(n, r, e.$key);
      }
      return;
    }
    if (J && e.vnode) {
      n.push(e);
      let t = Vi([e.vnode]);
      t.length === 1 && t_.set(e, t[0].type);
      return;
    }
    t.onFragment && t.onFragment(e), y_(e.nodes, t, n);
  }
  function C_(e, t) {
    e && (e.$key == null && t.$key != null && (e.$key = t.$key), t_.set(e, t.type));
  }
  function w_(e, t, n) {
    if (!(n == null || t === e.length))
      for (let r = t;r < e.length; r++) {
        let i = e[r], a = n_.get(i), o;
        a && a.generation === i_ ? o = i.$key == null ? r - t : i.$key : (!a || !Object.is(i.$key, a.inheritedKey) ? (a = { generation: i_, rawBaseKey: i.$key == null ? r - t : i.$key, inheritedKey: `` }, n_.set(i, a)) : a.generation = i_, o = a.rawBaseKey), a.inheritedKey = String(n) + String(o), i.$key = a.inheritedKey;
      }
  }
  function T_(e, t) {
    $(e) && (e = g_(e.block), !e) || (e.$transition = t);
  }
  function D_(e) {
    if (!e)
      return;
    if (e.component)
      return D_(e.component.subTree);
    if (e.el instanceof Element)
      return e.el;
    let t = Vi([e]);
    if (t.length === 1 && t[0] !== e)
      return D_(t[0]);
  }
  function O_(e) {
    return !!(e instanceof Element || J && X(e) && e.vnode);
  }
  function k_(e) {
    if (e instanceof Element)
      return e;
    if (J && X(e) && e.vnode)
      return D_(e.vnode);
  }
  function A_(e, t) {
    if (!e)
      return [t(), undefined];
    let n = [], r = Jg(n);
    try {
      return [t(), n];
    } finally {
      Jg(r);
    }
  }
  function j_(e, t, n, r) {
    n && (t && (e.persisted = e.persisted || !r && n.some((e) => e.target === t || g_(e.target) === t)), Qa(() => {
      let e;
      if (n.forEach((t) => {
        let n = t.apply();
        n && (e || (e = [])).push(n);
      }), n.length = 0, e) {
        let t = e;
        M(() => t.forEach((e) => e()), -1);
      }
    }));
  }
  function M_(e) {
    return e ? e instanceof Element ? Ou in e : $(e) ? M_(e.block) : f(e) ? e.length === 1 && M_(e[0]) : X(e) ? M_(e.nodes) : false : false;
  }
  var N_ = new WeakMap;
  function P_(e) {
    let t = N_.get(e);
    t && t.job && (t.job.flags = t.job.flags | 4, t.job = undefined);
  }
  function F_(e) {
    P_(e);
    let t = N_.get(e);
    t && t.fn();
  }
  var I_ = _h(Ug({ name: `VaporKeepAlive`, __isKeepAlive: true, props: { include: [String, RegExp, Array], exclude: [String, RegExp, Array], max: [String, Number] }, setup(e, { slots: t, expose: n }) {
    if (n(undefined), !t.default)
      return;
    let r = B, i = new Map, a = new Set, o = rp(`div`), s = new Map, c = (e, t, n = hh) => {
      var r, i;
      if (t && J) {
        var a, o;
        let t = e;
        return (a = t.$key === undefined ? (o = t.vnode.key) == null ? n : o : t.$key) == null ? t.vnode.type : a;
      }
      return (r = (i = e.$key) == null ? n : i) == null ? e.type : r;
    }, l, u = (t, n, r) => {
      let { max: o } = e;
      i.has(t) ? r && (a.delete(t), a.add(t)) : (a.add(t), o && a.size > parseInt(o, 10) && g(a.values().next().value)), i.set(t, n), r && (l = n);
    }, d = (t = r.block) => {
      if (Gh(t)) {
        let e = t.$transition;
        if (e && e.mode === `out-in` && e.state.isLeaving)
          return;
      }
      let [n, a] = H_(t);
      if (!n)
        return;
      let o = c(n, a, Gh(t) && t.keyed ? t.current : undefined);
      if (!R_(n, e, a)) {
        i.has(o) && g(o);
        return;
      }
      z_(n, a, i.has(o));
      let { currentBlock: s, currentKey: l } = _();
      u(o, n, s === n || l === o);
    }, p = (t) => {
      let [n, r] = H_(t);
      if (!n || !R_(n, e, r))
        return false;
      let a = c(n, r);
      return z_(n, r, i.has(a)), a;
    }, m = (e) => {
      i.forEach((t, n) => {
        let r = U_(t);
        if (!r)
          return;
        let i = Ll(P(r) ? r.type.__asyncResolved || {} : r.type);
        i && !e(i) && g(n);
      });
    }, h = (e) => {
      let t = s.get(e);
      if (t) {
        s.delete(e);
        for (let [e, n] of s)
          if (n === t) {
            s.delete(e);
            break;
          }
      }
      return t;
    }, g = (e) => {
      let t = i.get(e);
      if (t && (!l || t !== l)) {
        B_(t);
        let e = sg(t).parentNode;
        e && Q(t, e);
      } else
        l && B_(l);
      i.delete(e), a.delete(e);
      let n = h(e);
      n && n.stop();
    };
    si(() => [e.include, e.exclude], ([e, t]) => {
      e && m((t) => Va(e, t)), t && m((e) => !Va(t, e));
    }, { flush: `post`, deep: true }), $a(d), to(d);
    let _ = () => {
      let e = r.block, [t, n] = H_(e), i = Gh(e) && e.keyed ? e.current : hh;
      return { currentBlock: t, interop: n, currentKey: t && c(t, n, i) };
    };
    no(() => {
      let { currentBlock: e, interop: t, currentKey: n } = _(), r = (e) => {
        B_(e);
        let t = U_(e);
        if (t) {
          let e = t.da;
          e && M(e);
        }
      }, a = false;
      i.forEach((e, t) => {
        if (n === t) {
          a = true, r(e);
          return;
        }
        B_(e), Q(e, o);
      }), !a && e && V_(e, t) && r(e), s.forEach((e) => e.stop()), s.clear();
    });
    let v = { getStorageContainer: () => o, getCachedComponent: (e, t) => {
      var n;
      if (J && R(e)) {
        var r, a;
        return i.get((r = (a = e.key) == null ? hh : a) == null ? e.type : r);
      }
      return i.get((n = t == null ? hh : t) == null ? e : n);
    }, activate: (e, t, n) => {
      l = e, W_(e, t, n);
    }, deactivate: (e) => {
      l = undefined, G_(e, o);
    }, acquireBranchScope(e) {
      return h(e);
    }, runBranchRender(e, t) {
      let n = () => {
        try {
          t();
        } finally {
          p(e.nodes);
        }
      };
      e.keyed ? yh(e.current, n) : n();
    }, processShapeFlag: p, cacheBlock: d, cacheScope(e, t, n) {
      let r = s.get(e);
      if (r && r !== n) {
        let t = h(e);
        t && t.stop();
      }
      s.set(e, n), t !== e && s.set(t, n);
    } };
    r.ctx = v;
    let y = t.default();
    return L_(y, v), f(y) && (y = y.filter((e) => !(e instanceof Comment)), y.length === 1 && L_(y[0], v), y.length), y;
  } }));
  function L_(e, t) {
    Gh(e) && ((e.onBeforeRemove || (e.onBeforeRemove = [])).push((n) => {
      let r = e.keyed ? yh(e.current, () => t.processShapeFlag(e.nodes)) : t.processShapeFlag(e.nodes);
      return r === false ? false : (t.cacheScope(r, e.current, n), true);
    }), (e.onUpdated || (e.onUpdated = [])).unshift(() => {
      e.$transition && e.$transition.mode === `out-in` && t.cacheBlock(e);
    }));
  }
  var R_ = (e, t, n = false) => {
    let r = P(n ? e.vnode : e), i = n && J ? e.vnode.type : e.type;
    if (r && !i.__asyncResolved)
      return !t.include;
    let { include: a, exclude: o } = t, s = Ll(r ? i.__asyncResolved : i);
    return !(a && (!s || !Va(a, s)) || o && s && Va(o, s));
  };
  function z_(e, t, n) {
    t && J ? (n && (e.vnode.shapeFlag |= 512), e.vnode.shapeFlag |= 256) : (n && (e.shapeFlag |= 512), e.shapeFlag |= 256);
  }
  var B_ = (e) => {
    if ($(e)) {
      if (Ka(e), P(e)) {
        let [t] = H_(e.block);
        t && $(t) && Ka(t);
      }
    } else
      J && Ka(e.vnode);
  };
  function V_(e, t) {
    return t && J && Wh(e) ? !!(e.vnode.shapeFlag & 256) : !!(e.shapeFlag & 256);
  }
  function H_(e) {
    return $(e) ? [e, false] : J && Wh(e) ? [e, true] : X(e) ? H_(e.nodes) : [undefined, false];
  }
  function U_(e) {
    if ($(e))
      return e;
    if (J)
      return e.vnode.component;
  }
  function W_(e, t, n) {
    rg(e.block, t, n, 0, e), M(() => {
      e.isDeactivated = false, e.a && ue(e.a);
    });
  }
  function G_(e, t) {
    F_(e), hc(e.m), hc(e.a), rg(e.block, t, null, 1, e), M(() => {
      e.da && ue(e.da), e.isDeactivated = true;
    });
  }
  var Z_ = new WeakMap;
  var cv = new WeakMap;
  var kv = new WeakMap;
  var Pv = new WeakMap;
  var Hv = new WeakMap;
  var Uv = new WeakMap;
  var Yv = { name: `VaporTeleport`, __isTeleport: true, __vapor: true, process(e, t) {
    return new Xv(e, t);
  } };
  var Xv = class extends Lh {
    constructor(e, t) {
      super([]), this.__tf = true, this.childrenInitialized = false, this.childrenScope = zn(), this.mountState = { location: 0 }, this.insert = (e, t) => {
        if (U)
          return;
        let n = this.mountState.location === 2;
        this.placeholder || (this.placeholder = K()), Z(this.placeholder, e, t), Z(this.anchor, e, t), n || this.handlePropsUpdate();
      }, this.dispose = () => {
        this.mountToTargetJob && (this.mountToTargetJob.flags |= 4, this.mountToTargetJob = undefined);
        let e = this.mountState;
        this.nodes && e.location !== 0 && (Q(this.nodes, e.container), this.nodes = []), this.mountState = { location: 0 }, this.targetStart && (Q(this.targetStart, q(this.targetStart)), this.targetStart = undefined), this.targetAnchor && (Q(this.targetAnchor, q(this.targetAnchor)), this.targetAnchor = undefined), this.target = undefined;
      }, this.remove = (e) => {
        this.dispose(), this.anchor && (Q(this.anchor, q(this.anchor)), this.anchor = undefined), this.placeholder && (Q(this.placeholder, q(this.placeholder)), this.placeholder = undefined);
      }, this.hydrate = () => {
        if (!U)
          return;
        let e = this.target = yi(this.resolvedProps, ip), t = hi(this.resolvedProps);
        if (this.placeholder = H, e) {
          let n = e._lpa || e.firstChild;
          t ? this.hydrateDisabledTeleport(e, n) : (this.anchor = Xf(Qv(H.nextSibling)), this.hydrateTargetAnchors(e, n), this.mountState = { location: 2, container: e, anchor: this.targetAnchor || null }, n && G(n.nextSibling), this.targetAnchor ? this.initChildren() : this.mountChildren(e));
        } else
          t ? this.hydrateDisabledTeleport(null, null) : this.anchor = Xf(Qv(H.nextSibling));
        (e || t) && this.updateCssVars(), Pf(this.anchor);
      }, this.rawSlots = t, this.anchor = U ? undefined : K();
      let n = new Proxy(e, Ap);
      Y(() => {
        let e = this.resolvedProps && this.resolvedProps.to, t = this.isDisabled;
        this.resolvedProps = c({}, n), this.isDisabled = hi(this.resolvedProps), (t !== this.isDisabled || !this.isDisabled && e !== this.resolvedProps.to) && this.handlePropsUpdate();
      });
    }
    get parent() {
      return this.anchor ? q(this.anchor) : null;
    }
    get scopeOwner() {
      return this.slotOwner || this.renderInstance;
    }
    initChildren() {
      let e = V(this.renderInstance, this.childrenScope);
      try {
        this.childrenInitialized = true, Y(() => zh(this, () => this.handleChildrenUpdate(this.rawSlots && this.rawSlots.default ? this.rawSlots.default() : []))), this.bindChildren(this.nodes);
      } finally {
        V(...e);
      }
    }
    ensureChildrenInitialized() {
      this.childrenInitialized || this.initChildren();
    }
    registerUpdateCssVars(e) {
      X(e) ? ((e.onUpdated || (e.onUpdated = [])).push(() => this.updateCssVars()), this.registerUpdateCssVars(e.nodes)) : $(e) ? this.registerUpdateCssVars(e.block) : f(e) && e.forEach((e) => this.registerUpdateCssVars(e));
    }
    bindChildren(e) {
      let t = this.scopeOwner;
      t && t.ut && this.registerUpdateCssVars(e);
    }
    handleChildrenUpdate(e) {
      let t = this.mountState;
      if (U || !this.parent || t.location === 0) {
        this.nodes = e;
        return;
      }
      Q(this.nodes, t.container), this.nodes = e;
      let n = this.onBeforeInsert;
      n && n.forEach((e) => e(this.nodes)), Z(e, t.container, t.anchor), this.bindChildren(this.nodes), this.updateCssVars();
    }
    mount(e, t, n) {
      if (uh && this.$transition && this.mountState.location === 0 && sh(this.nodes, this.$transition), this.mountState.location !== 0)
        rg(this.nodes, e, t, 2);
      else {
        let n = this.onBeforeInsert;
        n && n.forEach((e) => e(this.nodes)), Z(this.nodes, e, t);
      }
      this.mountState = { location: n, container: e, anchor: t }, this.updateCssVars();
    }
    prepareTargetAnchors(e) {
      (!this.targetAnchor || q(this.targetAnchor) !== e) && (this.targetStart && Q(this.targetStart, q(this.targetStart)), this.targetAnchor && Q(this.targetAnchor, q(this.targetAnchor)), Z(this.targetStart = K(``), e), Z(this.targetAnchor = K(``), e));
    }
    prepareTarget() {
      let e = this.target = yi(this.resolvedProps, ip);
      if (e) {
        this.prepareTargetAnchors(e);
        let t = this.scopeOwner;
        t && t.isCE && (t.ce._teleportTargets || (t.ce._teleportTargets = new Set)).add(e);
      }
      return e;
    }
    queueTargetUpdate() {
      (!this.mountToTargetJob || this.mountToTargetJob.flags & 4) && (this.mountToTargetJob = () => {
        this.mountToTargetJob = undefined, this.anchor && (this.isDisabled ? this.targetAnchor || this.prepareTarget() : this.mountToTarget());
      }), M(this.mountToTargetJob);
    }
    mountToTarget() {
      let e = this.prepareTarget();
      e && (this.ensureChildrenInitialized(), this.mount(e, this.targetAnchor, 2));
    }
    handlePropsUpdate() {
      !this.parent || U || (this.isDisabled ? (this.ensureChildrenInitialized(), this.mount(this.parent, this.anchor, 1), this.targetAnchor || (gi(this.resolvedProps) || !this.parent.isConnected ? this.queueTargetUpdate() : this.prepareTarget())) : gi(this.resolvedProps) || !this.parent.isConnected ? this.queueTargetUpdate() : this.mountToTarget());
    }
    hydrateTargetAnchors(e, t) {
      let n = t;
      for (;n; ) {
        if (n.nodeType === 8) {
          if (n.data === `teleport start anchor`)
            this.targetStart = n;
          else if (n.data === `teleport anchor`) {
            this.targetAnchor = Xf(n), e._lpa = this.targetAnchor.nextSibling;
            break;
          }
        }
        n = n.nextSibling;
      }
    }
    hydrateDisabledTeleport(e, t) {
      if (!U)
        return;
      let n = this.placeholder.nextSibling;
      G(n), this.anchor = Xf(Qv(n)), this.mountState = { location: 1, container: q(this.anchor), anchor: this.anchor }, e ? this.hydrateTargetAnchors(e, t) : (this.targetStart = t, this.targetAnchor = t && t.nextSibling), this.initChildren();
    }
    mountChildren(e) {
      U && (e.appendChild(this.targetStart = K(``)), e.appendChild(this.targetAnchor = Xf(K(``))), this.mountState = { location: 2, container: e, anchor: this.targetAnchor }, ba(e, 1) || ra(), Ef(this.initChildren.bind(this)));
    }
    updateCssVars() {
      let e = this.scopeOwner;
      if (e && e.ut) {
        let t, n;
        if (this.mountState.location === 1)
          t = this.placeholder, n = this.anchor;
        else if (this.mountState.location === 2)
          t = this.targetStart, n = this.targetAnchor;
        else
          return;
        for (;t && t !== n; )
          t.nodeType === 1 && t.setAttribute(`data-v-owner`, String(e.uid)), t = t.nextSibling;
        jn();
        try {
          e.ut();
        } finally {
          Mn();
        }
      }
    }
  };
  var Zv = Jh(Yv);
  function Qv(e = H) {
    let t = 0;
    for (;e; ) {
      if (W(e, `teleport start`))
        t++;
      else if (W(e, `teleport end`)) {
        if (t === 0)
          return e;
        t--;
      }
      e = e.nextSibling;
    }
    return null;
  }
  var $v = new WeakMap;
  var ry;
  function iy(e, t = 0, n) {
    let r = !!(t & 1), i = !!(t & 2), a;
    return () => {
      if (U) {
        e[0] === `<` && e[1] === `!` || Im();
        let t = null;
        return i && !W(H, ``) ? (t = ep(H), e !== `` && e[0] !== `<` && Gf(t, e), a || (a = t.cloneNode(true)), Pf(t)) : t = Mf(H, e, false, n), r && (t.$root = true), t;
      }
      if (a) {
        let e = a.cloneNode(true);
        return r && (e.$root = true), e;
      }
      if (e[0] !== `<`)
        return K(e);
      if (ry = ry || globalThis.__pocketDocument.createElement(`template`), n) {
        let t = n === 1 ? `svg` : `math`;
        ry.innerHTML = `<${t}>${e}</${t}>`, a = lp(lp(ry.content));
      } else
        ry.innerHTML = e, a = lp(ry.content);
      let t = a.cloneNode(true);
      return r && (t.$root = true), t;
    };
  }
  function ay(e, t, n, r = 1) {
    let i = mf, a = hf;
    U || vf();
    let o = null, s, c;
    if (r & 16) {
      let i = e();
      U && (s = oy(r, i), o = Ff(s === 2)), c = i ? t() : n ? n() : [K()];
    } else {
      let i = r >> 8, a = i > 0, l = a ? (i - 1) * 2 : 0, u = !!(r & 128), d = new Hh(U ? `if` : undefined, a, false, u, u ? () => {
        let e = d.anchor, t = e.parentNode;
        t && ag(e, t);
      } : undefined);
      c = d, Y(() => {
        let i = e();
        U && (s = oy(r, i), o = Ff(s === 2)), d.update(i ? t : n, a ? l + +!i : undefined, sy(r, i));
      });
    }
    if (!U)
      i && Z(c, i, a);
    else {
      if (s === 0 && o) {
        let e = o.start;
        e && H === e && e.nodeType === 8 && e.data === `` && Pf(e);
      }
      Lf(o);
    }
    return c;
  }
  function oy(e, t) {
    return e >> (t ? 0 : 2) & 3;
  }
  function sy(e, t) {
    return !!(e & (t ? 32 : 64));
  }
  function cy(e, t) {
    let n = mf, r = hf;
    U || vf();
    let i = U ? If() : null, a = new Hh(undefined, true);
    return Y(() => a.update(t, e())), U ? Lf(i) : n && Z(a, n, r), a;
  }
  var ly;
  function uy(e) {
    ly = e;
  }
  var Gy = new WeakMap;
  var Ky = new WeakMap;
  var qy = new WeakMap;
  var Jy = false;
  var Yy;
  function Xy() {
    Jy || (Jy = true, uy((e, t) => {
      let n = Yy;
      if (!n || e !== n && e.parentNode !== n)
        return;
      let r = t && t !== n && t.parentNode === n ? t : null, i = Xf(K());
      return n.insertBefore(i, r), i;
    }));
  }
  var Zy = ((e) => (delete e.props.mode, e))(Ug({ name: `VaporTransitionGroup`, props: c({}, du, { tag: String, moveClass: String }), setup(e, { slots: t, expose: n }) {
    n(), Qg();
    let r = B, i = Oi(), a, o = new Proxy({}, { get(e, t) {
      return a[t];
    } });
    Y(() => a = hu(e), true);
    let s = [], c = false, l = false, u = [], d = () => {
      if (c)
        return;
      c = true, s = [];
      let e = __(u);
      for (let t = 0;t < e.length; t++) {
        let n = e[t], r = O_(n) && n.$transition ? k_(n) : undefined;
        r && !r[ku] && (s.push(n), n.$transition.disabled = true, Gy.set(n, r.getBoundingClientRect()));
      }
    }, f = () => {
      if (l = false, !c || (c = false, !s.length))
        return;
      let t = e.moveClass || `${e.name || `v`}-move`, n = nb(s), r = !!(n && Dd(n, n.parentNode, t));
      if (s.forEach((e) => {
        e.$transition.disabled = false, r && Sd(e);
      }), !r) {
        s = [];
        return;
      }
      s.forEach(eb);
      let i = s.filter(tb);
      Eu(), i.forEach((e) => Od(k_(e), t)), s = [];
    }, p = () => {
      !c || l || (l = true, M(f));
    };
    eo(d), to(p);
    let m = new Hh(`transition-group`), h, g, _ = false;
    return Y(() => {
      let n = e.tag, a = t.default;
      if (_ && n === h && a === g)
        return;
      let s = n ? U ? Mf(H, `<${n}/>`) : rp(n) : undefined, c = null, l;
      U && s && (Xy(), l = Yy, Yy = s, c = zf(s), G(s.firstChild || s));
      let f = u, v = [];
      try {
        m.update(() => (f = a && a() || [], v = Qy(f, o, i, r, { beforeUpdate: d, updated: p }), s ? (U || Z(f, s), s) : f)), U && s && H && H.parentNode === s && !v.some((e) => e === H) && Yf(H, s);
      } finally {
        U && s && (Yy = l, G(c));
      }
      u = f, h = n, g = a, _ = true;
    }), m;
  } }));
  function Qy(e, t, n, r, i) {
    let a = [], o = __(e, (e) => a.push(e), (e) => $y(e, i));
    for (let e = 0;e < o.length; e++) {
      let i = o[e];
      O_(i) && i.$key != null && T_(i, l_(i, t, n, r));
    }
    return a.forEach((e) => {
      let a = l_(e, t, n, r);
      a.applyGroup = (e, t, n, r) => Qy(e, t, n, r, i), e.$transition = a;
    }), o;
  }
  function $y(e, t) {
    let n = qy.get(e);
    if (n) {
      n.beforeUpdate = t.beforeUpdate, n.updated = t.updated;
      return;
    }
    if (qy.set(e, t), X(e))
      (e.onBeforeUpdate || (e.onBeforeUpdate = [])).push(() => t.beforeUpdate()), (e.onUpdated || (e.onUpdated = [])).push(() => t.updated());
    else {
      let n = false, r = () => {
        n = false, t.updated();
      };
      e.scope.run(() => {
        Qn(() => {
          let t = V(e, e.scope);
          try {
            return kp(e.rawProps);
          } finally {
            V(...t);
          }
        }, () => {
          n || (n = true, t.beforeUpdate(), M(r));
        });
      });
    }
  }
  function eb(e) {
    let t = k_(e);
    t && Ky.set(e, t.getBoundingClientRect());
  }
  function tb(e) {
    let t = k_(e);
    if (t && Td(Gy.get(e), Ky.get(e), t))
      return e;
  }
  function nb(e) {
    for (let t = 0;t < e.length; t++) {
      let n = e[t], r = k_(n);
      if (r && r.isConnected)
        return r;
    }
  }

  // tmp/pocketjs/framework/src/renderer-vue-vapor.ts
  var insertVaporBlock = Z;
  var removeVaporBlock = Q;
  var createPocketVaporApp = Vg;
  function normalizeVaporBlock(block) {
    while (typeof block === "function" && block.length === 0) {
      block = block();
    }
    if (block == null || typeof block === "boolean")
      return;
    if (!Array.isArray(block))
      return block;
    const out = [];
    for (const child of block) {
      const normalized = normalizeVaporBlock(child);
      if (Array.isArray(normalized))
        out.push(...normalized);
      else if (normalized !== undefined)
        out.push(normalized);
    }
    return out.length > 0 ? out : undefined;
  }
  function createElement2(type) {
    return createElement(type);
  }
  function createRenderRoot(root) {
    let current;
    return {
      update(node) {
        if (current)
          removeVaporBlock(current, root);
        current = normalizeVaporBlock(node);
        if (current)
          insertVaporBlock(current, root);
      },
      dispose() {
        if (current)
          removeVaporBlock(current, root);
        current = undefined;
      }
    };
  }
  function render(code, root) {
    const component = typeof code === "function" ? {
      setup: code
    } : code;
    const app = createPocketVaporApp(component);
    app.mount(root);
    return () => app.unmount();
  }

  // tmp/pocketjs/framework/src/overlay.ts
  var overlayRoot = null;
  function setOverlayRoot(root) {
    overlayRoot = root;
  }
  function getOverlayRoot() {
    if (!overlayRoot) {
      throw new Error("PocketJS: overlay root is not installed");
    }
    return overlayRoot;
  }

  // tmp/pocketjs/framework/src/styles.ts
  var verbatim = new Map;
  var sortedAlias = new Map;
  function normalize(cls) {
    return cls.trim().replace(/\s+/g, " ");
  }
  function sortTokens(normalized) {
    return normalized.split(" ").sort().join(" ");
  }
  var ALIAS_AMBIGUOUS = -1;
  function registerStyles(table) {
    for (const key of Object.keys(table)) {
      const id = table[key];
      const norm = normalize(key);
      verbatim.set(norm, id);
      const sorted = sortTokens(norm);
      const prev = sortedAlias.get(sorted);
      sortedAlias.set(sorted, prev !== undefined && prev !== id ? ALIAS_AMBIGUOUS : id);
    }
  }
  function resolveStyle(cls) {
    const norm = normalize(cls);
    const hit = verbatim.get(norm);
    if (hit !== undefined)
      return hit;
    const alias = sortedAlias.get(sortTokens(norm));
    return alias === ALIAS_AMBIGUOUS ? undefined : alias;
  }

  // tmp/pocketjs/framework/src/frame-vue-vapor.ts
  var callbacks2 = new Set;
  var buttonHandlerBlockDepth = 0;
  function resetFrameHooks() {
    callbacks2.clear();
    buttonHandlerBlockDepth = 0;
    __resetAnalog();
  }
  function runFrameHooks(buttons) {
    for (const cb of [...callbacks2])
      cb(buttons);
  }
  function onFrame(callback) {
    callbacks2.add(callback);
    Vn(() => callbacks2.delete(callback), true);
  }
  function pushButtonHandlerBlock() {
    buttonHandlerBlockDepth++;
    let disposed = false;
    return () => {
      if (disposed)
        return;
      disposed = true;
      buttonHandlerBlockDepth = Math.max(0, buttonHandlerBlockDepth - 1);
    };
  }
  function onButtonPress(mask, callback, opts = {}) {
    let prevButtons = opts.latched ? ~0 : 0;
    onFrame((buttons) => {
      const pressed = buttons & ~prevButtons;
      prevButtons = buttons;
      const active = typeof opts.active === "function" ? opts.active() : opts.active ?? true;
      if (!active)
        return;
      if (buttonHandlerBlockDepth > 0 && !opts.allowWhenBlocked)
        return;
      if (pressed & mask)
        callback(pressed, buttons);
    });
  }

  // tmp/pocketjs/framework/src/touch.ts
  var LEGACY_COORD_BITS = 9;
  var LEGACY_COORD_MASK = (1 << LEGACY_COORD_BITS) - 1;
  var LEGACY_ID_SHIFT = LEGACY_COORD_BITS * 2;
  var WIDE_MARKER = 2147483648;
  var WIDE_COORD_BITS = 10;
  var WIDE_COORD_MASK = (1 << WIDE_COORD_BITS) - 1;
  var WIDE_ID_SHIFT = WIDE_COORD_BITS * 2;
  var CANCEL_MARKER = 1073741824;
  var EMPTY = Object.freeze([]);
  var primarySnapshot = EMPTY;
  var auxiliarySnapshot = EMPTY;
  var allSnapshot = EMPTY;
  var cancelledSnapshot = EMPTY;
  function __setTouches(packed, hits, surfaces) {
    cancelledSnapshot = EMPTY;
    if (!packed || packed.length === 0) {
      primarySnapshot = EMPTY;
      auxiliarySnapshot = EMPTY;
      allSnapshot = EMPTY;
      return;
    }
    const all = [], cancelled = [];
    for (let index = 0;index < Math.min(packed.length, 16); index++) {
      const value = packed[index];
      const output = value & CANCEL_MARKER ? cancelled : all;
      if (output.length >= 8)
        continue;
      const wide = (value & WIDE_MARKER) !== 0;
      const coordBits = wide ? WIDE_COORD_BITS : LEGACY_COORD_BITS;
      const coordMask = wide ? WIDE_COORD_MASK : LEGACY_COORD_MASK;
      const idShift = wide ? WIDE_ID_SHIFT : LEGACY_ID_SHIFT;
      output.push(Object.freeze({
        surface: surfaces?.[index] === 1 ? "auxiliary" : "primary",
        id: value >>> idShift & 255,
        x: value & coordMask,
        y: value >>> coordBits & coordMask,
        hit: hits?.[index]
      }));
    }
    cancelledSnapshot = Object.freeze(cancelled);
    allSnapshot = Object.freeze(all);
    primarySnapshot = Object.freeze(all.filter((contact) => contact.surface === "primary"));
    auxiliarySnapshot = Object.freeze(all.filter((contact) => contact.surface === "auxiliary"));
  }
  function __cancelledTouches() {
    return cancelledSnapshot;
  }
  function __allTouches() {
    return allSnapshot;
  }
  function __resetTouches() {
    cancelledSnapshot = EMPTY;
    primarySnapshot = EMPTY;
    auxiliarySnapshot = EMPTY;
    allSnapshot = EMPTY;
  }

  // tmp/pocketjs/framework/src/gesture-core.ts
  var MAX_TRACKS = 8;
  var HIST = 8;
  var VELOCITY_WINDOW = 3;
  var DEFAULT_TAP_SLOP = 8;
  var DEFAULT_PAN_SLOP = 6;
  var DEFAULT_PINCH_SLOP = 10;
  var DEFAULT_LONG_PRESS_S = 0.5;
  var OBSERVING = 1;
  var TAP_DEAD = 2;
  var LONGPRESS_FIRED = 4;
  var PANNING = 8;
  var recognizers = [];
  var blockDepth = 0;
  var liveCount = 0;
  var tracks = Array.from({
    length: MAX_TRACKS
  }, (_, slot) => ({
    slot,
    used: false,
    present: false,
    surface: "primary",
    id: 0,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    fdx: 0,
    fdy: 0,
    vx: 0,
    vy: 0,
    downFrame: 0,
    frames: 0,
    histX: new Int16Array(HIST),
    histY: new Int16Array(HIST),
    histHead: 0,
    histLen: 0,
    owners: [],
    claimedBy: null
  }));
  var pinchScratch = {
    ax: 0,
    ay: 0,
    bx: 0,
    by: 0,
    cx: 0,
    cy: 0,
    span: 0,
    startSpan: 0,
    dspan: 0,
    fdspan: 0
  };
  function withinSubtree(node, ancestor) {
    let n = node;
    while (n) {
      if (n === ancestor)
        return true;
      n = n.parent;
    }
    return false;
  }
  function regionMatches(rec, x, y, hitBox) {
    if ((rec.opts.surface ?? "primary") !== hitBox.surface)
      return false;
    const region = rec.opts.region;
    if (!region)
      return true;
    const target = region.node?.();
    if (target) {
      if (hitBox.hit === undefined) {
        hitBox.hit = resolveTouchHit(x, y, hitBox.fact, hitBox.surface);
      }
      const hit = hitBox.hit;
      if (hit)
        return withinSubtree(hit, target);
    }
    const r = region.rect?.();
    if (!r)
      return false;
    return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
  }
  function hasPinchHandlers(rec) {
    return !!(rec.opts.onPinchStart || rec.opts.onPinchMove || rec.opts.onPinchEnd);
  }
  function pinchSpan(axis, a, b) {
    if (axis === "y") {
      const d = a.y - b.y;
      return d < 0 ? -d : d;
    }
    if (axis === "x") {
      const d = a.x - b.x;
      return d < 0 ? -d : d;
    }
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function fillPinchScratch(rec, a, b) {
    const axis = rec.opts.axis ?? "any";
    const span = pinchSpan(axis, a, b);
    pinchScratch.ax = a.x;
    pinchScratch.ay = a.y;
    pinchScratch.bx = b.x;
    pinchScratch.by = b.y;
    pinchScratch.cx = (a.x + b.x) / 2;
    pinchScratch.cy = (a.y + b.y) / 2;
    pinchScratch.span = span;
    pinchScratch.startSpan = rec.baseSpan;
    pinchScratch.dspan = span - rec.baseSpan;
    pinchScratch.fdspan = span - rec.prevSpan;
  }
  function clearPinchPair(rec) {
    rec.pairA = -1;
    rec.pairB = -1;
  }
  function endPinch(rec) {
    if (rec.pinchA < 0)
      return;
    const a = tracks[rec.pinchA];
    const b = tracks[rec.pinchB];
    rec.pinchA = -1;
    rec.pinchB = -1;
    clearPinchPair(rec);
    fillPinchScratch(rec, a, b);
    rec.opts.onPinchEnd?.(pinchScratch);
  }
  function fireCancel(rec, t) {
    rec.flags[t.slot] = 0;
    if (t.claimedBy === rec)
      t.claimedBy = null;
    if (rec.pinchA === t.slot || rec.pinchB === t.slot)
      endPinch(rec);
    rec.opts.onCancel?.(t);
  }
  function claim(t, winner) {
    t.claimedBy = winner;
    for (const o of t.owners) {
      if (o !== winner && o.flags[t.slot] & OBSERVING)
        fireCancel(o, t);
    }
  }
  function releaseTrack(t) {
    for (const o of t.owners)
      o.flags[t.slot] = 0;
    t.owners.length = 0;
    t.claimedBy = null;
    t.used = false;
    liveCount--;
  }
  function beginTrack(t, surface, id, x, y, fact) {
    t.used = true;
    t.present = true;
    t.hit = fact;
    t.surface = surface;
    t.id = id;
    t.x = x;
    t.y = y;
    t.startX = x;
    t.startY = y;
    t.dx = 0;
    t.dy = 0;
    t.fdx = 0;
    t.fdy = 0;
    t.vx = 0;
    t.vy = 0;
    t.downFrame = virtualFrame();
    t.frames = 0;
    t.histX[0] = x;
    t.histY[0] = y;
    t.histHead = 1;
    t.histLen = 1;
    t.owners.length = 0;
    t.claimedBy = null;
    liveCount++;
    const hitBox = {
      hit: undefined,
      fact,
      surface
    };
    for (let i = recognizers.length - 1;i >= 0; i--) {
      const rec = recognizers[i];
      if (rec.disposed)
        continue;
      if (blockDepth > 0 && !rec.opts.allowWhenBlocked)
        continue;
      if (!regionMatches(rec, x, y, hitBox))
        continue;
      rec.flags[t.slot] = OBSERVING;
      t.owners.push(rec);
    }
    for (const o of t.owners)
      o.opts.onDown?.(t);
  }
  function updateTrack(t, x, y) {
    t.present = true;
    t.fdx = x - t.x;
    t.fdy = y - t.y;
    t.x = x;
    t.y = y;
    t.dx = x - t.startX;
    t.dy = y - t.startY;
    t.frames++;
    t.histX[t.histHead] = x;
    t.histY[t.histHead] = y;
    t.histHead = (t.histHead + 1) % HIST;
    if (t.histLen < HIST)
      t.histLen++;
    const k = Math.min(VELOCITY_WINDOW, t.histLen - 1);
    if (k <= 0) {
      t.vx = 0;
      t.vy = 0;
      return;
    }
    const hz = simulationHz();
    const last = (t.histHead - 1 + HIST) % HIST;
    const prev = (last - k + HIST) % HIST;
    t.vx = (t.histX[last] - t.histX[prev]) * hz / k;
    t.vy = (t.histY[last] - t.histY[prev]) * hz / k;
  }
  function recognizePinches() {
    for (let i = recognizers.length - 1;i >= 0; i--) {
      const rec = recognizers[i];
      if (rec.disposed || !hasPinchHandlers(rec))
        continue;
      if (rec.pinchA >= 0) {
        const a = tracks[rec.pinchA];
        const b = tracks[rec.pinchB];
        fillPinchScratch(rec, a, b);
        rec.opts.onPinchMove?.(pinchScratch);
        rec.prevSpan = pinchScratch.span;
        continue;
      }
      let a = null;
      let b = null;
      for (const t of tracks) {
        if (!t.used || !t.present || t.claimedBy)
          continue;
        if (!(rec.flags[t.slot] & OBSERVING))
          continue;
        if (!a)
          a = t;
        else if (!b)
          b = t;
        else
          break;
      }
      if (!a || !b) {
        clearPinchPair(rec);
        continue;
      }
      const axis = rec.opts.axis ?? "any";
      if (rec.pairA !== a.slot || rec.pairB !== b.slot) {
        rec.pairA = a.slot;
        rec.pairB = b.slot;
        rec.baseSpan = pinchSpan(axis, a, b);
        rec.baseCx = (a.x + b.x) / 2;
        rec.baseCy = (a.y + b.y) / 2;
        rec.prevSpan = rec.baseSpan;
        continue;
      }
      const span = pinchSpan(axis, a, b);
      const dspan = span - rec.baseSpan;
      const absDspan = dspan < 0 ? -dspan : dspan;
      const slop = rec.opts.pinchSlop ?? DEFAULT_PINCH_SLOP;
      if (absDspan <= slop)
        continue;
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      const travelX = cx - rec.baseCx;
      const travelY = cy - rec.baseCy;
      const travel = axis === "y" ? travelY < 0 ? -travelY : travelY : axis === "x" ? travelX < 0 ? -travelX : travelX : Math.sqrt(travelX * travelX + travelY * travelY);
      if (absDspan < travel)
        continue;
      rec.pinchA = a.slot;
      rec.pinchB = b.slot;
      rec.flags[a.slot] |= TAP_DEAD;
      rec.flags[b.slot] |= TAP_DEAD;
      claim(a, rec);
      claim(b, rec);
      fillPinchScratch(rec, a, b);
      rec.opts.onPinchStart?.(pinchScratch);
      rec.prevSpan = pinchScratch.span;
    }
  }
  function recognize(t) {
    const moved = t.fdx !== 0 || t.fdy !== 0;
    const adx = t.dx < 0 ? -t.dx : t.dx;
    const ady = t.dy < 0 ? -t.dy : t.dy;
    for (const rec of t.owners) {
      const f = rec.flags[t.slot];
      if (!(f & OBSERVING))
        continue;
      if (moved)
        rec.opts.onMove?.(t);
      const slop = rec.opts.tapSlop ?? DEFAULT_TAP_SLOP;
      if (!(f & TAP_DEAD) && (adx > slop || ady > slop)) {
        rec.flags[t.slot] |= TAP_DEAD;
      }
    }
    if (!t.claimedBy) {
      for (const rec of t.owners) {
        const f = rec.flags[t.slot];
        if (!(f & OBSERVING) || f & (TAP_DEAD | LONGPRESS_FIRED))
          continue;
        if (!rec.opts.onLongPress)
          continue;
        const deadline = Math.max(1, Math.round((rec.opts.longPressSeconds ?? DEFAULT_LONG_PRESS_S) * simulationHz()));
        if (t.frames < deadline)
          continue;
        rec.flags[t.slot] |= LONGPRESS_FIRED;
        rec.opts.onLongPress(t);
        claim(t, rec);
        break;
      }
    }
    if (!t.claimedBy) {
      for (const rec of t.owners) {
        const f = rec.flags[t.slot];
        if (!(f & OBSERVING) || f & PANNING)
          continue;
        if (!rec.opts.onPanStart && !rec.opts.onPanMove && !rec.opts.onPanEnd)
          continue;
        const slop = rec.opts.panSlop ?? DEFAULT_PAN_SLOP;
        if (adx <= slop && ady <= slop)
          continue;
        const axis = rec.opts.axis ?? "any";
        if (axis === "y" ? ady < adx : axis === "x" ? adx < ady : false) {
          continue;
        }
        rec.flags[t.slot] |= PANNING | TAP_DEAD;
        rec.opts.onPanStart?.(t);
        claim(t, rec);
        break;
      }
    }
    for (const rec of t.owners) {
      if ((rec.flags[t.slot] & (OBSERVING | PANNING)) === (OBSERVING | PANNING)) {
        rec.opts.onPanMove?.(t);
      }
    }
  }
  function finishTrack(t) {
    for (const rec of t.owners) {
      if (rec.pinchA === t.slot || rec.pinchB === t.slot)
        endPinch(rec);
    }
    for (const rec of t.owners) {
      const f = rec.flags[t.slot];
      if (!(f & OBSERVING))
        continue;
      rec.opts.onUp?.(t);
      if (f & PANNING)
        rec.opts.onPanEnd?.(t);
    }
    if (!t.claimedBy) {
      for (const rec of t.owners) {
        const f = rec.flags[t.slot];
        if (!(f & OBSERVING) || f & (TAP_DEAD | LONGPRESS_FIRED | PANNING))
          continue;
        if (!rec.opts.onTap)
          continue;
        rec.opts.onTap(t);
        break;
      }
    }
    releaseTrack(t);
  }
  function __runGestures() {
    const snap = __allTouches();
    if (snap.length === 0 && liveCount === 0)
      return;
    const cancelled = __cancelledTouches();
    for (const t of tracks) {
      if (t.used && cancelled.some((c) => c.surface === t.surface && c.id === t.id)) {
        for (const rec of t.owners)
          if (rec.flags[t.slot] & OBSERVING)
            fireCancel(rec, t);
        releaseTrack(t);
      } else if (t.used && !snap.some((c) => c.surface === t.surface && c.id === t.id))
        finishTrack(t);
      t.present = false;
    }
    for (const c of snap) {
      let found = null;
      for (const t of tracks) {
        if (t.used && t.surface === c.surface && t.id === c.id) {
          found = t;
          break;
        }
      }
      if (found) {
        updateTrack(found, c.x, c.y);
        continue;
      }
      let free = null;
      for (const t of tracks) {
        if (!t.used) {
          free = t;
          break;
        }
      }
      if (free)
        beginTrack(free, c.surface, c.id, c.x, c.y, c.hit);
    }
    for (const t of tracks) {
      if (t.used && !t.present)
        finishTrack(t);
    }
    recognizePinches();
    for (const t of tracks) {
      if (t.used && t.present)
        recognize(t);
    }
  }
  function cancelContactsFor(rec) {
    for (const t of tracks) {
      if (t.used && rec.flags[t.slot] & OBSERVING)
        fireCancel(rec, t);
    }
  }
  function attachGesture(opts) {
    const rec = {
      opts,
      disposed: false,
      flags: new Uint8Array(MAX_TRACKS),
      pairA: -1,
      pairB: -1,
      baseSpan: 0,
      baseCx: 0,
      baseCy: 0,
      prevSpan: 0,
      pinchA: -1,
      pinchB: -1
    };
    recognizers.push(rec);
    return {
      dispose() {
        if (rec.disposed)
          return;
        cancelContactsFor(rec);
        endPinch(rec);
        rec.disposed = true;
        const i = recognizers.lastIndexOf(rec);
        if (i >= 0)
          recognizers.splice(i, 1);
      },
      cancel() {
        if (!rec.disposed)
          cancelContactsFor(rec);
      },
      get panning() {
        for (const t of tracks) {
          if (t.used && rec.flags[t.slot] & PANNING)
            return true;
        }
        return false;
      },
      get pinching() {
        return rec.pinchA >= 0;
      }
    };
  }
  function resetGestures() {
    recognizers.length = 0;
    blockDepth = 0;
    liveCount = 0;
    for (const t of tracks) {
      t.used = false;
      t.present = false;
      t.owners.length = 0;
      t.claimedBy = null;
    }
  }

  // tmp/pocketjs/framework/src/gesture.vue-vapor.ts
  function createGesture(opts) {
    const handle = attachGesture(opts);
    Vn(() => handle.dispose(), true);
    return handle;
  }

  // tmp/pocketjs/framework/src/touch-activation.ts
  function installTouchActivation() {
    const install = (surface) => createGesture({
      surface,
      onDown: (c) => {
        const target = touchFocusable(c.x, c.y, c.hit, c.surface);
        if (target)
          setActiveNode(target);
      },
      onTap: (c) => {
        setActiveNode(null);
        const target = touchFocusable(c.x, c.y, c.hit, c.surface);
        if (target)
          pressNode(target);
      },
      onUp: () => setActiveNode(null),
      onCancel: () => setActiveNode(null)
    });
    const primary = install("primary");
    const auxiliary = install("auxiliary");
    return {
      dispose() {
        primary.dispose();
        auxiliary.dispose();
      },
      cancel() {
        primary.cancel();
        auxiliary.cancel();
      },
      get panning() {
        return primary.panning || auxiliary.panning;
      },
      get pinching() {
        return primary.pinching || auxiliary.pinching;
      }
    };
  }

  // tmp/pocketjs/framework/src/effects.ts
  var nextId = 1;
  var pending = new Map;
  var queue = [];
  function traceSink() {
    const s = globalThis.__pocketEffectTrace;
    return typeof s === "function" ? s : null;
  }
  function resetEffects() {
    nextId = 1;
    pending.clear();
    queue = [];
  }
  function __drainEffects() {
    if (queue.length === 0)
      return;
    const batch = queue;
    queue = [];
    for (const {
      id,
      result
    } of batch) {
      const entry = pending.get(id);
      if (!entry)
        continue;
      pending.delete(id);
      traceSink()?.({
        t: "delivery",
        frame: virtualFrame(),
        id,
        kind: entry.kind
      });
      entry.onResult(result);
    }
  }

  // tmp/pocketjs/framework/src/services.ts
  var pumps = new Set;
  function runServicePumps() {
    if (pumps.size === 0)
      return;
    for (const pump of pumps)
      pump();
  }

  // tmp/pocketjs/framework/src/styles.generated.ts
  var STYLE_IDS = {
    grow: 0,
    "relative w-full h-full bg-black flex flex-col items-center": 1,
    "flex flex-row items-center justify-center": 2,
    "text-base text-white": 3,
    "flex flex-col items-center justify-center rounded-xl": 4,
    "text-sm text-white": 5,
    "text-xs text-white": 6,
    "flex flex-row items-center justify-center gap-2": 7,
    "flex items-center justify-center rounded-xl bg-blue-500": 8,
    "flex items-center justify-center rounded-xl bg-zinc-800": 9,
    "flex items-center justify-center": 10,
    "text-xs text-zinc-400": 11,
    "relative flex-col w-full h-full bg-slate-50 overflow-hidden": 12,
    "absolute inset-0 z-50 flex-col items-center justify-center": 13,
    "absolute inset-0 bg-slate-950": 14,
    "flex-col gap-2 w-[328] p-3 rounded-xl shadow-lg bg-white border-slate-200": 15,
    "absolute left-3 right-3 bottom-3 flex-row items-center justify-between px-2 py-1 rounded-lg shadow-md bg-white border-slate-200": 16,
    "flex-row flex-wrap": 17,
    hidden: 18
  };

  // tmp/pocketjs/framework/src/index-vue-vapor.ts
  var STYLES_KEY = "ui:styles";
  var FONT_PREFIX = "ui:font.";
  var IMG_PREFIX = "ui:img.";
  var SPRITE_PREFIX = "ui:sprite.";
  function globalOps() {
    return globalThis.ui;
  }
  function uploadPakImages(ops) {
    if (ops.__textures)
      return;
    for (const key of entries(IMG_PREFIX)) {
      const blob = get(key);
      let handle;
      if (ops.uploadImgEntry) {
        handle = ops.uploadImgEntry(blob);
      } else {
        const dv = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
        handle = ops.uploadTexture(blob.subarray(8), dv.getUint16(0, true), dv.getUint16(2, true), blob[4]);
      }
      if (handle >= 0)
        registerTexture(key.slice(IMG_PREFIX.length), handle);
    }
  }
  function uploadPakSprites(ops) {
    if (ops.__sprites)
      return;
    for (const key of entries(SPRITE_PREFIX)) {
      const blob = get(key);
      const dv = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
      const w = dv.getUint16(0, true);
      const h = dv.getUint16(2, true);
      const psm = blob[4];
      const frames = dv.getUint16(6, true);
      const cols = dv.getUint16(8, true);
      const step = dv.getUint16(10, true);
      const handle = ops.uploadTexture(blob.subarray(16), w, h, psm);
      if (handle >= 0) {
        registerSprite(key.slice(SPRITE_PREFIX.length), {
          handle,
          frames,
          cols,
          step
        });
      }
    }
  }
  function createLayer(style) {
    const layer = createElement2("view");
    setProp(layer, "style", style, undefined);
    return layer;
  }
  var appLayer = null;
  var overlayLayer = null;
  function resizeViewport(w, h) {
    if (!appLayer || !overlayLayer)
      return;
    setProp(appLayer, "style", {
      width: w,
      height: h,
      overflow: ENUMS.Overflow.Hidden
    }, undefined);
    setProp(overlayLayer, "style", {
      width: w,
      height: h,
      posType: ENUMS.PosType.Absolute,
      insetT: 0,
      insetR: 0,
      insetB: 0,
      insetL: 0,
      zIndex: 1000,
      hitPass: 1
    }, undefined);
    const ops = getOps();
    ops.__viewport = {
      w,
      h
    };
  }
  function render2(code, opts = {}) {
    const host = detectHost(opts.ops);
    installHost(host);
    setStyleResolver(resolveStyle);
    if (opts.styles)
      registerStyles(opts.styles);
    const nativeTextureTable = host.kind === "native" ? host.ops.__textures : undefined;
    if (host.kind === "native") {
      if (nativeTextureTable) {
        for (const key in nativeTextureTable) {
          registerTexture(key, nativeTextureTable[key]);
        }
      }
      const spr = host.ops.__sprites;
      if (spr) {
        for (const key in spr)
          registerSprite(key, spr[key]);
      }
    }
    if (host.kind === "injected" || nativeTextureTable === undefined) {
      if (opts.pak)
        loadPack(opts.pak);
      if (hasPack()) {
        for (const key of entries()) {
          if (key === STYLES_KEY) {
            host.ops.loadStyles?.(get(key));
          } else if (key.startsWith(FONT_PREFIX)) {
            host.ops.loadFontAtlas?.(get(key));
          }
        }
      }
    }
    const auxiliary = mountAuxiliarySurface(host.ops);
    const viewport = hostViewport(host.ops);
    const layerW = viewport?.w ?? SCREEN_W;
    const layerH = viewport?.h ?? SCREEN_H;
    const appRoot = createLayer({
      width: layerW,
      height: layerH,
      overflow: ENUMS.Overflow.Hidden
    });
    const overlayRoot = createLayer({
      width: layerW,
      height: layerH,
      posType: ENUMS.PosType.Absolute,
      insetT: 0,
      insetR: 0,
      insetB: 0,
      insetL: 0,
      zIndex: 1000,
      hitPass: 1
    });
    insertNode(rootMirror, appRoot);
    insertNode(rootMirror, overlayRoot);
    setOverlayRoot(overlayRoot);
    appLayer = appRoot;
    overlayLayer = overlayRoot;
    setInputRoot(appRoot);
    setHitRoot(rootMirror);
    setAuxiliaryHitRoot(auxiliary?.native ?? null);
    resetFrameHooks();
    resetGestures();
    installTouchActivation();
    resetClock();
    resetEffects();
    initDevtools(host.ops);
    installFrameHandler(wrapFrameHandler((buttons, analog, touches, hits, touchSurfaces, rightAnalog) => {
      __advanceClock();
      __setAnalog(analog, rightAnalog);
      __setTouches(touches, hits, touchSurfaces);
      runServicePumps();
      __drainEffects();
      __runGestures();
      runFrameHooks(buttons);
      handleFrame(buttons);
      runSweep();
    }));
    const dispose = render(code, appRoot);
    const removeResizeViewportHook = installResizeViewportHook(resizeViewport);
    return () => {
      removeResizeViewportHook();
      __resetTouches();
      resetGestures();
      dispose();
      setInputRoot(null);
      setHitRoot(null);
      setAuxiliaryHitRoot(null);
      setOverlayRoot(null);
      appLayer = null;
      overlayLayer = null;
      for (const child of rootMirror.children.splice(0)) {
        child.parent = null;
        host.ops.destroyNode(child.id);
      }
      unmountAuxiliarySurface(host.ops);
      runSweep();
    };
  }
  function mount(code, opts = {}) {
    const ops = opts.ops ?? globalOps();
    if (!ops) {
      throw new Error("PocketJS: mount() requires globalThis.ui or opts.ops");
    }
    if (opts.pak)
      loadPack(opts.pak);
    uploadPakImages(ops);
    uploadPakSprites(ops);
    return render2(code, {
      ops,
      styles: opts.styles ?? STYLE_IDS,
      pak: opts.pak
    });
  }
  // tmp/pocketjs/framework/src/anim.ts
  var EASING_BY_NAME = {
    linear: ENUMS.Easing.Linear,
    in: ENUMS.Easing.EaseIn,
    out: ENUMS.Easing.EaseOut,
    "in-out": ENUMS.Easing.EaseInOut,
    "out-back": ENUMS.Easing.OutBack,
    spring: ENUMS.Easing.Spring,
    "spring-bouncy": ENUMS.Easing.SpringBouncy
  };
  function nodeId(node) {
    return typeof node === "number" ? node : node.id;
  }
  function animatablePropId(prop) {
    const propId = PROP[prop];
    if (propId === undefined) {
      throw new Error(`PocketJS: unknown prop '${prop}'`);
    }
    if (animBit(prop) < 0) {
      throw new Error(`PocketJS: prop '${prop}' is not animatable (see spec ANIMATABLE)`);
    }
    return propId;
  }
  function animate(node, prop, to, opts = {}) {
    const propId = animatablePropId(prop);
    let easing;
    if (typeof opts.easing === "number") {
      easing = opts.easing;
    } else {
      const named = EASING_BY_NAME[opts.easing ?? "out"];
      if (named === undefined) {
        throw new Error(`PocketJS: unknown easing '${opts.easing}'`);
      }
      easing = named;
    }
    return getOps().animate(nodeId(node), propId, encodePropValue(prop, to), opts.dur ?? 200, easing, opts.delay ?? 0);
  }
  // tmp/pocketjs/framework/src/components-vue-vapor.ts
  var NO_FALLTHROUGH = {
    inheritAttrs: false
  };
  var definePocketVaporComponent = Ug;
  var insertVaporBlock2 = Z;
  function valueOf(value) {
    return typeof value === "function" ? value() : value;
  }
  function callbackOf(value) {
    if (typeof value !== "function")
      return;
    return (...args) => {
      const resolved = value(...args);
      return typeof resolved === "function" ? resolved(...args) : resolved;
    };
  }
  function booleanOption(value) {
    const resolved = valueOf(value);
    return typeof resolved === "boolean" ? resolved : undefined;
  }
  function assignRef(refValue, node) {
    const ref = refValue;
    if (!ref)
      return;
    if (typeof ref === "function") {
      const resolved = ref(node);
      if (typeof resolved === "function")
        resolved(node);
    } else {
      ref.current = node;
    }
  }
  function slotDefault(slots, ...args) {
    return withNativeTextDocument(() => {
      if (typeof slots === "function")
        return slots(...args);
      return slots?.default?.(...args);
    });
  }
  function withNativeTextDocument(fn) {
    const g = globalThis;
    const doc = g.__pocketDocument ?? g.document;
    if (!doc)
      return fn();
    const prevCreateTextNode = doc.createTextNode;
    const prevCreateComment = doc.createComment;
    try {
      doc.createTextNode = (value = "") => createTextNode(String(value));
      doc.createComment = (value = "") => createCommentNode(String(value));
      return fn();
    } finally {
      if (prevCreateTextNode)
        doc.createTextNode = prevCreateTextNode;
      else
        delete doc.createTextNode;
      if (prevCreateComment)
        doc.createComment = prevCreateComment;
      else
        delete doc.createComment;
    }
  }
  function normalizeVaporBlock2(block) {
    while (typeof block === "function" && block.length === 0) {
      block = withNativeTextDocument(() => block());
    }
    if (block == null || typeof block === "boolean")
      return null;
    if (!Array.isArray(block))
      return block;
    const out = [];
    for (const child of block) {
      const normalized = normalizeVaporBlock2(child);
      if (Array.isArray(normalized))
        out.push(...normalized);
      else if (normalized != null)
        out.push(normalized);
    }
    return out.length > 0 ? out : null;
  }
  function defaultBlock(slots, ...args) {
    return normalizeVaporBlock2(slotDefault(slots, ...args));
  }
  function normalizeClassValue(value) {
    const resolved = valueOf(value);
    if (resolved && typeof resolved === "object" && !Array.isArray(resolved)) {
      return Object.entries(resolved).filter(([, active]) => !!valueOf(active)).map(([name]) => name).join(" ");
    }
    if (!Array.isArray(resolved))
      return resolved;
    const parts = resolved.map((part) => normalizeClassValue(part)).filter((part) => typeof part === "string" && part.length > 0);
    return parts.join(" ");
  }
  function normalizeStyleValue(value) {
    const resolved = valueOf(value);
    if (!Array.isArray(resolved))
      return resolved;
    const out = {};
    for (const part of resolved) {
      const normalized = normalizeStyleValue(part);
      if (normalized && typeof normalized === "object" && !Array.isArray(normalized)) {
        Object.assign(out, normalized);
      }
    }
    return out;
  }
  function cleanProps(props, omit) {
    const out = {};
    for (const rawKey of Object.keys(props)) {
      const key = rawKey === "debug-name" ? "debugName" : rawKey === "node-ref" ? "nodeRef" : rawKey;
      if (omit.has(rawKey) || omit.has(key))
        continue;
      const rawValue = props[rawKey];
      if (key === "class" || key === "className")
        out[key] = normalizeClassValue(rawValue);
      else if (key === "style")
        out[key] = normalizeStyleValue(rawValue);
      else if (key === "onPress" || key === "on:press")
        out[key] = callbackOf(rawValue);
      else if (key === "focusable") {
        const resolved = valueOf(rawValue);
        out[key] = resolved === "" ? true : resolved;
      } else
        out[key] = valueOf(rawValue);
    }
    if (out.class == null && out.className != null)
      out.class = out.className;
    delete out.className;
    return out;
  }
  function cleanExtraProps(props) {
    const out = {};
    for (const key of Object.keys(props)) {
      if (key === "class" || key === "className")
        out[key] = normalizeClassValue(props[key]);
      else if (key === "style")
        out[key] = normalizeStyleValue(props[key]);
      else
        out[key] = props[key];
    }
    if (out.class == null && out.className != null)
      out.class = out.className;
    delete out.className;
    return out;
  }
  function insertBlock(block, parent) {
    const normalized = normalizeVaporBlock2(block);
    if (normalized)
      insertVaporBlock2(normalized, parent);
  }
  function mountChildren(node, slots) {
    insertBlock(slotDefault(slots), node);
  }
  function createPrimitiveNode(tag, rawProps, slots, opts = {}) {
    const node = createElement(tag);
    opts.onNode?.(node);
    mountChildren(node, slots);
    const omit = new Set(["children", "key", "ref", "nodeRef", "node-ref", ...opts.omit ?? []]);
    let prev = {};
    const apply = () => {
      const extra = typeof opts.extra === "function" ? opts.extra() : opts.extra ?? {};
      const next = {
        ...cleanProps(rawProps, omit),
        ...cleanExtraProps(extra)
      };
      for (const key of Object.keys(next))
        setProp(node, key, next[key], prev[key]);
      for (const key of Object.keys(prev)) {
        if (!(key in next))
          setProp(node, key, undefined, prev[key]);
      }
      prev = next;
      assignRef(rawProps.nodeRef ?? rawProps["node-ref"] ?? rawProps.ref, node);
    };
    ii(apply);
    return node;
  }
  function primitive(tag) {
    return definePocketVaporComponent((_props, {
      attrs,
      slots
    }) => createPrimitiveNode(tag, attrs, slots), NO_FALLTHROUGH);
  }
  var View = primitive("view");
  var Text2 = primitive("text");
  var Image = primitive("image");
  var Sprite = primitive("image");
  var CompositorSurface = primitive("surface");
  function resolveActive(active) {
    const resolved = valueOf(active);
    return typeof resolved === "function" ? !!resolved() : resolved ?? true;
  }
  var Screen = definePocketVaporComponent((_props, {
    attrs,
    slots
  }) => createPrimitiveNode("view", attrs, slots, {
    extra: () => ({
      class: attrs.class ?? "relative flex-col w-full h-full bg-slate-50 overflow-hidden"
    })
  }), NO_FALLTHROUGH);
  var Focusable = definePocketVaporComponent((_props, {
    attrs,
    slots
  }) => createPrimitiveNode("view", attrs, slots, {
    extra: {
      focusable: true
    }
  }), NO_FALLTHROUGH);
  var FocusScope = definePocketVaporComponent((_props, {
    attrs,
    slots
  }) => {
    let root;
    const node = createPrimitiveNode("view", attrs, slots, {
      omit: ["active", "autoFocus", "restoreFocus"],
      onNode(next) {
        root = next;
      }
    });
    ii((registerCleanup) => {
      if (!root || !resolveActive(attrs.active))
        return;
      const dispose = pushFocusScope(root, {
        autoFocus: booleanOption(attrs.autoFocus),
        restoreFocus: booleanOption(attrs.restoreFocus)
      });
      registerCleanup(dispose);
    });
    return node;
  }, NO_FALLTHROUGH);
  var FocusGrid = definePocketVaporComponent((_props, {
    attrs,
    slots
  }) => {
    let root;
    const node = createPrimitiveNode("view", attrs, slots, {
      omit: ["active", "columns", "wrap"],
      onNode(next) {
        root = next;
      }
    });
    ii((registerCleanup) => {
      if (!root || !resolveActive(attrs.active))
        return;
      const dispose = pushFocusGrid(root, {
        columns: valueOf(attrs.columns),
        wrap: booleanOption(attrs.wrap)
      });
      registerCleanup(dispose);
    });
    return node;
  }, NO_FALLTHROUGH);
  var ActionHandler = definePocketVaporComponent((_props, {
    attrs,
    slots
  }) => {
    onButtonPress(valueOf(attrs.button), (pressed, buttons) => callbackOf(attrs.onPress)?.(pressed, buttons), {
      allowWhenBlocked: booleanOption(attrs.allowWhenBlocked),
      active: () => resolveActive(attrs.active),
      latched: booleanOption(attrs.latched)
    });
    return defaultBlock(slots) ?? createCommentNode("action");
  }, NO_FALLTHROUGH);
  function createPortalRoot() {
    const marker = createCommentNode("portal");
    const host = createElement("view");
    setProp(host, "style", {
      width: SCREEN_W,
      height: SCREEN_H,
      posType: ENUMS.PosType.Absolute,
      insetT: 0,
      insetR: 0,
      insetB: 0,
      insetL: 0,
      zIndex: 1000
    }, undefined);
    insertNode(getOverlayRoot(), host);
    return {
      marker,
      host,
      root: createRenderRoot(host)
    };
  }
  var Portal = definePocketVaporComponent((_props, {
    slots
  }) => {
    const state = createPortalRoot();
    ii(() => {
      state.root.update(defaultBlock(slots));
    });
    Vn(() => {
      state.root.dispose();
      if (state.host.parent)
        detachNode(state.host.parent, state.host);
    });
    return state.marker;
  }, NO_FALLTHROUGH);
  var AuxiliarySurface = definePocketVaporComponent((_props, {
    slots
  }) => {
    const surface = getAuxiliarySurfaceRoots();
    const marker = createCommentNode("auxiliary-surface");
    const host = createElement("view");
    setProp(host, "style", {
      width: surface.viewport.width,
      height: surface.viewport.height,
      overflow: ENUMS.Overflow.Hidden
    }, undefined);
    insertNode(surface.app, host);
    const root = createRenderRoot(host);
    ii(() => root.update(defaultBlock(slots)));
    Vn(() => {
      root.dispose();
      if (host.parent)
        detachNode(host.parent, host);
    });
    return marker;
  }, NO_FALLTHROUGH);
  var AuxiliaryPortal = definePocketVaporComponent((_props, {
    slots
  }) => {
    const surface = getAuxiliarySurfaceRoots();
    const marker = createCommentNode("auxiliary-portal");
    const host = createElement("view");
    setProp(host, "style", {
      width: surface.viewport.width,
      height: surface.viewport.height,
      posType: ENUMS.PosType.Absolute,
      insetT: 0,
      insetR: 0,
      insetB: 0,
      insetL: 0,
      hitPass: 1
    }, undefined);
    insertNode(surface.overlay, host);
    const root = createRenderRoot(host);
    ii(() => root.update(defaultBlock(slots)));
    Vn(() => {
      root.dispose();
      if (host.parent)
        detachNode(host.parent, host);
    });
    return marker;
  }, NO_FALLTHROUGH);
  var Modal = definePocketVaporComponent((_props, {
    attrs,
    slots
  }) => {
    const state = createPortalRoot();
    const frame = createElement("view");
    const backdrop = createElement("view");
    const panel = createElement("view");
    let unblockButtons;
    setProp(frame, "class", attrs.class ?? "absolute inset-0 z-50 flex-col items-center justify-center", undefined);
    setProp(backdrop, "class", "absolute inset-0 bg-slate-950", undefined);
    setProp(backdrop, "style", {
      opacity: 0
    }, undefined);
    setProp(panel, "class", attrs.panelClass ?? "flex-col gap-2 w-[328] p-3 rounded-xl shadow-lg bg-white border-slate-200", undefined);
    setProp(panel, "style", {
      opacity: 0,
      translateY: 0,
      scale: 1
    }, undefined);
    insertNode(frame, backdrop);
    insertNode(frame, panel);
    state.root.update(frame);
    insertBlock(slotDefault(slots), panel);
    ii((registerCleanup) => {
      const visible = resolveActive(attrs.open);
      if (visible && !unblockButtons) {
        unblockButtons = pushButtonHandlerBlock();
      } else if (!visible && unblockButtons) {
        unblockButtons();
        unblockButtons = undefined;
      }
      setProp(backdrop, "style", {
        opacity: visible ? 0.62 : 0
      }, undefined);
      setProp(panel, "style", {
        opacity: visible ? 1 : 0,
        translateY: 0,
        scale: 1
      }, undefined);
      registerCleanup(() => unblockButtons?.());
    });
    Vn(() => {
      unblockButtons?.();
      state.root.dispose();
      if (state.host.parent)
        detachNode(state.host.parent, state.host);
    });
    return state.marker;
  }, NO_FALLTHROUGH);
  var ActionBar = definePocketVaporComponent((_props, {
    attrs,
    slots
  }) => {
    const state = createPortalRoot();
    const bar = createPrimitiveNode("view", attrs, slots, {
      extra: () => ({
        class: attrs.class ?? "absolute left-3 right-3 bottom-3 flex-row items-center justify-between px-2 py-1 rounded-lg shadow-md bg-white border-slate-200"
      })
    });
    state.root.update(bar);
    Vn(() => {
      state.root.dispose();
      if (state.host.parent)
        detachNode(state.host.parent, state.host);
    });
    return state.marker;
  }, NO_FALLTHROUGH);
  var Grid = definePocketVaporComponent((_props, {
    attrs,
    slots
  }) => {
    let root;
    const hasColumns = attrs.columns != null;
    const node = createPrimitiveNode("view", attrs, slots, {
      omit: ["active", "columns", "wrap", "gap"],
      onNode(next) {
        root = next;
      },
      extra: () => {
        const style = attrs.gap != null ? {
          ...normalizeStyleValue(attrs.style) ?? {},
          gap: valueOf(attrs.gap)
        } : normalizeStyleValue(attrs.style);
        return {
          class: attrs.class ?? "flex-row flex-wrap",
          style
        };
      }
    });
    if (hasColumns) {
      ii((registerCleanup) => {
        if (!root || !resolveActive(attrs.active))
          return;
        const dispose = pushFocusGrid(root, {
          columns: valueOf(attrs.columns),
          wrap: booleanOption(attrs.wrap)
        });
        registerCleanup(dispose);
      });
    }
    return node;
  }, NO_FALLTHROUGH);
  var Lazy = definePocketVaporComponent((_props, {
    attrs,
    slots
  }) => {
    const reveal = Math.max(0, Math.floor(valueOf(attrs.reveal) ?? 0));
    const ready = dn(reveal === 0);
    let elapsed = 0;
    const root = createPrimitiveNode("view", attrs, undefined, {
      omit: ["when", "reveal", "fallback", "children"],
      extra: () => attrs.class ? {} : {
        style: {
          grow: 1,
          width: SCREEN_W,
          flexDir: ENUMS.FlexDir.Col,
          justify: ENUMS.Justify.Center,
          align: ENUMS.Align.Center
        }
      }
    });
    const renderRoot = createRenderRoot(root);
    const active = () => resolveActive(attrs.when);
    let renderedState;
    const renderLazy = () => {
      const nextState = !active() ? "hidden" : ready.value ? "ready" : "fallback";
      if (nextState === renderedState)
        return;
      renderedState = nextState;
      if (nextState === "hidden") {
        renderRoot.update(null);
        return;
      }
      if (nextState === "fallback") {
        const fallback = attrs.fallback;
        renderRoot.update(typeof fallback === "function" ? fallback() : fallback);
        return;
      }
      renderRoot.update(slotDefault(slots));
    };
    if (reveal > 0) {
      onFrame(() => {
        if (!ready.value && active()) {
          if (++elapsed >= reveal)
            ready.value = true;
        }
        renderLazy();
      });
    } else {
      onFrame(renderLazy);
    }
    renderLazy();
    Vn(() => renderRoot.dispose());
    return root;
  }, NO_FALLTHROUGH);
  var Gallery = definePocketVaporComponent((_props, {
    attrs
  }) => {
    const count = () => Math.max(0, Math.floor(valueOf(attrs.count) ?? 0));
    const page = () => Math.max(0, Math.floor(valueOf(attrs.page) ?? 0));
    const win = () => Math.max(0, Math.floor(valueOf(attrs.window) ?? 1));
    const dur = () => valueOf(attrs.duration) ?? 300;
    const easing = () => valueOf(attrs.easing) ?? "out";
    const renderPage = () => callbackOf(attrs.renderPage);
    const onPageChange = () => callbackOf(attrs.onPageChange);
    const clampPage = (n) => booleanOption(attrs.wrap) ? (n % count() + count()) % count() : Math.max(0, Math.min(count() - 1, n));
    let currentPage = page();
    const go = (delta) => {
      const next = clampPage(currentPage + delta);
      if (next === currentPage)
        return;
      currentPage = next;
      renderCurrent(currentPage, true);
      onPageChange()?.(next);
    };
    if (attrs.bindTriggers !== false) {
      onButtonPress(BTN.LTRIGGER, () => go(-1));
      onButtonPress(BTN.RTRIGGER, () => go(1));
    }
    const viewport = createElement("view");
    const strip = createElement("view");
    const cells = [];
    const roots = [];
    if (attrs.class) {
      setProp(viewport, "class", attrs.class, undefined);
    } else {
      setProp(viewport, "style", {
        width: SCREEN_W,
        height: SCREEN_H,
        overflow: ENUMS.Overflow.Hidden
      }, undefined);
    }
    setProp(strip, "style", {
      width: SCREEN_W,
      height: SCREEN_H,
      translateX: -currentPage * SCREEN_W
    }, undefined);
    insertNode(viewport, strip);
    for (let i = 0;i < count(); i++) {
      const cell = createElement("view");
      setProp(cell, "style", {
        posType: ENUMS.PosType.Absolute,
        insetT: 0,
        insetR: 0,
        insetB: 0,
        insetL: 0,
        translateX: i * SCREEN_W
      }, undefined);
      insertNode(strip, cell);
      cells.push(cell);
      roots.push(createRenderRoot(cell));
    }
    const renderCurrent = (current, animated) => {
      if (animated) {
        animate(strip, "translateX", -current * SCREEN_W, {
          dur: dur(),
          easing: easing()
        });
      } else {
        setProp(strip, "style", {
          width: SCREEN_W,
          height: SCREEN_H,
          translateX: -current * SCREEN_W
        }, undefined);
      }
      const render = renderPage();
      for (let i = 0;i < cells.length; i++) {
        roots[i].update(render && Math.abs(i - current) <= win() ? render(i) : null);
      }
    };
    renderCurrent(currentPage, false);
    onFrame(() => {
      const externalPage = page();
      if (externalPage === currentPage)
        return;
      currentPage = externalPage;
      renderCurrent(currentPage, true);
    });
    Vn(() => roots.forEach((root) => root.dispose()));
    return viewport;
  }, NO_FALLTHROUGH);
  // ../../../../tmp/tmp.SbiaajidKm/src/config.ts
  var CONFIG = {
    extension: "netbird",
    title: "NetBird",
    glyph: "N",
    statusMethod: "status",
    actions: [{
      method: "connect",
      title: "连接"
    }, {
      method: "disconnect",
      title: "断开"
    }],
    kind: "network"
  };

  // ../../../../tmp/tmp.SbiaajidKm/src/device.ts
  function device() {
    return globalThis.onekvm;
  }
  function screenSize() {
    const w = Number(device()?.get?.("screenW") || "240");
    const h = Number(device()?.get?.("screenH") || "240");
    return {
      w: Number.isFinite(w) && w >= 64 ? Math.round(w) : 240,
      h: Number.isFinite(h) && h >= 64 ? Math.round(h) : 240
    };
  }
  function setHot(value) {
    device()?.set?.("hot", value ? "1" : "0");
  }
  function invoke(extension, method, request = {}) {
    device()?.set?.("appRequest", JSON.stringify({
      extension,
      method,
      request
    }));
  }

  // ../../../../tmp/tmp.SbiaajidKm/src/ui.ts
  var COLOR = {
    black: 4278190080,
    white: 4294967295,
    muted: 4289372577,
    panel: 4280689707,
    primary: 4282090230,
    success: 4283096704,
    warning: 4294688548,
    danger: 4294472049
  };
  var FONT = {
    sm: 1,
    base: 2,
    xs: 0
  };

  // vue-vapor-helper:/vue-jsx-vapor/vapor
  var createComponent = (type, ...args) => {
    if (type === I) {
      const slots = args[1];
      return slots ? typeof slots === "function" ? slots() : typeof slots.default === "function" ? slots.default() : [] : [];
    }
    return Sg(createProxyComponent(uo(type)), ...args);
  };
  var proxyCache = /* @__PURE__ */ new WeakMap;
  function createProxyComponent(type, normalizeNode2) {
    if (typeof type === "function") {
      const existing = proxyCache.get(type);
      if (existing)
        return existing;
      const i = B || dl();
      const proxy = new Proxy(type, {
        apply(target, ctx, args) {
          if (typeof target.__setup === "function") {
            target.__setup.apply(ctx, args);
          }
          const node = Reflect.apply(target, ctx, args);
          return normalizeNode2 ? normalizeNode2(node) : node;
        },
        get(target, p, receiver) {
          if (i && i.appContext.vapor && p === "__vapor") {
            return true;
          }
          if (i && i.appContext.vapor && p === "inheritAttrs") {
            return false;
          }
          return Reflect.get(target, p, receiver);
        }
      });
      proxyCache.set(type, proxy);
      return proxy;
    }
    return type;
  }
  function createFragment(nodes, anchor = globalThis.__pocketDocument.createTextNode("")) {
    const frag = new Ih(nodes);
    frag.anchor = anchor;
    return frag;
  }
  function normalizeBlock(node, anchor, processFunction = false) {
    if (node instanceof Node || X(node)) {
      return node;
    } else if ($(node)) {
      return createFragment(node, anchor);
    } else if (Array.isArray(node)) {
      return createFragment(node.map((i) => normalizeBlock(i, undefined, processFunction)), anchor);
    } else if (processFunction && typeof node === "function") {
      return resolveValues([node], anchor, true)[0];
    } else {
      const result = node == null || typeof node === "boolean" ? "" : String(node);
      if (anchor) {
        anchor.textContent = result;
        return anchor;
      } else {
        return globalThis.__pocketDocument.createTextNode(result);
      }
    }
  }
  function resolveValue(current, value, anchor, processFunction = false) {
    anchor = anchor || (current instanceof Node && current.nodeType === 3 ? current : undefined);
    const node = normalizeBlock(value, anchor, processFunction);
    if (current) {
      if (X(current)) {
        if (current.anchor && current.anchor.parentNode) {
          Q(current.nodes, current.anchor.parentNode);
          Z(node, current.anchor.parentNode, current.anchor);
          if (!anchor)
            current.anchor.parentNode.removeChild(current.anchor);
          if (current.scope)
            current.scope.stop();
        }
      } else if (current instanceof Node) {
        if (current.nodeType === 3 && (!(node instanceof Node) || node.nodeType !== 3)) {
          current.textContent = "";
        }
        if (X(node) && current.parentNode) {
          Z(node, current.parentNode, current);
          if (!anchor || current.nodeType !== 3) {
            current.parentNode.removeChild(current);
          }
        } else if (node instanceof Node) {
          if (current.nodeType === 3 && node.nodeType === 3) {
            current.textContent = node.textContent;
            return current;
          } else if (current.parentNode) {
            current.parentNode.replaceChild(node, current);
          }
        }
      }
    }
    return node;
  }
  function resolveValues(values = [], _anchor, processFunction = false) {
    const nodes = [];
    const scopes = [];
    for (const [index, value] of values.entries()) {
      const anchor = index === values.length - 1 ? _anchor : undefined;
      if (typeof value === "function") {
        Y(() => {
          if (scopes[index])
            scopes[index].stop();
          scopes[index] = new Ln;
          nodes[index] = scopes[index].run(() => resolveValue(nodes[index], value(), anchor, processFunction));
        });
      } else {
        nodes[index] = resolveValue(nodes[index], value, anchor, processFunction);
      }
    }
    return nodes;
  }
  function createNodes(...values) {
    return resolveValues(values);
  }

  // ../../../../tmp/tmp.SbiaajidKm/src/App.tsx
  var _t0 = iy("长按返回", 2);
  function safeJSON(raw) {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  function text(value, fallback = "—") {
    return typeof value === "string" && value ? value : fallback;
  }
  function summary(value) {
    if (CONFIG.kind === "wake")
      return value.configured ? "已配置唤醒设备" : "请先在网页端保存设备";
    if (CONFIG.extension === "tailscale") {
      if (value.loggedIn === true)
        return text(Array.isArray(value.addresses) ? value.addresses[0] : "已连接", "已连接");
      return text(value.backendState, "未连接");
    }
    if (CONFIG.extension === "netbird") {
      if (value.daemonStatus === "Connected")
        return text(value.netbirdIp, "已连接");
      return text(value.daemonStatus, "未连接");
    }
    if (CONFIG.extension === "zerotier") {
      const networks = Array.isArray(value.networks) ? value.networks.length : 0;
      return value.online === true ? `${networks} 个网络` : "服务离线";
    }
    if (CONFIG.extension === "easytier")
      return value.ready === true ? text(value.ipv4, "已就绪") : "未就绪";
    return value.online === true ? "在线" : "离线";
  }
  function statusLabel(value) {
    if (CONFIG.kind === "wake")
      return value.configured ? "可唤醒" : "未配置";
    if (CONFIG.extension === "tailscale")
      return value.loggedIn === true ? "已连接" : "未连接";
    if (CONFIG.extension === "netbird")
      return value.daemonStatus === "Connected" ? "已连接" : "未连接";
    if (CONFIG.extension === "zerotier")
      return value.online === true ? "在线" : "离线";
    if (CONFIG.extension === "easytier")
      return value.ready === true ? "运行中" : "未运行";
    return value.online === true ? "在线" : "离线";
  }
  function ExtensionApp() {
    const screen = screenSize();
    const state = dn({});
    const busy = dn(false);
    const message = dn("");
    let lastResponse = "";
    let lastPoll = 0;
    let knobSeq = "0";
    let selected = 0;
    const poll = () => {
      const raw = device()?.get?.("appResponse") || "";
      if (raw && raw !== lastResponse) {
        lastResponse = raw;
        const response = safeJSON(raw);
        busy.value = response.busy === true;
        if (response.ok === false)
          message.value = text(response.error, "操作失败");
        const payload = response.response;
        if (payload && typeof payload === "object" && !Array.isArray(payload)) {
          state.value = payload;
          if (response.ok === true)
            message.value = "";
        }
      }
    };
    const refresh = () => {
      if (!busy.value) {
        busy.value = true;
        invoke(CONFIG.extension, CONFIG.statusMethod);
      }
    };
    const action = (index) => {
      const item = CONFIG.actions[index];
      if (!item || busy.value)
        return;
      if (CONFIG.kind === "wake" && state.value.configured !== true) {
        message.value = "请先在网页端保存设备";
        return;
      }
      busy.value = true;
      message.value = "";
      invoke(CONFIG.extension, item.method, item.request || {});
    };
    onFrame(() => {
      poll();
      const now = Date.now();
      if (now - lastPoll > 4000) {
        lastPoll = now;
        refresh();
      }
      const seq = device()?.get?.("knobSeq") || "0";
      if (seq !== knobSeq) {
        knobSeq = seq;
        const step = Number(device()?.get?.("knob") || "0");
        if (step && CONFIG.actions.length)
          selected = (selected + (step > 0 ? 1 : CONFIG.actions.length - 1)) % CONFIG.actions.length;
        if (device()?.get?.("knobClick") === "1")
          action(selected);
        if (device()?.get?.("knobHold") === "1")
          device()?.set?.("launch", "shell");
      }
    });
    const buttonW = Math.max(76, Math.floor((screen.w - 30 - (CONFIG.actions.length - 1) * 8) / Math.max(1, CONFIG.actions.length)));
    return (() => {
      const _n24 = createComponent(View, {
        class: "relative w-full h-full bg-black flex flex-col items-center",
        style: () => ({
          width: screen.w,
          height: screen.h
        })
      }, () => {
        const _n3 = createComponent(View, {
          class: "flex flex-row items-center justify-center",
          style: () => ({
            width: screen.w,
            height: 34
          })
        }, () => {
          const _n2 = createComponent(Text2, {
            class: "text-base text-white",
            style: () => ({
              fontSlot: FONT.base,
              textColor: COLOR.white
            })
          }, c(() => {
            const _n0 = createNodes(() => CONFIG.glyph, " ", () => CONFIG.title);
            return _n0;
          }, {
            _: 8
          }));
          return _n2;
        });
        const _n18 = createComponent(View, {
          class: "flex flex-col items-center justify-center rounded-xl",
          style: () => ({
            width: Math.min(216, screen.w - 24),
            height: 92,
            bgColor: COLOR.panel
          })
        }, () => {
          const _n9 = createComponent(Text2, {
            class: "text-base text-white",
            style: () => ({
              fontSlot: FONT.base,
              textColor: busy.value ? COLOR.warning : state.value.online === false ? COLOR.muted : COLOR.success
            })
          }, c(() => {
            const _n4 = ay(() => busy.value, () => {
              const _n6 = createNodes("处理中");
              return _n6;
            }, () => {
              const _n8 = createNodes(() => statusLabel(state.value));
              return _n8;
            }, 389);
            return _n4;
          }, {
            _: 8
          }));
          const _n11 = createComponent(Text2, {
            class: "text-sm text-white",
            style: () => ({
              fontSlot: FONT.sm,
              textColor: COLOR.white
            })
          }, c(() => {
            const _n10 = createNodes(() => summary(state.value));
            return _n10;
          }, {
            _: 8
          }));
          const _n12 = ay(() => message.value, () => {
            const _n15 = createComponent(Text2, {
              class: "text-xs text-white",
              style: () => ({
                fontSlot: FONT.xs,
                textColor: COLOR.danger
              })
            }, c(() => {
              const _n14 = createNodes(() => message.value);
              return _n14;
            }, {
              _: 8
            }));
            return _n15;
          }, () => {
            const _n17 = createNodes(null);
            return _n17;
          }, 517);
          return [_n9, _n11, _n12];
        });
        const _n20 = createComponent(View, {
          class: "flex flex-row items-center justify-center gap-2",
          style: () => ({
            width: screen.w,
            height: 54,
            insetT: 16
          })
        }, c(() => {
          const _n19 = createNodes(() => CONFIG.actions.map((item, index) => (() => {
            const _n0 = cy(() => item.method, () => {
              const _n4 = createComponent(View, {
                class: () => selected === index ? "flex items-center justify-center rounded-xl bg-blue-500" : "flex items-center justify-center rounded-xl bg-zinc-800",
                style: () => ({
                  width: buttonW,
                  height: 40
                }),
                focusable: true,
                onPress: () => () => {
                  selected = index;
                  action(index);
                  setHot(true);
                }
              }, () => {
                const _n3 = createComponent(Text2, {
                  class: "text-sm text-white",
                  style: () => ({
                    fontSlot: FONT.sm,
                    textColor: COLOR.white
                  })
                }, c(() => {
                  const _n2 = createNodes(() => item.title);
                  return _n2;
                }, {
                  _: 8
                }));
                return _n3;
              });
              return _n4;
            });
            return _n0;
          })()));
          return _n19;
        }, {
          _: 8
        }));
        const _n23 = createComponent(View, {
          class: "flex items-center justify-center",
          style: () => ({
            width: screen.w,
            height: 34,
            insetT: 12
          })
        }, () => {
          const _n22 = createComponent(Text2, {
            class: "text-xs text-zinc-400",
            style: () => ({
              fontSlot: FONT.xs,
              textColor: COLOR.muted
            })
          }, () => {
            const _n21 = _t0();
            return _n21;
          });
          return _n22;
        });
        return [_n3, _n18, _n20, _n23];
      }, true);
      return _n24;
    })();
  }

  // ../../../../tmp/tmp.SbiaajidKm/src/Power.tsx
  var _t02 = iy("⚡  电源", 2);
  var _t1 = iy("长按返回", 2);
  var actions = [{
    id: "on",
    title: "开机"
  }, {
    id: "off",
    title: "关机"
  }, {
    id: "reset",
    title: "重启"
  }];
  function readAtx() {
    try {
      const raw = JSON.parse(device()?.get?.("system") || "{}");
      return raw.atx && typeof raw.atx === "object" ? raw.atx : {};
    } catch {
      return {};
    }
  }
  function Power() {
    const screen = screenSize();
    const atx = dn(readAtx());
    const busy = dn(false);
    const message = dn("");
    let selected = 0;
    let knobSeq = "0";
    let lastResponse = "";
    const run = (action) => {
      if (busy.value)
        return;
      busy.value = true;
      message.value = "";
      device()?.set?.("powerAction", action);
    };
    onFrame(() => {
      atx.value = readAtx();
      const response = device()?.get?.("appResponse") || "";
      if (response && response !== lastResponse) {
        lastResponse = response;
        try {
          const parsed = JSON.parse(response);
          busy.value = parsed.busy === true;
          if (parsed.ok === false)
            message.value = typeof parsed.error === "string" ? parsed.error : "操作失败";
        } catch {}
      }
      const seq = device()?.get?.("knobSeq") || "0";
      if (seq !== knobSeq) {
        knobSeq = seq;
        const step = Number(device()?.get?.("knob") || "0");
        if (step)
          selected = (selected + (step > 0 ? 1 : actions.length - 1)) % actions.length;
        if (device()?.get?.("knobClick") === "1")
          run(actions[selected].id);
        if (device()?.get?.("knobHold") === "1")
          device()?.set?.("launch", "shell");
      }
    });
    const buttonW = Math.floor((screen.w - 30 - 16) / 3);
    const available = atx.value.available === true;
    const powered = atx.value.pwr_led === true;
    return (() => {
      const _n29 = createComponent(View, {
        class: "relative w-full h-full bg-black flex flex-col items-center",
        style: () => ({
          width: screen.w,
          height: screen.h
        })
      }, () => {
        const _n2 = createComponent(View, {
          class: "flex items-center justify-center",
          style: () => ({
            width: screen.w,
            height: 34
          })
        }, () => {
          const _n1 = createComponent(Text2, {
            class: "text-base text-white",
            style: () => ({
              fontSlot: FONT.base,
              textColor: COLOR.white
            })
          }, () => {
            const _n0 = _t02();
            return _n0;
          });
          return _n1;
        });
        const _n23 = createComponent(View, {
          class: "flex flex-col items-center justify-center rounded-xl",
          style: () => ({
            width: Math.min(216, screen.w - 24),
            height: 92,
            bgColor: COLOR.panel
          })
        }, () => {
          const _n10 = createComponent(Text2, {
            class: "text-base text-white",
            style: () => ({
              fontSlot: FONT.base,
              textColor: available ? powered ? COLOR.success : COLOR.muted : COLOR.warning
            })
          }, c(() => {
            const _n3 = ay(() => !available, () => {
              const _n5 = createNodes("未连接");
              return _n5;
            }, () => ay(() => powered, () => {
              const _n7 = createNodes("已开机");
              return _n7;
            }, () => {
              const _n9 = createNodes("已关机");
              return _n9;
            }, 641), 389);
            return _n3;
          }, {
            _: 8
          }));
          const _n16 = createComponent(Text2, {
            class: "text-sm text-white",
            style: () => ({
              fontSlot: FONT.sm,
              textColor: COLOR.white
            })
          }, c(() => {
            const _n11 = ay(() => available, () => {
              const _n13 = createNodes("受控主机电源");
              return _n13;
            }, () => {
              const _n15 = createNodes("请检查 ATX 接口");
              return _n15;
            }, 901);
            return _n11;
          }, {
            _: 8
          }));
          const _n17 = ay(() => message.value, () => {
            const _n20 = createComponent(Text2, {
              class: "text-xs text-white",
              style: () => ({
                fontSlot: FONT.xs,
                textColor: COLOR.danger
              })
            }, c(() => {
              const _n19 = createNodes(() => message.value);
              return _n19;
            }, {
              _: 8
            }));
            return _n20;
          }, () => {
            const _n22 = createNodes(null);
            return _n22;
          }, 1029);
          return [_n10, _n16, _n17];
        });
        const _n25 = createComponent(View, {
          class: "flex flex-row items-center justify-center gap-2",
          style: () => ({
            width: screen.w,
            height: 54,
            insetT: 16
          })
        }, c(() => {
          const _n24 = createNodes(() => actions.map((item, index) => (() => {
            const _n0 = cy(() => item.id, () => {
              const _n4 = createComponent(View, {
                class: () => selected === index ? "flex items-center justify-center rounded-xl bg-blue-500" : "flex items-center justify-center rounded-xl bg-zinc-800",
                style: () => ({
                  width: buttonW,
                  height: 40
                }),
                focusable: true,
                onPress: () => () => {
                  selected = index;
                  run(item.id);
                  setHot(true);
                }
              }, () => {
                const _n3 = createComponent(Text2, {
                  class: "text-sm text-white",
                  style: () => ({
                    fontSlot: FONT.sm,
                    textColor: COLOR.white
                  })
                }, c(() => {
                  const _n2 = createNodes(() => item.title);
                  return _n2;
                }, {
                  _: 8
                }));
                return _n3;
              });
              return _n4;
            });
            return _n0;
          })()));
          return _n24;
        }, {
          _: 8
        }));
        const _n28 = createComponent(View, {
          class: "flex items-center justify-center",
          style: () => ({
            width: screen.w,
            height: 34,
            insetT: 12
          })
        }, () => {
          const _n27 = createComponent(Text2, {
            class: "text-xs text-zinc-400",
            style: () => ({
              fontSlot: FONT.xs,
              textColor: COLOR.muted
            })
          }, () => {
            const _n26 = _t1();
            return _n26;
          });
          return _n27;
        });
        return [_n2, _n23, _n25, _n28];
      }, true);
      return _n29;
    })();
  }

  // ../../../../tmp/tmp.SbiaajidKm/src/main.tsx
  mount(() => CONFIG.kind === "power" ? (() => {
    const _n0 = createComponent(Power, null, null, true);
    return _n0;
  })() : (() => {
    const _n0 = createComponent(ExtensionApp, null, null, true);
    return _n0;
  })());
})();
