import { describe, it, expect } from "vitest";
import { extractNumbers } from "./extract";

describe("extractNumbers", () => {
  it("reads Hindi number words for hours and rupees", () => {
    expect(extractNumbers("आठ घंटे लगे और सामान लगभग तीन सौ रुपये का आया")).toEqual({ materials: 300, hours: 8 });
  });
  it("reads digits and ₹", () => {
    expect(extractNumbers("₹450 ka saman, 6 ghante lage")).toEqual({ materials: 450, hours: 6 });
  });
  it("handles compound numbers like एक सौ पचास", () => {
    expect(extractNumbers("चार घंटे लगे, एक सौ पचास रुपये का सामान")).toEqual({ materials: 150, hours: 4 });
  });
  it("returns null when nothing is said", () => {
    expect(extractNumbers("ये सुंदर दुपट्टा है")).toEqual({ materials: null, hours: null });
  });
});
