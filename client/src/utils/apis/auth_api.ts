export async function login(username: string, password: string) {
  return fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user in local storage
      }
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function logout() {
  return fetch("http://localhost:3001/api/auth/logout", {
    method: "POST",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.removeItem("user");
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
