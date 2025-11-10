"use client";

import Logo from "./components/Logo";
import MenuIcon from "./components/icons/MenuIcon";
import SubscribeButton from "./components/SubscribeButton";
import SignInButton from "./components/SignInButton";
export default function MobileNavbar() {
  return (
    <nav className="w-full h-[55px]  bg-[rgb(31,31,31)] flex items-center px-4 justify-between">
      <div className="flex items-center gap-4 768:gap-5 1024:gap-6 1280:gap-8">
        <MenuIcon />
        <Logo />
      </div>
      <div className="flex items-center gap-4 768:gap-5 1024:gap-6 1280:gap-8">
        <SubscribeButton />
        <SignInButton />
      </div>
    </nav>
  );
}
