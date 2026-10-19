// Previous / Next controls for any paginated list.
// page: current page number, lastPage: total pages, onPageChange(newPage).
export default function Pagination({ page, lastPage, onPageChange }) {
    if (!lastPage || lastPage <= 1) {
        return null;
    }

    return (
        <div className="pagination">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(Math.max(1, page - 1))}
            >
                Previous
            </button>

            <span>
                Page {page} of {lastPage}
            </span>

            <button
                type="button"
                disabled={page >= lastPage}
                onClick={() => onPageChange(Math.min(lastPage, page + 1))}
            >
                Next
            </button>
        </div>
    );
}
