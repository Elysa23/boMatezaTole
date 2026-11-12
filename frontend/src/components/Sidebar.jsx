const rubriques = ["Produits", "Commandes", "Clients", "Catégories", "Stock"];
const icones = ["▦", "▤", "♙", "▧", "▥"];

function Sidebar() {
  return (
    <aside className="bg-[#102b4e] text-slate-200 md:fixed md:inset-y-0 md:left-0 md:z-10 md:flex md:w-[252px] md:flex-col">
      <a className="flex min-h-[70px] items-center gap-3 border-b border-white/10 px-[18px] py-3 text-inherit no-underline md:min-h-[92px] md:px-6 md:py-5" href="#produits" aria-label="Mateza Tole, accueil du back office">
        <span className="grid h-10 w-10 place-items-center rounded-[11px] bg-white text-[13px] font-extrabold tracking-tight text-[#102b4e]">MT</span>
        <span className="text-sm font-extrabold tracking-wide">MATEZA <strong className="text-red-500">TOLE</strong><small className="mt-1 block text-[9px] font-semibold tracking-[1.4px] text-blue-200/70">ESPACE ADMINISTRATION</small></span>
      </a>
      <div className="hidden px-6 pb-3 pt-[30px] text-[10px] font-bold tracking-[1.5px] text-blue-200/70 md:block">GESTION</div>
      <nav className="flex gap-1 overflow-x-auto px-2 py-2 md:grid md:overflow-visible md:px-3 md:py-0" aria-label="Navigation principale">
        {rubriques.map((rubrique, index) => (
          <button className={`flex min-h-[38px] shrink-0 items-center gap-3 rounded-lg px-3 text-left text-[11px] transition md:min-h-[46px] md:w-full md:text-[13px] ${index === 0 ? "bg-white/10 font-semibold text-white shadow-[inset_3px_0_#81b5f3]" : "text-slate-300/70"}`} key={rubrique} type="button" disabled={index !== 0} aria-current={index === 0 ? "page" : undefined} title={index === 0 ? undefined : "Bientôt disponible"}>
            <span className={`w-5 text-center text-[17px] ${index === 0 ? "text-blue-200" : "text-blue-100/70"}`} aria-hidden="true">{icones[index]}</span>
            <span>{rubrique}</span>
            {index !== 0 && <span className="ml-auto hidden text-[9px] text-blue-100/60 md:inline">Bientôt</span>}
          </button>
        ))}
      </nav>
      <div className="mt-auto hidden items-center gap-2.5 border-t border-white/10 px-6 py-5 text-xs font-semibold text-slate-200 md:flex">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_#60c99b20]" />
        <span>Mateza Tole <small className="mt-0.5 block text-[10px] font-normal text-blue-200/70">Back Office</small></span>
      </div>
    </aside>
  );
}

export default Sidebar;
