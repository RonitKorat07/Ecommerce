import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../redux/Categoryslice";
import { imageuploade } from "../../helper/imageuploade";
import toast from "react-hot-toast";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Search, FolderOpen, LayoutGrid, List } from "lucide-react";

const Category = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.category);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "list" | "grid" | "compact"

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName("");
    setImageFile(null);
    setImagePreview(null);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || (!imageFile && !editId)) {
      toast.error("Please enter name and select image.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        [imageUrl] = await imageuploade([imageFile]);
      }

      if (editId) {
        dispatch(updateCategory({ id: editId, name, image: imageUrl }));
        toast.success("Category updated.");
      } else {
        dispatch(addCategory({ name, image: imageUrl }));
        toast.success("Category added.");
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setImagePreview(cat.image);
    setEditId(cat._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  const filteredItems = items.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewModes = [
    { key: "list", icon: List, label: "List" },
    { key: "grid", icon: LayoutGrid, label: "Grid" },
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-8 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]" style={{ fontFamily: "var(--font-heading)" }}>
            Category <span className="text-[var(--primary)]">Management</span>
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Organize your products by adding or editing categories.</p>
        </div>
        <Button
          variant={showForm ? "outline" : "orange"}
          size="md"
          onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
          className="gap-2"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add New Category"}
        </Button>
      </div>

      {/* ── Collapsible Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[var(--border-light)] shadow-sm mb-6 animate-in slide-in-from-top-2 duration-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
                style={{ background: editId ? 'var(--gradient-primary)' : 'var(--gradient-accent)' }}
              >
                {editId ? <Pencil size={15} /> : <Plus size={15} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  {editId ? "Edit Category" : "Create New Category"}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {editId ? "Modify category name or image" : "Add a category to organize your products"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Image Upload */}
              <div
                className="w-16 h-16 flex-shrink-0 border-2 border-dashed border-[var(--border-light)] rounded-xl flex items-center justify-center cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/20 transition-all group overflow-hidden relative bg-[var(--bg-body)]"
                onClick={() => document.getElementById("category-image").click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon size={16} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-[var(--primary)] transition-colors">
                    <ImageIcon size={20} strokeWidth={1.5} />
                    <span className="text-[8px] font-medium mt-0.5">Image</span>
                  </div>
                )}
                <input id="category-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              {/* Name Input */}
              <div className="flex-1 w-full">
                <Input
                  placeholder="Enter category name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <Button type="submit" variant="orange" size="md" loading={loading} className="px-6">
                  {editId ? "Update" : "Add"}
                </Button>
                {editId && (
                  <Button type="button" variant="outline" size="md" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Categories Card ── */}
      <div className="bg-white rounded-xl border border-[var(--border-light)] shadow-sm">
        {/* Toolbar: Search + View Toggle */}
        <div className="px-5 py-3.5 border-b border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-body)] text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(15,76,129,0.08)] transition-all w-full"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[var(--bg-body)] rounded-lg border border-[var(--border-light)] p-0.5">
            {viewModes.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === key
                    ? "bg-white text-[var(--primary)] shadow-sm border border-[var(--border-light)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
                title={label}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-7 w-7 border-2 border-[var(--primary-light)] border-t-[var(--primary)]" />
              <span className="text-xs text-[var(--text-muted)]">Loading categories...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
              <FolderOpen size={32} strokeWidth={1.5} className="text-slate-300" />
              <span className="text-sm font-medium">
                {searchQuery ? "No categories match your search" : "No categories yet"}
              </span>
              {!searchQuery && (
                <span className="text-xs">Click "Add New" to get started.</span>
              )}
            </div>
          ) : (
            <>
              {/* ── List View ── */}
              {viewMode === "list" && (
                <div className="divide-y divide-[var(--border-light)]">
                  {filteredItems.map((cat, index) => (
                    <div key={cat._id} className="flex items-center gap-4 px-3 py-3.5 hover:bg-[var(--bg-body)] rounded-xl transition-colors group">
                      <span className="text-xs font-bold text-slate-300 w-6 text-center flex-shrink-0">{index + 1}</span>
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[var(--border-light)] group-hover:border-[var(--primary)] transition-colors flex-shrink-0 shadow-sm">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 text-[15px] font-semibold text-[var(--text-main)] truncate">{cat.name}</span>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => handleEdit(cat)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] hover:bg-[var(--primary)] hover:text-white transition-all" title="Edit">
                          <Pencil size={13} /> <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button onClick={() => handleDelete(cat._id)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all" title="Delete">
                          <Trash2 size={13} /> <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Grid View ── */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {filteredItems.map((cat) => (
                    <div key={cat._id} className="group rounded-xl border border-[var(--border-light)] hover:border-[var(--primary)] hover:shadow-md transition-all overflow-hidden bg-white">
                      <div className="aspect-[4/3] overflow-hidden bg-[var(--bg-body)]">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[var(--text-main)] truncate">{cat.name}</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => handleEdit(cat)} className="p-1.5 rounded-lg text-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(cat._id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Compact Grid ── */}
              {viewMode === "compact" && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
                  {filteredItems.map((cat) => (
                    <div key={cat._id} className="group rounded-xl border border-[var(--border-light)] hover:border-[var(--primary)] hover:shadow-sm transition-all overflow-hidden bg-white">
                      <div className="aspect-square overflow-hidden bg-[var(--bg-body)]">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      </div>
                      <div className="px-2 py-2 flex items-center justify-between gap-1">
                        <span className="text-[11px] font-semibold text-[var(--text-main)] truncate">{cat.name}</span>
                        <div className="flex gap-0.5 flex-shrink-0">
                          <button onClick={() => handleEdit(cat)} className="p-1 rounded-md text-[var(--primary)] hover:bg-[var(--primary-light)] transition-colors"><Pencil size={11} /></button>
                          <button onClick={() => handleDelete(cat._id)} className="p-1 rounded-md text-red-400 hover:bg-red-50 transition-colors"><Trash2 size={11} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
