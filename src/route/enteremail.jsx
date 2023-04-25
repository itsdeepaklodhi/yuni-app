import { Formik, useFormikContext, Field, Form, ErrorMessage } from "formik";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { SessionContext } from "../App";

export default function EnterEmail() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(SessionContext);
  const [error, setError] = useState(undefined);
  if (error) throw error;

  return (
    <section className="padding-y" style={{ minHeight: "75vh" }}>
      <div className="container  ">
        <div className="mt-5 pt-5">
          <div className="card shadow mx-auto " style={{ maxWidth: "400px" }}>
            <div className="card">
              <div className="card-body">
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email("must be a valid email")
                      .required("required"),
                  })}
                  onSubmit={(values, actions) => {
                    const form = new FormData();
                    form.append("email", values.email);
                    const headers = new Headers();
                    if (token) headers.set("X-Auth-Token", token);
                    fetch(
                      "https://api.yunistore.in/auth/signup/verify-email/email",
                      {
                        method: "post",
                        body: form,
                        headers,
                      }
                    )
                      .then((res) => {
                        if (res.ok) {
                          if (!token) {
                            let tkn = res.headers.get("x-auth-token");
                            console.log(tkn);
                            setToken(tkn);
                          }
                          navigate("/signup/enter-otp");
                        } else if (res.status === 400 || res.status === 409) {
                          res.json().then((json) => {
                            actions.setFieldError("email", json.message);
                          });
                        } else throw res;
                      })
                      .catch((err) => setError(err))
                      .finally(() => {
                        actions.setSubmitting(false);
                      });
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        {/* <input
                      name="lorem"
                      className="form-control"
                      placeholder="ex. name@gmail.com"
                      type="email"
                    />*/}
                        <Field
                          name="email"
                          className="form-control"
                          placeholder="ex. name@gmail.com"
                        />
                        <ErrorMessage name="email">
                          {(msg) => <div className="invalid-field">{msg}</div>}
                        </ErrorMessage>
                      </div>
                      <button
                        className="btn w-100 btn-primary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        continue
                      </button>
                    </Form>
                  )}
                </Formik>
                <hr />
                <p className="text-center mb-2">
                  Already have account? <a href="#">Sign in</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
