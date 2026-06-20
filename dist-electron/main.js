var $$ = Object.defineProperty;
var ll = (t) => {
  throw TypeError(t);
};
var g$ = (t, e, r) => e in t ? $$(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var N = (t, e, r) => g$(t, typeof e != "symbol" ? e + "" : e, r), ul = (t, e, r) => e.has(t) || ll("Cannot " + r);
var ve = (t, e, r) => (ul(t, e, "read from private field"), r ? r.call(t) : e.get(t)), En = (t, e, r) => e.has(t) ? ll("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), Nn = (t, e, r, n) => (ul(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r);
import Pn, { randomUUID as Qo } from "node:crypto";
import Z from "node:fs";
import Y from "node:path";
import { fileURLToPath as v$ } from "node:url";
import Yh, { app as Lt, ipcMain as fe, screen as an, BrowserWindow as Go, Menu as dl, dialog as Zh } from "electron";
import _e from "node:process";
import { promisify as ke, isDeepStrictEqual as _$ } from "node:util";
import w$ from "node:assert";
import Dr from "node:os";
import "node:events";
import "node:stream";
import jn from "better-sqlite3";
import xo from "node:http";
import b$ from "node:dgram";
const Tr = (t) => {
  const e = typeof t;
  return t !== null && (e === "object" || e === "function");
}, Ma = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), S$ = new Set("0123456789");
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
        if (n === "index" && !S$.has(a))
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
function Ho(t, e) {
  if (typeof e != "number" && Array.isArray(t)) {
    const r = Number.parseInt(e, 10);
    return Number.isInteger(r) && t[r] === t[e];
  }
  return !1;
}
function em(t, e) {
  if (Ho(t, e))
    throw new Error("Cannot use string index");
}
function E$(t, e, r) {
  if (!Tr(t) || typeof e != "string")
    return r === void 0 ? t : r;
  const n = ua(e);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (Ho(t, a) ? t = s === n.length - 1 ? void 0 : null : t = t[a], t == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return t === void 0 ? r : t;
}
function fl(t, e, r) {
  if (!Tr(t) || typeof e != "string")
    return t;
  const n = t, s = ua(e);
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    em(t, o), a === s.length - 1 ? t[o] = r : Tr(t[o]) || (t[o] = typeof s[a + 1] == "number" ? [] : {}), t = t[o];
  }
  return n;
}
function N$(t, e) {
  if (!Tr(t) || typeof e != "string")
    return !1;
  const r = ua(e);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (em(t, s), n === r.length - 1)
      return delete t[s], !0;
    if (t = t[s], !Tr(t))
      return !1;
  }
}
function P$(t, e) {
  if (!Tr(t) || typeof e != "string")
    return !1;
  const r = ua(e);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!Tr(t) || !(n in t) || Ho(t, n))
      return !1;
    t = t[n];
  }
  return !0;
}
const xt = Dr.homedir(), Jo = Dr.tmpdir(), { env: Jr } = _e, T$ = (t) => {
  const e = Y.join(xt, "Library");
  return {
    data: Y.join(e, "Application Support", t),
    config: Y.join(e, "Preferences", t),
    cache: Y.join(e, "Caches", t),
    log: Y.join(e, "Logs", t),
    temp: Y.join(Jo, t)
  };
}, O$ = (t) => {
  const e = Jr.APPDATA || Y.join(xt, "AppData", "Roaming"), r = Jr.LOCALAPPDATA || Y.join(xt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Y.join(r, t, "Data"),
    config: Y.join(e, t, "Config"),
    cache: Y.join(r, t, "Cache"),
    log: Y.join(r, t, "Log"),
    temp: Y.join(Jo, t)
  };
}, R$ = (t) => {
  const e = Y.basename(xt);
  return {
    data: Y.join(Jr.XDG_DATA_HOME || Y.join(xt, ".local", "share"), t),
    config: Y.join(Jr.XDG_CONFIG_HOME || Y.join(xt, ".config"), t),
    cache: Y.join(Jr.XDG_CACHE_HOME || Y.join(xt, ".cache"), t),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Y.join(Jr.XDG_STATE_HOME || Y.join(xt, ".local", "state"), t),
    temp: Y.join(Jo, e, t)
  };
};
function I$(t, { suffix: e = "nodejs" } = {}) {
  if (typeof t != "string")
    throw new TypeError(`Expected a string, got ${typeof t}`);
  return e && (t += `-${e}`), _e.platform === "darwin" ? T$(t) : _e.platform === "win32" ? O$(t) : R$(t);
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
}, j$ = 250, Ft = (t, e) => {
  const { isRetriable: r } = e;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? j$, i = Date.now() + a;
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
    return e === "ENOSYS" || !C$ && (e === "EINVAL" || e === "EPERM");
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
}, C$ = _e.getuid ? !_e.getuid() : !1, Le = {
  isRetriable: Wr.isRetriableError
}, Ve = {
  attempt: {
    /* ASYNC */
    chmod: Vt(ke(Z.chmod), ds),
    chown: Vt(ke(Z.chown), ds),
    close: Vt(ke(Z.close), et),
    fsync: Vt(ke(Z.fsync), et),
    mkdir: Vt(ke(Z.mkdir), et),
    realpath: Vt(ke(Z.realpath), et),
    stat: Vt(ke(Z.stat), et),
    unlink: Vt(ke(Z.unlink), et),
    /* SYNC */
    chmodSync: Nt(Z.chmodSync, ds),
    chownSync: Nt(Z.chownSync, ds),
    closeSync: Nt(Z.closeSync, et),
    existsSync: Nt(Z.existsSync, et),
    fsyncSync: Nt(Z.fsync, et),
    mkdirSync: Nt(Z.mkdirSync, et),
    realpathSync: Nt(Z.realpathSync, et),
    statSync: Nt(Z.statSync, et),
    unlinkSync: Nt(Z.unlinkSync, et)
  },
  retry: {
    /* ASYNC */
    close: Ft(ke(Z.close), Le),
    fsync: Ft(ke(Z.fsync), Le),
    open: Ft(ke(Z.open), Le),
    readFile: Ft(ke(Z.readFile), Le),
    rename: Ft(ke(Z.rename), Le),
    stat: Ft(ke(Z.stat), Le),
    write: Ft(ke(Z.write), Le),
    writeFile: Ft(ke(Z.writeFile), Le),
    /* SYNC */
    closeSync: qt(Z.closeSync, Le),
    fsyncSync: qt(Z.fsyncSync, Le),
    openSync: qt(Z.openSync, Le),
    readFileSync: qt(Z.readFileSync, Le),
    renameSync: qt(Z.renameSync, Le),
    statSync: qt(Z.statSync, Le),
    writeSync: qt(Z.writeSync, Le),
    writeFileSync: qt(Z.writeFileSync, Le)
  }
}, A$ = "utf8", hl = 438, k$ = 511, L$ = {}, D$ = _e.geteuid ? _e.geteuid() : -1, M$ = _e.getegid ? _e.getegid() : -1, V$ = 1e3, F$ = !!_e.getuid;
_e.getuid && _e.getuid();
const ml = 128, q$ = (t) => t instanceof Error && "code" in t, pl = (t) => typeof t == "string", Va = (t) => t === void 0, z$ = _e.platform === "linux", tm = _e.platform === "win32", Wo = ["SIGHUP", "SIGINT", "SIGTERM"];
tm || Wo.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
z$ && Wo.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class U$ {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (e) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        e && (tm && e !== "SIGINT" && e !== "SIGTERM" && e !== "SIGKILL" ? _e.kill(_e.pid, "SIGTERM") : _e.kill(_e.pid, e));
      }
    }, this.hook = () => {
      _e.once("exit", () => this.exit());
      for (const e of Wo)
        try {
          _e.once(e, () => this.exit(e));
        } catch {
        }
    }, this.register = (e) => (this.callbacks.add(e), () => {
      this.callbacks.delete(e);
    }), this.hook();
  }
}
const B$ = new U$(), K$ = B$.register, Fe = {
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
    const e = Y.basename(t);
    if (e.length <= ml)
      return t;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(e);
    if (!r)
      return t;
    const n = e.length - ml;
    return `${t.slice(0, -e.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
K$(Fe.purgeSyncAll);
function rm(t, e, r = L$) {
  if (pl(r))
    return rm(t, e, { encoding: r });
  const s = { timeout: r.timeout ?? V$ };
  let a = null, o = null, i = null;
  try {
    const c = Ve.attempt.realpathSync(t), d = !!c;
    t = c || t, [o, a] = Fe.get(t, r.tmpCreate || Fe.create, r.tmpPurge !== !1);
    const l = F$ && Va(r.chown), h = Va(r.mode);
    if (d && (l || h)) {
      const _ = Ve.attempt.statSync(t);
      _ && (r = { ...r }, l && (r.chown = { uid: _.uid, gid: _.gid }), h && (r.mode = _.mode));
    }
    if (!d) {
      const _ = Y.dirname(t);
      Ve.attempt.mkdirSync(_, {
        mode: k$,
        recursive: !0
      });
    }
    i = Ve.retry.openSync(s)(o, "w", r.mode || hl), r.tmpCreated && r.tmpCreated(o), pl(e) ? Ve.retry.writeSync(s)(i, e, 0, r.encoding || A$) : Va(e) || Ve.retry.writeSync(s)(i, e, 0, e.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Ve.retry.fsyncSync(s)(i) : Ve.attempt.fsync(i)), Ve.retry.closeSync(s)(i), i = null, r.chown && (r.chown.uid !== D$ || r.chown.gid !== M$) && Ve.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== hl && Ve.attempt.chmodSync(o, r.mode);
    try {
      Ve.retry.renameSync(s)(o, t);
    } catch (_) {
      if (!q$(_) || _.code !== "ENAMETOOLONG")
        throw _;
      Ve.retry.renameSync(s)(o, Fe.truncate(t));
    }
    a(), o = null;
  } finally {
    i && Ve.attempt.closeSync(i), o && Fe.purge(o);
  }
}
function nm(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var io = { exports: {} }, sm = {}, pt = {}, on = {}, ts = {}, se = {}, Hn = {};
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
  class X extends w {
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
      const C = new X();
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
const me = se, Q$ = Hn;
function G$(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
V.toHash = G$;
function x$(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (am(t, e), !om(e, t.self.RULES.all));
}
V.alwaysValidSchema = x$;
function am(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || lm(t, `unknown keyword: "${a}"`);
}
V.checkUnknownRules = am;
function om(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
V.schemaHasRules = om;
function H$(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
V.schemaHasRulesButRef = H$;
function J$({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, me._)`${r}`;
  }
  return (0, me._)`${t}${e}${(0, me.getProperty)(n)}`;
}
V.schemaRefOrVal = J$;
function W$(t) {
  return im(decodeURIComponent(t));
}
V.unescapeFragment = W$;
function X$(t) {
  return encodeURIComponent(Xo(t));
}
V.escapeFragment = X$;
function Xo(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
V.escapeJsonPointer = Xo;
function im(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
V.unescapeJsonPointer = im;
function Y$(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
V.eachItem = Y$;
function yl({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof me.Name ? (a instanceof me.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof me.Name ? (e(s, o, a), a) : r(a, o);
    return i === me.Name && !(c instanceof me.Name) ? n(s, c) : c;
  };
}
V.mergeEvaluated = {
  props: yl({
    mergeNames: (t, e, r) => t.if((0, me._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, me._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, me._)`${r} || {}`).code((0, me._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, me._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, me._)`${r} || {}`), Yo(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: cm
  }),
  items: yl({
    mergeNames: (t, e, r) => t.if((0, me._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, me._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, me._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, me._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function cm(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, me._)`{}`);
  return e !== void 0 && Yo(t, r, e), r;
}
V.evaluatedPropsToName = cm;
function Yo(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, me._)`${e}${(0, me.getProperty)(n)}`, !0));
}
V.setEvaluated = Yo;
const $l = {};
function Z$(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: $l[e.code] || ($l[e.code] = new Q$._Code(e.code))
  });
}
V.useFunc = Z$;
var lo;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(lo || (V.Type = lo = {}));
function eg(t, e, r) {
  if (t instanceof me.Name) {
    const n = e === lo.Num;
    return r ? n ? (0, me._)`"[" + ${t} + "]"` : (0, me._)`"['" + ${t} + "']"` : n ? (0, me._)`"/" + ${t}` : (0, me._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, me.getProperty)(t).toString() : "/" + Xo(t);
}
V.getErrorPath = eg;
function lm(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
V.checkStrictMode = lm;
var nt = {};
Object.defineProperty(nt, "__esModule", { value: !0 });
const De = se, tg = {
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
nt.default = tg;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
  const e = se, r = V, n = nt;
  t.keywordError = {
    message: ({ keyword: g }) => (0, e.str)`must pass "${g}" keyword validation`
  }, t.keyword$DataError = {
    message: ({ keyword: g, schemaType: m }) => m ? (0, e.str)`"${g}" keyword must be ${m} ($data)` : (0, e.str)`"${g}" keyword is invalid ($data)`
  };
  function s(g, m = t.keywordError, b, T) {
    const { it: O } = g, { gen: I, compositeRule: q, allErrors: D } = O, X = h(g, m, b);
    T ?? (q || D) ? c(I, X) : d(O, (0, e._)`[${X}]`);
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
    const { keyword: O, data: I, schemaValue: q, it: D } = g, { opts: X, propertyName: de, topSchemaRef: ge, schemaPath: Q } = D;
    T.push([l.keyword, O], [l.params, typeof m == "function" ? m(g) : m || (0, e._)`{}`]), X.messages && T.push([l.message, typeof b == "function" ? b(g) : b]), X.verbose && T.push([l.schema, q], [l.parentSchema, (0, e._)`${ge}${Q}`], [n.default.data, I]), de && T.push([l.propertyName, de]);
  }
})(ts);
Object.defineProperty(on, "__esModule", { value: !0 });
on.boolOrEmptySchema = on.topBoolOrEmptySchema = void 0;
const rg = ts, ng = se, sg = nt, ag = {
  message: "boolean schema is false"
};
function og(t) {
  const { gen: e, schema: r, validateName: n } = t;
  r === !1 ? um(t, !1) : typeof r == "object" && r.$async === !0 ? e.return(sg.default.data) : (e.assign((0, ng._)`${n}.errors`, null), e.return(!0));
}
on.topBoolOrEmptySchema = og;
function ig(t, e) {
  const { gen: r, schema: n } = t;
  n === !1 ? (r.var(e, !1), um(t)) : r.var(e, !0);
}
on.boolOrEmptySchema = ig;
function um(t, e) {
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
  (0, rg.reportError)(s, ag, void 0, e);
}
var Ne = {}, Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.getRules = Or.isJSONType = void 0;
const cg = ["string", "number", "integer", "boolean", "null", "object", "array"], lg = new Set(cg);
function ug(t) {
  return typeof t == "string" && lg.has(t);
}
Or.isJSONType = ug;
function dg() {
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
Or.getRules = dg;
var jt = {};
Object.defineProperty(jt, "__esModule", { value: !0 });
jt.shouldUseRule = jt.shouldUseGroup = jt.schemaHasRulesForType = void 0;
function fg({ schema: t, self: e }, r) {
  const n = e.RULES.types[r];
  return n && n !== !0 && dm(t, n);
}
jt.schemaHasRulesForType = fg;
function dm(t, e) {
  return e.rules.some((r) => fm(t, r));
}
jt.shouldUseGroup = dm;
function fm(t, e) {
  var r;
  return t[e.keyword] !== void 0 || ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => t[n] !== void 0));
}
jt.shouldUseRule = fm;
Object.defineProperty(Ne, "__esModule", { value: !0 });
Ne.reportTypeError = Ne.checkDataTypes = Ne.checkDataType = Ne.coerceAndCheckDataType = Ne.getJSONTypes = Ne.getSchemaTypes = Ne.DataType = void 0;
const hg = Or, mg = jt, pg = ts, ae = se, hm = V;
var en;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(en || (Ne.DataType = en = {}));
function yg(t) {
  const e = mm(t.type);
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
Ne.getSchemaTypes = yg;
function mm(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(hg.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
Ne.getJSONTypes = mm;
function $g(t, e) {
  const { gen: r, data: n, opts: s } = t, a = gg(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, mg.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = Zo(e, n, s.strictNumbers, en.Wrong);
    r.if(i, () => {
      a.length ? vg(t, e, a) : ei(t);
    });
  }
  return o;
}
Ne.coerceAndCheckDataType = $g;
const pm = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function gg(t, e) {
  return e ? t.filter((r) => pm.has(r) || e === "array" && r === "array") : [];
}
function vg(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, ae._)`typeof ${s}`), i = n.let("coerced", (0, ae._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ae._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ae._)`${s}[0]`).assign(o, (0, ae._)`typeof ${s}`).if(Zo(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, ae._)`${i} !== undefined`);
  for (const d of r)
    (pm.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), ei(t), n.endIf(), n.if((0, ae._)`${i} !== undefined`, () => {
    n.assign(s, i), _g(t, i);
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
function _g({ gen: t, parentData: e, parentDataProperty: r }, n) {
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
function Zo(t, e, r, n) {
  if (t.length === 1)
    return uo(t[0], e, r, n);
  let s;
  const a = (0, hm.toHash)(t);
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
Ne.checkDataTypes = Zo;
const wg = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, ae._)`{type: ${t}}` : (0, ae._)`{type: ${e}}`
};
function ei(t) {
  const e = bg(t);
  (0, pg.reportError)(e, wg);
}
Ne.reportTypeError = ei;
function bg(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, hm.schemaRefOrVal)(t, n, "type");
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
const qr = se, Sg = V;
function Eg(t, e) {
  const { properties: r, items: n } = t.schema;
  if (e === "object" && r)
    for (const s in r)
      gl(t, s, r[s].default);
  else e === "array" && Array.isArray(n) && n.forEach((s, a) => gl(t, a, s.default));
}
da.assignDefaults = Eg;
function gl(t, e, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = t;
  if (r === void 0)
    return;
  const i = (0, qr._)`${a}${(0, qr.getProperty)(e)}`;
  if (s) {
    (0, Sg.checkStrictMode)(t, `default is ignored for: ${i}`);
    return;
  }
  let c = (0, qr._)`${i} === undefined`;
  o.useDefaults === "empty" && (c = (0, qr._)`${c} || ${i} === null || ${i} === ""`), n.if(c, (0, qr._)`${i} = ${(0, qr.stringify)(r)}`);
}
var bt = {}, ce = {};
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.validateUnion = ce.validateArray = ce.usePattern = ce.callValidateCode = ce.schemaProperties = ce.allSchemaProperties = ce.noPropertyInData = ce.propertyInData = ce.isOwnProperty = ce.hasPropFunc = ce.reportMissingProp = ce.checkMissingProp = ce.checkReportMissingProp = void 0;
const ye = se, ti = V, zt = nt, Ng = V;
function Pg(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(ni(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, ye._)`${e}` }, !0), t.error();
  });
}
ce.checkReportMissingProp = Pg;
function Tg({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, ye.or)(...n.map((a) => (0, ye.and)(ni(t, e, a, r.ownProperties), (0, ye._)`${s} = ${a}`)));
}
ce.checkMissingProp = Tg;
function Og(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
ce.reportMissingProp = Og;
function ym(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ye._)`Object.prototype.hasOwnProperty`
  });
}
ce.hasPropFunc = ym;
function ri(t, e, r) {
  return (0, ye._)`${ym(t)}.call(${e}, ${r})`;
}
ce.isOwnProperty = ri;
function Rg(t, e, r, n) {
  const s = (0, ye._)`${e}${(0, ye.getProperty)(r)} !== undefined`;
  return n ? (0, ye._)`${s} && ${ri(t, e, r)}` : s;
}
ce.propertyInData = Rg;
function ni(t, e, r, n) {
  const s = (0, ye._)`${e}${(0, ye.getProperty)(r)} === undefined`;
  return n ? (0, ye.or)(s, (0, ye.not)(ri(t, e, r))) : s;
}
ce.noPropertyInData = ni;
function $m(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
ce.allSchemaProperties = $m;
function Ig(t, e) {
  return $m(e).filter((r) => !(0, ti.alwaysValidSchema)(t, e[r]));
}
ce.schemaProperties = Ig;
function jg({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, d) {
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
ce.callValidateCode = jg;
const Cg = (0, ye._)`new RegExp`;
function Ag({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ye._)`${s.code === "new RegExp" ? Cg : (0, Ng.useFunc)(t, s)}(${r}, ${n})`
  });
}
ce.usePattern = Ag;
function kg(t) {
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
        dataPropType: ti.Type.Num
      }, a), e.if((0, ye.not)(a), i);
    });
  }
}
ce.validateArray = kg;
function Lg(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, ti.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
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
ce.validateUnion = Lg;
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.validateKeywordUsage = bt.validSchemaType = bt.funcKeywordCode = bt.macroKeywordCode = void 0;
const Be = se, gr = nt, Dg = ce, Mg = ts;
function Vg(t, e) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = t, i = e.macro.call(o.self, s, a, o), c = gm(r, n, i);
  o.opts.validateSchema !== !1 && o.self.validateSchema(i, !0);
  const d = r.name("valid");
  t.subschema({
    schema: i,
    schemaPath: Be.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), t.pass(d, () => t.error(!0));
}
bt.macroKeywordCode = Vg;
function Fg(t, e) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: i, it: c } = t;
  zg(c, e);
  const d = !i && e.compile ? e.compile.call(c.self, a, o, c) : e.validate, l = gm(n, s, d), h = n.let("valid");
  t.block$data(h, _), t.ok((r = e.valid) !== null && r !== void 0 ? r : h);
  function _() {
    if (e.errors === !1)
      v(), e.modifying && vl(t), g(() => t.error());
    else {
      const m = e.async ? $() : w();
      e.modifying && vl(t), g(() => qg(t, m));
    }
  }
  function $() {
    const m = n.let("ruleErrs", null);
    return n.try(() => v((0, Be._)`await `), (b) => n.assign(h, !1).if((0, Be._)`${b} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Be._)`${b}.errors`), () => n.throw(b))), m;
  }
  function w() {
    const m = (0, Be._)`${l}.errors`;
    return n.assign(m, null), v(Be.nil), m;
  }
  function v(m = e.async ? (0, Be._)`await ` : Be.nil) {
    const b = c.opts.passContext ? gr.default.this : gr.default.self, T = !("compile" in e && !i || e.schema === !1);
    n.assign(h, (0, Be._)`${m}${(0, Dg.callValidateCode)(t, l, b, T)}`, e.modifying);
  }
  function g(m) {
    var b;
    n.if((0, Be.not)((b = e.valid) !== null && b !== void 0 ? b : h), m);
  }
}
bt.funcKeywordCode = Fg;
function vl(t) {
  const { gen: e, data: r, it: n } = t;
  e.if(n.parentData, () => e.assign(r, (0, Be._)`${n.parentData}[${n.parentDataProperty}]`));
}
function qg(t, e) {
  const { gen: r } = t;
  r.if((0, Be._)`Array.isArray(${e})`, () => {
    r.assign(gr.default.vErrors, (0, Be._)`${gr.default.vErrors} === null ? ${e} : ${gr.default.vErrors}.concat(${e})`).assign(gr.default.errors, (0, Be._)`${gr.default.vErrors}.length`), (0, Mg.extendErrors)(t);
  }, () => t.error());
}
function zg({ schemaEnv: t }, e) {
  if (e.async && !t.$async)
    throw new Error("async keyword in sync schema");
}
function gm(t, e, r) {
  if (r === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return t.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Be.stringify)(r) });
}
function Ug(t, e, r = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(t) : n === "object" ? t && typeof t == "object" && !Array.isArray(t) : typeof t == n || r && typeof t > "u");
}
bt.validSchemaType = Ug;
function Bg({ schema: t, opts: e, self: r, errSchemaPath: n }, s, a) {
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
bt.validateKeywordUsage = Bg;
var Yt = {};
Object.defineProperty(Yt, "__esModule", { value: !0 });
Yt.extendSubschemaMode = Yt.extendSubschemaData = Yt.getSubschema = void 0;
const _t = se, vm = V;
function Kg(t, { keyword: e, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
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
      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, vm.escapeFragment)(r)}`
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
Yt.getSubschema = Kg;
function Qg(t, e, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: i } = e;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = e, _ = i.let("data", (0, _t._)`${e.data}${(0, _t.getProperty)(r)}`, !0);
    c(_), t.errorPath = (0, _t.str)`${d}${(0, vm.getErrorPath)(r, n, h.jsPropertySyntax)}`, t.parentDataProperty = (0, _t._)`${r}`, t.dataPathArr = [...l, t.parentDataProperty];
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
Yt.extendSubschemaData = Qg;
function Gg(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (t.compositeRule = n), s !== void 0 && (t.createErrors = s), a !== void 0 && (t.allErrors = a), t.jtdDiscriminator = e, t.jtdMetadata = r;
}
Yt.extendSubschemaMode = Gg;
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
}, _m = { exports: {} }, Jt = _m.exports = function(t, e, r) {
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
            Cs(t, e, r, h[$], s + "/" + l + "/" + xg($), a, s, l, n, $);
      } else (l in Jt.keywords || t.allKeys && !(l in Jt.skipKeywords)) && Cs(t, e, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, i, c, d);
  }
}
function xg(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Hg = _m.exports;
Object.defineProperty(je, "__esModule", { value: !0 });
je.getSchemaRefs = je.resolveUrl = je.normalizeId = je._getFullPath = je.getFullPath = je.inlineRef = void 0;
const Jg = V, Wg = fa, Xg = Hg, Yg = /* @__PURE__ */ new Set([
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
function Zg(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !fo(t) : e ? wm(t) <= e : !1;
}
je.inlineRef = Zg;
const e0 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function fo(t) {
  for (const e in t) {
    if (e0.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(fo) || typeof r == "object" && fo(r))
      return !0;
  }
  return !1;
}
function wm(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !Yg.has(r) && (typeof t[r] == "object" && (0, Jg.eachItem)(t[r], (n) => e += wm(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function bm(t, e = "", r) {
  r !== !1 && (e = tn(e));
  const n = t.parse(e);
  return Sm(t, n);
}
je.getFullPath = bm;
function Sm(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
je._getFullPath = Sm;
const t0 = /#\/?$/;
function tn(t) {
  return t ? t.replace(t0, "") : "";
}
je.normalizeId = tn;
function r0(t, e, r) {
  return r = tn(r), t.resolve(e, r);
}
je.resolveUrl = r0;
const n0 = /^[a-z_][-a-z0-9._]*$/i;
function s0(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = tn(t[r] || e), a = { "": s }, o = bm(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return Xg(t, { allKeys: !0 }, (h, _, $, w) => {
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
        if (!n0.test(T))
          throw new Error(`invalid anchor "${T}"`);
        m.call(this, `#${T}`);
      }
    }
  }), i;
  function d(h, _, $) {
    if (_ !== void 0 && !Wg(h, _))
      throw l($);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
je.getSchemaRefs = s0;
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.getData = pt.KeywordCxt = pt.validateFunctionCode = void 0;
const Em = on, _l = Ne, si = jt, Qs = Ne, a0 = da, Mn = bt, Fa = Yt, H = se, te = nt, o0 = je, Ct = V, Tn = ts;
function i0(t) {
  if (Tm(t) && (Om(t), Pm(t))) {
    u0(t);
    return;
  }
  Nm(t, () => (0, Em.topBoolOrEmptySchema)(t));
}
pt.validateFunctionCode = i0;
function Nm({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? t.func(e, (0, H._)`${te.default.data}, ${te.default.valCxt}`, n.$async, () => {
    t.code((0, H._)`"use strict"; ${wl(r, s)}`), l0(t, s), t.code(a);
  }) : t.func(e, (0, H._)`${te.default.data}, ${c0(s)}`, n.$async, () => t.code(wl(r, s)).code(a));
}
function c0(t) {
  return (0, H._)`{${te.default.instancePath}="", ${te.default.parentData}, ${te.default.parentDataProperty}, ${te.default.rootData}=${te.default.data}${t.dynamicRef ? (0, H._)`, ${te.default.dynamicAnchors}={}` : H.nil}}={}`;
}
function l0(t, e) {
  t.if(te.default.valCxt, () => {
    t.var(te.default.instancePath, (0, H._)`${te.default.valCxt}.${te.default.instancePath}`), t.var(te.default.parentData, (0, H._)`${te.default.valCxt}.${te.default.parentData}`), t.var(te.default.parentDataProperty, (0, H._)`${te.default.valCxt}.${te.default.parentDataProperty}`), t.var(te.default.rootData, (0, H._)`${te.default.valCxt}.${te.default.rootData}`), e.dynamicRef && t.var(te.default.dynamicAnchors, (0, H._)`${te.default.valCxt}.${te.default.dynamicAnchors}`);
  }, () => {
    t.var(te.default.instancePath, (0, H._)`""`), t.var(te.default.parentData, (0, H._)`undefined`), t.var(te.default.parentDataProperty, (0, H._)`undefined`), t.var(te.default.rootData, te.default.data), e.dynamicRef && t.var(te.default.dynamicAnchors, (0, H._)`{}`);
  });
}
function u0(t) {
  const { schema: e, opts: r, gen: n } = t;
  Nm(t, () => {
    r.$comment && e.$comment && Im(t), p0(t), n.let(te.default.vErrors, null), n.let(te.default.errors, 0), r.unevaluated && d0(t), Rm(t), g0(t);
  });
}
function d0(t) {
  const { gen: e, validateName: r } = t;
  t.evaluated = e.const("evaluated", (0, H._)`${r}.evaluated`), e.if((0, H._)`${t.evaluated}.dynamicProps`, () => e.assign((0, H._)`${t.evaluated}.props`, (0, H._)`undefined`)), e.if((0, H._)`${t.evaluated}.dynamicItems`, () => e.assign((0, H._)`${t.evaluated}.items`, (0, H._)`undefined`));
}
function wl(t, e) {
  const r = typeof t == "object" && t[e.schemaId];
  return r && (e.code.source || e.code.process) ? (0, H._)`/*# sourceURL=${r} */` : H.nil;
}
function f0(t, e) {
  if (Tm(t) && (Om(t), Pm(t))) {
    h0(t, e);
    return;
  }
  (0, Em.boolOrEmptySchema)(t, e);
}
function Pm({ schema: t, self: e }) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e.RULES.all[r])
      return !0;
  return !1;
}
function Tm(t) {
  return typeof t.schema != "boolean";
}
function h0(t, e) {
  const { schema: r, gen: n, opts: s } = t;
  s.$comment && r.$comment && Im(t), y0(t), $0(t);
  const a = n.const("_errs", te.default.errors);
  Rm(t, a), n.var(e, (0, H._)`${a} === ${te.default.errors}`);
}
function Om(t) {
  (0, Ct.checkUnknownRules)(t), m0(t);
}
function Rm(t, e) {
  if (t.opts.jtd)
    return bl(t, [], !1, e);
  const r = (0, _l.getSchemaTypes)(t.schema), n = (0, _l.coerceAndCheckDataType)(t, r);
  bl(t, r, !n, e);
}
function m0(t) {
  const { schema: e, errSchemaPath: r, opts: n, self: s } = t;
  e.$ref && n.ignoreKeywordsWithRef && (0, Ct.schemaHasRulesButRef)(e, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function p0(t) {
  const { schema: e, opts: r } = t;
  e.default !== void 0 && r.useDefaults && r.strictSchema && (0, Ct.checkStrictMode)(t, "default is ignored in the schema root");
}
function y0(t) {
  const e = t.schema[t.opts.schemaId];
  e && (t.baseId = (0, o0.resolveUrl)(t.opts.uriResolver, t.baseId, e));
}
function $0(t) {
  if (t.schema.$async && !t.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Im({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    t.code((0, H._)`${te.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, H.str)`${n}/$comment`, i = t.scopeValue("root", { ref: e.root });
    t.code((0, H._)`${te.default.self}.opts.$comment(${a}, ${o}, ${i}.schema)`);
  }
}
function g0(t) {
  const { gen: e, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = t;
  r.$async ? e.if((0, H._)`${te.default.errors} === 0`, () => e.return(te.default.data), () => e.throw((0, H._)`new ${s}(${te.default.vErrors})`)) : (e.assign((0, H._)`${n}.errors`, te.default.vErrors), a.unevaluated && v0(t), e.return((0, H._)`${te.default.errors} === 0`));
}
function v0({ gen: t, evaluated: e, props: r, items: n }) {
  r instanceof H.Name && t.assign((0, H._)`${e}.props`, r), n instanceof H.Name && t.assign((0, H._)`${e}.items`, n);
}
function bl(t, e, r, n) {
  const { gen: s, schema: a, data: o, allErrors: i, opts: c, self: d } = t, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, Ct.schemaHasRulesButRef)(a, l))) {
    s.block(() => Am(t, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || _0(t, e), s.block(() => {
    for (const _ of l.rules)
      h(_);
    h(l.post);
  });
  function h(_) {
    (0, si.shouldUseGroup)(a, _) && (_.type ? (s.if((0, Qs.checkDataType)(_.type, o, c.strictNumbers)), Sl(t, _), e.length === 1 && e[0] === _.type && r && (s.else(), (0, Qs.reportTypeError)(t)), s.endIf()) : Sl(t, _), i || s.if((0, H._)`${te.default.errors} === ${n || 0}`));
  }
}
function Sl(t, e) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = t;
  s && (0, a0.assignDefaults)(t, e.type), r.block(() => {
    for (const a of e.rules)
      (0, si.shouldUseRule)(n, a) && Am(t, a.keyword, a.definition, e.type);
  });
}
function _0(t, e) {
  t.schemaEnv.meta || !t.opts.strictTypes || (w0(t, e), t.opts.allowUnionTypes || b0(t, e), S0(t, t.dataTypes));
}
function w0(t, e) {
  if (e.length) {
    if (!t.dataTypes.length) {
      t.dataTypes = e;
      return;
    }
    e.forEach((r) => {
      jm(t.dataTypes, r) || ai(t, `type "${r}" not allowed by context "${t.dataTypes.join(",")}"`);
    }), N0(t, e);
  }
}
function b0(t, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && ai(t, "use allowUnionTypes to allow union type keyword");
}
function S0(t, e) {
  const r = t.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, si.shouldUseRule)(t.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => E0(e, o)) && ai(t, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function E0(t, e) {
  return t.includes(e) || e === "number" && t.includes("integer");
}
function jm(t, e) {
  return t.includes(e) || e === "integer" && t.includes("number");
}
function N0(t, e) {
  const r = [];
  for (const n of t.dataTypes)
    jm(e, n) ? r.push(n) : e.includes("integer") && n === "number" && r.push("integer");
  t.dataTypes = r;
}
function ai(t, e) {
  const r = t.schemaEnv.baseId + t.errSchemaPath;
  e += ` at "${r}" (strictTypes)`, (0, Ct.checkStrictMode)(t, e, t.opts.strictTypes);
}
let Cm = class {
  constructor(e, r, n) {
    if ((0, Mn.validateKeywordUsage)(e, r, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Ct.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = r, this.$data)
      this.schemaCode = e.gen.const("vSchema", km(this.$data, e));
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
    return f0(s, r), s;
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
pt.KeywordCxt = Cm;
function Am(t, e, r, n) {
  const s = new Cm(t, r, e);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Mn.funcKeywordCode)(s, r) : "macro" in r ? (0, Mn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Mn.funcKeywordCode)(s, r);
}
const P0 = /^\/(?:[^~]|~0|~1)*$/, T0 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function km(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (t === "")
    return te.default.rootData;
  if (t[0] === "/") {
    if (!P0.test(t))
      throw new Error(`Invalid JSON-pointer: ${t}`);
    s = t, a = te.default.rootData;
  } else {
    const d = T0.exec(t);
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
pt.getData = km;
var rs = {};
Object.defineProperty(rs, "__esModule", { value: !0 });
let O0 = class extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
};
rs.default = O0;
var mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
const qa = je;
let R0 = class extends Error {
  constructor(e, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, qa.resolveUrl)(e, r, n), this.missingSchema = (0, qa.normalizeId)((0, qa.getFullPath)(e, this.missingRef));
  }
};
mn.default = R0;
var Ge = {};
Object.defineProperty(Ge, "__esModule", { value: !0 });
Ge.resolveSchema = Ge.getCompilingSchema = Ge.resolveRef = Ge.compileSchema = Ge.SchemaEnv = void 0;
const ct = se, I0 = rs, yr = nt, ht = je, El = V, j0 = pt;
let ha = class {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, ht.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Ge.SchemaEnv = ha;
function oi(t) {
  const e = Lm.call(this, t);
  if (e)
    return e;
  const r = (0, ht.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new ct.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: I0.default,
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
    this._compilations.add(t), (0, j0.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
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
Ge.compileSchema = oi;
function C0(t, e, r) {
  var n;
  r = (0, ht.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = L0.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new ha({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = A0.call(this, a);
}
Ge.resolveRef = C0;
function A0(t) {
  return (0, ht.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : oi.call(this, t);
}
function Lm(t) {
  for (const e of this._compilations)
    if (k0(e, t))
      return e;
}
Ge.getCompilingSchema = Lm;
function k0(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function L0(t, e) {
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
    if (o.validate || oi.call(this, o), a === (0, ht.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, d = i[c];
      return d && (s = (0, ht.resolveUrl)(this.opts.uriResolver, s, d)), new ha({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return za.call(this, r, o);
  }
}
Ge.resolveSchema = ma;
const D0 = /* @__PURE__ */ new Set([
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
    const c = r[(0, El.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !D0.has(i) && d && (e = (0, ht.resolveUrl)(this.opts.uriResolver, e, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, El.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, ht.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = ma.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new ha({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const M0 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", V0 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", F0 = "object", q0 = [
  "$data"
], z0 = {
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
}, U0 = !1, B0 = {
  $id: M0,
  description: V0,
  type: F0,
  required: q0,
  properties: z0,
  additionalProperties: U0
};
var ii = {}, pa = { exports: {} };
const K0 = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Dm = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), ci = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), Mm = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), Q0 = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
function Vm(t) {
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
const G0 = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Nl(t) {
  return t.length = 0, !0;
}
function x0(t, e, r) {
  if (t.length) {
    const n = Vm(t);
    if (n !== "")
      e.push(n);
    else
      return r.error = !0, !1;
    t.length = 0;
  }
  return !0;
}
function H0(t) {
  let e = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, i = x0;
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
        i = Nl;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (i === Nl ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(Vm(s))), r.address = n.join(""), r;
}
function Fm(t) {
  if (J0(t, ":") < 2)
    return { host: t, isIPV6: !1 };
  const e = H0(t);
  if (e.error)
    return { host: t, isIPV6: !1 };
  {
    let r = e.address, n = e.address;
    return e.zone && (r += "%" + e.zone, n += "%25" + e.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function J0(t, e) {
  let r = 0;
  for (let n = 0; n < t.length; n++)
    t[n] === e && r++;
  return r;
}
function W0(t) {
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
const X0 = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, Y0 = /[@/?#:]/g, Z0 = /[@/?#]/g;
function qm(t, e) {
  const r = e ? Z0 : Y0;
  return r.lastIndex = 0, t.replace(r, (n) => X0[n]);
}
function ev(t, e = !1) {
  if (t.indexOf("%") === -1)
    return t;
  let r = "";
  for (let n = 0; n < t.length; n++) {
    if (t[n] === "%" && n + 2 < t.length) {
      const s = t.slice(n + 1, n + 3);
      if (ci(s)) {
        const a = s.toUpperCase(), o = String.fromCharCode(parseInt(a, 16));
        e && Mm(o) ? r += o : r += "%" + a, n += 2;
        continue;
      }
    }
    r += t[n];
  }
  return r;
}
function tv(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    if (t[r] === "%" && r + 2 < t.length) {
      const n = t.slice(r + 1, r + 3);
      if (ci(n)) {
        const s = n.toUpperCase(), a = String.fromCharCode(parseInt(s, 16));
        a !== "." && Mm(a) ? e += a : e += "%" + s, r += 2;
        continue;
      }
    }
    Q0(t[r]) ? e += t[r] : e += escape(t[r]);
  }
  return e;
}
function rv(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    if (t[r] === "%" && r + 2 < t.length) {
      const n = t.slice(r + 1, r + 3);
      if (ci(n)) {
        e += "%" + n.toUpperCase(), r += 2;
        continue;
      }
    }
    e += escape(t[r]);
  }
  return e;
}
function nv(t) {
  const e = [];
  if (t.userinfo !== void 0 && (e.push(t.userinfo), e.push("@")), t.host !== void 0) {
    let r = unescape(t.host);
    if (!Dm(r)) {
      const n = Fm(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = qm(r, !1);
    }
    e.push(r);
  }
  return (typeof t.port == "number" || typeof t.port == "string") && (e.push(":"), e.push(String(t.port))), e.length ? e.join("") : void 0;
}
var zm = {
  nonSimpleDomain: G0,
  recomposeAuthority: nv,
  reescapeHostDelimiters: qm,
  normalizePercentEncoding: ev,
  normalizePathEncoding: tv,
  escapePreservingEscapes: rv,
  removeDotSegments: W0,
  isIPv4: Dm,
  isUUID: K0,
  normalizeIPv6: Fm
};
const { isUUID: sv } = zm, av = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Um(t) {
  return t.secure === !0 ? !0 : t.secure === !1 ? !1 : t.scheme ? t.scheme.length === 3 && (t.scheme[0] === "w" || t.scheme[0] === "W") && (t.scheme[1] === "s" || t.scheme[1] === "S") && (t.scheme[2] === "s" || t.scheme[2] === "S") : !1;
}
function Bm(t) {
  return t.host || (t.error = t.error || "HTTP URIs must have a host."), t;
}
function Km(t) {
  const e = String(t.scheme).toLowerCase() === "https";
  return (t.port === (e ? 443 : 80) || t.port === "") && (t.port = void 0), t.path || (t.path = "/"), t;
}
function ov(t) {
  return t.secure = Um(t), t.resourceName = (t.path || "/") + (t.query ? "?" + t.query : ""), t.path = void 0, t.query = void 0, t;
}
function iv(t) {
  if ((t.port === (Um(t) ? 443 : 80) || t.port === "") && (t.port = void 0), typeof t.secure == "boolean" && (t.scheme = t.secure ? "wss" : "ws", t.secure = void 0), t.resourceName) {
    const [e, r] = t.resourceName.split("?");
    t.path = e && e !== "/" ? e : void 0, t.query = r, t.resourceName = void 0;
  }
  return t.fragment = void 0, t;
}
function cv(t, e) {
  if (!t.path)
    return t.error = "URN can not be parsed", t;
  const r = t.path.match(av);
  if (r) {
    const n = e.scheme || t.scheme || "urn";
    t.nid = r[1].toLowerCase(), t.nss = r[2];
    const s = `${n}:${e.nid || t.nid}`, a = li(s);
    t.path = void 0, a && (t = a.parse(t, e));
  } else
    t.error = t.error || "URN can not be parsed.";
  return t;
}
function lv(t, e) {
  if (t.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = e.scheme || t.scheme || "urn", n = t.nid.toLowerCase(), s = `${r}:${e.nid || n}`, a = li(s);
  a && (t = a.serialize(t, e));
  const o = t, i = t.nss;
  return o.path = `${n || e.nid}:${i}`, e.skipEscape = !0, o;
}
function uv(t, e) {
  const r = t;
  return r.uuid = r.nss, r.nss = void 0, !e.tolerant && (!r.uuid || !sv(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function dv(t) {
  const e = t;
  return e.nss = (t.uuid || "").toLowerCase(), e;
}
const Qm = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Bm,
    serialize: Km
  }
), fv = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Qm.domainHost,
    parse: Bm,
    serialize: Km
  }
), As = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: ov,
    serialize: iv
  }
), hv = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: As.domainHost,
    parse: As.parse,
    serialize: As.serialize
  }
), mv = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: cv,
    serialize: lv,
    skipNormalize: !0
  }
), pv = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: uv,
    serialize: dv,
    skipNormalize: !0
  }
), Gs = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Qm,
    https: fv,
    ws: As,
    wss: hv,
    urn: mv,
    "urn:uuid": pv
  }
);
Object.setPrototypeOf(Gs, null);
function li(t) {
  return t && (Gs[
    /** @type {SchemeName} */
    t
  ] || Gs[
    /** @type {SchemeName} */
    t.toLowerCase()
  ]) || void 0;
}
var yv = {
  SCHEMES: Gs,
  getSchemeHandler: li
};
const { normalizeIPv6: $v, removeDotSegments: Cn, recomposeAuthority: gv, normalizePercentEncoding: vv, normalizePathEncoding: _v, escapePreservingEscapes: wv, reescapeHostDelimiters: bv, isIPv4: Sv, nonSimpleDomain: Ev } = zm, { SCHEMES: Nv, getSchemeHandler: Gm } = yv;
function Pv(t, e) {
  return typeof t == "string" ? t = /** @type {T} */
  jv(t, e) : typeof t == "object" && (t = /** @type {T} */
  cn(Rr(t, e), e)), t;
}
function Tv(t, e, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = xm(cn(t, n), cn(e, n), n, !0);
  return n.skipEscape = !0, Rr(s, n);
}
function xm(t, e, r, n) {
  const s = {};
  return n || (t = cn(Rr(t, r), r), e = cn(Rr(e, r), r)), r = r || {}, !r.tolerant && e.scheme ? (s.scheme = e.scheme, s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = Cn(e.path || ""), s.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = Cn(e.path || ""), s.query = e.query) : (e.path ? (e.path[0] === "/" ? s.path = Cn(e.path) : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path ? s.path = "/" + e.path : t.path ? s.path = t.path.slice(0, t.path.lastIndexOf("/") + 1) + e.path : s.path = e.path, s.path = Cn(s.path)), s.query = e.query) : (s.path = t.path, e.query !== void 0 ? s.query = e.query : s.query = t.query), s.userinfo = t.userinfo, s.host = t.host, s.port = t.port), s.scheme = t.scheme), s.fragment = e.fragment, s;
}
function Ov(t, e, r) {
  const n = Pl(t, r), s = Pl(e, r);
  return n !== void 0 && s !== void 0 && n.toLowerCase() === s.toLowerCase();
}
function Rr(t, e) {
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
  }, n = Object.assign({}, e), s = [], a = Gm(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = vv(r.path) : (r.path = wv(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = gv(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let i = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (i = Cn(i)), o === void 0 && i[0] === "/" && i[1] === "/" && (i = "/%2F" + i.slice(2)), s.push(i);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const Rv = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Iv(t, e) {
  if (e[2] !== void 0 && t.path && t.path[0] !== "/")
    return 'URI path must start with "/" when authority is present.';
  if (typeof t.port == "number" && (t.port < 0 || t.port > 65535))
    return "URI port is malformed.";
}
function Hm(t, e) {
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
  const o = t.match(Rv);
  if (o) {
    n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]);
    const i = Iv(n, o);
    if (i !== void 0 && (n.error = n.error || i, s = !0), n.host)
      if (Sv(n.host) === !1) {
        const l = $v(n.host);
        n.host = l.host.toLowerCase(), a = l.isIPV6;
      } else
        a = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = Gm(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && Ev(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!c || c && !c.skipNormalize) && (t.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = bv(unescape(n.host), a))), n.path && (n.path = _v(n.path)), n.fragment))
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
  return Hm(t, e).parsed;
}
function jv(t, e) {
  return Jm(t, e).normalized;
}
function Jm(t, e) {
  const { parsed: r, malformedAuthorityOrPort: n } = Hm(t, e);
  return {
    normalized: n ? t : Rr(r, e),
    malformedAuthorityOrPort: n
  };
}
function Pl(t, e) {
  if (typeof t == "string") {
    const { normalized: r, malformedAuthorityOrPort: n } = Jm(t, e);
    return n ? void 0 : r;
  }
  if (typeof t == "object")
    return Rr(t, e);
}
const ui = {
  SCHEMES: Nv,
  normalize: Pv,
  resolve: Tv,
  resolveComponent: xm,
  equal: Ov,
  serialize: Rr,
  parse: cn
};
pa.exports = ui;
pa.exports.default = ui;
pa.exports.fastUri = ui;
var Wm = pa.exports;
Object.defineProperty(ii, "__esModule", { value: !0 });
const Xm = Wm;
Xm.code = 'require("ajv/dist/runtime/uri").default';
ii.default = Xm;
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
  const n = rs, s = mn, a = Or, o = Ge, i = se, c = je, d = Ne, l = V, h = B0, _ = ii, $ = (P, p) => new RegExp(P, p);
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
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, g, p, "NOT SUPPORTED"), I.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ge.call(this), p.formats && X.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && de.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), D.call(this), p.validateFormats = u;
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
  function X() {
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
})(sm);
var di = {}, fi = {}, hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
const Cv = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
hi.default = Cv;
var Dt = {};
Object.defineProperty(Dt, "__esModule", { value: !0 });
Dt.callRef = Dt.getValidate = void 0;
const Av = mn, Tl = ce, He = se, zr = nt, Ol = Ge, fs = V, kv = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = Ol.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new Av.default(n.opts.uriResolver, s, r);
    if (l instanceof Ol.SchemaEnv)
      return _(l);
    return $(l);
    function h() {
      if (a === d)
        return ks(t, o, a, a.$async);
      const w = e.scopeValue("root", { ref: d });
      return ks(t, (0, He._)`${w}.validate`, d, d.$async);
    }
    function _(w) {
      const v = Ym(t, w);
      ks(t, v, w, w.$async);
    }
    function $(w) {
      const v = e.scopeValue("schema", i.code.source === !0 ? { ref: w, code: (0, He.stringify)(w) } : { ref: w }), g = e.name("valid"), m = t.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: He.nil,
        topSchemaRef: v,
        errSchemaPath: r
      }, g);
      t.mergeEvaluated(m), t.ok(g);
    }
  }
};
function Ym(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, He._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
Dt.getValidate = Ym;
function ks(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, d = c.passContext ? zr.default.this : He.nil;
  n ? l() : h();
  function l() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, He._)`await ${(0, Tl.callValidateCode)(t, e, d)}`), $(e), o || s.assign(w, !0);
    }, (v) => {
      s.if((0, He._)`!(${v} instanceof ${a.ValidationError})`, () => s.throw(v)), _(v), o || s.assign(w, !1);
    }), t.ok(w);
  }
  function h() {
    t.result((0, Tl.callValidateCode)(t, e, d), () => $(e), () => _(e));
  }
  function _(w) {
    const v = (0, He._)`${w}.errors`;
    s.assign(zr.default.vErrors, (0, He._)`${zr.default.vErrors} === null ? ${v} : ${zr.default.vErrors}.concat(${v})`), s.assign(zr.default.errors, (0, He._)`${zr.default.vErrors}.length`);
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
        const m = s.var("props", (0, He._)`${w}.evaluated.props`);
        a.props = fs.mergeEvaluated.props(s, m, a.props, He.Name);
      }
    if (a.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (a.items = fs.mergeEvaluated.items(s, g.items, a.items));
      else {
        const m = s.var("items", (0, He._)`${w}.evaluated.items`);
        a.items = fs.mergeEvaluated.items(s, m, a.items, He.Name);
      }
  }
}
Dt.callRef = ks;
Dt.default = kv;
Object.defineProperty(fi, "__esModule", { value: !0 });
const Lv = hi, Dv = Dt, Mv = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Lv.default,
  Dv.default
];
fi.default = Mv;
var mi = {}, pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
const xs = se, Ut = xs.operators, Hs = {
  maximum: { okStr: "<=", ok: Ut.LTE, fail: Ut.GT },
  minimum: { okStr: ">=", ok: Ut.GTE, fail: Ut.LT },
  exclusiveMaximum: { okStr: "<", ok: Ut.LT, fail: Ut.GTE },
  exclusiveMinimum: { okStr: ">", ok: Ut.GT, fail: Ut.LTE }
}, Vv = {
  message: ({ keyword: t, schemaCode: e }) => (0, xs.str)`must be ${Hs[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, xs._)`{comparison: ${Hs[t].okStr}, limit: ${e}}`
}, Fv = {
  keyword: Object.keys(Hs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Vv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, xs._)`${r} ${Hs[e].fail} ${n} || isNaN(${r})`);
  }
};
pi.default = Fv;
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const Vn = se, qv = {
  message: ({ schemaCode: t }) => (0, Vn.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, Vn._)`{multipleOf: ${t}}`
}, zv = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: qv,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, Vn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Vn._)`${o} !== parseInt(${o})`;
    t.fail$data((0, Vn._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
yi.default = zv;
var $i = {}, gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
function Zm(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
gi.default = Zm;
Zm.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty($i, "__esModule", { value: !0 });
const vr = se, Uv = V, Bv = gi, Kv = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, vr.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, vr._)`{limit: ${t}}`
}, Qv = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Kv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? vr.operators.GT : vr.operators.LT, o = s.opts.unicode === !1 ? (0, vr._)`${r}.length` : (0, vr._)`${(0, Uv.useFunc)(t.gen, Bv.default)}(${r})`;
    t.fail$data((0, vr._)`${o} ${a} ${n}`);
  }
};
$i.default = Qv;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const Gv = ce, xv = V, Xr = se, Hv = {
  message: ({ schemaCode: t }) => (0, Xr.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, Xr._)`{pattern: ${t}}`
}, Jv = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Hv,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t, i = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Xr._)`new RegExp` : (0, xv.useFunc)(e, c), l = e.let("valid");
      e.try(() => e.assign(l, (0, Xr._)`${d}(${a}, ${i}).test(${r})`), () => e.assign(l, !1)), t.fail$data((0, Xr._)`!${l}`);
    } else {
      const c = (0, Gv.usePattern)(t, s);
      t.fail$data((0, Xr._)`!${c}.test(${r})`);
    }
  }
};
vi.default = Jv;
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
const Fn = se, Wv = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, Fn.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, Fn._)`{limit: ${t}}`
}, Xv = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Wv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? Fn.operators.GT : Fn.operators.LT;
    t.fail$data((0, Fn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
_i.default = Xv;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const On = ce, qn = se, Yv = V, Zv = {
  message: ({ params: { missingProperty: t } }) => (0, qn.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, qn._)`{missingProperty: ${t}}`
}, e_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Zv,
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
          (0, Yv.checkStrictMode)(o, m, o.opts.strictRequired);
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
wi.default = e_;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
const zn = se, t_ = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, zn.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, zn._)`{limit: ${t}}`
}, r_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: t_,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? zn.operators.GT : zn.operators.LT;
    t.fail$data((0, zn._)`${r}.length ${s} ${n}`);
  }
};
bi.default = r_;
var Si = {}, ns = {};
Object.defineProperty(ns, "__esModule", { value: !0 });
const ep = fa;
ep.code = 'require("ajv/dist/runtime/equal").default';
ns.default = ep;
Object.defineProperty(Si, "__esModule", { value: !0 });
const Ua = Ne, Re = se, n_ = V, s_ = ns, a_ = {
  message: ({ params: { i: t, j: e } }) => (0, Re.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, Re._)`{i: ${t}, j: ${e}}`
}, o_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: a_,
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
      const g = (0, n_.useFunc)(e, s_.default), m = e.name("outer");
      e.label(m).for((0, Re._)`;${w}--;`, () => e.for((0, Re._)`${v} = ${w}; ${v}--;`, () => e.if((0, Re._)`${g}(${r}[${w}], ${r}[${v}])`, () => {
        t.error(), e.assign(c, !1).break(m);
      })));
    }
  }
};
Si.default = o_;
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const ho = se, i_ = V, c_ = ns, l_ = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, ho._)`{allowedValue: ${t}}`
}, u_ = {
  keyword: "const",
  $data: !0,
  error: l_,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, ho._)`!${(0, i_.useFunc)(e, c_.default)}(${r}, ${s})`) : t.fail((0, ho._)`${a} !== ${r}`);
  }
};
Ei.default = u_;
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
const An = se, d_ = V, f_ = ns, h_ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, An._)`{allowedValues: ${t}}`
}, m_ = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: h_,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, d_.useFunc)(e, f_.default));
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
Ni.default = m_;
Object.defineProperty(mi, "__esModule", { value: !0 });
const p_ = pi, y_ = yi, $_ = $i, g_ = vi, v_ = _i, __ = wi, w_ = bi, b_ = Si, S_ = Ei, E_ = Ni, N_ = [
  // number
  p_.default,
  y_.default,
  // string
  $_.default,
  g_.default,
  // object
  v_.default,
  __.default,
  // array
  w_.default,
  b_.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  S_.default,
  E_.default
];
mi.default = N_;
var Pi = {}, pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.validateAdditionalItems = void 0;
const _r = se, mo = V, P_ = {
  message: ({ params: { len: t } }) => (0, _r.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, _r._)`{limit: ${t}}`
}, T_ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: P_,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, mo.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    tp(t, n);
  }
};
function tp(t, e) {
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
pn.validateAdditionalItems = tp;
pn.default = T_;
var Ti = {}, yn = {};
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.validateTuple = void 0;
const Rl = se, Ls = V, O_ = ce, R_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return rp(t, "additionalItems", e);
    r.items = !0, !(0, Ls.alwaysValidSchema)(r, e) && t.ok((0, O_.validateArray)(t));
  }
};
function rp(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  l(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = Ls.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), d = n.const("len", (0, Rl._)`${a}.length`);
  r.forEach((h, _) => {
    (0, Ls.alwaysValidSchema)(i, h) || (n.if((0, Rl._)`${d} > ${_}`, () => t.subschema({
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
yn.validateTuple = rp;
yn.default = R_;
Object.defineProperty(Ti, "__esModule", { value: !0 });
const I_ = yn, j_ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, I_.validateTuple)(t, "items")
};
Ti.default = j_;
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
const Il = se, C_ = V, A_ = ce, k_ = pn, L_ = {
  message: ({ params: { len: t } }) => (0, Il.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, Il._)`{limit: ${t}}`
}, D_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: L_,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, C_.alwaysValidSchema)(n, e) && (s ? (0, k_.validateAdditionalItems)(t, s) : t.ok((0, A_.validateArray)(t)));
  }
};
Oi.default = D_;
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
const st = se, hs = V, M_ = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, st.str)`must contain at least ${t} valid item(s)` : (0, st.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, st._)`{minContains: ${t}}` : (0, st._)`{minContains: ${t}, maxContains: ${e}}`
}, V_ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: M_,
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
Ri.default = V_;
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
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
const np = se, F_ = V, q_ = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, np._)`{propertyName: ${t.propertyName}}`
}, z_ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: q_,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, F_.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, np.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
Ii.default = z_;
var $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
const ms = ce, ut = se, U_ = nt, ps = V, B_ = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, ut._)`{additionalProperty: ${t.additionalProperty}}`
}, K_ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: B_,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, ps.alwaysValidSchema)(o, r))
      return;
    const d = (0, ms.allSchemaProperties)(n.properties), l = (0, ms.allSchemaProperties)(n.patternProperties);
    h(), t.ok((0, ut._)`${a} === ${U_.default.errors}`);
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
$a.default = K_;
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
const Q_ = pt, jl = ce, Ba = V, Cl = $a, G_ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Cl.default.code(new Q_.KeywordCxt(a, Cl.default, "additionalProperties"));
    const o = (0, jl.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Ba.mergeEvaluated.props(e, (0, Ba.toHash)(o), a.props));
    const i = o.filter((h) => !(0, Ba.alwaysValidSchema)(a, r[h]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const h of i)
      d(h) ? l(h) : (e.if((0, jl.propertyInData)(e, s, h, a.opts.ownProperties)), l(h), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(h), t.ok(c);
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
ji.default = G_;
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
const Al = ce, ys = se, kl = V, Ll = V, x_ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, Al.allSchemaProperties)(r), c = i.filter((v) => (0, kl.alwaysValidSchema)(a, r[v]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = e.name("valid");
    a.props !== !0 && !(a.props instanceof ys.Name) && (a.props = (0, Ll.evaluatedPropsToName)(e, a.props));
    const { props: h } = a;
    _();
    function _() {
      for (const v of i)
        d && $(v), a.allErrors ? w(v) : (e.var(l, !0), w(v), e.if(l));
    }
    function $(v) {
      for (const g in d)
        new RegExp(v).test(g) && (0, kl.checkStrictMode)(a, `property ${g} matches pattern ${v} (use allowMatchingProperties)`);
    }
    function w(v) {
      e.forIn("key", n, (g) => {
        e.if((0, ys._)`${(0, Al.usePattern)(t, v)}.test(${g})`, () => {
          const m = c.includes(v);
          m || t.subschema({
            keyword: "patternProperties",
            schemaProp: v,
            dataProp: g,
            dataPropType: Ll.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? e.assign((0, ys._)`${h}[${g}]`, !0) : !m && !a.allErrors && e.if((0, ys.not)(l), () => e.break());
        });
      });
    }
  }
};
Ci.default = x_;
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
const H_ = V, J_ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, H_.alwaysValidSchema)(n, r)) {
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
Ai.default = J_;
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
const W_ = ce, X_ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: W_.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ki.default = X_;
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
const Ds = se, Y_ = V, Z_ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, Ds._)`{passingSchemas: ${t.passing}}`
}, ew = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Z_,
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
        (0, Y_.alwaysValidSchema)(s, l) ? e.var(c, !0) : _ = t.subschema({
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
Li.default = ew;
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
const tw = V, rw = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, tw.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
Di.default = rw;
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
const Js = se, sp = V, nw = {
  message: ({ params: t }) => (0, Js.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, Js._)`{failingKeyword: ${t.ifClause}}`
}, sw = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: nw,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, sp.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Dl(n, "then"), a = Dl(n, "else");
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
function Dl(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, sp.alwaysValidSchema)(t, r);
}
Mi.default = sw;
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
const aw = V, ow = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, aw.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
Vi.default = ow;
Object.defineProperty(Pi, "__esModule", { value: !0 });
const iw = pn, cw = Ti, lw = yn, uw = Oi, dw = Ri, fw = ya, hw = Ii, mw = $a, pw = ji, yw = Ci, $w = Ai, gw = ki, vw = Li, _w = Di, ww = Mi, bw = Vi;
function Sw(t = !1) {
  const e = [
    // any
    $w.default,
    gw.default,
    vw.default,
    _w.default,
    ww.default,
    bw.default,
    // object
    hw.default,
    mw.default,
    fw.default,
    pw.default,
    yw.default
  ];
  return t ? e.push(cw.default, uw.default) : e.push(iw.default, lw.default), e.push(dw.default), e;
}
Pi.default = Sw;
var Fi = {}, $n = {};
Object.defineProperty($n, "__esModule", { value: !0 });
$n.dynamicAnchor = void 0;
const Ka = se, Ew = nt, Ml = Ge, Nw = Dt, Pw = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (t) => ap(t, t.schema)
};
function ap(t, e) {
  const { gen: r, it: n } = t;
  n.schemaEnv.root.dynamicAnchors[e] = !0;
  const s = (0, Ka._)`${Ew.default.dynamicAnchors}${(0, Ka.getProperty)(e)}`, a = n.errSchemaPath === "#" ? n.validateName : Tw(t);
  r.if((0, Ka._)`!${s}`, () => r.assign(s, a));
}
$n.dynamicAnchor = ap;
function Tw(t) {
  const { schemaEnv: e, schema: r, self: n } = t.it, { root: s, baseId: a, localRefs: o, meta: i } = e.root, { schemaId: c } = n.opts, d = new Ml.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: i });
  return Ml.compileSchema.call(n, d), (0, Nw.getValidate)(t, d);
}
$n.default = Pw;
var gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
gn.dynamicRef = void 0;
const Vl = se, Ow = nt, Fl = Dt, Rw = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (t) => op(t, t.schema)
};
function op(t, e) {
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
      const d = r.let("_v", (0, Vl._)`${Ow.default.dynamicAnchors}${(0, Vl.getProperty)(a)}`);
      r.if(d, i(d, c), i(s.validateName, c));
    } else
      i(s.validateName, c)();
  }
  function i(c, d) {
    return d ? () => r.block(() => {
      (0, Fl.callRef)(t, c), r.let(d, !0);
    }) : () => (0, Fl.callRef)(t, c);
  }
}
gn.dynamicRef = op;
gn.default = Rw;
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
const Iw = $n, jw = V, Cw = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(t) {
    t.schema ? (0, Iw.dynamicAnchor)(t, "") : (0, jw.checkStrictMode)(t.it, "$recursiveAnchor: false is ignored");
  }
};
qi.default = Cw;
var zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
const Aw = gn, kw = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (t) => (0, Aw.dynamicRef)(t, t.schema)
};
zi.default = kw;
Object.defineProperty(Fi, "__esModule", { value: !0 });
const Lw = $n, Dw = gn, Mw = qi, Vw = zi, Fw = [Lw.default, Dw.default, Mw.default, Vw.default];
Fi.default = Fw;
var Ui = {}, Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
const ql = ya, qw = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: ql.error,
  code: (t) => (0, ql.validatePropertyDeps)(t)
};
Bi.default = qw;
var Ki = {};
Object.defineProperty(Ki, "__esModule", { value: !0 });
const zw = ya, Uw = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (t) => (0, zw.validateSchemaDeps)(t)
};
Ki.default = Uw;
var Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
const Bw = V, Kw = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: t, parentSchema: e, it: r }) {
    e.contains === void 0 && (0, Bw.checkStrictMode)(r, `"${t}" without "contains" is ignored`);
  }
};
Qi.default = Kw;
Object.defineProperty(Ui, "__esModule", { value: !0 });
const Qw = Bi, Gw = Ki, xw = Qi, Hw = [Qw.default, Gw.default, xw.default];
Ui.default = Hw;
var Gi = {}, xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
const Qt = se, zl = V, Jw = nt, Ww = {
  message: "must NOT have unevaluated properties",
  params: ({ params: t }) => (0, Qt._)`{unevaluatedProperty: ${t.unevaluatedProperty}}`
}, Xw = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Ww,
  code(t) {
    const { gen: e, schema: r, data: n, errsCount: s, it: a } = t;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: i } = a;
    i instanceof Qt.Name ? e.if((0, Qt._)`${i} !== true`, () => e.forIn("key", n, (h) => e.if(d(i, h), () => c(h)))) : i !== !0 && e.forIn("key", n, (h) => i === void 0 ? c(h) : e.if(l(i, h), () => c(h))), a.props = !0, t.ok((0, Qt._)`${s} === ${Jw.default.errors}`);
    function c(h) {
      if (r === !1) {
        t.setParams({ unevaluatedProperty: h }), t.error(), o || e.break();
        return;
      }
      if (!(0, zl.alwaysValidSchema)(a, r)) {
        const _ = e.name("valid");
        t.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: zl.Type.Str
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
xi.default = Xw;
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
const wr = se, Ul = V, Yw = {
  message: ({ params: { len: t } }) => (0, wr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, wr._)`{limit: ${t}}`
}, Zw = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Yw,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t, a = s.items || 0;
    if (a === !0)
      return;
    const o = e.const("len", (0, wr._)`${n}.length`);
    if (r === !1)
      t.setParams({ len: a }), t.fail((0, wr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, Ul.alwaysValidSchema)(s, r)) {
      const c = e.var("valid", (0, wr._)`${o} <= ${a}`);
      e.if((0, wr.not)(c), () => i(c, a)), t.ok(c);
    }
    s.items = !0;
    function i(c, d) {
      e.forRange("i", d, o, (l) => {
        t.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: Ul.Type.Num }, c), s.allErrors || e.if((0, wr.not)(c), () => e.break());
      });
    }
  }
};
Hi.default = Zw;
Object.defineProperty(Gi, "__esModule", { value: !0 });
const eb = xi, tb = Hi, rb = [eb.default, tb.default];
Gi.default = rb;
var Ji = {}, Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
const we = se, nb = {
  message: ({ schemaCode: t }) => (0, we.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, we._)`{format: ${t}}`
}, sb = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: nb,
  code(t, e) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = i;
    if (!c.validateFormats)
      return;
    s ? _() : $();
    function _() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), v = r.const("fDef", (0, we._)`${w}[${o}]`), g = r.let("fType"), m = r.let("format");
      r.if((0, we._)`typeof ${v} == "object" && !(${v} instanceof RegExp)`, () => r.assign(g, (0, we._)`${v}.type || "string"`).assign(m, (0, we._)`${v}.validate`), () => r.assign(g, (0, we._)`"string"`).assign(m, v)), t.fail$data((0, we.or)(b(), T()));
      function b() {
        return c.strictSchema === !1 ? we.nil : (0, we._)`${o} && !${m}`;
      }
      function T() {
        const O = l.$async ? (0, we._)`(${v}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, we._)`${m}(${n})`, I = (0, we._)`(typeof ${m} == "function" ? ${O} : ${m}.test(${n}))`;
        return (0, we._)`${m} && ${m} !== true && ${g} === ${e} && !${I}`;
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
        const q = I instanceof RegExp ? (0, we.regexpCode)(I) : c.code.formats ? (0, we._)`${c.code.formats}${(0, we.getProperty)(a)}` : void 0, D = r.scopeValue("formats", { key: a, ref: I, code: q });
        return typeof I == "object" && !(I instanceof RegExp) ? [I.type || "string", I.validate, (0, we._)`${D}.validate`] : ["string", I, D];
      }
      function O() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, we._)`await ${m}(${n})`;
        }
        return typeof g == "function" ? (0, we._)`${m}(${n})` : (0, we._)`${m}.test(${n})`;
      }
    }
  }
};
Wi.default = sb;
Object.defineProperty(Ji, "__esModule", { value: !0 });
const ab = Wi, ob = [ab.default];
Ji.default = ob;
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
Object.defineProperty(di, "__esModule", { value: !0 });
const ib = fi, cb = mi, lb = Pi, ub = Fi, db = Ui, fb = Gi, hb = Ji, Bl = ln, mb = [
  ub.default,
  ib.default,
  cb.default,
  (0, lb.default)(!0),
  hb.default,
  Bl.metadataVocabulary,
  Bl.contentVocabulary,
  db.default,
  fb.default
];
di.default = mb;
var Xi = {}, ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
ga.DiscrError = void 0;
var Kl;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(Kl || (ga.DiscrError = Kl = {}));
Object.defineProperty(Xi, "__esModule", { value: !0 });
const Gr = se, po = ga, Ql = Ge, pb = mn, yb = V, $b = {
  message: ({ params: { discrError: t, tagName: e } }) => t === po.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, Gr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, gb = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: $b,
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
        if (I != null && I.$ref && !(0, yb.schemaHasRulesButRef)(I, a.self.RULES)) {
          const D = I.$ref;
          if (I = Ql.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, D), I instanceof Ql.SchemaEnv && (I = I.schema), I === void 0)
            throw new pb.default(a.opts.uriResolver, a.baseId, D);
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
Xi.default = gb;
var Yi = {};
const vb = "https://json-schema.org/draft/2020-12/schema", _b = "https://json-schema.org/draft/2020-12/schema", wb = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, bb = "meta", Sb = "Core and Validation specifications meta-schema", Eb = [
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
], Nb = [
  "object",
  "boolean"
], Pb = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Tb = {
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
}, Ob = {
  $schema: vb,
  $id: _b,
  $vocabulary: wb,
  $dynamicAnchor: bb,
  title: Sb,
  allOf: Eb,
  type: Nb,
  $comment: Pb,
  properties: Tb
}, Rb = "https://json-schema.org/draft/2020-12/schema", Ib = "https://json-schema.org/draft/2020-12/meta/applicator", jb = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, Cb = "meta", Ab = "Applicator vocabulary meta-schema", kb = [
  "object",
  "boolean"
], Lb = {
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
}, Db = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, Mb = {
  $schema: Rb,
  $id: Ib,
  $vocabulary: jb,
  $dynamicAnchor: Cb,
  title: Ab,
  type: kb,
  properties: Lb,
  $defs: Db
}, Vb = "https://json-schema.org/draft/2020-12/schema", Fb = "https://json-schema.org/draft/2020-12/meta/unevaluated", qb = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, zb = "meta", Ub = "Unevaluated applicator vocabulary meta-schema", Bb = [
  "object",
  "boolean"
], Kb = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Qb = {
  $schema: Vb,
  $id: Fb,
  $vocabulary: qb,
  $dynamicAnchor: zb,
  title: Ub,
  type: Bb,
  properties: Kb
}, Gb = "https://json-schema.org/draft/2020-12/schema", xb = "https://json-schema.org/draft/2020-12/meta/content", Hb = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Jb = "meta", Wb = "Content vocabulary meta-schema", Xb = [
  "object",
  "boolean"
], Yb = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Zb = {
  $schema: Gb,
  $id: xb,
  $vocabulary: Hb,
  $dynamicAnchor: Jb,
  title: Wb,
  type: Xb,
  properties: Yb
}, eS = "https://json-schema.org/draft/2020-12/schema", tS = "https://json-schema.org/draft/2020-12/meta/core", rS = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, nS = "meta", sS = "Core vocabulary meta-schema", aS = [
  "object",
  "boolean"
], oS = {
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
}, iS = {
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
}, cS = {
  $schema: eS,
  $id: tS,
  $vocabulary: rS,
  $dynamicAnchor: nS,
  title: sS,
  type: aS,
  properties: oS,
  $defs: iS
}, lS = "https://json-schema.org/draft/2020-12/schema", uS = "https://json-schema.org/draft/2020-12/meta/format-annotation", dS = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, fS = "meta", hS = "Format vocabulary meta-schema for annotation results", mS = [
  "object",
  "boolean"
], pS = {
  format: {
    type: "string"
  }
}, yS = {
  $schema: lS,
  $id: uS,
  $vocabulary: dS,
  $dynamicAnchor: fS,
  title: hS,
  type: mS,
  properties: pS
}, $S = "https://json-schema.org/draft/2020-12/schema", gS = "https://json-schema.org/draft/2020-12/meta/meta-data", vS = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, _S = "meta", wS = "Meta-data vocabulary meta-schema", bS = [
  "object",
  "boolean"
], SS = {
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
}, ES = {
  $schema: $S,
  $id: gS,
  $vocabulary: vS,
  $dynamicAnchor: _S,
  title: wS,
  type: bS,
  properties: SS
}, NS = "https://json-schema.org/draft/2020-12/schema", PS = "https://json-schema.org/draft/2020-12/meta/validation", TS = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, OS = "meta", RS = "Validation vocabulary meta-schema", IS = [
  "object",
  "boolean"
], jS = {
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
}, CS = {
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
}, AS = {
  $schema: NS,
  $id: PS,
  $vocabulary: TS,
  $dynamicAnchor: OS,
  title: RS,
  type: IS,
  properties: jS,
  $defs: CS
};
Object.defineProperty(Yi, "__esModule", { value: !0 });
const kS = Ob, LS = Mb, DS = Qb, MS = Zb, VS = cS, FS = yS, qS = ES, zS = AS, US = ["/properties"];
function BS(t) {
  return [
    kS,
    LS,
    DS,
    MS,
    VS,
    e(this, FS),
    qS,
    e(this, zS)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function e(r, n) {
    return t ? r.$dataMetaSchema(n, US) : n;
  }
}
Yi.default = BS;
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv2020 = void 0;
  const r = sm, n = di, s = Xi, a = Yi, o = "https://json-schema.org/draft/2020-12/schema";
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
var KS = io.exports, yo = { exports: {} }, ip = {};
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
    float: { type: "number", validate: X },
    // C-type double
    double: { type: "number", validate: X },
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
  function X() {
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
})(ip);
var cp = {}, $o = { exports: {} }, lp = {}, yt = {}, un = {}, ss = {}, ie = {}, Jn = {};
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
  class X extends w {
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
      const C = new X();
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
const pe = ie, QS = Jn;
function GS(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
z.toHash = GS;
function xS(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (up(t, e), !dp(e, t.self.RULES.all));
}
z.alwaysValidSchema = xS;
function up(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || mp(t, `unknown keyword: "${a}"`);
}
z.checkUnknownRules = up;
function dp(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
z.schemaHasRules = dp;
function HS(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
z.schemaHasRulesButRef = HS;
function JS({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, pe._)`${r}`;
  }
  return (0, pe._)`${t}${e}${(0, pe.getProperty)(n)}`;
}
z.schemaRefOrVal = JS;
function WS(t) {
  return fp(decodeURIComponent(t));
}
z.unescapeFragment = WS;
function XS(t) {
  return encodeURIComponent(Zi(t));
}
z.escapeFragment = XS;
function Zi(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
z.escapeJsonPointer = Zi;
function fp(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
z.unescapeJsonPointer = fp;
function YS(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
z.eachItem = YS;
function Gl({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof pe.Name ? (a instanceof pe.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof pe.Name ? (e(s, o, a), a) : r(a, o);
    return i === pe.Name && !(c instanceof pe.Name) ? n(s, c) : c;
  };
}
z.mergeEvaluated = {
  props: Gl({
    mergeNames: (t, e, r) => t.if((0, pe._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, pe._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, pe._)`${r} || {}`).code((0, pe._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, pe._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, pe._)`${r} || {}`), ec(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: hp
  }),
  items: Gl({
    mergeNames: (t, e, r) => t.if((0, pe._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, pe._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, pe._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, pe._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function hp(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, pe._)`{}`);
  return e !== void 0 && ec(t, r, e), r;
}
z.evaluatedPropsToName = hp;
function ec(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, pe._)`${e}${(0, pe.getProperty)(n)}`, !0));
}
z.setEvaluated = ec;
const xl = {};
function ZS(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: xl[e.code] || (xl[e.code] = new QS._Code(e.code))
  });
}
z.useFunc = ZS;
var vo;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(vo || (z.Type = vo = {}));
function eE(t, e, r) {
  if (t instanceof pe.Name) {
    const n = e === vo.Num;
    return r ? n ? (0, pe._)`"[" + ${t} + "]"` : (0, pe._)`"['" + ${t} + "']"` : n ? (0, pe._)`"/" + ${t}` : (0, pe._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, pe.getProperty)(t).toString() : "/" + Zi(t);
}
z.getErrorPath = eE;
function mp(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
z.checkStrictMode = mp;
var Et = {};
Object.defineProperty(Et, "__esModule", { value: !0 });
const Me = ie, tE = {
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
Et.default = tE;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
  const e = ie, r = z, n = Et;
  t.keywordError = {
    message: ({ keyword: g }) => (0, e.str)`must pass "${g}" keyword validation`
  }, t.keyword$DataError = {
    message: ({ keyword: g, schemaType: m }) => m ? (0, e.str)`"${g}" keyword must be ${m} ($data)` : (0, e.str)`"${g}" keyword is invalid ($data)`
  };
  function s(g, m = t.keywordError, b, T) {
    const { it: O } = g, { gen: I, compositeRule: q, allErrors: D } = O, X = h(g, m, b);
    T ?? (q || D) ? c(I, X) : d(O, (0, e._)`[${X}]`);
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
    const { keyword: O, data: I, schemaValue: q, it: D } = g, { opts: X, propertyName: de, topSchemaRef: ge, schemaPath: Q } = D;
    T.push([l.keyword, O], [l.params, typeof m == "function" ? m(g) : m || (0, e._)`{}`]), X.messages && T.push([l.message, typeof b == "function" ? b(g) : b]), X.verbose && T.push([l.schema, q], [l.parentSchema, (0, e._)`${ge}${Q}`], [n.default.data, I]), de && T.push([l.propertyName, de]);
  }
})(ss);
Object.defineProperty(un, "__esModule", { value: !0 });
un.boolOrEmptySchema = un.topBoolOrEmptySchema = void 0;
const rE = ss, nE = ie, sE = Et, aE = {
  message: "boolean schema is false"
};
function oE(t) {
  const { gen: e, schema: r, validateName: n } = t;
  r === !1 ? pp(t, !1) : typeof r == "object" && r.$async === !0 ? e.return(sE.default.data) : (e.assign((0, nE._)`${n}.errors`, null), e.return(!0));
}
un.topBoolOrEmptySchema = oE;
function iE(t, e) {
  const { gen: r, schema: n } = t;
  n === !1 ? (r.var(e, !1), pp(t)) : r.var(e, !0);
}
un.boolOrEmptySchema = iE;
function pp(t, e) {
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
  (0, rE.reportError)(s, aE, void 0, e);
}
var Pe = {}, Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.getRules = Ir.isJSONType = void 0;
const cE = ["string", "number", "integer", "boolean", "null", "object", "array"], lE = new Set(cE);
function uE(t) {
  return typeof t == "string" && lE.has(t);
}
Ir.isJSONType = uE;
function dE() {
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
Ir.getRules = dE;
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.shouldUseRule = At.shouldUseGroup = At.schemaHasRulesForType = void 0;
function fE({ schema: t, self: e }, r) {
  const n = e.RULES.types[r];
  return n && n !== !0 && yp(t, n);
}
At.schemaHasRulesForType = fE;
function yp(t, e) {
  return e.rules.some((r) => $p(t, r));
}
At.shouldUseGroup = yp;
function $p(t, e) {
  var r;
  return t[e.keyword] !== void 0 || ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => t[n] !== void 0));
}
At.shouldUseRule = $p;
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.reportTypeError = Pe.checkDataTypes = Pe.checkDataType = Pe.coerceAndCheckDataType = Pe.getJSONTypes = Pe.getSchemaTypes = Pe.DataType = void 0;
const hE = Ir, mE = At, pE = ss, oe = ie, gp = z;
var rn;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(rn || (Pe.DataType = rn = {}));
function yE(t) {
  const e = vp(t.type);
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
Pe.getSchemaTypes = yE;
function vp(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(hE.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
Pe.getJSONTypes = vp;
function $E(t, e) {
  const { gen: r, data: n, opts: s } = t, a = gE(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, mE.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = tc(e, n, s.strictNumbers, rn.Wrong);
    r.if(i, () => {
      a.length ? vE(t, e, a) : rc(t);
    });
  }
  return o;
}
Pe.coerceAndCheckDataType = $E;
const _p = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function gE(t, e) {
  return e ? t.filter((r) => _p.has(r) || e === "array" && r === "array") : [];
}
function vE(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, oe._)`typeof ${s}`), i = n.let("coerced", (0, oe._)`undefined`);
  a.coerceTypes === "array" && n.if((0, oe._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, oe._)`${s}[0]`).assign(o, (0, oe._)`typeof ${s}`).if(tc(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, oe._)`${i} !== undefined`);
  for (const d of r)
    (_p.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), rc(t), n.endIf(), n.if((0, oe._)`${i} !== undefined`, () => {
    n.assign(s, i), _E(t, i);
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
function _E({ gen: t, parentData: e, parentDataProperty: r }, n) {
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
function tc(t, e, r, n) {
  if (t.length === 1)
    return _o(t[0], e, r, n);
  let s;
  const a = (0, gp.toHash)(t);
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
Pe.checkDataTypes = tc;
const wE = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, oe._)`{type: ${t}}` : (0, oe._)`{type: ${e}}`
};
function rc(t) {
  const e = bE(t);
  (0, pE.reportError)(e, wE);
}
Pe.reportTypeError = rc;
function bE(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, gp.schemaRefOrVal)(t, n, "type");
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
const Ur = ie, SE = z;
function EE(t, e) {
  const { properties: r, items: n } = t.schema;
  if (e === "object" && r)
    for (const s in r)
      Hl(t, s, r[s].default);
  else e === "array" && Array.isArray(n) && n.forEach((s, a) => Hl(t, a, s.default));
}
va.assignDefaults = EE;
function Hl(t, e, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = t;
  if (r === void 0)
    return;
  const i = (0, Ur._)`${a}${(0, Ur.getProperty)(e)}`;
  if (s) {
    (0, SE.checkStrictMode)(t, `default is ignored for: ${i}`);
    return;
  }
  let c = (0, Ur._)`${i} === undefined`;
  o.useDefaults === "empty" && (c = (0, Ur._)`${c} || ${i} === null || ${i} === ""`), n.if(c, (0, Ur._)`${i} = ${(0, Ur.stringify)(r)}`);
}
var St = {}, le = {};
Object.defineProperty(le, "__esModule", { value: !0 });
le.validateUnion = le.validateArray = le.usePattern = le.callValidateCode = le.schemaProperties = le.allSchemaProperties = le.noPropertyInData = le.propertyInData = le.isOwnProperty = le.hasPropFunc = le.reportMissingProp = le.checkMissingProp = le.checkReportMissingProp = void 0;
const $e = ie, nc = z, Bt = Et, NE = z;
function PE(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(ac(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, $e._)`${e}` }, !0), t.error();
  });
}
le.checkReportMissingProp = PE;
function TE({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, $e.or)(...n.map((a) => (0, $e.and)(ac(t, e, a, r.ownProperties), (0, $e._)`${s} = ${a}`)));
}
le.checkMissingProp = TE;
function OE(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
le.reportMissingProp = OE;
function wp(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, $e._)`Object.prototype.hasOwnProperty`
  });
}
le.hasPropFunc = wp;
function sc(t, e, r) {
  return (0, $e._)`${wp(t)}.call(${e}, ${r})`;
}
le.isOwnProperty = sc;
function RE(t, e, r, n) {
  const s = (0, $e._)`${e}${(0, $e.getProperty)(r)} !== undefined`;
  return n ? (0, $e._)`${s} && ${sc(t, e, r)}` : s;
}
le.propertyInData = RE;
function ac(t, e, r, n) {
  const s = (0, $e._)`${e}${(0, $e.getProperty)(r)} === undefined`;
  return n ? (0, $e.or)(s, (0, $e.not)(sc(t, e, r))) : s;
}
le.noPropertyInData = ac;
function bp(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
le.allSchemaProperties = bp;
function IE(t, e) {
  return bp(e).filter((r) => !(0, nc.alwaysValidSchema)(t, e[r]));
}
le.schemaProperties = IE;
function jE({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, d) {
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
le.callValidateCode = jE;
const CE = (0, $e._)`new RegExp`;
function AE({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, $e._)`${s.code === "new RegExp" ? CE : (0, NE.useFunc)(t, s)}(${r}, ${n})`
  });
}
le.usePattern = AE;
function kE(t) {
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
        dataPropType: nc.Type.Num
      }, a), e.if((0, $e.not)(a), i);
    });
  }
}
le.validateArray = kE;
function LE(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, nc.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
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
le.validateUnion = LE;
Object.defineProperty(St, "__esModule", { value: !0 });
St.validateKeywordUsage = St.validSchemaType = St.funcKeywordCode = St.macroKeywordCode = void 0;
const Ke = ie, br = Et, DE = le, ME = ss;
function VE(t, e) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = t, i = e.macro.call(o.self, s, a, o), c = Sp(r, n, i);
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
St.macroKeywordCode = VE;
function FE(t, e) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: i, it: c } = t;
  zE(c, e);
  const d = !i && e.compile ? e.compile.call(c.self, a, o, c) : e.validate, l = Sp(n, s, d), h = n.let("valid");
  t.block$data(h, _), t.ok((r = e.valid) !== null && r !== void 0 ? r : h);
  function _() {
    if (e.errors === !1)
      v(), e.modifying && Jl(t), g(() => t.error());
    else {
      const m = e.async ? $() : w();
      e.modifying && Jl(t), g(() => qE(t, m));
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
    const b = c.opts.passContext ? br.default.this : br.default.self, T = !("compile" in e && !i || e.schema === !1);
    n.assign(h, (0, Ke._)`${m}${(0, DE.callValidateCode)(t, l, b, T)}`, e.modifying);
  }
  function g(m) {
    var b;
    n.if((0, Ke.not)((b = e.valid) !== null && b !== void 0 ? b : h), m);
  }
}
St.funcKeywordCode = FE;
function Jl(t) {
  const { gen: e, data: r, it: n } = t;
  e.if(n.parentData, () => e.assign(r, (0, Ke._)`${n.parentData}[${n.parentDataProperty}]`));
}
function qE(t, e) {
  const { gen: r } = t;
  r.if((0, Ke._)`Array.isArray(${e})`, () => {
    r.assign(br.default.vErrors, (0, Ke._)`${br.default.vErrors} === null ? ${e} : ${br.default.vErrors}.concat(${e})`).assign(br.default.errors, (0, Ke._)`${br.default.vErrors}.length`), (0, ME.extendErrors)(t);
  }, () => t.error());
}
function zE({ schemaEnv: t }, e) {
  if (e.async && !t.$async)
    throw new Error("async keyword in sync schema");
}
function Sp(t, e, r) {
  if (r === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return t.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ke.stringify)(r) });
}
function UE(t, e, r = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(t) : n === "object" ? t && typeof t == "object" && !Array.isArray(t) : typeof t == n || r && typeof t > "u");
}
St.validSchemaType = UE;
function BE({ schema: t, opts: e, self: r, errSchemaPath: n }, s, a) {
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
St.validateKeywordUsage = BE;
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.extendSubschemaMode = Zt.extendSubschemaData = Zt.getSubschema = void 0;
const wt = ie, Ep = z;
function KE(t, { keyword: e, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
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
      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, Ep.escapeFragment)(r)}`
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
Zt.getSubschema = KE;
function QE(t, e, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: i } = e;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = e, _ = i.let("data", (0, wt._)`${e.data}${(0, wt.getProperty)(r)}`, !0);
    c(_), t.errorPath = (0, wt.str)`${d}${(0, Ep.getErrorPath)(r, n, h.jsPropertySyntax)}`, t.parentDataProperty = (0, wt._)`${r}`, t.dataPathArr = [...l, t.parentDataProperty];
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
Zt.extendSubschemaData = QE;
function GE(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (t.compositeRule = n), s !== void 0 && (t.createErrors = s), a !== void 0 && (t.allErrors = a), t.jtdDiscriminator = e, t.jtdMetadata = r;
}
Zt.extendSubschemaMode = GE;
var Ce = {}, Np = { exports: {} }, Wt = Np.exports = function(t, e, r) {
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
            Ms(t, e, r, h[$], s + "/" + l + "/" + xE($), a, s, l, n, $);
      } else (l in Wt.keywords || t.allKeys && !(l in Wt.skipKeywords)) && Ms(t, e, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, i, c, d);
  }
}
function xE(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var HE = Np.exports;
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.getSchemaRefs = Ce.resolveUrl = Ce.normalizeId = Ce._getFullPath = Ce.getFullPath = Ce.inlineRef = void 0;
const JE = z, WE = fa, XE = HE, YE = /* @__PURE__ */ new Set([
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
function ZE(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !wo(t) : e ? Pp(t) <= e : !1;
}
Ce.inlineRef = ZE;
const e1 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function wo(t) {
  for (const e in t) {
    if (e1.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(wo) || typeof r == "object" && wo(r))
      return !0;
  }
  return !1;
}
function Pp(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !YE.has(r) && (typeof t[r] == "object" && (0, JE.eachItem)(t[r], (n) => e += Pp(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function Tp(t, e = "", r) {
  r !== !1 && (e = nn(e));
  const n = t.parse(e);
  return Op(t, n);
}
Ce.getFullPath = Tp;
function Op(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
Ce._getFullPath = Op;
const t1 = /#\/?$/;
function nn(t) {
  return t ? t.replace(t1, "") : "";
}
Ce.normalizeId = nn;
function r1(t, e, r) {
  return r = nn(r), t.resolve(e, r);
}
Ce.resolveUrl = r1;
const n1 = /^[a-z_][-a-z0-9._]*$/i;
function s1(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = nn(t[r] || e), a = { "": s }, o = Tp(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return XE(t, { allKeys: !0 }, (h, _, $, w) => {
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
        if (!n1.test(T))
          throw new Error(`invalid anchor "${T}"`);
        m.call(this, `#${T}`);
      }
    }
  }), i;
  function d(h, _, $) {
    if (_ !== void 0 && !WE(h, _))
      throw l($);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ce.getSchemaRefs = s1;
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.getData = yt.KeywordCxt = yt.validateFunctionCode = void 0;
const Rp = un, Wl = Pe, oc = At, Ws = Pe, a1 = va, Un = St, Qa = Zt, J = ie, re = Et, o1 = Ce, kt = z, Rn = ss;
function i1(t) {
  if (Cp(t) && (Ap(t), jp(t))) {
    u1(t);
    return;
  }
  Ip(t, () => (0, Rp.topBoolOrEmptySchema)(t));
}
yt.validateFunctionCode = i1;
function Ip({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? t.func(e, (0, J._)`${re.default.data}, ${re.default.valCxt}`, n.$async, () => {
    t.code((0, J._)`"use strict"; ${Xl(r, s)}`), l1(t, s), t.code(a);
  }) : t.func(e, (0, J._)`${re.default.data}, ${c1(s)}`, n.$async, () => t.code(Xl(r, s)).code(a));
}
function c1(t) {
  return (0, J._)`{${re.default.instancePath}="", ${re.default.parentData}, ${re.default.parentDataProperty}, ${re.default.rootData}=${re.default.data}${t.dynamicRef ? (0, J._)`, ${re.default.dynamicAnchors}={}` : J.nil}}={}`;
}
function l1(t, e) {
  t.if(re.default.valCxt, () => {
    t.var(re.default.instancePath, (0, J._)`${re.default.valCxt}.${re.default.instancePath}`), t.var(re.default.parentData, (0, J._)`${re.default.valCxt}.${re.default.parentData}`), t.var(re.default.parentDataProperty, (0, J._)`${re.default.valCxt}.${re.default.parentDataProperty}`), t.var(re.default.rootData, (0, J._)`${re.default.valCxt}.${re.default.rootData}`), e.dynamicRef && t.var(re.default.dynamicAnchors, (0, J._)`${re.default.valCxt}.${re.default.dynamicAnchors}`);
  }, () => {
    t.var(re.default.instancePath, (0, J._)`""`), t.var(re.default.parentData, (0, J._)`undefined`), t.var(re.default.parentDataProperty, (0, J._)`undefined`), t.var(re.default.rootData, re.default.data), e.dynamicRef && t.var(re.default.dynamicAnchors, (0, J._)`{}`);
  });
}
function u1(t) {
  const { schema: e, opts: r, gen: n } = t;
  Ip(t, () => {
    r.$comment && e.$comment && Lp(t), p1(t), n.let(re.default.vErrors, null), n.let(re.default.errors, 0), r.unevaluated && d1(t), kp(t), g1(t);
  });
}
function d1(t) {
  const { gen: e, validateName: r } = t;
  t.evaluated = e.const("evaluated", (0, J._)`${r}.evaluated`), e.if((0, J._)`${t.evaluated}.dynamicProps`, () => e.assign((0, J._)`${t.evaluated}.props`, (0, J._)`undefined`)), e.if((0, J._)`${t.evaluated}.dynamicItems`, () => e.assign((0, J._)`${t.evaluated}.items`, (0, J._)`undefined`));
}
function Xl(t, e) {
  const r = typeof t == "object" && t[e.schemaId];
  return r && (e.code.source || e.code.process) ? (0, J._)`/*# sourceURL=${r} */` : J.nil;
}
function f1(t, e) {
  if (Cp(t) && (Ap(t), jp(t))) {
    h1(t, e);
    return;
  }
  (0, Rp.boolOrEmptySchema)(t, e);
}
function jp({ schema: t, self: e }) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e.RULES.all[r])
      return !0;
  return !1;
}
function Cp(t) {
  return typeof t.schema != "boolean";
}
function h1(t, e) {
  const { schema: r, gen: n, opts: s } = t;
  s.$comment && r.$comment && Lp(t), y1(t), $1(t);
  const a = n.const("_errs", re.default.errors);
  kp(t, a), n.var(e, (0, J._)`${a} === ${re.default.errors}`);
}
function Ap(t) {
  (0, kt.checkUnknownRules)(t), m1(t);
}
function kp(t, e) {
  if (t.opts.jtd)
    return Yl(t, [], !1, e);
  const r = (0, Wl.getSchemaTypes)(t.schema), n = (0, Wl.coerceAndCheckDataType)(t, r);
  Yl(t, r, !n, e);
}
function m1(t) {
  const { schema: e, errSchemaPath: r, opts: n, self: s } = t;
  e.$ref && n.ignoreKeywordsWithRef && (0, kt.schemaHasRulesButRef)(e, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function p1(t) {
  const { schema: e, opts: r } = t;
  e.default !== void 0 && r.useDefaults && r.strictSchema && (0, kt.checkStrictMode)(t, "default is ignored in the schema root");
}
function y1(t) {
  const e = t.schema[t.opts.schemaId];
  e && (t.baseId = (0, o1.resolveUrl)(t.opts.uriResolver, t.baseId, e));
}
function $1(t) {
  if (t.schema.$async && !t.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Lp({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    t.code((0, J._)`${re.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, J.str)`${n}/$comment`, i = t.scopeValue("root", { ref: e.root });
    t.code((0, J._)`${re.default.self}.opts.$comment(${a}, ${o}, ${i}.schema)`);
  }
}
function g1(t) {
  const { gen: e, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = t;
  r.$async ? e.if((0, J._)`${re.default.errors} === 0`, () => e.return(re.default.data), () => e.throw((0, J._)`new ${s}(${re.default.vErrors})`)) : (e.assign((0, J._)`${n}.errors`, re.default.vErrors), a.unevaluated && v1(t), e.return((0, J._)`${re.default.errors} === 0`));
}
function v1({ gen: t, evaluated: e, props: r, items: n }) {
  r instanceof J.Name && t.assign((0, J._)`${e}.props`, r), n instanceof J.Name && t.assign((0, J._)`${e}.items`, n);
}
function Yl(t, e, r, n) {
  const { gen: s, schema: a, data: o, allErrors: i, opts: c, self: d } = t, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, kt.schemaHasRulesButRef)(a, l))) {
    s.block(() => Vp(t, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || _1(t, e), s.block(() => {
    for (const _ of l.rules)
      h(_);
    h(l.post);
  });
  function h(_) {
    (0, oc.shouldUseGroup)(a, _) && (_.type ? (s.if((0, Ws.checkDataType)(_.type, o, c.strictNumbers)), Zl(t, _), e.length === 1 && e[0] === _.type && r && (s.else(), (0, Ws.reportTypeError)(t)), s.endIf()) : Zl(t, _), i || s.if((0, J._)`${re.default.errors} === ${n || 0}`));
  }
}
function Zl(t, e) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = t;
  s && (0, a1.assignDefaults)(t, e.type), r.block(() => {
    for (const a of e.rules)
      (0, oc.shouldUseRule)(n, a) && Vp(t, a.keyword, a.definition, e.type);
  });
}
function _1(t, e) {
  t.schemaEnv.meta || !t.opts.strictTypes || (w1(t, e), t.opts.allowUnionTypes || b1(t, e), S1(t, t.dataTypes));
}
function w1(t, e) {
  if (e.length) {
    if (!t.dataTypes.length) {
      t.dataTypes = e;
      return;
    }
    e.forEach((r) => {
      Dp(t.dataTypes, r) || ic(t, `type "${r}" not allowed by context "${t.dataTypes.join(",")}"`);
    }), N1(t, e);
  }
}
function b1(t, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && ic(t, "use allowUnionTypes to allow union type keyword");
}
function S1(t, e) {
  const r = t.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, oc.shouldUseRule)(t.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => E1(e, o)) && ic(t, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function E1(t, e) {
  return t.includes(e) || e === "number" && t.includes("integer");
}
function Dp(t, e) {
  return t.includes(e) || e === "integer" && t.includes("number");
}
function N1(t, e) {
  const r = [];
  for (const n of t.dataTypes)
    Dp(e, n) ? r.push(n) : e.includes("integer") && n === "number" && r.push("integer");
  t.dataTypes = r;
}
function ic(t, e) {
  const r = t.schemaEnv.baseId + t.errSchemaPath;
  e += ` at "${r}" (strictTypes)`, (0, kt.checkStrictMode)(t, e, t.opts.strictTypes);
}
class Mp {
  constructor(e, r, n) {
    if ((0, Un.validateKeywordUsage)(e, r, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, kt.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = r, this.$data)
      this.schemaCode = e.gen.const("vSchema", Fp(this.$data, e));
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
    return f1(s, r), s;
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
yt.KeywordCxt = Mp;
function Vp(t, e, r, n) {
  const s = new Mp(t, r, e);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Un.funcKeywordCode)(s, r) : "macro" in r ? (0, Un.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Un.funcKeywordCode)(s, r);
}
const P1 = /^\/(?:[^~]|~0|~1)*$/, T1 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Fp(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (t === "")
    return re.default.rootData;
  if (t[0] === "/") {
    if (!P1.test(t))
      throw new Error(`Invalid JSON-pointer: ${t}`);
    s = t, a = re.default.rootData;
  } else {
    const d = T1.exec(t);
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
yt.getData = Fp;
var as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
class O1 extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
as.default = O1;
var vn = {};
Object.defineProperty(vn, "__esModule", { value: !0 });
const Ga = Ce;
class R1 extends Error {
  constructor(e, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ga.resolveUrl)(e, r, n), this.missingSchema = (0, Ga.normalizeId)((0, Ga.getFullPath)(e, this.missingRef));
  }
}
vn.default = R1;
var Xe = {};
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.resolveSchema = Xe.getCompilingSchema = Xe.resolveRef = Xe.compileSchema = Xe.SchemaEnv = void 0;
const lt = ie, I1 = as, $r = Et, mt = Ce, eu = z, j1 = yt;
class _a {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, mt.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Xe.SchemaEnv = _a;
function cc(t) {
  const e = qp.call(this, t);
  if (e)
    return e;
  const r = (0, mt.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new lt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: I1.default,
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
    this._compilations.add(t), (0, j1.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
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
Xe.compileSchema = cc;
function C1(t, e, r) {
  var n;
  r = (0, mt.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = L1.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new _a({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = A1.call(this, a);
}
Xe.resolveRef = C1;
function A1(t) {
  return (0, mt.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : cc.call(this, t);
}
function qp(t) {
  for (const e of this._compilations)
    if (k1(e, t))
      return e;
}
Xe.getCompilingSchema = qp;
function k1(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function L1(t, e) {
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
    if (o.validate || cc.call(this, o), a === (0, mt.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, d = i[c];
      return d && (s = (0, mt.resolveUrl)(this.opts.uriResolver, s, d)), new _a({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return xa.call(this, r, o);
  }
}
Xe.resolveSchema = wa;
const D1 = /* @__PURE__ */ new Set([
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
    const c = r[(0, eu.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !D1.has(i) && d && (e = (0, mt.resolveUrl)(this.opts.uriResolver, e, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, eu.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, mt.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = wa.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new _a({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const M1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", V1 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", F1 = "object", q1 = [
  "$data"
], z1 = {
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
}, U1 = !1, B1 = {
  $id: M1,
  description: V1,
  type: F1,
  required: q1,
  properties: z1,
  additionalProperties: U1
};
var lc = {};
Object.defineProperty(lc, "__esModule", { value: !0 });
const zp = Wm;
zp.code = 'require("ajv/dist/runtime/uri").default';
lc.default = zp;
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
  const n = as, s = vn, a = Ir, o = Xe, i = ie, c = Ce, d = Pe, l = z, h = B1, _ = lc, $ = (P, p) => new RegExp(P, p);
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
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), I.call(this, g, p, "NOT SUPPORTED"), I.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ge.call(this), p.formats && X.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && de.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), D.call(this), p.validateFormats = u;
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
  function X() {
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
})(lp);
var uc = {}, dc = {}, fc = {};
Object.defineProperty(fc, "__esModule", { value: !0 });
const K1 = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
fc.default = K1;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.callRef = jr.getValidate = void 0;
const Q1 = vn, tu = le, Je = ie, Br = Et, ru = Xe, $s = z, G1 = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = ru.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new Q1.default(n.opts.uriResolver, s, r);
    if (l instanceof ru.SchemaEnv)
      return _(l);
    return $(l);
    function h() {
      if (a === d)
        return Vs(t, o, a, a.$async);
      const w = e.scopeValue("root", { ref: d });
      return Vs(t, (0, Je._)`${w}.validate`, d, d.$async);
    }
    function _(w) {
      const v = Up(t, w);
      Vs(t, v, w, w.$async);
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
function Up(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, Je._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
jr.getValidate = Up;
function Vs(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, d = c.passContext ? Br.default.this : Je.nil;
  n ? l() : h();
  function l() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Je._)`await ${(0, tu.callValidateCode)(t, e, d)}`), $(e), o || s.assign(w, !0);
    }, (v) => {
      s.if((0, Je._)`!(${v} instanceof ${a.ValidationError})`, () => s.throw(v)), _(v), o || s.assign(w, !1);
    }), t.ok(w);
  }
  function h() {
    t.result((0, tu.callValidateCode)(t, e, d), () => $(e), () => _(e));
  }
  function _(w) {
    const v = (0, Je._)`${w}.errors`;
    s.assign(Br.default.vErrors, (0, Je._)`${Br.default.vErrors} === null ? ${v} : ${Br.default.vErrors}.concat(${v})`), s.assign(Br.default.errors, (0, Je._)`${Br.default.vErrors}.length`);
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
        const m = s.var("props", (0, Je._)`${w}.evaluated.props`);
        a.props = $s.mergeEvaluated.props(s, m, a.props, Je.Name);
      }
    if (a.items !== !0)
      if (g && !g.dynamicItems)
        g.items !== void 0 && (a.items = $s.mergeEvaluated.items(s, g.items, a.items));
      else {
        const m = s.var("items", (0, Je._)`${w}.evaluated.items`);
        a.items = $s.mergeEvaluated.items(s, m, a.items, Je.Name);
      }
  }
}
jr.callRef = Vs;
jr.default = G1;
Object.defineProperty(dc, "__esModule", { value: !0 });
const x1 = fc, H1 = jr, J1 = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  x1.default,
  H1.default
];
dc.default = J1;
var hc = {}, mc = {};
Object.defineProperty(mc, "__esModule", { value: !0 });
const Xs = ie, Kt = Xs.operators, Ys = {
  maximum: { okStr: "<=", ok: Kt.LTE, fail: Kt.GT },
  minimum: { okStr: ">=", ok: Kt.GTE, fail: Kt.LT },
  exclusiveMaximum: { okStr: "<", ok: Kt.LT, fail: Kt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Kt.GT, fail: Kt.LTE }
}, W1 = {
  message: ({ keyword: t, schemaCode: e }) => (0, Xs.str)`must be ${Ys[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, Xs._)`{comparison: ${Ys[t].okStr}, limit: ${e}}`
}, X1 = {
  keyword: Object.keys(Ys),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: W1,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, Xs._)`${r} ${Ys[e].fail} ${n} || isNaN(${r})`);
  }
};
mc.default = X1;
var pc = {};
Object.defineProperty(pc, "__esModule", { value: !0 });
const Bn = ie, Y1 = {
  message: ({ schemaCode: t }) => (0, Bn.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, Bn._)`{multipleOf: ${t}}`
}, Z1 = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Y1,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, Bn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Bn._)`${o} !== parseInt(${o})`;
    t.fail$data((0, Bn._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
pc.default = Z1;
var yc = {}, $c = {};
Object.defineProperty($c, "__esModule", { value: !0 });
function Bp(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
$c.default = Bp;
Bp.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(yc, "__esModule", { value: !0 });
const Sr = ie, eN = z, tN = $c, rN = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, Sr.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, Sr._)`{limit: ${t}}`
}, nN = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: rN,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? Sr.operators.GT : Sr.operators.LT, o = s.opts.unicode === !1 ? (0, Sr._)`${r}.length` : (0, Sr._)`${(0, eN.useFunc)(t.gen, tN.default)}(${r})`;
    t.fail$data((0, Sr._)`${o} ${a} ${n}`);
  }
};
yc.default = nN;
var gc = {};
Object.defineProperty(gc, "__esModule", { value: !0 });
const sN = le, aN = z, Yr = ie, oN = {
  message: ({ schemaCode: t }) => (0, Yr.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, Yr._)`{pattern: ${t}}`
}, iN = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: oN,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t, i = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Yr._)`new RegExp` : (0, aN.useFunc)(e, c), l = e.let("valid");
      e.try(() => e.assign(l, (0, Yr._)`${d}(${a}, ${i}).test(${r})`), () => e.assign(l, !1)), t.fail$data((0, Yr._)`!${l}`);
    } else {
      const c = (0, sN.usePattern)(t, s);
      t.fail$data((0, Yr._)`!${c}.test(${r})`);
    }
  }
};
gc.default = iN;
var vc = {};
Object.defineProperty(vc, "__esModule", { value: !0 });
const Kn = ie, cN = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, Kn.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, Kn._)`{limit: ${t}}`
}, lN = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: cN,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? Kn.operators.GT : Kn.operators.LT;
    t.fail$data((0, Kn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
vc.default = lN;
var _c = {};
Object.defineProperty(_c, "__esModule", { value: !0 });
const In = le, Qn = ie, uN = z, dN = {
  message: ({ params: { missingProperty: t } }) => (0, Qn.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, Qn._)`{missingProperty: ${t}}`
}, fN = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: dN,
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
          (0, uN.checkStrictMode)(o, m, o.opts.strictRequired);
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
_c.default = fN;
var wc = {};
Object.defineProperty(wc, "__esModule", { value: !0 });
const Gn = ie, hN = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, Gn.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, Gn._)`{limit: ${t}}`
}, mN = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: hN,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? Gn.operators.GT : Gn.operators.LT;
    t.fail$data((0, Gn._)`${r}.length ${s} ${n}`);
  }
};
wc.default = mN;
var bc = {}, os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
const Kp = fa;
Kp.code = 'require("ajv/dist/runtime/equal").default';
os.default = Kp;
Object.defineProperty(bc, "__esModule", { value: !0 });
const Ha = Pe, Ie = ie, pN = z, yN = os, $N = {
  message: ({ params: { i: t, j: e } }) => (0, Ie.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, Ie._)`{i: ${t}, j: ${e}}`
}, gN = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: $N,
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
      const g = (0, pN.useFunc)(e, yN.default), m = e.name("outer");
      e.label(m).for((0, Ie._)`;${w}--;`, () => e.for((0, Ie._)`${v} = ${w}; ${v}--;`, () => e.if((0, Ie._)`${g}(${r}[${w}], ${r}[${v}])`, () => {
        t.error(), e.assign(c, !1).break(m);
      })));
    }
  }
};
bc.default = gN;
var Sc = {};
Object.defineProperty(Sc, "__esModule", { value: !0 });
const bo = ie, vN = z, _N = os, wN = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, bo._)`{allowedValue: ${t}}`
}, bN = {
  keyword: "const",
  $data: !0,
  error: wN,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, bo._)`!${(0, vN.useFunc)(e, _N.default)}(${r}, ${s})`) : t.fail((0, bo._)`${a} !== ${r}`);
  }
};
Sc.default = bN;
var Ec = {};
Object.defineProperty(Ec, "__esModule", { value: !0 });
const kn = ie, SN = z, EN = os, NN = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, kn._)`{allowedValues: ${t}}`
}, PN = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: NN,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, SN.useFunc)(e, EN.default));
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
Ec.default = PN;
Object.defineProperty(hc, "__esModule", { value: !0 });
const TN = mc, ON = pc, RN = yc, IN = gc, jN = vc, CN = _c, AN = wc, kN = bc, LN = Sc, DN = Ec, MN = [
  // number
  TN.default,
  ON.default,
  // string
  RN.default,
  IN.default,
  // object
  jN.default,
  CN.default,
  // array
  AN.default,
  kN.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  LN.default,
  DN.default
];
hc.default = MN;
var Nc = {}, _n = {};
Object.defineProperty(_n, "__esModule", { value: !0 });
_n.validateAdditionalItems = void 0;
const Er = ie, So = z, VN = {
  message: ({ params: { len: t } }) => (0, Er.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, Er._)`{limit: ${t}}`
}, FN = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: VN,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, So.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Qp(t, n);
  }
};
function Qp(t, e) {
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
_n.validateAdditionalItems = Qp;
_n.default = FN;
var Pc = {}, wn = {};
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.validateTuple = void 0;
const nu = ie, Fs = z, qN = le, zN = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return Gp(t, "additionalItems", e);
    r.items = !0, !(0, Fs.alwaysValidSchema)(r, e) && t.ok((0, qN.validateArray)(t));
  }
};
function Gp(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  l(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = Fs.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), d = n.const("len", (0, nu._)`${a}.length`);
  r.forEach((h, _) => {
    (0, Fs.alwaysValidSchema)(i, h) || (n.if((0, nu._)`${d} > ${_}`, () => t.subschema({
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
wn.validateTuple = Gp;
wn.default = zN;
Object.defineProperty(Pc, "__esModule", { value: !0 });
const UN = wn, BN = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, UN.validateTuple)(t, "items")
};
Pc.default = BN;
var Tc = {};
Object.defineProperty(Tc, "__esModule", { value: !0 });
const su = ie, KN = z, QN = le, GN = _n, xN = {
  message: ({ params: { len: t } }) => (0, su.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, su._)`{limit: ${t}}`
}, HN = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: xN,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, KN.alwaysValidSchema)(n, e) && (s ? (0, GN.validateAdditionalItems)(t, s) : t.ok((0, QN.validateArray)(t)));
  }
};
Tc.default = HN;
var Oc = {};
Object.defineProperty(Oc, "__esModule", { value: !0 });
const at = ie, gs = z, JN = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, at.str)`must contain at least ${t} valid item(s)` : (0, at.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, at._)`{minContains: ${t}}` : (0, at._)`{minContains: ${t}, maxContains: ${e}}`
}, WN = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: JN,
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
Oc.default = WN;
var xp = {};
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
})(xp);
var Rc = {};
Object.defineProperty(Rc, "__esModule", { value: !0 });
const Hp = ie, XN = z, YN = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, Hp._)`{propertyName: ${t.propertyName}}`
}, ZN = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: YN,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, XN.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, Hp.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
Rc.default = ZN;
var ba = {};
Object.defineProperty(ba, "__esModule", { value: !0 });
const vs = le, dt = ie, eP = Et, _s = z, tP = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, dt._)`{additionalProperty: ${t.additionalProperty}}`
}, rP = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: tP,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, _s.alwaysValidSchema)(o, r))
      return;
    const d = (0, vs.allSchemaProperties)(n.properties), l = (0, vs.allSchemaProperties)(n.patternProperties);
    h(), t.ok((0, dt._)`${a} === ${eP.default.errors}`);
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
ba.default = rP;
var Ic = {};
Object.defineProperty(Ic, "__esModule", { value: !0 });
const nP = yt, au = le, Ja = z, ou = ba, sP = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && ou.default.code(new nP.KeywordCxt(a, ou.default, "additionalProperties"));
    const o = (0, au.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Ja.mergeEvaluated.props(e, (0, Ja.toHash)(o), a.props));
    const i = o.filter((h) => !(0, Ja.alwaysValidSchema)(a, r[h]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const h of i)
      d(h) ? l(h) : (e.if((0, au.propertyInData)(e, s, h, a.opts.ownProperties)), l(h), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(h), t.ok(c);
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
Ic.default = sP;
var jc = {};
Object.defineProperty(jc, "__esModule", { value: !0 });
const iu = le, ws = ie, cu = z, lu = z, aP = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, iu.allSchemaProperties)(r), c = i.filter((v) => (0, cu.alwaysValidSchema)(a, r[v]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = e.name("valid");
    a.props !== !0 && !(a.props instanceof ws.Name) && (a.props = (0, lu.evaluatedPropsToName)(e, a.props));
    const { props: h } = a;
    _();
    function _() {
      for (const v of i)
        d && $(v), a.allErrors ? w(v) : (e.var(l, !0), w(v), e.if(l));
    }
    function $(v) {
      for (const g in d)
        new RegExp(v).test(g) && (0, cu.checkStrictMode)(a, `property ${g} matches pattern ${v} (use allowMatchingProperties)`);
    }
    function w(v) {
      e.forIn("key", n, (g) => {
        e.if((0, ws._)`${(0, iu.usePattern)(t, v)}.test(${g})`, () => {
          const m = c.includes(v);
          m || t.subschema({
            keyword: "patternProperties",
            schemaProp: v,
            dataProp: g,
            dataPropType: lu.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? e.assign((0, ws._)`${h}[${g}]`, !0) : !m && !a.allErrors && e.if((0, ws.not)(l), () => e.break());
        });
      });
    }
  }
};
jc.default = aP;
var Cc = {};
Object.defineProperty(Cc, "__esModule", { value: !0 });
const oP = z, iP = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, oP.alwaysValidSchema)(n, r)) {
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
Cc.default = iP;
var Ac = {};
Object.defineProperty(Ac, "__esModule", { value: !0 });
const cP = le, lP = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: cP.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Ac.default = lP;
var kc = {};
Object.defineProperty(kc, "__esModule", { value: !0 });
const qs = ie, uP = z, dP = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, qs._)`{passingSchemas: ${t.passing}}`
}, fP = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: dP,
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
        (0, uP.alwaysValidSchema)(s, l) ? e.var(c, !0) : _ = t.subschema({
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
kc.default = fP;
var Lc = {};
Object.defineProperty(Lc, "__esModule", { value: !0 });
const hP = z, mP = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, hP.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
Lc.default = mP;
var Dc = {};
Object.defineProperty(Dc, "__esModule", { value: !0 });
const Zs = ie, Jp = z, pP = {
  message: ({ params: t }) => (0, Zs.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, Zs._)`{failingKeyword: ${t.ifClause}}`
}, yP = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: pP,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, Jp.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = uu(n, "then"), a = uu(n, "else");
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
function uu(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, Jp.alwaysValidSchema)(t, r);
}
Dc.default = yP;
var Mc = {};
Object.defineProperty(Mc, "__esModule", { value: !0 });
const $P = z, gP = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, $P.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
Mc.default = gP;
Object.defineProperty(Nc, "__esModule", { value: !0 });
const vP = _n, _P = Pc, wP = wn, bP = Tc, SP = Oc, EP = xp, NP = Rc, PP = ba, TP = Ic, OP = jc, RP = Cc, IP = Ac, jP = kc, CP = Lc, AP = Dc, kP = Mc;
function LP(t = !1) {
  const e = [
    // any
    RP.default,
    IP.default,
    jP.default,
    CP.default,
    AP.default,
    kP.default,
    // object
    NP.default,
    PP.default,
    EP.default,
    TP.default,
    OP.default
  ];
  return t ? e.push(_P.default, bP.default) : e.push(vP.default, wP.default), e.push(SP.default), e;
}
Nc.default = LP;
var Vc = {}, Fc = {};
Object.defineProperty(Fc, "__esModule", { value: !0 });
const be = ie, DP = {
  message: ({ schemaCode: t }) => (0, be.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, be._)`{format: ${t}}`
}, MP = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: DP,
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
Fc.default = MP;
Object.defineProperty(Vc, "__esModule", { value: !0 });
const VP = Fc, FP = [VP.default];
Vc.default = FP;
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
Object.defineProperty(uc, "__esModule", { value: !0 });
const qP = dc, zP = hc, UP = Nc, BP = Vc, du = dn, KP = [
  qP.default,
  zP.default,
  (0, UP.default)(),
  BP.default,
  du.metadataVocabulary,
  du.contentVocabulary
];
uc.default = KP;
var qc = {}, Sa = {};
Object.defineProperty(Sa, "__esModule", { value: !0 });
Sa.DiscrError = void 0;
var fu;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(fu || (Sa.DiscrError = fu = {}));
Object.defineProperty(qc, "__esModule", { value: !0 });
const xr = ie, Eo = Sa, hu = Xe, QP = vn, GP = z, xP = {
  message: ({ params: { discrError: t, tagName: e } }) => t === Eo.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, xr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, HP = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: xP,
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
        if (I != null && I.$ref && !(0, GP.schemaHasRulesButRef)(I, a.self.RULES)) {
          const D = I.$ref;
          if (I = hu.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, D), I instanceof hu.SchemaEnv && (I = I.schema), I === void 0)
            throw new QP.default(a.opts.uriResolver, a.baseId, D);
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
qc.default = HP;
const JP = "http://json-schema.org/draft-07/schema#", WP = "http://json-schema.org/draft-07/schema#", XP = "Core schema meta-schema", YP = {
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
}, ZP = [
  "object",
  "boolean"
], eT = {
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
}, tT = {
  $schema: JP,
  $id: WP,
  title: XP,
  definitions: YP,
  type: ZP,
  properties: eT,
  default: !0
};
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const r = lp, n = uc, s = qc, a = tT, o = ["/properties"], i = "http://json-schema.org/draft-07/schema";
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
var rT = $o.exports;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.formatLimitDefinition = void 0;
  const e = rT, r = ie, n = r.operators, s = {
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
})(cp);
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 });
  const r = ip, n = cp, s = ie, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), i = (d, l = { keywords: !0 }) => {
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
var nT = yo.exports;
const sT = /* @__PURE__ */ nm(nT), aT = (t, e, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(t, r), a = Object.getOwnPropertyDescriptor(e, r);
  !oT(s, a) && n || Object.defineProperty(t, r, a);
}, oT = function(t, e) {
  return t === void 0 || t.configurable || t.writable === e.writable && t.enumerable === e.enumerable && t.configurable === e.configurable && (t.writable || t.value === e.value);
}, iT = (t, e) => {
  const r = Object.getPrototypeOf(e);
  r !== Object.getPrototypeOf(t) && Object.setPrototypeOf(t, r);
}, cT = (t, e) => `/* Wrapped ${t}*/
${e}`, lT = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), uT = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), dT = (t, e, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = cT.bind(null, n, e.toString());
  Object.defineProperty(s, "name", uT);
  const { writable: a, enumerable: o, configurable: i } = lT;
  Object.defineProperty(t, "toString", { value: s, writable: a, enumerable: o, configurable: i });
};
function fT(t, e, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = t;
  for (const s of Reflect.ownKeys(e))
    aT(t, e, s, r);
  return iT(t, e), dT(t, e, n), t;
}
const mu = (t, e = {}) => {
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
  return fT(d, t), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), i && (clearTimeout(i), i = void 0);
  }, d;
};
var No = { exports: {} };
const hT = "2.0.0", Wp = 256, mT = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, pT = 16, yT = Wp - 6, $T = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var is = {
  MAX_LENGTH: Wp,
  MAX_SAFE_COMPONENT_LENGTH: pT,
  MAX_SAFE_BUILD_LENGTH: yT,
  MAX_SAFE_INTEGER: mT,
  RELEASE_TYPES: $T,
  SEMVER_SPEC_VERSION: hT,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const gT = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
};
var Ea = gT;
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
const vT = Object.freeze({ loose: !0 }), _T = Object.freeze({}), wT = (t) => t ? typeof t != "object" ? vT : t : _T;
var zc = wT;
const pu = /^[0-9]+$/, Xp = (t, e) => {
  if (typeof t == "number" && typeof e == "number")
    return t === e ? 0 : t < e ? -1 : 1;
  const r = pu.test(t), n = pu.test(e);
  return r && n && (t = +t, e = +e), t === e ? 0 : r && !n ? -1 : n && !r ? 1 : t < e ? -1 : 1;
}, bT = (t, e) => Xp(e, t);
var Yp = {
  compareIdentifiers: Xp,
  rcompareIdentifiers: bT
};
const bs = Ea, { MAX_LENGTH: yu, MAX_SAFE_INTEGER: Ss } = is, { safeRe: Es, t: Ns } = cs, ST = zc, { compareIdentifiers: Po } = Yp, ET = (t, e) => {
  const r = e.split(".");
  if (r.length > t.length)
    return !1;
  for (let n = 0; n < r.length; n++)
    if (Po(t[n], r[n]) !== 0)
      return !1;
  return !0;
};
let NT = class vt {
  constructor(e, r) {
    if (r = ST(r), e instanceof vt) {
      if (e.loose === !!r.loose && e.includePrerelease === !!r.includePrerelease)
        return e;
      e = e.version;
    } else if (typeof e != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);
    if (e.length > yu)
      throw new TypeError(
        `version is longer than ${yu} characters`
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
          if (n === !1 && (a = [r]), ET(this.prerelease, r)) {
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
var Ue = NT;
const $u = Ue, PT = (t, e, r = !1) => {
  if (t instanceof $u)
    return t;
  try {
    return new $u(t, e);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Mr = PT;
const TT = Mr, OT = (t, e) => {
  const r = TT(t, e);
  return r ? r.version : null;
};
var RT = OT;
const IT = Mr, jT = (t, e) => {
  const r = IT(t.trim().replace(/^[=v]+/, ""), e);
  return r ? r.version : null;
};
var CT = jT;
const gu = Ue, AT = (t, e, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new gu(
      t instanceof gu ? t.version : t,
      r
    ).inc(e, n, s).version;
  } catch {
    return null;
  }
};
var kT = AT;
const vu = Mr, LT = (t, e) => {
  const r = vu(t, null, !0), n = vu(e, null, !0), s = r.compare(n);
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
var DT = LT;
const MT = Ue, VT = (t, e) => new MT(t, e).major;
var FT = VT;
const qT = Ue, zT = (t, e) => new qT(t, e).minor;
var UT = zT;
const BT = Ue, KT = (t, e) => new BT(t, e).patch;
var QT = KT;
const GT = Mr, xT = (t, e) => {
  const r = GT(t, e);
  return r && r.prerelease.length ? r.prerelease : null;
};
var HT = xT;
const _u = Ue, JT = (t, e, r) => new _u(t, r).compare(new _u(e, r));
var $t = JT;
const WT = $t, XT = (t, e, r) => WT(e, t, r);
var YT = XT;
const ZT = $t, eO = (t, e) => ZT(t, e, !0);
var tO = eO;
const wu = Ue, rO = (t, e, r) => {
  const n = new wu(t, r), s = new wu(e, r);
  return n.compare(s) || n.compareBuild(s);
};
var Uc = rO;
const nO = Uc, sO = (t, e) => t.sort((r, n) => nO(r, n, e));
var aO = sO;
const oO = Uc, iO = (t, e) => t.sort((r, n) => oO(n, r, e));
var cO = iO;
const lO = $t, uO = (t, e, r) => lO(t, e, r) > 0;
var Na = uO;
const dO = $t, fO = (t, e, r) => dO(t, e, r) < 0;
var Bc = fO;
const hO = $t, mO = (t, e, r) => hO(t, e, r) === 0;
var Zp = mO;
const pO = $t, yO = (t, e, r) => pO(t, e, r) !== 0;
var ey = yO;
const $O = $t, gO = (t, e, r) => $O(t, e, r) >= 0;
var Kc = gO;
const vO = $t, _O = (t, e, r) => vO(t, e, r) <= 0;
var Qc = _O;
const wO = Zp, bO = ey, SO = Na, EO = Kc, NO = Bc, PO = Qc, TO = (t, e, r, n) => {
  switch (e) {
    case "===":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t === r;
    case "!==":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t !== r;
    case "":
    case "=":
    case "==":
      return wO(t, r, n);
    case "!=":
      return bO(t, r, n);
    case ">":
      return SO(t, r, n);
    case ">=":
      return EO(t, r, n);
    case "<":
      return NO(t, r, n);
    case "<=":
      return PO(t, r, n);
    default:
      throw new TypeError(`Invalid operator: ${e}`);
  }
};
var ty = TO;
const OO = Ue, RO = Mr, { safeRe: Ps, t: Ts } = cs, IO = (t, e) => {
  if (t instanceof OO)
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
  return RO(`${n}.${s}.${a}${o}${i}`, e);
};
var jO = IO;
const CO = Mr, AO = is, kO = Ue, LO = (t, e, r) => {
  if (!AO.RELEASE_TYPES.includes(e))
    return null;
  const n = DO(t, r);
  return n && MO(n, e);
}, DO = (t, e) => {
  const r = t instanceof kO ? t.version : t;
  return CO(r, e);
}, MO = (t, e) => {
  if (VO(e))
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
}, VO = (t) => t.startsWith("pre");
var FO = LO;
class qO {
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
var zO = qO, Wa, bu;
function gt() {
  if (bu) return Wa;
  bu = 1;
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
  const r = zO, n = new r(), s = zc, a = Pa(), o = Ea, i = Ue, {
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
  }, O = (M, L) => (M = M.replace(c[l.BUILD], ""), o("comp", M, L), M = de(M, L), o("caret", M), M = D(M, L), o("tildes", M), M = Q(M, L), o("xrange", M), M = ne(M, L), o("stars", M), M), I = (M) => !M || M.toLowerCase() === "x" || M === "*", q = (M, L, B) => I(M) && !I(L) || I(L) && B && !I(B), D = (M, L) => M.trim().split(/\s+/).map((B) => X(B, L)).join(" "), X = (M, L) => {
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
var Xa, Su;
function Pa() {
  if (Su) return Xa;
  Su = 1;
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
  const r = zc, { safeRe: n, t: s } = cs, a = ty, o = Ea, i = Ue, c = gt();
  return Xa;
}
const UO = gt(), BO = (t, e, r) => {
  try {
    e = new UO(e, r);
  } catch {
    return !1;
  }
  return e.test(t);
};
var Ta = BO;
const KO = gt(), QO = (t, e) => new KO(t, e).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var GO = QO;
const xO = Ue, HO = gt(), JO = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new HO(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new xO(n, r));
  }), n;
};
var WO = JO;
const XO = Ue, YO = gt(), ZO = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new YO(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new XO(n, r));
  }), n;
};
var eR = ZO;
const Ya = Ue, tR = gt(), Eu = Na, rR = (t, e) => {
  t = new tR(t, e);
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
          (!a || Eu(i, a)) && (a = i);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Eu(r, a)) && (r = a);
  }
  return r && t.test(r) ? r : null;
};
var nR = rR;
const sR = gt(), aR = (t, e) => {
  try {
    return new sR(t, e).range || "*";
  } catch {
    return null;
  }
};
var oR = aR;
const iR = Ue, ry = Pa(), { ANY: cR } = ry, lR = gt(), uR = Ta, Nu = Na, Pu = Bc, dR = Qc, fR = Kc, hR = (t, e, r, n) => {
  t = new iR(t, n), e = new lR(e, n);
  let s, a, o, i, c;
  switch (r) {
    case ">":
      s = Nu, a = dR, o = Pu, i = ">", c = ">=";
      break;
    case "<":
      s = Pu, a = fR, o = Nu, i = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (uR(t, e, n))
    return !1;
  for (let d = 0; d < e.set.length; ++d) {
    const l = e.set[d];
    let h = null, _ = null;
    if (l.forEach(($) => {
      $.semver === cR && ($ = new ry(">=0.0.0")), h = h || $, _ = _ || $, s($.semver, h.semver, n) ? h = $ : o($.semver, _.semver, n) && (_ = $);
    }), h.operator === i || h.operator === c || (!_.operator || _.operator === i) && a(t, _.semver))
      return !1;
    if (_.operator === c && o(t, _.semver))
      return !1;
  }
  return !0;
};
var Gc = hR;
const mR = Gc, pR = (t, e, r) => mR(t, e, ">", r);
var yR = pR;
const $R = Gc, gR = (t, e, r) => $R(t, e, "<", r);
var vR = gR;
const Tu = gt(), _R = (t, e, r) => (t = new Tu(t, r), e = new Tu(e, r), t.intersects(e, r));
var wR = _R;
const bR = Ta, SR = $t;
var ER = (t, e, r) => {
  const n = [];
  let s = null, a = null;
  const o = t.sort((l, h) => SR(l, h, r));
  for (const l of o)
    bR(l, e, r) ? (a = l, s || (s = l)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const i = [];
  for (const [l, h] of n)
    l === h ? i.push(l) : !h && l === o[0] ? i.push("*") : h ? l === o[0] ? i.push(`<=${h}`) : i.push(`${l} - ${h}`) : i.push(`>=${l}`);
  const c = i.join(" || "), d = typeof e.raw == "string" ? e.raw : String(e);
  return c.length < d.length ? c : e;
};
const Ou = gt(), xc = Pa(), { ANY: Za } = xc, eo = Ta, Hc = $t, NR = (t, e, r = {}) => {
  if (t === e)
    return !0;
  t = new Ou(t, r), e = new Ou(e, r);
  let n = !1;
  e: for (const s of t.set) {
    for (const a of e.set) {
      const o = TR(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, PR = [new xc(">=0.0.0-0")], Ru = [new xc(">=0.0.0")], TR = (t, e, r) => {
  if (t === e)
    return !0;
  if (t.length === 1 && t[0].semver === Za) {
    if (e.length === 1 && e[0].semver === Za)
      return !0;
    r.includePrerelease ? t = PR : t = Ru;
  }
  if (e.length === 1 && e[0].semver === Za) {
    if (r.includePrerelease)
      return !0;
    e = Ru;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const $ of t)
    $.operator === ">" || $.operator === ">=" ? s = Iu(s, $, r) : $.operator === "<" || $.operator === "<=" ? a = ju(a, $, r) : n.add($.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Hc(s.semver, a.semver, r), o > 0)
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
        if (i = Iu(s, $, r), i === $ && i !== s)
          return !1;
      } else if (s.operator === ">=" && !$.test(s.semver))
        return !1;
    }
    if (a) {
      if (h && $.semver.prerelease && $.semver.prerelease.length && $.semver.major === h.major && $.semver.minor === h.minor && $.semver.patch === h.patch && (h = !1), $.operator === "<" || $.operator === "<=") {
        if (c = ju(a, $, r), c === $ && c !== a)
          return !1;
      } else if (a.operator === "<=" && !$.test(a.semver))
        return !1;
    }
    if (!$.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && l && !s && o !== 0 || _ || h);
}, Iu = (t, e, r) => {
  if (!t)
    return e;
  const n = Hc(t.semver, e.semver, r);
  return n > 0 ? t : n < 0 || e.operator === ">" && t.operator === ">=" ? e : t;
}, ju = (t, e, r) => {
  if (!t)
    return e;
  const n = Hc(t.semver, e.semver, r);
  return n < 0 ? t : n > 0 || e.operator === "<" && t.operator === "<=" ? e : t;
};
var OR = NR;
const to = cs, Cu = is, RR = Ue, Au = Yp, IR = Mr, jR = RT, CR = CT, AR = kT, kR = DT, LR = FT, DR = UT, MR = QT, VR = HT, FR = $t, qR = YT, zR = tO, UR = Uc, BR = aO, KR = cO, QR = Na, GR = Bc, xR = Zp, HR = ey, JR = Kc, WR = Qc, XR = ty, YR = jO, ZR = FO, eI = Pa(), tI = gt(), rI = Ta, nI = GO, sI = WO, aI = eR, oI = nR, iI = oR, cI = Gc, lI = yR, uI = vR, dI = wR, fI = ER, hI = OR;
var mI = {
  parse: IR,
  valid: jR,
  clean: CR,
  inc: AR,
  diff: kR,
  major: LR,
  minor: DR,
  patch: MR,
  prerelease: VR,
  compare: FR,
  rcompare: qR,
  compareLoose: zR,
  compareBuild: UR,
  sort: BR,
  rsort: KR,
  gt: QR,
  lt: GR,
  eq: xR,
  neq: HR,
  gte: JR,
  lte: WR,
  cmp: XR,
  coerce: YR,
  truncate: ZR,
  Comparator: eI,
  Range: tI,
  satisfies: rI,
  toComparators: nI,
  maxSatisfying: sI,
  minSatisfying: aI,
  minVersion: oI,
  validRange: iI,
  outside: cI,
  gtr: lI,
  ltr: uI,
  intersects: dI,
  simplifyRange: fI,
  subset: hI,
  SemVer: RR,
  re: to.re,
  src: to.src,
  tokens: to.t,
  SEMVER_SPEC_VERSION: Cu.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Cu.RELEASE_TYPES,
  compareIdentifiers: Au.compareIdentifiers,
  rcompareIdentifiers: Au.rcompareIdentifiers
};
const Kr = /* @__PURE__ */ nm(mI), pI = Object.prototype.toString, yI = "[object Uint8Array]", $I = "[object ArrayBuffer]";
function ny(t, e, r) {
  return t ? t.constructor === e ? !0 : pI.call(t) === r : !1;
}
function sy(t) {
  return ny(t, Uint8Array, yI);
}
function gI(t) {
  return ny(t, ArrayBuffer, $I);
}
function vI(t) {
  return sy(t) || gI(t);
}
function _I(t) {
  if (!sy(t))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof t}\``);
}
function wI(t) {
  if (!vI(t))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof t}\``);
}
function ku(t, e) {
  if (t.length === 0)
    return new Uint8Array(0);
  e ?? (e = t.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(e);
  let n = 0;
  for (const s of t)
    _I(s), r.set(s, n), n += s.length;
  return r;
}
const Os = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Lu(t, e = "utf8") {
  return wI(t), Os[e] ?? (Os[e] = new globalThis.TextDecoder(e)), Os[e].decode(t);
}
function bI(t) {
  if (typeof t != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof t}\``);
}
const SI = new globalThis.TextEncoder();
function ro(t) {
  return bI(t), SI.encode(t);
}
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
const EI = sT.default, Du = "aes-256-cbc", Qr = () => /* @__PURE__ */ Object.create(null), NI = (t) => t != null, PI = (t, e) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof e;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${t}\` is not allowed as it's not supported by JSON`);
}, zs = "__internal__", no = `${zs}.migrations.version`;
var Ht, Tt, tt, Ot;
class TI {
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
      r.cwd = I$(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (Nn(this, tt, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const o = new KS.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      EI(o);
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
    this.path = Y.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, a = Object.assign(Qr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      w$.deepEqual(s, a);
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
      PI(a, o), ve(this, tt).accessPropertiesByDotNotation ? fl(n, a, o) : n[a] = o;
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
    return ve(this, tt).accessPropertiesByDotNotation ? P$(this.store, e) : e in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...e) {
    for (const r of e)
      NI(ve(this, Ot)[r]) && this.set(r, ve(this, Ot)[r]);
  }
  delete(e) {
    const { store: r } = this;
    ve(this, tt).accessPropertiesByDotNotation ? N$(r, e) : delete r[e], this.store = r;
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
      const e = Z.readFileSync(this.path, ve(this, Tt) ? null : "utf8"), r = this._encryptData(e), n = this._deserialize(r);
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
      return typeof e == "string" ? e : Lu(e);
    try {
      const r = e.slice(0, 16), n = Pn.pbkdf2Sync(ve(this, Tt), r.toString(), 1e4, 32, "sha512"), s = Pn.createDecipheriv(Du, n, r), a = e.slice(17), o = typeof a == "string" ? ro(a) : a;
      return Lu(ku([s.update(o), s.final()]));
    } catch {
    }
    return e.toString();
  }
  _handleChange(e, r) {
    let n = e();
    const s = () => {
      const a = n, o = e();
      _$(o, a) || (n = o, r.call(this, o, a));
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
    Z.mkdirSync(Y.dirname(this.path), { recursive: !0 });
  }
  _write(e) {
    let r = this._serialize(e);
    if (ve(this, Tt)) {
      const n = Pn.randomBytes(16), s = Pn.pbkdf2Sync(ve(this, Tt), n.toString(), 1e4, 32, "sha512"), a = Pn.createCipheriv(Du, s, n);
      r = ku([n, ro(":"), a.update(ro(r)), a.final()]);
    }
    if (_e.env.SNAP)
      Z.writeFileSync(this.path, r, { mode: ve(this, tt).configFileMode });
    else
      try {
        rm(this.path, r, { mode: ve(this, tt).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          Z.writeFileSync(this.path, r, { mode: ve(this, tt).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), Z.existsSync(this.path) || this._write(Qr()), _e.platform === "win32" ? Z.watch(this.path, { persistent: !1 }, mu(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : Z.watchFile(this.path, { persistent: !1 }, mu(() => {
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
    return E$(this.store, e, r);
  }
  _set(e, r) {
    const { store: n } = this;
    fl(n, e, r), this.store = n;
  }
}
Ht = new WeakMap(), Tt = new WeakMap(), tt = new WeakMap(), Ot = new WeakMap();
const { app: Us, ipcMain: To, shell: OI } = Yh;
let Mu = !1;
const Vu = () => {
  if (!To || !Us)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const t = {
    defaultCwd: Us.getPath("userData"),
    appVersion: Us.getVersion()
  };
  return Mu || (To.on("electron-store-get-data", (e) => {
    e.returnValue = t;
  }), Mu = !0), t;
};
class RI extends TI {
  constructor(e) {
    let r, n;
    if (_e.type === "renderer") {
      const s = Yh.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else To && Us && ({ defaultCwd: r, appVersion: n } = Vu());
    e = {
      name: "config",
      ...e
    }, e.projectVersion || (e.projectVersion = n), e.cwd ? e.cwd = Y.isAbsolute(e.cwd) ? e.cwd : Y.join(r, e.cwd) : e.cwd = r, e.configName = e.name, delete e.name, super(e);
  }
  static initRenderer() {
    Vu();
  }
  async openInEditor() {
    const e = await OI.openPath(this.path);
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
var Hu;
Hu = k;
class Se {
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
N(Se, Hu, "Column");
var Ju;
Ju = k;
class ay {
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
N(ay, Ju, "ColumnBuilder");
const er = Symbol.for("drizzle:Name"), Fu = Symbol.for("drizzle:isPgEnum");
function II(t) {
  return !!t && typeof t == "function" && Fu in t && t[Fu] === !0;
}
var Wu;
Wu = k;
class ze {
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
N(ze, Wu, "Subquery");
var Xu, Yu;
class Jc extends (Yu = ze, Xu = k, Yu) {
}
N(Jc, Xu, "WithSubquery");
const jI = {
  startActiveSpan(t, e) {
    return e();
  }
}, qe = Symbol.for("drizzle:ViewBaseConfig"), Bs = Symbol.for("drizzle:Schema"), Oo = Symbol.for("drizzle:Columns"), qu = Symbol.for("drizzle:ExtraConfigColumns"), so = Symbol.for("drizzle:OriginalName"), ao = Symbol.for("drizzle:BaseName"), ea = Symbol.for("drizzle:IsAlias"), zu = Symbol.for("drizzle:ExtraConfigBuilder"), CI = Symbol.for("drizzle:IsDrizzleTable");
var Zu, ed, td, rd, nd, sd, ad, od, id, cd;
cd = k, id = er, od = so, ad = Bs, sd = Oo, nd = qu, rd = ao, td = ea, ed = CI, Zu = zu;
class F {
  constructor(e, r, n) {
    /**
     * @internal
     * Can be changed if the table is aliased.
     */
    N(this, id);
    /**
     * @internal
     * Used to store the original name of the table, before any aliasing.
     */
    N(this, od);
    /** @internal */
    N(this, ad);
    /** @internal */
    N(this, sd);
    /** @internal */
    N(this, nd);
    /**
     *  @internal
     * Used to store the table name before the transformation via the `tableCreator` functions.
     */
    N(this, rd);
    /** @internal */
    N(this, td, !1);
    /** @internal */
    N(this, ed, !0);
    /** @internal */
    N(this, Zu);
    this[er] = this[so] = e, this[Bs] = r, this[ao] = n;
  }
}
N(F, cd, "Table"), /** @internal */
N(F, "Symbol", {
  Name: er,
  Schema: Bs,
  OriginalName: so,
  Columns: Oo,
  ExtraConfigColumns: qu,
  BaseName: ao,
  IsAlias: ea,
  ExtraConfigBuilder: zu
});
function Zr(t) {
  return t[er];
}
function Wn(t) {
  return `${t[Bs] ?? "public"}.${t[er]}`;
}
function oy(t) {
  return t != null && typeof t.getSQL == "function";
}
function AI(t) {
  var r;
  const e = { sql: "", params: [] };
  for (const n of t)
    e.sql += n.sql, e.params.push(...n.params), (r = n.typings) != null && r.length && (e.typings || (e.typings = []), e.typings.push(...n.typings));
  return e;
}
var ld;
ld = k;
class Oe {
  constructor(e) {
    N(this, "value");
    this.value = Array.isArray(e) ? e : [e];
  }
  getSQL() {
    return new W([this]);
  }
}
N(Oe, ld, "StringChunk");
var ud;
ud = k;
const Nr = class Nr {
  constructor(e) {
    /** @internal */
    N(this, "decoder", iy);
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
    return jI.startActiveSpan("drizzle.buildSQL", (r) => {
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
    return AI(e.map((l) => {
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
      if (A(l, Se)) {
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
        const _ = l[qe].schema, $ = l[qe].name;
        return {
          sql: _ === void 0 || l[qe].isAlias ? a($) : a(_) + "." + a($),
          params: []
        };
      }
      if (A(l, Mt)) {
        if (A(l.value, Cr))
          return { sql: o(d.value++, l), params: [l], typings: ["none"] };
        const _ = l.value === null ? null : l.encoder.mapToDriverValue(l.value);
        if (A(_, Nr))
          return this.buildQueryFromSourceParams([_], n);
        if (c)
          return { sql: this.mapInlineParam(_, n), params: [] };
        let $ = ["none"];
        return i && ($ = [i(l.encoder)]), { sql: o(d.value++, _), params: [_], typings: $ };
      }
      return A(l, Cr) ? { sql: o(d.value++, l), params: [l], typings: ["none"] } : A(l, Nr.Aliased) && l.fieldAlias !== void 0 ? { sql: a(l.fieldAlias), params: [] } : A(l, ze) ? l._.isWith ? { sql: a(l._.alias), params: [] } : this.buildQueryFromSourceParams([
        new Oe("("),
        l._.sql,
        new Oe(") "),
        new ta(l._.alias)
      ], n) : II(l) ? l.schema ? { sql: a(l.schema) + "." + a(l.enumName), params: [] } : { sql: a(l.enumName), params: [] } : oy(l) ? (h = l.shouldOmitSQLParens) != null && h.call(l) ? this.buildQueryFromSourceParams([l.getSQL()], n) : this.buildQueryFromSourceParams([
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
N(Nr, ud, "SQL");
let W = Nr;
var dd;
dd = k;
class ta {
  constructor(e) {
    N(this, "brand");
    this.value = e;
  }
  getSQL() {
    return new W([this]);
  }
}
N(ta, dd, "Name");
function kI(t) {
  return typeof t == "object" && t !== null && "mapToDriverValue" in t && typeof t.mapToDriverValue == "function";
}
const iy = {
  mapFromDriverValue: (t) => t
}, cy = {
  mapToDriverValue: (t) => t
};
({
  ...iy,
  ...cy
});
var fd;
fd = k;
class Mt {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(e, r = cy) {
    N(this, "brand");
    this.value = e, this.encoder = r;
  }
  getSQL() {
    return new W([this]);
  }
}
N(Mt, fd, "Param");
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
    return new Cr(c);
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
var hd;
hd = k;
class Cr {
  constructor(e) {
    this.name = e;
  }
  getSQL() {
    return new W([this]);
  }
}
N(Cr, hd, "Placeholder");
function Rs(t, e) {
  return t.map((r) => {
    if (A(r, Cr)) {
      if (!(r.name in e))
        throw new Error(`No value for placeholder "${r.name}" was provided`);
      return e[r.name];
    }
    if (A(r, Mt) && A(r.value, Cr)) {
      if (!(r.value.name in e))
        throw new Error(`No value for placeholder "${r.value.name}" was provided`);
      return r.encoder.mapToDriverValue(e[r.value.name]);
    }
    return r;
  });
}
const LI = Symbol.for("drizzle:IsDrizzleView");
var md, pd, yd;
yd = k, pd = qe, md = LI;
class Vr {
  constructor({ name: e, schema: r, selectedFields: n, query: s }) {
    /** @internal */
    N(this, pd);
    /** @internal */
    N(this, md, !0);
    this[qe] = {
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
N(Vr, yd, "View");
Se.prototype.getSQL = function() {
  return new W([this]);
};
F.prototype.getSQL = function() {
  return new W([this]);
};
ze.prototype.getSQL = function() {
  return new W([this]);
};
var $d;
$d = k;
class Xn {
  constructor(e) {
    this.table = e;
  }
  get(e, r) {
    return r === "table" ? this.table : e[r];
  }
}
N(Xn, $d, "ColumnAliasProxyHandler");
var gd;
gd = k;
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
    if (r === qe)
      return {
        ...e[qe],
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
    return A(n, Se) ? new Proxy(n, new Xn(new Proxy(e, this))) : n;
  }
}
N(Oa, gd, "TableAliasProxyHandler");
function oo(t, e) {
  return new Proxy(t, new Oa(e, !1));
}
function Pt(t, e) {
  return new Proxy(
    t,
    new Xn(new Proxy(t.table, new Oa(e, !1)))
  );
}
function ly(t, e) {
  return new W.Aliased(ra(t.sql, e), t.fieldAlias);
}
function ra(t, e) {
  return R.join(t.queryChunks.map((r) => A(r, Se) ? Pt(r, e) : A(r, W) ? ra(r, e) : A(r, W.Aliased) ? ly(r, e) : r));
}
var vd, _d;
class Ra extends (_d = Error, vd = k, _d) {
  constructor({ message: e, cause: r }) {
    super(e), this.name = "DrizzleError", this.cause = r;
  }
}
N(Ra, vd, "DrizzleError");
class Gt extends Error {
  constructor(e, r, n) {
    super(`Failed query: ${e}
params: ${r}`), this.query = e, this.params = r, this.cause = n, Error.captureStackTrace(this, Gt), n && (this.cause = n);
  }
}
var wd, bd;
class uy extends (bd = Ra, wd = k, bd) {
  constructor() {
    super({ message: "Rollback" });
  }
}
N(uy, wd, "TransactionRollbackError");
var Sd;
Sd = k;
class dy {
  write(e) {
    console.log(e);
  }
}
N(dy, Sd, "ConsoleLogWriter");
var Ed;
Ed = k;
class fy {
  constructor(e) {
    N(this, "writer");
    this.writer = (e == null ? void 0 : e.writer) ?? new dy();
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
N(fy, Ed, "DefaultLogger");
var Nd;
Nd = k;
class hy {
  logQuery() {
  }
}
N(hy, Nd, "NoopLogger");
var Pd, Td;
Td = k, Pd = Symbol.toStringTag;
class tr {
  constructor() {
    N(this, Pd, "QueryPromise");
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
N(tr, Td, "QueryPromise");
function Uu(t, e, r) {
  const n = {}, s = t.reduce(
    (a, { path: o, field: i }, c) => {
      let d;
      A(i, Se) ? d = i : A(i, W) ? d = i.decoder : A(i, ze) ? d = i._.sql.decoder : d = i.sql.decoder;
      let l = a;
      for (const [h, _] of o.entries())
        if (h < o.length - 1)
          _ in l || (l[_] = {}), l = l[_];
        else {
          const $ = e[c], w = l[_] = $ === null ? null : d.mapFromDriverValue($);
          if (r && A(i, Se) && o.length === 2) {
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
function Ar(t, e) {
  return Object.entries(t).reduce((r, [n, s]) => {
    if (typeof n != "string")
      return r;
    const a = e ? [...e, n] : [n];
    return A(s, Se) || A(s, W) || A(s, W.Aliased) || A(s, ze) ? r.push({ path: a, field: s }) : A(s, F) ? r.push(...Ar(s[F.Symbol.Columns], a)) : r.push(...Ar(s, a)), r;
  }, []);
}
function Wc(t, e) {
  const r = Object.keys(t), n = Object.keys(e);
  if (r.length !== n.length)
    return !1;
  for (const [s, a] of r.entries())
    if (a !== n[s])
      return !1;
  return !0;
}
function my(t, e) {
  const r = Object.entries(e).filter(([, n]) => n !== void 0).map(([n, s]) => A(s, W) || A(s, Se) ? [n, s] : [n, new Mt(s, t[F.Symbol.Columns][n])]);
  if (r.length === 0)
    throw new Error("No values to set");
  return Object.fromEntries(r);
}
function DI(t, e) {
  for (const r of e)
    for (const n of Object.getOwnPropertyNames(r.prototype))
      n !== "constructor" && Object.defineProperty(
        t.prototype,
        n,
        Object.getOwnPropertyDescriptor(r.prototype, n) || /* @__PURE__ */ Object.create(null)
      );
}
function MI(t) {
  return t[F.Symbol.Columns];
}
function Ro(t) {
  return A(t, ze) ? t._.alias : A(t, Vr) ? t[qe].name : A(t, W) ? void 0 : t[F.Symbol.IsAlias] ? t[F.Symbol.Name] : t[F.Symbol.BaseName];
}
function ls(t, e) {
  return {
    name: typeof t == "string" && t.length > 0 ? t : "",
    config: typeof t == "object" ? t : e
  };
}
function VI(t) {
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
const py = typeof TextDecoder > "u" ? null : new TextDecoder(), Bu = Symbol.for("drizzle:PgInlineForeignKeys"), Ku = Symbol.for("drizzle:EnableRLS");
var Od, Rd, Id, jd, Cd, Ad;
class Io extends (Ad = F, Cd = k, jd = Bu, Id = Ku, Rd = F.Symbol.ExtraConfigBuilder, Od = F.Symbol.ExtraConfigColumns, Ad) {
  constructor() {
    super(...arguments);
    /**@internal */
    N(this, jd, []);
    /** @internal */
    N(this, Id, !1);
    /** @internal */
    N(this, Rd);
    /** @internal */
    N(this, Od, {});
  }
}
N(Io, Cd, "PgTable"), /** @internal */
N(Io, "Symbol", Object.assign({}, F.Symbol, {
  InlineForeignKeys: Bu,
  EnableRLS: Ku
}));
var kd;
kd = k;
class yy {
  constructor(e, r) {
    /** @internal */
    N(this, "columns");
    /** @internal */
    N(this, "name");
    this.columns = e, this.name = r;
  }
  /** @internal */
  build(e) {
    return new $y(e, this.columns, this.name);
  }
}
N(yy, kd, "PgPrimaryKeyBuilder");
var Ld;
Ld = k;
class $y {
  constructor(e, r, n) {
    N(this, "columns");
    N(this, "name");
    this.table = e, this.columns = r, this.name = n;
  }
  getName() {
    return this.name ?? `${this.table[Io.Symbol.Name]}_${this.columns.map((e) => e.name).join("_")}_pk`;
  }
}
N($y, Ld, "PgPrimaryKey");
function Ye(t, e) {
  return kI(e) && !oy(t) && !A(t, Mt) && !A(t, Cr) && !A(t, Se) && !A(t, F) && !A(t, Vr) ? new Mt(t, e) : t;
}
const us = (t, e) => R`${t} = ${Ye(e, t)}`, FI = (t, e) => R`${t} <> ${Ye(e, t)}`;
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
function qI(...t) {
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
function zI(t) {
  return R`not ${t}`;
}
const UI = (t, e) => R`${t} > ${Ye(e, t)}`, BI = (t, e) => R`${t} >= ${Ye(e, t)}`, KI = (t, e) => R`${t} < ${Ye(e, t)}`, QI = (t, e) => R`${t} <= ${Ye(e, t)}`;
function GI(t, e) {
  return Array.isArray(e) ? e.length === 0 ? R`false` : R`${t} in ${e.map((r) => Ye(r, t))}` : R`${t} in ${Ye(e, t)}`;
}
function xI(t, e) {
  return Array.isArray(e) ? e.length === 0 ? R`true` : R`${t} not in ${e.map((r) => Ye(r, t))}` : R`${t} not in ${Ye(e, t)}`;
}
function HI(t) {
  return R`${t} is null`;
}
function JI(t) {
  return R`${t} is not null`;
}
function WI(t) {
  return R`exists ${t}`;
}
function XI(t) {
  return R`not exists ${t}`;
}
function YI(t, e, r) {
  return R`${t} between ${Ye(e, t)} and ${Ye(
    r,
    t
  )}`;
}
function ZI(t, e, r) {
  return R`${t} not between ${Ye(
    e,
    t
  )} and ${Ye(r, t)}`;
}
function ej(t, e) {
  return R`${t} like ${e}`;
}
function tj(t, e) {
  return R`${t} not like ${e}`;
}
function rj(t, e) {
  return R`${t} ilike ${e}`;
}
function nj(t, e) {
  return R`${t} not ilike ${e}`;
}
function sj(t) {
  return R`${t} asc`;
}
function aj(t) {
  return R`${t} desc`;
}
var Dd;
Dd = k;
class Xc {
  constructor(e, r, n) {
    N(this, "referencedTableName");
    N(this, "fieldName");
    this.sourceTable = e, this.referencedTable = r, this.relationName = n, this.referencedTableName = r[F.Symbol.Name];
  }
}
N(Xc, Dd, "Relation");
var Md;
Md = k;
class gy {
  constructor(e, r) {
    this.table = e, this.config = r;
  }
}
N(gy, Md, "Relations");
var Vd, Fd;
const oa = class oa extends (Fd = Xc, Vd = k, Fd) {
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
N(oa, Vd, "One");
let kr = oa;
var qd, zd;
const ia = class ia extends (zd = Xc, qd = k, zd) {
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
N(ia, qd, "Many");
let na = ia;
function oj() {
  return {
    and: jo,
    between: YI,
    eq: us,
    exists: WI,
    gt: UI,
    gte: BI,
    ilike: rj,
    inArray: GI,
    isNull: HI,
    isNotNull: JI,
    like: ej,
    lt: KI,
    lte: QI,
    ne: FI,
    not: zI,
    notBetween: ZI,
    notExists: XI,
    notLike: tj,
    notIlike: nj,
    notInArray: xI,
    or: qI,
    sql: R
  };
}
function ij() {
  return {
    sql: R,
    asc: sj,
    desc: aj
  };
}
function cj(t, e) {
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
          A(h, yy) && s[o].primaryKey.push(...h.columns);
    } else if (A(i, gy)) {
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
function lj(t) {
  return function(r, n) {
    return new kr(
      t,
      r,
      n,
      (n == null ? void 0 : n.fields.reduce((s, a) => s && a.notNull, !0)) ?? !1
    );
  };
}
function uj(t) {
  return function(r, n) {
    return new na(t, r, n);
  };
}
function dj(t, e, r) {
  if (A(r, kr) && r.config)
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
  if (i[0] && A(i[0], kr) && i[0].config)
    return {
      fields: i[0].config.references,
      references: i[0].config.fields
    };
  throw new Error(
    `There is not enough information to infer relation "${o}.${r.fieldName}"`
  );
}
function fj(t) {
  return {
    one: lj(t),
    many: uj(t)
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
      a[i.tsKey] = A(c, kr) ? l && Co(
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
      A(d, Se) ? l = d : A(d, W) ? l = d.decoder : l = d.sql.decoder, a[i.tsKey] = c === null ? null : l.mapFromDriverValue(c);
    }
  return a;
}
var Ud;
Ud = k;
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
    if (r === qe)
      return {
        ...e[qe],
        selectedFields: new Proxy(
          e[qe].selectedFields,
          this
        )
      };
    if (typeof r == "symbol")
      return e[r];
    const s = (A(e, ze) ? e._.selectedFields : A(e, Vr) ? e[qe].selectedFields : e)[r];
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
    return A(s, Se) ? this.config.alias ? new Proxy(
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
N(ca, Ud, "SelectionProxyHandler");
let Qe = ca;
var Bd;
Bd = k;
class vy {
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
    return new _y(e, this);
  }
}
N(vy, Bd, "SQLiteForeignKeyBuilder");
var Kd;
Kd = k;
class _y {
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
N(_y, Kd, "SQLiteForeignKey");
function hj(t, e) {
  return `${t[er]}_${e.join("_")}_unique`;
}
var Qd, Gd;
class ot extends (Gd = ay, Qd = k, Gd) {
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
      const c = new vy(() => {
        const d = o();
        return { columns: [r], foreignColumns: [d] };
      });
      return i.onUpdate && c.onUpdate(i.onUpdate), i.onDelete && c.onDelete(i.onDelete), c.build(n);
    })(s, a));
  }
}
N(ot, Qd, "SQLiteColumnBuilder");
var xd, Hd;
class xe extends (Hd = Se, xd = k, Hd) {
  constructor(e, r) {
    r.uniqueName || (r.uniqueName = hj(e, [r.name])), super(e, r), this.table = e;
  }
}
N(xe, xd, "SQLiteColumn");
var Jd, Wd;
class wy extends (Wd = ot, Jd = k, Wd) {
  constructor(e) {
    super(e, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(e) {
    return new by(e, this.config);
  }
}
N(wy, Jd, "SQLiteBigIntBuilder");
var Xd, Yd;
class by extends (Yd = xe, Xd = k, Yd) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const r = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return BigInt(r.toString("utf8"));
    }
    return BigInt(py.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(e.toString());
  }
}
N(by, Xd, "SQLiteBigInt");
var Zd, ef;
class Sy extends (ef = ot, Zd = k, ef) {
  constructor(e) {
    super(e, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(e) {
    return new Ey(
      e,
      this.config
    );
  }
}
N(Sy, Zd, "SQLiteBlobJsonBuilder");
var tf, rf;
class Ey extends (rf = xe, tf = k, rf) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const r = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return JSON.parse(r.toString("utf8"));
    }
    return JSON.parse(py.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(JSON.stringify(e));
  }
}
N(Ey, tf, "SQLiteBlobJson");
var nf, sf;
class Ny extends (sf = ot, nf = k, sf) {
  constructor(e) {
    super(e, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(e) {
    return new Py(e, this.config);
  }
}
N(Ny, nf, "SQLiteBlobBufferBuilder");
var af, of;
class Py extends (of = xe, af = k, of) {
  mapFromDriverValue(e) {
    return Buffer.isBuffer(e) ? e : Buffer.from(e);
  }
  getSQLType() {
    return "blob";
  }
}
N(Py, af, "SQLiteBlobBuffer");
function mj(t, e) {
  const { name: r, config: n } = ls(t, e);
  return (n == null ? void 0 : n.mode) === "json" ? new Sy(r) : (n == null ? void 0 : n.mode) === "bigint" ? new wy(r) : new Ny(r);
}
var cf, lf;
class Ty extends (lf = ot, cf = k, lf) {
  constructor(e, r, n) {
    super(e, "custom", "SQLiteCustomColumn"), this.config.fieldConfig = r, this.config.customTypeParams = n;
  }
  /** @internal */
  build(e) {
    return new Oy(
      e,
      this.config
    );
  }
}
N(Ty, cf, "SQLiteCustomColumnBuilder");
var uf, df;
class Oy extends (df = xe, uf = k, df) {
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
N(Oy, uf, "SQLiteCustomColumn");
function pj(t) {
  return (e, r) => {
    const { name: n, config: s } = ls(e, r);
    return new Ty(
      n,
      s,
      t
    );
  };
}
var ff, hf;
class Ia extends (hf = ot, ff = k, hf) {
  constructor(e, r, n) {
    super(e, r, n), this.config.autoIncrement = !1;
  }
  primaryKey(e) {
    return e != null && e.autoIncrement && (this.config.autoIncrement = !0), this.config.hasDefault = !0, super.primaryKey();
  }
}
N(Ia, ff, "SQLiteBaseIntegerBuilder");
var mf, pf;
class ja extends (pf = xe, mf = k, pf) {
  constructor() {
    super(...arguments);
    N(this, "autoIncrement", this.config.autoIncrement);
  }
  getSQLType() {
    return "integer";
  }
}
N(ja, mf, "SQLiteBaseInteger");
var yf, $f;
class Ry extends ($f = Ia, yf = k, $f) {
  constructor(e) {
    super(e, "number", "SQLiteInteger");
  }
  build(e) {
    return new Iy(
      e,
      this.config
    );
  }
}
N(Ry, yf, "SQLiteIntegerBuilder");
var gf, vf;
class Iy extends (vf = ja, gf = k, vf) {
}
N(Iy, gf, "SQLiteInteger");
var _f, wf;
class jy extends (wf = Ia, _f = k, wf) {
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
    return new Cy(
      e,
      this.config
    );
  }
}
N(jy, _f, "SQLiteTimestampBuilder");
var bf, Sf;
class Cy extends (Sf = ja, bf = k, Sf) {
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
N(Cy, bf, "SQLiteTimestamp");
var Ef, Nf;
class Ay extends (Nf = Ia, Ef = k, Nf) {
  constructor(e, r) {
    super(e, "boolean", "SQLiteBoolean"), this.config.mode = r;
  }
  build(e) {
    return new ky(
      e,
      this.config
    );
  }
}
N(Ay, Ef, "SQLiteBooleanBuilder");
var Pf, Tf;
class ky extends (Tf = ja, Pf = k, Tf) {
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
N(ky, Pf, "SQLiteBoolean");
function Yc(t, e) {
  const { name: r, config: n } = ls(t, e);
  return (n == null ? void 0 : n.mode) === "timestamp" || (n == null ? void 0 : n.mode) === "timestamp_ms" ? new jy(r, n.mode) : (n == null ? void 0 : n.mode) === "boolean" ? new Ay(r, n.mode) : new Ry(r);
}
var Of, Rf;
class Ly extends (Rf = ot, Of = k, Rf) {
  constructor(e) {
    super(e, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(e) {
    return new Dy(
      e,
      this.config
    );
  }
}
N(Ly, Of, "SQLiteNumericBuilder");
var If, jf;
class Dy extends (jf = xe, If = k, jf) {
  mapFromDriverValue(e) {
    return typeof e == "string" ? e : String(e);
  }
  getSQLType() {
    return "numeric";
  }
}
N(Dy, If, "SQLiteNumeric");
var Cf, Af;
class My extends (Af = ot, Cf = k, Af) {
  constructor(e) {
    super(e, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(e) {
    return new Vy(
      e,
      this.config
    );
  }
}
N(My, Cf, "SQLiteNumericNumberBuilder");
var kf, Lf;
class Vy extends (Lf = xe, kf = k, Lf) {
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
N(Vy, kf, "SQLiteNumericNumber");
var Df, Mf;
class Fy extends (Mf = ot, Df = k, Mf) {
  constructor(e) {
    super(e, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(e) {
    return new qy(
      e,
      this.config
    );
  }
}
N(Fy, Df, "SQLiteNumericBigIntBuilder");
var Vf, Ff;
class qy extends (Ff = xe, Vf = k, Ff) {
  constructor() {
    super(...arguments);
    N(this, "mapFromDriverValue", BigInt);
    N(this, "mapToDriverValue", String);
  }
  getSQLType() {
    return "numeric";
  }
}
N(qy, Vf, "SQLiteNumericBigInt");
function yj(t, e) {
  const { name: r, config: n } = ls(t, e), s = n == null ? void 0 : n.mode;
  return s === "number" ? new My(r) : s === "bigint" ? new Fy(r) : new Ly(r);
}
var qf, zf;
class zy extends (zf = ot, qf = k, zf) {
  constructor(e) {
    super(e, "number", "SQLiteReal");
  }
  /** @internal */
  build(e) {
    return new Uy(e, this.config);
  }
}
N(zy, qf, "SQLiteRealBuilder");
var Uf, Bf;
class Uy extends (Bf = xe, Uf = k, Bf) {
  getSQLType() {
    return "real";
  }
}
N(Uy, Uf, "SQLiteReal");
function $j(t) {
  return new zy(t ?? "");
}
var Kf, Qf;
class By extends (Qf = ot, Kf = k, Qf) {
  constructor(e, r) {
    super(e, "string", "SQLiteText"), this.config.enumValues = r.enum, this.config.length = r.length;
  }
  /** @internal */
  build(e) {
    return new Ky(
      e,
      this.config
    );
  }
}
N(By, Kf, "SQLiteTextBuilder");
var Gf, xf;
class Ky extends (xf = xe, Gf = k, xf) {
  constructor(r, n) {
    super(r, n);
    N(this, "enumValues", this.config.enumValues);
    N(this, "length", this.config.length);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
N(Ky, Gf, "SQLiteText");
var Hf, Jf;
class Qy extends (Jf = ot, Hf = k, Jf) {
  constructor(e) {
    super(e, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(e) {
    return new Gy(
      e,
      this.config
    );
  }
}
N(Qy, Hf, "SQLiteTextJsonBuilder");
var Wf, Xf;
class Gy extends (Xf = xe, Wf = k, Xf) {
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
N(Gy, Wf, "SQLiteTextJson");
function ft(t, e = {}) {
  const { name: r, config: n } = ls(t, e);
  return n.mode === "json" ? new Qy(r) : new By(r, n);
}
function gj() {
  return {
    blob: mj,
    customType: pj,
    integer: Yc,
    numeric: yj,
    real: $j,
    text: ft
  };
}
const Ao = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var Yf, Zf, eh, th, rh;
class rt extends (rh = F, th = k, eh = F.Symbol.Columns, Zf = Ao, Yf = F.Symbol.ExtraConfigBuilder, rh) {
  constructor() {
    super(...arguments);
    /** @internal */
    N(this, eh);
    /** @internal */
    N(this, Zf, []);
    /** @internal */
    N(this, Yf);
  }
}
N(rt, th, "SQLiteTable"), /** @internal */
N(rt, "Symbol", Object.assign({}, F.Symbol, {
  InlineForeignKeys: Ao
}));
function vj(t, e, r, n, s = t) {
  const a = new rt(t, n, s), o = typeof e == "function" ? e(gj()) : e, i = Object.fromEntries(
    Object.entries(o).map(([d, l]) => {
      const h = l;
      h.setName(d);
      const _ = h.build(a);
      return a[Ao].push(...h.buildForeignKeys(_, a)), [d, _];
    })
  ), c = Object.assign(a, i);
  return c[F.Symbol.Columns] = i, c[F.Symbol.ExtraConfigColumns] = i, c;
}
const xy = (t, e, r) => vj(t, e);
function Pr(t) {
  return A(t, rt) ? [`${t[F.Symbol.BaseName]}`] : A(t, ze) ? t._.usedTables ?? [] : A(t, W) ? t.usedTables ?? [] : [];
}
var nh, sh;
class ko extends (sh = tr, nh = k, sh) {
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
          new Qe({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
    return this.config.returning = Ar(r), this;
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
N(ko, nh, "SQLiteDelete");
function _j(t) {
  return (t.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((r) => r.toLowerCase()).join("_");
}
function wj(t) {
  return (t.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((r, n, s) => {
    const a = s === 0 ? n.toLowerCase() : `${n[0].toUpperCase()}${n.slice(1)}`;
    return r + a;
  }, "");
}
function bj(t) {
  return t;
}
var ah;
ah = k;
class Hy {
  constructor(e) {
    /** @internal */
    N(this, "cache", {});
    N(this, "cachedTables", {});
    N(this, "convert");
    this.convert = e === "snake_case" ? _j : e === "camelCase" ? wj : bj;
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
N(Hy, ah, "CasingCache");
var oh, ih;
class Ca extends (ih = Vr, oh = k, ih) {
}
N(Ca, oh, "SQLiteViewBase");
var ch;
ch = k;
class sa {
  constructor(e) {
    /** @internal */
    N(this, "casing");
    this.casing = new Hy(e == null ? void 0 : e.casing);
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
            c.queryChunks.map((d) => A(d, Se) ? R.identifier(this.casing.getColumnCasing(d)) : d)
          )
        ) : i.push(c), A(a, W.Aliased) && i.push(R` as ${R.identifier(a.fieldAlias)}`);
      } else if (A(a, Se)) {
        const c = a.table[F.Symbol.Name];
        a.columnType === "SQLiteNumericBigInt" ? r ? i.push(
          R`cast(${R.identifier(this.casing.getColumnCasing(a))} as text)`
        ) : i.push(
          R`cast(${R.identifier(c)}.${R.identifier(this.casing.getColumnCasing(a))} as text)`
        ) : r ? i.push(R.identifier(this.casing.getColumnCasing(a))) : i.push(
          R`${R.identifier(c)}.${R.identifier(this.casing.getColumnCasing(a))}`
        );
      } else if (A(a, ze)) {
        const c = Object.entries(a._.selectedFields);
        if (c.length === 1) {
          const d = c[0][1], l = A(d, W) ? d.decoder : A(d, Se) ? { mapFromDriverValue: (h) => d.mapFromDriverValue(h) } : d.sql.decoder;
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
    const w = n ?? Ar(r);
    for (const ne of w)
      if (A(ne.field, Se) && Zr(ne.field.table) !== (A(o, ze) ? o._.alias : A(o, Ca) ? o[qe].name : A(o, W) ? void 0 : Zr(o)) && !((G) => i == null ? void 0 : i.some(
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
    const X = D.length > 0 ? R` group by ${R.join(D)}` : void 0, de = this.buildOrderBy(c), ge = this.buildLimit(l), Q = h ? R` offset ${h}` : void 0, x = R`${g}select${m} ${b} from ${T}${O}${I}${X}${q}${de}${ge}${Q}`;
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
        if (A(v, xe))
          w.push(R.identifier(v.name));
        else if (A(v, W)) {
          for (let g = 0; g < v.queryChunks.length; g++) {
            const m = v.queryChunks[g];
            A(m, xe) && (v.queryChunks[g] = R.identifier(
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
        Object.entries(a.columns).map(([D, X]) => [
          D,
          Pt(X, i)
        ])
      );
      if (o.where) {
        const D = typeof o.where == "function" ? o.where(m, oj()) : o.where;
        w = D && ra(D, i);
      }
      const b = [];
      let T = [];
      if (o.columns) {
        let D = !1;
        for (const [X, de] of Object.entries(o.columns))
          de !== void 0 && X in a.columns && (!D && de === !0 && (D = !0), T.push(X));
        T.length > 0 && (T = D ? T.filter((X) => {
          var de;
          return ((de = o.columns) == null ? void 0 : de[X]) === !0;
        }) : Object.keys(a.columns).filter(
          (X) => !T.includes(X)
        ));
      } else
        T = Object.keys(a.columns);
      for (const D of T) {
        const X = a.columns[D];
        b.push({ tsKey: D, value: X });
      }
      let O = [];
      o.with && (O = Object.entries(o.with).filter(
        (D) => !!D[1]
      ).map(([D, X]) => ({
        tsKey: D,
        queryConfig: X,
        relation: a.relations[D]
      })));
      let I;
      if (o.extras) {
        I = typeof o.extras == "function" ? o.extras(m, { sql: R }) : o.extras;
        for (const [D, X] of Object.entries(I))
          b.push({
            tsKey: D,
            value: ly(X, i)
          });
      }
      for (const { tsKey: D, value: X } of b)
        l.push({
          dbKey: A(X, W.Aliased) ? X.fieldAlias : a.columns[D].name,
          tsKey: D,
          field: A(X, Se) ? Pt(X, i) : X,
          relationTableTsKey: void 0,
          isJson: !1,
          selection: []
        });
      let q = typeof o.orderBy == "function" ? o.orderBy(m, ij()) : o.orderBy ?? [];
      Array.isArray(q) || (q = [q]), $ = q.map((D) => A(D, Se) ? Pt(D, i) : ra(D, i)), h = o.limit, _ = o.offset;
      for (const {
        tsKey: D,
        queryConfig: X,
        relation: de
      } of O) {
        const ge = dj(
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
          queryConfig: A(de, kr) ? X === !0 ? { limit: 1 } : { ...X, limit: 1 } : X,
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
          ({ field: O }) => A(O, xe) ? R.identifier(this.casing.getColumnCasing(O)) : A(O, W.Aliased) ? O.sql : O
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
        table: A(g, rt) ? g : new ze(g, {}, i),
        fields: {},
        fieldsFlat: b.map(({ field: O }) => ({
          path: [],
          field: A(O, Se) ? Pt(O, i) : O
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
          field: A(m, Se) ? Pt(m, i) : m
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
N(sa, ch, "SQLiteDialect");
var lh, uh;
class Zc extends (uh = sa, lh = k, uh) {
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
N(Zc, lh, "SQLiteSyncDialect");
var dh;
dh = k;
class Jy {
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
N(Jy, dh, "TypedQueryBuilder");
var fh;
fh = k;
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
    return this.fields ? n = this.fields : A(e, ze) ? n = Object.fromEntries(
      Object.keys(e._.selectedFields).map((s) => [s, e[s]])
    ) : A(e, Ca) ? n = e[qe].selectedFields : A(e, W) ? n = {} : n = MI(e), new el({
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
N(Rt, fh, "SQLiteSelectBuilder");
var hh, mh;
class Wy extends (mh = Jy, hh = k, mh) {
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
        const c = A(n, ze) ? n._.selectedFields : A(n, Vr) ? n[qe].selectedFields : n[F.Symbol.Columns];
        this.config.fields[o] = c;
      }
      if (typeof s == "function" && (s = s(
        new Proxy(
          this.config.fields,
          new Qe({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
      const a = typeof s == "function" ? s(Sj()) : s;
      if (!Wc(this.getSelectedFields(), a.getSelectedFields()))
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
        new Qe({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
        new Qe({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.having = r, this;
  }
  groupBy(...r) {
    if (typeof r[0] == "function") {
      const n = r[0](
        new Proxy(
          this.config.fields,
          new Qe({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
          new Qe({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
      new ze(this.getSQL(), this.config.fields, r, !1, [...new Set(n)]),
      new Qe({ alias: r, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new Qe({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
}
N(Wy, hh, "SQLiteSelectQueryBuilder");
var ph, yh;
class el extends (yh = Wy, ph = k, yh) {
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
    const n = Ar(this.config.fields), s = this.session[r ? "prepareOneTimeQuery" : "prepareQuery"](
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
N(el, ph, "SQLiteSelect");
DI(el, [tr]);
function Aa(t, e) {
  return (r, n, ...s) => {
    const a = [n, ...s].map((o) => ({
      type: t,
      isAll: e,
      rightSelect: o
    }));
    for (const o of a)
      if (!Wc(r.getSelectedFields(), o.rightSelect.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
    return r.addSetOperators(a);
  };
}
const Sj = () => ({
  union: Ej,
  unionAll: Nj,
  intersect: Pj,
  except: Tj
}), Ej = Aa("union", !1), Nj = Aa("union", !0), Pj = Aa("intersect", !1), Tj = Aa("except", !1);
var $h;
$h = k;
class tl {
  constructor(e) {
    N(this, "dialect");
    N(this, "dialectConfig");
    N(this, "$with", (e, r) => {
      const n = this;
      return { as: (a) => (typeof a == "function" && (a = a(n)), new Proxy(
        new Jc(
          a.getSQL(),
          r ?? ("getSelectedFields" in a ? a.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new Qe({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
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
    return this.dialect || (this.dialect = new Zc(this.dialectConfig)), this.dialect;
  }
}
N(tl, $h, "SQLiteQueryBuilder");
var gh;
gh = k;
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
    const r = typeof e == "function" ? e(new tl()) : e;
    if (!A(r, W) && !Wc(this.table[Oo], r._.selectedFields))
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    return new Do(this.table, r, this.session, this.dialect, this.withList, !0);
  }
}
N(Lo, gh, "SQLiteInsertBuilder");
var vh, _h;
class Do extends (_h = tr, vh = k, _h) {
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
    return this.config.returning = Ar(r), this;
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
    const n = r.where ? R` where ${r.where}` : void 0, s = r.targetWhere ? R` where ${r.targetWhere}` : void 0, a = r.setWhere ? R` where ${r.setWhere}` : void 0, o = Array.isArray(r.target) ? R`${r.target}` : R`${[r.target]}`, i = this.dialect.buildUpdateSet(this.config.table, my(this.config.table, r.set));
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
N(Do, vh, "SQLiteInsert");
var wh;
wh = k;
class Mo {
  constructor(e, r, n, s) {
    this.table = e, this.session = r, this.dialect = n, this.withList = s;
  }
  set(e) {
    return new Xy(
      this.table,
      my(this.table, e),
      this.session,
      this.dialect,
      this.withList
    );
  }
}
N(Mo, wh, "SQLiteUpdateBuilder");
var bh, Sh;
class Xy extends (Sh = tr, bh = k, Sh) {
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
        const o = this.config.from ? A(n, rt) ? n[F.Symbol.Columns] : A(n, ze) ? n._.selectedFields : A(n, Ca) ? n[qe].selectedFields : void 0 : void 0;
        s = s(
          new Proxy(
            this.config.table[F.Symbol.Columns],
            new Qe({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          o && new Proxy(
            o,
            new Qe({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
          new Qe({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
    return this.config.returning = Ar(r), this;
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
N(Xy, bh, "SQLiteUpdate");
var Eh, Nh, Ph;
const xn = class xn extends (Ph = W, Nh = k, Eh = Symbol.toStringTag, Ph) {
  constructor(r) {
    super(xn.buildEmbeddedCount(r.source, r.filters).queryChunks);
    N(this, "sql");
    N(this, Eh, "SQLiteCountBuilderAsync");
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
N(xn, Nh, "SQLiteCountBuilderAsync");
let Vo = xn;
var Th;
Th = k;
class Yy {
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
N(Yy, Th, "SQLiteAsyncRelationalQueryBuilder");
var Oh, Rh;
class aa extends (Rh = tr, Oh = k, Rh) {
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
N(aa, Oh, "SQLiteAsyncRelationalQuery");
var Ih, jh;
class Fo extends (jh = aa, Ih = k, jh) {
  sync() {
    return this.executeRaw();
  }
}
N(Fo, Ih, "SQLiteSyncRelationalQuery");
var Ch, Ah;
class Ln extends (Ah = tr, Ch = k, Ah) {
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
N(Ln, Ch, "SQLiteRaw");
var kh;
kh = k;
class rl {
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
      return { as: (a) => (typeof a == "function" && (a = a(new tl(n.dialect))), new Proxy(
        new Jc(
          a.getSQL(),
          r ?? ("getSelectedFields" in a ? a.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new Qe({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
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
        a[o] = new Yy(
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
N(rl, kh, "BaseSQLiteDatabase");
var Lh;
Lh = k;
class Zy {
}
N(Zy, Lh, "Cache");
var Dh, Mh;
class nl extends (Mh = Zy, Dh = k, Mh) {
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
N(nl, Dh, "NoopCache");
async function Qu(t, e) {
  const r = `${t}-${JSON.stringify(e)}`, s = new TextEncoder().encode(r), a = await crypto.subtle.digest("SHA-256", s);
  return [...new Uint8Array(a)].map((c) => c.toString(16).padStart(2, "0")).join("");
}
var Vh, Fh;
class e$ extends (Fh = tr, Vh = k, Fh) {
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
N(e$, Vh, "ExecuteResultSync");
var qh;
qh = k;
class t$ {
  constructor(e, r, n, s, a, o) {
    /** @internal */
    N(this, "joinsNotNullableMap");
    var i;
    this.mode = e, this.executeMethod = r, this.query = n, this.cache = s, this.queryMetadata = a, this.cacheConfig = o, s && s.strategy() === "all" && o === void 0 && (this.cacheConfig = { enable: !0, autoInvalidate: !0 }), (i = this.cacheConfig) != null && i.enable || (this.cacheConfig = void 0);
  }
  /** @internal */
  async queryWithCache(e, r, n) {
    if (this.cache === void 0 || A(this.cache, nl) || this.queryMetadata === void 0)
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
        this.cacheConfig.tag ?? await Qu(e, r),
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
          this.cacheConfig.tag ?? await Qu(e, r),
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
    return this.mode === "async" ? this[this.executeMethod](e) : new e$(() => this[this.executeMethod](e));
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
N(t$, qh, "PreparedQuery");
var zh;
zh = k;
class r$ {
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
N(r$, zh, "SQLiteSession");
var Uh, Bh;
class n$ extends (Bh = rl, Uh = k, Bh) {
  constructor(e, r, n, s, a = 0) {
    super(e, r, n, s), this.schema = s, this.nestedIndex = a;
  }
  rollback() {
    throw new uy();
  }
}
N(n$, Uh, "SQLiteTransaction");
var Kh, Qh;
class s$ extends (Qh = r$, Kh = k, Qh) {
  constructor(r, n, s, a = {}) {
    super(n);
    N(this, "logger");
    N(this, "cache");
    this.client = r, this.schema = s, this.logger = a.logger ?? new hy(), this.cache = a.cache ?? new nl();
  }
  prepareQuery(r, n, s, a, o, i, c) {
    const d = this.client.prepare(r.sql);
    return new a$(
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
N(s$, Kh, "BetterSQLiteSession");
var Gh, xh;
const la = class la extends (xh = n$, Gh = k, xh) {
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
N(la, Gh, "BetterSQLiteTransaction");
let qo = la;
var Hh, Jh;
class a$ extends (Jh = t$, Hh = k, Jh) {
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
    return i ? i(c) : c.map((d) => Uu(r, d, n));
  }
  get(e) {
    const r = Rs(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, r);
    const { fields: n, stmt: s, joinsNotNullableMap: a, customResultMapper: o } = this;
    if (!n && !o)
      return s.get(...r);
    const i = s.raw().get(...r);
    if (i)
      return o ? o([i]) : Uu(n, i, a);
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
N(a$, Hh, "BetterSQLitePreparedQuery");
var Wh, Xh;
class o$ extends (Xh = rl, Wh = k, Xh) {
}
N(o$, Wh, "BetterSQLite3Database");
function Hr(t, e = {}) {
  const r = new Zc({ casing: e.casing });
  let n;
  e.logger === !0 ? n = new fy() : e.logger !== !1 && (n = e.logger);
  let s;
  if (e.schema) {
    const i = cj(
      e.schema,
      fj
    );
    s = {
      fullSchema: e.schema,
      schema: i.tables,
      tableNamesMap: i.tableNamesMap
    };
  }
  const a = new s$(t, r, s, { logger: n }), o = new o$("sync", r, a, s);
  return o.$client = t, o;
}
function zo(...t) {
  if (t[0] === void 0 || typeof t[0] == "string") {
    const e = t[0] === void 0 ? new jn() : new jn(t[0]);
    return Hr(e, t[1]);
  }
  if (VI(t[0])) {
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
const Lr = xy("songs", {
  id: Yc("id").primaryKey({ autoIncrement: !0 }),
  title: ft("title").notNull(),
  author: ft("author").notNull().default(""),
  language: ft("language").notNull().default("es"),
  slides: ft("slides").notNull().default("[]"),
  createdAt: ft("created_at").notNull().default(R`(datetime('now'))`),
  updatedAt: ft("updated_at").notNull().default(R`(datetime('now'))`)
}), Yn = xy("media", {
  id: Yc("id").primaryKey({ autoIncrement: !0 }),
  type: ft("type").notNull(),
  title: ft("title").notNull(),
  filePath: ft("file_path").notNull(),
  createdAt: ft("created_at").notNull().default(R`(datetime('now'))`)
});
let Is = null;
function Fr() {
  if (Is) return Is;
  const t = Y.join(Lt.getPath("userData"), "seedscreen.db"), e = new jn(t);
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
function sl(t) {
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
  return Fr().select().from(Lr).orderBy(Lr.title).all().map(sl);
}
function i$(t) {
  const e = Fr().insert(Lr).values({
    title: t.title.trim(),
    author: (t.author || "").trim(),
    language: t.language || "es",
    slides: JSON.stringify(t.slides || [])
  }).returning().get();
  return sl(e);
}
function Oj(t, e) {
  const r = Fr().update(Lr).set({
    title: e.title.trim(),
    author: (e.author || "").trim(),
    language: e.language || "es",
    slides: JSON.stringify(e.slides || []),
    updatedAt: R`(datetime('now'))`
  }).where(us(Lr.id, t)).returning().get();
  return r ? sl(r) : null;
}
function Rj(t) {
  return Fr().delete(Lr).where(us(Lr.id, t)).run(), !0;
}
function Ij(t) {
  const e = (s, a) => `${s.trim().toLowerCase()}::${a.trim().toLowerCase()}`, r = new Set(fn().map((s) => e(s.title, s.author)));
  let n = 0;
  for (const s of t ?? [])
    s != null && s.title && (r.has(e(s.title, s.author || "")) || (i$({
      title: s.title,
      author: s.author || "",
      language: s.language || "es",
      slides: s.slides || []
    }), r.add(e(s.title, s.author || "")), n++));
  return { added: n, total: (t == null ? void 0 : t.length) ?? 0 };
}
function al(t) {
  return {
    id: t.id,
    type: t.type === "video" ? "video" : "image",
    title: t.title,
    filePath: t.filePath,
    createdAt: t.createdAt
  };
}
function ol() {
  return Fr().select().from(Yn).orderBy(Yn.title).all().map(al);
}
function jj(t) {
  const e = Fr().insert(Yn).values({ type: t.type, title: t.title.trim(), filePath: t.filePath }).returning().get();
  return al(e);
}
function Cj(t) {
  const e = Fr().delete(Yn).where(us(Yn.id, t)).returning().get();
  return e ? al(e) : null;
}
const c$ = 3849, Aj = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8"
}, il = {
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
let It = null, Zn = il, Dn = null;
const es = /* @__PURE__ */ new Set();
async function kj(t, e, r) {
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
function Lj(t, e, r) {
  const n = e === "/" ? "/remote.html" : e.split("?")[0], s = Y.join(t, decodeURIComponent(n));
  if (!s.startsWith(t)) {
    r.writeHead(403), r.end();
    return;
  }
  Z.readFile(s, (a, o) => {
    if (a) {
      r.writeHead(404), r.end();
      return;
    }
    r.setHeader("Content-Type", Aj[Y.extname(s)] ?? "application/octet-stream"), r.end(o);
  });
}
function Dj() {
  for (const t of Object.values(Dr.networkInterfaces()))
    for (const e of t ?? [])
      if (e.family === "IPv4" && !e.internal) return e.address;
  return "127.0.0.1";
}
function Mj(t) {
  Zn = t;
  const e = `data: ${JSON.stringify(Zn)}

`;
  for (const r of es) r.write(e);
}
function Gu() {
  return It !== null;
}
function l$() {
  return `http://${Dj()}:${c$}`;
}
function Vj(t) {
  It || (Dn = t.onCommand, Zn = il, It = xo.createServer((e, r) => {
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
      t.devServerUrl ? kj(t.devServerUrl, e.url, r) : Lj(t.distDir, e.url, r);
      return;
    }
    r.writeHead(404), r.end();
  }), It.on("error", () => {
  }), It.listen(c$, "0.0.0.0"));
}
function u$() {
  for (const t of es) t.end();
  es.clear(), It == null || It.close(), It = null, Dn = null, Zn = il;
}
const sn = 3847, d$ = 3848, Uo = "seedscreen", Bo = /* @__PURE__ */ new Map();
let Xt = null, We = null, Ks = null;
function f$() {
  for (const t of Object.values(Dr.networkInterfaces()))
    for (const e of t ?? [])
      if (e.family === "IPv4" && !e.internal) return e.address;
  return "127.0.0.1";
}
function Ko() {
  if (!We) return;
  const t = Buffer.from(
    JSON.stringify({
      app: Uo,
      type: "hello",
      hostname: Dr.hostname(),
      port: sn,
      songCount: fn().length
    })
  );
  try {
    We.send(t, 0, t.length, d$, "255.255.255.255");
  } catch {
  }
}
function Fj(t) {
  if (Xt || (Xt = xo.createServer((e, r) => {
    r.setHeader("Content-Type", "application/json"), r.setHeader("Access-Control-Allow-Origin", "*"), e.url === "/api/info" ? r.end(JSON.stringify({ hostname: Dr.hostname(), songCount: fn().length, port: sn, app: Uo })) : e.url === "/api/songs" ? r.end(JSON.stringify({ songs: fn() })) : (r.writeHead(404), r.end("{}"));
  }), Xt.on("error", () => {
  }), Xt.listen(sn, "0.0.0.0")), !We) {
    const e = f$();
    We = b$.createSocket({ type: "udp4", reuseAddr: !0 }), We.on("error", () => {
    }), We.on("message", (r, n) => {
      if (n.address !== e)
        try {
          const s = JSON.parse(r.toString());
          if (s.app !== Uo || s.type !== "hello") return;
          const a = {
            ip: n.address,
            hostname: s.hostname || n.address,
            port: s.port || sn,
            songCount: s.songCount || 0,
            lastSeen: Date.now()
          };
          Bo.set(n.address, a), t == null || t(a);
        } catch {
        }
    }), We.bind(d$, () => {
      We == null || We.setBroadcast(!0), Ko();
    }), Ks = setInterval(Ko, 6e3);
  }
}
function qj() {
  return { ip: f$(), hostname: Dr.hostname(), port: sn, songCount: fn().length };
}
function h$() {
  const t = Date.now() - 2e4, e = [];
  for (const [r, n] of Bo)
    n.lastSeen > t ? e.push(n) : Bo.delete(r);
  return e;
}
function zj() {
  Ko();
}
function Uj(t, e) {
  return new Promise((r, n) => {
    const s = xo.request(
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
function Bj() {
  Ks && clearInterval(Ks), We == null || We.close(), Xt == null || Xt.close(), Ks = null, We = null, Xt = null;
}
const Ae = new RI({
  defaults: { theme: "marino", backgrounds: [], logo: null, images: [] }
}), Kj = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};
function m$() {
  const t = Zh.showOpenDialogSync({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg"] }]
  }), e = t == null ? void 0 : t[0];
  if (!e) return null;
  const r = Y.extname(e).toLowerCase(), n = Kj[r] ?? "application/octet-stream", s = Z.readFileSync(e).toString("base64");
  return {
    name: Y.basename(e, r),
    dataUrl: `data:${n};base64,${s}`
  };
}
const xu = ["mp4", "webm", "mov", "m4v"], Qj = ["png", "jpg", "jpeg", "gif", "webp"];
function Gj() {
  const t = Y.join(Lt.getPath("userData"), "media");
  return Z.mkdirSync(t, { recursive: !0 }), t;
}
function xj() {
  const t = Zh.showOpenDialogSync({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Media", extensions: [...Qj, ...xu] }]
  });
  for (const e of t ?? []) {
    const r = Y.extname(e).toLowerCase().slice(1), n = xu.includes(r) ? "video" : "image", s = Y.join(Gj(), `${Qo()}.${r}`);
    Z.copyFileSync(e, s), jj({ type: n, title: Y.basename(e, Y.extname(e)), filePath: s });
  }
}
let js = null;
function cl() {
  if (js) return js;
  const t = Y.join(process.resourcesPath, "bible.json"), e = Y.join(ka, "../resources/bible.json"), r = Z.existsSync(t) ? t : e;
  return js = JSON.parse(Z.readFileSync(r, "utf-8")), js;
}
const p$ = {
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
const ka = Y.dirname(v$(import.meta.url));
process.env.APP_ROOT = Y.join(ka, "..");
const hn = process.env.VITE_DEV_SERVER_URL, yC = Y.join(process.env.APP_ROOT, "dist-electron"), La = Y.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = hn ? Y.join(process.env.APP_ROOT, "public") : La;
let ee;
function y$() {
  ee = new Go({
    width: 1920,
    height: 1080,
    backgroundColor: "#0e1b2e",
    icon: Y.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: Y.join(ka, "preload.mjs")
    }
  }), ee.webContents.on("did-finish-load", () => {
    ee == null || ee.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), hn ? ee.loadURL(hn) : ee.loadFile(Y.join(La, "index.html"));
}
let Ee = null;
function Hj(t) {
  const e = an.getAllDisplays(), r = an.getPrimaryDisplay(), n = (t ? e.find((o) => o.id === t) : e.find((o) => o.id !== r.id)) ?? r, s = n.id !== r.id, a = n.bounds;
  Ee = new Go({
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
      preload: Y.join(ka, "preload.mjs"),
      // Output videos must start playing the instant they're sent — there's no user
      // gesture available on the audience screen to satisfy the default autoplay policy.
      autoplayPolicy: "no-user-gesture-required"
    }
  }), hn ? Ee.loadURL(`${hn}#output`) : Ee.loadFile(Y.join(La, "index.html"), { hash: "output" }), Ee.on("closed", () => {
    Ee = null, ee == null || ee.webContents.send("output-window-closed");
  });
}
Lt.on("window-all-closed", () => {
  process.platform !== "darwin" && (Lt.quit(), ee = null);
});
const Jj = process.platform === "darwin", Wj = [
  // En macOS, el primer menú suele ser el nombre de la app.
  // Usamos el operador spread (...) para insertarlo solo si es Mac.
  ...Jj ? [
    {
      label: Lt.name,
      submenu: [
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => ee == null ? void 0 : ee.webContents.send("open-settings")
        },
        { label: "About", accelerator: "CmdOrCtrl+D" },
        { type: "separator" },
        { role: "quit", label: "Quit" }
      ]
    }
  ] : [],
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
        click: () => ee == null ? void 0 : ee.webContents.send("menu-new-song")
      },
      {
        label: "New song with AI",
        accelerator: "CmdOrCtrl+Shift+I",
        click: () => ee == null ? void 0 : ee.webContents.send("menu-new-song-ai")
      }
    ]
  },
  {
    label: "Presentation",
    submenu: [
      {
        label: "Project",
        accelerator: "CmdOrCtrl+P",
        click: () => ee == null ? void 0 : ee.webContents.send("menu-toggle-output")
      },
      { type: "separator" },
      {
        label: "Show black screen",
        accelerator: "B",
        click: () => ee == null ? void 0 : ee.webContents.send("menu-go-black")
      },
      {
        label: "Show logo",
        accelerator: "L",
        click: () => ee == null ? void 0 : ee.webContents.send("menu-show-logo")
      },
      { type: "separator" },
      {
        label: "Remote Control",
        type: "checkbox",
        checked: !1,
        accelerator: "CmdOrCtrl+Shift+R",
        click: (t) => {
          t.checked ? (Vj({
            devServerUrl: hn,
            distDir: La,
            onCommand: (e) => ee == null ? void 0 : ee.webContents.send("remote:command", e)
          }), ee == null || ee.webContents.send("remote:status-changed", {
            active: !0,
            url: l$()
          })) : (u$(), ee == null || ee.webContents.send("remote:status-changed", { active: !1, url: null }));
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
  const t = m$();
  return t ? (Ae.set("logo", t.dataUrl), t.dataUrl) : null;
});
fe.handle("settings:clear-logo", () => (Ae.set("logo", null), !0));
fe.handle(
  "backgrounds:add",
  (t, e) => {
    const r = { id: Qo(), ...e };
    return Ae.set("backgrounds", [...Ae.get("backgrounds"), r]), r;
  }
);
fe.handle("backgrounds:delete", (t, e) => (Ae.set(
  "backgrounds",
  Ae.get("backgrounds").filter((r) => r.id !== e)
), !0));
fe.handle("images:add", () => {
  const t = m$();
  if (t) {
    const e = { id: Qo(), ...t };
    Ae.set("images", [...Ae.get("images"), e]);
  }
  return Ae.get("images");
});
fe.handle("images:delete", (t, e) => (Ae.set(
  "images",
  Ae.get("images").filter((r) => r.id !== e)
), Ae.get("images")));
fe.handle("sync:get-local-info", () => qj());
fe.handle("sync:get-peers", () => h$());
fe.handle("sync:search-peers", async () => (zj(), await new Promise((t) => setTimeout(t, 2500)), h$()));
fe.handle("sync:fetch-songs", (t, e, r) => Uj(e, r));
fe.handle("sync:import-songs", (t, e) => Ij(e));
fe.handle("remote:get-status", () => ({
  active: Gu(),
  url: Gu() ? l$() : null
}));
fe.handle("remote:push-state", (t, e) => (Mj(e), !0));
fe.handle("output:toggle", (t, e) => Ee ? (Ee.close(), { opened: !1 }) : (Hj(e), { opened: !0 }));
fe.handle("output:get-status", () => ({ isOpen: Ee !== null }));
fe.handle("displays:get-all", () => {
  const t = an.getAllDisplays(), e = an.getPrimaryDisplay();
  return t.map((r) => ({
    id: r.id,
    label: r.id === e.id ? "Primary Display" : "External Monitor",
    isPrimary: r.id === e.id
  }));
});
fe.handle("output:send-slide", (t, e) => (Ee == null || Ee.webContents.send("show-slide", e), !0));
fe.handle("output:go-black", () => (Ee == null || Ee.webContents.send("go-black"), !0));
fe.handle("output:show-image", (t, e) => (Ee == null || Ee.webContents.send("show-image", e), !0));
fe.handle("output:show-video", (t, e) => (Ee == null || Ee.webContents.send("show-video", e), !0));
fe.handle("songs:get-all", () => fn());
fe.handle("songs:add", (t, e) => i$(e));
fe.handle("songs:update", (t, e, r) => Oj(e, r));
fe.handle("songs:delete", (t, e) => Rj(e));
fe.handle("media:get-all", () => ol());
fe.handle("media:add", () => (xj(), ol()));
fe.handle("media:delete", (t, e) => {
  const r = Cj(e);
  return r && Z.rm(r.filePath, { force: !0 }, () => {
  }), ol();
});
fe.handle("bible:get-books", () => cl().books.map((t, e) => ({
  id: t.book_usfm,
  name: t.name,
  abbr: p$[t.book_usfm] ?? t.book_usfm,
  chapterCount: t.chapters.filter((r) => r.is_chapter !== !1).length,
  index: e
})));
fe.handle("bible:get-chapter", (t, e, r) => {
  const n = cl().books.find((o) => o.book_usfm === e);
  if (!n) return [];
  const a = n.chapters.filter((o) => o.is_chapter !== !1)[r - 1];
  return a ? a.items.filter((o) => o.type === "verse" && o.verse_numbers.length > 0).map((o) => ({ v: o.verse_numbers[0], t: o.lines.join(" ") })) : [];
});
fe.handle("bible:search", (t, e) => {
  if (!e || e.length < 3) return [];
  const r = e.toLowerCase(), n = [];
  for (const s of cl().books) {
    const a = p$[s.book_usfm] ?? s.book_usfm, o = s.chapters.filter((i) => i.is_chapter !== !1);
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
  Go.getAllWindows().length === 0 && y$();
});
Lt.whenReady().then(() => {
  y$();
  const t = dl.buildFromTemplate(Wj);
  dl.setApplicationMenu(t), an.on("display-added", () => ee == null ? void 0 : ee.webContents.send("displays-changed")), an.on("display-removed", () => ee == null ? void 0 : ee.webContents.send("displays-changed")), Fj((e) => ee == null ? void 0 : ee.webContents.send("sync-peer-found", e));
});
Lt.on("before-quit", () => {
  Bj(), u$();
});
export {
  yC as MAIN_DIST,
  La as RENDERER_DIST,
  hn as VITE_DEV_SERVER_URL
};
