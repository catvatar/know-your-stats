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
        document.cookie = `stopwatch_session=${JSON.stringify(data.user)}; path=/`; // Set session cookie
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
      document.cookie =
        "stopwatch_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Delete session cookie
      localStorage.removeItem("user");
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function register(username: string, password: string, dailyCode: string) {
  return fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: {
      "user-agent": "vscode-restclient",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      dailyCode: dailyCode,
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}
