import { useState, useEffect, useRef, useCallback } from "react";
import { ThemeContext } from './context/ThemeContext';
import { SAMPLE_INVOICES, useGlobalStyles } from './utils/helpers';
import Sidebar from './components/Sidebar';
import InvoiceListPage from './pages/InvoiceListPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';
import InvoiceForm from './components/InvoiceForm';
import DeleteModal from './components/DeleteModal';

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("inv-theme") || "dark"; } catch { return "dark"; }
  });
  const [invoices, setInvoices] = useState(() => {
    try {
      const s = localStorage.getItem("inv-invoices");
      return s ? JSON.parse(s) : SAMPLE_INVOICES;
    } catch { return SAMPLE_INVOICES; }
  });
  const [view, setView] = useState("list"); // "list" | "detail"
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" | "edit"
  const [showDelete, setShowDelete] = useState(false);
  const [filter, setFilter] = useState([]);

  useGlobalStyles(theme);

  useEffect(() => {
    try { localStorage.setItem("inv-invoices", JSON.stringify(invoices)); } catch {}
  }, [invoices]);

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      try { localStorage.setItem("inv-theme", next); } catch {}
      return next;
    });
  }, []);

  const selectedInvoice = invoices.find(i => i.id === selectedId) || null;

  const handleSave = (invoice) => {
    if (formMode === "create") {
      setInvoices(prev => [invoice, ...prev]);
      if (invoice.status !== "draft") {
        setSelectedId(invoice.id);
        setView("detail");
      }
    } else {
      setInvoices(prev => prev.map(i => i.id === invoice.id ? invoice : i));
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    setInvoices(prev => prev.filter(i => i.id !== selectedId));
    setShowDelete(false);
    setSelectedId(null);
    setView("list");
  };

  const handleMarkPaid = () => {
    setInvoices(prev => prev.map(i =>
      i.id === selectedId
        ? { ...i, status: i.status === "draft" ? "pending" : "paid" }
        : i
    ));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="inv-layout">
        <Sidebar />
        <main className="inv-main" id="main-content">
          {view === "list" && (
            <InvoiceListPage
              invoices={invoices}
              onSelect={(id) => { setSelectedId(id); setView("detail"); }}
              onNew={() => { setFormMode("create"); setShowForm(true); }}
              filter={filter}
              onFilterChange={setFilter}
            />
          )}
          {view === "detail" && selectedInvoice && (
            <InvoiceDetailPage
              invoice={selectedInvoice}
              onBack={() => setView("list")}
              onEdit={() => { setFormMode("edit"); setShowForm(true); }}
              onDelete={() => setShowDelete(true)}
              onMarkPaid={handleMarkPaid}
            />
          )}
        </main>

        {showForm && (
          <InvoiceForm
            mode={formMode}
            invoice={formMode === "edit" ? selectedInvoice : null}
            onClose={() => setShowForm(false)}
            onBack={() => setShowForm(false)}
            onSave={handleSave}
          />
        )}

        {showDelete && selectedInvoice && (
          <DeleteModal
            invoiceId={selectedId}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
}