import { describe, expect, it } from "vitest";
import { getVersion } from "../utils/version";

describe("version", () => {
	describe("getVersion", () => {
		it("should return a valid version string", () => {
			const version = getVersion();
			expect(version).toBeDefined();
			expect(typeof version).toBe("string");
			expect(version).not.toBe("");
		});

		it("should match semver pattern or return 'unknown'", () => {
			const version = getVersion();
			const semverPattern = /^\d+\.\d+\.\d+$/;
			const isValid = semverPattern.test(version) || version === "unknown";
			expect(isValid).toBe(true);
		});
	});
});
