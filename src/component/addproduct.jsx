import { Formik, Field, Form, ErrorMessage, } from "formik";
import { useContext } from "react";
import { useEffect, useRef } from "react";
import { useState } from "react";

import * as Yup from "yup";
import { JwtContext,  ToastContext } from "../App";
import { Modal, } from "bootstrap";


export default function AddProduct(props) {
  const { jwt } = useContext(JwtContext);
  const { notify } = useContext(ToastContext);
  const modal = useRef(null);
  const dataList = useRef(null);
  const [error, setError] = useState(null);
  if (error) throw error;

  useEffect(() => {
    props.setAddModal(new Modal(document.getElementById("add-product-modal")));
  }, []);

  const MyFormik = (formikProps) => (
    <Formik
      initialTouched={{ images: true, specs: true }}
      initialStatus={{ specLength: 2 }}
      initialValues={{
        images: [],
        title: "",
        mrp: 1,
        price: 1,
        quantity: 0,
        category: "",
        specs: {},
        description: "",
      }}
      validationSchema={Yup.object({
        images: Yup.mixed().test(
          "images-count",
          "select at least 2 images",
          (value) => {
            if (!value) return false;
            if (value instanceof FileList && value.length > 1) return true;
            return false;
          }
        )
        .test("images-size","image size must be less then 512KB",
        (value)=>{
             if(value instanceof FileList){
              for( const image of value)
                  if(image.size > 512000) return false;
             } 
             return true;
        })
        ,
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
        const headers = {
          Authorization: "Bearer " + jwt,
        };

        const { images, ...product } = values;
        const { specs } = product;
        const newSpecs = {};

        Object.keys(specs).forEach((key) => {
          let index;

          if (key.startsWith("spec")) {
            let spec = specs[key];
            if (!spec) return;

            index = key.split("_")[1];

            let value = specs[`value_${index}`];
            if (!value) return;

            newSpecs[spec] = value;
          }
        });

        if (Object.keys(newSpecs).length < 2) {
          actions.setFieldError("specs", "provide at least 2 specifications");
          actions.setSubmitting(false);
          return;
        }

        const form = new FormData();

        let i = 0;
        for (const image of images) {
          form.append(`images_${i}`, image);
          i++;
        }

        form.append("product", JSON.stringify({ ...product, specs: newSpecs }));

        fetch("https://api.yunistore.in/user/store/products", {
          method: "post",
          body: form,
          headers,
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else throw res;
          })
          .then((product) => {
            product.imageUrl = product.imageUrls[0];
            props.addProduct(product);
            props.addModal.hide();
            notify("product added");
            actions.resetForm();
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
      id="add-product-modal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <MyFormik>
          {(formik) => (
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product details</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <Form id="add-product-form">
                  <div className=" mb-2">
                    <article className="card-body p-0">
                      <div className="row mb-2">
                        <label className="col-3 form-label">Images</label>
                        <div className="col-9">
                          <label
                            htmlFor="images"
                            className="btn btn-secondary w-100"
                            onBlur={(event) => {
                              formik.setFieldTouched("images");
                            }}
                          >
                            Select images
                          </label>

                          <input
                            id="images"
                            name="images"
                            type="file"
                            className="form-control d-none"
                            accept="image/*"
                            multiple
                            onChange={(event) => {
                              formik.setFieldValue(
                                "images",
                                event.currentTarget.files
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {/* <Field
                            type="file"
                            name="images"
                            id="images"
                            className="form-control d-none"
                            accept="images/*"
                            multiple={true}
                          /> */}
                          <ErrorMessage name="images">
                            {(msg) => (
                              <div className="invalid-field">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div className="row mt-2" id="previewdiv">
                          {Array.from(formik.values.images).map((file, i) => (
                            <div
                              key={"img" + i}
                              className="img-div border col-4"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt="product"
                              />
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
                          {/* <input
                          type="text"
                          className="form-control"
                          placeholder="₹"
                        /> */}
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
                          {/* <input
                          type="text"
                          className="form-control"
                          placeholder="₹"
                        /> */}
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
                          {/* <input
                          type="number"
                          className="form-control"
                          placeholder="0"
                        /> */}
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
                          {/* <input
                          type="text"
                          className="form-control"
                          placeholder="Type here"
                        /> */}
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
                          <datalist id="categories" ref={dataList}></datalist>
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
                          {[...Array(formik.status.specLength).keys()].map(
                            (i) => (
                              <div
                                key={i}
                                className="d-flex align-items-center my-1"
                              >
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="property"
                                  onChange={(event) => {
                                    const { specs } = formik.values;
                                    specs[`spec_${i}`] = event.target.value;
                                    formik.setFieldValue("specs", specs);
                                  }}
                                />

                                <span>&nbsp;:&nbsp;</span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="value"
                                  onChange={(event) => {
                                    const { specs } = formik.values;
                                    specs[`value_${i}`] = event.target.value;
                                    formik.setFieldValue("specs", specs);
                                  }}
                                />
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
                          {/* <textarea
                          className="form-control"
                          placeholder="Type here"
                          rows="5"
                        ></textarea> */}
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
              <div className="modal-footer d-flex justify-content-center">
                <button
                  id="add-form-submit"
                  type="submit"
                  className="btn btn-primary px-4"
                  form="add-product-form"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </div>
          )}
        </MyFormik>
      </div>
    </div>
  );
}
