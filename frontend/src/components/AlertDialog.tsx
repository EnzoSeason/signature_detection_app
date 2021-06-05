import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  content: string;
  onAgree: () => void;
  onDisagree: () => void;
}

export default function AlertDialog({
  isOpen,
  title,
  content,
  onAgree,
  onDisagree,
}: AlertDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDisagree} color="primary">
          Disagree
        </Button>
        <Button onClick={onAgree} color="secondary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
