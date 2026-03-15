import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesIsLoading, setCategoriesIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(""); // will be updated by backend
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    setCategoriesIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth/login");
      return;
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/category/get?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data, pagination } = response.data;

      setCategories(data);
      setLimit(pagination.pageSize);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setCategoriesIsLoading(false);
    }
  };

  console.log("Categories:", categories);
  useEffect(() => {
    fetchCategories();
  }, [page, limit]);

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${name}"?`
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${BACKEND_URL}/api/category/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Category deleted successfully!");
      setPage(1); // Reset to first page after delete
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete category.");
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">Categories</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => navigate("/admin/categories/addcategories")}
        >
          Add Category +
        </button>
      </div>

      {categoriesIsLoading ? (
        <p className="text-gray-600">Loading categories...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded shadow">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-4 border">Image</th>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Features</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border px-4 py-2 text-center">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt="Category"
                          className="w-12 h-12 object-cover rounded mx-auto"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {category._id}
                    </td>
                    <td className="border px-4 py-2">{category.name}</td>
                    <td className="border px-4 py-2">{category.price}</td>
                    <td className="border px-4 py-2">
                      {Array.isArray(category.features) ? (
                        <ul className="list-disc list-inside">
                          {category.features.flatMap((item) =>
                            item.split(",").map((feature, i) => (
                              <li key={i}>{feature.trim()}</li>
                            ))
                          )}
                        </ul>
                      ) : (
                        category.features
                      )}
                    </td>
                    <td className="border px-4 py-2">{category.description}</td>
                    <td className="border px-4 py-2 text-center">
                      <Link
                        to={`/admin/categories/updatecategories`}
                        state={category}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id, category.name)}
                        className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-600">
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-white px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
