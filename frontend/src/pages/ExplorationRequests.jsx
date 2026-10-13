import { useEffect, useState } from "react";

import api from "../services/api";
import Navbar from "../components/Navbar";

export default function ExplorationRequests() {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {

        try {

            const response =
                await api.get(
                    "/exploration-requests"
                );

            setRequests(
                response.data.data || []
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <Navbar />

            <main className="page">

                <h1>My Exploration Requests</h1>

                {loading && (
                    <p>Loading requests...</p>
                )}

                {!loading &&
                    requests.length === 0 && (
                        <div className="empty-state">
                            No exploration requests.
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
                                {request.message}
                            </p>

                            <span
                                className={`status ${request.status}`}
                            >
                                {request.status}
                            </span>

                        </div>

                    ))}

                </div>

            </main>
        </>
    );
}