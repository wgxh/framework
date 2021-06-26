import { Base } from "../src/view/base";
import { Element } from "../src/view/element";

interface Attributes {
	[attr: string]: string;
}
interface Styles {
	[rule: string]: string;
}
type Type = keyof HTMLElementTagNameMap | "text";
type Childrens = (Element | string)[];
