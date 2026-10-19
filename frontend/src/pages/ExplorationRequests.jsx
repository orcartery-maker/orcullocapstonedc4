import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";

export default function ExplorationRequests() {

    const [requests, setRequests] = useState([]);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRequests(page);
    }, [page]);

    const loadRequests = async (pageToLoad) => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/exploration-requests",
                    { params: { page: pageToLoad } }
                );

            setRequests(
                response.data.data || []
            );

            setLastPage(
                response.data.last_page || 1
            );

        } catch (err) {

            setError("Unable to load your requests.");

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <Navbar />

            <main className="page">

                <h1>My Exploration Requests</h1>

                {error && (
                    <div className="error">{error}</div>
                )}

                {loading && (
                    <p>Loading requests...</p>
                )}

                {!loading &&
                    !error &&
                    requests.length === 0 && (
                        <div className="empty-state">
                            <h2>No exploration requests</h2>
                            <p>
                                Open a place and use
                                "Request to explore" to
                                send one.
                            </p>
                        </div>
                    )}

                <div className="request-list">

                    {requests.map((request) => (

                        <div
                            className="request-card"
                            key={request.id}
                        >

                            <h3>
                                {request.place?.name}
                            </h3>

                            <p>
                                {request.message ||
                                    "No message."}
                            </p>

                            <span
                                className={`status ${request.status}`}
                            >
                                {request.status}
                            </span>

                            <p className="request-meta">
                                Sent{" "}
                                {new Date(
                                    request.created_at
                                ).toLocaleDateString()}
                            </p>

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
