import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {

    const navigate = useNavigate();

    const { register } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (
            !form.name ||
            !form.email ||
            !form.password
        ) {
            setError("All fields are required.");
            return;
        }

        if (form.password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (
            form.password !==
            form.password_confirmation
        ) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            await register(form);

            navigate("/places");

        } catch (error) {

            const errors =
                error.response?.data?.errors;

            if (errors) {
                setError(
                    Object.values(errors)
                        .flat()
                        .join(" ")
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Registration failed."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>GeoSystem</h1>

                <h2>Create Account</h2>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Name</label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <label>Email</label>

                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <label>Password</label>

                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <label>Confirm Password</label>

                    <input
                        name="password_confirmation"
                        type="password"
                        value={form.password_confirmation}
                        onChange={handleChange}
                    />

                    <button disabled={loading}>
                        {loading
                            ? "Creating..."
                            : "Register"}
                    </button>

                </form>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}