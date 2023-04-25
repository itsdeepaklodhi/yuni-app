export default function ToastAlert(props) {
  return (
    <div
      className="position-fixed top-0 end-0 py-3 pe-md-3 "
      style={{ Zindex: "11" }}
    >
      <div
        id="toast"
        className="toast align-items-center text-white bg-primary border-0 hide"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{props.msg}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
}
