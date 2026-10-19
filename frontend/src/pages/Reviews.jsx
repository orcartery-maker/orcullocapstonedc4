import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import { Stars } from "../components/ReviewSection";

export default function Reviews() {

    const [reviews, setReviews] = useState([]);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReviews(page);
    }, [page]);

    const loadReviews = async (pageToLoad) => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/reviews", {
                params: { page: pageToLoad },
            });

            const items = response.data.data || [];

            // Deleting the last review of a page leaves it empty: step back.
            if (items.length === 0 && pageToLoad > 1) {
                setPage(pageToLoad - 1);
                return;
            }

            setReviews(items);
            setLastPage(response.data.meta?.last_page || 1);

        } catch (err) {

            setError("Unable to load your reviews.");

        } finally {

            setLoading(false);

        }
    };

    const handleDelete = async (reviewId) => {

        if (!window.confirm("Delete this review?")) {
            return;
        }

        try {

            await api.delete(`/reviews/${reviewId}`);

            loadReviews(page);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to delete this review."
            );

        }
    };

    return (
        <>
            <Navbar />

            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>My Reviews</h1>
                        <p>
                            Your ratings and feedback. New reviews
                            appear publicly once approved.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="error">{error}</div>
                )}

                {loading && <p>Loading reviews...</p>}

                {!loading && !error && reviews.length === 0 && (
                    <div className="empty-state">
                        <h2>No reviews yet</h2>
                        <p>
                            Open a place from{" "}
                            <Link to="/places">Explore</Link> and
                            share your first review.
                        </p>
                    </div>
                )}

                <div className="request-list">

                    {reviews.map((review) => (
                        <div
                            className="request-card"
                            key={review.id}
                        >
                            <div className="review-head">
                                <h3>
                                    <Link
                                        to={`/places/${review.place?.id}`}
                                    >
                                        {review.place?.name}
                                    </Link>
                                </h3>

                                <Stars rating={review.rating} />
                            </div>

                            <p>{review.comment}</p>

                            <div className="form-actions request-meta">
                                <span
                                    className={`status ${review.status}`}
                                >
                                    {review.status}
                                </span>

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        handleDelete(review.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
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
