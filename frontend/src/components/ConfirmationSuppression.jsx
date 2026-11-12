function ConfirmationSuppression({ onConfirmer, onAnnuler }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <section
        aria-describedby="confirmation-suppression-description"
        aria-labelledby="confirmation-suppression-title"
        aria-modal="true"
        className="w-full max-w-[420px] rounded-xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_#0f172a33]"
        role="alertdialog"
      >
        <div className="mb-5 flex items-start gap-4">
          <div
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18M8 6V4h8v2m3 0-.9 14H5.9L5 6m5 4v6m4-6v6" />
            </svg>
          </div>
          <div className="pt-0.5">
            <h2
              className="text-base font-semibold tracking-tight text-slate-800"
              id="confirmation-suppression-title"
            >
              Confirmer la suppression
            </h2>
            <p
              className="mt-2 text-sm leading-relaxed text-slate-500"
              id="confirmation-suppression-description"
            >
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est
              définitive.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            autoFocus
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            onClick={onAnnuler}
            type="button"
          >
            Annuler
          </button>
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            onClick={onConfirmer}
            type="button"
          >
            Supprimer
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmationSuppression;
