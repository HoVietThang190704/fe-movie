"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "@/provider/AuthProvider";

const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Search",
    href: "/search",
  },
  {
    name: "Standalone films",
    href: "/standalone-films",
  },
  {
    name: "TV series",
    href: "/tv-series",
  },
  {
    name: "Favourite",
    href: "/favourite",
  },
  {
    name: "Watch later",
    href: "/watch-later",
  },
  {
    name: "Viewed",
    href: "/viewed",
  },
];

function UserDropdown() {
  const { user, logout } = useAuth();
  if (!user)
    return (
      <div className="flex flex-row items-center gap-4">
        <Button className="" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/register">Sign In</Link>
        </Button>
      </div>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function NavBar() {
  return (
    <nav className="h-16 bg-background flex flex-row items-center justify-between mx-16">
      <div className="flex flex-row items-center gap-4">
        <Link href={"/"}>
          <Image
            src={"/images/LOGO_MOVIE.png"}
            alt="logo"
            className="w-50 h-20"
            width={80}
            height={80}
          />
        </Link>
      </div>
      <div className="flex flex-row items-center gap-4">
        {navItems.map((item) => (
          <Button variant="link" asChild key={item.name}>
            <Link href={item.href}>{item.name}</Link>
          </Button>
        ))}
      </div>
      <UserDropdown />
    </nav>
  );
}