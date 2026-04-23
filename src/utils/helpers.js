import { useEffect } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const genId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const l = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return l + n;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount || 0);

const addDays = (dateStr, days) => {
  const d = new Date((dateStr || new Date().toISOString().split("T")[0]) + "T00:00:00");
  d.setDate(d.getDate() + parseInt(days));
  return d.toISOString().split("T")[0];
};

const todayStr = () => new Date().toISOString().split("T")[0];

const SAMPLE_INVOICES = [
  {
    id: "RT3080", createdAt: "2021-08-18", paymentDue: "2021-09-19", description: "Re-branding",
    paymentTerms: 1, clientName: "Jensen Huang", clientEmail: "jensenh@mail.com", status: "paid",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "106 Kendell Street", city: "Sharrington", postCode: "NR24 5WQ", country: "United Kingdom" },
    items: [{ name: "Brand Guidelines", quantity: 1, price: 1800.90, total: 1800.90 }], total: 1800.90
  },
  {
    id: "XM9141", createdAt: "2021-08-21", paymentDue: "2021-09-20", description: "Graphic Design",
    paymentTerms: 30, clientName: "Alex Grim", clientEmail: "alexgrim@mail.com", status: "pending",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "84 Church Way", city: "Bradford", postCode: "BD1 9PB", country: "United Kingdom" },
    items: [
      { name: "Banner Design", quantity: 1, price: 156.00, total: 156.00 },
      { name: "Email Design", quantity: 2, price: 200.00, total: 400.00 }
    ], total: 556.00
  },
  {
    id: "RG0314", createdAt: "2021-09-24", paymentDue: "2021-10-01", description: "Website Redesign",
    paymentTerms: 7, clientName: "John Morrison", clientEmail: "jm@myco.com", status: "paid",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "2 Hart Road", city: "Belper", postCode: "DE56 2AY", country: "United Kingdom" },
    items: [{ name: "Website Redesign", quantity: 1, price: 14002.33, total: 14002.33 }], total: 14002.33
  },
  {
    id: "AA1449", createdAt: "2021-10-07", paymentDue: "2021-10-14", description: "UX Consultation",
    paymentTerms: 7, clientName: "Alysa Werner", clientEmail: "alysawerner@email.com", status: "pending",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "63 Warwick Road", city: "Carlisle", postCode: "CA20 2TF", country: "United Kingdom" },
    items: [{ name: "UX Research", quantity: 20, price: 15.00, total: 300.00 }], total: 300.00
  },
  {
    id: "TY9141", createdAt: "2021-10-01", paymentDue: "2021-10-31", description: "Logo Redesign",
    paymentTerms: 30, clientName: "Mellisa Clarke", clientEmail: "mellisa.clarke@example.com", status: "draft",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "46 Abbey Row", city: "Cambridge", postCode: "CB5 6EG", country: "United Kingdom" },
    items: [{ name: "Logo Redesign", quantity: 1, price: 3102.04, total: 3102.04 }], total: 3102.04
  },
];

// ─── Global Styles Injector ───────────────────────────────────────────────────

