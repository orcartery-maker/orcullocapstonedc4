import { useState } from "react";

import api from "../services/api";

export function Stars({ rating }) {
    const filled = Math.round(Number(rating) || 0);

    return (
        <span
            className="stars"
            role="img"
            aria-label={`${rating} out of 5 stars`}
        >
            {"★".repeat(filled)}
            {"☆".repeat(5 - filled)}
        </span>
    );
}

// Approved reviews for a place, plus a form to submit a new one.
// New reviews are pending until an administrator approves them.
export default function ReviewSection({ place }) {

    const reviews = place.reviews || [];

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        if (!comment.trim()) {
            setError("Please write a short comment.");
            return;
        }

        try {

            setSubmitting(true);

            const response = await api.post(
                `/places/${place.id}/reviews`,
                { rating: Number(rating), comment }
            );

            setMessage(response.data.message);
            setSubmitted(true);
            setComment("");

        } catch (err) {

            const errors = err.response?.data?.errors;

            setError(
                errors
                    ? Object.values(errors).flat().join(" ")
                    : err.response?.data?.message ||
                      "Unable to submit your review."
            );

        } finally {

            setSubmitting(false);

        }
    };

    return (
        <section className="review-section">

            <h2>Reviews</h2>

            {place.reviews_count > 0 ? (
                <p className="review-summary">
                    <Stars rating={place.average_rating} />{" "}
                    {place.average_rating} / 5 from{" "}
                    {place.reviews_count}{" "}
                    {place.reviews_count === 1
                        ? "review"
                        : "reviews"}
                </p>
            ) : (
                <p className="review-summary">
                    No reviews yet. Be the first to share your
                    experience.
                </p>
            )}

            <div className="review-list">

                {reviews.map((review) => (
                    <div
                        className="review-card"
                        key={review.id}
                    >
                        <div className="review-head">
                            <strong>
                                {review.user?.name || "Traveler"}
                            </strong>
                            <Stars rating={review.rating} />
                        </div>

                        <p>{review.comment}</p>
                    </div>
                ))}

            </div>

            {submitted ? (
                <div className="success">{message}</div>
            ) : (
                <form
                    className="review-form"
                    onSubmit={handleSubmit}
                >
                    <h3>Write a review</h3>

                    {error && (
                        <div className="error">{error}</div>
                    )}

                    <label htmlFor="review-rating">
                        Rating
                    </label>

                    <select
                        id="review-rating"
                        value={rating}
                        onChange={(e) =>
                            setRating(e.target.value)
                        }
                    >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                    </select>

                    <label htmlFor="review-comment">
                        Your experience
                    </label>

                    <textarea
                        id="review-comment"
                        rows="4"
                        maxLength="1000"
                        value={comment}
                        onChange={(e) =>
                            setComment(e.target.value)
                        }
                        placeholder="What did you enjoy about this place?"
                    />

                    <button type="submit" disabled={submitting}>
                        {submitting
                            ? "Submitting..."
                            : "Submit review"}
                    </button>
                </form>
            )}

        </section>
    );
}
