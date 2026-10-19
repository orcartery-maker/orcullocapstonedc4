import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";

export default function AdminPlaces() {
    const [places, setPlaces] = useState([]);
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
