import { useEffect, useRef } from "react";

// ─── Delete Modal ─────────────────────────────────────────────────────────────

const DeleteModal = ({ invoiceId, onConfirm, onCancel }) => {
  const cancelRef = useRef();

  useEffect(() => {
    cancelRef.current?.focus();
    const h = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div className="inv-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="del-title">
      <div className="inv-modal">
        <h2 id="del-title">Confirm Deletion</h2>
        <p>
          Are you sure you want to delete invoice <strong>#{invoiceId}</strong>?
          This action cannot be undone.
        </p>
        <div className="inv-modal-acts">
          <button ref={cancelRef} className="inv-btn inv-btn-secondary" onClick={onCancel} type="button">Cancel</button>
          <button className="inv-btn inv-btn-danger" onClick={onConfirm} type="button">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;