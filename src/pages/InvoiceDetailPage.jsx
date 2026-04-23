import StatusBadge from '../components/StatusBadge';
import { ChevronRight } from '../components/Icons';
import { formatDate, formatCurrency } from '../utils/helpers';

// ─── Invoice Detail Page ──────────────────────────────────────────────────────

const InvoiceDetailPage = ({ invoice, onBack, onEdit, onDelete, onMarkPaid }) => (
  <div className="inv-page" style={{ paddingBottom: 100 }}>
    <button className="inv-back-btn" onClick={onBack} type="button">
      <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><ChevronRight /></span>
      Go back
    </button>

    <div className="inv-status-bar">
      <div className="inv-status-left">
        <span className="inv-status-label">Status</span>
        <StatusBadge status={invoice.status} />
      </div>
      <div className="inv-detail-actions">
        {invoice.status !== "paid" && (
          <button className="inv-btn inv-btn-secondary" onClick={onEdit} type="button">Edit</button>
        )}
        <button className="inv-btn inv-btn-danger" onClick={onDelete} type="button">Delete</button>
        {invoice.status === "pending" && (
          <button className="inv-btn inv-btn-primary" onClick={onMarkPaid} type="button">Mark as Paid</button>
        )}
        {invoice.status === "draft" && (
          <button className="inv-btn inv-btn-primary" onClick={onMarkPaid} type="button">Send Invoice</button>
        )}
      </div>
    </div>

    <div className="inv-detail-body">
      <div className="inv-detail-top">
        <div>
          <div className="inv-detail-id"><span>#</span>{invoice.id}</div>
          <div className="inv-detail-desc">{invoice.description}</div>
        </div>
        <div className="inv-sender-addr">
          <div className="inv-addr-text">
            {invoice.senderAddress?.street}<br />
            {invoice.senderAddress?.city}<br />
            {invoice.senderAddress?.postCode}<br />
            {invoice.senderAddress?.country}
          </div>
        </div>
      </div>

      <div className="inv-meta">
        <div>
          <div style={{ marginBottom: 32 }}>
            <span className="inv-meta-label">Invoice Date</span>
            <div className="inv-meta-val">{formatDate(invoice.createdAt)}</div>
          </div>
          <div>
            <span className="inv-meta-label">Payment Due</span>
            <div className="inv-meta-val">{formatDate(invoice.paymentDue)}</div>
          </div>
        </div>
        <div>
          <span className="inv-meta-label">Bill To</span>
          <div className="inv-meta-val" style={{ marginBottom: 8 }}>{invoice.clientName}</div>
          <div className="inv-meta-val-sm">
            {invoice.clientAddress?.street}<br />
            {invoice.clientAddress?.city}<br />
            {invoice.clientAddress?.postCode}<br />
            {invoice.clientAddress?.country}
          </div>
        </div>
        <div>
          <span className="inv-meta-label">Sent To</span>
          <div className="inv-meta-val" style={{ overflowWrap: "break-word" }}>{invoice.clientEmail}</div>
        </div>
      </div>

      <div className="inv-items">
        <div className="inv-items-head" aria-hidden="true">
          <span>Item Name</span>
          <span style={{ textAlign: "center" }}>QTY.</span>
          <span style={{ textAlign: "right" }}>Price</span>
          <span style={{ textAlign: "right" }}>Total</span>
        </div>
        <table style={{ display: "none" }} aria-label="Invoice items">
            <thead>
                <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {invoice.items?.map((item, i) => (
                <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.total)}</td>
                </tr>
                ))}
            </tbody>
        </table>
        {invoice.items?.map((item, i) => (
          <div key={i} className="inv-items-row" aria-label={`${item.name}: ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(item.total)}`}>
            <span className="inv-item-name">{item.name}</span>
            <span className="inv-item-qty">{item.quantity}</span>
            <span className="inv-item-price">{formatCurrency(item.price)}</span>
            <span className="inv-item-total">{formatCurrency(item.total)}</span>
          </div>
        ))}
        <div className="inv-items-total">
          <span className="inv-items-total-lbl">Amount Due</span>
          <span className="inv-items-total-amt">{formatCurrency(invoice.total)}</span>
        </div>
      </div>
    </div>
  </div>
);

export default InvoiceDetailPage;