import {
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Alert } from "@material-ui/lab";
import axios, { AxiosResponse, AxiosError } from "axios";
import useSignatureDetectionStore from "./store";
import DetectionImageCard from "./DetectionImageCard";

export const CARD_MIN_HEIGHT = 800;

export default function SignatureLoader() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const setImageFile = useSignatureDetectionStore(
    (state) => state.setImageFile
  );
  const setIsDetecting = useSignatureDetectionStore(
    (state) => state.setIsDetecting
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

  const uploadFileHandler = (event: any) => {
    let file: any;
    // get file
    if (event?.target?.files && event.target.files.length) {
      file = event.target.files[0];
    } else {
      return;
    }
    // check type
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setErrorMessage("Your image must be in JPEG or PNG format.");
      return;
    }

    // init states
    setIsDetecting(true);
    setImageFile(file);
    setDetectionResult(null);
    setSelectedRegion(null);
    setIsCanvasOpen(false);
    // send file to backend
    const data = new FormData();
    data.append("file", file, file.name);
    axios
      .post(process.env.REACT_APP_API_URL as string, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res: AxiosResponse) => {
        setIsDetecting(false);
        setDetectionResult(res.data);
      })
      .catch((err: AxiosError) => {
        setIsDetecting(false);
        if (err?.response?.data?.detail) {
          setErrorMessage(err.response.data.detail);
        } else {
          setErrorMessage("API is not available.");
        }
      });
  };

  return (
    <Container maxWidth="lg">
      <Box component="div"></Box>
      <Box component="div" mt={3}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="subtitle2" color="textSecondary">
              Upload an image (JPEG or PNG)
            </Typography>
          </Grid>
          <Grid item>
            <input
              id="button-file"
              data-testid="button-file"
              type="file"
              accept="image/*"
              onChange={uploadFileHandler}
              hidden
            />
            <label htmlFor="button-file">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CloudUploadIcon />}
                component="span"
              >
                Upload image
              </Button>
            </label>
          </Grid>
        </Grid>
      </Box>
      <Box component="div" mt={3}>
        <Grid container direction="row" spacing={5}>
          <Grid item sm={12} lg={6}>
            <DetectionImageCard />
          </Grid>
          <Grid item sm={12} lg={6}>
            {/* <DetectionResultCard /> */}
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={errorMessage !== ""}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
      >
        <Alert severity="error" onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
