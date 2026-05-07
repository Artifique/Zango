"use client";

import { NotificationProvider } from "../lib/notification-context";
import { AuthControllerProvider } from "../controllers/auth-controller";
import { RoleControllerProvider } from "../controllers/role-controller";
import { ThemeControllerProvider } from "../controllers/theme-controller";
import { WorkflowControllerProvider } from "../controllers/workflow-controller";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeControllerProvider>
      <AuthControllerProvider>
        <RoleControllerProvider>
          <WorkflowControllerProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </WorkflowControllerProvider>
        </RoleControllerProvider>
      </AuthControllerProvider>
    </ThemeControllerProvider>
  );
}
