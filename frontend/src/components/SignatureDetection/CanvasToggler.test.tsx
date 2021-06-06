import { render, screen, act, fireEvent } from "@testing-library/react";
import React from "react";
import CanvasToggler from "./CanvasToggler";

describe("ToggleCanvas", () => {
  test("toggle", () => {
    render(<CanvasToggler />);

    const openHints = screen.getByText(
      "Open the canvas and select a signature"
    );
    expect(openHints).toBeVisible;

    const button = screen.getByRole("checkbox");
    fireEvent.click(button);
    fireEvent.change(button, { target: { checked: "" } });

    const closeWord = screen.getByText("Close the canvas");
    expect(closeWord).toBeVisible;
  });
});
