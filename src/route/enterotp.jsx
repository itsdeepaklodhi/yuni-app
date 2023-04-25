import { Formik, Field, Form, ErrorMessage } from "formik";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { SessionContext } from "../App";

export default function EnterOtp() {
  const navigate = useNavigate();
  const { token } = useContext(SessionContext);
  const [verified, setVerified] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [error, setError] = useState(undefined);
  if (error) throw error;

  return (
    <section className="padding-y" style={{ minHeight: "75vh" }}>
      <div className="container ">
        <div className="mt-5 pt-5">
          <div className="card shadow mx-auto" style={{ maxWidth: "350px" }}>
            <div className="card">
              <div className="card-body">
                <Formik
                  initialValues={{ otp: "" }}
                  validationSchema={Yup.object({
                    otp: Yup.string()
                      .matches("^[0-9]{6}$", "it's a 6 digit number")
                      .required("required"),
                  })}
                  onSubmit={(values, actions) => {
                    const form = new FormData();
                    form.append("otp", values.otp);
                    const headers = new Headers({ "X-Auth-Token": token });
                    fetch(
                      "https://api.yunistore.in/auth/signup/verify-email/otp",
                      {
                        method: "post",
                        headers,
                        body: form,
                      }
                    )
                      .then((res) => {
                        if (res.ok) setVerified(true);
                        else if (res.status === 400)
                          actions.setFieldError("otp", "Wrong OTP");
                        else if (res.status === 408) {
                          setTimeOut(true);
                          actions.setFieldError("otp", "Request timeout");
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
                        <p>
                          We have sent you an OTP to your email.
                          <br />
                          it is only valid for 5 minutes.
                        </p>
                        <div className="input-group mb-3">
                          {/*<input
                                      type="text"
                                      inputmode="numeric"
                                      autocomplete="one-time-code"
                                      className="form-control"
                                      placeholder="OTP"
                                      aria-label="OTP"
                                      aria-describedby="button-verify"
                />*/}
                          <Field
                            name="otp"
                            className="form-control"
                            disabled={verified || timeOut}
                          />

                          <button
                            className={
                              verified ? "btn btn-success" : "btn btn-primary"
                            }
                            type="submit"
                            id="button-verify"
                            disabled={verified || isSubmitting || timeOut}
                          >
                            {verified ? "verified" : "verify"}
                          </button>
                          <ErrorMessage name="otp">
                            {(msg) => (
                              <div className="invalid-field">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <button
                        className="btn w-100 btn-primary"
                        onClick={() =>
                          navigate(
                            timeOut
                              ? "/signup/enter-email"
                              : "/signup/user-details"
                          )
                        }
                        disabled={!(verified || timeOut)}
                      >
                        {timeOut ? "Go Back" : "Continue"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
