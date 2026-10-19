import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import { Stars } from "../components/ReviewSection";

export default function AdminReviews() {

    const [reviews, setReviews] = useState([]);

    // Pending reviews first: that is what an admin usually needs to act on.
    const [filter, setFilter] = useState("pending");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadReviews();
    }, [filter, page]);

    const loadReviews = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/admin/reviews", {
                params: {
                    page,
                    status: filter || undefined,
                },
            });

            const items = response.data.data || [];

            // Moderating the last review of a page leaves it empty: step back.
            if (items.length === 0 && page > 1) {
                setPage(page - 1);
                return;
            }

            setReviews(items);
            setLastPage(response.data.meta?.last_page || 1);

        } catch (err) {

            setError("Unable to load reviews.");

        } finally {

            setLoading(false);

        }
    };

    const handleFilter = (event) => {
        setFilter(event.target.value);
        setPage(1);
    };

    const setStatus = async (review, status) => {

        setError("");
        setMessage("");

        try {

            await api.patch(
                `/reviews/${review.id}/status`,
                { status }
            );

            setMessage(`Review marked as ${status}.`);

            loadReviews();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to update the review."
            );

        }
    };

    const handleDelete = async (review) => {

        if (!window.confirm("Delete this review permanently?")) {
            return;
        }

        try {

            await api.delete(`/reviews/${review.id}`);

            setMessage("Review deleted.");

            loadReviews();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to delete the review."
            );

        }
    };

    return (
        <>
            <Navbar />

            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>Review Moderation</h1>
                        <p>
                            Approve reviews to publish them on the
                            place page, or reject them.
                        </p>
                    </div>
                </div>

                <section className="filters">
                    <select
                        value={filter}
                        onChange={handleFilter}
                        aria-label="Filter by status"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="">All</option>
                    </select>
                </section>

                {message && (
                    <div className="success">{message}</div>
                )}

                {error && <div className="error">{error}</div>}

                {loading && <p>Loading reviews...</p>}

                {!loading && !error && reviews.length === 0 && (
                    <div className="empty-state">
                        <h2>No reviews here</h2>
                        <p>Nothing matches this filter.</p>
                    </div>
                )}

                <div className="admin-list">

                    {reviews.map((review) => (
                        <div className="admin-card" key={review.id}>
                            <div>
                                <h3>
                                    <Link
                                        to={`/places/${review.place?.id}`}
                                    >
                                        {review.place?.name}
                                    </Link>
                                </h3>

                                <p>
                                    <Stars rating={review.rating} />{" "}
                                    by {review.user?.name}
                                </p>

                                <p>{review.comment}</p>

                                <span
                                    className={`status ${review.status}`}
                                >
                                    {review.status}
                                </span>
                            </div>

                            <div className="form-actions">
                                {review.status !== "approved" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStatus(
                                                review,
                                                "approved"
                                            )
                                        }
                                    >
                                        Approve
                                    </button>
                                )}

                                {review.status !== "rejected" && (
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() =>
                                            setStatus(
                                                review,
                                                "rejected"
                                            )
                                        }
                                    >
                                        Reject
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        handleDelete(review)
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
