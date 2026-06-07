"use client";
import { useAuth } from "@/app/provider/AuthProvider";
import { User } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const pathName = usePathname();
  const { logout } = useAuth();
  const navigation = [
    { name: "home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);

  const getNavItemClass = (href: string) => {
    let isActive = false;
    if (href === "/") {
      isActive = pathName === "/";
    } else if (href === "/dashboard") {
      isActive = pathName.startsWith(href);
    }
    return `px-3 py-2 rounded text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;
  };
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className=" flex justify-between items-center container mx-auto px-4 ">
        <Link href="/" className="font-bold text-xl text-white ">
          TeamAccess
        </Link>

        <nav className="flex items-center space-x-6 ">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={getNavItemClass(item.href)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className=" flex items-center space-x-4 p-3">
          {user ? (
            <>
              <span className="text-lg text-slate-300 "> {user.name} {user.role}</span>
              <button
                onClick={logout}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-sm "
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-block mt-3 px-4 py-2 border border-amber-50 rounded-sm text-white "
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
