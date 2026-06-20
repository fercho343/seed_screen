var Hy = Object.defineProperty;
var Yc = (t) => {
  throw TypeError(t);
};
var Jy = (t, e, r) => e in t ? Hy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var N = (t, e, r) => Jy(t, typeof e != "symbol" ? e + "" : e, r), Zc = (t, e, r) => e.has(t) || Yc("Cannot " + r);
var be = (t, e, r) => (Zc(t, e, "read from private field"), r ? r.call(t) : e.get(t)), pn = (t, e, r) => e.has(t) ? Yc("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), yn = (t, e, r, n) => (Zc(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r);
import $n, { randomUUID as Lo } from "node:crypto";
import se from "node:fs";
import ne from "node:path";
import { fileURLToPath as Wy } from "node:url";
import Kh, { app as Ft, ipcMain as ye, screen as Yr, BrowserWindow as Do, Menu as el, dialog as Qh } from "electron";
import Se from "node:process";
import { promisify as Ue, isDeepStrictEqual as Xy } from "node:util";
import Yy from "node:assert";
import Ir from "node:os";
import "node:events";
import "node:stream";
import bn from "better-sqlite3";
import Mo from "node:http";
import Zy from "node:dgram";
const wr = (t) => {
  const e = typeof t;
  return t !== null && (e === "object" || e === "function");
}, Ra = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), e$ = new Set("0123456789");
function ta(t) {
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
        if (Ra.has(r))
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
          if (Ra.has(r))
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
        if (n === "index" && !e$.has(a))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += a;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (Ra.has(r))
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
function Vo(t, e) {
  if (typeof e != "number" && Array.isArray(t)) {
    const r = Number.parseInt(e, 10);
    return Number.isInteger(r) && t[r] === t[e];
  }
  return !1;
}
function Gh(t, e) {
  if (Vo(t, e))
    throw new Error("Cannot use string index");
}
function t$(t, e, r) {
  if (!wr(t) || typeof e != "string")
    return r === void 0 ? t : r;
  const n = ta(e);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (Vo(t, a) ? t = s === n.length - 1 ? void 0 : null : t = t[a], t == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return t === void 0 ? r : t;
}
function tl(t, e, r) {
  if (!wr(t) || typeof e != "string")
    return t;
  const n = t, s = ta(e);
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    Gh(t, o), a === s.length - 1 ? t[o] = r : wr(t[o]) || (t[o] = typeof s[a + 1] == "number" ? [] : {}), t = t[o];
  }
  return n;
}
function r$(t, e) {
  if (!wr(t) || typeof e != "string")
    return !1;
  const r = ta(e);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (Gh(t, s), n === r.length - 1)
      return delete t[s], !0;
    if (t = t[s], !wr(t))
      return !1;
  }
}
function n$(t, e) {
  if (!wr(t) || typeof e != "string")
    return !1;
  const r = ta(e);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!wr(t) || !(n in t) || Vo(t, n))
      return !1;
    t = t[n];
  }
  return !0;
}
const Yt = Ir.homedir(), qo = Ir.tmpdir(), { env: Ur } = Se, s$ = (t) => {
  const e = ne.join(Yt, "Library");
  return {
    data: ne.join(e, "Application Support", t),
    config: ne.join(e, "Preferences", t),
    cache: ne.join(e, "Caches", t),
    log: ne.join(e, "Logs", t),
    temp: ne.join(qo, t)
  };
}, a$ = (t) => {
  const e = Ur.APPDATA || ne.join(Yt, "AppData", "Roaming"), r = Ur.LOCALAPPDATA || ne.join(Yt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ne.join(r, t, "Data"),
    config: ne.join(e, t, "Config"),
    cache: ne.join(r, t, "Cache"),
    log: ne.join(r, t, "Log"),
    temp: ne.join(qo, t)
  };
}, o$ = (t) => {
  const e = ne.basename(Yt);
  return {
    data: ne.join(Ur.XDG_DATA_HOME || ne.join(Yt, ".local", "share"), t),
    config: ne.join(Ur.XDG_CONFIG_HOME || ne.join(Yt, ".config"), t),
    cache: ne.join(Ur.XDG_CACHE_HOME || ne.join(Yt, ".cache"), t),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ne.join(Ur.XDG_STATE_HOME || ne.join(Yt, ".local", "state"), t),
    temp: ne.join(qo, e, t)
  };
};
function i$(t, { suffix: e = "nodejs" } = {}) {
  if (typeof t != "string")
    throw new TypeError(`Expected a string, got ${typeof t}`);
  return e && (t += `-${e}`), Se.platform === "darwin" ? s$(t) : Se.platform === "win32" ? a$(t) : o$(t);
}
const Bt = (t, e) => {
  const { onError: r } = e;
  return function(...s) {
    return t.apply(void 0, s).catch(r);
  };
}, Rt = (t, e) => {
  const { onError: r } = e;
  return function(...s) {
    try {
      return t.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, c$ = 250, Kt = (t, e) => {
  const { isRetriable: r } = e;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? c$, i = Date.now() + a;
    return function c(...d) {
      return t.apply(void 0, d).catch((l) => {
        if (!r(l) || Date.now() >= i)
          throw l;
        const h = Math.round(o * Math.random());
        return h > 0 ? new Promise((p) => setTimeout(p, h)).then(() => c.apply(void 0, d)) : c.apply(void 0, d);
      });
    };
  };
}, Qt = (t, e) => {
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
}, Br = {
  /* API */
  isChangeErrorOk: (t) => {
    if (!Br.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "ENOSYS" || !l$ && (e === "EINVAL" || e === "EPERM");
  },
  isNodeError: (t) => t instanceof Error,
  isRetriableError: (t) => {
    if (!Br.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "EMFILE" || e === "ENFILE" || e === "EAGAIN" || e === "EBUSY" || e === "EACCESS" || e === "EACCES" || e === "EACCS" || e === "EPERM";
  },
  onChangeError: (t) => {
    if (!Br.isNodeError(t))
      throw t;
    if (!Br.isChangeErrorOk(t))
      throw t;
  }
}, es = {
  onError: Br.onChangeError
}, ot = {
  onError: () => {
  }
}, l$ = Se.getuid ? !Se.getuid() : !1, Be = {
  isRetriable: Br.isRetriableError
}, Qe = {
  attempt: {
    /* ASYNC */
    chmod: Bt(Ue(se.chmod), es),
    chown: Bt(Ue(se.chown), es),
    close: Bt(Ue(se.close), ot),
    fsync: Bt(Ue(se.fsync), ot),
    mkdir: Bt(Ue(se.mkdir), ot),
    realpath: Bt(Ue(se.realpath), ot),
    stat: Bt(Ue(se.stat), ot),
    unlink: Bt(Ue(se.unlink), ot),
    /* SYNC */
    chmodSync: Rt(se.chmodSync, es),
    chownSync: Rt(se.chownSync, es),
    closeSync: Rt(se.closeSync, ot),
    existsSync: Rt(se.existsSync, ot),
    fsyncSync: Rt(se.fsync, ot),
    mkdirSync: Rt(se.mkdirSync, ot),
    realpathSync: Rt(se.realpathSync, ot),
    statSync: Rt(se.statSync, ot),
    unlinkSync: Rt(se.unlinkSync, ot)
  },
  retry: {
    /* ASYNC */
    close: Kt(Ue(se.close), Be),
    fsync: Kt(Ue(se.fsync), Be),
    open: Kt(Ue(se.open), Be),
    readFile: Kt(Ue(se.readFile), Be),
    rename: Kt(Ue(se.rename), Be),
    stat: Kt(Ue(se.stat), Be),
    write: Kt(Ue(se.write), Be),
    writeFile: Kt(Ue(se.writeFile), Be),
    /* SYNC */
    closeSync: Qt(se.closeSync, Be),
    fsyncSync: Qt(se.fsyncSync, Be),
    openSync: Qt(se.openSync, Be),
    readFileSync: Qt(se.readFileSync, Be),
    renameSync: Qt(se.renameSync, Be),
    statSync: Qt(se.statSync, Be),
    writeSync: Qt(se.writeSync, Be),
    writeFileSync: Qt(se.writeFileSync, Be)
  }
}, u$ = "utf8", rl = 438, d$ = 511, f$ = {}, h$ = Se.geteuid ? Se.geteuid() : -1, m$ = Se.getegid ? Se.getegid() : -1, p$ = 1e3, y$ = !!Se.getuid;
Se.getuid && Se.getuid();
const nl = 128, $$ = (t) => t instanceof Error && "code" in t, sl = (t) => typeof t == "string", Ia = (t) => t === void 0, g$ = Se.platform === "linux", xh = Se.platform === "win32", Fo = ["SIGHUP", "SIGINT", "SIGTERM"];
xh || Fo.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
g$ && Fo.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class v$ {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (e) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        e && (xh && e !== "SIGINT" && e !== "SIGTERM" && e !== "SIGKILL" ? Se.kill(Se.pid, "SIGTERM") : Se.kill(Se.pid, e));
      }
    }, this.hook = () => {
      Se.once("exit", () => this.exit());
      for (const e of Fo)
        try {
          Se.once(e, () => this.exit(e));
        } catch {
        }
    }, this.register = (e) => (this.callbacks.add(e), () => {
      this.callbacks.delete(e);
    }), this.hook();
  }
}
const _$ = new v$(), w$ = _$.register, Ge = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (t) => {
    const e = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${e}`;
    return `${t}${s}`;
  },
  get: (t, e, r = !0) => {
    const n = Ge.truncate(e(t));
    return n in Ge.store ? Ge.get(t, e, r) : (Ge.store[n] = r, [n, () => delete Ge.store[n]]);
  },
  purge: (t) => {
    Ge.store[t] && (delete Ge.store[t], Qe.attempt.unlink(t));
  },
  purgeSync: (t) => {
    Ge.store[t] && (delete Ge.store[t], Qe.attempt.unlinkSync(t));
  },
  purgeSyncAll: () => {
    for (const t in Ge.store)
      Ge.purgeSync(t);
  },
  truncate: (t) => {
    const e = ne.basename(t);
    if (e.length <= nl)
      return t;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(e);
    if (!r)
      return t;
    const n = e.length - nl;
    return `${t.slice(0, -e.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
w$(Ge.purgeSyncAll);
function Hh(t, e, r = f$) {
  if (sl(r))
    return Hh(t, e, { encoding: r });
  const s = { timeout: r.timeout ?? p$ };
  let a = null, o = null, i = null;
  try {
    const c = Qe.attempt.realpathSync(t), d = !!c;
    t = c || t, [o, a] = Ge.get(t, r.tmpCreate || Ge.create, r.tmpPurge !== !1);
    const l = y$ && Ia(r.chown), h = Ia(r.mode);
    if (d && (l || h)) {
      const g = Qe.attempt.statSync(t);
      g && (r = { ...r }, l && (r.chown = { uid: g.uid, gid: g.gid }), h && (r.mode = g.mode));
    }
    if (!d) {
      const g = ne.dirname(t);
      Qe.attempt.mkdirSync(g, {
        mode: d$,
        recursive: !0
      });
    }
    i = Qe.retry.openSync(s)(o, "w", r.mode || rl), r.tmpCreated && r.tmpCreated(o), sl(e) ? Qe.retry.writeSync(s)(i, e, 0, r.encoding || u$) : Ia(e) || Qe.retry.writeSync(s)(i, e, 0, e.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Qe.retry.fsyncSync(s)(i) : Qe.attempt.fsync(i)), Qe.retry.closeSync(s)(i), i = null, r.chown && (r.chown.uid !== h$ || r.chown.gid !== m$) && Qe.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== rl && Qe.attempt.chmodSync(o, r.mode);
    try {
      Qe.retry.renameSync(s)(o, t);
    } catch (g) {
      if (!$$(g) || g.code !== "ENAMETOOLONG")
        throw g;
      Qe.retry.renameSync(s)(o, Ge.truncate(t));
    }
    a(), o = null;
  } finally {
    i && Qe.attempt.closeSync(i), o && Ge.purge(o);
  }
}
function Jh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Xa = { exports: {} }, Wh = {}, bt = {}, Zr = {}, Qn = {}, ce = {}, Vn = {};
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
      return (b = this._str) !== null && b !== void 0 ? b : this._str = this._items.reduce((T, R) => `${T}${R}`, "");
    }
    get names() {
      var b;
      return (b = this._names) !== null && b !== void 0 ? b : this._names = this._items.reduce((T, R) => (R instanceof r && (T[R.str] = (T[R.str] || 0) + 1), T), {});
    }
  }
  t._Code = n, t.nil = new n("");
  function s(m, ...b) {
    const T = [m[0]];
    let R = 0;
    for (; R < b.length; )
      i(T, b[R]), T.push(m[++R]);
    return new n(T);
  }
  t._ = s;
  const a = new n("+");
  function o(m, ...b) {
    const T = [p(m[0])];
    let R = 0;
    for (; R < b.length; )
      T.push(a), i(T, b[R]), T.push(a, p(m[++R]));
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
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : p(Array.isArray(m) ? m.join(",") : m);
  }
  function g(m) {
    return new n(p(m));
  }
  t.stringify = g;
  function p(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  t.safeStringify = p;
  function w(m) {
    return typeof m == "string" && t.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  t.getProperty = w;
  function $(m) {
    if (typeof m == "string" && t.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  t.getEsmExportName = $;
  function v(m) {
    return new n(m.toString());
  }
  t.regexpCode = v;
})(Vn);
var Ya = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.ValueScope = t.ValueScopeName = t.Scope = t.varKinds = t.UsedValueState = void 0;
  const e = Vn;
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
      const g = this.toName(d), { prefix: p } = g, w = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let $ = this._values[p];
      if ($) {
        const b = $.get(w);
        if (b)
          return b;
      } else
        $ = this._values[p] = /* @__PURE__ */ new Map();
      $.set(w, g);
      const v = this._scope[p] || (this._scope[p] = []), m = v.length;
      return v[m] = l.ref, g.setValue(l, { property: p, itemIndex: m }), g;
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
      return this._reduceValues(d, (g) => {
        if (g.value === void 0)
          throw new Error(`CodeGen: name "${g}" has no value`);
        return g.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, g) {
      let p = e.nil;
      for (const w in d) {
        const $ = d[w];
        if (!$)
          continue;
        const v = h[w] = h[w] || /* @__PURE__ */ new Map();
        $.forEach((m) => {
          if (v.has(m))
            return;
          v.set(m, n.Started);
          let b = l(m);
          if (b) {
            const T = this.opts.es5 ? t.varKinds.var : t.varKinds.const;
            p = (0, e._)`${p}${T} ${m} = ${b};${this.opts._n}`;
          } else if (b = g == null ? void 0 : g(m))
            p = (0, e._)`${p}${b}${this.opts._n}`;
          else
            throw new r(m);
          v.set(m, n.Completed);
        });
      }
      return p;
    }
  }
  t.ValueScope = i;
})(Ya);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.or = t.and = t.not = t.CodeGen = t.operators = t.varKinds = t.ValueScopeName = t.ValueScope = t.Scope = t.Name = t.regexpCode = t.stringify = t.getProperty = t.nil = t.strConcat = t.str = t._ = void 0;
  const e = Vn, r = Ya;
  var n = Vn;
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
  var s = Ya;
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
      const S = u ? r.varKinds.var : this.varKind, A = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${A};` + f;
    }
    optimizeNames(u, f) {
      if (u[this.name.str])
        return this.rhs && (this.rhs = K(this.rhs, u, f)), this;
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
        return this.rhs = K(this.rhs, u, f), this;
    }
    get names() {
      const u = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return Z(u, this.rhs);
    }
  }
  class c extends i {
    constructor(u, f, S, A) {
      super(u, S, A), this.op = f;
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
  class g extends a {
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
      return this.code = K(this.code, u, f), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class p extends a {
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
      let A = S.length;
      for (; A--; ) {
        const k = S[A];
        k.optimizeNames(u, f) || (pe(u, k.names), S.splice(A, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((u, f) => X(u, f.names), {});
    }
  }
  class w extends p {
    render(u) {
      return "{" + u._n + super.render(u) + "}" + u._n;
    }
  }
  class $ extends p {
  }
  class v extends w {
  }
  v.kind = "else";
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
        f = this.else = Array.isArray(S) ? new v(S) : S;
      }
      if (f)
        return u === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(Ee(u), f instanceof m ? [f] : f.nodes);
      if (!(u === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(u, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(u, f), !!(super.optimizeNames(u, f) || this.else))
        return this.condition = K(this.condition, u, f), this;
    }
    get names() {
      const u = super.names;
      return Z(u, this.condition), this.else && X(u, this.else.names), u;
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
        return this.iteration = K(this.iteration, u, f), this;
    }
    get names() {
      return X(super.names, this.iteration.names);
    }
  }
  class R extends b {
    constructor(u, f, S, A) {
      super(), this.varKind = u, this.name = f, this.from = S, this.to = A;
    }
    render(u) {
      const f = u.es5 ? r.varKinds.var : this.varKind, { name: S, from: A, to: k } = this;
      return `for(${f} ${S}=${A}; ${S}<${k}; ${S}++)` + super.render(u);
    }
    get names() {
      const u = Z(super.names, this.from);
      return Z(u, this.to);
    }
  }
  class j extends b {
    constructor(u, f, S, A) {
      super(), this.loop = u, this.varKind = f, this.name = S, this.iterable = A;
    }
    render(u) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(u);
    }
    optimizeNames(u, f) {
      if (super.optimizeNames(u, f))
        return this.iterable = K(this.iterable, u, f), this;
    }
    get names() {
      return X(super.names, this.iterable.names);
    }
  }
  class U extends w {
    constructor(u, f, S) {
      super(), this.name = u, this.args = f, this.async = S;
    }
    render(u) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(u);
    }
  }
  U.kind = "func";
  class M extends p {
    render(u) {
      return "return " + super.render(u);
    }
  }
  M.kind = "return";
  class te extends w {
    render(u) {
      let f = "try" + super.render(u);
      return this.catch && (f += this.catch.render(u)), this.finally && (f += this.finally.render(u)), f;
    }
    optimizeNodes() {
      var u, f;
      return super.optimizeNodes(), (u = this.catch) === null || u === void 0 || u.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(u, f) {
      var S, A;
      return super.optimizeNames(u, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(u, f), (A = this.finally) === null || A === void 0 || A.optimizeNames(u, f), this;
    }
    get names() {
      const u = super.names;
      return this.catch && X(u, this.catch.names), this.finally && X(u, this.finally.names), u;
    }
  }
  class fe extends w {
    constructor(u) {
      super(), this.error = u;
    }
    render(u) {
      return `catch(${this.error})` + super.render(u);
    }
  }
  fe.kind = "catch";
  class $e extends w {
    render(u) {
      return "finally" + super.render(u);
    }
  }
  $e.kind = "finally";
  class x {
    constructor(u, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = u, this._scope = new r.Scope({ parent: u }), this._nodes = [new $()];
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
    _def(u, f, S, A) {
      const k = this._scope.toName(f);
      return S !== void 0 && A && (this._constants[k.str] = S), this._leafNode(new o(u, k, S)), k;
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
      return typeof u == "function" ? u() : u !== e.nil && this._leafNode(new g(u)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...u) {
      const f = ["{"];
      for (const [S, A] of u)
        f.length > 1 && f.push(","), f.push(S), (S !== A || this.opts.es5) && (f.push(":"), (0, e.addCodeArg)(f, A));
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
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, v);
    }
    _for(u, f) {
      return this._blockNode(u), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(u, f) {
      return this._for(new T(u), f);
    }
    // `for` statement for a range of values
    forRange(u, f, S, A, k = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const H = this._scope.toName(u);
      return this._for(new R(k, H, f, S), () => A(H));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(u, f, S, A = r.varKinds.const) {
      const k = this._scope.toName(u);
      if (this.opts.es5) {
        const H = f instanceof e.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, e._)`${H}.length`, (W) => {
          this.var(k, (0, e._)`${H}[${W}]`), S(k);
        });
      }
      return this._for(new j("of", A, k, f), () => S(k));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(u, f, S, A = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(u, (0, e._)`Object.keys(${f})`, S);
      const k = this._scope.toName(u);
      return this._for(new j("in", A, k, f), () => S(k));
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
      const f = new M();
      if (this._blockNode(f), this.code(u), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(M);
    }
    // `try` statement
    try(u, f, S) {
      if (!f && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const A = new te();
      if (this._blockNode(A), this.code(u), f) {
        const k = this.name("e");
        this._currNode = A.catch = new fe(k), f(k);
      }
      return S && (this._currNode = A.finally = new $e(), this.code(S)), this._endBlockNode(fe, $e);
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
    func(u, f = e.nil, S, A) {
      return this._blockNode(new U(u, f, S)), A && this.code(A).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(U);
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
  t.CodeGen = x;
  function X(_, u) {
    for (const f in u)
      _[f] = (_[f] || 0) + (u[f] || 0);
    return _;
  }
  function Z(_, u) {
    return u instanceof e._CodeOrName ? X(_, u.names) : _;
  }
  function K(_, u, f) {
    if (_ instanceof e.Name)
      return S(_);
    if (!A(_))
      return _;
    return new e._Code(_._items.reduce((k, H) => (H instanceof e.Name && (H = S(H)), H instanceof e._Code ? k.push(...H._items) : k.push(H), k), []));
    function S(k) {
      const H = f[k.str];
      return H === void 0 || u[k.str] !== 1 ? k : (delete u[k.str], H);
    }
    function A(k) {
      return k instanceof e._Code && k._items.some((H) => H instanceof e.Name && u[H.str] === 1 && f[H.str] !== void 0);
    }
  }
  function pe(_, u) {
    for (const f in u)
      _[f] = (_[f] || 0) - (u[f] || 0);
  }
  function Ee(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, e._)`!${E(_)}`;
  }
  t.not = Ee;
  const F = y(t.operators.AND);
  function q(..._) {
    return _.reduce(F);
  }
  t.and = q;
  const J = y(t.operators.OR);
  function P(..._) {
    return _.reduce(J);
  }
  t.or = P;
  function y(_) {
    return (u, f) => u === e.nil ? f : f === e.nil ? u : (0, e._)`${E(u)} ${_} ${E(f)}`;
  }
  function E(_) {
    return _ instanceof e.Name ? _ : (0, e._)`(${_})`;
  }
})(ce);
var B = {};
Object.defineProperty(B, "__esModule", { value: !0 });
B.checkStrictMode = B.getErrorPath = B.Type = B.useFunc = B.setEvaluated = B.evaluatedPropsToName = B.mergeEvaluated = B.eachItem = B.unescapeJsonPointer = B.escapeJsonPointer = B.escapeFragment = B.unescapeFragment = B.schemaRefOrVal = B.schemaHasRulesButRef = B.schemaHasRules = B.checkUnknownRules = B.alwaysValidSchema = B.toHash = void 0;
const ge = ce, b$ = Vn;
function S$(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
B.toHash = S$;
function E$(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (Xh(t, e), !Yh(e, t.self.RULES.all));
}
B.alwaysValidSchema = E$;
function Xh(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || tm(t, `unknown keyword: "${a}"`);
}
B.checkUnknownRules = Xh;
function Yh(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
B.schemaHasRules = Yh;
function N$(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
B.schemaHasRulesButRef = N$;
function P$({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ge._)`${r}`;
  }
  return (0, ge._)`${t}${e}${(0, ge.getProperty)(n)}`;
}
B.schemaRefOrVal = P$;
function T$(t) {
  return Zh(decodeURIComponent(t));
}
B.unescapeFragment = T$;
function O$(t) {
  return encodeURIComponent(zo(t));
}
B.escapeFragment = O$;
function zo(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
B.escapeJsonPointer = zo;
function Zh(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
B.unescapeJsonPointer = Zh;
function R$(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
B.eachItem = R$;
function al({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof ge.Name ? (a instanceof ge.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof ge.Name ? (e(s, o, a), a) : r(a, o);
    return i === ge.Name && !(c instanceof ge.Name) ? n(s, c) : c;
  };
}
B.mergeEvaluated = {
  props: al({
    mergeNames: (t, e, r) => t.if((0, ge._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, ge._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, ge._)`${r} || {}`).code((0, ge._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, ge._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, ge._)`${r} || {}`), Uo(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: em
  }),
  items: al({
    mergeNames: (t, e, r) => t.if((0, ge._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, ge._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, ge._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, ge._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function em(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, ge._)`{}`);
  return e !== void 0 && Uo(t, r, e), r;
}
B.evaluatedPropsToName = em;
function Uo(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, ge._)`${e}${(0, ge.getProperty)(n)}`, !0));
}
B.setEvaluated = Uo;
const ol = {};
function I$(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: ol[e.code] || (ol[e.code] = new b$._Code(e.code))
  });
}
B.useFunc = I$;
var Za;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(Za || (B.Type = Za = {}));
function j$(t, e, r) {
  if (t instanceof ge.Name) {
    const n = e === Za.Num;
    return r ? n ? (0, ge._)`"[" + ${t} + "]"` : (0, ge._)`"['" + ${t} + "']"` : n ? (0, ge._)`"/" + ${t}` : (0, ge._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ge.getProperty)(t).toString() : "/" + zo(t);
}
B.getErrorPath = j$;
function tm(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
B.checkStrictMode = tm;
var lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
const Ke = ce, C$ = {
  // validation function arguments
  data: new Ke.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ke.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ke.Name("instancePath"),
  parentData: new Ke.Name("parentData"),
  parentDataProperty: new Ke.Name("parentDataProperty"),
  rootData: new Ke.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ke.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ke.Name("vErrors"),
  // null or array of validation errors
  errors: new Ke.Name("errors"),
  // counter of validation errors
  this: new Ke.Name("this"),
  // "globals"
  self: new Ke.Name("self"),
  scope: new Ke.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ke.Name("json"),
  jsonPos: new Ke.Name("jsonPos"),
  jsonLen: new Ke.Name("jsonLen"),
  jsonPart: new Ke.Name("jsonPart")
};
lt.default = C$;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
  const e = ce, r = B, n = lt;
  t.keywordError = {
    message: ({ keyword: v }) => (0, e.str)`must pass "${v}" keyword validation`
  }, t.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, e.str)`"${v}" keyword must be ${m} ($data)` : (0, e.str)`"${v}" keyword is invalid ($data)`
  };
  function s(v, m = t.keywordError, b, T) {
    const { it: R } = v, { gen: j, compositeRule: U, allErrors: M } = R, te = h(v, m, b);
    T ?? (U || M) ? c(j, te) : d(R, (0, e._)`[${te}]`);
  }
  t.reportError = s;
  function a(v, m = t.keywordError, b) {
    const { it: T } = v, { gen: R, compositeRule: j, allErrors: U } = T, M = h(v, m, b);
    c(R, M), j || U || d(T, n.default.vErrors);
  }
  t.reportExtraError = a;
  function o(v, m) {
    v.assign(n.default.errors, m), v.if((0, e._)`${n.default.vErrors} !== null`, () => v.if(m, () => v.assign((0, e._)`${n.default.vErrors}.length`, m), () => v.assign(n.default.vErrors, null)));
  }
  t.resetErrorsCount = o;
  function i({ gen: v, keyword: m, schemaValue: b, data: T, errsCount: R, it: j }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const U = v.name("err");
    v.forRange("i", R, n.default.errors, (M) => {
      v.const(U, (0, e._)`${n.default.vErrors}[${M}]`), v.if((0, e._)`${U}.instancePath === undefined`, () => v.assign((0, e._)`${U}.instancePath`, (0, e.strConcat)(n.default.instancePath, j.errorPath))), v.assign((0, e._)`${U}.schemaPath`, (0, e.str)`${j.errSchemaPath}/${m}`), j.opts.verbose && (v.assign((0, e._)`${U}.schema`, b), v.assign((0, e._)`${U}.data`, T));
    });
  }
  t.extendErrors = i;
  function c(v, m) {
    const b = v.const("err", m);
    v.if((0, e._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, e._)`[${b}]`), (0, e._)`${n.default.vErrors}.push(${b})`), v.code((0, e._)`${n.default.errors}++`);
  }
  function d(v, m) {
    const { gen: b, validateName: T, schemaEnv: R } = v;
    R.$async ? b.throw((0, e._)`new ${v.ValidationError}(${m})`) : (b.assign((0, e._)`${T}.errors`, m), b.return(!1));
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
  function h(v, m, b) {
    const { createErrors: T } = v.it;
    return T === !1 ? (0, e._)`{}` : g(v, m, b);
  }
  function g(v, m, b = {}) {
    const { gen: T, it: R } = v, j = [
      p(R, b),
      w(v, b)
    ];
    return $(v, m, j), T.object(...j);
  }
  function p({ errorPath: v }, { instancePath: m }) {
    const b = m ? (0, e.str)`${v}${(0, r.getErrorPath)(m, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, b)];
  }
  function w({ keyword: v, it: { errSchemaPath: m } }, { schemaPath: b, parentSchema: T }) {
    let R = T ? m : (0, e.str)`${m}/${v}`;
    return b && (R = (0, e.str)`${R}${(0, r.getErrorPath)(b, r.Type.Str)}`), [l.schemaPath, R];
  }
  function $(v, { params: m, message: b }, T) {
    const { keyword: R, data: j, schemaValue: U, it: M } = v, { opts: te, propertyName: fe, topSchemaRef: $e, schemaPath: x } = M;
    T.push([l.keyword, R], [l.params, typeof m == "function" ? m(v) : m || (0, e._)`{}`]), te.messages && T.push([l.message, typeof b == "function" ? b(v) : b]), te.verbose && T.push([l.schema, U], [l.parentSchema, (0, e._)`${$e}${x}`], [n.default.data, j]), fe && T.push([l.propertyName, fe]);
  }
})(Qn);
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.boolOrEmptySchema = Zr.topBoolOrEmptySchema = void 0;
const A$ = Qn, k$ = ce, L$ = lt, D$ = {
  message: "boolean schema is false"
};
function M$(t) {
  const { gen: e, schema: r, validateName: n } = t;
  r === !1 ? rm(t, !1) : typeof r == "object" && r.$async === !0 ? e.return(L$.default.data) : (e.assign((0, k$._)`${n}.errors`, null), e.return(!0));
}
Zr.topBoolOrEmptySchema = M$;
function V$(t, e) {
  const { gen: r, schema: n } = t;
  n === !1 ? (r.var(e, !1), rm(t)) : r.var(e, !0);
}
Zr.boolOrEmptySchema = V$;
function rm(t, e) {
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
  (0, A$.reportError)(s, D$, void 0, e);
}
var je = {}, br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.getRules = br.isJSONType = void 0;
const q$ = ["string", "number", "integer", "boolean", "null", "object", "array"], F$ = new Set(q$);
function z$(t) {
  return typeof t == "string" && F$.has(t);
}
br.isJSONType = z$;
function U$() {
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
br.getRules = U$;
var Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.shouldUseRule = Vt.shouldUseGroup = Vt.schemaHasRulesForType = void 0;
function B$({ schema: t, self: e }, r) {
  const n = e.RULES.types[r];
  return n && n !== !0 && nm(t, n);
}
Vt.schemaHasRulesForType = B$;
function nm(t, e) {
  return e.rules.some((r) => sm(t, r));
}
Vt.shouldUseGroup = nm;
function sm(t, e) {
  var r;
  return t[e.keyword] !== void 0 || ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => t[n] !== void 0));
}
Vt.shouldUseRule = sm;
Object.defineProperty(je, "__esModule", { value: !0 });
je.reportTypeError = je.checkDataTypes = je.checkDataType = je.coerceAndCheckDataType = je.getJSONTypes = je.getSchemaTypes = je.DataType = void 0;
const K$ = br, Q$ = Vt, G$ = Qn, le = ce, am = B;
var xr;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(xr || (je.DataType = xr = {}));
function x$(t) {
  const e = om(t.type);
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
je.getSchemaTypes = x$;
function om(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(K$.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
je.getJSONTypes = om;
function H$(t, e) {
  const { gen: r, data: n, opts: s } = t, a = J$(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, Q$.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = Bo(e, n, s.strictNumbers, xr.Wrong);
    r.if(i, () => {
      a.length ? W$(t, e, a) : Ko(t);
    });
  }
  return o;
}
je.coerceAndCheckDataType = H$;
const im = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function J$(t, e) {
  return e ? t.filter((r) => im.has(r) || e === "array" && r === "array") : [];
}
function W$(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, le._)`typeof ${s}`), i = n.let("coerced", (0, le._)`undefined`);
  a.coerceTypes === "array" && n.if((0, le._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, le._)`${s}[0]`).assign(o, (0, le._)`typeof ${s}`).if(Bo(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, le._)`${i} !== undefined`);
  for (const d of r)
    (im.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Ko(t), n.endIf(), n.if((0, le._)`${i} !== undefined`, () => {
    n.assign(s, i), X$(t, i);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, le._)`${o} == "number" || ${o} == "boolean"`).assign(i, (0, le._)`"" + ${s}`).elseIf((0, le._)`${s} === null`).assign(i, (0, le._)`""`);
        return;
      case "number":
        n.elseIf((0, le._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(i, (0, le._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, le._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(i, (0, le._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, le._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(i, !1).elseIf((0, le._)`${s} === "true" || ${s} === 1`).assign(i, !0);
        return;
      case "null":
        n.elseIf((0, le._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(i, null);
        return;
      case "array":
        n.elseIf((0, le._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(i, (0, le._)`[${s}]`);
    }
  }
}
function X$({ gen: t, parentData: e, parentDataProperty: r }, n) {
  t.if((0, le._)`${e} !== undefined`, () => t.assign((0, le._)`${e}[${r}]`, n));
}
function eo(t, e, r, n = xr.Correct) {
  const s = n === xr.Correct ? le.operators.EQ : le.operators.NEQ;
  let a;
  switch (t) {
    case "null":
      return (0, le._)`${e} ${s} null`;
    case "array":
      a = (0, le._)`Array.isArray(${e})`;
      break;
    case "object":
      a = (0, le._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      a = o((0, le._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, le._)`typeof ${e} ${s} ${t}`;
  }
  return n === xr.Correct ? a : (0, le.not)(a);
  function o(i = le.nil) {
    return (0, le.and)((0, le._)`typeof ${e} == "number"`, i, r ? (0, le._)`isFinite(${e})` : le.nil);
  }
}
je.checkDataType = eo;
function Bo(t, e, r, n) {
  if (t.length === 1)
    return eo(t[0], e, r, n);
  let s;
  const a = (0, am.toHash)(t);
  if (a.array && a.object) {
    const o = (0, le._)`typeof ${e} != "object"`;
    s = a.null ? o : (0, le._)`!${e} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = le.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, le.and)(s, eo(o, e, r, n));
  return s;
}
je.checkDataTypes = Bo;
const Y$ = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, le._)`{type: ${t}}` : (0, le._)`{type: ${e}}`
};
function Ko(t) {
  const e = Z$(t);
  (0, G$.reportError)(e, Y$);
}
je.reportTypeError = Ko;
function Z$(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, am.schemaRefOrVal)(t, n, "type");
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
var ra = {};
Object.defineProperty(ra, "__esModule", { value: !0 });
ra.assignDefaults = void 0;
const kr = ce, eg = B;
function tg(t, e) {
  const { properties: r, items: n } = t.schema;
  if (e === "object" && r)
    for (const s in r)
      il(t, s, r[s].default);
  else e === "array" && Array.isArray(n) && n.forEach((s, a) => il(t, a, s.default));
}
ra.assignDefaults = tg;
function il(t, e, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = t;
  if (r === void 0)
    return;
  const i = (0, kr._)`${a}${(0, kr.getProperty)(e)}`;
  if (s) {
    (0, eg.checkStrictMode)(t, `default is ignored for: ${i}`);
    return;
  }
  let c = (0, kr._)`${i} === undefined`;
  o.useDefaults === "empty" && (c = (0, kr._)`${c} || ${i} === null || ${i} === ""`), n.if(c, (0, kr._)`${i} = ${(0, kr.stringify)(r)}`);
}
var Ot = {}, he = {};
Object.defineProperty(he, "__esModule", { value: !0 });
he.validateUnion = he.validateArray = he.usePattern = he.callValidateCode = he.schemaProperties = he.allSchemaProperties = he.noPropertyInData = he.propertyInData = he.isOwnProperty = he.hasPropFunc = he.reportMissingProp = he.checkMissingProp = he.checkReportMissingProp = void 0;
const _e = ce, Qo = B, Gt = lt, rg = B;
function ng(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(xo(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, _e._)`${e}` }, !0), t.error();
  });
}
he.checkReportMissingProp = ng;
function sg({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, _e.or)(...n.map((a) => (0, _e.and)(xo(t, e, a, r.ownProperties), (0, _e._)`${s} = ${a}`)));
}
he.checkMissingProp = sg;
function ag(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
he.reportMissingProp = ag;
function cm(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, _e._)`Object.prototype.hasOwnProperty`
  });
}
he.hasPropFunc = cm;
function Go(t, e, r) {
  return (0, _e._)`${cm(t)}.call(${e}, ${r})`;
}
he.isOwnProperty = Go;
function og(t, e, r, n) {
  const s = (0, _e._)`${e}${(0, _e.getProperty)(r)} !== undefined`;
  return n ? (0, _e._)`${s} && ${Go(t, e, r)}` : s;
}
he.propertyInData = og;
function xo(t, e, r, n) {
  const s = (0, _e._)`${e}${(0, _e.getProperty)(r)} === undefined`;
  return n ? (0, _e.or)(s, (0, _e.not)(Go(t, e, r))) : s;
}
he.noPropertyInData = xo;
function lm(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
he.allSchemaProperties = lm;
function ig(t, e) {
  return lm(e).filter((r) => !(0, Qo.alwaysValidSchema)(t, e[r]));
}
he.schemaProperties = ig;
function cg({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, d) {
  const l = d ? (0, _e._)`${t}, ${e}, ${n}${s}` : e, h = [
    [Gt.default.instancePath, (0, _e.strConcat)(Gt.default.instancePath, a)],
    [Gt.default.parentData, o.parentData],
    [Gt.default.parentDataProperty, o.parentDataProperty],
    [Gt.default.rootData, Gt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Gt.default.dynamicAnchors, Gt.default.dynamicAnchors]);
  const g = (0, _e._)`${l}, ${r.object(...h)}`;
  return c !== _e.nil ? (0, _e._)`${i}.call(${c}, ${g})` : (0, _e._)`${i}(${g})`;
}
he.callValidateCode = cg;
const lg = (0, _e._)`new RegExp`;
function ug({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, _e._)`${s.code === "new RegExp" ? lg : (0, rg.useFunc)(t, s)}(${r}, ${n})`
  });
}
he.usePattern = ug;
function dg(t) {
  const { gen: e, data: r, keyword: n, it: s } = t, a = e.name("valid");
  if (s.allErrors) {
    const i = e.let("valid", !0);
    return o(() => e.assign(i, !1)), i;
  }
  return e.var(a, !0), o(() => e.break()), a;
  function o(i) {
    const c = e.const("len", (0, _e._)`${r}.length`);
    e.forRange("i", 0, c, (d) => {
      t.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Qo.Type.Num
      }, a), e.if((0, _e.not)(a), i);
    });
  }
}
he.validateArray = dg;
function fg(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Qo.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = e.let("valid", !1), i = e.name("_valid");
  e.block(() => r.forEach((c, d) => {
    const l = t.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, i);
    e.assign(o, (0, _e._)`${o} || ${i}`), t.mergeValidEvaluated(l, i) || e.if((0, _e.not)(o));
  })), t.result(o, () => t.reset(), () => t.error(!0));
}
he.validateUnion = fg;
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.validateKeywordUsage = Ot.validSchemaType = Ot.funcKeywordCode = Ot.macroKeywordCode = void 0;
const Xe = ce, hr = lt, hg = he, mg = Qn;
function pg(t, e) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = t, i = e.macro.call(o.self, s, a, o), c = um(r, n, i);
  o.opts.validateSchema !== !1 && o.self.validateSchema(i, !0);
  const d = r.name("valid");
  t.subschema({
    schema: i,
    schemaPath: Xe.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), t.pass(d, () => t.error(!0));
}
Ot.macroKeywordCode = pg;
function yg(t, e) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: i, it: c } = t;
  gg(c, e);
  const d = !i && e.compile ? e.compile.call(c.self, a, o, c) : e.validate, l = um(n, s, d), h = n.let("valid");
  t.block$data(h, g), t.ok((r = e.valid) !== null && r !== void 0 ? r : h);
  function g() {
    if (e.errors === !1)
      $(), e.modifying && cl(t), v(() => t.error());
    else {
      const m = e.async ? p() : w();
      e.modifying && cl(t), v(() => $g(t, m));
    }
  }
  function p() {
    const m = n.let("ruleErrs", null);
    return n.try(() => $((0, Xe._)`await `), (b) => n.assign(h, !1).if((0, Xe._)`${b} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Xe._)`${b}.errors`), () => n.throw(b))), m;
  }
  function w() {
    const m = (0, Xe._)`${l}.errors`;
    return n.assign(m, null), $(Xe.nil), m;
  }
  function $(m = e.async ? (0, Xe._)`await ` : Xe.nil) {
    const b = c.opts.passContext ? hr.default.this : hr.default.self, T = !("compile" in e && !i || e.schema === !1);
    n.assign(h, (0, Xe._)`${m}${(0, hg.callValidateCode)(t, l, b, T)}`, e.modifying);
  }
  function v(m) {
    var b;
    n.if((0, Xe.not)((b = e.valid) !== null && b !== void 0 ? b : h), m);
  }
}
Ot.funcKeywordCode = yg;
function cl(t) {
  const { gen: e, data: r, it: n } = t;
  e.if(n.parentData, () => e.assign(r, (0, Xe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function $g(t, e) {
  const { gen: r } = t;
  r.if((0, Xe._)`Array.isArray(${e})`, () => {
    r.assign(hr.default.vErrors, (0, Xe._)`${hr.default.vErrors} === null ? ${e} : ${hr.default.vErrors}.concat(${e})`).assign(hr.default.errors, (0, Xe._)`${hr.default.vErrors}.length`), (0, mg.extendErrors)(t);
  }, () => t.error());
}
function gg({ schemaEnv: t }, e) {
  if (e.async && !t.$async)
    throw new Error("async keyword in sync schema");
}
function um(t, e, r) {
  if (r === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return t.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Xe.stringify)(r) });
}
function vg(t, e, r = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(t) : n === "object" ? t && typeof t == "object" && !Array.isArray(t) : typeof t == n || r && typeof t > "u");
}
Ot.validSchemaType = vg;
function _g({ schema: t, opts: e, self: r, errSchemaPath: n }, s, a) {
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
Ot.validateKeywordUsage = _g;
var nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.extendSubschemaMode = nr.extendSubschemaData = nr.getSubschema = void 0;
const Tt = ce, dm = B;
function wg(t, { keyword: e, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (e !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (e !== void 0) {
    const i = t.schema[e];
    return r === void 0 ? {
      schema: i,
      schemaPath: (0, Tt._)`${t.schemaPath}${(0, Tt.getProperty)(e)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}`
    } : {
      schema: i[r],
      schemaPath: (0, Tt._)`${t.schemaPath}${(0, Tt.getProperty)(e)}${(0, Tt.getProperty)(r)}`,
      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, dm.escapeFragment)(r)}`
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
nr.getSubschema = wg;
function bg(t, e, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: i } = e;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: h } = e, g = i.let("data", (0, Tt._)`${e.data}${(0, Tt.getProperty)(r)}`, !0);
    c(g), t.errorPath = (0, Tt.str)`${d}${(0, dm.getErrorPath)(r, n, h.jsPropertySyntax)}`, t.parentDataProperty = (0, Tt._)`${r}`, t.dataPathArr = [...l, t.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof Tt.Name ? s : i.let("data", s, !0);
    c(d), o !== void 0 && (t.propertyName = o);
  }
  a && (t.dataTypes = a);
  function c(d) {
    t.data = d, t.dataLevel = e.dataLevel + 1, t.dataTypes = [], e.definedProperties = /* @__PURE__ */ new Set(), t.parentData = e.data, t.dataNames = [...e.dataNames, d];
  }
}
nr.extendSubschemaData = bg;
function Sg(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (t.compositeRule = n), s !== void 0 && (t.createErrors = s), a !== void 0 && (t.allErrors = a), t.jtdDiscriminator = e, t.jtdMetadata = r;
}
nr.extendSubschemaMode = Sg;
var Ve = {}, na = function t(e, r) {
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
}, fm = { exports: {} }, er = fm.exports = function(t, e, r) {
  typeof e == "function" && (r = e, e = {}), r = e.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Es(e, n, s, t, "", t);
};
er.keywords = {
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
er.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
er.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
er.skipKeywords = {
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
function Es(t, e, r, n, s, a, o, i, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, s, a, o, i, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in er.arrayKeywords)
          for (var g = 0; g < h.length; g++)
            Es(t, e, r, h[g], s + "/" + l + "/" + g, a, s, l, n, g);
      } else if (l in er.propsKeywords) {
        if (h && typeof h == "object")
          for (var p in h)
            Es(t, e, r, h[p], s + "/" + l + "/" + Eg(p), a, s, l, n, p);
      } else (l in er.keywords || t.allKeys && !(l in er.skipKeywords)) && Es(t, e, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, i, c, d);
  }
}
function Eg(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Ng = fm.exports;
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.getSchemaRefs = Ve.resolveUrl = Ve.normalizeId = Ve._getFullPath = Ve.getFullPath = Ve.inlineRef = void 0;
const Pg = B, Tg = na, Og = Ng, Rg = /* @__PURE__ */ new Set([
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
function Ig(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !to(t) : e ? hm(t) <= e : !1;
}
Ve.inlineRef = Ig;
const jg = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function to(t) {
  for (const e in t) {
    if (jg.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(to) || typeof r == "object" && to(r))
      return !0;
  }
  return !1;
}
function hm(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !Rg.has(r) && (typeof t[r] == "object" && (0, Pg.eachItem)(t[r], (n) => e += hm(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function mm(t, e = "", r) {
  r !== !1 && (e = Hr(e));
  const n = t.parse(e);
  return pm(t, n);
}
Ve.getFullPath = mm;
function pm(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
Ve._getFullPath = pm;
const Cg = /#\/?$/;
function Hr(t) {
  return t ? t.replace(Cg, "") : "";
}
Ve.normalizeId = Hr;
function Ag(t, e, r) {
  return r = Hr(r), t.resolve(e, r);
}
Ve.resolveUrl = Ag;
const kg = /^[a-z_][-a-z0-9._]*$/i;
function Lg(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Hr(t[r] || e), a = { "": s }, o = mm(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return Og(t, { allKeys: !0 }, (h, g, p, w) => {
    if (w === void 0)
      return;
    const $ = o + g;
    let v = a[w];
    typeof h[r] == "string" && (v = m.call(this, h[r])), b.call(this, h.$anchor), b.call(this, h.$dynamicAnchor), a[g] = v;
    function m(T) {
      const R = this.opts.uriResolver.resolve;
      if (T = Hr(v ? R(v, T) : T), c.has(T))
        throw l(T);
      c.add(T);
      let j = this.refs[T];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? d(h, j.schema, T) : T !== Hr($) && (T[0] === "#" ? (d(h, i[T], T), i[T] = h) : this.refs[T] = $), T;
    }
    function b(T) {
      if (typeof T == "string") {
        if (!kg.test(T))
          throw new Error(`invalid anchor "${T}"`);
        m.call(this, `#${T}`);
      }
    }
  }), i;
  function d(h, g, p) {
    if (g !== void 0 && !Tg(h, g))
      throw l(p);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ve.getSchemaRefs = Lg;
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.getData = bt.KeywordCxt = bt.validateFunctionCode = void 0;
const ym = Zr, ll = je, Ho = Vt, Ms = je, Dg = ra, On = Ot, ja = nr, ee = ce, oe = lt, Mg = Ve, qt = B, gn = Qn;
function Vg(t) {
  if (vm(t) && (_m(t), gm(t))) {
    zg(t);
    return;
  }
  $m(t, () => (0, ym.topBoolOrEmptySchema)(t));
}
bt.validateFunctionCode = Vg;
function $m({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? t.func(e, (0, ee._)`${oe.default.data}, ${oe.default.valCxt}`, n.$async, () => {
    t.code((0, ee._)`"use strict"; ${ul(r, s)}`), Fg(t, s), t.code(a);
  }) : t.func(e, (0, ee._)`${oe.default.data}, ${qg(s)}`, n.$async, () => t.code(ul(r, s)).code(a));
}
function qg(t) {
  return (0, ee._)`{${oe.default.instancePath}="", ${oe.default.parentData}, ${oe.default.parentDataProperty}, ${oe.default.rootData}=${oe.default.data}${t.dynamicRef ? (0, ee._)`, ${oe.default.dynamicAnchors}={}` : ee.nil}}={}`;
}
function Fg(t, e) {
  t.if(oe.default.valCxt, () => {
    t.var(oe.default.instancePath, (0, ee._)`${oe.default.valCxt}.${oe.default.instancePath}`), t.var(oe.default.parentData, (0, ee._)`${oe.default.valCxt}.${oe.default.parentData}`), t.var(oe.default.parentDataProperty, (0, ee._)`${oe.default.valCxt}.${oe.default.parentDataProperty}`), t.var(oe.default.rootData, (0, ee._)`${oe.default.valCxt}.${oe.default.rootData}`), e.dynamicRef && t.var(oe.default.dynamicAnchors, (0, ee._)`${oe.default.valCxt}.${oe.default.dynamicAnchors}`);
  }, () => {
    t.var(oe.default.instancePath, (0, ee._)`""`), t.var(oe.default.parentData, (0, ee._)`undefined`), t.var(oe.default.parentDataProperty, (0, ee._)`undefined`), t.var(oe.default.rootData, oe.default.data), e.dynamicRef && t.var(oe.default.dynamicAnchors, (0, ee._)`{}`);
  });
}
function zg(t) {
  const { schema: e, opts: r, gen: n } = t;
  $m(t, () => {
    r.$comment && e.$comment && bm(t), Gg(t), n.let(oe.default.vErrors, null), n.let(oe.default.errors, 0), r.unevaluated && Ug(t), wm(t), Jg(t);
  });
}
function Ug(t) {
  const { gen: e, validateName: r } = t;
  t.evaluated = e.const("evaluated", (0, ee._)`${r}.evaluated`), e.if((0, ee._)`${t.evaluated}.dynamicProps`, () => e.assign((0, ee._)`${t.evaluated}.props`, (0, ee._)`undefined`)), e.if((0, ee._)`${t.evaluated}.dynamicItems`, () => e.assign((0, ee._)`${t.evaluated}.items`, (0, ee._)`undefined`));
}
function ul(t, e) {
  const r = typeof t == "object" && t[e.schemaId];
  return r && (e.code.source || e.code.process) ? (0, ee._)`/*# sourceURL=${r} */` : ee.nil;
}
function Bg(t, e) {
  if (vm(t) && (_m(t), gm(t))) {
    Kg(t, e);
    return;
  }
  (0, ym.boolOrEmptySchema)(t, e);
}
function gm({ schema: t, self: e }) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e.RULES.all[r])
      return !0;
  return !1;
}
function vm(t) {
  return typeof t.schema != "boolean";
}
function Kg(t, e) {
  const { schema: r, gen: n, opts: s } = t;
  s.$comment && r.$comment && bm(t), xg(t), Hg(t);
  const a = n.const("_errs", oe.default.errors);
  wm(t, a), n.var(e, (0, ee._)`${a} === ${oe.default.errors}`);
}
function _m(t) {
  (0, qt.checkUnknownRules)(t), Qg(t);
}
function wm(t, e) {
  if (t.opts.jtd)
    return dl(t, [], !1, e);
  const r = (0, ll.getSchemaTypes)(t.schema), n = (0, ll.coerceAndCheckDataType)(t, r);
  dl(t, r, !n, e);
}
function Qg(t) {
  const { schema: e, errSchemaPath: r, opts: n, self: s } = t;
  e.$ref && n.ignoreKeywordsWithRef && (0, qt.schemaHasRulesButRef)(e, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Gg(t) {
  const { schema: e, opts: r } = t;
  e.default !== void 0 && r.useDefaults && r.strictSchema && (0, qt.checkStrictMode)(t, "default is ignored in the schema root");
}
function xg(t) {
  const e = t.schema[t.opts.schemaId];
  e && (t.baseId = (0, Mg.resolveUrl)(t.opts.uriResolver, t.baseId, e));
}
function Hg(t) {
  if (t.schema.$async && !t.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function bm({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    t.code((0, ee._)`${oe.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, ee.str)`${n}/$comment`, i = t.scopeValue("root", { ref: e.root });
    t.code((0, ee._)`${oe.default.self}.opts.$comment(${a}, ${o}, ${i}.schema)`);
  }
}
function Jg(t) {
  const { gen: e, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = t;
  r.$async ? e.if((0, ee._)`${oe.default.errors} === 0`, () => e.return(oe.default.data), () => e.throw((0, ee._)`new ${s}(${oe.default.vErrors})`)) : (e.assign((0, ee._)`${n}.errors`, oe.default.vErrors), a.unevaluated && Wg(t), e.return((0, ee._)`${oe.default.errors} === 0`));
}
function Wg({ gen: t, evaluated: e, props: r, items: n }) {
  r instanceof ee.Name && t.assign((0, ee._)`${e}.props`, r), n instanceof ee.Name && t.assign((0, ee._)`${e}.items`, n);
}
function dl(t, e, r, n) {
  const { gen: s, schema: a, data: o, allErrors: i, opts: c, self: d } = t, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, qt.schemaHasRulesButRef)(a, l))) {
    s.block(() => Nm(t, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || Xg(t, e), s.block(() => {
    for (const g of l.rules)
      h(g);
    h(l.post);
  });
  function h(g) {
    (0, Ho.shouldUseGroup)(a, g) && (g.type ? (s.if((0, Ms.checkDataType)(g.type, o, c.strictNumbers)), fl(t, g), e.length === 1 && e[0] === g.type && r && (s.else(), (0, Ms.reportTypeError)(t)), s.endIf()) : fl(t, g), i || s.if((0, ee._)`${oe.default.errors} === ${n || 0}`));
  }
}
function fl(t, e) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = t;
  s && (0, Dg.assignDefaults)(t, e.type), r.block(() => {
    for (const a of e.rules)
      (0, Ho.shouldUseRule)(n, a) && Nm(t, a.keyword, a.definition, e.type);
  });
}
function Xg(t, e) {
  t.schemaEnv.meta || !t.opts.strictTypes || (Yg(t, e), t.opts.allowUnionTypes || Zg(t, e), e0(t, t.dataTypes));
}
function Yg(t, e) {
  if (e.length) {
    if (!t.dataTypes.length) {
      t.dataTypes = e;
      return;
    }
    e.forEach((r) => {
      Sm(t.dataTypes, r) || Jo(t, `type "${r}" not allowed by context "${t.dataTypes.join(",")}"`);
    }), r0(t, e);
  }
}
function Zg(t, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && Jo(t, "use allowUnionTypes to allow union type keyword");
}
function e0(t, e) {
  const r = t.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ho.shouldUseRule)(t.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => t0(e, o)) && Jo(t, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function t0(t, e) {
  return t.includes(e) || e === "number" && t.includes("integer");
}
function Sm(t, e) {
  return t.includes(e) || e === "integer" && t.includes("number");
}
function r0(t, e) {
  const r = [];
  for (const n of t.dataTypes)
    Sm(e, n) ? r.push(n) : e.includes("integer") && n === "number" && r.push("integer");
  t.dataTypes = r;
}
function Jo(t, e) {
  const r = t.schemaEnv.baseId + t.errSchemaPath;
  e += ` at "${r}" (strictTypes)`, (0, qt.checkStrictMode)(t, e, t.opts.strictTypes);
}
class Em {
  constructor(e, r, n) {
    if ((0, On.validateKeywordUsage)(e, r, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, qt.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = r, this.$data)
      this.schemaCode = e.gen.const("vSchema", Pm(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, On.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = e.gen.const("_errs", oe.default.errors));
  }
  result(e, r, n) {
    this.failResult((0, ee.not)(e), r, n);
  }
  failResult(e, r, n) {
    this.gen.if(e), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(e, r) {
    this.failResult((0, ee.not)(e), void 0, r);
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
    this.fail((0, ee._)`${r} !== undefined && (${(0, ee.or)(this.invalid$data(), e)})`);
  }
  error(e, r, n) {
    if (r) {
      this.setParams(r), this._error(e, n), this.setParams({});
      return;
    }
    this._error(e, n);
  }
  _error(e, r) {
    (e ? gn.reportExtraError : gn.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, gn.reportError)(this, this.def.$dataError || gn.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, gn.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(e) {
    this.allErrors || this.gen.if(e);
  }
  setParams(e, r) {
    r ? Object.assign(this.params, e) : this.params = e;
  }
  block$data(e, r, n = ee.nil) {
    this.gen.block(() => {
      this.check$data(e, n), r();
    });
  }
  check$data(e = ee.nil, r = ee.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, ee.or)((0, ee._)`${s} === undefined`, r)), e !== ee.nil && n.assign(e, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), e !== ee.nil && n.assign(e, !1)), n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, ee.or)(o(), i());
    function o() {
      if (n.length) {
        if (!(r instanceof ee.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, ee._)`${(0, Ms.checkDataTypes)(c, r, a.opts.strictNumbers, Ms.DataType.Wrong)}`;
      }
      return ee.nil;
    }
    function i() {
      if (s.validateSchema) {
        const c = e.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, ee._)`!${c}(${r})`;
      }
      return ee.nil;
    }
  }
  subschema(e, r) {
    const n = (0, ja.getSubschema)(this.it, e);
    (0, ja.extendSubschemaData)(n, this.it, e), (0, ja.extendSubschemaMode)(n, e);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Bg(s, r), s;
  }
  mergeEvaluated(e, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && e.props !== void 0 && (n.props = qt.mergeEvaluated.props(s, e.props, n.props, r)), n.items !== !0 && e.items !== void 0 && (n.items = qt.mergeEvaluated.items(s, e.items, n.items, r)));
  }
  mergeValidEvaluated(e, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(e, ee.Name)), !0;
  }
}
bt.KeywordCxt = Em;
function Nm(t, e, r, n) {
  const s = new Em(t, r, e);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, On.funcKeywordCode)(s, r) : "macro" in r ? (0, On.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, On.funcKeywordCode)(s, r);
}
const n0 = /^\/(?:[^~]|~0|~1)*$/, s0 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Pm(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (t === "")
    return oe.default.rootData;
  if (t[0] === "/") {
    if (!n0.test(t))
      throw new Error(`Invalid JSON-pointer: ${t}`);
    s = t, a = oe.default.rootData;
  } else {
    const d = s0.exec(t);
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
    d && (a = (0, ee._)`${a}${(0, ee.getProperty)((0, qt.unescapeJsonPointer)(d))}`, o = (0, ee._)`${o} && ${a}`);
  return o;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${e}`;
  }
}
bt.getData = Pm;
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
class a0 extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
Gn.default = a0;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
const Ca = Ve;
class o0 extends Error {
  constructor(e, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ca.resolveUrl)(e, r, n), this.missingSchema = (0, Ca.normalizeId)((0, Ca.getFullPath)(e, this.missingRef));
  }
}
an.default = o0;
var Ze = {};
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.resolveSchema = Ze.getCompilingSchema = Ze.resolveRef = Ze.compileSchema = Ze.SchemaEnv = void 0;
const mt = ce, i0 = Gn, ur = lt, _t = Ve, hl = B, c0 = bt;
let sa = class {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, _t.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Ze.SchemaEnv = sa;
function Wo(t) {
  const e = Tm.call(this, t);
  if (e)
    return e;
  const r = (0, _t.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new mt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: i0.default,
    code: (0, mt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  t.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: ur.default.data,
    parentData: ur.default.parentData,
    parentDataProperty: ur.default.parentDataProperty,
    dataNames: [ur.default.data],
    dataPathArr: [mt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: t.schema, code: (0, mt.stringify)(t.schema) } : { ref: t.schema }),
    validateName: c,
    ValidationError: i,
    schema: t.schema,
    schemaEnv: t,
    rootId: r,
    baseId: t.baseId || r,
    schemaPath: mt.nil,
    errSchemaPath: t.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, mt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(t), (0, c0.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs(ur.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, t));
    const p = new Function(`${ur.default.self}`, `${ur.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = t.schema, p.schemaEnv = t, t.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: $ } = d;
      p.evaluated = {
        props: w instanceof mt.Name ? void 0 : w,
        items: $ instanceof mt.Name ? void 0 : $,
        dynamicProps: w instanceof mt.Name,
        dynamicItems: $ instanceof mt.Name
      }, p.source && (p.source.evaluated = (0, mt.stringify)(p.evaluated));
    }
    return t.validate = p, t;
  } catch (h) {
    throw delete t.validate, delete t.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(t);
  }
}
Ze.compileSchema = Wo;
function l0(t, e, r) {
  var n;
  r = (0, _t.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = f0.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new sa({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = u0.call(this, a);
}
Ze.resolveRef = l0;
function u0(t) {
  return (0, _t.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : Wo.call(this, t);
}
function Tm(t) {
  for (const e of this._compilations)
    if (d0(e, t))
      return e;
}
Ze.getCompilingSchema = Tm;
function d0(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function f0(t, e) {
  let r;
  for (; typeof (r = this.refs[e]) == "string"; )
    e = r;
  return r || this.schemas[e] || aa.call(this, t, e);
}
function aa(t, e) {
  const r = this.opts.uriResolver.parse(e), n = (0, _t._getFullPath)(this.opts.uriResolver, r);
  let s = (0, _t.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
  if (Object.keys(t.schema).length > 0 && n === s)
    return Aa.call(this, r, t);
  const a = (0, _t.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const i = aa.call(this, t, o);
    return typeof (i == null ? void 0 : i.schema) != "object" ? void 0 : Aa.call(this, r, i);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Wo.call(this, o), a === (0, _t.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, d = i[c];
      return d && (s = (0, _t.resolveUrl)(this.opts.uriResolver, s, d)), new sa({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return Aa.call(this, r, o);
  }
}
Ze.resolveSchema = aa;
const h0 = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Aa(t, { baseId: e, schema: r, root: n }) {
  var s;
  if (((s = t.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const i of t.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, hl.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !h0.has(i) && d && (e = (0, _t.resolveUrl)(this.opts.uriResolver, e, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, hl.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, _t.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = aa.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new sa({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const m0 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", p0 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", y0 = "object", $0 = [
  "$data"
], g0 = {
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
}, v0 = !1, _0 = {
  $id: m0,
  description: p0,
  type: y0,
  required: $0,
  properties: g0,
  additionalProperties: v0
};
var Xo = {}, oa = { exports: {} };
const w0 = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Om = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), Yo = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), Rm = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), b0 = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
function Im(t) {
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
const S0 = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function ml(t) {
  return t.length = 0, !0;
}
function E0(t, e, r) {
  if (t.length) {
    const n = Im(t);
    if (n !== "")
      e.push(n);
    else
      return r.error = !0, !1;
    t.length = 0;
  }
  return !0;
}
function N0(t) {
  let e = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, i = E0;
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
        i = ml;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (i === ml ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(Im(s))), r.address = n.join(""), r;
}
function jm(t) {
  if (P0(t, ":") < 2)
    return { host: t, isIPV6: !1 };
  const e = N0(t);
  if (e.error)
    return { host: t, isIPV6: !1 };
  {
    let r = e.address, n = e.address;
    return e.zone && (r += "%" + e.zone, n += "%25" + e.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function P0(t, e) {
  let r = 0;
  for (let n = 0; n < t.length; n++)
    t[n] === e && r++;
  return r;
}
function T0(t) {
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
const O0 = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, R0 = /[@/?#:]/g, I0 = /[@/?#]/g;
function Cm(t, e) {
  const r = e ? I0 : R0;
  return r.lastIndex = 0, t.replace(r, (n) => O0[n]);
}
function j0(t, e = !1) {
  if (t.indexOf("%") === -1)
    return t;
  let r = "";
  for (let n = 0; n < t.length; n++) {
    if (t[n] === "%" && n + 2 < t.length) {
      const s = t.slice(n + 1, n + 3);
      if (Yo(s)) {
        const a = s.toUpperCase(), o = String.fromCharCode(parseInt(a, 16));
        e && Rm(o) ? r += o : r += "%" + a, n += 2;
        continue;
      }
    }
    r += t[n];
  }
  return r;
}
function C0(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    if (t[r] === "%" && r + 2 < t.length) {
      const n = t.slice(r + 1, r + 3);
      if (Yo(n)) {
        const s = n.toUpperCase(), a = String.fromCharCode(parseInt(s, 16));
        a !== "." && Rm(a) ? e += a : e += "%" + s, r += 2;
        continue;
      }
    }
    b0(t[r]) ? e += t[r] : e += escape(t[r]);
  }
  return e;
}
function A0(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    if (t[r] === "%" && r + 2 < t.length) {
      const n = t.slice(r + 1, r + 3);
      if (Yo(n)) {
        e += "%" + n.toUpperCase(), r += 2;
        continue;
      }
    }
    e += escape(t[r]);
  }
  return e;
}
function k0(t) {
  const e = [];
  if (t.userinfo !== void 0 && (e.push(t.userinfo), e.push("@")), t.host !== void 0) {
    let r = unescape(t.host);
    if (!Om(r)) {
      const n = jm(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = Cm(r, !1);
    }
    e.push(r);
  }
  return (typeof t.port == "number" || typeof t.port == "string") && (e.push(":"), e.push(String(t.port))), e.length ? e.join("") : void 0;
}
var Am = {
  nonSimpleDomain: S0,
  recomposeAuthority: k0,
  reescapeHostDelimiters: Cm,
  normalizePercentEncoding: j0,
  normalizePathEncoding: C0,
  escapePreservingEscapes: A0,
  removeDotSegments: T0,
  isIPv4: Om,
  isUUID: w0,
  normalizeIPv6: jm
};
const { isUUID: L0 } = Am, D0 = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function km(t) {
  return t.secure === !0 ? !0 : t.secure === !1 ? !1 : t.scheme ? t.scheme.length === 3 && (t.scheme[0] === "w" || t.scheme[0] === "W") && (t.scheme[1] === "s" || t.scheme[1] === "S") && (t.scheme[2] === "s" || t.scheme[2] === "S") : !1;
}
function Lm(t) {
  return t.host || (t.error = t.error || "HTTP URIs must have a host."), t;
}
function Dm(t) {
  const e = String(t.scheme).toLowerCase() === "https";
  return (t.port === (e ? 443 : 80) || t.port === "") && (t.port = void 0), t.path || (t.path = "/"), t;
}
function M0(t) {
  return t.secure = km(t), t.resourceName = (t.path || "/") + (t.query ? "?" + t.query : ""), t.path = void 0, t.query = void 0, t;
}
function V0(t) {
  if ((t.port === (km(t) ? 443 : 80) || t.port === "") && (t.port = void 0), typeof t.secure == "boolean" && (t.scheme = t.secure ? "wss" : "ws", t.secure = void 0), t.resourceName) {
    const [e, r] = t.resourceName.split("?");
    t.path = e && e !== "/" ? e : void 0, t.query = r, t.resourceName = void 0;
  }
  return t.fragment = void 0, t;
}
function q0(t, e) {
  if (!t.path)
    return t.error = "URN can not be parsed", t;
  const r = t.path.match(D0);
  if (r) {
    const n = e.scheme || t.scheme || "urn";
    t.nid = r[1].toLowerCase(), t.nss = r[2];
    const s = `${n}:${e.nid || t.nid}`, a = Zo(s);
    t.path = void 0, a && (t = a.parse(t, e));
  } else
    t.error = t.error || "URN can not be parsed.";
  return t;
}
function F0(t, e) {
  if (t.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = e.scheme || t.scheme || "urn", n = t.nid.toLowerCase(), s = `${r}:${e.nid || n}`, a = Zo(s);
  a && (t = a.serialize(t, e));
  const o = t, i = t.nss;
  return o.path = `${n || e.nid}:${i}`, e.skipEscape = !0, o;
}
function z0(t, e) {
  const r = t;
  return r.uuid = r.nss, r.nss = void 0, !e.tolerant && (!r.uuid || !L0(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function U0(t) {
  const e = t;
  return e.nss = (t.uuid || "").toLowerCase(), e;
}
const Mm = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Lm,
    serialize: Dm
  }
), B0 = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Mm.domainHost,
    parse: Lm,
    serialize: Dm
  }
), Ns = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: M0,
    serialize: V0
  }
), K0 = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Ns.domainHost,
    parse: Ns.parse,
    serialize: Ns.serialize
  }
), Q0 = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: q0,
    serialize: F0,
    skipNormalize: !0
  }
), G0 = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: z0,
    serialize: U0,
    skipNormalize: !0
  }
), Vs = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Mm,
    https: B0,
    ws: Ns,
    wss: K0,
    urn: Q0,
    "urn:uuid": G0
  }
);
Object.setPrototypeOf(Vs, null);
function Zo(t) {
  return t && (Vs[
    /** @type {SchemeName} */
    t
  ] || Vs[
    /** @type {SchemeName} */
    t.toLowerCase()
  ]) || void 0;
}
var x0 = {
  SCHEMES: Vs,
  getSchemeHandler: Zo
};
const { normalizeIPv6: H0, removeDotSegments: Sn, recomposeAuthority: J0, normalizePercentEncoding: W0, normalizePathEncoding: X0, escapePreservingEscapes: Y0, reescapeHostDelimiters: Z0, isIPv4: ev, nonSimpleDomain: tv } = Am, { SCHEMES: rv, getSchemeHandler: Vm } = x0;
function nv(t, e) {
  return typeof t == "string" ? t = /** @type {T} */
  cv(t, e) : typeof t == "object" && (t = /** @type {T} */
  en(Sr(t, e), e)), t;
}
function sv(t, e, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = qm(en(t, n), en(e, n), n, !0);
  return n.skipEscape = !0, Sr(s, n);
}
function qm(t, e, r, n) {
  const s = {};
  return n || (t = en(Sr(t, r), r), e = en(Sr(e, r), r)), r = r || {}, !r.tolerant && e.scheme ? (s.scheme = e.scheme, s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = Sn(e.path || ""), s.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = Sn(e.path || ""), s.query = e.query) : (e.path ? (e.path[0] === "/" ? s.path = Sn(e.path) : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path ? s.path = "/" + e.path : t.path ? s.path = t.path.slice(0, t.path.lastIndexOf("/") + 1) + e.path : s.path = e.path, s.path = Sn(s.path)), s.query = e.query) : (s.path = t.path, e.query !== void 0 ? s.query = e.query : s.query = t.query), s.userinfo = t.userinfo, s.host = t.host, s.port = t.port), s.scheme = t.scheme), s.fragment = e.fragment, s;
}
function av(t, e, r) {
  const n = pl(t, r), s = pl(e, r);
  return n !== void 0 && s !== void 0 && n.toLowerCase() === s.toLowerCase();
}
function Sr(t, e) {
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
  }, n = Object.assign({}, e), s = [], a = Vm(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = W0(r.path) : (r.path = Y0(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = J0(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let i = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (i = Sn(i)), o === void 0 && i[0] === "/" && i[1] === "/" && (i = "/%2F" + i.slice(2)), s.push(i);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const ov = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function iv(t, e) {
  if (e[2] !== void 0 && t.path && t.path[0] !== "/")
    return 'URI path must start with "/" when authority is present.';
  if (typeof t.port == "number" && (t.port < 0 || t.port > 65535))
    return "URI port is malformed.";
}
function Fm(t, e) {
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
  const o = t.match(ov);
  if (o) {
    n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]);
    const i = iv(n, o);
    if (i !== void 0 && (n.error = n.error || i, s = !0), n.host)
      if (ev(n.host) === !1) {
        const l = H0(n.host);
        n.host = l.host.toLowerCase(), a = l.isIPV6;
      } else
        a = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = Vm(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && tv(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!c || c && !c.skipNormalize) && (t.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = Z0(unescape(n.host), a))), n.path && (n.path = X0(n.path)), n.fragment))
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
function en(t, e) {
  return Fm(t, e).parsed;
}
function cv(t, e) {
  return zm(t, e).normalized;
}
function zm(t, e) {
  const { parsed: r, malformedAuthorityOrPort: n } = Fm(t, e);
  return {
    normalized: n ? t : Sr(r, e),
    malformedAuthorityOrPort: n
  };
}
function pl(t, e) {
  if (typeof t == "string") {
    const { normalized: r, malformedAuthorityOrPort: n } = zm(t, e);
    return n ? void 0 : r;
  }
  if (typeof t == "object")
    return Sr(t, e);
}
const ei = {
  SCHEMES: rv,
  normalize: nv,
  resolve: sv,
  resolveComponent: qm,
  equal: av,
  serialize: Sr,
  parse: en
};
oa.exports = ei;
oa.exports.default = ei;
oa.exports.fastUri = ei;
var Um = oa.exports;
Object.defineProperty(Xo, "__esModule", { value: !0 });
const Bm = Um;
Bm.code = 'require("ajv/dist/runtime/uri").default';
Xo.default = Bm;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  var e = bt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var r = ce;
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
  const n = Gn, s = an, a = br, o = Ze, i = ce, c = Ve, d = je, l = B, h = _0, g = Xo, p = (P, y) => new RegExp(P, y);
  p.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], $ = /* @__PURE__ */ new Set([
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
  ]), v = {
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
    var y, E, _, u, f, S, A, k, H, W, O, C, L, z, Y, ie, Ne, We, Ae, ke, Pe, Nt, ze, ir, cr;
    const ht = P.strict, lr = (y = P.code) === null || y === void 0 ? void 0 : y.optimize, hn = lr === !0 || lr === void 0 ? 1 : lr || 0, mn = (_ = (E = P.code) === null || E === void 0 ? void 0 : E.regExp) !== null && _ !== void 0 ? _ : p, Oa = (u = P.uriResolver) !== null && u !== void 0 ? u : g.default;
    return {
      strictSchema: (S = (f = P.strictSchema) !== null && f !== void 0 ? f : ht) !== null && S !== void 0 ? S : !0,
      strictNumbers: (k = (A = P.strictNumbers) !== null && A !== void 0 ? A : ht) !== null && k !== void 0 ? k : !0,
      strictTypes: (W = (H = P.strictTypes) !== null && H !== void 0 ? H : ht) !== null && W !== void 0 ? W : "log",
      strictTuples: (C = (O = P.strictTuples) !== null && O !== void 0 ? O : ht) !== null && C !== void 0 ? C : "log",
      strictRequired: (z = (L = P.strictRequired) !== null && L !== void 0 ? L : ht) !== null && z !== void 0 ? z : !1,
      code: P.code ? { ...P.code, optimize: hn, regExp: mn } : { optimize: hn, regExp: mn },
      loopRequired: (Y = P.loopRequired) !== null && Y !== void 0 ? Y : b,
      loopEnum: (ie = P.loopEnum) !== null && ie !== void 0 ? ie : b,
      meta: (Ne = P.meta) !== null && Ne !== void 0 ? Ne : !0,
      messages: (We = P.messages) !== null && We !== void 0 ? We : !0,
      inlineRefs: (Ae = P.inlineRefs) !== null && Ae !== void 0 ? Ae : !0,
      schemaId: (ke = P.schemaId) !== null && ke !== void 0 ? ke : "$id",
      addUsedSchema: (Pe = P.addUsedSchema) !== null && Pe !== void 0 ? Pe : !0,
      validateSchema: (Nt = P.validateSchema) !== null && Nt !== void 0 ? Nt : !0,
      validateFormats: (ze = P.validateFormats) !== null && ze !== void 0 ? ze : !0,
      unicodeRegExp: (ir = P.unicodeRegExp) !== null && ir !== void 0 ? ir : !0,
      int32range: (cr = P.int32range) !== null && cr !== void 0 ? cr : !0,
      uriResolver: Oa
    };
  }
  class R {
    constructor(y = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), y = this.opts = { ...y, ...T(y) };
      const { es5: E, lines: _ } = this.opts.code;
      this.scope = new i.ValueScope({ scope: {}, prefixes: $, es5: E, lines: _ }), this.logger = X(y.logger);
      const u = y.validateFormats;
      y.validateFormats = !1, this.RULES = (0, a.getRules)(), j.call(this, v, y, "NOT SUPPORTED"), j.call(this, m, y, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), y.formats && te.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), y.keywords && fe.call(this, y.keywords), typeof y.meta == "object" && this.addMetaSchema(y.meta), M.call(this), y.validateFormats = u;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: y, meta: E, schemaId: _ } = this.opts;
      let u = h;
      _ === "id" && (u = { ...h }, u.id = u.$id, delete u.$id), E && y && this.addMetaSchema(u, u[_], !1);
    }
    defaultMeta() {
      const { meta: y, schemaId: E } = this.opts;
      return this.opts.defaultMeta = typeof y == "object" ? y[E] || y : void 0;
    }
    validate(y, E) {
      let _;
      if (typeof y == "string") {
        if (_ = this.getSchema(y), !_)
          throw new Error(`no schema with key or ref "${y}"`);
      } else
        _ = this.compile(y);
      const u = _(E);
      return "$async" in _ || (this.errors = _.errors), u;
    }
    compile(y, E) {
      const _ = this._addSchema(y, E);
      return _.validate || this._compileSchemaEnv(_);
    }
    compileAsync(y, E) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: _ } = this.opts;
      return u.call(this, y, E);
      async function u(W, O) {
        await f.call(this, W.$schema);
        const C = this._addSchema(W, O);
        return C.validate || S.call(this, C);
      }
      async function f(W) {
        W && !this.getSchema(W) && await u.call(this, { $ref: W }, !0);
      }
      async function S(W) {
        try {
          return this._compileSchemaEnv(W);
        } catch (O) {
          if (!(O instanceof s.default))
            throw O;
          return A.call(this, O), await k.call(this, O.missingSchema), S.call(this, W);
        }
      }
      function A({ missingSchema: W, missingRef: O }) {
        if (this.refs[W])
          throw new Error(`AnySchema ${W} is loaded but ${O} cannot be resolved`);
      }
      async function k(W) {
        const O = await H.call(this, W);
        this.refs[W] || await f.call(this, O.$schema), this.refs[W] || this.addSchema(O, W, E);
      }
      async function H(W) {
        const O = this._loading[W];
        if (O)
          return O;
        try {
          return await (this._loading[W] = _(W));
        } finally {
          delete this._loading[W];
        }
      }
    }
    // Adds schema to the instance
    addSchema(y, E, _, u = this.opts.validateSchema) {
      if (Array.isArray(y)) {
        for (const S of y)
          this.addSchema(S, void 0, _, u);
        return this;
      }
      let f;
      if (typeof y == "object") {
        const { schemaId: S } = this.opts;
        if (f = y[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return E = (0, c.normalizeId)(E || f), this._checkUnique(E), this.schemas[E] = this._addSchema(y, _, E, u, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(y, E, _ = this.opts.validateSchema) {
      return this.addSchema(y, E, !0, _), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(y, E) {
      if (typeof y == "boolean")
        return !0;
      let _;
      if (_ = y.$schema, _ !== void 0 && typeof _ != "string")
        throw new Error("$schema must be a string");
      if (_ = _ || this.opts.defaultMeta || this.defaultMeta(), !_)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const u = this.validate(_, y);
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
    getSchema(y) {
      let E;
      for (; typeof (E = U.call(this, y)) == "string"; )
        y = E;
      if (E === void 0) {
        const { schemaId: _ } = this.opts, u = new o.SchemaEnv({ schema: {}, schemaId: _ });
        if (E = o.resolveSchema.call(this, u, y), !E)
          return;
        this.refs[y] = E;
      }
      return E.validate || this._compileSchemaEnv(E);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(y) {
      if (y instanceof RegExp)
        return this._removeAllSchemas(this.schemas, y), this._removeAllSchemas(this.refs, y), this;
      switch (typeof y) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const E = U.call(this, y);
          return typeof E == "object" && this._cache.delete(E.schema), delete this.schemas[y], delete this.refs[y], this;
        }
        case "object": {
          const E = y;
          this._cache.delete(E);
          let _ = y[this.opts.schemaId];
          return _ && (_ = (0, c.normalizeId)(_), delete this.schemas[_], delete this.refs[_]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(y) {
      for (const E of y)
        this.addKeyword(E);
      return this;
    }
    addKeyword(y, E) {
      let _;
      if (typeof y == "string")
        _ = y, typeof E == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), E.keyword = _);
      else if (typeof y == "object" && E === void 0) {
        if (E = y, _ = E.keyword, Array.isArray(_) && !_.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (K.call(this, _, E), !E)
        return (0, l.eachItem)(_, (f) => pe.call(this, f)), this;
      F.call(this, E);
      const u = {
        ...E,
        type: (0, d.getJSONTypes)(E.type),
        schemaType: (0, d.getJSONTypes)(E.schemaType)
      };
      return (0, l.eachItem)(_, u.type.length === 0 ? (f) => pe.call(this, f, u) : (f) => u.type.forEach((S) => pe.call(this, f, u, S))), this;
    }
    getKeyword(y) {
      const E = this.RULES.all[y];
      return typeof E == "object" ? E.definition : !!E;
    }
    // Remove keyword
    removeKeyword(y) {
      const { RULES: E } = this;
      delete E.keywords[y], delete E.all[y];
      for (const _ of E.rules) {
        const u = _.rules.findIndex((f) => f.keyword === y);
        u >= 0 && _.rules.splice(u, 1);
      }
      return this;
    }
    // Add format
    addFormat(y, E) {
      return typeof E == "string" && (E = new RegExp(E)), this.formats[y] = E, this;
    }
    errorsText(y = this.errors, { separator: E = ", ", dataVar: _ = "data" } = {}) {
      return !y || y.length === 0 ? "No errors" : y.map((u) => `${_}${u.instancePath} ${u.message}`).reduce((u, f) => u + E + f);
    }
    $dataMetaSchema(y, E) {
      const _ = this.RULES.all;
      y = JSON.parse(JSON.stringify(y));
      for (const u of E) {
        const f = u.split("/").slice(1);
        let S = y;
        for (const A of f)
          S = S[A];
        for (const A in _) {
          const k = _[A];
          if (typeof k != "object")
            continue;
          const { $data: H } = k.definition, W = S[A];
          H && W && (S[A] = J(W));
        }
      }
      return y;
    }
    _removeAllSchemas(y, E) {
      for (const _ in y) {
        const u = y[_];
        (!E || E.test(_)) && (typeof u == "string" ? delete y[_] : u && !u.meta && (this._cache.delete(u.schema), delete y[_]));
      }
    }
    _addSchema(y, E, _, u = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: A } = this.opts;
      if (typeof y == "object")
        S = y[A];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof y != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let k = this._cache.get(y);
      if (k !== void 0)
        return k;
      _ = (0, c.normalizeId)(S || _);
      const H = c.getSchemaRefs.call(this, y, _);
      return k = new o.SchemaEnv({ schema: y, schemaId: A, meta: E, baseId: _, localRefs: H }), this._cache.set(k.schema, k), f && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = k), u && this.validateSchema(y, !0), k;
    }
    _checkUnique(y) {
      if (this.schemas[y] || this.refs[y])
        throw new Error(`schema with key or id "${y}" already exists`);
    }
    _compileSchemaEnv(y) {
      if (y.meta ? this._compileMetaSchema(y) : o.compileSchema.call(this, y), !y.validate)
        throw new Error("ajv implementation error");
      return y.validate;
    }
    _compileMetaSchema(y) {
      const E = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, y);
      } finally {
        this.opts = E;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, t.default = R;
  function j(P, y, E, _ = "error") {
    for (const u in P) {
      const f = u;
      f in y && this.logger[_](`${E}: option ${u}. ${P[f]}`);
    }
  }
  function U(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function M() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const y in P)
          this.addSchema(P[y], y);
  }
  function te() {
    for (const P in this.opts.formats) {
      const y = this.opts.formats[P];
      y && this.addFormat(P, y);
    }
  }
  function fe(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const y in P) {
      const E = P[y];
      E.keyword || (E.keyword = y), this.addKeyword(E);
    }
  }
  function $e() {
    const P = { ...this.opts };
    for (const y of w)
      delete P[y];
    return P;
  }
  const x = { log() {
  }, warn() {
  }, error() {
  } };
  function X(P) {
    if (P === !1)
      return x;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Z = /^[a-z_$][a-z0-9_$:-]*$/i;
  function K(P, y) {
    const { RULES: E } = this;
    if ((0, l.eachItem)(P, (_) => {
      if (E.keywords[_])
        throw new Error(`Keyword ${_} is already defined`);
      if (!Z.test(_))
        throw new Error(`Keyword ${_} has invalid name`);
    }), !!y && y.$data && !("code" in y || "validate" in y))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function pe(P, y, E) {
    var _;
    const u = y == null ? void 0 : y.post;
    if (E && u)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = u ? f.post : f.rules.find(({ type: k }) => k === E);
    if (S || (S = { type: E, rules: [] }, f.rules.push(S)), f.keywords[P] = !0, !y)
      return;
    const A = {
      keyword: P,
      definition: {
        ...y,
        type: (0, d.getJSONTypes)(y.type),
        schemaType: (0, d.getJSONTypes)(y.schemaType)
      }
    };
    y.before ? Ee.call(this, S, A, y.before) : S.rules.push(A), f.all[P] = A, (_ = y.implements) === null || _ === void 0 || _.forEach((k) => this.addKeyword(k));
  }
  function Ee(P, y, E) {
    const _ = P.rules.findIndex((u) => u.keyword === E);
    _ >= 0 ? P.rules.splice(_, 0, y) : (P.rules.push(y), this.logger.warn(`rule ${E} is not defined`));
  }
  function F(P) {
    let { metaSchema: y } = P;
    y !== void 0 && (P.$data && this.opts.$data && (y = J(y)), P.validateSchema = this.compile(y, !0));
  }
  const q = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(P) {
    return { anyOf: [P, q] };
  }
})(Wh);
var ti = {}, ri = {}, ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
const lv = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ni.default = lv;
var zt = {};
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.callRef = zt.getValidate = void 0;
const uv = an, yl = he, tt = ce, Lr = lt, $l = Ze, ts = B, dv = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = $l.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new uv.default(n.opts.uriResolver, s, r);
    if (l instanceof $l.SchemaEnv)
      return g(l);
    return p(l);
    function h() {
      if (a === d)
        return Ps(t, o, a, a.$async);
      const w = e.scopeValue("root", { ref: d });
      return Ps(t, (0, tt._)`${w}.validate`, d, d.$async);
    }
    function g(w) {
      const $ = Km(t, w);
      Ps(t, $, w, w.$async);
    }
    function p(w) {
      const $ = e.scopeValue("schema", i.code.source === !0 ? { ref: w, code: (0, tt.stringify)(w) } : { ref: w }), v = e.name("valid"), m = t.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: tt.nil,
        topSchemaRef: $,
        errSchemaPath: r
      }, v);
      t.mergeEvaluated(m), t.ok(v);
    }
  }
};
function Km(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, tt._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
zt.getValidate = Km;
function Ps(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, d = c.passContext ? Lr.default.this : tt.nil;
  n ? l() : h();
  function l() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, tt._)`await ${(0, yl.callValidateCode)(t, e, d)}`), p(e), o || s.assign(w, !0);
    }, ($) => {
      s.if((0, tt._)`!(${$} instanceof ${a.ValidationError})`, () => s.throw($)), g($), o || s.assign(w, !1);
    }), t.ok(w);
  }
  function h() {
    t.result((0, yl.callValidateCode)(t, e, d), () => p(e), () => g(e));
  }
  function g(w) {
    const $ = (0, tt._)`${w}.errors`;
    s.assign(Lr.default.vErrors, (0, tt._)`${Lr.default.vErrors} === null ? ${$} : ${Lr.default.vErrors}.concat(${$})`), s.assign(Lr.default.errors, (0, tt._)`${Lr.default.vErrors}.length`);
  }
  function p(w) {
    var $;
    if (!a.opts.unevaluated)
      return;
    const v = ($ = r == null ? void 0 : r.validate) === null || $ === void 0 ? void 0 : $.evaluated;
    if (a.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (a.props = ts.mergeEvaluated.props(s, v.props, a.props));
      else {
        const m = s.var("props", (0, tt._)`${w}.evaluated.props`);
        a.props = ts.mergeEvaluated.props(s, m, a.props, tt.Name);
      }
    if (a.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (a.items = ts.mergeEvaluated.items(s, v.items, a.items));
      else {
        const m = s.var("items", (0, tt._)`${w}.evaluated.items`);
        a.items = ts.mergeEvaluated.items(s, m, a.items, tt.Name);
      }
  }
}
zt.callRef = Ps;
zt.default = dv;
Object.defineProperty(ri, "__esModule", { value: !0 });
const fv = ni, hv = zt, mv = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  fv.default,
  hv.default
];
ri.default = mv;
var si = {}, ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const qs = ce, xt = qs.operators, Fs = {
  maximum: { okStr: "<=", ok: xt.LTE, fail: xt.GT },
  minimum: { okStr: ">=", ok: xt.GTE, fail: xt.LT },
  exclusiveMaximum: { okStr: "<", ok: xt.LT, fail: xt.GTE },
  exclusiveMinimum: { okStr: ">", ok: xt.GT, fail: xt.LTE }
}, pv = {
  message: ({ keyword: t, schemaCode: e }) => (0, qs.str)`must be ${Fs[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, qs._)`{comparison: ${Fs[t].okStr}, limit: ${e}}`
}, yv = {
  keyword: Object.keys(Fs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: pv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, qs._)`${r} ${Fs[e].fail} ${n} || isNaN(${r})`);
  }
};
ai.default = yv;
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const Rn = ce, $v = {
  message: ({ schemaCode: t }) => (0, Rn.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, Rn._)`{multipleOf: ${t}}`
}, gv = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: $v,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, Rn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Rn._)`${o} !== parseInt(${o})`;
    t.fail$data((0, Rn._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
oi.default = gv;
var ii = {}, ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
function Qm(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ci.default = Qm;
Qm.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ii, "__esModule", { value: !0 });
const mr = ce, vv = B, _v = ci, wv = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, mr.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, mr._)`{limit: ${t}}`
}, bv = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: wv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? mr.operators.GT : mr.operators.LT, o = s.opts.unicode === !1 ? (0, mr._)`${r}.length` : (0, mr._)`${(0, vv.useFunc)(t.gen, _v.default)}(${r})`;
    t.fail$data((0, mr._)`${o} ${a} ${n}`);
  }
};
ii.default = bv;
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
const Sv = he, Ev = B, Kr = ce, Nv = {
  message: ({ schemaCode: t }) => (0, Kr.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, Kr._)`{pattern: ${t}}`
}, Pv = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Nv,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t, i = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Kr._)`new RegExp` : (0, Ev.useFunc)(e, c), l = e.let("valid");
      e.try(() => e.assign(l, (0, Kr._)`${d}(${a}, ${i}).test(${r})`), () => e.assign(l, !1)), t.fail$data((0, Kr._)`!${l}`);
    } else {
      const c = (0, Sv.usePattern)(t, s);
      t.fail$data((0, Kr._)`!${c}.test(${r})`);
    }
  }
};
li.default = Pv;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
const In = ce, Tv = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, In.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, In._)`{limit: ${t}}`
}, Ov = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Tv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? In.operators.GT : In.operators.LT;
    t.fail$data((0, In._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
ui.default = Ov;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
const vn = he, jn = ce, Rv = B, Iv = {
  message: ({ params: { missingProperty: t } }) => (0, jn.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, jn._)`{missingProperty: ${t}}`
}, jv = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Iv,
  code(t) {
    const { gen: e, schema: r, schemaCode: n, data: s, $data: a, it: o } = t, { opts: i } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= i.loopRequired;
    if (o.allErrors ? d() : l(), i.strictRequired) {
      const p = t.parentSchema.properties, { definedProperties: w } = t.it;
      for (const $ of r)
        if ((p == null ? void 0 : p[$]) === void 0 && !w.has($)) {
          const v = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${$}" is not defined at "${v}" (strictRequired)`;
          (0, Rv.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        t.block$data(jn.nil, h);
      else
        for (const p of r)
          (0, vn.checkReportMissingProp)(t, p);
    }
    function l() {
      const p = e.let("missing");
      if (c || a) {
        const w = e.let("valid", !0);
        t.block$data(w, () => g(p, w)), t.ok(w);
      } else
        e.if((0, vn.checkMissingProp)(t, r, p)), (0, vn.reportMissingProp)(t, p), e.else();
    }
    function h() {
      e.forOf("prop", n, (p) => {
        t.setParams({ missingProperty: p }), e.if((0, vn.noPropertyInData)(e, s, p, i.ownProperties), () => t.error());
      });
    }
    function g(p, w) {
      t.setParams({ missingProperty: p }), e.forOf(p, n, () => {
        e.assign(w, (0, vn.propertyInData)(e, s, p, i.ownProperties)), e.if((0, jn.not)(w), () => {
          t.error(), e.break();
        });
      }, jn.nil);
    }
  }
};
di.default = jv;
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
const Cn = ce, Cv = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, Cn.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, Cn._)`{limit: ${t}}`
}, Av = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Cv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? Cn.operators.GT : Cn.operators.LT;
    t.fail$data((0, Cn._)`${r}.length ${s} ${n}`);
  }
};
fi.default = Av;
var hi = {}, xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
const Gm = na;
Gm.code = 'require("ajv/dist/runtime/equal").default';
xn.default = Gm;
Object.defineProperty(hi, "__esModule", { value: !0 });
const ka = je, De = ce, kv = B, Lv = xn, Dv = {
  message: ({ params: { i: t, j: e } }) => (0, De.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, De._)`{i: ${t}, j: ${e}}`
}, Mv = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Dv,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: i } = t;
    if (!n && !s)
      return;
    const c = e.let("valid"), d = a.items ? (0, ka.getSchemaTypes)(a.items) : [];
    t.block$data(c, l, (0, De._)`${o} === false`), t.ok(c);
    function l() {
      const w = e.let("i", (0, De._)`${r}.length`), $ = e.let("j");
      t.setParams({ i: w, j: $ }), e.assign(c, !0), e.if((0, De._)`${w} > 1`, () => (h() ? g : p)(w, $));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function g(w, $) {
      const v = e.name("item"), m = (0, ka.checkDataTypes)(d, v, i.opts.strictNumbers, ka.DataType.Wrong), b = e.const("indices", (0, De._)`{}`);
      e.for((0, De._)`;${w}--;`, () => {
        e.let(v, (0, De._)`${r}[${w}]`), e.if(m, (0, De._)`continue`), d.length > 1 && e.if((0, De._)`typeof ${v} == "string"`, (0, De._)`${v} += "_"`), e.if((0, De._)`typeof ${b}[${v}] == "number"`, () => {
          e.assign($, (0, De._)`${b}[${v}]`), t.error(), e.assign(c, !1).break();
        }).code((0, De._)`${b}[${v}] = ${w}`);
      });
    }
    function p(w, $) {
      const v = (0, kv.useFunc)(e, Lv.default), m = e.name("outer");
      e.label(m).for((0, De._)`;${w}--;`, () => e.for((0, De._)`${$} = ${w}; ${$}--;`, () => e.if((0, De._)`${v}(${r}[${w}], ${r}[${$}])`, () => {
        t.error(), e.assign(c, !1).break(m);
      })));
    }
  }
};
hi.default = Mv;
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
const ro = ce, Vv = B, qv = xn, Fv = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, ro._)`{allowedValue: ${t}}`
}, zv = {
  keyword: "const",
  $data: !0,
  error: Fv,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, ro._)`!${(0, Vv.useFunc)(e, qv.default)}(${r}, ${s})`) : t.fail((0, ro._)`${a} !== ${r}`);
  }
};
mi.default = zv;
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
const En = ce, Uv = B, Bv = xn, Kv = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, En._)`{allowedValues: ${t}}`
}, Qv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Kv,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Uv.useFunc)(e, Bv.default));
    let l;
    if (i || n)
      l = e.let("valid"), t.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const p = e.const("vSchema", a);
      l = (0, En.or)(...s.map((w, $) => g(p, $)));
    }
    t.pass(l);
    function h() {
      e.assign(l, !1), e.forOf("v", a, (p) => e.if((0, En._)`${d()}(${r}, ${p})`, () => e.assign(l, !0).break()));
    }
    function g(p, w) {
      const $ = s[w];
      return typeof $ == "object" && $ !== null ? (0, En._)`${d()}(${r}, ${p}[${w}])` : (0, En._)`${r} === ${$}`;
    }
  }
};
pi.default = Qv;
Object.defineProperty(si, "__esModule", { value: !0 });
const Gv = ai, xv = oi, Hv = ii, Jv = li, Wv = ui, Xv = di, Yv = fi, Zv = hi, e_ = mi, t_ = pi, r_ = [
  // number
  Gv.default,
  xv.default,
  // string
  Hv.default,
  Jv.default,
  // object
  Wv.default,
  Xv.default,
  // array
  Yv.default,
  Zv.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  e_.default,
  t_.default
];
si.default = r_;
var yi = {}, on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.validateAdditionalItems = void 0;
const pr = ce, no = B, n_ = {
  message: ({ params: { len: t } }) => (0, pr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, pr._)`{limit: ${t}}`
}, s_ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: n_,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, no.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    xm(t, n);
  }
};
function xm(t, e) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = t;
  o.items = !0;
  const i = r.const("len", (0, pr._)`${s}.length`);
  if (n === !1)
    t.setParams({ len: e.length }), t.pass((0, pr._)`${i} <= ${e.length}`);
  else if (typeof n == "object" && !(0, no.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, pr._)`${i} <= ${e.length}`);
    r.if((0, pr.not)(d), () => c(d)), t.ok(d);
  }
  function c(d) {
    r.forRange("i", e.length, i, (l) => {
      t.subschema({ keyword: a, dataProp: l, dataPropType: no.Type.Num }, d), o.allErrors || r.if((0, pr.not)(d), () => r.break());
    });
  }
}
on.validateAdditionalItems = xm;
on.default = s_;
var $i = {}, cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.validateTuple = void 0;
const gl = ce, Ts = B, a_ = he, o_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return Hm(t, "additionalItems", e);
    r.items = !0, !(0, Ts.alwaysValidSchema)(r, e) && t.ok((0, a_.validateArray)(t));
  }
};
function Hm(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  l(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = Ts.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), d = n.const("len", (0, gl._)`${a}.length`);
  r.forEach((h, g) => {
    (0, Ts.alwaysValidSchema)(i, h) || (n.if((0, gl._)`${d} > ${g}`, () => t.subschema({
      keyword: o,
      schemaProp: g,
      dataProp: g
    }, c)), t.ok(c));
  });
  function l(h) {
    const { opts: g, errSchemaPath: p } = i, w = r.length, $ = w === h.minItems && (w === h.maxItems || h[e] === !1);
    if (g.strictTuples && !$) {
      const v = `"${o}" is ${w}-tuple, but minItems or maxItems/${e} are not specified or different at path "${p}"`;
      (0, Ts.checkStrictMode)(i, v, g.strictTuples);
    }
  }
}
cn.validateTuple = Hm;
cn.default = o_;
Object.defineProperty($i, "__esModule", { value: !0 });
const i_ = cn, c_ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, i_.validateTuple)(t, "items")
};
$i.default = c_;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const vl = ce, l_ = B, u_ = he, d_ = on, f_ = {
  message: ({ params: { len: t } }) => (0, vl.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, vl._)`{limit: ${t}}`
}, h_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: f_,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, l_.alwaysValidSchema)(n, e) && (s ? (0, d_.validateAdditionalItems)(t, s) : t.ok((0, u_.validateArray)(t)));
  }
};
gi.default = h_;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const ut = ce, rs = B, m_ = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, ut.str)`must contain at least ${t} valid item(s)` : (0, ut.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, ut._)`{minContains: ${t}}` : (0, ut._)`{minContains: ${t}, maxContains: ${e}}`
}, p_ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: m_,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    let o, i;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, i = d) : o = 1;
    const l = e.const("len", (0, ut._)`${s}.length`);
    if (t.setParams({ min: o, max: i }), i === void 0 && o === 0) {
      (0, rs.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (i !== void 0 && o > i) {
      (0, rs.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), t.fail();
      return;
    }
    if ((0, rs.alwaysValidSchema)(a, r)) {
      let $ = (0, ut._)`${l} >= ${o}`;
      i !== void 0 && ($ = (0, ut._)`${$} && ${l} <= ${i}`), t.pass($);
      return;
    }
    a.items = !0;
    const h = e.name("valid");
    i === void 0 && o === 1 ? p(h, () => e.if(h, () => e.break())) : o === 0 ? (e.let(h, !0), i !== void 0 && e.if((0, ut._)`${s}.length > 0`, g)) : (e.let(h, !1), g()), t.result(h, () => t.reset());
    function g() {
      const $ = e.name("_valid"), v = e.let("count", 0);
      p($, () => e.if($, () => w(v)));
    }
    function p($, v) {
      e.forRange("i", 0, l, (m) => {
        t.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: rs.Type.Num,
          compositeRule: !0
        }, $), v();
      });
    }
    function w($) {
      e.code((0, ut._)`${$}++`), i === void 0 ? e.if((0, ut._)`${$} >= ${o}`, () => e.assign(h, !0).break()) : (e.if((0, ut._)`${$} > ${i}`, () => e.assign(h, !1).break()), o === 1 ? e.assign(h, !0) : e.if((0, ut._)`${$} >= ${o}`, () => e.assign(h, !0)));
    }
  }
};
vi.default = p_;
var ia = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.validateSchemaDeps = t.validatePropertyDeps = t.error = void 0;
  const e = ce, r = B, n = he;
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
      const g = Array.isArray(c[h]) ? d : l;
      g[h] = c[h];
    }
    return [d, l];
  }
  function o(c, d = c.schema) {
    const { gen: l, data: h, it: g } = c;
    if (Object.keys(d).length === 0)
      return;
    const p = l.let("missing");
    for (const w in d) {
      const $ = d[w];
      if ($.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, h, w, g.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: $.length,
        deps: $.join(", ")
      }), g.allErrors ? l.if(v, () => {
        for (const m of $)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, e._)`${v} && (${(0, n.checkMissingProp)(c, $, p)})`), (0, n.reportMissingProp)(c, p), l.else());
    }
  }
  t.validatePropertyDeps = o;
  function i(c, d = c.schema) {
    const { gen: l, data: h, keyword: g, it: p } = c, w = l.name("valid");
    for (const $ in d)
      (0, r.alwaysValidSchema)(p, d[$]) || (l.if(
        (0, n.propertyInData)(l, h, $, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: g, schemaProp: $ }, w);
          c.mergeValidEvaluated(v, w);
        },
        () => l.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  t.validateSchemaDeps = i, t.default = s;
})(ia);
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
const Jm = ce, y_ = B, $_ = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, Jm._)`{propertyName: ${t.propertyName}}`
}, g_ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: $_,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, y_.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, Jm.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
_i.default = g_;
var ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
const ns = he, $t = ce, v_ = lt, ss = B, __ = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, $t._)`{additionalProperty: ${t.additionalProperty}}`
}, w_ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: __,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, ss.alwaysValidSchema)(o, r))
      return;
    const d = (0, ns.allSchemaProperties)(n.properties), l = (0, ns.allSchemaProperties)(n.patternProperties);
    h(), t.ok((0, $t._)`${a} === ${v_.default.errors}`);
    function h() {
      e.forIn("key", s, (v) => {
        !d.length && !l.length ? w(v) : e.if(g(v), () => w(v));
      });
    }
    function g(v) {
      let m;
      if (d.length > 8) {
        const b = (0, ss.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, ns.isOwnProperty)(e, b, v);
      } else d.length ? m = (0, $t.or)(...d.map((b) => (0, $t._)`${v} === ${b}`)) : m = $t.nil;
      return l.length && (m = (0, $t.or)(m, ...l.map((b) => (0, $t._)`${(0, ns.usePattern)(t, b)}.test(${v})`))), (0, $t.not)(m);
    }
    function p(v) {
      e.code((0, $t._)`delete ${s}[${v}]`);
    }
    function w(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        p(v);
        return;
      }
      if (r === !1) {
        t.setParams({ additionalProperty: v }), t.error(), i || e.break();
        return;
      }
      if (typeof r == "object" && !(0, ss.alwaysValidSchema)(o, r)) {
        const m = e.name("valid");
        c.removeAdditional === "failing" ? ($(v, m, !1), e.if((0, $t.not)(m), () => {
          t.reset(), p(v);
        })) : ($(v, m), i || e.if((0, $t.not)(m), () => e.break()));
      }
    }
    function $(v, m, b) {
      const T = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: ss.Type.Str
      };
      b === !1 && Object.assign(T, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), t.subschema(T, m);
    }
  }
};
ca.default = w_;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
const b_ = bt, _l = he, La = B, wl = ca, S_ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && wl.default.code(new b_.KeywordCxt(a, wl.default, "additionalProperties"));
    const o = (0, _l.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = La.mergeEvaluated.props(e, (0, La.toHash)(o), a.props));
    const i = o.filter((h) => !(0, La.alwaysValidSchema)(a, r[h]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const h of i)
      d(h) ? l(h) : (e.if((0, _l.propertyInData)(e, s, h, a.opts.ownProperties)), l(h), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(h), t.ok(c);
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
wi.default = S_;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
const bl = he, as = ce, Sl = B, El = B, E_ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, bl.allSchemaProperties)(r), c = i.filter(($) => (0, Sl.alwaysValidSchema)(a, r[$]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = e.name("valid");
    a.props !== !0 && !(a.props instanceof as.Name) && (a.props = (0, El.evaluatedPropsToName)(e, a.props));
    const { props: h } = a;
    g();
    function g() {
      for (const $ of i)
        d && p($), a.allErrors ? w($) : (e.var(l, !0), w($), e.if(l));
    }
    function p($) {
      for (const v in d)
        new RegExp($).test(v) && (0, Sl.checkStrictMode)(a, `property ${v} matches pattern ${$} (use allowMatchingProperties)`);
    }
    function w($) {
      e.forIn("key", n, (v) => {
        e.if((0, as._)`${(0, bl.usePattern)(t, $)}.test(${v})`, () => {
          const m = c.includes($);
          m || t.subschema({
            keyword: "patternProperties",
            schemaProp: $,
            dataProp: v,
            dataPropType: El.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? e.assign((0, as._)`${h}[${v}]`, !0) : !m && !a.allErrors && e.if((0, as.not)(l), () => e.break());
        });
      });
    }
  }
};
bi.default = E_;
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
const N_ = B, P_ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, N_.alwaysValidSchema)(n, r)) {
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
Si.default = P_;
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const T_ = he, O_ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: T_.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Ei.default = O_;
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
const Os = ce, R_ = B, I_ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, Os._)`{passingSchemas: ${t.passing}}`
}, j_ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: I_,
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
        let g;
        (0, R_.alwaysValidSchema)(s, l) ? e.var(c, !0) : g = t.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && e.if((0, Os._)`${c} && ${o}`).assign(o, !1).assign(i, (0, Os._)`[${i}, ${h}]`).else(), e.if(c, () => {
          e.assign(o, !0), e.assign(i, h), g && t.mergeEvaluated(g, Os.Name);
        });
      });
    }
  }
};
Ni.default = j_;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
const C_ = B, A_ = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, C_.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
Pi.default = A_;
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
const zs = ce, Wm = B, k_ = {
  message: ({ params: t }) => (0, zs.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, zs._)`{failingKeyword: ${t.ifClause}}`
}, L_ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: k_,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, Wm.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Nl(n, "then"), a = Nl(n, "else");
    if (!s && !a)
      return;
    const o = e.let("valid", !0), i = e.name("_valid");
    if (c(), t.reset(), s && a) {
      const l = e.let("ifClause");
      t.setParams({ ifClause: l }), e.if(i, d("then", l), d("else", l));
    } else s ? e.if(i, d("then")) : e.if((0, zs.not)(i), d("else"));
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
        const g = t.subschema({ keyword: l }, i);
        e.assign(o, i), t.mergeValidEvaluated(g, o), h ? e.assign(h, (0, zs._)`${l}`) : t.setParams({ ifClause: l });
      };
    }
  }
};
function Nl(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, Wm.alwaysValidSchema)(t, r);
}
Ti.default = L_;
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
const D_ = B, M_ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, D_.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
Oi.default = M_;
Object.defineProperty(yi, "__esModule", { value: !0 });
const V_ = on, q_ = $i, F_ = cn, z_ = gi, U_ = vi, B_ = ia, K_ = _i, Q_ = ca, G_ = wi, x_ = bi, H_ = Si, J_ = Ei, W_ = Ni, X_ = Pi, Y_ = Ti, Z_ = Oi;
function ew(t = !1) {
  const e = [
    // any
    H_.default,
    J_.default,
    W_.default,
    X_.default,
    Y_.default,
    Z_.default,
    // object
    K_.default,
    Q_.default,
    B_.default,
    G_.default,
    x_.default
  ];
  return t ? e.push(q_.default, z_.default) : e.push(V_.default, F_.default), e.push(U_.default), e;
}
yi.default = ew;
var Ri = {}, ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.dynamicAnchor = void 0;
const Da = ce, tw = lt, Pl = Ze, rw = zt, nw = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (t) => Xm(t, t.schema)
};
function Xm(t, e) {
  const { gen: r, it: n } = t;
  n.schemaEnv.root.dynamicAnchors[e] = !0;
  const s = (0, Da._)`${tw.default.dynamicAnchors}${(0, Da.getProperty)(e)}`, a = n.errSchemaPath === "#" ? n.validateName : sw(t);
  r.if((0, Da._)`!${s}`, () => r.assign(s, a));
}
ln.dynamicAnchor = Xm;
function sw(t) {
  const { schemaEnv: e, schema: r, self: n } = t.it, { root: s, baseId: a, localRefs: o, meta: i } = e.root, { schemaId: c } = n.opts, d = new Pl.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: i });
  return Pl.compileSchema.call(n, d), (0, rw.getValidate)(t, d);
}
ln.default = nw;
var un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
un.dynamicRef = void 0;
const Tl = ce, aw = lt, Ol = zt, ow = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (t) => Ym(t, t.schema)
};
function Ym(t, e) {
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
      const d = r.let("_v", (0, Tl._)`${aw.default.dynamicAnchors}${(0, Tl.getProperty)(a)}`);
      r.if(d, i(d, c), i(s.validateName, c));
    } else
      i(s.validateName, c)();
  }
  function i(c, d) {
    return d ? () => r.block(() => {
      (0, Ol.callRef)(t, c), r.let(d, !0);
    }) : () => (0, Ol.callRef)(t, c);
  }
}
un.dynamicRef = Ym;
un.default = ow;
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
const iw = ln, cw = B, lw = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(t) {
    t.schema ? (0, iw.dynamicAnchor)(t, "") : (0, cw.checkStrictMode)(t.it, "$recursiveAnchor: false is ignored");
  }
};
Ii.default = lw;
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
const uw = un, dw = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (t) => (0, uw.dynamicRef)(t, t.schema)
};
ji.default = dw;
Object.defineProperty(Ri, "__esModule", { value: !0 });
const fw = ln, hw = un, mw = Ii, pw = ji, yw = [fw.default, hw.default, mw.default, pw.default];
Ri.default = yw;
var Ci = {}, Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
const Rl = ia, $w = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Rl.error,
  code: (t) => (0, Rl.validatePropertyDeps)(t)
};
Ai.default = $w;
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
const gw = ia, vw = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (t) => (0, gw.validateSchemaDeps)(t)
};
ki.default = vw;
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
const _w = B, ww = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: t, parentSchema: e, it: r }) {
    e.contains === void 0 && (0, _w.checkStrictMode)(r, `"${t}" without "contains" is ignored`);
  }
};
Li.default = ww;
Object.defineProperty(Ci, "__esModule", { value: !0 });
const bw = Ai, Sw = ki, Ew = Li, Nw = [bw.default, Sw.default, Ew.default];
Ci.default = Nw;
var Di = {}, Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
const Wt = ce, Il = B, Pw = lt, Tw = {
  message: "must NOT have unevaluated properties",
  params: ({ params: t }) => (0, Wt._)`{unevaluatedProperty: ${t.unevaluatedProperty}}`
}, Ow = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Tw,
  code(t) {
    const { gen: e, schema: r, data: n, errsCount: s, it: a } = t;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: i } = a;
    i instanceof Wt.Name ? e.if((0, Wt._)`${i} !== true`, () => e.forIn("key", n, (h) => e.if(d(i, h), () => c(h)))) : i !== !0 && e.forIn("key", n, (h) => i === void 0 ? c(h) : e.if(l(i, h), () => c(h))), a.props = !0, t.ok((0, Wt._)`${s} === ${Pw.default.errors}`);
    function c(h) {
      if (r === !1) {
        t.setParams({ unevaluatedProperty: h }), t.error(), o || e.break();
        return;
      }
      if (!(0, Il.alwaysValidSchema)(a, r)) {
        const g = e.name("valid");
        t.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Il.Type.Str
        }, g), o || e.if((0, Wt.not)(g), () => e.break());
      }
    }
    function d(h, g) {
      return (0, Wt._)`!${h} || !${h}[${g}]`;
    }
    function l(h, g) {
      const p = [];
      for (const w in h)
        h[w] === !0 && p.push((0, Wt._)`${g} !== ${w}`);
      return (0, Wt.and)(...p);
    }
  }
};
Mi.default = Ow;
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
const yr = ce, jl = B, Rw = {
  message: ({ params: { len: t } }) => (0, yr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, yr._)`{limit: ${t}}`
}, Iw = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Rw,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t, a = s.items || 0;
    if (a === !0)
      return;
    const o = e.const("len", (0, yr._)`${n}.length`);
    if (r === !1)
      t.setParams({ len: a }), t.fail((0, yr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, jl.alwaysValidSchema)(s, r)) {
      const c = e.var("valid", (0, yr._)`${o} <= ${a}`);
      e.if((0, yr.not)(c), () => i(c, a)), t.ok(c);
    }
    s.items = !0;
    function i(c, d) {
      e.forRange("i", d, o, (l) => {
        t.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: jl.Type.Num }, c), s.allErrors || e.if((0, yr.not)(c), () => e.break());
      });
    }
  }
};
Vi.default = Iw;
Object.defineProperty(Di, "__esModule", { value: !0 });
const jw = Mi, Cw = Vi, Aw = [jw.default, Cw.default];
Di.default = Aw;
var qi = {}, Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
const Te = ce, kw = {
  message: ({ schemaCode: t }) => (0, Te.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, Te._)`{format: ${t}}`
}, Lw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: kw,
  code(t, e) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = i;
    if (!c.validateFormats)
      return;
    s ? g() : p();
    function g() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), $ = r.const("fDef", (0, Te._)`${w}[${o}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, Te._)`typeof ${$} == "object" && !(${$} instanceof RegExp)`, () => r.assign(v, (0, Te._)`${$}.type || "string"`).assign(m, (0, Te._)`${$}.validate`), () => r.assign(v, (0, Te._)`"string"`).assign(m, $)), t.fail$data((0, Te.or)(b(), T()));
      function b() {
        return c.strictSchema === !1 ? Te.nil : (0, Te._)`${o} && !${m}`;
      }
      function T() {
        const R = l.$async ? (0, Te._)`(${$}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, Te._)`${m}(${n})`, j = (0, Te._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, Te._)`${m} && ${m} !== true && ${v} === ${e} && !${j}`;
      }
    }
    function p() {
      const w = h.formats[a];
      if (!w) {
        b();
        return;
      }
      if (w === !0)
        return;
      const [$, v, m] = T(w);
      $ === e && t.pass(R());
      function b() {
        if (c.strictSchema === !1) {
          h.logger.warn(j());
          return;
        }
        throw new Error(j());
        function j() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function T(j) {
        const U = j instanceof RegExp ? (0, Te.regexpCode)(j) : c.code.formats ? (0, Te._)`${c.code.formats}${(0, Te.getProperty)(a)}` : void 0, M = r.scopeValue("formats", { key: a, ref: j, code: U });
        return typeof j == "object" && !(j instanceof RegExp) ? [j.type || "string", j.validate, (0, Te._)`${M}.validate`] : ["string", j, M];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Te._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, Te._)`${m}(${n})` : (0, Te._)`${m}.test(${n})`;
      }
    }
  }
};
Fi.default = Lw;
Object.defineProperty(qi, "__esModule", { value: !0 });
const Dw = Fi, Mw = [Dw.default];
qi.default = Mw;
var tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.contentVocabulary = tn.metadataVocabulary = void 0;
tn.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
tn.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(ti, "__esModule", { value: !0 });
const Vw = ri, qw = si, Fw = yi, zw = Ri, Uw = Ci, Bw = Di, Kw = qi, Cl = tn, Qw = [
  zw.default,
  Vw.default,
  qw.default,
  (0, Fw.default)(!0),
  Kw.default,
  Cl.metadataVocabulary,
  Cl.contentVocabulary,
  Uw.default,
  Bw.default
];
ti.default = Qw;
var zi = {}, la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
la.DiscrError = void 0;
var Al;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(Al || (la.DiscrError = Al = {}));
Object.defineProperty(zi, "__esModule", { value: !0 });
const qr = ce, so = la, kl = Ze, Gw = an, xw = B, Hw = {
  message: ({ params: { discrError: t, tagName: e } }) => t === so.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, qr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, Jw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Hw,
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
    const c = e.let("valid", !1), d = e.const("tag", (0, qr._)`${r}${(0, qr.getProperty)(i)}`);
    e.if((0, qr._)`typeof ${d} == "string"`, () => l(), () => t.error(!1, { discrError: so.DiscrError.Tag, tag: d, tagName: i })), t.ok(c);
    function l() {
      const p = g();
      e.if(!1);
      for (const w in p)
        e.elseIf((0, qr._)`${d} === ${w}`), e.assign(c, h(p[w]));
      e.else(), t.error(!1, { discrError: so.DiscrError.Mapping, tag: d, tagName: i }), e.endIf();
    }
    function h(p) {
      const w = e.name("valid"), $ = t.subschema({ keyword: "oneOf", schemaProp: p }, w);
      return t.mergeEvaluated($, qr.Name), w;
    }
    function g() {
      var p;
      const w = {}, $ = m(s);
      let v = !0;
      for (let R = 0; R < o.length; R++) {
        let j = o[R];
        if (j != null && j.$ref && !(0, xw.schemaHasRulesButRef)(j, a.self.RULES)) {
          const M = j.$ref;
          if (j = kl.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, M), j instanceof kl.SchemaEnv && (j = j.schema), j === void 0)
            throw new Gw.default(a.opts.uriResolver, a.baseId, M);
        }
        const U = (p = j == null ? void 0 : j.properties) === null || p === void 0 ? void 0 : p[i];
        if (typeof U != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`);
        v = v && ($ || m(j)), b(U, R);
      }
      if (!v)
        throw new Error(`discriminator: "${i}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(i);
      }
      function b(R, j) {
        if (R.const)
          T(R.const, j);
        else if (R.enum)
          for (const U of R.enum)
            T(U, j);
        else
          throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
      }
      function T(R, j) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${i}" values must be unique strings`);
        w[R] = j;
      }
    }
  }
};
zi.default = Jw;
var Ui = {};
const Ww = "https://json-schema.org/draft/2020-12/schema", Xw = "https://json-schema.org/draft/2020-12/schema", Yw = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Zw = "meta", eb = "Core and Validation specifications meta-schema", tb = [
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
], rb = [
  "object",
  "boolean"
], nb = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", sb = {
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
}, ab = {
  $schema: Ww,
  $id: Xw,
  $vocabulary: Yw,
  $dynamicAnchor: Zw,
  title: eb,
  allOf: tb,
  type: rb,
  $comment: nb,
  properties: sb
}, ob = "https://json-schema.org/draft/2020-12/schema", ib = "https://json-schema.org/draft/2020-12/meta/applicator", cb = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, lb = "meta", ub = "Applicator vocabulary meta-schema", db = [
  "object",
  "boolean"
], fb = {
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
}, hb = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, mb = {
  $schema: ob,
  $id: ib,
  $vocabulary: cb,
  $dynamicAnchor: lb,
  title: ub,
  type: db,
  properties: fb,
  $defs: hb
}, pb = "https://json-schema.org/draft/2020-12/schema", yb = "https://json-schema.org/draft/2020-12/meta/unevaluated", $b = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, gb = "meta", vb = "Unevaluated applicator vocabulary meta-schema", _b = [
  "object",
  "boolean"
], wb = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, bb = {
  $schema: pb,
  $id: yb,
  $vocabulary: $b,
  $dynamicAnchor: gb,
  title: vb,
  type: _b,
  properties: wb
}, Sb = "https://json-schema.org/draft/2020-12/schema", Eb = "https://json-schema.org/draft/2020-12/meta/content", Nb = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Pb = "meta", Tb = "Content vocabulary meta-schema", Ob = [
  "object",
  "boolean"
], Rb = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Ib = {
  $schema: Sb,
  $id: Eb,
  $vocabulary: Nb,
  $dynamicAnchor: Pb,
  title: Tb,
  type: Ob,
  properties: Rb
}, jb = "https://json-schema.org/draft/2020-12/schema", Cb = "https://json-schema.org/draft/2020-12/meta/core", Ab = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, kb = "meta", Lb = "Core vocabulary meta-schema", Db = [
  "object",
  "boolean"
], Mb = {
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
}, Vb = {
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
}, qb = {
  $schema: jb,
  $id: Cb,
  $vocabulary: Ab,
  $dynamicAnchor: kb,
  title: Lb,
  type: Db,
  properties: Mb,
  $defs: Vb
}, Fb = "https://json-schema.org/draft/2020-12/schema", zb = "https://json-schema.org/draft/2020-12/meta/format-annotation", Ub = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Bb = "meta", Kb = "Format vocabulary meta-schema for annotation results", Qb = [
  "object",
  "boolean"
], Gb = {
  format: {
    type: "string"
  }
}, xb = {
  $schema: Fb,
  $id: zb,
  $vocabulary: Ub,
  $dynamicAnchor: Bb,
  title: Kb,
  type: Qb,
  properties: Gb
}, Hb = "https://json-schema.org/draft/2020-12/schema", Jb = "https://json-schema.org/draft/2020-12/meta/meta-data", Wb = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, Xb = "meta", Yb = "Meta-data vocabulary meta-schema", Zb = [
  "object",
  "boolean"
], eS = {
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
}, tS = {
  $schema: Hb,
  $id: Jb,
  $vocabulary: Wb,
  $dynamicAnchor: Xb,
  title: Yb,
  type: Zb,
  properties: eS
}, rS = "https://json-schema.org/draft/2020-12/schema", nS = "https://json-schema.org/draft/2020-12/meta/validation", sS = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, aS = "meta", oS = "Validation vocabulary meta-schema", iS = [
  "object",
  "boolean"
], cS = {
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
}, lS = {
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
}, uS = {
  $schema: rS,
  $id: nS,
  $vocabulary: sS,
  $dynamicAnchor: aS,
  title: oS,
  type: iS,
  properties: cS,
  $defs: lS
};
Object.defineProperty(Ui, "__esModule", { value: !0 });
const dS = ab, fS = mb, hS = bb, mS = Ib, pS = qb, yS = xb, $S = tS, gS = uS, vS = ["/properties"];
function _S(t) {
  return [
    dS,
    fS,
    hS,
    mS,
    pS,
    e(this, yS),
    $S,
    e(this, gS)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function e(r, n) {
    return t ? r.$dataMetaSchema(n, vS) : n;
  }
}
Ui.default = _S;
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv2020 = void 0;
  const r = Wh, n = ti, s = zi, a = Ui, o = "https://json-schema.org/draft/2020-12/schema";
  class i extends r.default {
    constructor(p = {}) {
      super({
        ...p,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((p) => this.addVocabulary(p)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: p, meta: w } = this.opts;
      w && (a.default.call(this, p), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  e.Ajv2020 = i, t.exports = e = i, t.exports.Ajv2020 = i, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = i;
  var c = bt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = ce;
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
  var l = Gn;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var h = an;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Xa, Xa.exports);
var wS = Xa.exports, ao = { exports: {} }, Zm = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.formatNames = t.fastFormats = t.fullFormats = void 0;
  function e(x, X) {
    return { validate: x, compare: X };
  }
  t.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: e(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: e(c(!0), d),
    "date-time": e(g(!0), p),
    "iso-time": e(c(), l),
    "iso-date-time": e(g(), w),
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
    regex: $e,
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
    int32: { type: "number", validate: U },
    // signed 64 bit integer
    int64: { type: "number", validate: M },
    // C-type float
    float: { type: "number", validate: te },
    // C-type double
    double: { type: "number", validate: te },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, t.fastFormats = {
    ...t.fullFormats,
    date: e(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: e(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": e(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, p),
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
  function r(x) {
    return x % 4 === 0 && (x % 100 !== 0 || x % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(x) {
    const X = n.exec(x);
    if (!X)
      return !1;
    const Z = +X[1], K = +X[2], pe = +X[3];
    return K >= 1 && K <= 12 && pe >= 1 && pe <= (K === 2 && r(Z) ? 29 : s[K]);
  }
  function o(x, X) {
    if (x && X)
      return x > X ? 1 : x < X ? -1 : 0;
  }
  const i = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(x) {
    return function(Z) {
      const K = i.exec(Z);
      if (!K)
        return !1;
      const pe = +K[1], Ee = +K[2], F = +K[3], q = K[4], J = K[5] === "-" ? -1 : 1, P = +(K[6] || 0), y = +(K[7] || 0);
      if (P > 23 || y > 59 || x && !q)
        return !1;
      if (pe <= 23 && Ee <= 59 && F < 60)
        return !0;
      const E = Ee - y * J, _ = pe - P * J - (E < 0 ? 1 : 0);
      return (_ === 23 || _ === -1) && (E === 59 || E === -1) && F < 61;
    };
  }
  function d(x, X) {
    if (!(x && X))
      return;
    const Z = (/* @__PURE__ */ new Date("2020-01-01T" + x)).valueOf(), K = (/* @__PURE__ */ new Date("2020-01-01T" + X)).valueOf();
    if (Z && K)
      return Z - K;
  }
  function l(x, X) {
    if (!(x && X))
      return;
    const Z = i.exec(x), K = i.exec(X);
    if (Z && K)
      return x = Z[1] + Z[2] + Z[3], X = K[1] + K[2] + K[3], x > X ? 1 : x < X ? -1 : 0;
  }
  const h = /t|\s/i;
  function g(x) {
    const X = c(x);
    return function(K) {
      const pe = K.split(h);
      return pe.length === 2 && a(pe[0]) && X(pe[1]);
    };
  }
  function p(x, X) {
    if (!(x && X))
      return;
    const Z = new Date(x).valueOf(), K = new Date(X).valueOf();
    if (Z && K)
      return Z - K;
  }
  function w(x, X) {
    if (!(x && X))
      return;
    const [Z, K] = x.split(h), [pe, Ee] = X.split(h), F = o(Z, pe);
    if (F !== void 0)
      return F || d(K, Ee);
  }
  const $ = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(x) {
    return $.test(x) && v.test(x);
  }
  const b = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function T(x) {
    return b.lastIndex = 0, b.test(x);
  }
  const R = -2147483648, j = 2 ** 31 - 1;
  function U(x) {
    return Number.isInteger(x) && x <= j && x >= R;
  }
  function M(x) {
    return Number.isInteger(x);
  }
  function te() {
    return !0;
  }
  const fe = /[^\\]\\Z/;
  function $e(x) {
    if (fe.test(x))
      return !1;
    try {
      return new RegExp(x), !0;
    } catch {
      return !1;
    }
  }
})(Zm);
var ep = {}, oo = { exports: {} }, tp = {}, It = {}, dr = {}, Hn = {}, de = {}, qn = {};
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
      return (b = this._str) !== null && b !== void 0 ? b : this._str = this._items.reduce((T, R) => `${T}${R}`, "");
    }
    get names() {
      var b;
      return (b = this._names) !== null && b !== void 0 ? b : this._names = this._items.reduce((T, R) => (R instanceof r && (T[R.str] = (T[R.str] || 0) + 1), T), {});
    }
  }
  t._Code = n, t.nil = new n("");
  function s(m, ...b) {
    const T = [m[0]];
    let R = 0;
    for (; R < b.length; )
      i(T, b[R]), T.push(m[++R]);
    return new n(T);
  }
  t._ = s;
  const a = new n("+");
  function o(m, ...b) {
    const T = [p(m[0])];
    let R = 0;
    for (; R < b.length; )
      T.push(a), i(T, b[R]), T.push(a, p(m[++R]));
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
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : p(Array.isArray(m) ? m.join(",") : m);
  }
  function g(m) {
    return new n(p(m));
  }
  t.stringify = g;
  function p(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  t.safeStringify = p;
  function w(m) {
    return typeof m == "string" && t.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  t.getProperty = w;
  function $(m) {
    if (typeof m == "string" && t.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  t.getEsmExportName = $;
  function v(m) {
    return new n(m.toString());
  }
  t.regexpCode = v;
})(qn);
var io = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.ValueScope = t.ValueScopeName = t.Scope = t.varKinds = t.UsedValueState = void 0;
  const e = qn;
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
      const g = this.toName(d), { prefix: p } = g, w = (h = l.key) !== null && h !== void 0 ? h : l.ref;
      let $ = this._values[p];
      if ($) {
        const b = $.get(w);
        if (b)
          return b;
      } else
        $ = this._values[p] = /* @__PURE__ */ new Map();
      $.set(w, g);
      const v = this._scope[p] || (this._scope[p] = []), m = v.length;
      return v[m] = l.ref, g.setValue(l, { property: p, itemIndex: m }), g;
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
      return this._reduceValues(d, (g) => {
        if (g.value === void 0)
          throw new Error(`CodeGen: name "${g}" has no value`);
        return g.value.code;
      }, l, h);
    }
    _reduceValues(d, l, h = {}, g) {
      let p = e.nil;
      for (const w in d) {
        const $ = d[w];
        if (!$)
          continue;
        const v = h[w] = h[w] || /* @__PURE__ */ new Map();
        $.forEach((m) => {
          if (v.has(m))
            return;
          v.set(m, n.Started);
          let b = l(m);
          if (b) {
            const T = this.opts.es5 ? t.varKinds.var : t.varKinds.const;
            p = (0, e._)`${p}${T} ${m} = ${b};${this.opts._n}`;
          } else if (b = g == null ? void 0 : g(m))
            p = (0, e._)`${p}${b}${this.opts._n}`;
          else
            throw new r(m);
          v.set(m, n.Completed);
        });
      }
      return p;
    }
  }
  t.ValueScope = i;
})(io);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.or = t.and = t.not = t.CodeGen = t.operators = t.varKinds = t.ValueScopeName = t.ValueScope = t.Scope = t.Name = t.regexpCode = t.stringify = t.getProperty = t.nil = t.strConcat = t.str = t._ = void 0;
  const e = qn, r = io;
  var n = qn;
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
  var s = io;
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
      const S = u ? r.varKinds.var : this.varKind, A = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${A};` + f;
    }
    optimizeNames(u, f) {
      if (u[this.name.str])
        return this.rhs && (this.rhs = K(this.rhs, u, f)), this;
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
        return this.rhs = K(this.rhs, u, f), this;
    }
    get names() {
      const u = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return Z(u, this.rhs);
    }
  }
  class c extends i {
    constructor(u, f, S, A) {
      super(u, S, A), this.op = f;
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
  class g extends a {
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
      return this.code = K(this.code, u, f), this;
    }
    get names() {
      return this.code instanceof e._CodeOrName ? this.code.names : {};
    }
  }
  class p extends a {
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
      let A = S.length;
      for (; A--; ) {
        const k = S[A];
        k.optimizeNames(u, f) || (pe(u, k.names), S.splice(A, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((u, f) => X(u, f.names), {});
    }
  }
  class w extends p {
    render(u) {
      return "{" + u._n + super.render(u) + "}" + u._n;
    }
  }
  class $ extends p {
  }
  class v extends w {
  }
  v.kind = "else";
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
        f = this.else = Array.isArray(S) ? new v(S) : S;
      }
      if (f)
        return u === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(Ee(u), f instanceof m ? [f] : f.nodes);
      if (!(u === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(u, f) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(u, f), !!(super.optimizeNames(u, f) || this.else))
        return this.condition = K(this.condition, u, f), this;
    }
    get names() {
      const u = super.names;
      return Z(u, this.condition), this.else && X(u, this.else.names), u;
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
        return this.iteration = K(this.iteration, u, f), this;
    }
    get names() {
      return X(super.names, this.iteration.names);
    }
  }
  class R extends b {
    constructor(u, f, S, A) {
      super(), this.varKind = u, this.name = f, this.from = S, this.to = A;
    }
    render(u) {
      const f = u.es5 ? r.varKinds.var : this.varKind, { name: S, from: A, to: k } = this;
      return `for(${f} ${S}=${A}; ${S}<${k}; ${S}++)` + super.render(u);
    }
    get names() {
      const u = Z(super.names, this.from);
      return Z(u, this.to);
    }
  }
  class j extends b {
    constructor(u, f, S, A) {
      super(), this.loop = u, this.varKind = f, this.name = S, this.iterable = A;
    }
    render(u) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(u);
    }
    optimizeNames(u, f) {
      if (super.optimizeNames(u, f))
        return this.iterable = K(this.iterable, u, f), this;
    }
    get names() {
      return X(super.names, this.iterable.names);
    }
  }
  class U extends w {
    constructor(u, f, S) {
      super(), this.name = u, this.args = f, this.async = S;
    }
    render(u) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(u);
    }
  }
  U.kind = "func";
  class M extends p {
    render(u) {
      return "return " + super.render(u);
    }
  }
  M.kind = "return";
  class te extends w {
    render(u) {
      let f = "try" + super.render(u);
      return this.catch && (f += this.catch.render(u)), this.finally && (f += this.finally.render(u)), f;
    }
    optimizeNodes() {
      var u, f;
      return super.optimizeNodes(), (u = this.catch) === null || u === void 0 || u.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(u, f) {
      var S, A;
      return super.optimizeNames(u, f), (S = this.catch) === null || S === void 0 || S.optimizeNames(u, f), (A = this.finally) === null || A === void 0 || A.optimizeNames(u, f), this;
    }
    get names() {
      const u = super.names;
      return this.catch && X(u, this.catch.names), this.finally && X(u, this.finally.names), u;
    }
  }
  class fe extends w {
    constructor(u) {
      super(), this.error = u;
    }
    render(u) {
      return `catch(${this.error})` + super.render(u);
    }
  }
  fe.kind = "catch";
  class $e extends w {
    render(u) {
      return "finally" + super.render(u);
    }
  }
  $e.kind = "finally";
  class x {
    constructor(u, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = u, this._scope = new r.Scope({ parent: u }), this._nodes = [new $()];
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
    _def(u, f, S, A) {
      const k = this._scope.toName(f);
      return S !== void 0 && A && (this._constants[k.str] = S), this._leafNode(new o(u, k, S)), k;
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
      return typeof u == "function" ? u() : u !== e.nil && this._leafNode(new g(u)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...u) {
      const f = ["{"];
      for (const [S, A] of u)
        f.length > 1 && f.push(","), f.push(S), (S !== A || this.opts.es5) && (f.push(":"), (0, e.addCodeArg)(f, A));
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
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, v);
    }
    _for(u, f) {
      return this._blockNode(u), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(u, f) {
      return this._for(new T(u), f);
    }
    // `for` statement for a range of values
    forRange(u, f, S, A, k = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const H = this._scope.toName(u);
      return this._for(new R(k, H, f, S), () => A(H));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(u, f, S, A = r.varKinds.const) {
      const k = this._scope.toName(u);
      if (this.opts.es5) {
        const H = f instanceof e.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, e._)`${H}.length`, (W) => {
          this.var(k, (0, e._)`${H}[${W}]`), S(k);
        });
      }
      return this._for(new j("of", A, k, f), () => S(k));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(u, f, S, A = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(u, (0, e._)`Object.keys(${f})`, S);
      const k = this._scope.toName(u);
      return this._for(new j("in", A, k, f), () => S(k));
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
      const f = new M();
      if (this._blockNode(f), this.code(u), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(M);
    }
    // `try` statement
    try(u, f, S) {
      if (!f && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const A = new te();
      if (this._blockNode(A), this.code(u), f) {
        const k = this.name("e");
        this._currNode = A.catch = new fe(k), f(k);
      }
      return S && (this._currNode = A.finally = new $e(), this.code(S)), this._endBlockNode(fe, $e);
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
    func(u, f = e.nil, S, A) {
      return this._blockNode(new U(u, f, S)), A && this.code(A).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(U);
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
  t.CodeGen = x;
  function X(_, u) {
    for (const f in u)
      _[f] = (_[f] || 0) + (u[f] || 0);
    return _;
  }
  function Z(_, u) {
    return u instanceof e._CodeOrName ? X(_, u.names) : _;
  }
  function K(_, u, f) {
    if (_ instanceof e.Name)
      return S(_);
    if (!A(_))
      return _;
    return new e._Code(_._items.reduce((k, H) => (H instanceof e.Name && (H = S(H)), H instanceof e._Code ? k.push(...H._items) : k.push(H), k), []));
    function S(k) {
      const H = f[k.str];
      return H === void 0 || u[k.str] !== 1 ? k : (delete u[k.str], H);
    }
    function A(k) {
      return k instanceof e._Code && k._items.some((H) => H instanceof e.Name && u[H.str] === 1 && f[H.str] !== void 0);
    }
  }
  function pe(_, u) {
    for (const f in u)
      _[f] = (_[f] || 0) - (u[f] || 0);
  }
  function Ee(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, e._)`!${E(_)}`;
  }
  t.not = Ee;
  const F = y(t.operators.AND);
  function q(..._) {
    return _.reduce(F);
  }
  t.and = q;
  const J = y(t.operators.OR);
  function P(..._) {
    return _.reduce(J);
  }
  t.or = P;
  function y(_) {
    return (u, f) => u === e.nil ? f : f === e.nil ? u : (0, e._)`${E(u)} ${_} ${E(f)}`;
  }
  function E(_) {
    return _ instanceof e.Name ? _ : (0, e._)`(${_})`;
  }
})(de);
var G = {};
Object.defineProperty(G, "__esModule", { value: !0 });
G.checkStrictMode = G.getErrorPath = G.Type = G.useFunc = G.setEvaluated = G.evaluatedPropsToName = G.mergeEvaluated = G.eachItem = G.unescapeJsonPointer = G.escapeJsonPointer = G.escapeFragment = G.unescapeFragment = G.schemaRefOrVal = G.schemaHasRulesButRef = G.schemaHasRules = G.checkUnknownRules = G.alwaysValidSchema = G.toHash = void 0;
const ve = de, bS = qn;
function SS(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
G.toHash = SS;
function ES(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (rp(t, e), !np(e, t.self.RULES.all));
}
G.alwaysValidSchema = ES;
function rp(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || op(t, `unknown keyword: "${a}"`);
}
G.checkUnknownRules = rp;
function np(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
G.schemaHasRules = np;
function NS(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
G.schemaHasRulesButRef = NS;
function PS({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ve._)`${r}`;
  }
  return (0, ve._)`${t}${e}${(0, ve.getProperty)(n)}`;
}
G.schemaRefOrVal = PS;
function TS(t) {
  return sp(decodeURIComponent(t));
}
G.unescapeFragment = TS;
function OS(t) {
  return encodeURIComponent(Bi(t));
}
G.escapeFragment = OS;
function Bi(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
G.escapeJsonPointer = Bi;
function sp(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
G.unescapeJsonPointer = sp;
function RS(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
G.eachItem = RS;
function Ll({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof ve.Name ? (a instanceof ve.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof ve.Name ? (e(s, o, a), a) : r(a, o);
    return i === ve.Name && !(c instanceof ve.Name) ? n(s, c) : c;
  };
}
G.mergeEvaluated = {
  props: Ll({
    mergeNames: (t, e, r) => t.if((0, ve._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, ve._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, ve._)`${r} || {}`).code((0, ve._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, ve._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, ve._)`${r} || {}`), Ki(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: ap
  }),
  items: Ll({
    mergeNames: (t, e, r) => t.if((0, ve._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, ve._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, ve._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, ve._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function ap(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, ve._)`{}`);
  return e !== void 0 && Ki(t, r, e), r;
}
G.evaluatedPropsToName = ap;
function Ki(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, ve._)`${e}${(0, ve.getProperty)(n)}`, !0));
}
G.setEvaluated = Ki;
const Dl = {};
function IS(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: Dl[e.code] || (Dl[e.code] = new bS._Code(e.code))
  });
}
G.useFunc = IS;
var co;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(co || (G.Type = co = {}));
function jS(t, e, r) {
  if (t instanceof ve.Name) {
    const n = e === co.Num;
    return r ? n ? (0, ve._)`"[" + ${t} + "]"` : (0, ve._)`"['" + ${t} + "']"` : n ? (0, ve._)`"/" + ${t}` : (0, ve._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ve.getProperty)(t).toString() : "/" + Bi(t);
}
G.getErrorPath = jS;
function op(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
G.checkStrictMode = op;
var os = {}, Ml;
function ar() {
  if (Ml) return os;
  Ml = 1, Object.defineProperty(os, "__esModule", { value: !0 });
  const t = de, e = {
    // validation function arguments
    data: new t.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new t.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new t.Name("instancePath"),
    parentData: new t.Name("parentData"),
    parentDataProperty: new t.Name("parentDataProperty"),
    rootData: new t.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new t.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new t.Name("vErrors"),
    // null or array of validation errors
    errors: new t.Name("errors"),
    // counter of validation errors
    this: new t.Name("this"),
    // "globals"
    self: new t.Name("self"),
    scope: new t.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new t.Name("json"),
    jsonPos: new t.Name("jsonPos"),
    jsonLen: new t.Name("jsonLen"),
    jsonPart: new t.Name("jsonPart")
  };
  return os.default = e, os;
}
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
  const e = de, r = G, n = ar();
  t.keywordError = {
    message: ({ keyword: v }) => (0, e.str)`must pass "${v}" keyword validation`
  }, t.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, e.str)`"${v}" keyword must be ${m} ($data)` : (0, e.str)`"${v}" keyword is invalid ($data)`
  };
  function s(v, m = t.keywordError, b, T) {
    const { it: R } = v, { gen: j, compositeRule: U, allErrors: M } = R, te = h(v, m, b);
    T ?? (U || M) ? c(j, te) : d(R, (0, e._)`[${te}]`);
  }
  t.reportError = s;
  function a(v, m = t.keywordError, b) {
    const { it: T } = v, { gen: R, compositeRule: j, allErrors: U } = T, M = h(v, m, b);
    c(R, M), j || U || d(T, n.default.vErrors);
  }
  t.reportExtraError = a;
  function o(v, m) {
    v.assign(n.default.errors, m), v.if((0, e._)`${n.default.vErrors} !== null`, () => v.if(m, () => v.assign((0, e._)`${n.default.vErrors}.length`, m), () => v.assign(n.default.vErrors, null)));
  }
  t.resetErrorsCount = o;
  function i({ gen: v, keyword: m, schemaValue: b, data: T, errsCount: R, it: j }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const U = v.name("err");
    v.forRange("i", R, n.default.errors, (M) => {
      v.const(U, (0, e._)`${n.default.vErrors}[${M}]`), v.if((0, e._)`${U}.instancePath === undefined`, () => v.assign((0, e._)`${U}.instancePath`, (0, e.strConcat)(n.default.instancePath, j.errorPath))), v.assign((0, e._)`${U}.schemaPath`, (0, e.str)`${j.errSchemaPath}/${m}`), j.opts.verbose && (v.assign((0, e._)`${U}.schema`, b), v.assign((0, e._)`${U}.data`, T));
    });
  }
  t.extendErrors = i;
  function c(v, m) {
    const b = v.const("err", m);
    v.if((0, e._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, e._)`[${b}]`), (0, e._)`${n.default.vErrors}.push(${b})`), v.code((0, e._)`${n.default.errors}++`);
  }
  function d(v, m) {
    const { gen: b, validateName: T, schemaEnv: R } = v;
    R.$async ? b.throw((0, e._)`new ${v.ValidationError}(${m})`) : (b.assign((0, e._)`${T}.errors`, m), b.return(!1));
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
  function h(v, m, b) {
    const { createErrors: T } = v.it;
    return T === !1 ? (0, e._)`{}` : g(v, m, b);
  }
  function g(v, m, b = {}) {
    const { gen: T, it: R } = v, j = [
      p(R, b),
      w(v, b)
    ];
    return $(v, m, j), T.object(...j);
  }
  function p({ errorPath: v }, { instancePath: m }) {
    const b = m ? (0, e.str)`${v}${(0, r.getErrorPath)(m, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, b)];
  }
  function w({ keyword: v, it: { errSchemaPath: m } }, { schemaPath: b, parentSchema: T }) {
    let R = T ? m : (0, e.str)`${m}/${v}`;
    return b && (R = (0, e.str)`${R}${(0, r.getErrorPath)(b, r.Type.Str)}`), [l.schemaPath, R];
  }
  function $(v, { params: m, message: b }, T) {
    const { keyword: R, data: j, schemaValue: U, it: M } = v, { opts: te, propertyName: fe, topSchemaRef: $e, schemaPath: x } = M;
    T.push([l.keyword, R], [l.params, typeof m == "function" ? m(v) : m || (0, e._)`{}`]), te.messages && T.push([l.message, typeof b == "function" ? b(v) : b]), te.verbose && T.push([l.schema, U], [l.parentSchema, (0, e._)`${$e}${x}`], [n.default.data, j]), fe && T.push([l.propertyName, fe]);
  }
})(Hn);
var Vl;
function CS() {
  if (Vl) return dr;
  Vl = 1, Object.defineProperty(dr, "__esModule", { value: !0 }), dr.boolOrEmptySchema = dr.topBoolOrEmptySchema = void 0;
  const t = Hn, e = de, r = ar(), n = {
    message: "boolean schema is false"
  };
  function s(i) {
    const { gen: c, schema: d, validateName: l } = i;
    d === !1 ? o(i, !1) : typeof d == "object" && d.$async === !0 ? c.return(r.default.data) : (c.assign((0, e._)`${l}.errors`, null), c.return(!0));
  }
  dr.topBoolOrEmptySchema = s;
  function a(i, c) {
    const { gen: d, schema: l } = i;
    l === !1 ? (d.var(c, !1), o(i)) : d.var(c, !0);
  }
  dr.boolOrEmptySchema = a;
  function o(i, c) {
    const { gen: d, data: l } = i, h = {
      gen: d,
      keyword: "false schema",
      data: l,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: i
    };
    (0, t.reportError)(h, n, void 0, c);
  }
  return dr;
}
var Ce = {}, Er = {};
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.getRules = Er.isJSONType = void 0;
const AS = ["string", "number", "integer", "boolean", "null", "object", "array"], kS = new Set(AS);
function LS(t) {
  return typeof t == "string" && kS.has(t);
}
Er.isJSONType = LS;
function DS() {
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
Er.getRules = DS;
var jt = {}, ql;
function ip() {
  if (ql) return jt;
  ql = 1, Object.defineProperty(jt, "__esModule", { value: !0 }), jt.shouldUseRule = jt.shouldUseGroup = jt.schemaHasRulesForType = void 0;
  function t({ schema: n, self: s }, a) {
    const o = s.RULES.types[a];
    return o && o !== !0 && e(n, o);
  }
  jt.schemaHasRulesForType = t;
  function e(n, s) {
    return s.rules.some((a) => r(n, a));
  }
  jt.shouldUseGroup = e;
  function r(n, s) {
    var a;
    return n[s.keyword] !== void 0 || ((a = s.definition.implements) === null || a === void 0 ? void 0 : a.some((o) => n[o] !== void 0));
  }
  return jt.shouldUseRule = r, jt;
}
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.reportTypeError = Ce.checkDataTypes = Ce.checkDataType = Ce.coerceAndCheckDataType = Ce.getJSONTypes = Ce.getSchemaTypes = Ce.DataType = void 0;
const MS = Er, VS = ip(), qS = Hn, ue = de, cp = G;
var Jr;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(Jr || (Ce.DataType = Jr = {}));
function FS(t) {
  const e = lp(t.type);
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
Ce.getSchemaTypes = FS;
function lp(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(MS.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
Ce.getJSONTypes = lp;
function zS(t, e) {
  const { gen: r, data: n, opts: s } = t, a = US(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, VS.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = Qi(e, n, s.strictNumbers, Jr.Wrong);
    r.if(i, () => {
      a.length ? BS(t, e, a) : Gi(t);
    });
  }
  return o;
}
Ce.coerceAndCheckDataType = zS;
const up = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function US(t, e) {
  return e ? t.filter((r) => up.has(r) || e === "array" && r === "array") : [];
}
function BS(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, ue._)`typeof ${s}`), i = n.let("coerced", (0, ue._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ue._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ue._)`${s}[0]`).assign(o, (0, ue._)`typeof ${s}`).if(Qi(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, ue._)`${i} !== undefined`);
  for (const d of r)
    (up.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Gi(t), n.endIf(), n.if((0, ue._)`${i} !== undefined`, () => {
    n.assign(s, i), KS(t, i);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, ue._)`${o} == "number" || ${o} == "boolean"`).assign(i, (0, ue._)`"" + ${s}`).elseIf((0, ue._)`${s} === null`).assign(i, (0, ue._)`""`);
        return;
      case "number":
        n.elseIf((0, ue._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(i, (0, ue._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, ue._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(i, (0, ue._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, ue._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(i, !1).elseIf((0, ue._)`${s} === "true" || ${s} === 1`).assign(i, !0);
        return;
      case "null":
        n.elseIf((0, ue._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(i, null);
        return;
      case "array":
        n.elseIf((0, ue._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(i, (0, ue._)`[${s}]`);
    }
  }
}
function KS({ gen: t, parentData: e, parentDataProperty: r }, n) {
  t.if((0, ue._)`${e} !== undefined`, () => t.assign((0, ue._)`${e}[${r}]`, n));
}
function lo(t, e, r, n = Jr.Correct) {
  const s = n === Jr.Correct ? ue.operators.EQ : ue.operators.NEQ;
  let a;
  switch (t) {
    case "null":
      return (0, ue._)`${e} ${s} null`;
    case "array":
      a = (0, ue._)`Array.isArray(${e})`;
      break;
    case "object":
      a = (0, ue._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;
      break;
    case "integer":
      a = o((0, ue._)`!(${e} % 1) && !isNaN(${e})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, ue._)`typeof ${e} ${s} ${t}`;
  }
  return n === Jr.Correct ? a : (0, ue.not)(a);
  function o(i = ue.nil) {
    return (0, ue.and)((0, ue._)`typeof ${e} == "number"`, i, r ? (0, ue._)`isFinite(${e})` : ue.nil);
  }
}
Ce.checkDataType = lo;
function Qi(t, e, r, n) {
  if (t.length === 1)
    return lo(t[0], e, r, n);
  let s;
  const a = (0, cp.toHash)(t);
  if (a.array && a.object) {
    const o = (0, ue._)`typeof ${e} != "object"`;
    s = a.null ? o : (0, ue._)`!${e} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = ue.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, ue.and)(s, lo(o, e, r, n));
  return s;
}
Ce.checkDataTypes = Qi;
const QS = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, ue._)`{type: ${t}}` : (0, ue._)`{type: ${e}}`
};
function Gi(t) {
  const e = GS(t);
  (0, qS.reportError)(e, QS);
}
Ce.reportTypeError = Gi;
function GS(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, cp.schemaRefOrVal)(t, n, "type");
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
var _n = {}, Fl;
function xS() {
  if (Fl) return _n;
  Fl = 1, Object.defineProperty(_n, "__esModule", { value: !0 }), _n.assignDefaults = void 0;
  const t = de, e = G;
  function r(s, a) {
    const { properties: o, items: i } = s.schema;
    if (a === "object" && o)
      for (const c in o)
        n(s, c, o[c].default);
    else a === "array" && Array.isArray(i) && i.forEach((c, d) => n(s, d, c.default));
  }
  _n.assignDefaults = r;
  function n(s, a, o) {
    const { gen: i, compositeRule: c, data: d, opts: l } = s;
    if (o === void 0)
      return;
    const h = (0, t._)`${d}${(0, t.getProperty)(a)}`;
    if (c) {
      (0, e.checkStrictMode)(s, `default is ignored for: ${h}`);
      return;
    }
    let g = (0, t._)`${h} === undefined`;
    l.useDefaults === "empty" && (g = (0, t._)`${g} || ${h} === null || ${h} === ""`), i.if(g, (0, t._)`${h} = ${(0, t.stringify)(o)}`);
  }
  return _n;
}
var pt = {}, me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.validateUnion = me.validateArray = me.usePattern = me.callValidateCode = me.schemaProperties = me.allSchemaProperties = me.noPropertyInData = me.propertyInData = me.isOwnProperty = me.hasPropFunc = me.reportMissingProp = me.checkMissingProp = me.checkReportMissingProp = void 0;
const we = de, xi = G, Ht = ar(), HS = G;
function JS(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(Ji(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, we._)`${e}` }, !0), t.error();
  });
}
me.checkReportMissingProp = JS;
function WS({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, we.or)(...n.map((a) => (0, we.and)(Ji(t, e, a, r.ownProperties), (0, we._)`${s} = ${a}`)));
}
me.checkMissingProp = WS;
function XS(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
me.reportMissingProp = XS;
function dp(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, we._)`Object.prototype.hasOwnProperty`
  });
}
me.hasPropFunc = dp;
function Hi(t, e, r) {
  return (0, we._)`${dp(t)}.call(${e}, ${r})`;
}
me.isOwnProperty = Hi;
function YS(t, e, r, n) {
  const s = (0, we._)`${e}${(0, we.getProperty)(r)} !== undefined`;
  return n ? (0, we._)`${s} && ${Hi(t, e, r)}` : s;
}
me.propertyInData = YS;
function Ji(t, e, r, n) {
  const s = (0, we._)`${e}${(0, we.getProperty)(r)} === undefined`;
  return n ? (0, we.or)(s, (0, we.not)(Hi(t, e, r))) : s;
}
me.noPropertyInData = Ji;
function fp(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
me.allSchemaProperties = fp;
function ZS(t, e) {
  return fp(e).filter((r) => !(0, xi.alwaysValidSchema)(t, e[r]));
}
me.schemaProperties = ZS;
function eE({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, d) {
  const l = d ? (0, we._)`${t}, ${e}, ${n}${s}` : e, h = [
    [Ht.default.instancePath, (0, we.strConcat)(Ht.default.instancePath, a)],
    [Ht.default.parentData, o.parentData],
    [Ht.default.parentDataProperty, o.parentDataProperty],
    [Ht.default.rootData, Ht.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Ht.default.dynamicAnchors, Ht.default.dynamicAnchors]);
  const g = (0, we._)`${l}, ${r.object(...h)}`;
  return c !== we.nil ? (0, we._)`${i}.call(${c}, ${g})` : (0, we._)`${i}(${g})`;
}
me.callValidateCode = eE;
const tE = (0, we._)`new RegExp`;
function rE({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, we._)`${s.code === "new RegExp" ? tE : (0, HS.useFunc)(t, s)}(${r}, ${n})`
  });
}
me.usePattern = rE;
function nE(t) {
  const { gen: e, data: r, keyword: n, it: s } = t, a = e.name("valid");
  if (s.allErrors) {
    const i = e.let("valid", !0);
    return o(() => e.assign(i, !1)), i;
  }
  return e.var(a, !0), o(() => e.break()), a;
  function o(i) {
    const c = e.const("len", (0, we._)`${r}.length`);
    e.forRange("i", 0, c, (d) => {
      t.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: xi.Type.Num
      }, a), e.if((0, we.not)(a), i);
    });
  }
}
me.validateArray = nE;
function sE(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, xi.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = e.let("valid", !1), i = e.name("_valid");
  e.block(() => r.forEach((c, d) => {
    const l = t.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, i);
    e.assign(o, (0, we._)`${o} || ${i}`), t.mergeValidEvaluated(l, i) || e.if((0, we.not)(o));
  })), t.result(o, () => t.reset(), () => t.error(!0));
}
me.validateUnion = sE;
var zl;
function aE() {
  if (zl) return pt;
  zl = 1, Object.defineProperty(pt, "__esModule", { value: !0 }), pt.validateKeywordUsage = pt.validSchemaType = pt.funcKeywordCode = pt.macroKeywordCode = void 0;
  const t = de, e = ar(), r = me, n = Hn;
  function s(g, p) {
    const { gen: w, keyword: $, schema: v, parentSchema: m, it: b } = g, T = p.macro.call(b.self, v, m, b), R = d(w, $, T);
    b.opts.validateSchema !== !1 && b.self.validateSchema(T, !0);
    const j = w.name("valid");
    g.subschema({
      schema: T,
      schemaPath: t.nil,
      errSchemaPath: `${b.errSchemaPath}/${$}`,
      topSchemaRef: R,
      compositeRule: !0
    }, j), g.pass(j, () => g.error(!0));
  }
  pt.macroKeywordCode = s;
  function a(g, p) {
    var w;
    const { gen: $, keyword: v, schema: m, parentSchema: b, $data: T, it: R } = g;
    c(R, p);
    const j = !T && p.compile ? p.compile.call(R.self, m, b, R) : p.validate, U = d($, v, j), M = $.let("valid");
    g.block$data(M, te), g.ok((w = p.valid) !== null && w !== void 0 ? w : M);
    function te() {
      if (p.errors === !1)
        x(), p.modifying && o(g), X(() => g.error());
      else {
        const Z = p.async ? fe() : $e();
        p.modifying && o(g), X(() => i(g, Z));
      }
    }
    function fe() {
      const Z = $.let("ruleErrs", null);
      return $.try(() => x((0, t._)`await `), (K) => $.assign(M, !1).if((0, t._)`${K} instanceof ${R.ValidationError}`, () => $.assign(Z, (0, t._)`${K}.errors`), () => $.throw(K))), Z;
    }
    function $e() {
      const Z = (0, t._)`${U}.errors`;
      return $.assign(Z, null), x(t.nil), Z;
    }
    function x(Z = p.async ? (0, t._)`await ` : t.nil) {
      const K = R.opts.passContext ? e.default.this : e.default.self, pe = !("compile" in p && !T || p.schema === !1);
      $.assign(M, (0, t._)`${Z}${(0, r.callValidateCode)(g, U, K, pe)}`, p.modifying);
    }
    function X(Z) {
      var K;
      $.if((0, t.not)((K = p.valid) !== null && K !== void 0 ? K : M), Z);
    }
  }
  pt.funcKeywordCode = a;
  function o(g) {
    const { gen: p, data: w, it: $ } = g;
    p.if($.parentData, () => p.assign(w, (0, t._)`${$.parentData}[${$.parentDataProperty}]`));
  }
  function i(g, p) {
    const { gen: w } = g;
    w.if((0, t._)`Array.isArray(${p})`, () => {
      w.assign(e.default.vErrors, (0, t._)`${e.default.vErrors} === null ? ${p} : ${e.default.vErrors}.concat(${p})`).assign(e.default.errors, (0, t._)`${e.default.vErrors}.length`), (0, n.extendErrors)(g);
    }, () => g.error());
  }
  function c({ schemaEnv: g }, p) {
    if (p.async && !g.$async)
      throw new Error("async keyword in sync schema");
  }
  function d(g, p, w) {
    if (w === void 0)
      throw new Error(`keyword "${p}" failed to compile`);
    return g.scopeValue("keyword", typeof w == "function" ? { ref: w } : { ref: w, code: (0, t.stringify)(w) });
  }
  function l(g, p, w = !1) {
    return !p.length || p.some(($) => $ === "array" ? Array.isArray(g) : $ === "object" ? g && typeof g == "object" && !Array.isArray(g) : typeof g == $ || w && typeof g > "u");
  }
  pt.validSchemaType = l;
  function h({ schema: g, opts: p, self: w, errSchemaPath: $ }, v, m) {
    if (Array.isArray(v.keyword) ? !v.keyword.includes(m) : v.keyword !== m)
      throw new Error("ajv implementation error");
    const b = v.dependencies;
    if (b != null && b.some((T) => !Object.prototype.hasOwnProperty.call(g, T)))
      throw new Error(`parent schema must have dependencies of ${m}: ${b.join(",")}`);
    if (v.validateSchema && !v.validateSchema(g[m])) {
      const R = `keyword "${m}" value is invalid at path "${$}": ` + w.errorsText(v.validateSchema.errors);
      if (p.validateSchema === "log")
        w.logger.error(R);
      else
        throw new Error(R);
    }
  }
  return pt.validateKeywordUsage = h, pt;
}
var Ct = {}, Ul;
function oE() {
  if (Ul) return Ct;
  Ul = 1, Object.defineProperty(Ct, "__esModule", { value: !0 }), Ct.extendSubschemaMode = Ct.extendSubschemaData = Ct.getSubschema = void 0;
  const t = de, e = G;
  function r(a, { keyword: o, schemaProp: i, schema: c, schemaPath: d, errSchemaPath: l, topSchemaRef: h }) {
    if (o !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (o !== void 0) {
      const g = a.schema[o];
      return i === void 0 ? {
        schema: g,
        schemaPath: (0, t._)`${a.schemaPath}${(0, t.getProperty)(o)}`,
        errSchemaPath: `${a.errSchemaPath}/${o}`
      } : {
        schema: g[i],
        schemaPath: (0, t._)`${a.schemaPath}${(0, t.getProperty)(o)}${(0, t.getProperty)(i)}`,
        errSchemaPath: `${a.errSchemaPath}/${o}/${(0, e.escapeFragment)(i)}`
      };
    }
    if (c !== void 0) {
      if (d === void 0 || l === void 0 || h === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: d,
        topSchemaRef: h,
        errSchemaPath: l
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Ct.getSubschema = r;
  function n(a, o, { dataProp: i, dataPropType: c, data: d, dataTypes: l, propertyName: h }) {
    if (d !== void 0 && i !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: g } = o;
    if (i !== void 0) {
      const { errorPath: w, dataPathArr: $, opts: v } = o, m = g.let("data", (0, t._)`${o.data}${(0, t.getProperty)(i)}`, !0);
      p(m), a.errorPath = (0, t.str)`${w}${(0, e.getErrorPath)(i, c, v.jsPropertySyntax)}`, a.parentDataProperty = (0, t._)`${i}`, a.dataPathArr = [...$, a.parentDataProperty];
    }
    if (d !== void 0) {
      const w = d instanceof t.Name ? d : g.let("data", d, !0);
      p(w), h !== void 0 && (a.propertyName = h);
    }
    l && (a.dataTypes = l);
    function p(w) {
      a.data = w, a.dataLevel = o.dataLevel + 1, a.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), a.parentData = o.data, a.dataNames = [...o.dataNames, w];
    }
  }
  Ct.extendSubschemaData = n;
  function s(a, { jtdDiscriminator: o, jtdMetadata: i, compositeRule: c, createErrors: d, allErrors: l }) {
    c !== void 0 && (a.compositeRule = c), d !== void 0 && (a.createErrors = d), l !== void 0 && (a.allErrors = l), a.jtdDiscriminator = o, a.jtdMetadata = i;
  }
  return Ct.extendSubschemaMode = s, Ct;
}
var qe = {}, hp = { exports: {} }, tr = hp.exports = function(t, e, r) {
  typeof e == "function" && (r = e, e = {}), r = e.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Rs(e, n, s, t, "", t);
};
tr.keywords = {
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
tr.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
tr.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
tr.skipKeywords = {
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
function Rs(t, e, r, n, s, a, o, i, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, s, a, o, i, c, d);
    for (var l in n) {
      var h = n[l];
      if (Array.isArray(h)) {
        if (l in tr.arrayKeywords)
          for (var g = 0; g < h.length; g++)
            Rs(t, e, r, h[g], s + "/" + l + "/" + g, a, s, l, n, g);
      } else if (l in tr.propsKeywords) {
        if (h && typeof h == "object")
          for (var p in h)
            Rs(t, e, r, h[p], s + "/" + l + "/" + iE(p), a, s, l, n, p);
      } else (l in tr.keywords || t.allKeys && !(l in tr.skipKeywords)) && Rs(t, e, r, h, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, i, c, d);
  }
}
function iE(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var cE = hp.exports;
Object.defineProperty(qe, "__esModule", { value: !0 });
qe.getSchemaRefs = qe.resolveUrl = qe.normalizeId = qe._getFullPath = qe.getFullPath = qe.inlineRef = void 0;
const lE = G, uE = na, dE = cE, fE = /* @__PURE__ */ new Set([
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
function hE(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !uo(t) : e ? mp(t) <= e : !1;
}
qe.inlineRef = hE;
const mE = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function uo(t) {
  for (const e in t) {
    if (mE.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(uo) || typeof r == "object" && uo(r))
      return !0;
  }
  return !1;
}
function mp(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !fE.has(r) && (typeof t[r] == "object" && (0, lE.eachItem)(t[r], (n) => e += mp(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function pp(t, e = "", r) {
  r !== !1 && (e = Wr(e));
  const n = t.parse(e);
  return yp(t, n);
}
qe.getFullPath = pp;
function yp(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
qe._getFullPath = yp;
const pE = /#\/?$/;
function Wr(t) {
  return t ? t.replace(pE, "") : "";
}
qe.normalizeId = Wr;
function yE(t, e, r) {
  return r = Wr(r), t.resolve(e, r);
}
qe.resolveUrl = yE;
const $E = /^[a-z_][-a-z0-9._]*$/i;
function gE(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Wr(t[r] || e), a = { "": s }, o = pp(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return dE(t, { allKeys: !0 }, (h, g, p, w) => {
    if (w === void 0)
      return;
    const $ = o + g;
    let v = a[w];
    typeof h[r] == "string" && (v = m.call(this, h[r])), b.call(this, h.$anchor), b.call(this, h.$dynamicAnchor), a[g] = v;
    function m(T) {
      const R = this.opts.uriResolver.resolve;
      if (T = Wr(v ? R(v, T) : T), c.has(T))
        throw l(T);
      c.add(T);
      let j = this.refs[T];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? d(h, j.schema, T) : T !== Wr($) && (T[0] === "#" ? (d(h, i[T], T), i[T] = h) : this.refs[T] = $), T;
    }
    function b(T) {
      if (typeof T == "string") {
        if (!$E.test(T))
          throw new Error(`invalid anchor "${T}"`);
        m.call(this, `#${T}`);
      }
    }
  }), i;
  function d(h, g, p) {
    if (g !== void 0 && !uE(h, g))
      throw l(p);
  }
  function l(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
qe.getSchemaRefs = gE;
var Bl;
function ua() {
  if (Bl) return It;
  Bl = 1, Object.defineProperty(It, "__esModule", { value: !0 }), It.getData = It.KeywordCxt = It.validateFunctionCode = void 0;
  const t = CS(), e = Ce, r = ip(), n = Ce, s = xS(), a = aE(), o = oE(), i = de, c = ar(), d = qe, l = G, h = Hn;
  function g(O) {
    if (j(O) && (M(O), R(O))) {
      v(O);
      return;
    }
    p(O, () => (0, t.topBoolOrEmptySchema)(O));
  }
  It.validateFunctionCode = g;
  function p({ gen: O, validateName: C, schema: L, schemaEnv: z, opts: Y }, ie) {
    Y.code.es5 ? O.func(C, (0, i._)`${c.default.data}, ${c.default.valCxt}`, z.$async, () => {
      O.code((0, i._)`"use strict"; ${b(L, Y)}`), $(O, Y), O.code(ie);
    }) : O.func(C, (0, i._)`${c.default.data}, ${w(Y)}`, z.$async, () => O.code(b(L, Y)).code(ie));
  }
  function w(O) {
    return (0, i._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${O.dynamicRef ? (0, i._)`, ${c.default.dynamicAnchors}={}` : i.nil}}={}`;
  }
  function $(O, C) {
    O.if(c.default.valCxt, () => {
      O.var(c.default.instancePath, (0, i._)`${c.default.valCxt}.${c.default.instancePath}`), O.var(c.default.parentData, (0, i._)`${c.default.valCxt}.${c.default.parentData}`), O.var(c.default.parentDataProperty, (0, i._)`${c.default.valCxt}.${c.default.parentDataProperty}`), O.var(c.default.rootData, (0, i._)`${c.default.valCxt}.${c.default.rootData}`), C.dynamicRef && O.var(c.default.dynamicAnchors, (0, i._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      O.var(c.default.instancePath, (0, i._)`""`), O.var(c.default.parentData, (0, i._)`undefined`), O.var(c.default.parentDataProperty, (0, i._)`undefined`), O.var(c.default.rootData, c.default.data), C.dynamicRef && O.var(c.default.dynamicAnchors, (0, i._)`{}`);
    });
  }
  function v(O) {
    const { schema: C, opts: L, gen: z } = O;
    p(O, () => {
      L.$comment && C.$comment && Z(O), $e(O), z.let(c.default.vErrors, null), z.let(c.default.errors, 0), L.unevaluated && m(O), te(O), K(O);
    });
  }
  function m(O) {
    const { gen: C, validateName: L } = O;
    O.evaluated = C.const("evaluated", (0, i._)`${L}.evaluated`), C.if((0, i._)`${O.evaluated}.dynamicProps`, () => C.assign((0, i._)`${O.evaluated}.props`, (0, i._)`undefined`)), C.if((0, i._)`${O.evaluated}.dynamicItems`, () => C.assign((0, i._)`${O.evaluated}.items`, (0, i._)`undefined`));
  }
  function b(O, C) {
    const L = typeof O == "object" && O[C.schemaId];
    return L && (C.code.source || C.code.process) ? (0, i._)`/*# sourceURL=${L} */` : i.nil;
  }
  function T(O, C) {
    if (j(O) && (M(O), R(O))) {
      U(O, C);
      return;
    }
    (0, t.boolOrEmptySchema)(O, C);
  }
  function R({ schema: O, self: C }) {
    if (typeof O == "boolean")
      return !O;
    for (const L in O)
      if (C.RULES.all[L])
        return !0;
    return !1;
  }
  function j(O) {
    return typeof O.schema != "boolean";
  }
  function U(O, C) {
    const { schema: L, gen: z, opts: Y } = O;
    Y.$comment && L.$comment && Z(O), x(O), X(O);
    const ie = z.const("_errs", c.default.errors);
    te(O, ie), z.var(C, (0, i._)`${ie} === ${c.default.errors}`);
  }
  function M(O) {
    (0, l.checkUnknownRules)(O), fe(O);
  }
  function te(O, C) {
    if (O.opts.jtd)
      return Ee(O, [], !1, C);
    const L = (0, e.getSchemaTypes)(O.schema), z = (0, e.coerceAndCheckDataType)(O, L);
    Ee(O, L, !z, C);
  }
  function fe(O) {
    const { schema: C, errSchemaPath: L, opts: z, self: Y } = O;
    C.$ref && z.ignoreKeywordsWithRef && (0, l.schemaHasRulesButRef)(C, Y.RULES) && Y.logger.warn(`$ref: keywords ignored in schema at path "${L}"`);
  }
  function $e(O) {
    const { schema: C, opts: L } = O;
    C.default !== void 0 && L.useDefaults && L.strictSchema && (0, l.checkStrictMode)(O, "default is ignored in the schema root");
  }
  function x(O) {
    const C = O.schema[O.opts.schemaId];
    C && (O.baseId = (0, d.resolveUrl)(O.opts.uriResolver, O.baseId, C));
  }
  function X(O) {
    if (O.schema.$async && !O.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function Z({ gen: O, schemaEnv: C, schema: L, errSchemaPath: z, opts: Y }) {
    const ie = L.$comment;
    if (Y.$comment === !0)
      O.code((0, i._)`${c.default.self}.logger.log(${ie})`);
    else if (typeof Y.$comment == "function") {
      const Ne = (0, i.str)`${z}/$comment`, We = O.scopeValue("root", { ref: C.root });
      O.code((0, i._)`${c.default.self}.opts.$comment(${ie}, ${Ne}, ${We}.schema)`);
    }
  }
  function K(O) {
    const { gen: C, schemaEnv: L, validateName: z, ValidationError: Y, opts: ie } = O;
    L.$async ? C.if((0, i._)`${c.default.errors} === 0`, () => C.return(c.default.data), () => C.throw((0, i._)`new ${Y}(${c.default.vErrors})`)) : (C.assign((0, i._)`${z}.errors`, c.default.vErrors), ie.unevaluated && pe(O), C.return((0, i._)`${c.default.errors} === 0`));
  }
  function pe({ gen: O, evaluated: C, props: L, items: z }) {
    L instanceof i.Name && O.assign((0, i._)`${C}.props`, L), z instanceof i.Name && O.assign((0, i._)`${C}.items`, z);
  }
  function Ee(O, C, L, z) {
    const { gen: Y, schema: ie, data: Ne, allErrors: We, opts: Ae, self: ke } = O, { RULES: Pe } = ke;
    if (ie.$ref && (Ae.ignoreKeywordsWithRef || !(0, l.schemaHasRulesButRef)(ie, Pe))) {
      Y.block(() => A(O, "$ref", Pe.all.$ref.definition));
      return;
    }
    Ae.jtd || q(O, C), Y.block(() => {
      for (const ze of Pe.rules)
        Nt(ze);
      Nt(Pe.post);
    });
    function Nt(ze) {
      (0, r.shouldUseGroup)(ie, ze) && (ze.type ? (Y.if((0, n.checkDataType)(ze.type, Ne, Ae.strictNumbers)), F(O, ze), C.length === 1 && C[0] === ze.type && L && (Y.else(), (0, n.reportTypeError)(O)), Y.endIf()) : F(O, ze), We || Y.if((0, i._)`${c.default.errors} === ${z || 0}`));
    }
  }
  function F(O, C) {
    const { gen: L, schema: z, opts: { useDefaults: Y } } = O;
    Y && (0, s.assignDefaults)(O, C.type), L.block(() => {
      for (const ie of C.rules)
        (0, r.shouldUseRule)(z, ie) && A(O, ie.keyword, ie.definition, C.type);
    });
  }
  function q(O, C) {
    O.schemaEnv.meta || !O.opts.strictTypes || (J(O, C), O.opts.allowUnionTypes || P(O, C), y(O, O.dataTypes));
  }
  function J(O, C) {
    if (C.length) {
      if (!O.dataTypes.length) {
        O.dataTypes = C;
        return;
      }
      C.forEach((L) => {
        _(O.dataTypes, L) || f(O, `type "${L}" not allowed by context "${O.dataTypes.join(",")}"`);
      }), u(O, C);
    }
  }
  function P(O, C) {
    C.length > 1 && !(C.length === 2 && C.includes("null")) && f(O, "use allowUnionTypes to allow union type keyword");
  }
  function y(O, C) {
    const L = O.self.RULES.all;
    for (const z in L) {
      const Y = L[z];
      if (typeof Y == "object" && (0, r.shouldUseRule)(O.schema, Y)) {
        const { type: ie } = Y.definition;
        ie.length && !ie.some((Ne) => E(C, Ne)) && f(O, `missing type "${ie.join(",")}" for keyword "${z}"`);
      }
    }
  }
  function E(O, C) {
    return O.includes(C) || C === "number" && O.includes("integer");
  }
  function _(O, C) {
    return O.includes(C) || C === "integer" && O.includes("number");
  }
  function u(O, C) {
    const L = [];
    for (const z of O.dataTypes)
      _(C, z) ? L.push(z) : C.includes("integer") && z === "number" && L.push("integer");
    O.dataTypes = L;
  }
  function f(O, C) {
    const L = O.schemaEnv.baseId + O.errSchemaPath;
    C += ` at "${L}" (strictTypes)`, (0, l.checkStrictMode)(O, C, O.opts.strictTypes);
  }
  class S {
    constructor(C, L, z) {
      if ((0, a.validateKeywordUsage)(C, L, z), this.gen = C.gen, this.allErrors = C.allErrors, this.keyword = z, this.data = C.data, this.schema = C.schema[z], this.$data = L.$data && C.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, l.schemaRefOrVal)(C, this.schema, z, this.$data), this.schemaType = L.schemaType, this.parentSchema = C.schema, this.params = {}, this.it = C, this.def = L, this.$data)
        this.schemaCode = C.gen.const("vSchema", W(this.$data, C));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, L.schemaType, L.allowUndefined))
        throw new Error(`${z} value must be ${JSON.stringify(L.schemaType)}`);
      ("code" in L ? L.trackErrors : L.errors !== !1) && (this.errsCount = C.gen.const("_errs", c.default.errors));
    }
    result(C, L, z) {
      this.failResult((0, i.not)(C), L, z);
    }
    failResult(C, L, z) {
      this.gen.if(C), z ? z() : this.error(), L ? (this.gen.else(), L(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(C, L) {
      this.failResult((0, i.not)(C), void 0, L);
    }
    fail(C) {
      if (C === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(C), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(C) {
      if (!this.$data)
        return this.fail(C);
      const { schemaCode: L } = this;
      this.fail((0, i._)`${L} !== undefined && (${(0, i.or)(this.invalid$data(), C)})`);
    }
    error(C, L, z) {
      if (L) {
        this.setParams(L), this._error(C, z), this.setParams({});
        return;
      }
      this._error(C, z);
    }
    _error(C, L) {
      (C ? h.reportExtraError : h.reportError)(this, this.def.error, L);
    }
    $dataError() {
      (0, h.reportError)(this, this.def.$dataError || h.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, h.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(C) {
      this.allErrors || this.gen.if(C);
    }
    setParams(C, L) {
      L ? Object.assign(this.params, C) : this.params = C;
    }
    block$data(C, L, z = i.nil) {
      this.gen.block(() => {
        this.check$data(C, z), L();
      });
    }
    check$data(C = i.nil, L = i.nil) {
      if (!this.$data)
        return;
      const { gen: z, schemaCode: Y, schemaType: ie, def: Ne } = this;
      z.if((0, i.or)((0, i._)`${Y} === undefined`, L)), C !== i.nil && z.assign(C, !0), (ie.length || Ne.validateSchema) && (z.elseIf(this.invalid$data()), this.$dataError(), C !== i.nil && z.assign(C, !1)), z.else();
    }
    invalid$data() {
      const { gen: C, schemaCode: L, schemaType: z, def: Y, it: ie } = this;
      return (0, i.or)(Ne(), We());
      function Ne() {
        if (z.length) {
          if (!(L instanceof i.Name))
            throw new Error("ajv implementation error");
          const Ae = Array.isArray(z) ? z : [z];
          return (0, i._)`${(0, n.checkDataTypes)(Ae, L, ie.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return i.nil;
      }
      function We() {
        if (Y.validateSchema) {
          const Ae = C.scopeValue("validate$data", { ref: Y.validateSchema });
          return (0, i._)`!${Ae}(${L})`;
        }
        return i.nil;
      }
    }
    subschema(C, L) {
      const z = (0, o.getSubschema)(this.it, C);
      (0, o.extendSubschemaData)(z, this.it, C), (0, o.extendSubschemaMode)(z, C);
      const Y = { ...this.it, ...z, items: void 0, props: void 0 };
      return T(Y, L), Y;
    }
    mergeEvaluated(C, L) {
      const { it: z, gen: Y } = this;
      z.opts.unevaluated && (z.props !== !0 && C.props !== void 0 && (z.props = l.mergeEvaluated.props(Y, C.props, z.props, L)), z.items !== !0 && C.items !== void 0 && (z.items = l.mergeEvaluated.items(Y, C.items, z.items, L)));
    }
    mergeValidEvaluated(C, L) {
      const { it: z, gen: Y } = this;
      if (z.opts.unevaluated && (z.props !== !0 || z.items !== !0))
        return Y.if(L, () => this.mergeEvaluated(C, i.Name)), !0;
    }
  }
  It.KeywordCxt = S;
  function A(O, C, L, z) {
    const Y = new S(O, L, C);
    "code" in L ? L.code(Y, z) : Y.$data && L.validate ? (0, a.funcKeywordCode)(Y, L) : "macro" in L ? (0, a.macroKeywordCode)(Y, L) : (L.compile || L.validate) && (0, a.funcKeywordCode)(Y, L);
  }
  const k = /^\/(?:[^~]|~0|~1)*$/, H = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function W(O, { dataLevel: C, dataNames: L, dataPathArr: z }) {
    let Y, ie;
    if (O === "")
      return c.default.rootData;
    if (O[0] === "/") {
      if (!k.test(O))
        throw new Error(`Invalid JSON-pointer: ${O}`);
      Y = O, ie = c.default.rootData;
    } else {
      const ke = H.exec(O);
      if (!ke)
        throw new Error(`Invalid JSON-pointer: ${O}`);
      const Pe = +ke[1];
      if (Y = ke[2], Y === "#") {
        if (Pe >= C)
          throw new Error(Ae("property/index", Pe));
        return z[C - Pe];
      }
      if (Pe > C)
        throw new Error(Ae("data", Pe));
      if (ie = L[C - Pe], !Y)
        return ie;
    }
    let Ne = ie;
    const We = Y.split("/");
    for (const ke of We)
      ke && (ie = (0, i._)`${ie}${(0, i.getProperty)((0, l.unescapeJsonPointer)(ke))}`, Ne = (0, i._)`${Ne} && ${ie}`);
    return Ne;
    function Ae(ke, Pe) {
      return `Cannot access ${ke} ${Pe} levels up, current level is ${C}`;
    }
  }
  return It.getData = W, It;
}
var is = {}, Kl;
function Wi() {
  if (Kl) return is;
  Kl = 1, Object.defineProperty(is, "__esModule", { value: !0 });
  class t extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return is.default = t, is;
}
var cs = {}, Ql;
function da() {
  if (Ql) return cs;
  Ql = 1, Object.defineProperty(cs, "__esModule", { value: !0 });
  const t = qe;
  class e extends Error {
    constructor(n, s, a, o) {
      super(o || `can't resolve reference ${a} from id ${s}`), this.missingRef = (0, t.resolveUrl)(n, s, a), this.missingSchema = (0, t.normalizeId)((0, t.getFullPath)(n, this.missingRef));
    }
  }
  return cs.default = e, cs;
}
var st = {};
Object.defineProperty(st, "__esModule", { value: !0 });
st.resolveSchema = st.getCompilingSchema = st.resolveRef = st.compileSchema = st.SchemaEnv = void 0;
const yt = de, vE = Wi(), fr = ar(), wt = qe, Gl = G, _E = ua();
class fa {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, wt.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
st.SchemaEnv = fa;
function Xi(t) {
  const e = $p.call(this, t);
  if (e)
    return e;
  const r = (0, wt.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new yt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: vE.default,
    code: (0, yt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  t.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: fr.default.data,
    parentData: fr.default.parentData,
    parentDataProperty: fr.default.parentDataProperty,
    dataNames: [fr.default.data],
    dataPathArr: [yt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: t.schema, code: (0, yt.stringify)(t.schema) } : { ref: t.schema }),
    validateName: c,
    ValidationError: i,
    schema: t.schema,
    schemaEnv: t,
    rootId: r,
    baseId: t.baseId || r,
    schemaPath: yt.nil,
    errSchemaPath: t.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, yt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(t), (0, _E.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    l = `${o.scopeRefs(fr.default.scope)}return ${h}`, this.opts.code.process && (l = this.opts.code.process(l, t));
    const p = new Function(`${fr.default.self}`, `${fr.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = t.schema, p.schemaEnv = t, t.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: $ } = d;
      p.evaluated = {
        props: w instanceof yt.Name ? void 0 : w,
        items: $ instanceof yt.Name ? void 0 : $,
        dynamicProps: w instanceof yt.Name,
        dynamicItems: $ instanceof yt.Name
      }, p.source && (p.source.evaluated = (0, yt.stringify)(p.evaluated));
    }
    return t.validate = p, t;
  } catch (h) {
    throw delete t.validate, delete t.validateName, l && this.logger.error("Error compiling schema, function code:", l), h;
  } finally {
    this._compilations.delete(t);
  }
}
st.compileSchema = Xi;
function wE(t, e, r) {
  var n;
  r = (0, wt.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = EE.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new fa({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = bE.call(this, a);
}
st.resolveRef = wE;
function bE(t) {
  return (0, wt.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : Xi.call(this, t);
}
function $p(t) {
  for (const e of this._compilations)
    if (SE(e, t))
      return e;
}
st.getCompilingSchema = $p;
function SE(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function EE(t, e) {
  let r;
  for (; typeof (r = this.refs[e]) == "string"; )
    e = r;
  return r || this.schemas[e] || ha.call(this, t, e);
}
function ha(t, e) {
  const r = this.opts.uriResolver.parse(e), n = (0, wt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, wt.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
  if (Object.keys(t.schema).length > 0 && n === s)
    return Ma.call(this, r, t);
  const a = (0, wt.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const i = ha.call(this, t, o);
    return typeof (i == null ? void 0 : i.schema) != "object" ? void 0 : Ma.call(this, r, i);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Xi.call(this, o), a === (0, wt.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, d = i[c];
      return d && (s = (0, wt.resolveUrl)(this.opts.uriResolver, s, d)), new fa({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return Ma.call(this, r, o);
  }
}
st.resolveSchema = ha;
const NE = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ma(t, { baseId: e, schema: r, root: n }) {
  var s;
  if (((s = t.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const i of t.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Gl.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !NE.has(i) && d && (e = (0, wt.resolveUrl)(this.opts.uriResolver, e, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Gl.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, wt.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = ha.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new fa({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const PE = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", TE = "Meta-schema for $data reference (JSON AnySchema extension proposal)", OE = "object", RE = [
  "$data"
], IE = {
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
}, jE = !1, CE = {
  $id: PE,
  description: TE,
  type: OE,
  required: RE,
  properties: IE,
  additionalProperties: jE
};
var Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
const gp = Um;
gp.code = 'require("ajv/dist/runtime/uri").default';
Yi.default = gp;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  var e = ua();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return e.KeywordCxt;
  } });
  var r = de;
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
  const n = Wi(), s = da(), a = Er, o = st, i = de, c = qe, d = Ce, l = G, h = CE, g = Yi, p = (P, y) => new RegExp(P, y);
  p.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], $ = /* @__PURE__ */ new Set([
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
  ]), v = {
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
    var y, E, _, u, f, S, A, k, H, W, O, C, L, z, Y, ie, Ne, We, Ae, ke, Pe, Nt, ze, ir, cr;
    const ht = P.strict, lr = (y = P.code) === null || y === void 0 ? void 0 : y.optimize, hn = lr === !0 || lr === void 0 ? 1 : lr || 0, mn = (_ = (E = P.code) === null || E === void 0 ? void 0 : E.regExp) !== null && _ !== void 0 ? _ : p, Oa = (u = P.uriResolver) !== null && u !== void 0 ? u : g.default;
    return {
      strictSchema: (S = (f = P.strictSchema) !== null && f !== void 0 ? f : ht) !== null && S !== void 0 ? S : !0,
      strictNumbers: (k = (A = P.strictNumbers) !== null && A !== void 0 ? A : ht) !== null && k !== void 0 ? k : !0,
      strictTypes: (W = (H = P.strictTypes) !== null && H !== void 0 ? H : ht) !== null && W !== void 0 ? W : "log",
      strictTuples: (C = (O = P.strictTuples) !== null && O !== void 0 ? O : ht) !== null && C !== void 0 ? C : "log",
      strictRequired: (z = (L = P.strictRequired) !== null && L !== void 0 ? L : ht) !== null && z !== void 0 ? z : !1,
      code: P.code ? { ...P.code, optimize: hn, regExp: mn } : { optimize: hn, regExp: mn },
      loopRequired: (Y = P.loopRequired) !== null && Y !== void 0 ? Y : b,
      loopEnum: (ie = P.loopEnum) !== null && ie !== void 0 ? ie : b,
      meta: (Ne = P.meta) !== null && Ne !== void 0 ? Ne : !0,
      messages: (We = P.messages) !== null && We !== void 0 ? We : !0,
      inlineRefs: (Ae = P.inlineRefs) !== null && Ae !== void 0 ? Ae : !0,
      schemaId: (ke = P.schemaId) !== null && ke !== void 0 ? ke : "$id",
      addUsedSchema: (Pe = P.addUsedSchema) !== null && Pe !== void 0 ? Pe : !0,
      validateSchema: (Nt = P.validateSchema) !== null && Nt !== void 0 ? Nt : !0,
      validateFormats: (ze = P.validateFormats) !== null && ze !== void 0 ? ze : !0,
      unicodeRegExp: (ir = P.unicodeRegExp) !== null && ir !== void 0 ? ir : !0,
      int32range: (cr = P.int32range) !== null && cr !== void 0 ? cr : !0,
      uriResolver: Oa
    };
  }
  class R {
    constructor(y = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), y = this.opts = { ...y, ...T(y) };
      const { es5: E, lines: _ } = this.opts.code;
      this.scope = new i.ValueScope({ scope: {}, prefixes: $, es5: E, lines: _ }), this.logger = X(y.logger);
      const u = y.validateFormats;
      y.validateFormats = !1, this.RULES = (0, a.getRules)(), j.call(this, v, y, "NOT SUPPORTED"), j.call(this, m, y, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), y.formats && te.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), y.keywords && fe.call(this, y.keywords), typeof y.meta == "object" && this.addMetaSchema(y.meta), M.call(this), y.validateFormats = u;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: y, meta: E, schemaId: _ } = this.opts;
      let u = h;
      _ === "id" && (u = { ...h }, u.id = u.$id, delete u.$id), E && y && this.addMetaSchema(u, u[_], !1);
    }
    defaultMeta() {
      const { meta: y, schemaId: E } = this.opts;
      return this.opts.defaultMeta = typeof y == "object" ? y[E] || y : void 0;
    }
    validate(y, E) {
      let _;
      if (typeof y == "string") {
        if (_ = this.getSchema(y), !_)
          throw new Error(`no schema with key or ref "${y}"`);
      } else
        _ = this.compile(y);
      const u = _(E);
      return "$async" in _ || (this.errors = _.errors), u;
    }
    compile(y, E) {
      const _ = this._addSchema(y, E);
      return _.validate || this._compileSchemaEnv(_);
    }
    compileAsync(y, E) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: _ } = this.opts;
      return u.call(this, y, E);
      async function u(W, O) {
        await f.call(this, W.$schema);
        const C = this._addSchema(W, O);
        return C.validate || S.call(this, C);
      }
      async function f(W) {
        W && !this.getSchema(W) && await u.call(this, { $ref: W }, !0);
      }
      async function S(W) {
        try {
          return this._compileSchemaEnv(W);
        } catch (O) {
          if (!(O instanceof s.default))
            throw O;
          return A.call(this, O), await k.call(this, O.missingSchema), S.call(this, W);
        }
      }
      function A({ missingSchema: W, missingRef: O }) {
        if (this.refs[W])
          throw new Error(`AnySchema ${W} is loaded but ${O} cannot be resolved`);
      }
      async function k(W) {
        const O = await H.call(this, W);
        this.refs[W] || await f.call(this, O.$schema), this.refs[W] || this.addSchema(O, W, E);
      }
      async function H(W) {
        const O = this._loading[W];
        if (O)
          return O;
        try {
          return await (this._loading[W] = _(W));
        } finally {
          delete this._loading[W];
        }
      }
    }
    // Adds schema to the instance
    addSchema(y, E, _, u = this.opts.validateSchema) {
      if (Array.isArray(y)) {
        for (const S of y)
          this.addSchema(S, void 0, _, u);
        return this;
      }
      let f;
      if (typeof y == "object") {
        const { schemaId: S } = this.opts;
        if (f = y[S], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return E = (0, c.normalizeId)(E || f), this._checkUnique(E), this.schemas[E] = this._addSchema(y, _, E, u, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(y, E, _ = this.opts.validateSchema) {
      return this.addSchema(y, E, !0, _), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(y, E) {
      if (typeof y == "boolean")
        return !0;
      let _;
      if (_ = y.$schema, _ !== void 0 && typeof _ != "string")
        throw new Error("$schema must be a string");
      if (_ = _ || this.opts.defaultMeta || this.defaultMeta(), !_)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const u = this.validate(_, y);
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
    getSchema(y) {
      let E;
      for (; typeof (E = U.call(this, y)) == "string"; )
        y = E;
      if (E === void 0) {
        const { schemaId: _ } = this.opts, u = new o.SchemaEnv({ schema: {}, schemaId: _ });
        if (E = o.resolveSchema.call(this, u, y), !E)
          return;
        this.refs[y] = E;
      }
      return E.validate || this._compileSchemaEnv(E);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(y) {
      if (y instanceof RegExp)
        return this._removeAllSchemas(this.schemas, y), this._removeAllSchemas(this.refs, y), this;
      switch (typeof y) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const E = U.call(this, y);
          return typeof E == "object" && this._cache.delete(E.schema), delete this.schemas[y], delete this.refs[y], this;
        }
        case "object": {
          const E = y;
          this._cache.delete(E);
          let _ = y[this.opts.schemaId];
          return _ && (_ = (0, c.normalizeId)(_), delete this.schemas[_], delete this.refs[_]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(y) {
      for (const E of y)
        this.addKeyword(E);
      return this;
    }
    addKeyword(y, E) {
      let _;
      if (typeof y == "string")
        _ = y, typeof E == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), E.keyword = _);
      else if (typeof y == "object" && E === void 0) {
        if (E = y, _ = E.keyword, Array.isArray(_) && !_.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (K.call(this, _, E), !E)
        return (0, l.eachItem)(_, (f) => pe.call(this, f)), this;
      F.call(this, E);
      const u = {
        ...E,
        type: (0, d.getJSONTypes)(E.type),
        schemaType: (0, d.getJSONTypes)(E.schemaType)
      };
      return (0, l.eachItem)(_, u.type.length === 0 ? (f) => pe.call(this, f, u) : (f) => u.type.forEach((S) => pe.call(this, f, u, S))), this;
    }
    getKeyword(y) {
      const E = this.RULES.all[y];
      return typeof E == "object" ? E.definition : !!E;
    }
    // Remove keyword
    removeKeyword(y) {
      const { RULES: E } = this;
      delete E.keywords[y], delete E.all[y];
      for (const _ of E.rules) {
        const u = _.rules.findIndex((f) => f.keyword === y);
        u >= 0 && _.rules.splice(u, 1);
      }
      return this;
    }
    // Add format
    addFormat(y, E) {
      return typeof E == "string" && (E = new RegExp(E)), this.formats[y] = E, this;
    }
    errorsText(y = this.errors, { separator: E = ", ", dataVar: _ = "data" } = {}) {
      return !y || y.length === 0 ? "No errors" : y.map((u) => `${_}${u.instancePath} ${u.message}`).reduce((u, f) => u + E + f);
    }
    $dataMetaSchema(y, E) {
      const _ = this.RULES.all;
      y = JSON.parse(JSON.stringify(y));
      for (const u of E) {
        const f = u.split("/").slice(1);
        let S = y;
        for (const A of f)
          S = S[A];
        for (const A in _) {
          const k = _[A];
          if (typeof k != "object")
            continue;
          const { $data: H } = k.definition, W = S[A];
          H && W && (S[A] = J(W));
        }
      }
      return y;
    }
    _removeAllSchemas(y, E) {
      for (const _ in y) {
        const u = y[_];
        (!E || E.test(_)) && (typeof u == "string" ? delete y[_] : u && !u.meta && (this._cache.delete(u.schema), delete y[_]));
      }
    }
    _addSchema(y, E, _, u = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let S;
      const { schemaId: A } = this.opts;
      if (typeof y == "object")
        S = y[A];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof y != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let k = this._cache.get(y);
      if (k !== void 0)
        return k;
      _ = (0, c.normalizeId)(S || _);
      const H = c.getSchemaRefs.call(this, y, _);
      return k = new o.SchemaEnv({ schema: y, schemaId: A, meta: E, baseId: _, localRefs: H }), this._cache.set(k.schema, k), f && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = k), u && this.validateSchema(y, !0), k;
    }
    _checkUnique(y) {
      if (this.schemas[y] || this.refs[y])
        throw new Error(`schema with key or id "${y}" already exists`);
    }
    _compileSchemaEnv(y) {
      if (y.meta ? this._compileMetaSchema(y) : o.compileSchema.call(this, y), !y.validate)
        throw new Error("ajv implementation error");
      return y.validate;
    }
    _compileMetaSchema(y) {
      const E = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, y);
      } finally {
        this.opts = E;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, t.default = R;
  function j(P, y, E, _ = "error") {
    for (const u in P) {
      const f = u;
      f in y && this.logger[_](`${E}: option ${u}. ${P[f]}`);
    }
  }
  function U(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function M() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const y in P)
          this.addSchema(P[y], y);
  }
  function te() {
    for (const P in this.opts.formats) {
      const y = this.opts.formats[P];
      y && this.addFormat(P, y);
    }
  }
  function fe(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const y in P) {
      const E = P[y];
      E.keyword || (E.keyword = y), this.addKeyword(E);
    }
  }
  function $e() {
    const P = { ...this.opts };
    for (const y of w)
      delete P[y];
    return P;
  }
  const x = { log() {
  }, warn() {
  }, error() {
  } };
  function X(P) {
    if (P === !1)
      return x;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Z = /^[a-z_$][a-z0-9_$:-]*$/i;
  function K(P, y) {
    const { RULES: E } = this;
    if ((0, l.eachItem)(P, (_) => {
      if (E.keywords[_])
        throw new Error(`Keyword ${_} is already defined`);
      if (!Z.test(_))
        throw new Error(`Keyword ${_} has invalid name`);
    }), !!y && y.$data && !("code" in y || "validate" in y))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function pe(P, y, E) {
    var _;
    const u = y == null ? void 0 : y.post;
    if (E && u)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let S = u ? f.post : f.rules.find(({ type: k }) => k === E);
    if (S || (S = { type: E, rules: [] }, f.rules.push(S)), f.keywords[P] = !0, !y)
      return;
    const A = {
      keyword: P,
      definition: {
        ...y,
        type: (0, d.getJSONTypes)(y.type),
        schemaType: (0, d.getJSONTypes)(y.schemaType)
      }
    };
    y.before ? Ee.call(this, S, A, y.before) : S.rules.push(A), f.all[P] = A, (_ = y.implements) === null || _ === void 0 || _.forEach((k) => this.addKeyword(k));
  }
  function Ee(P, y, E) {
    const _ = P.rules.findIndex((u) => u.keyword === E);
    _ >= 0 ? P.rules.splice(_, 0, y) : (P.rules.push(y), this.logger.warn(`rule ${E} is not defined`));
  }
  function F(P) {
    let { metaSchema: y } = P;
    y !== void 0 && (P.$data && this.opts.$data && (y = J(y)), P.validateSchema = this.compile(y, !0));
  }
  const q = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(P) {
    return { anyOf: [P, q] };
  }
})(tp);
var Zi = {}, ec = {}, tc = {};
Object.defineProperty(tc, "__esModule", { value: !0 });
const AE = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
tc.default = AE;
var Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.callRef = Nr.getValidate = void 0;
const kE = da(), xl = me, rt = de, Dr = ar(), Hl = st, ls = G, LE = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const l = Hl.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new kE.default(n.opts.uriResolver, s, r);
    if (l instanceof Hl.SchemaEnv)
      return g(l);
    return p(l);
    function h() {
      if (a === d)
        return Is(t, o, a, a.$async);
      const w = e.scopeValue("root", { ref: d });
      return Is(t, (0, rt._)`${w}.validate`, d, d.$async);
    }
    function g(w) {
      const $ = vp(t, w);
      Is(t, $, w, w.$async);
    }
    function p(w) {
      const $ = e.scopeValue("schema", i.code.source === !0 ? { ref: w, code: (0, rt.stringify)(w) } : { ref: w }), v = e.name("valid"), m = t.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: rt.nil,
        topSchemaRef: $,
        errSchemaPath: r
      }, v);
      t.mergeEvaluated(m), t.ok(v);
    }
  }
};
function vp(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, rt._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
Nr.getValidate = vp;
function Is(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, d = c.passContext ? Dr.default.this : rt.nil;
  n ? l() : h();
  function l() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, rt._)`await ${(0, xl.callValidateCode)(t, e, d)}`), p(e), o || s.assign(w, !0);
    }, ($) => {
      s.if((0, rt._)`!(${$} instanceof ${a.ValidationError})`, () => s.throw($)), g($), o || s.assign(w, !1);
    }), t.ok(w);
  }
  function h() {
    t.result((0, xl.callValidateCode)(t, e, d), () => p(e), () => g(e));
  }
  function g(w) {
    const $ = (0, rt._)`${w}.errors`;
    s.assign(Dr.default.vErrors, (0, rt._)`${Dr.default.vErrors} === null ? ${$} : ${Dr.default.vErrors}.concat(${$})`), s.assign(Dr.default.errors, (0, rt._)`${Dr.default.vErrors}.length`);
  }
  function p(w) {
    var $;
    if (!a.opts.unevaluated)
      return;
    const v = ($ = r == null ? void 0 : r.validate) === null || $ === void 0 ? void 0 : $.evaluated;
    if (a.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (a.props = ls.mergeEvaluated.props(s, v.props, a.props));
      else {
        const m = s.var("props", (0, rt._)`${w}.evaluated.props`);
        a.props = ls.mergeEvaluated.props(s, m, a.props, rt.Name);
      }
    if (a.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (a.items = ls.mergeEvaluated.items(s, v.items, a.items));
      else {
        const m = s.var("items", (0, rt._)`${w}.evaluated.items`);
        a.items = ls.mergeEvaluated.items(s, m, a.items, rt.Name);
      }
  }
}
Nr.callRef = Is;
Nr.default = LE;
Object.defineProperty(ec, "__esModule", { value: !0 });
const DE = tc, ME = Nr, VE = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  DE.default,
  ME.default
];
ec.default = VE;
var rc = {}, nc = {};
Object.defineProperty(nc, "__esModule", { value: !0 });
const Us = de, Jt = Us.operators, Bs = {
  maximum: { okStr: "<=", ok: Jt.LTE, fail: Jt.GT },
  minimum: { okStr: ">=", ok: Jt.GTE, fail: Jt.LT },
  exclusiveMaximum: { okStr: "<", ok: Jt.LT, fail: Jt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Jt.GT, fail: Jt.LTE }
}, qE = {
  message: ({ keyword: t, schemaCode: e }) => (0, Us.str)`must be ${Bs[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, Us._)`{comparison: ${Bs[t].okStr}, limit: ${e}}`
}, FE = {
  keyword: Object.keys(Bs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: qE,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, Us._)`${r} ${Bs[e].fail} ${n} || isNaN(${r})`);
  }
};
nc.default = FE;
var sc = {};
Object.defineProperty(sc, "__esModule", { value: !0 });
const An = de, zE = {
  message: ({ schemaCode: t }) => (0, An.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, An._)`{multipleOf: ${t}}`
}, UE = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: zE,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, An._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, An._)`${o} !== parseInt(${o})`;
    t.fail$data((0, An._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
sc.default = UE;
var ac = {}, oc = {};
Object.defineProperty(oc, "__esModule", { value: !0 });
function _p(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
oc.default = _p;
_p.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(ac, "__esModule", { value: !0 });
const $r = de, BE = G, KE = oc, QE = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, $r.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, $r._)`{limit: ${t}}`
}, GE = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: QE,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? $r.operators.GT : $r.operators.LT, o = s.opts.unicode === !1 ? (0, $r._)`${r}.length` : (0, $r._)`${(0, BE.useFunc)(t.gen, KE.default)}(${r})`;
    t.fail$data((0, $r._)`${o} ${a} ${n}`);
  }
};
ac.default = GE;
var ic = {};
Object.defineProperty(ic, "__esModule", { value: !0 });
const xE = me, HE = G, Qr = de, JE = {
  message: ({ schemaCode: t }) => (0, Qr.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, Qr._)`{pattern: ${t}}`
}, WE = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: JE,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t, i = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Qr._)`new RegExp` : (0, HE.useFunc)(e, c), l = e.let("valid");
      e.try(() => e.assign(l, (0, Qr._)`${d}(${a}, ${i}).test(${r})`), () => e.assign(l, !1)), t.fail$data((0, Qr._)`!${l}`);
    } else {
      const c = (0, xE.usePattern)(t, s);
      t.fail$data((0, Qr._)`!${c}.test(${r})`);
    }
  }
};
ic.default = WE;
var cc = {};
Object.defineProperty(cc, "__esModule", { value: !0 });
const kn = de, XE = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, kn.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, kn._)`{limit: ${t}}`
}, YE = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: XE,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? kn.operators.GT : kn.operators.LT;
    t.fail$data((0, kn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
cc.default = YE;
var lc = {};
Object.defineProperty(lc, "__esModule", { value: !0 });
const wn = me, Ln = de, ZE = G, e1 = {
  message: ({ params: { missingProperty: t } }) => (0, Ln.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, Ln._)`{missingProperty: ${t}}`
}, t1 = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: e1,
  code(t) {
    const { gen: e, schema: r, schemaCode: n, data: s, $data: a, it: o } = t, { opts: i } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= i.loopRequired;
    if (o.allErrors ? d() : l(), i.strictRequired) {
      const p = t.parentSchema.properties, { definedProperties: w } = t.it;
      for (const $ of r)
        if ((p == null ? void 0 : p[$]) === void 0 && !w.has($)) {
          const v = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${$}" is not defined at "${v}" (strictRequired)`;
          (0, ZE.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        t.block$data(Ln.nil, h);
      else
        for (const p of r)
          (0, wn.checkReportMissingProp)(t, p);
    }
    function l() {
      const p = e.let("missing");
      if (c || a) {
        const w = e.let("valid", !0);
        t.block$data(w, () => g(p, w)), t.ok(w);
      } else
        e.if((0, wn.checkMissingProp)(t, r, p)), (0, wn.reportMissingProp)(t, p), e.else();
    }
    function h() {
      e.forOf("prop", n, (p) => {
        t.setParams({ missingProperty: p }), e.if((0, wn.noPropertyInData)(e, s, p, i.ownProperties), () => t.error());
      });
    }
    function g(p, w) {
      t.setParams({ missingProperty: p }), e.forOf(p, n, () => {
        e.assign(w, (0, wn.propertyInData)(e, s, p, i.ownProperties)), e.if((0, Ln.not)(w), () => {
          t.error(), e.break();
        });
      }, Ln.nil);
    }
  }
};
lc.default = t1;
var uc = {};
Object.defineProperty(uc, "__esModule", { value: !0 });
const Dn = de, r1 = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, Dn.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, Dn._)`{limit: ${t}}`
}, n1 = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: r1,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? Dn.operators.GT : Dn.operators.LT;
    t.fail$data((0, Dn._)`${r}.length ${s} ${n}`);
  }
};
uc.default = n1;
var dc = {}, Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
const wp = na;
wp.code = 'require("ajv/dist/runtime/equal").default';
Jn.default = wp;
Object.defineProperty(dc, "__esModule", { value: !0 });
const Va = Ce, Me = de, s1 = G, a1 = Jn, o1 = {
  message: ({ params: { i: t, j: e } }) => (0, Me.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, Me._)`{i: ${t}, j: ${e}}`
}, i1 = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: o1,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: i } = t;
    if (!n && !s)
      return;
    const c = e.let("valid"), d = a.items ? (0, Va.getSchemaTypes)(a.items) : [];
    t.block$data(c, l, (0, Me._)`${o} === false`), t.ok(c);
    function l() {
      const w = e.let("i", (0, Me._)`${r}.length`), $ = e.let("j");
      t.setParams({ i: w, j: $ }), e.assign(c, !0), e.if((0, Me._)`${w} > 1`, () => (h() ? g : p)(w, $));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function g(w, $) {
      const v = e.name("item"), m = (0, Va.checkDataTypes)(d, v, i.opts.strictNumbers, Va.DataType.Wrong), b = e.const("indices", (0, Me._)`{}`);
      e.for((0, Me._)`;${w}--;`, () => {
        e.let(v, (0, Me._)`${r}[${w}]`), e.if(m, (0, Me._)`continue`), d.length > 1 && e.if((0, Me._)`typeof ${v} == "string"`, (0, Me._)`${v} += "_"`), e.if((0, Me._)`typeof ${b}[${v}] == "number"`, () => {
          e.assign($, (0, Me._)`${b}[${v}]`), t.error(), e.assign(c, !1).break();
        }).code((0, Me._)`${b}[${v}] = ${w}`);
      });
    }
    function p(w, $) {
      const v = (0, s1.useFunc)(e, a1.default), m = e.name("outer");
      e.label(m).for((0, Me._)`;${w}--;`, () => e.for((0, Me._)`${$} = ${w}; ${$}--;`, () => e.if((0, Me._)`${v}(${r}[${w}], ${r}[${$}])`, () => {
        t.error(), e.assign(c, !1).break(m);
      })));
    }
  }
};
dc.default = i1;
var fc = {};
Object.defineProperty(fc, "__esModule", { value: !0 });
const fo = de, c1 = G, l1 = Jn, u1 = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, fo._)`{allowedValue: ${t}}`
}, d1 = {
  keyword: "const",
  $data: !0,
  error: u1,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, fo._)`!${(0, c1.useFunc)(e, l1.default)}(${r}, ${s})`) : t.fail((0, fo._)`${a} !== ${r}`);
  }
};
fc.default = d1;
var hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
const Nn = de, f1 = G, h1 = Jn, m1 = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, Nn._)`{allowedValues: ${t}}`
}, p1 = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: m1,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, f1.useFunc)(e, h1.default));
    let l;
    if (i || n)
      l = e.let("valid"), t.block$data(l, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const p = e.const("vSchema", a);
      l = (0, Nn.or)(...s.map((w, $) => g(p, $)));
    }
    t.pass(l);
    function h() {
      e.assign(l, !1), e.forOf("v", a, (p) => e.if((0, Nn._)`${d()}(${r}, ${p})`, () => e.assign(l, !0).break()));
    }
    function g(p, w) {
      const $ = s[w];
      return typeof $ == "object" && $ !== null ? (0, Nn._)`${d()}(${r}, ${p}[${w}])` : (0, Nn._)`${r} === ${$}`;
    }
  }
};
hc.default = p1;
Object.defineProperty(rc, "__esModule", { value: !0 });
const y1 = nc, $1 = sc, g1 = ac, v1 = ic, _1 = cc, w1 = lc, b1 = uc, S1 = dc, E1 = fc, N1 = hc, P1 = [
  // number
  y1.default,
  $1.default,
  // string
  g1.default,
  v1.default,
  // object
  _1.default,
  w1.default,
  // array
  b1.default,
  S1.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  E1.default,
  N1.default
];
rc.default = P1;
var mc = {}, dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.validateAdditionalItems = void 0;
const gr = de, ho = G, T1 = {
  message: ({ params: { len: t } }) => (0, gr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, gr._)`{limit: ${t}}`
}, O1 = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: T1,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, ho.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    bp(t, n);
  }
};
function bp(t, e) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = t;
  o.items = !0;
  const i = r.const("len", (0, gr._)`${s}.length`);
  if (n === !1)
    t.setParams({ len: e.length }), t.pass((0, gr._)`${i} <= ${e.length}`);
  else if (typeof n == "object" && !(0, ho.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, gr._)`${i} <= ${e.length}`);
    r.if((0, gr.not)(d), () => c(d)), t.ok(d);
  }
  function c(d) {
    r.forRange("i", e.length, i, (l) => {
      t.subschema({ keyword: a, dataProp: l, dataPropType: ho.Type.Num }, d), o.allErrors || r.if((0, gr.not)(d), () => r.break());
    });
  }
}
dn.validateAdditionalItems = bp;
dn.default = O1;
var pc = {}, fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.validateTuple = void 0;
const Jl = de, js = G, R1 = me, I1 = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return Sp(t, "additionalItems", e);
    r.items = !0, !(0, js.alwaysValidSchema)(r, e) && t.ok((0, R1.validateArray)(t));
  }
};
function Sp(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  l(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = js.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), d = n.const("len", (0, Jl._)`${a}.length`);
  r.forEach((h, g) => {
    (0, js.alwaysValidSchema)(i, h) || (n.if((0, Jl._)`${d} > ${g}`, () => t.subschema({
      keyword: o,
      schemaProp: g,
      dataProp: g
    }, c)), t.ok(c));
  });
  function l(h) {
    const { opts: g, errSchemaPath: p } = i, w = r.length, $ = w === h.minItems && (w === h.maxItems || h[e] === !1);
    if (g.strictTuples && !$) {
      const v = `"${o}" is ${w}-tuple, but minItems or maxItems/${e} are not specified or different at path "${p}"`;
      (0, js.checkStrictMode)(i, v, g.strictTuples);
    }
  }
}
fn.validateTuple = Sp;
fn.default = I1;
Object.defineProperty(pc, "__esModule", { value: !0 });
const j1 = fn, C1 = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, j1.validateTuple)(t, "items")
};
pc.default = C1;
var yc = {};
Object.defineProperty(yc, "__esModule", { value: !0 });
const Wl = de, A1 = G, k1 = me, L1 = dn, D1 = {
  message: ({ params: { len: t } }) => (0, Wl.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, Wl._)`{limit: ${t}}`
}, M1 = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: D1,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, A1.alwaysValidSchema)(n, e) && (s ? (0, L1.validateAdditionalItems)(t, s) : t.ok((0, k1.validateArray)(t)));
  }
};
yc.default = M1;
var $c = {};
Object.defineProperty($c, "__esModule", { value: !0 });
const dt = de, us = G, V1 = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, dt.str)`must contain at least ${t} valid item(s)` : (0, dt.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, dt._)`{minContains: ${t}}` : (0, dt._)`{minContains: ${t}, maxContains: ${e}}`
}, q1 = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: V1,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    let o, i;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, i = d) : o = 1;
    const l = e.const("len", (0, dt._)`${s}.length`);
    if (t.setParams({ min: o, max: i }), i === void 0 && o === 0) {
      (0, us.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (i !== void 0 && o > i) {
      (0, us.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), t.fail();
      return;
    }
    if ((0, us.alwaysValidSchema)(a, r)) {
      let $ = (0, dt._)`${l} >= ${o}`;
      i !== void 0 && ($ = (0, dt._)`${$} && ${l} <= ${i}`), t.pass($);
      return;
    }
    a.items = !0;
    const h = e.name("valid");
    i === void 0 && o === 1 ? p(h, () => e.if(h, () => e.break())) : o === 0 ? (e.let(h, !0), i !== void 0 && e.if((0, dt._)`${s}.length > 0`, g)) : (e.let(h, !1), g()), t.result(h, () => t.reset());
    function g() {
      const $ = e.name("_valid"), v = e.let("count", 0);
      p($, () => e.if($, () => w(v)));
    }
    function p($, v) {
      e.forRange("i", 0, l, (m) => {
        t.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: us.Type.Num,
          compositeRule: !0
        }, $), v();
      });
    }
    function w($) {
      e.code((0, dt._)`${$}++`), i === void 0 ? e.if((0, dt._)`${$} >= ${o}`, () => e.assign(h, !0).break()) : (e.if((0, dt._)`${$} > ${i}`, () => e.assign(h, !1).break()), o === 1 ? e.assign(h, !0) : e.if((0, dt._)`${$} >= ${o}`, () => e.assign(h, !0)));
    }
  }
};
$c.default = q1;
var Ep = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.validateSchemaDeps = t.validatePropertyDeps = t.error = void 0;
  const e = de, r = G, n = me;
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
      const g = Array.isArray(c[h]) ? d : l;
      g[h] = c[h];
    }
    return [d, l];
  }
  function o(c, d = c.schema) {
    const { gen: l, data: h, it: g } = c;
    if (Object.keys(d).length === 0)
      return;
    const p = l.let("missing");
    for (const w in d) {
      const $ = d[w];
      if ($.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, h, w, g.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: $.length,
        deps: $.join(", ")
      }), g.allErrors ? l.if(v, () => {
        for (const m of $)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, e._)`${v} && (${(0, n.checkMissingProp)(c, $, p)})`), (0, n.reportMissingProp)(c, p), l.else());
    }
  }
  t.validatePropertyDeps = o;
  function i(c, d = c.schema) {
    const { gen: l, data: h, keyword: g, it: p } = c, w = l.name("valid");
    for (const $ in d)
      (0, r.alwaysValidSchema)(p, d[$]) || (l.if(
        (0, n.propertyInData)(l, h, $, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: g, schemaProp: $ }, w);
          c.mergeValidEvaluated(v, w);
        },
        () => l.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  t.validateSchemaDeps = i, t.default = s;
})(Ep);
var gc = {};
Object.defineProperty(gc, "__esModule", { value: !0 });
const Np = de, F1 = G, z1 = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, Np._)`{propertyName: ${t.propertyName}}`
}, U1 = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: z1,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, F1.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, Np.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
gc.default = U1;
var ma = {};
Object.defineProperty(ma, "__esModule", { value: !0 });
const ds = me, gt = de, B1 = ar(), fs = G, K1 = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, gt._)`{additionalProperty: ${t.additionalProperty}}`
}, Q1 = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: K1,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, fs.alwaysValidSchema)(o, r))
      return;
    const d = (0, ds.allSchemaProperties)(n.properties), l = (0, ds.allSchemaProperties)(n.patternProperties);
    h(), t.ok((0, gt._)`${a} === ${B1.default.errors}`);
    function h() {
      e.forIn("key", s, (v) => {
        !d.length && !l.length ? w(v) : e.if(g(v), () => w(v));
      });
    }
    function g(v) {
      let m;
      if (d.length > 8) {
        const b = (0, fs.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, ds.isOwnProperty)(e, b, v);
      } else d.length ? m = (0, gt.or)(...d.map((b) => (0, gt._)`${v} === ${b}`)) : m = gt.nil;
      return l.length && (m = (0, gt.or)(m, ...l.map((b) => (0, gt._)`${(0, ds.usePattern)(t, b)}.test(${v})`))), (0, gt.not)(m);
    }
    function p(v) {
      e.code((0, gt._)`delete ${s}[${v}]`);
    }
    function w(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        p(v);
        return;
      }
      if (r === !1) {
        t.setParams({ additionalProperty: v }), t.error(), i || e.break();
        return;
      }
      if (typeof r == "object" && !(0, fs.alwaysValidSchema)(o, r)) {
        const m = e.name("valid");
        c.removeAdditional === "failing" ? ($(v, m, !1), e.if((0, gt.not)(m), () => {
          t.reset(), p(v);
        })) : ($(v, m), i || e.if((0, gt.not)(m), () => e.break()));
      }
    }
    function $(v, m, b) {
      const T = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: fs.Type.Str
      };
      b === !1 && Object.assign(T, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), t.subschema(T, m);
    }
  }
};
ma.default = Q1;
var vc = {};
Object.defineProperty(vc, "__esModule", { value: !0 });
const G1 = ua(), Xl = me, qa = G, Yl = ma, x1 = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Yl.default.code(new G1.KeywordCxt(a, Yl.default, "additionalProperties"));
    const o = (0, Xl.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = qa.mergeEvaluated.props(e, (0, qa.toHash)(o), a.props));
    const i = o.filter((h) => !(0, qa.alwaysValidSchema)(a, r[h]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const h of i)
      d(h) ? l(h) : (e.if((0, Xl.propertyInData)(e, s, h, a.opts.ownProperties)), l(h), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(h), t.ok(c);
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
vc.default = x1;
var _c = {};
Object.defineProperty(_c, "__esModule", { value: !0 });
const Zl = me, hs = de, eu = G, tu = G, H1 = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, Zl.allSchemaProperties)(r), c = i.filter(($) => (0, eu.alwaysValidSchema)(a, r[$]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = e.name("valid");
    a.props !== !0 && !(a.props instanceof hs.Name) && (a.props = (0, tu.evaluatedPropsToName)(e, a.props));
    const { props: h } = a;
    g();
    function g() {
      for (const $ of i)
        d && p($), a.allErrors ? w($) : (e.var(l, !0), w($), e.if(l));
    }
    function p($) {
      for (const v in d)
        new RegExp($).test(v) && (0, eu.checkStrictMode)(a, `property ${v} matches pattern ${$} (use allowMatchingProperties)`);
    }
    function w($) {
      e.forIn("key", n, (v) => {
        e.if((0, hs._)`${(0, Zl.usePattern)(t, $)}.test(${v})`, () => {
          const m = c.includes($);
          m || t.subschema({
            keyword: "patternProperties",
            schemaProp: $,
            dataProp: v,
            dataPropType: tu.Type.Str
          }, l), a.opts.unevaluated && h !== !0 ? e.assign((0, hs._)`${h}[${v}]`, !0) : !m && !a.allErrors && e.if((0, hs.not)(l), () => e.break());
        });
      });
    }
  }
};
_c.default = H1;
var wc = {};
Object.defineProperty(wc, "__esModule", { value: !0 });
const J1 = G, W1 = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, J1.alwaysValidSchema)(n, r)) {
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
wc.default = W1;
var bc = {};
Object.defineProperty(bc, "__esModule", { value: !0 });
const X1 = me, Y1 = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: X1.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
bc.default = Y1;
var Sc = {};
Object.defineProperty(Sc, "__esModule", { value: !0 });
const Cs = de, Z1 = G, eN = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, Cs._)`{passingSchemas: ${t.passing}}`
}, tN = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: eN,
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
        let g;
        (0, Z1.alwaysValidSchema)(s, l) ? e.var(c, !0) : g = t.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && e.if((0, Cs._)`${c} && ${o}`).assign(o, !1).assign(i, (0, Cs._)`[${i}, ${h}]`).else(), e.if(c, () => {
          e.assign(o, !0), e.assign(i, h), g && t.mergeEvaluated(g, Cs.Name);
        });
      });
    }
  }
};
Sc.default = tN;
var Ec = {};
Object.defineProperty(Ec, "__esModule", { value: !0 });
const rN = G, nN = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, rN.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
Ec.default = nN;
var Nc = {};
Object.defineProperty(Nc, "__esModule", { value: !0 });
const Ks = de, Pp = G, sN = {
  message: ({ params: t }) => (0, Ks.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, Ks._)`{failingKeyword: ${t.ifClause}}`
}, aN = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: sN,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, Pp.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = ru(n, "then"), a = ru(n, "else");
    if (!s && !a)
      return;
    const o = e.let("valid", !0), i = e.name("_valid");
    if (c(), t.reset(), s && a) {
      const l = e.let("ifClause");
      t.setParams({ ifClause: l }), e.if(i, d("then", l), d("else", l));
    } else s ? e.if(i, d("then")) : e.if((0, Ks.not)(i), d("else"));
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
        const g = t.subschema({ keyword: l }, i);
        e.assign(o, i), t.mergeValidEvaluated(g, o), h ? e.assign(h, (0, Ks._)`${l}`) : t.setParams({ ifClause: l });
      };
    }
  }
};
function ru(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, Pp.alwaysValidSchema)(t, r);
}
Nc.default = aN;
var Pc = {};
Object.defineProperty(Pc, "__esModule", { value: !0 });
const oN = G, iN = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, oN.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
Pc.default = iN;
Object.defineProperty(mc, "__esModule", { value: !0 });
const cN = dn, lN = pc, uN = fn, dN = yc, fN = $c, hN = Ep, mN = gc, pN = ma, yN = vc, $N = _c, gN = wc, vN = bc, _N = Sc, wN = Ec, bN = Nc, SN = Pc;
function EN(t = !1) {
  const e = [
    // any
    gN.default,
    vN.default,
    _N.default,
    wN.default,
    bN.default,
    SN.default,
    // object
    mN.default,
    pN.default,
    hN.default,
    yN.default,
    $N.default
  ];
  return t ? e.push(lN.default, dN.default) : e.push(cN.default, uN.default), e.push(fN.default), e;
}
mc.default = EN;
var Tc = {}, Oc = {};
Object.defineProperty(Oc, "__esModule", { value: !0 });
const Oe = de, NN = {
  message: ({ schemaCode: t }) => (0, Oe.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, Oe._)`{format: ${t}}`
}, PN = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: NN,
  code(t, e) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t, { opts: c, errSchemaPath: d, schemaEnv: l, self: h } = i;
    if (!c.validateFormats)
      return;
    s ? g() : p();
    function g() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), $ = r.const("fDef", (0, Oe._)`${w}[${o}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, Oe._)`typeof ${$} == "object" && !(${$} instanceof RegExp)`, () => r.assign(v, (0, Oe._)`${$}.type || "string"`).assign(m, (0, Oe._)`${$}.validate`), () => r.assign(v, (0, Oe._)`"string"`).assign(m, $)), t.fail$data((0, Oe.or)(b(), T()));
      function b() {
        return c.strictSchema === !1 ? Oe.nil : (0, Oe._)`${o} && !${m}`;
      }
      function T() {
        const R = l.$async ? (0, Oe._)`(${$}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, Oe._)`${m}(${n})`, j = (0, Oe._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, Oe._)`${m} && ${m} !== true && ${v} === ${e} && !${j}`;
      }
    }
    function p() {
      const w = h.formats[a];
      if (!w) {
        b();
        return;
      }
      if (w === !0)
        return;
      const [$, v, m] = T(w);
      $ === e && t.pass(R());
      function b() {
        if (c.strictSchema === !1) {
          h.logger.warn(j());
          return;
        }
        throw new Error(j());
        function j() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function T(j) {
        const U = j instanceof RegExp ? (0, Oe.regexpCode)(j) : c.code.formats ? (0, Oe._)`${c.code.formats}${(0, Oe.getProperty)(a)}` : void 0, M = r.scopeValue("formats", { key: a, ref: j, code: U });
        return typeof j == "object" && !(j instanceof RegExp) ? [j.type || "string", j.validate, (0, Oe._)`${M}.validate`] : ["string", j, M];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Oe._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, Oe._)`${m}(${n})` : (0, Oe._)`${m}.test(${n})`;
      }
    }
  }
};
Oc.default = PN;
Object.defineProperty(Tc, "__esModule", { value: !0 });
const TN = Oc, ON = [TN.default];
Tc.default = ON;
var rn = {};
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.contentVocabulary = rn.metadataVocabulary = void 0;
rn.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
rn.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Zi, "__esModule", { value: !0 });
const RN = ec, IN = rc, jN = mc, CN = Tc, nu = rn, AN = [
  RN.default,
  IN.default,
  (0, jN.default)(),
  CN.default,
  nu.metadataVocabulary,
  nu.contentVocabulary
];
Zi.default = AN;
var Rc = {}, pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
pa.DiscrError = void 0;
var su;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(su || (pa.DiscrError = su = {}));
Object.defineProperty(Rc, "__esModule", { value: !0 });
const Fr = de, mo = pa, au = st, kN = da(), LN = G, DN = {
  message: ({ params: { discrError: t, tagName: e } }) => t === mo.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, Fr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, MN = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: DN,
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
    const c = e.let("valid", !1), d = e.const("tag", (0, Fr._)`${r}${(0, Fr.getProperty)(i)}`);
    e.if((0, Fr._)`typeof ${d} == "string"`, () => l(), () => t.error(!1, { discrError: mo.DiscrError.Tag, tag: d, tagName: i })), t.ok(c);
    function l() {
      const p = g();
      e.if(!1);
      for (const w in p)
        e.elseIf((0, Fr._)`${d} === ${w}`), e.assign(c, h(p[w]));
      e.else(), t.error(!1, { discrError: mo.DiscrError.Mapping, tag: d, tagName: i }), e.endIf();
    }
    function h(p) {
      const w = e.name("valid"), $ = t.subschema({ keyword: "oneOf", schemaProp: p }, w);
      return t.mergeEvaluated($, Fr.Name), w;
    }
    function g() {
      var p;
      const w = {}, $ = m(s);
      let v = !0;
      for (let R = 0; R < o.length; R++) {
        let j = o[R];
        if (j != null && j.$ref && !(0, LN.schemaHasRulesButRef)(j, a.self.RULES)) {
          const M = j.$ref;
          if (j = au.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, M), j instanceof au.SchemaEnv && (j = j.schema), j === void 0)
            throw new kN.default(a.opts.uriResolver, a.baseId, M);
        }
        const U = (p = j == null ? void 0 : j.properties) === null || p === void 0 ? void 0 : p[i];
        if (typeof U != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${i}"`);
        v = v && ($ || m(j)), b(U, R);
      }
      if (!v)
        throw new Error(`discriminator: "${i}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(i);
      }
      function b(R, j) {
        if (R.const)
          T(R.const, j);
        else if (R.enum)
          for (const U of R.enum)
            T(U, j);
        else
          throw new Error(`discriminator: "properties/${i}" must have "const" or "enum"`);
      }
      function T(R, j) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${i}" values must be unique strings`);
        w[R] = j;
      }
    }
  }
};
Rc.default = MN;
const VN = "http://json-schema.org/draft-07/schema#", qN = "http://json-schema.org/draft-07/schema#", FN = "Core schema meta-schema", zN = {
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
}, UN = [
  "object",
  "boolean"
], BN = {
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
}, KN = {
  $schema: VN,
  $id: qN,
  title: FN,
  definitions: zN,
  type: UN,
  properties: BN,
  default: !0
};
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const r = tp, n = Zi, s = Rc, a = KN, o = ["/properties"], i = "http://json-schema.org/draft-07/schema";
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
  var d = ua();
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var l = de;
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
  var h = Wi();
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var g = da();
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return g.default;
  } });
})(oo, oo.exports);
var QN = oo.exports;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.formatLimitDefinition = void 0;
  const e = QN, r = de, n = r.operators, s = {
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
      const { gen: c, data: d, schemaCode: l, keyword: h, it: g } = i, { opts: p, self: w } = g;
      if (!p.validateFormats)
        return;
      const $ = new e.KeywordCxt(g, w.RULES.all.format.definition, "format");
      $.$data ? v() : m();
      function v() {
        const T = c.scopeValue("formats", {
          ref: w.formats,
          code: p.code.formats
        }), R = c.const("fmt", (0, r._)`${T}[${$.schemaCode}]`);
        i.fail$data((0, r.or)((0, r._)`typeof ${R} != "object"`, (0, r._)`${R} instanceof RegExp`, (0, r._)`typeof ${R}.compare != "function"`, b(R)));
      }
      function m() {
        const T = $.schema, R = w.formats[T];
        if (!R || R === !0)
          return;
        if (typeof R != "object" || R instanceof RegExp || typeof R.compare != "function")
          throw new Error(`"${h}": format "${T}" does not define "compare" function`);
        const j = c.scopeValue("formats", {
          key: T,
          ref: R,
          code: p.code.formats ? (0, r._)`${p.code.formats}${(0, r.getProperty)(T)}` : void 0
        });
        i.fail$data(b(j));
      }
      function b(T) {
        return (0, r._)`${T}.compare(${d}, ${l}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (i) => (i.addKeyword(t.formatLimitDefinition), i);
  t.default = o;
})(ep);
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 });
  const r = Zm, n = ep, s = de, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), i = (d, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(d, l, r.fullFormats, a), d;
    const [h, g] = l.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], p = l.formats || r.formatNames;
    return c(d, p, h, g), l.keywords && (0, n.default)(d), d;
  };
  i.get = (d, l = "full") => {
    const g = (l === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!g)
      throw new Error(`Unknown format "${d}"`);
    return g;
  };
  function c(d, l, h, g) {
    var p, w;
    (p = (w = d.opts.code).formats) !== null && p !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${g}`);
    for (const $ of l)
      d.addFormat($, h[$]);
  }
  t.exports = e = i, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = i;
})(ao, ao.exports);
var GN = ao.exports;
const xN = /* @__PURE__ */ Jh(GN), HN = (t, e, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(t, r), a = Object.getOwnPropertyDescriptor(e, r);
  !JN(s, a) && n || Object.defineProperty(t, r, a);
}, JN = function(t, e) {
  return t === void 0 || t.configurable || t.writable === e.writable && t.enumerable === e.enumerable && t.configurable === e.configurable && (t.writable || t.value === e.value);
}, WN = (t, e) => {
  const r = Object.getPrototypeOf(e);
  r !== Object.getPrototypeOf(t) && Object.setPrototypeOf(t, r);
}, XN = (t, e) => `/* Wrapped ${t}*/
${e}`, YN = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), ZN = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), eP = (t, e, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = XN.bind(null, n, e.toString());
  Object.defineProperty(s, "name", ZN);
  const { writable: a, enumerable: o, configurable: i } = YN;
  Object.defineProperty(t, "toString", { value: s, writable: a, enumerable: o, configurable: i });
};
function tP(t, e, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = t;
  for (const s of Reflect.ownKeys(e))
    HN(t, e, s, r);
  return WN(t, e), eP(t, e, n), t;
}
const ou = (t, e = {}) => {
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
    const h = this, g = () => {
      o = void 0, i && (clearTimeout(i), i = void 0), a && (c = t.apply(h, l));
    }, p = () => {
      i = void 0, o && (clearTimeout(o), o = void 0), a && (c = t.apply(h, l));
    }, w = s && !o;
    return clearTimeout(o), o = setTimeout(g, r), n > 0 && n !== Number.POSITIVE_INFINITY && !i && (i = setTimeout(p, n)), w && (c = t.apply(h, l)), c;
  };
  return tP(d, t), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), i && (clearTimeout(i), i = void 0);
  }, d;
};
var po = { exports: {} };
const rP = "2.0.0", Tp = 256, nP = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, sP = 16, aP = Tp - 6, oP = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Wn = {
  MAX_LENGTH: Tp,
  MAX_SAFE_COMPONENT_LENGTH: sP,
  MAX_SAFE_BUILD_LENGTH: aP,
  MAX_SAFE_INTEGER: nP,
  RELEASE_TYPES: oP,
  SEMVER_SPEC_VERSION: rP,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const iP = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
};
var ya = iP;
(function(t, e) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Wn, a = ya;
  e = t.exports = {};
  const o = e.re = [], i = e.safeRe = [], c = e.src = [], d = e.safeSrc = [], l = e.t = {};
  let h = 0;
  const g = "[a-zA-Z0-9-]", p = [
    ["\\s", 1],
    ["\\d", s],
    [g, n]
  ], w = (v) => {
    for (const [m, b] of p)
      v = v.split(`${m}*`).join(`${m}{0,${b}}`).split(`${m}+`).join(`${m}{1,${b}}`);
    return v;
  }, $ = (v, m, b) => {
    const T = w(m), R = h++;
    a(v, R, m), l[v] = R, c[R] = m, d[R] = T, o[R] = new RegExp(m, b ? "g" : void 0), i[R] = new RegExp(T, b ? "g" : void 0);
  };
  $("NUMERICIDENTIFIER", "0|[1-9]\\d*"), $("NUMERICIDENTIFIERLOOSE", "\\d+"), $("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${g}*`), $("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), $("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), $("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), $("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), $("BUILDIDENTIFIER", `${g}+`), $("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), $("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), $("FULL", `^${c[l.FULLPLAIN]}$`), $("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), $("LOOSE", `^${c[l.LOOSEPLAIN]}$`), $("GTLT", "((?:<|>)?=?)"), $("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), $("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), $("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), $("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), $("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), $("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), $("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), $("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), $("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), $("COERCERTL", c[l.COERCE], !0), $("COERCERTLFULL", c[l.COERCEFULL], !0), $("LONETILDE", "(?:~>?)"), $("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", $("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), $("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), $("LONECARET", "(?:\\^)"), $("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", $("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), $("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), $("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), $("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), $("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", $("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), $("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), $("STAR", "(<|>)?=?\\s*\\*"), $("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), $("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(po, po.exports);
var Xn = po.exports;
const cP = Object.freeze({ loose: !0 }), lP = Object.freeze({}), uP = (t) => t ? typeof t != "object" ? cP : t : lP;
var Ic = uP;
const iu = /^[0-9]+$/, Op = (t, e) => {
  if (typeof t == "number" && typeof e == "number")
    return t === e ? 0 : t < e ? -1 : 1;
  const r = iu.test(t), n = iu.test(e);
  return r && n && (t = +t, e = +e), t === e ? 0 : r && !n ? -1 : n && !r ? 1 : t < e ? -1 : 1;
}, dP = (t, e) => Op(e, t);
var Rp = {
  compareIdentifiers: Op,
  rcompareIdentifiers: dP
};
const ms = ya, { MAX_LENGTH: cu, MAX_SAFE_INTEGER: ps } = Wn, { safeRe: ys, t: $s } = Xn, fP = Ic, { compareIdentifiers: yo } = Rp, hP = (t, e) => {
  const r = e.split(".");
  if (r.length > t.length)
    return !1;
  for (let n = 0; n < r.length; n++)
    if (yo(t[n], r[n]) !== 0)
      return !1;
  return !0;
};
let mP = class Pt {
  constructor(e, r) {
    if (r = fP(r), e instanceof Pt) {
      if (e.loose === !!r.loose && e.includePrerelease === !!r.includePrerelease)
        return e;
      e = e.version;
    } else if (typeof e != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);
    if (e.length > cu)
      throw new TypeError(
        `version is longer than ${cu} characters`
      );
    ms("SemVer", e, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = e.trim().match(r.loose ? ys[$s.LOOSE] : ys[$s.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${e}`);
    if (this.raw = e, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > ps || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > ps || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > ps || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < ps)
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
    if (ms("SemVer.compare", this.version, this.options, e), !(e instanceof Pt)) {
      if (typeof e == "string" && e === this.version)
        return 0;
      e = new Pt(e, this.options);
    }
    return e.version === this.version ? 0 : this.compareMain(e) || this.comparePre(e);
  }
  compareMain(e) {
    return e instanceof Pt || (e = new Pt(e, this.options)), this.major < e.major ? -1 : this.major > e.major ? 1 : this.minor < e.minor ? -1 : this.minor > e.minor ? 1 : this.patch < e.patch ? -1 : this.patch > e.patch ? 1 : 0;
  }
  comparePre(e) {
    if (e instanceof Pt || (e = new Pt(e, this.options)), this.prerelease.length && !e.prerelease.length)
      return -1;
    if (!this.prerelease.length && e.prerelease.length)
      return 1;
    if (!this.prerelease.length && !e.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = e.prerelease[r];
      if (ms("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return yo(n, s);
    } while (++r);
  }
  compareBuild(e) {
    e instanceof Pt || (e = new Pt(e, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = e.build[r];
      if (ms("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return yo(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(e, r, n) {
    if (e.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? ys[$s.PRERELEASELOOSE] : ys[$s.PRERELEASE]);
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
          if (n === !1 && (a = [r]), hP(this.prerelease, r)) {
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
var Je = mP;
const lu = Je, pP = (t, e, r = !1) => {
  if (t instanceof lu)
    return t;
  try {
    return new lu(t, e);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var jr = pP;
const yP = jr, $P = (t, e) => {
  const r = yP(t, e);
  return r ? r.version : null;
};
var gP = $P;
const vP = jr, _P = (t, e) => {
  const r = vP(t.trim().replace(/^[=v]+/, ""), e);
  return r ? r.version : null;
};
var wP = _P;
const uu = Je, bP = (t, e, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new uu(
      t instanceof uu ? t.version : t,
      r
    ).inc(e, n, s).version;
  } catch {
    return null;
  }
};
var SP = bP;
const du = jr, EP = (t, e) => {
  const r = du(t, null, !0), n = du(e, null, !0), s = r.compare(n);
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
var NP = EP;
const PP = Je, TP = (t, e) => new PP(t, e).major;
var OP = TP;
const RP = Je, IP = (t, e) => new RP(t, e).minor;
var jP = IP;
const CP = Je, AP = (t, e) => new CP(t, e).patch;
var kP = AP;
const LP = jr, DP = (t, e) => {
  const r = LP(t, e);
  return r && r.prerelease.length ? r.prerelease : null;
};
var MP = DP;
const fu = Je, VP = (t, e, r) => new fu(t, r).compare(new fu(e, r));
var St = VP;
const qP = St, FP = (t, e, r) => qP(e, t, r);
var zP = FP;
const UP = St, BP = (t, e) => UP(t, e, !0);
var KP = BP;
const hu = Je, QP = (t, e, r) => {
  const n = new hu(t, r), s = new hu(e, r);
  return n.compare(s) || n.compareBuild(s);
};
var jc = QP;
const GP = jc, xP = (t, e) => t.sort((r, n) => GP(r, n, e));
var HP = xP;
const JP = jc, WP = (t, e) => t.sort((r, n) => JP(n, r, e));
var XP = WP;
const YP = St, ZP = (t, e, r) => YP(t, e, r) > 0;
var $a = ZP;
const eT = St, tT = (t, e, r) => eT(t, e, r) < 0;
var Cc = tT;
const rT = St, nT = (t, e, r) => rT(t, e, r) === 0;
var Ip = nT;
const sT = St, aT = (t, e, r) => sT(t, e, r) !== 0;
var jp = aT;
const oT = St, iT = (t, e, r) => oT(t, e, r) >= 0;
var Ac = iT;
const cT = St, lT = (t, e, r) => cT(t, e, r) <= 0;
var kc = lT;
const uT = Ip, dT = jp, fT = $a, hT = Ac, mT = Cc, pT = kc, yT = (t, e, r, n) => {
  switch (e) {
    case "===":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t === r;
    case "!==":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t !== r;
    case "":
    case "=":
    case "==":
      return uT(t, r, n);
    case "!=":
      return dT(t, r, n);
    case ">":
      return fT(t, r, n);
    case ">=":
      return hT(t, r, n);
    case "<":
      return mT(t, r, n);
    case "<=":
      return pT(t, r, n);
    default:
      throw new TypeError(`Invalid operator: ${e}`);
  }
};
var Cp = yT;
const $T = Je, gT = jr, { safeRe: gs, t: vs } = Xn, vT = (t, e) => {
  if (t instanceof $T)
    return t;
  if (typeof t == "number" && (t = String(t)), typeof t != "string")
    return null;
  e = e || {};
  let r = null;
  if (!e.rtl)
    r = t.match(e.includePrerelease ? gs[vs.COERCEFULL] : gs[vs.COERCE]);
  else {
    const c = e.includePrerelease ? gs[vs.COERCERTLFULL] : gs[vs.COERCERTL];
    let d;
    for (; (d = c.exec(t)) && (!r || r.index + r[0].length !== t.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = e.includePrerelease && r[5] ? `-${r[5]}` : "", i = e.includePrerelease && r[6] ? `+${r[6]}` : "";
  return gT(`${n}.${s}.${a}${o}${i}`, e);
};
var _T = vT;
const wT = jr, bT = Wn, ST = Je, ET = (t, e, r) => {
  if (!bT.RELEASE_TYPES.includes(e))
    return null;
  const n = NT(t, r);
  return n && PT(n, e);
}, NT = (t, e) => {
  const r = t instanceof ST ? t.version : t;
  return wT(r, e);
}, PT = (t, e) => {
  if (TT(e))
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
}, TT = (t) => t.startsWith("pre");
var OT = ET;
class RT {
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
var IT = RT, Fa, mu;
function Et() {
  if (mu) return Fa;
  mu = 1;
  const t = /\s+/g;
  class e {
    constructor(q, J) {
      if (J = s(J), q instanceof e)
        return q.loose === !!J.loose && q.includePrerelease === !!J.includePrerelease ? q : new e(q.raw, J);
      if (q instanceof a)
        return this.raw = q.value, this.set = [[q]], this.formatted = void 0, this;
      if (this.options = J, this.loose = !!J.loose, this.includePrerelease = !!J.includePrerelease, this.raw = q.trim().replace(t, " "), this.set = this.raw.split("||").map((P) => this.parseRange(P.trim())).filter((P) => P.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const P = this.set[0];
        if (this.set = this.set.filter((y) => !m(y[0])), this.set.length === 0)
          this.set = [P];
        else if (this.set.length > 1) {
          for (const y of this.set)
            if (y.length === 1 && b(y[0])) {
              this.set = [y];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let q = 0; q < this.set.length; q++) {
          q > 0 && (this.formatted += "||");
          const J = this.set[q];
          for (let P = 0; P < J.length; P++)
            P > 0 && (this.formatted += " "), this.formatted += J[P].toString().trim();
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
    parseRange(q) {
      q = q.replace(v, "");
      const P = ((this.options.includePrerelease && w) | (this.options.loose && $)) + ":" + q, y = n.get(P);
      if (y)
        return y;
      const E = this.options.loose, _ = E ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      q = q.replace(_, pe(this.options.includePrerelease)), o("hyphen replace", q), q = q.replace(c[l.COMPARATORTRIM], h), o("comparator trim", q), q = q.replace(c[l.TILDETRIM], g), o("tilde trim", q), q = q.replace(c[l.CARETTRIM], p), o("caret trim", q);
      let u = q.split(" ").map((k) => R(k, this.options)).join(" ").split(/\s+/).map((k) => K(k, this.options));
      E && (u = u.filter((k) => (o("loose invalid filter", k, this.options), !!k.match(c[l.COMPARATORLOOSE])))), o("range list", u);
      const f = /* @__PURE__ */ new Map(), S = u.map((k) => new a(k, this.options));
      for (const k of S) {
        if (m(k))
          return [k];
        f.set(k.value, k);
      }
      f.size > 1 && f.has("") && f.delete("");
      const A = [...f.values()];
      return n.set(P, A), A;
    }
    intersects(q, J) {
      if (!(q instanceof e))
        throw new TypeError("a Range is required");
      return this.set.some((P) => T(P, J) && q.set.some((y) => T(y, J) && P.every((E) => y.every((_) => E.intersects(_, J)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(q) {
      if (!q)
        return !1;
      if (typeof q == "string")
        try {
          q = new i(q, this.options);
        } catch {
          return !1;
        }
      for (let J = 0; J < this.set.length; J++)
        if (Ee(this.set[J], q, this.options))
          return !0;
      return !1;
    }
  }
  Fa = e;
  const r = IT, n = new r(), s = Ic, a = ga(), o = ya, i = Je, {
    safeRe: c,
    src: d,
    t: l,
    comparatorTrimReplace: h,
    tildeTrimReplace: g,
    caretTrimReplace: p
  } = Xn, { FLAG_INCLUDE_PRERELEASE: w, FLAG_LOOSE: $ } = Wn, v = new RegExp(d[l.BUILD], "g"), m = (F) => F.value === "<0.0.0-0", b = (F) => F.value === "", T = (F, q) => {
    let J = !0;
    const P = F.slice();
    let y = P.pop();
    for (; J && P.length; )
      J = P.every((E) => y.intersects(E, q)), y = P.pop();
    return J;
  }, R = (F, q) => (F = F.replace(c[l.BUILD], ""), o("comp", F, q), F = fe(F, q), o("caret", F), F = M(F, q), o("tildes", F), F = x(F, q), o("xrange", F), F = Z(F, q), o("stars", F), F), j = (F) => !F || F.toLowerCase() === "x" || F === "*", U = (F, q, J) => j(F) && !j(q) || j(q) && J && !j(J), M = (F, q) => F.trim().split(/\s+/).map((J) => te(J, q)).join(" "), te = (F, q) => {
    const J = q.loose ? c[l.TILDELOOSE] : c[l.TILDE];
    return F.replace(J, (P, y, E, _, u) => {
      o("tilde", F, P, y, E, _, u);
      let f;
      return j(y) ? f = "" : j(E) ? f = `>=${y}.0.0 <${+y + 1}.0.0-0` : j(_) ? f = `>=${y}.${E}.0 <${y}.${+E + 1}.0-0` : u ? (o("replaceTilde pr", u), f = `>=${y}.${E}.${_}-${u} <${y}.${+E + 1}.0-0`) : f = `>=${y}.${E}.${_} <${y}.${+E + 1}.0-0`, o("tilde return", f), f;
    });
  }, fe = (F, q) => F.trim().split(/\s+/).map((J) => $e(J, q)).join(" "), $e = (F, q) => {
    o("caret", F, q);
    const J = q.loose ? c[l.CARETLOOSE] : c[l.CARET], P = q.includePrerelease ? "-0" : "";
    return F.replace(J, (y, E, _, u, f) => {
      o("caret", F, y, E, _, u, f);
      let S;
      return j(E) ? S = "" : j(_) ? S = `>=${E}.0.0${P} <${+E + 1}.0.0-0` : j(u) ? E === "0" ? S = `>=${E}.${_}.0${P} <${E}.${+_ + 1}.0-0` : S = `>=${E}.${_}.0${P} <${+E + 1}.0.0-0` : f ? (o("replaceCaret pr", f), E === "0" ? _ === "0" ? S = `>=${E}.${_}.${u}-${f} <${E}.${_}.${+u + 1}-0` : S = `>=${E}.${_}.${u}-${f} <${E}.${+_ + 1}.0-0` : S = `>=${E}.${_}.${u}-${f} <${+E + 1}.0.0-0`) : (o("no pr"), E === "0" ? _ === "0" ? S = `>=${E}.${_}.${u} <${E}.${_}.${+u + 1}-0` : S = `>=${E}.${_}.${u} <${E}.${+_ + 1}.0-0` : S = `>=${E}.${_}.${u} <${+E + 1}.0.0-0`), o("caret return", S), S;
    });
  }, x = (F, q) => (o("replaceXRanges", F, q), F.split(/\s+/).map((J) => X(J, q)).join(" ")), X = (F, q) => {
    F = F.trim();
    const J = q.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return F.replace(J, (P, y, E, _, u, f) => {
      if (o("xRange", F, P, y, E, _, u, f), U(E, _, u))
        return F;
      const S = j(E), A = S || j(_), k = A || j(u), H = k;
      return y === "=" && H && (y = ""), f = q.includePrerelease ? "-0" : "", S ? y === ">" || y === "<" ? P = "<0.0.0-0" : P = "*" : y && H ? (A && (_ = 0), u = 0, y === ">" ? (y = ">=", A ? (E = +E + 1, _ = 0, u = 0) : (_ = +_ + 1, u = 0)) : y === "<=" && (y = "<", A ? E = +E + 1 : _ = +_ + 1), y === "<" && (f = "-0"), P = `${y + E}.${_}.${u}${f}`) : A ? P = `>=${E}.0.0${f} <${+E + 1}.0.0-0` : k && (P = `>=${E}.${_}.0${f} <${E}.${+_ + 1}.0-0`), o("xRange return", P), P;
    });
  }, Z = (F, q) => (o("replaceStars", F, q), F.trim().replace(c[l.STAR], "")), K = (F, q) => (o("replaceGTE0", F, q), F.trim().replace(c[q.includePrerelease ? l.GTE0PRE : l.GTE0], "")), pe = (F) => (q, J, P, y, E, _, u, f, S, A, k, H) => (j(P) ? J = "" : j(y) ? J = `>=${P}.0.0${F ? "-0" : ""}` : j(E) ? J = `>=${P}.${y}.0${F ? "-0" : ""}` : _ ? J = `>=${J}` : J = `>=${J}${F ? "-0" : ""}`, j(S) ? f = "" : j(A) ? f = `<${+S + 1}.0.0-0` : j(k) ? f = `<${S}.${+A + 1}.0-0` : H ? f = `<=${S}.${A}.${k}-${H}` : F ? f = `<${S}.${A}.${+k + 1}-0` : f = `<=${f}`, `${J} ${f}`.trim()), Ee = (F, q, J) => {
    for (let P = 0; P < F.length; P++)
      if (!F[P].test(q))
        return !1;
    if (q.prerelease.length && !J.includePrerelease) {
      for (let P = 0; P < F.length; P++)
        if (o(F[P].semver), F[P].semver !== a.ANY && F[P].semver.prerelease.length > 0) {
          const y = F[P].semver;
          if (y.major === q.major && y.minor === q.minor && y.patch === q.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Fa;
}
var za, pu;
function ga() {
  if (pu) return za;
  pu = 1;
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
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], g = l.match(h);
      if (!g)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = g[1] !== void 0 ? g[1] : "", this.operator === "=" && (this.operator = ""), g[2] ? this.semver = new i(g[2], this.options.loose) : this.semver = t;
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
  za = e;
  const r = Ic, { safeRe: n, t: s } = Xn, a = Cp, o = ya, i = Je, c = Et();
  return za;
}
const jT = Et(), CT = (t, e, r) => {
  try {
    e = new jT(e, r);
  } catch {
    return !1;
  }
  return e.test(t);
};
var va = CT;
const AT = Et(), kT = (t, e) => new AT(t, e).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var LT = kT;
const DT = Je, MT = Et(), VT = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new MT(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new DT(n, r));
  }), n;
};
var qT = VT;
const FT = Je, zT = Et(), UT = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new zT(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new FT(n, r));
  }), n;
};
var BT = UT;
const Ua = Je, KT = Et(), yu = $a, QT = (t, e) => {
  t = new KT(t, e);
  let r = new Ua("0.0.0");
  if (t.test(r) || (r = new Ua("0.0.0-0"), t.test(r)))
    return r;
  r = null;
  for (let n = 0; n < t.set.length; ++n) {
    const s = t.set[n];
    let a = null;
    s.forEach((o) => {
      const i = new Ua(o.semver.version);
      switch (o.operator) {
        case ">":
          i.prerelease.length === 0 ? i.patch++ : i.prerelease.push(0), i.raw = i.format();
        case "":
        case ">=":
          (!a || yu(i, a)) && (a = i);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || yu(r, a)) && (r = a);
  }
  return r && t.test(r) ? r : null;
};
var GT = QT;
const xT = Et(), HT = (t, e) => {
  try {
    return new xT(t, e).range || "*";
  } catch {
    return null;
  }
};
var JT = HT;
const WT = Je, Ap = ga(), { ANY: XT } = Ap, YT = Et(), ZT = va, $u = $a, gu = Cc, eO = kc, tO = Ac, rO = (t, e, r, n) => {
  t = new WT(t, n), e = new YT(e, n);
  let s, a, o, i, c;
  switch (r) {
    case ">":
      s = $u, a = eO, o = gu, i = ">", c = ">=";
      break;
    case "<":
      s = gu, a = tO, o = $u, i = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (ZT(t, e, n))
    return !1;
  for (let d = 0; d < e.set.length; ++d) {
    const l = e.set[d];
    let h = null, g = null;
    if (l.forEach((p) => {
      p.semver === XT && (p = new Ap(">=0.0.0")), h = h || p, g = g || p, s(p.semver, h.semver, n) ? h = p : o(p.semver, g.semver, n) && (g = p);
    }), h.operator === i || h.operator === c || (!g.operator || g.operator === i) && a(t, g.semver))
      return !1;
    if (g.operator === c && o(t, g.semver))
      return !1;
  }
  return !0;
};
var Lc = rO;
const nO = Lc, sO = (t, e, r) => nO(t, e, ">", r);
var aO = sO;
const oO = Lc, iO = (t, e, r) => oO(t, e, "<", r);
var cO = iO;
const vu = Et(), lO = (t, e, r) => (t = new vu(t, r), e = new vu(e, r), t.intersects(e, r));
var uO = lO;
const dO = va, fO = St;
var hO = (t, e, r) => {
  const n = [];
  let s = null, a = null;
  const o = t.sort((l, h) => fO(l, h, r));
  for (const l of o)
    dO(l, e, r) ? (a = l, s || (s = l)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const i = [];
  for (const [l, h] of n)
    l === h ? i.push(l) : !h && l === o[0] ? i.push("*") : h ? l === o[0] ? i.push(`<=${h}`) : i.push(`${l} - ${h}`) : i.push(`>=${l}`);
  const c = i.join(" || "), d = typeof e.raw == "string" ? e.raw : String(e);
  return c.length < d.length ? c : e;
};
const _u = Et(), Dc = ga(), { ANY: Ba } = Dc, Ka = va, Mc = St, mO = (t, e, r = {}) => {
  if (t === e)
    return !0;
  t = new _u(t, r), e = new _u(e, r);
  let n = !1;
  e: for (const s of t.set) {
    for (const a of e.set) {
      const o = yO(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, pO = [new Dc(">=0.0.0-0")], wu = [new Dc(">=0.0.0")], yO = (t, e, r) => {
  if (t === e)
    return !0;
  if (t.length === 1 && t[0].semver === Ba) {
    if (e.length === 1 && e[0].semver === Ba)
      return !0;
    r.includePrerelease ? t = pO : t = wu;
  }
  if (e.length === 1 && e[0].semver === Ba) {
    if (r.includePrerelease)
      return !0;
    e = wu;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const p of t)
    p.operator === ">" || p.operator === ">=" ? s = bu(s, p, r) : p.operator === "<" || p.operator === "<=" ? a = Su(a, p, r) : n.add(p.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Mc(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const p of n) {
    if (s && !Ka(p, String(s), r) || a && !Ka(p, String(a), r))
      return null;
    for (const w of e)
      if (!Ka(p, String(w), r))
        return !1;
    return !0;
  }
  let i, c, d, l, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, g = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const p of e) {
    if (l = l || p.operator === ">" || p.operator === ">=", d = d || p.operator === "<" || p.operator === "<=", s) {
      if (g && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === g.major && p.semver.minor === g.minor && p.semver.patch === g.patch && (g = !1), p.operator === ">" || p.operator === ">=") {
        if (i = bu(s, p, r), i === p && i !== s)
          return !1;
      } else if (s.operator === ">=" && !p.test(s.semver))
        return !1;
    }
    if (a) {
      if (h && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === h.major && p.semver.minor === h.minor && p.semver.patch === h.patch && (h = !1), p.operator === "<" || p.operator === "<=") {
        if (c = Su(a, p, r), c === p && c !== a)
          return !1;
      } else if (a.operator === "<=" && !p.test(a.semver))
        return !1;
    }
    if (!p.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && l && !s && o !== 0 || g || h);
}, bu = (t, e, r) => {
  if (!t)
    return e;
  const n = Mc(t.semver, e.semver, r);
  return n > 0 ? t : n < 0 || e.operator === ">" && t.operator === ">=" ? e : t;
}, Su = (t, e, r) => {
  if (!t)
    return e;
  const n = Mc(t.semver, e.semver, r);
  return n < 0 ? t : n > 0 || e.operator === "<" && t.operator === "<=" ? e : t;
};
var $O = mO;
const Qa = Xn, Eu = Wn, gO = Je, Nu = Rp, vO = jr, _O = gP, wO = wP, bO = SP, SO = NP, EO = OP, NO = jP, PO = kP, TO = MP, OO = St, RO = zP, IO = KP, jO = jc, CO = HP, AO = XP, kO = $a, LO = Cc, DO = Ip, MO = jp, VO = Ac, qO = kc, FO = Cp, zO = _T, UO = OT, BO = ga(), KO = Et(), QO = va, GO = LT, xO = qT, HO = BT, JO = GT, WO = JT, XO = Lc, YO = aO, ZO = cO, eR = uO, tR = hO, rR = $O;
var nR = {
  parse: vO,
  valid: _O,
  clean: wO,
  inc: bO,
  diff: SO,
  major: EO,
  minor: NO,
  patch: PO,
  prerelease: TO,
  compare: OO,
  rcompare: RO,
  compareLoose: IO,
  compareBuild: jO,
  sort: CO,
  rsort: AO,
  gt: kO,
  lt: LO,
  eq: DO,
  neq: MO,
  gte: VO,
  lte: qO,
  cmp: FO,
  coerce: zO,
  truncate: UO,
  Comparator: BO,
  Range: KO,
  satisfies: QO,
  toComparators: GO,
  maxSatisfying: xO,
  minSatisfying: HO,
  minVersion: JO,
  validRange: WO,
  outside: XO,
  gtr: YO,
  ltr: ZO,
  intersects: eR,
  simplifyRange: tR,
  subset: rR,
  SemVer: gO,
  re: Qa.re,
  src: Qa.src,
  tokens: Qa.t,
  SEMVER_SPEC_VERSION: Eu.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Eu.RELEASE_TYPES,
  compareIdentifiers: Nu.compareIdentifiers,
  rcompareIdentifiers: Nu.rcompareIdentifiers
};
const Mr = /* @__PURE__ */ Jh(nR), sR = Object.prototype.toString, aR = "[object Uint8Array]", oR = "[object ArrayBuffer]";
function kp(t, e, r) {
  return t ? t.constructor === e ? !0 : sR.call(t) === r : !1;
}
function Lp(t) {
  return kp(t, Uint8Array, aR);
}
function iR(t) {
  return kp(t, ArrayBuffer, oR);
}
function cR(t) {
  return Lp(t) || iR(t);
}
function lR(t) {
  if (!Lp(t))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof t}\``);
}
function uR(t) {
  if (!cR(t))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof t}\``);
}
function Pu(t, e) {
  if (t.length === 0)
    return new Uint8Array(0);
  e ?? (e = t.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(e);
  let n = 0;
  for (const s of t)
    lR(s), r.set(s, n), n += s.length;
  return r;
}
const _s = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Tu(t, e = "utf8") {
  return uR(t), _s[e] ?? (_s[e] = new globalThis.TextDecoder(e)), _s[e].decode(t);
}
function dR(t) {
  if (typeof t != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof t}\``);
}
const fR = new globalThis.TextEncoder();
function Ga(t) {
  return dR(t), fR.encode(t);
}
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
const hR = xN.default, Ou = "aes-256-cbc", Vr = () => /* @__PURE__ */ Object.create(null), mR = (t) => t != null, pR = (t, e) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof e;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${t}\` is not allowed as it's not supported by JSON`);
}, As = "__internal__", xa = `${As}.migrations.version`;
var Zt, kt, it, Lt;
class yR {
  constructor(e = {}) {
    N(this, "path");
    N(this, "events");
    pn(this, Zt);
    pn(this, kt);
    pn(this, it);
    pn(this, Lt, {});
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
      r.cwd = i$(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if (yn(this, it, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const o = new wS.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      hR(o);
      const i = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      yn(this, Zt, o.compile(i));
      for (const [c, d] of Object.entries(r.schema ?? {}))
        d != null && d.default && (be(this, Lt)[c] = d.default);
    }
    r.defaults && yn(this, Lt, {
      ...be(this, Lt),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), yn(this, kt, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = ne.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, a = Object.assign(Vr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      Yy.deepEqual(s, a);
    } catch {
      this.store = a;
    }
    r.watch && this._watch();
  }
  get(e, r) {
    if (be(this, it).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${As} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      pR(a, o), be(this, it).accessPropertiesByDotNotation ? tl(n, a, o) : n[a] = o;
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
    return be(this, it).accessPropertiesByDotNotation ? n$(this.store, e) : e in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...e) {
    for (const r of e)
      mR(be(this, Lt)[r]) && this.set(r, be(this, Lt)[r]);
  }
  delete(e) {
    const { store: r } = this;
    be(this, it).accessPropertiesByDotNotation ? r$(r, e) : delete r[e], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = Vr();
    for (const e of Object.keys(be(this, Lt)))
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
      const e = se.readFileSync(this.path, be(this, kt) ? null : "utf8"), r = this._encryptData(e), n = this._deserialize(r);
      return this._validate(n), Object.assign(Vr(), n);
    } catch (e) {
      if ((e == null ? void 0 : e.code) === "ENOENT")
        return this._ensureDirectory(), Vr();
      if (be(this, it).clearInvalidConfig && e.name === "SyntaxError")
        return Vr();
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
    if (!be(this, kt))
      return typeof e == "string" ? e : Tu(e);
    try {
      const r = e.slice(0, 16), n = $n.pbkdf2Sync(be(this, kt), r.toString(), 1e4, 32, "sha512"), s = $n.createDecipheriv(Ou, n, r), a = e.slice(17), o = typeof a == "string" ? Ga(a) : a;
      return Tu(Pu([s.update(o), s.final()]));
    } catch {
    }
    return e.toString();
  }
  _handleChange(e, r) {
    let n = e();
    const s = () => {
      const a = n, o = e();
      Xy(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(e) {
    if (!be(this, Zt) || be(this, Zt).call(this, e) || !be(this, Zt).errors)
      return;
    const n = be(this, Zt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    se.mkdirSync(ne.dirname(this.path), { recursive: !0 });
  }
  _write(e) {
    let r = this._serialize(e);
    if (be(this, kt)) {
      const n = $n.randomBytes(16), s = $n.pbkdf2Sync(be(this, kt), n.toString(), 1e4, 32, "sha512"), a = $n.createCipheriv(Ou, s, n);
      r = Pu([n, Ga(":"), a.update(Ga(r)), a.final()]);
    }
    if (Se.env.SNAP)
      se.writeFileSync(this.path, r, { mode: be(this, it).configFileMode });
    else
      try {
        Hh(this.path, r, { mode: be(this, it).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          se.writeFileSync(this.path, r, { mode: be(this, it).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), se.existsSync(this.path) || this._write(Vr()), Se.platform === "win32" ? se.watch(this.path, { persistent: !1 }, ou(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : se.watchFile(this.path, { persistent: !1 }, ou(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(e, r, n) {
    let s = this._get(xa, "0.0.0");
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
        c == null || c(this), this._set(xa, i), s = i, o = { ...this.store };
      } catch (c) {
        throw this.store = o, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${c}`);
      }
    (this._isVersionInRangeFormat(s) || !Mr.eq(s, r)) && this._set(xa, r);
  }
  _containsReservedKey(e) {
    return typeof e == "object" && Object.keys(e)[0] === As ? !0 : typeof e != "string" ? !1 : be(this, it).accessPropertiesByDotNotation ? !!e.startsWith(`${As}.`) : !1;
  }
  _isVersionInRangeFormat(e) {
    return Mr.clean(e) === null;
  }
  _shouldPerformMigration(e, r, n) {
    return this._isVersionInRangeFormat(e) ? r !== "0.0.0" && Mr.satisfies(r, e) ? !1 : Mr.satisfies(n, e) : !(Mr.lte(e, r) || Mr.gt(e, n));
  }
  _get(e, r) {
    return t$(this.store, e, r);
  }
  _set(e, r) {
    const { store: n } = this;
    tl(n, e, r), this.store = n;
  }
}
Zt = new WeakMap(), kt = new WeakMap(), it = new WeakMap(), Lt = new WeakMap();
const { app: ks, ipcMain: $o, shell: $R } = Kh;
let Ru = !1;
const Iu = () => {
  if (!$o || !ks)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const t = {
    defaultCwd: ks.getPath("userData"),
    appVersion: ks.getVersion()
  };
  return Ru || ($o.on("electron-store-get-data", (e) => {
    e.returnValue = t;
  }), Ru = !0), t;
};
class gR extends yR {
  constructor(e) {
    let r, n;
    if (Se.type === "renderer") {
      const s = Kh.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else $o && ks && ({ defaultCwd: r, appVersion: n } = Iu());
    e = {
      name: "config",
      ...e
    }, e.projectVersion || (e.projectVersion = n), e.cwd ? e.cwd = ne.isAbsolute(e.cwd) ? e.cwd : ne.join(r, e.cwd) : e.cwd = r, e.configName = e.name, delete e.name, super(e);
  }
  static initRenderer() {
    Iu();
  }
  async openInEditor() {
    const e = await $R.openPath(this.path);
    if (e)
      throw new Error(e);
  }
}
const V = Symbol.for("drizzle:entityKind");
function D(t, e) {
  if (!t || typeof t != "object")
    return !1;
  if (t instanceof e)
    return !0;
  if (!Object.prototype.hasOwnProperty.call(e, V))
    throw new Error(
      `Class "${e.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  let r = Object.getPrototypeOf(t).constructor;
  if (r)
    for (; r; ) {
      if (V in r && r[V] === e[V])
        return !0;
      r = Object.getPrototypeOf(r);
    }
  return !1;
}
var Fu;
Fu = V;
class Re {
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
N(Re, Fu, "Column");
var zu;
zu = V;
class Dp {
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
N(Dp, zu, "ColumnBuilder");
const sr = Symbol.for("drizzle:Name"), ju = Symbol.for("drizzle:isPgEnum");
function vR(t) {
  return !!t && typeof t == "function" && ju in t && t[ju] === !0;
}
var Uu;
Uu = V;
class He {
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
N(He, Uu, "Subquery");
var Bu, Ku;
class Vc extends (Ku = He, Bu = V, Ku) {
}
N(Vc, Bu, "WithSubquery");
const _R = {
  startActiveSpan(t, e) {
    return e();
  }
}, xe = Symbol.for("drizzle:ViewBaseConfig"), Ls = Symbol.for("drizzle:Schema"), go = Symbol.for("drizzle:Columns"), Cu = Symbol.for("drizzle:ExtraConfigColumns"), Ha = Symbol.for("drizzle:OriginalName"), Ja = Symbol.for("drizzle:BaseName"), Qs = Symbol.for("drizzle:IsAlias"), Au = Symbol.for("drizzle:ExtraConfigBuilder"), wR = Symbol.for("drizzle:IsDrizzleTable");
var Qu, Gu, xu, Hu, Ju, Wu, Xu, Yu, Zu, ed;
ed = V, Zu = sr, Yu = Ha, Xu = Ls, Wu = go, Ju = Cu, Hu = Ja, xu = Qs, Gu = wR, Qu = Au;
class Q {
  constructor(e, r, n) {
    /**
     * @internal
     * Can be changed if the table is aliased.
     */
    N(this, Zu);
    /**
     * @internal
     * Used to store the original name of the table, before any aliasing.
     */
    N(this, Yu);
    /** @internal */
    N(this, Xu);
    /** @internal */
    N(this, Wu);
    /** @internal */
    N(this, Ju);
    /**
     *  @internal
     * Used to store the table name before the transformation via the `tableCreator` functions.
     */
    N(this, Hu);
    /** @internal */
    N(this, xu, !1);
    /** @internal */
    N(this, Gu, !0);
    /** @internal */
    N(this, Qu);
    this[sr] = this[Ha] = e, this[Ls] = r, this[Ja] = n;
  }
}
N(Q, ed, "Table"), /** @internal */
N(Q, "Symbol", {
  Name: sr,
  Schema: Ls,
  OriginalName: Ha,
  Columns: go,
  ExtraConfigColumns: Cu,
  BaseName: Ja,
  IsAlias: Qs,
  ExtraConfigBuilder: Au
});
function Gr(t) {
  return t[sr];
}
function Fn(t) {
  return `${t[Ls] ?? "public"}.${t[sr]}`;
}
function Mp(t) {
  return t != null && typeof t.getSQL == "function";
}
function bR(t) {
  var r;
  const e = { sql: "", params: [] };
  for (const n of t)
    e.sql += n.sql, e.params.push(...n.params), (r = n.typings) != null && r.length && (e.typings || (e.typings = []), e.typings.push(...n.typings));
  return e;
}
var td;
td = V;
class Le {
  constructor(e) {
    N(this, "value");
    this.value = Array.isArray(e) ? e : [e];
  }
  getSQL() {
    return new re([this]);
  }
}
N(Le, td, "StringChunk");
var rd;
rd = V;
const vr = class vr {
  constructor(e) {
    /** @internal */
    N(this, "decoder", Vp);
    N(this, "shouldInlineParams", !1);
    /** @internal */
    N(this, "usedTables", []);
    this.queryChunks = e;
    for (const r of e)
      if (D(r, Q)) {
        const n = r[Q.Symbol.Schema];
        this.usedTables.push(
          n === void 0 ? r[Q.Symbol.Name] : n + "." + r[Q.Symbol.Name]
        );
      }
  }
  append(e) {
    return this.queryChunks.push(...e.queryChunks), this;
  }
  toQuery(e) {
    return _R.startActiveSpan("drizzle.buildSQL", (r) => {
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
    return bR(e.map((l) => {
      var h;
      if (D(l, Le))
        return { sql: l.value.join(""), params: [] };
      if (D(l, Gs))
        return { sql: a(l.value), params: [] };
      if (l === void 0)
        return { sql: "", params: [] };
      if (Array.isArray(l)) {
        const g = [new Le("(")];
        for (const [p, w] of l.entries())
          g.push(w), p < l.length - 1 && g.push(new Le(", "));
        return g.push(new Le(")")), this.buildQueryFromSourceParams(g, n);
      }
      if (D(l, vr))
        return this.buildQueryFromSourceParams(l.queryChunks, {
          ...n,
          inlineParams: c || l.shouldInlineParams
        });
      if (D(l, Q)) {
        const g = l[Q.Symbol.Schema], p = l[Q.Symbol.Name];
        return {
          sql: g === void 0 || l[Qs] ? a(p) : a(g) + "." + a(p),
          params: []
        };
      }
      if (D(l, Re)) {
        const g = s.getColumnCasing(l);
        if (r.invokeSource === "indexes")
          return { sql: a(g), params: [] };
        const p = l.table[Q.Symbol.Schema];
        return {
          sql: l.table[Qs] || p === void 0 ? a(l.table[Q.Symbol.Name]) + "." + a(g) : a(p) + "." + a(l.table[Q.Symbol.Name]) + "." + a(g),
          params: []
        };
      }
      if (D(l, Cr)) {
        const g = l[xe].schema, p = l[xe].name;
        return {
          sql: g === void 0 || l[xe].isAlias ? a(p) : a(g) + "." + a(p),
          params: []
        };
      }
      if (D(l, Ut)) {
        if (D(l.value, Pr))
          return { sql: o(d.value++, l), params: [l], typings: ["none"] };
        const g = l.value === null ? null : l.encoder.mapToDriverValue(l.value);
        if (D(g, vr))
          return this.buildQueryFromSourceParams([g], n);
        if (c)
          return { sql: this.mapInlineParam(g, n), params: [] };
        let p = ["none"];
        return i && (p = [i(l.encoder)]), { sql: o(d.value++, g), params: [g], typings: p };
      }
      return D(l, Pr) ? { sql: o(d.value++, l), params: [l], typings: ["none"] } : D(l, vr.Aliased) && l.fieldAlias !== void 0 ? { sql: a(l.fieldAlias), params: [] } : D(l, He) ? l._.isWith ? { sql: a(l._.alias), params: [] } : this.buildQueryFromSourceParams([
        new Le("("),
        l._.sql,
        new Le(") "),
        new Gs(l._.alias)
      ], n) : vR(l) ? l.schema ? { sql: a(l.schema) + "." + a(l.enumName), params: [] } : { sql: a(l.enumName), params: [] } : Mp(l) ? (h = l.shouldOmitSQLParens) != null && h.call(l) ? this.buildQueryFromSourceParams([l.getSQL()], n) : this.buildQueryFromSourceParams([
        new Le("("),
        l.getSQL(),
        new Le(")")
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
    return e === void 0 ? this : new vr.Aliased(this, e);
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
N(vr, rd, "SQL");
let re = vr;
var nd;
nd = V;
class Gs {
  constructor(e) {
    N(this, "brand");
    this.value = e;
  }
  getSQL() {
    return new re([this]);
  }
}
N(Gs, nd, "Name");
function SR(t) {
  return typeof t == "object" && t !== null && "mapToDriverValue" in t && typeof t.mapToDriverValue == "function";
}
const Vp = {
  mapFromDriverValue: (t) => t
}, qp = {
  mapToDriverValue: (t) => t
};
({
  ...Vp,
  ...qp
});
var sd;
sd = V;
class Ut {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(e, r = qp) {
    N(this, "brand");
    this.value = e, this.encoder = r;
  }
  getSQL() {
    return new re([this]);
  }
}
N(Ut, sd, "Param");
function I(t, ...e) {
  const r = [];
  (e.length > 0 || t.length > 0 && t[0] !== "") && r.push(new Le(t[0]));
  for (const [n, s] of e.entries())
    r.push(s, new Le(t[n + 1]));
  return new re(r);
}
((t) => {
  function e() {
    return new re([]);
  }
  t.empty = e;
  function r(c) {
    return new re(c);
  }
  t.fromList = r;
  function n(c) {
    return new re([new Le(c)]);
  }
  t.raw = n;
  function s(c, d) {
    const l = [];
    for (const [h, g] of c.entries())
      h > 0 && d !== void 0 && l.push(d), l.push(g);
    return new re(l);
  }
  t.join = s;
  function a(c) {
    return new Gs(c);
  }
  t.identifier = a;
  function o(c) {
    return new Pr(c);
  }
  t.placeholder = o;
  function i(c, d) {
    return new Ut(c, d);
  }
  t.param = i;
})(I || (I = {}));
((t) => {
  var r;
  r = V;
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
})(re || (re = {}));
var ad;
ad = V;
class Pr {
  constructor(e) {
    this.name = e;
  }
  getSQL() {
    return new re([this]);
  }
}
N(Pr, ad, "Placeholder");
function ws(t, e) {
  return t.map((r) => {
    if (D(r, Pr)) {
      if (!(r.name in e))
        throw new Error(`No value for placeholder "${r.name}" was provided`);
      return e[r.name];
    }
    if (D(r, Ut) && D(r.value, Pr)) {
      if (!(r.value.name in e))
        throw new Error(`No value for placeholder "${r.value.name}" was provided`);
      return r.encoder.mapToDriverValue(e[r.value.name]);
    }
    return r;
  });
}
const ER = Symbol.for("drizzle:IsDrizzleView");
var od, id, cd;
cd = V, id = xe, od = ER;
class Cr {
  constructor({ name: e, schema: r, selectedFields: n, query: s }) {
    /** @internal */
    N(this, id);
    /** @internal */
    N(this, od, !0);
    this[xe] = {
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
    return new re([this]);
  }
}
N(Cr, cd, "View");
Re.prototype.getSQL = function() {
  return new re([this]);
};
Q.prototype.getSQL = function() {
  return new re([this]);
};
He.prototype.getSQL = function() {
  return new re([this]);
};
var ld;
ld = V;
class zn {
  constructor(e) {
    this.table = e;
  }
  get(e, r) {
    return r === "table" ? this.table : e[r];
  }
}
N(zn, ld, "ColumnAliasProxyHandler");
var ud;
ud = V;
class _a {
  constructor(e, r) {
    this.alias = e, this.replaceOriginalName = r;
  }
  get(e, r) {
    if (r === Q.Symbol.IsAlias)
      return !0;
    if (r === Q.Symbol.Name)
      return this.alias;
    if (this.replaceOriginalName && r === Q.Symbol.OriginalName)
      return this.alias;
    if (r === xe)
      return {
        ...e[xe],
        name: this.alias,
        isAlias: !0
      };
    if (r === Q.Symbol.Columns) {
      const s = e[Q.Symbol.Columns];
      if (!s)
        return s;
      const a = {};
      return Object.keys(s).map((o) => {
        a[o] = new Proxy(
          s[o],
          new zn(new Proxy(e, this))
        );
      }), a;
    }
    const n = e[r];
    return D(n, Re) ? new Proxy(n, new zn(new Proxy(e, this))) : n;
  }
}
N(_a, ud, "TableAliasProxyHandler");
function Wa(t, e) {
  return new Proxy(t, new _a(e, !1));
}
function At(t, e) {
  return new Proxy(
    t,
    new zn(new Proxy(t.table, new _a(e, !1)))
  );
}
function Fp(t, e) {
  return new re.Aliased(xs(t.sql, e), t.fieldAlias);
}
function xs(t, e) {
  return I.join(t.queryChunks.map((r) => D(r, Re) ? At(r, e) : D(r, re) ? xs(r, e) : D(r, re.Aliased) ? Fp(r, e) : r));
}
var dd, fd;
class wa extends (fd = Error, dd = V, fd) {
  constructor({ message: e, cause: r }) {
    super(e), this.name = "DrizzleError", this.cause = r;
  }
}
N(wa, dd, "DrizzleError");
class Xt extends Error {
  constructor(e, r, n) {
    super(`Failed query: ${e}
params: ${r}`), this.query = e, this.params = r, this.cause = n, Error.captureStackTrace(this, Xt), n && (this.cause = n);
  }
}
var hd, md;
class zp extends (md = wa, hd = V, md) {
  constructor() {
    super({ message: "Rollback" });
  }
}
N(zp, hd, "TransactionRollbackError");
var pd;
pd = V;
class Up {
  write(e) {
    console.log(e);
  }
}
N(Up, pd, "ConsoleLogWriter");
var yd;
yd = V;
class Bp {
  constructor(e) {
    N(this, "writer");
    this.writer = (e == null ? void 0 : e.writer) ?? new Up();
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
N(Bp, yd, "DefaultLogger");
var $d;
$d = V;
class Kp {
  logQuery() {
  }
}
N(Kp, $d, "NoopLogger");
var gd, vd;
vd = V, gd = Symbol.toStringTag;
class or {
  constructor() {
    N(this, gd, "QueryPromise");
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
N(or, vd, "QueryPromise");
function ku(t, e, r) {
  const n = {}, s = t.reduce(
    (a, { path: o, field: i }, c) => {
      let d;
      D(i, Re) ? d = i : D(i, re) ? d = i.decoder : D(i, He) ? d = i._.sql.decoder : d = i.sql.decoder;
      let l = a;
      for (const [h, g] of o.entries())
        if (h < o.length - 1)
          g in l || (l[g] = {}), l = l[g];
        else {
          const p = e[c], w = l[g] = p === null ? null : d.mapFromDriverValue(p);
          if (r && D(i, Re) && o.length === 2) {
            const $ = o[0];
            $ in n ? typeof n[$] == "string" && n[$] !== Gr(i.table) && (n[$] = !1) : n[$] = w === null ? Gr(i.table) : !1;
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
function Tr(t, e) {
  return Object.entries(t).reduce((r, [n, s]) => {
    if (typeof n != "string")
      return r;
    const a = e ? [...e, n] : [n];
    return D(s, Re) || D(s, re) || D(s, re.Aliased) || D(s, He) ? r.push({ path: a, field: s }) : D(s, Q) ? r.push(...Tr(s[Q.Symbol.Columns], a)) : r.push(...Tr(s, a)), r;
  }, []);
}
function qc(t, e) {
  const r = Object.keys(t), n = Object.keys(e);
  if (r.length !== n.length)
    return !1;
  for (const [s, a] of r.entries())
    if (a !== n[s])
      return !1;
  return !0;
}
function Qp(t, e) {
  const r = Object.entries(e).filter(([, n]) => n !== void 0).map(([n, s]) => D(s, re) || D(s, Re) ? [n, s] : [n, new Ut(s, t[Q.Symbol.Columns][n])]);
  if (r.length === 0)
    throw new Error("No values to set");
  return Object.fromEntries(r);
}
function NR(t, e) {
  for (const r of e)
    for (const n of Object.getOwnPropertyNames(r.prototype))
      n !== "constructor" && Object.defineProperty(
        t.prototype,
        n,
        Object.getOwnPropertyDescriptor(r.prototype, n) || /* @__PURE__ */ Object.create(null)
      );
}
function PR(t) {
  return t[Q.Symbol.Columns];
}
function vo(t) {
  return D(t, He) ? t._.alias : D(t, Cr) ? t[xe].name : D(t, re) ? void 0 : t[Q.Symbol.IsAlias] ? t[Q.Symbol.Name] : t[Q.Symbol.BaseName];
}
function Yn(t, e) {
  return {
    name: typeof t == "string" && t.length > 0 ? t : "",
    config: typeof t == "object" ? t : e
  };
}
function TR(t) {
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
const Gp = typeof TextDecoder > "u" ? null : new TextDecoder(), Lu = Symbol.for("drizzle:PgInlineForeignKeys"), Du = Symbol.for("drizzle:EnableRLS");
var _d, wd, bd, Sd, Ed, Nd;
class _o extends (Nd = Q, Ed = V, Sd = Lu, bd = Du, wd = Q.Symbol.ExtraConfigBuilder, _d = Q.Symbol.ExtraConfigColumns, Nd) {
  constructor() {
    super(...arguments);
    /**@internal */
    N(this, Sd, []);
    /** @internal */
    N(this, bd, !1);
    /** @internal */
    N(this, wd);
    /** @internal */
    N(this, _d, {});
  }
}
N(_o, Ed, "PgTable"), /** @internal */
N(_o, "Symbol", Object.assign({}, Q.Symbol, {
  InlineForeignKeys: Lu,
  EnableRLS: Du
}));
var Pd;
Pd = V;
class xp {
  constructor(e, r) {
    /** @internal */
    N(this, "columns");
    /** @internal */
    N(this, "name");
    this.columns = e, this.name = r;
  }
  /** @internal */
  build(e) {
    return new Hp(e, this.columns, this.name);
  }
}
N(xp, Pd, "PgPrimaryKeyBuilder");
var Td;
Td = V;
class Hp {
  constructor(e, r, n) {
    N(this, "columns");
    N(this, "name");
    this.table = e, this.columns = r, this.name = n;
  }
  getName() {
    return this.name ?? `${this.table[_o.Symbol.Name]}_${this.columns.map((e) => e.name).join("_")}_pk`;
  }
}
N(Hp, Td, "PgPrimaryKey");
function at(t, e) {
  return SR(e) && !Mp(t) && !D(t, Ut) && !D(t, Pr) && !D(t, Re) && !D(t, Q) && !D(t, Cr) ? new Ut(t, e) : t;
}
const Zn = (t, e) => I`${t} = ${at(e, t)}`, OR = (t, e) => I`${t} <> ${at(e, t)}`;
function wo(...t) {
  const e = t.filter(
    (r) => r !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new re(e) : new re([
      new Le("("),
      I.join(e, new Le(" and ")),
      new Le(")")
    ]);
}
function RR(...t) {
  const e = t.filter(
    (r) => r !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new re(e) : new re([
      new Le("("),
      I.join(e, new Le(" or ")),
      new Le(")")
    ]);
}
function IR(t) {
  return I`not ${t}`;
}
const jR = (t, e) => I`${t} > ${at(e, t)}`, CR = (t, e) => I`${t} >= ${at(e, t)}`, AR = (t, e) => I`${t} < ${at(e, t)}`, kR = (t, e) => I`${t} <= ${at(e, t)}`;
function LR(t, e) {
  return Array.isArray(e) ? e.length === 0 ? I`false` : I`${t} in ${e.map((r) => at(r, t))}` : I`${t} in ${at(e, t)}`;
}
function DR(t, e) {
  return Array.isArray(e) ? e.length === 0 ? I`true` : I`${t} not in ${e.map((r) => at(r, t))}` : I`${t} not in ${at(e, t)}`;
}
function MR(t) {
  return I`${t} is null`;
}
function VR(t) {
  return I`${t} is not null`;
}
function qR(t) {
  return I`exists ${t}`;
}
function FR(t) {
  return I`not exists ${t}`;
}
function zR(t, e, r) {
  return I`${t} between ${at(e, t)} and ${at(
    r,
    t
  )}`;
}
function UR(t, e, r) {
  return I`${t} not between ${at(
    e,
    t
  )} and ${at(r, t)}`;
}
function BR(t, e) {
  return I`${t} like ${e}`;
}
function KR(t, e) {
  return I`${t} not like ${e}`;
}
function QR(t, e) {
  return I`${t} ilike ${e}`;
}
function GR(t, e) {
  return I`${t} not ilike ${e}`;
}
function xR(t) {
  return I`${t} asc`;
}
function HR(t) {
  return I`${t} desc`;
}
var Od;
Od = V;
class Fc {
  constructor(e, r, n) {
    N(this, "referencedTableName");
    N(this, "fieldName");
    this.sourceTable = e, this.referencedTable = r, this.relationName = n, this.referencedTableName = r[Q.Symbol.Name];
  }
}
N(Fc, Od, "Relation");
var Rd;
Rd = V;
class Jp {
  constructor(e, r) {
    this.table = e, this.config = r;
  }
}
N(Jp, Rd, "Relations");
var Id, jd;
const Xs = class Xs extends (jd = Fc, Id = V, jd) {
  constructor(e, r, n, s) {
    super(e, r, n == null ? void 0 : n.relationName), this.config = n, this.isNullable = s;
  }
  withFieldName(e) {
    const r = new Xs(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    return r.fieldName = e, r;
  }
};
N(Xs, Id, "One");
let Or = Xs;
var Cd, Ad;
const Ys = class Ys extends (Ad = Fc, Cd = V, Ad) {
  constructor(e, r, n) {
    super(e, r, n == null ? void 0 : n.relationName), this.config = n;
  }
  withFieldName(e) {
    const r = new Ys(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    return r.fieldName = e, r;
  }
};
N(Ys, Cd, "Many");
let Hs = Ys;
function JR() {
  return {
    and: wo,
    between: zR,
    eq: Zn,
    exists: qR,
    gt: jR,
    gte: CR,
    ilike: QR,
    inArray: LR,
    isNull: MR,
    isNotNull: VR,
    like: BR,
    lt: AR,
    lte: kR,
    ne: OR,
    not: IR,
    notBetween: UR,
    notExists: FR,
    notLike: KR,
    notIlike: GR,
    notInArray: DR,
    or: RR,
    sql: I
  };
}
function WR() {
  return {
    sql: I,
    asc: xR,
    desc: HR
  };
}
function XR(t, e) {
  var a;
  Object.keys(t).length === 1 && "default" in t && !D(t.default, Q) && (t = t.default);
  const r = {}, n = {}, s = {};
  for (const [o, i] of Object.entries(t))
    if (D(i, Q)) {
      const c = Fn(i), d = n[c];
      r[c] = o, s[o] = {
        tsName: o,
        dbName: i[Q.Symbol.Name],
        schema: i[Q.Symbol.Schema],
        columns: i[Q.Symbol.Columns],
        relations: (d == null ? void 0 : d.relations) ?? {},
        primaryKey: (d == null ? void 0 : d.primaryKey) ?? []
      };
      for (const h of Object.values(
        i[Q.Symbol.Columns]
      ))
        h.primary && s[o].primaryKey.push(h);
      const l = (a = i[Q.Symbol.ExtraConfigBuilder]) == null ? void 0 : a.call(i, i[Q.Symbol.ExtraConfigColumns]);
      if (l)
        for (const h of Object.values(l))
          D(h, xp) && s[o].primaryKey.push(...h.columns);
    } else if (D(i, Jp)) {
      const c = Fn(i.table), d = r[c], l = i.config(
        e(i.table)
      );
      let h;
      for (const [g, p] of Object.entries(l))
        if (d) {
          const w = s[d];
          w.relations[g] = p;
        } else
          c in n || (n[c] = {
            relations: {},
            primaryKey: h
          }), n[c].relations[g] = p;
    }
  return { tables: s, tableNamesMap: r };
}
function YR(t) {
  return function(r, n) {
    return new Or(
      t,
      r,
      n,
      (n == null ? void 0 : n.fields.reduce((s, a) => s && a.notNull, !0)) ?? !1
    );
  };
}
function ZR(t) {
  return function(r, n) {
    return new Hs(t, r, n);
  };
}
function eI(t, e, r) {
  if (D(r, Or) && r.config)
    return {
      fields: r.config.fields,
      references: r.config.references
    };
  const n = e[Fn(r.referencedTable)];
  if (!n)
    throw new Error(
      `Table "${r.referencedTable[Q.Symbol.Name]}" not found in schema`
    );
  const s = t[n];
  if (!s)
    throw new Error(`Table "${n}" not found in schema`);
  const a = r.sourceTable, o = e[Fn(a)];
  if (!o)
    throw new Error(
      `Table "${a[Q.Symbol.Name]}" not found in schema`
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
      `There are multiple relations between "${n}" and "${r.sourceTable[Q.Symbol.Name]}". Please specify relation name`
    );
  if (i[0] && D(i[0], Or) && i[0].config)
    return {
      fields: i[0].config.references,
      references: i[0].config.fields
    };
  throw new Error(
    `There is not enough information to infer relation "${o}.${r.fieldName}"`
  );
}
function tI(t) {
  return {
    one: YR(t),
    many: ZR(t)
  };
}
function bo(t, e, r, n, s = (a) => a) {
  const a = {};
  for (const [
    o,
    i
  ] of n.entries())
    if (i.isJson) {
      const c = e.relations[i.tsKey], d = r[o], l = typeof d == "string" ? JSON.parse(d) : d;
      a[i.tsKey] = D(c, Or) ? l && bo(
        t,
        t[i.relationTableTsKey],
        l,
        i.selection,
        s
      ) : l.map(
        (h) => bo(
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
      D(d, Re) ? l = d : D(d, re) ? l = d.decoder : l = d.sql.decoder, a[i.tsKey] = c === null ? null : l.mapFromDriverValue(c);
    }
  return a;
}
var kd;
kd = V;
const Zs = class Zs {
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
    if (r === xe)
      return {
        ...e[xe],
        selectedFields: new Proxy(
          e[xe].selectedFields,
          this
        )
      };
    if (typeof r == "symbol")
      return e[r];
    const s = (D(e, He) ? e._.selectedFields : D(e, Cr) ? e[xe].selectedFields : e)[r];
    if (D(s, re.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !s.isSelectionField)
        return s.sql;
      const a = s.clone();
      return a.isSelectionField = !0, a;
    }
    if (D(s, re)) {
      if (this.config.sqlBehavior === "sql")
        return s;
      throw new Error(
        `You tried to reference "${r}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    return D(s, Re) ? this.config.alias ? new Proxy(
      s,
      new zn(
        new Proxy(
          s.table,
          new _a(this.config.alias, this.config.replaceOriginalName ?? !1)
        )
      )
    ) : s : typeof s != "object" || s === null ? s : new Proxy(s, new Zs(this.config));
  }
};
N(Zs, kd, "SelectionProxyHandler");
let Ye = Zs;
var Ld;
Ld = V;
class Wp {
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
    return new Xp(e, this);
  }
}
N(Wp, Ld, "SQLiteForeignKeyBuilder");
var Dd;
Dd = V;
class Xp {
  constructor(e, r) {
    N(this, "reference");
    N(this, "onUpdate");
    N(this, "onDelete");
    this.table = e, this.reference = r.reference, this.onUpdate = r._onUpdate, this.onDelete = r._onDelete;
  }
  getName() {
    const { name: e, columns: r, foreignColumns: n } = this.reference(), s = r.map((i) => i.name), a = n.map((i) => i.name), o = [
      this.table[sr],
      ...s,
      n[0].table[sr],
      ...a
    ];
    return e ?? `${o.join("_")}_fk`;
  }
}
N(Xp, Dd, "SQLiteForeignKey");
function rI(t, e) {
  return `${t[sr]}_${e.join("_")}_unique`;
}
var Md, Vd;
class ft extends (Vd = Dp, Md = V, Vd) {
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
      const c = new Wp(() => {
        const d = o();
        return { columns: [r], foreignColumns: [d] };
      });
      return i.onUpdate && c.onUpdate(i.onUpdate), i.onDelete && c.onDelete(i.onDelete), c.build(n);
    })(s, a));
  }
}
N(ft, Md, "SQLiteColumnBuilder");
var qd, Fd;
class et extends (Fd = Re, qd = V, Fd) {
  constructor(e, r) {
    r.uniqueName || (r.uniqueName = rI(e, [r.name])), super(e, r), this.table = e;
  }
}
N(et, qd, "SQLiteColumn");
var zd, Ud;
class Yp extends (Ud = ft, zd = V, Ud) {
  constructor(e) {
    super(e, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(e) {
    return new Zp(e, this.config);
  }
}
N(Yp, zd, "SQLiteBigIntBuilder");
var Bd, Kd;
class Zp extends (Kd = et, Bd = V, Kd) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const r = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return BigInt(r.toString("utf8"));
    }
    return BigInt(Gp.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(e.toString());
  }
}
N(Zp, Bd, "SQLiteBigInt");
var Qd, Gd;
class ey extends (Gd = ft, Qd = V, Gd) {
  constructor(e) {
    super(e, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(e) {
    return new ty(
      e,
      this.config
    );
  }
}
N(ey, Qd, "SQLiteBlobJsonBuilder");
var xd, Hd;
class ty extends (Hd = et, xd = V, Hd) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const r = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return JSON.parse(r.toString("utf8"));
    }
    return JSON.parse(Gp.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(JSON.stringify(e));
  }
}
N(ty, xd, "SQLiteBlobJson");
var Jd, Wd;
class ry extends (Wd = ft, Jd = V, Wd) {
  constructor(e) {
    super(e, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(e) {
    return new ny(e, this.config);
  }
}
N(ry, Jd, "SQLiteBlobBufferBuilder");
var Xd, Yd;
class ny extends (Yd = et, Xd = V, Yd) {
  mapFromDriverValue(e) {
    return Buffer.isBuffer(e) ? e : Buffer.from(e);
  }
  getSQLType() {
    return "blob";
  }
}
N(ny, Xd, "SQLiteBlobBuffer");
function nI(t, e) {
  const { name: r, config: n } = Yn(t, e);
  return (n == null ? void 0 : n.mode) === "json" ? new ey(r) : (n == null ? void 0 : n.mode) === "bigint" ? new Yp(r) : new ry(r);
}
var Zd, ef;
class sy extends (ef = ft, Zd = V, ef) {
  constructor(e, r, n) {
    super(e, "custom", "SQLiteCustomColumn"), this.config.fieldConfig = r, this.config.customTypeParams = n;
  }
  /** @internal */
  build(e) {
    return new ay(
      e,
      this.config
    );
  }
}
N(sy, Zd, "SQLiteCustomColumnBuilder");
var tf, rf;
class ay extends (rf = et, tf = V, rf) {
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
N(ay, tf, "SQLiteCustomColumn");
function sI(t) {
  return (e, r) => {
    const { name: n, config: s } = Yn(e, r);
    return new sy(
      n,
      s,
      t
    );
  };
}
var nf, sf;
class ba extends (sf = ft, nf = V, sf) {
  constructor(e, r, n) {
    super(e, r, n), this.config.autoIncrement = !1;
  }
  primaryKey(e) {
    return e != null && e.autoIncrement && (this.config.autoIncrement = !0), this.config.hasDefault = !0, super.primaryKey();
  }
}
N(ba, nf, "SQLiteBaseIntegerBuilder");
var af, of;
class Sa extends (of = et, af = V, of) {
  constructor() {
    super(...arguments);
    N(this, "autoIncrement", this.config.autoIncrement);
  }
  getSQLType() {
    return "integer";
  }
}
N(Sa, af, "SQLiteBaseInteger");
var cf, lf;
class oy extends (lf = ba, cf = V, lf) {
  constructor(e) {
    super(e, "number", "SQLiteInteger");
  }
  build(e) {
    return new iy(
      e,
      this.config
    );
  }
}
N(oy, cf, "SQLiteIntegerBuilder");
var uf, df;
class iy extends (df = Sa, uf = V, df) {
}
N(iy, uf, "SQLiteInteger");
var ff, hf;
class cy extends (hf = ba, ff = V, hf) {
  constructor(e, r) {
    super(e, "date", "SQLiteTimestamp"), this.config.mode = r;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(I`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(e) {
    return new ly(
      e,
      this.config
    );
  }
}
N(cy, ff, "SQLiteTimestampBuilder");
var mf, pf;
class ly extends (pf = Sa, mf = V, pf) {
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
N(ly, mf, "SQLiteTimestamp");
var yf, $f;
class uy extends ($f = ba, yf = V, $f) {
  constructor(e, r) {
    super(e, "boolean", "SQLiteBoolean"), this.config.mode = r;
  }
  build(e) {
    return new dy(
      e,
      this.config
    );
  }
}
N(uy, yf, "SQLiteBooleanBuilder");
var gf, vf;
class dy extends (vf = Sa, gf = V, vf) {
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
N(dy, gf, "SQLiteBoolean");
function zc(t, e) {
  const { name: r, config: n } = Yn(t, e);
  return (n == null ? void 0 : n.mode) === "timestamp" || (n == null ? void 0 : n.mode) === "timestamp_ms" ? new cy(r, n.mode) : (n == null ? void 0 : n.mode) === "boolean" ? new uy(r, n.mode) : new oy(r);
}
var _f, wf;
class fy extends (wf = ft, _f = V, wf) {
  constructor(e) {
    super(e, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(e) {
    return new hy(
      e,
      this.config
    );
  }
}
N(fy, _f, "SQLiteNumericBuilder");
var bf, Sf;
class hy extends (Sf = et, bf = V, Sf) {
  mapFromDriverValue(e) {
    return typeof e == "string" ? e : String(e);
  }
  getSQLType() {
    return "numeric";
  }
}
N(hy, bf, "SQLiteNumeric");
var Ef, Nf;
class my extends (Nf = ft, Ef = V, Nf) {
  constructor(e) {
    super(e, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(e) {
    return new py(
      e,
      this.config
    );
  }
}
N(my, Ef, "SQLiteNumericNumberBuilder");
var Pf, Tf;
class py extends (Tf = et, Pf = V, Tf) {
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
N(py, Pf, "SQLiteNumericNumber");
var Of, Rf;
class yy extends (Rf = ft, Of = V, Rf) {
  constructor(e) {
    super(e, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(e) {
    return new $y(
      e,
      this.config
    );
  }
}
N(yy, Of, "SQLiteNumericBigIntBuilder");
var If, jf;
class $y extends (jf = et, If = V, jf) {
  constructor() {
    super(...arguments);
    N(this, "mapFromDriverValue", BigInt);
    N(this, "mapToDriverValue", String);
  }
  getSQLType() {
    return "numeric";
  }
}
N($y, If, "SQLiteNumericBigInt");
function aI(t, e) {
  const { name: r, config: n } = Yn(t, e), s = n == null ? void 0 : n.mode;
  return s === "number" ? new my(r) : s === "bigint" ? new yy(r) : new fy(r);
}
var Cf, Af;
class gy extends (Af = ft, Cf = V, Af) {
  constructor(e) {
    super(e, "number", "SQLiteReal");
  }
  /** @internal */
  build(e) {
    return new vy(e, this.config);
  }
}
N(gy, Cf, "SQLiteRealBuilder");
var kf, Lf;
class vy extends (Lf = et, kf = V, Lf) {
  getSQLType() {
    return "real";
  }
}
N(vy, kf, "SQLiteReal");
function oI(t) {
  return new gy(t ?? "");
}
var Df, Mf;
class _y extends (Mf = ft, Df = V, Mf) {
  constructor(e, r) {
    super(e, "string", "SQLiteText"), this.config.enumValues = r.enum, this.config.length = r.length;
  }
  /** @internal */
  build(e) {
    return new wy(
      e,
      this.config
    );
  }
}
N(_y, Df, "SQLiteTextBuilder");
var Vf, qf;
class wy extends (qf = et, Vf = V, qf) {
  constructor(r, n) {
    super(r, n);
    N(this, "enumValues", this.config.enumValues);
    N(this, "length", this.config.length);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
N(wy, Vf, "SQLiteText");
var Ff, zf;
class by extends (zf = ft, Ff = V, zf) {
  constructor(e) {
    super(e, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(e) {
    return new Sy(
      e,
      this.config
    );
  }
}
N(by, Ff, "SQLiteTextJsonBuilder");
var Uf, Bf;
class Sy extends (Bf = et, Uf = V, Bf) {
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
N(Sy, Uf, "SQLiteTextJson");
function vt(t, e = {}) {
  const { name: r, config: n } = Yn(t, e);
  return n.mode === "json" ? new by(r) : new _y(r, n);
}
function iI() {
  return {
    blob: nI,
    customType: sI,
    integer: zc,
    numeric: aI,
    real: oI,
    text: vt
  };
}
const So = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var Kf, Qf, Gf, xf, Hf;
class ct extends (Hf = Q, xf = V, Gf = Q.Symbol.Columns, Qf = So, Kf = Q.Symbol.ExtraConfigBuilder, Hf) {
  constructor() {
    super(...arguments);
    /** @internal */
    N(this, Gf);
    /** @internal */
    N(this, Qf, []);
    /** @internal */
    N(this, Kf);
  }
}
N(ct, xf, "SQLiteTable"), /** @internal */
N(ct, "Symbol", Object.assign({}, Q.Symbol, {
  InlineForeignKeys: So
}));
function cI(t, e, r, n, s = t) {
  const a = new ct(t, n, s), o = typeof e == "function" ? e(iI()) : e, i = Object.fromEntries(
    Object.entries(o).map(([d, l]) => {
      const h = l;
      h.setName(d);
      const g = h.build(a);
      return a[So].push(...h.buildForeignKeys(g, a)), [d, g];
    })
  ), c = Object.assign(a, i);
  return c[Q.Symbol.Columns] = i, c[Q.Symbol.ExtraConfigColumns] = i, c;
}
const Ey = (t, e, r) => cI(t, e);
function _r(t) {
  return D(t, ct) ? [`${t[Q.Symbol.BaseName]}`] : D(t, He) ? t._.usedTables ?? [] : D(t, re) ? t.usedTables ?? [] : [];
}
var Jf, Wf;
class Eo extends (Wf = or, Jf = V, Wf) {
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
          this.config.table[Q.Symbol.Columns],
          new Ye({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
  returning(r = this.table[ct.Symbol.Columns]) {
    return this.config.returning = Tr(r), this;
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
        tables: _r(this.config.table)
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
N(Eo, Jf, "SQLiteDelete");
function lI(t) {
  return (t.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((r) => r.toLowerCase()).join("_");
}
function uI(t) {
  return (t.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((r, n, s) => {
    const a = s === 0 ? n.toLowerCase() : `${n[0].toUpperCase()}${n.slice(1)}`;
    return r + a;
  }, "");
}
function dI(t) {
  return t;
}
var Xf;
Xf = V;
class Ny {
  constructor(e) {
    /** @internal */
    N(this, "cache", {});
    N(this, "cachedTables", {});
    N(this, "convert");
    this.convert = e === "snake_case" ? lI : e === "camelCase" ? uI : dI;
  }
  getColumnCasing(e) {
    if (!e.keyAsName) return e.name;
    const r = e.table[Q.Symbol.Schema] ?? "public", n = e.table[Q.Symbol.OriginalName], s = `${r}.${n}.${e.name}`;
    return this.cache[s] || this.cacheTable(e.table), this.cache[s];
  }
  cacheTable(e) {
    const r = e[Q.Symbol.Schema] ?? "public", n = e[Q.Symbol.OriginalName], s = `${r}.${n}`;
    if (!this.cachedTables[s]) {
      for (const a of Object.values(e[Q.Symbol.Columns])) {
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
N(Ny, Xf, "CasingCache");
var Yf, Zf;
class Ea extends (Zf = Cr, Yf = V, Zf) {
}
N(Ea, Yf, "SQLiteViewBase");
var eh;
eh = V;
class Js {
  constructor(e) {
    /** @internal */
    N(this, "casing");
    this.casing = new Ny(e == null ? void 0 : e.casing);
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
    const r = [I`with `];
    for (const [n, s] of e.entries())
      r.push(I`${I.identifier(s._.alias)} as (${s._.sql})`), n < e.length - 1 && r.push(I`, `);
    return r.push(I` `), I.join(r);
  }
  buildDeleteQuery({
    table: e,
    where: r,
    returning: n,
    withList: s,
    limit: a,
    orderBy: o
  }) {
    const i = this.buildWithCTE(s), c = n ? I` returning ${this.buildSelection(n, { isSingleTable: !0 })}` : void 0, d = r ? I` where ${r}` : void 0, l = this.buildOrderBy(o), h = this.buildLimit(a);
    return I`${i}delete from ${e}${d}${c}${l}${h}`;
  }
  buildUpdateSet(e, r) {
    const n = e[Q.Symbol.Columns], s = Object.keys(n).filter(
      (o) => {
        var i;
        return r[o] !== void 0 || ((i = n[o]) == null ? void 0 : i.onUpdateFn) !== void 0;
      }
    ), a = s.length;
    return I.join(
      s.flatMap((o, i) => {
        var g;
        const c = n[o], d = (g = c.onUpdateFn) == null ? void 0 : g.call(c), l = r[o] ?? (D(d, re) ? d : I.param(d, c)), h = I`${I.identifier(this.casing.getColumnCasing(c))} = ${l}`;
        return i < a - 1 ? [h, I.raw(", ")] : [h];
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
    const l = this.buildWithCTE(a), h = this.buildUpdateSet(e, r), g = i && I.join([I.raw(" from "), this.buildFromTable(i)]), p = this.buildJoins(o), w = s ? I` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, $ = n ? I` where ${n}` : void 0, v = this.buildOrderBy(d), m = this.buildLimit(c);
    return I`${l}update ${e} set ${h}${g}${p}${$}${w}${v}${m}`;
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
      if (D(a, re.Aliased) && a.isSelectionField)
        i.push(I.identifier(a.fieldAlias));
      else if (D(a, re.Aliased) || D(a, re)) {
        const c = D(a, re.Aliased) ? a.sql : a;
        r ? i.push(
          new re(
            c.queryChunks.map((d) => D(d, Re) ? I.identifier(this.casing.getColumnCasing(d)) : d)
          )
        ) : i.push(c), D(a, re.Aliased) && i.push(I` as ${I.identifier(a.fieldAlias)}`);
      } else if (D(a, Re)) {
        const c = a.table[Q.Symbol.Name];
        a.columnType === "SQLiteNumericBigInt" ? r ? i.push(
          I`cast(${I.identifier(this.casing.getColumnCasing(a))} as text)`
        ) : i.push(
          I`cast(${I.identifier(c)}.${I.identifier(this.casing.getColumnCasing(a))} as text)`
        ) : r ? i.push(I.identifier(this.casing.getColumnCasing(a))) : i.push(
          I`${I.identifier(c)}.${I.identifier(this.casing.getColumnCasing(a))}`
        );
      } else if (D(a, He)) {
        const c = Object.entries(a._.selectedFields);
        if (c.length === 1) {
          const d = c[0][1], l = D(d, re) ? d.decoder : D(d, Re) ? { mapFromDriverValue: (h) => d.mapFromDriverValue(h) } : d.sql.decoder;
          l && (a._.sql.decoder = l);
        }
        i.push(a);
      }
      return o < n - 1 && i.push(I`, `), i;
    });
    return I.join(s);
  }
  buildJoins(e) {
    if (!e || e.length === 0)
      return;
    const r = [];
    if (e)
      for (const [n, s] of e.entries()) {
        n === 0 && r.push(I` `);
        const a = s.table, o = s.on ? I` on ${s.on}` : void 0;
        if (D(a, ct)) {
          const i = a[ct.Symbol.Name], c = a[ct.Symbol.Schema], d = a[ct.Symbol.OriginalName], l = i === d ? void 0 : s.alias;
          r.push(
            I`${I.raw(s.joinType)} join ${c ? I`${I.identifier(c)}.` : void 0}${I.identifier(
              d
            )}${l && I` ${I.identifier(l)}`}${o}`
          );
        } else
          r.push(
            I`${I.raw(s.joinType)} join ${a}${o}`
          );
        n < e.length - 1 && r.push(I` `);
      }
    return I.join(r);
  }
  buildLimit(e) {
    return typeof e == "object" || typeof e == "number" && e >= 0 ? I` limit ${e}` : void 0;
  }
  buildOrderBy(e) {
    const r = [];
    if (e)
      for (const [n, s] of e.entries())
        r.push(s), n < e.length - 1 && r.push(I`, `);
    return r.length > 0 ? I` order by ${I.join(r)}` : void 0;
  }
  buildFromTable(e) {
    return D(e, Q) && e[Q.Symbol.IsAlias] ? I`${I`${I.identifier(e[Q.Symbol.Schema] ?? "")}.`.if(e[Q.Symbol.Schema])}${I.identifier(
      e[Q.Symbol.OriginalName]
    )} ${I.identifier(e[Q.Symbol.Name])}` : e;
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
    distinct: g,
    setOperators: p
  }) {
    const w = n ?? Tr(r);
    for (const Z of w)
      if (D(Z.field, Re) && Gr(Z.field.table) !== (D(o, He) ? o._.alias : D(o, Ea) ? o[xe].name : D(o, re) ? void 0 : Gr(o)) && !((K) => i == null ? void 0 : i.some(
        ({ alias: pe }) => pe === (K[Q.Symbol.IsAlias] ? Gr(K) : K[Q.Symbol.BaseName])
      ))(Z.field.table)) {
        const K = Gr(Z.field.table);
        throw new Error(
          `Your "${Z.path.join(
            "->"
          )}" field references a column "${K}"."${Z.field.name}", but the table "${K}" is not part of the query! Did you forget to join it?`
        );
      }
    const $ = !i || i.length === 0, v = this.buildWithCTE(e), m = g ? I` distinct` : void 0, b = this.buildSelection(w, { isSingleTable: $ }), T = this.buildFromTable(o), R = this.buildJoins(i), j = s ? I` where ${s}` : void 0, U = a ? I` having ${a}` : void 0, M = [];
    if (d)
      for (const [Z, K] of d.entries())
        M.push(K), Z < d.length - 1 && M.push(I`, `);
    const te = M.length > 0 ? I` group by ${I.join(M)}` : void 0, fe = this.buildOrderBy(c), $e = this.buildLimit(l), x = h ? I` offset ${h}` : void 0, X = I`${v}select${m} ${b} from ${T}${R}${j}${te}${U}${fe}${$e}${x}`;
    return p.length > 0 ? this.buildSetOperations(X, p) : X;
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
    const c = I`${e.getSQL()} `, d = I`${s.getSQL()}`;
    let l;
    if (o && o.length > 0) {
      const w = [];
      for (const $ of o)
        if (D($, et))
          w.push(I.identifier($.name));
        else if (D($, re)) {
          for (let v = 0; v < $.queryChunks.length; v++) {
            const m = $.queryChunks[v];
            D(m, et) && ($.queryChunks[v] = I.identifier(
              this.casing.getColumnCasing(m)
            ));
          }
          w.push(I`${$}`);
        } else
          w.push(I`${$}`);
      l = I` order by ${I.join(w, I`, `)}`;
    }
    const h = typeof a == "object" || typeof a == "number" && a >= 0 ? I` limit ${a}` : void 0, g = I.raw(`${r} ${n ? "all " : ""}`), p = i ? I` offset ${i}` : void 0;
    return I`${c}${g}${d}${l}${h}${p}`;
  }
  buildInsertQuery({
    table: e,
    values: r,
    onConflict: n,
    returning: s,
    withList: a,
    select: o
  }) {
    const i = [], c = e[Q.Symbol.Columns], d = Object.entries(c).filter(
      ([$, v]) => !v.shouldDisableInsert()
    ), l = d.map(([, $]) => I.identifier(this.casing.getColumnCasing($)));
    if (o) {
      const $ = r;
      D($, re) ? i.push($) : i.push($.getSQL());
    } else {
      const $ = r;
      i.push(I.raw("values "));
      for (const [v, m] of $.entries()) {
        const b = [];
        for (const [T, R] of d) {
          const j = m[T];
          if (j === void 0 || D(j, Ut) && j.value === void 0) {
            let U;
            if (R.default !== null && R.default !== void 0)
              U = D(R.default, re) ? R.default : I.param(R.default, R);
            else if (R.defaultFn !== void 0) {
              const M = R.defaultFn();
              U = D(M, re) ? M : I.param(M, R);
            } else if (!R.default && R.onUpdateFn !== void 0) {
              const M = R.onUpdateFn();
              U = D(M, re) ? M : I.param(M, R);
            } else
              U = I`null`;
            b.push(U);
          } else
            b.push(j);
        }
        i.push(b), v < $.length - 1 && i.push(I`, `);
      }
    }
    const h = this.buildWithCTE(a), g = I.join(i), p = s ? I` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, w = n != null && n.length ? I.join(n) : void 0;
    return I`${h}insert into ${e} ${l} ${g}${w}${p}`;
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
    let l = [], h, g, p = [], w;
    const $ = [];
    if (o === !0)
      l = Object.entries(a.columns).map(([b, T]) => ({
        dbKey: T.name,
        tsKey: b,
        field: At(T, i),
        relationTableTsKey: void 0,
        isJson: !1,
        selection: []
      }));
    else {
      const m = Object.fromEntries(
        Object.entries(a.columns).map(([M, te]) => [
          M,
          At(te, i)
        ])
      );
      if (o.where) {
        const M = typeof o.where == "function" ? o.where(m, JR()) : o.where;
        w = M && xs(M, i);
      }
      const b = [];
      let T = [];
      if (o.columns) {
        let M = !1;
        for (const [te, fe] of Object.entries(o.columns))
          fe !== void 0 && te in a.columns && (!M && fe === !0 && (M = !0), T.push(te));
        T.length > 0 && (T = M ? T.filter((te) => {
          var fe;
          return ((fe = o.columns) == null ? void 0 : fe[te]) === !0;
        }) : Object.keys(a.columns).filter(
          (te) => !T.includes(te)
        ));
      } else
        T = Object.keys(a.columns);
      for (const M of T) {
        const te = a.columns[M];
        b.push({ tsKey: M, value: te });
      }
      let R = [];
      o.with && (R = Object.entries(o.with).filter(
        (M) => !!M[1]
      ).map(([M, te]) => ({
        tsKey: M,
        queryConfig: te,
        relation: a.relations[M]
      })));
      let j;
      if (o.extras) {
        j = typeof o.extras == "function" ? o.extras(m, { sql: I }) : o.extras;
        for (const [M, te] of Object.entries(j))
          b.push({
            tsKey: M,
            value: Fp(te, i)
          });
      }
      for (const { tsKey: M, value: te } of b)
        l.push({
          dbKey: D(te, re.Aliased) ? te.fieldAlias : a.columns[M].name,
          tsKey: M,
          field: D(te, Re) ? At(te, i) : te,
          relationTableTsKey: void 0,
          isJson: !1,
          selection: []
        });
      let U = typeof o.orderBy == "function" ? o.orderBy(m, WR()) : o.orderBy ?? [];
      Array.isArray(U) || (U = [U]), p = U.map((M) => D(M, Re) ? At(M, i) : xs(M, i)), h = o.limit, g = o.offset;
      for (const {
        tsKey: M,
        queryConfig: te,
        relation: fe
      } of R) {
        const $e = eI(
          r,
          n,
          fe
        ), x = Fn(fe.referencedTable), X = n[x], Z = `${i}_${M}`, K = wo(
          ...$e.fields.map(
            (F, q) => Zn(
              At(
                $e.references[q],
                Z
              ),
              At(F, i)
            )
          )
        ), pe = this.buildRelationalQuery({
          fullSchema: e,
          schema: r,
          tableNamesMap: n,
          table: e[X],
          tableConfig: r[X],
          queryConfig: D(fe, Or) ? te === !0 ? { limit: 1 } : { ...te, limit: 1 } : te,
          tableAlias: Z,
          joinOn: K,
          nestedQueryRelation: fe
        }), Ee = I`(${pe.sql})`.as(M);
        l.push({
          dbKey: M,
          tsKey: M,
          field: Ee,
          relationTableTsKey: X,
          isJson: !0,
          selection: pe.selection
        });
      }
    }
    if (l.length === 0)
      throw new wa({
        message: `No fields selected for table "${a.tsName}" ("${i}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    let v;
    if (w = wo(d, w), c) {
      let m = I`json_array(${I.join(
        l.map(
          ({ field: R }) => D(R, et) ? I.identifier(this.casing.getColumnCasing(R)) : D(R, re.Aliased) ? R.sql : R
        ),
        I`, `
      )})`;
      D(c, Hs) && (m = I`coalesce(json_group_array(${m}), json_array())`);
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
      h !== void 0 || g !== void 0 || p.length > 0 ? (v = this.buildSelectQuery({
        table: Wa(s, i),
        fields: {},
        fieldsFlat: [
          {
            path: [],
            field: I.raw("*")
          }
        ],
        where: w,
        limit: h,
        offset: g,
        orderBy: p,
        setOperators: []
      }), w = void 0, h = void 0, g = void 0, p = void 0) : v = Wa(s, i), v = this.buildSelectQuery({
        table: D(v, ct) ? v : new He(v, {}, i),
        fields: {},
        fieldsFlat: b.map(({ field: R }) => ({
          path: [],
          field: D(R, Re) ? At(R, i) : R
        })),
        joins: $,
        where: w,
        limit: h,
        offset: g,
        orderBy: p,
        setOperators: []
      });
    } else
      v = this.buildSelectQuery({
        table: Wa(s, i),
        fields: {},
        fieldsFlat: l.map(({ field: m }) => ({
          path: [],
          field: D(m, Re) ? At(m, i) : m
        })),
        joins: $,
        where: w,
        limit: h,
        offset: g,
        orderBy: p,
        setOperators: []
      });
    return {
      tableTsKey: a.tsName,
      sql: v,
      selection: l
    };
  }
}
N(Js, eh, "SQLiteDialect");
var th, rh;
class Uc extends (rh = Js, th = V, rh) {
  migrate(e, r, n) {
    const s = n === void 0 || typeof n == "string" ? "__drizzle_migrations" : n.migrationsTable ?? "__drizzle_migrations", a = I`
			CREATE TABLE IF NOT EXISTS ${I.identifier(s)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    r.run(a);
    const i = r.values(
      I`SELECT id, hash, created_at FROM ${I.identifier(s)} ORDER BY created_at DESC LIMIT 1`
    )[0] ?? void 0;
    r.run(I`BEGIN`);
    try {
      for (const c of e)
        if (!i || Number(i[2]) < c.folderMillis) {
          for (const d of c.sql)
            r.run(I.raw(d));
          r.run(
            I`INSERT INTO ${I.identifier(
              s
            )} ("hash", "created_at") VALUES(${c.hash}, ${c.folderMillis})`
          );
        }
      r.run(I`COMMIT`);
    } catch (c) {
      throw r.run(I`ROLLBACK`), c;
    }
  }
}
N(Uc, th, "SQLiteSyncDialect");
var nh;
nh = V;
class Py {
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
N(Py, nh, "TypedQueryBuilder");
var sh;
sh = V;
class Dt {
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
    return this.fields ? n = this.fields : D(e, He) ? n = Object.fromEntries(
      Object.keys(e._.selectedFields).map((s) => [s, e[s]])
    ) : D(e, Ea) ? n = e[xe].selectedFields : D(e, re) ? n = {} : n = PR(e), new Bc({
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
N(Dt, sh, "SQLiteSelectBuilder");
var ah, oh;
class Ty extends (oh = Py, ah = V, oh) {
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
    }, this.tableName = vo(r), this.joinsNotNullableMap = typeof this.tableName == "string" ? { [this.tableName]: !0 } : {};
    for (const d of _r(r)) this.usedTables.add(d);
  }
  /** @internal */
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(r) {
    return (n, s) => {
      var i;
      const a = this.tableName, o = vo(n);
      for (const c of _r(n)) this.usedTables.add(c);
      if (typeof o == "string" && ((i = this.config.joins) != null && i.some((c) => c.alias === o)))
        throw new Error(`Alias "${o}" is already used in this query`);
      if (!this.isPartialSelect && (Object.keys(this.joinsNotNullableMap).length === 1 && typeof a == "string" && (this.config.fields = {
        [a]: this.config.fields
      }), typeof o == "string" && !D(n, re))) {
        const c = D(n, He) ? n._.selectedFields : D(n, Cr) ? n[xe].selectedFields : n[Q.Symbol.Columns];
        this.config.fields[o] = c;
      }
      if (typeof s == "function" && (s = s(
        new Proxy(
          this.config.fields,
          new Ye({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
      const a = typeof s == "function" ? s(fI()) : s;
      if (!qc(this.getSelectedFields(), a.getSelectedFields()))
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
        new Ye({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
        new Ye({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.having = r, this;
  }
  groupBy(...r) {
    if (typeof r[0] == "function") {
      const n = r[0](
        new Proxy(
          this.config.fields,
          new Ye({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
          new Ye({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
    if (n.push(..._r(this.config.table)), this.config.joins)
      for (const s of this.config.joins) n.push(..._r(s.table));
    return new Proxy(
      new He(this.getSQL(), this.config.fields, r, !1, [...new Set(n)]),
      new Ye({ alias: r, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new Ye({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
}
N(Ty, ah, "SQLiteSelectQueryBuilder");
var ih, ch;
class Bc extends (ch = Ty, ih = V, ch) {
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
    const n = Tr(this.config.fields), s = this.session[r ? "prepareOneTimeQuery" : "prepareQuery"](
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
N(Bc, ih, "SQLiteSelect");
NR(Bc, [or]);
function Na(t, e) {
  return (r, n, ...s) => {
    const a = [n, ...s].map((o) => ({
      type: t,
      isAll: e,
      rightSelect: o
    }));
    for (const o of a)
      if (!qc(r.getSelectedFields(), o.rightSelect.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
    return r.addSetOperators(a);
  };
}
const fI = () => ({
  union: hI,
  unionAll: mI,
  intersect: pI,
  except: yI
}), hI = Na("union", !1), mI = Na("union", !0), pI = Na("intersect", !1), yI = Na("except", !1);
var lh;
lh = V;
class Kc {
  constructor(e) {
    N(this, "dialect");
    N(this, "dialectConfig");
    N(this, "$with", (e, r) => {
      const n = this;
      return { as: (a) => (typeof a == "function" && (a = a(n)), new Proxy(
        new Vc(
          a.getSQL(),
          r ?? ("getSelectedFields" in a ? a.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new Ye({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      )) };
    });
    this.dialect = D(e, Js) ? e : void 0, this.dialectConfig = D(e, Js) ? void 0 : e;
  }
  with(...e) {
    const r = this;
    function n(a) {
      return new Dt({
        fields: a ?? void 0,
        session: void 0,
        dialect: r.getDialect(),
        withList: e
      });
    }
    function s(a) {
      return new Dt({
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
    return new Dt({ fields: e ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(e) {
    return new Dt({
      fields: e ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: !0
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    return this.dialect || (this.dialect = new Uc(this.dialectConfig)), this.dialect;
  }
}
N(Kc, lh, "SQLiteQueryBuilder");
var uh;
uh = V;
class No {
  constructor(e, r, n, s) {
    this.table = e, this.session = r, this.dialect = n, this.withList = s;
  }
  values(e) {
    if (e = Array.isArray(e) ? e : [e], e.length === 0)
      throw new Error("values() must be called with at least one value");
    const r = e.map((n) => {
      const s = {}, a = this.table[Q.Symbol.Columns];
      for (const o of Object.keys(n)) {
        const i = n[o];
        s[o] = D(i, re) ? i : new Ut(i, a[o]);
      }
      return s;
    });
    return new Po(this.table, r, this.session, this.dialect, this.withList);
  }
  select(e) {
    const r = typeof e == "function" ? e(new Kc()) : e;
    if (!D(r, re) && !qc(this.table[go], r._.selectedFields))
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    return new Po(this.table, r, this.session, this.dialect, this.withList, !0);
  }
}
N(No, uh, "SQLiteInsertBuilder");
var dh, fh;
class Po extends (fh = or, dh = V, fh) {
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
  returning(r = this.config.table[ct.Symbol.Columns]) {
    return this.config.returning = Tr(r), this;
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
      this.config.onConflict.push(I` on conflict do nothing`);
    else {
      const n = Array.isArray(r.target) ? I`${r.target}` : I`${[r.target]}`, s = r.where ? I` where ${r.where}` : I``;
      this.config.onConflict.push(I` on conflict ${n} do nothing${s}`);
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
    const n = r.where ? I` where ${r.where}` : void 0, s = r.targetWhere ? I` where ${r.targetWhere}` : void 0, a = r.setWhere ? I` where ${r.setWhere}` : void 0, o = Array.isArray(r.target) ? I`${r.target}` : I`${[r.target]}`, i = this.dialect.buildUpdateSet(this.config.table, Qp(this.config.table, r.set));
    return this.config.onConflict.push(
      I` on conflict ${o}${s} do update set ${i}${n}${a}`
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
        tables: _r(this.config.table)
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
N(Po, dh, "SQLiteInsert");
var hh;
hh = V;
class To {
  constructor(e, r, n, s) {
    this.table = e, this.session = r, this.dialect = n, this.withList = s;
  }
  set(e) {
    return new Oy(
      this.table,
      Qp(this.table, e),
      this.session,
      this.dialect,
      this.withList
    );
  }
}
N(To, hh, "SQLiteUpdateBuilder");
var mh, ph;
class Oy extends (ph = or, mh = V, ph) {
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
      const a = vo(n);
      if (typeof a == "string" && this.config.joins.some((o) => o.alias === a))
        throw new Error(`Alias "${a}" is already used in this query`);
      if (typeof s == "function") {
        const o = this.config.from ? D(n, ct) ? n[Q.Symbol.Columns] : D(n, He) ? n._.selectedFields : D(n, Ea) ? n[xe].selectedFields : void 0 : void 0;
        s = s(
          new Proxy(
            this.config.table[Q.Symbol.Columns],
            new Ye({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          o && new Proxy(
            o,
            new Ye({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
          this.config.table[Q.Symbol.Columns],
          new Ye({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
  returning(r = this.config.table[ct.Symbol.Columns]) {
    return this.config.returning = Tr(r), this;
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
        tables: _r(this.config.table)
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
N(Oy, mh, "SQLiteUpdate");
var yh, $h, gh;
const Mn = class Mn extends (gh = re, $h = V, yh = Symbol.toStringTag, gh) {
  constructor(r) {
    super(Mn.buildEmbeddedCount(r.source, r.filters).queryChunks);
    N(this, "sql");
    N(this, yh, "SQLiteCountBuilderAsync");
    N(this, "session");
    this.params = r, this.session = r.session, this.sql = Mn.buildCount(
      r.source,
      r.filters
    );
  }
  static buildEmbeddedCount(r, n) {
    return I`(select count(*) from ${r}${I.raw(" where ").if(n)}${n})`;
  }
  static buildCount(r, n) {
    return I`select count(*) from ${r}${I.raw(" where ").if(n)}${n}`;
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
N(Mn, $h, "SQLiteCountBuilderAsync");
let Oo = Mn;
var vh;
vh = V;
class Ry {
  constructor(e, r, n, s, a, o, i, c) {
    this.mode = e, this.fullSchema = r, this.schema = n, this.tableNamesMap = s, this.table = a, this.tableConfig = o, this.dialect = i, this.session = c;
  }
  findMany(e) {
    return this.mode === "sync" ? new Ro(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    ) : new Ws(
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
    return this.mode === "sync" ? new Ro(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    ) : new Ws(
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
N(Ry, vh, "SQLiteAsyncRelationalQueryBuilder");
var _h, wh;
class Ws extends (wh = or, _h = V, wh) {
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
          (c) => bo(this.schema, this.tableConfig, c, n.selection, o)
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
N(Ws, _h, "SQLiteAsyncRelationalQuery");
var bh, Sh;
class Ro extends (Sh = Ws, bh = V, Sh) {
  sync() {
    return this.executeRaw();
  }
}
N(Ro, bh, "SQLiteSyncRelationalQuery");
var Eh, Nh;
class Pn extends (Nh = or, Eh = V, Nh) {
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
N(Pn, Eh, "SQLiteRaw");
var Ph;
Ph = V;
class Qc {
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
      return { as: (a) => (typeof a == "function" && (a = a(new Kc(n.dialect))), new Proxy(
        new Vc(
          a.getSQL(),
          r ?? ("getSelectedFields" in a ? a.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new Ye({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
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
        a[o] = new Ry(
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
    return new Oo({ source: e, filters: r, session: this.session });
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
      return new Dt({
        fields: c ?? void 0,
        session: r.session,
        dialect: r.dialect,
        withList: e
      });
    }
    function s(c) {
      return new Dt({
        fields: c ?? void 0,
        session: r.session,
        dialect: r.dialect,
        withList: e,
        distinct: !0
      });
    }
    function a(c) {
      return new To(c, r.session, r.dialect, e);
    }
    function o(c) {
      return new No(c, r.session, r.dialect, e);
    }
    function i(c) {
      return new Eo(c, r.session, r.dialect, e);
    }
    return { select: n, selectDistinct: s, update: a, insert: o, delete: i };
  }
  select(e) {
    return new Dt({ fields: e ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(e) {
    return new Dt({
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
    return new To(e, this.session, this.dialect);
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
    return new No(e, this.session, this.dialect);
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
    return new Eo(e, this.session, this.dialect);
  }
  run(e) {
    const r = typeof e == "string" ? I.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Pn(
      async () => this.session.run(r),
      () => r,
      "run",
      this.dialect,
      this.session.extractRawRunValueFromBatchResult.bind(this.session)
    ) : this.session.run(r);
  }
  all(e) {
    const r = typeof e == "string" ? I.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Pn(
      async () => this.session.all(r),
      () => r,
      "all",
      this.dialect,
      this.session.extractRawAllValueFromBatchResult.bind(this.session)
    ) : this.session.all(r);
  }
  get(e) {
    const r = typeof e == "string" ? I.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Pn(
      async () => this.session.get(r),
      () => r,
      "get",
      this.dialect,
      this.session.extractRawGetValueFromBatchResult.bind(this.session)
    ) : this.session.get(r);
  }
  values(e) {
    const r = typeof e == "string" ? I.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Pn(
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
N(Qc, Ph, "BaseSQLiteDatabase");
var Th;
Th = V;
class Iy {
}
N(Iy, Th, "Cache");
var Oh, Rh;
class Gc extends (Rh = Iy, Oh = V, Rh) {
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
N(Gc, Oh, "NoopCache");
async function Mu(t, e) {
  const r = `${t}-${JSON.stringify(e)}`, s = new TextEncoder().encode(r), a = await crypto.subtle.digest("SHA-256", s);
  return [...new Uint8Array(a)].map((c) => c.toString(16).padStart(2, "0")).join("");
}
var Ih, jh;
class jy extends (jh = or, Ih = V, jh) {
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
N(jy, Ih, "ExecuteResultSync");
var Ch;
Ch = V;
class Cy {
  constructor(e, r, n, s, a, o) {
    /** @internal */
    N(this, "joinsNotNullableMap");
    var i;
    this.mode = e, this.executeMethod = r, this.query = n, this.cache = s, this.queryMetadata = a, this.cacheConfig = o, s && s.strategy() === "all" && o === void 0 && (this.cacheConfig = { enable: !0, autoInvalidate: !0 }), (i = this.cacheConfig) != null && i.enable || (this.cacheConfig = void 0);
  }
  /** @internal */
  async queryWithCache(e, r, n) {
    if (this.cache === void 0 || D(this.cache, Gc) || this.queryMetadata === void 0)
      try {
        return await n();
      } catch (s) {
        throw new Xt(e, r, s);
      }
    if (this.cacheConfig && !this.cacheConfig.enable)
      try {
        return await n();
      } catch (s) {
        throw new Xt(e, r, s);
      }
    if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0)
      try {
        const [s] = await Promise.all([
          n(),
          this.cache.onMutate({ tables: this.queryMetadata.tables })
        ]);
        return s;
      } catch (s) {
        throw new Xt(e, r, s);
      }
    if (!this.cacheConfig)
      try {
        return await n();
      } catch (s) {
        throw new Xt(e, r, s);
      }
    if (this.queryMetadata.type === "select") {
      const s = await this.cache.get(
        this.cacheConfig.tag ?? await Mu(e, r),
        this.queryMetadata.tables,
        this.cacheConfig.tag !== void 0,
        this.cacheConfig.autoInvalidate
      );
      if (s === void 0) {
        let a;
        try {
          a = await n();
        } catch (o) {
          throw new Xt(e, r, o);
        }
        return await this.cache.put(
          this.cacheConfig.tag ?? await Mu(e, r),
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
      throw new Xt(e, r, s);
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
    return this.mode === "async" ? this[this.executeMethod](e) : new jy(() => this[this.executeMethod](e));
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
N(Cy, Ch, "PreparedQuery");
var Ah;
Ah = V;
class Ay {
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
      throw new wa({ cause: n, message: `Failed to run the query '${r.sql}'` });
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
N(Ay, Ah, "SQLiteSession");
var kh, Lh;
class ky extends (Lh = Qc, kh = V, Lh) {
  constructor(e, r, n, s, a = 0) {
    super(e, r, n, s), this.schema = s, this.nestedIndex = a;
  }
  rollback() {
    throw new zp();
  }
}
N(ky, kh, "SQLiteTransaction");
var Dh, Mh;
class Ly extends (Mh = Ay, Dh = V, Mh) {
  constructor(r, n, s, a = {}) {
    super(n);
    N(this, "logger");
    N(this, "cache");
    this.client = r, this.schema = s, this.logger = a.logger ?? new Kp(), this.cache = a.cache ?? new Gc();
  }
  prepareQuery(r, n, s, a, o, i, c) {
    const d = this.client.prepare(r.sql);
    return new Dy(
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
    const s = new Io("sync", this.dialect, this, this.schema);
    return this.client.transaction(r)[n.behavior ?? "deferred"](s);
  }
}
N(Ly, Dh, "BetterSQLiteSession");
var Vh, qh;
const ea = class ea extends (qh = ky, Vh = V, qh) {
  transaction(e) {
    const r = `sp${this.nestedIndex}`, n = new ea("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(I.raw(`savepoint ${r}`));
    try {
      const s = e(n);
      return this.session.run(I.raw(`release savepoint ${r}`)), s;
    } catch (s) {
      throw this.session.run(I.raw(`rollback to savepoint ${r}`)), s;
    }
  }
};
N(ea, Vh, "BetterSQLiteTransaction");
let Io = ea;
var Fh, zh;
class Dy extends (zh = Cy, Fh = V, zh) {
  constructor(e, r, n, s, a, o, i, c, d, l) {
    super("sync", c, r, s, a, o), this.stmt = e, this.logger = n, this.fields = i, this._isResponseInArrayMode = d, this.customResultMapper = l;
  }
  run(e) {
    const r = ws(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, r), this.stmt.run(...r);
  }
  all(e) {
    const { fields: r, joinsNotNullableMap: n, query: s, logger: a, stmt: o, customResultMapper: i } = this;
    if (!r && !i) {
      const d = ws(s.params, e ?? {});
      return a.logQuery(s.sql, d), o.all(...d);
    }
    const c = this.values(e);
    return i ? i(c) : c.map((d) => ku(r, d, n));
  }
  get(e) {
    const r = ws(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, r);
    const { fields: n, stmt: s, joinsNotNullableMap: a, customResultMapper: o } = this;
    if (!n && !o)
      return s.get(...r);
    const i = s.raw().get(...r);
    if (i)
      return o ? o([i]) : ku(n, i, a);
  }
  values(e) {
    const r = ws(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, r), this.stmt.raw().all(...r);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
N(Dy, Fh, "BetterSQLitePreparedQuery");
var Uh, Bh;
class My extends (Bh = Qc, Uh = V, Bh) {
}
N(My, Uh, "BetterSQLite3Database");
function zr(t, e = {}) {
  const r = new Uc({ casing: e.casing });
  let n;
  e.logger === !0 ? n = new Bp() : e.logger !== !1 && (n = e.logger);
  let s;
  if (e.schema) {
    const i = XR(
      e.schema,
      tI
    );
    s = {
      fullSchema: e.schema,
      schema: i.tables,
      tableNamesMap: i.tableNamesMap
    };
  }
  const a = new Ly(t, r, s, { logger: n }), o = new My("sync", r, a, s);
  return o.$client = t, o;
}
function jo(...t) {
  if (t[0] === void 0 || typeof t[0] == "string") {
    const e = t[0] === void 0 ? new bn() : new bn(t[0]);
    return zr(e, t[1]);
  }
  if (TR(t[0])) {
    const { connection: e, client: r, ...n } = t[0];
    if (r) return zr(r, n);
    if (typeof e == "object") {
      const { source: a, ...o } = e, i = new bn(a, o);
      return zr(i, n);
    }
    const s = new bn(e);
    return zr(s, n);
  }
  return zr(t[0], t[1]);
}
((t) => {
  function e(r) {
    return zr({}, r);
  }
  t.mock = e;
})(jo || (jo = {}));
const Rr = Ey("songs", {
  id: zc("id").primaryKey({ autoIncrement: !0 }),
  title: vt("title").notNull(),
  author: vt("author").notNull().default(""),
  language: vt("language").notNull().default("es"),
  slides: vt("slides").notNull().default("[]"),
  createdAt: vt("created_at").notNull().default(I`(datetime('now'))`),
  updatedAt: vt("updated_at").notNull().default(I`(datetime('now'))`)
}), Un = Ey("media", {
  id: zc("id").primaryKey({ autoIncrement: !0 }),
  type: vt("type").notNull(),
  title: vt("title").notNull(),
  filePath: vt("file_path").notNull(),
  createdAt: vt("created_at").notNull().default(I`(datetime('now'))`)
});
let bs = null;
function Ar() {
  if (bs) return bs;
  const t = ne.join(Ft.getPath("userData"), "seedscreen.db"), e = new bn(t);
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
	`), bs = jo(e), bs;
}
function xc(t) {
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
function nn() {
  return Ar().select().from(Rr).orderBy(Rr.title).all().map(xc);
}
function Vy(t) {
  const e = Ar().insert(Rr).values({
    title: t.title.trim(),
    author: (t.author || "").trim(),
    language: t.language || "es",
    slides: JSON.stringify(t.slides || [])
  }).returning().get();
  return xc(e);
}
function $I(t, e) {
  const r = Ar().update(Rr).set({
    title: e.title.trim(),
    author: (e.author || "").trim(),
    language: e.language || "es",
    slides: JSON.stringify(e.slides || []),
    updatedAt: I`(datetime('now'))`
  }).where(Zn(Rr.id, t)).returning().get();
  return r ? xc(r) : null;
}
function gI(t) {
  return Ar().delete(Rr).where(Zn(Rr.id, t)).run(), !0;
}
function vI(t) {
  const e = (s, a) => `${s.trim().toLowerCase()}::${a.trim().toLowerCase()}`, r = new Set(nn().map((s) => e(s.title, s.author)));
  let n = 0;
  for (const s of t ?? [])
    s != null && s.title && (r.has(e(s.title, s.author || "")) || (Vy({
      title: s.title,
      author: s.author || "",
      language: s.language || "es",
      slides: s.slides || []
    }), r.add(e(s.title, s.author || "")), n++));
  return { added: n, total: (t == null ? void 0 : t.length) ?? 0 };
}
function Hc(t) {
  return {
    id: t.id,
    type: t.type === "video" ? "video" : "image",
    title: t.title,
    filePath: t.filePath,
    createdAt: t.createdAt
  };
}
function Jc() {
  return Ar().select().from(Un).orderBy(Un.title).all().map(Hc);
}
function _I(t) {
  const e = Ar().insert(Un).values({ type: t.type, title: t.title.trim(), filePath: t.filePath }).returning().get();
  return Hc(e);
}
function wI(t) {
  const e = Ar().delete(Un).where(Zn(Un.id, t)).returning().get();
  return e ? Hc(e) : null;
}
const qy = 3849, bI = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8"
}, Wc = {
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
let Mt = null, Bn = Wc, Tn = null;
const Kn = /* @__PURE__ */ new Set();
async function SI(t, e, r) {
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
function EI(t, e, r) {
  const n = e === "/" ? "/remote.html" : e.split("?")[0], s = ne.join(t, decodeURIComponent(n));
  if (!s.startsWith(t)) {
    r.writeHead(403), r.end();
    return;
  }
  se.readFile(s, (a, o) => {
    if (a) {
      r.writeHead(404), r.end();
      return;
    }
    r.setHeader("Content-Type", bI[ne.extname(s)] ?? "application/octet-stream"), r.end(o);
  });
}
function NI() {
  for (const t of Object.values(Ir.networkInterfaces()))
    for (const e of t ?? [])
      if (e.family === "IPv4" && !e.internal) return e.address;
  return "127.0.0.1";
}
function PI(t) {
  Bn = t;
  const e = `data: ${JSON.stringify(Bn)}

`;
  for (const r of Kn) r.write(e);
}
function Vu() {
  return Mt !== null;
}
function Fy() {
  return `http://${NI()}:${qy}`;
}
function TI(t) {
  Mt || (Tn = t.onCommand, Bn = Wc, Mt = Mo.createServer((e, r) => {
    if (e.method === "GET" && e.url === "/api/events") {
      r.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*"
      }), r.write(`data: ${JSON.stringify(Bn)}

`), Kn.add(r), e.on("close", () => Kn.delete(r));
      return;
    }
    if (e.method === "POST" && e.url === "/api/command") {
      let n = "";
      e.on("data", (s) => {
        n += s;
      }), e.on("end", () => {
        try {
          Tn == null || Tn(JSON.parse(n));
        } catch {
        }
        r.setHeader("Access-Control-Allow-Origin", "*"), r.end("{}");
      });
      return;
    }
    if (e.method === "GET" && e.url) {
      t.devServerUrl ? SI(t.devServerUrl, e.url, r) : EI(t.distDir, e.url, r);
      return;
    }
    r.writeHead(404), r.end();
  }), Mt.on("error", () => {
  }), Mt.listen(qy, "0.0.0.0"));
}
function zy() {
  for (const t of Kn) t.end();
  Kn.clear(), Mt == null || Mt.close(), Mt = null, Tn = null, Bn = Wc;
}
const Xr = 3847, Uy = 3848, Co = "seedscreen", Ao = /* @__PURE__ */ new Map();
let rr = null, nt = null, Ds = null;
function By() {
  for (const t of Object.values(Ir.networkInterfaces()))
    for (const e of t ?? [])
      if (e.family === "IPv4" && !e.internal) return e.address;
  return "127.0.0.1";
}
function ko() {
  if (!nt) return;
  const t = Buffer.from(
    JSON.stringify({
      app: Co,
      type: "hello",
      hostname: Ir.hostname(),
      port: Xr,
      songCount: nn().length
    })
  );
  try {
    nt.send(t, 0, t.length, Uy, "255.255.255.255");
  } catch {
  }
}
function OI(t) {
  if (rr || (rr = Mo.createServer((e, r) => {
    r.setHeader("Content-Type", "application/json"), r.setHeader("Access-Control-Allow-Origin", "*"), e.url === "/api/info" ? r.end(JSON.stringify({ hostname: Ir.hostname(), songCount: nn().length, port: Xr, app: Co })) : e.url === "/api/songs" ? r.end(JSON.stringify({ songs: nn() })) : (r.writeHead(404), r.end("{}"));
  }), rr.on("error", () => {
  }), rr.listen(Xr, "0.0.0.0")), !nt) {
    const e = By();
    nt = Zy.createSocket({ type: "udp4", reuseAddr: !0 }), nt.on("error", () => {
    }), nt.on("message", (r, n) => {
      if (n.address !== e)
        try {
          const s = JSON.parse(r.toString());
          if (s.app !== Co || s.type !== "hello") return;
          const a = {
            ip: n.address,
            hostname: s.hostname || n.address,
            port: s.port || Xr,
            songCount: s.songCount || 0,
            lastSeen: Date.now()
          };
          Ao.set(n.address, a), t == null || t(a);
        } catch {
        }
    }), nt.bind(Uy, () => {
      nt == null || nt.setBroadcast(!0), ko();
    }), Ds = setInterval(ko, 6e3);
  }
}
function RI() {
  return { ip: By(), hostname: Ir.hostname(), port: Xr, songCount: nn().length };
}
function Ky() {
  const t = Date.now() - 2e4, e = [];
  for (const [r, n] of Ao)
    n.lastSeen > t ? e.push(n) : Ao.delete(r);
  return e;
}
function II() {
  ko();
}
function jI(t, e) {
  return new Promise((r, n) => {
    const s = Mo.request(
      { hostname: t, port: e || Xr, path: "/api/songs", method: "GET", timeout: 8e3 },
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
function CI() {
  Ds && clearInterval(Ds), nt == null || nt.close(), rr == null || rr.close(), Ds = null, nt = null, rr = null;
}
const Fe = new gR({
  defaults: { theme: "marino", backgrounds: [], logo: null, images: [] }
}), AI = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};
function Qy() {
  const t = Qh.showOpenDialogSync({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg"] }]
  }), e = t == null ? void 0 : t[0];
  if (!e) return null;
  const r = ne.extname(e).toLowerCase(), n = AI[r] ?? "application/octet-stream", s = se.readFileSync(e).toString("base64");
  return {
    name: ne.basename(e, r),
    dataUrl: `data:${n};base64,${s}`
  };
}
const qu = ["mp4", "webm", "mov", "m4v"], kI = ["png", "jpg", "jpeg", "gif", "webp"];
function LI() {
  const t = ne.join(Ft.getPath("userData"), "media");
  return se.mkdirSync(t, { recursive: !0 }), t;
}
function DI() {
  const t = Qh.showOpenDialogSync({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Media", extensions: [...kI, ...qu] }]
  });
  for (const e of t ?? []) {
    const r = ne.extname(e).toLowerCase().slice(1), n = qu.includes(r) ? "video" : "image", s = ne.join(LI(), `${Lo()}.${r}`);
    se.copyFileSync(e, s), _I({ type: n, title: ne.basename(e, ne.extname(e)), filePath: s });
  }
}
let Ss = null;
function Xc() {
  if (Ss) return Ss;
  const t = ne.join(process.resourcesPath, "bible.json"), e = ne.join(Pa, "../resources/bible.json"), r = se.existsSync(t) ? t : e;
  return Ss = JSON.parse(se.readFileSync(r, "utf-8")), Ss;
}
const Gy = {
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
Ft.setName("SeedScreen");
const Pa = ne.dirname(Wy(import.meta.url));
process.env.APP_ROOT = ne.join(Pa, "..");
const sn = process.env.VITE_DEV_SERVER_URL, rj = ne.join(process.env.APP_ROOT, "dist-electron"), Ta = ne.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = sn ? ne.join(process.env.APP_ROOT, "public") : Ta;
let ae;
function xy() {
  ae = new Do({
    width: 1920,
    height: 1080,
    backgroundColor: "#0e1b2e",
    icon: ne.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: ne.join(Pa, "preload.mjs")
    }
  }), ae.webContents.on("did-finish-load", () => {
    ae == null || ae.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), sn ? ae.loadURL(sn) : ae.loadFile(ne.join(Ta, "index.html"));
}
let Ie = null;
function MI(t) {
  const e = Yr.getAllDisplays(), r = Yr.getPrimaryDisplay(), n = (t ? e.find((o) => o.id === t) : e.find((o) => o.id !== r.id)) ?? r, s = n.id !== r.id, a = n.bounds;
  Ie = new Do({
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
      preload: ne.join(Pa, "preload.mjs"),
      // Output videos must start playing the instant they're sent — there's no user
      // gesture available on the audience screen to satisfy the default autoplay policy.
      autoplayPolicy: "no-user-gesture-required"
    }
  }), sn ? Ie.loadURL(`${sn}#output`) : Ie.loadFile(ne.join(Ta, "index.html"), { hash: "output" }), Ie.on("closed", () => {
    Ie = null, ae == null || ae.webContents.send("output-window-closed");
  });
}
Ft.on("window-all-closed", () => {
  process.platform !== "darwin" && (Ft.quit(), ae = null);
});
const VI = process.platform === "darwin", qI = [
  // En macOS, el primer menú suele ser el nombre de la app.
  // Usamos el operador spread (...) para insertarlo solo si es Mac.
  ...VI ? [
    {
      label: Ft.name,
      submenu: [
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => ae == null ? void 0 : ae.webContents.send("open-settings")
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
        click: () => ae == null ? void 0 : ae.webContents.send("menu-new-song")
      },
      {
        label: "New song with AI",
        accelerator: "CmdOrCtrl+Shift+I",
        click: () => ae == null ? void 0 : ae.webContents.send("menu-new-song-ai")
      }
    ]
  },
  {
    label: "Presentation",
    submenu: [
      {
        label: "Project",
        accelerator: "CmdOrCtrl+P",
        click: () => ae == null ? void 0 : ae.webContents.send("menu-toggle-output")
      },
      { type: "separator" },
      {
        label: "Show black screen",
        accelerator: "B",
        click: () => ae == null ? void 0 : ae.webContents.send("menu-go-black")
      },
      {
        label: "Show logo",
        accelerator: "L",
        click: () => ae == null ? void 0 : ae.webContents.send("menu-show-logo")
      },
      { type: "separator" },
      {
        label: "Remote Control",
        type: "checkbox",
        checked: !1,
        accelerator: "CmdOrCtrl+Shift+R",
        click: (t) => {
          t.checked ? (TI({
            devServerUrl: sn,
            distDir: Ta,
            onCommand: (e) => ae == null ? void 0 : ae.webContents.send("remote:command", e)
          }), ae == null || ae.webContents.send("remote:status-changed", {
            active: !0,
            url: Fy()
          })) : (zy(), ae == null || ae.webContents.send("remote:status-changed", { active: !1, url: null }));
        }
      }
    ]
  }
];
ye.handle("settings:get-all", () => ({
  theme: Fe.get("theme"),
  backgrounds: Fe.get("backgrounds"),
  logo: Fe.get("logo"),
  images: Fe.get("images")
}));
ye.handle("settings:set-theme", (t, e) => (Fe.set("theme", e), !0));
ye.handle("settings:pick-logo", () => {
  const t = Qy();
  return t ? (Fe.set("logo", t.dataUrl), t.dataUrl) : null;
});
ye.handle("settings:clear-logo", () => (Fe.set("logo", null), !0));
ye.handle(
  "backgrounds:add",
  (t, e) => {
    const r = { id: Lo(), ...e };
    return Fe.set("backgrounds", [...Fe.get("backgrounds"), r]), r;
  }
);
ye.handle("backgrounds:delete", (t, e) => (Fe.set(
  "backgrounds",
  Fe.get("backgrounds").filter((r) => r.id !== e)
), !0));
ye.handle("images:add", () => {
  const t = Qy();
  if (t) {
    const e = { id: Lo(), ...t };
    Fe.set("images", [...Fe.get("images"), e]);
  }
  return Fe.get("images");
});
ye.handle("images:delete", (t, e) => (Fe.set(
  "images",
  Fe.get("images").filter((r) => r.id !== e)
), Fe.get("images")));
ye.handle("sync:get-local-info", () => RI());
ye.handle("sync:get-peers", () => Ky());
ye.handle("sync:search-peers", async () => (II(), await new Promise((t) => setTimeout(t, 2500)), Ky()));
ye.handle("sync:fetch-songs", (t, e, r) => jI(e, r));
ye.handle("sync:import-songs", (t, e) => vI(e));
ye.handle("remote:get-status", () => ({
  active: Vu(),
  url: Vu() ? Fy() : null
}));
ye.handle("remote:push-state", (t, e) => (PI(e), !0));
ye.handle("output:toggle", (t, e) => Ie ? (Ie.close(), { opened: !1 }) : (MI(e), { opened: !0 }));
ye.handle("output:get-status", () => ({ isOpen: Ie !== null }));
ye.handle("displays:get-all", () => {
  const t = Yr.getAllDisplays(), e = Yr.getPrimaryDisplay();
  return t.map((r) => ({
    id: r.id,
    label: r.id === e.id ? "Primary Display" : "External Monitor",
    isPrimary: r.id === e.id
  }));
});
ye.handle("output:send-slide", (t, e) => (Ie == null || Ie.webContents.send("show-slide", e), !0));
ye.handle("output:go-black", () => (Ie == null || Ie.webContents.send("go-black"), !0));
ye.handle("output:show-image", (t, e) => (Ie == null || Ie.webContents.send("show-image", e), !0));
ye.handle("output:show-video", (t, e) => (Ie == null || Ie.webContents.send("show-video", e), !0));
ye.handle("songs:get-all", () => nn());
ye.handle("songs:add", (t, e) => Vy(e));
ye.handle("songs:update", (t, e, r) => $I(e, r));
ye.handle("songs:delete", (t, e) => gI(e));
ye.handle("media:get-all", () => Jc());
ye.handle("media:add", () => (DI(), Jc()));
ye.handle("media:delete", (t, e) => {
  const r = wI(e);
  return r && se.rm(r.filePath, { force: !0 }, () => {
  }), Jc();
});
ye.handle("bible:get-books", () => Xc().books.map((t, e) => ({
  id: t.book_usfm,
  name: t.name,
  abbr: Gy[t.book_usfm] ?? t.book_usfm,
  chapterCount: t.chapters.filter((r) => r.is_chapter !== !1).length,
  index: e
})));
ye.handle("bible:get-chapter", (t, e, r) => {
  const n = Xc().books.find((o) => o.book_usfm === e);
  if (!n) return [];
  const a = n.chapters.filter((o) => o.is_chapter !== !1)[r - 1];
  return a ? a.items.filter((o) => o.type === "verse" && o.verse_numbers.length > 0).map((o) => ({ v: o.verse_numbers[0], t: o.lines.join(" ") })) : [];
});
ye.handle("bible:search", (t, e) => {
  if (!e || e.length < 3) return [];
  const r = e.toLowerCase(), n = [];
  for (const s of Xc().books) {
    const a = Gy[s.book_usfm] ?? s.book_usfm, o = s.chapters.filter((i) => i.is_chapter !== !1);
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
Ft.on("activate", () => {
  Do.getAllWindows().length === 0 && xy();
});
Ft.whenReady().then(() => {
  xy();
  const t = el.buildFromTemplate(qI);
  el.setApplicationMenu(t), Yr.on("display-added", () => ae == null ? void 0 : ae.webContents.send("displays-changed")), Yr.on("display-removed", () => ae == null ? void 0 : ae.webContents.send("displays-changed")), OI((e) => ae == null ? void 0 : ae.webContents.send("sync-peer-found", e));
});
Ft.on("before-quit", () => {
  CI(), zy();
});
export {
  rj as MAIN_DIST,
  Ta as RENDERER_DIST,
  sn as VITE_DEV_SERVER_URL
};
