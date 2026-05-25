import React from "react";

export default function MainLearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-learning-env">
      {children}
    </div>
  );
}
