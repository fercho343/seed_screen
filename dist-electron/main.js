var s$ = Object.defineProperty;
var tl = (t) => {
  throw TypeError(t);
};
var a$ = (t, e, r) => e in t ? s$(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var N = (t, e, r) => a$(t, typeof e != "symbol" ? e + "" : e, r), rl = (t, e, r) => e.has(t) || tl("Cannot " + r);
var be = (t, e, r) => (rl(t, e, "read from private field"), r ? r.call(t) : e.get(t)), yn = (t, e, r) => e.has(t) ? tl("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), $n = (t, e, r, n) => (rl(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r);
import gn, { randomUUID as Fo } from "node:crypto";
import ae from "node:fs";
import re from "node:path";
import { fileURLToPath as o$ } from "node:url";
import Jh, { app as qt, protocol as Wh, ipcMain as ye, screen as Zr, BrowserWindow as qo, Menu as nl, dialog as Xh } from "electron";
import Se from "node:process";
import { promisify as Ue, isDeepStrictEqual as i$ } from "node:util";
import c$ from "node:assert";
import wr from "node:os";
import "node:events";
import "node:stream";
import Sn from "better-sqlite3";
import zo from "node:http";
import l$ from "node:dgram";
const br = (t) => {
  const e = typeof t;
  return t !== null && (e === "object" || e === "function");
}, Ia = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), u$ = new Set("0123456789");
function ra(t) {
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
        if (Ia.has(r))
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
          if (Ia.has(r))
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
        if (n === "index" && !u$.has(a))
          throw new Error("Invalid character in an index");
        if (n === "indexEnd")
          throw new Error("Invalid character after an index");
        n === "start" && (n = "property"), s && (s = !1, r += "\\"), r += a;
      }
    }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (Ia.has(r))
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
function Uo(t, e) {
  if (typeof e != "number" && Array.isArray(t)) {
    const r = Number.parseInt(e, 10);
    return Number.isInteger(r) && t[r] === t[e];
  }
  return !1;
}
function Yh(t, e) {
  if (Uo(t, e))
    throw new Error("Cannot use string index");
}
function d$(t, e, r) {
  if (!br(t) || typeof e != "string")
    return r === void 0 ? t : r;
  const n = ra(e);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (Uo(t, a) ? t = s === n.length - 1 ? void 0 : null : t = t[a], t == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return t === void 0 ? r : t;
}
function sl(t, e, r) {
  if (!br(t) || typeof e != "string")
    return t;
  const n = t, s = ra(e);
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    Yh(t, o), a === s.length - 1 ? t[o] = r : br(t[o]) || (t[o] = typeof s[a + 1] == "number" ? [] : {}), t = t[o];
  }
  return n;
}
function f$(t, e) {
  if (!br(t) || typeof e != "string")
    return !1;
  const r = ra(e);
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (Yh(t, s), n === r.length - 1)
      return delete t[s], !0;
    if (t = t[s], !br(t))
      return !1;
  }
}
function h$(t, e) {
  if (!br(t) || typeof e != "string")
    return !1;
  const r = ra(e);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!br(t) || !(n in t) || Uo(t, n))
      return !1;
    t = t[n];
  }
  return !0;
}
const Yt = wr.homedir(), Bo = wr.tmpdir(), { env: Br } = Se, m$ = (t) => {
  const e = re.join(Yt, "Library");
  return {
    data: re.join(e, "Application Support", t),
    config: re.join(e, "Preferences", t),
    cache: re.join(e, "Caches", t),
    log: re.join(e, "Logs", t),
    temp: re.join(Bo, t)
  };
}, p$ = (t) => {
  const e = Br.APPDATA || re.join(Yt, "AppData", "Roaming"), r = Br.LOCALAPPDATA || re.join(Yt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: re.join(r, t, "Data"),
    config: re.join(e, t, "Config"),
    cache: re.join(r, t, "Cache"),
    log: re.join(r, t, "Log"),
    temp: re.join(Bo, t)
  };
}, y$ = (t) => {
  const e = re.basename(Yt);
  return {
    data: re.join(Br.XDG_DATA_HOME || re.join(Yt, ".local", "share"), t),
    config: re.join(Br.XDG_CONFIG_HOME || re.join(Yt, ".config"), t),
    cache: re.join(Br.XDG_CACHE_HOME || re.join(Yt, ".cache"), t),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: re.join(Br.XDG_STATE_HOME || re.join(Yt, ".local", "state"), t),
    temp: re.join(Bo, e, t)
  };
};
function $$(t, { suffix: e = "nodejs" } = {}) {
  if (typeof t != "string")
    throw new TypeError(`Expected a string, got ${typeof t}`);
  return e && (t += `-${e}`), Se.platform === "darwin" ? m$(t) : Se.platform === "win32" ? p$(t) : y$(t);
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
}, g$ = 250, Kt = (t, e) => {
  const { isRetriable: r } = e;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? g$, i = Date.now() + a;
    return function c(...d) {
      return t.apply(void 0, d).catch((l) => {
        if (!r(l) || Date.now() >= i)
          throw l;
        const f = Math.round(o * Math.random());
        return f > 0 ? new Promise((p) => setTimeout(p, f)).then(() => c.apply(void 0, d)) : c.apply(void 0, d);
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
}, Kr = {
  /* API */
  isChangeErrorOk: (t) => {
    if (!Kr.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "ENOSYS" || !v$ && (e === "EINVAL" || e === "EPERM");
  },
  isNodeError: (t) => t instanceof Error,
  isRetriableError: (t) => {
    if (!Kr.isNodeError(t))
      return !1;
    const { code: e } = t;
    return e === "EMFILE" || e === "ENFILE" || e === "EAGAIN" || e === "EBUSY" || e === "EACCESS" || e === "EACCES" || e === "EACCS" || e === "EPERM";
  },
  onChangeError: (t) => {
    if (!Kr.isNodeError(t))
      throw t;
    if (!Kr.isChangeErrorOk(t))
      throw t;
  }
}, rs = {
  onError: Kr.onChangeError
}, ot = {
  onError: () => {
  }
}, v$ = Se.getuid ? !Se.getuid() : !1, Be = {
  isRetriable: Kr.isRetriableError
}, Qe = {
  attempt: {
    /* ASYNC */
    chmod: Bt(Ue(ae.chmod), rs),
    chown: Bt(Ue(ae.chown), rs),
    close: Bt(Ue(ae.close), ot),
    fsync: Bt(Ue(ae.fsync), ot),
    mkdir: Bt(Ue(ae.mkdir), ot),
    realpath: Bt(Ue(ae.realpath), ot),
    stat: Bt(Ue(ae.stat), ot),
    unlink: Bt(Ue(ae.unlink), ot),
    /* SYNC */
    chmodSync: Rt(ae.chmodSync, rs),
    chownSync: Rt(ae.chownSync, rs),
    closeSync: Rt(ae.closeSync, ot),
    existsSync: Rt(ae.existsSync, ot),
    fsyncSync: Rt(ae.fsync, ot),
    mkdirSync: Rt(ae.mkdirSync, ot),
    realpathSync: Rt(ae.realpathSync, ot),
    statSync: Rt(ae.statSync, ot),
    unlinkSync: Rt(ae.unlinkSync, ot)
  },
  retry: {
    /* ASYNC */
    close: Kt(Ue(ae.close), Be),
    fsync: Kt(Ue(ae.fsync), Be),
    open: Kt(Ue(ae.open), Be),
    readFile: Kt(Ue(ae.readFile), Be),
    rename: Kt(Ue(ae.rename), Be),
    stat: Kt(Ue(ae.stat), Be),
    write: Kt(Ue(ae.write), Be),
    writeFile: Kt(Ue(ae.writeFile), Be),
    /* SYNC */
    closeSync: Qt(ae.closeSync, Be),
    fsyncSync: Qt(ae.fsyncSync, Be),
    openSync: Qt(ae.openSync, Be),
    readFileSync: Qt(ae.readFileSync, Be),
    renameSync: Qt(ae.renameSync, Be),
    statSync: Qt(ae.statSync, Be),
    writeSync: Qt(ae.writeSync, Be),
    writeFileSync: Qt(ae.writeFileSync, Be)
  }
}, _$ = "utf8", al = 438, w$ = 511, b$ = {}, S$ = Se.geteuid ? Se.geteuid() : -1, E$ = Se.getegid ? Se.getegid() : -1, N$ = 1e3, P$ = !!Se.getuid;
Se.getuid && Se.getuid();
const ol = 128, T$ = (t) => t instanceof Error && "code" in t, il = (t) => typeof t == "string", ja = (t) => t === void 0, O$ = Se.platform === "linux", Zh = Se.platform === "win32", Ko = ["SIGHUP", "SIGINT", "SIGTERM"];
Zh || Ko.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
O$ && Ko.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class R$ {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (e) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        e && (Zh && e !== "SIGINT" && e !== "SIGTERM" && e !== "SIGKILL" ? Se.kill(Se.pid, "SIGTERM") : Se.kill(Se.pid, e));
      }
    }, this.hook = () => {
      Se.once("exit", () => this.exit());
      for (const e of Ko)
        try {
          Se.once(e, () => this.exit(e));
        } catch {
        }
    }, this.register = (e) => (this.callbacks.add(e), () => {
      this.callbacks.delete(e);
    }), this.hook();
  }
}
const I$ = new R$(), j$ = I$.register, Ge = {
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
    const e = re.basename(t);
    if (e.length <= ol)
      return t;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(e);
    if (!r)
      return t;
    const n = e.length - ol;
    return `${t.slice(0, -e.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
j$(Ge.purgeSyncAll);
function em(t, e, r = b$) {
  if (il(r))
    return em(t, e, { encoding: r });
  const s = { timeout: r.timeout ?? N$ };
  let a = null, o = null, i = null;
  try {
    const c = Qe.attempt.realpathSync(t), d = !!c;
    t = c || t, [o, a] = Ge.get(t, r.tmpCreate || Ge.create, r.tmpPurge !== !1);
    const l = P$ && ja(r.chown), f = ja(r.mode);
    if (d && (l || f)) {
      const g = Qe.attempt.statSync(t);
      g && (r = { ...r }, l && (r.chown = { uid: g.uid, gid: g.gid }), f && (r.mode = g.mode));
    }
    if (!d) {
      const g = re.dirname(t);
      Qe.attempt.mkdirSync(g, {
        mode: w$,
        recursive: !0
      });
    }
    i = Qe.retry.openSync(s)(o, "w", r.mode || al), r.tmpCreated && r.tmpCreated(o), il(e) ? Qe.retry.writeSync(s)(i, e, 0, r.encoding || _$) : ja(e) || Qe.retry.writeSync(s)(i, e, 0, e.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Qe.retry.fsyncSync(s)(i) : Qe.attempt.fsync(i)), Qe.retry.closeSync(s)(i), i = null, r.chown && (r.chown.uid !== S$ || r.chown.gid !== E$) && Qe.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== al && Qe.attempt.chmodSync(o, r.mode);
    try {
      Qe.retry.renameSync(s)(o, t);
    } catch (g) {
      if (!T$(g) || g.code !== "ENAMETOOLONG")
        throw g;
      Qe.retry.renameSync(s)(o, Ge.truncate(t));
    }
    a(), o = null;
  } finally {
    i && Qe.attempt.closeSync(i), o && Ge.purge(o);
  }
}
function tm(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Za = { exports: {} }, rm = {}, bt = {}, en = {}, xn = {}, ce = {}, Fn = {};
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
    b instanceof n ? m.push(...b._items) : b instanceof r ? m.push(b) : m.push(f(b));
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
  function f(m) {
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
})(Fn);
var eo = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.ValueScope = t.ValueScopeName = t.Scope = t.varKinds = t.UsedValueState = void 0;
  const e = Fn;
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
      var l, f;
      if (!((f = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || f === void 0) && f.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  t.Scope = s;
  class a extends e.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: f }) {
      this.value = d, this.scopePath = (0, e._)`.${new e.Name(l)}[${f}]`;
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
      var f;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const g = this.toName(d), { prefix: p } = g, w = (f = l.key) !== null && f !== void 0 ? f : l.ref;
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
      const f = this._values[d];
      if (f)
        return f.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, e._)`${d}${f.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, f) {
      return this._reduceValues(d, (g) => {
        if (g.value === void 0)
          throw new Error(`CodeGen: name "${g}" has no value`);
        return g.value.code;
      }, l, f);
    }
    _reduceValues(d, l, f = {}, g) {
      let p = e.nil;
      for (const w in d) {
        const $ = d[w];
        if (!$)
          continue;
        const v = f[w] = f[w] || /* @__PURE__ */ new Map();
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
})(eo);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.or = t.and = t.not = t.CodeGen = t.operators = t.varKinds = t.ValueScopeName = t.ValueScope = t.Scope = t.Name = t.regexpCode = t.stringify = t.getProperty = t.nil = t.strConcat = t.str = t._ = void 0;
  const e = Fn, r = eo;
  var n = Fn;
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
  var s = eo;
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
    optimizeNames(u, h) {
      return this;
    }
  }
  class o extends a {
    constructor(u, h, S) {
      super(), this.varKind = u, this.name = h, this.rhs = S;
    }
    render({ es5: u, _n: h }) {
      const S = u ? r.varKinds.var : this.varKind, A = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${A};` + h;
    }
    optimizeNames(u, h) {
      if (u[this.name.str])
        return this.rhs && (this.rhs = K(this.rhs, u, h)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class i extends a {
    constructor(u, h, S) {
      super(), this.lhs = u, this.rhs = h, this.sideEffects = S;
    }
    render({ _n: u }) {
      return `${this.lhs} = ${this.rhs};` + u;
    }
    optimizeNames(u, h) {
      if (!(this.lhs instanceof e.Name && !u[this.lhs.str] && !this.sideEffects))
        return this.rhs = K(this.rhs, u, h), this;
    }
    get names() {
      const u = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return Z(u, this.rhs);
    }
  }
  class c extends i {
    constructor(u, h, S, A) {
      super(u, S, A), this.op = h;
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
  class f extends a {
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
    optimizeNames(u, h) {
      return this.code = K(this.code, u, h), this;
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
      return this.nodes.reduce((h, S) => h + S.render(u), "");
    }
    optimizeNodes() {
      const { nodes: u } = this;
      let h = u.length;
      for (; h--; ) {
        const S = u[h].optimizeNodes();
        Array.isArray(S) ? u.splice(h, 1, ...S) : S ? u[h] = S : u.splice(h, 1);
      }
      return u.length > 0 ? this : void 0;
    }
    optimizeNames(u, h) {
      const { nodes: S } = this;
      let A = S.length;
      for (; A--; ) {
        const k = S[A];
        k.optimizeNames(u, h) || (pe(u, k.names), S.splice(A, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((u, h) => X(u, h.names), {});
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
    constructor(u, h) {
      super(h), this.condition = u;
    }
    render(u) {
      let h = `if(${this.condition})` + super.render(u);
      return this.else && (h += "else " + this.else.render(u)), h;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const u = this.condition;
      if (u === !0)
        return this.nodes;
      let h = this.else;
      if (h) {
        const S = h.optimizeNodes();
        h = this.else = Array.isArray(S) ? new v(S) : S;
      }
      if (h)
        return u === !1 ? h instanceof m ? h : h.nodes : this.nodes.length ? this : new m(Ne(u), h instanceof m ? [h] : h.nodes);
      if (!(u === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(u, h) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(u, h), !!(super.optimizeNames(u, h) || this.else))
        return this.condition = K(this.condition, u, h), this;
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
    optimizeNames(u, h) {
      if (super.optimizeNames(u, h))
        return this.iteration = K(this.iteration, u, h), this;
    }
    get names() {
      return X(super.names, this.iteration.names);
    }
  }
  class R extends b {
    constructor(u, h, S, A) {
      super(), this.varKind = u, this.name = h, this.from = S, this.to = A;
    }
    render(u) {
      const h = u.es5 ? r.varKinds.var : this.varKind, { name: S, from: A, to: k } = this;
      return `for(${h} ${S}=${A}; ${S}<${k}; ${S}++)` + super.render(u);
    }
    get names() {
      const u = Z(super.names, this.from);
      return Z(u, this.to);
    }
  }
  class j extends b {
    constructor(u, h, S, A) {
      super(), this.loop = u, this.varKind = h, this.name = S, this.iterable = A;
    }
    render(u) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(u);
    }
    optimizeNames(u, h) {
      if (super.optimizeNames(u, h))
        return this.iterable = K(this.iterable, u, h), this;
    }
    get names() {
      return X(super.names, this.iterable.names);
    }
  }
  class U extends w {
    constructor(u, h, S) {
      super(), this.name = u, this.args = h, this.async = S;
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
      let h = "try" + super.render(u);
      return this.catch && (h += this.catch.render(u)), this.finally && (h += this.finally.render(u)), h;
    }
    optimizeNodes() {
      var u, h;
      return super.optimizeNodes(), (u = this.catch) === null || u === void 0 || u.optimizeNodes(), (h = this.finally) === null || h === void 0 || h.optimizeNodes(), this;
    }
    optimizeNames(u, h) {
      var S, A;
      return super.optimizeNames(u, h), (S = this.catch) === null || S === void 0 || S.optimizeNames(u, h), (A = this.finally) === null || A === void 0 || A.optimizeNames(u, h), this;
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
    constructor(u, h = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...h, _n: h.lines ? `
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
    scopeValue(u, h) {
      const S = this._extScope.value(u, h);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(u, h) {
      return this._extScope.getValue(u, h);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(u) {
      return this._extScope.scopeRefs(u, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(u, h, S, A) {
      const k = this._scope.toName(h);
      return S !== void 0 && A && (this._constants[k.str] = S), this._leafNode(new o(u, k, S)), k;
    }
    // `const` declaration (`var` in es5 mode)
    const(u, h, S) {
      return this._def(r.varKinds.const, u, h, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(u, h, S) {
      return this._def(r.varKinds.let, u, h, S);
    }
    // `var` declaration with optional assignment
    var(u, h, S) {
      return this._def(r.varKinds.var, u, h, S);
    }
    // assignment code
    assign(u, h, S) {
      return this._leafNode(new i(u, h, S));
    }
    // `+=` code
    add(u, h) {
      return this._leafNode(new c(u, t.operators.ADD, h));
    }
    // appends passed SafeExpr to code or executes Block
    code(u) {
      return typeof u == "function" ? u() : u !== e.nil && this._leafNode(new g(u)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...u) {
      const h = ["{"];
      for (const [S, A] of u)
        h.length > 1 && h.push(","), h.push(S), (S !== A || this.opts.es5) && (h.push(":"), (0, e.addCodeArg)(h, A));
      return h.push("}"), new e._Code(h);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(u, h, S) {
      if (this._blockNode(new m(u)), h && S)
        this.code(h).else().code(S).endIf();
      else if (h)
        this.code(h).endIf();
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
    _for(u, h) {
      return this._blockNode(u), h && this.code(h).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(u, h) {
      return this._for(new T(u), h);
    }
    // `for` statement for a range of values
    forRange(u, h, S, A, k = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const H = this._scope.toName(u);
      return this._for(new R(k, H, h, S), () => A(H));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(u, h, S, A = r.varKinds.const) {
      const k = this._scope.toName(u);
      if (this.opts.es5) {
        const H = h instanceof e.Name ? h : this.var("_arr", h);
        return this.forRange("_i", 0, (0, e._)`${H}.length`, (W) => {
          this.var(k, (0, e._)`${H}[${W}]`), S(k);
        });
      }
      return this._for(new j("of", A, k, h), () => S(k));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(u, h, S, A = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(u, (0, e._)`Object.keys(${h})`, S);
      const k = this._scope.toName(u);
      return this._for(new j("in", A, k, h), () => S(k));
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
      const h = new M();
      if (this._blockNode(h), this.code(u), h.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(M);
    }
    // `try` statement
    try(u, h, S) {
      if (!h && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const A = new te();
      if (this._blockNode(A), this.code(u), h) {
        const k = this.name("e");
        this._currNode = A.catch = new fe(k), h(k);
      }
      return S && (this._currNode = A.finally = new $e(), this.code(S)), this._endBlockNode(fe, $e);
    }
    // `throw` statement
    throw(u) {
      return this._leafNode(new f(u));
    }
    // start self-balancing block
    block(u, h) {
      return this._blockStarts.push(this._nodes.length), u && this.code(u).endBlock(h), this;
    }
    // end the current self-balancing block
    endBlock(u) {
      const h = this._blockStarts.pop();
      if (h === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - h;
      if (S < 0 || u !== void 0 && S !== u)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${u} expected`);
      return this._nodes.length = h, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(u, h = e.nil, S, A) {
      return this._blockNode(new U(u, h, S)), A && this.code(A).endFunc(), this;
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
    _endBlockNode(u, h) {
      const S = this._currNode;
      if (S instanceof u || h && S instanceof h)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${h ? `${u.kind}/${h.kind}` : u.kind}"`);
    }
    _elseNode(u) {
      const h = this._currNode;
      if (!(h instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = h.else = u, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const u = this._nodes;
      return u[u.length - 1];
    }
    set _currNode(u) {
      const h = this._nodes;
      h[h.length - 1] = u;
    }
  }
  t.CodeGen = x;
  function X(_, u) {
    for (const h in u)
      _[h] = (_[h] || 0) + (u[h] || 0);
    return _;
  }
  function Z(_, u) {
    return u instanceof e._CodeOrName ? X(_, u.names) : _;
  }
  function K(_, u, h) {
    if (_ instanceof e.Name)
      return S(_);
    if (!A(_))
      return _;
    return new e._Code(_._items.reduce((k, H) => (H instanceof e.Name && (H = S(H)), H instanceof e._Code ? k.push(...H._items) : k.push(H), k), []));
    function S(k) {
      const H = h[k.str];
      return H === void 0 || u[k.str] !== 1 ? k : (delete u[k.str], H);
    }
    function A(k) {
      return k instanceof e._Code && k._items.some((H) => H instanceof e.Name && u[H.str] === 1 && h[H.str] !== void 0);
    }
  }
  function pe(_, u) {
    for (const h in u)
      _[h] = (_[h] || 0) - (u[h] || 0);
  }
  function Ne(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, e._)`!${E(_)}`;
  }
  t.not = Ne;
  const q = y(t.operators.AND);
  function F(..._) {
    return _.reduce(q);
  }
  t.and = F;
  const J = y(t.operators.OR);
  function P(..._) {
    return _.reduce(J);
  }
  t.or = P;
  function y(_) {
    return (u, h) => u === e.nil ? h : h === e.nil ? u : (0, e._)`${E(u)} ${_} ${E(h)}`;
  }
  function E(_) {
    return _ instanceof e.Name ? _ : (0, e._)`(${_})`;
  }
})(ce);
var B = {};
Object.defineProperty(B, "__esModule", { value: !0 });
B.checkStrictMode = B.getErrorPath = B.Type = B.useFunc = B.setEvaluated = B.evaluatedPropsToName = B.mergeEvaluated = B.eachItem = B.unescapeJsonPointer = B.escapeJsonPointer = B.escapeFragment = B.unescapeFragment = B.schemaRefOrVal = B.schemaHasRulesButRef = B.schemaHasRules = B.checkUnknownRules = B.alwaysValidSchema = B.toHash = void 0;
const ge = ce, C$ = Fn;
function A$(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
B.toHash = A$;
function k$(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (nm(t, e), !sm(e, t.self.RULES.all));
}
B.alwaysValidSchema = k$;
function nm(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || im(t, `unknown keyword: "${a}"`);
}
B.checkUnknownRules = nm;
function sm(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
B.schemaHasRules = sm;
function L$(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
B.schemaHasRulesButRef = L$;
function D$({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ge._)`${r}`;
  }
  return (0, ge._)`${t}${e}${(0, ge.getProperty)(n)}`;
}
B.schemaRefOrVal = D$;
function M$(t) {
  return am(decodeURIComponent(t));
}
B.unescapeFragment = M$;
function V$(t) {
  return encodeURIComponent(Qo(t));
}
B.escapeFragment = V$;
function Qo(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
B.escapeJsonPointer = Qo;
function am(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
B.unescapeJsonPointer = am;
function F$(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
B.eachItem = F$;
function cl({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof ge.Name ? (a instanceof ge.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof ge.Name ? (e(s, o, a), a) : r(a, o);
    return i === ge.Name && !(c instanceof ge.Name) ? n(s, c) : c;
  };
}
B.mergeEvaluated = {
  props: cl({
    mergeNames: (t, e, r) => t.if((0, ge._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, ge._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, ge._)`${r} || {}`).code((0, ge._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, ge._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, ge._)`${r} || {}`), Go(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: om
  }),
  items: cl({
    mergeNames: (t, e, r) => t.if((0, ge._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, ge._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, ge._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, ge._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function om(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, ge._)`{}`);
  return e !== void 0 && Go(t, r, e), r;
}
B.evaluatedPropsToName = om;
function Go(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, ge._)`${e}${(0, ge.getProperty)(n)}`, !0));
}
B.setEvaluated = Go;
const ll = {};
function q$(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: ll[e.code] || (ll[e.code] = new C$._Code(e.code))
  });
}
B.useFunc = q$;
var to;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(to || (B.Type = to = {}));
function z$(t, e, r) {
  if (t instanceof ge.Name) {
    const n = e === to.Num;
    return r ? n ? (0, ge._)`"[" + ${t} + "]"` : (0, ge._)`"['" + ${t} + "']"` : n ? (0, ge._)`"/" + ${t}` : (0, ge._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ge.getProperty)(t).toString() : "/" + Qo(t);
}
B.getErrorPath = z$;
function im(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
B.checkStrictMode = im;
var lt = {};
Object.defineProperty(lt, "__esModule", { value: !0 });
const Ke = ce, U$ = {
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
lt.default = U$;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
  const e = ce, r = B, n = lt;
  t.keywordError = {
    message: ({ keyword: v }) => (0, e.str)`must pass "${v}" keyword validation`
  }, t.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, e.str)`"${v}" keyword must be ${m} ($data)` : (0, e.str)`"${v}" keyword is invalid ($data)`
  };
  function s(v, m = t.keywordError, b, T) {
    const { it: R } = v, { gen: j, compositeRule: U, allErrors: M } = R, te = f(v, m, b);
    T ?? (U || M) ? c(j, te) : d(R, (0, e._)`[${te}]`);
  }
  t.reportError = s;
  function a(v, m = t.keywordError, b) {
    const { it: T } = v, { gen: R, compositeRule: j, allErrors: U } = T, M = f(v, m, b);
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
  function f(v, m, b) {
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
})(xn);
Object.defineProperty(en, "__esModule", { value: !0 });
en.boolOrEmptySchema = en.topBoolOrEmptySchema = void 0;
const B$ = xn, K$ = ce, Q$ = lt, G$ = {
  message: "boolean schema is false"
};
function x$(t) {
  const { gen: e, schema: r, validateName: n } = t;
  r === !1 ? cm(t, !1) : typeof r == "object" && r.$async === !0 ? e.return(Q$.default.data) : (e.assign((0, K$._)`${n}.errors`, null), e.return(!0));
}
en.topBoolOrEmptySchema = x$;
function H$(t, e) {
  const { gen: r, schema: n } = t;
  n === !1 ? (r.var(e, !1), cm(t)) : r.var(e, !0);
}
en.boolOrEmptySchema = H$;
function cm(t, e) {
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
  (0, B$.reportError)(s, G$, void 0, e);
}
var je = {}, Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.getRules = Sr.isJSONType = void 0;
const J$ = ["string", "number", "integer", "boolean", "null", "object", "array"], W$ = new Set(J$);
function X$(t) {
  return typeof t == "string" && W$.has(t);
}
Sr.isJSONType = X$;
function Y$() {
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
Sr.getRules = Y$;
var Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.shouldUseRule = Vt.shouldUseGroup = Vt.schemaHasRulesForType = void 0;
function Z$({ schema: t, self: e }, r) {
  const n = e.RULES.types[r];
  return n && n !== !0 && lm(t, n);
}
Vt.schemaHasRulesForType = Z$;
function lm(t, e) {
  return e.rules.some((r) => um(t, r));
}
Vt.shouldUseGroup = lm;
function um(t, e) {
  var r;
  return t[e.keyword] !== void 0 || ((r = e.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => t[n] !== void 0));
}
Vt.shouldUseRule = um;
Object.defineProperty(je, "__esModule", { value: !0 });
je.reportTypeError = je.checkDataTypes = je.checkDataType = je.coerceAndCheckDataType = je.getJSONTypes = je.getSchemaTypes = je.DataType = void 0;
const eg = Sr, tg = Vt, rg = xn, le = ce, dm = B;
var Hr;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(Hr || (je.DataType = Hr = {}));
function ng(t) {
  const e = fm(t.type);
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
je.getSchemaTypes = ng;
function fm(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(eg.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
je.getJSONTypes = fm;
function sg(t, e) {
  const { gen: r, data: n, opts: s } = t, a = ag(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, tg.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = xo(e, n, s.strictNumbers, Hr.Wrong);
    r.if(i, () => {
      a.length ? og(t, e, a) : Ho(t);
    });
  }
  return o;
}
je.coerceAndCheckDataType = sg;
const hm = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function ag(t, e) {
  return e ? t.filter((r) => hm.has(r) || e === "array" && r === "array") : [];
}
function og(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, le._)`typeof ${s}`), i = n.let("coerced", (0, le._)`undefined`);
  a.coerceTypes === "array" && n.if((0, le._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, le._)`${s}[0]`).assign(o, (0, le._)`typeof ${s}`).if(xo(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, le._)`${i} !== undefined`);
  for (const d of r)
    (hm.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Ho(t), n.endIf(), n.if((0, le._)`${i} !== undefined`, () => {
    n.assign(s, i), ig(t, i);
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
function ig({ gen: t, parentData: e, parentDataProperty: r }, n) {
  t.if((0, le._)`${e} !== undefined`, () => t.assign((0, le._)`${e}[${r}]`, n));
}
function ro(t, e, r, n = Hr.Correct) {
  const s = n === Hr.Correct ? le.operators.EQ : le.operators.NEQ;
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
  return n === Hr.Correct ? a : (0, le.not)(a);
  function o(i = le.nil) {
    return (0, le.and)((0, le._)`typeof ${e} == "number"`, i, r ? (0, le._)`isFinite(${e})` : le.nil);
  }
}
je.checkDataType = ro;
function xo(t, e, r, n) {
  if (t.length === 1)
    return ro(t[0], e, r, n);
  let s;
  const a = (0, dm.toHash)(t);
  if (a.array && a.object) {
    const o = (0, le._)`typeof ${e} != "object"`;
    s = a.null ? o : (0, le._)`!${e} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = le.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, le.and)(s, ro(o, e, r, n));
  return s;
}
je.checkDataTypes = xo;
const cg = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, le._)`{type: ${t}}` : (0, le._)`{type: ${e}}`
};
function Ho(t) {
  const e = lg(t);
  (0, rg.reportError)(e, cg);
}
je.reportTypeError = Ho;
function lg(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, dm.schemaRefOrVal)(t, n, "type");
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
var na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
na.assignDefaults = void 0;
const Lr = ce, ug = B;
function dg(t, e) {
  const { properties: r, items: n } = t.schema;
  if (e === "object" && r)
    for (const s in r)
      ul(t, s, r[s].default);
  else e === "array" && Array.isArray(n) && n.forEach((s, a) => ul(t, a, s.default));
}
na.assignDefaults = dg;
function ul(t, e, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = t;
  if (r === void 0)
    return;
  const i = (0, Lr._)`${a}${(0, Lr.getProperty)(e)}`;
  if (s) {
    (0, ug.checkStrictMode)(t, `default is ignored for: ${i}`);
    return;
  }
  let c = (0, Lr._)`${i} === undefined`;
  o.useDefaults === "empty" && (c = (0, Lr._)`${c} || ${i} === null || ${i} === ""`), n.if(c, (0, Lr._)`${i} = ${(0, Lr.stringify)(r)}`);
}
var Ot = {}, he = {};
Object.defineProperty(he, "__esModule", { value: !0 });
he.validateUnion = he.validateArray = he.usePattern = he.callValidateCode = he.schemaProperties = he.allSchemaProperties = he.noPropertyInData = he.propertyInData = he.isOwnProperty = he.hasPropFunc = he.reportMissingProp = he.checkMissingProp = he.checkReportMissingProp = void 0;
const _e = ce, Jo = B, Gt = lt, fg = B;
function hg(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(Xo(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, _e._)`${e}` }, !0), t.error();
  });
}
he.checkReportMissingProp = hg;
function mg({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, _e.or)(...n.map((a) => (0, _e.and)(Xo(t, e, a, r.ownProperties), (0, _e._)`${s} = ${a}`)));
}
he.checkMissingProp = mg;
function pg(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
he.reportMissingProp = pg;
function mm(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, _e._)`Object.prototype.hasOwnProperty`
  });
}
he.hasPropFunc = mm;
function Wo(t, e, r) {
  return (0, _e._)`${mm(t)}.call(${e}, ${r})`;
}
he.isOwnProperty = Wo;
function yg(t, e, r, n) {
  const s = (0, _e._)`${e}${(0, _e.getProperty)(r)} !== undefined`;
  return n ? (0, _e._)`${s} && ${Wo(t, e, r)}` : s;
}
he.propertyInData = yg;
function Xo(t, e, r, n) {
  const s = (0, _e._)`${e}${(0, _e.getProperty)(r)} === undefined`;
  return n ? (0, _e.or)(s, (0, _e.not)(Wo(t, e, r))) : s;
}
he.noPropertyInData = Xo;
function pm(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
he.allSchemaProperties = pm;
function $g(t, e) {
  return pm(e).filter((r) => !(0, Jo.alwaysValidSchema)(t, e[r]));
}
he.schemaProperties = $g;
function gg({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, d) {
  const l = d ? (0, _e._)`${t}, ${e}, ${n}${s}` : e, f = [
    [Gt.default.instancePath, (0, _e.strConcat)(Gt.default.instancePath, a)],
    [Gt.default.parentData, o.parentData],
    [Gt.default.parentDataProperty, o.parentDataProperty],
    [Gt.default.rootData, Gt.default.rootData]
  ];
  o.opts.dynamicRef && f.push([Gt.default.dynamicAnchors, Gt.default.dynamicAnchors]);
  const g = (0, _e._)`${l}, ${r.object(...f)}`;
  return c !== _e.nil ? (0, _e._)`${i}.call(${c}, ${g})` : (0, _e._)`${i}(${g})`;
}
he.callValidateCode = gg;
const vg = (0, _e._)`new RegExp`;
function _g({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, _e._)`${s.code === "new RegExp" ? vg : (0, fg.useFunc)(t, s)}(${r}, ${n})`
  });
}
he.usePattern = _g;
function wg(t) {
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
        dataPropType: Jo.Type.Num
      }, a), e.if((0, _e.not)(a), i);
    });
  }
}
he.validateArray = wg;
function bg(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Jo.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
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
he.validateUnion = bg;
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.validateKeywordUsage = Ot.validSchemaType = Ot.funcKeywordCode = Ot.macroKeywordCode = void 0;
const Ye = ce, hr = lt, Sg = he, Eg = xn;
function Ng(t, e) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = t, i = e.macro.call(o.self, s, a, o), c = ym(r, n, i);
  o.opts.validateSchema !== !1 && o.self.validateSchema(i, !0);
  const d = r.name("valid");
  t.subschema({
    schema: i,
    schemaPath: Ye.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), t.pass(d, () => t.error(!0));
}
Ot.macroKeywordCode = Ng;
function Pg(t, e) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: i, it: c } = t;
  Og(c, e);
  const d = !i && e.compile ? e.compile.call(c.self, a, o, c) : e.validate, l = ym(n, s, d), f = n.let("valid");
  t.block$data(f, g), t.ok((r = e.valid) !== null && r !== void 0 ? r : f);
  function g() {
    if (e.errors === !1)
      $(), e.modifying && dl(t), v(() => t.error());
    else {
      const m = e.async ? p() : w();
      e.modifying && dl(t), v(() => Tg(t, m));
    }
  }
  function p() {
    const m = n.let("ruleErrs", null);
    return n.try(() => $((0, Ye._)`await `), (b) => n.assign(f, !1).if((0, Ye._)`${b} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Ye._)`${b}.errors`), () => n.throw(b))), m;
  }
  function w() {
    const m = (0, Ye._)`${l}.errors`;
    return n.assign(m, null), $(Ye.nil), m;
  }
  function $(m = e.async ? (0, Ye._)`await ` : Ye.nil) {
    const b = c.opts.passContext ? hr.default.this : hr.default.self, T = !("compile" in e && !i || e.schema === !1);
    n.assign(f, (0, Ye._)`${m}${(0, Sg.callValidateCode)(t, l, b, T)}`, e.modifying);
  }
  function v(m) {
    var b;
    n.if((0, Ye.not)((b = e.valid) !== null && b !== void 0 ? b : f), m);
  }
}
Ot.funcKeywordCode = Pg;
function dl(t) {
  const { gen: e, data: r, it: n } = t;
  e.if(n.parentData, () => e.assign(r, (0, Ye._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Tg(t, e) {
  const { gen: r } = t;
  r.if((0, Ye._)`Array.isArray(${e})`, () => {
    r.assign(hr.default.vErrors, (0, Ye._)`${hr.default.vErrors} === null ? ${e} : ${hr.default.vErrors}.concat(${e})`).assign(hr.default.errors, (0, Ye._)`${hr.default.vErrors}.length`), (0, Eg.extendErrors)(t);
  }, () => t.error());
}
function Og({ schemaEnv: t }, e) {
  if (e.async && !t.$async)
    throw new Error("async keyword in sync schema");
}
function ym(t, e, r) {
  if (r === void 0)
    throw new Error(`keyword "${e}" failed to compile`);
  return t.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ye.stringify)(r) });
}
function Rg(t, e, r = !1) {
  return !e.length || e.some((n) => n === "array" ? Array.isArray(t) : n === "object" ? t && typeof t == "object" && !Array.isArray(t) : typeof t == n || r && typeof t > "u");
}
Ot.validSchemaType = Rg;
function Ig({ schema: t, opts: e, self: r, errSchemaPath: n }, s, a) {
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
Ot.validateKeywordUsage = Ig;
var nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.extendSubschemaMode = nr.extendSubschemaData = nr.getSubschema = void 0;
const Tt = ce, $m = B;
function jg(t, { keyword: e, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
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
      errSchemaPath: `${t.errSchemaPath}/${e}/${(0, $m.escapeFragment)(r)}`
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
nr.getSubschema = jg;
function Cg(t, e, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: i } = e;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: l, opts: f } = e, g = i.let("data", (0, Tt._)`${e.data}${(0, Tt.getProperty)(r)}`, !0);
    c(g), t.errorPath = (0, Tt.str)`${d}${(0, $m.getErrorPath)(r, n, f.jsPropertySyntax)}`, t.parentDataProperty = (0, Tt._)`${r}`, t.dataPathArr = [...l, t.parentDataProperty];
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
nr.extendSubschemaData = Cg;
function Ag(t, { jtdDiscriminator: e, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (t.compositeRule = n), s !== void 0 && (t.createErrors = s), a !== void 0 && (t.allErrors = a), t.jtdDiscriminator = e, t.jtdMetadata = r;
}
nr.extendSubschemaMode = Ag;
var Ve = {}, sa = function t(e, r) {
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
}, gm = { exports: {} }, er = gm.exports = function(t, e, r) {
  typeof e == "function" && (r = e, e = {}), r = e.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Ns(e, n, s, t, "", t);
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
function Ns(t, e, r, n, s, a, o, i, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, s, a, o, i, c, d);
    for (var l in n) {
      var f = n[l];
      if (Array.isArray(f)) {
        if (l in er.arrayKeywords)
          for (var g = 0; g < f.length; g++)
            Ns(t, e, r, f[g], s + "/" + l + "/" + g, a, s, l, n, g);
      } else if (l in er.propsKeywords) {
        if (f && typeof f == "object")
          for (var p in f)
            Ns(t, e, r, f[p], s + "/" + l + "/" + kg(p), a, s, l, n, p);
      } else (l in er.keywords || t.allKeys && !(l in er.skipKeywords)) && Ns(t, e, r, f, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, i, c, d);
  }
}
function kg(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Lg = gm.exports;
Object.defineProperty(Ve, "__esModule", { value: !0 });
Ve.getSchemaRefs = Ve.resolveUrl = Ve.normalizeId = Ve._getFullPath = Ve.getFullPath = Ve.inlineRef = void 0;
const Dg = B, Mg = sa, Vg = Lg, Fg = /* @__PURE__ */ new Set([
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
function qg(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !no(t) : e ? vm(t) <= e : !1;
}
Ve.inlineRef = qg;
const zg = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function no(t) {
  for (const e in t) {
    if (zg.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(no) || typeof r == "object" && no(r))
      return !0;
  }
  return !1;
}
function vm(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !Fg.has(r) && (typeof t[r] == "object" && (0, Dg.eachItem)(t[r], (n) => e += vm(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function _m(t, e = "", r) {
  r !== !1 && (e = Jr(e));
  const n = t.parse(e);
  return wm(t, n);
}
Ve.getFullPath = _m;
function wm(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
Ve._getFullPath = wm;
const Ug = /#\/?$/;
function Jr(t) {
  return t ? t.replace(Ug, "") : "";
}
Ve.normalizeId = Jr;
function Bg(t, e, r) {
  return r = Jr(r), t.resolve(e, r);
}
Ve.resolveUrl = Bg;
const Kg = /^[a-z_][-a-z0-9._]*$/i;
function Qg(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Jr(t[r] || e), a = { "": s }, o = _m(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return Vg(t, { allKeys: !0 }, (f, g, p, w) => {
    if (w === void 0)
      return;
    const $ = o + g;
    let v = a[w];
    typeof f[r] == "string" && (v = m.call(this, f[r])), b.call(this, f.$anchor), b.call(this, f.$dynamicAnchor), a[g] = v;
    function m(T) {
      const R = this.opts.uriResolver.resolve;
      if (T = Jr(v ? R(v, T) : T), c.has(T))
        throw l(T);
      c.add(T);
      let j = this.refs[T];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? d(f, j.schema, T) : T !== Jr($) && (T[0] === "#" ? (d(f, i[T], T), i[T] = f) : this.refs[T] = $), T;
    }
    function b(T) {
      if (typeof T == "string") {
        if (!Kg.test(T))
          throw new Error(`invalid anchor "${T}"`);
        m.call(this, `#${T}`);
      }
    }
  }), i;
  function d(f, g, p) {
    if (g !== void 0 && !Mg(f, g))
      throw l(p);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
Ve.getSchemaRefs = Qg;
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.getData = bt.KeywordCxt = bt.validateFunctionCode = void 0;
const bm = en, fl = je, Yo = Vt, Vs = je, Gg = na, Rn = Ot, Ca = nr, ee = ce, oe = lt, xg = Ve, Ft = B, vn = xn;
function Hg(t) {
  if (Nm(t) && (Pm(t), Em(t))) {
    Xg(t);
    return;
  }
  Sm(t, () => (0, bm.topBoolOrEmptySchema)(t));
}
bt.validateFunctionCode = Hg;
function Sm({ gen: t, validateName: e, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? t.func(e, (0, ee._)`${oe.default.data}, ${oe.default.valCxt}`, n.$async, () => {
    t.code((0, ee._)`"use strict"; ${hl(r, s)}`), Wg(t, s), t.code(a);
  }) : t.func(e, (0, ee._)`${oe.default.data}, ${Jg(s)}`, n.$async, () => t.code(hl(r, s)).code(a));
}
function Jg(t) {
  return (0, ee._)`{${oe.default.instancePath}="", ${oe.default.parentData}, ${oe.default.parentDataProperty}, ${oe.default.rootData}=${oe.default.data}${t.dynamicRef ? (0, ee._)`, ${oe.default.dynamicAnchors}={}` : ee.nil}}={}`;
}
function Wg(t, e) {
  t.if(oe.default.valCxt, () => {
    t.var(oe.default.instancePath, (0, ee._)`${oe.default.valCxt}.${oe.default.instancePath}`), t.var(oe.default.parentData, (0, ee._)`${oe.default.valCxt}.${oe.default.parentData}`), t.var(oe.default.parentDataProperty, (0, ee._)`${oe.default.valCxt}.${oe.default.parentDataProperty}`), t.var(oe.default.rootData, (0, ee._)`${oe.default.valCxt}.${oe.default.rootData}`), e.dynamicRef && t.var(oe.default.dynamicAnchors, (0, ee._)`${oe.default.valCxt}.${oe.default.dynamicAnchors}`);
  }, () => {
    t.var(oe.default.instancePath, (0, ee._)`""`), t.var(oe.default.parentData, (0, ee._)`undefined`), t.var(oe.default.parentDataProperty, (0, ee._)`undefined`), t.var(oe.default.rootData, oe.default.data), e.dynamicRef && t.var(oe.default.dynamicAnchors, (0, ee._)`{}`);
  });
}
function Xg(t) {
  const { schema: e, opts: r, gen: n } = t;
  Sm(t, () => {
    r.$comment && e.$comment && Om(t), r0(t), n.let(oe.default.vErrors, null), n.let(oe.default.errors, 0), r.unevaluated && Yg(t), Tm(t), a0(t);
  });
}
function Yg(t) {
  const { gen: e, validateName: r } = t;
  t.evaluated = e.const("evaluated", (0, ee._)`${r}.evaluated`), e.if((0, ee._)`${t.evaluated}.dynamicProps`, () => e.assign((0, ee._)`${t.evaluated}.props`, (0, ee._)`undefined`)), e.if((0, ee._)`${t.evaluated}.dynamicItems`, () => e.assign((0, ee._)`${t.evaluated}.items`, (0, ee._)`undefined`));
}
function hl(t, e) {
  const r = typeof t == "object" && t[e.schemaId];
  return r && (e.code.source || e.code.process) ? (0, ee._)`/*# sourceURL=${r} */` : ee.nil;
}
function Zg(t, e) {
  if (Nm(t) && (Pm(t), Em(t))) {
    e0(t, e);
    return;
  }
  (0, bm.boolOrEmptySchema)(t, e);
}
function Em({ schema: t, self: e }) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e.RULES.all[r])
      return !0;
  return !1;
}
function Nm(t) {
  return typeof t.schema != "boolean";
}
function e0(t, e) {
  const { schema: r, gen: n, opts: s } = t;
  s.$comment && r.$comment && Om(t), n0(t), s0(t);
  const a = n.const("_errs", oe.default.errors);
  Tm(t, a), n.var(e, (0, ee._)`${a} === ${oe.default.errors}`);
}
function Pm(t) {
  (0, Ft.checkUnknownRules)(t), t0(t);
}
function Tm(t, e) {
  if (t.opts.jtd)
    return ml(t, [], !1, e);
  const r = (0, fl.getSchemaTypes)(t.schema), n = (0, fl.coerceAndCheckDataType)(t, r);
  ml(t, r, !n, e);
}
function t0(t) {
  const { schema: e, errSchemaPath: r, opts: n, self: s } = t;
  e.$ref && n.ignoreKeywordsWithRef && (0, Ft.schemaHasRulesButRef)(e, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function r0(t) {
  const { schema: e, opts: r } = t;
  e.default !== void 0 && r.useDefaults && r.strictSchema && (0, Ft.checkStrictMode)(t, "default is ignored in the schema root");
}
function n0(t) {
  const e = t.schema[t.opts.schemaId];
  e && (t.baseId = (0, xg.resolveUrl)(t.opts.uriResolver, t.baseId, e));
}
function s0(t) {
  if (t.schema.$async && !t.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Om({ gen: t, schemaEnv: e, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    t.code((0, ee._)`${oe.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, ee.str)`${n}/$comment`, i = t.scopeValue("root", { ref: e.root });
    t.code((0, ee._)`${oe.default.self}.opts.$comment(${a}, ${o}, ${i}.schema)`);
  }
}
function a0(t) {
  const { gen: e, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = t;
  r.$async ? e.if((0, ee._)`${oe.default.errors} === 0`, () => e.return(oe.default.data), () => e.throw((0, ee._)`new ${s}(${oe.default.vErrors})`)) : (e.assign((0, ee._)`${n}.errors`, oe.default.vErrors), a.unevaluated && o0(t), e.return((0, ee._)`${oe.default.errors} === 0`));
}
function o0({ gen: t, evaluated: e, props: r, items: n }) {
  r instanceof ee.Name && t.assign((0, ee._)`${e}.props`, r), n instanceof ee.Name && t.assign((0, ee._)`${e}.items`, n);
}
function ml(t, e, r, n) {
  const { gen: s, schema: a, data: o, allErrors: i, opts: c, self: d } = t, { RULES: l } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, Ft.schemaHasRulesButRef)(a, l))) {
    s.block(() => jm(t, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || i0(t, e), s.block(() => {
    for (const g of l.rules)
      f(g);
    f(l.post);
  });
  function f(g) {
    (0, Yo.shouldUseGroup)(a, g) && (g.type ? (s.if((0, Vs.checkDataType)(g.type, o, c.strictNumbers)), pl(t, g), e.length === 1 && e[0] === g.type && r && (s.else(), (0, Vs.reportTypeError)(t)), s.endIf()) : pl(t, g), i || s.if((0, ee._)`${oe.default.errors} === ${n || 0}`));
  }
}
function pl(t, e) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = t;
  s && (0, Gg.assignDefaults)(t, e.type), r.block(() => {
    for (const a of e.rules)
      (0, Yo.shouldUseRule)(n, a) && jm(t, a.keyword, a.definition, e.type);
  });
}
function i0(t, e) {
  t.schemaEnv.meta || !t.opts.strictTypes || (c0(t, e), t.opts.allowUnionTypes || l0(t, e), u0(t, t.dataTypes));
}
function c0(t, e) {
  if (e.length) {
    if (!t.dataTypes.length) {
      t.dataTypes = e;
      return;
    }
    e.forEach((r) => {
      Rm(t.dataTypes, r) || Zo(t, `type "${r}" not allowed by context "${t.dataTypes.join(",")}"`);
    }), f0(t, e);
  }
}
function l0(t, e) {
  e.length > 1 && !(e.length === 2 && e.includes("null")) && Zo(t, "use allowUnionTypes to allow union type keyword");
}
function u0(t, e) {
  const r = t.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Yo.shouldUseRule)(t.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => d0(e, o)) && Zo(t, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function d0(t, e) {
  return t.includes(e) || e === "number" && t.includes("integer");
}
function Rm(t, e) {
  return t.includes(e) || e === "integer" && t.includes("number");
}
function f0(t, e) {
  const r = [];
  for (const n of t.dataTypes)
    Rm(e, n) ? r.push(n) : e.includes("integer") && n === "number" && r.push("integer");
  t.dataTypes = r;
}
function Zo(t, e) {
  const r = t.schemaEnv.baseId + t.errSchemaPath;
  e += ` at "${r}" (strictTypes)`, (0, Ft.checkStrictMode)(t, e, t.opts.strictTypes);
}
class Im {
  constructor(e, r, n) {
    if ((0, Rn.validateKeywordUsage)(e, r, n), this.gen = e.gen, this.allErrors = e.allErrors, this.keyword = n, this.data = e.data, this.schema = e.schema[n], this.$data = r.$data && e.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Ft.schemaRefOrVal)(e, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = e.schema, this.params = {}, this.it = e, this.def = r, this.$data)
      this.schemaCode = e.gen.const("vSchema", Cm(this.$data, e));
    else if (this.schemaCode = this.schemaValue, !(0, Rn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (e ? vn.reportExtraError : vn.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, vn.reportError)(this, this.def.$dataError || vn.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, vn.resetErrorsCount)(this.gen, this.errsCount);
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
        return (0, ee._)`${(0, Vs.checkDataTypes)(c, r, a.opts.strictNumbers, Vs.DataType.Wrong)}`;
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
    const n = (0, Ca.getSubschema)(this.it, e);
    (0, Ca.extendSubschemaData)(n, this.it, e), (0, Ca.extendSubschemaMode)(n, e);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Zg(s, r), s;
  }
  mergeEvaluated(e, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && e.props !== void 0 && (n.props = Ft.mergeEvaluated.props(s, e.props, n.props, r)), n.items !== !0 && e.items !== void 0 && (n.items = Ft.mergeEvaluated.items(s, e.items, n.items, r)));
  }
  mergeValidEvaluated(e, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(e, ee.Name)), !0;
  }
}
bt.KeywordCxt = Im;
function jm(t, e, r, n) {
  const s = new Im(t, r, e);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Rn.funcKeywordCode)(s, r) : "macro" in r ? (0, Rn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Rn.funcKeywordCode)(s, r);
}
const h0 = /^\/(?:[^~]|~0|~1)*$/, m0 = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Cm(t, { dataLevel: e, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (t === "")
    return oe.default.rootData;
  if (t[0] === "/") {
    if (!h0.test(t))
      throw new Error(`Invalid JSON-pointer: ${t}`);
    s = t, a = oe.default.rootData;
  } else {
    const d = m0.exec(t);
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
    d && (a = (0, ee._)`${a}${(0, ee.getProperty)((0, Ft.unescapeJsonPointer)(d))}`, o = (0, ee._)`${o} && ${a}`);
  return o;
  function c(d, l) {
    return `Cannot access ${d} ${l} levels up, current level is ${e}`;
  }
}
bt.getData = Cm;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
class p0 extends Error {
  constructor(e) {
    super("validation failed"), this.errors = e, this.ajv = this.validation = !0;
  }
}
Hn.default = p0;
var an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
const Aa = Ve;
let y0 = class extends Error {
  constructor(e, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Aa.resolveUrl)(e, r, n), this.missingSchema = (0, Aa.normalizeId)((0, Aa.getFullPath)(e, this.missingRef));
  }
};
an.default = y0;
var et = {};
Object.defineProperty(et, "__esModule", { value: !0 });
et.resolveSchema = et.getCompilingSchema = et.resolveRef = et.compileSchema = et.SchemaEnv = void 0;
const mt = ce, $0 = Hn, ur = lt, _t = Ve, yl = B, g0 = bt;
let aa = class {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, _t.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
et.SchemaEnv = aa;
function ei(t) {
  const e = Am.call(this, t);
  if (e)
    return e;
  const r = (0, _t.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new mt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: $0.default,
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
    this._compilations.add(t), (0, g0.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const f = o.toString();
    l = `${o.scopeRefs(ur.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, t));
    const p = new Function(`${ur.default.self}`, `${ur.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = t.schema, p.schemaEnv = t, t.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: f, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: $ } = d;
      p.evaluated = {
        props: w instanceof mt.Name ? void 0 : w,
        items: $ instanceof mt.Name ? void 0 : $,
        dynamicProps: w instanceof mt.Name,
        dynamicItems: $ instanceof mt.Name
      }, p.source && (p.source.evaluated = (0, mt.stringify)(p.evaluated));
    }
    return t.validate = p, t;
  } catch (f) {
    throw delete t.validate, delete t.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(t);
  }
}
et.compileSchema = ei;
function v0(t, e, r) {
  var n;
  r = (0, _t.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = b0.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new aa({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = _0.call(this, a);
}
et.resolveRef = v0;
function _0(t) {
  return (0, _t.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : ei.call(this, t);
}
function Am(t) {
  for (const e of this._compilations)
    if (w0(e, t))
      return e;
}
et.getCompilingSchema = Am;
function w0(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function b0(t, e) {
  let r;
  for (; typeof (r = this.refs[e]) == "string"; )
    e = r;
  return r || this.schemas[e] || oa.call(this, t, e);
}
function oa(t, e) {
  const r = this.opts.uriResolver.parse(e), n = (0, _t._getFullPath)(this.opts.uriResolver, r);
  let s = (0, _t.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
  if (Object.keys(t.schema).length > 0 && n === s)
    return ka.call(this, r, t);
  const a = (0, _t.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const i = oa.call(this, t, o);
    return typeof (i == null ? void 0 : i.schema) != "object" ? void 0 : ka.call(this, r, i);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || ei.call(this, o), a === (0, _t.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, d = i[c];
      return d && (s = (0, _t.resolveUrl)(this.opts.uriResolver, s, d)), new aa({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return ka.call(this, r, o);
  }
}
et.resolveSchema = oa;
const S0 = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function ka(t, { baseId: e, schema: r, root: n }) {
  var s;
  if (((s = t.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const i of t.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, yl.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !S0.has(i) && d && (e = (0, _t.resolveUrl)(this.opts.uriResolver, e, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, yl.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, _t.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = oa.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new aa({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const E0 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", N0 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", P0 = "object", T0 = [
  "$data"
], O0 = {
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
}, R0 = !1, I0 = {
  $id: E0,
  description: N0,
  type: P0,
  required: T0,
  properties: O0,
  additionalProperties: R0
};
var ti = {}, ia = { exports: {} };
const j0 = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), km = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), ri = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), Lm = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), C0 = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
function Dm(t) {
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
const A0 = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function $l(t) {
  return t.length = 0, !0;
}
function k0(t, e, r) {
  if (t.length) {
    const n = Dm(t);
    if (n !== "")
      e.push(n);
    else
      return r.error = !0, !1;
    t.length = 0;
  }
  return !0;
}
function L0(t) {
  let e = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, i = k0;
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
        i = $l;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (i === $l ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(Dm(s))), r.address = n.join(""), r;
}
function Mm(t) {
  if (D0(t, ":") < 2)
    return { host: t, isIPV6: !1 };
  const e = L0(t);
  if (e.error)
    return { host: t, isIPV6: !1 };
  {
    let r = e.address, n = e.address;
    return e.zone && (r += "%" + e.zone, n += "%25" + e.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function D0(t, e) {
  let r = 0;
  for (let n = 0; n < t.length; n++)
    t[n] === e && r++;
  return r;
}
function M0(t) {
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
const V0 = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, F0 = /[@/?#:]/g, q0 = /[@/?#]/g;
function Vm(t, e) {
  const r = e ? q0 : F0;
  return r.lastIndex = 0, t.replace(r, (n) => V0[n]);
}
function z0(t, e = !1) {
  if (t.indexOf("%") === -1)
    return t;
  let r = "";
  for (let n = 0; n < t.length; n++) {
    if (t[n] === "%" && n + 2 < t.length) {
      const s = t.slice(n + 1, n + 3);
      if (ri(s)) {
        const a = s.toUpperCase(), o = String.fromCharCode(parseInt(a, 16));
        e && Lm(o) ? r += o : r += "%" + a, n += 2;
        continue;
      }
    }
    r += t[n];
  }
  return r;
}
function U0(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    if (t[r] === "%" && r + 2 < t.length) {
      const n = t.slice(r + 1, r + 3);
      if (ri(n)) {
        const s = n.toUpperCase(), a = String.fromCharCode(parseInt(s, 16));
        a !== "." && Lm(a) ? e += a : e += "%" + s, r += 2;
        continue;
      }
    }
    C0(t[r]) ? e += t[r] : e += escape(t[r]);
  }
  return e;
}
function B0(t) {
  let e = "";
  for (let r = 0; r < t.length; r++) {
    if (t[r] === "%" && r + 2 < t.length) {
      const n = t.slice(r + 1, r + 3);
      if (ri(n)) {
        e += "%" + n.toUpperCase(), r += 2;
        continue;
      }
    }
    e += escape(t[r]);
  }
  return e;
}
function K0(t) {
  const e = [];
  if (t.userinfo !== void 0 && (e.push(t.userinfo), e.push("@")), t.host !== void 0) {
    let r = unescape(t.host);
    if (!km(r)) {
      const n = Mm(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = Vm(r, !1);
    }
    e.push(r);
  }
  return (typeof t.port == "number" || typeof t.port == "string") && (e.push(":"), e.push(String(t.port))), e.length ? e.join("") : void 0;
}
var Fm = {
  nonSimpleDomain: A0,
  recomposeAuthority: K0,
  reescapeHostDelimiters: Vm,
  normalizePercentEncoding: z0,
  normalizePathEncoding: U0,
  escapePreservingEscapes: B0,
  removeDotSegments: M0,
  isIPv4: km,
  isUUID: j0,
  normalizeIPv6: Mm
};
const { isUUID: Q0 } = Fm, G0 = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function qm(t) {
  return t.secure === !0 ? !0 : t.secure === !1 ? !1 : t.scheme ? t.scheme.length === 3 && (t.scheme[0] === "w" || t.scheme[0] === "W") && (t.scheme[1] === "s" || t.scheme[1] === "S") && (t.scheme[2] === "s" || t.scheme[2] === "S") : !1;
}
function zm(t) {
  return t.host || (t.error = t.error || "HTTP URIs must have a host."), t;
}
function Um(t) {
  const e = String(t.scheme).toLowerCase() === "https";
  return (t.port === (e ? 443 : 80) || t.port === "") && (t.port = void 0), t.path || (t.path = "/"), t;
}
function x0(t) {
  return t.secure = qm(t), t.resourceName = (t.path || "/") + (t.query ? "?" + t.query : ""), t.path = void 0, t.query = void 0, t;
}
function H0(t) {
  if ((t.port === (qm(t) ? 443 : 80) || t.port === "") && (t.port = void 0), typeof t.secure == "boolean" && (t.scheme = t.secure ? "wss" : "ws", t.secure = void 0), t.resourceName) {
    const [e, r] = t.resourceName.split("?");
    t.path = e && e !== "/" ? e : void 0, t.query = r, t.resourceName = void 0;
  }
  return t.fragment = void 0, t;
}
function J0(t, e) {
  if (!t.path)
    return t.error = "URN can not be parsed", t;
  const r = t.path.match(G0);
  if (r) {
    const n = e.scheme || t.scheme || "urn";
    t.nid = r[1].toLowerCase(), t.nss = r[2];
    const s = `${n}:${e.nid || t.nid}`, a = ni(s);
    t.path = void 0, a && (t = a.parse(t, e));
  } else
    t.error = t.error || "URN can not be parsed.";
  return t;
}
function W0(t, e) {
  if (t.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = e.scheme || t.scheme || "urn", n = t.nid.toLowerCase(), s = `${r}:${e.nid || n}`, a = ni(s);
  a && (t = a.serialize(t, e));
  const o = t, i = t.nss;
  return o.path = `${n || e.nid}:${i}`, e.skipEscape = !0, o;
}
function X0(t, e) {
  const r = t;
  return r.uuid = r.nss, r.nss = void 0, !e.tolerant && (!r.uuid || !Q0(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Y0(t) {
  const e = t;
  return e.nss = (t.uuid || "").toLowerCase(), e;
}
const Bm = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: zm,
    serialize: Um
  }
), Z0 = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Bm.domainHost,
    parse: zm,
    serialize: Um
  }
), Ps = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: x0,
    serialize: H0
  }
), ev = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Ps.domainHost,
    parse: Ps.parse,
    serialize: Ps.serialize
  }
), tv = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: J0,
    serialize: W0,
    skipNormalize: !0
  }
), rv = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: X0,
    serialize: Y0,
    skipNormalize: !0
  }
), Fs = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Bm,
    https: Z0,
    ws: Ps,
    wss: ev,
    urn: tv,
    "urn:uuid": rv
  }
);
Object.setPrototypeOf(Fs, null);
function ni(t) {
  return t && (Fs[
    /** @type {SchemeName} */
    t
  ] || Fs[
    /** @type {SchemeName} */
    t.toLowerCase()
  ]) || void 0;
}
var nv = {
  SCHEMES: Fs,
  getSchemeHandler: ni
};
const { normalizeIPv6: sv, removeDotSegments: En, recomposeAuthority: av, normalizePercentEncoding: ov, normalizePathEncoding: iv, escapePreservingEscapes: cv, reescapeHostDelimiters: lv, isIPv4: uv, nonSimpleDomain: dv } = Fm, { SCHEMES: fv, getSchemeHandler: Km } = nv;
function hv(t, e) {
  return typeof t == "string" ? t = /** @type {T} */
  gv(t, e) : typeof t == "object" && (t = /** @type {T} */
  tn(Er(t, e), e)), t;
}
function mv(t, e, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = Qm(tn(t, n), tn(e, n), n, !0);
  return n.skipEscape = !0, Er(s, n);
}
function Qm(t, e, r, n) {
  const s = {};
  return n || (t = tn(Er(t, r), r), e = tn(Er(e, r), r)), r = r || {}, !r.tolerant && e.scheme ? (s.scheme = e.scheme, s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = En(e.path || ""), s.query = e.query) : (e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0 ? (s.userinfo = e.userinfo, s.host = e.host, s.port = e.port, s.path = En(e.path || ""), s.query = e.query) : (e.path ? (e.path[0] === "/" ? s.path = En(e.path) : ((t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0) && !t.path ? s.path = "/" + e.path : t.path ? s.path = t.path.slice(0, t.path.lastIndexOf("/") + 1) + e.path : s.path = e.path, s.path = En(s.path)), s.query = e.query) : (s.path = t.path, e.query !== void 0 ? s.query = e.query : s.query = t.query), s.userinfo = t.userinfo, s.host = t.host, s.port = t.port), s.scheme = t.scheme), s.fragment = e.fragment, s;
}
function pv(t, e, r) {
  const n = gl(t, r), s = gl(e, r);
  return n !== void 0 && s !== void 0 && n.toLowerCase() === s.toLowerCase();
}
function Er(t, e) {
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
  }, n = Object.assign({}, e), s = [], a = Km(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = ov(r.path) : (r.path = cv(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = av(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let i = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (i = En(i)), o === void 0 && i[0] === "/" && i[1] === "/" && (i = "/%2F" + i.slice(2)), s.push(i);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const yv = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function $v(t, e) {
  if (e[2] !== void 0 && t.path && t.path[0] !== "/")
    return 'URI path must start with "/" when authority is present.';
  if (typeof t.port == "number" && (t.port < 0 || t.port > 65535))
    return "URI port is malformed.";
}
function Gm(t, e) {
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
  const o = t.match(yv);
  if (o) {
    n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5]);
    const i = $v(n, o);
    if (i !== void 0 && (n.error = n.error || i, s = !0), n.host)
      if (uv(n.host) === !1) {
        const l = sv(n.host);
        n.host = l.host.toLowerCase(), a = l.isIPV6;
      } else
        a = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const c = Km(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!c || !c.unicodeSupport) && n.host && (r.domainHost || c && c.domainHost) && a === !1 && dv(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (d) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + d;
      }
    if ((!c || c && !c.skipNormalize) && (t.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = lv(unescape(n.host), a))), n.path && (n.path = iv(n.path)), n.fragment))
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
function tn(t, e) {
  return Gm(t, e).parsed;
}
function gv(t, e) {
  return xm(t, e).normalized;
}
function xm(t, e) {
  const { parsed: r, malformedAuthorityOrPort: n } = Gm(t, e);
  return {
    normalized: n ? t : Er(r, e),
    malformedAuthorityOrPort: n
  };
}
function gl(t, e) {
  if (typeof t == "string") {
    const { normalized: r, malformedAuthorityOrPort: n } = xm(t, e);
    return n ? void 0 : r;
  }
  if (typeof t == "object")
    return Er(t, e);
}
const si = {
  SCHEMES: fv,
  normalize: hv,
  resolve: mv,
  resolveComponent: Qm,
  equal: pv,
  serialize: Er,
  parse: tn
};
ia.exports = si;
ia.exports.default = si;
ia.exports.fastUri = si;
var Hm = ia.exports;
Object.defineProperty(ti, "__esModule", { value: !0 });
const Jm = Hm;
Jm.code = 'require("ajv/dist/runtime/uri").default';
ti.default = Jm;
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
  const n = Hn, s = an, a = Sr, o = et, i = ce, c = Ve, d = je, l = B, f = I0, g = ti, p = (P, y) => new RegExp(P, y);
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
    var y, E, _, u, h, S, A, k, H, W, O, C, L, z, Y, ie, Pe, Xe, Ae, ke, Te, Nt, ze, ir, cr;
    const ht = P.strict, lr = (y = P.code) === null || y === void 0 ? void 0 : y.optimize, mn = lr === !0 || lr === void 0 ? 1 : lr || 0, pn = (_ = (E = P.code) === null || E === void 0 ? void 0 : E.regExp) !== null && _ !== void 0 ? _ : p, Ra = (u = P.uriResolver) !== null && u !== void 0 ? u : g.default;
    return {
      strictSchema: (S = (h = P.strictSchema) !== null && h !== void 0 ? h : ht) !== null && S !== void 0 ? S : !0,
      strictNumbers: (k = (A = P.strictNumbers) !== null && A !== void 0 ? A : ht) !== null && k !== void 0 ? k : !0,
      strictTypes: (W = (H = P.strictTypes) !== null && H !== void 0 ? H : ht) !== null && W !== void 0 ? W : "log",
      strictTuples: (C = (O = P.strictTuples) !== null && O !== void 0 ? O : ht) !== null && C !== void 0 ? C : "log",
      strictRequired: (z = (L = P.strictRequired) !== null && L !== void 0 ? L : ht) !== null && z !== void 0 ? z : !1,
      code: P.code ? { ...P.code, optimize: mn, regExp: pn } : { optimize: mn, regExp: pn },
      loopRequired: (Y = P.loopRequired) !== null && Y !== void 0 ? Y : b,
      loopEnum: (ie = P.loopEnum) !== null && ie !== void 0 ? ie : b,
      meta: (Pe = P.meta) !== null && Pe !== void 0 ? Pe : !0,
      messages: (Xe = P.messages) !== null && Xe !== void 0 ? Xe : !0,
      inlineRefs: (Ae = P.inlineRefs) !== null && Ae !== void 0 ? Ae : !0,
      schemaId: (ke = P.schemaId) !== null && ke !== void 0 ? ke : "$id",
      addUsedSchema: (Te = P.addUsedSchema) !== null && Te !== void 0 ? Te : !0,
      validateSchema: (Nt = P.validateSchema) !== null && Nt !== void 0 ? Nt : !0,
      validateFormats: (ze = P.validateFormats) !== null && ze !== void 0 ? ze : !0,
      unicodeRegExp: (ir = P.unicodeRegExp) !== null && ir !== void 0 ? ir : !0,
      int32range: (cr = P.int32range) !== null && cr !== void 0 ? cr : !0,
      uriResolver: Ra
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
      let u = f;
      _ === "id" && (u = { ...f }, u.id = u.$id, delete u.$id), E && y && this.addMetaSchema(u, u[_], !1);
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
        await h.call(this, W.$schema);
        const C = this._addSchema(W, O);
        return C.validate || S.call(this, C);
      }
      async function h(W) {
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
        this.refs[W] || await h.call(this, O.$schema), this.refs[W] || this.addSchema(O, W, E);
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
      let h;
      if (typeof y == "object") {
        const { schemaId: S } = this.opts;
        if (h = y[S], h !== void 0 && typeof h != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return E = (0, c.normalizeId)(E || h), this._checkUnique(E), this.schemas[E] = this._addSchema(y, _, E, u, !0), this;
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
        const h = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(h);
        else
          throw new Error(h);
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
        return (0, l.eachItem)(_, (h) => pe.call(this, h)), this;
      q.call(this, E);
      const u = {
        ...E,
        type: (0, d.getJSONTypes)(E.type),
        schemaType: (0, d.getJSONTypes)(E.schemaType)
      };
      return (0, l.eachItem)(_, u.type.length === 0 ? (h) => pe.call(this, h, u) : (h) => u.type.forEach((S) => pe.call(this, h, u, S))), this;
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
        const u = _.rules.findIndex((h) => h.keyword === y);
        u >= 0 && _.rules.splice(u, 1);
      }
      return this;
    }
    // Add format
    addFormat(y, E) {
      return typeof E == "string" && (E = new RegExp(E)), this.formats[y] = E, this;
    }
    errorsText(y = this.errors, { separator: E = ", ", dataVar: _ = "data" } = {}) {
      return !y || y.length === 0 ? "No errors" : y.map((u) => `${_}${u.instancePath} ${u.message}`).reduce((u, h) => u + E + h);
    }
    $dataMetaSchema(y, E) {
      const _ = this.RULES.all;
      y = JSON.parse(JSON.stringify(y));
      for (const u of E) {
        const h = u.split("/").slice(1);
        let S = y;
        for (const A of h)
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
    _addSchema(y, E, _, u = this.opts.validateSchema, h = this.opts.addUsedSchema) {
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
      return k = new o.SchemaEnv({ schema: y, schemaId: A, meta: E, baseId: _, localRefs: H }), this._cache.set(k.schema, k), h && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = k), u && this.validateSchema(y, !0), k;
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
      const h = u;
      h in y && this.logger[_](`${E}: option ${u}. ${P[h]}`);
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
    const { RULES: h } = this;
    let S = u ? h.post : h.rules.find(({ type: k }) => k === E);
    if (S || (S = { type: E, rules: [] }, h.rules.push(S)), h.keywords[P] = !0, !y)
      return;
    const A = {
      keyword: P,
      definition: {
        ...y,
        type: (0, d.getJSONTypes)(y.type),
        schemaType: (0, d.getJSONTypes)(y.schemaType)
      }
    };
    y.before ? Ne.call(this, S, A, y.before) : S.rules.push(A), h.all[P] = A, (_ = y.implements) === null || _ === void 0 || _.forEach((k) => this.addKeyword(k));
  }
  function Ne(P, y, E) {
    const _ = P.rules.findIndex((u) => u.keyword === E);
    _ >= 0 ? P.rules.splice(_, 0, y) : (P.rules.push(y), this.logger.warn(`rule ${E} is not defined`));
  }
  function q(P) {
    let { metaSchema: y } = P;
    y !== void 0 && (P.$data && this.opts.$data && (y = J(y)), P.validateSchema = this.compile(y, !0));
  }
  const F = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(P) {
    return { anyOf: [P, F] };
  }
})(rm);
var ai = {}, oi = {}, ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const vv = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ii.default = vv;
var zt = {};
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.callRef = zt.getValidate = void 0;
const _v = an, vl = he, rt = ce, Dr = lt, _l = et, ns = B, wv = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return f();
    const l = _l.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new _v.default(n.opts.uriResolver, s, r);
    if (l instanceof _l.SchemaEnv)
      return g(l);
    return p(l);
    function f() {
      if (a === d)
        return Ts(t, o, a, a.$async);
      const w = e.scopeValue("root", { ref: d });
      return Ts(t, (0, rt._)`${w}.validate`, d, d.$async);
    }
    function g(w) {
      const $ = Wm(t, w);
      Ts(t, $, w, w.$async);
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
function Wm(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, rt._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
zt.getValidate = Wm;
function Ts(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, d = c.passContext ? Dr.default.this : rt.nil;
  n ? l() : f();
  function l() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, rt._)`await ${(0, vl.callValidateCode)(t, e, d)}`), p(e), o || s.assign(w, !0);
    }, ($) => {
      s.if((0, rt._)`!(${$} instanceof ${a.ValidationError})`, () => s.throw($)), g($), o || s.assign(w, !1);
    }), t.ok(w);
  }
  function f() {
    t.result((0, vl.callValidateCode)(t, e, d), () => p(e), () => g(e));
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
        v.props !== void 0 && (a.props = ns.mergeEvaluated.props(s, v.props, a.props));
      else {
        const m = s.var("props", (0, rt._)`${w}.evaluated.props`);
        a.props = ns.mergeEvaluated.props(s, m, a.props, rt.Name);
      }
    if (a.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (a.items = ns.mergeEvaluated.items(s, v.items, a.items));
      else {
        const m = s.var("items", (0, rt._)`${w}.evaluated.items`);
        a.items = ns.mergeEvaluated.items(s, m, a.items, rt.Name);
      }
  }
}
zt.callRef = Ts;
zt.default = wv;
Object.defineProperty(oi, "__esModule", { value: !0 });
const bv = ii, Sv = zt, Ev = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  bv.default,
  Sv.default
];
oi.default = Ev;
var ci = {}, li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
const qs = ce, xt = qs.operators, zs = {
  maximum: { okStr: "<=", ok: xt.LTE, fail: xt.GT },
  minimum: { okStr: ">=", ok: xt.GTE, fail: xt.LT },
  exclusiveMaximum: { okStr: "<", ok: xt.LT, fail: xt.GTE },
  exclusiveMinimum: { okStr: ">", ok: xt.GT, fail: xt.LTE }
}, Nv = {
  message: ({ keyword: t, schemaCode: e }) => (0, qs.str)`must be ${zs[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, qs._)`{comparison: ${zs[t].okStr}, limit: ${e}}`
}, Pv = {
  keyword: Object.keys(zs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Nv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, qs._)`${r} ${zs[e].fail} ${n} || isNaN(${r})`);
  }
};
li.default = Pv;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
const In = ce, Tv = {
  message: ({ schemaCode: t }) => (0, In.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, In._)`{multipleOf: ${t}}`
}, Ov = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Tv,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, In._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, In._)`${o} !== parseInt(${o})`;
    t.fail$data((0, In._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
ui.default = Ov;
var di = {}, fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
function Xm(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
fi.default = Xm;
Xm.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(di, "__esModule", { value: !0 });
const mr = ce, Rv = B, Iv = fi, jv = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, mr.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, mr._)`{limit: ${t}}`
}, Cv = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: jv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? mr.operators.GT : mr.operators.LT, o = s.opts.unicode === !1 ? (0, mr._)`${r}.length` : (0, mr._)`${(0, Rv.useFunc)(t.gen, Iv.default)}(${r})`;
    t.fail$data((0, mr._)`${o} ${a} ${n}`);
  }
};
di.default = Cv;
var hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
const Av = he, kv = B, Qr = ce, Lv = {
  message: ({ schemaCode: t }) => (0, Qr.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, Qr._)`{pattern: ${t}}`
}, Dv = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Lv,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t, i = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Qr._)`new RegExp` : (0, kv.useFunc)(e, c), l = e.let("valid");
      e.try(() => e.assign(l, (0, Qr._)`${d}(${a}, ${i}).test(${r})`), () => e.assign(l, !1)), t.fail$data((0, Qr._)`!${l}`);
    } else {
      const c = (0, Av.usePattern)(t, s);
      t.fail$data((0, Qr._)`!${c}.test(${r})`);
    }
  }
};
hi.default = Dv;
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
const jn = ce, Mv = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, jn.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, jn._)`{limit: ${t}}`
}, Vv = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Mv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? jn.operators.GT : jn.operators.LT;
    t.fail$data((0, jn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
mi.default = Vv;
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
const _n = he, Cn = ce, Fv = B, qv = {
  message: ({ params: { missingProperty: t } }) => (0, Cn.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, Cn._)`{missingProperty: ${t}}`
}, zv = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: qv,
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
          (0, Fv.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        t.block$data(Cn.nil, f);
      else
        for (const p of r)
          (0, _n.checkReportMissingProp)(t, p);
    }
    function l() {
      const p = e.let("missing");
      if (c || a) {
        const w = e.let("valid", !0);
        t.block$data(w, () => g(p, w)), t.ok(w);
      } else
        e.if((0, _n.checkMissingProp)(t, r, p)), (0, _n.reportMissingProp)(t, p), e.else();
    }
    function f() {
      e.forOf("prop", n, (p) => {
        t.setParams({ missingProperty: p }), e.if((0, _n.noPropertyInData)(e, s, p, i.ownProperties), () => t.error());
      });
    }
    function g(p, w) {
      t.setParams({ missingProperty: p }), e.forOf(p, n, () => {
        e.assign(w, (0, _n.propertyInData)(e, s, p, i.ownProperties)), e.if((0, Cn.not)(w), () => {
          t.error(), e.break();
        });
      }, Cn.nil);
    }
  }
};
pi.default = zv;
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const An = ce, Uv = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, An.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, An._)`{limit: ${t}}`
}, Bv = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Uv,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? An.operators.GT : An.operators.LT;
    t.fail$data((0, An._)`${r}.length ${s} ${n}`);
  }
};
yi.default = Bv;
var $i = {}, Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
const Ym = sa;
Ym.code = 'require("ajv/dist/runtime/equal").default';
Jn.default = Ym;
Object.defineProperty($i, "__esModule", { value: !0 });
const La = je, De = ce, Kv = B, Qv = Jn, Gv = {
  message: ({ params: { i: t, j: e } }) => (0, De.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, De._)`{i: ${t}, j: ${e}}`
}, xv = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Gv,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: i } = t;
    if (!n && !s)
      return;
    const c = e.let("valid"), d = a.items ? (0, La.getSchemaTypes)(a.items) : [];
    t.block$data(c, l, (0, De._)`${o} === false`), t.ok(c);
    function l() {
      const w = e.let("i", (0, De._)`${r}.length`), $ = e.let("j");
      t.setParams({ i: w, j: $ }), e.assign(c, !0), e.if((0, De._)`${w} > 1`, () => (f() ? g : p)(w, $));
    }
    function f() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function g(w, $) {
      const v = e.name("item"), m = (0, La.checkDataTypes)(d, v, i.opts.strictNumbers, La.DataType.Wrong), b = e.const("indices", (0, De._)`{}`);
      e.for((0, De._)`;${w}--;`, () => {
        e.let(v, (0, De._)`${r}[${w}]`), e.if(m, (0, De._)`continue`), d.length > 1 && e.if((0, De._)`typeof ${v} == "string"`, (0, De._)`${v} += "_"`), e.if((0, De._)`typeof ${b}[${v}] == "number"`, () => {
          e.assign($, (0, De._)`${b}[${v}]`), t.error(), e.assign(c, !1).break();
        }).code((0, De._)`${b}[${v}] = ${w}`);
      });
    }
    function p(w, $) {
      const v = (0, Kv.useFunc)(e, Qv.default), m = e.name("outer");
      e.label(m).for((0, De._)`;${w}--;`, () => e.for((0, De._)`${$} = ${w}; ${$}--;`, () => e.if((0, De._)`${v}(${r}[${w}], ${r}[${$}])`, () => {
        t.error(), e.assign(c, !1).break(m);
      })));
    }
  }
};
$i.default = xv;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
const so = ce, Hv = B, Jv = Jn, Wv = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, so._)`{allowedValue: ${t}}`
}, Xv = {
  keyword: "const",
  $data: !0,
  error: Wv,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, so._)`!${(0, Hv.useFunc)(e, Jv.default)}(${r}, ${s})`) : t.fail((0, so._)`${a} !== ${r}`);
  }
};
gi.default = Xv;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
const Nn = ce, Yv = B, Zv = Jn, e_ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, Nn._)`{allowedValues: ${t}}`
}, t_ = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: e_,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Yv.useFunc)(e, Zv.default));
    let l;
    if (i || n)
      l = e.let("valid"), t.block$data(l, f);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const p = e.const("vSchema", a);
      l = (0, Nn.or)(...s.map((w, $) => g(p, $)));
    }
    t.pass(l);
    function f() {
      e.assign(l, !1), e.forOf("v", a, (p) => e.if((0, Nn._)`${d()}(${r}, ${p})`, () => e.assign(l, !0).break()));
    }
    function g(p, w) {
      const $ = s[w];
      return typeof $ == "object" && $ !== null ? (0, Nn._)`${d()}(${r}, ${p}[${w}])` : (0, Nn._)`${r} === ${$}`;
    }
  }
};
vi.default = t_;
Object.defineProperty(ci, "__esModule", { value: !0 });
const r_ = li, n_ = ui, s_ = di, a_ = hi, o_ = mi, i_ = pi, c_ = yi, l_ = $i, u_ = gi, d_ = vi, f_ = [
  // number
  r_.default,
  n_.default,
  // string
  s_.default,
  a_.default,
  // object
  o_.default,
  i_.default,
  // array
  c_.default,
  l_.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  u_.default,
  d_.default
];
ci.default = f_;
var _i = {}, on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.validateAdditionalItems = void 0;
const pr = ce, ao = B, h_ = {
  message: ({ params: { len: t } }) => (0, pr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, pr._)`{limit: ${t}}`
}, m_ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: h_,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, ao.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Zm(t, n);
  }
};
function Zm(t, e) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = t;
  o.items = !0;
  const i = r.const("len", (0, pr._)`${s}.length`);
  if (n === !1)
    t.setParams({ len: e.length }), t.pass((0, pr._)`${i} <= ${e.length}`);
  else if (typeof n == "object" && !(0, ao.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, pr._)`${i} <= ${e.length}`);
    r.if((0, pr.not)(d), () => c(d)), t.ok(d);
  }
  function c(d) {
    r.forRange("i", e.length, i, (l) => {
      t.subschema({ keyword: a, dataProp: l, dataPropType: ao.Type.Num }, d), o.allErrors || r.if((0, pr.not)(d), () => r.break());
    });
  }
}
on.validateAdditionalItems = Zm;
on.default = m_;
var wi = {}, cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.validateTuple = void 0;
const wl = ce, Os = B, p_ = he, y_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return ep(t, "additionalItems", e);
    r.items = !0, !(0, Os.alwaysValidSchema)(r, e) && t.ok((0, p_.validateArray)(t));
  }
};
function ep(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  l(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = Os.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), d = n.const("len", (0, wl._)`${a}.length`);
  r.forEach((f, g) => {
    (0, Os.alwaysValidSchema)(i, f) || (n.if((0, wl._)`${d} > ${g}`, () => t.subschema({
      keyword: o,
      schemaProp: g,
      dataProp: g
    }, c)), t.ok(c));
  });
  function l(f) {
    const { opts: g, errSchemaPath: p } = i, w = r.length, $ = w === f.minItems && (w === f.maxItems || f[e] === !1);
    if (g.strictTuples && !$) {
      const v = `"${o}" is ${w}-tuple, but minItems or maxItems/${e} are not specified or different at path "${p}"`;
      (0, Os.checkStrictMode)(i, v, g.strictTuples);
    }
  }
}
cn.validateTuple = ep;
cn.default = y_;
Object.defineProperty(wi, "__esModule", { value: !0 });
const $_ = cn, g_ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, $_.validateTuple)(t, "items")
};
wi.default = g_;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
const bl = ce, v_ = B, __ = he, w_ = on, b_ = {
  message: ({ params: { len: t } }) => (0, bl.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, bl._)`{limit: ${t}}`
}, S_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: b_,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, v_.alwaysValidSchema)(n, e) && (s ? (0, w_.validateAdditionalItems)(t, s) : t.ok((0, __.validateArray)(t)));
  }
};
bi.default = S_;
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
const ut = ce, ss = B, E_ = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, ut.str)`must contain at least ${t} valid item(s)` : (0, ut.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, ut._)`{minContains: ${t}}` : (0, ut._)`{minContains: ${t}, maxContains: ${e}}`
}, N_ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: E_,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    let o, i;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, i = d) : o = 1;
    const l = e.const("len", (0, ut._)`${s}.length`);
    if (t.setParams({ min: o, max: i }), i === void 0 && o === 0) {
      (0, ss.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (i !== void 0 && o > i) {
      (0, ss.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), t.fail();
      return;
    }
    if ((0, ss.alwaysValidSchema)(a, r)) {
      let $ = (0, ut._)`${l} >= ${o}`;
      i !== void 0 && ($ = (0, ut._)`${$} && ${l} <= ${i}`), t.pass($);
      return;
    }
    a.items = !0;
    const f = e.name("valid");
    i === void 0 && o === 1 ? p(f, () => e.if(f, () => e.break())) : o === 0 ? (e.let(f, !0), i !== void 0 && e.if((0, ut._)`${s}.length > 0`, g)) : (e.let(f, !1), g()), t.result(f, () => t.reset());
    function g() {
      const $ = e.name("_valid"), v = e.let("count", 0);
      p($, () => e.if($, () => w(v)));
    }
    function p($, v) {
      e.forRange("i", 0, l, (m) => {
        t.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: ss.Type.Num,
          compositeRule: !0
        }, $), v();
      });
    }
    function w($) {
      e.code((0, ut._)`${$}++`), i === void 0 ? e.if((0, ut._)`${$} >= ${o}`, () => e.assign(f, !0).break()) : (e.if((0, ut._)`${$} > ${i}`, () => e.assign(f, !1).break()), o === 1 ? e.assign(f, !0) : e.if((0, ut._)`${$} >= ${o}`, () => e.assign(f, !0)));
    }
  }
};
Si.default = N_;
var ca = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.validateSchemaDeps = t.validatePropertyDeps = t.error = void 0;
  const e = ce, r = B, n = he;
  t.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const f = d === 1 ? "property" : "properties";
      return (0, e.str)`must have ${f} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: f } }) => (0, e._)`{property: ${c},
    missingProperty: ${f},
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
    for (const f in c) {
      if (f === "__proto__")
        continue;
      const g = Array.isArray(c[f]) ? d : l;
      g[f] = c[f];
    }
    return [d, l];
  }
  function o(c, d = c.schema) {
    const { gen: l, data: f, it: g } = c;
    if (Object.keys(d).length === 0)
      return;
    const p = l.let("missing");
    for (const w in d) {
      const $ = d[w];
      if ($.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, f, w, g.opts.ownProperties);
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
    const { gen: l, data: f, keyword: g, it: p } = c, w = l.name("valid");
    for (const $ in d)
      (0, r.alwaysValidSchema)(p, d[$]) || (l.if(
        (0, n.propertyInData)(l, f, $, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: g, schemaProp: $ }, w);
          c.mergeValidEvaluated(v, w);
        },
        () => l.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  t.validateSchemaDeps = i, t.default = s;
})(ca);
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
const tp = ce, P_ = B, T_ = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, tp._)`{propertyName: ${t.propertyName}}`
}, O_ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: T_,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, P_.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, tp.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
Ei.default = O_;
var la = {};
Object.defineProperty(la, "__esModule", { value: !0 });
const as = he, $t = ce, R_ = lt, os = B, I_ = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, $t._)`{additionalProperty: ${t.additionalProperty}}`
}, j_ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: I_,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, os.alwaysValidSchema)(o, r))
      return;
    const d = (0, as.allSchemaProperties)(n.properties), l = (0, as.allSchemaProperties)(n.patternProperties);
    f(), t.ok((0, $t._)`${a} === ${R_.default.errors}`);
    function f() {
      e.forIn("key", s, (v) => {
        !d.length && !l.length ? w(v) : e.if(g(v), () => w(v));
      });
    }
    function g(v) {
      let m;
      if (d.length > 8) {
        const b = (0, os.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, as.isOwnProperty)(e, b, v);
      } else d.length ? m = (0, $t.or)(...d.map((b) => (0, $t._)`${v} === ${b}`)) : m = $t.nil;
      return l.length && (m = (0, $t.or)(m, ...l.map((b) => (0, $t._)`${(0, as.usePattern)(t, b)}.test(${v})`))), (0, $t.not)(m);
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
      if (typeof r == "object" && !(0, os.alwaysValidSchema)(o, r)) {
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
        dataPropType: os.Type.Str
      };
      b === !1 && Object.assign(T, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), t.subschema(T, m);
    }
  }
};
la.default = j_;
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
const C_ = bt, Sl = he, Da = B, El = la, A_ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && El.default.code(new C_.KeywordCxt(a, El.default, "additionalProperties"));
    const o = (0, Sl.allSchemaProperties)(r);
    for (const f of o)
      a.definedProperties.add(f);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Da.mergeEvaluated.props(e, (0, Da.toHash)(o), a.props));
    const i = o.filter((f) => !(0, Da.alwaysValidSchema)(a, r[f]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const f of i)
      d(f) ? l(f) : (e.if((0, Sl.propertyInData)(e, s, f, a.opts.ownProperties)), l(f), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(f), t.ok(c);
    function d(f) {
      return a.opts.useDefaults && !a.compositeRule && r[f].default !== void 0;
    }
    function l(f) {
      t.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, c);
    }
  }
};
Ni.default = A_;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
const Nl = he, is = ce, Pl = B, Tl = B, k_ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, Nl.allSchemaProperties)(r), c = i.filter(($) => (0, Pl.alwaysValidSchema)(a, r[$]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = e.name("valid");
    a.props !== !0 && !(a.props instanceof is.Name) && (a.props = (0, Tl.evaluatedPropsToName)(e, a.props));
    const { props: f } = a;
    g();
    function g() {
      for (const $ of i)
        d && p($), a.allErrors ? w($) : (e.var(l, !0), w($), e.if(l));
    }
    function p($) {
      for (const v in d)
        new RegExp($).test(v) && (0, Pl.checkStrictMode)(a, `property ${v} matches pattern ${$} (use allowMatchingProperties)`);
    }
    function w($) {
      e.forIn("key", n, (v) => {
        e.if((0, is._)`${(0, Nl.usePattern)(t, $)}.test(${v})`, () => {
          const m = c.includes($);
          m || t.subschema({
            keyword: "patternProperties",
            schemaProp: $,
            dataProp: v,
            dataPropType: Tl.Type.Str
          }, l), a.opts.unevaluated && f !== !0 ? e.assign((0, is._)`${f}[${v}]`, !0) : !m && !a.allErrors && e.if((0, is.not)(l), () => e.break());
        });
      });
    }
  }
};
Pi.default = k_;
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
const L_ = B, D_ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, L_.alwaysValidSchema)(n, r)) {
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
Ti.default = D_;
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
const M_ = he, V_ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: M_.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Oi.default = V_;
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
const Rs = ce, F_ = B, q_ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, Rs._)`{passingSchemas: ${t.passing}}`
}, z_ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: q_,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, it: s } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = e.let("valid", !1), i = e.let("passing", null), c = e.name("_valid");
    t.setParams({ passing: i }), e.block(d), t.result(o, () => t.reset(), () => t.error(!0));
    function d() {
      a.forEach((l, f) => {
        let g;
        (0, F_.alwaysValidSchema)(s, l) ? e.var(c, !0) : g = t.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && e.if((0, Rs._)`${c} && ${o}`).assign(o, !1).assign(i, (0, Rs._)`[${i}, ${f}]`).else(), e.if(c, () => {
          e.assign(o, !0), e.assign(i, f), g && t.mergeEvaluated(g, Rs.Name);
        });
      });
    }
  }
};
Ri.default = z_;
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
const U_ = B, B_ = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, U_.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
Ii.default = B_;
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
const Us = ce, rp = B, K_ = {
  message: ({ params: t }) => (0, Us.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, Us._)`{failingKeyword: ${t.ifClause}}`
}, Q_ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: K_,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, rp.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Ol(n, "then"), a = Ol(n, "else");
    if (!s && !a)
      return;
    const o = e.let("valid", !0), i = e.name("_valid");
    if (c(), t.reset(), s && a) {
      const l = e.let("ifClause");
      t.setParams({ ifClause: l }), e.if(i, d("then", l), d("else", l));
    } else s ? e.if(i, d("then")) : e.if((0, Us.not)(i), d("else"));
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
    function d(l, f) {
      return () => {
        const g = t.subschema({ keyword: l }, i);
        e.assign(o, i), t.mergeValidEvaluated(g, o), f ? e.assign(f, (0, Us._)`${l}`) : t.setParams({ ifClause: l });
      };
    }
  }
};
function Ol(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, rp.alwaysValidSchema)(t, r);
}
ji.default = Q_;
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
const G_ = B, x_ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, G_.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
Ci.default = x_;
Object.defineProperty(_i, "__esModule", { value: !0 });
const H_ = on, J_ = wi, W_ = cn, X_ = bi, Y_ = Si, Z_ = ca, ew = Ei, tw = la, rw = Ni, nw = Pi, sw = Ti, aw = Oi, ow = Ri, iw = Ii, cw = ji, lw = Ci;
function uw(t = !1) {
  const e = [
    // any
    sw.default,
    aw.default,
    ow.default,
    iw.default,
    cw.default,
    lw.default,
    // object
    ew.default,
    tw.default,
    Z_.default,
    rw.default,
    nw.default
  ];
  return t ? e.push(J_.default, X_.default) : e.push(H_.default, W_.default), e.push(Y_.default), e;
}
_i.default = uw;
var Ai = {}, ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.dynamicAnchor = void 0;
const Ma = ce, dw = lt, Rl = et, fw = zt, hw = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (t) => np(t, t.schema)
};
function np(t, e) {
  const { gen: r, it: n } = t;
  n.schemaEnv.root.dynamicAnchors[e] = !0;
  const s = (0, Ma._)`${dw.default.dynamicAnchors}${(0, Ma.getProperty)(e)}`, a = n.errSchemaPath === "#" ? n.validateName : mw(t);
  r.if((0, Ma._)`!${s}`, () => r.assign(s, a));
}
ln.dynamicAnchor = np;
function mw(t) {
  const { schemaEnv: e, schema: r, self: n } = t.it, { root: s, baseId: a, localRefs: o, meta: i } = e.root, { schemaId: c } = n.opts, d = new Rl.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: i });
  return Rl.compileSchema.call(n, d), (0, fw.getValidate)(t, d);
}
ln.default = hw;
var un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
un.dynamicRef = void 0;
const Il = ce, pw = lt, jl = zt, yw = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (t) => sp(t, t.schema)
};
function sp(t, e) {
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
      const d = r.let("_v", (0, Il._)`${pw.default.dynamicAnchors}${(0, Il.getProperty)(a)}`);
      r.if(d, i(d, c), i(s.validateName, c));
    } else
      i(s.validateName, c)();
  }
  function i(c, d) {
    return d ? () => r.block(() => {
      (0, jl.callRef)(t, c), r.let(d, !0);
    }) : () => (0, jl.callRef)(t, c);
  }
}
un.dynamicRef = sp;
un.default = yw;
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
const $w = ln, gw = B, vw = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(t) {
    t.schema ? (0, $w.dynamicAnchor)(t, "") : (0, gw.checkStrictMode)(t.it, "$recursiveAnchor: false is ignored");
  }
};
ki.default = vw;
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
const _w = un, ww = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (t) => (0, _w.dynamicRef)(t, t.schema)
};
Li.default = ww;
Object.defineProperty(Ai, "__esModule", { value: !0 });
const bw = ln, Sw = un, Ew = ki, Nw = Li, Pw = [bw.default, Sw.default, Ew.default, Nw.default];
Ai.default = Pw;
var Di = {}, Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
const Cl = ca, Tw = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Cl.error,
  code: (t) => (0, Cl.validatePropertyDeps)(t)
};
Mi.default = Tw;
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
const Ow = ca, Rw = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (t) => (0, Ow.validateSchemaDeps)(t)
};
Vi.default = Rw;
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
const Iw = B, jw = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: t, parentSchema: e, it: r }) {
    e.contains === void 0 && (0, Iw.checkStrictMode)(r, `"${t}" without "contains" is ignored`);
  }
};
Fi.default = jw;
Object.defineProperty(Di, "__esModule", { value: !0 });
const Cw = Mi, Aw = Vi, kw = Fi, Lw = [Cw.default, Aw.default, kw.default];
Di.default = Lw;
var qi = {}, zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
const Wt = ce, Al = B, Dw = lt, Mw = {
  message: "must NOT have unevaluated properties",
  params: ({ params: t }) => (0, Wt._)`{unevaluatedProperty: ${t.unevaluatedProperty}}`
}, Vw = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Mw,
  code(t) {
    const { gen: e, schema: r, data: n, errsCount: s, it: a } = t;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: i } = a;
    i instanceof Wt.Name ? e.if((0, Wt._)`${i} !== true`, () => e.forIn("key", n, (f) => e.if(d(i, f), () => c(f)))) : i !== !0 && e.forIn("key", n, (f) => i === void 0 ? c(f) : e.if(l(i, f), () => c(f))), a.props = !0, t.ok((0, Wt._)`${s} === ${Dw.default.errors}`);
    function c(f) {
      if (r === !1) {
        t.setParams({ unevaluatedProperty: f }), t.error(), o || e.break();
        return;
      }
      if (!(0, Al.alwaysValidSchema)(a, r)) {
        const g = e.name("valid");
        t.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: Al.Type.Str
        }, g), o || e.if((0, Wt.not)(g), () => e.break());
      }
    }
    function d(f, g) {
      return (0, Wt._)`!${f} || !${f}[${g}]`;
    }
    function l(f, g) {
      const p = [];
      for (const w in f)
        f[w] === !0 && p.push((0, Wt._)`${g} !== ${w}`);
      return (0, Wt.and)(...p);
    }
  }
};
zi.default = Vw;
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
const yr = ce, kl = B, Fw = {
  message: ({ params: { len: t } }) => (0, yr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, yr._)`{limit: ${t}}`
}, qw = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Fw,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t, a = s.items || 0;
    if (a === !0)
      return;
    const o = e.const("len", (0, yr._)`${n}.length`);
    if (r === !1)
      t.setParams({ len: a }), t.fail((0, yr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, kl.alwaysValidSchema)(s, r)) {
      const c = e.var("valid", (0, yr._)`${o} <= ${a}`);
      e.if((0, yr.not)(c), () => i(c, a)), t.ok(c);
    }
    s.items = !0;
    function i(c, d) {
      e.forRange("i", d, o, (l) => {
        t.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: kl.Type.Num }, c), s.allErrors || e.if((0, yr.not)(c), () => e.break());
      });
    }
  }
};
Ui.default = qw;
Object.defineProperty(qi, "__esModule", { value: !0 });
const zw = zi, Uw = Ui, Bw = [zw.default, Uw.default];
qi.default = Bw;
var Bi = {}, Ki = {};
Object.defineProperty(Ki, "__esModule", { value: !0 });
const Oe = ce, Kw = {
  message: ({ schemaCode: t }) => (0, Oe.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, Oe._)`{format: ${t}}`
}, Qw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Kw,
  code(t, e) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t, { opts: c, errSchemaPath: d, schemaEnv: l, self: f } = i;
    if (!c.validateFormats)
      return;
    s ? g() : p();
    function g() {
      const w = r.scopeValue("formats", {
        ref: f.formats,
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
      const w = f.formats[a];
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
          f.logger.warn(j());
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
Ki.default = Qw;
Object.defineProperty(Bi, "__esModule", { value: !0 });
const Gw = Ki, xw = [Gw.default];
Bi.default = xw;
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
Object.defineProperty(ai, "__esModule", { value: !0 });
const Hw = oi, Jw = ci, Ww = _i, Xw = Ai, Yw = Di, Zw = qi, eb = Bi, Ll = rn, tb = [
  Xw.default,
  Hw.default,
  Jw.default,
  (0, Ww.default)(!0),
  eb.default,
  Ll.metadataVocabulary,
  Ll.contentVocabulary,
  Yw.default,
  Zw.default
];
ai.default = tb;
var Qi = {}, ua = {};
Object.defineProperty(ua, "__esModule", { value: !0 });
ua.DiscrError = void 0;
var Dl;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(Dl || (ua.DiscrError = Dl = {}));
Object.defineProperty(Qi, "__esModule", { value: !0 });
const qr = ce, oo = ua, Ml = et, rb = an, nb = B, sb = {
  message: ({ params: { discrError: t, tagName: e } }) => t === oo.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, qr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, ab = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: sb,
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
    e.if((0, qr._)`typeof ${d} == "string"`, () => l(), () => t.error(!1, { discrError: oo.DiscrError.Tag, tag: d, tagName: i })), t.ok(c);
    function l() {
      const p = g();
      e.if(!1);
      for (const w in p)
        e.elseIf((0, qr._)`${d} === ${w}`), e.assign(c, f(p[w]));
      e.else(), t.error(!1, { discrError: oo.DiscrError.Mapping, tag: d, tagName: i }), e.endIf();
    }
    function f(p) {
      const w = e.name("valid"), $ = t.subschema({ keyword: "oneOf", schemaProp: p }, w);
      return t.mergeEvaluated($, qr.Name), w;
    }
    function g() {
      var p;
      const w = {}, $ = m(s);
      let v = !0;
      for (let R = 0; R < o.length; R++) {
        let j = o[R];
        if (j != null && j.$ref && !(0, nb.schemaHasRulesButRef)(j, a.self.RULES)) {
          const M = j.$ref;
          if (j = Ml.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, M), j instanceof Ml.SchemaEnv && (j = j.schema), j === void 0)
            throw new rb.default(a.opts.uriResolver, a.baseId, M);
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
Qi.default = ab;
var Gi = {};
const ob = "https://json-schema.org/draft/2020-12/schema", ib = "https://json-schema.org/draft/2020-12/schema", cb = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, lb = "meta", ub = "Core and Validation specifications meta-schema", db = [
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
], fb = [
  "object",
  "boolean"
], hb = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", mb = {
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
}, pb = {
  $schema: ob,
  $id: ib,
  $vocabulary: cb,
  $dynamicAnchor: lb,
  title: ub,
  allOf: db,
  type: fb,
  $comment: hb,
  properties: mb
}, yb = "https://json-schema.org/draft/2020-12/schema", $b = "https://json-schema.org/draft/2020-12/meta/applicator", gb = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, vb = "meta", _b = "Applicator vocabulary meta-schema", wb = [
  "object",
  "boolean"
], bb = {
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
}, Sb = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, Eb = {
  $schema: yb,
  $id: $b,
  $vocabulary: gb,
  $dynamicAnchor: vb,
  title: _b,
  type: wb,
  properties: bb,
  $defs: Sb
}, Nb = "https://json-schema.org/draft/2020-12/schema", Pb = "https://json-schema.org/draft/2020-12/meta/unevaluated", Tb = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, Ob = "meta", Rb = "Unevaluated applicator vocabulary meta-schema", Ib = [
  "object",
  "boolean"
], jb = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Cb = {
  $schema: Nb,
  $id: Pb,
  $vocabulary: Tb,
  $dynamicAnchor: Ob,
  title: Rb,
  type: Ib,
  properties: jb
}, Ab = "https://json-schema.org/draft/2020-12/schema", kb = "https://json-schema.org/draft/2020-12/meta/content", Lb = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Db = "meta", Mb = "Content vocabulary meta-schema", Vb = [
  "object",
  "boolean"
], Fb = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, qb = {
  $schema: Ab,
  $id: kb,
  $vocabulary: Lb,
  $dynamicAnchor: Db,
  title: Mb,
  type: Vb,
  properties: Fb
}, zb = "https://json-schema.org/draft/2020-12/schema", Ub = "https://json-schema.org/draft/2020-12/meta/core", Bb = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Kb = "meta", Qb = "Core vocabulary meta-schema", Gb = [
  "object",
  "boolean"
], xb = {
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
}, Hb = {
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
}, Jb = {
  $schema: zb,
  $id: Ub,
  $vocabulary: Bb,
  $dynamicAnchor: Kb,
  title: Qb,
  type: Gb,
  properties: xb,
  $defs: Hb
}, Wb = "https://json-schema.org/draft/2020-12/schema", Xb = "https://json-schema.org/draft/2020-12/meta/format-annotation", Yb = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Zb = "meta", eS = "Format vocabulary meta-schema for annotation results", tS = [
  "object",
  "boolean"
], rS = {
  format: {
    type: "string"
  }
}, nS = {
  $schema: Wb,
  $id: Xb,
  $vocabulary: Yb,
  $dynamicAnchor: Zb,
  title: eS,
  type: tS,
  properties: rS
}, sS = "https://json-schema.org/draft/2020-12/schema", aS = "https://json-schema.org/draft/2020-12/meta/meta-data", oS = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, iS = "meta", cS = "Meta-data vocabulary meta-schema", lS = [
  "object",
  "boolean"
], uS = {
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
}, dS = {
  $schema: sS,
  $id: aS,
  $vocabulary: oS,
  $dynamicAnchor: iS,
  title: cS,
  type: lS,
  properties: uS
}, fS = "https://json-schema.org/draft/2020-12/schema", hS = "https://json-schema.org/draft/2020-12/meta/validation", mS = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, pS = "meta", yS = "Validation vocabulary meta-schema", $S = [
  "object",
  "boolean"
], gS = {
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
}, vS = {
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
}, _S = {
  $schema: fS,
  $id: hS,
  $vocabulary: mS,
  $dynamicAnchor: pS,
  title: yS,
  type: $S,
  properties: gS,
  $defs: vS
};
Object.defineProperty(Gi, "__esModule", { value: !0 });
const wS = pb, bS = Eb, SS = Cb, ES = qb, NS = Jb, PS = nS, TS = dS, OS = _S, RS = ["/properties"];
function IS(t) {
  return [
    wS,
    bS,
    SS,
    ES,
    NS,
    e(this, PS),
    TS,
    e(this, OS)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function e(r, n) {
    return t ? r.$dataMetaSchema(n, RS) : n;
  }
}
Gi.default = IS;
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv2020 = void 0;
  const r = rm, n = ai, s = Qi, a = Gi, o = "https://json-schema.org/draft/2020-12/schema";
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
  var l = Hn;
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var f = an;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(Za, Za.exports);
var jS = Za.exports, io = { exports: {} }, ap = {};
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
      const pe = +K[1], Ne = +K[2], q = +K[3], F = K[4], J = K[5] === "-" ? -1 : 1, P = +(K[6] || 0), y = +(K[7] || 0);
      if (P > 23 || y > 59 || x && !F)
        return !1;
      if (pe <= 23 && Ne <= 59 && q < 60)
        return !0;
      const E = Ne - y * J, _ = pe - P * J - (E < 0 ? 1 : 0);
      return (_ === 23 || _ === -1) && (E === 59 || E === -1) && q < 61;
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
  const f = /t|\s/i;
  function g(x) {
    const X = c(x);
    return function(K) {
      const pe = K.split(f);
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
    const [Z, K] = x.split(f), [pe, Ne] = X.split(f), q = o(Z, pe);
    if (q !== void 0)
      return q || d(K, Ne);
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
})(ap);
var op = {}, co = { exports: {} }, ip = {}, It = {}, dr = {}, Wn = {}, de = {}, qn = {};
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
    b instanceof n ? m.push(...b._items) : b instanceof r ? m.push(b) : m.push(f(b));
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
  function f(m) {
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
var lo = {};
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
      var l, f;
      if (!((f = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || f === void 0) && f.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  t.Scope = s;
  class a extends e.Name {
    constructor(d, l) {
      super(l), this.prefix = d;
    }
    setValue(d, { property: l, itemIndex: f }) {
      this.value = d, this.scopePath = (0, e._)`.${new e.Name(l)}[${f}]`;
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
      var f;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const g = this.toName(d), { prefix: p } = g, w = (f = l.key) !== null && f !== void 0 ? f : l.ref;
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
      const f = this._values[d];
      if (f)
        return f.get(l);
    }
    scopeRefs(d, l = this._values) {
      return this._reduceValues(l, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, e._)`${d}${f.scopePath}`;
      });
    }
    scopeCode(d = this._values, l, f) {
      return this._reduceValues(d, (g) => {
        if (g.value === void 0)
          throw new Error(`CodeGen: name "${g}" has no value`);
        return g.value.code;
      }, l, f);
    }
    _reduceValues(d, l, f = {}, g) {
      let p = e.nil;
      for (const w in d) {
        const $ = d[w];
        if (!$)
          continue;
        const v = f[w] = f[w] || /* @__PURE__ */ new Map();
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
})(lo);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.or = t.and = t.not = t.CodeGen = t.operators = t.varKinds = t.ValueScopeName = t.ValueScope = t.Scope = t.Name = t.regexpCode = t.stringify = t.getProperty = t.nil = t.strConcat = t.str = t._ = void 0;
  const e = qn, r = lo;
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
  var s = lo;
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
    optimizeNames(u, h) {
      return this;
    }
  }
  class o extends a {
    constructor(u, h, S) {
      super(), this.varKind = u, this.name = h, this.rhs = S;
    }
    render({ es5: u, _n: h }) {
      const S = u ? r.varKinds.var : this.varKind, A = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${S} ${this.name}${A};` + h;
    }
    optimizeNames(u, h) {
      if (u[this.name.str])
        return this.rhs && (this.rhs = K(this.rhs, u, h)), this;
    }
    get names() {
      return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
    }
  }
  class i extends a {
    constructor(u, h, S) {
      super(), this.lhs = u, this.rhs = h, this.sideEffects = S;
    }
    render({ _n: u }) {
      return `${this.lhs} = ${this.rhs};` + u;
    }
    optimizeNames(u, h) {
      if (!(this.lhs instanceof e.Name && !u[this.lhs.str] && !this.sideEffects))
        return this.rhs = K(this.rhs, u, h), this;
    }
    get names() {
      const u = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
      return Z(u, this.rhs);
    }
  }
  class c extends i {
    constructor(u, h, S, A) {
      super(u, S, A), this.op = h;
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
  class f extends a {
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
    optimizeNames(u, h) {
      return this.code = K(this.code, u, h), this;
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
      return this.nodes.reduce((h, S) => h + S.render(u), "");
    }
    optimizeNodes() {
      const { nodes: u } = this;
      let h = u.length;
      for (; h--; ) {
        const S = u[h].optimizeNodes();
        Array.isArray(S) ? u.splice(h, 1, ...S) : S ? u[h] = S : u.splice(h, 1);
      }
      return u.length > 0 ? this : void 0;
    }
    optimizeNames(u, h) {
      const { nodes: S } = this;
      let A = S.length;
      for (; A--; ) {
        const k = S[A];
        k.optimizeNames(u, h) || (pe(u, k.names), S.splice(A, 1));
      }
      return S.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((u, h) => X(u, h.names), {});
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
    constructor(u, h) {
      super(h), this.condition = u;
    }
    render(u) {
      let h = `if(${this.condition})` + super.render(u);
      return this.else && (h += "else " + this.else.render(u)), h;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const u = this.condition;
      if (u === !0)
        return this.nodes;
      let h = this.else;
      if (h) {
        const S = h.optimizeNodes();
        h = this.else = Array.isArray(S) ? new v(S) : S;
      }
      if (h)
        return u === !1 ? h instanceof m ? h : h.nodes : this.nodes.length ? this : new m(Ne(u), h instanceof m ? [h] : h.nodes);
      if (!(u === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(u, h) {
      var S;
      if (this.else = (S = this.else) === null || S === void 0 ? void 0 : S.optimizeNames(u, h), !!(super.optimizeNames(u, h) || this.else))
        return this.condition = K(this.condition, u, h), this;
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
    optimizeNames(u, h) {
      if (super.optimizeNames(u, h))
        return this.iteration = K(this.iteration, u, h), this;
    }
    get names() {
      return X(super.names, this.iteration.names);
    }
  }
  class R extends b {
    constructor(u, h, S, A) {
      super(), this.varKind = u, this.name = h, this.from = S, this.to = A;
    }
    render(u) {
      const h = u.es5 ? r.varKinds.var : this.varKind, { name: S, from: A, to: k } = this;
      return `for(${h} ${S}=${A}; ${S}<${k}; ${S}++)` + super.render(u);
    }
    get names() {
      const u = Z(super.names, this.from);
      return Z(u, this.to);
    }
  }
  class j extends b {
    constructor(u, h, S, A) {
      super(), this.loop = u, this.varKind = h, this.name = S, this.iterable = A;
    }
    render(u) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(u);
    }
    optimizeNames(u, h) {
      if (super.optimizeNames(u, h))
        return this.iterable = K(this.iterable, u, h), this;
    }
    get names() {
      return X(super.names, this.iterable.names);
    }
  }
  class U extends w {
    constructor(u, h, S) {
      super(), this.name = u, this.args = h, this.async = S;
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
      let h = "try" + super.render(u);
      return this.catch && (h += this.catch.render(u)), this.finally && (h += this.finally.render(u)), h;
    }
    optimizeNodes() {
      var u, h;
      return super.optimizeNodes(), (u = this.catch) === null || u === void 0 || u.optimizeNodes(), (h = this.finally) === null || h === void 0 || h.optimizeNodes(), this;
    }
    optimizeNames(u, h) {
      var S, A;
      return super.optimizeNames(u, h), (S = this.catch) === null || S === void 0 || S.optimizeNames(u, h), (A = this.finally) === null || A === void 0 || A.optimizeNames(u, h), this;
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
    constructor(u, h = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...h, _n: h.lines ? `
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
    scopeValue(u, h) {
      const S = this._extScope.value(u, h);
      return (this._values[S.prefix] || (this._values[S.prefix] = /* @__PURE__ */ new Set())).add(S), S;
    }
    getScopeValue(u, h) {
      return this._extScope.getValue(u, h);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(u) {
      return this._extScope.scopeRefs(u, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(u, h, S, A) {
      const k = this._scope.toName(h);
      return S !== void 0 && A && (this._constants[k.str] = S), this._leafNode(new o(u, k, S)), k;
    }
    // `const` declaration (`var` in es5 mode)
    const(u, h, S) {
      return this._def(r.varKinds.const, u, h, S);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(u, h, S) {
      return this._def(r.varKinds.let, u, h, S);
    }
    // `var` declaration with optional assignment
    var(u, h, S) {
      return this._def(r.varKinds.var, u, h, S);
    }
    // assignment code
    assign(u, h, S) {
      return this._leafNode(new i(u, h, S));
    }
    // `+=` code
    add(u, h) {
      return this._leafNode(new c(u, t.operators.ADD, h));
    }
    // appends passed SafeExpr to code or executes Block
    code(u) {
      return typeof u == "function" ? u() : u !== e.nil && this._leafNode(new g(u)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...u) {
      const h = ["{"];
      for (const [S, A] of u)
        h.length > 1 && h.push(","), h.push(S), (S !== A || this.opts.es5) && (h.push(":"), (0, e.addCodeArg)(h, A));
      return h.push("}"), new e._Code(h);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(u, h, S) {
      if (this._blockNode(new m(u)), h && S)
        this.code(h).else().code(S).endIf();
      else if (h)
        this.code(h).endIf();
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
    _for(u, h) {
      return this._blockNode(u), h && this.code(h).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(u, h) {
      return this._for(new T(u), h);
    }
    // `for` statement for a range of values
    forRange(u, h, S, A, k = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const H = this._scope.toName(u);
      return this._for(new R(k, H, h, S), () => A(H));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(u, h, S, A = r.varKinds.const) {
      const k = this._scope.toName(u);
      if (this.opts.es5) {
        const H = h instanceof e.Name ? h : this.var("_arr", h);
        return this.forRange("_i", 0, (0, e._)`${H}.length`, (W) => {
          this.var(k, (0, e._)`${H}[${W}]`), S(k);
        });
      }
      return this._for(new j("of", A, k, h), () => S(k));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(u, h, S, A = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(u, (0, e._)`Object.keys(${h})`, S);
      const k = this._scope.toName(u);
      return this._for(new j("in", A, k, h), () => S(k));
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
      const h = new M();
      if (this._blockNode(h), this.code(u), h.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(M);
    }
    // `try` statement
    try(u, h, S) {
      if (!h && !S)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const A = new te();
      if (this._blockNode(A), this.code(u), h) {
        const k = this.name("e");
        this._currNode = A.catch = new fe(k), h(k);
      }
      return S && (this._currNode = A.finally = new $e(), this.code(S)), this._endBlockNode(fe, $e);
    }
    // `throw` statement
    throw(u) {
      return this._leafNode(new f(u));
    }
    // start self-balancing block
    block(u, h) {
      return this._blockStarts.push(this._nodes.length), u && this.code(u).endBlock(h), this;
    }
    // end the current self-balancing block
    endBlock(u) {
      const h = this._blockStarts.pop();
      if (h === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const S = this._nodes.length - h;
      if (S < 0 || u !== void 0 && S !== u)
        throw new Error(`CodeGen: wrong number of nodes: ${S} vs ${u} expected`);
      return this._nodes.length = h, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(u, h = e.nil, S, A) {
      return this._blockNode(new U(u, h, S)), A && this.code(A).endFunc(), this;
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
    _endBlockNode(u, h) {
      const S = this._currNode;
      if (S instanceof u || h && S instanceof h)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${h ? `${u.kind}/${h.kind}` : u.kind}"`);
    }
    _elseNode(u) {
      const h = this._currNode;
      if (!(h instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = h.else = u, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const u = this._nodes;
      return u[u.length - 1];
    }
    set _currNode(u) {
      const h = this._nodes;
      h[h.length - 1] = u;
    }
  }
  t.CodeGen = x;
  function X(_, u) {
    for (const h in u)
      _[h] = (_[h] || 0) + (u[h] || 0);
    return _;
  }
  function Z(_, u) {
    return u instanceof e._CodeOrName ? X(_, u.names) : _;
  }
  function K(_, u, h) {
    if (_ instanceof e.Name)
      return S(_);
    if (!A(_))
      return _;
    return new e._Code(_._items.reduce((k, H) => (H instanceof e.Name && (H = S(H)), H instanceof e._Code ? k.push(...H._items) : k.push(H), k), []));
    function S(k) {
      const H = h[k.str];
      return H === void 0 || u[k.str] !== 1 ? k : (delete u[k.str], H);
    }
    function A(k) {
      return k instanceof e._Code && k._items.some((H) => H instanceof e.Name && u[H.str] === 1 && h[H.str] !== void 0);
    }
  }
  function pe(_, u) {
    for (const h in u)
      _[h] = (_[h] || 0) - (u[h] || 0);
  }
  function Ne(_) {
    return typeof _ == "boolean" || typeof _ == "number" || _ === null ? !_ : (0, e._)`!${E(_)}`;
  }
  t.not = Ne;
  const q = y(t.operators.AND);
  function F(..._) {
    return _.reduce(q);
  }
  t.and = F;
  const J = y(t.operators.OR);
  function P(..._) {
    return _.reduce(J);
  }
  t.or = P;
  function y(_) {
    return (u, h) => u === e.nil ? h : h === e.nil ? u : (0, e._)`${E(u)} ${_} ${E(h)}`;
  }
  function E(_) {
    return _ instanceof e.Name ? _ : (0, e._)`(${_})`;
  }
})(de);
var G = {};
Object.defineProperty(G, "__esModule", { value: !0 });
G.checkStrictMode = G.getErrorPath = G.Type = G.useFunc = G.setEvaluated = G.evaluatedPropsToName = G.mergeEvaluated = G.eachItem = G.unescapeJsonPointer = G.escapeJsonPointer = G.escapeFragment = G.unescapeFragment = G.schemaRefOrVal = G.schemaHasRulesButRef = G.schemaHasRules = G.checkUnknownRules = G.alwaysValidSchema = G.toHash = void 0;
const ve = de, CS = qn;
function AS(t) {
  const e = {};
  for (const r of t)
    e[r] = !0;
  return e;
}
G.toHash = AS;
function kS(t, e) {
  return typeof e == "boolean" ? e : Object.keys(e).length === 0 ? !0 : (cp(t, e), !lp(e, t.self.RULES.all));
}
G.alwaysValidSchema = kS;
function cp(t, e = t.schema) {
  const { opts: r, self: n } = t;
  if (!r.strictSchema || typeof e == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in e)
    s[a] || fp(t, `unknown keyword: "${a}"`);
}
G.checkUnknownRules = cp;
function lp(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (e[r])
      return !0;
  return !1;
}
G.schemaHasRules = lp;
function LS(t, e) {
  if (typeof t == "boolean")
    return !t;
  for (const r in t)
    if (r !== "$ref" && e.all[r])
      return !0;
  return !1;
}
G.schemaHasRulesButRef = LS;
function DS({ topSchemaRef: t, schemaPath: e }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ve._)`${r}`;
  }
  return (0, ve._)`${t}${e}${(0, ve.getProperty)(n)}`;
}
G.schemaRefOrVal = DS;
function MS(t) {
  return up(decodeURIComponent(t));
}
G.unescapeFragment = MS;
function VS(t) {
  return encodeURIComponent(xi(t));
}
G.escapeFragment = VS;
function xi(t) {
  return typeof t == "number" ? `${t}` : t.replace(/~/g, "~0").replace(/\//g, "~1");
}
G.escapeJsonPointer = xi;
function up(t) {
  return t.replace(/~1/g, "/").replace(/~0/g, "~");
}
G.unescapeJsonPointer = up;
function FS(t, e) {
  if (Array.isArray(t))
    for (const r of t)
      e(r);
  else
    e(t);
}
G.eachItem = FS;
function Vl({ mergeNames: t, mergeToName: e, mergeValues: r, resultToName: n }) {
  return (s, a, o, i) => {
    const c = o === void 0 ? a : o instanceof ve.Name ? (a instanceof ve.Name ? t(s, a, o) : e(s, a, o), o) : a instanceof ve.Name ? (e(s, o, a), a) : r(a, o);
    return i === ve.Name && !(c instanceof ve.Name) ? n(s, c) : c;
  };
}
G.mergeEvaluated = {
  props: Vl({
    mergeNames: (t, e, r) => t.if((0, ve._)`${r} !== true && ${e} !== undefined`, () => {
      t.if((0, ve._)`${e} === true`, () => t.assign(r, !0), () => t.assign(r, (0, ve._)`${r} || {}`).code((0, ve._)`Object.assign(${r}, ${e})`));
    }),
    mergeToName: (t, e, r) => t.if((0, ve._)`${r} !== true`, () => {
      e === !0 ? t.assign(r, !0) : (t.assign(r, (0, ve._)`${r} || {}`), Hi(t, r, e));
    }),
    mergeValues: (t, e) => t === !0 ? !0 : { ...t, ...e },
    resultToName: dp
  }),
  items: Vl({
    mergeNames: (t, e, r) => t.if((0, ve._)`${r} !== true && ${e} !== undefined`, () => t.assign(r, (0, ve._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),
    mergeToName: (t, e, r) => t.if((0, ve._)`${r} !== true`, () => t.assign(r, e === !0 ? !0 : (0, ve._)`${r} > ${e} ? ${r} : ${e}`)),
    mergeValues: (t, e) => t === !0 ? !0 : Math.max(t, e),
    resultToName: (t, e) => t.var("items", e)
  })
};
function dp(t, e) {
  if (e === !0)
    return t.var("props", !0);
  const r = t.var("props", (0, ve._)`{}`);
  return e !== void 0 && Hi(t, r, e), r;
}
G.evaluatedPropsToName = dp;
function Hi(t, e, r) {
  Object.keys(r).forEach((n) => t.assign((0, ve._)`${e}${(0, ve.getProperty)(n)}`, !0));
}
G.setEvaluated = Hi;
const Fl = {};
function qS(t, e) {
  return t.scopeValue("func", {
    ref: e,
    code: Fl[e.code] || (Fl[e.code] = new CS._Code(e.code))
  });
}
G.useFunc = qS;
var uo;
(function(t) {
  t[t.Num = 0] = "Num", t[t.Str = 1] = "Str";
})(uo || (G.Type = uo = {}));
function zS(t, e, r) {
  if (t instanceof ve.Name) {
    const n = e === uo.Num;
    return r ? n ? (0, ve._)`"[" + ${t} + "]"` : (0, ve._)`"['" + ${t} + "']"` : n ? (0, ve._)`"/" + ${t}` : (0, ve._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ve.getProperty)(t).toString() : "/" + xi(t);
}
G.getErrorPath = zS;
function fp(t, e, r = t.opts.strictSchema) {
  if (r) {
    if (e = `strict mode: ${e}`, r === !0)
      throw new Error(e);
    t.self.logger.warn(e);
  }
}
G.checkStrictMode = fp;
var cs = {}, ql;
function ar() {
  if (ql) return cs;
  ql = 1, Object.defineProperty(cs, "__esModule", { value: !0 });
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
  return cs.default = e, cs;
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
    const { it: R } = v, { gen: j, compositeRule: U, allErrors: M } = R, te = f(v, m, b);
    T ?? (U || M) ? c(j, te) : d(R, (0, e._)`[${te}]`);
  }
  t.reportError = s;
  function a(v, m = t.keywordError, b) {
    const { it: T } = v, { gen: R, compositeRule: j, allErrors: U } = T, M = f(v, m, b);
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
  function f(v, m, b) {
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
})(Wn);
var zl;
function US() {
  if (zl) return dr;
  zl = 1, Object.defineProperty(dr, "__esModule", { value: !0 }), dr.boolOrEmptySchema = dr.topBoolOrEmptySchema = void 0;
  const t = Wn, e = de, r = ar(), n = {
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
    const { gen: d, data: l } = i, f = {
      gen: d,
      keyword: "false schema",
      data: l,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: i
    };
    (0, t.reportError)(f, n, void 0, c);
  }
  return dr;
}
var Ce = {}, Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.getRules = Nr.isJSONType = void 0;
const BS = ["string", "number", "integer", "boolean", "null", "object", "array"], KS = new Set(BS);
function QS(t) {
  return typeof t == "string" && KS.has(t);
}
Nr.isJSONType = QS;
function GS() {
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
Nr.getRules = GS;
var jt = {}, Ul;
function hp() {
  if (Ul) return jt;
  Ul = 1, Object.defineProperty(jt, "__esModule", { value: !0 }), jt.shouldUseRule = jt.shouldUseGroup = jt.schemaHasRulesForType = void 0;
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
const xS = Nr, HS = hp(), JS = Wn, ue = de, mp = G;
var Wr;
(function(t) {
  t[t.Correct = 0] = "Correct", t[t.Wrong = 1] = "Wrong";
})(Wr || (Ce.DataType = Wr = {}));
function WS(t) {
  const e = pp(t.type);
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
Ce.getSchemaTypes = WS;
function pp(t) {
  const e = Array.isArray(t) ? t : t ? [t] : [];
  if (e.every(xS.isJSONType))
    return e;
  throw new Error("type must be JSONType or JSONType[]: " + e.join(","));
}
Ce.getJSONTypes = pp;
function XS(t, e) {
  const { gen: r, data: n, opts: s } = t, a = YS(e, s.coerceTypes), o = e.length > 0 && !(a.length === 0 && e.length === 1 && (0, HS.schemaHasRulesForType)(t, e[0]));
  if (o) {
    const i = Ji(e, n, s.strictNumbers, Wr.Wrong);
    r.if(i, () => {
      a.length ? ZS(t, e, a) : Wi(t);
    });
  }
  return o;
}
Ce.coerceAndCheckDataType = XS;
const yp = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function YS(t, e) {
  return e ? t.filter((r) => yp.has(r) || e === "array" && r === "array") : [];
}
function ZS(t, e, r) {
  const { gen: n, data: s, opts: a } = t, o = n.let("dataType", (0, ue._)`typeof ${s}`), i = n.let("coerced", (0, ue._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ue._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ue._)`${s}[0]`).assign(o, (0, ue._)`typeof ${s}`).if(Ji(e, s, a.strictNumbers), () => n.assign(i, s))), n.if((0, ue._)`${i} !== undefined`);
  for (const d of r)
    (yp.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Wi(t), n.endIf(), n.if((0, ue._)`${i} !== undefined`, () => {
    n.assign(s, i), eE(t, i);
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
function eE({ gen: t, parentData: e, parentDataProperty: r }, n) {
  t.if((0, ue._)`${e} !== undefined`, () => t.assign((0, ue._)`${e}[${r}]`, n));
}
function fo(t, e, r, n = Wr.Correct) {
  const s = n === Wr.Correct ? ue.operators.EQ : ue.operators.NEQ;
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
  return n === Wr.Correct ? a : (0, ue.not)(a);
  function o(i = ue.nil) {
    return (0, ue.and)((0, ue._)`typeof ${e} == "number"`, i, r ? (0, ue._)`isFinite(${e})` : ue.nil);
  }
}
Ce.checkDataType = fo;
function Ji(t, e, r, n) {
  if (t.length === 1)
    return fo(t[0], e, r, n);
  let s;
  const a = (0, mp.toHash)(t);
  if (a.array && a.object) {
    const o = (0, ue._)`typeof ${e} != "object"`;
    s = a.null ? o : (0, ue._)`!${e} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = ue.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, ue.and)(s, fo(o, e, r, n));
  return s;
}
Ce.checkDataTypes = Ji;
const tE = {
  message: ({ schema: t }) => `must be ${t}`,
  params: ({ schema: t, schemaValue: e }) => typeof t == "string" ? (0, ue._)`{type: ${t}}` : (0, ue._)`{type: ${e}}`
};
function Wi(t) {
  const e = rE(t);
  (0, JS.reportError)(e, tE);
}
Ce.reportTypeError = Wi;
function rE(t) {
  const { gen: e, data: r, schema: n } = t, s = (0, mp.schemaRefOrVal)(t, n, "type");
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
var wn = {}, Bl;
function nE() {
  if (Bl) return wn;
  Bl = 1, Object.defineProperty(wn, "__esModule", { value: !0 }), wn.assignDefaults = void 0;
  const t = de, e = G;
  function r(s, a) {
    const { properties: o, items: i } = s.schema;
    if (a === "object" && o)
      for (const c in o)
        n(s, c, o[c].default);
    else a === "array" && Array.isArray(i) && i.forEach((c, d) => n(s, d, c.default));
  }
  wn.assignDefaults = r;
  function n(s, a, o) {
    const { gen: i, compositeRule: c, data: d, opts: l } = s;
    if (o === void 0)
      return;
    const f = (0, t._)`${d}${(0, t.getProperty)(a)}`;
    if (c) {
      (0, e.checkStrictMode)(s, `default is ignored for: ${f}`);
      return;
    }
    let g = (0, t._)`${f} === undefined`;
    l.useDefaults === "empty" && (g = (0, t._)`${g} || ${f} === null || ${f} === ""`), i.if(g, (0, t._)`${f} = ${(0, t.stringify)(o)}`);
  }
  return wn;
}
var pt = {}, me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.validateUnion = me.validateArray = me.usePattern = me.callValidateCode = me.schemaProperties = me.allSchemaProperties = me.noPropertyInData = me.propertyInData = me.isOwnProperty = me.hasPropFunc = me.reportMissingProp = me.checkMissingProp = me.checkReportMissingProp = void 0;
const we = de, Xi = G, Ht = ar(), sE = G;
function aE(t, e) {
  const { gen: r, data: n, it: s } = t;
  r.if(Zi(r, n, e, s.opts.ownProperties), () => {
    t.setParams({ missingProperty: (0, we._)`${e}` }, !0), t.error();
  });
}
me.checkReportMissingProp = aE;
function oE({ gen: t, data: e, it: { opts: r } }, n, s) {
  return (0, we.or)(...n.map((a) => (0, we.and)(Zi(t, e, a, r.ownProperties), (0, we._)`${s} = ${a}`)));
}
me.checkMissingProp = oE;
function iE(t, e) {
  t.setParams({ missingProperty: e }, !0), t.error();
}
me.reportMissingProp = iE;
function $p(t) {
  return t.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, we._)`Object.prototype.hasOwnProperty`
  });
}
me.hasPropFunc = $p;
function Yi(t, e, r) {
  return (0, we._)`${$p(t)}.call(${e}, ${r})`;
}
me.isOwnProperty = Yi;
function cE(t, e, r, n) {
  const s = (0, we._)`${e}${(0, we.getProperty)(r)} !== undefined`;
  return n ? (0, we._)`${s} && ${Yi(t, e, r)}` : s;
}
me.propertyInData = cE;
function Zi(t, e, r, n) {
  const s = (0, we._)`${e}${(0, we.getProperty)(r)} === undefined`;
  return n ? (0, we.or)(s, (0, we.not)(Yi(t, e, r))) : s;
}
me.noPropertyInData = Zi;
function gp(t) {
  return t ? Object.keys(t).filter((e) => e !== "__proto__") : [];
}
me.allSchemaProperties = gp;
function lE(t, e) {
  return gp(e).filter((r) => !(0, Xi.alwaysValidSchema)(t, e[r]));
}
me.schemaProperties = lE;
function uE({ schemaCode: t, data: e, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, i, c, d) {
  const l = d ? (0, we._)`${t}, ${e}, ${n}${s}` : e, f = [
    [Ht.default.instancePath, (0, we.strConcat)(Ht.default.instancePath, a)],
    [Ht.default.parentData, o.parentData],
    [Ht.default.parentDataProperty, o.parentDataProperty],
    [Ht.default.rootData, Ht.default.rootData]
  ];
  o.opts.dynamicRef && f.push([Ht.default.dynamicAnchors, Ht.default.dynamicAnchors]);
  const g = (0, we._)`${l}, ${r.object(...f)}`;
  return c !== we.nil ? (0, we._)`${i}.call(${c}, ${g})` : (0, we._)`${i}(${g})`;
}
me.callValidateCode = uE;
const dE = (0, we._)`new RegExp`;
function fE({ gen: t, it: { opts: e } }, r) {
  const n = e.unicodeRegExp ? "u" : "", { regExp: s } = e.code, a = s(r, n);
  return t.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, we._)`${s.code === "new RegExp" ? dE : (0, sE.useFunc)(t, s)}(${r}, ${n})`
  });
}
me.usePattern = fE;
function hE(t) {
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
        dataPropType: Xi.Type.Num
      }, a), e.if((0, we.not)(a), i);
    });
  }
}
me.validateArray = hE;
function mE(t) {
  const { gen: e, schema: r, keyword: n, it: s } = t;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Xi.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
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
me.validateUnion = mE;
var Kl;
function pE() {
  if (Kl) return pt;
  Kl = 1, Object.defineProperty(pt, "__esModule", { value: !0 }), pt.validateKeywordUsage = pt.validSchemaType = pt.funcKeywordCode = pt.macroKeywordCode = void 0;
  const t = de, e = ar(), r = me, n = Wn;
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
  function f({ schema: g, opts: p, self: w, errSchemaPath: $ }, v, m) {
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
  return pt.validateKeywordUsage = f, pt;
}
var Ct = {}, Ql;
function yE() {
  if (Ql) return Ct;
  Ql = 1, Object.defineProperty(Ct, "__esModule", { value: !0 }), Ct.extendSubschemaMode = Ct.extendSubschemaData = Ct.getSubschema = void 0;
  const t = de, e = G;
  function r(a, { keyword: o, schemaProp: i, schema: c, schemaPath: d, errSchemaPath: l, topSchemaRef: f }) {
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
      if (d === void 0 || l === void 0 || f === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: d,
        topSchemaRef: f,
        errSchemaPath: l
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Ct.getSubschema = r;
  function n(a, o, { dataProp: i, dataPropType: c, data: d, dataTypes: l, propertyName: f }) {
    if (d !== void 0 && i !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: g } = o;
    if (i !== void 0) {
      const { errorPath: w, dataPathArr: $, opts: v } = o, m = g.let("data", (0, t._)`${o.data}${(0, t.getProperty)(i)}`, !0);
      p(m), a.errorPath = (0, t.str)`${w}${(0, e.getErrorPath)(i, c, v.jsPropertySyntax)}`, a.parentDataProperty = (0, t._)`${i}`, a.dataPathArr = [...$, a.parentDataProperty];
    }
    if (d !== void 0) {
      const w = d instanceof t.Name ? d : g.let("data", d, !0);
      p(w), f !== void 0 && (a.propertyName = f);
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
var Fe = {}, vp = { exports: {} }, tr = vp.exports = function(t, e, r) {
  typeof e == "function" && (r = e, e = {}), r = e.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Is(e, n, s, t, "", t);
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
function Is(t, e, r, n, s, a, o, i, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    e(n, s, a, o, i, c, d);
    for (var l in n) {
      var f = n[l];
      if (Array.isArray(f)) {
        if (l in tr.arrayKeywords)
          for (var g = 0; g < f.length; g++)
            Is(t, e, r, f[g], s + "/" + l + "/" + g, a, s, l, n, g);
      } else if (l in tr.propsKeywords) {
        if (f && typeof f == "object")
          for (var p in f)
            Is(t, e, r, f[p], s + "/" + l + "/" + $E(p), a, s, l, n, p);
      } else (l in tr.keywords || t.allKeys && !(l in tr.skipKeywords)) && Is(t, e, r, f, s + "/" + l, a, s, l, n);
    }
    r(n, s, a, o, i, c, d);
  }
}
function $E(t) {
  return t.replace(/~/g, "~0").replace(/\//g, "~1");
}
var gE = vp.exports;
Object.defineProperty(Fe, "__esModule", { value: !0 });
Fe.getSchemaRefs = Fe.resolveUrl = Fe.normalizeId = Fe._getFullPath = Fe.getFullPath = Fe.inlineRef = void 0;
const vE = G, _E = sa, wE = gE, bE = /* @__PURE__ */ new Set([
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
function SE(t, e = !0) {
  return typeof t == "boolean" ? !0 : e === !0 ? !ho(t) : e ? _p(t) <= e : !1;
}
Fe.inlineRef = SE;
const EE = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ho(t) {
  for (const e in t) {
    if (EE.has(e))
      return !0;
    const r = t[e];
    if (Array.isArray(r) && r.some(ho) || typeof r == "object" && ho(r))
      return !0;
  }
  return !1;
}
function _p(t) {
  let e = 0;
  for (const r in t) {
    if (r === "$ref")
      return 1 / 0;
    if (e++, !bE.has(r) && (typeof t[r] == "object" && (0, vE.eachItem)(t[r], (n) => e += _p(n)), e === 1 / 0))
      return 1 / 0;
  }
  return e;
}
function wp(t, e = "", r) {
  r !== !1 && (e = Xr(e));
  const n = t.parse(e);
  return bp(t, n);
}
Fe.getFullPath = wp;
function bp(t, e) {
  return t.serialize(e).split("#")[0] + "#";
}
Fe._getFullPath = bp;
const NE = /#\/?$/;
function Xr(t) {
  return t ? t.replace(NE, "") : "";
}
Fe.normalizeId = Xr;
function PE(t, e, r) {
  return r = Xr(r), t.resolve(e, r);
}
Fe.resolveUrl = PE;
const TE = /^[a-z_][-a-z0-9._]*$/i;
function OE(t, e) {
  if (typeof t == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Xr(t[r] || e), a = { "": s }, o = wp(n, s, !1), i = {}, c = /* @__PURE__ */ new Set();
  return wE(t, { allKeys: !0 }, (f, g, p, w) => {
    if (w === void 0)
      return;
    const $ = o + g;
    let v = a[w];
    typeof f[r] == "string" && (v = m.call(this, f[r])), b.call(this, f.$anchor), b.call(this, f.$dynamicAnchor), a[g] = v;
    function m(T) {
      const R = this.opts.uriResolver.resolve;
      if (T = Xr(v ? R(v, T) : T), c.has(T))
        throw l(T);
      c.add(T);
      let j = this.refs[T];
      return typeof j == "string" && (j = this.refs[j]), typeof j == "object" ? d(f, j.schema, T) : T !== Xr($) && (T[0] === "#" ? (d(f, i[T], T), i[T] = f) : this.refs[T] = $), T;
    }
    function b(T) {
      if (typeof T == "string") {
        if (!TE.test(T))
          throw new Error(`invalid anchor "${T}"`);
        m.call(this, `#${T}`);
      }
    }
  }), i;
  function d(f, g, p) {
    if (g !== void 0 && !_E(f, g))
      throw l(p);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
Fe.getSchemaRefs = OE;
var Gl;
function da() {
  if (Gl) return It;
  Gl = 1, Object.defineProperty(It, "__esModule", { value: !0 }), It.getData = It.KeywordCxt = It.validateFunctionCode = void 0;
  const t = US(), e = Ce, r = hp(), n = Ce, s = nE(), a = pE(), o = yE(), i = de, c = ar(), d = Fe, l = G, f = Wn;
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
      return Ne(O, [], !1, C);
    const L = (0, e.getSchemaTypes)(O.schema), z = (0, e.coerceAndCheckDataType)(O, L);
    Ne(O, L, !z, C);
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
      const Pe = (0, i.str)`${z}/$comment`, Xe = O.scopeValue("root", { ref: C.root });
      O.code((0, i._)`${c.default.self}.opts.$comment(${ie}, ${Pe}, ${Xe}.schema)`);
    }
  }
  function K(O) {
    const { gen: C, schemaEnv: L, validateName: z, ValidationError: Y, opts: ie } = O;
    L.$async ? C.if((0, i._)`${c.default.errors} === 0`, () => C.return(c.default.data), () => C.throw((0, i._)`new ${Y}(${c.default.vErrors})`)) : (C.assign((0, i._)`${z}.errors`, c.default.vErrors), ie.unevaluated && pe(O), C.return((0, i._)`${c.default.errors} === 0`));
  }
  function pe({ gen: O, evaluated: C, props: L, items: z }) {
    L instanceof i.Name && O.assign((0, i._)`${C}.props`, L), z instanceof i.Name && O.assign((0, i._)`${C}.items`, z);
  }
  function Ne(O, C, L, z) {
    const { gen: Y, schema: ie, data: Pe, allErrors: Xe, opts: Ae, self: ke } = O, { RULES: Te } = ke;
    if (ie.$ref && (Ae.ignoreKeywordsWithRef || !(0, l.schemaHasRulesButRef)(ie, Te))) {
      Y.block(() => A(O, "$ref", Te.all.$ref.definition));
      return;
    }
    Ae.jtd || F(O, C), Y.block(() => {
      for (const ze of Te.rules)
        Nt(ze);
      Nt(Te.post);
    });
    function Nt(ze) {
      (0, r.shouldUseGroup)(ie, ze) && (ze.type ? (Y.if((0, n.checkDataType)(ze.type, Pe, Ae.strictNumbers)), q(O, ze), C.length === 1 && C[0] === ze.type && L && (Y.else(), (0, n.reportTypeError)(O)), Y.endIf()) : q(O, ze), Xe || Y.if((0, i._)`${c.default.errors} === ${z || 0}`));
    }
  }
  function q(O, C) {
    const { gen: L, schema: z, opts: { useDefaults: Y } } = O;
    Y && (0, s.assignDefaults)(O, C.type), L.block(() => {
      for (const ie of C.rules)
        (0, r.shouldUseRule)(z, ie) && A(O, ie.keyword, ie.definition, C.type);
    });
  }
  function F(O, C) {
    O.schemaEnv.meta || !O.opts.strictTypes || (J(O, C), O.opts.allowUnionTypes || P(O, C), y(O, O.dataTypes));
  }
  function J(O, C) {
    if (C.length) {
      if (!O.dataTypes.length) {
        O.dataTypes = C;
        return;
      }
      C.forEach((L) => {
        _(O.dataTypes, L) || h(O, `type "${L}" not allowed by context "${O.dataTypes.join(",")}"`);
      }), u(O, C);
    }
  }
  function P(O, C) {
    C.length > 1 && !(C.length === 2 && C.includes("null")) && h(O, "use allowUnionTypes to allow union type keyword");
  }
  function y(O, C) {
    const L = O.self.RULES.all;
    for (const z in L) {
      const Y = L[z];
      if (typeof Y == "object" && (0, r.shouldUseRule)(O.schema, Y)) {
        const { type: ie } = Y.definition;
        ie.length && !ie.some((Pe) => E(C, Pe)) && h(O, `missing type "${ie.join(",")}" for keyword "${z}"`);
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
  function h(O, C) {
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
      (C ? f.reportExtraError : f.reportError)(this, this.def.error, L);
    }
    $dataError() {
      (0, f.reportError)(this, this.def.$dataError || f.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, f.resetErrorsCount)(this.gen, this.errsCount);
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
      const { gen: z, schemaCode: Y, schemaType: ie, def: Pe } = this;
      z.if((0, i.or)((0, i._)`${Y} === undefined`, L)), C !== i.nil && z.assign(C, !0), (ie.length || Pe.validateSchema) && (z.elseIf(this.invalid$data()), this.$dataError(), C !== i.nil && z.assign(C, !1)), z.else();
    }
    invalid$data() {
      const { gen: C, schemaCode: L, schemaType: z, def: Y, it: ie } = this;
      return (0, i.or)(Pe(), Xe());
      function Pe() {
        if (z.length) {
          if (!(L instanceof i.Name))
            throw new Error("ajv implementation error");
          const Ae = Array.isArray(z) ? z : [z];
          return (0, i._)`${(0, n.checkDataTypes)(Ae, L, ie.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return i.nil;
      }
      function Xe() {
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
      const Te = +ke[1];
      if (Y = ke[2], Y === "#") {
        if (Te >= C)
          throw new Error(Ae("property/index", Te));
        return z[C - Te];
      }
      if (Te > C)
        throw new Error(Ae("data", Te));
      if (ie = L[C - Te], !Y)
        return ie;
    }
    let Pe = ie;
    const Xe = Y.split("/");
    for (const ke of Xe)
      ke && (ie = (0, i._)`${ie}${(0, i.getProperty)((0, l.unescapeJsonPointer)(ke))}`, Pe = (0, i._)`${Pe} && ${ie}`);
    return Pe;
    function Ae(ke, Te) {
      return `Cannot access ${ke} ${Te} levels up, current level is ${C}`;
    }
  }
  return It.getData = W, It;
}
var ls = {}, xl;
function ec() {
  if (xl) return ls;
  xl = 1, Object.defineProperty(ls, "__esModule", { value: !0 });
  class t extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return ls.default = t, ls;
}
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
const Va = Fe;
class RE extends Error {
  constructor(e, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Va.resolveUrl)(e, r, n), this.missingSchema = (0, Va.normalizeId)((0, Va.getFullPath)(e, this.missingRef));
  }
}
dn.default = RE;
var st = {};
Object.defineProperty(st, "__esModule", { value: !0 });
st.resolveSchema = st.getCompilingSchema = st.resolveRef = st.compileSchema = st.SchemaEnv = void 0;
const yt = de, IE = ec(), fr = ar(), wt = Fe, Hl = G, jE = da();
class fa {
  constructor(e) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof e.schema == "object" && (n = e.schema), this.schema = e.schema, this.schemaId = e.schemaId, this.root = e.root || this, this.baseId = (r = e.baseId) !== null && r !== void 0 ? r : (0, wt.normalizeId)(n == null ? void 0 : n[e.schemaId || "$id"]), this.schemaPath = e.schemaPath, this.localRefs = e.localRefs, this.meta = e.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
st.SchemaEnv = fa;
function tc(t) {
  const e = Sp.call(this, t);
  if (e)
    return e;
  const r = (0, wt.getFullPath)(this.opts.uriResolver, t.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new yt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let i;
  t.$async && (i = o.scopeValue("Error", {
    ref: IE.default,
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
    this._compilations.add(t), (0, jE.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const f = o.toString();
    l = `${o.scopeRefs(fr.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, t));
    const p = new Function(`${fr.default.self}`, `${fr.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = t.schema, p.schemaEnv = t, t.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: f, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: $ } = d;
      p.evaluated = {
        props: w instanceof yt.Name ? void 0 : w,
        items: $ instanceof yt.Name ? void 0 : $,
        dynamicProps: w instanceof yt.Name,
        dynamicItems: $ instanceof yt.Name
      }, p.source && (p.source.evaluated = (0, yt.stringify)(p.evaluated));
    }
    return t.validate = p, t;
  } catch (f) {
    throw delete t.validate, delete t.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(t);
  }
}
st.compileSchema = tc;
function CE(t, e, r) {
  var n;
  r = (0, wt.resolveUrl)(this.opts.uriResolver, e, r);
  const s = t.refs[r];
  if (s)
    return s;
  let a = LE.call(this, t, r);
  if (a === void 0) {
    const o = (n = t.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: i } = this.opts;
    o && (a = new fa({ schema: o, schemaId: i, root: t, baseId: e }));
  }
  if (a !== void 0)
    return t.refs[r] = AE.call(this, a);
}
st.resolveRef = CE;
function AE(t) {
  return (0, wt.inlineRef)(t.schema, this.opts.inlineRefs) ? t.schema : t.validate ? t : tc.call(this, t);
}
function Sp(t) {
  for (const e of this._compilations)
    if (kE(e, t))
      return e;
}
st.getCompilingSchema = Sp;
function kE(t, e) {
  return t.schema === e.schema && t.root === e.root && t.baseId === e.baseId;
}
function LE(t, e) {
  let r;
  for (; typeof (r = this.refs[e]) == "string"; )
    e = r;
  return r || this.schemas[e] || ha.call(this, t, e);
}
function ha(t, e) {
  const r = this.opts.uriResolver.parse(e), n = (0, wt._getFullPath)(this.opts.uriResolver, r);
  let s = (0, wt.getFullPath)(this.opts.uriResolver, t.baseId, void 0);
  if (Object.keys(t.schema).length > 0 && n === s)
    return Fa.call(this, r, t);
  const a = (0, wt.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const i = ha.call(this, t, o);
    return typeof (i == null ? void 0 : i.schema) != "object" ? void 0 : Fa.call(this, r, i);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || tc.call(this, o), a === (0, wt.normalizeId)(e)) {
      const { schema: i } = o, { schemaId: c } = this.opts, d = i[c];
      return d && (s = (0, wt.resolveUrl)(this.opts.uriResolver, s, d)), new fa({ schema: i, schemaId: c, root: t, baseId: s });
    }
    return Fa.call(this, r, o);
  }
}
st.resolveSchema = ha;
const DE = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Fa(t, { baseId: e, schema: r, root: n }) {
  var s;
  if (((s = t.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const i of t.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Hl.unescapeFragment)(i)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !DE.has(i) && d && (e = (0, wt.resolveUrl)(this.opts.uriResolver, e, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Hl.schemaHasRulesButRef)(r, this.RULES)) {
    const i = (0, wt.resolveUrl)(this.opts.uriResolver, e, r.$ref);
    a = ha.call(this, n, i);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new fa({ schema: r, schemaId: o, root: n, baseId: e }), a.schema !== a.root.schema)
    return a;
}
const ME = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", VE = "Meta-schema for $data reference (JSON AnySchema extension proposal)", FE = "object", qE = [
  "$data"
], zE = {
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
}, UE = !1, BE = {
  $id: ME,
  description: VE,
  type: FE,
  required: qE,
  properties: zE,
  additionalProperties: UE
};
var rc = {};
Object.defineProperty(rc, "__esModule", { value: !0 });
const Ep = Hm;
Ep.code = 'require("ajv/dist/runtime/uri").default';
rc.default = Ep;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
  var e = da();
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
  const n = ec(), s = dn, a = Nr, o = st, i = de, c = Fe, d = Ce, l = G, f = BE, g = rc, p = (P, y) => new RegExp(P, y);
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
    var y, E, _, u, h, S, A, k, H, W, O, C, L, z, Y, ie, Pe, Xe, Ae, ke, Te, Nt, ze, ir, cr;
    const ht = P.strict, lr = (y = P.code) === null || y === void 0 ? void 0 : y.optimize, mn = lr === !0 || lr === void 0 ? 1 : lr || 0, pn = (_ = (E = P.code) === null || E === void 0 ? void 0 : E.regExp) !== null && _ !== void 0 ? _ : p, Ra = (u = P.uriResolver) !== null && u !== void 0 ? u : g.default;
    return {
      strictSchema: (S = (h = P.strictSchema) !== null && h !== void 0 ? h : ht) !== null && S !== void 0 ? S : !0,
      strictNumbers: (k = (A = P.strictNumbers) !== null && A !== void 0 ? A : ht) !== null && k !== void 0 ? k : !0,
      strictTypes: (W = (H = P.strictTypes) !== null && H !== void 0 ? H : ht) !== null && W !== void 0 ? W : "log",
      strictTuples: (C = (O = P.strictTuples) !== null && O !== void 0 ? O : ht) !== null && C !== void 0 ? C : "log",
      strictRequired: (z = (L = P.strictRequired) !== null && L !== void 0 ? L : ht) !== null && z !== void 0 ? z : !1,
      code: P.code ? { ...P.code, optimize: mn, regExp: pn } : { optimize: mn, regExp: pn },
      loopRequired: (Y = P.loopRequired) !== null && Y !== void 0 ? Y : b,
      loopEnum: (ie = P.loopEnum) !== null && ie !== void 0 ? ie : b,
      meta: (Pe = P.meta) !== null && Pe !== void 0 ? Pe : !0,
      messages: (Xe = P.messages) !== null && Xe !== void 0 ? Xe : !0,
      inlineRefs: (Ae = P.inlineRefs) !== null && Ae !== void 0 ? Ae : !0,
      schemaId: (ke = P.schemaId) !== null && ke !== void 0 ? ke : "$id",
      addUsedSchema: (Te = P.addUsedSchema) !== null && Te !== void 0 ? Te : !0,
      validateSchema: (Nt = P.validateSchema) !== null && Nt !== void 0 ? Nt : !0,
      validateFormats: (ze = P.validateFormats) !== null && ze !== void 0 ? ze : !0,
      unicodeRegExp: (ir = P.unicodeRegExp) !== null && ir !== void 0 ? ir : !0,
      int32range: (cr = P.int32range) !== null && cr !== void 0 ? cr : !0,
      uriResolver: Ra
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
      let u = f;
      _ === "id" && (u = { ...f }, u.id = u.$id, delete u.$id), E && y && this.addMetaSchema(u, u[_], !1);
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
        await h.call(this, W.$schema);
        const C = this._addSchema(W, O);
        return C.validate || S.call(this, C);
      }
      async function h(W) {
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
        this.refs[W] || await h.call(this, O.$schema), this.refs[W] || this.addSchema(O, W, E);
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
      let h;
      if (typeof y == "object") {
        const { schemaId: S } = this.opts;
        if (h = y[S], h !== void 0 && typeof h != "string")
          throw new Error(`schema ${S} must be string`);
      }
      return E = (0, c.normalizeId)(E || h), this._checkUnique(E), this.schemas[E] = this._addSchema(y, _, E, u, !0), this;
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
        const h = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(h);
        else
          throw new Error(h);
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
        return (0, l.eachItem)(_, (h) => pe.call(this, h)), this;
      q.call(this, E);
      const u = {
        ...E,
        type: (0, d.getJSONTypes)(E.type),
        schemaType: (0, d.getJSONTypes)(E.schemaType)
      };
      return (0, l.eachItem)(_, u.type.length === 0 ? (h) => pe.call(this, h, u) : (h) => u.type.forEach((S) => pe.call(this, h, u, S))), this;
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
        const u = _.rules.findIndex((h) => h.keyword === y);
        u >= 0 && _.rules.splice(u, 1);
      }
      return this;
    }
    // Add format
    addFormat(y, E) {
      return typeof E == "string" && (E = new RegExp(E)), this.formats[y] = E, this;
    }
    errorsText(y = this.errors, { separator: E = ", ", dataVar: _ = "data" } = {}) {
      return !y || y.length === 0 ? "No errors" : y.map((u) => `${_}${u.instancePath} ${u.message}`).reduce((u, h) => u + E + h);
    }
    $dataMetaSchema(y, E) {
      const _ = this.RULES.all;
      y = JSON.parse(JSON.stringify(y));
      for (const u of E) {
        const h = u.split("/").slice(1);
        let S = y;
        for (const A of h)
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
    _addSchema(y, E, _, u = this.opts.validateSchema, h = this.opts.addUsedSchema) {
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
      return k = new o.SchemaEnv({ schema: y, schemaId: A, meta: E, baseId: _, localRefs: H }), this._cache.set(k.schema, k), h && !_.startsWith("#") && (_ && this._checkUnique(_), this.refs[_] = k), u && this.validateSchema(y, !0), k;
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
      const h = u;
      h in y && this.logger[_](`${E}: option ${u}. ${P[h]}`);
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
    const { RULES: h } = this;
    let S = u ? h.post : h.rules.find(({ type: k }) => k === E);
    if (S || (S = { type: E, rules: [] }, h.rules.push(S)), h.keywords[P] = !0, !y)
      return;
    const A = {
      keyword: P,
      definition: {
        ...y,
        type: (0, d.getJSONTypes)(y.type),
        schemaType: (0, d.getJSONTypes)(y.schemaType)
      }
    };
    y.before ? Ne.call(this, S, A, y.before) : S.rules.push(A), h.all[P] = A, (_ = y.implements) === null || _ === void 0 || _.forEach((k) => this.addKeyword(k));
  }
  function Ne(P, y, E) {
    const _ = P.rules.findIndex((u) => u.keyword === E);
    _ >= 0 ? P.rules.splice(_, 0, y) : (P.rules.push(y), this.logger.warn(`rule ${E} is not defined`));
  }
  function q(P) {
    let { metaSchema: y } = P;
    y !== void 0 && (P.$data && this.opts.$data && (y = J(y)), P.validateSchema = this.compile(y, !0));
  }
  const F = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(P) {
    return { anyOf: [P, F] };
  }
})(ip);
var nc = {}, sc = {}, ac = {};
Object.defineProperty(ac, "__esModule", { value: !0 });
const KE = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ac.default = KE;
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.callRef = Pr.getValidate = void 0;
const QE = dn, Jl = me, nt = de, Mr = ar(), Wl = st, us = G, GE = {
  keyword: "$ref",
  schemaType: "string",
  code(t) {
    const { gen: e, schema: r, it: n } = t, { baseId: s, schemaEnv: a, validateName: o, opts: i, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return f();
    const l = Wl.resolveRef.call(c, d, s, r);
    if (l === void 0)
      throw new QE.default(n.opts.uriResolver, s, r);
    if (l instanceof Wl.SchemaEnv)
      return g(l);
    return p(l);
    function f() {
      if (a === d)
        return js(t, o, a, a.$async);
      const w = e.scopeValue("root", { ref: d });
      return js(t, (0, nt._)`${w}.validate`, d, d.$async);
    }
    function g(w) {
      const $ = Np(t, w);
      js(t, $, w, w.$async);
    }
    function p(w) {
      const $ = e.scopeValue("schema", i.code.source === !0 ? { ref: w, code: (0, nt.stringify)(w) } : { ref: w }), v = e.name("valid"), m = t.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: nt.nil,
        topSchemaRef: $,
        errSchemaPath: r
      }, v);
      t.mergeEvaluated(m), t.ok(v);
    }
  }
};
function Np(t, e) {
  const { gen: r } = t;
  return e.validate ? r.scopeValue("validate", { ref: e.validate }) : (0, nt._)`${r.scopeValue("wrapper", { ref: e })}.validate`;
}
Pr.getValidate = Np;
function js(t, e, r, n) {
  const { gen: s, it: a } = t, { allErrors: o, schemaEnv: i, opts: c } = a, d = c.passContext ? Mr.default.this : nt.nil;
  n ? l() : f();
  function l() {
    if (!i.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, nt._)`await ${(0, Jl.callValidateCode)(t, e, d)}`), p(e), o || s.assign(w, !0);
    }, ($) => {
      s.if((0, nt._)`!(${$} instanceof ${a.ValidationError})`, () => s.throw($)), g($), o || s.assign(w, !1);
    }), t.ok(w);
  }
  function f() {
    t.result((0, Jl.callValidateCode)(t, e, d), () => p(e), () => g(e));
  }
  function g(w) {
    const $ = (0, nt._)`${w}.errors`;
    s.assign(Mr.default.vErrors, (0, nt._)`${Mr.default.vErrors} === null ? ${$} : ${Mr.default.vErrors}.concat(${$})`), s.assign(Mr.default.errors, (0, nt._)`${Mr.default.vErrors}.length`);
  }
  function p(w) {
    var $;
    if (!a.opts.unevaluated)
      return;
    const v = ($ = r == null ? void 0 : r.validate) === null || $ === void 0 ? void 0 : $.evaluated;
    if (a.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (a.props = us.mergeEvaluated.props(s, v.props, a.props));
      else {
        const m = s.var("props", (0, nt._)`${w}.evaluated.props`);
        a.props = us.mergeEvaluated.props(s, m, a.props, nt.Name);
      }
    if (a.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (a.items = us.mergeEvaluated.items(s, v.items, a.items));
      else {
        const m = s.var("items", (0, nt._)`${w}.evaluated.items`);
        a.items = us.mergeEvaluated.items(s, m, a.items, nt.Name);
      }
  }
}
Pr.callRef = js;
Pr.default = GE;
Object.defineProperty(sc, "__esModule", { value: !0 });
const xE = ac, HE = Pr, JE = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  xE.default,
  HE.default
];
sc.default = JE;
var oc = {}, ic = {};
Object.defineProperty(ic, "__esModule", { value: !0 });
const Bs = de, Jt = Bs.operators, Ks = {
  maximum: { okStr: "<=", ok: Jt.LTE, fail: Jt.GT },
  minimum: { okStr: ">=", ok: Jt.GTE, fail: Jt.LT },
  exclusiveMaximum: { okStr: "<", ok: Jt.LT, fail: Jt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Jt.GT, fail: Jt.LTE }
}, WE = {
  message: ({ keyword: t, schemaCode: e }) => (0, Bs.str)`must be ${Ks[t].okStr} ${e}`,
  params: ({ keyword: t, schemaCode: e }) => (0, Bs._)`{comparison: ${Ks[t].okStr}, limit: ${e}}`
}, XE = {
  keyword: Object.keys(Ks),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: WE,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t;
    t.fail$data((0, Bs._)`${r} ${Ks[e].fail} ${n} || isNaN(${r})`);
  }
};
ic.default = XE;
var cc = {};
Object.defineProperty(cc, "__esModule", { value: !0 });
const kn = de, YE = {
  message: ({ schemaCode: t }) => (0, kn.str)`must be multiple of ${t}`,
  params: ({ schemaCode: t }) => (0, kn._)`{multipleOf: ${t}}`
}, ZE = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: YE,
  code(t) {
    const { gen: e, data: r, schemaCode: n, it: s } = t, a = s.opts.multipleOfPrecision, o = e.let("res"), i = a ? (0, kn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, kn._)`${o} !== parseInt(${o})`;
    t.fail$data((0, kn._)`(${n} === 0 || (${o} = ${r}/${n}, ${i}))`);
  }
};
cc.default = ZE;
var lc = {}, uc = {};
Object.defineProperty(uc, "__esModule", { value: !0 });
function Pp(t) {
  const e = t.length;
  let r = 0, n = 0, s;
  for (; n < e; )
    r++, s = t.charCodeAt(n++), s >= 55296 && s <= 56319 && n < e && (s = t.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
uc.default = Pp;
Pp.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(lc, "__esModule", { value: !0 });
const $r = de, e1 = G, t1 = uc, r1 = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxLength" ? "more" : "fewer";
    return (0, $r.str)`must NOT have ${r} than ${e} characters`;
  },
  params: ({ schemaCode: t }) => (0, $r._)`{limit: ${t}}`
}, n1 = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: r1,
  code(t) {
    const { keyword: e, data: r, schemaCode: n, it: s } = t, a = e === "maxLength" ? $r.operators.GT : $r.operators.LT, o = s.opts.unicode === !1 ? (0, $r._)`${r}.length` : (0, $r._)`${(0, e1.useFunc)(t.gen, t1.default)}(${r})`;
    t.fail$data((0, $r._)`${o} ${a} ${n}`);
  }
};
lc.default = n1;
var dc = {};
Object.defineProperty(dc, "__esModule", { value: !0 });
const s1 = me, a1 = G, Gr = de, o1 = {
  message: ({ schemaCode: t }) => (0, Gr.str)`must match pattern "${t}"`,
  params: ({ schemaCode: t }) => (0, Gr._)`{pattern: ${t}}`
}, i1 = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: o1,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t, i = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Gr._)`new RegExp` : (0, a1.useFunc)(e, c), l = e.let("valid");
      e.try(() => e.assign(l, (0, Gr._)`${d}(${a}, ${i}).test(${r})`), () => e.assign(l, !1)), t.fail$data((0, Gr._)`!${l}`);
    } else {
      const c = (0, s1.usePattern)(t, s);
      t.fail$data((0, Gr._)`!${c}.test(${r})`);
    }
  }
};
dc.default = i1;
var fc = {};
Object.defineProperty(fc, "__esModule", { value: !0 });
const Ln = de, c1 = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxProperties" ? "more" : "fewer";
    return (0, Ln.str)`must NOT have ${r} than ${e} properties`;
  },
  params: ({ schemaCode: t }) => (0, Ln._)`{limit: ${t}}`
}, l1 = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: c1,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxProperties" ? Ln.operators.GT : Ln.operators.LT;
    t.fail$data((0, Ln._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
fc.default = l1;
var hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
const bn = me, Dn = de, u1 = G, d1 = {
  message: ({ params: { missingProperty: t } }) => (0, Dn.str)`must have required property '${t}'`,
  params: ({ params: { missingProperty: t } }) => (0, Dn._)`{missingProperty: ${t}}`
}, f1 = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: d1,
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
          (0, u1.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        t.block$data(Dn.nil, f);
      else
        for (const p of r)
          (0, bn.checkReportMissingProp)(t, p);
    }
    function l() {
      const p = e.let("missing");
      if (c || a) {
        const w = e.let("valid", !0);
        t.block$data(w, () => g(p, w)), t.ok(w);
      } else
        e.if((0, bn.checkMissingProp)(t, r, p)), (0, bn.reportMissingProp)(t, p), e.else();
    }
    function f() {
      e.forOf("prop", n, (p) => {
        t.setParams({ missingProperty: p }), e.if((0, bn.noPropertyInData)(e, s, p, i.ownProperties), () => t.error());
      });
    }
    function g(p, w) {
      t.setParams({ missingProperty: p }), e.forOf(p, n, () => {
        e.assign(w, (0, bn.propertyInData)(e, s, p, i.ownProperties)), e.if((0, Dn.not)(w), () => {
          t.error(), e.break();
        });
      }, Dn.nil);
    }
  }
};
hc.default = f1;
var mc = {};
Object.defineProperty(mc, "__esModule", { value: !0 });
const Mn = de, h1 = {
  message({ keyword: t, schemaCode: e }) {
    const r = t === "maxItems" ? "more" : "fewer";
    return (0, Mn.str)`must NOT have ${r} than ${e} items`;
  },
  params: ({ schemaCode: t }) => (0, Mn._)`{limit: ${t}}`
}, m1 = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: h1,
  code(t) {
    const { keyword: e, data: r, schemaCode: n } = t, s = e === "maxItems" ? Mn.operators.GT : Mn.operators.LT;
    t.fail$data((0, Mn._)`${r}.length ${s} ${n}`);
  }
};
mc.default = m1;
var pc = {}, Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
const Tp = sa;
Tp.code = 'require("ajv/dist/runtime/equal").default';
Xn.default = Tp;
Object.defineProperty(pc, "__esModule", { value: !0 });
const qa = Ce, Me = de, p1 = G, y1 = Xn, $1 = {
  message: ({ params: { i: t, j: e } }) => (0, Me.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,
  params: ({ params: { i: t, j: e } }) => (0, Me._)`{i: ${t}, j: ${e}}`
}, g1 = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: $1,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: i } = t;
    if (!n && !s)
      return;
    const c = e.let("valid"), d = a.items ? (0, qa.getSchemaTypes)(a.items) : [];
    t.block$data(c, l, (0, Me._)`${o} === false`), t.ok(c);
    function l() {
      const w = e.let("i", (0, Me._)`${r}.length`), $ = e.let("j");
      t.setParams({ i: w, j: $ }), e.assign(c, !0), e.if((0, Me._)`${w} > 1`, () => (f() ? g : p)(w, $));
    }
    function f() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function g(w, $) {
      const v = e.name("item"), m = (0, qa.checkDataTypes)(d, v, i.opts.strictNumbers, qa.DataType.Wrong), b = e.const("indices", (0, Me._)`{}`);
      e.for((0, Me._)`;${w}--;`, () => {
        e.let(v, (0, Me._)`${r}[${w}]`), e.if(m, (0, Me._)`continue`), d.length > 1 && e.if((0, Me._)`typeof ${v} == "string"`, (0, Me._)`${v} += "_"`), e.if((0, Me._)`typeof ${b}[${v}] == "number"`, () => {
          e.assign($, (0, Me._)`${b}[${v}]`), t.error(), e.assign(c, !1).break();
        }).code((0, Me._)`${b}[${v}] = ${w}`);
      });
    }
    function p(w, $) {
      const v = (0, p1.useFunc)(e, y1.default), m = e.name("outer");
      e.label(m).for((0, Me._)`;${w}--;`, () => e.for((0, Me._)`${$} = ${w}; ${$}--;`, () => e.if((0, Me._)`${v}(${r}[${w}], ${r}[${$}])`, () => {
        t.error(), e.assign(c, !1).break(m);
      })));
    }
  }
};
pc.default = g1;
var yc = {};
Object.defineProperty(yc, "__esModule", { value: !0 });
const mo = de, v1 = G, _1 = Xn, w1 = {
  message: "must be equal to constant",
  params: ({ schemaCode: t }) => (0, mo._)`{allowedValue: ${t}}`
}, b1 = {
  keyword: "const",
  $data: !0,
  error: w1,
  code(t) {
    const { gen: e, data: r, $data: n, schemaCode: s, schema: a } = t;
    n || a && typeof a == "object" ? t.fail$data((0, mo._)`!${(0, v1.useFunc)(e, _1.default)}(${r}, ${s})`) : t.fail((0, mo._)`${a} !== ${r}`);
  }
};
yc.default = b1;
var $c = {};
Object.defineProperty($c, "__esModule", { value: !0 });
const Pn = de, S1 = G, E1 = Xn, N1 = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: t }) => (0, Pn._)`{allowedValues: ${t}}`
}, P1 = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: N1,
  code(t) {
    const { gen: e, data: r, $data: n, schema: s, schemaCode: a, it: o } = t;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const i = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, S1.useFunc)(e, E1.default));
    let l;
    if (i || n)
      l = e.let("valid"), t.block$data(l, f);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const p = e.const("vSchema", a);
      l = (0, Pn.or)(...s.map((w, $) => g(p, $)));
    }
    t.pass(l);
    function f() {
      e.assign(l, !1), e.forOf("v", a, (p) => e.if((0, Pn._)`${d()}(${r}, ${p})`, () => e.assign(l, !0).break()));
    }
    function g(p, w) {
      const $ = s[w];
      return typeof $ == "object" && $ !== null ? (0, Pn._)`${d()}(${r}, ${p}[${w}])` : (0, Pn._)`${r} === ${$}`;
    }
  }
};
$c.default = P1;
Object.defineProperty(oc, "__esModule", { value: !0 });
const T1 = ic, O1 = cc, R1 = lc, I1 = dc, j1 = fc, C1 = hc, A1 = mc, k1 = pc, L1 = yc, D1 = $c, M1 = [
  // number
  T1.default,
  O1.default,
  // string
  R1.default,
  I1.default,
  // object
  j1.default,
  C1.default,
  // array
  A1.default,
  k1.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  L1.default,
  D1.default
];
oc.default = M1;
var gc = {}, fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.validateAdditionalItems = void 0;
const gr = de, po = G, V1 = {
  message: ({ params: { len: t } }) => (0, gr.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, gr._)`{limit: ${t}}`
}, F1 = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: V1,
  code(t) {
    const { parentSchema: e, it: r } = t, { items: n } = e;
    if (!Array.isArray(n)) {
      (0, po.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Op(t, n);
  }
};
function Op(t, e) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = t;
  o.items = !0;
  const i = r.const("len", (0, gr._)`${s}.length`);
  if (n === !1)
    t.setParams({ len: e.length }), t.pass((0, gr._)`${i} <= ${e.length}`);
  else if (typeof n == "object" && !(0, po.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, gr._)`${i} <= ${e.length}`);
    r.if((0, gr.not)(d), () => c(d)), t.ok(d);
  }
  function c(d) {
    r.forRange("i", e.length, i, (l) => {
      t.subschema({ keyword: a, dataProp: l, dataPropType: po.Type.Num }, d), o.allErrors || r.if((0, gr.not)(d), () => r.break());
    });
  }
}
fn.validateAdditionalItems = Op;
fn.default = F1;
var vc = {}, hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.validateTuple = void 0;
const Xl = de, Cs = G, q1 = me, z1 = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(t) {
    const { schema: e, it: r } = t;
    if (Array.isArray(e))
      return Rp(t, "additionalItems", e);
    r.items = !0, !(0, Cs.alwaysValidSchema)(r, e) && t.ok((0, q1.validateArray)(t));
  }
};
function Rp(t, e, r = t.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: i } = t;
  l(s), i.opts.unevaluated && r.length && i.items !== !0 && (i.items = Cs.mergeEvaluated.items(n, r.length, i.items));
  const c = n.name("valid"), d = n.const("len", (0, Xl._)`${a}.length`);
  r.forEach((f, g) => {
    (0, Cs.alwaysValidSchema)(i, f) || (n.if((0, Xl._)`${d} > ${g}`, () => t.subschema({
      keyword: o,
      schemaProp: g,
      dataProp: g
    }, c)), t.ok(c));
  });
  function l(f) {
    const { opts: g, errSchemaPath: p } = i, w = r.length, $ = w === f.minItems && (w === f.maxItems || f[e] === !1);
    if (g.strictTuples && !$) {
      const v = `"${o}" is ${w}-tuple, but minItems or maxItems/${e} are not specified or different at path "${p}"`;
      (0, Cs.checkStrictMode)(i, v, g.strictTuples);
    }
  }
}
hn.validateTuple = Rp;
hn.default = z1;
Object.defineProperty(vc, "__esModule", { value: !0 });
const U1 = hn, B1 = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (t) => (0, U1.validateTuple)(t, "items")
};
vc.default = B1;
var _c = {};
Object.defineProperty(_c, "__esModule", { value: !0 });
const Yl = de, K1 = G, Q1 = me, G1 = fn, x1 = {
  message: ({ params: { len: t } }) => (0, Yl.str)`must NOT have more than ${t} items`,
  params: ({ params: { len: t } }) => (0, Yl._)`{limit: ${t}}`
}, H1 = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: x1,
  code(t) {
    const { schema: e, parentSchema: r, it: n } = t, { prefixItems: s } = r;
    n.items = !0, !(0, K1.alwaysValidSchema)(n, e) && (s ? (0, G1.validateAdditionalItems)(t, s) : t.ok((0, Q1.validateArray)(t)));
  }
};
_c.default = H1;
var wc = {};
Object.defineProperty(wc, "__esModule", { value: !0 });
const dt = de, ds = G, J1 = {
  message: ({ params: { min: t, max: e } }) => e === void 0 ? (0, dt.str)`must contain at least ${t} valid item(s)` : (0, dt.str)`must contain at least ${t} and no more than ${e} valid item(s)`,
  params: ({ params: { min: t, max: e } }) => e === void 0 ? (0, dt._)`{minContains: ${t}}` : (0, dt._)`{minContains: ${t}, maxContains: ${e}}`
}, W1 = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: J1,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    let o, i;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, i = d) : o = 1;
    const l = e.const("len", (0, dt._)`${s}.length`);
    if (t.setParams({ min: o, max: i }), i === void 0 && o === 0) {
      (0, ds.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (i !== void 0 && o > i) {
      (0, ds.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), t.fail();
      return;
    }
    if ((0, ds.alwaysValidSchema)(a, r)) {
      let $ = (0, dt._)`${l} >= ${o}`;
      i !== void 0 && ($ = (0, dt._)`${$} && ${l} <= ${i}`), t.pass($);
      return;
    }
    a.items = !0;
    const f = e.name("valid");
    i === void 0 && o === 1 ? p(f, () => e.if(f, () => e.break())) : o === 0 ? (e.let(f, !0), i !== void 0 && e.if((0, dt._)`${s}.length > 0`, g)) : (e.let(f, !1), g()), t.result(f, () => t.reset());
    function g() {
      const $ = e.name("_valid"), v = e.let("count", 0);
      p($, () => e.if($, () => w(v)));
    }
    function p($, v) {
      e.forRange("i", 0, l, (m) => {
        t.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: ds.Type.Num,
          compositeRule: !0
        }, $), v();
      });
    }
    function w($) {
      e.code((0, dt._)`${$}++`), i === void 0 ? e.if((0, dt._)`${$} >= ${o}`, () => e.assign(f, !0).break()) : (e.if((0, dt._)`${$} > ${i}`, () => e.assign(f, !1).break()), o === 1 ? e.assign(f, !0) : e.if((0, dt._)`${$} >= ${o}`, () => e.assign(f, !0)));
    }
  }
};
wc.default = W1;
var Ip = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.validateSchemaDeps = t.validatePropertyDeps = t.error = void 0;
  const e = de, r = G, n = me;
  t.error = {
    message: ({ params: { property: c, depsCount: d, deps: l } }) => {
      const f = d === 1 ? "property" : "properties";
      return (0, e.str)`must have ${f} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: l, missingProperty: f } }) => (0, e._)`{property: ${c},
    missingProperty: ${f},
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
    for (const f in c) {
      if (f === "__proto__")
        continue;
      const g = Array.isArray(c[f]) ? d : l;
      g[f] = c[f];
    }
    return [d, l];
  }
  function o(c, d = c.schema) {
    const { gen: l, data: f, it: g } = c;
    if (Object.keys(d).length === 0)
      return;
    const p = l.let("missing");
    for (const w in d) {
      const $ = d[w];
      if ($.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, f, w, g.opts.ownProperties);
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
    const { gen: l, data: f, keyword: g, it: p } = c, w = l.name("valid");
    for (const $ in d)
      (0, r.alwaysValidSchema)(p, d[$]) || (l.if(
        (0, n.propertyInData)(l, f, $, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: g, schemaProp: $ }, w);
          c.mergeValidEvaluated(v, w);
        },
        () => l.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  t.validateSchemaDeps = i, t.default = s;
})(Ip);
var bc = {};
Object.defineProperty(bc, "__esModule", { value: !0 });
const jp = de, X1 = G, Y1 = {
  message: "property name must be valid",
  params: ({ params: t }) => (0, jp._)`{propertyName: ${t.propertyName}}`
}, Z1 = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Y1,
  code(t) {
    const { gen: e, schema: r, data: n, it: s } = t;
    if ((0, X1.alwaysValidSchema)(s, r))
      return;
    const a = e.name("valid");
    e.forIn("key", n, (o) => {
      t.setParams({ propertyName: o }), t.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), e.if((0, jp.not)(a), () => {
        t.error(!0), s.allErrors || e.break();
      });
    }), t.ok(a);
  }
};
bc.default = Z1;
var ma = {};
Object.defineProperty(ma, "__esModule", { value: !0 });
const fs = me, gt = de, eN = ar(), hs = G, tN = {
  message: "must NOT have additional properties",
  params: ({ params: t }) => (0, gt._)`{additionalProperty: ${t.additionalProperty}}`
}, rN = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: tN,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = t;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: i, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, hs.alwaysValidSchema)(o, r))
      return;
    const d = (0, fs.allSchemaProperties)(n.properties), l = (0, fs.allSchemaProperties)(n.patternProperties);
    f(), t.ok((0, gt._)`${a} === ${eN.default.errors}`);
    function f() {
      e.forIn("key", s, (v) => {
        !d.length && !l.length ? w(v) : e.if(g(v), () => w(v));
      });
    }
    function g(v) {
      let m;
      if (d.length > 8) {
        const b = (0, hs.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, fs.isOwnProperty)(e, b, v);
      } else d.length ? m = (0, gt.or)(...d.map((b) => (0, gt._)`${v} === ${b}`)) : m = gt.nil;
      return l.length && (m = (0, gt.or)(m, ...l.map((b) => (0, gt._)`${(0, fs.usePattern)(t, b)}.test(${v})`))), (0, gt.not)(m);
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
      if (typeof r == "object" && !(0, hs.alwaysValidSchema)(o, r)) {
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
        dataPropType: hs.Type.Str
      };
      b === !1 && Object.assign(T, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), t.subschema(T, m);
    }
  }
};
ma.default = rN;
var Sc = {};
Object.defineProperty(Sc, "__esModule", { value: !0 });
const nN = da(), Zl = me, za = G, eu = ma, sN = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, parentSchema: n, data: s, it: a } = t;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && eu.default.code(new nN.KeywordCxt(a, eu.default, "additionalProperties"));
    const o = (0, Zl.allSchemaProperties)(r);
    for (const f of o)
      a.definedProperties.add(f);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = za.mergeEvaluated.props(e, (0, za.toHash)(o), a.props));
    const i = o.filter((f) => !(0, za.alwaysValidSchema)(a, r[f]));
    if (i.length === 0)
      return;
    const c = e.name("valid");
    for (const f of i)
      d(f) ? l(f) : (e.if((0, Zl.propertyInData)(e, s, f, a.opts.ownProperties)), l(f), a.allErrors || e.else().var(c, !0), e.endIf()), t.it.definedProperties.add(f), t.ok(c);
    function d(f) {
      return a.opts.useDefaults && !a.compositeRule && r[f].default !== void 0;
    }
    function l(f) {
      t.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, c);
    }
  }
};
Sc.default = sN;
var Ec = {};
Object.defineProperty(Ec, "__esModule", { value: !0 });
const tu = me, ms = de, ru = G, nu = G, aN = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(t) {
    const { gen: e, schema: r, data: n, parentSchema: s, it: a } = t, { opts: o } = a, i = (0, tu.allSchemaProperties)(r), c = i.filter(($) => (0, ru.alwaysValidSchema)(a, r[$]));
    if (i.length === 0 || c.length === i.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, l = e.name("valid");
    a.props !== !0 && !(a.props instanceof ms.Name) && (a.props = (0, nu.evaluatedPropsToName)(e, a.props));
    const { props: f } = a;
    g();
    function g() {
      for (const $ of i)
        d && p($), a.allErrors ? w($) : (e.var(l, !0), w($), e.if(l));
    }
    function p($) {
      for (const v in d)
        new RegExp($).test(v) && (0, ru.checkStrictMode)(a, `property ${v} matches pattern ${$} (use allowMatchingProperties)`);
    }
    function w($) {
      e.forIn("key", n, (v) => {
        e.if((0, ms._)`${(0, tu.usePattern)(t, $)}.test(${v})`, () => {
          const m = c.includes($);
          m || t.subschema({
            keyword: "patternProperties",
            schemaProp: $,
            dataProp: v,
            dataPropType: nu.Type.Str
          }, l), a.opts.unevaluated && f !== !0 ? e.assign((0, ms._)`${f}[${v}]`, !0) : !m && !a.allErrors && e.if((0, ms.not)(l), () => e.break());
        });
      });
    }
  }
};
Ec.default = aN;
var Nc = {};
Object.defineProperty(Nc, "__esModule", { value: !0 });
const oN = G, iN = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if ((0, oN.alwaysValidSchema)(n, r)) {
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
Nc.default = iN;
var Pc = {};
Object.defineProperty(Pc, "__esModule", { value: !0 });
const cN = me, lN = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: cN.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Pc.default = lN;
var Tc = {};
Object.defineProperty(Tc, "__esModule", { value: !0 });
const As = de, uN = G, dN = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: t }) => (0, As._)`{passingSchemas: ${t.passing}}`
}, fN = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: dN,
  code(t) {
    const { gen: e, schema: r, parentSchema: n, it: s } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = e.let("valid", !1), i = e.let("passing", null), c = e.name("_valid");
    t.setParams({ passing: i }), e.block(d), t.result(o, () => t.reset(), () => t.error(!0));
    function d() {
      a.forEach((l, f) => {
        let g;
        (0, uN.alwaysValidSchema)(s, l) ? e.var(c, !0) : g = t.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && e.if((0, As._)`${c} && ${o}`).assign(o, !1).assign(i, (0, As._)`[${i}, ${f}]`).else(), e.if(c, () => {
          e.assign(o, !0), e.assign(i, f), g && t.mergeEvaluated(g, As.Name);
        });
      });
    }
  }
};
Tc.default = fN;
var Oc = {};
Object.defineProperty(Oc, "__esModule", { value: !0 });
const hN = G, mN = {
  keyword: "allOf",
  schemaType: "array",
  code(t) {
    const { gen: e, schema: r, it: n } = t;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = e.name("valid");
    r.forEach((a, o) => {
      if ((0, hN.alwaysValidSchema)(n, a))
        return;
      const i = t.subschema({ keyword: "allOf", schemaProp: o }, s);
      t.ok(s), t.mergeEvaluated(i);
    });
  }
};
Oc.default = mN;
var Rc = {};
Object.defineProperty(Rc, "__esModule", { value: !0 });
const Qs = de, Cp = G, pN = {
  message: ({ params: t }) => (0, Qs.str)`must match "${t.ifClause}" schema`,
  params: ({ params: t }) => (0, Qs._)`{failingKeyword: ${t.ifClause}}`
}, yN = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: pN,
  code(t) {
    const { gen: e, parentSchema: r, it: n } = t;
    r.then === void 0 && r.else === void 0 && (0, Cp.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = su(n, "then"), a = su(n, "else");
    if (!s && !a)
      return;
    const o = e.let("valid", !0), i = e.name("_valid");
    if (c(), t.reset(), s && a) {
      const l = e.let("ifClause");
      t.setParams({ ifClause: l }), e.if(i, d("then", l), d("else", l));
    } else s ? e.if(i, d("then")) : e.if((0, Qs.not)(i), d("else"));
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
    function d(l, f) {
      return () => {
        const g = t.subschema({ keyword: l }, i);
        e.assign(o, i), t.mergeValidEvaluated(g, o), f ? e.assign(f, (0, Qs._)`${l}`) : t.setParams({ ifClause: l });
      };
    }
  }
};
function su(t, e) {
  const r = t.schema[e];
  return r !== void 0 && !(0, Cp.alwaysValidSchema)(t, r);
}
Rc.default = yN;
var Ic = {};
Object.defineProperty(Ic, "__esModule", { value: !0 });
const $N = G, gN = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: t, parentSchema: e, it: r }) {
    e.if === void 0 && (0, $N.checkStrictMode)(r, `"${t}" without "if" is ignored`);
  }
};
Ic.default = gN;
Object.defineProperty(gc, "__esModule", { value: !0 });
const vN = fn, _N = vc, wN = hn, bN = _c, SN = wc, EN = Ip, NN = bc, PN = ma, TN = Sc, ON = Ec, RN = Nc, IN = Pc, jN = Tc, CN = Oc, AN = Rc, kN = Ic;
function LN(t = !1) {
  const e = [
    // any
    RN.default,
    IN.default,
    jN.default,
    CN.default,
    AN.default,
    kN.default,
    // object
    NN.default,
    PN.default,
    EN.default,
    TN.default,
    ON.default
  ];
  return t ? e.push(_N.default, bN.default) : e.push(vN.default, wN.default), e.push(SN.default), e;
}
gc.default = LN;
var jc = {}, Cc = {};
Object.defineProperty(Cc, "__esModule", { value: !0 });
const Re = de, DN = {
  message: ({ schemaCode: t }) => (0, Re.str)`must match format "${t}"`,
  params: ({ schemaCode: t }) => (0, Re._)`{format: ${t}}`
}, MN = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: DN,
  code(t, e) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: i } = t, { opts: c, errSchemaPath: d, schemaEnv: l, self: f } = i;
    if (!c.validateFormats)
      return;
    s ? g() : p();
    function g() {
      const w = r.scopeValue("formats", {
        ref: f.formats,
        code: c.code.formats
      }), $ = r.const("fDef", (0, Re._)`${w}[${o}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, Re._)`typeof ${$} == "object" && !(${$} instanceof RegExp)`, () => r.assign(v, (0, Re._)`${$}.type || "string"`).assign(m, (0, Re._)`${$}.validate`), () => r.assign(v, (0, Re._)`"string"`).assign(m, $)), t.fail$data((0, Re.or)(b(), T()));
      function b() {
        return c.strictSchema === !1 ? Re.nil : (0, Re._)`${o} && !${m}`;
      }
      function T() {
        const R = l.$async ? (0, Re._)`(${$}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, Re._)`${m}(${n})`, j = (0, Re._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, Re._)`${m} && ${m} !== true && ${v} === ${e} && !${j}`;
      }
    }
    function p() {
      const w = f.formats[a];
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
          f.logger.warn(j());
          return;
        }
        throw new Error(j());
        function j() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function T(j) {
        const U = j instanceof RegExp ? (0, Re.regexpCode)(j) : c.code.formats ? (0, Re._)`${c.code.formats}${(0, Re.getProperty)(a)}` : void 0, M = r.scopeValue("formats", { key: a, ref: j, code: U });
        return typeof j == "object" && !(j instanceof RegExp) ? [j.type || "string", j.validate, (0, Re._)`${M}.validate`] : ["string", j, M];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Re._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, Re._)`${m}(${n})` : (0, Re._)`${m}.test(${n})`;
      }
    }
  }
};
Cc.default = MN;
Object.defineProperty(jc, "__esModule", { value: !0 });
const VN = Cc, FN = [VN.default];
jc.default = FN;
var nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.contentVocabulary = nn.metadataVocabulary = void 0;
nn.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
nn.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(nc, "__esModule", { value: !0 });
const qN = sc, zN = oc, UN = gc, BN = jc, au = nn, KN = [
  qN.default,
  zN.default,
  (0, UN.default)(),
  BN.default,
  au.metadataVocabulary,
  au.contentVocabulary
];
nc.default = KN;
var Ac = {}, pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
pa.DiscrError = void 0;
var ou;
(function(t) {
  t.Tag = "tag", t.Mapping = "mapping";
})(ou || (pa.DiscrError = ou = {}));
Object.defineProperty(Ac, "__esModule", { value: !0 });
const zr = de, yo = pa, iu = st, QN = dn, GN = G, xN = {
  message: ({ params: { discrError: t, tagName: e } }) => t === yo.DiscrError.Tag ? `tag "${e}" must be string` : `value of tag "${e}" must be in oneOf`,
  params: ({ params: { discrError: t, tag: e, tagName: r } }) => (0, zr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`
}, HN = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: xN,
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
    const c = e.let("valid", !1), d = e.const("tag", (0, zr._)`${r}${(0, zr.getProperty)(i)}`);
    e.if((0, zr._)`typeof ${d} == "string"`, () => l(), () => t.error(!1, { discrError: yo.DiscrError.Tag, tag: d, tagName: i })), t.ok(c);
    function l() {
      const p = g();
      e.if(!1);
      for (const w in p)
        e.elseIf((0, zr._)`${d} === ${w}`), e.assign(c, f(p[w]));
      e.else(), t.error(!1, { discrError: yo.DiscrError.Mapping, tag: d, tagName: i }), e.endIf();
    }
    function f(p) {
      const w = e.name("valid"), $ = t.subschema({ keyword: "oneOf", schemaProp: p }, w);
      return t.mergeEvaluated($, zr.Name), w;
    }
    function g() {
      var p;
      const w = {}, $ = m(s);
      let v = !0;
      for (let R = 0; R < o.length; R++) {
        let j = o[R];
        if (j != null && j.$ref && !(0, GN.schemaHasRulesButRef)(j, a.self.RULES)) {
          const M = j.$ref;
          if (j = iu.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, M), j instanceof iu.SchemaEnv && (j = j.schema), j === void 0)
            throw new QN.default(a.opts.uriResolver, a.baseId, M);
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
Ac.default = HN;
const JN = "http://json-schema.org/draft-07/schema#", WN = "http://json-schema.org/draft-07/schema#", XN = "Core schema meta-schema", YN = {
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
}, ZN = [
  "object",
  "boolean"
], eP = {
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
}, tP = {
  $schema: JN,
  $id: WN,
  title: XN,
  definitions: YN,
  type: ZN,
  properties: eP,
  default: !0
};
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
  const r = ip, n = nc, s = Ac, a = tP, o = ["/properties"], i = "http://json-schema.org/draft-07/schema";
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
  var d = da();
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
  var f = ec();
  Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var g = dn;
  Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
    return g.default;
  } });
})(co, co.exports);
var rP = co.exports;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.formatLimitDefinition = void 0;
  const e = rP, r = de, n = r.operators, s = {
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
      const { gen: c, data: d, schemaCode: l, keyword: f, it: g } = i, { opts: p, self: w } = g;
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
          throw new Error(`"${f}": format "${T}" does not define "compare" function`);
        const j = c.scopeValue("formats", {
          key: T,
          ref: R,
          code: p.code.formats ? (0, r._)`${p.code.formats}${(0, r.getProperty)(T)}` : void 0
        });
        i.fail$data(b(j));
      }
      function b(T) {
        return (0, r._)`${T}.compare(${d}, ${l}) ${s[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (i) => (i.addKeyword(t.formatLimitDefinition), i);
  t.default = o;
})(op);
(function(t, e) {
  Object.defineProperty(e, "__esModule", { value: !0 });
  const r = ap, n = op, s = de, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), i = (d, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(d, l, r.fullFormats, a), d;
    const [f, g] = l.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], p = l.formats || r.formatNames;
    return c(d, p, f, g), l.keywords && (0, n.default)(d), d;
  };
  i.get = (d, l = "full") => {
    const g = (l === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!g)
      throw new Error(`Unknown format "${d}"`);
    return g;
  };
  function c(d, l, f, g) {
    var p, w;
    (p = (w = d.opts.code).formats) !== null && p !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${g}`);
    for (const $ of l)
      d.addFormat($, f[$]);
  }
  t.exports = e = i, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = i;
})(io, io.exports);
var nP = io.exports;
const sP = /* @__PURE__ */ tm(nP), aP = (t, e, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(t, r), a = Object.getOwnPropertyDescriptor(e, r);
  !oP(s, a) && n || Object.defineProperty(t, r, a);
}, oP = function(t, e) {
  return t === void 0 || t.configurable || t.writable === e.writable && t.enumerable === e.enumerable && t.configurable === e.configurable && (t.writable || t.value === e.value);
}, iP = (t, e) => {
  const r = Object.getPrototypeOf(e);
  r !== Object.getPrototypeOf(t) && Object.setPrototypeOf(t, r);
}, cP = (t, e) => `/* Wrapped ${t}*/
${e}`, lP = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), uP = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), dP = (t, e, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = cP.bind(null, n, e.toString());
  Object.defineProperty(s, "name", uP);
  const { writable: a, enumerable: o, configurable: i } = lP;
  Object.defineProperty(t, "toString", { value: s, writable: a, enumerable: o, configurable: i });
};
function fP(t, e, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = t;
  for (const s of Reflect.ownKeys(e))
    aP(t, e, s, r);
  return iP(t, e), dP(t, e, n), t;
}
const cu = (t, e = {}) => {
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
    const f = this, g = () => {
      o = void 0, i && (clearTimeout(i), i = void 0), a && (c = t.apply(f, l));
    }, p = () => {
      i = void 0, o && (clearTimeout(o), o = void 0), a && (c = t.apply(f, l));
    }, w = s && !o;
    return clearTimeout(o), o = setTimeout(g, r), n > 0 && n !== Number.POSITIVE_INFINITY && !i && (i = setTimeout(p, n)), w && (c = t.apply(f, l)), c;
  };
  return fP(d, t), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), i && (clearTimeout(i), i = void 0);
  }, d;
};
var $o = { exports: {} };
const hP = "2.0.0", Ap = 256, mP = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, pP = 16, yP = Ap - 6, $P = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Yn = {
  MAX_LENGTH: Ap,
  MAX_SAFE_COMPONENT_LENGTH: pP,
  MAX_SAFE_BUILD_LENGTH: yP,
  MAX_SAFE_INTEGER: mP,
  RELEASE_TYPES: $P,
  SEMVER_SPEC_VERSION: hP,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const gP = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...t) => console.error("SEMVER", ...t) : () => {
};
var ya = gP;
(function(t, e) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Yn, a = ya;
  e = t.exports = {};
  const o = e.re = [], i = e.safeRe = [], c = e.src = [], d = e.safeSrc = [], l = e.t = {};
  let f = 0;
  const g = "[a-zA-Z0-9-]", p = [
    ["\\s", 1],
    ["\\d", s],
    [g, n]
  ], w = (v) => {
    for (const [m, b] of p)
      v = v.split(`${m}*`).join(`${m}{0,${b}}`).split(`${m}+`).join(`${m}{1,${b}}`);
    return v;
  }, $ = (v, m, b) => {
    const T = w(m), R = f++;
    a(v, R, m), l[v] = R, c[R] = m, d[R] = T, o[R] = new RegExp(m, b ? "g" : void 0), i[R] = new RegExp(T, b ? "g" : void 0);
  };
  $("NUMERICIDENTIFIER", "0|[1-9]\\d*"), $("NUMERICIDENTIFIERLOOSE", "\\d+"), $("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${g}*`), $("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), $("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), $("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), $("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), $("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), $("BUILDIDENTIFIER", `${g}+`), $("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), $("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), $("FULL", `^${c[l.FULLPLAIN]}$`), $("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), $("LOOSE", `^${c[l.LOOSEPLAIN]}$`), $("GTLT", "((?:<|>)?=?)"), $("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), $("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), $("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), $("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), $("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), $("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), $("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), $("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), $("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), $("COERCERTL", c[l.COERCE], !0), $("COERCERTLFULL", c[l.COERCEFULL], !0), $("LONETILDE", "(?:~>?)"), $("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", $("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), $("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), $("LONECARET", "(?:\\^)"), $("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", $("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), $("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), $("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), $("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), $("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", $("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), $("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), $("STAR", "(<|>)?=?\\s*\\*"), $("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), $("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})($o, $o.exports);
var Zn = $o.exports;
const vP = Object.freeze({ loose: !0 }), _P = Object.freeze({}), wP = (t) => t ? typeof t != "object" ? vP : t : _P;
var kc = wP;
const lu = /^[0-9]+$/, kp = (t, e) => {
  if (typeof t == "number" && typeof e == "number")
    return t === e ? 0 : t < e ? -1 : 1;
  const r = lu.test(t), n = lu.test(e);
  return r && n && (t = +t, e = +e), t === e ? 0 : r && !n ? -1 : n && !r ? 1 : t < e ? -1 : 1;
}, bP = (t, e) => kp(e, t);
var Lp = {
  compareIdentifiers: kp,
  rcompareIdentifiers: bP
};
const ps = ya, { MAX_LENGTH: uu, MAX_SAFE_INTEGER: ys } = Yn, { safeRe: $s, t: gs } = Zn, SP = kc, { compareIdentifiers: go } = Lp, EP = (t, e) => {
  const r = e.split(".");
  if (r.length > t.length)
    return !1;
  for (let n = 0; n < r.length; n++)
    if (go(t[n], r[n]) !== 0)
      return !1;
  return !0;
};
let NP = class Pt {
  constructor(e, r) {
    if (r = SP(r), e instanceof Pt) {
      if (e.loose === !!r.loose && e.includePrerelease === !!r.includePrerelease)
        return e;
      e = e.version;
    } else if (typeof e != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);
    if (e.length > uu)
      throw new TypeError(
        `version is longer than ${uu} characters`
      );
    ps("SemVer", e, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = e.trim().match(r.loose ? $s[gs.LOOSE] : $s[gs.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${e}`);
    if (this.raw = e, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > ys || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > ys || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > ys || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < ys)
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
    if (ps("SemVer.compare", this.version, this.options, e), !(e instanceof Pt)) {
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
      if (ps("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return go(n, s);
    } while (++r);
  }
  compareBuild(e) {
    e instanceof Pt || (e = new Pt(e, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = e.build[r];
      if (ps("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return go(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(e, r, n) {
    if (e.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? $s[gs.PRERELEASELOOSE] : $s[gs.PRERELEASE]);
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
          if (n === !1 && (a = [r]), EP(this.prerelease, r)) {
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
var We = NP;
const du = We, PP = (t, e, r = !1) => {
  if (t instanceof du)
    return t;
  try {
    return new du(t, e);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Cr = PP;
const TP = Cr, OP = (t, e) => {
  const r = TP(t, e);
  return r ? r.version : null;
};
var RP = OP;
const IP = Cr, jP = (t, e) => {
  const r = IP(t.trim().replace(/^[=v]+/, ""), e);
  return r ? r.version : null;
};
var CP = jP;
const fu = We, AP = (t, e, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new fu(
      t instanceof fu ? t.version : t,
      r
    ).inc(e, n, s).version;
  } catch {
    return null;
  }
};
var kP = AP;
const hu = Cr, LP = (t, e) => {
  const r = hu(t, null, !0), n = hu(e, null, !0), s = r.compare(n);
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
var DP = LP;
const MP = We, VP = (t, e) => new MP(t, e).major;
var FP = VP;
const qP = We, zP = (t, e) => new qP(t, e).minor;
var UP = zP;
const BP = We, KP = (t, e) => new BP(t, e).patch;
var QP = KP;
const GP = Cr, xP = (t, e) => {
  const r = GP(t, e);
  return r && r.prerelease.length ? r.prerelease : null;
};
var HP = xP;
const mu = We, JP = (t, e, r) => new mu(t, r).compare(new mu(e, r));
var St = JP;
const WP = St, XP = (t, e, r) => WP(e, t, r);
var YP = XP;
const ZP = St, eT = (t, e) => ZP(t, e, !0);
var tT = eT;
const pu = We, rT = (t, e, r) => {
  const n = new pu(t, r), s = new pu(e, r);
  return n.compare(s) || n.compareBuild(s);
};
var Lc = rT;
const nT = Lc, sT = (t, e) => t.sort((r, n) => nT(r, n, e));
var aT = sT;
const oT = Lc, iT = (t, e) => t.sort((r, n) => oT(n, r, e));
var cT = iT;
const lT = St, uT = (t, e, r) => lT(t, e, r) > 0;
var $a = uT;
const dT = St, fT = (t, e, r) => dT(t, e, r) < 0;
var Dc = fT;
const hT = St, mT = (t, e, r) => hT(t, e, r) === 0;
var Dp = mT;
const pT = St, yT = (t, e, r) => pT(t, e, r) !== 0;
var Mp = yT;
const $T = St, gT = (t, e, r) => $T(t, e, r) >= 0;
var Mc = gT;
const vT = St, _T = (t, e, r) => vT(t, e, r) <= 0;
var Vc = _T;
const wT = Dp, bT = Mp, ST = $a, ET = Mc, NT = Dc, PT = Vc, TT = (t, e, r, n) => {
  switch (e) {
    case "===":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t === r;
    case "!==":
      return typeof t == "object" && (t = t.version), typeof r == "object" && (r = r.version), t !== r;
    case "":
    case "=":
    case "==":
      return wT(t, r, n);
    case "!=":
      return bT(t, r, n);
    case ">":
      return ST(t, r, n);
    case ">=":
      return ET(t, r, n);
    case "<":
      return NT(t, r, n);
    case "<=":
      return PT(t, r, n);
    default:
      throw new TypeError(`Invalid operator: ${e}`);
  }
};
var Vp = TT;
const OT = We, RT = Cr, { safeRe: vs, t: _s } = Zn, IT = (t, e) => {
  if (t instanceof OT)
    return t;
  if (typeof t == "number" && (t = String(t)), typeof t != "string")
    return null;
  e = e || {};
  let r = null;
  if (!e.rtl)
    r = t.match(e.includePrerelease ? vs[_s.COERCEFULL] : vs[_s.COERCE]);
  else {
    const c = e.includePrerelease ? vs[_s.COERCERTLFULL] : vs[_s.COERCERTL];
    let d;
    for (; (d = c.exec(t)) && (!r || r.index + r[0].length !== t.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = e.includePrerelease && r[5] ? `-${r[5]}` : "", i = e.includePrerelease && r[6] ? `+${r[6]}` : "";
  return RT(`${n}.${s}.${a}${o}${i}`, e);
};
var jT = IT;
const CT = Cr, AT = Yn, kT = We, LT = (t, e, r) => {
  if (!AT.RELEASE_TYPES.includes(e))
    return null;
  const n = DT(t, r);
  return n && MT(n, e);
}, DT = (t, e) => {
  const r = t instanceof kT ? t.version : t;
  return CT(r, e);
}, MT = (t, e) => {
  if (VT(e))
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
}, VT = (t) => t.startsWith("pre");
var FT = LT;
class qT {
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
var zT = qT, Ua, yu;
function Et() {
  if (yu) return Ua;
  yu = 1;
  const t = /\s+/g;
  class e {
    constructor(F, J) {
      if (J = s(J), F instanceof e)
        return F.loose === !!J.loose && F.includePrerelease === !!J.includePrerelease ? F : new e(F.raw, J);
      if (F instanceof a)
        return this.raw = F.value, this.set = [[F]], this.formatted = void 0, this;
      if (this.options = J, this.loose = !!J.loose, this.includePrerelease = !!J.includePrerelease, this.raw = F.trim().replace(t, " "), this.set = this.raw.split("||").map((P) => this.parseRange(P.trim())).filter((P) => P.length), !this.set.length)
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
        for (let F = 0; F < this.set.length; F++) {
          F > 0 && (this.formatted += "||");
          const J = this.set[F];
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
    parseRange(F) {
      F = F.replace(v, "");
      const P = ((this.options.includePrerelease && w) | (this.options.loose && $)) + ":" + F, y = n.get(P);
      if (y)
        return y;
      const E = this.options.loose, _ = E ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
      F = F.replace(_, pe(this.options.includePrerelease)), o("hyphen replace", F), F = F.replace(c[l.COMPARATORTRIM], f), o("comparator trim", F), F = F.replace(c[l.TILDETRIM], g), o("tilde trim", F), F = F.replace(c[l.CARETTRIM], p), o("caret trim", F);
      let u = F.split(" ").map((k) => R(k, this.options)).join(" ").split(/\s+/).map((k) => K(k, this.options));
      E && (u = u.filter((k) => (o("loose invalid filter", k, this.options), !!k.match(c[l.COMPARATORLOOSE])))), o("range list", u);
      const h = /* @__PURE__ */ new Map(), S = u.map((k) => new a(k, this.options));
      for (const k of S) {
        if (m(k))
          return [k];
        h.set(k.value, k);
      }
      h.size > 1 && h.has("") && h.delete("");
      const A = [...h.values()];
      return n.set(P, A), A;
    }
    intersects(F, J) {
      if (!(F instanceof e))
        throw new TypeError("a Range is required");
      return this.set.some((P) => T(P, J) && F.set.some((y) => T(y, J) && P.every((E) => y.every((_) => E.intersects(_, J)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(F) {
      if (!F)
        return !1;
      if (typeof F == "string")
        try {
          F = new i(F, this.options);
        } catch {
          return !1;
        }
      for (let J = 0; J < this.set.length; J++)
        if (Ne(this.set[J], F, this.options))
          return !0;
      return !1;
    }
  }
  Ua = e;
  const r = zT, n = new r(), s = kc, a = ga(), o = ya, i = We, {
    safeRe: c,
    src: d,
    t: l,
    comparatorTrimReplace: f,
    tildeTrimReplace: g,
    caretTrimReplace: p
  } = Zn, { FLAG_INCLUDE_PRERELEASE: w, FLAG_LOOSE: $ } = Yn, v = new RegExp(d[l.BUILD], "g"), m = (q) => q.value === "<0.0.0-0", b = (q) => q.value === "", T = (q, F) => {
    let J = !0;
    const P = q.slice();
    let y = P.pop();
    for (; J && P.length; )
      J = P.every((E) => y.intersects(E, F)), y = P.pop();
    return J;
  }, R = (q, F) => (q = q.replace(c[l.BUILD], ""), o("comp", q, F), q = fe(q, F), o("caret", q), q = M(q, F), o("tildes", q), q = x(q, F), o("xrange", q), q = Z(q, F), o("stars", q), q), j = (q) => !q || q.toLowerCase() === "x" || q === "*", U = (q, F, J) => j(q) && !j(F) || j(F) && J && !j(J), M = (q, F) => q.trim().split(/\s+/).map((J) => te(J, F)).join(" "), te = (q, F) => {
    const J = F.loose ? c[l.TILDELOOSE] : c[l.TILDE], P = F.includePrerelease ? "-0" : "";
    return q.replace(J, (y, E, _, u, h) => {
      o("tilde", q, y, E, _, u, h);
      let S;
      return j(E) ? S = "" : j(_) ? S = `>=${E}.0.0${P} <${+E + 1}.0.0-0` : j(u) ? S = `>=${E}.${_}.0${P} <${E}.${+_ + 1}.0-0` : h ? (o("replaceTilde pr", h), S = `>=${E}.${_}.${u}-${h} <${E}.${+_ + 1}.0-0`) : S = `>=${E}.${_}.${u} <${E}.${+_ + 1}.0-0`, o("tilde return", S), S;
    });
  }, fe = (q, F) => q.trim().split(/\s+/).map((J) => $e(J, F)).join(" "), $e = (q, F) => {
    o("caret", q, F);
    const J = F.loose ? c[l.CARETLOOSE] : c[l.CARET], P = F.includePrerelease ? "-0" : "";
    return q.replace(J, (y, E, _, u, h) => {
      o("caret", q, y, E, _, u, h);
      let S;
      return j(E) ? S = "" : j(_) ? S = `>=${E}.0.0${P} <${+E + 1}.0.0-0` : j(u) ? E === "0" ? S = `>=${E}.${_}.0${P} <${E}.${+_ + 1}.0-0` : S = `>=${E}.${_}.0${P} <${+E + 1}.0.0-0` : h ? (o("replaceCaret pr", h), E === "0" ? _ === "0" ? S = `>=${E}.${_}.${u}-${h} <${E}.${_}.${+u + 1}-0` : S = `>=${E}.${_}.${u}-${h} <${E}.${+_ + 1}.0-0` : S = `>=${E}.${_}.${u}-${h} <${+E + 1}.0.0-0`) : (o("no pr"), E === "0" ? _ === "0" ? S = `>=${E}.${_}.${u} <${E}.${_}.${+u + 1}-0` : S = `>=${E}.${_}.${u} <${E}.${+_ + 1}.0-0` : S = `>=${E}.${_}.${u} <${+E + 1}.0.0-0`), o("caret return", S), S;
    });
  }, x = (q, F) => (o("replaceXRanges", q, F), q.split(/\s+/).map((J) => X(J, F)).join(" ")), X = (q, F) => {
    q = q.trim();
    const J = F.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
    return q.replace(J, (P, y, E, _, u, h) => {
      if (o("xRange", q, P, y, E, _, u, h), U(E, _, u))
        return q;
      const S = j(E), A = S || j(_), k = A || j(u), H = k;
      return y === "=" && H && (y = ""), h = F.includePrerelease ? "-0" : "", S ? y === ">" || y === "<" ? P = "<0.0.0-0" : P = "*" : y && H ? (A && (_ = 0), u = 0, y === ">" ? (y = ">=", A ? (E = +E + 1, _ = 0, u = 0) : (_ = +_ + 1, u = 0)) : y === "<=" && (y = "<", A ? E = +E + 1 : _ = +_ + 1), y === "<" && (h = "-0"), P = `${y + E}.${_}.${u}${h}`) : A ? P = `>=${E}.0.0${h} <${+E + 1}.0.0-0` : k && (P = `>=${E}.${_}.0${h} <${E}.${+_ + 1}.0-0`), o("xRange return", P), P;
    });
  }, Z = (q, F) => (o("replaceStars", q, F), q.trim().replace(c[l.STAR], "")), K = (q, F) => (o("replaceGTE0", q, F), q.trim().replace(c[F.includePrerelease ? l.GTE0PRE : l.GTE0], "")), pe = (q) => (F, J, P, y, E, _, u, h, S, A, k, H) => (j(P) ? J = "" : j(y) ? J = `>=${P}.0.0${q ? "-0" : ""}` : j(E) ? J = `>=${P}.${y}.0${q ? "-0" : ""}` : _ ? J = `>=${J}` : J = `>=${J}${q ? "-0" : ""}`, j(S) ? h = "" : j(A) ? h = `<${+S + 1}.0.0-0` : j(k) ? h = `<${S}.${+A + 1}.0-0` : H ? h = `<=${S}.${A}.${k}-${H}` : q ? h = `<${S}.${A}.${+k + 1}-0` : h = `<=${h}`, `${J} ${h}`.trim()), Ne = (q, F, J) => {
    for (let P = 0; P < q.length; P++)
      if (!q[P].test(F))
        return !1;
    if (F.prerelease.length && !J.includePrerelease) {
      for (let P = 0; P < q.length; P++)
        if (o(q[P].semver), q[P].semver !== a.ANY && q[P].semver.prerelease.length > 0) {
          const y = q[P].semver;
          if (y.major === F.major && y.minor === F.minor && y.patch === F.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ua;
}
var Ba, $u;
function ga() {
  if ($u) return Ba;
  $u = 1;
  const t = Symbol("SemVer ANY");
  class e {
    static get ANY() {
      return t;
    }
    constructor(l, f) {
      if (f = r(f), l instanceof e) {
        if (l.loose === !!f.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), o("comparator", l, f), this.options = f, this.loose = !!f.loose, this.parse(l), this.semver === t ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(l) {
      const f = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], g = l.match(f);
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
    intersects(l, f) {
      if (!(l instanceof e))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, f).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, f).test(l.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || a(this.semver, "<", l.semver, f) && this.operator.startsWith(">") && l.operator.startsWith("<") || a(this.semver, ">", l.semver, f) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  Ba = e;
  const r = kc, { safeRe: n, t: s } = Zn, a = Vp, o = ya, i = We, c = Et();
  return Ba;
}
const UT = Et(), BT = (t, e, r) => {
  try {
    e = new UT(e, r);
  } catch {
    return !1;
  }
  return e.test(t);
};
var va = BT;
const KT = Et(), QT = (t, e) => new KT(t, e).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var GT = QT;
const xT = We, HT = Et(), JT = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new HT(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new xT(n, r));
  }), n;
};
var WT = JT;
const XT = We, YT = Et(), ZT = (t, e, r) => {
  let n = null, s = null, a = null;
  try {
    a = new YT(e, r);
  } catch {
    return null;
  }
  return t.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new XT(n, r));
  }), n;
};
var eO = ZT;
const Ka = We, tO = Et(), gu = $a, rO = (t, e) => {
  t = new tO(t, e);
  let r = new Ka("0.0.0");
  if (t.test(r) || (r = new Ka("0.0.0-0"), t.test(r)))
    return r;
  r = null;
  for (let n = 0; n < t.set.length; ++n) {
    const s = t.set[n];
    let a = null;
    s.forEach((o) => {
      const i = new Ka(o.semver.version);
      switch (o.operator) {
        case ">":
          i.prerelease.length === 0 ? i.patch++ : i.prerelease.push(0), i.raw = i.format();
        case "":
        case ">=":
          (!a || gu(i, a)) && (a = i);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || gu(r, a)) && (r = a);
  }
  return r && t.test(r) ? r : null;
};
var nO = rO;
const sO = Et(), aO = (t, e) => {
  try {
    return new sO(t, e).range || "*";
  } catch {
    return null;
  }
};
var oO = aO;
const iO = We, Fp = ga(), { ANY: cO } = Fp, lO = Et(), uO = va, vu = $a, _u = Dc, dO = Vc, fO = Mc, hO = (t, e, r, n) => {
  t = new iO(t, n), e = new lO(e, n);
  let s, a, o, i, c;
  switch (r) {
    case ">":
      s = vu, a = dO, o = _u, i = ">", c = ">=";
      break;
    case "<":
      s = _u, a = fO, o = vu, i = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (uO(t, e, n))
    return !1;
  for (let d = 0; d < e.set.length; ++d) {
    const l = e.set[d];
    let f = null, g = null;
    if (l.forEach((p) => {
      p.semver === cO && (p = new Fp(">=0.0.0")), f = f || p, g = g || p, s(p.semver, f.semver, n) ? f = p : o(p.semver, g.semver, n) && (g = p);
    }), f.operator === i || f.operator === c || (!g.operator || g.operator === i) && a(t, g.semver))
      return !1;
    if (g.operator === c && o(t, g.semver))
      return !1;
  }
  return !0;
};
var Fc = hO;
const mO = Fc, pO = (t, e, r) => mO(t, e, ">", r);
var yO = pO;
const $O = Fc, gO = (t, e, r) => $O(t, e, "<", r);
var vO = gO;
const wu = Et(), _O = (t, e, r) => (t = new wu(t, r), e = new wu(e, r), t.intersects(e, r));
var wO = _O;
const bO = va, SO = St;
var EO = (t, e, r) => {
  const n = [];
  let s = null, a = null;
  const o = t.sort((l, f) => SO(l, f, r));
  for (const l of o)
    bO(l, e, r) ? (a = l, s || (s = l)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const i = [];
  for (const [l, f] of n)
    l === f ? i.push(l) : !f && l === o[0] ? i.push("*") : f ? l === o[0] ? i.push(`<=${f}`) : i.push(`${l} - ${f}`) : i.push(`>=${l}`);
  const c = i.join(" || "), d = typeof e.raw == "string" ? e.raw : String(e);
  return c.length < d.length ? c : e;
};
const bu = Et(), qc = ga(), { ANY: Qa } = qc, Ga = va, zc = St, NO = (t, e, r = {}) => {
  if (t === e)
    return !0;
  t = new bu(t, r), e = new bu(e, r);
  let n = !1;
  e: for (const s of t.set) {
    for (const a of e.set) {
      const o = TO(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, PO = [new qc(">=0.0.0-0")], Su = [new qc(">=0.0.0")], TO = (t, e, r) => {
  if (t === e)
    return !0;
  if (t.length === 1 && t[0].semver === Qa) {
    if (e.length === 1 && e[0].semver === Qa)
      return !0;
    r.includePrerelease ? t = PO : t = Su;
  }
  if (e.length === 1 && e[0].semver === Qa) {
    if (r.includePrerelease)
      return !0;
    e = Su;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const p of t)
    p.operator === ">" || p.operator === ">=" ? s = Eu(s, p, r) : p.operator === "<" || p.operator === "<=" ? a = Nu(a, p, r) : n.add(p.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = zc(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const p of n) {
    if (s && !Ga(p, String(s), r) || a && !Ga(p, String(a), r))
      return null;
    for (const w of e)
      if (!Ga(p, String(w), r))
        return !1;
    return !0;
  }
  let i, c, d, l, f = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, g = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  f && f.prerelease.length === 1 && a.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const p of e) {
    if (l = l || p.operator === ">" || p.operator === ">=", d = d || p.operator === "<" || p.operator === "<=", s) {
      if (g && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === g.major && p.semver.minor === g.minor && p.semver.patch === g.patch && (g = !1), p.operator === ">" || p.operator === ">=") {
        if (i = Eu(s, p, r), i === p && i !== s)
          return !1;
      } else if (s.operator === ">=" && !p.test(s.semver))
        return !1;
    }
    if (a) {
      if (f && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === f.major && p.semver.minor === f.minor && p.semver.patch === f.patch && (f = !1), p.operator === "<" || p.operator === "<=") {
        if (c = Nu(a, p, r), c === p && c !== a)
          return !1;
      } else if (a.operator === "<=" && !p.test(a.semver))
        return !1;
    }
    if (!p.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && l && !s && o !== 0 || g || f);
}, Eu = (t, e, r) => {
  if (!t)
    return e;
  const n = zc(t.semver, e.semver, r);
  return n > 0 ? t : n < 0 || e.operator === ">" && t.operator === ">=" ? e : t;
}, Nu = (t, e, r) => {
  if (!t)
    return e;
  const n = zc(t.semver, e.semver, r);
  return n < 0 ? t : n > 0 || e.operator === "<" && t.operator === "<=" ? e : t;
};
var OO = NO;
const xa = Zn, Pu = Yn, RO = We, Tu = Lp, IO = Cr, jO = RP, CO = CP, AO = kP, kO = DP, LO = FP, DO = UP, MO = QP, VO = HP, FO = St, qO = YP, zO = tT, UO = Lc, BO = aT, KO = cT, QO = $a, GO = Dc, xO = Dp, HO = Mp, JO = Mc, WO = Vc, XO = Vp, YO = jT, ZO = FT, eR = ga(), tR = Et(), rR = va, nR = GT, sR = WT, aR = eO, oR = nO, iR = oO, cR = Fc, lR = yO, uR = vO, dR = wO, fR = EO, hR = OO;
var mR = {
  parse: IO,
  valid: jO,
  clean: CO,
  inc: AO,
  diff: kO,
  major: LO,
  minor: DO,
  patch: MO,
  prerelease: VO,
  compare: FO,
  rcompare: qO,
  compareLoose: zO,
  compareBuild: UO,
  sort: BO,
  rsort: KO,
  gt: QO,
  lt: GO,
  eq: xO,
  neq: HO,
  gte: JO,
  lte: WO,
  cmp: XO,
  coerce: YO,
  truncate: ZO,
  Comparator: eR,
  Range: tR,
  satisfies: rR,
  toComparators: nR,
  maxSatisfying: sR,
  minSatisfying: aR,
  minVersion: oR,
  validRange: iR,
  outside: cR,
  gtr: lR,
  ltr: uR,
  intersects: dR,
  simplifyRange: fR,
  subset: hR,
  SemVer: RO,
  re: xa.re,
  src: xa.src,
  tokens: xa.t,
  SEMVER_SPEC_VERSION: Pu.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Pu.RELEASE_TYPES,
  compareIdentifiers: Tu.compareIdentifiers,
  rcompareIdentifiers: Tu.rcompareIdentifiers
};
const Vr = /* @__PURE__ */ tm(mR), pR = Object.prototype.toString, yR = "[object Uint8Array]", $R = "[object ArrayBuffer]";
function qp(t, e, r) {
  return t ? t.constructor === e ? !0 : pR.call(t) === r : !1;
}
function zp(t) {
  return qp(t, Uint8Array, yR);
}
function gR(t) {
  return qp(t, ArrayBuffer, $R);
}
function vR(t) {
  return zp(t) || gR(t);
}
function _R(t) {
  if (!zp(t))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof t}\``);
}
function wR(t) {
  if (!vR(t))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof t}\``);
}
function Ou(t, e) {
  if (t.length === 0)
    return new Uint8Array(0);
  e ?? (e = t.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(e);
  let n = 0;
  for (const s of t)
    _R(s), r.set(s, n), n += s.length;
  return r;
}
const ws = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Ru(t, e = "utf8") {
  return wR(t), ws[e] ?? (ws[e] = new globalThis.TextDecoder(e)), ws[e].decode(t);
}
function bR(t) {
  if (typeof t != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof t}\``);
}
const SR = new globalThis.TextEncoder();
function Ha(t) {
  return bR(t), SR.encode(t);
}
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
const ER = sP.default, Iu = "aes-256-cbc", Fr = () => /* @__PURE__ */ Object.create(null), NR = (t) => t != null, PR = (t, e) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof e;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${t}\` is not allowed as it's not supported by JSON`);
}, ks = "__internal__", Ja = `${ks}.migrations.version`;
var Zt, kt, it, Lt;
class TR {
  constructor(e = {}) {
    N(this, "path");
    N(this, "events");
    yn(this, Zt);
    yn(this, kt);
    yn(this, it);
    yn(this, Lt, {});
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
      r.cwd = $$(r.projectName, { suffix: r.projectSuffix }).config;
    }
    if ($n(this, it, r), r.schema ?? r.ajvOptions ?? r.rootSchema) {
      if (r.schema && typeof r.schema != "object")
        throw new TypeError("The `schema` option must be an object.");
      const o = new jS.Ajv2020({
        allErrors: !0,
        useDefaults: !0,
        ...r.ajvOptions
      });
      ER(o);
      const i = {
        ...r.rootSchema,
        type: "object",
        properties: r.schema
      };
      $n(this, Zt, o.compile(i));
      for (const [c, d] of Object.entries(r.schema ?? {}))
        d != null && d.default && (be(this, Lt)[c] = d.default);
    }
    r.defaults && $n(this, Lt, {
      ...be(this, Lt),
      ...r.defaults
    }), r.serialize && (this._serialize = r.serialize), r.deserialize && (this._deserialize = r.deserialize), this.events = new EventTarget(), $n(this, kt, r.encryptionKey);
    const n = r.fileExtension ? `.${r.fileExtension}` : "";
    this.path = re.resolve(r.cwd, `${r.configName ?? "config"}${n}`);
    const s = this.store, a = Object.assign(Fr(), r.defaults, s);
    if (r.migrations) {
      if (!r.projectVersion)
        throw new Error("Please specify the `projectVersion` option.");
      this._migrate(r.migrations, r.projectVersion, r.beforeEachMigration);
    }
    this._validate(a);
    try {
      c$.deepEqual(s, a);
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
      throw new TypeError(`Please don't use the ${ks} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      PR(a, o), be(this, it).accessPropertiesByDotNotation ? sl(n, a, o) : n[a] = o;
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
    return be(this, it).accessPropertiesByDotNotation ? h$(this.store, e) : e in this.store;
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...e) {
    for (const r of e)
      NR(be(this, Lt)[r]) && this.set(r, be(this, Lt)[r]);
  }
  delete(e) {
    const { store: r } = this;
    be(this, it).accessPropertiesByDotNotation ? f$(r, e) : delete r[e], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    this.store = Fr();
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
      const e = ae.readFileSync(this.path, be(this, kt) ? null : "utf8"), r = this._encryptData(e), n = this._deserialize(r);
      return this._validate(n), Object.assign(Fr(), n);
    } catch (e) {
      if ((e == null ? void 0 : e.code) === "ENOENT")
        return this._ensureDirectory(), Fr();
      if (be(this, it).clearInvalidConfig && e.name === "SyntaxError")
        return Fr();
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
      return typeof e == "string" ? e : Ru(e);
    try {
      const r = e.slice(0, 16), n = gn.pbkdf2Sync(be(this, kt), r.toString(), 1e4, 32, "sha512"), s = gn.createDecipheriv(Iu, n, r), a = e.slice(17), o = typeof a == "string" ? Ha(a) : a;
      return Ru(Ou([s.update(o), s.final()]));
    } catch {
    }
    return e.toString();
  }
  _handleChange(e, r) {
    let n = e();
    const s = () => {
      const a = n, o = e();
      i$(o, a) || (n = o, r.call(this, o, a));
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
    ae.mkdirSync(re.dirname(this.path), { recursive: !0 });
  }
  _write(e) {
    let r = this._serialize(e);
    if (be(this, kt)) {
      const n = gn.randomBytes(16), s = gn.pbkdf2Sync(be(this, kt), n.toString(), 1e4, 32, "sha512"), a = gn.createCipheriv(Iu, s, n);
      r = Ou([n, Ha(":"), a.update(Ha(r)), a.final()]);
    }
    if (Se.env.SNAP)
      ae.writeFileSync(this.path, r, { mode: be(this, it).configFileMode });
    else
      try {
        em(this.path, r, { mode: be(this, it).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          ae.writeFileSync(this.path, r, { mode: be(this, it).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    this._ensureDirectory(), ae.existsSync(this.path) || this._write(Fr()), Se.platform === "win32" ? ae.watch(this.path, { persistent: !1 }, cu(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 100 })) : ae.watchFile(this.path, { persistent: !1 }, cu(() => {
      this.events.dispatchEvent(new Event("change"));
    }, { wait: 5e3 }));
  }
  _migrate(e, r, n) {
    let s = this._get(Ja, "0.0.0");
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
        c == null || c(this), this._set(Ja, i), s = i, o = { ...this.store };
      } catch (c) {
        throw this.store = o, new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${c}`);
      }
    (this._isVersionInRangeFormat(s) || !Vr.eq(s, r)) && this._set(Ja, r);
  }
  _containsReservedKey(e) {
    return typeof e == "object" && Object.keys(e)[0] === ks ? !0 : typeof e != "string" ? !1 : be(this, it).accessPropertiesByDotNotation ? !!e.startsWith(`${ks}.`) : !1;
  }
  _isVersionInRangeFormat(e) {
    return Vr.clean(e) === null;
  }
  _shouldPerformMigration(e, r, n) {
    return this._isVersionInRangeFormat(e) ? r !== "0.0.0" && Vr.satisfies(r, e) ? !1 : Vr.satisfies(n, e) : !(Vr.lte(e, r) || Vr.gt(e, n));
  }
  _get(e, r) {
    return d$(this.store, e, r);
  }
  _set(e, r) {
    const { store: n } = this;
    sl(n, e, r), this.store = n;
  }
}
Zt = new WeakMap(), kt = new WeakMap(), it = new WeakMap(), Lt = new WeakMap();
const { app: Ls, ipcMain: vo, shell: OR } = Jh;
let ju = !1;
const Cu = () => {
  if (!vo || !Ls)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const t = {
    defaultCwd: Ls.getPath("userData"),
    appVersion: Ls.getVersion()
  };
  return ju || (vo.on("electron-store-get-data", (e) => {
    e.returnValue = t;
  }), ju = !0), t;
};
class RR extends TR {
  constructor(e) {
    let r, n;
    if (Se.type === "renderer") {
      const s = Jh.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else vo && Ls && ({ defaultCwd: r, appVersion: n } = Cu());
    e = {
      name: "config",
      ...e
    }, e.projectVersion || (e.projectVersion = n), e.cwd ? e.cwd = re.isAbsolute(e.cwd) ? e.cwd : re.join(r, e.cwd) : e.cwd = r, e.configName = e.name, delete e.name, super(e);
  }
  static initRenderer() {
    Cu();
  }
  async openInEditor() {
    const e = await OR.openPath(this.path);
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
var Qu;
Qu = V;
class Ie {
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
N(Ie, Qu, "Column");
var Gu;
Gu = V;
class Up {
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
N(Up, Gu, "ColumnBuilder");
const sr = Symbol.for("drizzle:Name"), Au = Symbol.for("drizzle:isPgEnum");
function IR(t) {
  return !!t && typeof t == "function" && Au in t && t[Au] === !0;
}
var xu;
xu = V;
class Je {
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
N(Je, xu, "Subquery");
var Hu, Ju;
class Uc extends (Ju = Je, Hu = V, Ju) {
}
N(Uc, Hu, "WithSubquery");
const jR = {
  startActiveSpan(t, e) {
    return e();
  }
}, He = Symbol.for("drizzle:ViewBaseConfig"), Ds = Symbol.for("drizzle:Schema"), _o = Symbol.for("drizzle:Columns"), ku = Symbol.for("drizzle:ExtraConfigColumns"), Wa = Symbol.for("drizzle:OriginalName"), Xa = Symbol.for("drizzle:BaseName"), Gs = Symbol.for("drizzle:IsAlias"), Lu = Symbol.for("drizzle:ExtraConfigBuilder"), CR = Symbol.for("drizzle:IsDrizzleTable");
var Wu, Xu, Yu, Zu, ed, td, rd, nd, sd, ad;
ad = V, sd = sr, nd = Wa, rd = Ds, td = _o, ed = ku, Zu = Xa, Yu = Gs, Xu = CR, Wu = Lu;
class Q {
  constructor(e, r, n) {
    /**
     * @internal
     * Can be changed if the table is aliased.
     */
    N(this, sd);
    /**
     * @internal
     * Used to store the original name of the table, before any aliasing.
     */
    N(this, nd);
    /** @internal */
    N(this, rd);
    /** @internal */
    N(this, td);
    /** @internal */
    N(this, ed);
    /**
     *  @internal
     * Used to store the table name before the transformation via the `tableCreator` functions.
     */
    N(this, Zu);
    /** @internal */
    N(this, Yu, !1);
    /** @internal */
    N(this, Xu, !0);
    /** @internal */
    N(this, Wu);
    this[sr] = this[Wa] = e, this[Ds] = r, this[Xa] = n;
  }
}
N(Q, ad, "Table"), /** @internal */
N(Q, "Symbol", {
  Name: sr,
  Schema: Ds,
  OriginalName: Wa,
  Columns: _o,
  ExtraConfigColumns: ku,
  BaseName: Xa,
  IsAlias: Gs,
  ExtraConfigBuilder: Lu
});
function xr(t) {
  return t[sr];
}
function zn(t) {
  return `${t[Ds] ?? "public"}.${t[sr]}`;
}
function Bp(t) {
  return t != null && typeof t.getSQL == "function";
}
function AR(t) {
  var r;
  const e = { sql: "", params: [] };
  for (const n of t)
    e.sql += n.sql, e.params.push(...n.params), (r = n.typings) != null && r.length && (e.typings || (e.typings = []), e.typings.push(...n.typings));
  return e;
}
var od;
od = V;
class Le {
  constructor(e) {
    N(this, "value");
    this.value = Array.isArray(e) ? e : [e];
  }
  getSQL() {
    return new ne([this]);
  }
}
N(Le, od, "StringChunk");
var id;
id = V;
const vr = class vr {
  constructor(e) {
    /** @internal */
    N(this, "decoder", Kp);
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
    return jR.startActiveSpan("drizzle.buildSQL", (r) => {
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
    return AR(e.map((l) => {
      var f;
      if (D(l, Le))
        return { sql: l.value.join(""), params: [] };
      if (D(l, xs))
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
          sql: g === void 0 || l[Gs] ? a(p) : a(g) + "." + a(p),
          params: []
        };
      }
      if (D(l, Ie)) {
        const g = s.getColumnCasing(l);
        if (r.invokeSource === "indexes")
          return { sql: a(g), params: [] };
        const p = l.table[Q.Symbol.Schema];
        return {
          sql: l.table[Gs] || p === void 0 ? a(l.table[Q.Symbol.Name]) + "." + a(g) : a(p) + "." + a(l.table[Q.Symbol.Name]) + "." + a(g),
          params: []
        };
      }
      if (D(l, Ar)) {
        const g = l[He].schema, p = l[He].name;
        return {
          sql: g === void 0 || l[He].isAlias ? a(p) : a(g) + "." + a(p),
          params: []
        };
      }
      if (D(l, Ut)) {
        if (D(l.value, Tr))
          return { sql: o(d.value++, l), params: [l], typings: ["none"] };
        const g = l.value === null ? null : l.encoder.mapToDriverValue(l.value);
        if (D(g, vr))
          return this.buildQueryFromSourceParams([g], n);
        if (c)
          return { sql: this.mapInlineParam(g, n), params: [] };
        let p = ["none"];
        return i && (p = [i(l.encoder)]), { sql: o(d.value++, g), params: [g], typings: p };
      }
      return D(l, Tr) ? { sql: o(d.value++, l), params: [l], typings: ["none"] } : D(l, vr.Aliased) && l.fieldAlias !== void 0 ? { sql: a(l.fieldAlias), params: [] } : D(l, Je) ? l._.isWith ? { sql: a(l._.alias), params: [] } : this.buildQueryFromSourceParams([
        new Le("("),
        l._.sql,
        new Le(") "),
        new xs(l._.alias)
      ], n) : IR(l) ? l.schema ? { sql: a(l.schema) + "." + a(l.enumName), params: [] } : { sql: a(l.enumName), params: [] } : Bp(l) ? (f = l.shouldOmitSQLParens) != null && f.call(l) ? this.buildQueryFromSourceParams([l.getSQL()], n) : this.buildQueryFromSourceParams([
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
N(vr, id, "SQL");
let ne = vr;
var cd;
cd = V;
class xs {
  constructor(e) {
    N(this, "brand");
    this.value = e;
  }
  getSQL() {
    return new ne([this]);
  }
}
N(xs, cd, "Name");
function kR(t) {
  return typeof t == "object" && t !== null && "mapToDriverValue" in t && typeof t.mapToDriverValue == "function";
}
const Kp = {
  mapFromDriverValue: (t) => t
}, Qp = {
  mapToDriverValue: (t) => t
};
({
  ...Kp,
  ...Qp
});
var ld;
ld = V;
class Ut {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(e, r = Qp) {
    N(this, "brand");
    this.value = e, this.encoder = r;
  }
  getSQL() {
    return new ne([this]);
  }
}
N(Ut, ld, "Param");
function I(t, ...e) {
  const r = [];
  (e.length > 0 || t.length > 0 && t[0] !== "") && r.push(new Le(t[0]));
  for (const [n, s] of e.entries())
    r.push(s, new Le(t[n + 1]));
  return new ne(r);
}
((t) => {
  function e() {
    return new ne([]);
  }
  t.empty = e;
  function r(c) {
    return new ne(c);
  }
  t.fromList = r;
  function n(c) {
    return new ne([new Le(c)]);
  }
  t.raw = n;
  function s(c, d) {
    const l = [];
    for (const [f, g] of c.entries())
      f > 0 && d !== void 0 && l.push(d), l.push(g);
    return new ne(l);
  }
  t.join = s;
  function a(c) {
    return new xs(c);
  }
  t.identifier = a;
  function o(c) {
    return new Tr(c);
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
})(ne || (ne = {}));
var ud;
ud = V;
class Tr {
  constructor(e) {
    this.name = e;
  }
  getSQL() {
    return new ne([this]);
  }
}
N(Tr, ud, "Placeholder");
function bs(t, e) {
  return t.map((r) => {
    if (D(r, Tr)) {
      if (!(r.name in e))
        throw new Error(`No value for placeholder "${r.name}" was provided`);
      return e[r.name];
    }
    if (D(r, Ut) && D(r.value, Tr)) {
      if (!(r.value.name in e))
        throw new Error(`No value for placeholder "${r.value.name}" was provided`);
      return r.encoder.mapToDriverValue(e[r.value.name]);
    }
    return r;
  });
}
const LR = Symbol.for("drizzle:IsDrizzleView");
var dd, fd, hd;
hd = V, fd = He, dd = LR;
class Ar {
  constructor({ name: e, schema: r, selectedFields: n, query: s }) {
    /** @internal */
    N(this, fd);
    /** @internal */
    N(this, dd, !0);
    this[He] = {
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
    return new ne([this]);
  }
}
N(Ar, hd, "View");
Ie.prototype.getSQL = function() {
  return new ne([this]);
};
Q.prototype.getSQL = function() {
  return new ne([this]);
};
Je.prototype.getSQL = function() {
  return new ne([this]);
};
var md;
md = V;
class Un {
  constructor(e) {
    this.table = e;
  }
  get(e, r) {
    return r === "table" ? this.table : e[r];
  }
}
N(Un, md, "ColumnAliasProxyHandler");
var pd;
pd = V;
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
    if (r === He)
      return {
        ...e[He],
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
          new Un(new Proxy(e, this))
        );
      }), a;
    }
    const n = e[r];
    return D(n, Ie) ? new Proxy(n, new Un(new Proxy(e, this))) : n;
  }
}
N(_a, pd, "TableAliasProxyHandler");
function Ya(t, e) {
  return new Proxy(t, new _a(e, !1));
}
function At(t, e) {
  return new Proxy(
    t,
    new Un(new Proxy(t.table, new _a(e, !1)))
  );
}
function Gp(t, e) {
  return new ne.Aliased(Hs(t.sql, e), t.fieldAlias);
}
function Hs(t, e) {
  return I.join(t.queryChunks.map((r) => D(r, Ie) ? At(r, e) : D(r, ne) ? Hs(r, e) : D(r, ne.Aliased) ? Gp(r, e) : r));
}
var yd, $d;
class wa extends ($d = Error, yd = V, $d) {
  constructor({ message: e, cause: r }) {
    super(e), this.name = "DrizzleError", this.cause = r;
  }
}
N(wa, yd, "DrizzleError");
class Xt extends Error {
  constructor(e, r, n) {
    super(`Failed query: ${e}
params: ${r}`), this.query = e, this.params = r, this.cause = n, Error.captureStackTrace(this, Xt), n && (this.cause = n);
  }
}
var gd, vd;
class xp extends (vd = wa, gd = V, vd) {
  constructor() {
    super({ message: "Rollback" });
  }
}
N(xp, gd, "TransactionRollbackError");
var _d;
_d = V;
class Hp {
  write(e) {
    console.log(e);
  }
}
N(Hp, _d, "ConsoleLogWriter");
var wd;
wd = V;
class Jp {
  constructor(e) {
    N(this, "writer");
    this.writer = (e == null ? void 0 : e.writer) ?? new Hp();
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
N(Jp, wd, "DefaultLogger");
var bd;
bd = V;
class Wp {
  logQuery() {
  }
}
N(Wp, bd, "NoopLogger");
var Sd, Ed;
Ed = V, Sd = Symbol.toStringTag;
class or {
  constructor() {
    N(this, Sd, "QueryPromise");
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
N(or, Ed, "QueryPromise");
function Du(t, e, r) {
  const n = {}, s = t.reduce(
    (a, { path: o, field: i }, c) => {
      let d;
      D(i, Ie) ? d = i : D(i, ne) ? d = i.decoder : D(i, Je) ? d = i._.sql.decoder : d = i.sql.decoder;
      let l = a;
      for (const [f, g] of o.entries())
        if (f < o.length - 1)
          g in l || (l[g] = {}), l = l[g];
        else {
          const p = e[c], w = l[g] = p === null ? null : d.mapFromDriverValue(p);
          if (r && D(i, Ie) && o.length === 2) {
            const $ = o[0];
            $ in n ? typeof n[$] == "string" && n[$] !== xr(i.table) && (n[$] = !1) : n[$] = w === null ? xr(i.table) : !1;
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
function Or(t, e) {
  return Object.entries(t).reduce((r, [n, s]) => {
    if (typeof n != "string")
      return r;
    const a = e ? [...e, n] : [n];
    return D(s, Ie) || D(s, ne) || D(s, ne.Aliased) || D(s, Je) ? r.push({ path: a, field: s }) : D(s, Q) ? r.push(...Or(s[Q.Symbol.Columns], a)) : r.push(...Or(s, a)), r;
  }, []);
}
function Bc(t, e) {
  const r = Object.keys(t), n = Object.keys(e);
  if (r.length !== n.length)
    return !1;
  for (const [s, a] of r.entries())
    if (a !== n[s])
      return !1;
  return !0;
}
function Xp(t, e) {
  const r = Object.entries(e).filter(([, n]) => n !== void 0).map(([n, s]) => D(s, ne) || D(s, Ie) ? [n, s] : [n, new Ut(s, t[Q.Symbol.Columns][n])]);
  if (r.length === 0)
    throw new Error("No values to set");
  return Object.fromEntries(r);
}
function DR(t, e) {
  for (const r of e)
    for (const n of Object.getOwnPropertyNames(r.prototype))
      n !== "constructor" && Object.defineProperty(
        t.prototype,
        n,
        Object.getOwnPropertyDescriptor(r.prototype, n) || /* @__PURE__ */ Object.create(null)
      );
}
function MR(t) {
  return t[Q.Symbol.Columns];
}
function wo(t) {
  return D(t, Je) ? t._.alias : D(t, Ar) ? t[He].name : D(t, ne) ? void 0 : t[Q.Symbol.IsAlias] ? t[Q.Symbol.Name] : t[Q.Symbol.BaseName];
}
function es(t, e) {
  return {
    name: typeof t == "string" && t.length > 0 ? t : "",
    config: typeof t == "object" ? t : e
  };
}
function VR(t) {
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
const Yp = typeof TextDecoder > "u" ? null : new TextDecoder(), Mu = Symbol.for("drizzle:PgInlineForeignKeys"), Vu = Symbol.for("drizzle:EnableRLS");
var Nd, Pd, Td, Od, Rd, Id;
class bo extends (Id = Q, Rd = V, Od = Mu, Td = Vu, Pd = Q.Symbol.ExtraConfigBuilder, Nd = Q.Symbol.ExtraConfigColumns, Id) {
  constructor() {
    super(...arguments);
    /**@internal */
    N(this, Od, []);
    /** @internal */
    N(this, Td, !1);
    /** @internal */
    N(this, Pd);
    /** @internal */
    N(this, Nd, {});
  }
}
N(bo, Rd, "PgTable"), /** @internal */
N(bo, "Symbol", Object.assign({}, Q.Symbol, {
  InlineForeignKeys: Mu,
  EnableRLS: Vu
}));
var jd;
jd = V;
class Zp {
  constructor(e, r) {
    /** @internal */
    N(this, "columns");
    /** @internal */
    N(this, "name");
    this.columns = e, this.name = r;
  }
  /** @internal */
  build(e) {
    return new ey(e, this.columns, this.name);
  }
}
N(Zp, jd, "PgPrimaryKeyBuilder");
var Cd;
Cd = V;
class ey {
  constructor(e, r, n) {
    N(this, "columns");
    N(this, "name");
    this.table = e, this.columns = r, this.name = n;
  }
  getName() {
    return this.name ?? `${this.table[bo.Symbol.Name]}_${this.columns.map((e) => e.name).join("_")}_pk`;
  }
}
N(ey, Cd, "PgPrimaryKey");
function at(t, e) {
  return kR(e) && !Bp(t) && !D(t, Ut) && !D(t, Tr) && !D(t, Ie) && !D(t, Q) && !D(t, Ar) ? new Ut(t, e) : t;
}
const ts = (t, e) => I`${t} = ${at(e, t)}`, FR = (t, e) => I`${t} <> ${at(e, t)}`;
function So(...t) {
  const e = t.filter(
    (r) => r !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new ne(e) : new ne([
      new Le("("),
      I.join(e, new Le(" and ")),
      new Le(")")
    ]);
}
function qR(...t) {
  const e = t.filter(
    (r) => r !== void 0
  );
  if (e.length !== 0)
    return e.length === 1 ? new ne(e) : new ne([
      new Le("("),
      I.join(e, new Le(" or ")),
      new Le(")")
    ]);
}
function zR(t) {
  return I`not ${t}`;
}
const UR = (t, e) => I`${t} > ${at(e, t)}`, BR = (t, e) => I`${t} >= ${at(e, t)}`, KR = (t, e) => I`${t} < ${at(e, t)}`, QR = (t, e) => I`${t} <= ${at(e, t)}`;
function GR(t, e) {
  return Array.isArray(e) ? e.length === 0 ? I`false` : I`${t} in ${e.map((r) => at(r, t))}` : I`${t} in ${at(e, t)}`;
}
function xR(t, e) {
  return Array.isArray(e) ? e.length === 0 ? I`true` : I`${t} not in ${e.map((r) => at(r, t))}` : I`${t} not in ${at(e, t)}`;
}
function HR(t) {
  return I`${t} is null`;
}
function JR(t) {
  return I`${t} is not null`;
}
function WR(t) {
  return I`exists ${t}`;
}
function XR(t) {
  return I`not exists ${t}`;
}
function YR(t, e, r) {
  return I`${t} between ${at(e, t)} and ${at(
    r,
    t
  )}`;
}
function ZR(t, e, r) {
  return I`${t} not between ${at(
    e,
    t
  )} and ${at(r, t)}`;
}
function eI(t, e) {
  return I`${t} like ${e}`;
}
function tI(t, e) {
  return I`${t} not like ${e}`;
}
function rI(t, e) {
  return I`${t} ilike ${e}`;
}
function nI(t, e) {
  return I`${t} not ilike ${e}`;
}
function sI(t) {
  return I`${t} asc`;
}
function aI(t) {
  return I`${t} desc`;
}
var Ad;
Ad = V;
class Kc {
  constructor(e, r, n) {
    N(this, "referencedTableName");
    N(this, "fieldName");
    this.sourceTable = e, this.referencedTable = r, this.relationName = n, this.referencedTableName = r[Q.Symbol.Name];
  }
}
N(Kc, Ad, "Relation");
var kd;
kd = V;
class ty {
  constructor(e, r) {
    this.table = e, this.config = r;
  }
}
N(ty, kd, "Relations");
var Ld, Dd;
const Ys = class Ys extends (Dd = Kc, Ld = V, Dd) {
  constructor(e, r, n, s) {
    super(e, r, n == null ? void 0 : n.relationName), this.config = n, this.isNullable = s;
  }
  withFieldName(e) {
    const r = new Ys(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    return r.fieldName = e, r;
  }
};
N(Ys, Ld, "One");
let Rr = Ys;
var Md, Vd;
const Zs = class Zs extends (Vd = Kc, Md = V, Vd) {
  constructor(e, r, n) {
    super(e, r, n == null ? void 0 : n.relationName), this.config = n;
  }
  withFieldName(e) {
    const r = new Zs(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    return r.fieldName = e, r;
  }
};
N(Zs, Md, "Many");
let Js = Zs;
function oI() {
  return {
    and: So,
    between: YR,
    eq: ts,
    exists: WR,
    gt: UR,
    gte: BR,
    ilike: rI,
    inArray: GR,
    isNull: HR,
    isNotNull: JR,
    like: eI,
    lt: KR,
    lte: QR,
    ne: FR,
    not: zR,
    notBetween: ZR,
    notExists: XR,
    notLike: tI,
    notIlike: nI,
    notInArray: xR,
    or: qR,
    sql: I
  };
}
function iI() {
  return {
    sql: I,
    asc: sI,
    desc: aI
  };
}
function cI(t, e) {
  var a;
  Object.keys(t).length === 1 && "default" in t && !D(t.default, Q) && (t = t.default);
  const r = {}, n = {}, s = {};
  for (const [o, i] of Object.entries(t))
    if (D(i, Q)) {
      const c = zn(i), d = n[c];
      r[c] = o, s[o] = {
        tsName: o,
        dbName: i[Q.Symbol.Name],
        schema: i[Q.Symbol.Schema],
        columns: i[Q.Symbol.Columns],
        relations: (d == null ? void 0 : d.relations) ?? {},
        primaryKey: (d == null ? void 0 : d.primaryKey) ?? []
      };
      for (const f of Object.values(
        i[Q.Symbol.Columns]
      ))
        f.primary && s[o].primaryKey.push(f);
      const l = (a = i[Q.Symbol.ExtraConfigBuilder]) == null ? void 0 : a.call(i, i[Q.Symbol.ExtraConfigColumns]);
      if (l)
        for (const f of Object.values(l))
          D(f, Zp) && s[o].primaryKey.push(...f.columns);
    } else if (D(i, ty)) {
      const c = zn(i.table), d = r[c], l = i.config(
        e(i.table)
      );
      let f;
      for (const [g, p] of Object.entries(l))
        if (d) {
          const w = s[d];
          w.relations[g] = p;
        } else
          c in n || (n[c] = {
            relations: {},
            primaryKey: f
          }), n[c].relations[g] = p;
    }
  return { tables: s, tableNamesMap: r };
}
function lI(t) {
  return function(r, n) {
    return new Rr(
      t,
      r,
      n,
      (n == null ? void 0 : n.fields.reduce((s, a) => s && a.notNull, !0)) ?? !1
    );
  };
}
function uI(t) {
  return function(r, n) {
    return new Js(t, r, n);
  };
}
function dI(t, e, r) {
  if (D(r, Rr) && r.config)
    return {
      fields: r.config.fields,
      references: r.config.references
    };
  const n = e[zn(r.referencedTable)];
  if (!n)
    throw new Error(
      `Table "${r.referencedTable[Q.Symbol.Name]}" not found in schema`
    );
  const s = t[n];
  if (!s)
    throw new Error(`Table "${n}" not found in schema`);
  const a = r.sourceTable, o = e[zn(a)];
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
  if (i[0] && D(i[0], Rr) && i[0].config)
    return {
      fields: i[0].config.references,
      references: i[0].config.fields
    };
  throw new Error(
    `There is not enough information to infer relation "${o}.${r.fieldName}"`
  );
}
function fI(t) {
  return {
    one: lI(t),
    many: uI(t)
  };
}
function Eo(t, e, r, n, s = (a) => a) {
  const a = {};
  for (const [
    o,
    i
  ] of n.entries())
    if (i.isJson) {
      const c = e.relations[i.tsKey], d = r[o], l = typeof d == "string" ? JSON.parse(d) : d;
      a[i.tsKey] = D(c, Rr) ? l && Eo(
        t,
        t[i.relationTableTsKey],
        l,
        i.selection,
        s
      ) : l.map(
        (f) => Eo(
          t,
          t[i.relationTableTsKey],
          f,
          i.selection,
          s
        )
      );
    } else {
      const c = s(r[o]), d = i.field;
      let l;
      D(d, Ie) ? l = d : D(d, ne) ? l = d.decoder : l = d.sql.decoder, a[i.tsKey] = c === null ? null : l.mapFromDriverValue(c);
    }
  return a;
}
var Fd;
Fd = V;
const ea = class ea {
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
    if (r === He)
      return {
        ...e[He],
        selectedFields: new Proxy(
          e[He].selectedFields,
          this
        )
      };
    if (typeof r == "symbol")
      return e[r];
    const s = (D(e, Je) ? e._.selectedFields : D(e, Ar) ? e[He].selectedFields : e)[r];
    if (D(s, ne.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !s.isSelectionField)
        return s.sql;
      const a = s.clone();
      return a.isSelectionField = !0, a;
    }
    if (D(s, ne)) {
      if (this.config.sqlBehavior === "sql")
        return s;
      throw new Error(
        `You tried to reference "${r}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    return D(s, Ie) ? this.config.alias ? new Proxy(
      s,
      new Un(
        new Proxy(
          s.table,
          new _a(this.config.alias, this.config.replaceOriginalName ?? !1)
        )
      )
    ) : s : typeof s != "object" || s === null ? s : new Proxy(s, new ea(this.config));
  }
};
N(ea, Fd, "SelectionProxyHandler");
let Ze = ea;
var qd;
qd = V;
class ry {
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
    return new ny(e, this);
  }
}
N(ry, qd, "SQLiteForeignKeyBuilder");
var zd;
zd = V;
class ny {
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
N(ny, zd, "SQLiteForeignKey");
function hI(t, e) {
  return `${t[sr]}_${e.join("_")}_unique`;
}
var Ud, Bd;
class ft extends (Bd = Up, Ud = V, Bd) {
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
      const c = new ry(() => {
        const d = o();
        return { columns: [r], foreignColumns: [d] };
      });
      return i.onUpdate && c.onUpdate(i.onUpdate), i.onDelete && c.onDelete(i.onDelete), c.build(n);
    })(s, a));
  }
}
N(ft, Ud, "SQLiteColumnBuilder");
var Kd, Qd;
class tt extends (Qd = Ie, Kd = V, Qd) {
  constructor(e, r) {
    r.uniqueName || (r.uniqueName = hI(e, [r.name])), super(e, r), this.table = e;
  }
}
N(tt, Kd, "SQLiteColumn");
var Gd, xd;
class sy extends (xd = ft, Gd = V, xd) {
  constructor(e) {
    super(e, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(e) {
    return new ay(e, this.config);
  }
}
N(sy, Gd, "SQLiteBigIntBuilder");
var Hd, Jd;
class ay extends (Jd = tt, Hd = V, Jd) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const r = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return BigInt(r.toString("utf8"));
    }
    return BigInt(Yp.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(e.toString());
  }
}
N(ay, Hd, "SQLiteBigInt");
var Wd, Xd;
class oy extends (Xd = ft, Wd = V, Xd) {
  constructor(e) {
    super(e, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(e) {
    return new iy(
      e,
      this.config
    );
  }
}
N(oy, Wd, "SQLiteBlobJsonBuilder");
var Yd, Zd;
class iy extends (Zd = tt, Yd = V, Zd) {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(e) {
    if (typeof Buffer < "u" && Buffer.from) {
      const r = Buffer.isBuffer(e) ? e : e instanceof ArrayBuffer ? Buffer.from(e) : e.buffer ? Buffer.from(e.buffer, e.byteOffset, e.byteLength) : Buffer.from(e);
      return JSON.parse(r.toString("utf8"));
    }
    return JSON.parse(Yp.decode(e));
  }
  mapToDriverValue(e) {
    return Buffer.from(JSON.stringify(e));
  }
}
N(iy, Yd, "SQLiteBlobJson");
var ef, tf;
class cy extends (tf = ft, ef = V, tf) {
  constructor(e) {
    super(e, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(e) {
    return new ly(e, this.config);
  }
}
N(cy, ef, "SQLiteBlobBufferBuilder");
var rf, nf;
class ly extends (nf = tt, rf = V, nf) {
  mapFromDriverValue(e) {
    return Buffer.isBuffer(e) ? e : Buffer.from(e);
  }
  getSQLType() {
    return "blob";
  }
}
N(ly, rf, "SQLiteBlobBuffer");
function mI(t, e) {
  const { name: r, config: n } = es(t, e);
  return (n == null ? void 0 : n.mode) === "json" ? new oy(r) : (n == null ? void 0 : n.mode) === "bigint" ? new sy(r) : new cy(r);
}
var sf, af;
class uy extends (af = ft, sf = V, af) {
  constructor(e, r, n) {
    super(e, "custom", "SQLiteCustomColumn"), this.config.fieldConfig = r, this.config.customTypeParams = n;
  }
  /** @internal */
  build(e) {
    return new dy(
      e,
      this.config
    );
  }
}
N(uy, sf, "SQLiteCustomColumnBuilder");
var of, cf;
class dy extends (cf = tt, of = V, cf) {
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
N(dy, of, "SQLiteCustomColumn");
function pI(t) {
  return (e, r) => {
    const { name: n, config: s } = es(e, r);
    return new uy(
      n,
      s,
      t
    );
  };
}
var lf, uf;
class ba extends (uf = ft, lf = V, uf) {
  constructor(e, r, n) {
    super(e, r, n), this.config.autoIncrement = !1;
  }
  primaryKey(e) {
    return e != null && e.autoIncrement && (this.config.autoIncrement = !0), this.config.hasDefault = !0, super.primaryKey();
  }
}
N(ba, lf, "SQLiteBaseIntegerBuilder");
var df, ff;
class Sa extends (ff = tt, df = V, ff) {
  constructor() {
    super(...arguments);
    N(this, "autoIncrement", this.config.autoIncrement);
  }
  getSQLType() {
    return "integer";
  }
}
N(Sa, df, "SQLiteBaseInteger");
var hf, mf;
class fy extends (mf = ba, hf = V, mf) {
  constructor(e) {
    super(e, "number", "SQLiteInteger");
  }
  build(e) {
    return new hy(
      e,
      this.config
    );
  }
}
N(fy, hf, "SQLiteIntegerBuilder");
var pf, yf;
class hy extends (yf = Sa, pf = V, yf) {
}
N(hy, pf, "SQLiteInteger");
var $f, gf;
class my extends (gf = ba, $f = V, gf) {
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
    return new py(
      e,
      this.config
    );
  }
}
N(my, $f, "SQLiteTimestampBuilder");
var vf, _f;
class py extends (_f = Sa, vf = V, _f) {
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
N(py, vf, "SQLiteTimestamp");
var wf, bf;
class yy extends (bf = ba, wf = V, bf) {
  constructor(e, r) {
    super(e, "boolean", "SQLiteBoolean"), this.config.mode = r;
  }
  build(e) {
    return new $y(
      e,
      this.config
    );
  }
}
N(yy, wf, "SQLiteBooleanBuilder");
var Sf, Ef;
class $y extends (Ef = Sa, Sf = V, Ef) {
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
N($y, Sf, "SQLiteBoolean");
function Qc(t, e) {
  const { name: r, config: n } = es(t, e);
  return (n == null ? void 0 : n.mode) === "timestamp" || (n == null ? void 0 : n.mode) === "timestamp_ms" ? new my(r, n.mode) : (n == null ? void 0 : n.mode) === "boolean" ? new yy(r, n.mode) : new fy(r);
}
var Nf, Pf;
class gy extends (Pf = ft, Nf = V, Pf) {
  constructor(e) {
    super(e, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(e) {
    return new vy(
      e,
      this.config
    );
  }
}
N(gy, Nf, "SQLiteNumericBuilder");
var Tf, Of;
class vy extends (Of = tt, Tf = V, Of) {
  mapFromDriverValue(e) {
    return typeof e == "string" ? e : String(e);
  }
  getSQLType() {
    return "numeric";
  }
}
N(vy, Tf, "SQLiteNumeric");
var Rf, If;
class _y extends (If = ft, Rf = V, If) {
  constructor(e) {
    super(e, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(e) {
    return new wy(
      e,
      this.config
    );
  }
}
N(_y, Rf, "SQLiteNumericNumberBuilder");
var jf, Cf;
class wy extends (Cf = tt, jf = V, Cf) {
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
N(wy, jf, "SQLiteNumericNumber");
var Af, kf;
class by extends (kf = ft, Af = V, kf) {
  constructor(e) {
    super(e, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(e) {
    return new Sy(
      e,
      this.config
    );
  }
}
N(by, Af, "SQLiteNumericBigIntBuilder");
var Lf, Df;
class Sy extends (Df = tt, Lf = V, Df) {
  constructor() {
    super(...arguments);
    N(this, "mapFromDriverValue", BigInt);
    N(this, "mapToDriverValue", String);
  }
  getSQLType() {
    return "numeric";
  }
}
N(Sy, Lf, "SQLiteNumericBigInt");
function yI(t, e) {
  const { name: r, config: n } = es(t, e), s = n == null ? void 0 : n.mode;
  return s === "number" ? new _y(r) : s === "bigint" ? new by(r) : new gy(r);
}
var Mf, Vf;
class Ey extends (Vf = ft, Mf = V, Vf) {
  constructor(e) {
    super(e, "number", "SQLiteReal");
  }
  /** @internal */
  build(e) {
    return new Ny(e, this.config);
  }
}
N(Ey, Mf, "SQLiteRealBuilder");
var Ff, qf;
class Ny extends (qf = tt, Ff = V, qf) {
  getSQLType() {
    return "real";
  }
}
N(Ny, Ff, "SQLiteReal");
function $I(t) {
  return new Ey(t ?? "");
}
var zf, Uf;
class Py extends (Uf = ft, zf = V, Uf) {
  constructor(e, r) {
    super(e, "string", "SQLiteText"), this.config.enumValues = r.enum, this.config.length = r.length;
  }
  /** @internal */
  build(e) {
    return new Ty(
      e,
      this.config
    );
  }
}
N(Py, zf, "SQLiteTextBuilder");
var Bf, Kf;
class Ty extends (Kf = tt, Bf = V, Kf) {
  constructor(r, n) {
    super(r, n);
    N(this, "enumValues", this.config.enumValues);
    N(this, "length", this.config.length);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
N(Ty, Bf, "SQLiteText");
var Qf, Gf;
class Oy extends (Gf = ft, Qf = V, Gf) {
  constructor(e) {
    super(e, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(e) {
    return new Ry(
      e,
      this.config
    );
  }
}
N(Oy, Qf, "SQLiteTextJsonBuilder");
var xf, Hf;
class Ry extends (Hf = tt, xf = V, Hf) {
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
N(Ry, xf, "SQLiteTextJson");
function vt(t, e = {}) {
  const { name: r, config: n } = es(t, e);
  return n.mode === "json" ? new Oy(r) : new Py(r, n);
}
function gI() {
  return {
    blob: mI,
    customType: pI,
    integer: Qc,
    numeric: yI,
    real: $I,
    text: vt
  };
}
const No = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var Jf, Wf, Xf, Yf, Zf;
class ct extends (Zf = Q, Yf = V, Xf = Q.Symbol.Columns, Wf = No, Jf = Q.Symbol.ExtraConfigBuilder, Zf) {
  constructor() {
    super(...arguments);
    /** @internal */
    N(this, Xf);
    /** @internal */
    N(this, Wf, []);
    /** @internal */
    N(this, Jf);
  }
}
N(ct, Yf, "SQLiteTable"), /** @internal */
N(ct, "Symbol", Object.assign({}, Q.Symbol, {
  InlineForeignKeys: No
}));
function vI(t, e, r, n, s = t) {
  const a = new ct(t, n, s), o = typeof e == "function" ? e(gI()) : e, i = Object.fromEntries(
    Object.entries(o).map(([d, l]) => {
      const f = l;
      f.setName(d);
      const g = f.build(a);
      return a[No].push(...f.buildForeignKeys(g, a)), [d, g];
    })
  ), c = Object.assign(a, i);
  return c[Q.Symbol.Columns] = i, c[Q.Symbol.ExtraConfigColumns] = i, c;
}
const Iy = (t, e, r) => vI(t, e);
function _r(t) {
  return D(t, ct) ? [`${t[Q.Symbol.BaseName]}`] : D(t, Je) ? t._.usedTables ?? [] : D(t, ne) ? t.usedTables ?? [] : [];
}
var eh, th;
class Po extends (th = or, eh = V, th) {
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
          new Ze({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
    return this.config.returning = Or(r), this;
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
N(Po, eh, "SQLiteDelete");
function _I(t) {
  return (t.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((r) => r.toLowerCase()).join("_");
}
function wI(t) {
  return (t.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((r, n, s) => {
    const a = s === 0 ? n.toLowerCase() : `${n[0].toUpperCase()}${n.slice(1)}`;
    return r + a;
  }, "");
}
function bI(t) {
  return t;
}
var rh;
rh = V;
class jy {
  constructor(e) {
    /** @internal */
    N(this, "cache", {});
    N(this, "cachedTables", {});
    N(this, "convert");
    this.convert = e === "snake_case" ? _I : e === "camelCase" ? wI : bI;
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
N(jy, rh, "CasingCache");
var nh, sh;
class Ea extends (sh = Ar, nh = V, sh) {
}
N(Ea, nh, "SQLiteViewBase");
var ah;
ah = V;
class Ws {
  constructor(e) {
    /** @internal */
    N(this, "casing");
    this.casing = new jy(e == null ? void 0 : e.casing);
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
    const i = this.buildWithCTE(s), c = n ? I` returning ${this.buildSelection(n, { isSingleTable: !0 })}` : void 0, d = r ? I` where ${r}` : void 0, l = this.buildOrderBy(o), f = this.buildLimit(a);
    return I`${i}delete from ${e}${d}${c}${l}${f}`;
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
        const c = n[o], d = (g = c.onUpdateFn) == null ? void 0 : g.call(c), l = r[o] ?? (D(d, ne) ? d : I.param(d, c)), f = I`${I.identifier(this.casing.getColumnCasing(c))} = ${l}`;
        return i < a - 1 ? [f, I.raw(", ")] : [f];
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
    const l = this.buildWithCTE(a), f = this.buildUpdateSet(e, r), g = i && I.join([I.raw(" from "), this.buildFromTable(i)]), p = this.buildJoins(o), w = s ? I` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, $ = n ? I` where ${n}` : void 0, v = this.buildOrderBy(d), m = this.buildLimit(c);
    return I`${l}update ${e} set ${f}${g}${p}${$}${w}${v}${m}`;
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
      if (D(a, ne.Aliased) && a.isSelectionField)
        i.push(I.identifier(a.fieldAlias));
      else if (D(a, ne.Aliased) || D(a, ne)) {
        const c = D(a, ne.Aliased) ? a.sql : a;
        r ? i.push(
          new ne(
            c.queryChunks.map((d) => D(d, Ie) ? I.identifier(this.casing.getColumnCasing(d)) : d)
          )
        ) : i.push(c), D(a, ne.Aliased) && i.push(I` as ${I.identifier(a.fieldAlias)}`);
      } else if (D(a, Ie)) {
        const c = a.table[Q.Symbol.Name];
        a.columnType === "SQLiteNumericBigInt" ? r ? i.push(
          I`cast(${I.identifier(this.casing.getColumnCasing(a))} as text)`
        ) : i.push(
          I`cast(${I.identifier(c)}.${I.identifier(this.casing.getColumnCasing(a))} as text)`
        ) : r ? i.push(I.identifier(this.casing.getColumnCasing(a))) : i.push(
          I`${I.identifier(c)}.${I.identifier(this.casing.getColumnCasing(a))}`
        );
      } else if (D(a, Je)) {
        const c = Object.entries(a._.selectedFields);
        if (c.length === 1) {
          const d = c[0][1], l = D(d, ne) ? d.decoder : D(d, Ie) ? { mapFromDriverValue: (f) => d.mapFromDriverValue(f) } : d.sql.decoder;
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
    offset: f,
    distinct: g,
    setOperators: p
  }) {
    const w = n ?? Or(r);
    for (const Z of w)
      if (D(Z.field, Ie) && xr(Z.field.table) !== (D(o, Je) ? o._.alias : D(o, Ea) ? o[He].name : D(o, ne) ? void 0 : xr(o)) && !((K) => i == null ? void 0 : i.some(
        ({ alias: pe }) => pe === (K[Q.Symbol.IsAlias] ? xr(K) : K[Q.Symbol.BaseName])
      ))(Z.field.table)) {
        const K = xr(Z.field.table);
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
    const te = M.length > 0 ? I` group by ${I.join(M)}` : void 0, fe = this.buildOrderBy(c), $e = this.buildLimit(l), x = f ? I` offset ${f}` : void 0, X = I`${v}select${m} ${b} from ${T}${R}${j}${te}${U}${fe}${$e}${x}`;
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
        if (D($, tt))
          w.push(I.identifier($.name));
        else if (D($, ne)) {
          for (let v = 0; v < $.queryChunks.length; v++) {
            const m = $.queryChunks[v];
            D(m, tt) && ($.queryChunks[v] = I.identifier(
              this.casing.getColumnCasing(m)
            ));
          }
          w.push(I`${$}`);
        } else
          w.push(I`${$}`);
      l = I` order by ${I.join(w, I`, `)}`;
    }
    const f = typeof a == "object" || typeof a == "number" && a >= 0 ? I` limit ${a}` : void 0, g = I.raw(`${r} ${n ? "all " : ""}`), p = i ? I` offset ${i}` : void 0;
    return I`${c}${g}${d}${l}${f}${p}`;
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
      D($, ne) ? i.push($) : i.push($.getSQL());
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
              U = D(R.default, ne) ? R.default : I.param(R.default, R);
            else if (R.defaultFn !== void 0) {
              const M = R.defaultFn();
              U = D(M, ne) ? M : I.param(M, R);
            } else if (!R.default && R.onUpdateFn !== void 0) {
              const M = R.onUpdateFn();
              U = D(M, ne) ? M : I.param(M, R);
            } else
              U = I`null`;
            b.push(U);
          } else
            b.push(j);
        }
        i.push(b), v < $.length - 1 && i.push(I`, `);
      }
    }
    const f = this.buildWithCTE(a), g = I.join(i), p = s ? I` returning ${this.buildSelection(s, { isSingleTable: !0 })}` : void 0, w = n != null && n.length ? I.join(n) : void 0;
    return I`${f}insert into ${e} ${l} ${g}${w}${p}`;
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
    let l = [], f, g, p = [], w;
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
        const M = typeof o.where == "function" ? o.where(m, oI()) : o.where;
        w = M && Hs(M, i);
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
            value: Gp(te, i)
          });
      }
      for (const { tsKey: M, value: te } of b)
        l.push({
          dbKey: D(te, ne.Aliased) ? te.fieldAlias : a.columns[M].name,
          tsKey: M,
          field: D(te, Ie) ? At(te, i) : te,
          relationTableTsKey: void 0,
          isJson: !1,
          selection: []
        });
      let U = typeof o.orderBy == "function" ? o.orderBy(m, iI()) : o.orderBy ?? [];
      Array.isArray(U) || (U = [U]), p = U.map((M) => D(M, Ie) ? At(M, i) : Hs(M, i)), f = o.limit, g = o.offset;
      for (const {
        tsKey: M,
        queryConfig: te,
        relation: fe
      } of R) {
        const $e = dI(
          r,
          n,
          fe
        ), x = zn(fe.referencedTable), X = n[x], Z = `${i}_${M}`, K = So(
          ...$e.fields.map(
            (q, F) => ts(
              At(
                $e.references[F],
                Z
              ),
              At(q, i)
            )
          )
        ), pe = this.buildRelationalQuery({
          fullSchema: e,
          schema: r,
          tableNamesMap: n,
          table: e[X],
          tableConfig: r[X],
          queryConfig: D(fe, Rr) ? te === !0 ? { limit: 1 } : { ...te, limit: 1 } : te,
          tableAlias: Z,
          joinOn: K,
          nestedQueryRelation: fe
        }), Ne = I`(${pe.sql})`.as(M);
        l.push({
          dbKey: M,
          tsKey: M,
          field: Ne,
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
    if (w = So(d, w), c) {
      let m = I`json_array(${I.join(
        l.map(
          ({ field: R }) => D(R, tt) ? I.identifier(this.casing.getColumnCasing(R)) : D(R, ne.Aliased) ? R.sql : R
        ),
        I`, `
      )})`;
      D(c, Js) && (m = I`coalesce(json_group_array(${m}), json_array())`);
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
      f !== void 0 || g !== void 0 || p.length > 0 ? (v = this.buildSelectQuery({
        table: Ya(s, i),
        fields: {},
        fieldsFlat: [
          {
            path: [],
            field: I.raw("*")
          }
        ],
        where: w,
        limit: f,
        offset: g,
        orderBy: p,
        setOperators: []
      }), w = void 0, f = void 0, g = void 0, p = void 0) : v = Ya(s, i), v = this.buildSelectQuery({
        table: D(v, ct) ? v : new Je(v, {}, i),
        fields: {},
        fieldsFlat: b.map(({ field: R }) => ({
          path: [],
          field: D(R, Ie) ? At(R, i) : R
        })),
        joins: $,
        where: w,
        limit: f,
        offset: g,
        orderBy: p,
        setOperators: []
      });
    } else
      v = this.buildSelectQuery({
        table: Ya(s, i),
        fields: {},
        fieldsFlat: l.map(({ field: m }) => ({
          path: [],
          field: D(m, Ie) ? At(m, i) : m
        })),
        joins: $,
        where: w,
        limit: f,
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
N(Ws, ah, "SQLiteDialect");
var oh, ih;
class Gc extends (ih = Ws, oh = V, ih) {
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
N(Gc, oh, "SQLiteSyncDialect");
var ch;
ch = V;
class Cy {
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
N(Cy, ch, "TypedQueryBuilder");
var lh;
lh = V;
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
    return this.fields ? n = this.fields : D(e, Je) ? n = Object.fromEntries(
      Object.keys(e._.selectedFields).map((s) => [s, e[s]])
    ) : D(e, Ea) ? n = e[He].selectedFields : D(e, ne) ? n = {} : n = MR(e), new xc({
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
N(Dt, lh, "SQLiteSelectBuilder");
var uh, dh;
class Ay extends (dh = Cy, uh = V, dh) {
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
    }, this.tableName = wo(r), this.joinsNotNullableMap = typeof this.tableName == "string" ? { [this.tableName]: !0 } : {};
    for (const d of _r(r)) this.usedTables.add(d);
  }
  /** @internal */
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(r) {
    return (n, s) => {
      var i;
      const a = this.tableName, o = wo(n);
      for (const c of _r(n)) this.usedTables.add(c);
      if (typeof o == "string" && ((i = this.config.joins) != null && i.some((c) => c.alias === o)))
        throw new Error(`Alias "${o}" is already used in this query`);
      if (!this.isPartialSelect && (Object.keys(this.joinsNotNullableMap).length === 1 && typeof a == "string" && (this.config.fields = {
        [a]: this.config.fields
      }), typeof o == "string" && !D(n, ne))) {
        const c = D(n, Je) ? n._.selectedFields : D(n, Ar) ? n[He].selectedFields : n[Q.Symbol.Columns];
        this.config.fields[o] = c;
      }
      if (typeof s == "function" && (s = s(
        new Proxy(
          this.config.fields,
          new Ze({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
      const a = typeof s == "function" ? s(SI()) : s;
      if (!Bc(this.getSelectedFields(), a.getSelectedFields()))
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
        new Ze({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
        new Ze({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
      )
    )), this.config.having = r, this;
  }
  groupBy(...r) {
    if (typeof r[0] == "function") {
      const n = r[0](
        new Proxy(
          this.config.fields,
          new Ze({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
          new Ze({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
      new Je(this.getSQL(), this.config.fields, r, !1, [...new Set(n)]),
      new Ze({ alias: r, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new Ze({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
}
N(Ay, uh, "SQLiteSelectQueryBuilder");
var fh, hh;
class xc extends (hh = Ay, fh = V, hh) {
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
    const n = Or(this.config.fields), s = this.session[r ? "prepareOneTimeQuery" : "prepareQuery"](
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
N(xc, fh, "SQLiteSelect");
DR(xc, [or]);
function Na(t, e) {
  return (r, n, ...s) => {
    const a = [n, ...s].map((o) => ({
      type: t,
      isAll: e,
      rightSelect: o
    }));
    for (const o of a)
      if (!Bc(r.getSelectedFields(), o.rightSelect.getSelectedFields()))
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
    return r.addSetOperators(a);
  };
}
const SI = () => ({
  union: EI,
  unionAll: NI,
  intersect: PI,
  except: TI
}), EI = Na("union", !1), NI = Na("union", !0), PI = Na("intersect", !1), TI = Na("except", !1);
var mh;
mh = V;
class Hc {
  constructor(e) {
    N(this, "dialect");
    N(this, "dialectConfig");
    N(this, "$with", (e, r) => {
      const n = this;
      return { as: (a) => (typeof a == "function" && (a = a(n)), new Proxy(
        new Uc(
          a.getSQL(),
          r ?? ("getSelectedFields" in a ? a.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new Ze({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
      )) };
    });
    this.dialect = D(e, Ws) ? e : void 0, this.dialectConfig = D(e, Ws) ? void 0 : e;
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
    return this.dialect || (this.dialect = new Gc(this.dialectConfig)), this.dialect;
  }
}
N(Hc, mh, "SQLiteQueryBuilder");
var ph;
ph = V;
class To {
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
        s[o] = D(i, ne) ? i : new Ut(i, a[o]);
      }
      return s;
    });
    return new Oo(this.table, r, this.session, this.dialect, this.withList);
  }
  select(e) {
    const r = typeof e == "function" ? e(new Hc()) : e;
    if (!D(r, ne) && !Bc(this.table[_o], r._.selectedFields))
      throw new Error(
        "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
      );
    return new Oo(this.table, r, this.session, this.dialect, this.withList, !0);
  }
}
N(To, ph, "SQLiteInsertBuilder");
var yh, $h;
class Oo extends ($h = or, yh = V, $h) {
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
    return this.config.returning = Or(r), this;
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
    const n = r.where ? I` where ${r.where}` : void 0, s = r.targetWhere ? I` where ${r.targetWhere}` : void 0, a = r.setWhere ? I` where ${r.setWhere}` : void 0, o = Array.isArray(r.target) ? I`${r.target}` : I`${[r.target]}`, i = this.dialect.buildUpdateSet(this.config.table, Xp(this.config.table, r.set));
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
N(Oo, yh, "SQLiteInsert");
var gh;
gh = V;
class Ro {
  constructor(e, r, n, s) {
    this.table = e, this.session = r, this.dialect = n, this.withList = s;
  }
  set(e) {
    return new ky(
      this.table,
      Xp(this.table, e),
      this.session,
      this.dialect,
      this.withList
    );
  }
}
N(Ro, gh, "SQLiteUpdateBuilder");
var vh, _h;
class ky extends (_h = or, vh = V, _h) {
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
      const a = wo(n);
      if (typeof a == "string" && this.config.joins.some((o) => o.alias === a))
        throw new Error(`Alias "${a}" is already used in this query`);
      if (typeof s == "function") {
        const o = this.config.from ? D(n, ct) ? n[Q.Symbol.Columns] : D(n, Je) ? n._.selectedFields : D(n, Ea) ? n[He].selectedFields : void 0 : void 0;
        s = s(
          new Proxy(
            this.config.table[Q.Symbol.Columns],
            new Ze({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          ),
          o && new Proxy(
            o,
            new Ze({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
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
          new Ze({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
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
    return this.config.returning = Or(r), this;
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
N(ky, vh, "SQLiteUpdate");
var wh, bh, Sh;
const Vn = class Vn extends (Sh = ne, bh = V, wh = Symbol.toStringTag, Sh) {
  constructor(r) {
    super(Vn.buildEmbeddedCount(r.source, r.filters).queryChunks);
    N(this, "sql");
    N(this, wh, "SQLiteCountBuilderAsync");
    N(this, "session");
    this.params = r, this.session = r.session, this.sql = Vn.buildCount(
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
N(Vn, bh, "SQLiteCountBuilderAsync");
let Io = Vn;
var Eh;
Eh = V;
class Ly {
  constructor(e, r, n, s, a, o, i, c) {
    this.mode = e, this.fullSchema = r, this.schema = n, this.tableNamesMap = s, this.table = a, this.tableConfig = o, this.dialect = i, this.session = c;
  }
  findMany(e) {
    return this.mode === "sync" ? new jo(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e || {},
      "many"
    ) : new Xs(
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
    return this.mode === "sync" ? new jo(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      e ? { ...e, limit: 1 } : { limit: 1 },
      "first"
    ) : new Xs(
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
N(Ly, Eh, "SQLiteAsyncRelationalQueryBuilder");
var Nh, Ph;
class Xs extends (Ph = or, Nh = V, Ph) {
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
          (c) => Eo(this.schema, this.tableConfig, c, n.selection, o)
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
N(Xs, Nh, "SQLiteAsyncRelationalQuery");
var Th, Oh;
class jo extends (Oh = Xs, Th = V, Oh) {
  sync() {
    return this.executeRaw();
  }
}
N(jo, Th, "SQLiteSyncRelationalQuery");
var Rh, Ih;
class Tn extends (Ih = or, Rh = V, Ih) {
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
N(Tn, Rh, "SQLiteRaw");
var jh;
jh = V;
class Jc {
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
      return { as: (a) => (typeof a == "function" && (a = a(new Hc(n.dialect))), new Proxy(
        new Uc(
          a.getSQL(),
          r ?? ("getSelectedFields" in a ? a.getSelectedFields() ?? {} : {}),
          e,
          !0
        ),
        new Ze({ alias: e, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
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
        a[o] = new Ly(
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
    return new Io({ source: e, filters: r, session: this.session });
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
      return new Ro(c, r.session, r.dialect, e);
    }
    function o(c) {
      return new To(c, r.session, r.dialect, e);
    }
    function i(c) {
      return new Po(c, r.session, r.dialect, e);
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
    return new Ro(e, this.session, this.dialect);
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
    return new To(e, this.session, this.dialect);
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
    return new Po(e, this.session, this.dialect);
  }
  run(e) {
    const r = typeof e == "string" ? I.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Tn(
      async () => this.session.run(r),
      () => r,
      "run",
      this.dialect,
      this.session.extractRawRunValueFromBatchResult.bind(this.session)
    ) : this.session.run(r);
  }
  all(e) {
    const r = typeof e == "string" ? I.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Tn(
      async () => this.session.all(r),
      () => r,
      "all",
      this.dialect,
      this.session.extractRawAllValueFromBatchResult.bind(this.session)
    ) : this.session.all(r);
  }
  get(e) {
    const r = typeof e == "string" ? I.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Tn(
      async () => this.session.get(r),
      () => r,
      "get",
      this.dialect,
      this.session.extractRawGetValueFromBatchResult.bind(this.session)
    ) : this.session.get(r);
  }
  values(e) {
    const r = typeof e == "string" ? I.raw(e) : e.getSQL();
    return this.resultKind === "async" ? new Tn(
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
N(Jc, jh, "BaseSQLiteDatabase");
var Ch;
Ch = V;
class Dy {
}
N(Dy, Ch, "Cache");
var Ah, kh;
class Wc extends (kh = Dy, Ah = V, kh) {
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
N(Wc, Ah, "NoopCache");
async function Fu(t, e) {
  const r = `${t}-${JSON.stringify(e)}`, s = new TextEncoder().encode(r), a = await crypto.subtle.digest("SHA-256", s);
  return [...new Uint8Array(a)].map((c) => c.toString(16).padStart(2, "0")).join("");
}
var Lh, Dh;
class My extends (Dh = or, Lh = V, Dh) {
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
N(My, Lh, "ExecuteResultSync");
var Mh;
Mh = V;
class Vy {
  constructor(e, r, n, s, a, o) {
    /** @internal */
    N(this, "joinsNotNullableMap");
    var i;
    this.mode = e, this.executeMethod = r, this.query = n, this.cache = s, this.queryMetadata = a, this.cacheConfig = o, s && s.strategy() === "all" && o === void 0 && (this.cacheConfig = { enable: !0, autoInvalidate: !0 }), (i = this.cacheConfig) != null && i.enable || (this.cacheConfig = void 0);
  }
  /** @internal */
  async queryWithCache(e, r, n) {
    if (this.cache === void 0 || D(this.cache, Wc) || this.queryMetadata === void 0)
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
        this.cacheConfig.tag ?? await Fu(e, r),
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
          this.cacheConfig.tag ?? await Fu(e, r),
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
    return this.mode === "async" ? this[this.executeMethod](e) : new My(() => this[this.executeMethod](e));
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
N(Vy, Mh, "PreparedQuery");
var Vh;
Vh = V;
class Fy {
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
N(Fy, Vh, "SQLiteSession");
var Fh, qh;
class qy extends (qh = Jc, Fh = V, qh) {
  constructor(e, r, n, s, a = 0) {
    super(e, r, n, s), this.schema = s, this.nestedIndex = a;
  }
  rollback() {
    throw new xp();
  }
}
N(qy, Fh, "SQLiteTransaction");
var zh, Uh;
class zy extends (Uh = Fy, zh = V, Uh) {
  constructor(r, n, s, a = {}) {
    super(n);
    N(this, "logger");
    N(this, "cache");
    this.client = r, this.schema = s, this.logger = a.logger ?? new Wp(), this.cache = a.cache ?? new Wc();
  }
  prepareQuery(r, n, s, a, o, i, c) {
    const d = this.client.prepare(r.sql);
    return new Uy(
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
    const s = new Co("sync", this.dialect, this, this.schema);
    return this.client.transaction(r)[n.behavior ?? "deferred"](s);
  }
}
N(zy, zh, "BetterSQLiteSession");
var Bh, Kh;
const ta = class ta extends (Kh = qy, Bh = V, Kh) {
  transaction(e) {
    const r = `sp${this.nestedIndex}`, n = new ta("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(I.raw(`savepoint ${r}`));
    try {
      const s = e(n);
      return this.session.run(I.raw(`release savepoint ${r}`)), s;
    } catch (s) {
      throw this.session.run(I.raw(`rollback to savepoint ${r}`)), s;
    }
  }
};
N(ta, Bh, "BetterSQLiteTransaction");
let Co = ta;
var Qh, Gh;
class Uy extends (Gh = Vy, Qh = V, Gh) {
  constructor(e, r, n, s, a, o, i, c, d, l) {
    super("sync", c, r, s, a, o), this.stmt = e, this.logger = n, this.fields = i, this._isResponseInArrayMode = d, this.customResultMapper = l;
  }
  run(e) {
    const r = bs(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, r), this.stmt.run(...r);
  }
  all(e) {
    const { fields: r, joinsNotNullableMap: n, query: s, logger: a, stmt: o, customResultMapper: i } = this;
    if (!r && !i) {
      const d = bs(s.params, e ?? {});
      return a.logQuery(s.sql, d), o.all(...d);
    }
    const c = this.values(e);
    return i ? i(c) : c.map((d) => Du(r, d, n));
  }
  get(e) {
    const r = bs(this.query.params, e ?? {});
    this.logger.logQuery(this.query.sql, r);
    const { fields: n, stmt: s, joinsNotNullableMap: a, customResultMapper: o } = this;
    if (!n && !o)
      return s.get(...r);
    const i = s.raw().get(...r);
    if (i)
      return o ? o([i]) : Du(n, i, a);
  }
  values(e) {
    const r = bs(this.query.params, e ?? {});
    return this.logger.logQuery(this.query.sql, r), this.stmt.raw().all(...r);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
N(Uy, Qh, "BetterSQLitePreparedQuery");
var xh, Hh;
class By extends (Hh = Jc, xh = V, Hh) {
}
N(By, xh, "BetterSQLite3Database");
function Ur(t, e = {}) {
  const r = new Gc({ casing: e.casing });
  let n;
  e.logger === !0 ? n = new Jp() : e.logger !== !1 && (n = e.logger);
  let s;
  if (e.schema) {
    const i = cI(
      e.schema,
      fI
    );
    s = {
      fullSchema: e.schema,
      schema: i.tables,
      tableNamesMap: i.tableNamesMap
    };
  }
  const a = new zy(t, r, s, { logger: n }), o = new By("sync", r, a, s);
  return o.$client = t, o;
}
function Ao(...t) {
  if (t[0] === void 0 || typeof t[0] == "string") {
    const e = t[0] === void 0 ? new Sn() : new Sn(t[0]);
    return Ur(e, t[1]);
  }
  if (VR(t[0])) {
    const { connection: e, client: r, ...n } = t[0];
    if (r) return Ur(r, n);
    if (typeof e == "object") {
      const { source: a, ...o } = e, i = new Sn(a, o);
      return Ur(i, n);
    }
    const s = new Sn(e);
    return Ur(s, n);
  }
  return Ur(t[0], t[1]);
}
((t) => {
  function e(r) {
    return Ur({}, r);
  }
  t.mock = e;
})(Ao || (Ao = {}));
const Ir = Iy("songs", {
  id: Qc("id").primaryKey({ autoIncrement: !0 }),
  title: vt("title").notNull(),
  author: vt("author").notNull().default(""),
  language: vt("language").notNull().default("es"),
  slides: vt("slides").notNull().default("[]"),
  createdAt: vt("created_at").notNull().default(I`(datetime('now'))`),
  updatedAt: vt("updated_at").notNull().default(I`(datetime('now'))`)
}), Bn = Iy("media", {
  id: Qc("id").primaryKey({ autoIncrement: !0 }),
  type: vt("type").notNull(),
  title: vt("title").notNull(),
  filePath: vt("file_path").notNull(),
  createdAt: vt("created_at").notNull().default(I`(datetime('now'))`)
});
let Ss = null;
function kr() {
  if (Ss) return Ss;
  const t = re.join(qt.getPath("userData"), "seedscreen.db"), e = new Sn(t);
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
	`), Ss = Ao(e), Ss;
}
function Xc(t) {
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
function jr() {
  return kr().select().from(Ir).orderBy(Ir.title).all().map(Xc);
}
function Ky(t) {
  const e = kr().insert(Ir).values({
    title: t.title.trim(),
    author: (t.author || "").trim(),
    language: t.language || "es",
    slides: JSON.stringify(t.slides || [])
  }).returning().get();
  return Xc(e);
}
function OI(t, e) {
  const r = kr().update(Ir).set({
    title: e.title.trim(),
    author: (e.author || "").trim(),
    language: e.language || "es",
    slides: JSON.stringify(e.slides || []),
    updatedAt: I`(datetime('now'))`
  }).where(ts(Ir.id, t)).returning().get();
  return r ? Xc(r) : null;
}
function RI(t) {
  return kr().delete(Ir).where(ts(Ir.id, t)).run(), !0;
}
function II(t) {
  const e = (s, a) => `${s.trim().toLowerCase()}::${a.trim().toLowerCase()}`, r = new Set(jr().map((s) => e(s.title, s.author)));
  let n = 0;
  for (const s of t ?? [])
    s != null && s.title && (r.has(e(s.title, s.author || "")) || (Ky({
      title: s.title,
      author: s.author || "",
      language: s.language || "es",
      slides: s.slides || []
    }), r.add(e(s.title, s.author || "")), n++));
  return { added: n, total: (t == null ? void 0 : t.length) ?? 0 };
}
function Yc(t) {
  return {
    id: t.id,
    type: t.type === "video" ? "video" : "image",
    title: t.title,
    filePath: t.filePath,
    createdAt: t.createdAt
  };
}
function Kn() {
  return kr().select().from(Bn).orderBy(Bn.title).all().map(Yc);
}
function jI(t) {
  const e = kr().insert(Bn).values({ type: t.type, title: t.title.trim(), filePath: t.filePath }).returning().get();
  return Yc(e);
}
function CI(t) {
  const e = kr().delete(Bn).where(ts(Bn.id, t)).returning().get();
  return e ? Yc(e) : null;
}
const AI = /(vethernet|virtualbox|vmware|hyper-?v|wsl|default switch|loopback|docker|tailscale|zerotier|utun|llw|awdl|bridge|ppp|tun|tap)/i;
function Qy() {
  const t = [];
  for (const [e, r] of Object.entries(wr.networkInterfaces()))
    for (const n of r ?? [])
      n.family !== "IPv4" || n.internal || n.address.startsWith("169.254.") || t.push({ name: e, address: n.address, netmask: n.netmask });
  return t;
}
function qu(t) {
  let e = 0;
  return AI.test(t.name) && (e -= 100), t.address.startsWith("192.168.56.") && (e -= 60), t.address.startsWith("192.168.") ? e += 30 : t.address.startsWith("10.") ? e += 25 : /^172\.(1[6-9]|2\d|3[01])\./.test(t.address) && (e += 10), e;
}
function Gy() {
  const t = Qy();
  return t.length === 0 ? "127.0.0.1" : (t.sort((e, r) => qu(r) - qu(e)), t[0].address);
}
function kI(t, e) {
  const r = t.split(".").map(Number), n = e.split(".").map(Number);
  return r.length !== 4 || n.length !== 4 || [...r, ...n].some(Number.isNaN) ? null : r.map((s, a) => s & n[a] | ~n[a] & 255).join(".");
}
function LI() {
  const t = /* @__PURE__ */ new Set(["255.255.255.255"]);
  for (const e of Qy()) {
    const r = kI(e.address, e.netmask);
    r && t.add(r);
  }
  return [...t];
}
const xy = 3849, DI = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8"
}, Zc = {
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
let Mt = null, Qn = Zc, On = null;
const Gn = /* @__PURE__ */ new Set();
async function MI(t, e, r) {
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
function VI(t, e, r) {
  const n = e === "/" ? "/remote.html" : e.split("?")[0], s = re.join(t, decodeURIComponent(n));
  if (!s.startsWith(t)) {
    r.writeHead(403), r.end();
    return;
  }
  ae.readFile(s, (a, o) => {
    if (a) {
      r.writeHead(404), r.end();
      return;
    }
    r.setHeader("Content-Type", DI[re.extname(s)] ?? "application/octet-stream"), r.end(o);
  });
}
function FI(t) {
  Qn = t;
  const e = `data: ${JSON.stringify(Qn)}

`;
  for (const r of Gn) r.write(e);
}
function zu() {
  return Mt !== null;
}
function Hy() {
  return `http://${Gy()}:${xy}`;
}
function Es(t, e) {
  t.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  }), t.end(JSON.stringify(e));
}
function Uu(t) {
  return t === "en" ? "en" : "es";
}
function qI(t) {
  Mt || (On = t.onCommand, Qn = Zc, Mt = zo.createServer((e, r) => {
    const n = new URL(e.url ?? "/", "http://localhost");
    if (e.method === "GET" && n.pathname === "/api/library/songs") {
      Es(r, t.library.getSongs());
      return;
    }
    if (e.method === "GET" && n.pathname === "/api/library/bible/books") {
      Es(r, t.library.getBibleBooks(Uu(n.searchParams.get("lang"))));
      return;
    }
    if (e.method === "GET" && n.pathname === "/api/library/bible/chapter") {
      const s = n.searchParams.get("book") ?? "", a = Number(n.searchParams.get("chapter"));
      Es(r, t.library.getBibleChapter(s, a, Uu(n.searchParams.get("lang"))));
      return;
    }
    if (e.method === "GET" && n.pathname === "/api/library/media") {
      Es(r, t.library.getMedia());
      return;
    }
    if (e.method === "GET" && n.pathname.startsWith("/api/media-file/")) {
      const s = Number(n.pathname.slice(16)), a = Number.isFinite(s) ? t.library.getMediaFile(s) : null;
      if (!a) {
        r.writeHead(404), r.end();
        return;
      }
      r.setHeader("Content-Type", a.mimeType), ae.createReadStream(a.filePath).pipe(r);
      return;
    }
    if (e.method === "GET" && e.url === "/api/events") {
      r.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*"
      }), r.write(`data: ${JSON.stringify(Qn)}

`), Gn.add(r), e.on("close", () => Gn.delete(r));
      return;
    }
    if (e.method === "POST" && e.url === "/api/command") {
      let s = "";
      e.on("data", (a) => {
        s += a;
      }), e.on("end", () => {
        try {
          On == null || On(JSON.parse(s));
        } catch {
        }
        r.setHeader("Access-Control-Allow-Origin", "*"), r.end("{}");
      });
      return;
    }
    if (e.method === "GET" && e.url) {
      t.devServerUrl ? MI(t.devServerUrl, e.url, r) : VI(t.distDir, e.url, r);
      return;
    }
    r.writeHead(404), r.end();
  }), Mt.on("error", () => {
  }), Mt.listen(xy, "0.0.0.0"));
}
function Jy() {
  for (const t of Gn) t.end();
  Gn.clear(), Mt == null || Mt.close(), Mt = null, On = null, Qn = Zc;
}
const Yr = 3847, ko = 3848, Lo = "seedscreen", Do = /* @__PURE__ */ new Map();
let rr = null, xe = null, Ms = null;
function Wy(t) {
  return Buffer.from(
    JSON.stringify({
      app: Lo,
      type: t,
      hostname: wr.hostname(),
      port: Yr,
      songCount: jr().length
    })
  );
}
function Mo() {
  if (!xe) return;
  const t = Wy("hello");
  for (const e of LI())
    try {
      xe.send(t, 0, t.length, ko, e);
    } catch {
    }
}
function zI(t) {
  if (rr || (rr = zo.createServer((e, r) => {
    r.setHeader("Content-Type", "application/json"), r.setHeader("Access-Control-Allow-Origin", "*"), e.url === "/api/info" ? r.end(JSON.stringify({ hostname: wr.hostname(), songCount: jr().length, port: Yr, app: Lo })) : e.url === "/api/songs" ? r.end(JSON.stringify({ songs: jr() })) : (r.writeHead(404), r.end("{}"));
  }), rr.on("error", () => {
  }), rr.listen(Yr, "0.0.0.0")), !xe) {
    const e = wr.hostname();
    xe = l$.createSocket({ type: "udp4", reuseAddr: !0 }), xe.on("error", () => {
    }), xe.on("message", (r, n) => {
      try {
        const s = JSON.parse(r.toString());
        if (s.app !== Lo || s.type !== "hello" && s.type !== "hello-reply" || s.hostname && s.hostname === e) return;
        const a = {
          ip: n.address,
          hostname: s.hostname || n.address,
          port: s.port || Yr,
          songCount: s.songCount || 0,
          lastSeen: Date.now()
        };
        if (Do.set(n.address, a), t == null || t(a), s.type === "hello" && xe) {
          const o = Wy("hello-reply");
          try {
            xe.send(o, 0, o.length, n.port || ko, n.address);
          } catch {
          }
        }
      } catch {
      }
    }), xe.bind(ko, () => {
      xe == null || xe.setBroadcast(!0), Mo();
    }), Ms = setInterval(Mo, 6e3);
  }
}
function UI() {
  return { ip: Gy(), hostname: wr.hostname(), port: Yr, songCount: jr().length };
}
function Xy() {
  const t = Date.now() - 2e4, e = [];
  for (const [r, n] of Do)
    n.lastSeen > t ? e.push(n) : Do.delete(r);
  return e;
}
function BI() {
  Mo();
}
function KI(t, e) {
  return new Promise((r, n) => {
    const s = zo.request(
      { hostname: t, port: e || Yr, path: "/api/songs", method: "GET", timeout: 8e3 },
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
function QI() {
  Ms && clearInterval(Ms), xe == null || xe.close(), rr == null || rr.close(), Ms = null, xe = null, rr = null;
}
const qe = new RR({
  defaults: { theme: "marino", backgrounds: [], logo: null, images: [] }
}), GI = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};
function Yy() {
  const t = Xh.showOpenDialogSync({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg"] }]
  }), e = t == null ? void 0 : t[0];
  if (!e) return null;
  const r = re.extname(e).toLowerCase(), n = GI[r] ?? "application/octet-stream", s = ae.readFileSync(e).toString("base64");
  return {
    name: re.basename(e, r),
    dataUrl: `data:${n};base64,${s}`
  };
}
const Bu = ["mp4", "webm", "mov", "m4v"], xI = ["png", "jpg", "jpeg", "gif", "webp"], Zy = {
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
function Vo() {
  const t = re.join(qt.getPath("userData"), "media");
  return ae.mkdirSync(t, { recursive: !0 }), t;
}
Wh.registerSchemesAsPrivileged([
  {
    scheme: "media",
    privileges: { standard: !0, secure: !0, supportFetchAPI: !0, stream: !0, corsEnabled: !0 }
  }
]);
function HI(t) {
  return `media://file/${encodeURIComponent(re.basename(t))}`;
}
function JI() {
  const t = Xh.showOpenDialogSync({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Media", extensions: [...xI, ...Bu] }]
  });
  for (const e of t ?? []) {
    const r = re.extname(e).toLowerCase().slice(1), n = Bu.includes(r) ? "video" : "image", s = re.join(Vo(), `${Fo()}.${r}`);
    ae.copyFileSync(e, s), jI({ type: n, title: re.basename(e, re.extname(e)), filePath: s });
  }
}
const Ku = /* @__PURE__ */ new Map();
function Pa(t) {
  const e = Ku.get(t);
  if (e) return e;
  const r = re.join(process.resourcesPath, "bible", `${t}.json`), n = re.join(Ta, "../resources/bible", `${t}.json`), s = ae.existsSync(r) ? r : n, o = JSON.parse(ae.readFileSync(s, "utf-8")).verses.map((f) => ({ ...f, text: f.text.replace(/<\/?i>/gi, "") })), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  for (const f of o)
    c.has(f.book) || c.set(f.book, f.book_name), (i.get(f.book) ?? 0) < f.chapter && i.set(f.book, f.chapter);
  const l = { books: t$.map((f, g) => {
    const p = g + 1;
    return {
      id: f,
      name: c.get(p) ?? f,
      abbr: e$[f] ?? f,
      chapterCount: i.get(p) ?? 0,
      index: g
    };
  }), verses: o };
  return Ku.set(t, l), l;
}
const e$ = {
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
}, t$ = Object.keys(e$);
qt.setName("SeedScreen");
const Ta = re.dirname(o$(import.meta.url));
process.env.APP_ROOT = re.join(Ta, "..");
const sn = process.env.VITE_DEV_SERVER_URL, yj = re.join(process.env.APP_ROOT, "dist-electron"), Oa = re.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = sn ? re.join(process.env.APP_ROOT, "public") : Oa;
let se;
function r$() {
  se = new qo({
    width: 1920,
    height: 1080,
    backgroundColor: "#0e1b2e",
    icon: re.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: re.join(Ta, "preload.mjs")
    }
  }), se.webContents.on("did-finish-load", () => {
    se == null || se.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), sn ? se.loadURL(sn) : se.loadFile(re.join(Oa, "index.html"));
}
let Ee = null;
function WI(t) {
  const e = Zr.getAllDisplays(), r = Zr.getPrimaryDisplay(), n = (t ? e.find((o) => o.id === t) : e.find((o) => o.id !== r.id)) ?? r, s = n.id !== r.id, a = n.bounds;
  Ee = new qo({
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
      preload: re.join(Ta, "preload.mjs"),
      // Output videos must start playing the instant they're sent — there's no user
      // gesture available on the audience screen to satisfy the default autoplay policy.
      autoplayPolicy: "no-user-gesture-required"
    }
  }), sn ? Ee.loadURL(`${sn}#output`) : Ee.loadFile(re.join(Oa, "index.html"), { hash: "output" }), Ee.on("closed", () => {
    Ee = null, se == null || se.webContents.send("output-window-closed");
  });
}
qt.on("window-all-closed", () => {
  process.platform !== "darwin" && (qt.quit(), se = null);
});
const XI = process.platform === "darwin", YI = [
  // En macOS, el primer menú suele ser el nombre de la app.
  // Usamos el operador spread (...) para insertarlo solo si es Mac.
  ...XI ? [
    {
      label: qt.name,
      submenu: [
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => se == null ? void 0 : se.webContents.send("open-settings")
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
        click: () => se == null ? void 0 : se.webContents.send("open-settings")
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
        click: () => se == null ? void 0 : se.webContents.send("menu-new-song")
      },
      {
        label: "New song with AI",
        accelerator: "CmdOrCtrl+Shift+I",
        click: () => se == null ? void 0 : se.webContents.send("menu-new-song-ai")
      }
    ]
  },
  {
    label: "Presentation",
    submenu: [
      {
        label: "Project",
        accelerator: "CmdOrCtrl+P",
        click: () => se == null ? void 0 : se.webContents.send("menu-toggle-output")
      },
      { type: "separator" },
      {
        label: "Show black screen",
        accelerator: "B",
        click: () => se == null ? void 0 : se.webContents.send("menu-go-black")
      },
      {
        label: "Show logo",
        accelerator: "L",
        click: () => se == null ? void 0 : se.webContents.send("menu-show-logo")
      },
      { type: "separator" },
      {
        label: "Remote Control",
        type: "checkbox",
        checked: !1,
        accelerator: "CmdOrCtrl+Shift+R",
        click: (t) => {
          t.checked ? (qI({
            devServerUrl: sn,
            distDir: Oa,
            onCommand: (e) => se == null ? void 0 : se.webContents.send("remote:command", e),
            library: {
              getSongs: () => jr(),
              getBibleBooks: (e) => Pa(e).books,
              getBibleChapter: (e, r, n) => n$(e, r, n),
              // `media://` URLs only resolve inside an Electron BrowserWindow, not a
              // phone browser, so the remote gets its own HTTP-servable URL per item.
              getMedia: () => Kn().map((e) => ({ ...e, url: `/api/media-file/${e.id}` })),
              getMediaFile: (e) => {
                const r = Kn().find((s) => s.id === e);
                if (!r) return null;
                const n = Zy[re.extname(r.filePath).toLowerCase()];
                return n ? { filePath: r.filePath, mimeType: n } : null;
              }
            }
          }), se == null || se.webContents.send("remote:status-changed", {
            active: !0,
            url: Hy()
          })) : (Jy(), se == null || se.webContents.send("remote:status-changed", { active: !1, url: null }));
        }
      }
    ]
  }
];
ye.handle("settings:get-all", () => ({
  theme: qe.get("theme"),
  backgrounds: qe.get("backgrounds"),
  logo: qe.get("logo"),
  images: qe.get("images")
}));
ye.handle("settings:set-theme", (t, e) => (qe.set("theme", e), !0));
ye.handle("settings:pick-logo", () => {
  const t = Yy();
  return t ? (qe.set("logo", t.dataUrl), t.dataUrl) : null;
});
ye.handle("settings:clear-logo", () => (qe.set("logo", null), !0));
ye.handle(
  "backgrounds:add",
  (t, e) => {
    const r = { id: Fo(), ...e };
    return qe.set("backgrounds", [...qe.get("backgrounds"), r]), r;
  }
);
ye.handle("backgrounds:delete", (t, e) => (qe.set(
  "backgrounds",
  qe.get("backgrounds").filter((r) => r.id !== e)
), !0));
ye.handle("images:add", () => {
  const t = Yy();
  if (t) {
    const e = { id: Fo(), ...t };
    qe.set("images", [...qe.get("images"), e]);
  }
  return qe.get("images");
});
ye.handle("images:delete", (t, e) => (qe.set(
  "images",
  qe.get("images").filter((r) => r.id !== e)
), qe.get("images")));
ye.handle("sync:get-local-info", () => UI());
ye.handle("sync:get-peers", () => Xy());
ye.handle("sync:search-peers", async () => (BI(), await new Promise((t) => setTimeout(t, 2500)), Xy()));
ye.handle("sync:fetch-songs", (t, e, r) => KI(e, r));
ye.handle("sync:import-songs", (t, e) => II(e));
ye.handle("remote:get-status", () => ({
  active: zu(),
  url: zu() ? Hy() : null
}));
ye.handle("remote:push-state", (t, e) => (FI(e), !0));
ye.handle("output:toggle", (t, e) => Ee ? (Ee.close(), { opened: !1 }) : (WI(e), { opened: !0 }));
ye.handle("output:get-status", () => ({ isOpen: Ee !== null }));
ye.handle("displays:get-all", () => {
  const t = Zr.getAllDisplays(), e = Zr.getPrimaryDisplay();
  return t.map((r) => ({
    id: r.id,
    label: r.id === e.id ? "Primary Display" : "External Monitor",
    isPrimary: r.id === e.id
  }));
});
ye.handle("output:send-slide", (t, e) => (Ee == null || Ee.webContents.send("show-slide", e), !0));
ye.handle("output:go-black", () => (Ee == null || Ee.webContents.send("go-black"), !0));
ye.handle("output:show-image", (t, e) => (Ee == null || Ee.webContents.send("show-image", e), !0));
ye.handle("output:show-video", (t, e) => (Ee == null || Ee.webContents.send("show-video", e), !0));
ye.handle("output:show-youtube", (t, e) => (Ee == null || Ee.webContents.send("show-youtube", e), !0));
ye.handle("songs:get-all", () => jr());
ye.handle("songs:add", (t, e) => Ky(e));
ye.handle("songs:update", (t, e, r) => OI(e, r));
ye.handle("songs:delete", (t, e) => RI(e));
function el(t) {
  return t.map((e) => ({ ...e, url: HI(e.filePath) }));
}
ye.handle("media:get-all", () => el(Kn()));
ye.handle("media:add", () => (JI(), el(Kn())));
ye.handle("media:delete", (t, e) => {
  const r = CI(e);
  return r && ae.rm(r.filePath, { force: !0 }, () => {
  }), el(Kn());
});
function n$(t, e, r) {
  const n = t$.indexOf(t) + 1;
  return n === 0 ? [] : Pa(r).verses.filter((s) => s.book === n && s.chapter === e).sort((s, a) => s.verse - a.verse).map((s) => ({ v: s.verse, t: s.text }));
}
ye.handle("bible:get-books", (t, e = "es") => Pa(e).books);
ye.handle(
  "bible:get-chapter",
  (t, e, r, n = "es") => n$(e, r, n)
);
ye.handle("bible:search", (t, e, r = "es") => {
  var o;
  if (!e || e.length < 3) return [];
  const n = e.toLowerCase(), s = Pa(r), a = [];
  for (const i of s.verses) {
    if (!i.text.toLowerCase().includes(n)) continue;
    const c = ((o = s.books[i.book - 1]) == null ? void 0 : o.abbr) ?? "";
    if (a.push({ bookName: i.book_name, abbr: c, chapter: i.chapter, verse: i.verse, text: i.text }), a.length >= 60) return a;
  }
  return a;
});
qt.on("activate", () => {
  qo.getAllWindows().length === 0 && r$();
});
qt.whenReady().then(() => {
  Wh.handle("media", async (e) => {
    const r = new URL(e.url), n = decodeURIComponent(r.pathname.replace(/^\/+/, "")), s = re.join(Vo(), n);
    if (!s.startsWith(Vo()))
      return new Response("Forbidden", { status: 403 });
    try {
      const a = await ae.promises.readFile(s);
      return new Response(a, {
        headers: { "Content-Type": Zy[re.extname(s).toLowerCase()] ?? "application/octet-stream" }
      });
    } catch {
      return console.error(`[media] file not found: ${s}`), new Response("Not found", { status: 404 });
    }
  }), r$();
  const t = nl.buildFromTemplate(YI);
  nl.setApplicationMenu(t), Zr.on("display-added", () => se == null ? void 0 : se.webContents.send("displays-changed")), Zr.on("display-removed", () => se == null ? void 0 : se.webContents.send("displays-changed")), zI((e) => se == null ? void 0 : se.webContents.send("sync-peer-found", e));
});
qt.on("before-quit", () => {
  QI(), Jy();
});
export {
  yj as MAIN_DIST,
  Oa as RENDERER_DIST,
  sn as VITE_DEV_SERVER_URL
};
