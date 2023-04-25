import { Formik, Form, Field, ErrorMessage, yupToFormErrors } from "formik";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate, useOutlet, useOutletContext } from "react-router-dom";
import { JwtContext, ToastContext } from "../App";
import * as Yup from "yup";

export function StoreEdit() {
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

  if (!store)
    return (
      <>
        <div
          class="d-flex justify-content-center align-items-center "
          style={{ height: "70vh" }}
        >
          <div class="spinner-border " role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );

  return (
    <div className="container py-2">
      <div className="row">
        <div className="col-sm-8 col-md-6 px-4">
          <Formik
            initialValues={{ image: "", ...store }}
            validationSchema={Yup.object({
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
                <div className="mb-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={formik.isSubmitting || !formik.dirty}
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
  );
}
