import { useOutletContext } from "react-router-dom";

export default function AskLocation(props) {
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
                <b>yunistore</b> needs your location
              </p>
              <button
                className="btn btn-primary w-100"
                onClick={props.getLocation}
              >
                auto detect location
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </div>
  );
}
