import React from "react";

export default function KnowYourStatsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="mb-8 text-center text-4xl font-bold underline">
        <a href="/">Know your stats</a>
      </h1>
      <div className="mx-auto w-full max-w-md rounded border border-gray-700 bg-gray-900 p-4 text-white shadow-md">
        {children}
      </div>
    </div>
  );
}
