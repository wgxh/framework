module.exports = {
	roots: ["test"],
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	extensionsToTreatAsEsm: [".ts"],
};
