import React from "react";
import { render, screen } from "@testing-library/react";
import Copyright from "./Copyright";

test("renders Copyright", () => {
  render(<Copyright />);
  const copyright = screen.getByText(/Copyright/i);
  expect(copyright).toBeVisible;
});
