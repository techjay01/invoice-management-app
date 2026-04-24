import InvoiceCard from '../components/InvoiceCard';
import FilterDropdown from '../components/FilterDropdown';
import EmptyState from '../components/EmptyState';
import { PlusIcon } from '../components/Icons';

// ─── Invoice List Page ────────────────────────────────────────────────────────

const InvoiceListPage = ({ invoices, onSelect, onNew, filter, onFilterChange }) => {
  const filtered = filter.length === 0 ? invoices : invoices.filter(i => filter.includes(i.status));

  return (
    <div className="inv-page">
      <div className="inv-list-head">
        <div className="inv-title">
          <h1>Invoices</h1>
          <p className="full-text" aria-live="polite" aria-atomic="true">
            {filtered.length === 0
              ? "No invoices"
              : `There are ${filtered.length}${filter.length ? " found" : " total"} invoice${filtered.length !== 1 ? "s" : ""}`}
          </p>
          <p className="half-text" aria-live="polite" aria-atomic="true">
            {filtered.length === 0
              ? "No invoices"
              : `${filtered.length}${filter.length ? " found" : " total"} invoice${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="inv-controls">
          <FilterDropdown selected={filter} onChange={onFilterChange} />
          <button className="inv-new-btn" onClick={onNew} type="button" aria-label="Create new invoice">
            <span className="inv-new-icon"><PlusIcon /></span>
            <span className="long-text">New Invoice</span>
            <span className="short-text">New</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState hasFilter={filter.length > 0} />
      ) : (
        <div className="inv-list-wrap" role="list" aria-label="Invoices">
          {filtered.map(inv => (
            <div key={inv.id} role="listitem">
              <InvoiceCard invoice={inv} onSelect={onSelect} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceListPage;