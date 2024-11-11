import React from "react";

export default function KnowYourStatsWrapper({ children } : { children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold underline mb-8 text-center">
        <a href="/">Know your stats</a>
      </h1>
      <div className="p-4 bg-gray-900 text-white rounded shadow-md border border-gray-700 w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}