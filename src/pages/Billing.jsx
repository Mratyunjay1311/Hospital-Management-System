/**
 * ============================================
 * BILLING & INVOICES PAGE
 * ============================================
 * Generates and prints PDF invoices.
 */

import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import EmptyState from "../components/shared/EmptyState";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Plus, Search, Printer, IndianRupee, Loader2, X, Receipt
} from "lucide-react";

const Billing = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printing, setPrinting] = useState(false);
  
  const printRef = useRef();

  const [form, setForm] = useState({
    patientId: "", paymentMethod: "cash", discount: 0, notes: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }]
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/billing");
      setInvoices(data.data.billings);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get("/patients", { params: { limit: 100 } });
        setPatients(data.data.patients || []);
      } catch {}
    };
    fetchPatients();
  }, []);

  const resetForm = () => {
    setForm({
      patientId: "", paymentMethod: "cash", discount: 0, notes: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }]
    });
    setShowForm(false);
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { description: "", quantity: 1, unitPrice: 0 }] });
  
  const updateItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = field === 'description' ? value : Number(value);
    setForm({ ...form, items: newItems });
  };
  
  const removeItem = (index) => setForm({ ...form, items: form.items.filter((_, i) => i !== index) });

  const calculateTotal = () => {
    const subTotal = form.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = (subTotal * 18) / 100;
    return subTotal + taxAmount - Number(form.discount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.items[0].description) return toast.error("Fill required fields");
    setSubmitting(true);
    try {
      await api.post("/billing", form);
      toast.success("Invoice generated");
      resetForm();
      fetchInvoices();
    } catch {
      toast.error("Failed to generate invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const markAsPaid = async (id) => {
    try {
      await api.patch(`/billing/${id}/pay`, { paymentStatus: "paid" });
      toast.success("Payment marked as paid");
      fetchInvoices();
    } catch {
      toast.error("Failed to update payment");
    }
  };

  const generatePDF = async () => {
    if (!printRef.current) return;
    setPrinting(true);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${selectedInvoice.invoiceNumber}.pdf`);
      toast.success("PDF Downloaded!");
    } catch (error) {
      toast.error("Failed to generate PDF");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage invoices and payments</p>
        </div>
        {["admin", "receptionist"].includes(user?.role) && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm">
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Generate Invoice</h2>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient *</label>
                <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                  <option value="">Select Patient</option>
                  {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Line Items</label>
                  <button type="button" onClick={addItem} className="text-sm text-blue-600 font-medium">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} required placeholder="Description (e.g. Consultation)" className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm" />
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} min="1" className="w-20 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm" placeholder="Qty" />
                      <input type="number" value={item.unitPrice} onChange={(e) => updateItem(i, "unitPrice", e.target.value)} min="0" className="w-24 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm" placeholder="Price" />
                      {form.items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="text-red-500 p-2"><X className="w-4 h-4" /></button>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount (₹)</label>
                  <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} min="0" className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                  <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white">
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg flex justify-between items-center border border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Estimated Total (incl. 18% GST)</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">₹{calculateTotal().toFixed(2)}</span>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                {submitting ? "Generating..." : "Generate Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal (for Printing) */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
             <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-10">
               <h2 className="font-semibold text-gray-900 dark:text-white">Invoice Preview</h2>
               <div className="flex gap-2">
                 <button onClick={generatePDF} disabled={printing} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                   {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />} Download PDF
                 </button>
                 <button onClick={() => setSelectedInvoice(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><X className="w-5 h-5" /></button>
               </div>
             </div>
             
             {/* Printable Area */}
             <div ref={printRef} className="p-8 bg-white text-gray-900">
                <div className="flex justify-between items-start border-b pb-6 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-blue-600">MedCare Hospital</h1>
                    <p className="text-sm text-gray-500 mt-1">123 Health Avenue, Medical District</p>
                    <p className="text-sm text-gray-500">Phone: +91 99999 99999</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                    <p className="font-medium text-gray-600 mt-1">{selectedInvoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <p className="text-sm font-semibold text-gray-500 uppercase">Bill To:</p>
                  <p className="font-medium text-lg">{selectedInvoice.patientId?.name}</p>
                  <p className="text-sm text-gray-600">{selectedInvoice.patientId?.email}</p>
                  <p className="text-sm text-gray-600">{selectedInvoice.patientId?.phone}</p>
                </div>
                
                <table className="w-full mb-8 text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 border-b-2 font-semibold">Description</th>
                      <th className="p-3 border-b-2 font-semibold text-center">Qty</th>
                      <th className="p-3 border-b-2 font-semibold text-right">Price</th>
                      <th className="p-3 border-b-2 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">₹{item.unitPrice}</td>
                        <td className="p-3 text-right">₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="w-1/2 ml-auto space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span className="font-medium">₹{selectedInvoice.subTotal}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax (18%):</span><span className="font-medium">₹{selectedInvoice.taxAmount}</span></div>
                  {selectedInvoice.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span>-₹{selectedInvoice.discount}</span></div>}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2"><span>Total:</span><span>₹{selectedInvoice.totalAmount}</span></div>
                </div>
                
                <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
                  <p>Thank you for choosing MedCare Hospital.</p>
                  <p>Status: {selectedInvoice.paymentStatus.toUpperCase()} via {selectedInvoice.paymentMethod}</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : invoices.length === 0 ? (
        <EmptyState icon="default" title="No invoices" description="Create an invoice to see it here." />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{inv.patientId?.name || "Unknown"}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">₹{inv.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${inv.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>
                      {inv.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.paymentStatus === 'unpaid' && user?.role === 'admin' && (
                        <button onClick={() => markAsPaid(inv._id)} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200 hover:bg-green-100">Mark Paid</button>
                      )}
                      <button onClick={() => setSelectedInvoice(inv)} className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="View PDF">
                        <Receipt className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Billing;
