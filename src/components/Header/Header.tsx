import Link from "next/link";

const Header = () => (
  <header className="w-full flex items-center justify-between px-8 py-4 border-b border-[#232b1c] bg-[#181f16]/90 sticky top-0 z-10">
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold flex items-center gap-2">
        <span className="bg-[#232b1c] rounded-full w-6 h-6 flex items-center justify-center">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#a3e635" /></svg>
        </span>
        FundEase
      </span>
    </div>
    <nav className="hidden md:flex gap-8 text-sm font-medium">
      <a href="#" className="hover:text-[#a3e635]">About</a>
      <a href="#" className="hover:text-[#a3e635]">How it Works</a>
      <a href="#" className="hover:text-[#a3e635]">Pricing</a>
    </nav>
    <div className="flex gap-2">
      <Link href="/signup" className="bg-[#a3e635] text-[#181f16] font-semibold px-5 py-2 rounded-full hover:bg-[#b7f36b] transition">Sign Up</Link>
      <Link href="/login" className="bg-[#232b1c] text-white px-5 py-2 rounded-full hover:bg-[#2e3a23] transition">Login</Link>
    </div>
  </header>
);

export default Header;
