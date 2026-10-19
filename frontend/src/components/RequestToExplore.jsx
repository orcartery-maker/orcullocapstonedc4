import { useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

// Lets a signed-in user ask the team to arrange an exploration of a place.
export default function RequestToExplore({ placeId }) {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        try {

            setSending(true);

            await api.post(
                `/places/${placeId}/exploration-request`,
                { message: message.trim() || null }
            );

            setSent(true);
            setMessage("");

        } catch (err) {

            const errors = err.response?.data?.errors;

            setError(
                errors
                    ? Object.values(errors).flat().join(" ")
                    : err.response?.data?.message ||
                      "Unable to send your request."
            );

        } finally {

            setSending(false);

        }
    };

    if (sent) {
        return (
            <section className="request-section">
                <div className="success">
                    Request sent! Track it under{" "}
                    <Link to="/requests">My Requests</Link>.
                </div>
            </section>
        );
    }

    return (
        <section className="request-section">

            {!open ? (
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setOpen(true)}
                >
                    🧭 Request to explore
                </button>
            ) : (
                <form
                    className="review-form"
                    onSubmit={handleSubmit}
                >
                    <h3>Request to explore</h3>

                    {error && (
                        <div className="error">{error}</div>
                    )}

                    <label htmlFor="request-message">
                        Message (optional)
                    </label>

                    <textarea
                        id="request-message"
                        rows="3"
                        maxLength="1000"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder="When would you like to visit, and with how many people?"
                    />

                    <div className="form-actions">
                        <button type="submit" disabled={sending}>
                            {sending
                                ? "Sending..."
                                : "Send request"}
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

        </section>
    );
}
