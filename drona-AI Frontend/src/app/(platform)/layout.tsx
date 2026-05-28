import { ReactNode } from "react";
import PlatformShell from "@/components/platform/PlatformShell";

import { NotificationProvider } from "@/context/NotificationContext";
import NotificationPopup from "@/components/platform/NotificationPopup";
import AchievementPopup from "@/components/platform/AchievementPopup";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <PlatformShell>
        {children}
        <NotificationPopup />
        <AchievementPopup />
      </PlatformShell>
    </NotificationProvider>
  );
}
