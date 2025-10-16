"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "./logo";
import Button from "./cta-button";

const navLinks = [
  { label: "about", href: "/about" },
  { label: "how it works", href: "/how-it-works" },
  { label: "farms", href: "/farms" },
  { label: "marketplace", href: "/marketplace" },
];

function MainHeader() {
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center bg-secondary-background p-4">
      <Link href={"/"}>
        <Logo className={"flex gap-x-0.5 items-center"} />
      </Link>
      <nav className="flex justify-between items-center gap-x-40 ">
        <ul className="flex justify-between gap-x-10 font-semibold capitalize">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`capitalize ${
                  pathname.startsWith(link.href)
                    ? "text-primary-background"
                    : "hover:text-primary-background"
                } `}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button cta={() => {}} style="px-4 py-2">
          connect wallet
        </Button>
      </nav>
    </header>
  );
}

export default MainHeader;
