// src/utils/api.js
export async function apiFetch(url, opts = {}) {
  const token = localStorage.getItem("accessToken");
  const options = {
    ...opts,
    credentials: "include",
    headers: {
      ...(opts.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  let res = null;

  try {
    res = await fetch(url, options);

    if (!res.ok) {
      const refresh = await fetch("/refresh", {
        method: "GET",
        credentials: "include",
      });
      if (refresh.ok) {
        const { accessToken } = await refresh.json();
        localStorage.setItem("accessToken", accessToken);
        options.headers.Authorization = `Bearer ${accessToken}`;
        res = await fetch(url, options);
      }
    }

    return res;
  } catch (err) {
    // Return a fake Response object so callers can check .ok
    return {
      ok: false,
      status: 0,
      statusText: err.message || "Network error",
      json: async () => ({ error: err.message }),
    };
  }
}
