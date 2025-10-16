import Link from "next/link";

import Logo from "./logo";
import FooterFormSubmit from "./footer-form-submit";

import {
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa6";

const quickLinks = [
  { label: "home", href: "/" },
  { label: "about us", href: "/about-us" },
  { label: "how it works", href: "/how-it-works" },
  { label: "farms", href: "/farms" },
  { label: "marketplace", href: "/market-place" },
  { label: "dashboard", href: "/dashboard" },
];

const resources = [
  { label: "smart contracts", href: "/smart-contracts" },
  { label: "transparency", href: "/transparency" },
  { label: "FAQs", href: "/faqs" },
  { label: "farmer resources", href: "/farmer-resources" },
  { label: "investor guide", href: "/investor-guide" },
  { label: "blog", href: "/blog" },
];

function Footer() {
  return (
    <footer className="px-16 pb-10">
      <div className="grid grid-cols-4 gap-x-4 ">
        <div className="space-y-5">
          <Logo className={"flex gap-x-2 items-center text-btn-primary"} />
          <p className="text-md font-medium">
            Connecting farmers with crypto investors for sustainable agriculture
            and transparent returns.
          </p>
          <div className="flex items-center gap-x-5">
            <button className="text-md hover:text-btn-primary cursor-pointer">
              <FaTwitter />
            </button>
            <button className="hover:text-btn-primary cursor-pointer">
              <FaFacebook />
            </button>
            <button className="hover:text-btn-primary cursor-pointer">
              <FaInstagram />
            </button>
            <button className="hover:text-btn-primary cursor-pointer">
              <FaTelegram />
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-lg">quick links</h3>
          <ul className="mt-4">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="capitalize font-medium hover:text-card-background"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>resources</h3>
          <ul className="mt-4">
            {resources.map((resource) => (
              <li key={resource.label}>
                <Link
                  href={resource.href}
                  className="capitalize font-medium hover:text-card-background"
                >
                  {resource.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg">stay updated</h3>
          <p className="my-4">
            Subscribe to our newsletter for the latest farming opportunities and
            platform updates.
          </p>
          <form className="flex items-center gap-x-1.5 mb-4">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-btn-secondary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-btn-primary"
            />
            <FooterFormSubmit />
          </form>
          <div>
            <h3>contact us</h3>
            <a
              href="mailto:support@cryptofarming.io"
              target="_blank"
              className="text-btn-secondary hover:text-btn-primary"
            >
              support@cryptofarming.io
            </a>
            <div className="text-btn-secondary">0917477889</div>
          </div>
        </div>
      </div>
      <div className="h-1.5 w-full bg-[#e5e5e5] mt-8 mb-4"></div>
      <div className="text-sm flex items-center justify-between text-btn-secondary">
        <div>&copy; 2025 Agrivest Platform. All rights reserved.</div>
        <div className="flex items-center justify-between gap-x-10 capitalize">
          <Link href={""}>privacy policy</Link>
          <Link href={""}>Terms of service</Link>
          <Link href={""}>cookie policy</Link>
          <Link href={""}>disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
