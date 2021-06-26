import { watch } from "../core/reactivity/reactive";
import { Element } from "./element";

export function createApp(comp: () => () => Element) {
	const renderer = comp();

	return {
		render(rootContainer: HTMLElement) {
			watch(() => {
				rootContainer.innerText = "";
				rootContainer.appendChild(renderer().render());
			});
		},
	};
}
