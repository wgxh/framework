import { Element } from "./element";
import { Childrens } from "../../types/view";

export function div(...childrens: Childrens) {
	return new Element("div", ...childrens);
}

export function hl(level: 1 | 2 | 3 | 4 | 5 | 6) {
	return new Element(`h${level}`);
}

export function span(...childrens: Childrens) {
	return new Element("span", ...childrens);
}

export function p(...childrens: Childrens) {
	return new Element("p", ...childrens);
}

export function button(...childrens: Childrens) {
	return new Element("button", ...childrens);
}
