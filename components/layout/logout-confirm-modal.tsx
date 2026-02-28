"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type LogoutConfirmModalProps = {
  open: boolean;
  onNo: () => void;
  onYes: () => void;
};

export function LogoutConfirmModal({ open, onNo, onYes }: LogoutConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => (!v ? onNo() : null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onNo}>No</AlertDialogCancel>
          <AlertDialogAction onClick={onYes}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}