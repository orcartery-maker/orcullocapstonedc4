import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";

const emptyForm = {
    name: "",
    description: "",
};

export default function AdminRegions() {
    const [regions, setRegions] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadRegions = async () => {
        try {
            const response = await api.get("/regions");
            setRegions(response.data.data || []);
        } catch (error) {
            setError("Unable to load regions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRegions();
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
            await api.post("/regions", form);
            setForm(emptyForm);
            setMessage("Region created successfully.");
            loadRegions();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to create region.");
        }
    };

    const handleDelete = async (regionId) => {
        try {
            await api.delete(`/regions/${regionId}`);
            setMessage("Region deleted.");
            loadRegions();
        } catch (error) {
            setError(error.response?.data?.message || "Unable to delete region.");
        }
    };

    return (
        <>
            <Navbar />

            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>Regions</h1>
                        <p>Manage regional groupings for place listings.</p>
                    </div>
                </div>

                {message && <div className="success">{message}</div>}
                {error && <div className="error">{error}</div>}

                <form className="admin-form" onSubmit={handleSubmit}>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Region name"
                        required
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Regional overview"
                        rows="4"
                    />

                    <button type="submit">Add Region</button>
                </form>

                {loading ? (
                    <p>Loading regions...</p>
                ) : (
                    <div className="admin-list">
                        {regions.map((region) => (
                            <div className="admin-card" key={region.id}>
                                <div>
                                    <h3>{region.name}</h3>
                                    <p>{region.description || "No description provided."}</p>
                                </div>

                                <button type="button" onClick={() => handleDelete(region.id)}>
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
