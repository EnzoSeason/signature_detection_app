import React from "react";

export interface SignatureRectProps {
  image_size: [number, number];
  box: [number, number, number, number];
  clientWidth: number;
  clientHeight: number;
  clickHandler: () => void;
  className?: string;
}

export default function SignatureRect({
  image_size,
  box,
  clientWidth,
  clientHeight,
  clickHandler,
  className,
}: SignatureRectProps) {
  return (
    <rect
      className={className}
      onClick={clickHandler}
      x={(box[0] * clientWidth) / image_size[0]}
      y={(box[1] * clientHeight) / image_size[1]}
      width={(box[2] * clientWidth) / image_size[0]}
      height={(box[3] * clientHeight) / image_size[1]}
    />
  );
}
