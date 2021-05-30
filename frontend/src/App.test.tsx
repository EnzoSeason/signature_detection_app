import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders title", () => {
  render(<App />);
  const title = screen.getByText("Signature detection");
  expect(title).toBeVisible;
});
