import Image from "next/image";

function Logo({ className }: { className: string }) {
  return (
    <div className={className}>
      <Image
        src="/Agrivest-logo.jpg"
        alt="AgriVest Logo"
        width={32}
        height={32}
        className="object-contain"
        priority
      />
      <h1 className="font-bold">Agrivest</h1>
    </div>
  );
}

export default Logo;
