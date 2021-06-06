import { Box, Grid, Switch, Typography } from "@material-ui/core";
import React from "react";
import useSignatureDetectionStore from "./store";

export default function CanvasToggler() {
  const isCanvasOpen = useSignatureDetectionStore(
    (state) => state.isCanvasOpen
  );
  const setIsCanvasOpen = useSignatureDetectionStore(
    (state) => state.setIsCanvasOpen
  );

  const toggleHandler = () => {
    setIsCanvasOpen(!isCanvasOpen);
  };

  return (
    <Box component="div">
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            {isCanvasOpen
              ? "Close the canvas"
              : "Open the canvas and select a signature"}
          </Typography>
        </Grid>
        <Grid item>
          <Switch
            color="primary"
            inputProps={{ "aria-label": "primary checkbox" }}
            checked={isCanvasOpen}
            onChange={toggleHandler}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
