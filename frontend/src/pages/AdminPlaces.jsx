import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";

const emptyForm = {
    name: "",
    location: "",
    description: "",
    region_id: "",
    category_id: "",
    latitude: "",
    longitude: "",
    status: "active",
};

export default function AdminPlaces() {
    const [places, setPlaces] = useState([]);
    const [regions, setRegions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadPlaces = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/places", {
                params: { page },
            });

            setPlaces(response.data.data || []);
            setLastPage(response.data.meta?.last_page || 1);
        } catch (error) {
            setError("Unable to load places.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlaces();
    }, [page]);

    useEffect(() => {
        loadOptions();
    }, []);

    const loadOptions = async () => {
        try {
            const [regionsResponse, categoriesResponse] =
                await Promise.all([
                    api.get("/regions"),
                    api.get("/categories"),
                ]);

            setRegions(regionsResponse.data.data || []);
            setCategories(categoriesResponse.data.data || []);
        } catch (error) {
            setError("Unable to load regions and categories.");
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleCreate = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        try {
            setSaving(true);

            await api.post("/places", {
                ...form,
                latitude: form.latitude === "" ? null : Number(form.latitude),
                longitude: form.longitude === "" ? null : Number(form.longitude),
            });

            setForm(emptyForm);
            setMessage("Place created successfully.");

            if (page === 1) {
                loadPlaces();
            } else {
                setPage(1);
            }
        } catch (error) {
            const errors = error.response?.data?.errors;

            setError(
                errors
                    ? Object.values(errors).flat().join(" ")
                    : error.response?.data?.message ||
                      "Unable to create the place."
            );
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (place) => {
        const nextStatus = place.status === "active" ? "inactive" : "active";

        try {
            await api.patch(`/places/${place.id}/status`, {
                status: nextStatus,
            });

            setMessage(`Updated ${place.name} to ${nextStatus}.`);
            loadPlaces();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to update place status.");
        }
    };

    return (
        <>
            <Navbar />

            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>Manage Places</h1>
                        <p>Activate or deactivate listings from the public catalog.</p>
                    </div>
                </div>

                {message && <div className="success">{message}</div>}
                {error && <div className="error">{error}</div>}

                <form className="admin-form" onSubmit={handleCreate}>
                    <h2>Add a place</h2>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Place name"
                        required
                    />

                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Location (e.g. Banaue, Ifugao)"
                        required
                    />

                    <select
                        name="region_id"
                        value={form.region_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a region</option>
                        {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                                {region.name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        rows="4"
                        required
                    />

                    <input
                        name="latitude"
                        type="number"
                        step="any"
                        min="-90"
                        max="90"
                        value={form.latitude}
                        onChange={handleChange}
                        placeholder="Latitude (optional)"
                    />

                    <input
                        name="longitude"
                        type="number"
                        step="any"
                        min="-180"
                        max="180"
                        value={form.longitude}
                        onChange={handleChange}
                        placeholder="Longitude (optional)"
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Add Place"}
                    </button>
                </form>

                {loading ? (
                    <p>Loading places...</p>
                ) : (
                    <div className="admin-list">
                        {places.map((place) => (
                            <div className="admin-card" key={place.id}>
                                <div>
                                    <h3>{place.name}</h3>
                                    <p>{place.location}</p>
                                    <span className={`status ${place.status}`}>
                                        {place.status}
                                    </span>
                                </div>

                                <button onClick={() => toggleStatus(place)}>
                                    {place.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination
                    page={page}
                    lastPage={lastPage}
                    onPageChange={setPage}
                />
            </main>
        </>
    );
}
