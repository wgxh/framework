import { use } from "./reactive";

export function ref(raw: any) {
	if (typeof raw == "object") {
		return use(raw);
	} else {
		return use({
			value: raw,
		});
	}
}
