import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import AlertDialog from "./AlertDialog";

describe("AlertDialog", () => {
  let onAgreeHandler: jest.Mock;
  let onDisagreeHandler: jest.Mock;
  let isOpen: boolean;
  let title: string;
  let content: string;

  beforeEach(() => {
    onAgreeHandler = jest.fn();
    onDisagreeHandler = jest.fn();
    isOpen = true;
    title = "test-title";
    content = "test-content";
    render(
      <AlertDialog
        isOpen={isOpen}
        title={title}
        content={content}
        onAgree={onAgreeHandler}
        onDisagree={onDisagreeHandler}
      />
    );
  });

  test("show display title and content", () => {
    const title = screen.getByText("test-title");
    const content = screen.getByText("test-content");
    expect(title).toBeVisible;
    expect(content).toBeVisible;
  });

  test("show handler disagree option", async () => {
    const button = screen.getByText("Disagree");
    expect(button).toBeVisible;
    await act(async () => {
      fireEvent.click(button);
    });
    expect(onDisagreeHandler).toBeCalledTimes(1);
  });

  test("show handler agree option", async () => {
    const button = screen.getByText("Agree");
    expect(button).toBeVisible;
    await act(async () => {
      fireEvent.click(button);
    });
    expect(onAgreeHandler).toBeCalledTimes(1);
  });
});
