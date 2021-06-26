import { Attributes, Childrens, Styles, Type } from "../../types/view";

export class Base {
	ownClassName: string = `w${Math.floor(Math.random() * 1000000)}`;
	attributes: Attributes = {};
	styles: Styles = {};
	evnets: Map<keyof HTMLElementEventMap, EventListener> = new Map();

	constructor(public type: Type, public childrens: Childrens) {
		this.attributes["className"] = this.ownClassName;
	}

	attrs(attrs: Attributes) {
		Object.assign(this.attributes, attrs);

		return this;
	}
	class(...classNames: string[]) {
		this.attributes["className"] += ` ${classNames.join(" ")}`;

		return this;
	}
	style(style: Styles) {
		Object.assign(this.styles, style);

		return this;
	}
	id(id: string) {
		this.attributes["id"] = id;

		return this;
	}
	on(type: keyof HTMLElementEventMap, listener: EventListener) {
		this.evnets.set(type, listener);

		return this;
	}
	_(...childrens: Childrens) {
		this.childrens.push(...childrens);

		return this;
	}
}
