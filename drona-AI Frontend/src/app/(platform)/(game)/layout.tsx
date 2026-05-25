import React from "react";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="game-env">
      {children}
    </div>
  );
}
