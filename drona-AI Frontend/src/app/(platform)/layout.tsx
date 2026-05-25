import React from "react";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="platform-layout min-h-screen bg-background">
      {children}
    </div>
  );
}
