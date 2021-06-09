import {
  Box,
  Card,
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useLayoutEffect, useRef, useState } from "react";
import SignatureCanvas from "./SignatureCanvas";
import { CARD_MIN_HEIGHT } from "./SignatureLoader";
import SignatureRect from "./SignatureRect";
import useSignatureDetectionStore, { Region } from "./store";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    minHeight: CARD_MIN_HEIGHT,
  },
  imageContainer: {
    position: "relative",
    display: "inline-grid",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  svg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 1,
    zIndex: 2,
  },
  svgCanvas: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 1,
    zIndex: 3,
  },
  signedBox: {
    stroke: theme.palette.secondary.main,
    fill: theme.palette.secondary.main,
    cursor: "pointer",
  },
  notSignedBox: {
    stroke: theme.palette.primary.main,
    fill: theme.palette.primary.main,
    cursor: "pointer",
  },
  selectedBox: {
    strokeWidth: 5,
    fillOpacity: 0.5,
  },
  notSelectedBox: {
    strokeWidth: 1,
    fillOpacity: 0.3,
  },
}));

export default function DetectionImageCard() {
  const classes = useStyles();
  const svgRef = useRef<SVGSVGElement>(null);
  const imageFile = useSignatureDetectionStore((state) => state.imageFile);
  const isDetecting = useSignatureDetectionStore((state) => state.isDetecting);
  const detectionResult = useSignatureDetectionStore(
    (state) => state.detectionResult
  );
  const selectedRegion = useSignatureDetectionStore(
    (state) => state.selectedRegion
  );
  const setSelectedRegion = useSignatureDetectionStore(
    (state) => state.setSelectedRegion
  );
  const isCanvasOpen = useSignatureDetectionStore(
    (state) => state.isCanvasOpen
  );
  const [svgSize, setSvgSize] = useState([1, 1]);

  // update the size of image and SignatureRect
  // when the window size is changed.
  useLayoutEffect(() => {
    function updateSize() {
      if (svgRef?.current) {
        setSvgSize([svgRef.current.clientWidth, svgRef.current.clientHeight]);
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <>
      {isDetecting ? <LinearProgress /> : null}
      <Card className={classes.card}>
        {imageFile ? (
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              src={URL.createObjectURL(imageFile)}
              alt="uploaded-file"
            />
            <svg
              ref={svgRef}
              className={classes.svg}
              preserveAspectRatio="none"
            >
              {detectionResult?.regions?.length &&
              detectionResult?.image_size &&
              svgRef?.current?.clientWidth &&
              svgRef?.current?.clientHeight ? (
                detectionResult.regions.map((region: Region) => {
                  const signedClass = region.signed
                    ? classes.signedBox
                    : classes.notSignedBox;
                  const selectedClass =
                    selectedRegion?.id && selectedRegion.id === region.id
                      ? classes.selectedBox
                      : classes.notSelectedBox;
                  return (
                    <SignatureRect
                      key={region.id}
                      data-testid={region.id}
                      className={`${signedClass} ${selectedClass}`}
                      image_size={detectionResult.image_size}
                      box={region.box}
                      clientWidth={svgRef!.current!.clientWidth}
                      clientHeight={svgRef!.current!.clientHeight}
                      clickHandler={() => setSelectedRegion(region)}
                    />
                  );
                })
              ) : (
                <rect
                  width="100%"
                  height="100%"
                  fill="rgba(0, 0, 0, 0.5)"
                ></rect>
              )}
            </svg>
            {detectionResult && isCanvasOpen ? <SignatureCanvas /> : null}
          </div>
        ) : (
          <Box
            component="div"
            className={classes.card}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h5" color="textSecondary">
              An image (JPEG or PNG)
            </Typography>
          </Box>
        )}
      </Card>
    </>
  );
}
