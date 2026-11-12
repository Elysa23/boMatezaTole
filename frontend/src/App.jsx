import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import ProduitListe from "./components/ProduitListe.jsx";
import ProduitFormulaire from "./components/ProduitFormulaire.jsx";
import ConfirmationSuppression from "./components/ConfirmationSuppression.jsx";

/*const produitsTemporaires = [
  {
    id: 1,
    nom: "Tôle ondulée galvanisée",
    reference: "TOG-001",
    prix: 85000,
    stock: 120,
    statut: "Disponible",
  },
  {
    id: 2,
    nom: "Tôle bac acier",
    reference: "TBA-014",
    prix: 112000,
    stock: 48,
    statut: "Disponible",
  },
  {
    id: 3,
    nom: "Tôle plane prélaquée",
    reference: "TPP-008",
    prix: 97500,
    stock: 0,
    statut: "En rupture",
  },
  {
    id: 4,
    nom: "Tôle ondulée alu-zinc",
    reference: "TOA-022",
    prix: 104000,
    stock: 32,
    statut: "Disponible",
  },
];*/

function App() {
  const [produitEnEdition, setProduitEnEdition] = useState(null);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [produits, setProduits] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [idASupprimer, setIdASupprimer] = useState(null);
  const [categories, setCategories] = useState([]);

  async function fetchProduits() {
    try {
      const response = await fetch("http://localhost:8000/api/test");

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des produits");
      }

      const data = await response.json();
      console.log("Produits récupérés :", data);
      setProduits(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  }
  useEffect(() => {
    fetchProduits();
  }, []);

  async function supprimerProduit(id) {
    try {
      const response = await fetch(`http://localhost:8000/api/produits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du produit");
      }

      setConfirmation(false);

      fetchProduits();
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  }

  function demanderConfirmationSuppression(id) {
    setIdASupprimer(id);
    setConfirmation(true);
  }

  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:8000/api/categories", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function ouvrirFormulaire(produit = null) {
    setProduitEnEdition(produit);
    setFormulaireOuvert(true);
  }

  function fermerFormulaire() {
    setFormulaireOuvert(false);
    setProduitEnEdition(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />
      <main className="min-h-screen md:ml-[252px]">
        <Header />
        <div className="mx-auto max-w-[1360px] p-4 sm:p-6 lg:p-[42px]">
          <div className="mb-6 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-[10px] font-bold tracking-[1.3px] text-blue-800 uppercase">
                Catalogue
              </p>
              <h1 className="mb-1.5 text-[27px] font-semibold tracking-tight text-slate-800">
                Produits
              </h1>
              <p className="text-[13px] text-slate-500">
                Gérez les produits de votre catalogue.
              </p>
            </div>
            <button
              className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-md bg-blue-800 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-900 sm:w-auto"
              onClick={() => ouvrirFormulaire()}
            >
              <span aria-hidden="true" className="text-lg font-normal">
                ＋
              </span>{" "}
              Ajouter un produit
            </button>
          </div>

          <div className="mb-[18px] flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50 px-3.5 py-3 text-[11px] leading-relaxed text-blue-900">
            <span
              aria-hidden="true"
              className="mt-1 h-[7px] w-[7px] shrink-0 rounded-full bg-blue-500"
            />
            Aperçu de l’interface — les produits affichés sont des données
            temporaires.
          </div>

          <ProduitListe
            produits={produits}
            onModifier={ouvrirFormulaire}
            onSupprimer={demanderConfirmationSuppression}
          />
        </div>
      </main>

      {confirmation && (
        <ConfirmationSuppression
          onConfirmer={() => supprimerProduit(idASupprimer)}
          onAnnuler={() => setConfirmation(false)}
        />
      )}
      {formulaireOuvert && (
        <ProduitFormulaire
          produit={produitEnEdition}
          onFermer={fermerFormulaire}
          onProduitAjoute={fetchProduits}
          categories={categories}
        />
      )}
    </div>
  );
}

export default App;
