import Link from "next/link";

const Footer = () => {
  return (
    <footer className="p-6 text-center text-2xl select-none bg-blue-300">
      Created by{" "}
      <Link
        href="https://github.com/FernandoMMattos"
        className="cursor-pointer "
      >
        @FernandoMMattos
      </Link>
    </footer>
  );
};

export default Footer;
