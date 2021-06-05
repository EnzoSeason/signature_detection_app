import { Box, Chip, makeStyles, Theme } from "@material-ui/core";
import React, { useState } from "react";
import useSignatureDetectionStore, { Region } from "./store";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import AlertDialog from "../AlertDialog";

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    cursor: "pointer",
  },
}));

export interface SignatureChipProps {
  region: Region;
  signed: boolean;
  dragStartHandler: (region: Region) => void;
}
export default function SignatureChip({
  region,
  signed,
  dragStartHandler,
}: SignatureChipProps) {
  const classes = useStyles();
  const selectedRegion = useSignatureDetectionStore(
    (state) => state.selectedRegion
  );
  const setSelectedRegion = useSignatureDetectionStore(
    (state) => state.setSelectedRegion
  );
  const removeRegion = useSignatureDetectionStore(
    (state) => state.removeRegion
  );
  const [openDiaglog, setOpenDiaglog] = useState<boolean>(false);

  const label = region.signed
    ? `Region ${region.id}: Signed`
    : `Region ${region.id}: Not Signed`;
  const color = region.signed ? "secondary" : "primary";
  const icon = region.signed ? <CheckCircleIcon /> : <CancelIcon />;
  const variant =
    selectedRegion?.id && region.id == selectedRegion.id
      ? "default"
      : "outlined";

  const clickHandler = () => {
    if (signed === region.signed) {
      setSelectedRegion(region);
    }
  };

  const removeRegionHandler = () => {
    setOpenDiaglog(false);
    removeRegion(region);
  };

  return (
    <Box
      component="span"
      onClick={clickHandler}
      draggable={signed === region.signed}
      onDragStart={() => dragStartHandler(region)}
    >
      {signed === region.signed ? (
        <Chip
          className={classes.chip}
          label={label}
          color={color}
          icon={icon}
          deleteIcon={<DeleteIcon data-testid="delete-region" />}
          onDelete={() => setOpenDiaglog(true)}
          variant={variant}
        />
      ) : (
        <Chip
          label={`Region ${region.id}: drag here`}
          icon={<DragHandleIcon />}
          deleteIcon={<DeleteIcon data-testid="delete-region" />}
          onDelete={() => {}}
          variant="outlined"
        />
      )}

      <AlertDialog
        data-testid="alert-dialog"
        isOpen={openDiaglog}
        title={"Do you want to remove this signature?"}
        content={"This operation is irreversible."}
        onAgree={removeRegionHandler}
        onDisagree={() => setOpenDiaglog(false)}
      />
    </Box>
  );
}
