import { useState, useEffect, useRef } from "react";
import { TrashIcon } from './Icons';
import { formatCurrency, addDays, todayStr, genId } from '../utils/helpers';

// ─── Invoice Form ─────────────────────────────────────────────────────────────

const BLANK_ITEM = { name: "", quantity: 1, price: 0, total: 0 };

const InvoiceForm = ({ mode, invoice, onClose, onSave }) => {
  const [form, setForm] = useState(() => {
    if (invoice) {
      return {
        senderStreet: invoice.senderAddress?.street || "",
        senderCity: invoice.senderAddress?.city || "",
        senderPostCode: invoice.senderAddress?.postCode || "",
        senderCountry: invoice.senderAddress?.country || "",
        clientName: invoice.clientName || "",
        clientEmail: invoice.clientEmail || "",
        clientStreet: invoice.clientAddress?.street || "",
        clientCity: invoice.clientAddress?.city || "",
        clientPostCode: invoice.clientAddress?.postCode || "",
        clientCountry: invoice.clientAddress?.country || "",
        createdAt: invoice.createdAt || todayStr(),
        paymentTerms: invoice.paymentTerms || 30,
        description: invoice.description || "",
        items: invoice.items?.length ? invoice.items.map(i => ({ ...i })) : [{ ...BLANK_ITEM }]
      };
    }
    return {
      senderStreet: "", senderCity: "", senderPostCode: "", senderCountry: "",
      clientName: "", clientEmail: "",
      clientStreet: "", clientCity: "", clientPostCode: "", clientCountry: "",
      createdAt: todayStr(), paymentTerms: 30, description: "",
      items: [{ ...BLANK_ITEM }]
    };
  });
  const [errors, setErrors] = useState({});
  const overlayRef = useRef();
  const drawerRef = useRef();
  const firstFocusRef = useRef();

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    firstFocusRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const setItem = (idx, field, val) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: val };
    if (field === "quantity" || field === "price") {
      const qty = +(field === "quantity" ? val : items[idx].quantity);
      const price = +(field === "price" ? val : items[idx].price);
      items[idx].total = +(qty * price).toFixed(2);
    }
    setForm(prev => ({ ...prev, items }));
  };

  const addItem = () => setForm(prev => ({ ...prev, items: [...prev.items, { ...BLANK_ITEM }] }));
  const removeItem = (idx) => setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));

  const validate = (asDraft) => {
    const e = {};
    if (!asDraft) {
      if (!form.clientName.trim()) e.clientName = "Can't be empty";
      if (!form.clientEmail.trim()) e.clientEmail = "Can't be empty";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) e.clientEmail = "Invalid email";
      if (!form.description.trim()) e.description = "Can't be empty";
      if (!form.senderStreet.trim()) e.senderStreet = "Can't be empty";
      if (!form.senderCity.trim()) e.senderCity = "Can't be empty";
      if (!form.senderPostCode.trim()) e.senderPostCode = "Can't be empty";
      if (!form.senderCountry.trim()) e.senderCountry = "Can't be empty";
      if (!form.clientStreet.trim()) e.clientStreet = "Can't be empty";
      if (!form.clientCity.trim()) e.clientCity = "Can't be empty";
      if (!form.clientPostCode.trim()) e.clientPostCode = "Can't be empty";
      if (!form.clientCountry.trim()) e.clientCountry = "Can't be empty";
      if (form.items.length === 0) e.items = "An item must be added";
      form.items.forEach((item, i) => {
        if (!item.name.trim()) e[`iname${i}`] = "Can't be empty";
        if (+item.quantity <= 0) e[`iqty${i}`] = "Invalid";
        if (+item.price < 0) e[`iprice${i}`] = "Invalid";
      });
    }
    return e;
  };

  const buildInvoice = (status) => {
    const total = +form.items.reduce((s, i) => s + i.total, 0).toFixed(2);
    return {
      id: invoice?.id || genId(),
      createdAt: form.createdAt,
      paymentDue: addDays(form.createdAt, form.paymentTerms),
      description: form.description,
      paymentTerms: +form.paymentTerms,
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      status,
      senderAddress: { street: form.senderStreet, city: form.senderCity, postCode: form.senderPostCode, country: form.senderCountry },
      clientAddress: { street: form.clientStreet, city: form.clientCity, postCode: form.clientPostCode, country: form.clientCountry },
      items: form.items.map(i => ({ ...i, quantity: +i.quantity, price: +i.price, total: +i.total })),
      total
    };
  };

  const handleSave = (status) => {
    const asDraft = status === "draft";
    const e = validate(asDraft);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      drawerRef.current?.querySelector(".err")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    onSave(buildInvoice(status));
  };

  const field = (id, val, onChange, label, type = "text", placeholder = "") => (
    <div className={`inv-field${errors[id] ? " err" : ""}`}>
      <label htmlFor={`form-${id}`}>{label}</label>
      <input
        id={`form-${id}`}
        type={type}
        className={`inv-input${errors[id] ? " err" : ""}`}
        value={val}
        onChange={onChange}
        placeholder={placeholder}
        aria-describedby={errors[id] ? `err-${id}` : undefined}
        aria-invalid={!!errors[id]}
      />
      {errors[id] && <span id={`err-${id}`} className="inv-field-err" role="alert">{errors[id]}</span>}
    </div>
  );

  return (
    <>
      <div
        className="inv-overlay"
        ref={overlayRef}
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        role="presentation"
        aria-hidden="true"
      />
      <div
        className="inv-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={mode === "create" ? "Create new invoice" : `Edit invoice #${invoice?.id}`}
      >
        <h2 ref={firstFocusRef} tabIndex={-1}>
          {mode === "create" ? "New Invoice" : <>Edit <span>#</span>{invoice?.id}</>}
        </h2>

        {/* Bill From */}
        <p className="inv-form-section">Bill From</p>
        <div className="inv-form-grid">
          {field("senderStreet", form.senderStreet, e => set("senderStreet", e.target.value), "Street Address")}
        </div>
        <div className="inv-form-grid c3">
          {field("senderCity", form.senderCity, e => set("senderCity", e.target.value), "City")}
          {field("senderPostCode", form.senderPostCode, e => set("senderPostCode", e.target.value), "Post Code")}
          {field("senderCountry", form.senderCountry, e => set("senderCountry", e.target.value), "Country")}
        </div>

        {/* Bill To */}
        <p className="inv-form-section" style={{ marginTop: 24 }}>Bill To</p>
        <div className="inv-form-grid">
          {field("clientName", form.clientName, e => set("clientName", e.target.value), "Client's Name")}
          {field("clientEmail", form.clientEmail, e => set("clientEmail", e.target.value), "Client's Email", "email", "e.g. email@example.com")}
          {field("clientStreet", form.clientStreet, e => set("clientStreet", e.target.value), "Street Address")}
        </div>
        <div className="inv-form-grid c3">
          {field("clientCity", form.clientCity, e => set("clientCity", e.target.value), "City")}
          {field("clientPostCode", form.clientPostCode, e => set("clientPostCode", e.target.value), "Post Code")}
          {field("clientCountry", form.clientCountry, e => set("clientCountry", e.target.value), "Country")}
        </div>

        {/* Dates & Description */}
        <div className="inv-form-grid c2" style={{ marginTop: 24 }}>
          <div className="inv-field">
            <label htmlFor="form-createdAt">Invoice Date</label>
            <input
              id="form-createdAt" type="date"
              className="inv-input"
              value={form.createdAt}
              onChange={e => set("createdAt", e.target.value)}
            />
          </div>
          <div className="inv-field">
            <label htmlFor="form-paymentTerms">Payment Terms</label>
            <select
              id="form-paymentTerms"
              className="inv-input"
              value={form.paymentTerms}
              onChange={e => set("paymentTerms", e.target.value)}
            >
              {[1, 7, 14, 30].map(d => (
                <option key={d} value={d}>Net {d} {d === 1 ? "Day" : "Days"}</option>
              ))}
            </select>
          </div>
          <div className={`inv-field${errors.description ? " err" : ""}`} style={{ gridColumn: "1/-1" }}>
            <label htmlFor="form-description">Project Description</label>
            <input
              id="form-description"
              className={`inv-input${errors.description ? " err" : ""}`}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="e.g. Graphic Design Service"
              aria-invalid={!!errors.description}
            />
            {errors.description && <span className="inv-field-err" role="alert">{errors.description}</span>}
          </div>
        </div>

        {/* Items */}
        <p className="inv-items-sec-title" style={{ marginTop: 40 }}>Item List</p>
        {errors.items && <p className="inv-form-err-banner" role="alert">{errors.items}</p>}
        
        <div className="inv-item-row">
            <span className="inv-item-lbl">Item Name</span>
            <span className="inv-item-lbl">Qty.</span>
            <span className="inv-item-lbl">Price</span>
            <span className="inv-item-lbl">Total</span>
        </div>

        {form.items.map((item, idx) => (
          <div key={idx} className="inv-item-row">
            <div>
              <span style={{ display: "none" }} id={`ilbl-name-${idx}`}>Item Name</span>
              <input
                aria-labelledby={`ilbl-name-${idx}`}
                className={`inv-input${errors[`iname${idx}`] ? " err" : ""}`}
                value={item.name}
                onChange={e => setItem(idx, "name", e.target.value)}
                aria-invalid={!!errors[`iname${idx}`]}
              />
              {errors[`iname${idx}`] && <span className="inv-field-err" role="alert">{errors[`iname${idx}`]}</span>}
            </div>
            <div>
              <span style={{ display: "none" }} id={`ilbl-qty-${idx}`}>Qty.</span>
              <input
                aria-labelledby={`ilbl-qty-${idx}`}
                type="number" min="1"
                className={`inv-input${errors[`iqty${idx}`] ? " err" : ""}`}
                value={item.quantity}
                onChange={e => setItem(idx, "quantity", e.target.value)}
              />
            </div>
            <div>
              <span style={{ display: "none" }} id={`ilbl-price-${idx}`}>Price</span>
              <input
                aria-labelledby={`ilbl-price-${idx}`}
                type="number" min="0" step="0.01"
                className={`inv-input${errors[`iprice${idx}`] ? " err" : ""}`}
                value={item.price}
                onChange={e => setItem(idx, "price", e.target.value)}
              />
            </div>
            <div>
              <span style={{ display: "none" }}>Total</span>
              <div className="inv-item-total-disp" aria-label={`Item total: ${formatCurrency(item.total)}`}>
                {formatCurrency(item.total)}
              </div>
            </div>
            <button
              type="button"
              className="inv-del-item"
              onClick={() => removeItem(idx)}
              aria-label={`Remove item: ${item.name || `item ${idx + 1}`}`}
            >
              <TrashIcon />
            </button>
          </div>
        ))}

        <button type="button" className="inv-add-item" onClick={addItem} aria-label="Add new item">
          + Add New Item
        </button>

        {/* Footer */}
        <div className="inv-drawer-footer">
          {mode === "create" ? (
            <>
              <button className="inv-btn inv-btn-secondary" onClick={onClose} type="button">Discard</button>
              <div className="sp" />
              <button className="inv-btn inv-btn-ghost" onClick={() => handleSave("draft")} type="button">Save as Draft</button>
              <button className="inv-btn inv-btn-primary" onClick={() => handleSave("pending")} type="button">Save & Send</button>
            </>
          ) : (
            <>
              <button className="inv-btn inv-btn-secondary" onClick={onClose} type="button">Cancel</button>
              <div className="sp" />
              <button
                className="inv-btn inv-btn-primary"
                onClick={() => handleSave(invoice.status === "draft" ? "draft" : invoice.status)}
                type="button"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceForm;