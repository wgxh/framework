'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let activeDepends;
/**
    * Create a observer object.
    */
class Reactive {
    raw;
    observale = {};
    depends = new Map();
    /**
        * @param raw - raw object to observe.
        */
    constructor(raw) {
        this.raw = raw;
        this.observale = this.bind(raw);
    }
    /**
        * Bind.
        */
    bind(raw) {
        const self = this;
        const observale = new Proxy(raw, {
            get(target, key) {
                self.registerDepend(key);
                return Reflect.get(target, key);
            },
            set(target, key, value) {
                const depends = self.depends.get(key);
                Reflect.set(target, key, value);
                if (depends != undefined) {
                    depends.forEach((observer) => observer());
                }
                return true;
            },
        });
        for (const key in raw) {
            const item = Reflect.get(raw, key);
            if (typeof item === 'object') {
                Reflect.set(observale, key, this.bind(item));
            }
        }
        return observale;
    }
    /**
        * Register depend.
        */
    registerDepend(key) {
        let depends = this.depends.get(key);
        const depend = activeDepends;
        if (depend != undefined) {
            if (depends == undefined) {
                depends = new Set([depend]);
                this.depends.set(key, depends);
            }
            else {
                depends.add(depend);
                this.depends.set(key, depends);
                return true;
            }
        }
        else {
            return false;
        }
    }
}
/**
    * Observe a object and if object changed, trigger observer.
    *
    * @param observer - listener.
    */
function watch(observer) {
    activeDepends = observer;
    observer();
}

class Base {
    type;
    childrens;
    ownClassName = `w${Math.floor(Math.random() * 1000000)}`;
    attributes = {};
    evnets = new Map();
    constructor(type, childrens) {
        this.type = type;
        this.childrens = childrens;
        this.attributes["class"] = this.ownClassName;
    }
    attrs(attrs) {
        Object.assign(this.attributes, attrs);
        return this;
    }
    class(...classNames) {
        this.attributes["class"] = ` ${classNames.join(" ")}`;
        return this;
    }
    id(id) {
        this.attributes["id"] = id;
        return this;
    }
    on(type, listener) {
        this.evnets.set(type, listener);
        return this;
    }
    _(...childrens) {
        this.childrens.push(...childrens);
        return this;
    }
}

class Element extends Base {
    constructor(type, ...childrens) {
        super(type, childrens);
    }
    resolveAttributes(el) {
        for (let attr in this.attributes) {
            Reflect.set(el, attr, this.attributes[attr]);
        }
    }
    resolveEvents(el) {
        this.evnets.forEach((listener, type) => {
            el.addEventListener(type, listener);
        });
    }
    render() {
        if (this.type == "text") {
            return document.createTextNode(this.childrens.join(""));
        }
        else {
            const el = document.createElement(this.type);
            this.resolveAttributes(el);
            this.resolveEvents(el);
            this.childrens.forEach((child) => {
                if (typeof child == "string") {
                    el.append(document.createTextNode(child));
                }
                else {
                    el.append(child.render());
                }
            });
            return el;
        }
    }
}

function createApp(comp) {
    const renderer = comp();
    return {
        render(rootContainer) {
            watch(() => {
                rootContainer.innerText = "";
                rootContainer.appendChild(renderer().render());
            });
        },
    };
}

function div(...childrens) {
    return new Element("div", ...childrens);
}
function hl(level) {
    return new Element(`h${level}`);
}
function span(...childrens) {
    return new Element("span", ...childrens);
}
function p(...childrens) {
    return new Element("p", ...childrens);
}
function button(...childrens) {
    return new Element("button", ...childrens);
}

exports.Base = Base;
exports.Element = Element;
exports.Reactive = Reactive;
exports.button = button;
exports.createApp = createApp;
exports.div = div;
exports.hl = hl;
exports.p = p;
exports.span = span;
exports.watch = watch;
