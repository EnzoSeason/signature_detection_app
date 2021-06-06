import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import useSignatureDetectionStore, { DetectionResult, Region } from "./store";
import DetectionResultCard from "./DetectionResultCard";

describe("DetectionResultCard", () => {
  test("should init when there is no data", () => {
    render(<DetectionResultCard />);
    const word = screen.getByText("Signed");
    expect(word).toBeVisible;
  });
  test("should drag and drop a chip", async () => {
    renderHook(() => {
      const setImageFile = useSignatureDetectionStore(
        (state) => state.setImageFile
      );
      const file = new File(["file"], "image.jpeg", { type: "image/jpeg" });
      setImageFile(file);
    });
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
    render(<DetectionResultCard />);

    // drag signed chip to false zone
    const signed_chip = screen.getByText("Region 1: Signed");
    const falseZone = screen.getByTestId("false-zone");
    expect(signed_chip).toBeVisible;

    await waitFor(async () => {
      fireEvent.dragStart(signed_chip, { clientY: 0 });
    });
    await waitFor(async () => {
      fireEvent.drag(signed_chip, { clientY: 300 });
    });
    await waitFor(async () => {
      fireEvent.drop(falseZone);
    });

    const new_not_signed_chip = screen.getByText("Region 1: Not Signed");
    expect(new_not_signed_chip).toBeVisible;

    // drag unsigned chip to true zone
    const not_signed_chip = screen.getByText("Region 2: Not Signed");
    const trueZone = screen.getByTestId("true-zone");
    expect(not_signed_chip).toBeVisible;
    await waitFor(async () => {
      fireEvent.dragStart(not_signed_chip, { clientY: 0 });
    });
    await waitFor(async () => {
      fireEvent.drag(not_signed_chip, { clientY: -300 });
    });
    await waitFor(async () => {
      fireEvent.drop(trueZone);
    });

    const new_signed_chip = screen.getByText("Region 2: Signed");
    expect(new_signed_chip).toBeVisible;
  });
});
