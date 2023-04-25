export function LoadingSpinner() {
  return (
    <>
      <div
        class="d-flex justify-content-center align-items-center "
        style={{ height: "90vh" }}
      >
        <div class="spinner-border " role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
}
