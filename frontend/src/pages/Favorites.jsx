import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";
import PlaceCard from "../components/PlaceCard";

export default function Favorites() {

    const [favorites, setFavorites] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {

        try {

            const response =
                await api.get("/favorites");

            setFavorites(
                response.data.data || []
            );

        } finally {

            setLoading(false);

        }
    };

    const removeFavorite = async (placeId) => {

        await api.delete(
            `/places/${placeId}/favorite`
        );

        loadFavorites();
    };

    return (
        <>
            <Navbar />

            <main className="page">

                <h1>My Favorites</h1>

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

            </main>
        </>
    );
}