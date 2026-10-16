import Navbar from "../components/Navbar";

export default function Reviews() {
    return (
        <>
            <Navbar />

            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>My Reviews</h1>
                        <p>View recent feedback and place ratings.</p>
                    </div>
                </div>

                <div className="empty-state">
                    <h2>No reviews yet</h2>
                    <p>Explore destinations and submit your first review when you are ready.</p>
                </div>
            </main>
        </>
    );
}
