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
/**
    * Raw object to observable object.
    *
    * @param target - raw object to observe.
    */
function use(raw) {
    return new Reactive(raw).observale;
}

function ref(raw) {
    if (typeof raw == "object") {
        return use(raw);
    }
    else {
        return use({
            value: raw,
        });
    }
}

class Base {
    type;
    childrens;
    ownClassName = `w${Math.floor(Math.random() * 1000000)}`;
    attributes = {};
    styles = {};
    evnets = new Map();
    constructor(type, childrens) {
        this.type = type;
        this.childrens = childrens;
        this.attributes["className"] = this.ownClassName;
    }
    attrs(attrs) {
        Object.assign(this.attributes, attrs);
        return this;
    }
    class(...classNames) {
        this.attributes["className"] += ` ${classNames.join(" ")}`;
        return this;
    }
    style(style) {
        Object.assign(this.styles, style);
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
    static styleEl = document.createElement("style");
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
    resolveStyle(el) {
        const selector = `${this.type}.${this.attributes.className
            .split(" ")
            .join(".")}`;
        const rules = `${Object.keys(this.styles)
            .map((rule) => {
            return `${rule}: ${this.styles[rule]};`;
        })
            .join("")}`;
        el.innerText += `${selector} {${rules}}`;
    }
    resolveChildrens(el) {
        this.childrens.forEach((child) => {
            if (typeof child == "string") {
                el.append(document.createTextNode(child));
            }
            else {
                el.append(child.render());
            }
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
            this.resolveStyle(Element.styleEl);
            this.resolveChildrens(el);
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
                Element.styleEl.innerText = "";
                rootContainer.appendChild(renderer().render());
                document.head.appendChild(Element.styleEl);
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

export { Base, Element, Reactive, button, createApp, div, hl, p, ref, span, use, watch };
