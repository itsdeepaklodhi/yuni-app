import { Formik, Field, Form, ErrorMessage} from "formik";
import { useContext } from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Modal } from "bootstrap";
import { JwtContext, ToastContext } from "../App";


export default function UpdateProduct({
  editProductId,
  updateModal,
  setUpdateModal,
  updateProduct,
  deleteProduct,
}) {
  const [product, setProduct] = useState(undefined);
  const { jwt } = useContext(JwtContext);
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();
  const modal = useRef(null);
  const [error, setError] = useState(undefined);
  if (error) throw error;

  useEffect(() => {
    setUpdateModal(new Modal(modal.current));
  }, []);

  useEffect(() => {
    if (!editProductId) return;
    fetch(`https://api.yunistore.in/public/products/${editProductId}`)
      .then((res) => {
        if (!res.ok) throw res;

        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err));
  }, [editProductId]);

  const getSpecs = (pr) => {
    const specs = {};
    Object.entries(pr.specs).forEach(([key, value], i) => {
      specs[`spec_${i}`] = key;
      specs[`value_${i}`] = value;
    });
    return specs;
  };

  const MyFormik = (formikProps) => (
    <Formik

      enableReinitialize={true}
      initialStatus={{
        specLength: product ? Object.entries(product.specs).length : 2,
      }}
      initialTouched={{ specs: true }}
      initialValues={
        product
          ? { ...product, ...getSpecs(product) }
          : {
              title: "",
              mrp: 1,
              price: 1,
              quantity: 0,
              category: "",
              description: "",
            }
      }
      validationSchema={Yup.object({
        title: Yup.string()
          .min(8, "must be 8 characters or more")
          .required("Title needed"),
        mrp: Yup.number().positive("must be more than 0").required("required"),

        quantity: Yup.number().min(0, "must be 0 or more").required("required"),
        category: Yup.string()
          .min(2, "must be 2 or more characters")
          .required("required"),
        description: Yup.string()
          .min(20, "must be 20 characters or more")
          .required("required"),
      })}
      onSubmit={(values, actions) => {
        const specs = {};

        Object.keys(values).forEach((key) => {
          let index;

          if (key.startsWith("spec")) {
            let spec = values[key];
            if (!spec) return;

            index = key.split("_")[1];

            let value = values[`value_${index}`];
            if (!value) return;

            specs[spec] = value;
          }
        });

        if (Object.keys(specs).length < 2) {
          actions.setFieldError("specs", "provide at least 2 specifications");
          actions.setSubmitting(false);
          return;
        }

        const { title, mrp, price, quantity, category, description } = values;

        const headers = {
          Authorization: "Bearer " + jwt,
          "content-type": "application/json",
        };

        fetch(
          `https://api.yunistore.in/user/store/products/${editProductId}`,
          {
            method: "put",
            body: JSON.stringify({
              title,
              mrp,
              price,
              quantity,
              category,
              specs,
              description,
            }),
            headers,
          }
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else throw res;
          })
          .then((product) => {
            setProduct(product);
            product.imageUrl = product.imageUrls[0];
            updateProduct(product);
            notify("product updated");
          })

          .catch((err) => setError(err))
          .finally(() => {
            actions.setSubmitting(false);
          });
      }}
    >
      {formikProps.children}
    </Formik>
  );

  return (
    <div
      ref={modal}
      className="modal fade"
      id="update-product-modal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <MyFormik>
          {(formik) => (
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product details </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <Form id="update-product-form">
                  <div className=" mb-2">
                    <article className="card-body p-0">
                      <div className="row mb-3">
                        <label className="col-3 form-label">Images</label>

                        <div className="row " id="previewdiv">
                          {product &&
                            product.imageUrls.map((url, i) => (
                              <div
                                className="img-div col-4 border"
                                key={"img" + i}
                              >
                                <img src={url} alt="product" />
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="row mb-2">
                        <label className="col-12 col-sm-3 col-form-label">
                          Title
                        </label>
                        <div className="col-12 col-sm-9">
                          {/* <input
                          type="text"
                          className="form-control"
                          placeholder="Type here"
                        /> */}
                          <Field
                            name="title"
                            className="form-control"
                            placeholder="Type here"
                          />
                          <ErrorMessage name="title">
                            {(msg) => (
                              <div className="invalid-field">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <label className="col-4 col-form-label">MRP</label>
                        <div className="col-8">
                          <Field
                            className="form-control"
                            placeholder="₹"
                            name="mrp"
                            type="number"
                          />
                          <ErrorMessage name="mrp">
                            {(msg) => (
                              <div className="invalid-field">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <label className="col-4 col-form-label">Price</label>
                        <div className="col-8">
                          <Field
                            className="form-control"
                            placeholder="₹"
                            name="price"
                            type="number"
                            validate={(value) => {
                              if (value < 0) return "price must be more than 0";
                              if (value > formik.values.mrp)
                                return "price must be less than MRP";
                            }}
                          />
                          <ErrorMessage name="price">
                            {(msg) => (
                              <div className="invalid-field">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <label className="col-4 col-form-label">Quantity</label>
                        <div className="col-8">
                          <Field
                            className="form-control"
                            name="quantity"
                            type="number"
                          />
                          <ErrorMessage name="quantity">
                            {(msg) => (
                              <div className="invalid-field">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <label className="col-12 col-sm-3 col-form-label">
                          Category
                        </label>
                        <div className="col-12 col-sm-9">
                          <Field
                            className="form-control"
                            name="category"
                            list="categories"
                            placeholder="Type here"
                            onChange={(event) => {
                              let value = event.target.value;
                              if (
                                value.length > 2 &&
                                event.nativeEvent.inputType === "insertText"
                              ) {
                                fetch(
                                  `https://api.yunistore.in/public/categories/search?query=${encodeURIComponent(
                                    value
                                  )}&limit=15`
                                )
                                  .then((res) => {
                                    if (res.ok) return res.json();
                                    throw res;
                                  })
                                  .then((list) => {
                                    let options = list.map((op) => {
                                      let el = document.createElement("option");
                                      el.value = op.name;
                                      return el;
                                    });

                                    document
                                      .getElementById("categories")
                                      .replaceChildren(...options);
                                  })
                                  .catch((err) => setError(err));
                              }

                              formik.setFieldValue(
                                "category",
                                event.target.value
                              );
                            }}
                          />
                          <datalist id="categories"></datalist>
                          <ErrorMessage name="category">
                            {(msg) => (
                              <div className="invalid-field">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <label className="col-12 col-sm-3 col-form-label">
                          Specs
                        </label>
                        <div className="col-12 col-sm-9">
                          <Field name="specs" className="d-none" />
                          {[...Array(formik.status.specLength).keys()].map(
                            (i) => (
                              <div
                                key={i}
                                className="d-flex align-items-center my-1"
                              >
                                <Field
                                  name={`spec_${i}`}
                                  className="form-control"
                                  value={formik.values[`spec_${i}`] || ""}
                                />

                                {/* <input
                                  type="text"
                                  className="form-control"
                                  placeholder="property"
                                  onChange={(event) => {
                                    const { specs } = formik.values;
                                    specs[`spec_${i}`] = event.target.value;
                                    // formik.setFieldValue("specs", specs);
                                    formik.setValues({
                                      ...formik.values,
                                      specs,
                                    });
                                  }}
                                  value={formik.values.specs[`spec_${i}`]}
                                /> */}

                                <span>&nbsp;:&nbsp;</span>

                                <Field
                                  name={`value_${i}`}
                                  className="form-control"
                                  value={formik.values[`value_${i}`] || ""}
                                />

                                {/* <input
                                  type="text"
                                  className="form-control"
                                  placeholder="value"
                                  onChange={(event) => {
                                    const { specs } = formik.values;
                                    specs[`value_${i}`] = event.target.value;
                                    formik.setFieldValue("specs", specs);
                                  }}
                                  value={formik.values.specs[`value_${i}`]}
                                />*/}
                              </div>
                            )
                          )}
                          <ErrorMessage name="specs">
                            {(msg) => (
                              <div className="invalid-field pb-1">{msg}</div>
                            )}
                          </ErrorMessage>
                          <div className="pb-2">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => {
                                let { specLength } = formik.status;
                                specLength++;
                                formik.setStatus({
                                  ...formik.status,
                                  specLength,
                                });
                              }}
                            >
                              add more
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <label className="col-12 col-sm-3 col-form-label">
                          Description
                        </label>
                        <div className="col-12 col-sm-9">
                          <Field
                            name="description"
                            className="form-control"
                            placeholder="Type here"
                            as="textarea"
                            rows="5"
                          />
                          <ErrorMessage name="description">
                            {(msg) => (
                              <div className="invalid-field">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                    </article>
                  </div>
                </Form>
              </div>
              <div className="modal-footer d-flex justify-content-around">
                <button
                  type="button"
                  className="btn btn-outline-success px-4"
                  onClick={() => {
                    updateModal.hide();
                    navigate(`/product/${editProductId}`);
                  }}
                >
                  View
                </button>
                <button
                  type="submit"
                  id="update-form-submit"
                  form="update-product-form"
                  className="btn btn-outline-primary px-4"
                  disabled={!formik.dirty || formik.isSubmitting}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger px-4"
                  onClick={() => {
                    if (window.confirm("Are you sure to delete this product")) {
                      const headers = {
                        Authorization: "Bearer " + jwt,
                      };
                      fetch(
                        `https://api.yunistore.in/user/store/products/${editProductId}`,
                        {
                          method: "delete",
                          headers,
                        }
                      )
                        .then((res) => {
                          if (res.ok) {
                            updateModal.hide();
                            deleteProduct(product.id);
                            notify("product deleted");
                            setProduct(null);
                          }
                        })
                        .catch((err) => setError(err));
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </MyFormik>
      </div>
    </div>
  );
}
