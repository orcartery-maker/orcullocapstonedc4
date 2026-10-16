import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";

const emptyForm = {
    name: "",
    description: "",
};

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data.data || []);
        } catch (error) {
            setError("Unable to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        try {
            await api.post("/categories", form);
            setForm(emptyForm);
            setMessage("Category created successfully.");
            loadCategories();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to create category.");
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            await api.delete(`/categories/${categoryId}`);
            setMessage("Category deleted.");
            loadCategories();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to delete category.");
        }
    };

    return (
        <>
            <Navbar />

            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>Categories</h1>
                        <p>Manage the place categories shown across the app.</p>
                    </div>
                </div>

                {message && <div className="success">{message}</div>}
                {error && <div className="error">{error}</div>}

                <form className="admin-form" onSubmit={handleSubmit}>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Category name"
                        required
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Short description"
                        rows="4"
                    />

                    <button type="submit">Add Category</button>
                </form>

                {loading ? (
                    <p>Loading categories...</p>
                ) : (
                    <div className="admin-list">
                        {categories.map((category) => (
                            <div className="admin-card" key={category.id}>
                                <div>
                                    <h3>{category.name}</h3>
                                    <p>{category.description || "No description provided."}</p>
                                </div>

                                <button type="button" onClick={() => handleDelete(category.id)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
