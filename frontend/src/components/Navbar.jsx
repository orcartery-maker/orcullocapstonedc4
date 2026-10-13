import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <Link to="/places" className="logo">
                🌍 GeoSystem
            </Link>

            <div className="nav-links">

                <Link to="/places">
                    Explore
                </Link>

                <Link to="/favorites">
                    Favorites
                </Link>

                <Link to="/requests">
                    My Requests
                </Link>

                <Link to="/profile">
                    Profile
                </Link>

                {user?.role === "admin" && (
                    <>
                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/admin/places">
                            Manage Places
                        </Link>

                        <Link to="/admin/categories">
                            Categories
                        </Link>

                        <Link to="/admin/regions">
                            Regions
                        </Link>
                    </>
                )}

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}