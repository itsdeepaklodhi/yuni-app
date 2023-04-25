export default function ProfileStoreEdit() {
  return (
    <div className="edit-store">
      <h4 className="text-center p-3">Edit Store</h4>
      <hr className="m-0" />
      <div className="card border-0 mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <form>
            <div className="mb-2">
              <label className="form-label">Image</label>
              <input
                type="file"
                accept="images/*"
                className="form-control"
                name="name"
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" name="name" />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <input type="text" className="form-control" name="Category" />
            </div>

            <div className="mb-2">
              <label className="form-label">Contact number</label>
              <input className="form-control" placeholder="" type="text" />
            </div>

            <div className="mb-2">
              <label className="form-label">Location</label>
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#locationModal"
                className="btn btn-secondary w-100"
              >
                locate on map
              </button>
            </div>
            <div
              className="modal fade"
              id="locationModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Google maps
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body p-0">
                    <div className="" style={{ height: "70vh" }}>
                      <iframe
                        src="https://www.google.com/maps/embed/v1/view?key=AIzaSyC7jGutEmVM_WWMw4e_ZQ-ly_QAyXmSd4k&amp;center=24.574856501873516, 77.73174955328324&amp;zoom=18"
                        frameborder="0"
                        style={{ border: "0", height: "100%" }}
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        className="w-100"
                      ></iframe>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <hr className="mt-0" />
      <div
        className="mb-4 px-3 d-flex justify-content-around mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <button type="submit" className="btn btn-primary rounded-0 w-100">
          update
        </button>

        <button type="submit" className="btn btn-warning rounded-0 w-100">
          Cancel
        </button>
      </div>
    </div>
  );
}
