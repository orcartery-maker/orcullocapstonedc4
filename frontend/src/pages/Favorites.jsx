import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";
import PlaceCard from "../components/PlaceCard";
import Pagination from "../components/Pagination";

export default function Favorites() {

    const [favorites, setFavorites] = useState([]);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadFavorites(page);
    }, [page]);

    const loadFavorites = async (pageToLoad) => {

        try {

            setError("");

            const response =
                await api.get("/favorites", {
                    params: { page: pageToLoad },
                });

            const items = response.data.data || [];

            // Removing the last item of a page leaves it empty: step back.
            if (items.length === 0 && pageToLoad > 1) {
                setPage(pageToLoad - 1);
                return;
            }

            setFavorites(items);
            setLastPage(response.data.last_page || 1);

        } catch (err) {

            setError("Unable to load your favorites.");

        } finally {

            setLoading(false);

        }
    };

    const removeFavorite = async (placeId) => {

        try {

            await api.delete(
                `/places/${placeId}/favorite`
            );

            loadFavorites(page);

        } catch (err) {

            setError("Unable to remove this favorite.");

        }
    };

    return (
        <>
            <Navbar />

            <main className="page">

                <h1>My Favorites</h1>

                {error && (
                    <div className="error">{error}</div>
                )}

                {loading && (
                    <p>Loading favorites...</p>
                )}

                {!loading &&
                    favorites.length === 0 && (
                        <div className="empty-state">
                            <h2>No favorites yet</h2>
                            <p>
                                Explore places and save
                                your favorites here.
                            </p>
                        </div>
                    )}

                <div className="places-grid">

                    {favorites.map((favorite) => (
                        <div key={favorite.id}>

                            <PlaceCard
                                place={favorite.place}
                            />

                            <button
                                onClick={() =>
                                    removeFavorite(
                                        favorite.place.id
                                    )
                                }
                            >
                                Remove Favorite
                            </button>

                        </div>
                    ))}

                </div>

                <Pagination
                    page={page}
                    lastPage={lastPage}
                    onPageChange={setPage}
                />

            </main>
        </>
    );
}
