import {Depend, KeyDepends} from '../../../types/observer';

let activeDepends: Depend;

/**
	* Create a observer object.
	*/
export class Reactive<T extends object> {
	observale: T = {} as T;
	protected depends: KeyDepends = new Map();

	/**
		* @param raw - raw object to observe.
		*/
	constructor(public raw: T) {
		this.observale = this.bind(raw) as T;
	}

	/**
		* Bind.
		*/
	protected bind(raw: object) {
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
	protected registerDepend(key: string | symbol) {
		let depends = this.depends.get(key);
		const depend = activeDepends;
		if (depend != undefined) {
			if (depends == undefined) {
				depends = new Set([depend]);
				this.depends.set(key, depends);
			} else {
				depends.add(depend);
				this.depends.set(key, depends);

				return true;
			}
		} else {
			return false;
		}
	}
}

/**
	* Observe a object and if object changed, trigger observer.
	*
	* @param observer - listener.
	*/
export function watch(observer: Depend) {
	activeDepends = observer;
	observer();
}

/**
	* Raw object to observable object.
	*
	* @param target - raw object to observe.
	*/
export default function use<T extends object>(raw: T) {
	return new Reactive(raw).observale;
}

