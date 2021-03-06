import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
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

  test("can drag the chip", async () => {
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
    const box = screen.getByTestId("chip-box");
    fireEvent.dragStart(box);
    expect(dragStartHandler).toHaveBeenCalled;
  });

  test("can click the chip", async () => {
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
    const chip = screen.getByText("Region 2: Signed");
    expect(chip).toBeVisible;

    const box = screen.getByTestId("chip-box");
    fireEvent.click(box);
    expect(chip).toBeVisible;
  });

  test("can delete chip", async () => {
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

    // show dialog
    const button = screen.getByTestId("delete-region");
    fireEvent.click(button);
    await waitFor(() => {
      const alertTitle = screen.findByText(
        "Do you want to remove this signature?"
      );
      expect(alertTitle).toBeVisible;
    });

    // delete the chip
    const agreeButton = screen.getByText("Agree");
    expect(agreeButton).toBeVisible;
    fireEvent.click(agreeButton);
    await waitFor(() => {
      expect(button).not.toBeVisible;
    });
  });

  test("can close the dialog", async () => {
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

    // show dialog
    const button = screen.getByTestId("delete-region");
    fireEvent.click(button);
    await waitFor(() => {
      const alertTitle = screen.findByText(
        "Do you want to remove this signature?"
      );
      expect(alertTitle).toBeVisible;
    });

    // close dialog
    const disagreeButton = screen.getByText("Disagree");
    fireEvent.click(disagreeButton);
    await waitFor(() => {
      const alertTitle = screen.findByText(
        "Do you want to remove this signature?"
      );
      expect(alertTitle).not.toBeVisible;
    });
  });
});
