import typescript from "rollup-plugin-typescript2";
import serve from "rollup-plugin-serve";

export default {
	input: "./index.ts",
	output: [
		{
			file: "./dist/index.cjs.js",
			format: "cjs",
		},
		{
			file: "./dist/index.esm.js",
			format: "esm",
		},
	],
	plugins: [typescript(), serve()],
};
