import { useState, useEffect, useRef } from "react";
import { ChevronDown, CheckMark } from './Icons';

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

const FilterDropdown = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef();
  const statuses = ["draft", "pending", "paid"];

  useEffect(() => {
    const h = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (s) => onChange(selected.includes(s) ? selected.filter(x => x !== s) : [...selected, s]);

  return (
    <div className="inv-filter-wrap" ref={wrapRef}>
      <button
        className={`inv-filter-btn${open ? " open" : ""}`}
        onClick={() => setOpen(o => !o)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter invoices by status"
      >
        <span>Filter by status</span>
        <ChevronDown />
      </button>
      {open && (
        <div className="inv-filter-drop" role="listbox" aria-multiselectable="true" aria-label="Status filter options">
          {statuses.map(s => {
            const checked = selected.includes(s);
            return (
              <div key={s} className="inv-filter-opt" role="option" aria-selected={checked}>
                <div
                  className={`inv-check${checked ? " on" : ""}`}
                  onClick={() => toggle(s)}
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={checked}
                  onKeyDown={e => (e.key === " " || e.key === "Enter") && toggle(s)}
                >
                  {checked && <CheckMark />}
                </div>
                <span onClick={() => toggle(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;