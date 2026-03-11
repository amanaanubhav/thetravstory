"use client";
// src/layouts/MainLayout.jsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../providers/UserProvider";

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();

  const isFullWidthPage =
    pathname === "/chat" ||
    pathname.startsWith("/planner") ||
    pathname === "/profile";

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <header className="border-b border-slate-100 bg-white shrink-0">
        <div className="w-full px-8 py-3 flex items-center">

          <div className="flex items-center shrink-0">
            <span className="text-4xl font-extrabold tracking-tight cursor-pointer">
              <span className="text-sky-600">Travi</span>
              <span className="text-slate-900">xo</span>
            </span>
          </div>

          <nav className="flex-1 flex justify-center">
            <ul className="flex items-center gap-10 text-sm font-semibold">
              {[
                { to: "/home", label: "Home" },
                { to: "/explore", label: "Explore" },
                { to: "/chat", label: "Chat" },
                { to: "/planner", label: "Planner" },
                { to: "/profile", label: "Profile" },
              ].map((item) => {
                const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <li key={item.to}>
                    <Link
                      href={item.to}
                      className={`pb-1 transition ${
                        isActive
                          ? "text-sky-600 border-b-2 border-sky-600"
                          : "text-slate-600 hover:text-sky-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            {/* ✅ Safe — user can be null */}
            {user && (
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {user.name || "Traveler"}
                </p>
                {user.personalityTag && (
                  <p className="text-xs text-sky-600 font-medium leading-tight">
                    {user.personalityTag}
                  </p>
                )}
              </div>
            )}

            <div className="h-9 w-9 rounded-full bg-sky-100 overflow-hidden flex items-center justify-center border border-sky-200 shrink-0">
              <img
                src="/profile2.jpg"
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML = `<span style="color:#0284c7;font-weight:700;font-size:14px">${(user?.name?.[0] || "T").toUpperCase()}</span>`;
                }}
              />
            </div>
          </div>

        </div>
      </header>

      <main
        className={
          isFullWidthPage
            ? "flex-1 w-full overflow-y-auto"
            : "flex-1 container mx-auto max-w-5xl px-6 pt-6 overflow-y-auto"
        }
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;