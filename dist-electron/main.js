var S$ = Object.defineProperty;
var fl = (t) => {
  throw TypeError(t);
};
var E$ = (t, e, r) => e in t ? S$(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var N = (t, e, r) => E$(t, typeof e != "symbol" ? e + "" : e, r), hl = (t, e, r) => e.has(t) || fl("Cannot " + r);
var ve = (t, e, r) => (hl(t, e, "read from private field"), r ? r.call(t) : e.get(t)), En = (t, e, r) => e.has(t) ? fl("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), Nn = (t, e, r, n) => (hl(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r);
import Pn, { randomUUID as xo } from "node:crypto";
import ee from "node:fs";
import X from "node:path";
import { fileURLToPath as N$ } from "node:url";
import rm, { app as Lt, protocol as nm, ipcMain as fe, screen as an, BrowserWindow as Ho, Menu as ml, dialog as sm } from "electron";
import _e from "node:process";
import { promisify as ke, isDeepStrictEqual as P$ } from "node:util";
import T$ from "node:assert";
import Tr from "node:os";
import "node:events";
import "node:stream";
import jn from "better-sqlite3";
import Jo from "node:http";
import O$ from "node:dgram";
const Or = (t) => {
  const e = typeof t;
  return t !== null && (e === "object" || e === "function");
}, Ma = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), R$ = new Set("0123456789");
function ua(t) {
  const e = [];
  let r = "", n = "start", s = !1;
  for (const a of t)
    switch (a) {
      case "\\": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        s && (r += a), n = "property", s = !s;
        break;
      }
      case ".": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (s) {
          s = !1, r += a;
          break;
        }
        if (Ma.has(r))
          return [];
        e.push(r), r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error("Invalid character in an index");
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (s) {
          s = !1, r += a;
          break;
        }
        if (n === "property") {
          if (Ma.has(r))
            return [];
          e.push(r), r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          e.push(Number.parseInt(r, 10)), r = "", n = "indexEnd";
          break;
        }
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
      }
      default: {
        if (n === "index" && !R$.has(a))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += a;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (Ma.has(r))
        return [];
      e.push(r);
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      e.push("");
      break;
    }
  }
  return e;
}
function Wo(t, e) {
  if (typeof e != "number" && Array.isArray(t)) {
    const r = Number.parseInt(e, 10);
    return Number.isInteger(r) && t[r] === t[e];
  }
  return !1;
}
function am(t, e) {
  if (Wo(t, e))
    throw new Error("Cannot use string index");
}
function I$(t, e, r) {
  if (!Or(t) || typeof e != "string")
    return r === void 0 ? t : r;
  const n = ua(e);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (Wo(t, a) ? t = s === n.length - 1 ? void 0 : null : t = t[a], t == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return t === void 0 ? r : t;
}
function pl(t, e, r) {
  if (!Or(t) || typeof e != "string")
    return t;
  const n = t, s = ua(e);
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    am(t, o), a === s.length - 1 ? t[o] = r : Or(t[o]) || (t[o] = typeof s[a + 1] == "number" ? [] : {}), t = t[o];
  }
  return n;
}
function j$(t, e) {
  if (!Or(t) || typeof e != "string")
    return !1;
  const r = ua(e);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (am(t, s), n === r.length - 1)
      return delete t[s], !0;
    if (t = t[s], !Or(t))
      return !1;
  }
}
function C$(t, e) {
  if (!Or(t) || typeof e != "string")
    return !1;
  const r = ua(e);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!Or(t) || !(n in t) || Wo(t, n))
      return !1;
    t = t[n];
  }
  return !0;
}
const xt = Tr.homedir(), Xo = Tr.tmpdir(), { env: Jr } = _e, A$ = (t) => {
  const e = X.join(xt, "Library");
  return {
    data: X.join(e, "Application Support", t),
    config: X.join(e, "Preferences", t),
    cache: X.join(e, "Caches", t),
    log: X.join(e, "Logs", t),
    temp: X.join(Xo, t)
  };
}, k$ = (t) => {
  const e = Jr.APPDATA || X.join(xt, "AppData", "Roaming"), r = Jr.LOCALAPPDATA || X.join(xt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: X.join(r, t, "Data"),
    config: X.join(e, t, "Config"),
    cache: X.join(r, t, "Cache"),
    log: X.join(r, t, "Log"),
    temp: X.join(Xo, t)
  };
}, L$ = (t) => {
  const e = X.basename(xt);
  return {
    data: X.join(Jr.XDG_DATA_HOME || X.join(xt, ".local", "share"), t),
    config: X.join(Jr.XDG_CONFIG_HOME || X.join(xt, ".config"), t),
    cache: X.join(Jr.XDG_CACHE_HOME || X.join(xt, ".cache"), t),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: X.join(Jr.XDG_STATE_HOME || X.join(xt, ".local", "state"), t),
    temp: X.join(Xo, e, t)
  };
};
function D$(t, { suffix: e = "nodejs" } = {}) {
  if (typeof t != "string")
    throw new TypeError(`Expected a string, got ${typeof t}`);
  return e && (t += `-${e}`), _e.platform === "darwin" ? A$(t) : _e.platform === "win32" ? k$(t) : L$(t);
}
const Vt = (t, e) => {
  const { onError: r } = e;
  return function(...s) {
    return t.apply(void 0, s).catch(r);
  };
}, Nt = (t, e) => {
  const { onError: r } = e;
  return function(...s) {
    try {
      return t.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, M$ = 250, Ft = (t, e) => {
  const { isRetriable: r } = e;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? M$, i = Date.now() + a;
    return function c(...d) {
      return t.apply(void 0, d).catch((l) => {
        if (!r(l) || Date.now() >= i)
          throw l;
        const h = Math.round(o * Math.random());
        return h > 0 ? new Promise(($) => setTimeout($, h)).then(() => c.apply(void 0, d)) : c.apply(void 0, d);
      });
    };
  };
}, qt = (t, e) => {
  const { isRetriable: r } = e;
  return function(s) {
    const { timeout: a } = s, o = Date.now() + a;
    return function(...c) {
      for (; ; )
        try {
          return t.apply(void 0, c);
        } catch (d) {
          if (!r(d) || Date.now() >= o)
            throw d;
          continue;
        }
    };
  };
}, Wr = {
  /* API */
  isChangeErrorOk: (t) => {
    if (!Wr.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "ENOSYS" || !V$ && (e === "EINVAL" || e === "EPERM");
  },
  isNodeError: (t) => t instanceof Error,
  isRetriableError: (t) => {
    if (!Wr.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "EMFILE" || e === "ENFILE" || e === "EAGAIN" || e === "EBUSY" || e === "EACCESS" || e === "EACCES" || e === "EACCS" || e === "EPERM";
  },
  onChangeError: (t) => {
    if (!Wr.isNodeError(t))
      throw t;
    if (!Wr.isChangeErrorOk(t))
      throw t;
  }
}, ds = {
  onError: Wr.onChangeError
}, et = {
  onError: () => {
  }
}, V$ = _e.getuid ? !_e.getuid() : !1, Le = {
  isRetriable: Wr.isRetriableError
}, Ve = {
  attempt: {
    /* ASYNC */
    chmod: Vt(ke(ee.chmod), ds),
    chown: Vt(ke(ee.chown), ds),
    close: Vt(ke(ee.close), et),
    fsync: Vt(ke(ee.fsync), et),
    mkdir: Vt(ke(ee.mkdir), et),
    realpath: Vt(ke(ee.realpath), et),
    stat: Vt(ke(ee.stat), et),
    unlink: Vt(ke(ee.unlink), et),
    /* SYNC */
    chmodSync: Nt(ee.chmodSync, ds),
    chownSync: Nt(ee.chownSync, ds),
    closeSync: Nt(ee.closeSync, et),
    existsSync: Nt(ee.existsSync, et),
    fsyncSync: Nt(ee.fsync, et),
    mkdirSync: Nt(ee.mkdirSync, et),
    realpathSync: Nt(ee.realpathSync, et),
    statSync: Nt(ee.statSync, et),
    unlinkSync: Nt(ee.unlinkSync, et)
  },
  retry: {
    /* ASYNC */
    close: Ft(ke(ee.close), Le),
    fsync: Ft(ke(ee.fsync), Le),
    open: Ft(ke(ee.open), Le),
    readFile: Ft(ke(ee.readFile), Le),
    rename: Ft(ke(ee.rename), Le),
    stat: Ft(ke(ee.stat), Le),
    write: Ft(ke(ee.write), Le),
    writeFile: Ft(ke(ee.writeFile), Le),
    /* SYNC */
    closeSync: qt(ee.closeSync, Le),
    fsyncSync: qt(ee.fsyncSync, Le),
    openSync: qt(ee.openSync, Le),
    readFileSync: qt(ee.readFileSync, Le),
    renameSync: qt(ee.renameSync, Le),
    statSync: qt(ee.statSync, Le),
    writeSync: qt(ee.writeSync, Le),
    writeFileSync: qt(ee.writeFileSync, Le)
  }
}, F$ = "utf8", yl = 438, q$ = 511, z$ = {}, U$ = _e.geteuid ? _e.geteuid() : -1, B$ = _e.getegid ? _e.getegid() : -1, K$ = 1e3, Q$ = !!_e.getuid;
_e.getuid && _e.getuid();
const $l = 128, G$ = (t) => t instanceof Error && "code" in t, gl = (t) => typeof t == "string", Va = (t) => t === void 0, x$ = _e.platform === "linux", om = _e.platform === "win32", Yo = ["SIGHUP", "SIGINT", "SIGTERM"];
om || Yo.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
x$ && Yo.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class H$ {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (e) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        e && (om && e !== "SIGINT" && e !== "SIGTERM" && e !== "SIGKILL" ? _e.kill(_e.pid, "SIGTERM") : _e.kill(_e.pid, e));
      }
    }, this.hook = () => {
      _e.once("exit", () => this.exit());
      for (const e of Yo)
        try {
          _e.once(e, () => this.exit(e));
        } catch {
        }
    }, this.register = (e) => (this.callbacks.add(e), () => {
      this.callbacks.delete(e);
    }), this.hook();
  }
}
const J$ = new H$(), W$ = J$.register, Fe = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (t) => {
    const e = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${e}`;
    return `${t}${s}`;
  },
  get: (t, e, r = !0) => {
    const n = Fe.truncate(e(t));
    return n in Fe.store ? Fe.get(t, e, r) : (Fe.store[n] = r, [n, () => delete Fe.store[n]]);
  },
  purge: (t) => {
    Fe.store[t] && (delete Fe.store[t], Ve.attempt.unlink(t));
  },
  purgeSync: (t) => {
    Fe.store[t] && (delete Fe.store[t], Ve.attempt.unlinkSync(t));
  },
  purgeSyncAll: () => {
    for (const t in Fe.store)
      Fe.purgeSync(t);
  },
  truncate: (t) => {
    const e = X.basename(t);
    if (e.length <= $l)
      return t;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(e);
    if (!r)
      return t;
    const n = e.length - $l;
    return `${t.slice(0, -e.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
W$(Fe.purgeSyncAll);
function im(t, e, r = z$) {
  if (gl(r))
    return im(t, e, { encoding: r });
  const s = { timeout: r.timeout ?? K$ };
  let a = null, o = null, i = null;
  try {
    const c = Ve.attempt.realpathSync(t), d = !!c;
    t = c || t, [o, a] = Fe.get(t, r.tmpCreate || Fe.create, r.tmpPurge !== !1);
    const l = Q$ && Va(r.chown), h = Va(r.mode);
    if (d && (l || h)) {
      const _ = Ve.attempt.statSync(t);
      _ && (r = { ...r }, l && (r.chown = { uid: _.uid, gid: _.gid }), h && (r.mode = _.mode));
    }
    if (!d) {
      const _ = X.dirname(t);
      Ve.attempt.mkdirSync(_, {
        mode: q$,
        recursive: !0
      });
    }
    i = Ve.retry.openSync(s)(o, "w", r.mode || yl), r.tmpCreated && r.tmpCreated(o), gl(e) ? Ve.retry.writeSync(s)(i, e, 0, r.encoding || F$) : Va(e) || Ve.retry.writeSync(s)(i, e, 0, e.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ve.retry.fsyncSync(s)(i) : Ve.attempt.fsync(i)), Ve.retry.closeSync(s)(i), i = null, r.chown && (r.chown.uid !== U$ || r.chown.gid !== B$) && Ve.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== yl && Ve.attempt.chmodSync(o, r.mode);
    try {
      Ve.retry.renameSync(s)(o, t);
    } catch (_) {
      if (!G$(_) || _.code !== "ENAMETOOLONG")
        throw _;
      Ve.retry.renameSync(s)(o, Fe.truncate(t));
    }
    a(), o = null;
  } finally {
    i && Ve.attempt.closeSync(i), o && Fe.purge(o);
  }
}
function cm(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var io = { exports: {} }, lm = {}, pt = {}, on = {}, ts = {}, se = {}, Hn = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.regexpCode = t.getEsmExportName = t.getProperty = t.safeStringify = t.stringify = t.strConcat = t.addCodeArg = t.str = t._ = t.nil = t._Code = t.Name = t.IDENTIFIER = t._CodeOrName = void 0;
  class e {
  }
  t._CodeOrName = e, t.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends e {
    constructor(b) {
      if (super(), !t.IDENTIFIER.test(b))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = b;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  t.Name = r;
  class n extends e {
    constructor(b) {
      super(), this._items = typeof b == "string" ? [b] : b;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const b = this._items[0];
      return b === "" || b === '""';
    }
    get str() {
      var b;
      return (b = this._str) !== null && b !== void 0 ? b : this._str = this._items.reduce((T, O) => `${T}${O}`, "");
    }
    get names() {
      var b;
      return (b = this._names) !== null && b !== void 0 ? b : this._names = this._items.reduce((T, O) => (O instanceof r && (T[O.str] = (T[O.str] || 0) + 1), T), {});
    }
  }
  t._Code = n, t.nil = new n("");
  function s(m, ...b) {
    const T = [m[0]];
    let O = 0;
    for (; O < b.length; )
      i(T, b[O]), T.push(m[++O]);
    return new n(T);
  }
  t._ = s;
  const a = new n("+");
  function o(m, ...b) {
    const T = [$(m[0])];
    let O = 0;
    for (; O < b.length; )
      T.push(a), i(T, b[O]), T.push(a, $(m[++O]));
    return c(T), new n(T);
  }
  t.str = o;
  function i(m, b) {
    b instanceof n ? m.push(...b._items) : b instanceof r ? m.push(b) : m.push(h(b));
  }
  t.addCodeArg = i;
  function c(m) {
    let b = 1;
    for (; b < m.length - 1; ) {
      if (m[b] === a) {
        const T = d(m[b - 1], m[b + 1]);
        if (T !== void 0) {
          m.splice(b - 1, 3, T);
          continue;
        }
        m[b++] = "+";
      }
      b++;
    }
  }
  function d(m, b) {
    if (b === '""')
      return m;
    if (m === '""')
      return b;
    if (typeof m == "string")
      return b instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof b != "string" ? `${m.slice(0, -1)}${b}"` : b[0] === '"' ? m.slice(0, -1) + b.slice(1) : void 0;
    if (typeof b == "string" && b[0] === '"' && !(m instanceof r))
      return `"${m}${b.slice(1)}`;
  }
  function l(m, b) {
    return b.emptyStr() ? m : m.emptyStr() ? b : o`${m}${b}`;
  }
  t.strConcat = l;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : $(Array.isArray(m) ? m.join(",") : m);
  }
  function _(m) {
    return new n($(m));
  }
  t.stringify = _;
  function $(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  t.safeStringify = $;
  function w(m) {
    return typeof m == "string" && t.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  t.getProperty = w;
  function v(m) {
    if (typeof m == "string" && t.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  t.getEsmExportName = v;
  function g(m) {
    return new n(m.toString());
  }
  t.regexpCode = g;
})(Hn);
var co = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.ValueScope = t.ValueScopeName = t.Scope = t.varKinds = t.UsedValueState = void 0;
  const e = Hn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (t.UsedValueState = n = {})), t.varKinds = {
    const: new e.Name("const"),
    let: new e.Name("let"),
    var: new e.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: l } = {}) {
      this._names = {}, this._prefixes = d, this._parent = l;
    }
    toName(d) {
      return d instanceof e.Name ? d : this.name(d);
    }
    name(d) {
      return new e.Name(this._newName(d));
    }
    _newName(d) {
      const l = this._names[d] || this._nameGroup(d);
      return `${d}${l.index++}`;
    }
    _nameGroup(d) {
      var l, h;
      if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  t.Scope = s;
  class a extends e.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: h }) {
      this.value = d, this.scopePath = (0, e._)`.${new e.Name(l)}[${h}]`;
    }
  }
  t.ValueScopeName = a;
  const o = (0, e._)`\n`;
  class i extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : e.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, l) {
      var h;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const _ = this.toName(d), { prefix: $ } = _, w = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let v = this._values[$];
      if (v) {
        const b = v.get(w);
        if (b)
          return b;
      } else
        v = this._values[$] = /* @__PURE__ */ new Map();
      v.set(w, _);
      const g = this._scope[$] || (this._scope[$] = []), m = g.length;
      return g[m] = l.ref, _.setValue(l, { property: $, itemIndex: m }), _;
    }
    getValue(d, l) {
      const h = this._values[d];
      if (h)
        return h.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, e._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, h) {
      return this._reduceValues(d, (_) => {
        if (_.value === void 0)
          throw new Error(`CodeGen: name "${_}" has no value`);
        return _.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, _) {
      let $ = e.nil;
      for (const w in d) {
        const v = d[w];
        if (!v)
          continue;
        const g = h[w] = h[w] || /* @__PURE__ */ new Map();
        v.forEach((m) => {
          if (g.has(m))
            return;
          g.set(m, n.Started);
          let b = l(m);
          if (b) {
            const T = this.opts.es5 ? t.varKinds.var : t.varKinds.const;
            $ = (0, e._)`${$}${T} ${m} = ${b};${this.opts._n}`;
          } else if (b = _ == null ? void 0 : _(m))
            $ = (0, e._)`${$}${b}${this.opts._n}`;
          else
            throw new r(m);
          g.set(m, n.Completed);
        });
      }
      return $;
    }
  }
  t.ValueScope = i;
})(co);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.or = t.and = t.not = t.CodeGen = t.operators = t.varKinds = t.ValueScopeName = t.ValueScope = t.Scope = t.Name = t.regexpCode = t.stringify = t.getProperty = t.nil = t.strConcat = t.str = t._ = void 0;
  const e = Hn, r = co;
  var n = Hn;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(t, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(t, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(t, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = co;
  Object.defineProperty(t, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(t, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(t, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(t, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), t.operators = {
    GT: new e._Code(">"),
    GTE: new e._Code(">="),
    LT: new e._Code("<"),
    LTE: new e._Code("<="),
    EQ: new e._Code("==="),
    NEQ: new e._Code("!=="),
    NOT: new e._Code("!"),
    OR: new e._Code("||"),
    AND: new e._Code("&&"),
    ADD: new e._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(u, f) {
      return this;
    }
  }
  class o extends a {
    constructor(u, f, S) {
      super(), this.varKind = u, this.name = f, this.rhs = S;
    }
    render({ es5: u, _n: f }) {
      const S = u ? r.varKinds.var : this.varKind, C = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${C};` + f;
    }
    optimizeNames(u, f) {
      if (u[this.name.str])
        return this.rhs && (this.rhs = G(this.rhs, u, f)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class i extends a {
    constructor(u, f, S) {
      super(), this.lhs = u, this.rhs = f, this.sideEffects = S;
    }
    render({ _n: u }) {
      return `${this.lhs} = ${this.rhs};` + u;
    }
    optimizeNames(u, f) {
      if (!(this.lhs instanceof e.Name && !u[this.lhs.str] && !this.sideEffects))
        return this.rhs = G(this.rhs, u, f), this;
    }
    get names() {
      const u = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return ne(u, this.rhs);
    }
  }
  class c extends i {
    constructor(u, f, S, C) {
      super(u, S, C), this.op = f;
    }
    render({ _n: u }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + u;
    }
  }
  class d extends a {
    constructor(u) {
      super(), this.label = u, this.names = {};
    }
    render({ _n: u }) {
      return `${this.label}:` + u;
    }
  }
  class l extends a {
    constructor(u) {
      super(), this.label = u, this.names = {};
    }
    render({ _n: u }) {
      return `break${this.label ? ` ${this.label}` : ""};` + u;
    }
  }
  class h extends a {
    constructor(u) {
      super(), this.error = u;
    }
    render({ _n: u }) {
      return `throw ${this.error};` + u;
    }
    get names() {
      return this.error.names;
    }
  }
  class _ extends a {
    constructor(u) {
      super(), this.code = u;
    }
    render({ _n: u }) {
      return `${this.code};` + u;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(u, f) {
      return this.code = G(this.code, u, f), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class $ extends a {
    constructor(u = []) {
      super(), this.nodes = u;
    }
    render(u) {
      return this.nodes.reduce((f, S) => f + S.render(u), "");
    }
    optimizeNodes() {
      const { nodes: u } = this;
      let f = u.length;
      for (; f--; ) {
        const S = u[f].optimizeNodes();
        Array.isArray(S) ? u.splice(f, 1, ...S) : S ? u[f] = S : u.splice(f, 1);
      }
      return u.length > 0 ? this : void 0;
    }
    optimizeNames(u, f) {
      const { nodes: S } = this;
      let C = S.length;
      for (; C--; ) {
        const j = S[C];
        j.optimizeNames(u, f) || (he(u, j.names), S.splice(C, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((u, f) => x(u, f.names), {});
    }
  }
  class w extends $ {
    render(u) {
      return "{" + u._n + super.render(u) + "}" + u._n;
    }
  }
  class v extends $ {
  }
  class g extends w {
  }
  g.kind = "else";
  class m extends w {
    constructor(u, f) {
      super(f), this.condition = u;
    }
    render(u) {
      let f = `if(${this.condition})` + super.render(u);
      return this.else && (f += "else " + this.else.render(u)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const u = this.condition;
      if (u === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const S = f.optimizeNodes();
        f = this.else = Array.isArray(S) ? new g(S) : S;
      }
      if (f)
        return u === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(Te(u), f instanceof m ? [f] : f.nodes);
      if (!(u === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(u, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(u, f), !!(super.optimizeNames(u, f) || this.else))
        return this.condition = G(this.condition, u, f), this;
    }
    get names() {
      const u = super.names;
      return ne(u, this.condition), this.else && x(u, this.else.names), u;
    }
  }
  m.kind = "if";
  class b extends w {
  }
  b.kind = "for";
  class T extends b {
    constructor(u) {
      super(), this.iteration = u;
    }
    render(u) {
      return `for(${this.iteration})` + super.render(u);
    }
    optimizeNames(u, f) {
      if (super.optimizeNames(u, f))
        return this.iteration = G(this.iteration, u, f), this;
    }
    get names() {
      return x(super.names, this.iteration.names);
    }
  }
  class O extends b {
    constructor(u, f, S, C) {
      super(), this.varKind = u, this.name = f, this.from = S, this.to = C;
    }
    render(u) {
      const f = u.es5 ? r.varKinds.var : this.varKind, { name: S, from: C, to: j } = this;
      return `for(${f} ${S}=${C}; ${S}<${j}; ${S}++)` + super.render(u);
    }
    get names() {
      const u = ne(super.names, this.from);
      return ne(u, this.to);
    }
  }
  class I extends b {
    constructor(u, f, S, C) {
      super(), this.loop = u, this.varKind = f, this.name = S, this.iterable = C;
    }
    render(u) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(u);
    }
    optimizeNames(u, f) {
      if (super.optimizeNames(u, f))
        return this.iterable = G(this.iterable, u, f), this;
    }
    get names() {
      return x(super.names, this.iterable.names);
    }
  }
  class q extends w {
    constructor(u, f, S) {
      super(), this.name = u, this.args = f, this.async = S;
    }
    render(u) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(u);
    }
  }
  q.kind = "func";
  class D extends $ {
    render(u) {
      return "return " + super.render(u);
    }
  }
  D.kind = "return";
  class Y extends w {
    render(u) {
      let f = "try" + super.render(u);
      return this.catch && (f += this.catch.render(u)), this.finally && (f += this.finally.render(u)), f;
    }
    optimizeNodes() {
      var u, f;
      return super.optimizeNodes(), (u = this.catch) === null || u === void 0 || u.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(u, f) {
      var S, C;
      return super.optimizeNames(u, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(u, f), (C = this.finally) === null || C === void 0 || C.optimizeNames(u, f), this;
    }
    get names() {
      const u = super.names;
      return this.catch && x(u, this.catch.names), this.finally && x(u, this.finally.names), u;
    }
  }
  class de extends w {
    constructor(u) {
      super(), this.error = u;
    }
    render(u) {
      return `catch(${this.error})` + super.render(u);
    }
  }
  de.kind = "catch";
  class ge extends w {
    render(u) {
      return "finally" + super.render(u);
    }
  }
  ge.kind = "finally";
  class Q {
    constructor(u, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = u, this._scope = new r.Scope({ parent: u }), this._nodes = [new v()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(u) {
      return this._scope.name(u);
    }
    // reserves unique name in the external scope
    scopeName(u) {
      return this._extScope.name(u);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(u, f) {
      const S = this._extScope.value(u, f);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(u, f) {
      return this._extScope.getValue(u, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(u) {
      return this._extScope.scopeRefs(u, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(u, f, S, C) {
      const j = this._scope.toName(f);
      return S !== void 0 && C && (this._constants[j.str] = S), this._leafNode(new o(u, j, S)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(u, f, S) {
      return this._def(r.varKinds.const, u, f, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(u, f, S) {
      return this._def(r.varKinds.let, u, f, S);
    }
    // `var` declaration with optional assignment
    var(u, f, S) {
      return this._def(r.varKinds.var, u, f, S);
    }
    // assignment code
    assign(u, f, S) {
      return this._leafNode(new i(u, f, S));
    }
    // `+=` code
    add(u, f) {
      return this._leafNode(new c(u, t.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(u) {
      return typeof u == "function" ? u() : u !== e.nil && this._leafNode(new _(u)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...u) {
      const f = ["{"];
      for (const [S, C] of u)
        f.length > 1 && f.push(","), f.push(S), (S !== C || this.opts.es5) && (f.push(":"), (0, e.addCodeArg)(f, C));
      return f.push("}"), new e._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(u, f, S) {
      if (this._blockNode(new m(u)), f && S)
        this.code(f).else().code(S).endIf();
      else if (f)
        this.code(f).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(u) {
      return this._elseNode(new m(u));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new g());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, g);
    }
    _for(u, f) {
      return this._blockNode(u), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(u, f) {
      return this._for(new T(u), f);
    }
    // `for` statement for a range of values
    forRange(u, f, S, C, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const U = this._scope.toName(u);
      return this._for(new O(j, U, f, S), () => C(U));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(u, f, S, C = r.varKinds.const) {
      const j = this._scope.toName(u);
      if (this.opts.es5) {
        const U = f instanceof e.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, e._)`${U}.length`, (K) => {
          this.var(j, (0, e._)`${U}[${K}]`), S(j);
        });
      }
      return this._for(new I("of", C, j, f), () => S(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(u, f, S, C = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(u, (0, e._)`Object.keys(${f})`, S);
      const j = this._scope.toName(u);
      return this._for(new I("in", C, j, f), () => S(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(b);
    }
    // `label` statement
    label(u) {
      return this._leafNode(new d(u));
    }
    // `break` statement
    break(u) {
      return this._leafNode(new l(u));
    }
    // `return` statement
    return(u) {
      const f = new D();
      if (this._blockNode(f), this.code(u), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(D);
    }
    // `try` statement
    try(u, f, S) {
      if (!f && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const C = new Y();
      if (this._blockNode(C), this.code(u), f) {
        const j = this.name("e");
        this._currNode = C.catch = new de(j), f(j);
      }
      return S && (this._currNode = C.finally = new ge(), this.code(S)), this._endBlockNode(de, ge);
    }
    // `throw` statement
    throw(u) {
      return this._leafNode(new h(u));
    }
    // start self-balancing block
    block(u, f) {
      return this._blockStarts.push(this._nodes.length), u && this.code(u).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(u) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - f;
      if (S < 0 || u !== void 0 && S !== u)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${u} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(u, f = e.nil, S, C) {
      return this._blockNode(new q(u, f, S)), C && this.code(C).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(q);
    }
    optimize(u = 1) {
      for (; u-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(u) {
      return this._currNode.nodes.push(u), this;
    }
    _blockNode(u) {
      this._currNode.nodes.push(u), this._nodes.push(u);
    }
    _endBlockNode(u, f) {
      const S = this._currNode;
      if (S instanceof u || f && S instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${u.kind}/${f.kind}` : u.kind}"`);
    }
    _elseNode(u) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = u, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const u = this._nodes;
      return u[u.length - 1];
    }
    set _currNode(u) {
      const f = this._nodes;
      f[f.length - 1] = u;
    }
  }
  t.CodeGen = Q;
  function x(y, u) {
    for (const f in u)
      y[f] = (y[f] || 0) + (u[f] || 0);
    return y;
  }
  function ne(y, u) {
    return u instanceof e._CodeOrName ? x(y, u.names) : y;
  }
  function G(y, u, f) {
    if (y instanceof e.Name)
      return S(y);
    if (!C(y))
      return y;
    return new e._Code(y._items.reduce((j, U) => (U instanceof e.Name && (U = S(U)), U instanceof e._Code ? j.push(...U._items) : j.push(U), j), []));
    function S(j) {
      const U = f[j.str];
      return U === void 0 || u[j.str] !== 1 ? j : (delete u[j.str], U);
    }
    function C(j) {
      return j instanceof e._Code && j._items.some((U) => U instanceof e.Name && u[U.str] === 1 && f[U.str] !== void 0);
    }
  }
  function he(y, u) {
    for (const f in u)
      y[f] = (y[f] || 0) - (u[f] || 0);
  }
  function Te(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, e._)`!${E(y)}`;
  }
  t.not = Te;
  const M = p(t.operators.AND);
  function L(...y) {
    return y.reduce(M);
  }
  t.and = L;
  const B = p(t.operators.OR);
  function P(...y) {
    return y.reduce(B);
  }
  t.or = P;
  function p(y) {
    return (u, f) => u === e.nil ? f : f === e.nil ? u : (0, e._)`${E(u)} ${y} ${E(f)}`;
  }
  function E(y) {
    return y instanceof e.Name ? y : (0, e._)`(${y})`;
  }
})(se);
var V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
V.checkStrictMode = V.getErrorPath = V.Type = V.useFunc = V.setEvaluated = V.evaluatedPropsToName = V.mergeEvaluated = V.eachItem = V.unescapeJsonPointer = V.escapeJsonPointer = V.escapeFragment = V.unescapeFragment = V.schemaRefOrVal = V.schemaHasRulesButRef = V.schemaHasRules = V.checkUnknownRules = V.alwaysValidSchema = V.toHash = void 0;
const me = se, X$ = Hn;
function Y$(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
V.toHash = Y$;
function Z$(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (um(t, e), !dm(e, t.self.RULES.all));
}
V.alwaysValidSchema = Z$;
function um(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || mm(t, `unknown keyword: "${a}"`);
}
V.checkUnknownRules = um;
function dm(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
V.schemaHasRules = dm;
function eg(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
V.schemaHasRulesButRef = eg;
function tg({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, me._)`${r}`;
  }
  return (0, me._)`${t}${e}${(0, me.getProperty)(n)}`;
}
V.schemaRefOrVal = tg;
function rg(t) {
  return fm(decodeURIComponent(t));
}
V.unescapeFragment = rg;
function ng(t) {
  return encodeURIComponent(Zo(t));
}
V.escapeFragment = ng;
function Zo(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
V.escapeJsonPointer = Zo;
function fm(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
V.unescapeJsonPointer = fm;
function sg(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
V.eachItem = sg;
function vl({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof me.Name ? (a instanceof me.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof me.Name ? (e(s, o, a), a) : r(a, o);
    return i === me.Name && !(c instanceof me.Name) ? n(s, c) : c;
  };
}
V.mergeEvaluated = {
  props: vl({
    mergeNames: (t, e, r) => t.if((0, me._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, me._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, me._)`${r} || {}`).code((0, me._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, me._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, me._)`${r} || {}`), ei(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: hm
  }),
  items: vl({
    mergeNames: (t, e, r) => t.if((0, me._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, me._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, me._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, me._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function hm(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, me._)`{}`);
  return e !== void 0 && ei(t, r, e), r;
}
V.evaluatedPropsToName = hm;
function ei(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, me._)`${e}${(0, me.getProperty)(n)}`, !0));
}
V.setEvaluated = ei;
const _l = {};
function ag(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: _l[e.code] || (_l[e.code] = new X$._Code(e.code))
  });
}
V.useFunc = ag;
var lo;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(lo || (V.Type = lo = {}));
function og(t, e, r) {
  if (t instanceof me.Name) {
    const n = e === lo.Num;
    return r ? n ? (0, me._)`"[" + ${t} + "]"` : (0, me._)`"['" + ${t} + "']"` : n ? (0, me._)`"/" + ${t}` : (0, me._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, me.getProperty)(t).toString() : "/" + Zo(t);
}
V.getErrorPath = og;
function mm(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
V.checkStrictMode = mm;
var nt = {};
Object.defineProperty(nt, "__esModule", { value: !0 });
const De = se, ig = {
  // validation function arguments
  data: new De.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new De.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new De.Name("instancePath"),
  parentData: new De.Name("parentData"),
  parentDataProperty: new De.Name("parentDataProperty"),
  rootData: new De.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new De.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new De.Name("vErrors"),
  // null or array of validation errors
  errors: new De.Name("errors"),
  // counter of validation errors
  this: new De.Name("this"),
  // "globals"
  self: new De.Name("self"),
  scope: new De.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new De.Name("json"),
  jsonPos: new De.Name("jsonPos"),
  jsonLen: new De.Name("jsonLen"),
  jsonPart: new De.Name("jsonPart")
};
nt.default = ig;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
  const e = se, r = V, n = nt;
  t.keywordError = {
    message: ({ keyword: g }) => (0, e.str)`must pass "${g}" keyword validation`
  }, t.keyword$DataError = {
    message: ({ keyword: g, schemaType: m }) => m ? (0, e.str)`"${g}" keyword must be ${m} ($data)` : (0, e.str)`"${g}" keyword is invalid ($data)`
  };
  function s(g, m = t.keywordError, b, T) {
    const { it: O } = g, { gen: I, compositeRule: q, allErrors: D } = O, Y = h(g, m, b);
    T ?? (q || D) ? c(I, Y) : d(O, (0, e._)`[${Y}]`);
  }
  t.reportError = s;
  function a(g, m = t.keywordError, b) {
    const { it: T } = g, { gen: O, compositeRule: I, allErrors: q } = T, D = h(g, m, b);
    c(O, D), I || q || d(T, n.default.vErrors);
  }
  t.reportExtraError = a;
  function o(g, m) {
    g.assign(n.default.errors, m), g.if((0, e._)`${n.default.vErrors} !== null`, () => g.if(m, () => g.assign((0, e._)`${n.default.vErrors}.length`, m), () => g.assign(n.default.vErrors, null)));
  }
  t.resetErrorsCount = o;
  function i({ gen: g, keyword: m, schemaValue: b, data: T, errsCount: O, it: I }) {
    if (O === void 0)
      throw new Error("ajv implementation error");
    const q = g.name("err");
    g.forRange("i", O, n.default.errors, (D) => {
      g.const(q, (0, e._)`${n.default.vErrors}[${D}]`), g.if((0, e._)`${q}.instancePath === undefined`, () => g.assign((0, e._)`${q}.instancePath`, (0, e.strConcat)(n.default.instancePath, I.errorPath))), g.assign((0, e._)`${q}.schemaPath`, (0, e.str)`${I.errSchemaPath}/${m}`), I.opts.verbose && (g.assign((0, e._)`${q}.schema`, b), g.assign((0, e._)`${q}.data`, T));
    });
  }
  t.extendErrors = i;
  function c(g, m) {
    const b = g.const("err", m);
    g.if((0, e._)`${n.default.vErrors} === null`, () => g.assign(n.default.vErrors, (0, e._)`[${b}]`), (0, e._)`${n.default.vErrors}.push(${b})`), g.code((0, e._)`${n.default.errors}++`);
  }
  function d(g, m) {
    const { gen: b, validateName: T, schemaEnv: O } = g;
    O.$async ? b.throw((0, e._)`new ${g.ValidationError}(${m})`) : (b.assign((0, e._)`${T}.errors`, m), b.return(!1));
  }
  const l = {
    keyword: new e.Name("keyword"),
    schemaPath: new e.Name("schemaPath"),
    // also used in JTD errors
    params: new e.Name("params"),
    propertyName: new e.Name("propertyName"),
    message: new e.Name("message"),
    schema: new e.Name("schema"),
    parentSchema: new e.Name("parentSchema")
  };
  function h(g, m, b) {
    const { createErrors: T } = g.it;
    return T === !1 ? (0, e._)`{}` : _(g, m, b);
  }
  function _(g, m, b = {}) {
    const { gen: T, it: O } = g, I = [
      $(O, b),
      w(g, b)
    ];
    return v(g, m, I), T.object(...I);
  }
  function $({ errorPath: g }, { instancePath: m }) {
    const b = m ? (0, e.str)`${g}${(0, r.getErrorPath)(m, r.Type.Str)}` : g;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, b)];
  }
  function w({ keyword: g, it: { errSchemaPath: m } }, { schemaPath: b, parentSchema: T }) {
    let O = T ? m : (0, e.str)`${m}/${g}`;
    return b && (O = (0, e.str)`${O}${(0, r.getErrorPath)(b, r.Type.Str)}`), [l.schemaPath, O];
  }
  function v(g, { params: m, message: b }, T) {
    const { keyword: O, data: I, schemaValue: q, it: D } = g, { opts: Y, propertyName: de, topSchemaRef: ge, schemaPath: Q } = D;
    T.push([l.keyword, O], [l.params, typeof m == "function" ? m(g) : m || (0, e._)`{}`]), Y.messages && T.push([l.message, typeof b == "function" ? b(g) : b]), Y.verbose && T.push([l.schema, q], [l.parentSchema, (0, e._)`${ge}${Q}`], [n.default.data, I]), de && T.push([l.propertyName, de]);
  }
})(ts);
Object.defineProperty(on, "__esModule", { value: !0 });
on.boolOrEmptySchema = on.topBoolOrEmptySchema = void 0;
const cg = ts, lg = se, ug = nt, dg = {
  message: "boolean schema is false"
};
function fg(t) {
  const { gen: e, schema: r, validateName: n } = t;
  r === !1 ? pm(t, !1) : typeof r == "object" && r.$async === !0 ? e.return(ug.default.data) : (e.assign((0, lg._)`${n}.errors`, null), e.return(!0));
}
on.topBoolOrEmptySchema = fg;
function hg(t, e) {
  const { gen: r, schema: n } = t;
  n === !1 ? (r.var(e, !1), pm(t)) : r.var(e, !0);
}
on.boolOrEmptySchema = hg;
function pm(t, e) {
  const { gen: r, data: n } = t, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: t
  };
  (0, cg.reportError)(s, dg, void 0, e);
}
var Ne = {}, Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.getRules = Rr.isJSONType = void 0;
const mg = ["string", "number", "integer", "boolean", "null", "object", "array"], pg = new Set(mg);
function yg(t) {
  return typeof t == "string" && pg.has(t);
}
Rr.isJSONType = yg;
function $g() {
  const t = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...t, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, t.number, t.string, t.array, t.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
Rr.getRules = $g;
var jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.shouldUseRule = jt.shouldUseGroup = jt.schemaHasRulesForType = void 0;
function gg({ schema: t, self: e }, r) {
  const n = e.RULES.types[r];
  return n && n !== !0 && ym(t, n);
}
jt.schemaHasRulesForType = gg;
function ym(t, e) {
  return e.rules.some((r) => $m(t, r));
}
jt.shouldUseGroup = ym;
function $m(t, e) {
  var r;
  return t[e.keyword] !== void 0 || ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => t[n] !== void 0));
}
jt.shouldUseRule = $m;
Object.defineProperty(Ne, "__esModule", { value: !0 });
Ne.reportTypeError = Ne.checkDataTypes = Ne.checkDataType = Ne.coerceAndCheckDataType = Ne.getJSONTypes = Ne.getSchemaTypes = Ne.DataType = void 0;
const vg = Rr, _g = jt, wg = ts, ae = se, gm = V;
var en;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(en || (Ne.DataType = en = {}));
function bg(t) {
  const e = vm(t.type);
  if (e.includes("null")) {
    if (t.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!e.length && t.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    t.nullable === !0 && e.push("null");
  }
  return e;
}
Ne.getSchemaTypes = bg;
function vm(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(vg.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
Ne.getJSONTypes = vm;
function Sg(t, e) {
  const { gen: r, data: n, opts: s } = t, a = Eg(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, _g.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = ti(e, n, s.strictNumbers, en.Wrong);
    r.if(i, () => {
      a.length ? Ng(t, e, a) : ri(t);
    });
  }
  return o;
}
Ne.coerceAndCheckDataType = Sg;
const _m = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Eg(t, e) {
  return e ? t.filter((r) => _m.has(r) || e === "array" && r === "array") : [];
}
function Ng(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, ae._)`typeof ${s}`), i = n.let("coerced", (0, ae._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ae._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ae._)`${s}[0]`).assign(o, (0, ae._)`typeof ${s}`).if(ti(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, ae._)`${i} !== undefined`);
  for (const d of r)
    (_m.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), ri(t), n.endIf(), n.if((0, ae._)`${i} !== undefined`, () => {
    n.assign(s, i), Pg(t, i);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, ae._)`${o} == "number" || ${o} == "boolean"`).assign(i, (0, ae._)`"" + ${s}`).elseIf((0, ae._)`${s} === null`).assign(i, (0, ae._)`""`);
        return;
      case "number":
        n.elseIf((0, ae._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(i, (0, ae._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, ae._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(i, (0, ae._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, ae._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(i, !1).elseIf((0, ae._)`${s} === "true" || ${s} === 1`).assign(i, !0);
        return;
      case "null":
        n.elseIf((0, ae._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(i, null);
        return;
      case "array":
        n.elseIf((0, ae._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(i, (0, ae._)`[${s}]`);
    }
  }
}
function Pg({ gen: t, parentData: e, parentDataProperty: r }, n) {
  t.if((0, ae._)`${e} !== undefined`, () => t.assign((0, ae._)`${e}[${r}]`, n));
}
function uo(t, e, r, n = en.Correct) {
  const s = n === en.Correct ? ae.operators.EQ : ae.operators.NEQ;
  let a;
  switch (t) {
    case "null":
      return (0, ae._)`${e} ${s} null`;
    case "array":
      a = (0, ae._)`Array.isArray(${e})`;
      break;
    case "object":
      a = (0, ae._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      a = o((0, ae._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, ae._)`typeof ${e} ${s} ${t}`;
  }
  return n === en.Correct ? a : (0, ae.not)(a);
  function o(i = ae.nil) {
    return (0, ae.and)((0, ae._)`typeof ${e} == "number"`, i, r ? (0, ae._)`isFinite(${e})` : ae.nil);
  }
}
Ne.checkDataType = uo;
function ti(t, e, r, n) {
  if (t.length === 1)
    return uo(t[0], e, r, n);
  let s;
  const a = (0, gm.toHash)(t);
  if (a.array && a.object) {
    const o = (0, ae._)`typeof ${e} != "object"`;
    s = a.null ? o : (0, ae._)`!${e} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = ae.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, ae.and)(s, uo(o, e, r, n));
  return s;
}
Ne.checkDataTypes = ti;
const Tg = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, ae._)`{type: ${t}}` : (0, ae._)`{type: ${e}}`
};
function ri(t) {
  const e = Og(t);
  (0, wg.reportError)(e, Tg);
}
Ne.reportTypeError = ri;
function Og(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, gm.schemaRefOrVal)(t, n, "type");
  return {
    gen: e,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: t
  };
}
var da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
da.assignDefaults = void 0;
const qr = se, Rg = V;
function Ig(t, e) {
  const { properties: r, items: n } = t.schema;
  if (e === "object" && r)
    for (const s in r)
      wl(t, s, r[s].default);
  else e === "array" && Array.isArray(n) && n.forEach((s, a) => wl(t, a, s.default));
}
da.assignDefaults = Ig;
function wl(t, e, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = t;
  if (r === void 0)
    return;
  const i = (0, qr._)`${a}${(0, qr.getProperty)(e)}`;
  if (s) {
    (0, Rg.checkStrictMode)(t, `default is ignored for: ${i}`);
    return;
  }
  let c = (0, qr._)`${i} === undefined`;
  o.useDefaults === "empty" && (c = (0, qr._)`${c} || ${i} === null || ${i} === ""`), n.if(c, (0, qr._)`${i} = ${(0, qr.stringify)(r)}`);
}
var bt = {}, ce = {};
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.validateUnion = ce.validateArray = ce.usePattern = ce.callValidateCode = ce.schemaProperties = ce.allSchemaProperties = ce.noPropertyInData = ce.propertyInData = ce.isOwnProperty = ce.hasPropFunc = ce.reportMissingProp = ce.checkMissingProp = ce.checkReportMissingProp = void 0;
const ye = se, ni = V, zt = nt, jg = V;
function Cg(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(ai(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, ye._)`${e}` }, !0), t.error();
  });
}
ce.checkReportMissingProp = Cg;
function Ag({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, ye.or)(...n.map((a) => (0, ye.and)(ai(t, e, a, r.ownProperties), (0, ye._)`${s} = ${a}`)));
}
ce.checkMissingProp = Ag;
function kg(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
ce.reportMissingProp = kg;
function wm(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ye._)`Object.prototype.hasOwnProperty`
  });
}
ce.hasPropFunc = wm;
function si(t, e, r) {
  return (0, ye._)`${wm(t)}.call(${e}, ${r})`;
}
ce.isOwnProperty = si;
function Lg(t, e, r, n) {
  const s = (0, ye._)`${e}${(0, ye.getProperty)(r)} !== undefined`;
  return n ? (0, ye._)`${s} && ${si(t, e, r)}` : s;
}
ce.propertyInData = Lg;
function ai(t, e, r, n) {
  const s = (0, ye._)`${e}${(0, ye.getProperty)(r)} === undefined`;
  return n ? (0, ye.or)(s, (0, ye.not)(si(t, e, r))) : s;
}
ce.noPropertyInData = ai;
function bm(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
ce.allSchemaProperties = bm;
function Dg(t, e) {
  return bm(e).filter((r) => !(0, ni.alwaysValidSchema)(t, e[r]));
}
ce.schemaProperties = Dg;
function Mg({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, d) {
  const l = d ? (0, ye._)`${t}, ${e}, ${n}${s}` : e, h = [
    [zt.default.instancePath, (0, ye.strConcat)(zt.default.instancePath, a)],
    [zt.default.parentData, o.parentData],
    [zt.default.parentDataProperty, o.parentDataProperty],
    [zt.default.rootData, zt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([zt.default.dynamicAnchors, zt.default.dynamicAnchors]);
  const _ = (0, ye._)`${l}, ${r.object(...h)}`;
  return c !== ye.nil ? (0, ye._)`${i}.call(${c}, ${_})` : (0, ye._)`${i}(${_})`;
}
ce.callValidateCode = Mg;
const Vg = (0, ye._)`new RegExp`;
function Fg({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ye._)`${s.code === "new RegExp" ? Vg : (0, jg.useFunc)(t, s)}(${r}, ${n})`
  });
}
ce.usePattern = Fg;
function qg(t) {
  const { gen: e, data: r, keyword: n, it: s } = t, a = e.name("valid");
  if (s.allErrors) {
    const i = e.let("valid", !0);
    return o(() => e.assign(i, !1)), i;
  }
  return e.var(a, !0), o(() => e.break()), a;
  function o(i) {
    const c = e.const("len", (0, ye._)`${r}.length`);
    e.forRange("i", 0, c, (d) => {
      t.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: ni.Type.Num
      }, a), e.if((0, ye.not)(a), i);
    });
  }
}
ce.validateArray = qg;
function zg(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, ni.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = e.let("valid", !1), i = e.name("_valid");
  e.block(() => r.forEach((c, d) => {
    const l = t.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, i);
    e.assign(o, (0, ye._)`${o} || ${i}`), t.mergeValidEvaluated(l, i) || e.if((0, ye.not)(o));
  })), t.result(o, () => t.reset(), () => t.error(!0));
}
ce.validateUnion = zg;
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.validateKeywordUsage = bt.validSchemaType = bt.funcKeywordCode = bt.macroKeywordCode = void 0;
const Ke = se, gr = nt, Ug = ce, Bg = ts;
function Kg(t, e) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = t, i = e.macro.call(o.self, s, a, o), c = Sm(r, n, i);
  o.opts.validateSchema !== !1 && o.self.validateSchema(i, !0);
  const d = r.name("valid");
  t.subschema({
    schema: i,
    schemaPath: Ke.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), t.pass(d, () => t.error(!0));
}
bt.macroKeywordCode = Kg;
function Qg(t, e) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: i, it: c } = t;
  xg(c, e);
  const d = !i && e.compile ? e.compile.call(c.self, a, o, c) : e.validate, l = Sm(n, s, d), h = n.let("valid");
  t.block$data(h, _), t.ok((r = e.valid) !== null && r !== void 0 ? r : h);
  function _() {
    if (e.errors === !1)
      v(), e.modifying && bl(t), g(() => t.error());
    else {
      const m = e.async ? $() : w();
      e.modifying && bl(t), g(() => Gg(t, m));
    }
  }
  function $() {
    const m = n.let("ruleErrs", null);
    return n.try(() => v((0, Ke._)`await `), (b) => n.assign(h, !1).if((0, Ke._)`${b} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Ke._)`${b}.errors`), () => n.throw(b))), m;
  }
  function w() {
    const m = (0, Ke._)`${l}.errors`;
    return n.assign(m, null), v(Ke.nil), m;
  }
  function v(m = e.async ? (0, Ke._)`await ` : Ke.nil) {
    const b = c.opts.passContext ? gr.default.this : gr.default.self, T = !("compile" in e && !i || e.schema === !1);
    n.assign(h, (0, Ke._)`${m}${(0, Ug.callValidateCode)(t, l, b, T)}`, e.modifying);
  }
  function g(m) {
    var b;
    n.if((0, Ke.not)((b = e.valid) !== null && b !== void 0 ? b : h), m);
  }
}
bt.funcKeywordCode = Qg;
function bl(t) {
  const { gen: e, data: r, it: n } = t;
  e.if(n.parentData, () => e.assign(r, (0, Ke._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Gg(t, e) {
  const { gen: r } = t;
  r.if((0, Ke._)`Array.isArray(${e})`, () => {
    r.assign(gr.default.vErrors, (0, Ke._)`${gr.default.vErrors} === null ? ${e} : ${gr.default.vErrors}.concat(${e})`).assign(gr.default.errors, (0, Ke._)`${gr.default.vErrors}.length`), (0, Bg.extendErrors)(t);
  }, () => t.error());
}
function xg({ schemaEnv: t }, e) {
  if (e.async && !t.$async)
    throw new Error("async keyword in sync schema");
}
function Sm(t, e, r) {
  if (r === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return t.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ke.stringify)(r) });
}
function Hg(t, e, r = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(t) : n === "object" ? t && typeof t == "object" && !Array.isArray(t) : typeof t == n || r && typeof t > "u");
}
bt.validSchemaType = Hg;
function Jg({ schema: t, opts: e, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((i) => !Object.prototype.hasOwnProperty.call(t, i)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(t[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (e.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
bt.validateKeywordUsage = Jg;
var Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.extendSubschemaMode = Yt.extendSubschemaData = Yt.getSubschema = void 0;
const _t = se, Em = V;
function Wg(t, { keyword: e, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (e !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (e !== void 0) {
    const i = t.schema[e];
    return r === void 0 ? {
      schema: i,
      schemaPath: (0, _t._)`${t.schemaPath}${(0, _t.getProperty)(e)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}`
    } : {
      schema: i[r],
      schemaPath: (0, _t._)`${t.schemaPath}${(0, _t.getProperty)(e)}${(0, _t.getProperty)(r)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, Em.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Yt.getSubschema = Wg;
function Xg(t, e, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: i } = e;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = e, _ = i.let("data", (0, _t._)`${e.data}${(0, _t.getProperty)(r)}`, !0);
    c(_), t.errorPath = (0, _t.str)`${d}${(0, Em.getErrorPath)(r, n, h.jsPropertySyntax)}`, t.parentDataProperty = (0, _t._)`${r}`, t.dataPathArr = [...l, t.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof _t.Name ? s : i.let("data", s, !0);
    c(d), o !== void 0 && (t.propertyName = o);
  }
  a && (t.dataTypes = a);
  function c(d) {
    t.data = d, t.dataLevel = e.dataLevel + 1, t.dataTypes = [], e.definedProperties = /* @__PURE__ */ new Set(), t.parentData = e.data, t.dataNames = [...e.dataNames, d];
  }
}
Yt.extendSubschemaData = Xg;
function Yg(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (t.compositeRule = n), s !== void 0 && (t.createErrors = s), a !== void 0 && (t.allErrors = a), t.jtdDiscriminator = e, t.jtdMetadata = r;
}
Yt.extendSubschemaMode = Yg;
var je = {}, fa = function t(e, r) {
  if (e === r) return !0;
  if (e && r && typeof e == "object" && typeof r == "object") {
    if (e.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(e)) {
      if (n = e.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!t(e[s], r[s])) return !1;
      return !0;
    }
    if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
    if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
    if (a = Object.keys(e), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var o = a[s];
      if (!t(e[o], r[o])) return !1;
    }
    return !0;
  }
  return e !== e && r !== r;
}, Nm = { exports: {} }, Jt = Nm.exports = function(t, e, r) {
  typeof e == "function" && (r = e, e = {}), r = e.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Cs(e, n, s, t, "", t);
};
Jt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Jt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Jt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Jt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Cs(t, e, r, n, s, a, o, i, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, s, a, o, i, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Jt.arrayKeywords)
          for (var _ = 0; _ < h.length; _++)
            Cs(t, e, r, h[_], s + "/" + l + "/" + _, a, s, l, n, _);
      } else if (l in Jt.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            Cs(t, e, r, h[$], s + "/" + l + "/" + Zg($), a, s, l, n, $);
      } else (l in Jt.keywords || t.allKeys && !(l in Jt.skipKeywords)) && Cs(t, e, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, i, c, d);
  }
}
function Zg(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var e0 = Nm.exports;
Object.defineProperty(je, "__esModule", { value: !0 });
je.getSchemaRefs = je.resolveUrl = je.normalizeId = je._getFullPath = je.getFullPath = je.inlineRef = void 0;
const t0 = V, r0 = fa, n0 = e0, s0 = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function a0(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !fo(t) : e ? Pm(t) <= e : !1;
}
je.inlineRef = a0;
const o0 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function fo(t) {
  for (const e in t) {
    if (o0.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(fo) || typeof r == "object" && fo(r))
      return !0;
  }
  return !1;
}
function Pm(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !s0.has(r) && (typeof t[r] == "object" && (0, t0.eachItem)(t[r], (n) => e += Pm(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function Tm(t, e = "", r) {
  r !== !1 && (e = tn(e));
  const n = t.parse(e);
  return Om(t, n);
}
je.getFullPath = Tm;
function Om(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
je._getFullPath = Om;
const i0 = /#\/?$/;
function tn(t) {
  return t ? t.replace(i0, "") : "";
}
je.normalizeId = tn;
function c0(t, e, r) {
  return r = tn(r), t.resolve(e, r);
}
je.resolveUrl = c0;
const l0 = /^[a-z_][-a-z0-9._]*$/i;
function u0(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = tn(t[r] || e), a = { "": s }, o = Tm(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return n0(t, { allKeys: !0 }, (h, _, $, w) => {
    if (w === void 0)
      return;
    const v = o + _;
    let g = a[w];
    typeof h[r] == "string" && (g = m.call(this, h[r])), b.call(this, h.$anchor), b.call(this, h.$dynamicAnchor), a[_] = g;
    function m(T) {
      const O = this.opts.uriResolver.resolve;
      if (T = tn(g ? O(g, T) : T), c.has(T))
        throw l(T);
      c.add(T);
      let I = this.refs[T];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, T) : T !== tn(v) && (T[0] === "#" ? (d(h, i[T], T), i[T] = h) : this.refs[T] = v), T;
    }
    function b(T) {
      if (typeof T == "string") {
        if (!l0.test(T))
          throw new Error(`invalid anchor "${T}"`);
        m.call(this, `#${T}`);
      }
    }
  }), i;
  function d(h, _, $) {
    if (_ !== void 0 && !r0(h, _))
      throw l($);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
je.getSchemaRefs = u0;
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.getData = pt.KeywordCxt = pt.validateFunctionCode = void 0;
const Rm = on, Sl = Ne, oi = jt, Qs = Ne, d0 = da, Mn = bt, Fa = Yt, H = se, te = nt, f0 = je, Ct = V, Tn = ts;
function h0(t) {
  if (Cm(t) && (Am(t), jm(t))) {
    y0(t);
    return;
  }
  Im(t, () => (0, Rm.topBoolOrEmptySchema)(t));
}
pt.validateFunctionCode = h0;
function Im({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? t.func(e, (0, H._)`${te.default.data}, ${te.default.valCxt}`, n.$async, () => {
    t.code((0, H._)`"use strict"; ${El(r, s)}`), p0(t, s), t.code(a);
  }) : t.func(e, (0, H._)`${te.default.data}, ${m0(s)}`, n.$async, () => t.code(El(r, s)).code(a));
}
function m0(t) {
  return (0, H._)`{${te.default.instancePath}="", ${te.default.parentData}, ${te.default.parentDataProperty}, ${te.default.rootData}=${te.default.data}${t.dynamicRef ? (0, H._)`, ${te.default.dynamicAnchors}={}` : H.nil}}={}`;
}
function p0(t, e) {
  t.if(te.default.valCxt, () => {
    t.var(te.default.instancePath, (0, H._)`${te.default.valCxt}.${te.default.instancePath}`), t.var(te.default.parentData, (0, H._)`${te.default.valCxt}.${te.default.parentData}`), t.var(te.default.parentDataProperty, (0, H._)`${te.default.valCxt}.${te.default.parentDataProperty}`), t.var(te.default.rootData, (0, H._)`${te.default.valCxt}.${te.default.rootData}`), e.dynamicRef && t.var(te.default.dynamicAnchors, (0, H._)`${te.default.valCxt}.${te.default.dynamicAnchors}`);
  }, () => {
    t.var(te.default.instancePath, (0, H._)`""`), t.var(te.default.parentData, (0, H._)`undefined`), t.var(te.default.parentDataProperty, (0, H._)`undefined`), t.var(te.default.rootData, te.default.data), e.dynamicRef && t.var(te.default.dynamicAnchors, (0, H._)`{}`);
  });
}
function y0(t) {
  const { schema: e, opts: r, gen: n } = t;
  Im(t, () => {
    r.$comment && e.$comment && Lm(t), w0(t), n.let(te.default.vErrors, null), n.let(te.default.errors, 0), r.unevaluated && $0(t), km(t), E0(t);
  });
}
function $0(t) {
  const { gen: e, validateName: r } = t;
  t.evaluated = e.const("evaluated", (0, H._)`${r}.evaluated`), e.if((0, H._)`${t.evaluated}.dynamicProps`, () => e.assign((0, H._)`${t.evaluated}.props`, (0, H._)`undefined`)), e.if((0, H._)`${t.evaluated}.dynamicItems`, () => e.assign((0, H._)`${t.evaluated}.items`, (0, H._)`undefined`));
}
function El(t, e) {
  const r = typeof t == "object" && t[e.schemaId];
  return r && (e.code.source || e.code.process) ? (0, H._)`/*# sourceURL=${r} */` : H.nil;
}
function g0(t, e) {
  if (Cm(t) && (Am(t), jm(t))) {
    v0(t, e);
    return;
  }
  (0, Rm.boolOrEmptySchema)(t, e);
}
function jm({ schema: t, self: e }) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e.RULES.all[r])
      return !0;
  return !1;
}
function Cm(t) {
  return typeof t.schema != "boolean";
}
function v0(t, e) {
  const { schema: r, gen: n, opts: s } = t;
  s.$comment && r.$comment && Lm(t), b0(t), S0(t);
  const a = n.const("_errs", te.default.errors);
  km(t, a), n.var(e, (0, H._)`${a} === ${te.default.errors}`);
}
function Am(t) {
  (0, Ct.checkUnknownRules)(t), _0(t);
}
function km(t, e) {
  if (t.opts.jtd)
    return Nl(t, [], !1, e);
  const r = (0, Sl.getSchemaTypes)(t.schema), n = (0, Sl.coerceAndCheckDataType)(t, r);
  Nl(t, r, !n, e);
}
function _0(t) {
  const { schema: e, errSchemaPath: r, opts: n, self: s } = t;
  e.$ref && n.ignoreKeywordsWithRef && (0, Ct.schemaHasRulesButRef)(e, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function w0(t) {
  const { schema: e, opts: r } = t;
  e.default !== void 0 && r.useDefaults && r.strictSchema && (0, Ct.checkStrictMode)(t, "default is ignored in the schema root");
}
function b0(t) {
  const e = t.schema[t.opts.schemaId];
  e && (t.baseId = (0, f0.resolveUrl)(t.opts.uriResolver, t.baseId, e));
}
function S0(t) {
  if (t.schema.$async && !t.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Lm({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    t.code((0, H._)`${te.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, H.str)`${n}/$comment`, i = t.scopeValue("root", { ref: e.root });
    t.code((0, H._)`${te.default.self}.opts.$comment(${a}, ${o}, ${i}.schema)`);
  }
}
function E0(t) {
  const { gen: e, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = t;
  r.$async ? e.if((0, H._)`${te.default.errors} === 0`, () => e.return(te.default.data), () => e.throw((0, H._)`new ${s}(${te.default.vErrors})`)) : (e.assign((0, H._)`${n}.errors`, te.default.vErrors), a.unevaluated && N0(t), e.return((0, H._)`${te.default.errors} === 0`));
}
function N0({ gen: t, evaluated: e, props: r, items: n }) {
  r instanceof H.Name && t.assign((0, H._)`${e}.props`, r), n instanceof H.Name && t.assign((0, H._)`${e}.items`, n);
}
function Nl(t, e, r, n) {
  const { gen: s, schema: a, data: o, allErrors: i, opts: c, self: d } = t, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, Ct.schemaHasRulesButRef)(a, l))) {
    s.block(() => Vm(t, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || P0(t, e), s.block(() => {
    for (const _ of l.rules)
      h(_);
    h(l.post);
  });
  function h(_) {
    (0, oi.shouldUseGroup)(a, _) && (_.type ? (s.if((0, Qs.checkDataType)(_.type, o, c.strictNumbers)), Pl(t, _), e.length === 1 && e[0] === _.type && r && (s.else(), (0, Qs.reportTypeError)(t)), s.endIf()) : Pl(t, _), i || s.if((0, H._)`${te.default.errors} === ${n || 0}`));
  }
}
function Pl(t, e) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = t;
  s && (0, d0.assignDefaults)(t, e.type), r.block(() => {
    for (const a of e.rules)
      (0, oi.shouldUseRule)(n, a) && Vm(t, a.keyword, a.definition, e.type);
  });
}
function P0(t, e) {
  t.schemaEnv.meta || !t.opts.strictTypes || (T0(t, e), t.opts.allowUnionTypes || O0(t, e), R0(t, t.dataTypes));
}
function T0(t, e) {
  if (e.length) {
    if (!t.dataTypes.length) {
      t.dataTypes = e;
      return;
    }
    e.forEach((r) => {
      Dm(t.dataTypes, r) || ii(t, `type "${r}" not allowed by context "${t.dataTypes.join(",")}"`);
    }), j0(t, e);
  }
}
function O0(t, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && ii(t, "use allowUnionTypes to allow union type keyword");
}
function R0(t, e) {
  const r = t.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, oi.shouldUseRule)(t.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => I0(e, o)) && ii(t, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function I0(t, e) {
  return t.includes(e) || e === "number" && t.includes("integer");
}
function Dm(t, e) {
  return t.includes(e) || e === "integer" && t.includes("number");
}
function j0(t, e) {
  const r = [];
  for (const n of t.dataTypes)
    Dm(e, n) ? r.push(n) : e.includes("integer") && n === "number" && r.push("integer");
  t.dataTypes = r;
}
function ii(t, e) {
  const r = t.schemaEnv.baseId + t.errSchemaPath;
  e += ` at "${r}" (strictTypes)`, (0, Ct.checkStrictMode)(t, e, t.opts.strictTypes);
}
let Mm = class {
  constructor(e, r, n) {
    if ((0, Mn.validateKeywordUsage)(e, r, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Ct.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = r, this.$data)
      this.schemaCode = e.gen.const("vSchema", Fm(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, Mn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = e.gen.const("_errs", te.default.errors));
  }
  result(e, r, n) {
    this.failResult((0, H.not)(e), r, n);
  }
  failResult(e, r, n) {
    this.gen.if(e), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(e, r) {
    this.failResult((0, H.not)(e), void 0, r);
  }
  fail(e) {
    if (e === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(e), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(e) {
    if (!this.$data)
      return this.fail(e);
    const { schemaCode: r } = this;
    this.fail((0, H._)`${r} !== undefined && (${(0, H.or)(this.invalid$data(), e)})`);
  }
  error(e, r, n) {
    if (r) {
      this.setParams(r), this._error(e, n), this.setParams({});
      return;
    }
    this._error(e, n);
  }
  _error(e, r) {
    (e ? Tn.reportExtraError : Tn.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Tn.reportError)(this, this.def.$dataError || Tn.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Tn.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(e) {
    this.allErrors || this.gen.if(e);
  }
  setParams(e, r) {
    r ? Object.assign(this.params, e) : this.params = e;
  }
  block$data(e, r, n = H.nil) {
    this.gen.block(() => {
      this.check$data(e, n), r();
    });
  }
  check$data(e = H.nil, r = H.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, H.or)((0, H._)`${s} === undefined`, r)), e !== H.nil && n.assign(e, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), e !== H.nil && n.assign(e, !1)), n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, H.or)(o(), i());
    function o() {
      if (n.length) {
        if (!(r instanceof H.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, H._)`${(0, Qs.checkDataTypes)(c, r, a.opts.strictNumbers, Qs.DataType.Wrong)}`;
      }
      return H.nil;
    }
    function i() {
      if (s.validateSchema) {
        const c = e.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, H._)`!${c}(${r})`;
      }
      return H.nil;
    }
  }
  subschema(e, r) {
    const n = (0, Fa.getSubschema)(this.it, e);
    (0, Fa.extendSubschemaData)(n, this.it, e), (0, Fa.extendSubschemaMode)(n, e);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return g0(s, r), s;
  }
  mergeEvaluated(e, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && e.props !== void 0 && (n.props = Ct.mergeEvaluated.props(s, e.props, n.props, r)), n.items !== !0 && e.items !== void 0 && (n.items = Ct.mergeEvaluated.items(s, e.items, n.items, r)));
  }
  mergeValidEvaluated(e, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(e, H.Name)), !0;
  }
};
pt.KeywordCxt = Mm;
function Vm(t, e, r, n) {
  const s = new Mm(t, r, e);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Mn.funcKeywordCode)(s, r) : "macro" in r ? (0, Mn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Mn.funcKeywordCode)(s, r);
}
const C0 = /^\/(?:[^~]|~0|~1)*$/, A0 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Fm(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (t === "")
    return te.default.rootData;
  if (t[0] === "/") {
    if (!C0.test(t))
      throw new Error(`Invalid JSON-pointer: ${t}`);
    s = t, a = te.default.rootData;
  } else {
    const d = A0.exec(t);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${t}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= e)
        throw new Error(c("property/index", l));
      return n[e - l];
    }
    if (l > e)
      throw new Error(c("data", l));
    if (a = r[e - l], !s)
      return a;
  }
  let o = a;
  const i = s.split("/");
  for (const d of i)
    d && (a = (0, H._)`${a}${(0, H.getProperty)((0, Ct.unescapeJsonPointer)(d))}`, o = (0, H._)`${o} && ${a}`);
  return o;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${e}`;
  }
}
pt.getData = Fm;
var rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
let k0 = class extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
};
rs.default = k0;
var mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
const qa = je;
let L0 = class extends Error {
  constructor(e, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, qa.resolveUrl)(e, r, n), this.missingSchema = (0, qa.normalizeId)((0, qa.getFullPath)(e, this.missingRef));
  }
};
mn.default = L0;
var xe = {};
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.resolveSchema = xe.getCompilingSchema = xe.resolveRef = xe.compileSchema = xe.SchemaEnv = void 0;
const ct = se, D0 = rs, yr = nt, ht = je, Tl = V, M0 = pt;
let ha = class {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, ht.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
xe.SchemaEnv = ha;
function ci(t) {
  const e = qm.call(this, t);
  if (e)
    return e;
  const r = (0, ht.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new ct.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: D0.default,
    code: (0, ct._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  t.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: yr.default.data,
    parentData: yr.default.parentData,
    parentDataProperty: yr.default.parentDataProperty,
    dataNames: [yr.default.data],
    dataPathArr: [ct.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: t.schema, code: (0, ct.stringify)(t.schema) } : { ref: t.schema }),
    validateName: c,
    ValidationError: i,
    schema: t.schema,
    schemaEnv: t,
    rootId: r,
    baseId: t.baseId || r,
    schemaPath: ct.nil,
    errSchemaPath: t.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, ct._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(t), (0, M0.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs(yr.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, t));
    const $ = new Function(`${yr.default.self}`, `${yr.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: $ }), $.errors = null, $.schema = t.schema, $.schemaEnv = t, t.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: v } = d;
      $.evaluated = {
        props: w instanceof ct.Name ? void 0 : w,
        items: v instanceof ct.Name ? void 0 : v,
        dynamicProps: w instanceof ct.Name,
        dynamicItems: v instanceof ct.Name
      }, $.source && ($.source.evaluated = (0, ct.stringify)($.evaluated));
    }
    return t.validate = $, t;
  } catch (h) {
    throw delete t.validate, delete t.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(t);
  }
}
xe.compileSchema = ci;
function V0(t, e, r) {
  var n;
  r = (0, ht.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = z0.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new ha({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = F0.call(this, a);
}
xe.resolveRef = V0;
function F0(t) {
  return (0, ht.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : ci.call(this, t);
}
function qm(t) {
  for (const e of this._compilations)
    if (q0(e, t))
      return e;
}
xe.getCompilingSchema = qm;
function q0(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function z0(t, e) {
  let r;
  for (; typeof (r = this.refs[e]) == "string"; )
    e = r;
  return r || this.schemas[e] || ma.call(this, t, e);
}
function ma(t, e) {
  const r = this.opts.uriResolver.parse(e), n = (0, ht._getFullPath)(this.opts.uriResolver, r);
  let s = (0, ht.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
  if (Object.keys(t.schema).length > 0 && n === s)
    return za.call(this, r, t);
  const a = (0, ht.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const i = ma.call(this, t, o);
    return typeof (i == null ? void 0 : i.schema) != "object" ? void 0 : za.call(this, r, i);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || ci.call(this, o), a === (0, ht.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, d = i[c];
      return d && (s = (0, ht.resolveUrl)(this.opts.uriResolver, s, d)), new ha({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return za.call(this, r, o);
  }
}
xe.resolveSchema = ma;
const U0 = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function za(t, { baseId: e, schema: r, root: n }) {
  var s;
  if (((s = t.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const i of t.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Tl.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !U0.has(i) && d && (e = (0, ht.resolveUrl)(this.opts.uriResolver, e, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Tl.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, ht.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = ma.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new ha({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const B0 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", K0 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Q0 = "object", G0 = [
  "$data"
], x0 = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, H0 = !1, J0 = {
  $id: B0,
  description: K0,
  type: Q0,
  required: G0,
  properties: x0,
  additionalProperties: H0
};
var li = {}, pa = { exports: {} };
const W0 = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), zm = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), ui = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), Um = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), X0 = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
function Bm(t) {
  let e = "", r = 0, n = 0;
  for (n = 0; n < t.length; n++)
    if (r = t[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      e += t[n];
      break;
    }
  for (n += 1; n < t.length; n++) {
    if (r = t[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    e += t[n];
  }
  return e;
}
const Y0 = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Ol(t) {
  return t.length = 0, !0;
}
function Z0(t, e, r) {
  if (t.length) {
    const n = Bm(t);
    if (n !== "")
      e.push(n);
    else
      return r.error = !0, !1;
    t.length = 0;
  }
  return !0;
}
function ev(t) {
  let e = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, i = Z0;
  for (let c = 0; c < t.length; c++) {
    const d = t[c];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (o = !0), !i(s, n, r))
          break;
        if (++e > 7) {
          r.error = !0;
          break;
        }
        c > 0 && t[c - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!i(s, n, r))
          break;
        i = Ol;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (i === Ol ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(Bm(s))), r.address = n.join(""), r;
}
function Km(t) {
  if (tv(t, ":") < 2)
    return { host: t, isIPV6: !1 };
  const e = ev(t);
  if (e.error)
    return { host: t, isIPV6: !1 };
  {
    let r = e.address, n = e.address;
    return e.zone && (r += "%" + e.zone, n += "%25" + e.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function tv(t, e) {
  let r = 0;
  for (let n = 0; n < t.length; n++)
    t[n] === e && r++;
  return r;
}
function rv(t) {
  let e = t;
  const r = [];
  let n = -1, s = 0;
  for (; s = e.length; ) {
    if (s === 1) {
      if (e === ".")
        break;
      if (e === "/") {
        r.push("/");
        break;
      } else {
        r.push(e);
        break;
      }
    } else if (s === 2) {
      if (e[0] === ".") {
        if (e[1] === ".")
          break;
        if (e[1] === "/") {
          e = e.slice(2);
          continue;
        }
      } else if (e[0] === "/" && (e[1] === "." || e[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (s === 3 && e === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (e[0] === ".") {
      if (e[1] === ".") {
        if (e[2] === "/") {
          e = e.slice(3);
          continue;
        }
      } else if (e[1] === "/") {
        e = e.slice(2);
        continue;
      }
    } else if (e[0] === "/" && e[1] === ".") {
      if (e[2] === "/") {
        e = e.slice(2);
        continue;
      } else if (e[2] === "." && e[3] === "/") {
        e = e.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = e.indexOf("/", 1)) === -1) {
      r.push(e);
      break;
    } else
      r.push(e.slice(0, n)), e = e.slice(n);
  }
  return r.join("");
}
const nv = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, sv = /[@/?#:]/g, av = /[@/?#]/g;
function Qm(t, e) {
  const r = e ? av : sv;
  return r.lastIndex = 0, t.replace(r, (n) => nv[n]);
}
function ov(t, e = !1) {
  if (t.indexOf("%") === -1)
    return t;
  let r = "";
  for (let n = 0; n < t.length; n++) {
    if (t[n] === "%" && n + 2 < t.length) {
      const s = t.slice(n + 1, n + 3);
      if (ui(s)) {
        const a = s.toUpperCase(), o = String.fromCharCode(parseInt(a, 16));
        e && Um(o) ? r += o : r += "%" + a, n += 2;
        continue;
      }
    }
    r += t[n];
  }
  return r;
}
function iv(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    if (t[r] === "%" && r + 2 < t.length) {
      const n = t.slice(r + 1, r + 3);
      if (ui(n)) {
        const s = n.toUpperCase(), a = String.fromCharCode(parseInt(s, 16));
        a !== "." && Um(a) ? e += a : e += "%" + s, r += 2;
        continue;
      }
    }
    X0(t[r]) ? e += t[r] : e += escape(t[r]);
  }
  return e;
}
function cv(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    if (t[r] === "%" && r + 2 < t.length) {
      const n = t.slice(r + 1, r + 3);
      if (ui(n)) {
        e += "%" + n.toUpperCase(), r += 2;
        continue;
      }
    }
    e += escape(t[r]);
  }
  return e;
}
function lv(t) {
  const e = [];
  if (t.userinfo !== void 0 && (e.push(t.userinfo), e.push("@")), t.host !== void 0) {
    let r = unescape(t.host);
    if (!zm(r)) {
      const n = Km(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = Qm(r, !1);
    }
    e.push(r);
  }
  return (typeof t.port == "number" || typeof t.port == "string") && (e.push(":"), e.push(String(t.port))), e.length ? e.join("") : void 0;
}
var Gm = {
  nonSimpleDomain: Y0,
  recomposeAuthority: lv,
  reescapeHostDelimiters: Qm,
  normalizePercentEncoding: ov,
  normalizePathEncoding: iv,
  escapePreservingEscapes: cv,
  removeDotSegments: rv,
  isIPv4: zm,
  isUUID: W0,
  normalizeIPv6: Km
};
const { isUUID: uv } = Gm, dv = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function xm(t) {
  return t.secure === !0 ? !0 : t.secure === !1 ? !1 : t.scheme ? t.scheme.length === 3 && (t.scheme[0] === "w" || t.scheme[0] === "W") && (t.scheme[1] === "s" || t.scheme[1] === "S") && (t.scheme[2] === "s" || t.scheme[2] === "S") : !1;
}
function Hm(t) {
  return t.host || (t.error = t.error || "HTTP URIs must have a host."), t;
}
function Jm(t) {
  const e = String(t.scheme).toLowerCase() === "https";
  return (t.port === (e ? 443 : 80) || t.port === "") && (t.port = void 0), t.path || (t.path = "/"), t;
}
function fv(t) {
  return t.secure = xm(t), t.resourceName = (t.path || "/") + (t.query ? "?" + t.query : ""), t.path = void 0, t.query = void 0, t;
}
function hv(t) {
  if ((t.port === (xm(t) ? 443 : 80) || t.port === "") && (t.port = void 0), typeof t.secure == "boolean" && (t.scheme = t.secure ? "wss" : "ws", t.secure = void 0), t.resourceName) {
    const [e, r] = t.resourceName.split("?");
    t.path = e && e !== "/" ? e : void 0, t.query = r, t.resourceName = void 0;
  }
  return t.fragment = void 0, t;
}
function mv(t, e) {
  if (!t.path)
    return t.error = "URN can not be parsed", t;
  const r = t.path.match(dv);
  if (r) {
    const n = e.scheme || t.scheme || "urn";
    t.nid = r[1].toLowerCase(), t.nss = r[2];
    const s = `${n}:${e.nid || t.nid}`, a = di(s);
    t.path = void 0, a && (t = a.parse(t, e));
  } else
    t.error = t.error || "URN can not be parsed.";
  return t;
}
function pv(t, e) {
  if (t.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = e.scheme || t.scheme || "urn", n = t.nid.toLowerCase(), s = `${r}:${e.nid || n}`, a = di(s);
  a && (t = a.serialize(t, e));
  const o = t, i = t.nss;
  return o.path = `${n || e.nid}:${i}`, e.skipEscape = !0, o;
}
function yv(t, e) {
  const r = t;
  return r.uuid = r.nss, r.nss = void 0, !e.tolerant && (!r.uuid || !uv(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function $v(t) {
  const e = t;
  return e.nss = (t.uuid || "").toLowerCase(), e;
}
const Wm = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Hm,
    serialize: Jm
  }
), gv = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Wm.domainHost,
    parse: Hm,
    serialize: Jm
  }
), As = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: fv,
    serialize: hv
  }
), vv = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: As.domainHost,
    parse: As.parse,
    serialize: As.serialize
  }
), _v = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: mv,
    serialize: pv,
    skipNormalize: !0
  }
), wv = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: yv,
    serialize: $v,
    skipNormalize: !0
  }
), Gs = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Wm,
    https: gv,
    ws: As,
    wss: vv,
    urn: _v,
    "urn:uuid": wv
  }
);
Object.setPrototypeOf(Gs, null);
function di(t) {
  return t && (Gs[
    /** @type {SchemeName} */
    t
  ] || Gs[
    /** @type {SchemeName} */
    t.toLowerCase()
  ]) || void 0;
}
var bv = {
  SCHEMES: Gs,
  getSchemeHandler: di
};
const { normalizeIPv6: Sv, removeDotSegments: Cn, recomposeAuthority: Ev, normalizePercentEncoding: Nv, normalizePathEncoding: Pv, escapePreservingEscapes: Tv, reescapeHostDelimiters: Ov, isIPv4: Rv, nonSimpleDomain: Iv } = Gm, { SCHEMES: jv, getSchemeHandler: Xm } = bv;
function Cv(t, e) {
  return typeof t == "string" ? t = /** @type {T} */
  Mv(t, e) : typeof t == "object" && (t = /** @type {T} */
  cn(Ir(t, e), e)), t;
}
function Av(t, e, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = Ym(cn(t, n), cn(e, n), n, !0);
  return n.skipEscape = !0, Ir(s, n);
}
function Ym(t, e, r, n) {
  const s = {};
  return n || (t = cn(Ir(t, r), r), e = cn(Ir(e, r), r)), r = r || {}, !r.tolerant && e.scheme ? (s.scheme = e.scheme, s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = Cn(e.path || ""), s.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = Cn(e.path || ""), s.query = e.query) : (e.path ? (e.path[0] === "/" ? s.path = Cn(e.path) : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path ? s.path = "/" + e.path : t.path ? s.path = t.path.slice(0, t.path.lastIndexOf("/") + 1) + e.path : s.path = e.path, s.path = Cn(s.path)), s.query = e.query) : (s.path = t.path, e.query !== void 0 ? s.query = e.query : s.query = t.query), s.userinfo = t.userinfo, s.host = t.host, s.port = t.port), s.scheme = t.scheme), s.fragment = e.fragment, s;
}
function kv(t, e, r) {
  const n = Rl(t, r), s = Rl(e, r);
  return n !== void 0 && s !== void 0 && n.toLowerCase() === s.toLowerCase();
}
function Ir(t, e) {
  const r = {
    host: t.host,
    scheme: t.scheme,
    userinfo: t.userinfo,
    port: t.port,
    path: t.path,
    query: t.query,
    nid: t.nid,
    nss: t.nss,
    uuid: t.uuid,
    fragment: t.fragment,
    reference: t.reference,
    resourceName: t.resourceName,
    secure: t.secure,
    error: ""
  }, n = Object.assign({}, e), s = [], a = Xm(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = Nv(r.path) : (r.path = Tv(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = Ev(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let i = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (i = Cn(i)), o === void 0 && i[0] === "/" && i[1] === "/" && (i = "/%2F" + i.slice(2)), s.push(i);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Lv = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Dv(t, e) {
  if (e[2] !== void 0 && t.path && t.path[0] !== "/")
    return 'URI path must start with "/" when authority is present.';
  if (typeof t.port == "number" && (t.port < 0 || t.port > 65535))
    return "URI port is malformed.";
}
function Zm(t, e) {
  const r = Object.assign({}, e), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1, a = !1;
  r.reference === "suffix" && (r.scheme ? t = r.scheme + ":" + t : t = "//" + t);
  const o = t.match(Lv);
  if (o) {
    n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]);
    const i = Dv(n, o);
    if (i !== void 0 && (n.error = n.error || i, s = !0), n.host)
      if (Rv(n.host) === !1) {
        const l = Sv(n.host);
        n.host = l.host.toLowerCase(), a = l.isIPV6;
      } else
        a = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = Xm(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && Iv(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!c || c && !c.skipNormalize) && (t.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = Ov(unescape(n.host), a))), n.path && (n.path = Pv(n.path)), n.fragment))
      try {
        n.fragment = encodeURI(decodeURIComponent(n.fragment));
      } catch {
        n.error = n.error || "URI malformed";
      }
    c && c.parse && c.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return { parsed: n, malformedAuthorityOrPort: s };
}
function cn(t, e) {
  return Zm(t, e).parsed;
}
function Mv(t, e) {
  return ep(t, e).normalized;
}
function ep(t, e) {
  const { parsed: r, malformedAuthorityOrPort: n } = Zm(t, e);
  return {
    normalized: n ? t : Ir(r, e),
    malformedAuthorityOrPort: n
  };
}
function Rl(t, e) {
  if (typeof t == "string") {
    const { normalized: r, malformedAuthorityOrPort: n } = ep(t, e);
    return n ? void 0 : r;
  }
  if (typeof t == "object")
    return Ir(t, e);
}
const fi = {
  SCHEMES: jv,
  normalize: Cv,
  resolve: Av,
  resolveComponent: Ym,
  equal: kv,
  serialize: Ir,
  parse: cn
};
pa.exports = fi;
pa.exports.default = fi;
pa.exports.fastUri = fi;
var tp = pa.exports;
Object.defineProperty(li, "__esModule", { value: !0 });
const rp = tp;
rp.code = 'require("ajv/dist/runtime/uri").default';
li.default = rp;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  var e = pt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var r = se;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = rs, s = mn, a = Rr, o = xe, i = se, c = je, d = Ne, l = V, h = J0, _ = li, $ = (P, p) => new RegExp(P, p);
  $.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), g = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, b = 200;
  function T(P) {
    var p, E, y, u, f, S, C, j, U, K, ue, Ze, rr, nr, sr, ar, or, ir, cr, lr, ur, dr, fr, hr, mr;
    const it = P.strict, pr = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, bn = pr === !0 || pr === void 0 ? 1 : pr || 0, Sn = (y = (E = P.code) === null || E === void 0 ? void 0 : E.regExp) !== null && y !== void 0 ? y : $, Da = (u = P.uriResolver) !== null && u !== void 0 ? u : _.default;
    return {
      strictSchema: (S = (f = P.strictSchema) !== null && f !== void 0 ? f : it) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (C = P.strictNumbers) !== null && C !== void 0 ? C : it) !== null && j !== void 0 ? j : !0,
      strictTypes: (K = (U = P.strictTypes) !== null && U !== void 0 ? U : it) !== null && K !== void 0 ? K : "log",
      strictTuples: (Ze = (ue = P.strictTuples) !== null && ue !== void 0 ? ue : it) !== null && Ze !== void 0 ? Ze : "log",
      strictRequired: (nr = (rr = P.strictRequired) !== null && rr !== void 0 ? rr : it) !== null && nr !== void 0 ? nr : !1,
      code: P.code ? { ...P.code, optimize: bn, regExp: Sn } : { optimize: bn, regExp: Sn },
      loopRequired: (sr = P.loopRequired) !== null && sr !== void 0 ? sr : b,
      loopEnum: (ar = P.loopEnum) !== null && ar !== void 0 ? ar : b,
      meta: (or = P.meta) !== null && or !== void 0 ? or : !0,
      messages: (ir = P.messages) !== null && ir !== void 0 ? ir : !0,
      inlineRefs: (cr = P.inlineRefs) !== null && cr !== void 0 ? cr : !0,
      schemaId: (lr = P.schemaId) !== null && lr !== void 0 ? lr : "$id",
      addUsedSchema: (ur = P.addUsedSchema) !== null && ur !== void 0 ? ur : !0,
      validateSchema: (dr = P.validateSchema) !== null && dr !== void 0 ? dr : !0,
      validateFormats: (fr = P.validateFormats) !== null && fr !== void 0 ? fr : !0,
      unicodeRegExp: (hr = P.unicodeRegExp) !== null && hr !== void 0 ? hr : !0,
      int32range: (mr = P.int32range) !== null && mr !== void 0 ? mr : !0,
      uriResolver: Da
    };
  }
  class O {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...T(p) };
      const { es5: E, lines: y } = this.opts.code;
      this.scope = new i.ValueScope({ scope: {}, prefixes: v, es5: E, lines: y }), this.logger = x(p.logger);
      const u = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, g, p, "NOT SUPPORTED"), I.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ge.call(this), p.formats && Y.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && de.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), D.call(this), p.validateFormats = u;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: E, schemaId: y } = this.opts;
      let u = h;
      y === "id" && (u = { ...h }, u.id = u.$id, delete u.$id), E && p && this.addMetaSchema(u, u[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: E } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[E] || p : void 0;
    }
    validate(p, E) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const u = y(E);
      return "$async" in y || (this.errors = y.errors), u;
    }
    compile(p, E) {
      const y = this._addSchema(p, E);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, E) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return u.call(this, p, E);
      async function u(K, ue) {
        await f.call(this, K.$schema);
        const Ze = this._addSchema(K, ue);
        return Ze.validate || S.call(this, Ze);
      }
      async function f(K) {
        K && !this.getSchema(K) && await u.call(this, { $ref: K }, !0);
      }
      async function S(K) {
        try {
          return this._compileSchemaEnv(K);
        } catch (ue) {
          if (!(ue instanceof s.default))
            throw ue;
          return C.call(this, ue), await j.call(this, ue.missingSchema), S.call(this, K);
        }
      }
      function C({ missingSchema: K, missingRef: ue }) {
        if (this.refs[K])
          throw new Error(`AnySchema ${K} is loaded but ${ue} cannot be resolved`);
      }
      async function j(K) {
        const ue = await U.call(this, K);
        this.refs[K] || await f.call(this, ue.$schema), this.refs[K] || this.addSchema(ue, K, E);
      }
      async function U(K) {
        const ue = this._loading[K];
        if (ue)
          return ue;
        try {
          return await (this._loading[K] = y(K));
        } finally {
          delete this._loading[K];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, E, y, u = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, y, u);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return E = (0, c.normalizeId)(E || f), this._checkUnique(E), this.schemas[E] = this._addSchema(p, y, E, u, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, E, y = this.opts.validateSchema) {
      return this.addSchema(p, E, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, E) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const u = this.validate(y, p);
      if (!u && E) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return u;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let E;
      for (; typeof (E = q.call(this, p)) == "string"; )
        p = E;
      if (E === void 0) {
        const { schemaId: y } = this.opts, u = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (E = o.resolveSchema.call(this, u, p), !E)
          return;
        this.refs[p] = E;
      }
      return E.validate || this._compileSchemaEnv(E);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const E = q.call(this, p);
          return typeof E == "object" && this._cache.delete(E.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const E = p;
          this._cache.delete(E);
          let y = p[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const E of p)
        this.addKeyword(E);
      return this;
    }
    addKeyword(p, E) {
      let y;
      if (typeof p == "string")
        y = p, typeof E == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), E.keyword = y);
      else if (typeof p == "object" && E === void 0) {
        if (E = p, y = E.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (G.call(this, y, E), !E)
        return (0, l.eachItem)(y, (f) => he.call(this, f)), this;
      M.call(this, E);
      const u = {
        ...E,
        type: (0, d.getJSONTypes)(E.type),
        schemaType: (0, d.getJSONTypes)(E.schemaType)
      };
      return (0, l.eachItem)(y, u.type.length === 0 ? (f) => he.call(this, f, u) : (f) => u.type.forEach((S) => he.call(this, f, u, S))), this;
    }
    getKeyword(p) {
      const E = this.RULES.all[p];
      return typeof E == "object" ? E.definition : !!E;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: E } = this;
      delete E.keywords[p], delete E.all[p];
      for (const y of E.rules) {
        const u = y.rules.findIndex((f) => f.keyword === p);
        u >= 0 && y.rules.splice(u, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, E) {
      return typeof E == "string" && (E = new RegExp(E)), this.formats[p] = E, this;
    }
    errorsText(p = this.errors, { separator: E = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((u) => `${y}${u.instancePath} ${u.message}`).reduce((u, f) => u + E + f);
    }
    $dataMetaSchema(p, E) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const u of E) {
        const f = u.split("/").slice(1);
        let S = p;
        for (const C of f)
          S = S[C];
        for (const C in y) {
          const j = y[C];
          if (typeof j != "object")
            continue;
          const { $data: U } = j.definition, K = S[C];
          U && K && (S[C] = B(K));
        }
      }
      return p;
    }
    _removeAllSchemas(p, E) {
      for (const y in p) {
        const u = p[y];
        (!E || E.test(y)) && (typeof u == "string" ? delete p[y] : u && !u.meta && (this._cache.delete(u.schema), delete p[y]));
      }
    }
    _addSchema(p, E, y, u = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: C } = this.opts;
      if (typeof p == "object")
        S = p[C];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      y = (0, c.normalizeId)(S || y);
      const U = c.getSchemaRefs.call(this, p, y);
      return j = new o.SchemaEnv({ schema: p, schemaId: C, meta: E, baseId: y, localRefs: U }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), u && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const E = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = E;
      }
    }
  }
  O.ValidationError = n.default, O.MissingRefError = s.default, t.default = O;
  function I(P, p, E, y = "error") {
    for (const u in P) {
      const f = u;
      f in p && this.logger[y](`${E}: option ${u}. ${P[f]}`);
    }
  }
  function q(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function D() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function Y() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function de(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const E = P[p];
      E.keyword || (E.keyword = p), this.addKeyword(E);
    }
  }
  function ge() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const Q = { log() {
  }, warn() {
  }, error() {
  } };
  function x(P) {
    if (P === !1)
      return Q;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ne = /^[a-z_$][a-z0-9_$:-]*$/i;
  function G(P, p) {
    const { RULES: E } = this;
    if ((0, l.eachItem)(P, (y) => {
      if (E.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!ne.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function he(P, p, E) {
    var y;
    const u = p == null ? void 0 : p.post;
    if (E && u)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = u ? f.post : f.rules.find(({ type: j }) => j === E);
    if (S || (S = { type: E, rules: [] }, f.rules.push(S)), f.keywords[P] = !0, !p)
      return;
    const C = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? Te.call(this, S, C, p.before) : S.rules.push(C), f.all[P] = C, (y = p.implements) === null || y === void 0 || y.forEach((j) => this.addKeyword(j));
  }
  function Te(P, p, E) {
    const y = P.rules.findIndex((u) => u.keyword === E);
    y >= 0 ? P.rules.splice(y, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${E} is not defined`));
  }
  function M(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = B(p)), P.validateSchema = this.compile(p, !0));
  }
  const L = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function B(P) {
    return { anyOf: [P, L] };
  }
})(lm);
var hi = {}, mi = {}, pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
const Vv = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
pi.default = Vv;
var Dt = {};
Object.defineProperty(Dt, "__esModule", { value: !0 });
Dt.callRef = Dt.getValidate = void 0;
const Fv = mn, Il = ce, Je = se, zr = nt, jl = xe, fs = V, qv = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = jl.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new Fv.default(n.opts.uriResolver, s, r);
    if (l instanceof jl.SchemaEnv)
      return _(l);
    return $(l);
    function h() {
      if (a === d)
        return ks(t, o, a, a.$async);
      const w = e.scopeValue("root", { ref: d });
      return ks(t, (0, Je._)`${w}.validate`, d, d.$async);
    }
    function _(w) {
      const v = np(t, w);
      ks(t, v, w, w.$async);
    }
    function $(w) {
      const v = e.scopeValue("schema", i.code.source === !0 ? { ref: w, code: (0, Je.stringify)(w) } : { ref: w }), g = e.name("valid"), m = t.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Je.nil,
        topSchemaRef: v,
        errSchemaPath: r
      }, g);
      t.mergeEvaluated(m), t.ok(g);
    }
  }
};
function np(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, Je._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
Dt.getValidate = np;
function ks(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, d = c.passContext ? zr.default.this : Je.nil;
  n ? l() : h();
  function l() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Je._)`await ${(0, Il.callValidateCode)(t, e, d)}`), $(e), o || s.assign(w, !0);
    }, (v) => {
      s.if((0, Je._)`!(${v} instanceof ${a.ValidationError})`, () => s.throw(v)), _(v), o || s.assign(w, !1);
    }), t.ok(w);
  }
  function h() {
    t.result((0, Il.callValidateCode)(t, e, d), () => $(e), () => _(e));
  }
  function _(w) {
    const v = (0, Je._)`${w}.errors`;
    s.assign(zr.default.vErrors, (0, Je._)`${zr.default.vErrors} === null ? ${v} : ${zr.default.vErrors}.concat(${v})`), s.assign(zr.default.errors, (0, Je._)`${zr.default.vErrors}.length`);
  }
  function $(w) {
    var v;
    if (!a.opts.unevaluated)
      return;
    const g = (v = r == null ? void 0 : r.validate) === null || v === void 0 ? void 0 : v.evaluated;
    if (a.props !== !0)
      if (g && !g.dynamicProps)
        g.props !== void 0 && (a.props = fs.mergeEvaluated.props(s, g.props, a.props));
      else {
        const m = s.var("props", (0, Je._)`${w}.evaluated.props`);
        a.props = fs.mergeEvaluated.props(s, m, a.props, Je.Name);
      }
    if (a.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (a.items = fs.mergeEvaluated.items(s, g.items, a.items));
      else {
        const m = s.var("items", (0, Je._)`${w}.evaluated.items`);
        a.items = fs.mergeEvaluated.items(s, m, a.items, Je.Name);
      }
  }
}
Dt.callRef = ks;
Dt.default = qv;
Object.defineProperty(mi, "__esModule", { value: !0 });
const zv = pi, Uv = Dt, Bv = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  zv.default,
  Uv.default
];
mi.default = Bv;
var yi = {}, $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
const xs = se, Ut = xs.operators, Hs = {
  maximum: { okStr: "<=", ok: Ut.LTE, fail: Ut.GT },
  minimum: { okStr: ">=", ok: Ut.GTE, fail: Ut.LT },
  exclusiveMaximum: { okStr: "<", ok: Ut.LT, fail: Ut.GTE },
  exclusiveMinimum: { okStr: ">", ok: Ut.GT, fail: Ut.LTE }
}, Kv = {
  message: ({ keyword: t, schemaCode: e }) => (0, xs.str)`must be ${Hs[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, xs._)`{comparison: ${Hs[t].okStr}, limit: ${e}}`
}, Qv = {
  keyword: Object.keys(Hs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Kv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, xs._)`${r} ${Hs[e].fail} ${n} || isNaN(${r})`);
  }
};
$i.default = Qv;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const Vn = se, Gv = {
  message: ({ schemaCode: t }) => (0, Vn.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, Vn._)`{multipleOf: ${t}}`
}, xv = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Gv,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, Vn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Vn._)`${o} !== parseInt(${o})`;
    t.fail$data((0, Vn._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
gi.default = xv;
var vi = {}, _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
function sp(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
_i.default = sp;
sp.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(vi, "__esModule", { value: !0 });
const vr = se, Hv = V, Jv = _i, Wv = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, vr.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, vr._)`{limit: ${t}}`
}, Xv = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Wv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? vr.operators.GT : vr.operators.LT, o = s.opts.unicode === !1 ? (0, vr._)`${r}.length` : (0, vr._)`${(0, Hv.useFunc)(t.gen, Jv.default)}(${r})`;
    t.fail$data((0, vr._)`${o} ${a} ${n}`);
  }
};
vi.default = Xv;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const Yv = ce, Zv = V, Xr = se, e_ = {
  message: ({ schemaCode: t }) => (0, Xr.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, Xr._)`{pattern: ${t}}`
}, t_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: e_,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t, i = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Xr._)`new RegExp` : (0, Zv.useFunc)(e, c), l = e.let("valid");
      e.try(() => e.assign(l, (0, Xr._)`${d}(${a}, ${i}).test(${r})`), () => e.assign(l, !1)), t.fail$data((0, Xr._)`!${l}`);
    } else {
      const c = (0, Yv.usePattern)(t, s);
      t.fail$data((0, Xr._)`!${c}.test(${r})`);
    }
  }
};
wi.default = t_;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
const Fn = se, r_ = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, Fn.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, Fn._)`{limit: ${t}}`
}, n_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: r_,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? Fn.operators.GT : Fn.operators.LT;
    t.fail$data((0, Fn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
bi.default = n_;
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
const On = ce, qn = se, s_ = V, a_ = {
  message: ({ params: { missingProperty: t } }) => (0, qn.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, qn._)`{missingProperty: ${t}}`
}, o_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: a_,
  code(t) {
    const { gen: e, schema: r, schemaCode: n, data: s, $data: a, it: o } = t, { opts: i } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= i.loopRequired;
    if (o.allErrors ? d() : l(), i.strictRequired) {
      const $ = t.parentSchema.properties, { definedProperties: w } = t.it;
      for (const v of r)
        if (($ == null ? void 0 : $[v]) === void 0 && !w.has(v)) {
          const g = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${v}" is not defined at "${g}" (strictRequired)`;
          (0, s_.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        t.block$data(qn.nil, h);
      else
        for (const $ of r)
          (0, On.checkReportMissingProp)(t, $);
    }
    function l() {
      const $ = e.let("missing");
      if (c || a) {
        const w = e.let("valid", !0);
        t.block$data(w, () => _($, w)), t.ok(w);
      } else
        e.if((0, On.checkMissingProp)(t, r, $)), (0, On.reportMissingProp)(t, $), e.else();
    }
    function h() {
      e.forOf("prop", n, ($) => {
        t.setParams({ missingProperty: $ }), e.if((0, On.noPropertyInData)(e, s, $, i.ownProperties), () => t.error());
      });
    }
    function _($, w) {
      t.setParams({ missingProperty: $ }), e.forOf($, n, () => {
        e.assign(w, (0, On.propertyInData)(e, s, $, i.ownProperties)), e.if((0, qn.not)(w), () => {
          t.error(), e.break();
        });
      }, qn.nil);
    }
  }
};
Si.default = o_;
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const zn = se, i_ = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, zn.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, zn._)`{limit: ${t}}`
}, c_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: i_,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? zn.operators.GT : zn.operators.LT;
    t.fail$data((0, zn._)`${r}.length ${s} ${n}`);
  }
};
Ei.default = c_;
var Ni = {}, ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
const ap = fa;
ap.code = 'require("ajv/dist/runtime/equal").default';
ns.default = ap;
Object.defineProperty(Ni, "__esModule", { value: !0 });
const Ua = Ne, Re = se, l_ = V, u_ = ns, d_ = {
  message: ({ params: { i: t, j: e } }) => (0, Re.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, Re._)`{i: ${t}, j: ${e}}`
}, f_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: d_,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: i } = t;
    if (!n && !s)
      return;
    const c = e.let("valid"), d = a.items ? (0, Ua.getSchemaTypes)(a.items) : [];
    t.block$data(c, l, (0, Re._)`${o} === false`), t.ok(c);
    function l() {
      const w = e.let("i", (0, Re._)`${r}.length`), v = e.let("j");
      t.setParams({ i: w, j: v }), e.assign(c, !0), e.if((0, Re._)`${w} > 1`, () => (h() ? _ : $)(w, v));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function _(w, v) {
      const g = e.name("item"), m = (0, Ua.checkDataTypes)(d, g, i.opts.strictNumbers, Ua.DataType.Wrong), b = e.const("indices", (0, Re._)`{}`);
      e.for((0, Re._)`;${w}--;`, () => {
        e.let(g, (0, Re._)`${r}[${w}]`), e.if(m, (0, Re._)`continue`), d.length > 1 && e.if((0, Re._)`typeof ${g} == "string"`, (0, Re._)`${g} += "_"`), e.if((0, Re._)`typeof ${b}[${g}] == "number"`, () => {
          e.assign(v, (0, Re._)`${b}[${g}]`), t.error(), e.assign(c, !1).break();
        }).code((0, Re._)`${b}[${g}] = ${w}`);
      });
    }
    function $(w, v) {
      const g = (0, l_.useFunc)(e, u_.default), m = e.name("outer");
      e.label(m).for((0, Re._)`;${w}--;`, () => e.for((0, Re._)`${v} = ${w}; ${v}--;`, () => e.if((0, Re._)`${g}(${r}[${w}], ${r}[${v}])`, () => {
        t.error(), e.assign(c, !1).break(m);
      })));
    }
  }
};
Ni.default = f_;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
const ho = se, h_ = V, m_ = ns, p_ = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, ho._)`{allowedValue: ${t}}`
}, y_ = {
  keyword: "const",
  $data: !0,
  error: p_,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, ho._)`!${(0, h_.useFunc)(e, m_.default)}(${r}, ${s})`) : t.fail((0, ho._)`${a} !== ${r}`);
  }
};
Pi.default = y_;
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
const An = se, $_ = V, g_ = ns, v_ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, An._)`{allowedValues: ${t}}`
}, __ = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: v_,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, $_.useFunc)(e, g_.default));
    let l;
    if (i || n)
      l = e.let("valid"), t.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = e.const("vSchema", a);
      l = (0, An.or)(...s.map((w, v) => _($, v)));
    }
    t.pass(l);
    function h() {
      e.assign(l, !1), e.forOf("v", a, ($) => e.if((0, An._)`${d()}(${r}, ${$})`, () => e.assign(l, !0).break()));
    }
    function _($, w) {
      const v = s[w];
      return typeof v == "object" && v !== null ? (0, An._)`${d()}(${r}, ${$}[${w}])` : (0, An._)`${r} === ${v}`;
    }
  }
};
Ti.default = __;
Object.defineProperty(yi, "__esModule", { value: !0 });
const w_ = $i, b_ = gi, S_ = vi, E_ = wi, N_ = bi, P_ = Si, T_ = Ei, O_ = Ni, R_ = Pi, I_ = Ti, j_ = [
  // number
  w_.default,
  b_.default,
  // string
  S_.default,
  E_.default,
  // object
  N_.default,
  P_.default,
  // array
  T_.default,
  O_.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  R_.default,
  I_.default
];
yi.default = j_;
var Oi = {}, pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.validateAdditionalItems = void 0;
const _r = se, mo = V, C_ = {
  message: ({ params: { len: t } }) => (0, _r.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, _r._)`{limit: ${t}}`
}, A_ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: C_,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, mo.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    op(t, n);
  }
};
function op(t, e) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = t;
  o.items = !0;
  const i = r.const("len", (0, _r._)`${s}.length`);
  if (n === !1)
    t.setParams({ len: e.length }), t.pass((0, _r._)`${i} <= ${e.length}`);
  else if (typeof n == "object" && !(0, mo.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, _r._)`${i} <= ${e.length}`);
    r.if((0, _r.not)(d), () => c(d)), t.ok(d);
  }
  function c(d) {
    r.forRange("i", e.length, i, (l) => {
      t.subschema({ keyword: a, dataProp: l, dataPropType: mo.Type.Num }, d), o.allErrors || r.if((0, _r.not)(d), () => r.break());
    });
  }
}
pn.validateAdditionalItems = op;
pn.default = A_;
var Ri = {}, yn = {};
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.validateTuple = void 0;
const Cl = se, Ls = V, k_ = ce, L_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return ip(t, "additionalItems", e);
    r.items = !0, !(0, Ls.alwaysValidSchema)(r, e) && t.ok((0, k_.validateArray)(t));
  }
};
function ip(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  l(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = Ls.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), d = n.const("len", (0, Cl._)`${a}.length`);
  r.forEach((h, _) => {
    (0, Ls.alwaysValidSchema)(i, h) || (n.if((0, Cl._)`${d} > ${_}`, () => t.subschema({
      keyword: o,
      schemaProp: _,
      dataProp: _
    }, c)), t.ok(c));
  });
  function l(h) {
    const { opts: _, errSchemaPath: $ } = i, w = r.length, v = w === h.minItems && (w === h.maxItems || h[e] === !1);
    if (_.strictTuples && !v) {
      const g = `"${o}" is ${w}-tuple, but minItems or maxItems/${e} are not specified or different at path "${$}"`;
      (0, Ls.checkStrictMode)(i, g, _.strictTuples);
    }
  }
}
yn.validateTuple = ip;
yn.default = L_;
Object.defineProperty(Ri, "__esModule", { value: !0 });
const D_ = yn, M_ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, D_.validateTuple)(t, "items")
};
Ri.default = M_;
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
const Al = se, V_ = V, F_ = ce, q_ = pn, z_ = {
  message: ({ params: { len: t } }) => (0, Al.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, Al._)`{limit: ${t}}`
}, U_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: z_,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, V_.alwaysValidSchema)(n, e) && (s ? (0, q_.validateAdditionalItems)(t, s) : t.ok((0, F_.validateArray)(t)));
  }
};
Ii.default = U_;
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
const st = se, hs = V, B_ = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, st.str)`must contain at least ${t} valid item(s)` : (0, st.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, st._)`{minContains: ${t}}` : (0, st._)`{minContains: ${t}, maxContains: ${e}}`
}, K_ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: B_,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    let o, i;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, i = d) : o = 1;
    const l = e.const("len", (0, st._)`${s}.length`);
    if (t.setParams({ min: o, max: i }), i === void 0 && o === 0) {
      (0, hs.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (i !== void 0 && o > i) {
      (0, hs.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), t.fail();
      return;
    }
    if ((0, hs.alwaysValidSchema)(a, r)) {
      let v = (0, st._)`${l} >= ${o}`;
      i !== void 0 && (v = (0, st._)`${v} && ${l} <= ${i}`), t.pass(v);
      return;
    }
    a.items = !0;
    const h = e.name("valid");
    i === void 0 && o === 1 ? $(h, () => e.if(h, () => e.break())) : o === 0 ? (e.let(h, !0), i !== void 0 && e.if((0, st._)`${s}.length > 0`, _)) : (e.let(h, !1), _()), t.result(h, () => t.reset());
    function _() {
      const v = e.name("_valid"), g = e.let("count", 0);
      $(v, () => e.if(v, () => w(g)));
    }
    function $(v, g) {
      e.forRange("i", 0, l, (m) => {
        t.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: hs.Type.Num,
          compositeRule: !0
        }, v), g();
      });
    }
    function w(v) {
      e.code((0, st._)`${v}++`), i === void 0 ? e.if((0, st._)`${v} >= ${o}`, () => e.assign(h, !0).break()) : (e.if((0, st._)`${v} > ${i}`, () => e.assign(h, !1).break()), o === 1 ? e.assign(h, !0) : e.if((0, st._)`${v} >= ${o}`, () => e.assign(h, !0)));
    }
  }
};
ji.default = K_;
var ya = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.validateSchemaDeps = t.validatePropertyDeps = t.error = void 0;
  const e = se, r = V, n = ce;
  t.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, e.str)`must have ${h} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: h } }) => (0, e._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: t.error,
    code(c) {
      const [d, l] = a(c);
      o(c, d), i(c, l);
    }
  };
  function a({ schema: c }) {
    const d = {}, l = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const _ = Array.isArray(c[h]) ? d : l;
      _[h] = c[h];
    }
    return [d, l];
  }
  function o(c, d = c.schema) {
    const { gen: l, data: h, it: _ } = c;
    if (Object.keys(d).length === 0)
      return;
    const $ = l.let("missing");
    for (const w in d) {
      const v = d[w];
      if (v.length === 0)
        continue;
      const g = (0, n.propertyInData)(l, h, w, _.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: v.length,
        deps: v.join(", ")
      }), _.allErrors ? l.if(g, () => {
        for (const m of v)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, e._)`${g} && (${(0, n.checkMissingProp)(c, v, $)})`), (0, n.reportMissingProp)(c, $), l.else());
    }
  }
  t.validatePropertyDeps = o;
  function i(c, d = c.schema) {
    const { gen: l, data: h, keyword: _, it: $ } = c, w = l.name("valid");
    for (const v in d)
      (0, r.alwaysValidSchema)($, d[v]) || (l.if(
        (0, n.propertyInData)(l, h, v, $.opts.ownProperties),
        () => {
          const g = c.subschema({ keyword: _, schemaProp: v }, w);
          c.mergeValidEvaluated(g, w);
        },
        () => l.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  t.validateSchemaDeps = i, t.default = s;
})(ya);
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
const cp = se, Q_ = V, G_ = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, cp._)`{propertyName: ${t.propertyName}}`
}, x_ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: G_,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, Q_.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, cp.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
Ci.default = x_;
var $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
const ms = ce, ut = se, H_ = nt, ps = V, J_ = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, ut._)`{additionalProperty: ${t.additionalProperty}}`
}, W_ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: J_,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, ps.alwaysValidSchema)(o, r))
      return;
    const d = (0, ms.allSchemaProperties)(n.properties), l = (0, ms.allSchemaProperties)(n.patternProperties);
    h(), t.ok((0, ut._)`${a} === ${H_.default.errors}`);
    function h() {
      e.forIn("key", s, (g) => {
        !d.length && !l.length ? w(g) : e.if(_(g), () => w(g));
      });
    }
    function _(g) {
      let m;
      if (d.length > 8) {
        const b = (0, ps.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, ms.isOwnProperty)(e, b, g);
      } else d.length ? m = (0, ut.or)(...d.map((b) => (0, ut._)`${g} === ${b}`)) : m = ut.nil;
      return l.length && (m = (0, ut.or)(m, ...l.map((b) => (0, ut._)`${(0, ms.usePattern)(t, b)}.test(${g})`))), (0, ut.not)(m);
    }
    function $(g) {
      e.code((0, ut._)`delete ${s}[${g}]`);
    }
    function w(g) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        $(g);
        return;
      }
      if (r === !1) {
        t.setParams({ additionalProperty: g }), t.error(), i || e.break();
        return;
      }
      if (typeof r == "object" && !(0, ps.alwaysValidSchema)(o, r)) {
        const m = e.name("valid");
        c.removeAdditional === "failing" ? (v(g, m, !1), e.if((0, ut.not)(m), () => {
          t.reset(), $(g);
        })) : (v(g, m), i || e.if((0, ut.not)(m), () => e.break()));
      }
    }
    function v(g, m, b) {
      const T = {
        keyword: "additionalProperties",
        dataProp: g,
        dataPropType: ps.Type.Str
      };
      b === !1 && Object.assign(T, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), t.subschema(T, m);
    }
  }
};
$a.default = W_;
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
const X_ = pt, kl = ce, Ba = V, Ll = $a, Y_ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Ll.default.code(new X_.KeywordCxt(a, Ll.default, "additionalProperties"));
    const o = (0, kl.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Ba.mergeEvaluated.props(e, (0, Ba.toHash)(o), a.props));
    const i = o.filter((h) => !(0, Ba.alwaysValidSchema)(a, r[h]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const h of i)
      d(h) ? l(h) : (e.if((0, kl.propertyInData)(e, s, h, a.opts.ownProperties)), l(h), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(h), t.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      t.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Ai.default = Y_;
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
const Dl = ce, ys = se, Ml = V, Vl = V, Z_ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, Dl.allSchemaProperties)(r), c = i.filter((v) => (0, Ml.alwaysValidSchema)(a, r[v]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = e.name("valid");
    a.props !== !0 && !(a.props instanceof ys.Name) && (a.props = (0, Vl.evaluatedPropsToName)(e, a.props));
    const { props: h } = a;
    _();
    function _() {
      for (const v of i)
        d && $(v), a.allErrors ? w(v) : (e.var(l, !0), w(v), e.if(l));
    }
    function $(v) {
      for (const g in d)
        new RegExp(v).test(g) && (0, Ml.checkStrictMode)(a, `property ${g} matches pattern ${v} (use allowMatchingProperties)`);
    }
    function w(v) {
      e.forIn("key", n, (g) => {
        e.if((0, ys._)`${(0, Dl.usePattern)(t, v)}.test(${g})`, () => {
          const m = c.includes(v);
          m || t.subschema({
            keyword: "patternProperties",
            schemaProp: v,
            dataProp: g,
            dataPropType: Vl.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? e.assign((0, ys._)`${h}[${g}]`, !0) : !m && !a.allErrors && e.if((0, ys.not)(l), () => e.break());
        });
      });
    }
  }
};
ki.default = Z_;
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
const ew = V, tw = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, ew.alwaysValidSchema)(n, r)) {
      t.fail();
      return;
    }
    const s = e.name("valid");
    t.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), t.failResult(s, () => t.reset(), () => t.error());
  },
  error: { message: "must NOT be valid" }
};
Li.default = tw;
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
const rw = ce, nw = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: rw.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Di.default = nw;
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
const Ds = se, sw = V, aw = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, Ds._)`{passingSchemas: ${t.passing}}`
}, ow = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: aw,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, it: s } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = e.let("valid", !1), i = e.let("passing", null), c = e.name("_valid");
    t.setParams({ passing: i }), e.block(d), t.result(o, () => t.reset(), () => t.error(!0));
    function d() {
      a.forEach((l, h) => {
        let _;
        (0, sw.alwaysValidSchema)(s, l) ? e.var(c, !0) : _ = t.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && e.if((0, Ds._)`${c} && ${o}`).assign(o, !1).assign(i, (0, Ds._)`[${i}, ${h}]`).else(), e.if(c, () => {
          e.assign(o, !0), e.assign(i, h), _ && t.mergeEvaluated(_, Ds.Name);
        });
      });
    }
  }
};
Mi.default = ow;
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
const iw = V, cw = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, iw.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
Vi.default = cw;
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
const Js = se, lp = V, lw = {
  message: ({ params: t }) => (0, Js.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, Js._)`{failingKeyword: ${t.ifClause}}`
}, uw = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: lw,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, lp.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Fl(n, "then"), a = Fl(n, "else");
    if (!s && !a)
      return;
    const o = e.let("valid", !0), i = e.name("_valid");
    if (c(), t.reset(), s && a) {
      const l = e.let("ifClause");
      t.setParams({ ifClause: l }), e.if(i, d("then", l), d("else", l));
    } else s ? e.if(i, d("then")) : e.if((0, Js.not)(i), d("else"));
    t.pass(o, () => t.error(!0));
    function c() {
      const l = t.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i);
      t.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const _ = t.subschema({ keyword: l }, i);
        e.assign(o, i), t.mergeValidEvaluated(_, o), h ? e.assign(h, (0, Js._)`${l}`) : t.setParams({ ifClause: l });
      };
    }
  }
};
function Fl(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, lp.alwaysValidSchema)(t, r);
}
Fi.default = uw;
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
const dw = V, fw = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, dw.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
qi.default = fw;
Object.defineProperty(Oi, "__esModule", { value: !0 });
const hw = pn, mw = Ri, pw = yn, yw = Ii, $w = ji, gw = ya, vw = Ci, _w = $a, ww = Ai, bw = ki, Sw = Li, Ew = Di, Nw = Mi, Pw = Vi, Tw = Fi, Ow = qi;
function Rw(t = !1) {
  const e = [
    // any
    Sw.default,
    Ew.default,
    Nw.default,
    Pw.default,
    Tw.default,
    Ow.default,
    // object
    vw.default,
    _w.default,
    gw.default,
    ww.default,
    bw.default
  ];
  return t ? e.push(mw.default, yw.default) : e.push(hw.default, pw.default), e.push($w.default), e;
}
Oi.default = Rw;
var zi = {}, $n = {};
Object.defineProperty($n, "__esModule", { value: !0 });
$n.dynamicAnchor = void 0;
const Ka = se, Iw = nt, ql = xe, jw = Dt, Cw = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (t) => up(t, t.schema)
};
function up(t, e) {
  const { gen: r, it: n } = t;
  n.schemaEnv.root.dynamicAnchors[e] = !0;
  const s = (0, Ka._)`${Iw.default.dynamicAnchors}${(0, Ka.getProperty)(e)}`, a = n.errSchemaPath === "#" ? n.validateName : Aw(t);
  r.if((0, Ka._)`!${s}`, () => r.assign(s, a));
}
$n.dynamicAnchor = up;
function Aw(t) {
  const { schemaEnv: e, schema: r, self: n } = t.it, { root: s, baseId: a, localRefs: o, meta: i } = e.root, { schemaId: c } = n.opts, d = new ql.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: i });
  return ql.compileSchema.call(n, d), (0, jw.getValidate)(t, d);
}
$n.default = Cw;
var gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
gn.dynamicRef = void 0;
const zl = se, kw = nt, Ul = Dt, Lw = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (t) => dp(t, t.schema)
};
function dp(t, e) {
  const { gen: r, keyword: n, it: s } = t;
  if (e[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = e.slice(1);
  if (s.allErrors)
    o();
  else {
    const c = r.let("valid", !1);
    o(c), t.ok(c);
  }
  function o(c) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const d = r.let("_v", (0, zl._)`${kw.default.dynamicAnchors}${(0, zl.getProperty)(a)}`);
      r.if(d, i(d, c), i(s.validateName, c));
    } else
      i(s.validateName, c)();
  }
  function i(c, d) {
    return d ? () => r.block(() => {
      (0, Ul.callRef)(t, c), r.let(d, !0);
    }) : () => (0, Ul.callRef)(t, c);
  }
}
gn.dynamicRef = dp;
gn.default = Lw;
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
const Dw = $n, Mw = V, Vw = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(t) {
    t.schema ? (0, Dw.dynamicAnchor)(t, "") : (0, Mw.checkStrictMode)(t.it, "$recursiveAnchor: false is ignored");
  }
};
Ui.default = Vw;
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
const Fw = gn, qw = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (t) => (0, Fw.dynamicRef)(t, t.schema)
};
Bi.default = qw;
Object.defineProperty(zi, "__esModule", { value: !0 });
const zw = $n, Uw = gn, Bw = Ui, Kw = Bi, Qw = [zw.default, Uw.default, Bw.default, Kw.default];
zi.default = Qw;
var Ki = {}, Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
const Bl = ya, Gw = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Bl.error,
  code: (t) => (0, Bl.validatePropertyDeps)(t)
};
Qi.default = Gw;
var Gi = {};
Object.defineProperty(Gi, "__esModule", { value: !0 });
const xw = ya, Hw = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (t) => (0, xw.validateSchemaDeps)(t)
};
Gi.default = Hw;
var xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
const Jw = V, Ww = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: t, parentSchema: e, it: r }) {
    e.contains === void 0 && (0, Jw.checkStrictMode)(r, `"${t}" without "contains" is ignored`);
  }
};
xi.default = Ww;
Object.defineProperty(Ki, "__esModule", { value: !0 });
const Xw = Qi, Yw = Gi, Zw = xi, eb = [Xw.default, Yw.default, Zw.default];
Ki.default = eb;
var Hi = {}, Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
const Qt = se, Kl = V, tb = nt, rb = {
  message: "must NOT have unevaluated properties",
  params: ({ params: t }) => (0, Qt._)`{unevaluatedProperty: ${t.unevaluatedProperty}}`
}, nb = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: rb,
  code(t) {
    const { gen: e, schema: r, data: n, errsCount: s, it: a } = t;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: i } = a;
    i instanceof Qt.Name ? e.if((0, Qt._)`${i} !== true`, () => e.forIn("key", n, (h) => e.if(d(i, h), () => c(h)))) : i !== !0 && e.forIn("key", n, (h) => i === void 0 ? c(h) : e.if(l(i, h), () => c(h))), a.props = !0, t.ok((0, Qt._)`${s} === ${tb.default.errors}`);
    function c(h) {
      if (r === !1) {
        t.setParams({ unevaluatedProperty: h }), t.error(), o || e.break();
        return;
      }
      if (!(0, Kl.alwaysValidSchema)(a, r)) {
        const _ = e.name("valid");
        t.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Kl.Type.Str
        }, _), o || e.if((0, Qt.not)(_), () => e.break());
      }
    }
    function d(h, _) {
      return (0, Qt._)`!${h} || !${h}[${_}]`;
    }
    function l(h, _) {
      const $ = [];
      for (const w in h)
        h[w] === !0 && $.push((0, Qt._)`${_} !== ${w}`);
      return (0, Qt.and)(...$);
    }
  }
};
Ji.default = nb;
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
const wr = se, Ql = V, sb = {
  message: ({ params: { len: t } }) => (0, wr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, wr._)`{limit: ${t}}`
}, ab = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: sb,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t, a = s.items || 0;
    if (a === !0)
      return;
    const o = e.const("len", (0, wr._)`${n}.length`);
    if (r === !1)
      t.setParams({ len: a }), t.fail((0, wr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, Ql.alwaysValidSchema)(s, r)) {
      const c = e.var("valid", (0, wr._)`${o} <= ${a}`);
      e.if((0, wr.not)(c), () => i(c, a)), t.ok(c);
    }
    s.items = !0;
    function i(c, d) {
      e.forRange("i", d, o, (l) => {
        t.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: Ql.Type.Num }, c), s.allErrors || e.if((0, wr.not)(c), () => e.break());
      });
    }
  }
};
Wi.default = ab;
Object.defineProperty(Hi, "__esModule", { value: !0 });
const ob = Ji, ib = Wi, cb = [ob.default, ib.default];
Hi.default = cb;
var Xi = {}, Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
const be = se, lb = {
  message: ({ schemaCode: t }) => (0, be.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, be._)`{format: ${t}}`
}, ub = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: lb,
  code(t, e) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = i;
    if (!c.validateFormats)
      return;
    s ? _() : $();
    function _() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), v = r.const("fDef", (0, be._)`${w}[${o}]`), g = r.let("fType"), m = r.let("format");
      r.if((0, be._)`typeof ${v} == "object" && !(${v} instanceof RegExp)`, () => r.assign(g, (0, be._)`${v}.type || "string"`).assign(m, (0, be._)`${v}.validate`), () => r.assign(g, (0, be._)`"string"`).assign(m, v)), t.fail$data((0, be.or)(b(), T()));
      function b() {
        return c.strictSchema === !1 ? be.nil : (0, be._)`${o} && !${m}`;
      }
      function T() {
        const O = l.$async ? (0, be._)`(${v}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, be._)`${m}(${n})`, I = (0, be._)`(typeof ${m} == "function" ? ${O} : ${m}.test(${n}))`;
        return (0, be._)`${m} && ${m} !== true && ${g} === ${e} && !${I}`;
      }
    }
    function $() {
      const w = h.formats[a];
      if (!w) {
        b();
        return;
      }
      if (w === !0)
        return;
      const [v, g, m] = T(w);
      v === e && t.pass(O());
      function b() {
        if (c.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function T(I) {
        const q = I instanceof RegExp ? (0, be.regexpCode)(I) : c.code.formats ? (0, be._)`${c.code.formats}${(0, be.getProperty)(a)}` : void 0, D = r.scopeValue("formats", { key: a, ref: I, code: q });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, be._)`${D}.validate`] : ["string", I, D];
      }
      function O() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, be._)`await ${m}(${n})`;
        }
        return typeof g == "function" ? (0, be._)`${m}(${n})` : (0, be._)`${m}.test(${n})`;
      }
    }
  }
};
Yi.default = ub;
Object.defineProperty(Xi, "__esModule", { value: !0 });
const db = Yi, fb = [db.default];
Xi.default = fb;
var ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.contentVocabulary = ln.metadataVocabulary = void 0;
ln.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
ln.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(hi, "__esModule", { value: !0 });
const hb = mi, mb = yi, pb = Oi, yb = zi, $b = Ki, gb = Hi, vb = Xi, Gl = ln, _b = [
  yb.default,
  hb.default,
  mb.default,
  (0, pb.default)(!0),
  vb.default,
  Gl.metadataVocabulary,
  Gl.contentVocabulary,
  $b.default,
  gb.default
];
hi.default = _b;
var Zi = {}, ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
ga.DiscrError = void 0;
var xl;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(xl || (ga.DiscrError = xl = {}));
Object.defineProperty(Zi, "__esModule", { value: !0 });
const Gr = se, po = ga, Hl = xe, wb = mn, bb = V, Sb = {
  message: ({ params: { discrError: t, tagName: e } }) => t === po.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, Gr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, Eb = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Sb,
  code(t) {
    const { gen: e, data: r, schema: n, parentSchema: s, it: a } = t, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const i = n.propertyName;
    if (typeof i != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = e.let("valid", !1), d = e.const("tag", (0, Gr._)`${r}${(0, Gr.getProperty)(i)}`);
    e.if((0, Gr._)`typeof ${d} == "string"`, () => l(), () => t.error(!1, { discrError: po.DiscrError.Tag, tag: d, tagName: i })), t.ok(c);
    function l() {
      const $ = _();
      e.if(!1);
      for (const w in $)
        e.elseIf((0, Gr._)`${d} === ${w}`), e.assign(c, h($[w]));
      e.else(), t.error(!1, { discrError: po.DiscrError.Mapping, tag: d, tagName: i }), e.endIf();
    }
    function h($) {
      const w = e.name("valid"), v = t.subschema({ keyword: "oneOf", schemaProp: $ }, w);
      return t.mergeEvaluated(v, Gr.Name), w;
    }
    function _() {
      var $;
      const w = {}, v = m(s);
      let g = !0;
      for (let O = 0; O < o.length; O++) {
        let I = o[O];
        if (I != null && I.$ref && !(0, bb.schemaHasRulesButRef)(I, a.self.RULES)) {
          const D = I.$ref;
          if (I = Hl.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, D), I instanceof Hl.SchemaEnv && (I = I.schema), I === void 0)
            throw new wb.default(a.opts.uriResolver, a.baseId, D);
        }
        const q = ($ = I == null ? void 0 : I.properties) === null || $ === void 0 ? void 0 : $[i];
        if (typeof q != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`);
        g = g && (v || m(I)), b(q, O);
      }
      if (!g)
        throw new Error(`discriminator: "${i}" must be required`);
      return w;
      function m({ required: O }) {
        return Array.isArray(O) && O.includes(i);
      }
      function b(O, I) {
        if (O.const)
          T(O.const, I);
        else if (O.enum)
          for (const q of O.enum)
            T(q, I);
        else
          throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
      }
      function T(O, I) {
        if (typeof O != "string" || O in w)
          throw new Error(`discriminator: "${i}" values must be unique strings`);
        w[O] = I;
      }
    }
  }
};
Zi.default = Eb;
var ec = {};
const Nb = "https://json-schema.org/draft/2020-12/schema", Pb = "https://json-schema.org/draft/2020-12/schema", Tb = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Ob = "meta", Rb = "Core and Validation specifications meta-schema", Ib = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], jb = [
  "object",
  "boolean"
], Cb = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Ab = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, kb = {
  $schema: Nb,
  $id: Pb,
  $vocabulary: Tb,
  $dynamicAnchor: Ob,
  title: Rb,
  allOf: Ib,
  type: jb,
  $comment: Cb,
  properties: Ab
}, Lb = "https://json-schema.org/draft/2020-12/schema", Db = "https://json-schema.org/draft/2020-12/meta/applicator", Mb = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, Vb = "meta", Fb = "Applicator vocabulary meta-schema", qb = [
  "object",
  "boolean"
], zb = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, Ub = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, Bb = {
  $schema: Lb,
  $id: Db,
  $vocabulary: Mb,
  $dynamicAnchor: Vb,
  title: Fb,
  type: qb,
  properties: zb,
  $defs: Ub
}, Kb = "https://json-schema.org/draft/2020-12/schema", Qb = "https://json-schema.org/draft/2020-12/meta/unevaluated", Gb = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, xb = "meta", Hb = "Unevaluated applicator vocabulary meta-schema", Jb = [
  "object",
  "boolean"
], Wb = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Xb = {
  $schema: Kb,
  $id: Qb,
  $vocabulary: Gb,
  $dynamicAnchor: xb,
  title: Hb,
  type: Jb,
  properties: Wb
}, Yb = "https://json-schema.org/draft/2020-12/schema", Zb = "https://json-schema.org/draft/2020-12/meta/content", eS = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, tS = "meta", rS = "Content vocabulary meta-schema", nS = [
  "object",
  "boolean"
], sS = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, aS = {
  $schema: Yb,
  $id: Zb,
  $vocabulary: eS,
  $dynamicAnchor: tS,
  title: rS,
  type: nS,
  properties: sS
}, oS = "https://json-schema.org/draft/2020-12/schema", iS = "https://json-schema.org/draft/2020-12/meta/core", cS = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, lS = "meta", uS = "Core vocabulary meta-schema", dS = [
  "object",
  "boolean"
], fS = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, hS = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, mS = {
  $schema: oS,
  $id: iS,
  $vocabulary: cS,
  $dynamicAnchor: lS,
  title: uS,
  type: dS,
  properties: fS,
  $defs: hS
}, pS = "https://json-schema.org/draft/2020-12/schema", yS = "https://json-schema.org/draft/2020-12/meta/format-annotation", $S = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, gS = "meta", vS = "Format vocabulary meta-schema for annotation results", _S = [
  "object",
  "boolean"
], wS = {
  format: {
    type: "string"
  }
}, bS = {
  $schema: pS,
  $id: yS,
  $vocabulary: $S,
  $dynamicAnchor: gS,
  title: vS,
  type: _S,
  properties: wS
}, SS = "https://json-schema.org/draft/2020-12/schema", ES = "https://json-schema.org/draft/2020-12/meta/meta-data", NS = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, PS = "meta", TS = "Meta-data vocabulary meta-schema", OS = [
  "object",
  "boolean"
], RS = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, IS = {
  $schema: SS,
  $id: ES,
  $vocabulary: NS,
  $dynamicAnchor: PS,
  title: TS,
  type: OS,
  properties: RS
}, jS = "https://json-schema.org/draft/2020-12/schema", CS = "https://json-schema.org/draft/2020-12/meta/validation", AS = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, kS = "meta", LS = "Validation vocabulary meta-schema", DS = [
  "object",
  "boolean"
], MS = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, VS = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, FS = {
  $schema: jS,
  $id: CS,
  $vocabulary: AS,
  $dynamicAnchor: kS,
  title: LS,
  type: DS,
  properties: MS,
  $defs: VS
};
Object.defineProperty(ec, "__esModule", { value: !0 });
const qS = kb, zS = Bb, US = Xb, BS = aS, KS = mS, QS = bS, GS = IS, xS = FS, HS = ["/properties"];
function JS(t) {
  return [
    qS,
    zS,
    US,
    BS,
    KS,
    e(this, QS),
    GS,
    e(this, xS)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function e(r, n) {
    return t ? r.$dataMetaSchema(n, HS) : n;
  }
}
ec.default = JS;
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv2020 = void 0;
  const r = lm, n = hi, s = Zi, a = ec, o = "https://json-schema.org/draft/2020-12/schema";
  class i extends r.default {
    constructor($ = {}) {
      super({
        ...$,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach(($) => this.addVocabulary($)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: $, meta: w } = this.opts;
      w && (a.default.call(this, $), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  e.Ajv2020 = i, t.exports = e = i, t.exports.Ajv2020 = i, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = i;
  var c = pt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = se;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return d._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return d.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return d.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return d.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return d.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return d.CodeGen;
  } });
  var l = rs;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var h = mn;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(io, io.exports);
var WS = io.exports, yo = { exports: {} }, fp = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.formatNames = t.fastFormats = t.fullFormats = void 0;
  function e(Q, x) {
    return { validate: Q, compare: x };
  }
  t.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: e(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: e(c(!0), d),
    "date-time": e(_(!0), $),
    "iso-time": e(c(), l),
    "iso-date-time": e(_(), w),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: ge,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: T,
    // signed 32 bit integer
    int32: { type: "number", validate: q },
    // signed 64 bit integer
    int64: { type: "number", validate: D },
    // C-type float
    float: { type: "number", validate: Y },
    // C-type double
    double: { type: "number", validate: Y },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, t.fastFormats = {
    ...t.fullFormats,
    date: e(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: e(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": e(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, $),
    "iso-time": e(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": e(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, w),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, t.formatNames = Object.keys(t.fullFormats);
  function r(Q) {
    return Q % 4 === 0 && (Q % 100 !== 0 || Q % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(Q) {
    const x = n.exec(Q);
    if (!x)
      return !1;
    const ne = +x[1], G = +x[2], he = +x[3];
    return G >= 1 && G <= 12 && he >= 1 && he <= (G === 2 && r(ne) ? 29 : s[G]);
  }
  function o(Q, x) {
    if (Q && x)
      return Q > x ? 1 : Q < x ? -1 : 0;
  }
  const i = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(Q) {
    return function(ne) {
      const G = i.exec(ne);
      if (!G)
        return !1;
      const he = +G[1], Te = +G[2], M = +G[3], L = G[4], B = G[5] === "-" ? -1 : 1, P = +(G[6] || 0), p = +(G[7] || 0);
      if (P > 23 || p > 59 || Q && !L)
        return !1;
      if (he <= 23 && Te <= 59 && M < 60)
        return !0;
      const E = Te - p * B, y = he - P * B - (E < 0 ? 1 : 0);
      return (y === 23 || y === -1) && (E === 59 || E === -1) && M < 61;
    };
  }
  function d(Q, x) {
    if (!(Q && x))
      return;
    const ne = (/* @__PURE__ */ new Date("2020-01-01T" + Q)).valueOf(), G = (/* @__PURE__ */ new Date("2020-01-01T" + x)).valueOf();
    if (ne && G)
      return ne - G;
  }
  function l(Q, x) {
    if (!(Q && x))
      return;
    const ne = i.exec(Q), G = i.exec(x);
    if (ne && G)
      return Q = ne[1] + ne[2] + ne[3], x = G[1] + G[2] + G[3], Q > x ? 1 : Q < x ? -1 : 0;
  }
  const h = /t|\s/i;
  function _(Q) {
    const x = c(Q);
    return function(G) {
      const he = G.split(h);
      return he.length === 2 && a(he[0]) && x(he[1]);
    };
  }
  function $(Q, x) {
    if (!(Q && x))
      return;
    const ne = new Date(Q).valueOf(), G = new Date(x).valueOf();
    if (ne && G)
      return ne - G;
  }
  function w(Q, x) {
    if (!(Q && x))
      return;
    const [ne, G] = Q.split(h), [he, Te] = x.split(h), M = o(ne, he);
    if (M !== void 0)
      return M || d(G, Te);
  }
  const v = /\/|:/, g = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(Q) {
    return v.test(Q) && g.test(Q);
  }
  const b = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function T(Q) {
    return b.lastIndex = 0, b.test(Q);
  }
  const O = -2147483648, I = 2 ** 31 - 1;
  function q(Q) {
    return Number.isInteger(Q) && Q <= I && Q >= O;
  }
  function D(Q) {
    return Number.isInteger(Q);
  }
  function Y() {
    return !0;
  }
  const de = /[^\\]\\Z/;
  function ge(Q) {
    if (de.test(Q))
      return !1;
    try {
      return new RegExp(Q), !0;
    } catch {
      return !1;
    }
  }
})(fp);
var hp = {}, $o = { exports: {} }, mp = {}, yt = {}, un = {}, ss = {}, ie = {}, Jn = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.regexpCode = t.getEsmExportName = t.getProperty = t.safeStringify = t.stringify = t.strConcat = t.addCodeArg = t.str = t._ = t.nil = t._Code = t.Name = t.IDENTIFIER = t._CodeOrName = void 0;
  class e {
  }
  t._CodeOrName = e, t.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends e {
    constructor(b) {
      if (super(), !t.IDENTIFIER.test(b))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = b;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  t.Name = r;
  class n extends e {
    constructor(b) {
      super(), this._items = typeof b == "string" ? [b] : b;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const b = this._items[0];
      return b === "" || b === '""';
    }
    get str() {
      var b;
      return (b = this._str) !== null && b !== void 0 ? b : this._str = this._items.reduce((T, O) => `${T}${O}`, "");
    }
    get names() {
      var b;
      return (b = this._names) !== null && b !== void 0 ? b : this._names = this._items.reduce((T, O) => (O instanceof r && (T[O.str] = (T[O.str] || 0) + 1), T), {});
    }
  }
  t._Code = n, t.nil = new n("");
  function s(m, ...b) {
    const T = [m[0]];
    let O = 0;
    for (; O < b.length; )
      i(T, b[O]), T.push(m[++O]);
    return new n(T);
  }
  t._ = s;
  const a = new n("+");
  function o(m, ...b) {
    const T = [$(m[0])];
    let O = 0;
    for (; O < b.length; )
      T.push(a), i(T, b[O]), T.push(a, $(m[++O]));
    return c(T), new n(T);
  }
  t.str = o;
  function i(m, b) {
    b instanceof n ? m.push(...b._items) : b instanceof r ? m.push(b) : m.push(h(b));
  }
  t.addCodeArg = i;
  function c(m) {
    let b = 1;
    for (; b < m.length - 1; ) {
      if (m[b] === a) {
        const T = d(m[b - 1], m[b + 1]);
        if (T !== void 0) {
          m.splice(b - 1, 3, T);
          continue;
        }
        m[b++] = "+";
      }
      b++;
    }
  }
  function d(m, b) {
    if (b === '""')
      return m;
    if (m === '""')
      return b;
    if (typeof m == "string")
      return b instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof b != "string" ? `${m.slice(0, -1)}${b}"` : b[0] === '"' ? m.slice(0, -1) + b.slice(1) : void 0;
    if (typeof b == "string" && b[0] === '"' && !(m instanceof r))
      return `"${m}${b.slice(1)}`;
  }
  function l(m, b) {
    return b.emptyStr() ? m : m.emptyStr() ? b : o`${m}${b}`;
  }
  t.strConcat = l;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : $(Array.isArray(m) ? m.join(",") : m);
  }
  function _(m) {
    return new n($(m));
  }
  t.stringify = _;
  function $(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  t.safeStringify = $;
  function w(m) {
    return typeof m == "string" && t.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  t.getProperty = w;
  function v(m) {
    if (typeof m == "string" && t.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  t.getEsmExportName = v;
  function g(m) {
    return new n(m.toString());
  }
  t.regexpCode = g;
})(Jn);
var go = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.ValueScope = t.ValueScopeName = t.Scope = t.varKinds = t.UsedValueState = void 0;
  const e = Jn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (t.UsedValueState = n = {})), t.varKinds = {
    const: new e.Name("const"),
    let: new e.Name("let"),
    var: new e.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: l } = {}) {
      this._names = {}, this._prefixes = d, this._parent = l;
    }
    toName(d) {
      return d instanceof e.Name ? d : this.name(d);
    }
    name(d) {
      return new e.Name(this._newName(d));
    }
    _newName(d) {
      const l = this._names[d] || this._nameGroup(d);
      return `${d}${l.index++}`;
    }
    _nameGroup(d) {
      var l, h;
      if (!((h = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  t.Scope = s;
  class a extends e.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: h }) {
      this.value = d, this.scopePath = (0, e._)`.${new e.Name(l)}[${h}]`;
    }
  }
  t.ValueScopeName = a;
  const o = (0, e._)`\n`;
  class i extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : e.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, l) {
      var h;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const _ = this.toName(d), { prefix: $ } = _, w = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let v = this._values[$];
      if (v) {
        const b = v.get(w);
        if (b)
          return b;
      } else
        v = this._values[$] = /* @__PURE__ */ new Map();
      v.set(w, _);
      const g = this._scope[$] || (this._scope[$] = []), m = g.length;
      return g[m] = l.ref, _.setValue(l, { property: $, itemIndex: m }), _;
    }
    getValue(d, l) {
      const h = this._values[d];
      if (h)
        return h.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, e._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, h) {
      return this._reduceValues(d, (_) => {
        if (_.value === void 0)
          throw new Error(`CodeGen: name "${_}" has no value`);
        return _.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, _) {
      let $ = e.nil;
      for (const w in d) {
        const v = d[w];
        if (!v)
          continue;
        const g = h[w] = h[w] || /* @__PURE__ */ new Map();
        v.forEach((m) => {
          if (g.has(m))
            return;
          g.set(m, n.Started);
          let b = l(m);
          if (b) {
            const T = this.opts.es5 ? t.varKinds.var : t.varKinds.const;
            $ = (0, e._)`${$}${T} ${m} = ${b};${this.opts._n}`;
          } else if (b = _ == null ? void 0 : _(m))
            $ = (0, e._)`${$}${b}${this.opts._n}`;
          else
            throw new r(m);
          g.set(m, n.Completed);
        });
      }
      return $;
    }
  }
  t.ValueScope = i;
})(go);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.or = t.and = t.not = t.CodeGen = t.operators = t.varKinds = t.ValueScopeName = t.ValueScope = t.Scope = t.Name = t.regexpCode = t.stringify = t.getProperty = t.nil = t.strConcat = t.str = t._ = void 0;
  const e = Jn, r = go;
  var n = Jn;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(t, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(t, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(t, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = go;
  Object.defineProperty(t, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(t, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(t, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(t, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), t.operators = {
    GT: new e._Code(">"),
    GTE: new e._Code(">="),
    LT: new e._Code("<"),
    LTE: new e._Code("<="),
    EQ: new e._Code("==="),
    NEQ: new e._Code("!=="),
    NOT: new e._Code("!"),
    OR: new e._Code("||"),
    AND: new e._Code("&&"),
    ADD: new e._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(u, f) {
      return this;
    }
  }
  class o extends a {
    constructor(u, f, S) {
      super(), this.varKind = u, this.name = f, this.rhs = S;
    }
    render({ es5: u, _n: f }) {
      const S = u ? r.varKinds.var : this.varKind, C = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${C};` + f;
    }
    optimizeNames(u, f) {
      if (u[this.name.str])
        return this.rhs && (this.rhs = G(this.rhs, u, f)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class i extends a {
    constructor(u, f, S) {
      super(), this.lhs = u, this.rhs = f, this.sideEffects = S;
    }
    render({ _n: u }) {
      return `${this.lhs} = ${this.rhs};` + u;
    }
    optimizeNames(u, f) {
      if (!(this.lhs instanceof e.Name && !u[this.lhs.str] && !this.sideEffects))
        return this.rhs = G(this.rhs, u, f), this;
    }
    get names() {
      const u = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return ne(u, this.rhs);
    }
  }
  class c extends i {
    constructor(u, f, S, C) {
      super(u, S, C), this.op = f;
    }
    render({ _n: u }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + u;
    }
  }
  class d extends a {
    constructor(u) {
      super(), this.label = u, this.names = {};
    }
    render({ _n: u }) {
      return `${this.label}:` + u;
    }
  }
  class l extends a {
    constructor(u) {
      super(), this.label = u, this.names = {};
    }
    render({ _n: u }) {
      return `break${this.label ? ` ${this.label}` : ""};` + u;
    }
  }
  class h extends a {
    constructor(u) {
      super(), this.error = u;
    }
    render({ _n: u }) {
      return `throw ${this.error};` + u;
    }
    get names() {
      return this.error.names;
    }
  }
  class _ extends a {
    constructor(u) {
      super(), this.code = u;
    }
    render({ _n: u }) {
      return `${this.code};` + u;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(u, f) {
      return this.code = G(this.code, u, f), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class $ extends a {
    constructor(u = []) {
      super(), this.nodes = u;
    }
    render(u) {
      return this.nodes.reduce((f, S) => f + S.render(u), "");
    }
    optimizeNodes() {
      const { nodes: u } = this;
      let f = u.length;
      for (; f--; ) {
        const S = u[f].optimizeNodes();
        Array.isArray(S) ? u.splice(f, 1, ...S) : S ? u[f] = S : u.splice(f, 1);
      }
      return u.length > 0 ? this : void 0;
    }
    optimizeNames(u, f) {
      const { nodes: S } = this;
      let C = S.length;
      for (; C--; ) {
        const j = S[C];
        j.optimizeNames(u, f) || (he(u, j.names), S.splice(C, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((u, f) => x(u, f.names), {});
    }
  }
  class w extends $ {
    render(u) {
      return "{" + u._n + super.render(u) + "}" + u._n;
    }
  }
  class v extends $ {
  }
  class g extends w {
  }
  g.kind = "else";
  class m extends w {
    constructor(u, f) {
      super(f), this.condition = u;
    }
    render(u) {
      let f = `if(${this.condition})` + super.render(u);
      return this.else && (f += "else " + this.else.render(u)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const u = this.condition;
      if (u === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const S = f.optimizeNodes();
        f = this.else = Array.isArray(S) ? new g(S) : S;
      }
      if (f)
        return u === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(Te(u), f instanceof m ? [f] : f.nodes);
      if (!(u === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(u, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(u, f), !!(super.optimizeNames(u, f) || this.else))
        return this.condition = G(this.condition, u, f), this;
    }
    get names() {
      const u = super.names;
      return ne(u, this.condition), this.else && x(u, this.else.names), u;
    }
  }
  m.kind = "if";
  class b extends w {
  }
  b.kind = "for";
  class T extends b {
    constructor(u) {
      super(), this.iteration = u;
    }
    render(u) {
      return `for(${this.iteration})` + super.render(u);
    }
    optimizeNames(u, f) {
      if (super.optimizeNames(u, f))
        return this.iteration = G(this.iteration, u, f), this;
    }
    get names() {
      return x(super.names, this.iteration.names);
    }
  }
  class O extends b {
    constructor(u, f, S, C) {
      super(), this.varKind = u, this.name = f, this.from = S, this.to = C;
    }
    render(u) {
      const f = u.es5 ? r.varKinds.var : this.varKind, { name: S, from: C, to: j } = this;
      return `for(${f} ${S}=${C}; ${S}<${j}; ${S}++)` + super.render(u);
    }
    get names() {
      const u = ne(super.names, this.from);
      return ne(u, this.to);
    }
  }
  class I extends b {
    constructor(u, f, S, C) {
      super(), this.loop = u, this.varKind = f, this.name = S, this.iterable = C;
    }
    render(u) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(u);
    }
    optimizeNames(u, f) {
      if (super.optimizeNames(u, f))
        return this.iterable = G(this.iterable, u, f), this;
    }
    get names() {
      return x(super.names, this.iterable.names);
    }
  }
  class q extends w {
    constructor(u, f, S) {
      super(), this.name = u, this.args = f, this.async = S;
    }
    render(u) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(u);
    }
  }
  q.kind = "func";
  class D extends $ {
    render(u) {
      return "return " + super.render(u);
    }
  }
  D.kind = "return";
  class Y extends w {
    render(u) {
      let f = "try" + super.render(u);
      return this.catch && (f += this.catch.render(u)), this.finally && (f += this.finally.render(u)), f;
    }
    optimizeNodes() {
      var u, f;
      return super.optimizeNodes(), (u = this.catch) === null || u === void 0 || u.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(u, f) {
      var S, C;
      return super.optimizeNames(u, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(u, f), (C = this.finally) === null || C === void 0 || C.optimizeNames(u, f), this;
    }
    get names() {
      const u = super.names;
      return this.catch && x(u, this.catch.names), this.finally && x(u, this.finally.names), u;
    }
  }
  class de extends w {
    constructor(u) {
      super(), this.error = u;
    }
    render(u) {
      return `catch(${this.error})` + super.render(u);
    }
  }
  de.kind = "catch";
  class ge extends w {
    render(u) {
      return "finally" + super.render(u);
    }
  }
  ge.kind = "finally";
  class Q {
    constructor(u, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = u, this._scope = new r.Scope({ parent: u }), this._nodes = [new v()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(u) {
      return this._scope.name(u);
    }
    // reserves unique name in the external scope
    scopeName(u) {
      return this._extScope.name(u);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(u, f) {
      const S = this._extScope.value(u, f);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(u, f) {
      return this._extScope.getValue(u, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(u) {
      return this._extScope.scopeRefs(u, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(u, f, S, C) {
      const j = this._scope.toName(f);
      return S !== void 0 && C && (this._constants[j.str] = S), this._leafNode(new o(u, j, S)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(u, f, S) {
      return this._def(r.varKinds.const, u, f, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(u, f, S) {
      return this._def(r.varKinds.let, u, f, S);
    }
    // `var` declaration with optional assignment
    var(u, f, S) {
      return this._def(r.varKinds.var, u, f, S);
    }
    // assignment code
    assign(u, f, S) {
      return this._leafNode(new i(u, f, S));
    }
    // `+=` code
    add(u, f) {
      return this._leafNode(new c(u, t.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(u) {
      return typeof u == "function" ? u() : u !== e.nil && this._leafNode(new _(u)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...u) {
      const f = ["{"];
      for (const [S, C] of u)
        f.length > 1 && f.push(","), f.push(S), (S !== C || this.opts.es5) && (f.push(":"), (0, e.addCodeArg)(f, C));
      return f.push("}"), new e._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(u, f, S) {
      if (this._blockNode(new m(u)), f && S)
        this.code(f).else().code(S).endIf();
      else if (f)
        this.code(f).endIf();
      else if (S)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(u) {
      return this._elseNode(new m(u));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new g());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, g);
    }
    _for(u, f) {
      return this._blockNode(u), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(u, f) {
      return this._for(new T(u), f);
    }
    // `for` statement for a range of values
    forRange(u, f, S, C, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const U = this._scope.toName(u);
      return this._for(new O(j, U, f, S), () => C(U));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(u, f, S, C = r.varKinds.const) {
      const j = this._scope.toName(u);
      if (this.opts.es5) {
        const U = f instanceof e.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, e._)`${U}.length`, (K) => {
          this.var(j, (0, e._)`${U}[${K}]`), S(j);
        });
      }
      return this._for(new I("of", C, j, f), () => S(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(u, f, S, C = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(u, (0, e._)`Object.keys(${f})`, S);
      const j = this._scope.toName(u);
      return this._for(new I("in", C, j, f), () => S(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(b);
    }
    // `label` statement
    label(u) {
      return this._leafNode(new d(u));
    }
    // `break` statement
    break(u) {
      return this._leafNode(new l(u));
    }
    // `return` statement
    return(u) {
      const f = new D();
      if (this._blockNode(f), this.code(u), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(D);
    }
    // `try` statement
    try(u, f, S) {
      if (!f && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const C = new Y();
      if (this._blockNode(C), this.code(u), f) {
        const j = this.name("e");
        this._currNode = C.catch = new de(j), f(j);
      }
      return S && (this._currNode = C.finally = new ge(), this.code(S)), this._endBlockNode(de, ge);
    }
    // `throw` statement
    throw(u) {
      return this._leafNode(new h(u));
    }
    // start self-balancing block
    block(u, f) {
      return this._blockStarts.push(this._nodes.length), u && this.code(u).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(u) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - f;
      if (S < 0 || u !== void 0 && S !== u)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${u} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(u, f = e.nil, S, C) {
      return this._blockNode(new q(u, f, S)), C && this.code(C).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(q);
    }
    optimize(u = 1) {
      for (; u-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(u) {
      return this._currNode.nodes.push(u), this;
    }
    _blockNode(u) {
      this._currNode.nodes.push(u), this._nodes.push(u);
    }
    _endBlockNode(u, f) {
      const S = this._currNode;
      if (S instanceof u || f && S instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${u.kind}/${f.kind}` : u.kind}"`);
    }
    _elseNode(u) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = u, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const u = this._nodes;
      return u[u.length - 1];
    }
    set _currNode(u) {
      const f = this._nodes;
      f[f.length - 1] = u;
    }
  }
  t.CodeGen = Q;
  function x(y, u) {
    for (const f in u)
      y[f] = (y[f] || 0) + (u[f] || 0);
    return y;
  }
  function ne(y, u) {
    return u instanceof e._CodeOrName ? x(y, u.names) : y;
  }
  function G(y, u, f) {
    if (y instanceof e.Name)
      return S(y);
    if (!C(y))
      return y;
    return new e._Code(y._items.reduce((j, U) => (U instanceof e.Name && (U = S(U)), U instanceof e._Code ? j.push(...U._items) : j.push(U), j), []));
    function S(j) {
      const U = f[j.str];
      return U === void 0 || u[j.str] !== 1 ? j : (delete u[j.str], U);
    }
    function C(j) {
      return j instanceof e._Code && j._items.some((U) => U instanceof e.Name && u[U.str] === 1 && f[U.str] !== void 0);
    }
  }
  function he(y, u) {
    for (const f in u)
      y[f] = (y[f] || 0) - (u[f] || 0);
  }
  function Te(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, e._)`!${E(y)}`;
  }
  t.not = Te;
  const M = p(t.operators.AND);
  function L(...y) {
    return y.reduce(M);
  }
  t.and = L;
  const B = p(t.operators.OR);
  function P(...y) {
    return y.reduce(B);
  }
  t.or = P;
  function p(y) {
    return (u, f) => u === e.nil ? f : f === e.nil ? u : (0, e._)`${E(u)} ${y} ${E(f)}`;
  }
  function E(y) {
    return y instanceof e.Name ? y : (0, e._)`(${y})`;
  }
})(ie);
var z = {};
Object.defineProperty(z, "__esModule", { value: !0 });
z.checkStrictMode = z.getErrorPath = z.Type = z.useFunc = z.setEvaluated = z.evaluatedPropsToName = z.mergeEvaluated = z.eachItem = z.unescapeJsonPointer = z.escapeJsonPointer = z.escapeFragment = z.unescapeFragment = z.schemaRefOrVal = z.schemaHasRulesButRef = z.schemaHasRules = z.checkUnknownRules = z.alwaysValidSchema = z.toHash = void 0;
const pe = ie, XS = Jn;
function YS(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
z.toHash = YS;
function ZS(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (pp(t, e), !yp(e, t.self.RULES.all));
}
z.alwaysValidSchema = ZS;
function pp(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || vp(t, `unknown keyword: "${a}"`);
}
z.checkUnknownRules = pp;
function yp(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
z.schemaHasRules = yp;
function eE(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
z.schemaHasRulesButRef = eE;
function tE({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, pe._)`${r}`;
  }
  return (0, pe._)`${t}${e}${(0, pe.getProperty)(n)}`;
}
z.schemaRefOrVal = tE;
function rE(t) {
  return $p(decodeURIComponent(t));
}
z.unescapeFragment = rE;
function nE(t) {
  return encodeURIComponent(tc(t));
}
z.escapeFragment = nE;
function tc(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
z.escapeJsonPointer = tc;
function $p(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
z.unescapeJsonPointer = $p;
function sE(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
z.eachItem = sE;
function Jl({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof pe.Name ? (a instanceof pe.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof pe.Name ? (e(s, o, a), a) : r(a, o);
    return i === pe.Name && !(c instanceof pe.Name) ? n(s, c) : c;
  };
}
z.mergeEvaluated = {
  props: Jl({
    mergeNames: (t, e, r) => t.if((0, pe._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, pe._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, pe._)`${r} || {}`).code((0, pe._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, pe._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, pe._)`${r} || {}`), rc(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: gp
  }),
  items: Jl({
    mergeNames: (t, e, r) => t.if((0, pe._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, pe._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, pe._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, pe._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function gp(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, pe._)`{}`);
  return e !== void 0 && rc(t, r, e), r;
}
z.evaluatedPropsToName = gp;
function rc(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, pe._)`${e}${(0, pe.getProperty)(n)}`, !0));
}
z.setEvaluated = rc;
const Wl = {};
function aE(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: Wl[e.code] || (Wl[e.code] = new XS._Code(e.code))
  });
}
z.useFunc = aE;
var vo;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(vo || (z.Type = vo = {}));
function oE(t, e, r) {
  if (t instanceof pe.Name) {
    const n = e === vo.Num;
    return r ? n ? (0, pe._)`"[" + ${t} + "]"` : (0, pe._)`"['" + ${t} + "']"` : n ? (0, pe._)`"/" + ${t}` : (0, pe._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, pe.getProperty)(t).toString() : "/" + tc(t);
}
z.getErrorPath = oE;
function vp(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
z.checkStrictMode = vp;
var Et = {};
Object.defineProperty(Et, "__esModule", { value: !0 });
const Me = ie, iE = {
  // validation function arguments
  data: new Me.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Me.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Me.Name("instancePath"),
  parentData: new Me.Name("parentData"),
  parentDataProperty: new Me.Name("parentDataProperty"),
  rootData: new Me.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Me.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Me.Name("vErrors"),
  // null or array of validation errors
  errors: new Me.Name("errors"),
  // counter of validation errors
  this: new Me.Name("this"),
  // "globals"
  self: new Me.Name("self"),
  scope: new Me.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Me.Name("json"),
  jsonPos: new Me.Name("jsonPos"),
  jsonLen: new Me.Name("jsonLen"),
  jsonPart: new Me.Name("jsonPart")
};
Et.default = iE;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
  const e = ie, r = z, n = Et;
  t.keywordError = {
    message: ({ keyword: g }) => (0, e.str)`must pass "${g}" keyword validation`
  }, t.keyword$DataError = {
    message: ({ keyword: g, schemaType: m }) => m ? (0, e.str)`"${g}" keyword must be ${m} ($data)` : (0, e.str)`"${g}" keyword is invalid ($data)`
  };
  function s(g, m = t.keywordError, b, T) {
    const { it: O } = g, { gen: I, compositeRule: q, allErrors: D } = O, Y = h(g, m, b);
    T ?? (q || D) ? c(I, Y) : d(O, (0, e._)`[${Y}]`);
  }
  t.reportError = s;
  function a(g, m = t.keywordError, b) {
    const { it: T } = g, { gen: O, compositeRule: I, allErrors: q } = T, D = h(g, m, b);
    c(O, D), I || q || d(T, n.default.vErrors);
  }
  t.reportExtraError = a;
  function o(g, m) {
    g.assign(n.default.errors, m), g.if((0, e._)`${n.default.vErrors} !== null`, () => g.if(m, () => g.assign((0, e._)`${n.default.vErrors}.length`, m), () => g.assign(n.default.vErrors, null)));
  }
  t.resetErrorsCount = o;
  function i({ gen: g, keyword: m, schemaValue: b, data: T, errsCount: O, it: I }) {
    if (O === void 0)
      throw new Error("ajv implementation error");
    const q = g.name("err");
    g.forRange("i", O, n.default.errors, (D) => {
      g.const(q, (0, e._)`${n.default.vErrors}[${D}]`), g.if((0, e._)`${q}.instancePath === undefined`, () => g.assign((0, e._)`${q}.instancePath`, (0, e.strConcat)(n.default.instancePath, I.errorPath))), g.assign((0, e._)`${q}.schemaPath`, (0, e.str)`${I.errSchemaPath}/${m}`), I.opts.verbose && (g.assign((0, e._)`${q}.schema`, b), g.assign((0, e._)`${q}.data`, T));
    });
  }
  t.extendErrors = i;
  function c(g, m) {
    const b = g.const("err", m);
    g.if((0, e._)`${n.default.vErrors} === null`, () => g.assign(n.default.vErrors, (0, e._)`[${b}]`), (0, e._)`${n.default.vErrors}.push(${b})`), g.code((0, e._)`${n.default.errors}++`);
  }
  function d(g, m) {
    const { gen: b, validateName: T, schemaEnv: O } = g;
    O.$async ? b.throw((0, e._)`new ${g.ValidationError}(${m})`) : (b.assign((0, e._)`${T}.errors`, m), b.return(!1));
  }
  const l = {
    keyword: new e.Name("keyword"),
    schemaPath: new e.Name("schemaPath"),
    // also used in JTD errors
    params: new e.Name("params"),
    propertyName: new e.Name("propertyName"),
    message: new e.Name("message"),
    schema: new e.Name("schema"),
    parentSchema: new e.Name("parentSchema")
  };
  function h(g, m, b) {
    const { createErrors: T } = g.it;
    return T === !1 ? (0, e._)`{}` : _(g, m, b);
  }
  function _(g, m, b = {}) {
    const { gen: T, it: O } = g, I = [
      $(O, b),
      w(g, b)
    ];
    return v(g, m, I), T.object(...I);
  }
  function $({ errorPath: g }, { instancePath: m }) {
    const b = m ? (0, e.str)`${g}${(0, r.getErrorPath)(m, r.Type.Str)}` : g;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, b)];
  }
  function w({ keyword: g, it: { errSchemaPath: m } }, { schemaPath: b, parentSchema: T }) {
    let O = T ? m : (0, e.str)`${m}/${g}`;
    return b && (O = (0, e.str)`${O}${(0, r.getErrorPath)(b, r.Type.Str)}`), [l.schemaPath, O];
  }
  function v(g, { params: m, message: b }, T) {
    const { keyword: O, data: I, schemaValue: q, it: D } = g, { opts: Y, propertyName: de, topSchemaRef: ge, schemaPath: Q } = D;
    T.push([l.keyword, O], [l.params, typeof m == "function" ? m(g) : m || (0, e._)`{}`]), Y.messages && T.push([l.message, typeof b == "function" ? b(g) : b]), Y.verbose && T.push([l.schema, q], [l.parentSchema, (0, e._)`${ge}${Q}`], [n.default.data, I]), de && T.push([l.propertyName, de]);
  }
})(ss);
Object.defineProperty(un, "__esModule", { value: !0 });
un.boolOrEmptySchema = un.topBoolOrEmptySchema = void 0;
const cE = ss, lE = ie, uE = Et, dE = {
  message: "boolean schema is false"
};
function fE(t) {
  const { gen: e, schema: r, validateName: n } = t;
  r === !1 ? _p(t, !1) : typeof r == "object" && r.$async === !0 ? e.return(uE.default.data) : (e.assign((0, lE._)`${n}.errors`, null), e.return(!0));
}
un.topBoolOrEmptySchema = fE;
function hE(t, e) {
  const { gen: r, schema: n } = t;
  n === !1 ? (r.var(e, !1), _p(t)) : r.var(e, !0);
}
un.boolOrEmptySchema = hE;
function _p(t, e) {
  const { gen: r, data: n } = t, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: t
  };
  (0, cE.reportError)(s, dE, void 0, e);
}
var Pe = {}, jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.getRules = jr.isJSONType = void 0;
const mE = ["string", "number", "integer", "boolean", "null", "object", "array"], pE = new Set(mE);
function yE(t) {
  return typeof t == "string" && pE.has(t);
}
jr.isJSONType = yE;
function $E() {
  const t = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...t, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, t.number, t.string, t.array, t.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
jr.getRules = $E;
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.shouldUseRule = At.shouldUseGroup = At.schemaHasRulesForType = void 0;
function gE({ schema: t, self: e }, r) {
  const n = e.RULES.types[r];
  return n && n !== !0 && wp(t, n);
}
At.schemaHasRulesForType = gE;
function wp(t, e) {
  return e.rules.some((r) => bp(t, r));
}
At.shouldUseGroup = wp;
function bp(t, e) {
  var r;
  return t[e.keyword] !== void 0 || ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => t[n] !== void 0));
}
At.shouldUseRule = bp;
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.reportTypeError = Pe.checkDataTypes = Pe.checkDataType = Pe.coerceAndCheckDataType = Pe.getJSONTypes = Pe.getSchemaTypes = Pe.DataType = void 0;
const vE = jr, _E = At, wE = ss, oe = ie, Sp = z;
var rn;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(rn || (Pe.DataType = rn = {}));
function bE(t) {
  const e = Ep(t.type);
  if (e.includes("null")) {
    if (t.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!e.length && t.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    t.nullable === !0 && e.push("null");
  }
  return e;
}
Pe.getSchemaTypes = bE;
function Ep(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(vE.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
Pe.getJSONTypes = Ep;
function SE(t, e) {
  const { gen: r, data: n, opts: s } = t, a = EE(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, _E.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = nc(e, n, s.strictNumbers, rn.Wrong);
    r.if(i, () => {
      a.length ? NE(t, e, a) : sc(t);
    });
  }
  return o;
}
Pe.coerceAndCheckDataType = SE;
const Np = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function EE(t, e) {
  return e ? t.filter((r) => Np.has(r) || e === "array" && r === "array") : [];
}
function NE(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, oe._)`typeof ${s}`), i = n.let("coerced", (0, oe._)`undefined`);
  a.coerceTypes === "array" && n.if((0, oe._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, oe._)`${s}[0]`).assign(o, (0, oe._)`typeof ${s}`).if(nc(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, oe._)`${i} !== undefined`);
  for (const d of r)
    (Np.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), sc(t), n.endIf(), n.if((0, oe._)`${i} !== undefined`, () => {
    n.assign(s, i), PE(t, i);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, oe._)`${o} == "number" || ${o} == "boolean"`).assign(i, (0, oe._)`"" + ${s}`).elseIf((0, oe._)`${s} === null`).assign(i, (0, oe._)`""`);
        return;
      case "number":
        n.elseIf((0, oe._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(i, (0, oe._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, oe._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(i, (0, oe._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, oe._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(i, !1).elseIf((0, oe._)`${s} === "true" || ${s} === 1`).assign(i, !0);
        return;
      case "null":
        n.elseIf((0, oe._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(i, null);
        return;
      case "array":
        n.elseIf((0, oe._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(i, (0, oe._)`[${s}]`);
    }
  }
}
function PE({ gen: t, parentData: e, parentDataProperty: r }, n) {
  t.if((0, oe._)`${e} !== undefined`, () => t.assign((0, oe._)`${e}[${r}]`, n));
}
function _o(t, e, r, n = rn.Correct) {
  const s = n === rn.Correct ? oe.operators.EQ : oe.operators.NEQ;
  let a;
  switch (t) {
    case "null":
      return (0, oe._)`${e} ${s} null`;
    case "array":
      a = (0, oe._)`Array.isArray(${e})`;
      break;
    case "object":
      a = (0, oe._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      a = o((0, oe._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, oe._)`typeof ${e} ${s} ${t}`;
  }
  return n === rn.Correct ? a : (0, oe.not)(a);
  function o(i = oe.nil) {
    return (0, oe.and)((0, oe._)`typeof ${e} == "number"`, i, r ? (0, oe._)`isFinite(${e})` : oe.nil);
  }
}
Pe.checkDataType = _o;
function nc(t, e, r, n) {
  if (t.length === 1)
    return _o(t[0], e, r, n);
  let s;
  const a = (0, Sp.toHash)(t);
  if (a.array && a.object) {
    const o = (0, oe._)`typeof ${e} != "object"`;
    s = a.null ? o : (0, oe._)`!${e} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = oe.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, oe.and)(s, _o(o, e, r, n));
  return s;
}
Pe.checkDataTypes = nc;
const TE = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, oe._)`{type: ${t}}` : (0, oe._)`{type: ${e}}`
};
function sc(t) {
  const e = OE(t);
  (0, wE.reportError)(e, TE);
}
Pe.reportTypeError = sc;
function OE(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, Sp.schemaRefOrVal)(t, n, "type");
  return {
    gen: e,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: t
  };
}
var va = {};
Object.defineProperty(va, "__esModule", { value: !0 });
va.assignDefaults = void 0;
const Ur = ie, RE = z;
function IE(t, e) {
  const { properties: r, items: n } = t.schema;
  if (e === "object" && r)
    for (const s in r)
      Xl(t, s, r[s].default);
  else e === "array" && Array.isArray(n) && n.forEach((s, a) => Xl(t, a, s.default));
}
va.assignDefaults = IE;
function Xl(t, e, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = t;
  if (r === void 0)
    return;
  const i = (0, Ur._)`${a}${(0, Ur.getProperty)(e)}`;
  if (s) {
    (0, RE.checkStrictMode)(t, `default is ignored for: ${i}`);
    return;
  }
  let c = (0, Ur._)`${i} === undefined`;
  o.useDefaults === "empty" && (c = (0, Ur._)`${c} || ${i} === null || ${i} === ""`), n.if(c, (0, Ur._)`${i} = ${(0, Ur.stringify)(r)}`);
}
var St = {}, le = {};
Object.defineProperty(le, "__esModule", { value: !0 });
le.validateUnion = le.validateArray = le.usePattern = le.callValidateCode = le.schemaProperties = le.allSchemaProperties = le.noPropertyInData = le.propertyInData = le.isOwnProperty = le.hasPropFunc = le.reportMissingProp = le.checkMissingProp = le.checkReportMissingProp = void 0;
const $e = ie, ac = z, Bt = Et, jE = z;
function CE(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(ic(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, $e._)`${e}` }, !0), t.error();
  });
}
le.checkReportMissingProp = CE;
function AE({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, $e.or)(...n.map((a) => (0, $e.and)(ic(t, e, a, r.ownProperties), (0, $e._)`${s} = ${a}`)));
}
le.checkMissingProp = AE;
function kE(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
le.reportMissingProp = kE;
function Pp(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, $e._)`Object.prototype.hasOwnProperty`
  });
}
le.hasPropFunc = Pp;
function oc(t, e, r) {
  return (0, $e._)`${Pp(t)}.call(${e}, ${r})`;
}
le.isOwnProperty = oc;
function LE(t, e, r, n) {
  const s = (0, $e._)`${e}${(0, $e.getProperty)(r)} !== undefined`;
  return n ? (0, $e._)`${s} && ${oc(t, e, r)}` : s;
}
le.propertyInData = LE;
function ic(t, e, r, n) {
  const s = (0, $e._)`${e}${(0, $e.getProperty)(r)} === undefined`;
  return n ? (0, $e.or)(s, (0, $e.not)(oc(t, e, r))) : s;
}
le.noPropertyInData = ic;
function Tp(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
le.allSchemaProperties = Tp;
function DE(t, e) {
  return Tp(e).filter((r) => !(0, ac.alwaysValidSchema)(t, e[r]));
}
le.schemaProperties = DE;
function ME({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, d) {
  const l = d ? (0, $e._)`${t}, ${e}, ${n}${s}` : e, h = [
    [Bt.default.instancePath, (0, $e.strConcat)(Bt.default.instancePath, a)],
    [Bt.default.parentData, o.parentData],
    [Bt.default.parentDataProperty, o.parentDataProperty],
    [Bt.default.rootData, Bt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Bt.default.dynamicAnchors, Bt.default.dynamicAnchors]);
  const _ = (0, $e._)`${l}, ${r.object(...h)}`;
  return c !== $e.nil ? (0, $e._)`${i}.call(${c}, ${_})` : (0, $e._)`${i}(${_})`;
}
le.callValidateCode = ME;
const VE = (0, $e._)`new RegExp`;
function FE({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, $e._)`${s.code === "new RegExp" ? VE : (0, jE.useFunc)(t, s)}(${r}, ${n})`
  });
}
le.usePattern = FE;
function qE(t) {
  const { gen: e, data: r, keyword: n, it: s } = t, a = e.name("valid");
  if (s.allErrors) {
    const i = e.let("valid", !0);
    return o(() => e.assign(i, !1)), i;
  }
  return e.var(a, !0), o(() => e.break()), a;
  function o(i) {
    const c = e.const("len", (0, $e._)`${r}.length`);
    e.forRange("i", 0, c, (d) => {
      t.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: ac.Type.Num
      }, a), e.if((0, $e.not)(a), i);
    });
  }
}
le.validateArray = qE;
function zE(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, ac.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = e.let("valid", !1), i = e.name("_valid");
  e.block(() => r.forEach((c, d) => {
    const l = t.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, i);
    e.assign(o, (0, $e._)`${o} || ${i}`), t.mergeValidEvaluated(l, i) || e.if((0, $e.not)(o));
  })), t.result(o, () => t.reset(), () => t.error(!0));
}
le.validateUnion = zE;
Object.defineProperty(St, "__esModule", { value: !0 });
St.validateKeywordUsage = St.validSchemaType = St.funcKeywordCode = St.macroKeywordCode = void 0;
const Qe = ie, br = Et, UE = le, BE = ss;
function KE(t, e) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = t, i = e.macro.call(o.self, s, a, o), c = Op(r, n, i);
  o.opts.validateSchema !== !1 && o.self.validateSchema(i, !0);
  const d = r.name("valid");
  t.subschema({
    schema: i,
    schemaPath: Qe.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), t.pass(d, () => t.error(!0));
}
St.macroKeywordCode = KE;
function QE(t, e) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: i, it: c } = t;
  xE(c, e);
  const d = !i && e.compile ? e.compile.call(c.self, a, o, c) : e.validate, l = Op(n, s, d), h = n.let("valid");
  t.block$data(h, _), t.ok((r = e.valid) !== null && r !== void 0 ? r : h);
  function _() {
    if (e.errors === !1)
      v(), e.modifying && Yl(t), g(() => t.error());
    else {
      const m = e.async ? $() : w();
      e.modifying && Yl(t), g(() => GE(t, m));
    }
  }
  function $() {
    const m = n.let("ruleErrs", null);
    return n.try(() => v((0, Qe._)`await `), (b) => n.assign(h, !1).if((0, Qe._)`${b} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Qe._)`${b}.errors`), () => n.throw(b))), m;
  }
  function w() {
    const m = (0, Qe._)`${l}.errors`;
    return n.assign(m, null), v(Qe.nil), m;
  }
  function v(m = e.async ? (0, Qe._)`await ` : Qe.nil) {
    const b = c.opts.passContext ? br.default.this : br.default.self, T = !("compile" in e && !i || e.schema === !1);
    n.assign(h, (0, Qe._)`${m}${(0, UE.callValidateCode)(t, l, b, T)}`, e.modifying);
  }
  function g(m) {
    var b;
    n.if((0, Qe.not)((b = e.valid) !== null && b !== void 0 ? b : h), m);
  }
}
St.funcKeywordCode = QE;
function Yl(t) {
  const { gen: e, data: r, it: n } = t;
  e.if(n.parentData, () => e.assign(r, (0, Qe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function GE(t, e) {
  const { gen: r } = t;
  r.if((0, Qe._)`Array.isArray(${e})`, () => {
    r.assign(br.default.vErrors, (0, Qe._)`${br.default.vErrors} === null ? ${e} : ${br.default.vErrors}.concat(${e})`).assign(br.default.errors, (0, Qe._)`${br.default.vErrors}.length`), (0, BE.extendErrors)(t);
  }, () => t.error());
}
function xE({ schemaEnv: t }, e) {
  if (e.async && !t.$async)
    throw new Error("async keyword in sync schema");
}
function Op(t, e, r) {
  if (r === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return t.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Qe.stringify)(r) });
}
function HE(t, e, r = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(t) : n === "object" ? t && typeof t == "object" && !Array.isArray(t) : typeof t == n || r && typeof t > "u");
}
St.validSchemaType = HE;
function JE({ schema: t, opts: e, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((i) => !Object.prototype.hasOwnProperty.call(t, i)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(t[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (e.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
St.validateKeywordUsage = JE;
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.extendSubschemaMode = Zt.extendSubschemaData = Zt.getSubschema = void 0;
const wt = ie, Rp = z;
function WE(t, { keyword: e, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (e !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (e !== void 0) {
    const i = t.schema[e];
    return r === void 0 ? {
      schema: i,
      schemaPath: (0, wt._)`${t.schemaPath}${(0, wt.getProperty)(e)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}`
    } : {
      schema: i[r],
      schemaPath: (0, wt._)`${t.schemaPath}${(0, wt.getProperty)(e)}${(0, wt.getProperty)(r)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, Rp.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Zt.getSubschema = WE;
function XE(t, e, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: i } = e;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = e, _ = i.let("data", (0, wt._)`${e.data}${(0, wt.getProperty)(r)}`, !0);
    c(_), t.errorPath = (0, wt.str)`${d}${(0, Rp.getErrorPath)(r, n, h.jsPropertySyntax)}`, t.parentDataProperty = (0, wt._)`${r}`, t.dataPathArr = [...l, t.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof wt.Name ? s : i.let("data", s, !0);
    c(d), o !== void 0 && (t.propertyName = o);
  }
  a && (t.dataTypes = a);
  function c(d) {
    t.data = d, t.dataLevel = e.dataLevel + 1, t.dataTypes = [], e.definedProperties = /* @__PURE__ */ new Set(), t.parentData = e.data, t.dataNames = [...e.dataNames, d];
  }
}
Zt.extendSubschemaData = XE;
function YE(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (t.compositeRule = n), s !== void 0 && (t.createErrors = s), a !== void 0 && (t.allErrors = a), t.jtdDiscriminator = e, t.jtdMetadata = r;
}
Zt.extendSubschemaMode = YE;
var Ce = {}, Ip = { exports: {} }, Wt = Ip.exports = function(t, e, r) {
  typeof e == "function" && (r = e, e = {}), r = e.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Ms(e, n, s, t, "", t);
};
Wt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Wt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Wt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Wt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Ms(t, e, r, n, s, a, o, i, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, s, a, o, i, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in Wt.arrayKeywords)
          for (var _ = 0; _ < h.length; _++)
            Ms(t, e, r, h[_], s + "/" + l + "/" + _, a, s, l, n, _);
      } else if (l in Wt.propsKeywords) {
        if (h && typeof h == "object")
          for (var $ in h)
            Ms(t, e, r, h[$], s + "/" + l + "/" + ZE($), a, s, l, n, $);
      } else (l in Wt.keywords || t.allKeys && !(l in Wt.skipKeywords)) && Ms(t, e, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, i, c, d);
  }
}
function ZE(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var e1 = Ip.exports;
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.getSchemaRefs = Ce.resolveUrl = Ce.normalizeId = Ce._getFullPath = Ce.getFullPath = Ce.inlineRef = void 0;
const t1 = z, r1 = fa, n1 = e1, s1 = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function a1(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !wo(t) : e ? jp(t) <= e : !1;
}
Ce.inlineRef = a1;
const o1 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function wo(t) {
  for (const e in t) {
    if (o1.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(wo) || typeof r == "object" && wo(r))
      return !0;
  }
  return !1;
}
function jp(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !s1.has(r) && (typeof t[r] == "object" && (0, t1.eachItem)(t[r], (n) => e += jp(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function Cp(t, e = "", r) {
  r !== !1 && (e = nn(e));
  const n = t.parse(e);
  return Ap(t, n);
}
Ce.getFullPath = Cp;
function Ap(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
Ce._getFullPath = Ap;
const i1 = /#\/?$/;
function nn(t) {
  return t ? t.replace(i1, "") : "";
}
Ce.normalizeId = nn;
function c1(t, e, r) {
  return r = nn(r), t.resolve(e, r);
}
Ce.resolveUrl = c1;
const l1 = /^[a-z_][-a-z0-9._]*$/i;
function u1(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = nn(t[r] || e), a = { "": s }, o = Cp(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return n1(t, { allKeys: !0 }, (h, _, $, w) => {
    if (w === void 0)
      return;
    const v = o + _;
    let g = a[w];
    typeof h[r] == "string" && (g = m.call(this, h[r])), b.call(this, h.$anchor), b.call(this, h.$dynamicAnchor), a[_] = g;
    function m(T) {
      const O = this.opts.uriResolver.resolve;
      if (T = nn(g ? O(g, T) : T), c.has(T))
        throw l(T);
      c.add(T);
      let I = this.refs[T];
      return typeof I == "string" && (I = this.refs[I]), typeof I == "object" ? d(h, I.schema, T) : T !== nn(v) && (T[0] === "#" ? (d(h, i[T], T), i[T] = h) : this.refs[T] = v), T;
    }
    function b(T) {
      if (typeof T == "string") {
        if (!l1.test(T))
          throw new Error(`invalid anchor "${T}"`);
        m.call(this, `#${T}`);
      }
    }
  }), i;
  function d(h, _, $) {
    if (_ !== void 0 && !r1(h, _))
      throw l($);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ce.getSchemaRefs = u1;
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.getData = yt.KeywordCxt = yt.validateFunctionCode = void 0;
const kp = un, Zl = Pe, cc = At, Ws = Pe, d1 = va, Un = St, Qa = Zt, J = ie, re = Et, f1 = Ce, kt = z, Rn = ss;
function h1(t) {
  if (Mp(t) && (Vp(t), Dp(t))) {
    y1(t);
    return;
  }
  Lp(t, () => (0, kp.topBoolOrEmptySchema)(t));
}
yt.validateFunctionCode = h1;
function Lp({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? t.func(e, (0, J._)`${re.default.data}, ${re.default.valCxt}`, n.$async, () => {
    t.code((0, J._)`"use strict"; ${eu(r, s)}`), p1(t, s), t.code(a);
  }) : t.func(e, (0, J._)`${re.default.data}, ${m1(s)}`, n.$async, () => t.code(eu(r, s)).code(a));
}
function m1(t) {
  return (0, J._)`{${re.default.instancePath}="", ${re.default.parentData}, ${re.default.parentDataProperty}, ${re.default.rootData}=${re.default.data}${t.dynamicRef ? (0, J._)`, ${re.default.dynamicAnchors}={}` : J.nil}}={}`;
}
function p1(t, e) {
  t.if(re.default.valCxt, () => {
    t.var(re.default.instancePath, (0, J._)`${re.default.valCxt}.${re.default.instancePath}`), t.var(re.default.parentData, (0, J._)`${re.default.valCxt}.${re.default.parentData}`), t.var(re.default.parentDataProperty, (0, J._)`${re.default.valCxt}.${re.default.parentDataProperty}`), t.var(re.default.rootData, (0, J._)`${re.default.valCxt}.${re.default.rootData}`), e.dynamicRef && t.var(re.default.dynamicAnchors, (0, J._)`${re.default.valCxt}.${re.default.dynamicAnchors}`);
  }, () => {
    t.var(re.default.instancePath, (0, J._)`""`), t.var(re.default.parentData, (0, J._)`undefined`), t.var(re.default.parentDataProperty, (0, J._)`undefined`), t.var(re.default.rootData, re.default.data), e.dynamicRef && t.var(re.default.dynamicAnchors, (0, J._)`{}`);
  });
}
function y1(t) {
  const { schema: e, opts: r, gen: n } = t;
  Lp(t, () => {
    r.$comment && e.$comment && qp(t), w1(t), n.let(re.default.vErrors, null), n.let(re.default.errors, 0), r.unevaluated && $1(t), Fp(t), E1(t);
  });
}
function $1(t) {
  const { gen: e, validateName: r } = t;
  t.evaluated = e.const("evaluated", (0, J._)`${r}.evaluated`), e.if((0, J._)`${t.evaluated}.dynamicProps`, () => e.assign((0, J._)`${t.evaluated}.props`, (0, J._)`undefined`)), e.if((0, J._)`${t.evaluated}.dynamicItems`, () => e.assign((0, J._)`${t.evaluated}.items`, (0, J._)`undefined`));
}
function eu(t, e) {
  const r = typeof t == "object" && t[e.schemaId];
  return r && (e.code.source || e.code.process) ? (0, J._)`/*# sourceURL=${r} */` : J.nil;
}
function g1(t, e) {
  if (Mp(t) && (Vp(t), Dp(t))) {
    v1(t, e);
    return;
  }
  (0, kp.boolOrEmptySchema)(t, e);
}
function Dp({ schema: t, self: e }) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e.RULES.all[r])
      return !0;
  return !1;
}
function Mp(t) {
  return typeof t.schema != "boolean";
}
function v1(t, e) {
  const { schema: r, gen: n, opts: s } = t;
  s.$comment && r.$comment && qp(t), b1(t), S1(t);
  const a = n.const("_errs", re.default.errors);
  Fp(t, a), n.var(e, (0, J._)`${a} === ${re.default.errors}`);
}
function Vp(t) {
  (0, kt.checkUnknownRules)(t), _1(t);
}
function Fp(t, e) {
  if (t.opts.jtd)
    return tu(t, [], !1, e);
  const r = (0, Zl.getSchemaTypes)(t.schema), n = (0, Zl.coerceAndCheckDataType)(t, r);
  tu(t, r, !n, e);
}
function _1(t) {
  const { schema: e, errSchemaPath: r, opts: n, self: s } = t;
  e.$ref && n.ignoreKeywordsWithRef && (0, kt.schemaHasRulesButRef)(e, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function w1(t) {
  const { schema: e, opts: r } = t;
  e.default !== void 0 && r.useDefaults && r.strictSchema && (0, kt.checkStrictMode)(t, "default is ignored in the schema root");
}
function b1(t) {
  const e = t.schema[t.opts.schemaId];
  e && (t.baseId = (0, f1.resolveUrl)(t.opts.uriResolver, t.baseId, e));
}
function S1(t) {
  if (t.schema.$async && !t.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function qp({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    t.code((0, J._)`${re.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, J.str)`${n}/$comment`, i = t.scopeValue("root", { ref: e.root });
    t.code((0, J._)`${re.default.self}.opts.$comment(${a}, ${o}, ${i}.schema)`);
  }
}
function E1(t) {
  const { gen: e, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = t;
  r.$async ? e.if((0, J._)`${re.default.errors} === 0`, () => e.return(re.default.data), () => e.throw((0, J._)`new ${s}(${re.default.vErrors})`)) : (e.assign((0, J._)`${n}.errors`, re.default.vErrors), a.unevaluated && N1(t), e.return((0, J._)`${re.default.errors} === 0`));
}
function N1({ gen: t, evaluated: e, props: r, items: n }) {
  r instanceof J.Name && t.assign((0, J._)`${e}.props`, r), n instanceof J.Name && t.assign((0, J._)`${e}.items`, n);
}
function tu(t, e, r, n) {
  const { gen: s, schema: a, data: o, allErrors: i, opts: c, self: d } = t, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, kt.schemaHasRulesButRef)(a, l))) {
    s.block(() => Bp(t, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || P1(t, e), s.block(() => {
    for (const _ of l.rules)
      h(_);
    h(l.post);
  });
  function h(_) {
    (0, cc.shouldUseGroup)(a, _) && (_.type ? (s.if((0, Ws.checkDataType)(_.type, o, c.strictNumbers)), ru(t, _), e.length === 1 && e[0] === _.type && r && (s.else(), (0, Ws.reportTypeError)(t)), s.endIf()) : ru(t, _), i || s.if((0, J._)`${re.default.errors} === ${n || 0}`));
  }
}
function ru(t, e) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = t;
  s && (0, d1.assignDefaults)(t, e.type), r.block(() => {
    for (const a of e.rules)
      (0, cc.shouldUseRule)(n, a) && Bp(t, a.keyword, a.definition, e.type);
  });
}
function P1(t, e) {
  t.schemaEnv.meta || !t.opts.strictTypes || (T1(t, e), t.opts.allowUnionTypes || O1(t, e), R1(t, t.dataTypes));
}
function T1(t, e) {
  if (e.length) {
    if (!t.dataTypes.length) {
      t.dataTypes = e;
      return;
    }
    e.forEach((r) => {
      zp(t.dataTypes, r) || lc(t, `type "${r}" not allowed by context "${t.dataTypes.join(",")}"`);
    }), j1(t, e);
  }
}
function O1(t, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && lc(t, "use allowUnionTypes to allow union type keyword");
}
function R1(t, e) {
  const r = t.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, cc.shouldUseRule)(t.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => I1(e, o)) && lc(t, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function I1(t, e) {
  return t.includes(e) || e === "number" && t.includes("integer");
}
function zp(t, e) {
  return t.includes(e) || e === "integer" && t.includes("number");
}
function j1(t, e) {
  const r = [];
  for (const n of t.dataTypes)
    zp(e, n) ? r.push(n) : e.includes("integer") && n === "number" && r.push("integer");
  t.dataTypes = r;
}
function lc(t, e) {
  const r = t.schemaEnv.baseId + t.errSchemaPath;
  e += ` at "${r}" (strictTypes)`, (0, kt.checkStrictMode)(t, e, t.opts.strictTypes);
}
class Up {
  constructor(e, r, n) {
    if ((0, Un.validateKeywordUsage)(e, r, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, kt.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = r, this.$data)
      this.schemaCode = e.gen.const("vSchema", Kp(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, Un.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = e.gen.const("_errs", re.default.errors));
  }
  result(e, r, n) {
    this.failResult((0, J.not)(e), r, n);
  }
  failResult(e, r, n) {
    this.gen.if(e), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(e, r) {
    this.failResult((0, J.not)(e), void 0, r);
  }
  fail(e) {
    if (e === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(e), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(e) {
    if (!this.$data)
      return this.fail(e);
    const { schemaCode: r } = this;
    this.fail((0, J._)`${r} !== undefined && (${(0, J.or)(this.invalid$data(), e)})`);
  }
  error(e, r, n) {
    if (r) {
      this.setParams(r), this._error(e, n), this.setParams({});
      return;
    }
    this._error(e, n);
  }
  _error(e, r) {
    (e ? Rn.reportExtraError : Rn.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Rn.reportError)(this, this.def.$dataError || Rn.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Rn.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(e) {
    this.allErrors || this.gen.if(e);
  }
  setParams(e, r) {
    r ? Object.assign(this.params, e) : this.params = e;
  }
  block$data(e, r, n = J.nil) {
    this.gen.block(() => {
      this.check$data(e, n), r();
    });
  }
  check$data(e = J.nil, r = J.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, J.or)((0, J._)`${s} === undefined`, r)), e !== J.nil && n.assign(e, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), e !== J.nil && n.assign(e, !1)), n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, J.or)(o(), i());
    function o() {
      if (n.length) {
        if (!(r instanceof J.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, J._)`${(0, Ws.checkDataTypes)(c, r, a.opts.strictNumbers, Ws.DataType.Wrong)}`;
      }
      return J.nil;
    }
    function i() {
      if (s.validateSchema) {
        const c = e.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, J._)`!${c}(${r})`;
      }
      return J.nil;
    }
  }
  subschema(e, r) {
    const n = (0, Qa.getSubschema)(this.it, e);
    (0, Qa.extendSubschemaData)(n, this.it, e), (0, Qa.extendSubschemaMode)(n, e);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return g1(s, r), s;
  }
  mergeEvaluated(e, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && e.props !== void 0 && (n.props = kt.mergeEvaluated.props(s, e.props, n.props, r)), n.items !== !0 && e.items !== void 0 && (n.items = kt.mergeEvaluated.items(s, e.items, n.items, r)));
  }
  mergeValidEvaluated(e, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(e, J.Name)), !0;
  }
}
yt.KeywordCxt = Up;
function Bp(t, e, r, n) {
  const s = new Up(t, r, e);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Un.funcKeywordCode)(s, r) : "macro" in r ? (0, Un.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Un.funcKeywordCode)(s, r);
}
const C1 = /^\/(?:[^~]|~0|~1)*$/, A1 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Kp(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (t === "")
    return re.default.rootData;
  if (t[0] === "/") {
    if (!C1.test(t))
      throw new Error(`Invalid JSON-pointer: ${t}`);
    s = t, a = re.default.rootData;
  } else {
    const d = A1.exec(t);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${t}`);
    const l = +d[1];
    if (s = d[2], s === "#") {
      if (l >= e)
        throw new Error(c("property/index", l));
      return n[e - l];
    }
    if (l > e)
      throw new Error(c("data", l));
    if (a = r[e - l], !s)
      return a;
  }
  let o = a;
  const i = s.split("/");
  for (const d of i)
    d && (a = (0, J._)`${a}${(0, J.getProperty)((0, kt.unescapeJsonPointer)(d))}`, o = (0, J._)`${o} && ${a}`);
  return o;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${e}`;
  }
}
yt.getData = Kp;
var as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
class k1 extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
as.default = k1;
var vn = {};
Object.defineProperty(vn, "__esModule", { value: !0 });
const Ga = Ce;
class L1 extends Error {
  constructor(e, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ga.resolveUrl)(e, r, n), this.missingSchema = (0, Ga.normalizeId)((0, Ga.getFullPath)(e, this.missingRef));
  }
}
vn.default = L1;
var Xe = {};
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.resolveSchema = Xe.getCompilingSchema = Xe.resolveRef = Xe.compileSchema = Xe.SchemaEnv = void 0;
const lt = ie, D1 = as, $r = Et, mt = Ce, nu = z, M1 = yt;
class _a {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, mt.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Xe.SchemaEnv = _a;
function uc(t) {
  const e = Qp.call(this, t);
  if (e)
    return e;
  const r = (0, mt.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new lt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: D1.default,
    code: (0, lt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  t.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: $r.default.data,
    parentData: $r.default.parentData,
    parentDataProperty: $r.default.parentDataProperty,
    dataNames: [$r.default.data],
    dataPathArr: [lt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: t.schema, code: (0, lt.stringify)(t.schema) } : { ref: t.schema }),
    validateName: c,
    ValidationError: i,
    schema: t.schema,
    schemaEnv: t,
    rootId: r,
    baseId: t.baseId || r,
    schemaPath: lt.nil,
    errSchemaPath: t.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, lt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(t), (0, M1.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs($r.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, t));
    const $ = new Function(`${$r.default.self}`, `${$r.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: $ }), $.errors = null, $.schema = t.schema, $.schemaEnv = t, t.$async && ($.$async = !0), this.opts.code.source === !0 && ($.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: v } = d;
      $.evaluated = {
        props: w instanceof lt.Name ? void 0 : w,
        items: v instanceof lt.Name ? void 0 : v,
        dynamicProps: w instanceof lt.Name,
        dynamicItems: v instanceof lt.Name
      }, $.source && ($.source.evaluated = (0, lt.stringify)($.evaluated));
    }
    return t.validate = $, t;
  } catch (h) {
    throw delete t.validate, delete t.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(t);
  }
}
Xe.compileSchema = uc;
function V1(t, e, r) {
  var n;
  r = (0, mt.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = z1.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new _a({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = F1.call(this, a);
}
Xe.resolveRef = V1;
function F1(t) {
  return (0, mt.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : uc.call(this, t);
}
function Qp(t) {
  for (const e of this._compilations)
    if (q1(e, t))
      return e;
}
Xe.getCompilingSchema = Qp;
function q1(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function z1(t, e) {
  let r;
  for (; typeof (r = this.refs[e]) == "string"; )
    e = r;
  return r || this.schemas[e] || wa.call(this, t, e);
}
function wa(t, e) {
  const r = this.opts.uriResolver.parse(e), n = (0, mt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, mt.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
  if (Object.keys(t.schema).length > 0 && n === s)
    return xa.call(this, r, t);
  const a = (0, mt.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const i = wa.call(this, t, o);
    return typeof (i == null ? void 0 : i.schema) != "object" ? void 0 : xa.call(this, r, i);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || uc.call(this, o), a === (0, mt.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, d = i[c];
      return d && (s = (0, mt.resolveUrl)(this.opts.uriResolver, s, d)), new _a({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return xa.call(this, r, o);
  }
}
Xe.resolveSchema = wa;
const U1 = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function xa(t, { baseId: e, schema: r, root: n }) {
  var s;
  if (((s = t.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const i of t.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, nu.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !U1.has(i) && d && (e = (0, mt.resolveUrl)(this.opts.uriResolver, e, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, nu.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, mt.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = wa.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new _a({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const B1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", K1 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Q1 = "object", G1 = [
  "$data"
], x1 = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, H1 = !1, J1 = {
  $id: B1,
  description: K1,
  type: Q1,
  required: G1,
  properties: x1,
  additionalProperties: H1
};
var dc = {};
Object.defineProperty(dc, "__esModule", { value: !0 });
const Gp = tp;
Gp.code = 'require("ajv/dist/runtime/uri").default';
dc.default = Gp;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  var e = yt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var r = ie;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = as, s = vn, a = jr, o = Xe, i = ie, c = Ce, d = Pe, l = z, h = J1, _ = dc, $ = (P, p) => new RegExp(P, p);
  $.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], v = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), g = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, b = 200;
  function T(P) {
    var p, E, y, u, f, S, C, j, U, K, ue, Ze, rr, nr, sr, ar, or, ir, cr, lr, ur, dr, fr, hr, mr;
    const it = P.strict, pr = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, bn = pr === !0 || pr === void 0 ? 1 : pr || 0, Sn = (y = (E = P.code) === null || E === void 0 ? void 0 : E.regExp) !== null && y !== void 0 ? y : $, Da = (u = P.uriResolver) !== null && u !== void 0 ? u : _.default;
    return {
      strictSchema: (S = (f = P.strictSchema) !== null && f !== void 0 ? f : it) !== null && S !== void 0 ? S : !0,
      strictNumbers: (j = (C = P.strictNumbers) !== null && C !== void 0 ? C : it) !== null && j !== void 0 ? j : !0,
      strictTypes: (K = (U = P.strictTypes) !== null && U !== void 0 ? U : it) !== null && K !== void 0 ? K : "log",
      strictTuples: (Ze = (ue = P.strictTuples) !== null && ue !== void 0 ? ue : it) !== null && Ze !== void 0 ? Ze : "log",
      strictRequired: (nr = (rr = P.strictRequired) !== null && rr !== void 0 ? rr : it) !== null && nr !== void 0 ? nr : !1,
      code: P.code ? { ...P.code, optimize: bn, regExp: Sn } : { optimize: bn, regExp: Sn },
      loopRequired: (sr = P.loopRequired) !== null && sr !== void 0 ? sr : b,
      loopEnum: (ar = P.loopEnum) !== null && ar !== void 0 ? ar : b,
      meta: (or = P.meta) !== null && or !== void 0 ? or : !0,
      messages: (ir = P.messages) !== null && ir !== void 0 ? ir : !0,
      inlineRefs: (cr = P.inlineRefs) !== null && cr !== void 0 ? cr : !0,
      schemaId: (lr = P.schemaId) !== null && lr !== void 0 ? lr : "$id",
      addUsedSchema: (ur = P.addUsedSchema) !== null && ur !== void 0 ? ur : !0,
      validateSchema: (dr = P.validateSchema) !== null && dr !== void 0 ? dr : !0,
      validateFormats: (fr = P.validateFormats) !== null && fr !== void 0 ? fr : !0,
      unicodeRegExp: (hr = P.unicodeRegExp) !== null && hr !== void 0 ? hr : !0,
      int32range: (mr = P.int32range) !== null && mr !== void 0 ? mr : !0,
      uriResolver: Da
    };
  }
  class O {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...T(p) };
      const { es5: E, lines: y } = this.opts.code;
      this.scope = new i.ValueScope({ scope: {}, prefixes: v, es5: E, lines: y }), this.logger = x(p.logger);
      const u = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, g, p, "NOT SUPPORTED"), I.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ge.call(this), p.formats && Y.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && de.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), D.call(this), p.validateFormats = u;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: E, schemaId: y } = this.opts;
      let u = h;
      y === "id" && (u = { ...h }, u.id = u.$id, delete u.$id), E && p && this.addMetaSchema(u, u[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: E } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[E] || p : void 0;
    }
    validate(p, E) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const u = y(E);
      return "$async" in y || (this.errors = y.errors), u;
    }
    compile(p, E) {
      const y = this._addSchema(p, E);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, E) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return u.call(this, p, E);
      async function u(K, ue) {
        await f.call(this, K.$schema);
        const Ze = this._addSchema(K, ue);
        return Ze.validate || S.call(this, Ze);
      }
      async function f(K) {
        K && !this.getSchema(K) && await u.call(this, { $ref: K }, !0);
      }
      async function S(K) {
        try {
          return this._compileSchemaEnv(K);
        } catch (ue) {
          if (!(ue instanceof s.default))
            throw ue;
          return C.call(this, ue), await j.call(this, ue.missingSchema), S.call(this, K);
        }
      }
      function C({ missingSchema: K, missingRef: ue }) {
        if (this.refs[K])
          throw new Error(`AnySchema ${K} is loaded but ${ue} cannot be resolved`);
      }
      async function j(K) {
        const ue = await U.call(this, K);
        this.refs[K] || await f.call(this, ue.$schema), this.refs[K] || this.addSchema(ue, K, E);
      }
      async function U(K) {
        const ue = this._loading[K];
        if (ue)
          return ue;
        try {
          return await (this._loading[K] = y(K));
        } finally {
          delete this._loading[K];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, E, y, u = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const S of p)
          this.addSchema(S, void 0, y, u);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: S } = this.opts;
        if (f = p[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return E = (0, c.normalizeId)(E || f), this._checkUnique(E), this.schemas[E] = this._addSchema(p, y, E, u, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, E, y = this.opts.validateSchema) {
      return this.addSchema(p, E, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, E) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const u = this.validate(y, p);
      if (!u && E) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return u;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let E;
      for (; typeof (E = q.call(this, p)) == "string"; )
        p = E;
      if (E === void 0) {
        const { schemaId: y } = this.opts, u = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (E = o.resolveSchema.call(this, u, p), !E)
          return;
        this.refs[p] = E;
      }
      return E.validate || this._compileSchemaEnv(E);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const E = q.call(this, p);
          return typeof E == "object" && this._cache.delete(E.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const E = p;
          this._cache.delete(E);
          let y = p[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const E of p)
        this.addKeyword(E);
      return this;
    }
    addKeyword(p, E) {
      let y;
      if (typeof p == "string")
        y = p, typeof E == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), E.keyword = y);
      else if (typeof p == "object" && E === void 0) {
        if (E = p, y = E.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (G.call(this, y, E), !E)
        return (0, l.eachItem)(y, (f) => he.call(this, f)), this;
      M.call(this, E);
      const u = {
        ...E,
        type: (0, d.getJSONTypes)(E.type),
        schemaType: (0, d.getJSONTypes)(E.schemaType)
      };
      return (0, l.eachItem)(y, u.type.length === 0 ? (f) => he.call(this, f, u) : (f) => u.type.forEach((S) => he.call(this, f, u, S))), this;
    }
    getKeyword(p) {
      const E = this.RULES.all[p];
      return typeof E == "object" ? E.definition : !!E;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: E } = this;
      delete E.keywords[p], delete E.all[p];
      for (const y of E.rules) {
        const u = y.rules.findIndex((f) => f.keyword === p);
        u >= 0 && y.rules.splice(u, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, E) {
      return typeof E == "string" && (E = new RegExp(E)), this.formats[p] = E, this;
    }
    errorsText(p = this.errors, { separator: E = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((u) => `${y}${u.instancePath} ${u.message}`).reduce((u, f) => u + E + f);
    }
    $dataMetaSchema(p, E) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const u of E) {
        const f = u.split("/").slice(1);
        let S = p;
        for (const C of f)
          S = S[C];
        for (const C in y) {
          const j = y[C];
          if (typeof j != "object")
            continue;
          const { $data: U } = j.definition, K = S[C];
          U && K && (S[C] = B(K));
        }
      }
      return p;
    }
    _removeAllSchemas(p, E) {
      for (const y in p) {
        const u = p[y];
        (!E || E.test(y)) && (typeof u == "string" ? delete p[y] : u && !u.meta && (this._cache.delete(u.schema), delete p[y]));
      }
    }
    _addSchema(p, E, y, u = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: C } = this.opts;
      if (typeof p == "object")
        S = p[C];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      y = (0, c.normalizeId)(S || y);
      const U = c.getSchemaRefs.call(this, p, y);
      return j = new o.SchemaEnv({ schema: p, schemaId: C, meta: E, baseId: y, localRefs: U }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), u && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const E = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = E;
      }
    }
  }
  O.ValidationError = n.default, O.MissingRefError = s.default, t.default = O;
  function I(P, p, E, y = "error") {
    for (const u in P) {
      const f = u;
      f in p && this.logger[y](`${E}: option ${u}. ${P[f]}`);
    }
  }
  function q(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function D() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function Y() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function de(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const E = P[p];
      E.keyword || (E.keyword = p), this.addKeyword(E);
    }
  }
  function ge() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const Q = { log() {
  }, warn() {
  }, error() {
  } };
  function x(P) {
    if (P === !1)
      return Q;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ne = /^[a-z_$][a-z0-9_$:-]*$/i;
  function G(P, p) {
    const { RULES: E } = this;
    if ((0, l.eachItem)(P, (y) => {
      if (E.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!ne.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function he(P, p, E) {
    var y;
    const u = p == null ? void 0 : p.post;
    if (E && u)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = u ? f.post : f.rules.find(({ type: j }) => j === E);
    if (S || (S = { type: E, rules: [] }, f.rules.push(S)), f.keywords[P] = !0, !p)
      return;
    const C = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? Te.call(this, S, C, p.before) : S.rules.push(C), f.all[P] = C, (y = p.implements) === null || y === void 0 || y.forEach((j) => this.addKeyword(j));
  }
  function Te(P, p, E) {
    const y = P.rules.findIndex((u) => u.keyword === E);
    y >= 0 ? P.rules.splice(y, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${E} is not defined`));
  }
  function M(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = B(p)), P.validateSchema = this.compile(p, !0));
  }
  const L = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function B(P) {
    return { anyOf: [P, L] };
  }
})(mp);
var fc = {}, hc = {}, mc = {};
Object.defineProperty(mc, "__esModule", { value: !0 });
const W1 = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
mc.default = W1;
var Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.callRef = Cr.getValidate = void 0;
const X1 = vn, su = le, We = ie, Br = Et, au = Xe, $s = z, Y1 = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = au.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new X1.default(n.opts.uriResolver, s, r);
    if (l instanceof au.SchemaEnv)
      return _(l);
    return $(l);
    function h() {
      if (a === d)
        return Vs(t, o, a, a.$async);
      const w = e.scopeValue("root", { ref: d });
      return Vs(t, (0, We._)`${w}.validate`, d, d.$async);
    }
    function _(w) {
      const v = xp(t, w);
      Vs(t, v, w, w.$async);
    }
    function $(w) {
      const v = e.scopeValue("schema", i.code.source === !0 ? { ref: w, code: (0, We.stringify)(w) } : { ref: w }), g = e.name("valid"), m = t.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: We.nil,
        topSchemaRef: v,
        errSchemaPath: r
      }, g);
      t.mergeEvaluated(m), t.ok(g);
    }
  }
};
function xp(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, We._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
Cr.getValidate = xp;
function Vs(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, d = c.passContext ? Br.default.this : We.nil;
  n ? l() : h();
  function l() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, We._)`await ${(0, su.callValidateCode)(t, e, d)}`), $(e), o || s.assign(w, !0);
    }, (v) => {
      s.if((0, We._)`!(${v} instanceof ${a.ValidationError})`, () => s.throw(v)), _(v), o || s.assign(w, !1);
    }), t.ok(w);
  }
  function h() {
    t.result((0, su.callValidateCode)(t, e, d), () => $(e), () => _(e));
  }
  function _(w) {
    const v = (0, We._)`${w}.errors`;
    s.assign(Br.default.vErrors, (0, We._)`${Br.default.vErrors} === null ? ${v} : ${Br.default.vErrors}.concat(${v})`), s.assign(Br.default.errors, (0, We._)`${Br.default.vErrors}.length`);
  }
  function $(w) {
    var v;
    if (!a.opts.unevaluated)
      return;
    const g = (v = r == null ? void 0 : r.validate) === null || v === void 0 ? void 0 : v.evaluated;
    if (a.props !== !0)
      if (g && !g.dynamicProps)
        g.props !== void 0 && (a.props = $s.mergeEvaluated.props(s, g.props, a.props));
      else {
        const m = s.var("props", (0, We._)`${w}.evaluated.props`);
        a.props = $s.mergeEvaluated.props(s, m, a.props, We.Name);
      }
    if (a.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (a.items = $s.mergeEvaluated.items(s, g.items, a.items));
      else {
        const m = s.var("items", (0, We._)`${w}.evaluated.items`);
        a.items = $s.mergeEvaluated.items(s, m, a.items, We.Name);
      }
  }
}
Cr.callRef = Vs;
Cr.default = Y1;
Object.defineProperty(hc, "__esModule", { value: !0 });
const Z1 = mc, eN = Cr, tN = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Z1.default,
  eN.default
];
hc.default = tN;
var pc = {}, yc = {};
Object.defineProperty(yc, "__esModule", { value: !0 });
const Xs = ie, Kt = Xs.operators, Ys = {
  maximum: { okStr: "<=", ok: Kt.LTE, fail: Kt.GT },
  minimum: { okStr: ">=", ok: Kt.GTE, fail: Kt.LT },
  exclusiveMaximum: { okStr: "<", ok: Kt.LT, fail: Kt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Kt.GT, fail: Kt.LTE }
}, rN = {
  message: ({ keyword: t, schemaCode: e }) => (0, Xs.str)`must be ${Ys[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, Xs._)`{comparison: ${Ys[t].okStr}, limit: ${e}}`
}, nN = {
  keyword: Object.keys(Ys),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: rN,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, Xs._)`${r} ${Ys[e].fail} ${n} || isNaN(${r})`);
  }
};
yc.default = nN;
var $c = {};
Object.defineProperty($c, "__esModule", { value: !0 });
const Bn = ie, sN = {
  message: ({ schemaCode: t }) => (0, Bn.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, Bn._)`{multipleOf: ${t}}`
}, aN = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: sN,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, Bn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Bn._)`${o} !== parseInt(${o})`;
    t.fail$data((0, Bn._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
$c.default = aN;
var gc = {}, vc = {};
Object.defineProperty(vc, "__esModule", { value: !0 });
function Hp(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
vc.default = Hp;
Hp.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(gc, "__esModule", { value: !0 });
const Sr = ie, oN = z, iN = vc, cN = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, Sr.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, Sr._)`{limit: ${t}}`
}, lN = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: cN,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? Sr.operators.GT : Sr.operators.LT, o = s.opts.unicode === !1 ? (0, Sr._)`${r}.length` : (0, Sr._)`${(0, oN.useFunc)(t.gen, iN.default)}(${r})`;
    t.fail$data((0, Sr._)`${o} ${a} ${n}`);
  }
};
gc.default = lN;
var _c = {};
Object.defineProperty(_c, "__esModule", { value: !0 });
const uN = le, dN = z, Yr = ie, fN = {
  message: ({ schemaCode: t }) => (0, Yr.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, Yr._)`{pattern: ${t}}`
}, hN = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: fN,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t, i = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Yr._)`new RegExp` : (0, dN.useFunc)(e, c), l = e.let("valid");
      e.try(() => e.assign(l, (0, Yr._)`${d}(${a}, ${i}).test(${r})`), () => e.assign(l, !1)), t.fail$data((0, Yr._)`!${l}`);
    } else {
      const c = (0, uN.usePattern)(t, s);
      t.fail$data((0, Yr._)`!${c}.test(${r})`);
    }
  }
};
_c.default = hN;
var wc = {};
Object.defineProperty(wc, "__esModule", { value: !0 });
const Kn = ie, mN = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, Kn.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, Kn._)`{limit: ${t}}`
}, pN = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: mN,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? Kn.operators.GT : Kn.operators.LT;
    t.fail$data((0, Kn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
wc.default = pN;
var bc = {};
Object.defineProperty(bc, "__esModule", { value: !0 });
const In = le, Qn = ie, yN = z, $N = {
  message: ({ params: { missingProperty: t } }) => (0, Qn.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, Qn._)`{missingProperty: ${t}}`
}, gN = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: $N,
  code(t) {
    const { gen: e, schema: r, schemaCode: n, data: s, $data: a, it: o } = t, { opts: i } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= i.loopRequired;
    if (o.allErrors ? d() : l(), i.strictRequired) {
      const $ = t.parentSchema.properties, { definedProperties: w } = t.it;
      for (const v of r)
        if (($ == null ? void 0 : $[v]) === void 0 && !w.has(v)) {
          const g = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${v}" is not defined at "${g}" (strictRequired)`;
          (0, yN.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        t.block$data(Qn.nil, h);
      else
        for (const $ of r)
          (0, In.checkReportMissingProp)(t, $);
    }
    function l() {
      const $ = e.let("missing");
      if (c || a) {
        const w = e.let("valid", !0);
        t.block$data(w, () => _($, w)), t.ok(w);
      } else
        e.if((0, In.checkMissingProp)(t, r, $)), (0, In.reportMissingProp)(t, $), e.else();
    }
    function h() {
      e.forOf("prop", n, ($) => {
        t.setParams({ missingProperty: $ }), e.if((0, In.noPropertyInData)(e, s, $, i.ownProperties), () => t.error());
      });
    }
    function _($, w) {
      t.setParams({ missingProperty: $ }), e.forOf($, n, () => {
        e.assign(w, (0, In.propertyInData)(e, s, $, i.ownProperties)), e.if((0, Qn.not)(w), () => {
          t.error(), e.break();
        });
      }, Qn.nil);
    }
  }
};
bc.default = gN;
var Sc = {};
Object.defineProperty(Sc, "__esModule", { value: !0 });
const Gn = ie, vN = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, Gn.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, Gn._)`{limit: ${t}}`
}, _N = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: vN,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? Gn.operators.GT : Gn.operators.LT;
    t.fail$data((0, Gn._)`${r}.length ${s} ${n}`);
  }
};
Sc.default = _N;
var Ec = {}, os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
const Jp = fa;
Jp.code = 'require("ajv/dist/runtime/equal").default';
os.default = Jp;
Object.defineProperty(Ec, "__esModule", { value: !0 });
const Ha = Pe, Ie = ie, wN = z, bN = os, SN = {
  message: ({ params: { i: t, j: e } }) => (0, Ie.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, Ie._)`{i: ${t}, j: ${e}}`
}, EN = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: SN,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: i } = t;
    if (!n && !s)
      return;
    const c = e.let("valid"), d = a.items ? (0, Ha.getSchemaTypes)(a.items) : [];
    t.block$data(c, l, (0, Ie._)`${o} === false`), t.ok(c);
    function l() {
      const w = e.let("i", (0, Ie._)`${r}.length`), v = e.let("j");
      t.setParams({ i: w, j: v }), e.assign(c, !0), e.if((0, Ie._)`${w} > 1`, () => (h() ? _ : $)(w, v));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function _(w, v) {
      const g = e.name("item"), m = (0, Ha.checkDataTypes)(d, g, i.opts.strictNumbers, Ha.DataType.Wrong), b = e.const("indices", (0, Ie._)`{}`);
      e.for((0, Ie._)`;${w}--;`, () => {
        e.let(g, (0, Ie._)`${r}[${w}]`), e.if(m, (0, Ie._)`continue`), d.length > 1 && e.if((0, Ie._)`typeof ${g} == "string"`, (0, Ie._)`${g} += "_"`), e.if((0, Ie._)`typeof ${b}[${g}] == "number"`, () => {
          e.assign(v, (0, Ie._)`${b}[${g}]`), t.error(), e.assign(c, !1).break();
        }).code((0, Ie._)`${b}[${g}] = ${w}`);
      });
    }
    function $(w, v) {
      const g = (0, wN.useFunc)(e, bN.default), m = e.name("outer");
      e.label(m).for((0, Ie._)`;${w}--;`, () => e.for((0, Ie._)`${v} = ${w}; ${v}--;`, () => e.if((0, Ie._)`${g}(${r}[${w}], ${r}[${v}])`, () => {
        t.error(), e.assign(c, !1).break(m);
      })));
    }
  }
};
Ec.default = EN;
var Nc = {};
Object.defineProperty(Nc, "__esModule", { value: !0 });
const bo = ie, NN = z, PN = os, TN = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, bo._)`{allowedValue: ${t}}`
}, ON = {
  keyword: "const",
  $data: !0,
  error: TN,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, bo._)`!${(0, NN.useFunc)(e, PN.default)}(${r}, ${s})`) : t.fail((0, bo._)`${a} !== ${r}`);
  }
};
Nc.default = ON;
var Pc = {};
Object.defineProperty(Pc, "__esModule", { value: !0 });
const kn = ie, RN = z, IN = os, jN = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, kn._)`{allowedValues: ${t}}`
}, CN = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: jN,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, RN.useFunc)(e, IN.default));
    let l;
    if (i || n)
      l = e.let("valid"), t.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const $ = e.const("vSchema", a);
      l = (0, kn.or)(...s.map((w, v) => _($, v)));
    }
    t.pass(l);
    function h() {
      e.assign(l, !1), e.forOf("v", a, ($) => e.if((0, kn._)`${d()}(${r}, ${$})`, () => e.assign(l, !0).break()));
    }
    function _($, w) {
      const v = s[w];
      return typeof v == "object" && v !== null ? (0, kn._)`${d()}(${r}, ${$}[${w}])` : (0, kn._)`${r} === ${v}`;
    }
  }
};
Pc.default = CN;
Object.defineProperty(pc, "__esModule", { value: !0 });
const AN = yc, kN = $c, LN = gc, DN = _c, MN = wc, VN = bc, FN = Sc, qN = Ec, zN = Nc, UN = Pc, BN = [
  // number
  AN.default,
  kN.default,
  // string
  LN.default,
  DN.default,
  // object
  MN.default,
  VN.default,
  // array
  FN.default,
  qN.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  zN.default,
  UN.default
];
pc.default = BN;
var Tc = {}, _n = {};
Object.defineProperty(_n, "__esModule", { value: !0 });
_n.validateAdditionalItems = void 0;
const Er = ie, So = z, KN = {
  message: ({ params: { len: t } }) => (0, Er.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, Er._)`{limit: ${t}}`
}, QN = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: KN,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, So.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Wp(t, n);
  }
};
function Wp(t, e) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = t;
  o.items = !0;
  const i = r.const("len", (0, Er._)`${s}.length`);
  if (n === !1)
    t.setParams({ len: e.length }), t.pass((0, Er._)`${i} <= ${e.length}`);
  else if (typeof n == "object" && !(0, So.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, Er._)`${i} <= ${e.length}`);
    r.if((0, Er.not)(d), () => c(d)), t.ok(d);
  }
  function c(d) {
    r.forRange("i", e.length, i, (l) => {
      t.subschema({ keyword: a, dataProp: l, dataPropType: So.Type.Num }, d), o.allErrors || r.if((0, Er.not)(d), () => r.break());
    });
  }
}
_n.validateAdditionalItems = Wp;
_n.default = QN;
var Oc = {}, wn = {};
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.validateTuple = void 0;
const ou = ie, Fs = z, GN = le, xN = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return Xp(t, "additionalItems", e);
    r.items = !0, !(0, Fs.alwaysValidSchema)(r, e) && t.ok((0, GN.validateArray)(t));
  }
};
function Xp(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  l(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = Fs.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), d = n.const("len", (0, ou._)`${a}.length`);
  r.forEach((h, _) => {
    (0, Fs.alwaysValidSchema)(i, h) || (n.if((0, ou._)`${d} > ${_}`, () => t.subschema({
      keyword: o,
      schemaProp: _,
      dataProp: _
    }, c)), t.ok(c));
  });
  function l(h) {
    const { opts: _, errSchemaPath: $ } = i, w = r.length, v = w === h.minItems && (w === h.maxItems || h[e] === !1);
    if (_.strictTuples && !v) {
      const g = `"${o}" is ${w}-tuple, but minItems or maxItems/${e} are not specified or different at path "${$}"`;
      (0, Fs.checkStrictMode)(i, g, _.strictTuples);
    }
  }
}
wn.validateTuple = Xp;
wn.default = xN;
Object.defineProperty(Oc, "__esModule", { value: !0 });
const HN = wn, JN = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, HN.validateTuple)(t, "items")
};
Oc.default = JN;
var Rc = {};
Object.defineProperty(Rc, "__esModule", { value: !0 });
const iu = ie, WN = z, XN = le, YN = _n, ZN = {
  message: ({ params: { len: t } }) => (0, iu.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, iu._)`{limit: ${t}}`
}, eP = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: ZN,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, WN.alwaysValidSchema)(n, e) && (s ? (0, YN.validateAdditionalItems)(t, s) : t.ok((0, XN.validateArray)(t)));
  }
};
Rc.default = eP;
var Ic = {};
Object.defineProperty(Ic, "__esModule", { value: !0 });
const at = ie, gs = z, tP = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, at.str)`must contain at least ${t} valid item(s)` : (0, at.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, at._)`{minContains: ${t}}` : (0, at._)`{minContains: ${t}, maxContains: ${e}}`
}, rP = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: tP,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    let o, i;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, i = d) : o = 1;
    const l = e.const("len", (0, at._)`${s}.length`);
    if (t.setParams({ min: o, max: i }), i === void 0 && o === 0) {
      (0, gs.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (i !== void 0 && o > i) {
      (0, gs.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), t.fail();
      return;
    }
    if ((0, gs.alwaysValidSchema)(a, r)) {
      let v = (0, at._)`${l} >= ${o}`;
      i !== void 0 && (v = (0, at._)`${v} && ${l} <= ${i}`), t.pass(v);
      return;
    }
    a.items = !0;
    const h = e.name("valid");
    i === void 0 && o === 1 ? $(h, () => e.if(h, () => e.break())) : o === 0 ? (e.let(h, !0), i !== void 0 && e.if((0, at._)`${s}.length > 0`, _)) : (e.let(h, !1), _()), t.result(h, () => t.reset());
    function _() {
      const v = e.name("_valid"), g = e.let("count", 0);
      $(v, () => e.if(v, () => w(g)));
    }
    function $(v, g) {
      e.forRange("i", 0, l, (m) => {
        t.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: gs.Type.Num,
          compositeRule: !0
        }, v), g();
      });
    }
    function w(v) {
      e.code((0, at._)`${v}++`), i === void 0 ? e.if((0, at._)`${v} >= ${o}`, () => e.assign(h, !0).break()) : (e.if((0, at._)`${v} > ${i}`, () => e.assign(h, !1).break()), o === 1 ? e.assign(h, !0) : e.if((0, at._)`${v} >= ${o}`, () => e.assign(h, !0)));
    }
  }
};
Ic.default = rP;
var Yp = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.validateSchemaDeps = t.validatePropertyDeps = t.error = void 0;
  const e = ie, r = z, n = le;
  t.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, e.str)`must have ${h} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: h } }) => (0, e._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${l}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: t.error,
    code(c) {
      const [d, l] = a(c);
      o(c, d), i(c, l);
    }
  };
  function a({ schema: c }) {
    const d = {}, l = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const _ = Array.isArray(c[h]) ? d : l;
      _[h] = c[h];
    }
    return [d, l];
  }
  function o(c, d = c.schema) {
    const { gen: l, data: h, it: _ } = c;
    if (Object.keys(d).length === 0)
      return;
    const $ = l.let("missing");
    for (const w in d) {
      const v = d[w];
      if (v.length === 0)
        continue;
      const g = (0, n.propertyInData)(l, h, w, _.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: v.length,
        deps: v.join(", ")
      }), _.allErrors ? l.if(g, () => {
        for (const m of v)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, e._)`${g} && (${(0, n.checkMissingProp)(c, v, $)})`), (0, n.reportMissingProp)(c, $), l.else());
    }
  }
  t.validatePropertyDeps = o;
  function i(c, d = c.schema) {
    const { gen: l, data: h, keyword: _, it: $ } = c, w = l.name("valid");
    for (const v in d)
      (0, r.alwaysValidSchema)($, d[v]) || (l.if(
        (0, n.propertyInData)(l, h, v, $.opts.ownProperties),
        () => {
          const g = c.subschema({ keyword: _, schemaProp: v }, w);
          c.mergeValidEvaluated(g, w);
        },
        () => l.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  t.validateSchemaDeps = i, t.default = s;
})(Yp);
var jc = {};
Object.defineProperty(jc, "__esModule", { value: !0 });
const Zp = ie, nP = z, sP = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, Zp._)`{propertyName: ${t.propertyName}}`
}, aP = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: sP,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, nP.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, Zp.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
jc.default = aP;
var ba = {};
Object.defineProperty(ba, "__esModule", { value: !0 });
const vs = le, dt = ie, oP = Et, _s = z, iP = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, dt._)`{additionalProperty: ${t.additionalProperty}}`
}, cP = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: iP,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, _s.alwaysValidSchema)(o, r))
      return;
    const d = (0, vs.allSchemaProperties)(n.properties), l = (0, vs.allSchemaProperties)(n.patternProperties);
    h(), t.ok((0, dt._)`${a} === ${oP.default.errors}`);
    function h() {
      e.forIn("key", s, (g) => {
        !d.length && !l.length ? w(g) : e.if(_(g), () => w(g));
      });
    }
    function _(g) {
      let m;
      if (d.length > 8) {
        const b = (0, _s.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, vs.isOwnProperty)(e, b, g);
      } else d.length ? m = (0, dt.or)(...d.map((b) => (0, dt._)`${g} === ${b}`)) : m = dt.nil;
      return l.length && (m = (0, dt.or)(m, ...l.map((b) => (0, dt._)`${(0, vs.usePattern)(t, b)}.test(${g})`))), (0, dt.not)(m);
    }
    function $(g) {
      e.code((0, dt._)`delete ${s}[${g}]`);
    }
    function w(g) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        $(g);
        return;
      }
      if (r === !1) {
        t.setParams({ additionalProperty: g }), t.error(), i || e.break();
        return;
      }
      if (typeof r == "object" && !(0, _s.alwaysValidSchema)(o, r)) {
        const m = e.name("valid");
        c.removeAdditional === "failing" ? (v(g, m, !1), e.if((0, dt.not)(m), () => {
          t.reset(), $(g);
        })) : (v(g, m), i || e.if((0, dt.not)(m), () => e.break()));
      }
    }
    function v(g, m, b) {
      const T = {
        keyword: "additionalProperties",
        dataProp: g,
        dataPropType: _s.Type.Str
      };
      b === !1 && Object.assign(T, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), t.subschema(T, m);
    }
  }
};
ba.default = cP;
var Cc = {};
Object.defineProperty(Cc, "__esModule", { value: !0 });
const lP = yt, cu = le, Ja = z, lu = ba, uP = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && lu.default.code(new lP.KeywordCxt(a, lu.default, "additionalProperties"));
    const o = (0, cu.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Ja.mergeEvaluated.props(e, (0, Ja.toHash)(o), a.props));
    const i = o.filter((h) => !(0, Ja.alwaysValidSchema)(a, r[h]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const h of i)
      d(h) ? l(h) : (e.if((0, cu.propertyInData)(e, s, h, a.opts.ownProperties)), l(h), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(h), t.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function l(h) {
      t.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Cc.default = uP;
var Ac = {};
Object.defineProperty(Ac, "__esModule", { value: !0 });
const uu = le, ws = ie, du = z, fu = z, dP = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, uu.allSchemaProperties)(r), c = i.filter((v) => (0, du.alwaysValidSchema)(a, r[v]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = e.name("valid");
    a.props !== !0 && !(a.props instanceof ws.Name) && (a.props = (0, fu.evaluatedPropsToName)(e, a.props));
    const { props: h } = a;
    _();
    function _() {
      for (const v of i)
        d && $(v), a.allErrors ? w(v) : (e.var(l, !0), w(v), e.if(l));
    }
    function $(v) {
      for (const g in d)
        new RegExp(v).test(g) && (0, du.checkStrictMode)(a, `property ${g} matches pattern ${v} (use allowMatchingProperties)`);
    }
    function w(v) {
      e.forIn("key", n, (g) => {
        e.if((0, ws._)`${(0, uu.usePattern)(t, v)}.test(${g})`, () => {
          const m = c.includes(v);
          m || t.subschema({
            keyword: "patternProperties",
            schemaProp: v,
            dataProp: g,
            dataPropType: fu.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? e.assign((0, ws._)`${h}[${g}]`, !0) : !m && !a.allErrors && e.if((0, ws.not)(l), () => e.break());
        });
      });
    }
  }
};
Ac.default = dP;
var kc = {};
Object.defineProperty(kc, "__esModule", { value: !0 });
const fP = z, hP = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, fP.alwaysValidSchema)(n, r)) {
      t.fail();
      return;
    }
    const s = e.name("valid");
    t.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), t.failResult(s, () => t.reset(), () => t.error());
  },
  error: { message: "must NOT be valid" }
};
kc.default = hP;
var Lc = {};
Object.defineProperty(Lc, "__esModule", { value: !0 });
const mP = le, pP = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: mP.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Lc.default = pP;
var Dc = {};
Object.defineProperty(Dc, "__esModule", { value: !0 });
const qs = ie, yP = z, $P = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, qs._)`{passingSchemas: ${t.passing}}`
}, gP = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: $P,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, it: s } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = e.let("valid", !1), i = e.let("passing", null), c = e.name("_valid");
    t.setParams({ passing: i }), e.block(d), t.result(o, () => t.reset(), () => t.error(!0));
    function d() {
      a.forEach((l, h) => {
        let _;
        (0, yP.alwaysValidSchema)(s, l) ? e.var(c, !0) : _ = t.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && e.if((0, qs._)`${c} && ${o}`).assign(o, !1).assign(i, (0, qs._)`[${i}, ${h}]`).else(), e.if(c, () => {
          e.assign(o, !0), e.assign(i, h), _ && t.mergeEvaluated(_, qs.Name);
        });
      });
    }
  }
};
Dc.default = gP;
var Mc = {};
Object.defineProperty(Mc, "__esModule", { value: !0 });
const vP = z, _P = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, vP.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
Mc.default = _P;
var Vc = {};
Object.defineProperty(Vc, "__esModule", { value: !0 });
const Zs = ie, ey = z, wP = {
  message: ({ params: t }) => (0, Zs.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, Zs._)`{failingKeyword: ${t.ifClause}}`
}, bP = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: wP,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, ey.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = hu(n, "then"), a = hu(n, "else");
    if (!s && !a)
      return;
    const o = e.let("valid", !0), i = e.name("_valid");
    if (c(), t.reset(), s && a) {
      const l = e.let("ifClause");
      t.setParams({ ifClause: l }), e.if(i, d("then", l), d("else", l));
    } else s ? e.if(i, d("then")) : e.if((0, Zs.not)(i), d("else"));
    t.pass(o, () => t.error(!0));
    function c() {
      const l = t.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, i);
      t.mergeEvaluated(l);
    }
    function d(l, h) {
      return () => {
        const _ = t.subschema({ keyword: l }, i);
        e.assign(o, i), t.mergeValidEvaluated(_, o), h ? e.assign(h, (0, Zs._)`${l}`) : t.setParams({ ifClause: l });
      };
    }
  }
};
function hu(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, ey.alwaysValidSchema)(t, r);
}
Vc.default = bP;
var Fc = {};
Object.defineProperty(Fc, "__esModule", { value: !0 });
const SP = z, EP = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, SP.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
Fc.default = EP;
Object.defineProperty(Tc, "__esModule", { value: !0 });
const NP = _n, PP = Oc, TP = wn, OP = Rc, RP = Ic, IP = Yp, jP = jc, CP = ba, AP = Cc, kP = Ac, LP = kc, DP = Lc, MP = Dc, VP = Mc, FP = Vc, qP = Fc;
function zP(t = !1) {
  const e = [
    // any
    LP.default,
    DP.default,
    MP.default,
    VP.default,
    FP.default,
    qP.default,
    // object
    jP.default,
    CP.default,
    IP.default,
    AP.default,
    kP.default
  ];
  return t ? e.push(PP.default, OP.default) : e.push(NP.default, TP.default), e.push(RP.default), e;
}
Tc.default = zP;
var qc = {}, zc = {};
Object.defineProperty(zc, "__esModule", { value: !0 });
const Se = ie, UP = {
  message: ({ schemaCode: t }) => (0, Se.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, Se._)`{format: ${t}}`
}, BP = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: UP,
  code(t, e) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = i;
    if (!c.validateFormats)
      return;
    s ? _() : $();
    function _() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), v = r.const("fDef", (0, Se._)`${w}[${o}]`), g = r.let("fType"), m = r.let("format");
      r.if((0, Se._)`typeof ${v} == "object" && !(${v} instanceof RegExp)`, () => r.assign(g, (0, Se._)`${v}.type || "string"`).assign(m, (0, Se._)`${v}.validate`), () => r.assign(g, (0, Se._)`"string"`).assign(m, v)), t.fail$data((0, Se.or)(b(), T()));
      function b() {
        return c.strictSchema === !1 ? Se.nil : (0, Se._)`${o} && !${m}`;
      }
      function T() {
        const O = l.$async ? (0, Se._)`(${v}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, Se._)`${m}(${n})`, I = (0, Se._)`(typeof ${m} == "function" ? ${O} : ${m}.test(${n}))`;
        return (0, Se._)`${m} && ${m} !== true && ${g} === ${e} && !${I}`;
      }
    }
    function $() {
      const w = h.formats[a];
      if (!w) {
        b();
        return;
      }
      if (w === !0)
        return;
      const [v, g, m] = T(w);
      v === e && t.pass(O());
      function b() {
        if (c.strictSchema === !1) {
          h.logger.warn(I());
          return;
        }
        throw new Error(I());
        function I() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function T(I) {
        const q = I instanceof RegExp ? (0, Se.regexpCode)(I) : c.code.formats ? (0, Se._)`${c.code.formats}${(0, Se.getProperty)(a)}` : void 0, D = r.scopeValue("formats", { key: a, ref: I, code: q });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, Se._)`${D}.validate`] : ["string", I, D];
      }
      function O() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Se._)`await ${m}(${n})`;
        }
        return typeof g == "function" ? (0, Se._)`${m}(${n})` : (0, Se._)`${m}.test(${n})`;
      }
    }
  }
};
zc.default = BP;
Object.defineProperty(qc, "__esModule", { value: !0 });
const KP = zc, QP = [KP.default];
qc.default = QP;
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.contentVocabulary = dn.metadataVocabulary = void 0;
dn.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
dn.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(fc, "__esModule", { value: !0 });
const GP = hc, xP = pc, HP = Tc, JP = qc, mu = dn, WP = [
  GP.default,
  xP.default,
  (0, HP.default)(),
  JP.default,
  mu.metadataVocabulary,
  mu.contentVocabulary
];
fc.default = WP;
var Uc = {}, Sa = {};
Object.defineProperty(Sa, "__esModule", { value: !0 });
Sa.DiscrError = void 0;
var pu;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(pu || (Sa.DiscrError = pu = {}));
Object.defineProperty(Uc, "__esModule", { value: !0 });
const xr = ie, Eo = Sa, yu = Xe, XP = vn, YP = z, ZP = {
  message: ({ params: { discrError: t, tagName: e } }) => t === Eo.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, xr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, eT = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: ZP,
  code(t) {
    const { gen: e, data: r, schema: n, parentSchema: s, it: a } = t, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const i = n.propertyName;
    if (typeof i != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = e.let("valid", !1), d = e.const("tag", (0, xr._)`${r}${(0, xr.getProperty)(i)}`);
    e.if((0, xr._)`typeof ${d} == "string"`, () => l(), () => t.error(!1, { discrError: Eo.DiscrError.Tag, tag: d, tagName: i })), t.ok(c);
    function l() {
      const $ = _();
      e.if(!1);
      for (const w in $)
        e.elseIf((0, xr._)`${d} === ${w}`), e.assign(c, h($[w]));
      e.else(), t.error(!1, { discrError: Eo.DiscrError.Mapping, tag: d, tagName: i }), e.endIf();
    }
    function h($) {
      const w = e.name("valid"), v = t.subschema({ keyword: "oneOf", schemaProp: $ }, w);
      return t.mergeEvaluated(v, xr.Name), w;
    }
    function _() {
      var $;
      const w = {}, v = m(s);
      let g = !0;
      for (let O = 0; O < o.length; O++) {
        let I = o[O];
        if (I != null && I.$ref && !(0, YP.schemaHasRulesButRef)(I, a.self.RULES)) {
          const D = I.$ref;
          if (I = yu.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, D), I instanceof yu.SchemaEnv && (I = I.schema), I === void 0)
            throw new XP.default(a.opts.uriResolver, a.baseId, D);
        }
        const q = ($ = I == null ? void 0 : I.properties) === null || $ === void 0 ? void 0 : $[i];
        if (typeof q != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`);
        g = g && (v || m(I)), b(q, O);
      }
      if (!g)
        throw new Error(`discriminator: "${i}" must be required`);
      return w;
      function m({ required: O }) {
        return Array.isArray(O) && O.includes(i);
      }
      function b(O, I) {
        if (O.const)
          T(O.const, I);
        else if (O.enum)
          for (const q of O.enum)
            T(q, I);
        else
          throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
      }
      function T(O, I) {
        if (typeof O != "string" || O in w)
          throw new Error(`discriminator: "${i}" values must be unique strings`);
        w[O] = I;
      }
    }
  }
};
Uc.default = eT;
const tT = "http://json-schema.org/draft-07/schema#", rT = "http://json-schema.org/draft-07/schema#", nT = "Core schema meta-schema", sT = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, aT = [
  "object",
  "boolean"
], oT = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, iT = {
  $schema: tT,
  $id: rT,
  title: nT,
  definitions: sT,
  type: aT,
  properties: oT,
  default: !0
};
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const r = mp, n = fc, s = Uc, a = iT, o = ["/properties"], i = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((w) => this.addVocabulary(w)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const w = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(w, i, !1), this.refs["http://json-schema.org/schema"] = i;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(i) ? i : void 0);
    }
  }
  e.Ajv = c, t.exports = e = c, t.exports.Ajv = c, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = c;
  var d = yt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var l = ie;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var h = as;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var _ = vn;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return _.default;
  } });
})($o, $o.exports);
var cT = $o.exports;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.formatLimitDefinition = void 0;
  const e = cT, r = ie, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: i, schemaCode: c }) => (0, r.str)`should be ${s[i].okStr} ${c}`,
    params: ({ keyword: i, schemaCode: c }) => (0, r._)`{comparison: ${s[i].okStr}, limit: ${c}}`
  };
  t.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(i) {
      const { gen: c, data: d, schemaCode: l, keyword: h, it: _ } = i, { opts: $, self: w } = _;
      if (!$.validateFormats)
        return;
      const v = new e.KeywordCxt(_, w.RULES.all.format.definition, "format");
      v.$data ? g() : m();
      function g() {
        const T = c.scopeValue("formats", {
          ref: w.formats,
          code: $.code.formats
        }), O = c.const("fmt", (0, r._)`${T}[${v.schemaCode}]`);
        i.fail$data((0, r.or)((0, r._)`typeof ${O} != "object"`, (0, r._)`${O} instanceof RegExp`, (0, r._)`typeof ${O}.compare != "function"`, b(O)));
      }
      function m() {
        const T = v.schema, O = w.formats[T];
        if (!O || O === !0)
          return;
        if (typeof O != "object" || O instanceof RegExp || typeof O.compare != "function")
          throw new Error(`"${h}": format "${T}" does not define "compare" function`);
        const I = c.scopeValue("formats", {
          key: T,
          ref: O,
          code: $.code.formats ? (0, r._)`${$.code.formats}${(0, r.getProperty)(T)}` : void 0
        });
        i.fail$data(b(I));
      }
      function b(T) {
        return (0, r._)`${T}.compare(${d}, ${l}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (i) => (i.addKeyword(t.formatLimitDefinition), i);
  t.default = o;
})(hp);
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 });
  const r = fp, n = hp, s = ie, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), i = (d, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(d, l, r.fullFormats, a), d;
    const [h, _] = l.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], $ = l.formats || r.formatNames;
    return c(d, $, h, _), l.keywords && (0, n.default)(d), d;
  };
  i.get = (d, l = "full") => {
    const _ = (l === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!_)
      throw new Error(`Unknown format "${d}"`);
    return _;
  };
  function c(d, l, h, _) {
    var $, w;
    ($ = (w = d.opts.code).formats) !== null && $ !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${_}`);
    for (const v of l)
      d.addFormat(v, h[v]);
  }
  t.exports = e = i, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = i;
})(yo, yo.exports);
var lT = yo.exports;
const uT = /* @__PURE__ */ cm(lT), dT = (t, e, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(t, r), a = Object.getOwnPropertyDescriptor(e, r);
  !fT(s, a) && n || Object.defineProperty(t, r, a);
}, fT = function(t, e) {
  return t === void 0 || t.configurable || t.writable === e.writable && t.enumerable === e.enumerable && t.configurable === e.configurable && (t.writable || t.value === e.value);
}, hT = (t, e) => {
  const r = Object.getPrototypeOf(e);
  r !== Object.getPrototypeOf(t) && Object.setPrototypeOf(t, r);
}, mT = (t, e) => `/* Wrapped ${t}*/
${e}`, pT = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), yT = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), $T = (t, e, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = mT.bind(null, n, e.toString());
  Object.defineProperty(s, "name", yT);
  const { writable: a, enumerable: o, configurable: i } = pT;
  Object.defineProperty(t, "toString", { value: s, writable: a, enumerable: o, configurable: i });
};
function gT(t, e, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = t;
  for (const s of Reflect.ownKeys(e))
    dT(t, e, s, r);
  return hT(t, e), $T(t, e, n), t;
}
const $u = (t, e = {}) => {
  if (typeof t != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof t}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: a = !0
  } = e;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, i, c;
  const d = function(...l) {
    const h = this, _ = () => {
      o = void 0, i && (clearTimeout(i), i = void 0), a && (c = t.apply(h, l));
    }, $ = () => {
      i = void 0, o && (clearTimeout(o), o = void 0), a && (c = t.apply(h, l));
    }, w = s && !o;
    return clearTimeout(o), o = setTimeout(_, r), n > 0 && n !== Number.POSITIVE_INFINITY && !i && (i = setTimeout($, n)), w && (c = t.apply(h, l)), c;
  };
  return gT(d, t), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), i && (clearTimeout(i), i = void 0);
  }, d;
};
var No = { exports: {} };
const vT = "2.0.0", ty = 256, _T = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, wT = 16, bT = ty - 6, ST = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var is = {
  MAX_LENGTH: ty,
  MAX_SAFE_COMPONENT_LENGTH: wT,
  MAX_SAFE_BUILD_LENGTH: bT,
  MAX_SAFE_INTEGER: _T,
  RELEASE_TYPES: ST,
  SEMVER_SPEC_VERSION: vT,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const ET = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
};
var Ea = ET;
(function(t, e) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = is, a = Ea;
  e = t.exports = {};
  const o = e.re = [], i = e.safeRe = [], c = e.src = [], d = e.safeSrc = [], l = e.t = {};
  let h = 0;
  const _ = "[a-zA-Z0-9-]", $ = [
    ["\\s", 1],
    ["\\d", s],
    [_, n]
  ], w = (g) => {
    for (const [m, b] of $)
      g = g.split(`${m}*`).join(`${m}{0,${b}}`).split(`${m}+`).join(`${m}{1,${b}}`);
    return g;
  }, v = (g, m, b) => {
    const T = w(m), O = h++;
    a(g, O, m), l[g] = O, c[O] = m, d[O] = T, o[O] = new RegExp(m, b ? "g" : void 0), i[O] = new RegExp(T, b ? "g" : void 0);
  };
  v("NUMERICIDENTIFIER", "0|[1-9]\\d*"), v("NUMERICIDENTIFIERLOOSE", "\\d+"), v("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${_}*`), v("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), v("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), v("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), v("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), v("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), v("BUILDIDENTIFIER", `${_}+`), v("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), v("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), v("FULL", `^${c[l.FULLPLAIN]}$`), v("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), v("LOOSE", `^${c[l.LOOSEPLAIN]}$`), v("GTLT", "((?:<|>)?=?)"), v("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), v("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), v("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), v("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), v("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), v("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), v("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), v("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), v("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), v("COERCERTL", c[l.COERCE], !0), v("COERCERTLFULL", c[l.COERCEFULL], !0), v("LONETILDE", "(?:~>?)"), v("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", v("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), v("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), v("LONECARET", "(?:\\^)"), v("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", v("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), v("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), v("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), v("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), v("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", v("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), v("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), v("STAR", "(<|>)?=?\\s*\\*"), v("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), v("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(No, No.exports);
var cs = No.exports;
const NT = Object.freeze({ loose: !0 }), PT = Object.freeze({}), TT = (t) => t ? typeof t != "object" ? NT : t : PT;
var Bc = TT;
const gu = /^[0-9]+$/, ry = (t, e) => {
  if (typeof t == "number" && typeof e == "number")
    return t === e ? 0 : t < e ? -1 : 1;
  const r = gu.test(t), n = gu.test(e);
  return r && n && (t = +t, e = +e), t === e ? 0 : r && !n ? -1 : n && !r ? 1 : t < e ? -1 : 1;
}, OT = (t, e) => ry(e, t);
var ny = {
  compareIdentifiers: ry,
  rcompareIdentifiers: OT
};
const bs = Ea, { MAX_LENGTH: vu, MAX_SAFE_INTEGER: Ss } = is, { safeRe: Es, t: Ns } = cs, RT = Bc, { compareIdentifiers: Po } = ny, IT = (t, e) => {
  const r = e.split(".");
  if (r.length > t.length)
    return !1;
  for (let n = 0; n < r.length; n++)
    if (Po(t[n], r[n]) !== 0)
      return !1;
  return !0;
};
let jT = class vt {
  constructor(e, r) {
    if (r = RT(r), e instanceof vt) {
      if (e.loose === !!r.loose && e.includePrerelease === !!r.includePrerelease)
        return e;
      e = e.version;
    } else if (typeof e != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);
    if (e.length > vu)
      throw new TypeError(
        `version is longer than ${vu} characters`
      );
    bs("SemVer", e, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = e.trim().match(r.loose ? Es[Ns.LOOSE] : Es[Ns.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${e}`);
    if (this.raw = e, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Ss || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Ss || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Ss || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < Ss)
          return a;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(e) {
    if (bs("SemVer.compare", this.version, this.options, e), !(e instanceof vt)) {
      if (typeof e == "string" && e === this.version)
        return 0;
      e = new vt(e, this.options);
    }
    return e.version === this.version ? 0 : this.compareMain(e) || this.comparePre(e);
  }
  compareMain(e) {
    return e instanceof vt || (e = new vt(e, this.options)), this.major < e.major ? -1 : this.major > e.major ? 1 : this.minor < e.minor ? -1 : this.minor > e.minor ? 1 : this.patch < e.patch ? -1 : this.patch > e.patch ? 1 : 0;
  }
  comparePre(e) {
    if (e instanceof vt || (e = new vt(e, this.options)), this.prerelease.length && !e.prerelease.length)
      return -1;
    if (!this.prerelease.length && e.prerelease.length)
      return 1;
    if (!this.prerelease.length && !e.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = e.prerelease[r];
      if (bs("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Po(n, s);
    } while (++r);
  }
  compareBuild(e) {
    e instanceof vt || (e = new vt(e, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = e.build[r];
      if (bs("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Po(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(e, r, n) {
    if (e.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? Es[Ns.PRERELEASELOOSE] : Es[Ns.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (e) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          if (n === !1 && (a = [r]), IT(this.prerelease, r)) {
            const o = this.prerelease[r.split(".").length];
            isNaN(o) && (this.prerelease = a);
          } else
            this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${e}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Be = jT;
const _u = Be, CT = (t, e, r = !1) => {
  if (t instanceof _u)
    return t;
  try {
    return new _u(t, e);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Mr = CT;
const AT = Mr, kT = (t, e) => {
  const r = AT(t, e);
  return r ? r.version : null;
};
var LT = kT;
const DT = Mr, MT = (t, e) => {
  const r = DT(t.trim().replace(/^[=v]+/, ""), e);
  return r ? r.version : null;
};
var VT = MT;
const wu = Be, FT = (t, e, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new wu(
      t instanceof wu ? t.version : t,
      r
    ).inc(e, n, s).version;
  } catch {
    return null;
  }
};
var qT = FT;
const bu = Mr, zT = (t, e) => {
  const r = bu(t, null, !0), n = bu(e, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, i = a ? n : r, c = !!o.prerelease.length;
  if (!!i.prerelease.length && !c) {
    if (!i.patch && !i.minor)
      return "major";
    if (i.compareMain(o) === 0)
      return i.minor && !i.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var UT = zT;
const BT = Be, KT = (t, e) => new BT(t, e).major;
var QT = KT;
const GT = Be, xT = (t, e) => new GT(t, e).minor;
var HT = xT;
const JT = Be, WT = (t, e) => new JT(t, e).patch;
var XT = WT;
const YT = Mr, ZT = (t, e) => {
  const r = YT(t, e);
  return r && r.prerelease.length ? r.prerelease : null;
};
var eO = ZT;
const Su = Be, tO = (t, e, r) => new Su(t, r).compare(new Su(e, r));
var $t = tO;
const rO = $t, nO = (t, e, r) => rO(e, t, r);
var sO = nO;
const aO = $t, oO = (t, e) => aO(t, e, !0);
var iO = oO;
const Eu = Be, cO = (t, e, r) => {
  const n = new Eu(t, r), s = new Eu(e, r);
  return n.compare(s) || n.compareBuild(s);
};
var Kc = cO;
const lO = Kc, uO = (t, e) => t.sort((r, n) => lO(r, n, e));
var dO = uO;
const fO = Kc, hO = (t, e) => t.sort((r, n) => fO(n, r, e));
var mO = hO;
const pO = $t, yO = (t, e, r) => pO(t, e, r) > 0;
var Na = yO;
const $O = $t, gO = (t, e, r) => $O(t, e, r) < 0;
var Qc = gO;
const vO = $t, _O = (t, e, r) => vO(t, e, r) === 0;
var sy = _O;
const wO = $t, bO = (t, e, r) => wO(t, e, r) !== 0;
var ay = bO;
const SO = $t, EO = (t, e, r) => SO(t, e, r) >= 0;
var Gc = EO;
const NO = $t, PO = (t, e, r) => NO(t, e, r) <= 0;
var xc = PO;
const TO = sy, OO = ay, RO = Na, IO = Gc, jO = Qc, CO = xc, AO = (t, e, r, n) => {
  switch (e) {
    case "===":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t === r;
    case "!==":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t !== r;
    case "":
    case "=":
    case "==":
      return TO(t, r, n);
    case "!=":
      return OO(t, r, n);
    case ">":
      return RO(t, r, n);
    case ">=":
      return IO(t, r, n);
    case "<":
      return jO(t, r, n);
    case "<=":
      return CO(t, r, n);
    default:
      throw new TypeError(`Invalid operator: ${e}`);
  }
};
var oy = AO;
const kO = Be, LO = Mr, { safeRe: Ps, t: Ts } = cs, DO = (t, e) => {
  if (t instanceof kO)
    return t;
  if (typeof t == "number" && (t = String(t)), typeof t != "string")
    return null;
  e = e || {};
  let r = null;
  if (!e.rtl)
    r = t.match(e.includePrerelease ? Ps[Ts.COERCEFULL] : Ps[Ts.COERCE]);
  else {
    const c = e.includePrerelease ? Ps[Ts.COERCERTLFULL] : Ps[Ts.COERCERTL];
    let d;
    for (; (d = c.exec(t)) && (!r || r.index + r[0].length !== t.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = e.includePrerelease && r[5] ? `-${r[5]}` : "", i = e.includePrerelease && r[6] ? `+${r[6]}` : "";
  return LO(`${n}.${s}.${a}${o}${i}`, e);
};
var MO = DO;
const VO = Mr, FO = is, qO = Be, zO = (t, e, r) => {
  if (!FO.RELEASE_TYPES.includes(e))
    return null;
  const n = UO(t, r);
  return n && BO(n, e);
}, UO = (t, e) => {
  const r = t instanceof qO ? t.version : t;
  return VO(r, e);
}, BO = (t, e) => {
  if (KO(e))
    return t.version;
  switch (t.prerelease = [], e) {
    case "major":
      t.minor = 0, t.patch = 0;
      break;
    case "minor":
      t.patch = 0;
      break;
  }
  return t.format();
}, KO = (t) => t.startsWith("pre");
var QO = zO;
class GO {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(e) {
    const r = this.map.get(e);
    if (r !== void 0)
      return this.map.delete(e), this.map.set(e, r), r;
  }
  delete(e) {
    return this.map.delete(e);
  }
  set(e, r) {
    if (!this.delete(e) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(e, r);
    }
    return this;
  }
}
var xO = GO, Wa, Nu;
function gt() {
  if (Nu) return Wa;
  Nu = 1;
  const t = /\s+/g;
  class e {
    constructor(L, B) {
      if (B = s(B), L instanceof e)
        return L.loose === !!B.loose && L.includePrerelease === !!B.includePrerelease ? L : new e(L.raw, B);
      if (L instanceof a)
        return this.raw = L.value, this.set = [[L]], this.formatted = void 0, this;
      if (this.options = B, this.loose = !!B.loose, this.includePrerelease = !!B.includePrerelease, this.raw = L.trim().replace(t, " "), this.set = this.raw.split("||").map((P) => this.parseRange(P.trim())).filter((P) => P.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const P = this.set[0];
        if (this.set = this.set.filter((p) => !m(p[0])), this.set.length === 0)
          this.set = [P];
        else if (this.set.length > 1) {
          for (const p of this.set)
            if (p.length === 1 && b(p[0])) {
              this.set = [p];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let L = 0; L < this.set.length; L++) {
          L > 0 && (this.formatted += "||");
          const B = this.set[L];
          for (let P = 0; P < B.length; P++)
            P > 0 && (this.formatted += " "), this.formatted += B[P].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(L) {
      L = L.replace(g, "");
      const P = ((this.options.includePrerelease && w) | (this.options.loose && v)) + ":" + L, p = n.get(P);
      if (p)
        return p;
      const E = this.options.loose, y = E ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      L = L.replace(y, he(this.options.includePrerelease)), o("hyphen replace", L), L = L.replace(c[l.COMPARATORTRIM], h), o("comparator trim", L), L = L.replace(c[l.TILDETRIM], _), o("tilde trim", L), L = L.replace(c[l.CARETTRIM], $), o("caret trim", L);
      let u = L.split(" ").map((j) => O(j, this.options)).join(" ").split(/\s+/).map((j) => G(j, this.options));
      E && (u = u.filter((j) => (o("loose invalid filter", j, this.options), !!j.match(c[l.COMPARATORLOOSE])))), o("range list", u);
      const f = /* @__PURE__ */ new Map(), S = u.map((j) => new a(j, this.options));
      for (const j of S) {
        if (m(j))
          return [j];
        f.set(j.value, j);
      }
      f.size > 1 && f.has("") && f.delete("");
      const C = [...f.values()];
      return n.set(P, C), C;
    }
    intersects(L, B) {
      if (!(L instanceof e))
        throw new TypeError("a Range is required");
      return this.set.some((P) => T(P, B) && L.set.some((p) => T(p, B) && P.every((E) => p.every((y) => E.intersects(y, B)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(L) {
      if (!L)
        return !1;
      if (typeof L == "string")
        try {
          L = new i(L, this.options);
        } catch {
          return !1;
        }
      for (let B = 0; B < this.set.length; B++)
        if (Te(this.set[B], L, this.options))
          return !0;
      return !1;
    }
  }
  Wa = e;
  const r = xO, n = new r(), s = Bc, a = Pa(), o = Ea, i = Be, {
    safeRe: c,
    src: d,
    t: l,
    comparatorTrimReplace: h,
    tildeTrimReplace: _,
    caretTrimReplace: $
  } = cs, { FLAG_INCLUDE_PRERELEASE: w, FLAG_LOOSE: v } = is, g = new RegExp(d[l.BUILD], "g"), m = (M) => M.value === "<0.0.0-0", b = (M) => M.value === "", T = (M, L) => {
    let B = !0;
    const P = M.slice();
    let p = P.pop();
    for (; B && P.length; )
      B = P.every((E) => p.intersects(E, L)), p = P.pop();
    return B;
  }, O = (M, L) => (M = M.replace(c[l.BUILD], ""), o("comp", M, L), M = de(M, L), o("caret", M), M = D(M, L), o("tildes", M), M = Q(M, L), o("xrange", M), M = ne(M, L), o("stars", M), M), I = (M) => !M || M.toLowerCase() === "x" || M === "*", q = (M, L, B) => I(M) && !I(L) || I(L) && B && !I(B), D = (M, L) => M.trim().split(/\s+/).map((B) => Y(B, L)).join(" "), Y = (M, L) => {
    const B = L.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return M.replace(B, (P, p, E, y, u) => {
      o("tilde", M, P, p, E, y, u);
      let f;
      return I(p) ? f = "" : I(E) ? f = `>=${p}.0.0 <${+p + 1}.0.0-0` : I(y) ? f = `>=${p}.${E}.0 <${p}.${+E + 1}.0-0` : u ? (o("replaceTilde pr", u), f = `>=${p}.${E}.${y}-${u} <${p}.${+E + 1}.0-0`) : f = `>=${p}.${E}.${y} <${p}.${+E + 1}.0-0`, o("tilde return", f), f;
    });
  }, de = (M, L) => M.trim().split(/\s+/).map((B) => ge(B, L)).join(" "), ge = (M, L) => {
    o("caret", M, L);
    const B = L.loose ? c[l.CARETLOOSE] : c[l.CARET], P = L.includePrerelease ? "-0" : "";
    return M.replace(B, (p, E, y, u, f) => {
      o("caret", M, p, E, y, u, f);
      let S;
      return I(E) ? S = "" : I(y) ? S = `>=${E}.0.0${P} <${+E + 1}.0.0-0` : I(u) ? E === "0" ? S = `>=${E}.${y}.0${P} <${E}.${+y + 1}.0-0` : S = `>=${E}.${y}.0${P} <${+E + 1}.0.0-0` : f ? (o("replaceCaret pr", f), E === "0" ? y === "0" ? S = `>=${E}.${y}.${u}-${f} <${E}.${y}.${+u + 1}-0` : S = `>=${E}.${y}.${u}-${f} <${E}.${+y + 1}.0-0` : S = `>=${E}.${y}.${u}-${f} <${+E + 1}.0.0-0`) : (o("no pr"), E === "0" ? y === "0" ? S = `>=${E}.${y}.${u} <${E}.${y}.${+u + 1}-0` : S = `>=${E}.${y}.${u} <${E}.${+y + 1}.0-0` : S = `>=${E}.${y}.${u} <${+E + 1}.0.0-0`), o("caret return", S), S;
    });
  }, Q = (M, L) => (o("replaceXRanges", M, L), M.split(/\s+/).map((B) => x(B, L)).join(" ")), x = (M, L) => {
    M = M.trim();
    const B = L.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return M.replace(B, (P, p, E, y, u, f) => {
      if (o("xRange", M, P, p, E, y, u, f), q(E, y, u))
        return M;
      const S = I(E), C = S || I(y), j = C || I(u), U = j;
      return p === "=" && U && (p = ""), f = L.includePrerelease ? "-0" : "", S ? p === ">" || p === "<" ? P = "<0.0.0-0" : P = "*" : p && U ? (C && (y = 0), u = 0, p === ">" ? (p = ">=", C ? (E = +E + 1, y = 0, u = 0) : (y = +y + 1, u = 0)) : p === "<=" && (p = "<", C ? E = +E + 1 : y = +y + 1), p === "<" && (f = "-0"), P = `${p + E}.${y}.${u}${f}`) : C ? P = `>=${E}.0.0${f} <${+E + 1}.0.0-0` : j && (P = `>=${E}.${y}.0${f} <${E}.${+y + 1}.0-0`), o("xRange return", P), P;
    });
  }, ne = (M, L) => (o("replaceStars", M, L), M.trim().replace(c[l.STAR], "")), G = (M, L) => (o("replaceGTE0", M, L), M.trim().replace(c[L.includePrerelease ? l.GTE0PRE : l.GTE0], "")), he = (M) => (L, B, P, p, E, y, u, f, S, C, j, U) => (I(P) ? B = "" : I(p) ? B = `>=${P}.0.0${M ? "-0" : ""}` : I(E) ? B = `>=${P}.${p}.0${M ? "-0" : ""}` : y ? B = `>=${B}` : B = `>=${B}${M ? "-0" : ""}`, I(S) ? f = "" : I(C) ? f = `<${+S + 1}.0.0-0` : I(j) ? f = `<${S}.${+C + 1}.0-0` : U ? f = `<=${S}.${C}.${j}-${U}` : M ? f = `<${S}.${C}.${+j + 1}-0` : f = `<=${f}`, `${B} ${f}`.trim()), Te = (M, L, B) => {
    for (let P = 0; P < M.length; P++)
      if (!M[P].test(L))
        return !1;
    if (L.prerelease.length && !B.includePrerelease) {
      for (let P = 0; P < M.length; P++)
        if (o(M[P].semver), M[P].semver !== a.ANY && M[P].semver.prerelease.length > 0) {
          const p = M[P].semver;
          if (p.major === L.major && p.minor === L.minor && p.patch === L.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Wa;
}
var Xa, Pu;
function Pa() {
  if (Pu) return Xa;
  Pu = 1;
  const t = Symbol("SemVer ANY");
  class e {
    static get ANY() {
      return t;
    }
    constructor(l, h) {
      if (h = r(h), l instanceof e) {
        if (l.loose === !!h.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), o("comparator", l, h), this.options = h, this.loose = !!h.loose, this.parse(l), this.semver === t ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(l) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], _ = l.match(h);
      if (!_)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = _[1] !== void 0 ? _[1] : "", this.operator === "=" && (this.operator = ""), _[2] ? this.semver = new i(_[2], this.options.loose) : this.semver = t;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (o("Comparator.test", l, this.options.loose), this.semver === t || l === t)
        return !0;
      if (typeof l == "string")
        try {
          l = new i(l, this.options);
        } catch {
          return !1;
        }
      return a(l, this.operator, this.semver, this.options);
    }
    intersects(l, h) {
      if (!(l instanceof e))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, h).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, h).test(l.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || a(this.semver, "<", l.semver, h) && this.operator.startsWith(">") && l.operator.startsWith("<") || a(this.semver, ">", l.semver, h) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  Xa = e;
  const r = Bc, { safeRe: n, t: s } = cs, a = oy, o = Ea, i = Be, c = gt();
  return Xa;
}
const HO = gt(), JO = (t, e, r) => {
  try {
    e = new HO(e, r);
  } catch {
    return !1;
  }
  return e.test(t);
};
var Ta = JO;
const WO = gt(), XO = (t, e) => new WO(t, e).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var YO = XO;
const ZO = Be, eR = gt(), tR = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new eR(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new ZO(n, r));
  }), n;
};
var rR = tR;
const nR = Be, sR = gt(), aR = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new sR(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new nR(n, r));
  }), n;
};
var oR = aR;
const Ya = Be, iR = gt(), Tu = Na, cR = (t, e) => {
  t = new iR(t, e);
  let r = new Ya("0.0.0");
  if (t.test(r) || (r = new Ya("0.0.0-0"), t.test(r)))
    return r;
  r = null;
  for (let n = 0; n < t.set.length; ++n) {
    const s = t.set[n];
    let a = null;
    s.forEach((o) => {
      const i = new Ya(o.semver.version);
      switch (o.operator) {
        case ">":
          i.prerelease.length === 0 ? i.patch++ : i.prerelease.push(0), i.raw = i.format();
        case "":
        case ">=":
          (!a || Tu(i, a)) && (a = i);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Tu(r, a)) && (r = a);
  }
  return r && t.test(r) ? r : null;
};
var lR = cR;
const uR = gt(), dR = (t, e) => {
  try {
    return new uR(t, e).range || "*";
  } catch {
    return null;
  }
};
var fR = dR;
const hR = Be, iy = Pa(), { ANY: mR } = iy, pR = gt(), yR = Ta, Ou = Na, Ru = Qc, $R = xc, gR = Gc, vR = (t, e, r, n) => {
  t = new hR(t, n), e = new pR(e, n);
  let s, a, o, i, c;
  switch (r) {
    case ">":
      s = Ou, a = $R, o = Ru, i = ">", c = ">=";
      break;
    case "<":
      s = Ru, a = gR, o = Ou, i = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (yR(t, e, n))
    return !1;
  for (let d = 0; d < e.set.length; ++d) {
    const l = e.set[d];
    let h = null, _ = null;
    if (l.forEach(($) => {
      $.semver === mR && ($ = new iy(">=0.0.0")), h = h || $, _ = _ || $, s($.semver, h.semver, n) ? h = $ : o($.semver, _.semver, n) && (_ = $);
    }), h.operator === i || h.operator === c || (!_.operator || _.operator === i) && a(t, _.semver))
      return !1;
    if (_.operator === c && o(t, _.semver))
      return !1;
  }
  return !0;
};
var Hc = vR;
const _R = Hc, wR = (t, e, r) => _R(t, e, ">", r);
var bR = wR;
const SR = Hc, ER = (t, e, r) => SR(t, e, "<", r);
var NR = ER;
const Iu = gt(), PR = (t, e, r) => (t = new Iu(t, r), e = new Iu(e, r), t.intersects(e, r));
var TR = PR;
const OR = Ta, RR = $t;
var IR = (t, e, r) => {
  const n = [];
  let s = null, a = null;
  const o = t.sort((l, h) => RR(l, h, r));
  for (const l of o)
    OR(l, e, r) ? (a = l, s || (s = l)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const i = [];
  for (const [l, h] of n)
    l === h ? i.push(l) : !h && l === o[0] ? i.push("*") : h ? l === o[0] ? i.push(`<=${h}`) : i.push(`${l} - ${h}`) : i.push(`>=${l}`);
  const c = i.join(" || "), d = typeof e.raw == "string" ? e.raw : String(e);
  return c.length < d.length ? c : e;
};
const ju = gt(), Jc = Pa(), { ANY: Za } = Jc, eo = Ta, Wc = $t, jR = (t, e, r = {}) => {
  if (t === e)
    return !0;
  t = new ju(t, r), e = new ju(e, r);
  let n = !1;
  e: for (const s of t.set) {
    for (const a of e.set) {
      const o = AR(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, CR = [new Jc(">=0.0.0-0")], Cu = [new Jc(">=0.0.0")], AR = (t, e, r) => {
  if (t === e)
    return !0;
  if (t.length === 1 && t[0].semver === Za) {
    if (e.length === 1 && e[0].semver === Za)
      return !0;
    r.includePrerelease ? t = CR : t = Cu;
  }
  if (e.length === 1 && e[0].semver === Za) {
    if (r.includePrerelease)
      return !0;
    e = Cu;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const $ of t)
    $.operator === ">" || $.operator === ">=" ? s = Au(s, $, r) : $.operator === "<" || $.operator === "<=" ? a = ku(a, $, r) : n.add($.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Wc(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const $ of n) {
    if (s && !eo($, String(s), r) || a && !eo($, String(a), r))
      return null;
    for (const w of e)
      if (!eo($, String(w), r))
        return !1;
    return !0;
  }
  let i, c, d, l, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, _ = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const $ of e) {
    if (l = l || $.operator === ">" || $.operator === ">=", d = d || $.operator === "<" || $.operator === "<=", s) {
      if (_ && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === _.major && $.semver.minor === _.minor && $.semver.patch === _.patch && (_ = !1), $.operator === ">" || $.operator === ">=") {
        if (i = Au(s, $, r), i === $ && i !== s)
          return !1;
      } else if (s.operator === ">=" && !$.test(s.semver))
        return !1;
    }
    if (a) {
      if (h && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === h.major && $.semver.minor === h.minor && $.semver.patch === h.patch && (h = !1), $.operator === "<" || $.operator === "<=") {
        if (c = ku(a, $, r), c === $ && c !== a)
          return !1;
      } else if (a.operator === "<=" && !$.test(a.semver))
        return !1;
    }
    if (!$.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && l && !s && o !== 0 || _ || h);
}, Au = (t, e, r) => {
  if (!t)
    return e;
  const n = Wc(t.semver, e.semver, r);
  return n > 0 ? t : n < 0 || e.operator === ">" && t.operator === ">=" ? e : t;
}, ku = (t, e, r) => {
  if (!t)
    return e;
  const n = Wc(t.semver, e.semver, r);
  return n < 0 ? t : n > 0 || e.operator === "<" && t.operator === "<=" ? e : t;
};
var kR = jR;
const to = cs, Lu = is, LR = Be, Du = ny, DR = Mr, MR = LT, VR = VT, FR = qT, qR = UT, zR = QT, UR = HT, BR = XT, KR = eO, QR = $t, GR = sO, xR = iO, HR = Kc, JR = dO, WR = mO, XR = Na, YR = Qc, ZR = sy, eI = ay, tI = Gc, rI = xc, nI = oy, sI = MO, aI = QO, oI = Pa(), iI = gt(), cI = Ta, lI = YO, uI = rR, dI = oR, fI = lR, hI = fR, mI = Hc, pI = bR, yI = NR, $I = TR, gI = IR, vI = kR;
var _I = {
  parse: DR,
  valid: MR,
  clean: VR,
  inc: FR,
  diff: qR,
  major: zR,
  minor: UR,
  patch: BR,
  prerelease: KR,
  compare: QR,
  rcompare: GR,
  compareLoose: xR,
  compareBuild: HR,
  sort: JR,
  rsort: WR,
  gt: XR,
  lt: YR,
  eq: ZR,
  neq: eI,
  gte: tI,
  lte: rI,
  cmp: nI,
  coerce: sI,
  truncate: aI,
  Comparator: oI,
  Range: iI,
  satisfies: cI,
  toComparators: lI,
  maxSatisfying: uI,
  minSatisfying: dI,
  minVersion: fI,
  validRange: hI,
  outside: mI,
  gtr: pI,
  ltr: yI,
  intersects: $I,
  simplifyRange: gI,
  subset: vI,
  SemVer: LR,
  re: to.re,
  src: to.src,
  tokens: to.t,
  SEMVER_SPEC_VERSION: Lu.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Lu.RELEASE_TYPES,
  compareIdentifiers: Du.compareIdentifiers,
  rcompareIdentifiers: Du.rcompareIdentifiers
};
const Kr = /* @__PURE__ */ cm(_I), wI = Object.prototype.toString, bI = "[object Uint8Array]", SI = "[object ArrayBuffer]";
function cy(t, e, r) {
  return t ? t.constructor === e ? !0 : wI.call(t) === r : !1;
}
function ly(t) {
  return cy(t, Uint8Array, bI);
}
function EI(t) {
  return cy(t, ArrayBuffer, SI);
}
function NI(t) {
  return ly(t) || EI(t);
}
function PI(t) {
  if (!ly(t))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof t}\``);
}
function TI(t) {
  if (!NI(t))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof t}\``);
}
function Mu(t, e) {
  if (t.length === 0)
    return new Uint8Array(0);
  e ?? (e = t.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(e);
  let n = 0;
  for (const s of t)
    PI(s), r.set(s, n), n += s.length;
  return r;
}
const Os = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Vu(t, e = "utf8") {
  return TI(t), Os[e] ?? (Os[e] = new globalThis.TextDecoder(e)), Os[e].decode(t);
}
function OI(t) {
  if (typeof t != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof t}\``);
}
const RI = new globalThis.TextEncoder();
function ro(t) {
  return OI(t), RI.encode(t);
}
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
const II = uT.default, Fu = "aes-256-cbc", Qr = () => /* @__PURE__ */ Object.create(null), jI = (t) => t != null, CI = (t, e) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof e;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${t}\` is not allowed as it's not supported by JSON`);
}, zs = "__internal__", no = `${zs}.migrations.version`;
var Ht, Tt, tt, Ot;
class AI {
  constructor(e = {}) {
    N(this, "path");
    N(this, "events");
    En(this, Ht);
    En(this, Tt);
    En(this, tt);
    En(this, Ot, {});
    N(this, "_deserialize", (e) => JSON.parse(e));
    N(this, "_serialize", (e) => JSON.stringify(e, void 0, "	"));
    const r = {
      configName: "config",
      fileExtension: "json",
      projectSuffix: "nodejs",
      clearInvalidConfig: !1,
      accessPropertiesByDotNotation: !0,
      configFileMode: 438,
      ...e
    };
    if (!r.cwd) {
      if (!r.projectName)
        throw new Error("Please specify the `projectName` option.");
      r.cwd = D$(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Nn(this, tt, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const o = new WS.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      II(o);
      const i = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      Nn(this, Ht, o.compile(i));
      for (const [c, d] of Object.entries(r.schema ?? {}))
        d != null && d.default && (ve(this, Ot)[c] = d.default);
    }
    r.defaults && Nn(this, Ot, {
      ...ve(this, Ot),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), Nn(this, Tt, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = X.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, a = Object.assign(Qr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      T$.deepEqual(s, a);
    } catch {
      this.store = a;
    }
    r.watch && this._watch();
  }
  get(e, r) {
    if (ve(this, tt).accessPropertiesByDotNotation)
      return this._get(e, r);
    const { store: n } = this;
    return e in n ? n[e] : r;
  }
  set(e, r) {
    if (typeof e != "string" && typeof e != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof e}`);
    if (typeof e != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(e))
      throw new TypeError(`Please don't use the ${zs} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      CI(a, o), ve(this, tt).accessPropertiesByDotNotation ? pl(n, a, o) : n[a] = o;
    };
    if (typeof e == "object") {
      const a = e;
      for (const [o, i] of Object.entries(a))
        s(o, i);
    } else
      s(e, r);
    this.store = n;
  }
  has(e) {
    return ve(this, tt).accessPropertiesByDotNotation ? C$(this.store, e) : e in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...e) {
    for (const r of e)
      jI(ve(this, Ot)[r]) && this.set(r, ve(this, Ot)[r]);
  }
  delete(e) {
    const { store: r } = this;
    ve(this, tt).accessPropertiesByDotNotation ? j$(r, e) : delete r[e], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = Qr();
    for (const e of Object.keys(ve(this, Ot)))
      this.reset(e);
  }
  onDidChange(e, r) {
    if (typeof e != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof e}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleChange(() => this.get(e), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(e) {
    if (typeof e != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof e}`);
    return this._handleChange(() => this.store, e);
  }
  get size() {
    return Object.keys(this.store).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    try {
      const e = ee.readFileSync(this.path, ve(this, Tt) ? null : "utf8"), r = this._encryptData(e), n = this._deserialize(r);
      return this._validate(n), Object.assign(Qr(), n);
    } catch (e) {
      if ((e == null ? void 0 : e.code) === "ENOENT")
        return this._ensureDirectory(), Qr();
      if (ve(this, tt).clearInvalidConfig && e.name === "SyntaxError")
        return Qr();
      throw e;
    }
  }
  set store(e) {
    this._ensureDirectory(), this._validate(e), this._write(e), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [e, r] of Object.entries(this.store))
      yield [e, r];
  }
  _encryptData(e) {
    if (!ve(this, Tt))
      return typeof e == "string" ? e : Vu(e);
    try {
      const r = e.slice(0, 16), n = Pn.pbkdf2Sync(ve(this, Tt), r.toString(), 1e4, 32, "sha512"), s = Pn.createDecipheriv(Fu, n, r), a = e.slice(17), o = typeof a == "string" ? ro(a) : a;
      return Vu(Mu([s.update(o), s.final()]));
    } catch {
    }
    return e.toString();
  }
  _handleChange(e, r) {
    let n = e();
    const s = () => {
      const a = n, o = e();
      P$(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(e) {
    if (!ve(this, Ht) || ve(this, Ht).call(this, e) || !ve(this, Ht).errors)
      return;
    const n = ve(this, Ht).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    ee.mkdirSync(X.dirname(this.path), { recursive: !0 });
  }
  _write(e) {
    let r = this._serialize(e);
    if (ve(this, Tt)) {
      const n = Pn.randomBytes(16), s = Pn.pbkdf2Sync(ve(this, Tt), n.toString(), 1e4, 32, "sha512"), a = Pn.createCipheriv(Fu, s, n);
      r = Mu([n, ro(":"), a.update(ro(r)), a.final()]);
    }
    if (_e.env.SNAP)
      ee.writeFileSync(this.path, r, { mode: ve(this, tt).configFileMode });
    else
      try {
        im(this.path, r, { mode: ve(this, tt).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          ee.writeFileSync(this.path, r, { mode: ve(this, tt).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), ee.existsSync(this.path) || this._write(Qr()), _e.platform === "win32" ? ee.watch(this.path, { persistent: !1 }, $u(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : ee.watchFile(this.path, { persistent: !1 }, $u(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(e, r, n) {
    let s = this._get(no, "0.0.0");
    const a = Object.keys(e).filter((i) => this._shouldPerformMigration(i, s, r));
    let o = { ...this.store };
    for (const i of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: i,
          finalVersion: r,
          versions: a
        });
        const c = e[i];
        c == null || c(this), this._set(no, i), s = i, o = { ...this.store };
      } catch (c) {
        throw this.store = o, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${c}`);
      }
    (this._isVersionInRangeFormat(s) || !Kr.eq(s, r)) && this._set(no, r);
  }
  _containsReservedKey(e) {
    return typeof e == "object" && Object.keys(e)[0] === zs ? !0 : typeof e != "string" ? !1 : ve(this, tt).accessPropertiesByDotNotation ? !!e.startsWith(`${zs}.`) : !1;
  }
  _isVersionInRangeFormat(e) {
    return Kr.clean(e) === null;
  }
  _shouldPerformMigration(e, r, n) {
    return this._isVersionInRangeFormat(e) ? r !== "0.0.0" && Kr.satisfies(r, e) ? !1 : Kr.satisfies(n, e) : !(Kr.lte(e, r) || Kr.gt(e, n));
  }
  _get(e, r) {
    return I$(this.store, e, r);
  }
  _set(e, r) {
    const { store: n } = this;
    pl(n, e, r), this.store = n;
  }
}
Ht = new WeakMap(), Tt = new WeakMap(), tt = new WeakMap(), Ot = new WeakMap();
const { app: Us, ipcMain: To, shell: kI } = rm;
let qu = !1;
const zu = () => {
  if (!To || !Us)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const t = {
    defaultCwd: Us.getPath("userData"),
    appVersion: Us.getVersion()
  };
  return qu || (To.on("electron-store-get-data", (e) => {
    e.returnValue = t;
  }), qu = !0), t;
};
class LI extends AI {
  constructor(e) {
    let r, n;
    if (_e.type === "renderer") {
      const s = rm.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else To && Us && ({ defaultCwd: r, appVersion: n } = zu());
    e = {
      name: "config",
      ...e
    }, e.projectVersion || (e.projectVersion = n), e.cwd ? e.cwd = X.isAbsolute(e.cwd) ? e.cwd : X.join(r, e.cwd) : e.cwd = r, e.configName = e.name, delete e.name, super(e);
  }
  static initRenderer() {
    zu();
  }
  async openInEditor() {
    const e = await kI.openPath(this.path);
    if (e)
      throw new Error(e);
  }
}
const k = Symbol.for("drizzle:entityKind");
function A(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (t instanceof e)
    return !0;
  if (!Object.prototype.hasOwnProperty.call(e, k))
    throw new Error(
      `Class "${e.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  let r = Object.getPrototypeOf(t).constructor;
  if (r)
    for (; r; ) {
      if (k in r && r[k] === e[k])
        return !0;
      r = Object.getPrototypeOf(r);
    }
  return !1;
}
var Yu;
Yu = k;
class Ee {
  constructor(e, r) {
    N(this, "name");
    N(this, "keyAsName");
    N(this, "primary");
    N(this, "notNull");
    N(this, "default");
    N(this, "defaultFn");
    N(this, "onUpdateFn");
    N(this, "hasDefault");
    N(this, "isUnique");
    N(this, "uniqueName");
    N(this, "uniqueType");
    N(this, "dataType");
    N(this, "columnType");
    N(this, "enumValues");
    N(this, "generated");
    N(this, "generatedIdentity");
    N(this, "config");
    this.table = e, this.config = r, this.name = r.name, this.keyAsName = r.keyAsName, this.notNull = r.notNull, this.default = r.default, this.defaultFn = r.defaultFn, this.onUpdateFn = r.onUpdateFn, this.hasDefault = r.hasDefault, this.primary = r.primaryKey, this.isUnique = r.isUnique, this.uniqueName = r.uniqueName, this.uniqueType = r.uniqueType, this.dataType = r.dataType, this.columnType = r.columnType, this.generated = r.generated, this.generatedIdentity = r.generatedIdentity;
  }
  mapFromDriverValue(e) {
    return e;
  }
  mapToDriverValue(e) {
    return e;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
}
N(Ee, Yu, "Column");
var Zu;
Zu = k;
class uy {
  constructor(e, r, n) {
    N(this, "config");
    /**
     * Alias for {@link $defaultFn}.
     */
    N(this, "$default", this.$defaultFn);
    /**
     * Alias for {@link $onUpdateFn}.
     */
    N(this, "$onUpdate", this.$onUpdateFn);
    this.config = {
      name: e,
      keyAsName: e === "",
      notNull: !1,
      default: void 0,
      hasDefault: !1,
      primaryKey: !1,
      isUnique: !1,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType: r,
      columnType: n,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    return this.config.notNull = !0, this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(e) {
    return this.config.default = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(e) {
    return this.config.defaultFn = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(e) {
    return this.config.onUpdateFn = e, this.config.hasDefault = !0, this;
  }
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    return this.config.primaryKey = !0, this.config.notNull = !0, this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(e) {
    this.config.name === "" && (this.config.name = e);
  }
}
N(uy, Zu, "ColumnBuilder");
const er = Symbol.for("drizzle:Name"), Uu = Symbol.for("drizzle:isPgEnum");
function DI(t) {
  return !!t && typeof t == "function" && Uu in t && t[Uu] === !0;
}
var ed;
ed = k;
class Ue {
  constructor(e, r, n, s = !1, a = []) {
    this._ = {
      brand: "Subquery",
      sql: e,
      selectedFields: r,
      alias: n,
      isWith: s,
      usedTables: a
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
}
N(Ue, ed, "Subquery");
var td, rd;
class Xc extends (rd = Ue, td = k, rd) {
}
N(Xc, td, "WithSubquery");
const MI = {
  startActiveSpan(t, e) {
    return e();
  }
}, ze = Symbol.for("drizzle:ViewBaseConfig"), Bs = Symbol.for("drizzle:Schema"), Oo = Symbol.for("drizzle:Columns"), Bu = Symbol.for("drizzle:ExtraConfigColumns"), so = Symbol.for("drizzle:OriginalName"), ao = Symbol.for("drizzle:BaseName"), ea = Symbol.for("drizzle:IsAlias"), Ku = Symbol.for("drizzle:ExtraConfigBuilder"), VI = Symbol.for("drizzle:IsDrizzleTable");
var nd, sd, ad, od, id, cd, ld, ud, dd, fd;
fd = k, dd = er, ud = so, ld = Bs, cd = Oo, id = Bu, od = ao, ad = ea, sd = VI, nd = Ku;
class F {
  constructor(e, r, n) {
    /**
     * @internal
     * Can be changed if the table is aliased.
     */
    N(this, dd);
    /**
     * @internal
     * Used to store the original name of the table, before any aliasing.
     */
    N(this, ud);
    /** @internal */
    N(this, ld);
    /** @internal */
    N(this, cd);
    /** @internal */
    N(this, id);
    /**
     *  @internal
     * Used to store the table name before the transformation via the `tableCreator` functions.
     */
    N(this, od);
    /** @internal */
    N(this, ad, !1);
    /** @internal */
    N(this, sd, !0);
    /** @internal */
    N(this, nd);
    this[er] = this[so] = e, this[Bs] = r, this[ao] = n;
  }
}
N(F, fd, "Table"), /** @internal */
N(F, "Symbol", {
  Name: er,
  Schema: Bs,
  OriginalName: so,
  Columns: Oo,
  ExtraConfigColumns: Bu,
  BaseName: ao,
  IsAlias: ea,
  ExtraConfigBuilder: Ku
});
function Zr(t) {
  return t[er];
}
function Wn(t) {
  return `${t[Bs] ?? "public"}.${t[er]}`;
}
function dy(t) {
  return t != null && typeof t.getSQL == "function";
}
function FI(t) {
  var r;
  const e = { sql: "", params: [] };
  for (const n of t)
    e.sql += n.sql, e.params.push(...n.params), (r = n.typings) != null && r.length && (e.typings || (e.typings = []), e.typings.push(...n.typings));
  return e;
}
var hd;
hd = k;
class Oe {
  constructor(e) {
    N(this, "value");
    this.value = Array.isArray(e) ? e : [e];
  }
  getSQL() {
    return new W([this]);
  }
}
N(Oe, hd, "StringChunk");
var md;
md = k;
const Nr = class Nr {
  constructor(e) {
    /** @internal */
    N(this, "decoder", fy);
    N(this, "shouldInlineParams", !1);
    /** @internal */
    N(this, "usedTables", []);
    this.queryChunks = e;
    for (const r of e)
      if (A(r, F)) {
        const n = r[F.Symbol.Schema];
        this.usedTables.push(
          n === void 0 ? r[F.Symbol.Name] : n + "." + r[F.Symbol.Name]
        );
      }
  }
  append(e) {
    return this.queryChunks.push(...e.queryChunks), this;
  }
  toQuery(e) {
    return MI.startActiveSpan("drizzle.buildSQL", (r) => {
      const n = this.buildQueryFromSourceParams(this.queryChunks, e);
      return r == null || r.setAttributes({
        "drizzle.query.text": n.sql,
        "drizzle.query.params": JSON.stringify(n.params)
      }), n;
    });
  }
  buildQueryFromSourceParams(e, r) {
    const n = Object.assign({}, r, {
      inlineParams: r.inlineParams || this.shouldInlineParams,
      paramStartIndex: r.paramStartIndex || { value: 0 }
    }), {
      casing: s,
      escapeName: a,
      escapeParam: o,
      prepareTyping: i,
      inlineParams: c,
      paramStartIndex: d
    } = n;
    return FI(e.map((l) => {
      var h;
      if (A(l, Oe))
        return { sql: l.value.join(""), params: [] };
      if (A(l, ta))
        return { sql: a(l.value), params: [] };
      if (l === void 0)
        return { sql: "", params: [] };
      if (Array.isArray(l)) {
        const _ = [new Oe("(")];
        for (const [$, w] of l.entries())
          _.push(w), $ < l.length - 1 && _.push(new Oe(", "));
        return _.push(new Oe(")")), this.buildQueryFromSourceParams(_, n);
      }
      if (A(l, Nr))
        return this.buildQueryFromSourceParams(l.queryChunks, {
          ...n,
          inlineParams: c || l.shouldInlineParams
        });
      if (A(l, F)) {
        const _ = l[F.Symbol.Schema], $ = l[F.Symbol.Name];
        return {
          sql: _ === void 0 || l[ea] ? a($) : a(_) + "." + a($),
          params: []
        };
      }
      if (A(l, Ee)) {
        const _ = s.getColumnCasing(l);
        if (r.invokeSource === "indexes")
          return { sql: a(_), params: [] };
        const $ = l.table[F.Symbol.Schema];
        return {
          sql: l.table[ea] || $ === void 0 ? a(l.table[F.Symbol.Name]) + "." + a(_) : a($) + "." + a(l.table[F.Symbol.Name]) + "." + a(_),
          params: []
        };
      }
      if (A(l, Vr)) {
        const _ = l[ze].schema, $ = l[ze].name;
        return {
          sql: _ === void 0 || l[ze].isAlias ? a($) : a(_) + "." + a($),
          params: []
        };
      }
      if (A(l, Mt)) {
        if (A(l.value, Ar))
          return { sql: o(d.value++, l), params: [l], typings: ["none"] };
        const _ = l.value === null ? null : l.encoder.mapToDriverValue(l.value);
        if (A(_, Nr))
          return this.buildQueryFromSourceParams([_], n);
        if (c)
          return { sql: this.mapInlineParam(_, n), params: [] };
        let $ = ["none"];
        return i && ($ = [i(l.encoder)]), { sql: o(d.value++, _), params: [_], typings: $ };
      }
      return A(l, Ar) ? { sql: o(d.value++, l), params: [l], typings: ["none"] } : A(l, Nr.Aliased) && l.fieldAlias !== void 0 ? { sql: a(l.fieldAlias), params: [] } : A(l, Ue) ? l._.isWith ? { sql: a(l._.alias), params: [] } : this.buildQueryFromSourceParams([
        new Oe("("),
        l._.sql,
        new Oe(") "),
        new ta(l._.alias)
      ], n) : DI(l) ? l.schema ? { sql: a(l.schema) + "." + a(l.enumName), params: [] } : { sql: a(l.enumName), params: [] } : dy(l) ? (h = l.shouldOmitSQLParens) != null && h.call(l) ? this.buildQueryFromSourceParams([l.getSQL()], n) : this.buildQueryFromSourceParams([
        new Oe("("),
        l.getSQL(),
        new Oe(")")
      ], n) : c ? { sql: this.mapInlineParam(l, n), params: [] } : { sql: o(d.value++, l), params: [l], typings: ["none"] };
    }));
  }
  mapInlineParam(e, { escapeString: r }) {
    if (e === null)
      return "null";
    if (typeof e == "number" || typeof e == "boolean")
      return e.toString();
    if (typeof e == "string")
      return r(e);
    if (typeof e == "object") {
      const n = e.toString();
      return r(n === "[object Object]" ? JSON.stringify(e) : n);
    }
    throw new Error("Unexpected param value: " + e);
  }
  getSQL() {
    return this;
  }
  as(e) {
    return e === void 0 ? this : new Nr.Aliased(this, e);
  }
  mapWith(e) {
    return this.decoder = typeof e == "function" ? { mapFromDriverValue: e } : e, this;
  }
  inlineParams() {
    return this.shouldInlineParams = !0, this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(e) {
    return e ? this : void 0;
  }
};
N(Nr, md, "SQL");
let W = Nr;
var pd;
pd = k;
class ta {
  constructor(e) {
    N(this, "brand");
    this.value = e;
  }
  getSQL() {
    return new W([this]);
  }
}
N(ta, pd, "Name");
function qI(t) {
  return typeof t == "object" && t !== null && "mapToDriverValue" in t && typeof t.mapToDriverValue == "function";
}
const fy = {
  mapFromDriverValue: (t) => t
}, hy = {
  mapToDriverValue: (t) => t
};
({
  ...fy,
  ...hy
});
var yd;
yd = k;
class Mt {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(e, r = hy) {
    N(this, "brand");
    this.value = e, this.encoder = r;
  }
  getSQL() {
    return new W([this]);
  }
}
N(Mt, yd, "Param");
function R(t, ...e) {
  const r = [];
  (e.length > 0 || t.length > 0 && t[0] !== "") && r.push(new Oe(t[0]));
  for (const [n, s] of e.entries())
    r.push(s, new Oe(t[n + 1]));
  return new W(r);
}
((t) => {
  function e() {
    return new W([]);
  }
  t.empty = e;
  function r(c) {
    return new W(c);
  }
  t.fromList = r;
  function n(c) {
    return new W([new Oe(c)]);
  }
  t.raw = n;
  function s(c, d) {
    const l = [];
    for (const [h, _] of c.entries())
      h > 0 && d !== void 0 && l.push(d), l.push(_);
    return new W(l);
  }
  t.join = s;
  function a(c) {
    return new ta(c);
  }
  t.identifier = a;
  function o(c) {
    return new Ar(c);
  }
  t.placeholder = o;
  function i(c, d) {
    return new Mt(c, d);
  }
  t.param = i;
})(R || (R = {}));
((t) => {
  var r;
  r = k;
  const n = class n {
    constructor(a, o) {
      /** @internal */
      N(this, "isSelectionField", !1);
      this.sql = a, this.fieldAlias = o;
    }
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new n(this.sql, this.fieldAlias);
    }
  };
  N(n, r, "SQL.Aliased");
  let e = n;
  t.Aliased = e;
})(W || (W = {}));
var $d;
$d = k;
class Ar {
  constructor(e) {
    this.name = e;
  }
  getSQL() {
    return new W([this]);
  }
}
N(Ar, $d, "Placeholder");
function Rs(t, e) {
  return t.map((r) => {
    if (A(r, Ar)) {
      if (!(r.name in e))
        throw new Error(`No value for placeholder "${r.name}" was provided`);
      return e[r.name];
    }
    if (A(r, Mt) && A(r.value, Ar)) {
      if (!(r.value.name in e))
        throw new Error(`No value for placeholder "${r.value.name}" was provided`);
      return r.encoder.mapToDriverValue(e[r.value.name]);
    }
    return r;
  });
}
const zI = Symbol.for("drizzle:IsDrizzleView");
var gd, vd, _d;
_d = k, vd = ze, gd = zI;
class Vr {
  constructor({ name: e, schema: r, selectedFields: n, query: s }) {
    /** @internal */
    N(this, vd);
    /** @internal */
    N(this, gd, !0);
    this[ze] = {
      name: e,
      originalName: e,
      schema: r,
      selectedFields: n,
      query: s,
      isExisting: !s,
      isAlias: !1
    };
  }
  getSQL() {
    return new W([this]);
  }
}
N(Vr, _d, "View");
Ee.prototype.getSQL = function() {
  return new W([this]);
};
F.prototype.getSQL = function() {
  return new W([this]);
};
Ue.prototype.getSQL = function() {
  return new W([this]);
};
var wd;
wd = k;
class Xn {
  constructor(e) {
    this.table = e;
  }
  get(e, r) {
    return r === "table" ? this.table : e[r];
  }
}
N(Xn, wd, "ColumnAliasProxyHandler");
var bd;
bd = k;
class Oa {
  constructor(e, r) {
    this.alias = e, this.replaceOriginalName = r;
  }
  get(e, r) {
    if (r === F.Symbol.IsAlias)
      return !0;
    if (r === F.Symbol.Name)
      return this.alias;
    if (this.replaceOriginalName && r === F.Symbol.OriginalName)
      return this.alias;
    if (r === ze)
      return {
        ...e[ze],
        name: this.alias,
        isAlias: !0
      };
    if (r === F.Symbol.Columns) {
      const s = e[F.Symbol.Columns];
      if (!s)
        return s;
      const a = {};
      return Object.keys(s).map((o) => {
        a[o] = new Proxy(
          s[o],
          new Xn(new Proxy(e, this))
        );
      }), a;
    }
    const n = e[r];
    return A(n, Ee) ? new Proxy(n, new Xn(new Proxy(e, this))) : n;
  }
}
N(Oa, bd, "TableAliasProxyHandler");
function oo(t, e) {
  return new Proxy(t, new Oa(e, !1));
}
function Pt(t, e) {
  return new Proxy(
    t,
    new Xn(new Proxy(t.table, new Oa(e, !1)))
  );
}
function my(t, e) {
  return new W.Aliased(ra(t.sql, e), t.fieldAlias);
}
function ra(t, e) {
  return R.join(t.queryChunks.map((r) => A(r, Ee) ? Pt(r, e) : A(r, W) ? ra(r, e) : A(r, W.Aliased) ? my(r, e) : r));
}
var Sd, Ed;
class Ra extends (Ed = Error, Sd = k, Ed) {
  constructor({ message: e, cause: r }) {
    super(e), this.name = "DrizzleError", this.cause = r;
  }
}
N(Ra, Sd, "DrizzleError");
class Gt extends Error {
  constructor(e, r, n) {
    super(`Failed query: ${e}
params: ${r}`), this.query = e, this.params = r, this.cause = n, Error.captureStackTrace(this, Gt), n && (this.cause = n);
  }
}
var Nd, Pd;
class py extends (Pd = Ra, Nd = k, Pd) {
  constructor() {
    super({ message: "Rollback" });
  }
}
N(py, Nd, "TransactionRollbackError");
var Td;
Td = k;
class yy {
  write(e) {
    console.log(e);
  }
}
N(yy, Td, "ConsoleLogWriter");
var Od;
Od = k;
class $y {
  constructor(e) {
    N(this, "writer");
    this.writer = (e == null ? void 0 : e.writer) ?? new yy();
  }
  logQuery(e, r) {
    const n = r.map((a) => {
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    }), s = n.length ? ` -- params: [${n.join(", ")}]` : "";
    this.writer.write(`Query: ${e}${s}`);
  }
}
N($y, Od, "DefaultLogger");
var Rd;
Rd = k;
class gy {
  logQuery() {
  }
}
N(gy, Rd, "NoopLogger");
var Id, jd;
jd = k, Id = Symbol.toStringTag;
class tr {
  constructor() {
    N(this, Id, "QueryPromise");
  }
  catch(e) {
    return this.then(void 0, e);
  }
  finally(e) {
    return this.then(
      (r) => (e == null || e(), r),
      (r) => {
        throw e == null || e(), r;
      }
    );
  }
  then(e, r) {
    return this.execute().then(e, r);
  }
}
N(tr, jd, "QueryPromise");
function Qu(t, e, r) {
  const n = {}, s = t.reduce(
    (a, { path: o, field: i }, c) => {
      let d;
      A(i, Ee) ? d = i : A(i, W) ? d = i.decoder : A(i, Ue) ? d = i._.sql.decoder : d = i.sql.decoder;
      let l = a;
      for (const [h, _] of o.entries())
        if (h < o.length - 1)
          _ in l || (l[_] = {}), l = l[_];
        else {
          const $ = e[c], w = l[_] = $ === null ? null : d.mapFromDriverValue($);
          if (r && A(i, Ee) && o.length === 2) {
            const v = o[0];
            v in n ? typeof n[v] == "string" && n[v] !== Zr(i.table) && (n[v] = !1) : n[v] = w === null ? Zr(i.table) : !1;
          }
        }
      return a;
    },
    {}
  );
  if (r && Object.keys(n).length > 0)
    for (const [a, o] of Object.entries(n))
      typeof o == "string" && !r[o] && (s[a] = null);
  return s;
}
function kr(t, e) {
  return Object.entries(t).reduce((r, [n, s]) => {
    if (typeof n != "string")
      return r;
    const a = e ? [...e, n] : [n];
    return A(s, Ee) || A(s, W) || A(s, W.Aliased) || A(s, Ue) ? r.push({ path: a, field: s }) : A(s, F) ? r.push(...kr(s[F.Symbol.Columns], a)) : r.push(...kr(s, a)), r;
  }, []);
}
function Yc(t, e) {
  const r = Object.keys(t), n = Object.keys(e);
  if (r.length !== n.length)
    return !1;
  for (const [s, a] of r.entries())
    if (a !== n[s])
      return !1;
  return !0;
}
function vy(t, e) {
  const r = Object.entries(e).filter(([, n]) => n !== void 0).map(([n, s]) => A(s, W) || A(s, Ee) ? [n, s] : [n, new Mt(s, t[F.Symbol.Columns][n])]);
  if (r.length === 0)
    throw new Error("No values to set");
  return Object.fromEntries(r);
}
function UI(t, e) {
  for (const r of e)
    for (const n of Object.getOwnPropertyNames(r.prototype))
      n !== "constructor" && Object.defineProperty(
        t.prototype,
        n,
        Object.getOwnPropertyDescriptor(r.prototype, n) || /* @__PURE__ */ Object.create(null)
      );
}
function BI(t) {
  return t[F.Symbol.Columns];
}
function Ro(t) {
  return A(t, Ue) ? t._.alias : A(t, Vr) ? t[ze].name : A(t, W) ? void 0 : t[F.Symbol.IsAlias] ? t[F.Symbol.Name] : t[F.Symbol.BaseName];
}
function ls(t, e) {
  return {
    name: typeof t == "string" && t.length > 0 ? t : "",
    config: typeof t == "object" ? t : e
  };
}
function KI(t) {
  if (typeof t != "object" || t === null || t.constructor.name !== "Object") return !1;
  if ("logger" in t) {
    const e = typeof t.logger;
    return !(e !== "boolean" && (e !== "object" || typeof t.logger.logQuery != "function") && e !== "undefined");
  }
  if ("schema" in t) {
    const e = typeof t.schema;
    return !(e !== "object" && e !== "undefined");
  }
  if ("casing" in t) {
    const e = typeof t.casing;
    return !(e !== "string" && e !== "undefined");
  }
  if ("mode" in t)
    return !(t.mode !== "default" || t.mode !== "planetscale" || t.mode !== void 0);
  if ("connection" in t) {
    const e = typeof t.connection;
    return !(e !== "string" && e !== "object" && e !== "undefined");
  }
  if ("client" in t) {
    const e = typeof t.client;
    return !(e !== "object" && e !== "function" && e !== "undefined");
  }
  return Object.keys(t).length === 0;
}
const _y = typeof TextDecoder > "u" ? null : new TextDecoder(), Gu = Symbol.for("drizzle:PgInlineForeignKeys"), xu = Symbol.for("drizzle:EnableRLS");
var Cd, Ad, kd, Ld, Dd, Md;
class Io extends (Md = F, Dd = k, Ld = Gu, kd = xu, Ad = F.Symbol.ExtraConfigBuilder, Cd = F.Symbol.ExtraConfigColumns, Md) {
  constructor() {
    super(...arguments);
    /**@internal */
    N(this, Ld, []);
    /** @internal */
    N(this, kd, !1);
    /** @internal */
    N(this, Ad);
    /** @internal */
    N(this, Cd, {});
  }
}
N(Io, Dd, "PgTable"), /** @internal */
N(Io, "Symbol", Object.assign({}, F.Symbol, {
  InlineForeignKeys: Gu,
  EnableRLS: xu
}));
var Vd;
Vd = k;
class wy {
  constructor(e, r) {
    /** @internal */
    N(this, "columns");
    /** @internal */
    N(this, "name");
    this.columns = e, this.name = r;
  }
  /** @internal */
  build(e) {
    return new by(e, this.columns, this.name);
  }
}
N(wy, Vd, "PgPrimaryKeyBuilder");
var Fd;
Fd = k;
class by {
  constructor(e, r, n) {
    N(this, "columns");
    N(this, "name");
    this.table = e, this.columns = r, this.name = n;
  }
  getName() {
    return this.name ?? `${this.table[Io.Symbol.Name]}_${this.columns.map((e) => e.name).join("_")}_pk`;
  }
}
N(by, Fd, "PgPrimaryKey");
function Ye(t, e) {
  return qI(e) && !dy(t) && !A(t, Mt) && !A(t, Ar) && !A(t, Ee) && !A(t, F) && !A(t, Vr) ? new Mt(t, e) : t;
}
const us = (t, e) => R`${t} = ${Ye(e, t)}`, QI = (t, e) => R`${t} <> ${Ye(e, t)}`;
function jo(...t) {
  const e = t.filter(
    (r) => r !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new W(e) : new W([
      new Oe("("),
      R.join(e, new Oe(" and ")),
      new Oe(")")
    ]);
}
function GI(...t) {
  const e = t.filter(
    (r) => r !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new W(e) : new W([
      new Oe("("),
      R.join(e, new Oe(" or ")),
      new Oe(")")
    ]);
}
function xI(t) {
  return R`not ${t}`;
}
const HI = (t, e) => R`${t} > ${Ye(e, t)}`, JI = (t, e) => R`${t} >= ${Ye(e, t)}`, WI = (t, e) => R`${t} < ${Ye(e, t)}`, XI = (t, e) => R`${t} <= ${Ye(e, t)}`;
function YI(t, e) {
  return Array.isArray(e) ? e.length === 0 ? R`false` : R`${t} in ${e.map((r) => Ye(r, t))}` : R`${t} in ${Ye(e, t)}`;
}
function ZI(t, e) {
  return Array.isArray(e) ? e.length === 0 ? R`true` : R`${t} not in ${e.map((r) => Ye(r, t))}` : R`${t} not in ${Ye(e, t)}`;
}
function ej(t) {
  return R`${t} is null`;
}
function tj(t) {
  return R`${t} is not null`;
}
function rj(t) {
  return R`exists ${t}`;
}
function nj(t) {
  return R`not exists ${t}`;
}
function sj(t, e, r) {
  return R`${t} between ${Ye(e, t)} and ${Ye(
    r,
    t
  )}`;
}
function aj(t, e, r) {
  return R`${t} not between ${Ye(
    e,
    t
  )} and ${Ye(r, t)}`;
}
function oj(t, e) {
  return R`${t} like ${e}`;
}
function ij(t, e) {
  return R`${t} not like ${e}`;
}
function cj(t, e) {
  return R`${t} ilike ${e}`;
}
function lj(t, e) {
  return R`${t} not ilike ${e}`;
}
function uj(t) {
  return R`${t} asc`;
}
function dj(t) {
  return R`${t} desc`;
}
var qd;
qd = k;
class Zc {
  constructor(e, r, n) {
    N(this, "referencedTableName");
    N(this, "fieldName");
    this.sourceTable = e, this.referencedTable = r, this.relationName = n, this.referencedTableName = r[F.Symbol.Name];
  }
}
N(Zc, qd, "Relation");
var zd;
zd = k;
class Sy {
  constructor(e, r) {
    this.table = e, this.config = r;
  }
}
N(Sy, zd, "Relations");
var Ud, Bd;
const oa = class oa extends (Bd = Zc, Ud = k, Bd) {
  constructor(e, r, n, s) {
    super(e, r, n == null ? void 0 : n.relationName), this.config = n, this.isNullable = s;
  }
  withFieldName(e) {
    const r = new oa(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    return r.fieldName = e, r;
  }
};
N(oa, Ud, "One");
let Lr = oa;
var Kd, Qd;
const ia = class ia extends (Qd = Zc, Kd = k, Qd) {
  constructor(e, r, n) {
    super(e, r, n == null ? void 0 : n.relationName), this.config = n;
  }
  withFieldName(e) {
    const r = new ia(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    return r.fieldName = e, r;
  }
};
N(ia, Kd, "Many");
let na = ia;
function fj() {
  return {
    and: jo,
    between: sj,
    eq: us,
    exists: rj,
    gt: HI,
    gte: JI,
    ilike: cj,
    inArray: YI,
    isNull: ej,
    isNotNull: tj,
    like: oj,
    lt: WI,
    lte: XI,
    ne: QI,
    not: xI,
    notBetween: aj,
    notExists: nj,
    notLike: ij,
    notIlike: lj,
    notInArray: ZI,
    or: GI,
    sql: R
  };
}
function hj() {
  return {
    sql: R,
    asc: uj,
    desc: dj
  };
}
function mj(t, e) {
  var a;
  Object.keys(t).length === 1 && "default" in t && !A(t.default, F) && (t = t.default);
  const r = {}, n = {}, s = {};
  for (const [o, i] of Object.entries(t))
    if (A(i, F)) {
      const c = Wn(i), d = n[c];
      r[c] = o, s[o] = {
        tsName: o,
        dbName: i[F.Symbol.Name],
        schema: i[F.Symbol.Schema],
        columns: i[F.Symbol.Columns],
        relations: (d == null ? void 0 : d.relations) ?? {},
        primaryKey: (d == null ? void 0 : d.primaryKey) ?? []
      };
      for (const h of Object.values(
        i[F.Symbol.Columns]
      ))
        h.primary && s[o].primaryKey.push(h);
      const l = (a = i[F.Symbol.ExtraConfigBuilder]) == null ? void 0 : a.call(i, i[F.Symbol.ExtraConfigColumns]);
      if (l)
        for (const h of Object.values(l))
          A(h, wy) && s[o].primaryKey.push(...h.columns);
    } else if (A(i, Sy)) {
      const c = Wn(i.table), d = r[c], l = i.config(
        e(i.table)
      );
      let h;
      for (const [_, $] of Object.entries(l))
        if (d) {
          const w = s[d];
          w.relations[_] = $;
        } else
          c in n || (n[c] = {
            relations: {},
            primaryKey: h
          }), n[c].relations[_] = $;
    }
  return { tables: s, tableNamesMap: r };
}
function pj(t) {
  return function(r, n) {
    return new Lr(
      t,
      r,
      n,
      (n == null ? void 0 : n.fields.reduce((s, a) => s && a.notNull, !0)) ?? !1
    );
  };
}
function yj(t) {
  return function(r, n) {
    return new na(t, r, n);
  };
}
function $j(t, e, r) {
  if (A(r, Lr) && r.config)
    return {
      fields: r.config.fields,
      references: r.config.references
    };
  const n = e[Wn(r.referencedTable)];
  if (!n)
    throw new Error(
      `Table "${r.referencedTable[F.Symbol.Name]}" not found in schema`
    );
  const s = t[n];
  if (!s)
    throw new Error(`Table "${n}" not found in schema`);
  const a = r.sourceTable, o = e[Wn(a)];
  if (!o)
    throw new Error(
      `Table "${a[F.Symbol.Name]}" not found in schema`
    );
  const i = [];
  for (const c of Object.values(
    s.relations
  ))
    (r.relationName && r !== c && c.relationName === r.relationName || !r.relationName && c.referencedTable === r.sourceTable) && i.push(c);
  if (i.length > 1)
    throw r.relationName ? new Error(
      `There are multiple relations with name "${r.relationName}" in table "${n}"`
    ) : new Error(
      `There are multiple relations between "${n}" and "${r.sourceTable[F.Symbol.Name]}". Please specify relation name`
    );
  if (i[0] && A(i[0], Lr) && i[0].config)
    return {
      fields: i[0].config.references,
      references: i[0].config.fields
    };
  throw new Error(
    `There is not enough information to infer relation "${o}.${r.fieldName}"`
  );
}
function gj(t) {
  return {
    one: pj(t),
    many: yj(t)
  };
}
function Co(t, e, r, n, s = (a) => a) {
  const a = {};
  for (const [
    o,
    i
  ] of n.entries())
    if (i.isJson) {
      const c = e.relations[i.tsKey], d = r[o], l = typeof d == "string" ? JSON.parse(d) : d;
      a[i.tsKey] = A(c, Lr) ? l && Co(
        t,
        t[i.relationTableTsKey],
        l,
        i.selection,
        s
      ) : l.map(
        (h) => Co(
          t,
          t[i.relationTableTsKey],
          h,
          i.selection,
          s
        )
      );
    } else {
      const c = s(r[o]), d = i.field;
      let l;
      A(d, Ee) ? l = d : A(d, W) ? l = d.decoder : l = d.sql.decoder, a[i.tsKey] = c === null ? null : l.mapFromDriverValue(c);
    }
  return a;
}
var Gd;
Gd = k;
const ca = class ca {
  constructor(e) {
    N(this, "config");
    this.config = { ...e };
  }
  get(e, r) {
    if (r === "_")
      return {
        ...e._,
        selectedFields: new Proxy(
          e._.selectedFields,
          this
        )
      };
    if (r === ze)
      return {
        ...e[ze],
        selectedFields: new Proxy(
          e[ze].selectedFields,
          this
        )
      };
    if (typeof r == "symbol")
      return e[r];
    const s = (A(e, Ue) ? e._.selectedFields : A(e, Vr) ? e[ze].selectedFields : e)[r];
    if (A(s, W.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !s.isSelectionField)
        return s.sql;
      const a = s.clone();
      return a.isSelectionField = !0, a;
    }
    if (A(s, W)) {
      if (this.config.sqlBehavior === "sql")
        return s;
      throw new Error(
        `You tried to reference "${r}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    return A(s, Ee) ? this.config.alias ? new Proxy(
      s,
      new Xn(
        new Proxy(
          s.table,
          new Oa(this.config.alias, this.config.replaceOriginalName ?? !1)
        )
      )
    ) : s : typeof s != "object" || s === null ? s : new Proxy(s, new ca(this.config));
  }
};
N(ca, Gd, "SelectionProxyHandler");
let Ge = ca;
var xd;
xd = k;
class Ey {
  constructor(e, r) {
    /** @internal */
    N(this, "reference");
    /** @internal */
    N(this, "_onUpdate");
    /** @internal */
    N(this, "_onDelete");
    this.reference = () => {
      const { name: n, columns: s, foreignColumns: a } = e();
      return { name: n, columns: s, foreignTable: a[0].table, foreignColumns: a };
    }, r && (this._onUpdate = r.onUpdate, this._onDelete = r.onDelete);
  }
  onUpdate(e) {
    return this._onUpdate = e, this;
  }
  onDelete(e) {
    return this._onDelete = e, this;
  }
  /** @internal */
  build(e) {
    return new Ny(e, this);
  }
}
N(Ey, xd, "SQLiteForeignKeyBuilder");
var Hd;
Hd = k;
class Ny {
  constructor(e, r) {
    N(this, "reference");
    N(this, "onUpdate");
    N(this, "onDelete");
    this.table = e, this.reference = r.reference, this.onUpdate = r._onUpdate, this.onDelete = r._onDelete;
  }
  getName() {
    const { name: e, columns: r, foreignColumns: n } = this.reference(), s = r.map((i) => i.name), a = n.map((i) => i.name), o = [
      this.table[er],
      ...s,
      n[0].table[er],
      ...a
    ];
    return e ?? `${o.join("_")}_fk`;
  }
}
N(Ny, Hd, "SQLiteForeignKey");
function vj(t, e) {
  return `${t[er]}_${e.join("_")}_unique`;
}
var Jd, Wd;
class ot extends (Wd = uy, Jd = k, Wd) {
  constructor() {
    super(...arguments);
    N(this, "foreignKeyConfigs", []);
  }
  references(r, n = {}) {
    return this.foreignKeyConfigs.push({ ref: r, actions: n }), this;
  }
  unique(r) {
    return this.config.isUnique = !0, this.config.uniqueName = r, this;
  }
  generatedAlwaysAs(r, n) {
    return this.config.generated = {
      as: r,
      type: "always",
      mode: (n == null ? void 0 : n.mode) ?? "virtual"
    }, this;
  }
  /** @internal */
  buildForeignKeys(r, n) {
    return this.foreignKeyConfigs.map(({ ref: s, actions: a }) => ((o, i) => {
      const c = new Ey(() => {
        const d = o();
        return { columns: [r], foreignColumns: [d] };
      });
      return i.onUpdate && c.onUpdate(i.onUpdate), i.onDelete && c.onDelete(i.onDelete), c.build(n);
    })(s, a));
  }
}
N(ot, Jd, "SQLiteColumnBuilder");
var Xd, Yd;
class He extends (Yd = Ee, Xd = k, Yd) {
  constructor(e, r) {
    r.uniqueName || (r.uniqueName = vj(e, [r.name])), super(e, r), this.table = e;
  }
}
N(He, Xd, "SQLiteColumn");
var Zd, ef;
class Py extends (ef = ot, Zd = k, ef) {
  constructor(e) {
    super(e, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(e) {
    return new Ty(e, this.config);
  }
}
N(Py, Zd, "SQLiteBigIntBuilder");
var tf, rf;
class Ty extends (rf = He, tf = k, rf) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const r = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return BigInt(r.toString("utf8"));
    }
    return BigInt(_y.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(e.toString());
  }
}
N(Ty, tf, "SQLiteBigInt");
var nf, sf;
class Oy extends (sf = ot, nf = k, sf) {
  constructor(e) {
    super(e, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(e) {
    return new Ry(
      e,
      this.config
    );
  }
}
N(Oy, nf, "SQLiteBlobJsonBuilder");
var af, of;
class Ry extends (of = He, af = k, of) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const r = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return JSON.parse(r.toString("utf8"));
    }
    return JSON.parse(_y.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(JSON.stringify(e));
  }
}
N(Ry, af, "SQLiteBlobJson");
var cf, lf;
class Iy extends (lf = ot, cf = k, lf) {
  constructor(e) {
    super(e, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(e) {
    return new jy(e, this.config);
  }
}
N(Iy, cf, "SQLiteBlobBufferBuilder");
var uf, df;
class jy extends (df = He, uf = k, df) {
  mapFromDriverValue(e) {
    return Buffer.isBuffer(e) ? e : Buffer.from(e);
  }
  getSQLType() {
    return "blob";
  }
}
N(jy, uf, "SQLiteBlobBuffer");
function _j(t, e) {
  const { name: r, config: n } = ls(t, e);
  return (n == null ? void 0 : n.mode) === "json" ? new Oy(r) : (n == null ? void 0 : n.mode) === "bigint" ? new Py(r) : new Iy(r);
}
var ff, hf;
class Cy extends (hf = ot, ff = k, hf) {
  constructor(e, r, n) {
    super(e, "custom", "SQLiteCustomColumn"), this.config.fieldConfig = r, this.config.customTypeParams = n;
  }
  /** @internal */
  build(e) {
    return new Ay(
      e,
      this.config
    );
  }
}
N(Cy, ff, "SQLiteCustomColumnBuilder");
var mf, pf;
class Ay extends (pf = He, mf = k, pf) {
  constructor(r, n) {
    super(r, n);
    N(this, "sqlName");
    N(this, "mapTo");
    N(this, "mapFrom");
    this.sqlName = n.customTypeParams.dataType(n.fieldConfig), this.mapTo = n.customTypeParams.toDriver, this.mapFrom = n.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(r) {
    return typeof this.mapFrom == "function" ? this.mapFrom(r) : r;
  }
  mapToDriverValue(r) {
    return typeof this.mapTo == "function" ? this.mapTo(r) : r;
  }
}
N(Ay, mf, "SQLiteCustomColumn");
function wj(t) {
  return (e, r) => {
    const { name: n, config: s } = ls(e, r);
    return new Cy(
      n,
      s,
      t
    );
  };
}
var yf, $f;
class Ia extends ($f = ot, yf = k, $f) {
  constructor(e, r, n) {
    super(e, r, n), this.config.autoIncrement = !1;
  }
  primaryKey(e) {
    return e != null && e.autoIncrement && (this.config.autoIncrement = !0), this.config.hasDefault = !0, super.primaryKey();
  }
}
N(Ia, yf, "SQLiteBaseIntegerBuilder");
var gf, vf;
class ja extends (vf = He, gf = k, vf) {
  constructor() {
    super(...arguments);
    N(this, "autoIncrement", this.config.autoIncrement);
  }
  getSQLType() {
    return "integer";
  }
}
N(ja, gf, "SQLiteBaseInteger");
var _f, wf;
class ky extends (wf = Ia, _f = k, wf) {
  constructor(e) {
    super(e, "number", "SQLiteInteger");
  }
  build(e) {
    return new Ly(
      e,
      this.config
    );
  }
}
N(ky, _f, "SQLiteIntegerBuilder");
var bf, Sf;
class Ly extends (Sf = ja, bf = k, Sf) {
}
N(Ly, bf, "SQLiteInteger");
var Ef, Nf;
class Dy extends (Nf = Ia, Ef = k, Nf) {
  constructor(e, r) {
    super(e, "date", "SQLiteTimestamp"), this.config.mode = r;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(R`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(e) {
    return new My(
      e,
      this.config
    );
  }
}
N(Dy, Ef, "SQLiteTimestampBuilder");
var Pf, Tf;
class My extends (Tf = ja, Pf = k, Tf) {
  constructor() {
    super(...arguments);
    N(this, "mode", this.config.mode);
  }
  mapFromDriverValue(r) {
    return this.config.mode === "timestamp" ? new Date(r * 1e3) : new Date(r);
  }
  mapToDriverValue(r) {
    const n = r.getTime();
    return this.config.mode === "timestamp" ? Math.floor(n / 1e3) : n;
  }
}
N(My, Pf, "SQLiteTimestamp");
var Of, Rf;
class Vy extends (Rf = Ia, Of = k, Rf) {
  constructor(e, r) {
    super(e, "boolean", "SQLiteBoolean"), this.config.mode = r;
  }
  build(e) {
    return new Fy(
      e,
      this.config
    );
  }
}
N(Vy, Of, "SQLiteBooleanBuilder");
var If, jf;
class Fy extends (jf = ja, If = k, jf) {
  constructor() {
    super(...arguments);
    N(this, "mode", this.config.mode);
  }
  mapFromDriverValue(r) {
    return Number(r) === 1;
  }
  mapToDriverValue(r) {
    return r ? 1 : 0;
  }
}
N(Fy, If, "SQLiteBoolean");
function el(t, e) {
  const { name: r, config: n } = ls(t, e);
  return (n == null ? void 0 : n.mode) === "timestamp" || (n == null ? void 0 : n.mode) === "timestamp_ms" ? new Dy(r, n.mode) : (n == null ? void 0 : n.mode) === "boolean" ? new Vy(r, n.mode) : new ky(r);
}
var Cf, Af;
class qy extends (Af = ot, Cf = k, Af) {
  constructor(e) {
    super(e, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(e) {
    return new zy(
      e,
      this.config
    );
  }
}
N(qy, Cf, "SQLiteNumericBuilder");
var kf, Lf;
class zy extends (Lf = He, kf = k, Lf) {
  mapFromDriverValue(e) {
    return typeof e == "string" ? e : String(e);
  }
  getSQLType() {
    return "numeric";
  }
}
N(zy, kf, "SQLiteNumeric");
var Df, Mf;
class Uy extends (Mf = ot, Df = k, Mf) {
  constructor(e) {
    super(e, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(e) {
    return new By(
      e,
      this.config
    );
  }
}
N(Uy, Df, "SQLiteNumericNumberBuilder");
var Vf, Ff;
class By extends (Ff = He, Vf = k, Ff) {
  constructor() {
    super(...arguments);
    N(this, "mapToDriverValue", String);
  }
  mapFromDriverValue(r) {
    return typeof r == "number" ? r : Number(r);
  }
  getSQLType() {
    return "numeric";
  }
}
N(By, Vf, "SQLiteNumericNumber");
var qf, zf;
class Ky extends (zf = ot, qf = k, zf) {
  constructor(e) {
    super(e, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(e) {
    return new Qy(
      e,
      this.config
    );
  }
}
N(Ky, qf, "SQLiteNumericBigIntBuilder");
var Uf, Bf;
class Qy extends (Bf = He, Uf = k, Bf) {
  constructor() {
    super(...arguments);
    N(this, "mapFromDriverValue", BigInt);
    N(this, "mapToDriverValue", String);
  }
  getSQLType() {
    return "numeric";
  }
}
N(Qy, Uf, "SQLiteNumericBigInt");
function bj(t, e) {
  const { name: r, config: n } = ls(t, e), s = n == null ? void 0 : n.mode;
  return s === "number" ? new Uy(r) : s === "bigint" ? new Ky(r) : new qy(r);
}
var Kf, Qf;
class Gy extends (Qf = ot, Kf = k, Qf) {
  constructor(e) {
    super(e, "number", "SQLiteReal");
  }
  /** @internal */
  build(e) {
    return new xy(e, this.config);
  }
}
N(Gy, Kf, "SQLiteRealBuilder");
var Gf, xf;
class xy extends (xf = He, Gf = k, xf) {
  getSQLType() {
    return "real";
  }
}
N(xy, Gf, "SQLiteReal");
function Sj(t) {
  return new Gy(t ?? "");
}
var Hf, Jf;
class Hy extends (Jf = ot, Hf = k, Jf) {
  constructor(e, r) {
    super(e, "string", "SQLiteText"), this.config.enumValues = r.enum, this.config.length = r.length;
  }
  /** @internal */
  build(e) {
    return new Jy(
      e,
      this.config
    );
  }
}
N(Hy, Hf, "SQLiteTextBuilder");
var Wf, Xf;
class Jy extends (Xf = He, Wf = k, Xf) {
  constructor(r, n) {
    super(r, n);
    N(this, "enumValues", this.config.enumValues);
    N(this, "length", this.config.length);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
N(Jy, Wf, "SQLiteText");
var Yf, Zf;
class Wy extends (Zf = ot, Yf = k, Zf) {
  constructor(e) {
    super(e, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(e) {
    return new Xy(
      e,
      this.config
    );
  }
}
N(Wy, Yf, "SQLiteTextJsonBuilder");
var eh, th;
class Xy extends (th = He, eh = k, th) {
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(e) {
    return JSON.parse(e);
  }
  mapToDriverValue(e) {
    return JSON.stringify(e);
  }
}
N(Xy, eh, "SQLiteTextJson");
function ft(t, e = {}) {
  const { name: r, config: n } = ls(t, e);
  return n.mode === "json" ? new Wy(r) : new Hy(r, n);
}
function Ej() {
  return {
    blob: _j,
    customType: wj,
    integer: el,
    numeric: bj,
    real: Sj,
    text: ft
  };
}
const Ao = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var rh, nh, sh, ah, oh;
class rt extends (oh = F, ah = k, sh = F.Symbol.Columns, nh = Ao, rh = F.Symbol.ExtraConfigBuilder, oh) {
  constructor() {
    super(...arguments);
    /** @internal */
    N(this, sh);
    /** @internal */
    N(this, nh, []);
    /** @internal */
    N(this, rh);
  }
}
N(rt, ah, "SQLiteTable"), /** @internal */
N(rt, "Symbol", Object.assign({}, F.Symbol, {
  InlineForeignKeys: Ao
}));
function Nj(t, e, r, n, s = t) {
  const a = new rt(t, n, s), o = typeof e == "function" ? e(Ej()) : e, i = Object.fromEntries(
    Object.entries(o).map(([d, l]) => {
      const h = l;
      h.setName(d);
      const _ = h.build(a);
      return a[Ao].push(...h.buildForeignKeys(_, a)), [d, _];
    })
  ), c = Object.assign(a, i);
  return c[F.Symbol.Columns] = i, c[F.Symbol.ExtraConfigColumns] = i, c;
}
const Yy = (t, e, r) => Nj(t, e);
function Pr(t) {
  return A(t, rt) ? [`${t[F.Symbol.BaseName]}`] : A(t, Ue) ? t._.usedTables ?? [] : A(t, W) ? t.usedTables ?? [] : [];
}
var ih, ch;
class ko extends (ch = tr, ih = k, ch) {
  constructor(r, n, s, a) {
    super();
    /** @internal */
    N(this, "config");
    N(this, "run", (r) => this._prepare().run(r));
    N(this, "all", (r) => this._prepare().all(r));
    N(this, "get", (r) => this._prepare().get(r));
    N(this, "values", (r) => this._prepare().values(r));
    this.table = r, this.session = n, this.dialect = s, this.config = { table: r, withList: a };
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(r) {
    return this.config.where = r, this;
  }
  orderBy(...r) {
    if (typeof r[0] == "function") {
      const n = r[0](
        new Proxy(
          this.config.table[F.Symbol.Columns],
          new Ge({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), s = Array.isArray(n) ? n : [n];
      this.config.orderBy = s;
    } else {
      const n = r;
      this.config.orderBy = n;
    }
    return this;
  }
  limit(r) {
    return this.config.limit = r, this;
  }
  returning(r = this.table[rt.Symbol.Columns]) {
    return this.config.returning = kr(r), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: r, ...n } = this.dialect.sqlToQuery(this.getSQL());
    return n;
  }
  /** @internal */
  _prepare(r = !0) {
    return this.session[r ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0,
      void 0,
      {
        type: "delete",
        tables: Pr(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute(r) {
    return this._prepare().execute(r);
  }
  $dynamic() {
    return this;
  }
}
N(ko, ih, "SQLiteDelete");
function Pj(t) {
  return (t.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((r) => r.toLowerCase()).join("_");
}
function Tj(t) {
  return (t.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((r, n, s) => {
    const a = s === 0 ? n.toLowerCase() : `${n[0].toUpperCase()}${n.slice(1)}`;
    return r + a;
  }, "");
}
function Oj(t) {
  return t;
}
var lh;
lh = k;
class Zy {
  constructor(e) {
    /** @internal */
    N(this, "cache", {});
    N(this, "cachedTables", {});
    N(this, "convert");
    this.convert = e === "snake_case" ? Pj : e === "camelCase" ? Tj : Oj;
  }
  getColumnCasing(e) {
    if (!e.keyAsName) return e.name;
    const r = e.table[F.Symbol.Schema] ?? "public", n = e.table[F.Symbol.OriginalName], s = `${r}.${n}.${e.name}`;
    return this.cache[s] || this.cacheTable(e.table), this.cache[s];
  }
  cacheTable(e) {
    const r = e[F.Symbol.Schema] ?? "public", n = e[F.Symbol.OriginalName], s = `${r}.${n}`;
    if (!this.cachedTables[s]) {
      for (const a of Object.values(e[F.Symbol.Columns])) {
        const o = `${s}.${a.name}`;
        this.cache[o] = this.convert(a.name);
      }
      this.cachedTables[s] = !0;
    }
  }
  clearCache() {
    this.cache = {}, this.cachedTables = {};
  }
}
N(Zy, lh, "CasingCache");
var uh, dh;
class Ca extends (dh = Vr, uh = k, dh) {
}
N(Ca, uh, "SQLiteViewBase");
var fh;
fh = k;
class sa {
  constructor(e) {
    /** @internal */
    N(this, "casing");
    this.casing = new Zy(e == null ? void 0 : e.casing);
  }
  escapeName(e) {
    return `"${e.replace(/"/g, '""')}"`;
  }
  escapeParam(e) {
    return "?";
  }
  escapeString(e) {
    return `'${e.replace(/'/g, "''")}'`;
  }
  buildWithCTE(e) {
    if (!(e != null && e.length)) return;
    const r = [R`with `];
    for (const [n, s] of e.entries())
      r.push(R`${R.identifier(s._.alias)} as (${s._.sql})`), n < e.length - 1 && r.push(R`, `);
    return r.push(R` `), R.join(r);
  }
  buildDeleteQuery({
    table: e,
    where: r,
    returning: n,
    withList: s,
    limit: a,
    orderBy: o
  }) {
    const i = this.buildWithCTE(s), c = n ? R` returning ${this.buildSelection(n, { isSingleTable: !0 })}` : void 0, d = r ? R` where ${r}` : void 0, l = this.buildOrderBy(o), h = this.buildLimit(a);
    return R`${i}delete from ${e}${d}${c}${l}${h}`;
  }
  buildUpdateSet(e, r) {
    const n = e[F.Symbol.Columns], s = Object.keys(n).filter(
      (o) => {
        var i;
        return r[o] !== void 0 || ((i = n[o]) == null ? void 0 : i.onUpdateFn) !== void 0;
      }
    ), a = s.length;
    return R.join(
      s.flatMap((o, i) => {
        var _;
        const c = n[o], d = (_ = c.onUpdateFn) == null ? void 0 : _.call(c), l = r[o] ?? (A(d, W) ? d : R.param(d, c)), h = R`${R.identifier(this.casing.getColumnCasing(c))} = ${l}`;
        return i < a - 1 ? [h, R.raw(", ")] : [h];
      })
    );
  }
  buildUpdateQuery({
    table: e,
    set: r,
    where: n,
    returning: s,
    withList: a,
    joins: o,
    from: i,
    limit: c,
    orderBy: d
  }) {
    const l = this.buildWithCTE(a), h = this.buildUpdateSet(e, r), _ = i && R.join([R.raw(" from "), this.buildFromTable(i)]), $ = this.buildJoins(o), w = s ? R` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, v = n ? R` where ${n}` : void 0, g = this.buildOrderBy(d), m = this.buildLimit(c);
    return R`${l}update ${e} set ${h}${_}${$}${v}${w}${g}${m}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(e, { isSingleTable: r = !1 } = {}) {
    const n = e.length, s = e.flatMap(({ field: a }, o) => {
      const i = [];
      if (A(a, W.Aliased) && a.isSelectionField)
        i.push(R.identifier(a.fieldAlias));
      else if (A(a, W.Aliased) || A(a, W)) {
        const c = A(a, W.Aliased) ? a.sql : a;
        r ? i.push(
          new W(
            c.queryChunks.map((d) => A(d, Ee) ? R.identifier(this.casing.getColumnCasing(d)) : d)
          )
        ) : i.push(c), A(a, W.Aliased) && i.push(R` as ${R.identifier(a.fieldAlias)}`);
      } else if (A(a, Ee)) {
        const c = a.table[F.Symbol.Name];
        a.columnType === "SQLiteNumericBigInt" ? r ? i.push(
          R`cast(${R.identifier(this.casing.getColumnCasing(a))} as text)`
        ) : i.push(
          R`cast(${R.identifier(c)}.${R.identifier(this.casing.getColumnCasing(a))} as text)`
        ) : r ? i.push(R.identifier(this.casing.getColumnCasing(a))) : i.push(
          R`${R.identifier(c)}.${R.identifier(this.casing.getColumnCasing(a))}`
        );
      } else if (A(a, Ue)) {
        const c = Object.entries(a._.selectedFields);
        if (c.length === 1) {
          const d = c[0][1], l = A(d, W) ? d.decoder : A(d, Ee) ? { mapFromDriverValue: (h) => d.mapFromDriverValue(h) } : d.sql.decoder;
          l && (a._.sql.decoder = l);
        }
        i.push(a);
      }
      return o < n - 1 && i.push(R`, `), i;
    });
    return R.join(s);
  }
  buildJoins(e) {
    if (!e || e.length === 0)
      return;
    const r = [];
    if (e)
      for (const [n, s] of e.entries()) {
        n === 0 && r.push(R` `);
        const a = s.table, o = s.on ? R` on ${s.on}` : void 0;
        if (A(a, rt)) {
          const i = a[rt.Symbol.Name], c = a[rt.Symbol.Schema], d = a[rt.Symbol.OriginalName], l = i === d ? void 0 : s.alias;
          r.push(
            R`${R.raw(s.joinType)} join ${c ? R`${R.identifier(c)}.` : void 0}${R.identifier(
              d
            )}${l && R` ${R.identifier(l)}`}${o}`
          );
        } else
          r.push(
            R`${R.raw(s.joinType)} join ${a}${o}`
          );
        n < e.length - 1 && r.push(R` `);
      }
    return R.join(r);
  }
  buildLimit(e) {
    return typeof e == "object" || typeof e == "number" && e >= 0 ? R` limit ${e}` : void 0;
  }
  buildOrderBy(e) {
    const r = [];
    if (e)
      for (const [n, s] of e.entries())
        r.push(s), n < e.length - 1 && r.push(R`, `);
    return r.length > 0 ? R` order by ${R.join(r)}` : void 0;
  }
  buildFromTable(e) {
    return A(e, F) && e[F.Symbol.IsAlias] ? R`${R`${R.identifier(e[F.Symbol.Schema] ?? "")}.`.if(e[F.Symbol.Schema])}${R.identifier(
      e[F.Symbol.OriginalName]
    )} ${R.identifier(e[F.Symbol.Name])}` : e;
  }
  buildSelectQuery({
    withList: e,
    fields: r,
    fieldsFlat: n,
    where: s,
    having: a,
    table: o,
    joins: i,
    orderBy: c,
    groupBy: d,
    limit: l,
    offset: h,
    distinct: _,
    setOperators: $
  }) {
    const w = n ?? kr(r);
    for (const ne of w)
      if (A(ne.field, Ee) && Zr(ne.field.table) !== (A(o, Ue) ? o._.alias : A(o, Ca) ? o[ze].name : A(o, W) ? void 0 : Zr(o)) && !((G) => i == null ? void 0 : i.some(
        ({ alias: he }) => he === (G[F.Symbol.IsAlias] ? Zr(G) : G[F.Symbol.BaseName])
      ))(ne.field.table)) {
        const G = Zr(ne.field.table);
        throw new Error(
          `Your "${ne.path.join(
            "->"
          )}" field references a column "${G}"."${ne.field.name}", but the table "${G}" is not part of the query! Did you forget to join it?`
        );
      }
    const v = !i || i.length === 0, g = this.buildWithCTE(e), m = _ ? R` distinct` : void 0, b = this.buildSelection(w, { isSingleTable: v }), T = this.buildFromTable(o), O = this.buildJoins(i), I = s ? R` where ${s}` : void 0, q = a ? R` having ${a}` : void 0, D = [];
    if (d)
      for (const [ne, G] of d.entries())
        D.push(G), ne < d.length - 1 && D.push(R`, `);
    const Y = D.length > 0 ? R` group by ${R.join(D)}` : void 0, de = this.buildOrderBy(c), ge = this.buildLimit(l), Q = h ? R` offset ${h}` : void 0, x = R`${g}select${m} ${b} from ${T}${O}${I}${Y}${q}${de}${ge}${Q}`;
    return $.length > 0 ? this.buildSetOperations(x, $) : x;
  }
  buildSetOperations(e, r) {
    const [n, ...s] = r;
    if (!n)
      throw new Error("Cannot pass undefined values to any set operator");
    return s.length === 0 ? this.buildSetOperationQuery({ leftSelect: e, setOperator: n }) : this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect: e, setOperator: n }),
      s
    );
  }
  buildSetOperationQuery({
    leftSelect: e,
    setOperator: { type: r, isAll: n, rightSelect: s, limit: a, orderBy: o, offset: i }
  }) {
    const c = R`${e.getSQL()} `, d = R`${s.getSQL()}`;
    let l;
    if (o && o.length > 0) {
      const w = [];
      for (const v of o)
        if (A(v, He))
          w.push(R.identifier(v.name));
        else if (A(v, W)) {
          for (let g = 0; g < v.queryChunks.length; g++) {
            const m = v.queryChunks[g];
            A(m, He) && (v.queryChunks[g] = R.identifier(
              this.casing.getColumnCasing(m)
            ));
          }
          w.push(R`${v}`);
        } else
          w.push(R`${v}`);
      l = R` order by ${R.join(w, R`, `)}`;
    }
    const h = typeof a == "object" || typeof a == "number" && a >= 0 ? R` limit ${a}` : void 0, _ = R.raw(`${r} ${n ? "all " : ""}`), $ = i ? R` offset ${i}` : void 0;
    return R`${c}${_}${d}${l}${h}${$}`;
  }
  buildInsertQuery({
    table: e,
    values: r,
    onConflict: n,
    returning: s,
    withList: a,
    select: o
  }) {
    const i = [], c = e[F.Symbol.Columns], d = Object.entries(c).filter(
      ([v, g]) => !g.shouldDisableInsert()
    ), l = d.map(([, v]) => R.identifier(this.casing.getColumnCasing(v)));
    if (o) {
      const v = r;
      A(v, W) ? i.push(v) : i.push(v.getSQL());
    } else {
      const v = r;
      i.push(R.raw("values "));
      for (const [g, m] of v.entries()) {
        const b = [];
        for (const [T, O] of d) {
          const I = m[T];
          if (I === void 0 || A(I, Mt) && I.value === void 0) {
            let q;
            if (O.default !== null && O.default !== void 0)
              q = A(O.default, W) ? O.default : R.param(O.default, O);
            else if (O.defaultFn !== void 0) {
              const D = O.defaultFn();
              q = A(D, W) ? D : R.param(D, O);
            } else if (!O.default && O.onUpdateFn !== void 0) {
              const D = O.onUpdateFn();
              q = A(D, W) ? D : R.param(D, O);
            } else
              q = R`null`;
            b.push(q);
          } else
            b.push(I);
        }
        i.push(b), g < v.length - 1 && i.push(R`, `);
      }
    }
    const h = this.buildWithCTE(a), _ = R.join(i), $ = s ? R` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, w = n != null && n.length ? R.join(n) : void 0;
    return R`${h}insert into ${e} ${l} ${_}${w}${$}`;
  }
  sqlToQuery(e, r) {
    return e.toQuery({
      casing: this.casing,
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      invokeSource: r
    });
  }
  buildRelationalQuery({
    fullSchema: e,
    schema: r,
    tableNamesMap: n,
    table: s,
    tableConfig: a,
    queryConfig: o,
    tableAlias: i,
    nestedQueryRelation: c,
    joinOn: d
  }) {
    let l = [], h, _, $ = [], w;
    const v = [];
    if (o === !0)
      l = Object.entries(a.columns).map(([b, T]) => ({
        dbKey: T.name,
        tsKey: b,
        field: Pt(T, i),
        relationTableTsKey: void 0,
        isJson: !1,
        selection: []
      }));
    else {
      const m = Object.fromEntries(
        Object.entries(a.columns).map(([D, Y]) => [
          D,
          Pt(Y, i)
        ])
      );
      if (o.where) {
        const D = typeof o.where == "function" ? o.where(m, fj()) : o.where;
        w = D && ra(D, i);
      }
      const b = [];
      let T = [];
      if (o.columns) {
        let D = !1;
        for (const [Y, de] of Object.entries(o.columns))
          de !== void 0 && Y in a.columns && (!D && de === !0 && (D = !0), T.push(Y));
        T.length > 0 && (T = D ? T.filter((Y) => {
          var de;
          return ((de = o.columns) == null ? void 0 : de[Y]) === !0;
        }) : Object.keys(a.columns).filter(
          (Y) => !T.includes(Y)
        ));
      } else
        T = Object.keys(a.columns);
      for (const D of T) {
        const Y = a.columns[D];
        b.push({ tsKey: D, value: Y });
      }
      let O = [];
      o.with && (O = Object.entries(o.with).filter(
        (D) => !!D[1]
      ).map(([D, Y]) => ({
        tsKey: D,
        queryConfig: Y,
        relation: a.relations[D]
      })));
      let I;
      if (o.extras) {
        I = typeof o.extras == "function" ? o.extras(m, { sql: R }) : o.extras;
        for (const [D, Y] of Object.entries(I))
          b.push({
            tsKey: D,
            value: my(Y, i)
          });
      }
      for (const { tsKey: D, value: Y } of b)
        l.push({
          dbKey: A(Y, W.Aliased) ? Y.fieldAlias : a.columns[D].name,
          tsKey: D,
          field: A(Y, Ee) ? Pt(Y, i) : Y,
          relationTableTsKey: void 0,
          isJson: !1,
          selection: []
        });
      let q = typeof o.orderBy == "function" ? o.orderBy(m, hj()) : o.orderBy ?? [];
      Array.isArray(q) || (q = [q]), $ = q.map((D) => A(D, Ee) ? Pt(D, i) : ra(D, i)), h = o.limit, _ = o.offset;
      for (const {
        tsKey: D,
        queryConfig: Y,
        relation: de
      } of O) {
        const ge = $j(
          r,
          n,
          de
        ), Q = Wn(de.referencedTable), x = n[Q], ne = `${i}_${D}`, G = jo(
          ...ge.fields.map(
            (M, L) => us(
              Pt(
                ge.references[L],
                ne
              ),
              Pt(M, i)
            )
          )
        ), he = this.buildRelationalQuery({
          fullSchema: e,
          schema: r,
          tableNamesMap: n,
          table: e[x],
          tableConfig: r[x],
          queryConfig: A(de, Lr) ? Y === !0 ? { limit: 1 } : { ...Y, limit: 1 } : Y,
          tableAlias: ne,
          joinOn: G,
          nestedQueryRelation: de
        }), Te = R`(${he.sql})`.as(D);
        l.push({
          dbKey: D,
          tsKey: D,
          field: Te,
          relationTableTsKey: x,
          isJson: !0,
          selection: he.selection
        });
      }
    }
    if (l.length === 0)
      throw new Ra({
        message: `No fields selected for table "${a.tsName}" ("${i}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    let g;
    if (w = jo(d, w), c) {
      let m = R`json_array(${R.join(
        l.map(
          ({ field: O }) => A(O, He) ? R.identifier(this.casing.getColumnCasing(O)) : A(O, W.Aliased) ? O.sql : O
        ),
        R`, `
      )})`;
      A(c, na) && (m = R`coalesce(json_group_array(${m}), json_array())`);
      const b = [
        {
          dbKey: "data",
          tsKey: "data",
          field: m.as("data"),
          isJson: !0,
          relationTableTsKey: a.tsName,
          selection: l
        }
      ];
      h !== void 0 || _ !== void 0 || $.length > 0 ? (g = this.buildSelectQuery({
        table: oo(s, i),
        fields: {},
        fieldsFlat: [
          {
            path: [],
            field: R.raw("*")
          }
        ],
        where: w,
        limit: h,
        offset: _,
        orderBy: $,
        setOperators: []
      }), w = void 0, h = void 0, _ = void 0, $ = void 0) : g = oo(s, i), g = this.buildSelectQuery({
        table: A(g, rt) ? g : new Ue(g, {}, i),
        fields: {},
        fieldsFlat: b.map(({ field: O }) => ({
          path: [],
          field: A(O, Ee) ? Pt(O, i) : O
        })),
        joins: v,
        where: w,
        limit: h,
        offset: _,
        orderBy: $,
        setOperators: []
      });
    } else
      g = this.buildSelectQuery({
        table: oo(s, i),
        fields: {},
        fieldsFlat: l.map(({ field: m }) => ({
          path: [],
          field: A(m, Ee) ? Pt(m, i) : m
        })),
        joins: v,
        where: w,
        limit: h,
        offset: _,
        orderBy: $,
        setOperators: []
      });
    return {
      tableTsKey: a.tsName,
      sql: g,
      selection: l
    };
  }
}
N(sa, fh, "SQLiteDialect");
var hh, mh;
class tl extends (mh = sa, hh = k, mh) {
  migrate(e, r, n) {
    const s = n === void 0 || typeof n == "string" ? "__drizzle_migrations" : n.migrationsTable ?? "__drizzle_migrations", a = R`
			CREATE TABLE IF NOT EXISTS ${R.identifier(s)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    r.run(a);
    const i = r.values(
      R`SELECT id, hash, created_at FROM ${R.identifier(s)} ORDER BY created_at DESC LIMIT 1`
    )[0] ?? void 0;
    r.run(R`BEGIN`);
    try {
      for (const c of e)
        if (!i || Number(i[2]) < c.folderMillis) {
          for (const d of c.sql)
            r.run(R.raw(d));
          r.run(
            R`INSERT INTO ${R.identifier(
              s
            )} ("hash", "created_at") VALUES(${c.hash}, ${c.folderMillis})`
          );
        }
      r.run(R`COMMIT`);
    } catch (c) {
      throw r.run(R`ROLLBACK`), c;
    }
  }
}
N(tl, hh, "SQLiteSyncDialect");
var ph;
ph = k;
class e$ {
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
N(e$, ph, "TypedQueryBuilder");
var yh;
yh = k;
class Rt {
  constructor(e) {
    N(this, "fields");
    N(this, "session");
    N(this, "dialect");
    N(this, "withList");
    N(this, "distinct");
    this.fields = e.fields, this.session = e.session, this.dialect = e.dialect, this.withList = e.withList, this.distinct = e.distinct;
  }
  from(e) {
    const r = !!this.fields;
    let n;
    return this.fields ? n = this.fields : A(e, Ue) ? n = Object.fromEntries(
      Object.keys(e._.selectedFields).map((s) => [s, e[s]])
    ) : A(e, Ca) ? n = e[ze].selectedFields : A(e, W) ? n = {} : n = BI(e), new rl({
      table: e,
      fields: n,
      isPartialSelect: r,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
}
N(Rt, yh, "SQLiteSelectBuilder");
var $h, gh;
class t$ extends (gh = e$, $h = k, gh) {
  constructor({ table: r, fields: n, isPartialSelect: s, session: a, dialect: o, withList: i, distinct: c }) {
    super();
    N(this, "_");
    /** @internal */
    N(this, "config");
    N(this, "joinsNotNullableMap");
    N(this, "tableName");
    N(this, "isPartialSelect");
    N(this, "session");
    N(this, "dialect");
    N(this, "cacheConfig");
    N(this, "usedTables", /* @__PURE__ */ new Set());
    /**
     * Executes a `left join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    N(this, "leftJoin", this.createJoin("left"));
    /**
     * Executes a `right join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    N(this, "rightJoin", this.createJoin("right"));
    /**
     * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
     *
     * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    N(this, "innerJoin", this.createJoin("inner"));
    /**
     * Executes a `full join` operation by combining rows from two tables into a new table.
     *
     * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    N(this, "fullJoin", this.createJoin("full"));
    /**
     * Executes a `cross join` operation by combining rows from two tables into a new table.
     *
     * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
     *
     * @param table the table to join.
     *
     * @example
     *
     * ```ts
     * // Select all users, each user with every pet
     * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
     *   .from(users)
     *   .crossJoin(pets)
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .crossJoin(pets)
     * ```
     */
    N(this, "crossJoin", this.createJoin("cross"));
    /**
     * Adds `union` set operator to the query.
     *
     * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
     *
     * @example
     *
     * ```ts
     * // Select all unique names from customers and users tables
     * await db.select({ name: users.name })
     *   .from(users)
     *   .union(
     *     db.select({ name: customers.name }).from(customers)
     *   );
     * // or
     * import { union } from 'drizzle-orm/sqlite-core'
     *
     * await union(
     *   db.select({ name: users.name }).from(users),
     *   db.select({ name: customers.name }).from(customers)
     * );
     * ```
     */
    N(this, "union", this.createSetOperator("union", !1));
    /**
     * Adds `union all` set operator to the query.
     *
     * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
     *
     * @example
     *
     * ```ts
     * // Select all transaction ids from both online and in-store sales
     * await db.select({ transaction: onlineSales.transactionId })
     *   .from(onlineSales)
     *   .unionAll(
     *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     *   );
     * // or
     * import { unionAll } from 'drizzle-orm/sqlite-core'
     *
     * await unionAll(
     *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
     *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     * );
     * ```
     */
    N(this, "unionAll", this.createSetOperator("union", !0));
    /**
     * Adds `intersect` set operator to the query.
     *
     * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
     *
     * @example
     *
     * ```ts
     * // Select course names that are offered in both departments A and B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .intersect(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { intersect } from 'drizzle-orm/sqlite-core'
     *
     * await intersect(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    N(this, "intersect", this.createSetOperator("intersect", !1));
    /**
     * Adds `except` set operator to the query.
     *
     * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
     *
     * @example
     *
     * ```ts
     * // Select all courses offered in department A but not in department B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .except(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { except } from 'drizzle-orm/sqlite-core'
     *
     * await except(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    N(this, "except", this.createSetOperator("except", !1));
    this.config = {
      withList: i,
      table: r,
      fields: { ...n },
      distinct: c,
      setOperators: []
    }, this.isPartialSelect = s, this.session = a, this.dialect = o, this._ = {
      selectedFields: n,
      config: this.config
    }, this.tableName = Ro(r), this.joinsNotNullableMap = typeof this.tableName == "string" ? { [this.tableName]: !0 } : {};
    for (const d of Pr(r)) this.usedTables.add(d);
  }
  /** @internal */
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(r) {
    return (n, s) => {
      var i;
      const a = this.tableName, o = Ro(n);
      for (const c of Pr(n)) this.usedTables.add(c);
      if (typeof o == "string" && ((i = this.config.joins) != null && i.some((c) => c.alias === o)))
        throw new Error(`Alias "${o}" is already used in this query`);
      if (!this.isPartialSelect && (Object.keys(this.joinsNotNullableMap).length === 1 && typeof a == "string" && (this.config.fields = {
        [a]: this.config.fields
      }), typeof o == "string" && !A(n, W))) {
        const c = A(n, Ue) ? n._.selectedFields : A(n, Vr) ? n[ze].selectedFields : n[F.Symbol.Columns];
        this.config.fields[o] = c;
      }
      if (typeof s == "function" && (s = s(
        new Proxy(
          this.config.fields,
          new Ge({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      )), this.config.joins || (this.config.joins = []), this.config.joins.push({ on: s, table: n, joinType: r, alias: o }), typeof o == "string")
        switch (r) {
          case "left": {
            this.joinsNotNullableMap[o] = !1;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([c]) => [c, !1])
            ), this.joinsNotNullableMap[o] = !0;
            break;
          }
          case "cross":
          case "inner": {
            this.joinsNotNullableMap[o] = !0;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([c]) => [c, !1])
            ), this.joinsNotNullableMap[o] = !1;
            break;
          }
        }
      return this;
    };
  }
  createSetOperator(r, n) {
    return (s) => {
      const a = typeof s == "function" ? s(Rj()) : s;
      if (!Yc(this.getSelectedFields(), a.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      return this.config.setOperators.push({ type: r, isAll: n, rightSelect: a }), this;
    };
  }
  /** @internal */
  addSetOperators(r) {
    return this.config.setOperators.push(...r), this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(r) {
    return typeof r == "function" && (r = r(
      new Proxy(
        this.config.fields,
        new Ge({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.where = r, this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(r) {
    return typeof r == "function" && (r = r(
      new Proxy(
        this.config.fields,
        new Ge({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.having = r, this;
  }
  groupBy(...r) {
    if (typeof r[0] == "function") {
      const n = r[0](
        new Proxy(
          this.config.fields,
          new Ge({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(n) ? n : [n];
    } else
      this.config.groupBy = r;
    return this;
  }
  orderBy(...r) {
    if (typeof r[0] == "function") {
      const n = r[0](
        new Proxy(
          this.config.fields,
          new Ge({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), s = Array.isArray(n) ? n : [n];
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = s : this.config.orderBy = s;
    } else {
      const n = r;
      this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).orderBy = n : this.config.orderBy = n;
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(r) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).limit = r : this.config.limit = r, this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(r) {
    return this.config.setOperators.length > 0 ? this.config.setOperators.at(-1).offset = r : this.config.offset = r, this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: r, ...n } = this.dialect.sqlToQuery(this.getSQL());
    return n;
  }
  as(r) {
    const n = [];
    if (n.push(...Pr(this.config.table)), this.config.joins)
      for (const s of this.config.joins) n.push(...Pr(s.table));
    return new Proxy(
      new Ue(this.getSQL(), this.config.fields, r, !1, [...new Set(n)]),
      new Ge({ alias: r, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new Ge({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
}
N(t$, $h, "SQLiteSelectQueryBuilder");
var vh, _h;
class rl extends (_h = t$, vh = k, _h) {
  constructor() {
    super(...arguments);
    N(this, "run", (r) => this._prepare().run(r));
    N(this, "all", (r) => this._prepare().all(r));
    N(this, "get", (r) => this._prepare().get(r));
    N(this, "values", (r) => this._prepare().values(r));
  }
  /** @internal */
  _prepare(r = !0) {
    if (!this.session)
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    const n = kr(this.config.fields), s = this.session[r ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      n,
      "all",
      !0,
      void 0,
      {
        type: "select",
        tables: [...this.usedTables]
      },
      this.cacheConfig
    );
    return s.joinsNotNullableMap = this.joinsNotNullableMap, s;
  }
  $withCache(r) {
    return this.cacheConfig = r === void 0 ? { config: {}, enable: !0, autoInvalidate: !0 } : r === !1 ? { enable: !1 } : { enable: !0, autoInvalidate: !0, ...r }, this;
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute() {
    return this.all();
  }
}
N(rl, vh, "SQLiteSelect");
UI(rl, [tr]);
function Aa(t, e) {
  return (r, n, ...s) => {
    const a = [n, ...s].map((o) => ({
      type: t,
      isAll: e,
      rightSelect: o
    }));
    for (const o of a)
      if (!Yc(r.getSelectedFields(), o.rightSelect.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
    return r.addSetOperators(a);
  };
}
const Rj = () => ({
  union: Ij,
  unionAll: jj,
  intersect: Cj,
  except: Aj
}), Ij = Aa("union", !1), jj = Aa("union", !0), Cj = Aa("intersect", !1), Aj = Aa("except", !1);
var wh;
wh = k;
class nl {
  constructor(e) {
    N(this, "dialect");
    N(this, "dialectConfig");
    N(this, "$with", (e, r) => {
      const n = this;
      return { as: (a) => (typeof a == "function" && (a = a(n)), new Proxy(
        new Xc(
          a.getSQL(),
          r ?? ("getSelectedFields" in a ? a.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new Ge({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      )) };
    });
    this.dialect = A(e, sa) ? e : void 0, this.dialectConfig = A(e, sa) ? void 0 : e;
  }
  with(...e) {
    const r = this;
    function n(a) {
      return new Rt({
        fields: a ?? void 0,
        session: void 0,
        dialect: r.getDialect(),
        withList: e
      });
    }
    function s(a) {
      return new Rt({
        fields: a ?? void 0,
        session: void 0,
        dialect: r.getDialect(),
        withList: e,
        distinct: !0
      });
    }
    return { select: n, selectDistinct: s };
  }
  select(e) {
    return new Rt({ fields: e ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(e) {
    return new Rt({
      fields: e ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: !0
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    return this.dialect || (this.dialect = new tl(this.dialectConfig)), this.dialect;
  }
}
N(nl, wh, "SQLiteQueryBuilder");
var bh;
bh = k;
class Lo {
  constructor(e, r, n, s) {
    this.table = e, this.session = r, this.dialect = n, this.withList = s;
  }
  values(e) {
    if (e = Array.isArray(e) ? e : [e], e.length === 0)
      throw new Error("values() must be called with at least one value");
    const r = e.map((n) => {
      const s = {}, a = this.table[F.Symbol.Columns];
      for (const o of Object.keys(n)) {
        const i = n[o];
        s[o] = A(i, W) ? i : new Mt(i, a[o]);
      }
      return s;
    });
    return new Do(this.table, r, this.session, this.dialect, this.withList);
  }
  select(e) {
    const r = typeof e == "function" ? e(new nl()) : e;
    if (!A(r, W) && !Yc(this.table[Oo], r._.selectedFields))
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    return new Do(this.table, r, this.session, this.dialect, this.withList, !0);
  }
}
N(Lo, bh, "SQLiteInsertBuilder");
var Sh, Eh;
class Do extends (Eh = tr, Sh = k, Eh) {
  constructor(r, n, s, a, o, i) {
    super();
    /** @internal */
    N(this, "config");
    N(this, "run", (r) => this._prepare().run(r));
    N(this, "all", (r) => this._prepare().all(r));
    N(this, "get", (r) => this._prepare().get(r));
    N(this, "values", (r) => this._prepare().values(r));
    this.session = s, this.dialect = a, this.config = { table: r, values: n, withList: o, select: i };
  }
  returning(r = this.config.table[rt.Symbol.Columns]) {
    return this.config.returning = kr(r), this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(r = {}) {
    if (this.config.onConflict || (this.config.onConflict = []), r.target === void 0)
      this.config.onConflict.push(R` on conflict do nothing`);
    else {
      const n = Array.isArray(r.target) ? R`${r.target}` : R`${[r.target]}`, s = r.where ? R` where ${r.where}` : R``;
      this.config.onConflict.push(R` on conflict ${n} do nothing${s}`);
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(r) {
    if (r.where && (r.targetWhere || r.setWhere))
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    this.config.onConflict || (this.config.onConflict = []);
    const n = r.where ? R` where ${r.where}` : void 0, s = r.targetWhere ? R` where ${r.targetWhere}` : void 0, a = r.setWhere ? R` where ${r.setWhere}` : void 0, o = Array.isArray(r.target) ? R`${r.target}` : R`${[r.target]}`, i = this.dialect.buildUpdateSet(this.config.table, vy(this.config.table, r.set));
    return this.config.onConflict.push(
      R` on conflict ${o}${s} do update set ${i}${n}${a}`
    ), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: r, ...n } = this.dialect.sqlToQuery(this.getSQL());
    return n;
  }
  /** @internal */
  _prepare(r = !0) {
    return this.session[r ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0,
      void 0,
      {
        type: "insert",
        tables: Pr(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
N(Do, Sh, "SQLiteInsert");
var Nh;
Nh = k;
class Mo {
  constructor(e, r, n, s) {
    this.table = e, this.session = r, this.dialect = n, this.withList = s;
  }
  set(e) {
    return new r$(
      this.table,
      vy(this.table, e),
      this.session,
      this.dialect,
      this.withList
    );
  }
}
N(Mo, Nh, "SQLiteUpdateBuilder");
var Ph, Th;
class r$ extends (Th = tr, Ph = k, Th) {
  constructor(r, n, s, a, o) {
    super();
    /** @internal */
    N(this, "config");
    N(this, "leftJoin", this.createJoin("left"));
    N(this, "rightJoin", this.createJoin("right"));
    N(this, "innerJoin", this.createJoin("inner"));
    N(this, "fullJoin", this.createJoin("full"));
    N(this, "run", (r) => this._prepare().run(r));
    N(this, "all", (r) => this._prepare().all(r));
    N(this, "get", (r) => this._prepare().get(r));
    N(this, "values", (r) => this._prepare().values(r));
    this.session = s, this.dialect = a, this.config = { set: n, table: r, withList: o, joins: [] };
  }
  from(r) {
    return this.config.from = r, this;
  }
  createJoin(r) {
    return (n, s) => {
      const a = Ro(n);
      if (typeof a == "string" && this.config.joins.some((o) => o.alias === a))
        throw new Error(`Alias "${a}" is already used in this query`);
      if (typeof s == "function") {
        const o = this.config.from ? A(n, rt) ? n[F.Symbol.Columns] : A(n, Ue) ? n._.selectedFields : A(n, Ca) ? n[ze].selectedFields : void 0 : void 0;
        s = s(
          new Proxy(
            this.config.table[F.Symbol.Columns],
            new Ge({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          o && new Proxy(
            o,
            new Ge({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      return this.config.joins.push({ on: s, table: n, joinType: r, alias: a }), this;
    };
  }
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(r) {
    return this.config.where = r, this;
  }
  orderBy(...r) {
    if (typeof r[0] == "function") {
      const n = r[0](
        new Proxy(
          this.config.table[F.Symbol.Columns],
          new Ge({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      ), s = Array.isArray(n) ? n : [n];
      this.config.orderBy = s;
    } else {
      const n = r;
      this.config.orderBy = n;
    }
    return this;
  }
  limit(r) {
    return this.config.limit = r, this;
  }
  returning(r = this.config.table[rt.Symbol.Columns]) {
    return this.config.returning = kr(r), this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: r, ...n } = this.dialect.sqlToQuery(this.getSQL());
    return n;
  }
  /** @internal */
  _prepare(r = !0) {
    return this.session[r ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      !0,
      void 0,
      {
        type: "insert",
        tables: Pr(this.config.table)
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
N(r$, Ph, "SQLiteUpdate");
var Oh, Rh, Ih;
const xn = class xn extends (Ih = W, Rh = k, Oh = Symbol.toStringTag, Ih) {
  constructor(r) {
    super(xn.buildEmbeddedCount(r.source, r.filters).queryChunks);
    N(this, "sql");
    N(this, Oh, "SQLiteCountBuilderAsync");
    N(this, "session");
    this.params = r, this.session = r.session, this.sql = xn.buildCount(
      r.source,
      r.filters
    );
  }
  static buildEmbeddedCount(r, n) {
    return R`(select count(*) from ${r}${R.raw(" where ").if(n)}${n})`;
  }
  static buildCount(r, n) {
    return R`select count(*) from ${r}${R.raw(" where ").if(n)}${n}`;
  }
  then(r, n) {
    return Promise.resolve(this.session.count(this.sql)).then(
      r,
      n
    );
  }
  catch(r) {
    return this.then(void 0, r);
  }
  finally(r) {
    return this.then(
      (n) => (r == null || r(), n),
      (n) => {
        throw r == null || r(), n;
      }
    );
  }
};
N(xn, Rh, "SQLiteCountBuilderAsync");
let Vo = xn;
var jh;
jh = k;
class n$ {
  constructor(e, r, n, s, a, o, i, c) {
    this.mode = e, this.fullSchema = r, this.schema = n, this.tableNamesMap = s, this.table = a, this.tableConfig = o, this.dialect = i, this.session = c;
  }
  findMany(e) {
    return this.mode === "sync" ? new Fo(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    ) : new aa(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    );
  }
  findFirst(e) {
    return this.mode === "sync" ? new Fo(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    ) : new aa(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    );
  }
}
N(n$, jh, "SQLiteAsyncRelationalQueryBuilder");
var Ch, Ah;
class aa extends (Ah = tr, Ch = k, Ah) {
  constructor(r, n, s, a, o, i, c, d, l) {
    super();
    /** @internal */
    N(this, "mode");
    this.fullSchema = r, this.schema = n, this.tableNamesMap = s, this.table = a, this.tableConfig = o, this.dialect = i, this.session = c, this.config = d, this.mode = l;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  /** @internal */
  _prepare(r = !1) {
    const { query: n, builtQuery: s } = this._toSQL();
    return this.session[r ? "prepareOneTimeQuery" : "prepareQuery"](
      s,
      void 0,
      this.mode === "first" ? "get" : "all",
      !0,
      (a, o) => {
        const i = a.map(
          (c) => Co(this.schema, this.tableConfig, c, n.selection, o)
        );
        return this.mode === "first" ? i[0] : i;
      }
    );
  }
  prepare() {
    return this._prepare(!1);
  }
  _toSQL() {
    const r = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }), n = this.dialect.sqlToQuery(r.sql);
    return { query: r, builtQuery: n };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  /** @internal */
  executeRaw() {
    return this.mode === "first" ? this._prepare(!1).get() : this._prepare(!1).all();
  }
  async execute() {
    return this.executeRaw();
  }
}
N(aa, Ch, "SQLiteAsyncRelationalQuery");
var kh, Lh;
class Fo extends (Lh = aa, kh = k, Lh) {
  sync() {
    return this.executeRaw();
  }
}
N(Fo, kh, "SQLiteSyncRelationalQuery");
var Dh, Mh;
class Ln extends (Mh = tr, Dh = k, Mh) {
  constructor(r, n, s, a, o) {
    super();
    /** @internal */
    N(this, "config");
    this.execute = r, this.getSQL = n, this.dialect = a, this.mapBatchResult = o, this.config = { action: s };
  }
  getQuery() {
    return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
  }
  mapResult(r, n) {
    return n ? this.mapBatchResult(r) : r;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return !1;
  }
}
N(Ln, Dh, "SQLiteRaw");
var Vh;
Vh = k;
class sl {
  constructor(e, r, n, s) {
    N(this, "query");
    /**
     * Creates a subquery that defines a temporary named result set as a CTE.
     *
     * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
     *
     * @param alias The alias for the subquery.
     *
     * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
     *
     * @example
     *
     * ```ts
     * // Create a subquery with alias 'sq' and use it in the select query
     * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
     *
     * const result = await db.with(sq).select().from(sq);
     * ```
     *
     * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
     *
     * ```ts
     * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
     * const sq = db.$with('sq').as(db.select({
     *   name: sql<string>`upper(${users.name})`.as('name'),
     * })
     * .from(users));
     *
     * const result = await db.with(sq).select({ name: sq.name }).from(sq);
     * ```
     */
    N(this, "$with", (e, r) => {
      const n = this;
      return { as: (a) => (typeof a == "function" && (a = a(new nl(n.dialect))), new Proxy(
        new Xc(
          a.getSQL(),
          r ?? ("getSelectedFields" in a ? a.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new Ge({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      )) };
    });
    N(this, "$cache");
    this.resultKind = e, this.dialect = r, this.session = n, this._ = s ? {
      schema: s.schema,
      fullSchema: s.fullSchema,
      tableNamesMap: s.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    }, this.query = {};
    const a = this.query;
    if (this._.schema)
      for (const [o, i] of Object.entries(this._.schema))
        a[o] = new n$(
          e,
          s.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          s.fullSchema[o],
          i,
          r,
          n
        );
    this.$cache = { invalidate: async (o) => {
    } };
  }
  $count(e, r) {
    return new Vo({ source: e, filters: r, session: this.session });
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...e) {
    const r = this;
    function n(c) {
      return new Rt({
        fields: c ?? void 0,
        session: r.session,
        dialect: r.dialect,
        withList: e
      });
    }
    function s(c) {
      return new Rt({
        fields: c ?? void 0,
        session: r.session,
        dialect: r.dialect,
        withList: e,
        distinct: !0
      });
    }
    function a(c) {
      return new Mo(c, r.session, r.dialect, e);
    }
    function o(c) {
      return new Lo(c, r.session, r.dialect, e);
    }
    function i(c) {
      return new ko(c, r.session, r.dialect, e);
    }
    return { select: n, selectDistinct: s, update: a, insert: o, delete: i };
  }
  select(e) {
    return new Rt({ fields: e ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(e) {
    return new Rt({
      fields: e ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: !0
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(e) {
    return new Mo(e, this.session, this.dialect);
  }
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(e) {
    return new Lo(e, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(e) {
    return new ko(e, this.session, this.dialect);
  }
  run(e) {
    const r = typeof e == "string" ? R.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Ln(
      async () => this.session.run(r),
      () => r,
      "run",
      this.dialect,
      this.session.extractRawRunValueFromBatchResult.bind(this.session)
    ) : this.session.run(r);
  }
  all(e) {
    const r = typeof e == "string" ? R.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Ln(
      async () => this.session.all(r),
      () => r,
      "all",
      this.dialect,
      this.session.extractRawAllValueFromBatchResult.bind(this.session)
    ) : this.session.all(r);
  }
  get(e) {
    const r = typeof e == "string" ? R.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Ln(
      async () => this.session.get(r),
      () => r,
      "get",
      this.dialect,
      this.session.extractRawGetValueFromBatchResult.bind(this.session)
    ) : this.session.get(r);
  }
  values(e) {
    const r = typeof e == "string" ? R.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Ln(
      async () => this.session.values(r),
      () => r,
      "values",
      this.dialect,
      this.session.extractRawValuesValueFromBatchResult.bind(this.session)
    ) : this.session.values(r);
  }
  transaction(e, r) {
    return this.session.transaction(e, r);
  }
}
N(sl, Vh, "BaseSQLiteDatabase");
var Fh;
Fh = k;
class s$ {
}
N(s$, Fh, "Cache");
var qh, zh;
class al extends (zh = s$, qh = k, zh) {
  strategy() {
    return "all";
  }
  async get(e) {
  }
  async put(e, r, n, s) {
  }
  async onMutate(e) {
  }
}
N(al, qh, "NoopCache");
async function Hu(t, e) {
  const r = `${t}-${JSON.stringify(e)}`, s = new TextEncoder().encode(r), a = await crypto.subtle.digest("SHA-256", s);
  return [...new Uint8Array(a)].map((c) => c.toString(16).padStart(2, "0")).join("");
}
var Uh, Bh;
class a$ extends (Bh = tr, Uh = k, Bh) {
  constructor(e) {
    super(), this.resultCb = e;
  }
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
}
N(a$, Uh, "ExecuteResultSync");
var Kh;
Kh = k;
class o$ {
  constructor(e, r, n, s, a, o) {
    /** @internal */
    N(this, "joinsNotNullableMap");
    var i;
    this.mode = e, this.executeMethod = r, this.query = n, this.cache = s, this.queryMetadata = a, this.cacheConfig = o, s && s.strategy() === "all" && o === void 0 && (this.cacheConfig = { enable: !0, autoInvalidate: !0 }), (i = this.cacheConfig) != null && i.enable || (this.cacheConfig = void 0);
  }
  /** @internal */
  async queryWithCache(e, r, n) {
    if (this.cache === void 0 || A(this.cache, al) || this.queryMetadata === void 0)
      try {
        return await n();
      } catch (s) {
        throw new Gt(e, r, s);
      }
    if (this.cacheConfig && !this.cacheConfig.enable)
      try {
        return await n();
      } catch (s) {
        throw new Gt(e, r, s);
      }
    if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0)
      try {
        const [s] = await Promise.all([
          n(),
          this.cache.onMutate({ tables: this.queryMetadata.tables })
        ]);
        return s;
      } catch (s) {
        throw new Gt(e, r, s);
      }
    if (!this.cacheConfig)
      try {
        return await n();
      } catch (s) {
        throw new Gt(e, r, s);
      }
    if (this.queryMetadata.type === "select") {
      const s = await this.cache.get(
        this.cacheConfig.tag ?? await Hu(e, r),
        this.queryMetadata.tables,
        this.cacheConfig.tag !== void 0,
        this.cacheConfig.autoInvalidate
      );
      if (s === void 0) {
        let a;
        try {
          a = await n();
        } catch (o) {
          throw new Gt(e, r, o);
        }
        return await this.cache.put(
          this.cacheConfig.tag ?? await Hu(e, r),
          a,
          // make sure we send tables that were used in a query only if user wants to invalidate it on each write
          this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
          this.cacheConfig.tag !== void 0,
          this.cacheConfig.config
        ), a;
      }
      return s;
    }
    try {
      return await n();
    } catch (s) {
      throw new Gt(e, r, s);
    }
  }
  getQuery() {
    return this.query;
  }
  mapRunResult(e, r) {
    return e;
  }
  mapAllResult(e, r) {
    throw new Error("Not implemented");
  }
  mapGetResult(e, r) {
    throw new Error("Not implemented");
  }
  execute(e) {
    return this.mode === "async" ? this[this.executeMethod](e) : new a$(() => this[this.executeMethod](e));
  }
  mapResult(e, r) {
    switch (this.executeMethod) {
      case "run":
        return this.mapRunResult(e, r);
      case "all":
        return this.mapAllResult(e, r);
      case "get":
        return this.mapGetResult(e, r);
    }
  }
}
N(o$, Kh, "PreparedQuery");
var Qh;
Qh = k;
class i$ {
  constructor(e) {
    this.dialect = e;
  }
  prepareOneTimeQuery(e, r, n, s, a, o, i) {
    return this.prepareQuery(
      e,
      r,
      n,
      s,
      a,
      o,
      i
    );
  }
  run(e) {
    const r = this.dialect.sqlToQuery(e);
    try {
      return this.prepareOneTimeQuery(r, void 0, "run", !1).run();
    } catch (n) {
      throw new Ra({ cause: n, message: `Failed to run the query '${r.sql}'` });
    }
  }
  /** @internal */
  extractRawRunValueFromBatchResult(e) {
    return e;
  }
  all(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).all();
  }
  /** @internal */
  extractRawAllValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
  get(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).get();
  }
  /** @internal */
  extractRawGetValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
  values(e) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(e), void 0, "run", !1).values();
  }
  async count(e) {
    return (await this.values(e))[0][0];
  }
  /** @internal */
  extractRawValuesValueFromBatchResult(e) {
    throw new Error("Not implemented");
  }
}
N(i$, Qh, "SQLiteSession");
var Gh, xh;
class c$ extends (xh = sl, Gh = k, xh) {
  constructor(e, r, n, s, a = 0) {
    super(e, r, n, s), this.schema = s, this.nestedIndex = a;
  }
  rollback() {
    throw new py();
  }
}
N(c$, Gh, "SQLiteTransaction");
var Hh, Jh;
class l$ extends (Jh = i$, Hh = k, Jh) {
  constructor(r, n, s, a = {}) {
    super(n);
    N(this, "logger");
    N(this, "cache");
    this.client = r, this.schema = s, this.logger = a.logger ?? new gy(), this.cache = a.cache ?? new al();
  }
  prepareQuery(r, n, s, a, o, i, c) {
    const d = this.client.prepare(r.sql);
    return new u$(
      d,
      r,
      this.logger,
      this.cache,
      i,
      c,
      n,
      s,
      a,
      o
    );
  }
  transaction(r, n = {}) {
    const s = new qo("sync", this.dialect, this, this.schema);
    return this.client.transaction(r)[n.behavior ?? "deferred"](s);
  }
}
N(l$, Hh, "BetterSQLiteSession");
var Wh, Xh;
const la = class la extends (Xh = c$, Wh = k, Xh) {
  transaction(e) {
    const r = `sp${this.nestedIndex}`, n = new la("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(R.raw(`savepoint ${r}`));
    try {
      const s = e(n);
      return this.session.run(R.raw(`release savepoint ${r}`)), s;
    } catch (s) {
      throw this.session.run(R.raw(`rollback to savepoint ${r}`)), s;
    }
  }
};
N(la, Wh, "BetterSQLiteTransaction");
let qo = la;
var Yh, Zh;
class u$ extends (Zh = o$, Yh = k, Zh) {
  constructor(e, r, n, s, a, o, i, c, d, l) {
    super("sync", c, r, s, a, o), this.stmt = e, this.logger = n, this.fields = i, this._isResponseInArrayMode = d, this.customResultMapper = l;
  }
  run(e) {
    const r = Rs(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, r), this.stmt.run(...r);
  }
  all(e) {
    const { fields: r, joinsNotNullableMap: n, query: s, logger: a, stmt: o, customResultMapper: i } = this;
    if (!r && !i) {
      const d = Rs(s.params, e ?? {});
      return a.logQuery(s.sql, d), o.all(...d);
    }
    const c = this.values(e);
    return i ? i(c) : c.map((d) => Qu(r, d, n));
  }
  get(e) {
    const r = Rs(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, r);
    const { fields: n, stmt: s, joinsNotNullableMap: a, customResultMapper: o } = this;
    if (!n && !o)
      return s.get(...r);
    const i = s.raw().get(...r);
    if (i)
      return o ? o([i]) : Qu(n, i, a);
  }
  values(e) {
    const r = Rs(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, r), this.stmt.raw().all(...r);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
N(u$, Yh, "BetterSQLitePreparedQuery");
var em, tm;
class d$ extends (tm = sl, em = k, tm) {
}
N(d$, em, "BetterSQLite3Database");
function Hr(t, e = {}) {
  const r = new tl({ casing: e.casing });
  let n;
  e.logger === !0 ? n = new $y() : e.logger !== !1 && (n = e.logger);
  let s;
  if (e.schema) {
    const i = mj(
      e.schema,
      gj
    );
    s = {
      fullSchema: e.schema,
      schema: i.tables,
      tableNamesMap: i.tableNamesMap
    };
  }
  const a = new l$(t, r, s, { logger: n }), o = new d$("sync", r, a, s);
  return o.$client = t, o;
}
function zo(...t) {
  if (t[0] === void 0 || typeof t[0] == "string") {
    const e = t[0] === void 0 ? new jn() : new jn(t[0]);
    return Hr(e, t[1]);
  }
  if (KI(t[0])) {
    const { connection: e, client: r, ...n } = t[0];
    if (r) return Hr(r, n);
    if (typeof e == "object") {
      const { source: a, ...o } = e, i = new jn(a, o);
      return Hr(i, n);
    }
    const s = new jn(e);
    return Hr(s, n);
  }
  return Hr(t[0], t[1]);
}
((t) => {
  function e(r) {
    return Hr({}, r);
  }
  t.mock = e;
})(zo || (zo = {}));
const Dr = Yy("songs", {
  id: el("id").primaryKey({ autoIncrement: !0 }),
  title: ft("title").notNull(),
  author: ft("author").notNull().default(""),
  language: ft("language").notNull().default("es"),
  slides: ft("slides").notNull().default("[]"),
  createdAt: ft("created_at").notNull().default(R`(datetime('now'))`),
  updatedAt: ft("updated_at").notNull().default(R`(datetime('now'))`)
}), Yn = Yy("media", {
  id: el("id").primaryKey({ autoIncrement: !0 }),
  type: ft("type").notNull(),
  title: ft("title").notNull(),
  filePath: ft("file_path").notNull(),
  createdAt: ft("created_at").notNull().default(R`(datetime('now'))`)
});
let Is = null;
function Fr() {
  if (Is) return Is;
  const t = X.join(Lt.getPath("userData"), "seedscreen.db"), e = new jn(t);
  return e.pragma("journal_mode = WAL"), e.exec(`
		CREATE TABLE IF NOT EXISTS songs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			author TEXT NOT NULL DEFAULT '',
			language TEXT NOT NULL DEFAULT 'es',
			slides TEXT NOT NULL DEFAULT '[]',
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
		CREATE TABLE IF NOT EXISTS media (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			type TEXT NOT NULL,
			title TEXT NOT NULL,
			file_path TEXT NOT NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`), Is = zo(e), Is;
}
function ol(t) {
  return {
    id: t.id,
    title: t.title,
    author: t.author,
    language: t.language,
    slides: JSON.parse(t.slides),
    createdAt: t.createdAt,
    updatedAt: t.updatedAt
  };
}
function fn() {
  return Fr().select().from(Dr).orderBy(Dr.title).all().map(ol);
}
function f$(t) {
  const e = Fr().insert(Dr).values({
    title: t.title.trim(),
    author: (t.author || "").trim(),
    language: t.language || "es",
    slides: JSON.stringify(t.slides || [])
  }).returning().get();
  return ol(e);
}
function kj(t, e) {
  const r = Fr().update(Dr).set({
    title: e.title.trim(),
    author: (e.author || "").trim(),
    language: e.language || "es",
    slides: JSON.stringify(e.slides || []),
    updatedAt: R`(datetime('now'))`
  }).where(us(Dr.id, t)).returning().get();
  return r ? ol(r) : null;
}
function Lj(t) {
  return Fr().delete(Dr).where(us(Dr.id, t)).run(), !0;
}
function Dj(t) {
  const e = (s, a) => `${s.trim().toLowerCase()}::${a.trim().toLowerCase()}`, r = new Set(fn().map((s) => e(s.title, s.author)));
  let n = 0;
  for (const s of t ?? [])
    s != null && s.title && (r.has(e(s.title, s.author || "")) || (f$({
      title: s.title,
      author: s.author || "",
      language: s.language || "es",
      slides: s.slides || []
    }), r.add(e(s.title, s.author || "")), n++));
  return { added: n, total: (t == null ? void 0 : t.length) ?? 0 };
}
function il(t) {
  return {
    id: t.id,
    type: t.type === "video" ? "video" : "image",
    title: t.title,
    filePath: t.filePath,
    createdAt: t.createdAt
  };
}
function cl() {
  return Fr().select().from(Yn).orderBy(Yn.title).all().map(il);
}
function Mj(t) {
  const e = Fr().insert(Yn).values({ type: t.type, title: t.title.trim(), filePath: t.filePath }).returning().get();
  return il(e);
}
function Vj(t) {
  const e = Fr().delete(Yn).where(us(Yn.id, t)).returning().get();
  return e ? il(e) : null;
}
const Fj = /(vethernet|virtualbox|vmware|hyper-?v|wsl|default switch|loopback|docker|tailscale|zerotier|utun|llw|awdl|bridge|ppp|tun|tap)/i;
function h$() {
  const t = [];
  for (const [e, r] of Object.entries(Tr.networkInterfaces()))
    for (const n of r ?? [])
      n.family !== "IPv4" || n.internal || n.address.startsWith("169.254.") || t.push({ name: e, address: n.address, netmask: n.netmask });
  return t;
}
function Ju(t) {
  let e = 0;
  return Fj.test(t.name) && (e -= 100), t.address.startsWith("192.168.56.") && (e -= 60), t.address.startsWith("192.168.") ? e += 30 : t.address.startsWith("10.") ? e += 25 : /^172\.(1[6-9]|2\d|3[01])\./.test(t.address) && (e += 10), e;
}
function m$() {
  const t = h$();
  return t.length === 0 ? "127.0.0.1" : (t.sort((e, r) => Ju(r) - Ju(e)), t[0].address);
}
function qj(t, e) {
  const r = t.split(".").map(Number), n = e.split(".").map(Number);
  return r.length !== 4 || n.length !== 4 || [...r, ...n].some(Number.isNaN) ? null : r.map((s, a) => s & n[a] | ~n[a] & 255).join(".");
}
function zj() {
  const t = /* @__PURE__ */ new Set(["255.255.255.255"]);
  for (const e of h$()) {
    const r = qj(e.address, e.netmask);
    r && t.add(r);
  }
  return [...t];
}
const p$ = 3849, Uj = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8"
}, ll = {
  outputOpen: !1,
  background: { type: "color", value: "#000000" },
  items: [],
  selectedItemId: null,
  slides: [],
  selectedSlideId: null,
  liveItemId: null,
  liveSlideId: null,
  liveText: null,
  screenMode: null,
  logo: null,
  images: []
};
let It = null, Zn = ll, Dn = null;
const es = /* @__PURE__ */ new Set();
async function Bj(t, e, r) {
  const n = t.replace(/\/$/, "") + (e === "/" ? "/remote.html" : e);
  try {
    const s = await fetch(n);
    r.writeHead(s.status, {
      "Content-Type": s.headers.get("content-type") ?? "application/octet-stream"
    }), r.end(Buffer.from(await s.arrayBuffer()));
  } catch {
    r.writeHead(502), r.end("Remote dev server unreachable");
  }
}
function Kj(t, e, r) {
  const n = e === "/" ? "/remote.html" : e.split("?")[0], s = X.join(t, decodeURIComponent(n));
  if (!s.startsWith(t)) {
    r.writeHead(403), r.end();
    return;
  }
  ee.readFile(s, (a, o) => {
    if (a) {
      r.writeHead(404), r.end();
      return;
    }
    r.setHeader("Content-Type", Uj[X.extname(s)] ?? "application/octet-stream"), r.end(o);
  });
}
function Qj(t) {
  Zn = t;
  const e = `data: ${JSON.stringify(Zn)}

`;
  for (const r of es) r.write(e);
}
function Wu() {
  return It !== null;
}
function y$() {
  return `http://${m$()}:${p$}`;
}
function Gj(t) {
  It || (Dn = t.onCommand, Zn = ll, It = Jo.createServer((e, r) => {
    if (e.method === "GET" && e.url === "/api/events") {
      r.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*"
      }), r.write(`data: ${JSON.stringify(Zn)}

`), es.add(r), e.on("close", () => es.delete(r));
      return;
    }
    if (e.method === "POST" && e.url === "/api/command") {
      let n = "";
      e.on("data", (s) => {
        n += s;
      }), e.on("end", () => {
        try {
          Dn == null || Dn(JSON.parse(n));
        } catch {
        }
        r.setHeader("Access-Control-Allow-Origin", "*"), r.end("{}");
      });
      return;
    }
    if (e.method === "GET" && e.url) {
      t.devServerUrl ? Bj(t.devServerUrl, e.url, r) : Kj(t.distDir, e.url, r);
      return;
    }
    r.writeHead(404), r.end();
  }), It.on("error", () => {
  }), It.listen(p$, "0.0.0.0"));
}
function $$() {
  for (const t of es) t.end();
  es.clear(), It == null || It.close(), It = null, Dn = null, Zn = ll;
}
const sn = 3847, Uo = 3848, Bo = "seedscreen", Ko = /* @__PURE__ */ new Map();
let Xt = null, qe = null, Ks = null;
function g$(t) {
  return Buffer.from(
    JSON.stringify({
      app: Bo,
      type: t,
      hostname: Tr.hostname(),
      port: sn,
      songCount: fn().length
    })
  );
}
function Qo() {
  if (!qe) return;
  const t = g$("hello");
  for (const e of zj())
    try {
      qe.send(t, 0, t.length, Uo, e);
    } catch {
    }
}
function xj(t) {
  if (Xt || (Xt = Jo.createServer((e, r) => {
    r.setHeader("Content-Type", "application/json"), r.setHeader("Access-Control-Allow-Origin", "*"), e.url === "/api/info" ? r.end(JSON.stringify({ hostname: Tr.hostname(), songCount: fn().length, port: sn, app: Bo })) : e.url === "/api/songs" ? r.end(JSON.stringify({ songs: fn() })) : (r.writeHead(404), r.end("{}"));
  }), Xt.on("error", () => {
  }), Xt.listen(sn, "0.0.0.0")), !qe) {
    const e = Tr.hostname();
    qe = O$.createSocket({ type: "udp4", reuseAddr: !0 }), qe.on("error", () => {
    }), qe.on("message", (r, n) => {
      try {
        const s = JSON.parse(r.toString());
        if (s.app !== Bo || s.type !== "hello" && s.type !== "hello-reply" || s.hostname && s.hostname === e) return;
        const a = {
          ip: n.address,
          hostname: s.hostname || n.address,
          port: s.port || sn,
          songCount: s.songCount || 0,
          lastSeen: Date.now()
        };
        if (Ko.set(n.address, a), t == null || t(a), s.type === "hello" && qe) {
          const o = g$("hello-reply");
          try {
            qe.send(o, 0, o.length, n.port || Uo, n.address);
          } catch {
          }
        }
      } catch {
      }
    }), qe.bind(Uo, () => {
      qe == null || qe.setBroadcast(!0), Qo();
    }), Ks = setInterval(Qo, 6e3);
  }
}
function Hj() {
  return { ip: m$(), hostname: Tr.hostname(), port: sn, songCount: fn().length };
}
function v$() {
  const t = Date.now() - 2e4, e = [];
  for (const [r, n] of Ko)
    n.lastSeen > t ? e.push(n) : Ko.delete(r);
  return e;
}
function Jj() {
  Qo();
}
function Wj(t, e) {
  return new Promise((r, n) => {
    const s = Jo.request(
      { hostname: t, port: e || sn, path: "/api/songs", method: "GET", timeout: 8e3 },
      (a) => {
        let o = "";
        a.on("data", (i) => {
          o += i;
        }), a.on("end", () => {
          try {
            r(JSON.parse(o).songs ?? []);
          } catch {
            n(new Error("Invalid response"));
          }
        });
      }
    );
    s.on("timeout", () => {
      s.destroy(), n(new Error("Timed out"));
    }), s.on("error", (a) => n(new Error(a.message))), s.end();
  });
}
function Xj() {
  Ks && clearInterval(Ks), qe == null || qe.close(), Xt == null || Xt.close(), Ks = null, qe = null, Xt = null;
}
const Ae = new LI({
  defaults: { theme: "marino", backgrounds: [], logo: null, images: [] }
}), Yj = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};
function _$() {
  const t = sm.showOpenDialogSync({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg"] }]
  }), e = t == null ? void 0 : t[0];
  if (!e) return null;
  const r = X.extname(e).toLowerCase(), n = Yj[r] ?? "application/octet-stream", s = ee.readFileSync(e).toString("base64");
  return {
    name: X.basename(e, r),
    dataUrl: `data:${n};base64,${s}`
  };
}
const Xu = ["mp4", "webm", "mov", "m4v"], Zj = ["png", "jpg", "jpeg", "gif", "webp"], eC = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v"
};
function Go() {
  const t = X.join(Lt.getPath("userData"), "media");
  return ee.mkdirSync(t, { recursive: !0 }), t;
}
nm.registerSchemesAsPrivileged([
  {
    scheme: "media",
    privileges: { standard: !0, secure: !0, supportFetchAPI: !0, stream: !0, corsEnabled: !0 }
  }
]);
function tC(t) {
  return `media://file/${encodeURIComponent(X.basename(t))}`;
}
function rC() {
  const t = sm.showOpenDialogSync({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Media", extensions: [...Zj, ...Xu] }]
  });
  for (const e of t ?? []) {
    const r = X.extname(e).toLowerCase().slice(1), n = Xu.includes(r) ? "video" : "image", s = X.join(Go(), `${xo()}.${r}`);
    ee.copyFileSync(e, s), Mj({ type: n, title: X.basename(e, X.extname(e)), filePath: s });
  }
}
let js = null;
function ul() {
  if (js) return js;
  const t = X.join(process.resourcesPath, "bible.json"), e = X.join(ka, "../resources/bible.json"), r = ee.existsSync(t) ? t : e;
  return js = JSON.parse(ee.readFileSync(r, "utf-8")), js;
}
const w$ = {
  GEN: "Gen",
  EXO: "Exo",
  LEV: "Lev",
  NUM: "Num",
  DEU: "Deu",
  JOS: "Jos",
  JDG: "Jdg",
  RUT: "Rut",
  "1SA": "1Sa",
  "2SA": "2Sa",
  "1KI": "1Ki",
  "2KI": "2Ki",
  "1CH": "1Ch",
  "2CH": "2Ch",
  EZR: "Ezr",
  NEH: "Neh",
  EST: "Est",
  JOB: "Job",
  PSA: "Psa",
  PRO: "Pro",
  ECC: "Ecc",
  SNG: "Sng",
  ISA: "Isa",
  JER: "Jer",
  LAM: "Lam",
  EZK: "Ezk",
  DAN: "Dan",
  HOS: "Hos",
  JOL: "Jol",
  AMO: "Amo",
  OBA: "Oba",
  JON: "Jon",
  MIC: "Mic",
  NAM: "Nam",
  HAB: "Hab",
  ZEP: "Zep",
  HAG: "Hag",
  ZEC: "Zec",
  MAL: "Mal",
  MAT: "Mat",
  MRK: "Mrk",
  LUK: "Luk",
  JHN: "Jhn",
  ACT: "Act",
  ROM: "Rom",
  "1CO": "1Co",
  "2CO": "2Co",
  GAL: "Gal",
  EPH: "Eph",
  PHP: "Php",
  COL: "Col",
  "1TH": "1Th",
  "2TH": "2Th",
  "1TI": "1Ti",
  "2TI": "2Ti",
  TIT: "Tit",
  PHM: "Phm",
  HEB: "Heb",
  JAS: "Jas",
  "1PE": "1Pe",
  "2PE": "2Pe",
  "1JN": "1Jn",
  "2JN": "2Jn",
  "3JN": "3Jn",
  JUD: "Jud",
  REV: "Rev"
};
Lt.setName("SeedScreen");
const ka = X.dirname(N$(import.meta.url));
process.env.APP_ROOT = X.join(ka, "..");
const hn = process.env.VITE_DEV_SERVER_URL, NC = X.join(process.env.APP_ROOT, "dist-electron"), La = X.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = hn ? X.join(process.env.APP_ROOT, "public") : La;
let Z;
function b$() {
  Z = new Ho({
    width: 1920,
    height: 1080,
    backgroundColor: "#0e1b2e",
    icon: X.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: X.join(ka, "preload.mjs")
    }
  }), Z.webContents.on("did-finish-load", () => {
    Z == null || Z.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), hn ? Z.loadURL(hn) : Z.loadFile(X.join(La, "index.html"));
}
let we = null;
function nC(t) {
  const e = an.getAllDisplays(), r = an.getPrimaryDisplay(), n = (t ? e.find((o) => o.id === t) : e.find((o) => o.id !== r.id)) ?? r, s = n.id !== r.id, a = n.bounds;
  we = new Ho({
    x: a.x,
    y: a.y,
    width: a.width,
    height: a.height,
    // True OS fullscreen only makes sense on a genuine external display —
    // fullscreening the primary display would hide the control window too.
    // A frameless, always-on-top window sized to the full display still
    // covers the whole screen either way.
    fullscreen: s,
    frame: !1,
    alwaysOnTop: !0,
    backgroundColor: "#000000",
    webPreferences: {
      preload: X.join(ka, "preload.mjs"),
      // Output videos must start playing the instant they're sent — there's no user
      // gesture available on the audience screen to satisfy the default autoplay policy.
      autoplayPolicy: "no-user-gesture-required"
    }
  }), hn ? we.loadURL(`${hn}#output`) : we.loadFile(X.join(La, "index.html"), { hash: "output" }), we.on("closed", () => {
    we = null, Z == null || Z.webContents.send("output-window-closed");
  });
}
Lt.on("window-all-closed", () => {
  process.platform !== "darwin" && (Lt.quit(), Z = null);
});
const sC = process.platform === "darwin", aC = [
  // En macOS, el primer menú suele ser el nombre de la app.
  // Usamos el operador spread (...) para insertarlo solo si es Mac.
  ...sC ? [
    {
      label: Lt.name,
      submenu: [
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => Z == null ? void 0 : Z.webContents.send("open-settings")
        },
        { label: "About", accelerator: "CmdOrCtrl+D" },
        { type: "separator" },
        { role: "quit", label: "Quit" }
      ]
    }
  ] : [{
    label: "SeedScreen",
    submenu: [
      {
        label: "Settings",
        accelerator: "CmdOrCtrl+,",
        click: () => Z == null ? void 0 : Z.webContents.send("open-settings")
      },
      { label: "About", accelerator: "CmdOrCtrl+D" },
      { type: "separator" },
      { role: "quit", label: "Quit" }
    ]
  }],
  {
    label: "Edit",
    submenu: [
      { label: "Undo", role: "undo" },
      { label: "Redo", role: "redo" },
      { type: "separator" },
      { label: "Cut", role: "cut" },
      { label: "Copy", role: "copy" },
      { label: "Paste", role: "paste" },
      { label: "Select All", role: "selectAll" }
    ]
  },
  {
    label: "Services",
    submenu: [
      {
        label: "Open Service",
        accelerator: "CmdOrCtrl+O",
        click: () => {
          console.log("¡Hola desde el menú del proceso principal!");
        }
      },
      { type: "separator" },
      {
        label: "Save Service",
        accelerator: "CmdOrCtrl+S"
      },
      {
        label: "Save Service As",
        accelerator: "CmdOrCtrl+Shift+S"
      }
    ]
  },
  {
    label: "Add",
    submenu: [
      {
        label: "New Song",
        accelerator: "CmdOrCtrl+N",
        click: () => Z == null ? void 0 : Z.webContents.send("menu-new-song")
      },
      {
        label: "New song with AI",
        accelerator: "CmdOrCtrl+Shift+I",
        click: () => Z == null ? void 0 : Z.webContents.send("menu-new-song-ai")
      }
    ]
  },
  {
    label: "Presentation",
    submenu: [
      {
        label: "Project",
        accelerator: "CmdOrCtrl+P",
        click: () => Z == null ? void 0 : Z.webContents.send("menu-toggle-output")
      },
      { type: "separator" },
      {
        label: "Show black screen",
        accelerator: "B",
        click: () => Z == null ? void 0 : Z.webContents.send("menu-go-black")
      },
      {
        label: "Show logo",
        accelerator: "L",
        click: () => Z == null ? void 0 : Z.webContents.send("menu-show-logo")
      },
      { type: "separator" },
      {
        label: "Remote Control",
        type: "checkbox",
        checked: !1,
        accelerator: "CmdOrCtrl+Shift+R",
        click: (t) => {
          t.checked ? (Gj({
            devServerUrl: hn,
            distDir: La,
            onCommand: (e) => Z == null ? void 0 : Z.webContents.send("remote:command", e)
          }), Z == null || Z.webContents.send("remote:status-changed", {
            active: !0,
            url: y$()
          })) : ($$(), Z == null || Z.webContents.send("remote:status-changed", { active: !1, url: null }));
        }
      }
    ]
  }
];
fe.handle("settings:get-all", () => ({
  theme: Ae.get("theme"),
  backgrounds: Ae.get("backgrounds"),
  logo: Ae.get("logo"),
  images: Ae.get("images")
}));
fe.handle("settings:set-theme", (t, e) => (Ae.set("theme", e), !0));
fe.handle("settings:pick-logo", () => {
  const t = _$();
  return t ? (Ae.set("logo", t.dataUrl), t.dataUrl) : null;
});
fe.handle("settings:clear-logo", () => (Ae.set("logo", null), !0));
fe.handle(
  "backgrounds:add",
  (t, e) => {
    const r = { id: xo(), ...e };
    return Ae.set("backgrounds", [...Ae.get("backgrounds"), r]), r;
  }
);
fe.handle("backgrounds:delete", (t, e) => (Ae.set(
  "backgrounds",
  Ae.get("backgrounds").filter((r) => r.id !== e)
), !0));
fe.handle("images:add", () => {
  const t = _$();
  if (t) {
    const e = { id: xo(), ...t };
    Ae.set("images", [...Ae.get("images"), e]);
  }
  return Ae.get("images");
});
fe.handle("images:delete", (t, e) => (Ae.set(
  "images",
  Ae.get("images").filter((r) => r.id !== e)
), Ae.get("images")));
fe.handle("sync:get-local-info", () => Hj());
fe.handle("sync:get-peers", () => v$());
fe.handle("sync:search-peers", async () => (Jj(), await new Promise((t) => setTimeout(t, 2500)), v$()));
fe.handle("sync:fetch-songs", (t, e, r) => Wj(e, r));
fe.handle("sync:import-songs", (t, e) => Dj(e));
fe.handle("remote:get-status", () => ({
  active: Wu(),
  url: Wu() ? y$() : null
}));
fe.handle("remote:push-state", (t, e) => (Qj(e), !0));
fe.handle("output:toggle", (t, e) => we ? (we.close(), { opened: !1 }) : (nC(e), { opened: !0 }));
fe.handle("output:get-status", () => ({ isOpen: we !== null }));
fe.handle("displays:get-all", () => {
  const t = an.getAllDisplays(), e = an.getPrimaryDisplay();
  return t.map((r) => ({
    id: r.id,
    label: r.id === e.id ? "Primary Display" : "External Monitor",
    isPrimary: r.id === e.id
  }));
});
fe.handle("output:send-slide", (t, e) => (we == null || we.webContents.send("show-slide", e), !0));
fe.handle("output:go-black", () => (we == null || we.webContents.send("go-black"), !0));
fe.handle("output:show-image", (t, e) => (we == null || we.webContents.send("show-image", e), !0));
fe.handle("output:show-video", (t, e) => (we == null || we.webContents.send("show-video", e), !0));
fe.handle("output:show-youtube", (t, e) => (we == null || we.webContents.send("show-youtube", e), !0));
fe.handle("songs:get-all", () => fn());
fe.handle("songs:add", (t, e) => f$(e));
fe.handle("songs:update", (t, e, r) => kj(e, r));
fe.handle("songs:delete", (t, e) => Lj(e));
function dl(t) {
  return t.map((e) => ({ ...e, url: tC(e.filePath) }));
}
fe.handle("media:get-all", () => dl(cl()));
fe.handle("media:add", () => (rC(), dl(cl())));
fe.handle("media:delete", (t, e) => {
  const r = Vj(e);
  return r && ee.rm(r.filePath, { force: !0 }, () => {
  }), dl(cl());
});
fe.handle("bible:get-books", () => ul().books.map((t, e) => ({
  id: t.book_usfm,
  name: t.name,
  abbr: w$[t.book_usfm] ?? t.book_usfm,
  chapterCount: t.chapters.filter((r) => r.is_chapter !== !1).length,
  index: e
})));
fe.handle("bible:get-chapter", (t, e, r) => {
  const n = ul().books.find((o) => o.book_usfm === e);
  if (!n) return [];
  const a = n.chapters.filter((o) => o.is_chapter !== !1)[r - 1];
  return a ? a.items.filter((o) => o.type === "verse" && o.verse_numbers.length > 0).map((o) => ({ v: o.verse_numbers[0], t: o.lines.join(" ") })) : [];
});
fe.handle("bible:search", (t, e) => {
  if (!e || e.length < 3) return [];
  const r = e.toLowerCase(), n = [];
  for (const s of ul().books) {
    const a = w$[s.book_usfm] ?? s.book_usfm, o = s.chapters.filter((i) => i.is_chapter !== !1);
    for (let i = 0; i < o.length; i++)
      for (const c of o[i].items) {
        if (c.type !== "verse" || !c.verse_numbers.length) continue;
        const d = c.lines.join(" ");
        if (d.toLowerCase().includes(r) && (n.push({ bookName: s.name, abbr: a, chapter: i + 1, verse: c.verse_numbers[0], text: d }), n.length >= 60))
          return n;
      }
  }
  return n;
});
Lt.on("activate", () => {
  Ho.getAllWindows().length === 0 && b$();
});
Lt.whenReady().then(() => {
  nm.handle("media", async (e) => {
    const r = new URL(e.url), n = decodeURIComponent(r.pathname.replace(/^\/+/, "")), s = X.join(Go(), n);
    if (!s.startsWith(Go()))
      return new Response("Forbidden", { status: 403 });
    try {
      const a = await ee.promises.readFile(s);
      return new Response(a, {
        headers: { "Content-Type": eC[X.extname(s).toLowerCase()] ?? "application/octet-stream" }
      });
    } catch {
      return console.error(`[media] file not found: ${s}`), new Response("Not found", { status: 404 });
    }
  }), b$();
  const t = ml.buildFromTemplate(aC);
  ml.setApplicationMenu(t), an.on("display-added", () => Z == null ? void 0 : Z.webContents.send("displays-changed")), an.on("display-removed", () => Z == null ? void 0 : Z.webContents.send("displays-changed")), xj((e) => Z == null ? void 0 : Z.webContents.send("sync-peer-found", e));
});
Lt.on("before-quit", () => {
  Xj(), $$();
});
export {
  NC as MAIN_DIST,
  La as RENDERER_DIST,
  hn as VITE_DEV_SERVER_URL
};
