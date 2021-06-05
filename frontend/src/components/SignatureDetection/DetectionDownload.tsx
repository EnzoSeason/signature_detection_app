import {
  Box,
  Button,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import useSignatureDetectionStore, { Region } from "./store";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

const useStyles = makeStyles((theme: Theme) => ({
  downloadLink: {
    color: "inherit",
    "text-decoration": "none",
  },
}));

export default function DetectionDownload() {
  const classes = useStyles();
  const imageFile = useSignatureDetectionStore((state) => state.imageFile);
  const detectionResult = useSignatureDetectionStore(
    (state) => state.detectionResult
  );
  const isImageSigned = detectionResult
    ? detectionResult.regions
        .map((region: Region) => region.signed)
        .reduce((acc: boolean, signed: boolean) => acc || signed, false)
    : false;
  return (
    <Box component="div" mt={1}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="body1" component="p">
            The image is signed ?
            <Box component="span" ml={2}>
              <Typography
                variant="h6"
                component="strong"
                color={isImageSigned ? "secondary" : "primary"}
              >
                {String(isImageSigned).toUpperCase()}
              </Typography>
            </Box>
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            disabled={!imageFile || !detectionResult}
          >
            {imageFile && detectionResult ? (
              <a
                className={classes.downloadLink}
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify(detectionResult)
                )}`}
                download={`${imageFile.name.split(".")[0]}-results.json`}
              >
                download result
              </a>
            ) : (
              <a>download result</a>
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
