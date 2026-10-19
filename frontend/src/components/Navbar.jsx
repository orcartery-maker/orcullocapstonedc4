import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // On phones the links sit behind a menu button.
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="nav-top">

                <Link to="/places" className="logo">
                    🌍 GeoSystem
                </Link>

                <button
                    type="button"
                    className="menu-toggle"
                    aria-expanded={menuOpen}
                    aria-controls="nav-links"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? "✕ Close" : "☰ Menu"}
                </button>

            </div>

            <div
                id="nav-links"
                className={`nav-links${menuOpen ? " open" : ""}`}
                onClick={() => setMenuOpen(false)}
            >

                <Link to="/places">
                    Explore
                </Link>

                <Link to="/favorites">
                    Favorites
                </Link>

                <Link to="/requests">
                    My Requests
                </Link>

                <Link to="/reviews">
                    My Reviews
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

                        <Link to="/admin/requests">
                            All Requests
                        </Link>

                        <Link to="/admin/reviews">
                            Moderate Reviews
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