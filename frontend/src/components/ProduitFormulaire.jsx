import { useEffect, useRef, useState } from "react";

function ProduitFormulaire({ produit, onFermer, onProduitAjoute, categories }) {
  const [photoApercu, setPhotoApercu] = useState(produit?.photo ?? "");
  const [photoFichier, setPhotoFichier] = useState(null);
  const [photoSupprimee, setPhotoSupprimee] = useState(false);
  const [erreurFormulaire, setErreurFormulaire] = useState("");
  const champPhoto = useRef(null);
  const [nom, setNom] = useState(produit?.nom ?? "");
  const [prix, setPrix] = useState(produit?.prix?.toString() ?? "");
  const [categorie, setCategorie] = useState(produit?.categorie ?? "");
  const [reference, setReference] = useState(produit?.reference ?? "");
  const [stock, setStock] = useState(produit?.stock?.toString() ?? "");
  const [description, setDescription] = useState(produit?.description ?? "");

  useEffect(() => {
    return () => {
      if (photoApercu.startsWith("blob:")) URL.revokeObjectURL(photoApercu);
    };
  }, [photoApercu]);

  function choisirPhoto(event) {
    const fichier = event.target.files[0];
    if (!fichier) return;

    if (fichier.size > 2 * 1024 * 1024) {
      setErreurFormulaire("La photo ne doit pas dépasser 2 Mo.");
      event.target.value = "";
      return;
    }

    setErreurFormulaire("");
    if (photoApercu.startsWith("blob:")) URL.revokeObjectURL(photoApercu);
    setPhotoApercu(URL.createObjectURL(fichier));
    setPhotoFichier(fichier);
    setPhotoSupprimee(false);
    event.target.value = "";
  }

  function retirerPhoto() {
    if (photoApercu.startsWith("blob:")) URL.revokeObjectURL(photoApercu);
    setPhotoApercu("");
    setPhotoFichier(null);
    setPhotoSupprimee(Boolean(produit?.photo));
    if (champPhoto.current) champPhoto.current.value = "";
  }

  async function ajouterProduit() {
    try {
      const donnees = new FormData();
      donnees.append("nom", nom);
      donnees.append("prix", prix);
      donnees.append("categorie", categorie);
      donnees.append("reference", reference);
      donnees.append("stock", stock);
      donnees.append("description", description);
      if (photoFichier) donnees.append("photo", photoFichier);

      const response = await fetch("http://localhost:8000/api/produits", {
        method: "POST",
        body: donnees,
      });

      if (!response.ok) {
        const resultat = await response.json();
        throw new Error(
          resultat.message ?? "Erreur lors de l'ajout du produit",
        );
      }

      const nouveauProduit = await response.json();
      if (photoFichier && !nouveauProduit.produit?.photo) {
        throw new Error(
          "Le serveur n’a pas confirmé l’enregistrement de la photo. Vérifiez la requête multipart et le serveur Symfony utilisé.",
        );
      }
      console.log("Produit ajouté :", nouveauProduit);

      await onProduitAjoute();
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      setErreurFormulaire(error.message);
      return false;
    }
  }

  async function modifierProduit() {
    try {
      const donnees = new FormData();
      donnees.append("nom", nom);
      donnees.append("prix", prix);
      donnees.append("categorie", categorie);
      donnees.append("reference", reference);
      donnees.append("stock", stock);
      donnees.append("description", description);
      donnees.append("retirerPhoto", photoSupprimee ? "true" : "false");
      donnees.append("_method", "PATCH");
      if (photoFichier) donnees.append("photo", photoFichier);

      const response = await fetch(
        `http://localhost:8000/api/produits/${produit.id}`,
        {
          method: "POST",
          body: donnees,
        },
      );

      if (!response.ok) {
        const resultat = await response.json();
        throw new Error(
          resultat.message ?? "Erreur lors de la modification du produit",
        );
      }

      const produitModifie = await response.json();
      if (photoFichier && !produitModifie.produit?.photo) {
        throw new Error(
          "Le serveur n’a pas confirmé l’enregistrement de la photo. Vérifiez la requête multipart et le serveur Symfony utilisé.",
        );
      }
      console.log("Produit modifié :", produitModifie);

      await onProduitAjoute();
      return true;
    } catch (error) {
      console.error("Erreur lors de la modification du produit :", error);
      setErreurFormulaire(error.message);
      return false;
    }
  }

  const photoPourAffichage =
    photoApercu.startsWith("blob:") || photoApercu.startsWith("http")
      ? photoApercu
      : `http://localhost:8000${photoApercu}`;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/45 p-4"
      role="presentation"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onFermer()
      }
    >
      <section
        className="max-h-[calc(100vh-32px)] w-full max-w-[560px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-[26px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[1.3px] text-blue-800 uppercase">
              Catalogue produits
            </p>
            <h2
              id="form-title"
              className="m-0 text-[19px] font-semibold text-slate-800"
            >
              {produit ? "Modifier le produit" : "Ajouter un produit"}
            </h2>
          </div>
          <button
            className="grid h-[30px] w-[30px] place-items-center rounded-md bg-slate-100 text-[22px] leading-none text-slate-500 hover:bg-slate-200"
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setErreurFormulaire("");
            let enregistrementReussi;
            if (produit) {
              enregistrementReussi = await modifierProduit();
            } else {
              enregistrementReussi = await ajouterProduit();
            }
            if (enregistrementReussi) {
              onFermer();
            }
          }}
        >
          <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
            Nom du produit
            <input
              className="min-h-[39px] w-full rounded-md border border-slate-300 px-3 py-2 text-[11px] font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              placeholder="Ex. Tôle ondulée galvanisée"
              value={nom}
              onChange={(event) => setNom(event.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
              Référence
              <input
                className="min-h-[39px] w-full rounded-md border border-slate-300 px-3 py-2 text-[11px] font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="text"
                placeholder="Ex. TOG-001"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
              />
            </label>
            <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
              Prix unitaire (Ar)
              <input
                className="min-h-[39px] w-full rounded-md border border-slate-300 px-3 py-2 text-[11px] font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="number"
                min="0"
                placeholder="0"
                value={prix}
                onChange={(event) => setPrix(event.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
              Quantité en stock
              <input
                className="min-h-[39px] w-full rounded-md border border-slate-300 px-3 py-2 text-[11px] font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="number"
                min="0"
                placeholder="0"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
              />
            </label>
            <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
              Catégorie
              <select
                className="min-h-[39px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[11px] font-normal text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={categorie}
                onChange={(event) => setCategorie(event.target.value)}
              >
                <option value="" disabled>
                  Choisir une catégorie
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
            <span>Photo du produit</span>
            <input
              ref={champPhoto}
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={choisirPhoto}
            />
            {photoApercu ? (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <img
                  className="h-[76px] w-[76px] rounded-md border border-slate-200 bg-white object-cover"
                  src={photoPourAffichage}
                  alt="Aperçu de la photo du produit"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                    type="button"
                    onClick={() => champPhoto.current?.click()}
                  >
                    Remplacer la photo
                  </button>
                  <button
                    className="rounded-md px-3 py-2 text-[10px] font-semibold text-red-700 hover:bg-red-50"
                    type="button"
                    onClick={retirerPhoto}
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-[11px] font-normal text-slate-500 transition hover:border-blue-400 hover:bg-blue-50/50"
                type="button"
                onClick={() => champPhoto.current?.click()}
              >
                <span className="text-xl text-blue-700" aria-hidden="true">
                  ＋
                </span>
                <span>
                  <strong className="font-semibold text-blue-800">
                    Choisir une image
                  </strong>
                  <br />
                  PNG, JPG, GIF, WebP ou autre image
                </span>
              </button>
            )}
          </div>

          <label className="grid gap-1.5 text-[11px] font-semibold text-slate-600">
            Description
            <textarea
              className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-[11px] font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              rows="3"
              placeholder="Décrivez le produit…"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <p className="-mt-1 mb-0 text-[10px] text-slate-400">
            Formats acceptés : JPEG, PNG, GIF ou WebP. Taille maximale : 2 Mo.
          </p>
          {erreurFormulaire && (
            <p
              className="mb-0 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
              role="alert"
            >
              {erreurFormulaire}
            </p>
          )}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              className="min-h-[40px] rounded-md border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              type="button"
              onClick={onFermer}
            >
              Annuler
            </button>
            <button
              className="min-h-[40px] rounded-md bg-blue-800 px-4 text-xs font-semibold text-white shadow-sm hover:bg-blue-900"
              type="submit"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProduitFormulaire;
