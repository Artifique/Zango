"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Decision = "APPROUVÉE" | "REJETÉE" | "ENVOYÉE";

interface UploadedCapture {
  fileName: string;
  previewUrl: string;
}

interface WorkflowControllerValue {
  uploadedByTx: Record<string, UploadedCapture>;
  requestedByTx: Record<string, boolean>;
  decisionsByTx: Record<string, Decision>;
  uploadCapture: (txId: string, file: File) => void;
  requestConfirmation: (txId: string) => void;
  setDecision: (txId: string, decision: Decision) => void;
}

const WorkflowControllerContext = createContext<WorkflowControllerValue | null>(null);

export function WorkflowControllerProvider({ children }: { children: React.ReactNode }) {
  const [uploadedByTx, setUploadedByTx] = useState<Record<string, UploadedCapture>>({});
  const [requestedByTx, setRequestedByTx] = useState<Record<string, boolean>>({});
  const [decisionsByTx, setDecisionsByTx] = useState<Record<string, Decision>>({});

  const uploadCapture = (txId: string, file: File) => {
    setUploadedByTx((prev) => {
      if (prev[txId]?.previewUrl) {
        URL.revokeObjectURL(prev[txId].previewUrl);
      }
      return {
        ...prev,
        [txId]: {
          fileName: file.name,
          previewUrl: URL.createObjectURL(file),
        },
      };
    });
  };

  const requestConfirmation = (txId: string) => {
    setRequestedByTx((prev) => ({ ...prev, [txId]: true }));
  };

  const setDecision = (txId: string, decision: Decision) => {
    setDecisionsByTx((prev) => ({ ...prev, [txId]: decision }));
  };

  const value = useMemo(
    () => ({
      uploadedByTx,
      requestedByTx,
      decisionsByTx,
      uploadCapture,
      requestConfirmation,
      setDecision,
    }),
    [uploadedByTx, requestedByTx, decisionsByTx],
  );

  return <WorkflowControllerContext.Provider value={value}>{children}</WorkflowControllerContext.Provider>;
}

export function useWorkflowController() {
  const context = useContext(WorkflowControllerContext);
  if (!context) {
    throw new Error("useWorkflowController must be used inside WorkflowControllerProvider");
  }
  return context;
}
