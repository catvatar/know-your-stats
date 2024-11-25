import React, { useState } from "react";
import H1 from "../utils/components/H1";
import Input from "../utils/components/Input";
import Button from "../utils/components/Button";
import { register } from "../utils/apis/auth_api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dailyCode, setDailyCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <H1>Register</H1>
      {error && <p className={`pt-2 text-red-500`}>{error}</p>}
      {message && <p className={`pt-2 text-green-500`}>{message}</p>}
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
        <Input
          placeholder="Daily Code"
          value={dailyCode}
          onChange={(e) => setDailyCode(e.target.value)}
        />
        <Button
          onClick={async () => {
            const res = await register(username, password, dailyCode);
            if (res.error) {
              setError(res.error);
              return;
            }
            if (res.message === "User created successfully") {
              setMessage("Registration successful. Redirecting to login...");
              setTimeout(() => {
                window.location.href = "/login";
              }, 2000); // Redirect after 2 seconds
            } else {
              setError("Registration failed");
            }
          }}
          type="submit"
        >
          Register
        </Button>
      </section>
    </>
  );
}