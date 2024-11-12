import React from "react";

export default function H1({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return <h1 className={`text-5xl font-bold ${className}`}>{children}</h1>;
}
