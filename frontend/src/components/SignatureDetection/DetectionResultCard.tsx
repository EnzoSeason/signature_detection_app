import {
  Box,
  Card,
  Container,
  Divider,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import useSignatureDetectionStore, { Region } from "./store";
import { CARD_MIN_HEIGHT } from "./SignatureLoader";
import DetectionDownload from "./DetectionDownload";
import SignatureChip from "./SignatureChip";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    minHeight: CARD_MIN_HEIGHT,
  },
  chipsGroup: {
    "& > span > *": {
      margin: theme.spacing(0.5),
    },
    minHeight: CARD_MIN_HEIGHT / 4,
  },
}));

export default function DetectionResultCard() {
  const classes = useStyles();
  const detectionResult = useSignatureDetectionStore(
    (state) => state.detectionResult
  );
  const setDetectionResult = useSignatureDetectionStore(
    (state) => state.setDetectionResult
  );
  const [draggedRegion, setDraggedRegion] = useState<Region | null>(null);

  const dragStartHandler = (region: Region) => {
    setDraggedRegion(region);
  };

  const dropHandler = (
    event: React.DragEvent<HTMLElement>,
    isSignedZone: boolean
  ) => {
    event.preventDefault();
    if (
      detectionResult &&
      draggedRegion &&
      draggedRegion.signed !== isSignedZone
    ) {
      const newRegions = detectionResult.regions.map((region) =>
        region.id === draggedRegion.id
          ? { ...region, signed: !region.signed }
          : region
      );
      const newDectectionResult = { ...detectionResult, regions: newRegions };
      setDetectionResult(newDectectionResult);
    }
    setDraggedRegion(null);
  };

  return (
    <Card className={classes.card}>
      <Container maxWidth="xl">
        <Box component="div" mt={3}></Box>
        <DetectionDownload />
        <Box component="div" mt={3}></Box>
        {/* <ToggleCanvas /> */}
        <Divider />
        <Box
          component="div"
          mt={1}
          data-testid="true-zone"
          className={classes.chipsGroup}
          onDrop={(event) => dropHandler(event, true)}
          onDragOver={(event) => event.preventDefault()}
        >
          <Typography variant="h6">Signed</Typography>
          <Box component="div" mt={1}></Box>
          {detectionResult
            ? detectionResult.regions.map((region: Region) => (
                <SignatureChip
                  key={region.id}
                  region={region}
                  signed={true}
                  dragStartHandler={dragStartHandler}
                />
              ))
            : null}
        </Box>
        <Divider />
        <Box
          component="div"
          data-testid="false-zone"
          mt={1}
          className={classes.chipsGroup}
          onDrop={(event) => dropHandler(event, false)}
          onDragOver={(event) => event.preventDefault()}
        >
          <Typography variant="h6">Not signed</Typography>
          <Box component="div" mt={1}></Box>
          {detectionResult
            ? detectionResult.regions.map((region: Region) => (
                <SignatureChip
                  key={region.id}
                  region={region}
                  signed={false}
                  dragStartHandler={dragStartHandler}
                />
              ))
            : null}
        </Box>
      </Container>
    </Card>
  );
}
