import { describe, expect, it } from "vitest";
import { AppConfigSchema } from "../utils/configManager";

describe("configManager", () => {
	describe("AppConfigSchema", () => {
		it("should validate valid config", () => {
			const validConfig = {
				name: "test-config",
				description: "Test configuration",
			};

			const result = AppConfigSchema.safeParse(validConfig);
			expect(result.success).toBe(true);
		});

		it("should accept config without description", () => {
			const validConfig = {
				name: "test-config",
			};

			const result = AppConfigSchema.safeParse(validConfig);
			expect(result.success).toBe(true);
		});

		it("should reject config without name", () => {
			const invalidConfig = {
				description: "Test",
			};

			const result = AppConfigSchema.safeParse(invalidConfig);
			expect(result.success).toBe(false);
		});

		it("should reject config with empty name", () => {
			const invalidConfig = {
				name: "",
			};

			const result = AppConfigSchema.safeParse(invalidConfig);
			expect(result.success).toBe(false);
		});

		it("should reject config with name too long", () => {
			const invalidConfig = {
				name: "a".repeat(51),
			};

			const result = AppConfigSchema.safeParse(invalidConfig);
			expect(result.success).toBe(false);
		});
	});
});
