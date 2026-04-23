// ─── Empty Illustration ───────────────────────────────────────────────────────

const EmptyIllustration = () => (
  <svg width="241" height="200" viewBox="0 0 241 200" fill="none">
    <ellipse cx="120.5" cy="188" rx="120.5" ry="12" fill="#7C5DFA" fillOpacity="0.07"/>
    <rect x="60" y="30" width="121" height="160" rx="16" fill="#7C5DFA" fillOpacity="0.05" stroke="#7C5DFA" strokeOpacity="0.15" strokeWidth="1.5"/>
    <rect x="80" y="55" width="81" height="10" rx="5" fill="#7C5DFA" fillOpacity="0.18"/>
    <rect x="80" y="76" width="55" height="7" rx="3.5" fill="#7C5DFA" fillOpacity="0.1"/>
    <rect x="80" y="110" width="81" height="7" rx="3.5" fill="#7C5DFA" fillOpacity="0.18"/>
    <rect x="80" y="128" width="65" height="7" rx="3.5" fill="#7C5DFA" fillOpacity="0.1"/>
    <rect x="80" y="146" width="45" height="7" rx="3.5" fill="#7C5DFA" fillOpacity="0.1"/>
    <circle cx="89" cy="59" r="12" fill="#7C5DFA" fillOpacity="0.25"/>
    <path d="M86 59l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmptyState = ({ hasFilter }) => (
  <div className="inv-empty">
    <EmptyIllustration />
    <h2>There is nothing here</h2>
    <p>
      {hasFilter
        ? "No invoices match your filter. Try a different status."
        : "Create an invoice by clicking the New Invoice button and get started."}
    </p>
  </div>
);

export default EmptyState;