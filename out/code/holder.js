var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Holder_target;
export class Holder {
    constructor() {
        this.held = new Proxy(() => { }, this);
        this.hold = (target) => __classPrivateFieldSet(this, _Holder_target, target, "f");
        this.get = (_, key) => __classPrivateFieldGet(this, _Holder_target, "f")[key];
        this.set = (_, key, value) => __classPrivateFieldGet(this, _Holder_target, "f")[key] = value;
        this.apply = (_, that, args) => __classPrivateFieldGet(this, _Holder_target, "f").apply(that, args);
        _Holder_target.set(this, void 0);
    }
}
_Holder_target = new WeakMap();
