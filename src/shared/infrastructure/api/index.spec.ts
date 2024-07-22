import { describe, expect, it } from "@testing";
import app from "./";

describe("Health endpoint", () => {
	it("Should return OK with status 200 Response", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("OK");
	});
});
