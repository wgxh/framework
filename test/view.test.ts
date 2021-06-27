import { div } from "../src/view/components";

test("Test view", () => {
	expect(div("Hello world").childrens[0]).toBe("Hello world");
});