const useGlobalStyles = (theme) => {
  useEffect(() => {
    const id = "invoice-app-styles";
    let el = document.getElementById(id);
    if (!el) { el = document.createElement("style"); el.id = id; document.head.appendChild(el); }
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --purple: #7C5DFA;
        --purple-l: #9277FF;
        --red: #EC5757;
        --red-l: #FF9797;
        --paid: #33D69F;
        --pending: #FF8F00;
        --transition: all 0.2s ease;
        --radius: 8px;
        --radius-lg: 12px;
        --font: 'League Spartan', sans-serif;
        ${theme === "dark" ? `
          --bg: #141625; --bg2: #1E2139; --bg3: #252945; --bg4: #0C0E16;
          --text1: #FFFFFF; --text2: #DFE3FA; --text3: #888EB0; --text4: #7E88C3;
          --border: #252945; --input-bg: #1E2139; --sidebar: #1E2139;
          --card-hover: #252945; --overlay: rgba(0,0,0,0.55);
          --draft-c: #DFE3FA; --draft-bg: rgba(223,227,250,0.06);
          --btn-sec-bg: #252945; --btn-sec-c: #DFE3FA; --btn-sec-hover: #0C0E16;
          --total-bg: #0C0E16;
        ` : `
          --bg: #F8F8FB; --bg2: #FFFFFF; --bg3: #F9FAFE; --bg4: #F8F8FB;
          --text1: #0C0E16; --text2: #373B53; --text3: #888EB0; --text4: #7E88C3;
          --border: #DFE3FA; --input-bg: #FFFFFF; --sidebar: #373B53;
          --card-hover: #F9FAFE; --overlay: rgba(0,0,0,0.5);
          --draft-c: #373B53; --draft-bg: rgba(55,59,83,0.06);
          --btn-sec-bg: #F9FAFE; --btn-sec-c: #7E88C3; --btn-sec-hover: #DFE3FA;
          --total-bg: #373B53;
        `}
      }
      body { font-family: var(--font); background: var(--bg); color: var(--text1); -webkit-font-smoothing: antialiased; }
      input,select,textarea,button { font-family: var(--font); }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      .inv-layout { display: flex; min-height: 100vh; }

      /* SIDEBAR */
      .inv-sidebar {
        position: fixed; top: 0; left: 0; width: 103px; height: 100vh;
        background: var(--sidebar); display: flex; flex-direction: column;
        align-items: center; justify-content: space-between;
        z-index: 200; border-radius: 0 20px 20px 0; overflow: hidden; flex-shrink: 0;
      }
      .inv-logo {
        width: 103px; height: 103px; background: var(--purple);
        display: flex; align-items: center; justify-content: center;
        position: relative; border-radius: 0 0 20px 0; cursor: pointer;
      }
      .inv-logo::after {
        content:''; position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
        background: var(--purple-l); border-radius: 20px 0 20px 0;
      }
      .inv-logo svg { position: relative; z-index: 1; }
      .inv-sidebar-bottom { display: flex; flex-direction: column; align-items: center; gap: 24px; padding-bottom: 28px; }
      .inv-divider { width: 103px; height: 1px; background: rgba(255,255,255,0.1); }
      .inv-theme-btn {
        background: none; border: none; cursor: pointer; padding: 8px;
        color: var(--text4); transition: var(--transition);
        display: flex; align-items: center; justify-content: center;
      }
      .inv-theme-btn:hover { color: var(--text2); }
      .inv-avatar {
        width: 40px; height: 40px; border-radius: 50%;
        background: linear-gradient(135deg, var(--purple), var(--purple-l));
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: 700; font-size: 14px;
      }

      /* MAIN */
      .inv-main { flex: 1; margin-left: 103px; }
      .inv-page { max-width: 780px; margin: 0 auto; padding: 72px 24px 80px; }

      /* LIST HEADER */
      .inv-list-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
      .inv-title h1 { font-size: 32px; font-weight: 700; color: var(--text1); letter-spacing: -1px; }
      .inv-title p { font-size: 13px; color: var(--text3); margin-top: 4px; }
      .inv-controls { display: flex; align-items: center; gap: 18px; }

      /* FILTER */
      .inv-filter-wrap { position: relative; }
      .inv-filter-btn {
        background: none; border: none; cursor: pointer;
        display: flex; align-items: center; gap: 12px;
        color: var(--text1); font-weight: 700; font-size: 15px;
        letter-spacing: -0.25px; padding: 4px; transition: var(--transition);
      }
      .inv-filter-btn:hover { color: var(--purple); }
      .inv-filter-btn svg { transition: transform 0.2s; }
      .inv-filter-btn.open svg { transform: rotate(180deg); }
      .inv-filter-drop {
        position: absolute; top: calc(100% + 16px); left: 50%;
        transform: translateX(-50%);
        background: var(--bg2); border-radius: 8px;
        box-shadow: 0 20px 48px rgba(0,0,0,0.25);
        padding: 24px; min-width: 192px; z-index: 50;
        animation: invFadeD 0.15s ease;
      }
      @keyframes invFadeD {
        from { opacity:0; transform: translateX(-50%) translateY(-8px); }
        to   { opacity:1; transform: translateX(-50%) translateY(0); }
      }
      .inv-filter-opt {
        display: flex; align-items: center; gap: 13px;
        cursor: pointer; padding: 4px 0;
        font-size: 15px; font-weight: 700; color: var(--text1);
        letter-spacing: -0.25px; transition: var(--transition); user-select: none;
      }
      .inv-filter-opt:not(:last-child) { margin-bottom: 16px; }
      .inv-filter-opt:hover { color: var(--purple); }
      .inv-check {
        width: 16px; height: 16px; border-radius: 2px;
        border: 2px solid var(--border); background: var(--bg3);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: var(--transition);
      }
      .inv-check.on { background: var(--purple); border-color: var(--purple); }

      /* NEW BTN */
      .inv-new-btn {
        display: flex; align-items: center; gap: 16px;
        background: var(--purple); border: none; border-radius: 24px;
        padding: 8px 14px 8px 8px; cursor: pointer;
        color: white; font-weight: 700; font-size: 15px;
        letter-spacing: -0.25px; transition: var(--transition); white-space: nowrap;
      }
      .inv-new-btn:hover { background: var(--purple-l); }
      .inv-new-icon {
        width: 32px; height: 32px; border-radius: 50%; color: var(--purple);
        background: white; display: flex; align-items: center; justify-content: center;
      }

      /* CARD */
      .inv-card {
        background: var(--bg2); border-radius: var(--radius-lg);
        padding: 16px 24px;
        display: grid; grid-template-columns: 120px 1fr 1fr auto auto auto;
        align-items: center; gap: 16px;
        cursor: pointer; border: 1px solid transparent;
        transition: var(--transition);
      }
      .inv-card:hover { border-color: var(--purple); }
      .inv-card:focus { border: none; outline: 2px solid var(--purple); outline-offset: 2px; }
      .inv-card-id { font-weight: 700; font-size: 15px; color: var(--text1); letter-spacing: -0.25px; }
      .inv-card-id span { color: var(--text4); }
      .inv-card-due { font-size: 13px; color: var(--text3); }
      .inv-card-client { font-size: 13px; color: var(--text3); }
      .inv-card-amt { font-weight: 700; font-size: 16px; color: var(--text1); letter-spacing: -0.8px; }
      .inv-card-arr { color: var(--purple); }
      .inv-list-wrap { display: flex; flex-direction: column; gap: 16px; }

      /* STATUS BADGE */
      .inv-badge {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 12px 18px; border-radius: 6px;
        font-weight: 700; font-size: 13px; letter-spacing: -0.1px;
        min-width: 104px; justify-content: center;
      }
      .inv-badge::before { content:''; width: 8px; height: 8px; border-radius: 50%; }
      .inv-badge-paid { background: rgba(51,214,159,0.06); color: var(--paid); }
      .inv-badge-paid::before { background: var(--paid); }
      .inv-badge-pending { background: rgba(255,143,0,0.06); color: var(--pending); }
      .inv-badge-pending::before { background: var(--pending); }
      .inv-badge-draft { background: var(--draft-bg); color: var(--draft-c); }
      .inv-badge-draft::before { background: var(--draft-c); }

      /* EMPTY */
      .inv-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 80px; }
      .inv-empty h2 { font-size: 24px; font-weight: 700; color: var(--text1); letter-spacing: -0.75px; margin: 40px 0 24px; }
      .inv-empty p { font-size: 13px; color: var(--text3); max-width: 200px; line-height: 1.8; }

      /* DETAIL */
      .inv-back-btn {
        display: flex; align-items: center; gap: 24px;
        margin-bottom: 32px; cursor: pointer;
        background: none; border: none;
        font-weight: 700; font-size: 15px; color: var(--text1);
        letter-spacing: -0.25px; transition: var(--transition); padding: 0;
      }
      .inv-back-btn:hover { color: var(--text4); }
      .inv-back-btn:focus { outline: 2px solid var(--purple); outline-offset: 2px; border-radius: 4px; }
      .inv-status-bar {
        background: var(--bg2); border-radius: var(--radius-lg);
        padding: 20px 32px; display: flex; align-items: center;
        justify-content: space-between; margin-bottom: 24px;
      }
      .inv-status-left { display: flex; align-items: center; gap: 20px; }
      .inv-status-label { font-size: 13px; color: var(--text3); }
      .inv-detail-actions { display: flex; gap: 8px; }
      .inv-detail-body { background: var(--bg2); border-radius: var(--radius-lg); padding: 48px; }
      .inv-detail-top { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 32px; }
      .inv-detail-id { font-size: 16px; font-weight: 700; color: var(--text1); letter-spacing: -0.8px; }
      .inv-detail-id span { color: var(--text4); }
      .inv-detail-desc { font-size: 13px; color: var(--text3); margin-top: 4px; }
      .inv-sender-addr { text-align: right; }
      .inv-addr-text { font-size: 11px; color: var(--text3); line-height: 2; letter-spacing: -0.23px; }
      .inv-meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; margin-bottom: 48px; }
      .inv-meta-label { font-size: 13px; color: var(--text3); display: block; margin-bottom: 8px; }
      .inv-meta-val { font-size: 15px; font-weight: 700; color: var(--text1); letter-spacing: -0.25px; }
      .inv-meta-val-sm { font-size: 13px; color: var(--text3); line-height: 2; }

      /* ITEMS TABLE */
      .inv-items { background: var(--bg3); border-radius: var(--radius-lg); overflow: hidden; }
      .inv-items-head {
        display: grid; grid-template-columns: 1fr 80px 120px 120px;
        padding: 20px 32px; font-size: 13px; color: var(--text3);
      }
      .inv-items-row {
        display: grid; grid-template-columns: 1fr 80px 120px 120px;
        padding: 8px 32px; align-items: center;
      }
      .inv-items-row:last-child { padding-bottom: 20px; }
      .inv-item-name { font-weight: 700; color: var(--text1); font-size: 15px; letter-spacing: -0.25px; }
      .inv-item-qty { font-weight: 700; color: var(--text3); font-size: 15px; text-align: center; }
      .inv-item-price { font-weight: 700; color: var(--text3); font-size: 15px; text-align: right; }
      .inv-item-total { font-weight: 700; color: var(--text1); font-size: 15px; text-align: right; }
      .inv-items-total {
        background: var(--total-bg); border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; color: white;
      }
      .inv-items-total-lbl { font-size: 13px; }
      .inv-items-total-amt { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }

      /* BUTTONS */
      .inv-btn {
        border: none; border-radius: 24px; padding: 16px 24px;
        font-size: 15px; font-weight: 700; cursor: pointer;
        letter-spacing: -0.25px; transition: var(--transition);
        display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;
      }
      .inv-btn:focus { outline: 2px solid var(--purple); outline-offset: 2px; }
      .inv-btn-primary { background: var(--purple); color: white; }
      .inv-btn-primary:hover { background: var(--purple-l); }
      .inv-btn-secondary { background: var(--btn-sec-bg); color: var(--btn-sec-c); }
      .inv-btn-secondary:hover { background: var(--btn-sec-hover); }
      .inv-btn-danger { background: var(--red); color: white; }
      .inv-btn-danger:hover { background: var(--red-l); }
      .inv-btn-ghost { background: var(--sidebar); color: var(--btn-sec-c); border: 1px solid var(--border); }
      .inv-btn-ghost:hover { background: var(--bg3); }
      
      /* DRAWER */
      .inv-overlay {
        position: fixed; inset: 0; background: var(--overlay); z-index: 100;
        animation: invFadeIn 0.2s ease;
      }
      @keyframes invFadeIn { from { opacity:0; } to { opacity:1; } }
      .inv-drawer {
        position: fixed; top: 0; left: 83px; bottom: 0;
        width: min(636px, calc(100vw - 83px));
        background: var(--bg); z-index: 110; overflow-y: auto;
        padding: 56px 56px 56px 76px;
        border-radius: 0 20px 20px 0;
        animation: invSlide 0.3s cubic-bezier(0.32,0.72,0,1);
      }
      @keyframes invSlide { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      .inv-drawer h2 { font-size: 24px; font-weight: 700; color: var(--text1); letter-spacing: -0.5px; margin-bottom: 48px; }
      .inv-drawer h2 span { color: var(--text4); }
      .inv-form-section { font-size: 13px; font-weight: 700; color: var(--purple); margin-bottom: 24px; letter-spacing: -0.1px; }
      .inv-form-grid { display: grid; gap: 24px; margin-bottom: 24px; }
      .inv-form-grid.c2 { grid-template-columns: 1fr 1fr; }
      .inv-form-grid.c3 { grid-template-columns: 1fr 1fr 1fr; }
      .inv-field { display: flex; flex-direction: column; gap: 10px; }
      .inv-field label { font-size: 13px; color: var(--text3); font-weight: 500; letter-spacing: -0.1px; }
      .inv-field.err label { color: var(--red); }
      .inv-input {
        background: var(--input-bg); border: 1px solid var(--border); border-radius: 4px;
        padding: 14px 20px; font-size: 15px; font-weight: 700; color: var(--text1);
        letter-spacing: -0.25px; transition: var(--transition); width: 100%; outline: none;
      }
      .inv-input:focus { border-color: var(--purple); }
      .inv-input.err { border-color: var(--red); }
      .inv-input::placeholder { color: var(--text4); font-weight: 400; }
      .inv-field-err { font-size: 11px; color: var(--red); letter-spacing: -0.23px; }
      .inv-items-sec-title { font-size: 18px; font-weight: 700; color: var(--text3); letter-spacing: -0.38px; margin-bottom: 16px; }
      .inv-item-row {
        display: grid; grid-template-columns: 2fr 60px 1fr 100px 20px;
        gap: 16px; align-items: right; margin-bottom: 18px;
      }
      .inv-item-lbl { font-size: 13px; color: var(--text3); margin-bottom: 10px; display: block; }
      .inv-item-row input { padding: 10px; }
      .inv-item-total-disp { font-size: 15px; font-weight: 700; color: var(--text4); padding: 14px 0; }
      .inv-del-item { background: none; border: none; cursor: pointer; color: var(--text4); transition: var(--transition); }
      .inv-del-item:hover { color: var(--red); }
      .inv-del-item:focus { outline: 2px solid var(--red); outline-offset: 2px; border-radius: 4px; }
      .inv-add-item {
        width: 100%; background: var(--btn-sec-bg); border: none; border-radius: 24px;
        color: var(--btn-sec-c); font-size: 15px; font-weight: 700;
        padding: 18px; cursor: pointer; transition: var(--transition);
        margin-bottom: 40px; letter-spacing: -0.25px;
      }
      .inv-add-item:hover { background: var(--btn-sec-hover); }
      .inv-form-err-banner { font-size: 11px; color: var(--red); margin-bottom: 8px; }
      .inv-drawer-footer {
        position: sticky; bottom: 0; background: var(--bg);
        padding: 20px 0 0; display: flex; gap: 8px;
        box-shadow: 0 -10px 20px var(--bg);
      }
      .inv-drawer-footer .sp { flex: 1; }
      
      /* MODAL */
      .inv-modal-overlay {
        position: fixed; inset: 0; background: var(--overlay); z-index: 300;
        display: flex; align-items: center; justify-content: center; padding: 24px;
        animation: invFadeIn 0.15s ease;
      }
      .inv-modal {
        background: var(--bg2); border-radius: 8px; padding: 48px;
        max-width: 480px; width: 100%;
        animation: invScale 0.2s cubic-bezier(0.34,1.56,0.64,1);
      }
      @keyframes invScale { from { opacity:0; transform: scale(0.92); } to { opacity:1; transform: scale(1); } }
      .inv-modal h2 { font-size: 24px; font-weight: 700; color: var(--text1); letter-spacing: -0.5px; margin-bottom: 8px; }
      .inv-modal p { font-size: 13px; color: var(--text3); line-height: 1.8; margin-bottom: 8px; }
      .inv-modal-acts { display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px; }



      /* RESPONSIVE */
      @media (max-width: 1024px) {
        .inv-sidebar {
          width: 100%; height: 72px; border-radius: 0;
          flex-direction: row; padding: 0 24px 0 0;
          top: 0; left: 0; right: 0; bottom: auto;
        }
        .inv-logo { width: 72px; height: 72px; border-radius: 0 16px 16px 0; }
        .inv-sidebar-bottom { flex-direction: row; padding: 0; gap: 20px; }
        .inv-divider { width: 1px; height: 72px; }
        .inv-main { flex: 1; margin: 0; }
        .inv-page { margin: 72px auto auto; }
        .inv-drawer {
          top: 72px; left: 0; padding: 56px;
          width: min(616px, calc(100vw - 0));
        }
      }

      @media (max-width: 768px) {
        .inv-drawer { left: 0; width: 100%; border-radius: 0; padding: 32px 24px 120px; }
        .inv-page { padding: 48px 24px 80px; }

        .inv-detail-body { padding: 24px; }
        .inv-detail-top { grid-template-columns: 1fr; }
        .inv-sender-addr { text-align: left; margin-top: 32px; }
        .inv-meta { grid-template-columns: 1fr 1fr; }
        .inv-items-head { display: none; }
        .inv-items-row { grid-template-columns: 1fr auto; padding: 16px 24px; }
        .inv-item-qty, .inv-item-price { display: none; }
        .inv-card { grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 8px; padding: 24px; }
        .inv-card-id { grid-column: 1; grid-row: 1; }
        .inv-card-client { grid-column: 2; grid-row: 1; text-align: right; }
        .inv-card-due { grid-column: 1; grid-row: 2; }
        .inv-card-amt { grid-column: 1; grid-row: 3; font-size: 18px; }
        .inv-badge { grid-column: 2; grid-row: 2 / span 2; align-self: center; }
        .inv-card-arr { display: none; }
        .inv-status-bar { flex-wrap: wrap; gap: 16px; }
        .inv-status-left { width: 100%; justify-content: space-between; }
        .inv-detail-actions { width: 100%; justify-content: center; flex-wrap: wrap; }
      }
      @media (max-width: 480px) {
        .inv-form-grid.c2 { grid-template-columns: 1fr; }
        .inv-form-grid.c3 { grid-template-columns: 1fr 1fr; }
        .inv-item-row { grid-template-columns: 1fr 56px 80px 32px; gap: 10px; }
        .inv-title h1 { font-size: 22px; }
        .inv-new-btn span:not(.inv-new-icon) { display: none; }
        .inv-filter-btn span { display: none; }
      }
    `;
  }, [theme]);
};


export { genId, formatDate, formatCurrency, addDays, todayStr, SAMPLE_INVOICES, useGlobalStyles };