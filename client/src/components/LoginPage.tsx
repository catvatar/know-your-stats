import React, { useState } from "react";
import H1 from "../utils/components/H1";
import Input from "../utils/components/Input";
import Button from "../utils/components/Button";
import { login } from "../utils/apis/auth_api";

export default function LoginPage() {
  const error = new URLSearchParams(window.location.search).get("error");

  const [response, setResponse] = useState<boolean>(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <H1>Sign in</H1>
      {error && <p className={`pt-2 text-red-500`}>{error}</p>}
      <section className="flex flex-col py-4">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          onClick={async () => {
            const res = await login(username, password);
            if (res.error) {
              window.location.href = `/login?error=${res.error}`;
              setResponse(false);
              return;
            }
            if (res.message === "Login successful") {
              localStorage.setItem("user", JSON.stringify(res.user)); // Store user in local storage
              window.location.href = "/";
            } else {
              window.location.href = "/login?error=Login failed";
            }
          }}
          type="submit"
        >
          Sign in
        </Button>
      </section>
    </>
  );
}
