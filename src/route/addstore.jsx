import { Formik, Form, Field, ErrorMessage, yupToFormErrors } from "formik";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import tt from "@tomtom-international/web-sdk-maps";
import * as Yup from "yup";
import { JwtContext, LocationContext, ToastContext } from "../App";
import { Modal } from "bootstrap";

export default function AddStore() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const mode = useRef({
    street:
      "https://api.tomtom.com/style/1/style/21.1.0-*?map=basic_main&traffic_incidents=incidents_day&traffic_flow=flow_relative0&poi=poi_main&key=p5U8MxTf8OGcluRN9TD3POVGMLtGAiis",
    satellite:
      "https://api.tomtom.com/style/1/style/*?map=2/basic_street-satellite&poi=2/poi_satellite&key=p5U8MxTf8OGcluRN9TD3POVGMLtGAiis",
  });
  const [mapMode, setMapMode] = useState("street");
  const mapModal = useRef(null);
  const okButton = useRef(null);
  const [ltdLng, setLtdLng] = useState(null);
  const [modal, setModal] = useState(null);
  const { jwt } = useContext(JwtContext);
  const { location } = useContext(LocationContext);
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();
  const [error, setError] = useState(undefined);
  if (error) throw error;

  useEffect(() => {
    // if (!jwt) setError(new Response({}, { status: 401 }));
  }, []);

  useEffect(() => {
    if (!modal) setModal(new Modal(mapModal.current));
    return () => {
      if (modal) modal.hide();
    };
  }, [modal]);

  useEffect(() => {
    const center = [location.longitude, location.latitude];

    let ttMap = tt.map({
      key: "p5U8MxTf8OGcluRN9TD3POVGMLtGAiis",
      container: mapContainer.current,
      style: mode.current.street,
      center: center,
      zoom: 13,
    });

    ttMap.addControl(new tt.FullscreenControl());
    ttMap.addControl(new tt.NavigationControl());

    var marker = new tt.Marker()
      .setLngLat(center)
      .setPopup(
        new tt.Popup()
          .setHTML("<p>Drag map to point your store </p>")
          .setOffset(30)
      )
      .addTo(ttMap);

    marker.togglePopup();

    ttMap.on("move", () => marker.setLngLat(ttMap.getCenter()));

    map.current = ttMap;

    mapModal.current.addEventListener("shown.bs.modal", (event) => {
      map.current.resize();
    });

    okButton.current.addEventListener("click", (event) => {
      let { lng, lat } = map.current.getCenter();
      setLtdLng({ lng, ltd: lat });
      // console.log(ltdLng.current);
    });

    // return () => map.remove();
  }, []);

  return (
    <section className="bg-light">
      <div className="container pt-5">
        <div className="card shadow mx-auto" style={{ maxWidth: "400px" }}>
          <div className="card-body">
            <h4 className="card-title mb-4">Store Details</h4>
            <Formik
              initialTouched={{ image: true }}
              initialValues={{
                image: undefined,
                name: "",
                category: "",
                contact: "",
                location: "",
              }}
              validationSchema={Yup.object({
                image: Yup.mixed().required("required"),
                name: Yup.string()
                  .min(5, "must have 5 or more characters")
                  .max(40, "must be 40 characters or less")
                  .required("required"),
                category: Yup.string()
                  .min(3, "must have 3 or more characters")
                  .required("required"),
                contact: Yup.string()
                  .matches("^[0-9]{10}$", "must be a 10 digit number")
                  .required("required"),
              })}
              onSubmit={(values, actions) => {
                const { image, ...store } = values;

                const headers = {
                  Authorization: "Bearer " + jwt,
                };

                const form = new FormData();
                form.append("image", image);
                form.append("store", JSON.stringify({ ...store, ...ltdLng }));

                fetch("https://api.yunistore.in/user/store", {
                  method: "post",
                  body: form,
                  headers,
                })
                  .then((res) => {
                    if (res.ok) {
                      notify("Store added to your account");
                      navigate("/profile/store");
                    } else throw res;
                  })
                  .catch((err) => setError(err))
                  .finally(() => actions.setSubmitting(false));
              }}
            >
              {(formik) => (
                <Form>
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      name="imageFile"
                      onChange={(event) => {
                        formik.setFieldValue("image", event.target.files[0]);
                      }}
                    />

                    <ErrorMessage name="image">
                      {(msg) => <div className="invalid-field">{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    {/* <input type="text" className="form-control" name="name" /> */}
                    <Field className="form-control" name="name" />
                    <ErrorMessage name="name">
                      {(msg) => <div className="invalid-field">{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    {/* <input
                      type="text"
                      className="form-control"
                      name="Category"
                    /> */}
                    <Field className="form-control" name="category" />
                    <ErrorMessage name="category">
                      {(msg) => <div className="invalid-field">{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact number</label>
                    {/* <input
                      className="form-control"
                      placeholder=""
                      type="text"
                    /> */}
                    <Field type="tel" className="form-control" name="contact" />
                    <ErrorMessage name="contact">
                      {(msg) => <div className="invalid-field">{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <button
                      type="button"
                      onClick={() => modal.show()}
                      className="btn btn-secondary w-100"
                    >
                      {ltdLng ? "located" : "locate on map"}
                    </button>
                    <Field
                      className="d-none"
                      name="location"
                      validate={() =>
                        ltdLng ? undefined : "please locate your store"
                      }
                    />
                    {ltdLng ? null : (
                      <ErrorMessage name="location">
                        {(msg) => <div className="invalid-field">{msg}</div>}
                      </ErrorMessage>
                    )}
                  </div>

                  <div className="mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={formik.isSubmitting}
                    >
                      Add Store
                    </button>
                  </div>

                  <div className="mb-2">
                    <label className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        required
                      />
                      <span className="form-check-label">
                        I agree with Terms and Conditions
                      </span>
                    </label>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <br />
        <br />
      </div>
      <div
        className="modal fade"
        id="locationModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={mapModal}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                TomTom
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body position-relative p-0">
              <div className="w-100" style={{ height: "70vh" }}>
                <div ref={mapContainer} className="h-100 w-100"></div>
              </div>
              <button
                className="btn btn-light text-capitalize m-1 position-absolute top-0 start-0"
                onClick={() => {
                  let style = mapMode === "street" ? "satellite" : "street";
                  map.current.setStyle(mode.current[style]);
                  setMapMode(style);
                }}
              >
                {mapMode + " mode"}
              </button>
            </div>
            <div className="modal-footer">
              <button
                ref={okButton}
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
    </section>
  );
}
