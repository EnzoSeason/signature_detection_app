import AlertDialog from "../AlertDialog";
import { makeStyles, Theme } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import useSignatureDetectionStore, { Region } from "./store";

export const SELECT_INTERVAL = 100;

const useStyles = makeStyles((theme: Theme) => ({
  mask: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 1,
    zIndex: 3,
  },
  canvas: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 1,
    zIndex: 4,
  },
}));

export default function SignatureCanvas() {
  const classes = useStyles();
  const maskRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [openDiaglog, setOpenDiaglog] = useState<boolean>(false);
  const [box, setBox] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);
  const detectionResult = useSignatureDetectionStore(
    (state) => state.detectionResult
  );
  const setDetectionResult = useSignatureDetectionStore(
    (state) => state.setDetectionResult
  );
  const setSelectedRegion = useSignatureDetectionStore(
    (state) => state.setSelectedRegion
  );
  const setIsCanvasOpen = useSignatureDetectionStore(
    (state) => state.setIsCanvasOpen
  );

  useEffect(() => {
    if (maskRef.current) {
      const context = maskRef.current.getContext("2d");
      // draw the mask
      context!.fillStyle = "rgba(135, 149, 150, 0.25)";
      context!.fillRect(0, 0, context!.canvas.width, context!.canvas.height);
      const gradient = context!.createLinearGradient(
        0,
        0,
        context!.canvas.width,
        0
      );
      gradient.addColorStop(0, "magenta");
      gradient.addColorStop(0.75, "blue");
      context!.strokeStyle = gradient;
      context!.strokeRect(0, 0, context!.canvas.width, context!.canvas.height);
    }
  }, []);

  const mouseDownHandler = (event: any) => {
    if (canvasRef.current) {
      // start time
      const startTime = Date.now();
      // clear the rect
      const context = canvasRef!.current.getContext("2d");
      context!.clearRect(0, 0, context!.canvas.width, context!.canvas.height);
      // set the offsetX and offsetY
      const rect = canvasRef!.current.getBoundingClientRect();
      const offsetX =
        (event.clientX - rect.left) * (canvasRef!.current.width / rect.width);
      const offsetY =
        (event.clientY - rect.top) * (canvasRef!.current.height / rect.height);

      const move = (event: any) => {
        if (canvasRef.current) {
          const rect = canvasRef!.current.getBoundingClientRect();
          const currentX =
            (event.clientX - rect.left) *
            (canvasRef!.current.width / rect.width);
          const currentY =
            (event.clientY - rect.top) *
            (canvasRef!.current.height / rect.height);

          const currentW = currentX - offsetX > 0 ? currentX - offsetX : 0;
          const currentH = currentY - offsetY > 0 ? currentY - offsetY : 0;

          const context = canvasRef!.current.getContext("2d");
          context!.clearRect(
            0,
            0,
            context!.canvas.width,
            context!.canvas.height
          );
          context!.fillStyle = "rgba(249,218,144, 0.5)";
          context!.fillRect(offsetX, offsetY, currentW, currentH);
        }
      };
      // remove listeners when mouseUp
      const up = (event: any) => {
        if (
          canvasRef.current &&
          detectionResult &&
          detectionResult.image_size
        ) {
          canvasRef!.current.removeEventListener("mousemove", move);
          canvasRef!.current.removeEventListener("mouseup", up);

          const interval = Date.now() - startTime;
          if (interval > SELECT_INTERVAL) {
            const rect = canvasRef!.current.getBoundingClientRect();
            const currentX =
              (event.clientX - rect.left) *
              (canvasRef!.current.width / rect.width);
            const currentY =
              (event.clientY - rect.top) *
              (canvasRef!.current.height / rect.height);
            const currentW = currentX - offsetX > 0 ? currentX - offsetX : 0;
            const currentH = currentY - offsetY > 0 ? currentY - offsetY : 0;
            setBox([
              Math.floor(
                (offsetX * detectionResult!.image_size[0]) /
                  canvasRef!.current.width
              ),
              Math.floor(
                (offsetY * detectionResult!.image_size[1]) /
                  canvasRef!.current.height
              ),
              Math.floor(
                (currentW * detectionResult!.image_size[0]) /
                  canvasRef!.current.width
              ),
              Math.floor(
                (currentH * detectionResult!.image_size[1]) /
                  canvasRef!.current.height
              ),
            ]);
            setOpenDiaglog(true);
          }
        }
      };
      // add listeners: mousemove and mouseup
      canvasRef!.current.addEventListener("mousemove", move);
      canvasRef!.current.addEventListener("mouseup", up);
    }
  };

  const addRegionHanlder = () => {
    if (detectionResult) {
      const regionsIds = detectionResult.regions.map((region) => region.id);
      const newRegion: Region = {
        id: Math.max(...regionsIds) + 1,
        signed: true,
        box: box,
      };
      const newRegions: Region[] = [...detectionResult.regions, newRegion];
      const newDectectionResult = { ...detectionResult, regions: newRegions };
      setSelectedRegion(newRegion);
      setDetectionResult(newDectectionResult);
      setIsCanvasOpen(false);
    }
    setOpenDiaglog(false);
  };

  return (
    <>
      <canvas className={classes.mask} ref={maskRef} />
      <canvas
        data-testid="canvas"
        className={classes.canvas}
        ref={canvasRef}
        onMouseDown={mouseDownHandler}
      />
      <AlertDialog
        data-testid="alert-dialog"
        isOpen={openDiaglog}
        title={"A signature is selected."}
        content={"Do you want to add this signature?"}
        onAgree={addRegionHanlder}
        onDisagree={() => setOpenDiaglog(false)}
      />
    </>
  );
}
