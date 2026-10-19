import {
    HashRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Places from "./pages/Places";
import PlaceDetails from "./pages/PlaceDetails";
import Favorites from "./pages/Favorites";
import Reviews from "./pages/Reviews";
import ExplorationRequests from "./pages/ExplorationRequests";
import AdminPlaces from "./pages/AdminPlaces";
import AdminCategories from "./pages/AdminCategories";
import AdminRegions from "./pages/AdminRegions";
import AdminRequests from "./pages/AdminRequests";
import AdminReviews from "./pages/AdminReviews";
import Profile from "./pages/Profile";

function App() {

    return (
        <AuthProvider>

            {/* HashRouter keeps deep links working on static hosts like GitHub Pages. */}
            <HashRouter>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/places"
                        element={
                            <ProtectedRoute>
                                <Places />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/places/:id"
                        element={
                            <ProtectedRoute>
                                <PlaceDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <AdminRoute>
                                <Dashboard />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/favorites"
                        element={
                            <ProtectedRoute>
                                <Favorites />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/reviews"
                        element={
                            <ProtectedRoute>
                                <Reviews />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/requests"
                        element={
                            <ProtectedRoute>
                                <ExplorationRequests />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/places"
                        element={
                            <AdminRoute>
                                <AdminPlaces />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories"
                        element={
                            <AdminRoute>
                                <AdminCategories />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/requests"
                        element={
                            <AdminRoute>
                                <AdminRequests />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/reviews"
                        element={
                            <AdminRoute>
                                <AdminReviews />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/regions"
                        element={
                            <AdminRoute>
                                <AdminRegions />
                            </AdminRoute>
                        }
                    />

                </Routes>

            </HashRouter>

        </AuthProvider>
    );
}

export default App;