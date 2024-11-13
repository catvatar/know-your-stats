import React from "react";
import UserBar from "./UserBar";

export default function KnowYourStatsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserBar />
      <div className="min-h-screen bg-gray-900 p-8 text-white">
        <div className="mx-auto w-full max-w-md rounded border border-gray-700 bg-gray-900 p-4 text-white shadow-md">
          {children}
        </div>
      </div>
    </>
  );
}
