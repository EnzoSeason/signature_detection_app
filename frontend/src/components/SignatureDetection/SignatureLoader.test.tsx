import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import SignatureLoader from "./SignatureLoader";

jest.mock("axios");
jest.mock("./DetectionImageCard", () => ({
  __esModule: true,
  default: () => {
    return null;
  },
}));
jest.mock("./DetectionResultCard", () => ({
  __esModule: true,
  default: () => {
    return null;
  },
}));

describe("Signature Loader", () => {
  let mockAxiosPost: jest.Mock;

  beforeAll(() => {
    mockAxiosPost = axios.post as jest.Mock;
  });

  test("should upload an image", async () => {
    let file = new File(["file"], "image.jpeg", { type: "image/jpeg" });
    mockAxiosPost.mockResolvedValueOnce({
      data: {
        image_size: [1190, 1683],
        regions: [{ id: 1, signed: true, box: [738, 1028, 217, 58] }],
      },
    });

    render(<SignatureLoader />);
    const button = screen.getByText("Upload image");
    expect(button).toBeVisible;
    const uploader = screen.getByTestId("button-file");
    await act(async () => {
      fireEvent.click(button);
      fireEvent.change(uploader, {
        target: { files: [file] },
      });
    });
    expect(mockAxiosPost).toHaveBeenCalled();
  });

  test("should not upload when there is no file", async () => {
    render(<SignatureLoader />);

    const button = screen.getByText("Upload image");
    expect(button).toBeVisible;
    const uploader = screen.getByTestId("button-file");
    await act(async () => {
      fireEvent.click(button);
      fireEvent.change(uploader);
    });
    expect(mockAxiosPost).not.toHaveBeenCalled();
  });

  test("should not upload other files", async () => {
    let file = new File(["file"], "file.txt");
    render(<SignatureLoader />);

    const button = screen.getByText("Upload image");
    expect(button).toBeVisible;
    const uploader = screen.getByTestId("button-file");
    await act(async () => {
      fireEvent.click(button);
      fireEvent.change(uploader, {
        target: { files: [file] },
      });
    });
    expect(mockAxiosPost).not.toHaveBeenCalled();
  });

  test("should handler api response error", async () => {
    let file = new File(["file"], "image.jpeg", { type: "image/jpeg" });
    mockAxiosPost.mockRejectedValueOnce({
      response: { data: { detail: "error" } },
    });
    render(<SignatureLoader />);

    const button = screen.getByText("Upload image");
    expect(button).toBeVisible;
    const uploader = screen.getByTestId("button-file");
    await act(async () => {
      fireEvent.click(button);
      fireEvent.change(uploader, {
        target: { files: [file] },
      });
    });
    expect(mockAxiosPost).toHaveBeenCalled();

    const errorMessage = screen.getByText("error");
    expect(errorMessage).toBeVisible;
  });

  test("should handler other response errors", async () => {
    let file = new File(["file"], "image.jpeg", { type: "image/jpeg" });
    mockAxiosPost.mockRejectedValueOnce({
      response: {},
    });
    render(<SignatureLoader />);

    const button = screen.getByText("Upload image");
    expect(button).toBeVisible;
    const uploader = screen.getByTestId("button-file");
    await act(async () => {
      fireEvent.click(button);
      fireEvent.change(uploader, {
        target: { files: [file] },
      });
    });
    expect(mockAxiosPost).toHaveBeenCalled();

    const errorMessage = screen.getByText("API is not available.");
    expect(errorMessage).toBeVisible;
  });
});
