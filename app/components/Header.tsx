"use client";

import { User } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const pathName = usePathname();
  const user1 = false;

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
      <div className="container mx-auto px-4 ">
        <Link href="/" className="font-bold text-xl text-white ">
          TeamAccess
        </Link>

        <nav className="flex items-center space-x-6 ">
          {navigation.map((item) => (
            <link
              key={item.name}
              href={item.href}
              className={getNavItemClass(item.href)}
            >
              {item.name}
            </link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
