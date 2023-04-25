import { useNavigate, useOutletContext, redirect } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { JwtContext, ToastContext } from "../App";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toast } from "bootstrap";

// require("react-dom");
// window.React2 = require("react");
// console.log(window.React1 === window.React2);

export default function ProfileMainEdit(props) {
  const { setNavComp } = useOutletContext();

  const { jwt, setJwt } = useContext(JwtContext);
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  if (error) throw error;

  useEffect(() => {
    setNavComp("main");

    if (!jwt) return;

    fetch(`https://api.yunistore.in/user`, {
      headers: { Authorization: "Bearer " + jwt },
    })
      .then((res) => {
        if (!res.ok) throw res;

        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err));
  }, []);

  /* useEffect(() => {
    if (!data) return;
    const gender = data.gender.toLowerCase();
    document.querySelector(`#${gender}radio`).checked = true;
  });*/

  if (!data)
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
    <article className="container">
      <div className=" py-2">
        <Formik
          initialValues={{
            name: data.name,
            gender: data.gender,
            dob: data.dob,
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .max(40, "Must be 40 characters or less")
              .required("required"),
            gender: Yup.string().required("required"),
            dob: Yup.date().required("required"),
          })}
          onSubmit={(values, actions) => {
            fetch("https://api.yunistore.in/user", {
              method: "put",
              body: JSON.stringify(values),
              headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + jwt,
              },
            })
              .then((res) => {
                if (!res.ok) throw res;
                navigate("/profile/main");
              })
              .catch((err) => setError(err))
              .finally(() => actions.setSubmitting(false));
          }}
        >
          {({ isSubmitting, dirty }) => (
            <Form method="post">
              <div className="row">
                <div className="col-lg-8">
                  <div className="row gx-3">
                    <div className="col-lg-8 col-sm-6  mb-3">
                      <label className="form-label">Name</label>
                      {/*<input
                    required
                    name="name"
                    className="form-control"
                    type="text"
                    defaultValue={data.name}
        />*/}
                      <Field name="name" className="form-control" />
                      <ErrorMessage name="name" />
                    </div>

                    <div className=" mb-3">
                      <label className="form-label pb-1">Gender</label>
                      <br />
                      <div className="form-check form-check-inline">
                        {/*<input
                      className="form-check-input"
                      type= "radio"
                      name="gender"
                      id="maleradio"
                      value="MALE"
                    />*/}
                        <label className="form-check-label" htmlFor="maleradio">
                          <Field type="radio" name="gender" value="MALE" />
                          Male
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        {/*<input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="femaleradio"
                      value="FEMALE"
                    />*/}
                        <label
                          className="form-check-label"
                          htmlFor="femaleradio"
                        >
                          <Field type="radio" name="gender" value="FEMALE" />
                          Female
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        {/*<input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="otherradio"
                      value="OTHER"
                />*/}
                        <label
                          className="form-check-label"
                          htmlFor="otherradio"
                        >
                          <Field type="radio" name="gender" value="OTHER" />
                          Other
                        </label>
                      </div>
                      <ErrorMessage name="gender" />
                    </div>

                    <div className="col-lg-8 col-sm-6  mb-3">
                      <label className="form-label">Birthday</label>
                      {/*<input
                    className="form-control"
                    name="dob"
                    type="date"
                    required
                    defaultValue={data.dob}
                  />*/}
                      <Field type="date" name="dob" className="form-control" />
                      <ErrorMessage name="dob" />
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting || !dirty}
              >
                Save changes
              </button>
            </Form>
          )}
        </Formik>

        <hr className="my-4" />

        <div className="row" style={{ maxWidth: "920px" }}>
          <div className="col-md-6">
            <article className="box mb-3 bg-light">
              <button
                className="btn float-end btn-outline-danger btn-sm"
                onClick={() => {
                  if (window.confirm("Are you sure to Remove Your Store")) {
                    fetch(`https://api.yunistore.in/user`, {
                      method: "delete",
                      headers: { Authorization: "Bearer " + jwt },
                    })
                      .then((res) => {
                        if (res.ok) {
                          setJwt("");
                          notify("Your Account has been deleted");
                          navigate("/");
                        }
                        throw res;
                      })
                      .catch((err) => setError(err));
                  }
                }}
              >
                Deactivate
              </button>
              <p className="title mb-0">Remove account</p>
              <small className="text-muted d-block" style={{ width: "70%" }}>
                Once you delete your account, there is no going back.
              </small>
            </article>
          </div>
        </div>
      </div>
    </article>
  );
}

export async function action({ request }) {
  const formData = await request.formData();

  const res = await fetch("https://api.yunistore.in/user", {
    method: "put",
    body: {
      name: formData.get("name"),
      gender: formData.get("gender"),
      dob: formData.get("dob"),
    },
    headers: {
      "content-type": "application/json",
    },
  });

  if (res.ok) {
    return redirect("/profile/main");
  } else {
    throw res;
  }
}
