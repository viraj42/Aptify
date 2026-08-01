const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (
  url,
  method = "GET",
  body = null,
  isAuth = false
) => {
  const headers = {
    "Content-Type": "application/json",
    ...(isAuth ? getAuthHeader() : {}),
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    if (response.status === 401 && data?.message !== "Invalid credentials") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined" && window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
};