
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

export default function PlaceDetails() {
    const { id } = useParams();

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [favoriteMessage, setFavoriteMessage] = useState("");

    useEffect(() => {
        loadPlace();
    }, [id]);

    const loadPlace = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/places/${id}`);
            setPlace(response.data.data);
            setIsFavorite(Boolean(response.data.data.is_favorite));
        } catch (error) {
            setError("Unable to load place information.");
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async () => {
        setFavoriteLoading(true);
        setFavoriteMessage("");

        try {
            if (isFavorite) {
                await api.delete(`/places/${id}/favorite`);
                setIsFavorite(false);
                setFavoriteMessage("Removed from favorites.");
            } else {
                await api.post(`/places/${id}/favorite`);
                setIsFavorite(true);
                setFavoriteMessage("Added to favorites!");
            }
        } catch (error) {
            setFavoriteMessage(
                error.response?.data?.message ||
                "Unable to update favorites. Please log in and try again."
            );
        } finally {
            setFavoriteLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="page">Loading place...</main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <main className="page">
                    <div className="error">{error}</div>
                    <Link to="/places">← Back to Explore</Link>
                </main>
            </>
        );
    }

    if (!place) {
        return null;
    }

    const mapUrl =
        place.latitude != null && place.longitude != null
            ? `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`
            : null;

    return (
        <>
            <Navbar />

            <main className="page">
                <Link to="/places">← Back to Explore</Link>

                <article className="place-details">
                    {place.image ? (
                        <img
                            src={`http://127.0.0.1:8000/storage/${place.image}`}
                            alt={place.name}
                        />
                    ) : (
                        <div className="details-placeholder">🌍</div>
                    )}

                    <div className="details-content">
                        <span className="category-badge">
                            {place.category?.name || "Uncategorized"}
                        </span>

                        <h1>{place.name}</h1>

                        <p>📍 {place.location}</p>

                        <p>
                            🗺️ Region: {place.region?.name || "Not specified"}
                        </p>

                        <p>{place.description}</p>

                        <button
                            type="button"
                            onClick={toggleFavorite}
                            disabled={favoriteLoading}
                            className="favorite-button"
                        >
                            {favoriteLoading
                                ? "Updating..."
                                : isFavorite
                                ? "♥ Remove from Favorites"
                                : "♡ Add to Favorites"}
                        </button>

                        {favoriteMessage && (
                            <p role="status">{favoriteMessage}</p>
                        )}

                        {mapUrl && (
                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="map-button"
                            >
                                📍 Open in Google Maps
                            </a>
                        )}
                    </div>
                </article>
            </main>
        </>
    );
}
