"use client";

import DesktopNavbar from './Desktop/DesktopNavbar';
import MobileNavbar from './Mobile/MobileNavbar';

export default function Navbar() {
  return (
    <nav>
      <div className="hidden md:block">
        <DesktopNavbar />
      </div>
      <div className="md:hidden">
        <MobileNavbar />
      </div>
    </nav>
  );
}
