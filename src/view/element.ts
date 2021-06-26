import { Attributes, Childrens, Type } from "../../types/view";
import { Base } from "./base";

export class Element extends Base {
	static styleEl: HTMLStyleElement = document.createElement("style");

	constructor(type: Type, ...childrens: Childrens) {
		super(type, childrens);
	}

	protected resolveAttributes(el: HTMLElement) {
		for (let attr in this.attributes) {
			Reflect.set(el, attr, this.attributes[attr]);
		}
	}
	protected resolveEvents(el: HTMLElement) {
		this.evnets.forEach((listener, type) => {
			el.addEventListener(type, listener);
		});
	}
	protected resolveStyle(el: HTMLStyleElement) {
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

	render() {
		if (this.type == "text") {
			return document.createTextNode((this.childrens as string[]).join(""));
		} else {
			const el = document.createElement(this.type);
			this.resolveAttributes(el);
			this.resolveEvents(el);
			this.resolveStyle(Element.styleEl);
			this.childrens.forEach((child) => {
				if (typeof child == "string") {
					el.append(document.createTextNode(child));
				} else {
					el.append(child.render());
				}
			});

			return el;
		}
	}
}
