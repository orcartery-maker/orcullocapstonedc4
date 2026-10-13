import { Link } from "react-router-dom";

export default function PlaceCard({ place }) {

    return (
        <div className="place-card">

            {place.image ? (
                <img
                    src={`http://127.0.0.1:8000/storage/${place.image}`}
                    alt={place.name}
                />
            ) : (
                <div className="place-placeholder">
                    🌍
                </div>
            )}

            <div className="place-content">

                <span className="category-badge">
                    {place.category?.name}
                </span>

                <h3>{place.name}</h3>

                <p>
                    📍 {place.location}
                </p>

                <p>
                    {place.description?.substring(0, 100)}
                    ...
                </p>

                <Link
                    to={`/places/${place.id}`}
                    className="view-button"
                >
                    View Details
                </Link>

            </div>

        </div>
    );
}