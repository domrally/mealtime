import { WeakSetWrapper } from './weak-set-wrapper.js';
export class Operator extends Set {
    constructor(caller) {
        super();
        this.caller = caller;
        this.listeners = new WeakSetWrapper(this);
        this.caller = new Proxy(caller, this);
    }
    get(target, key) {
        let item;
        if (this.size) {
            this.forEach((t) => item = t[key]);
        }
        else {
            item = target[key];
        }
        return item;
    }
    set(target, key, value) {
        if (this.size) {
            this.forEach((t) => t[key] = value);
        }
        else {
            target[key] = value;
        }
        return true;
    }
    apply(target, that, args) {
        let item;
        if (this.size) {
            this.forEach((t) => item = t.bind(that)(...args));
        }
        else {
            item = target.bind(that)(...args);
        }
        return item;
    }
}
