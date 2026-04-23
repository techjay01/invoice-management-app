// ─── Invoice Card ─────────────────────────────────────────────────────────────

import StatusBadge from './StatusBadge';
import { formatDate, formatCurrency } from '../utils/helpers';
import { ChevronRight } from './Icons';

const InvoiceCard = ({ invoice, onSelect }) => (
  <div
    className="inv-card"
    onClick={() => onSelect(invoice.id)}
    role="button"
    tabIndex={0}
    onKeyDown={e => (e.key === "Enter" || e.key === " ") && onSelect(invoice.id)}
    aria-label={`Invoice ${invoice.id} for ${invoice.clientName}, total ${formatCurrency(invoice.total)}, status ${invoice.status}`}
  >
    <span className="inv-card-id"><span>#</span>{invoice.id}</span>
    <span className="inv-card-due">Due {formatDate(invoice.paymentDue)}</span>
    <span className="inv-card-client">{invoice.clientName}</span>
    <span className="inv-card-amt">{formatCurrency(invoice.total)}</span>
    <StatusBadge status={invoice.status} />
    <span className="inv-card-arr"><ChevronRight /></span>
  </div>
);

export default InvoiceCard;