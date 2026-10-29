import { describe, expect, it } from "vitest";
import { OPENING, openingMilestones } from "./opening-timeline";

describe("book opening order", () => {
  it("holds for 1.2 seconds before a 4.5 second sideways turn", () => {
    expect(OPENING.hold).toBe(1200);
    expect(OPENING.swing).toBe(4500);
    expect(openingMilestones().flashAt).toBe(5700);
  });
  it("finishes the quick flash before showing the quote", () => {
    const t = openingMilestones();
    expect(t.quoteAt - t.flashAt).toBe(1000);
    expect(t.quoteAt).toBeGreaterThan(t.flashAt);
    expect(t.welcomeAt - t.quoteAt).toBe(5200);
  });
});