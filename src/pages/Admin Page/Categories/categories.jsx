import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesIsLoading, setCategoriesIsLoading] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const featchCategories = async () => {
      setCategoriesIsLoading(false);
      const token = localStorage.getItem("token");

        if (!token) {
        navigate("/auth/login");
        return;
      }


      try {
        

        if (!categoriesLoaded) {
          const response = await axios.get(`${BACKEND_URL}/api/category/get`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(response.data);
          setCategories(response.data.data);
          setCategoriesLoaded(true);
        } 
      } catch (error) {
        console.log(error);
        setCategoriesIsLoading(false);
        setCategories([]);
        
      }
     finally {
        setCategoriesIsLoading(false);
      }
    };
    featchCategories();
  }, [categoriesLoaded ,navigate]);

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this category?` + name
    );

    if (!confirmDelete) {
      return; // user clicked "No"
    }

    const token = localStorage.getItem("token");

    try {
      if (!token) {
        navigate("/auth/login");
        return;
      }

      const response = await axios.delete(
        `${BACKEND_URL}/api/category/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      alert("Category deleted successfully!");
      setCategoriesLoaded(false);
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Categories</h1>

      {categoriesIsLoading ? (
        <p className="text-gray-600">Loading categories...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full  border border-gray-300 rounded shadow">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-4 border border-gray-00">Image</th>
                <th className="py-2 px-4 border border-gray-300">ID</th>
                <th className="py-2 px-4 border border-gray-300">Name</th>
                <th className="py-2 px-4 border border-gray-300">Price</th>
                <th className="py-2 px-4 border border-gray-300">Features</th>
                <th className="py-2 px-4 border border-gray-300">
                  Description
                </th>
                <th className="py-2 px-4 border border-gray-300">Action</th>
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
                      {category.id || category._id}
                    </td>
                    <td className="border px-4 py-2">{category.name}</td>
                    <td className="border px-4 py-2">{category.price}</td>
                    <td className="border px-4 py-2">
                      {Array.isArray(category.features) ? (
                        <ul className="list-disc list-inside">
                          {category.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        category.features
                      )}
                    </td>
                    <td className="border px-4 py-2">{category.description}</td>
                    <td className="border px-4 py-2 text-center">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(category._id, category.name)
                        }
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
        </div>
      )}
    </div>
  );
};

export default Categories;
