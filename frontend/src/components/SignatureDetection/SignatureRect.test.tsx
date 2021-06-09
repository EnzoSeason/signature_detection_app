import { render, screen } from "@testing-library/react";
import React from "react";
import SignatureRect from "./SignatureRect";

describe("SignatureRect", () => {
  test("init", () => {
    const image_size = [100, 100] as [number, number];
    const box = [10, 10, 10, 10] as [number, number, number, number];
    const clientWidth = 50;
    const clientHeight = 50;
    const clickHandler = () => {};

    const { container } = render(
      <svg>
        <SignatureRect
          image_size={image_size}
          box={box}
          clientWidth={clientWidth}
          clientHeight={clientHeight}
          clickHandler={clickHandler}
        />
      </svg>
    );

    const rect = container.querySelector("rect");
    expect(rect).toHaveAttribute("x", "5");
    expect(rect).toHaveAttribute("y", "5");
    expect(rect).toHaveAttribute("width", "5");
    expect(rect).toHaveAttribute("height", "5");
  });
});
