import React from "react";

export default function H2({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <h2 className="text-3xl font-bold">{children}</h2>;
}
