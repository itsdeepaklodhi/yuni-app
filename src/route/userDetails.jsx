import { Formik, Field, Form, ErrorMessage } from "formik";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { SessionContext, ToastContext } from "../App";

export default function UserDetails() {
  const { token } = useContext(SessionContext);
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();
  const [error, setError] = useState(undefined);

  if (error) throw error;

  const MyFormik = (props) => (
    <Formik
      initialValues={{
        name: "",
        gender: "",
        dob: "",
        password: "",
        repass: "",
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .max(40, "Must be 40 characters or less")
          .required("Enter full name"),
        gender: Yup.string().required("Select gender"),
        dob: Yup.date()
          .max(new Date(), "it must be past")
          .required("Enter date of birth"),
        password: Yup.string()
          .matches(
            "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,}$",
            "Password must be minimum eight characters, no space, at least one letter, one number and one special character"
          )
          .required("Enter password"),
      })}
      onSubmit={(values, actions) => {
        const headers = new Headers();
        headers.set("content-type", "application/json");
        if (token) headers.set("X-Auth-Token", token);

        fetch("https://api.yunistore.in/auth/signup/create-account", {
          method: "post",
          body: JSON.stringify(values),
          headers,
        })
          .then((res) => {
            if (res.ok) {
              notify("Account Created");
              navigate("/home");
            } else throw res;
          })
          .catch((err) => setError(err))
          .finally(() => {
            actions.setSubmitting(false);
          });
      }}
    >
      {props.children}
    </Formik>
  );

  return (
    <section className="bg-light">
      <div className="container pt-5">
        <div className="card shadow mx-auto" style={{ maxWidth: "400px" }}>
          <div className="card-body">
            <h4 className="card-title mb-4">Sign up</h4>
            <MyFormik>
              {({ values, errors, touched, isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    {/*<input
                  type="text"
                  className="form-control"
                  name="firstname"
                  required=""
                  placeholder="John Doe"
                />*/}
                    <Field
                      name="name"
                      className="form-control"
                      placeholder="john doe"
                    />
                    <ErrorMessage name="name">
                      {(msg) => <div className="invalid-field">{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <br />
                    <div className="form-check form-check-inline">
                      {/* <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="inlineRadio1"
                      value="MALE"
                      required=""
                    /> */}
                      <Field
                        name="gender"
                        type="radio"
                        id="maleradio"
                        className="form-check-input"
                        value="MALE"
                      />
                      <label className="form-check-label" htmlFor="maleradio">
                        Male
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      {/* <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="inlineRadio2"
                      value="FEMALE"
                      required=""
                    /> */}
                      <Field
                        name="gender"
                        type="radio"
                        id="femaleradio"
                        className="form-check-input"
                        value="FEMALE"
                      />

                      <label className="form-check-label" htmlFor="femaleradio">
                        Female
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      {/* <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="inlineRadio3"
                      value="OTHER"
                      required=""
                    /> */}
                      <Field
                        name="gender"
                        type="radio"
                        id="otherradio"
                        className="form-check-input"
                        value="OTHER"
                      />

                      <label className="form-check-label" htmlFor="otherradio">
                        Other
                      </label>
                    </div>
                    <ErrorMessage name="gender">
                      {(msg) => <div className="invalid-field">{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date of Birth</label>
                    {/* <input
                    className="form-control"
                    placeholder=""
                    type="date"
                    name="dob"
                    required=""
                  /> */}
                    <Field name="dob" type="date" className="form-control" />
                    <ErrorMessage name="dob">
                      {(msg) => <div className="invalid-field">{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Create password</label>
                    {/* <input
                    className="form-control"
                    placeholder="At least 8 characters."
                    type="password"
                    required=""
                    name="password"
                  /> */}
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="At least 8 characters"
                    />
                    <ErrorMessage name="password">
                      {(msg) => <div className="invalid-field">{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Repeat password</label>
                    {/* <input
                    className="form-control"
                    placeholder=""
                    type="text"
                    required=""
                    name="repass"
                  /> */}
                    <Field
                      name="repass"
                      className="form-control"
                      validate={(value) => {
                        if (errors.password || !touched.password) return;
                        else if (!value) return "Enter your password again";
                        else if (!(value === values.password))
                          return "Entered password does not match";
                      }}
                    />
                    <ErrorMessage name="repass">
                      {(msg) => <div className="invalid-field">{msg}</div>}
                    </ErrorMessage>
                  </div>
                  <div className="mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={isSubmitting}
                    >
                      create account
                    </button>
                  </div>

                  <div className="mb-2">
                    <label className="form-check">
                      {/* <input
                      className="form-check-input"
                      type="checkbox"
                      checked=""
                      value=""
                    /> */}
                      <Field
                        name="terms"
                        type="checkbox"
                        value="check"
                        className="form-check-input"
                        required
                      />
                      <span className="form-check-label">
                        I agree with Terms and Conditions
                      </span>
                    </label>
                  </div>
                </Form>
              )}
            </MyFormik>
          </div>
        </div>
        <br />
        <br />
      </div>
    </section>
  );
}
