import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";
import PlaceCard from "../components/PlaceCard";

export default function Places() {

    const [places, setPlaces] = useState([]);

    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);

    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [regionId, setRegionId] = useState("");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadFilters();
    }, []);

    useEffect(() => {
        loadPlaces();
    }, [search, categoryId, regionId, page]);

    const loadFilters = async () => {

        try {

            const [categoriesResponse, regionsResponse] =
                await Promise.all([
                    api.get("/categories"),
                    api.get("/regions"),
                ]);

            setCategories(
                categoriesResponse.data.data
            );

            setRegions(
                regionsResponse.data.data
            );

        } catch (error) {

            console.error(error);

        }
    };

    const loadPlaces = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/places", {
                params: {
                    search,
                    category_id: categoryId,
                    region_id: regionId,
                    page,
                },
            });

            setPlaces(response.data.data);
            setPagination(response.data.meta);

        } catch (error) {

            setError(
                "Unable to load geographic places."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleCategory = (e) => {
        setCategoryId(e.target.value);
        setPage(1);
    };

    const handleRegion = (e) => {
        setRegionId(e.target.value);
        setPage(1);
    };

    return (
        <>
            <Navbar />

            <main className="page">

                <section className="hero">

                    <div>
                        <h1>
                            Explore the Philippines
                        </h1>

                        <p>
                            Discover beaches, mountains,
                            historical locations, nature
                            destinations and more.
                        </p>
                    </div>

                </section>

                <section className="filters">

                    <input
                        type="text"
                        placeholder="Search places..."
                        value={search}
                        onChange={handleSearch}
                    />

                    <select
                        value={categoryId}
                        onChange={handleCategory}
                    >
                        <option value="">
                            All Categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={regionId}
                        onChange={handleRegion}
                    >
                        <option value="">
                            All Regions
                        </option>

                        {regions.map((region) => (
                            <option
                                key={region.id}
                                value={region.id}
                            >
                                {region.name}
                            </option>
                        ))}
                    </select>

                </section>

                {loading && (
                    <div className="loading">
                        Loading places...
                    </div>
                )}

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                {!loading && places.length === 0 && (
                    <div className="empty-state">
                        <h2>No places found</h2>

                        <p>
                            Try another search or filter.
                        </p>
                    </div>
                )}

                <div className="places-grid">

                    {places.map((place) => (
                        <PlaceCard
                            key={place.id}
                            place={place}
                        />
                    ))}

                </div>

                {pagination && (
                    <div className="pagination">

                        <button
                            disabled={pagination.current_page <= 1}
                            onClick={() =>
                                setPage((current) => Math.max(1, current - 1))
                            }
                        >
                            Previous
                        </button>

                        <span>
                            Page {pagination.current_page}
                            {" "}of{" "}
                            {pagination.last_page}
                        </span>

                        <button
                            disabled={pagination.current_page >= pagination.last_page}
                            onClick={() =>
                                setPage((current) => Math.min(pagination.last_page, current + 1))
                            }
                        >
                            Next
                        </button>

                    </div>
                )}

            </main>
        </>
    );
}