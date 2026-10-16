import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <>
            <Navbar />

            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>Profile</h1>
                        <p>Manage your account information.</p>
                    </div>
                </div>

                <div className="auth-card profile-card">
                    <h2>{user?.name || "Traveler"}</h2>

                    <p>
                        <strong>Email:</strong> {user?.email || "Not available"}
                    </p>

                    <p>
                        <strong>Role:</strong> {user?.role || "user"}
                    </p>

                    <button type="button" onClick={handleLogout}>
                        Log out
                    </button>
                </div>
            </main>
        </>
    );
}
