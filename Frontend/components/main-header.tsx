"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./cta-button";

const navLinks = [
  { label: "about", href: "/about" },
  { label: "how it works", href: "/how-it-works" },
  { label: "farms", href: "/farms" },
  { label: "marketplace", href: "/marketplace" },
];

function MainHeader() {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <header className="flex justify-between items-center bg-secondary-background p-4">
      <Link href={"/"} className="flex gap-x-3 items-center">
        <Image
          src="/Agrivest-logo.jpg"
          alt="AgriVest Logo"
          width={32}
          height={32}
          className="object-contain"
          priority
        />
        <h1 className="font-bold">Agrivest</h1>
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
        <Button variant="primary" cta={() => {}}>
          connect wallet
        </Button>
      </nav>
    </header>
  );
}

export default MainHeader;
