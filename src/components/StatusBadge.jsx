// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span className={`inv-badge inv-badge-${status}`} aria-label={`Status: ${status}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default StatusBadge;