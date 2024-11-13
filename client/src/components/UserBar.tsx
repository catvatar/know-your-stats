import React, { useEffect, useState } from "react";
import Button from "../utils/components/Button";
import { logout } from "../utils/apis/auth_api";

export default function UserBar() {
  const locaton = window.location.pathname;
  const path: string[] = locaton.split("/");
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Parse user from local storage

  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <span className="text-2xl font-bold">
        <a href="/">Know your stats</a>
        {path.map((p) => {
          return p === "" ? "" : " / " + p;
        })}
      </span>
      <span className="text-xl">
        {user.username ? (
          <>
            {user.username}{" "}
            <Button
              type="reset"
              onClick={async () => {
                await logout();
                window.location.href = "/";
              }}
            >
              Log out
            </Button>
          </>
        ) : (
          <Button
            type="submit"
            onClick={() => (window.location.href = "/login")}
          >
            Log in
          </Button>
        )}
      </span>
    </div>
  );
}
