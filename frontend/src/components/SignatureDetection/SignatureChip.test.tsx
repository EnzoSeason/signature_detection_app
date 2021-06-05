import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import SignatureChip from "./SignatureChip";
import useSignatureDetectionStore, { DetectionResult, Region } from "./store";

describe("SignatureChip", () => {
  let notSignedRegion: Region;
  let signedRegion: Region;
  let dragStartHandler: (region: Region) => void;

  beforeEach(() => {
    notSignedRegion = {
      id: 1,
      signed: false,
      box: [0, 0, 0, 0],
    } as Region;

    signedRegion = {
      id: 2,
      signed: true,
      box: [10, 10, 10, 10],
    } as Region;

    dragStartHandler = (region: Region) => {};
  });

  test("should show whether the region is signed", () => {
    renderHook(() => {
      const setDetectionResult = useSignatureDetectionStore(
        (state) => state.setDetectionResult
      );
      const result: DetectionResult = {
        image_size: [10, 10],
        regions: [signedRegion],
      };
      setDetectionResult(result);
    });

    render(
      <SignatureChip
        region={signedRegion}
        signed={true}
        dragStartHandler={dragStartHandler}
      />
    );

    const text = screen.getByText("Region 2: Signed");
    expect(text).toBeVisible;
  });

  test("should remove region dialog", async () => {
    renderHook(() => {
      const setDetectionResult = useSignatureDetectionStore(
        (state) => state.setDetectionResult
      );
      const result: DetectionResult = {
        image_size: [10, 10],
        regions: [notSignedRegion],
      };
      setDetectionResult(result);
    });
    render(
      <SignatureChip
        region={notSignedRegion}
        signed={false}
        dragStartHandler={dragStartHandler}
      />
    );

    const button = screen.getByTestId("delete-region");
    await act(async () => {
      fireEvent.click(button);
    });
    const alertTitle = screen.findByText(
      "Do you want to remove this signature?"
    );
    expect(alertTitle).toBeVisible;
  });
});
