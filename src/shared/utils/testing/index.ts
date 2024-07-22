import { describe, expect, it } from "bun:test";

/**
 * Using a common interface for testing tools is really useful, especially when using different testing frameworks.
 * For example, I was using Bun's testing tools and then switched to Vitest, and then back.
 * With this approach, I can switch back or to another testing tool without having to edit all my test code.
 * This makes it much easier to maintain and adapt my tests over time.
 * It also keeps my tests decoupled from specific testing frameworks, leading to more flexible and manageable code.
 */
expect.extend({
	toBeTrue(received) {
		const { isNot } = this;
		return {
			pass: received === true,
			message: () => `${received} is${isNot ? " not" : ""} true`,
		};
	},
	toBeFalse(received) {
		const { isNot } = this;
		return {
			pass: received === false,
			message: () => `${received} is${isNot ? " not" : ""} false`,
		};
	},
});

export { describe, expect, it };
