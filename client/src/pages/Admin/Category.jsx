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

const Category = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.category);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

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

      // Reset form
      setName("");
      setImageFile(null);
      setImagePreview(null);
      setEditId(null);
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
    window.scrollTo({ top: 0, behavior: "smooth" });

  };

  const handleDelete = (id) => {
    dispatch(deleteCategory(id));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{editId ? "Edit Category" : "Add Category"}</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            className="w-24 h-24 object-cover rounded border"
          />
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setName("");
                setImageFile(null);
                setImagePreview(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          items.map((cat) => (
            <li key={cat._id} className="flex flex-col gap-3 sm:flex-row items-center justify-between border p-3 rounded">
              <div className="flex items-center gap-3">
                <img src={cat.image} 
                alt={cat.name} 
                className="w-12 h-12 rounded-full object-cover" />
                <span className="text-sm sm:text-lg">{cat.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(cat)}
                  className="bg-yellow-500 text-white text-sm px-2 sm:px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-600 text-white text-sm  px-2 sm:px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Category;
