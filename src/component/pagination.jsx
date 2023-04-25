import { useEffect } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  changeCurrentPage,
}) {
  const changePage = (page) => {
    console.log(page);
    if (page < 1 || page > totalPages) return;
    // console.log("changing page");

    changeCurrentPage(page);
  };

  // useEffect(() => window.scrollTo(0, 0), [currentPage]);

  const start = Math.max(currentPage - 2, 1);
  const end = Math.min(start + 4, totalPages);

  const arr = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  );

  return (
    <footer className="d-flex justify-content-center mt-4">
      <div>
        <button
          disabled={currentPage <= 1}
          className="btn btn-light"
          onClick={() => changePage(Number(currentPage) - 1)}
        >
          « Go back
        </button>
      </div>
      <nav className="ms-3">
        <ul className="pagination">
          {arr.map((i) => (
            <li
              className={i == currentPage ? "page-item active" : "page-item"}
              key={i}
            >
              <button className="page-link" onClick={() => changePage(i)}>
                {i}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button
              disabled={currentPage >= totalPages}
              className="page-link"
              onClick={() => {
                changePage(1 + Number(currentPage));
                console.log(currentPage);
                console.log(totalPages);
              }}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
