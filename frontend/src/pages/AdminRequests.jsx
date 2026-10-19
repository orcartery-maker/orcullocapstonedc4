import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";

const STATUSES = ["pending", "approved", "completed", "rejected"];

export default function AdminRequests() {

    const [requests, setRequests] = useState([]);

    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadRequests();
    }, [filter, page]);

    const loadRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/admin/exploration-requests",
                {
                    params: {
                        page,
                        status: filter || undefined,
                    },
                }
            );

            setRequests(response.data.data || []);
            setLastPage(response.data.last_page || 1);

        } catch (err) {

            setError("Unable to load exploration requests.");

        } finally {

            setLoading(false);

        }
    };

    const handleFilter = (event) => {
        setFilter(event.target.value);
        setPage(1);
    };

    const updateStatus = async (request, status) => {

        setError("");
        setMessage("");

        try {

            await api.patch(
                `/exploration-requests/${request.id}/status`,
                { status }
            );

            setMessage(
                `Request for ${request.place?.name} is now ${status}.`
            );

            loadRequests();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to update the request."
            );

        }
    };

    return (
        <>
            <Navbar />

            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>Exploration Requests</h1>
                        <p>
                            Review requests from all users and
                            update their status.
                        </p>
                    </div>
                </div>

                <section className="filters">
                    <select
                        value={filter}
                        onChange={handleFilter}
                        aria-label="Filter by status"
                    >
                        <option value="">All statuses</option>

                        {STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </section>

                {message && (
                    <div className="success">{message}</div>
                )}

                {error && <div className="error">{error}</div>}

                {loading && <p>Loading requests...</p>}

                {!loading && !error && requests.length === 0 && (
                    <div className="empty-state">
                        <h2>No requests found</h2>
                        <p>Nothing matches this filter.</p>
                    </div>
                )}

                <div className="admin-list">

                    {requests.map((request) => (
                        <div className="admin-card" key={request.id}>
                            <div>
                                <h3>
                                    <Link
                                        to={`/places/${request.place?.id}`}
                                    >
                                        {request.place?.name}
                                    </Link>
                                </h3>

                                <p>
                                    From {request.user?.name} (
                                    {request.user?.email})
                                </p>

                                <p>
                                    {request.message ||
                                        "No message."}
                                </p>

                                <span
                                    className={`status ${request.status}`}
                                >
                                    {request.status}
                                </span>
                            </div>

                            <select
                                value={request.status}
                                aria-label="Change status"
                                onChange={(event) =>
                                    updateStatus(
                                        request,
                                        event.target.value
                                    )
                                }
                            >
                                {STATUSES.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>
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
