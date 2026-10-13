import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
    const { user } = useAuth();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await api.get("/dashboard");
            setStats(response.data);
        } catch (error) {
            setError("Unable to load dashboard.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="page">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="page error">{error}</div>;
    }

    return (
        <div className="page">

            <div className="page-header">
                <div>
                    <h1>GeoSystem Dashboard</h1>
                    <p>
                        Welcome back, {user?.name}.
                    </p>
                </div>
            </div>

            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Places</h3>
                    <strong>{stats.total_places}</strong>
                </div>

                <div className="stat-card">
                    <h3>Total Users</h3>
                    <strong>{stats.total_users}</strong>
                </div>

                <div className="stat-card">
                    <h3>Categories</h3>
                    <strong>{stats.total_categories}</strong>
                </div>

                <div className="stat-card">
                    <h3>Active Places</h3>
                    <strong>{stats.active_places}</strong>
                </div>

                <div className="stat-card">
                    <h3>Pending Requests</h3>
                    <strong>{stats.pending_requests}</strong>
                </div>

                <div className="stat-card">
                    <h3>Pending Reviews</h3>
                    <strong>{stats.pending_reviews}</strong>
                </div>

            </div>

        </div>
    );
}
