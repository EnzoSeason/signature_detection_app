import React from "react";
import { render, screen } from "@testing-library/react";
import DetectionImageCard from "./DetectionImageCard";

describe("DetectImageCard", () => {
  global.URL.createObjectURL = jest.fn();

  test("should show hint when there is no image", () => {
    render(<DetectionImageCard />);
    const word = screen.getByText("An image (JPEG or PNG)");
    expect(word).toBeVisible;
  });
});
