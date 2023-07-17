import { Formik, Field, Form, ErrorMessage } from "formik";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { SessionContext, ToastContext } from "../App";

export default function ResetPassword(){

  const { token, setToken } = useContext(SessionContext);
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();
  const [error, setError] = useState(undefined);

  if (error) throw error;

    const MyFormik = (props) => (
        <Formik
          initialValues={{
            password : "",
            repass: "",
          }}
          validationSchema={Yup.object({
            password: Yup.string()
              .matches(
                "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,}$",
                "Password must be minimum eight characters, no space, at least one letter, one number and one special character"
              )
              .required("Enter password"),
          })}
          onSubmit={(values, actions) => {
            const headers = new Headers();
            headers.set("contextType","application/x-www-form-urlencoded");
            if (token) headers.set("X-Auth-Token", token);

            const form = new FormData();
            form.append("new-password", values.password);
    
            fetch("https://api.yunistore.in/auth/forgot-password/change-password", {
              method: "post",
              body: form,
              headers,
            })
              .then((res) => {
                if (res.ok) {
                  notify("password changed");
                  setToken("");
                  navigate("/home");
                } else throw res;
              })
              .catch(setError)
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
        >
          {props.children}
        </Formik>
      );

    return (
        <section className="h-100 d-flex justify-content-center align-items-center">
        <div className=" py-5  container ">
          <div className="card shadow mx-auto" style={{ maxWidth: "400px" }}>
            <div className="card-body">
             
              <MyFormik>
                {({ values, errors, touched, isSubmitting }) => (
                  <Form>
                    
                    <div className="mb-3">
                      <label className="form-label">New password</label>
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
                        Reset Password
                      </button>
                    </div>
  
                    
                  </Form>
                )}
              </MyFormik>
            </div>
          </div>
        </div>
      </section>
    )

}