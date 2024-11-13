import React from "react";
import H1 from "../utils/components/H1";
import Input from "../utils/components/Input";
import Button from "../utils/components/Button";

export default function LoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    console.log("payload", { email: username, password });
    fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email: username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
        <Button onClick={handleLogin} type="submit">
          Sign in
        </Button>
      </section>
    </>
  );
}
