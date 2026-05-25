import React from "react";

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="career-env">
      {children}
    </div>
  );
}
