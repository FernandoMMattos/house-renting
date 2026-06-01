import Link from "next/link";
import AuthNav from "./AuthNav";

const Header = () => {
  return (
    <header className="flex justify-around w-full p-2">
      <Link href="/">House Rental</Link>
      <AuthNav />
    </header>
  );
};

export default Header;
