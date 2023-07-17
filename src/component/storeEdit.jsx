import { Formik, Form, Field, ErrorMessage, } from "formik";
import { useContext, useState, useRef } from "react";
import { useEffect } from "react";
import { useNavigate,  useOutletContext } from "react-router-dom";
import { JwtContext, ToastContext, LocationContext } from "../App";
import * as Yup from "yup";
import tt from "@tomtom-international/web-sdk-maps";
import { ttKey } from "../config";

import { Modal } from "bootstrap";

export function StoreEdit() {

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
  const { notify } = useContext(ToastContext);

  
  const { setNavComp } = useOutletContext();
  const navigate = useNavigate();
  const [store, setStore] = useState(undefined);
  const [error, setError] = useState(undefined);
  if (error) throw error;

  useEffect(() => {
    setNavComp("store");
    if (jwt) fetchStore();
    
  }, []);

  const fetchStore = () => {
    fetch(`https://api.yunistore.in/user/store`, {
      headers: { Authorization: "Bearer " + jwt },
    })
      .then((res) => {
        if (res.status === 404) {
          navigate("/profile/nostore");
          return;
        }
        if (!res.ok) throw res;

        return res.json();
      })
      .then((store) => setStore(store))
      .catch((err) => setError(err));
  };

    useEffect(()=>{
      
      if(!store) return;

      mapModal.current.addEventListener("show.bs.modal", (event) => {
        loadMap();})
      setModal(new Modal(mapModal.current));
    },[store])


    useEffect(() => {
      
      return () => {
        if (modal) modal.hide();
      };
    }, [modal]);

  const loadMap = ()=>{

    if(!store) return;
    if(map.current) return;

    const center = [store.lng, store.ltd];

    let ttMap = tt.map({
      key: ttKey,
      container: mapContainer.current,
      style: mode.current.street,
      center: center,
      zoom: 13,
    });

    ttMap.addControl(new tt.FullscreenControl());
    ttMap.addControl(new tt.NavigationControl());
    const geolocateControl = new tt.GeolocateControl({
      showAccuracyCircle: false,
      
    });
    ttMap.addControl(geolocateControl);

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

  }

  if (!store)
    return (
      <>
        <div
          className="d-flex justify-content-center align-items-center "
          style={{ height: "70vh" }}
        >
          <div className="spinner-border " role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );

  return (
    <>
    <div className="container py-2">
      <div className="row">
        <div className="col-sm-8 col-md-6 px-4">
          <Formik
            initialValues={{ image: "", ...store }}
            validationSchema={Yup.object({
              image: Yup.mixed().notRequired().test('image-size',"image size must be less then 512KB",
              value=>{
                if(value) return !(value.size>512000);
                return true;
            }),
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
              console.log(values);
              console.log(ltdLng);
              let { image, ...store } = values;

              if(ltdLng)
               store = { ...store, ltd: ltdLng.ltd, lng: ltdLng.lng,};

              console.log(store);

              const headers = {
                Authorization: "Bearer " + jwt,
              };

              const form = new FormData();
              if (image) form.append("image", image);
              form.append("store", JSON.stringify({ ...store }));

              fetch("https://api.yunistore.in/user/store", {
                method: "put",
                body: form,
                headers,
              })
                .then((res) => {
                  if (res.ok) {
                    notify("Store updated");
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
                    name="image"
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
                      {ltdLng ? "location changed" : "change location"}
                    </button>
                    <Field
                      className="d-none"
                      name="location"
                      // validate={() =>
                      //   ltdLng ? undefined : "please locate your store"
                      // }
                    />
                   
                  </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={(formik.isSubmitting || !(formik.dirty || ltdLng)) }
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <hr className="mt-2 mb-4" />

      <div className="row">
        <div className="col-md-6">
          <article className="box mb-3 bg-light">
            <button
              disabled
              className="btn float-end btn-outline-danger btn-sm"
              onClick={() => {
                if (window.confirm("Are you sure to Remove Your Store")) {
                  fetch(`https://api.yunistore.in/user/store`, {
                    method: "delete",
                    headers: { Authorization: "Bearer " + jwt },
                  })
                    .then((res) => {
                      if (res.ok) {
                        notify("Store Removed from Account");
                        navigate("/");
                      }
                      throw res;
                    })
                    .catch((err) => setError(err));
                }
              }}
            >
              Remove
            </button>
            <p className="title mb-0">Remove Store</p>
            <small className="text-muted d-block" style={{ width: "70%" }}>
              Once you delete your Store, there is no going back.
            </small>
          </article>
        </div>
      </div>
    </div>
     <div
     className="modal fade"
     id="locationModal"
     tabIndex="-1"
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
   </>
  );
}
