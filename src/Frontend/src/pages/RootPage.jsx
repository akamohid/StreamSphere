// src/pages/RootPage.jsx
import { Outlet, redirect } from "react-router-dom";
import store from "../store";
import { userActions } from "../store/user-slice";
import Header from "../components/UI/Header";
import { apiFetch } from "../utils/api";
import RequireAuth from "../components/Auth/RequireAuth";

export default function RootPage() {
  return (
    <>
      <Header />
      <div className="mt-[10dvh] w-screen min-h-[90dvh] overflow-y-auto px-6 py-8 text-slate-100 bg-gradient-to-br from-gray-950 via-[#0f172a] to-[#1e293b] transition-all duration-500 ease-in">
        <RequireAuth>
          <Outlet />
        </RequireAuth>
      </div>
    </>
  );
}

export async function loader() {
  if (store.getState().user.user) return; // already logged in

  // 1) Attempt refresh
  const refresh = await apiFetch("http://localhost:5000/refresh", {
    method: "GET",
    credentials: "include",
  });
  if (!refresh.ok) {
    // Clear any stale token
    localStorage.removeItem("accessToken");
    return; // not logged in
  }

  const { accessToken } = await refresh.json();
  localStorage.setItem("accessToken", accessToken);

  // 2) Fetch profile
  const profile = await apiFetch("http://localhost:5000/user/profile", {
    method: "GET",
  });
  if (!profile.ok) {
    // If profile fetch fails, fully logout:
    localStorage.removeItem("accessToken");
    return redirect("/auth?mode=login");
  }
  const user = await profile.json();
  store.dispatch(userActions.addUser(user));
}
