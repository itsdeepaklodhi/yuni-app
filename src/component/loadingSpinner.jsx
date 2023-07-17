export function LoadingSpinner() {
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center "
        style={{ height: "90vh" }}
      >
        <div className="spinner-border " role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
}
