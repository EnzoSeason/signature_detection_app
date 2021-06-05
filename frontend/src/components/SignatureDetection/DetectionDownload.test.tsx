import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useSignatureDetectionStore, { DetectionResult, Region } from "./store";
import { render, screen } from "@testing-library/react";
import DetectionDownload from "./DetectionDownload";

describe("DetectionDownload", () => {
  beforeEach(() => {
    renderHook(() => {
      const setDetectionResult = useSignatureDetectionStore(
        (state) => state.setDetectionResult
      );
      const region_signed = {
        id: 1,
        signed: true,
        box: [1, 1, 1, 1],
      } as Region;
      const region_not_signed = {
        id: 2,
        signed: false,
        box: [10, 10, 10, 10],
      } as Region;
      const result: DetectionResult = {
        image_size: [10, 10],
        regions: [region_signed, region_not_signed],
      };
      setDetectionResult(result);
    });
  });

  test("show whether the image is signed", () => {
    render(<DetectionDownload />);
    const result = screen.getByText("TRUE");
    expect(result).toBeVisible;
  });
});
