export default function LocationError() {
  return (
    <div className="mx-5">
      <div
        className="d-block modal fade show"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
              <p>
                <span className="text-danger"> Location access denied </span>
                <br />
                please give permision to access your location
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </div>
  );
}
