/**
 * ============================================
 * INVENTORY PAGE
 * ============================================
 */

import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import EmptyState from "../components/shared/EmptyState";
import toast from "react-hot-toast";
import { Package, AlertTriangle, Search, Plus, Edit2, Trash2, X } from "lucide-react";

const CATEGORIES = ["medicine", "equipment", "consumable", "other"];

const Inventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [alerts, setAlerts] = useState({ lowStock: [], expired: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name: "", category: "medicine", quantity: "", unit: "pieces", threshold: 10, price: "", expiryDate: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, alertsRes] = await Promise.all([
        api.get("/inventory", { params: { search, category: categoryFilter || undefined, limit: 100 } }),
        api.get("/inventory/alerts")
      ]);
      setItems(itemsRes.data.data.items);
      setAlerts(alertsRes.data.data);
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  const resetForm = () => {
    setForm({ name: "", category: "medicine", quantity: "", unit: "pieces", threshold: 10, price: "", expiryDate: "" });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name, category: item.category, quantity: item.quantity, unit: item.unit,
      threshold: item.threshold, price: item.price, expiryDate: item.expiryDate ? item.expiryDate.split("T")[0] : ""
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/inventory/${editingItem._id}`, form);
        toast.success("Item updated");
      } else {
        await api.post("/inventory", form);
        toast.success("Item added");
      }
      resetForm();
      fetchData();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete item?")) return;
    try {
      await api.delete(`/inventory/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage hospital supplies and medicines</p>
        </div>
        {user?.role === "admin" && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        )}
      </div>

      {alerts.lowStock.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400">Low Stock Alert ({alerts.lowStock.length} items)</h3>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
              {alerts.lowStock.slice(0,3).map(i => i.name).join(", ")} {alerts.lowStock.length > 3 ? "and more..." : ""}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-white">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">{editingItem ? "Edit Item" : "Add Item"}</h2>
              <button onClick={resetForm}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm dark:text-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm dark:text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                  <input type="number" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} required className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                  <input value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} placeholder="e.g. strips" required className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alert Thres.</label>
                  <input type="number" value={form.threshold} onChange={(e) => setForm({...form, threshold: e.target.value})} required className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm dark:text-white" />
                </div>
              </div>
              {form.category === "medicine" && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({...form, expiryDate: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-transparent text-sm dark:text-white" />
                </div>
              )}
              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium mt-4">Save Item</button>
            </form>
          </div>
        </div>
      )}

      {loading ? <LoadingSkeleton type="table" count={4} /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3">Item Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map(item => {
                const isLow = item.quantity <= item.threshold;
                return (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium dark:text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" /> {item.name}
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600 dark:text-gray-300">{item.category}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user?.role === "admin" && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;
