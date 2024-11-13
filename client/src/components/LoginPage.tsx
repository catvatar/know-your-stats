import React, { useState } from "react";
import H1 from "../utils/components/H1";
import Input from "../utils/components/Input";
import Button from "../utils/components/Button";
import { login } from "../utils/apis/auth_api";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<boolean>(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <H1>Sign in</H1>
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
              setError(res.error);
            }
            res.message == "Login successful"
              ? (window.location.href = "/")
              : setResponse(true);
          }}
          type="submit"
        >
          Sign in
        </Button>
      </section>
      {error && <p className={`text-red-500`}>{error}</p>}
      {response && <p className={`text-red-500`}>Login failed</p>}
    </>
  );
}
