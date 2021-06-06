import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useSignatureDetectionStore, { DetectionResult, Region } from "./store";
import { fireEvent, render, screen } from "@testing-library/react";
import DetectionDownload from "./DetectionDownload";

describe("DetectionDownload", () => {
  test("show whether the image is signed", () => {
    render(<DetectionDownload />);
    const result = screen.getByText("FALSE");
    expect(result).toBeVisible;
  });

  test("download result", () => {
    renderHook(() => {
      const setDetectionResult = useSignatureDetectionStore(
        (state) => state.setDetectionResult
      );
      const setImageFile = useSignatureDetectionStore(
        (state) => state.setImageFile
      );
      const region_signed = {
        id: 1,
        signed: true,
        box: [1, 1, 1, 1],
      } as Region;
      const result: DetectionResult = {
        image_size: [10, 10],
        regions: [region_signed],
      };
      const file = new File(["file"], "image.jpeg", { type: "image/jpeg" });
      setImageFile(file);
      setDetectionResult(result);
    });

    render(<DetectionDownload />);
    const link = screen.getByText("download result");
    expect(link).toHaveAttribute("download", "image-results.json")
  });
});
