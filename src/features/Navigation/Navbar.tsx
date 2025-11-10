"use client";

import DesktopNavbar from './Desktop/DesktopNavbar';
import MobileNavbar from './Mobile/MobileNavbar';

export default function Navbar() {
  return (
    <nav>
      <div className="hidden 768:block">
        <DesktopNavbar />
      </div>
      <div className="">
        <MobileNavbar />
      </div>
    </nav>
  );
}
