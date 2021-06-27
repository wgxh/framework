import { use, watch } from "../src/core/reactivity/reactive";

test("Test reactive.ts", () => {
	const test_data = use({
		count: 1,
	});
	let count = 0;
	watch(() => {
		count = test_data.count;
	});
	expect(count).toBe(1);

	test_data.count++;
	expect(count).toBe(2);
});
