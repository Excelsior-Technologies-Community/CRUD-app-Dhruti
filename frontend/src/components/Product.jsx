import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../App.css";
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Pencil, Trash, LogOut, CircleUserRound } from "lucide-react";

const SERVER_BASE_URL = "http://localhost:5000";
const API_BASE_URL = `${SERVER_BASE_URL}/api/products`;

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Other"];

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  // image preview
  const [imagePreview, setImagePreview] = useState("");
  // logout model
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // delete product
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // use ref
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // toast
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  // FETCH ALL PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_BASE_URL);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      setError("Failed to fetch products. Make sure backend is running on port 5000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // LOAD PRODUCTS ON MOUNT
  useEffect(() => {
    fetchProducts();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    });
  };

  // CREATE OR UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      notifyError("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        // UPDATE PRODUCT
        const data = new FormData();

        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("category", formData.category);

        if (image) {
          data.append("image", image);
        }

        await axios.put(
          `${API_BASE_URL}/${editingId}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        notifySuccess("Product updated successfully");
      } else {
        // CREATE PRODUCT
        const data = new FormData();

        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("category", formData.category);

        if (image) {
          data.append("image", image);
        }

        await axios.post(API_BASE_URL, data);
        notifySuccess("Product added successfully");
      }

      resetForm();
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to save product");
      console.error(err);
    }
  };


  // EDIT PRODUCT
  const handleEdit = (product) => {
    // console.log(product);
    // console.log(product.image);

    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,

    });
    setImage(null);

    setImagePreview(
      `http://localhost:5000/uploads/${product.image}`
    ); // image preview set

    setEditingId(product._id);
    setShowModal(true);
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      notifySuccess("Product deleted successfully");
      setshowDeleteModal(false);
      setDeleteProductId(null);
      fetchProducts();
    } catch (err) {
      notifyError("Failed to delete product");
      console.error(err);
    }
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
    });
    setEditingId(null);

  };

  // CLOSE MODAL
  const closeModal = () => {
    resetForm();
    setShowModal(false);
    setImage(null);
    setImagePreview("");
  };

  // FILTER BY CATEGORY
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  // handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <div style={{ padding: "30px", minHeight: "100vh", backgroundColor: "#18181B", border: "none" }} className="font-sans">

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* MAIN CONTAINER */}
        <div className="w-[90%] mt-[30px] mb-[50px] bg-[#27272A] border border-[#3F3F46] p-[25px] rounded-[10px] shadow-2xl animate-[fadeIn_0.5s_ease]">

          {/* HEADER */}
          <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-[15px] mb-[25px] border-b border-[#3F3F46] pb-[18px]">

            <div className="flex items-center gap-[12px]">
              <h2 className="text-3xl font-bold text-[#FAFAFA] tracking-wide">
                Products
              </h2>

              <span className="text-xs font-semibold bg-[#FED7AA] text-[#18181B] py-1 px-3 rounded-full">
                {filteredProducts.length} items
              </span>

            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
              {/* CATEGORY FILTER */}

              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="category-select px-8 py-2 bg-[#3F3F46] text-center border border-[#52525B] rounded-lg text-sm text-[#FAFAFA] outline-none cursor-pointer hover:border-[#FDBA74] focus:border-[#FDBA74]" >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* ADD NEW PRODUCT BUTTON */}
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="w-full sm:w-auto py-2 px-4 flex justify-center items-center cursor-pointer gap-2 bg-[#FB923C] text-white text-sm font-semibold rounded-lg hover:bg-[#F97316] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span>+</span> Add New Product
              </button>

              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="cursor-pointer p-2 rounded-full hover:bg-gray-700 text-white  transition"
                >
                  <CircleUserRound size={32} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#131315] rounded-md shadow-lg overflow-hidden z-50">

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate("/change-password");
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#3d3d3e] transition cursor-pointer"
                    >
                      Change Password
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-[#3d3d3e] transition cursor-pointer"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            </div>
          </div>

          {/* // logout model */}
          {showLogoutModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#27272A] text-white p-6 rounded-xl shadow-xl w-96">
                <h2 className="text-xl font-semibold">
                  <LogOut /> Confirm Logout
                </h2>

                <p className="text-gray-300 mb-6 pb-3">
                  Are you sure you want to logout?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )
          }

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 p-4 bg-red-900 border border-red-600 text-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* LOADING STATE */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#A1A1AA]">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#A1A1AA] text-md">
                {selectedCategory === "all"
                  ? "No products found. Create one to get started!"
                  : `No products found in ${selectedCategory} category.`}
              </p>
            </div>
          ) : (
            /* TABLE */
            <div className="overflow-x-auto rounded-lg border border-[#3F3F46]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-[#3F3F46] text-[#FAFAFA] p-3 text-left font-semibold">#</th>
                    <th className="bg-[#3F3F46] text-[#FAFAFA] p-3 text-left font-semibold">Image</th>
                    <th className="bg-[#3F3F46] text-[#FAFAFA] p-3 text-left font-semibold">Name</th>
                    <th className="bg-[#3F3F46] text-[#FAFAFA] p-3 text-left font-semibold">Price</th>
                    <th className="bg-[#3F3F46] text-[#FAFAFA] p-3 text-left font-semibold">Category</th>
                    <th className="bg-[#3F3F46] text-[#FAFAFA] p-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className="border-b border-[#3F3F46] hover:bg-[#323238] transition-all duration-300"
                    >
                      <td className="p-3 text-left text-[#FAFAFA]">{index + 1}</td>
                      <td className="p-3 text-left text-[#FAFAFA]">
                        {product.image && (
                          <img
                            src={`${SERVER_BASE_URL}/uploads/${product.image}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                      </td>
                      <td className="p-3 text-left text-[#FAFAFA]">{product.name}</td>
                      <td className="p-3 text-left text-[#FAFAFA]">₹{product.price.toFixed(2)}</td>
                      <td className="p-3 text-left">
                        <span className="px-3 py-1 bg-[#3F3F46] text-[#FED7AA] rounded text-xs font-semibold">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            title="Edit Product"
                            onClick={() => handleEdit(product)}
                            className="px-2 py-2 bg-[#3B82F6] cursor-pointer text-white text-xs font-semibold rounded hover:bg-[#2563EB] transition-all duration-300"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title="Delete Product"
                            onClick={() => {
                              setshowDeleteModal(true);
                              setDeleteProductId(product._id);
                            }}
                            className="px-2 py-2 bg-[#EF4444] text-white cursor-pointer text-xs font-semibold rounded hover:bg-[#DC2626] transition-all duration-300"
                          >
                            <Trash size={16} />
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
      </div>

      {/* delete model */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#27272A] text-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-semibold">
              Confirm Delete
            </h2>

            <p className="text-gray-300 mb-6 pb-3">
              Are you sure you want to Delete this Item ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setshowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>

              <button
                // onClick={() => handleDelete(product._id)}
                onClick={() => handleDelete(deleteProductId)}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )
      }
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#27272A] border border-[#3F3F46] rounded-lg px-6 py-4 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-[#FAFAFA] mb-2">
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>

            <form onSubmit={handleSubmit}>
              {/* image preview */}
              {imagePreview && (
                <div className="flex justify-center mb-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-30 h-30 object-cover rounded-lg border"
                  />
                </div>
              )}
              {/* NAME INPUT */}
              <div className="mb-2 flex">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 bg-[#3F3F46] border border-[#52525B] rounded-lg text-[#FAFAFA] outline-none focus:border-[#FDBA74]"
                  required
                />
              </div>

              {/* PRICE INPUT */}
              <div className="mb-2">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 bg-[#3F3F46] border border-[#52525B] rounded-lg text-[#FAFAFA] outline-none focus:border-[#FDBA74]"
                  required
                />
              </div>

              {/* CATEGORY SELECT */}
              <div className="mb-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-2 py-2 bg-[#3F3F46] border border-[#52525B] rounded-sm text-[#FAFAFA] outline-none cursor-pointer focus:border-[#FDBA74]"
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>

                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setImage(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-white cursor-pointer bg-[#3F3F46] border border-[#52525B] rounded-lg px-3 py-2 focus:border-[#FDBA74]"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-[#FB923C] text-white font-semibold rounded-lg hover:bg-[#F97316] transition-all duration-300"
                >
                  {editingId ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 bg-[#3F3F46] text-[#FAFAFA] font-semibold rounded-lg hover:bg-[#52525B] transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={1500} theme="dark" draggable={true} transition={Slide} />

    </div>
  );
}

export default Product;