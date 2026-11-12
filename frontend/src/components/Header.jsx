function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:h-[72px] sm:px-6 lg:px-[42px]">
      <div className="flex items-center gap-[11px] text-xs text-slate-400"><span>Administration</span><span className="text-slate-300">/</span><strong className="font-semibold text-slate-700">Produits</strong></div>
      <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700"><span className="grid h-[34px] w-[34px] place-items-center rounded-full border border-blue-100 bg-blue-50 text-[10px] font-extrabold text-blue-800">MT</span><span className="hidden sm:inline">Administrateur</span></div>
    </header>
  );
}

export default Header;
