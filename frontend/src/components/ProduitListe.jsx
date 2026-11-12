function formaterPrix(prix) {
  return `${prix.toLocaleString("fr-FR")} Ar`;
}

function ProduitListe({ produits, onModifier, onSupprimer }) {
  console.log("Produits reçus dans ProduitListe :", produits); // Ajout du log pour vérifier les produits reçus

  return (
    <section
      className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-[0_4px_18px_#1c355008]"
      aria-label="Liste des produits"
    >
      <div className="flex items-center justify-between px-[22px] py-[21px]">
        <div>
          <h2 className="mb-1 text-sm font-bold text-slate-800">
            Catalogue produits
          </h2>
          <p className="mb-0 text-[11px] text-slate-500">
            {produits.length} produits dans la liste
          </p>
        </div>
        <span className="grid h-[27px] min-w-[27px] place-items-center rounded-md bg-blue-50 px-2 text-[11px] font-bold text-blue-800">
          {produits.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left whitespace-nowrap">
          <thead className="bg-slate-50">
            <tr>
              <th className="h-[42px] px-3.5 pl-[22px] text-[9px] font-bold tracking-[.8px] text-slate-500">
                PRODUIT
              </th>
              <th className="px-3.5 text-[9px] font-bold tracking-[.8px] text-slate-500">
                RÉFÉRENCE
              </th>
              <th className="px-3.5 text-[9px] font-bold tracking-[.8px] text-slate-500">
                PRIX UNITAIRE
              </th>
              <th className="px-3.5 text-[9px] font-bold tracking-[.8px] text-slate-500">
                STOCK
              </th>
              <th className="px-3.5 text-[9px] font-bold tracking-[.8px] text-slate-500">
                STATUT
              </th>
              <th className="px-3.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {produits.map((produit) => (
              <tr className="border-t border-slate-100" key={produit.id}>
                <td className="h-[66px] pl-[22px] pr-3.5">
                  <div className="flex items-center gap-[11px] text-slate-700">
                    <span className="grid h-[34px] w-[34px] place-items-center rounded-md border border-blue-100 bg-gradient-to-br from-slate-50 to-blue-100 text-xs font-bold text-blue-800">
                      {produit.nom.slice(0, 1)}
                    </span>
                    <strong className="text-[11px] font-semibold">
                      {produit.nom}
                    </strong>
                  </div>
                </td>
                <td className="px-3.5 text-[11px] text-slate-500">
                  {produit.reference}
                </td>
                <td className="px-3.5 text-[11px] font-semibold text-slate-700">
                  {formaterPrix(produit.prix)}
                </td>
                <td className="px-3.5 text-[11px] text-slate-600">
                  {produit.stock} unités
                </td>
                <td className="px-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${produit.stock > 0 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
                  >
                    <span className="h-[5px] w-[5px] rounded-full bg-current" />
                    {produit.statut}
                  </span>
                </td>
                <td className="px-3.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      className="rounded px-2 py-1.5 text-[10px] font-semibold text-blue-800 hover:bg-blue-50"
                      type="button"
                      onClick={() => onModifier(produit)}
                    >
                      Modifier
                    </button>
                    <button
                      className="rounded px-2 py-1.5 text-[10px] font-semibold text-red-700 hover:bg-red-50"
                      type="button"
                      onClick={() => onSupprimer(produit.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </section>
  );
}

export default ProduitListe;
