import { useEffect, useState } from "react";
import { useContext } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import { JwtContext, ToastContext } from "../App";
export default function Signin() {
  const { setJwt } = useContext(JwtContext);
  const { setNavComp } = useOutletContext();
  const [formErr, setFormErr] = useState(undefined);
  const { notify } = useContext(ToastContext);
  const navigation = useNavigation();
  const actionData = useActionData();

  const navigate = useNavigate();

  useEffect(() => setNavComp("signin"), []);

  useEffect(() => {
    if (actionData) {
      if (actionData.jwt) {
        setJwt(actionData.jwt);
        notify("You Are Logged In");
        navigate("/");
      } else setFormErr(actionData.err);
    }
  });

  return (
    <section className="padding-y">
      <div className="container">
        <div className="card shadow mx-auto" style={{ maxWidth: "400px" }}>
          <div className="card">
            <div className="card-body">
              <h4 className="mb-4">Sign in</h4>
              <Form method="post" replace>
                <div className="mb-3">
                  {formErr && (
                    <div>
                      <p className="text-danger">{formErr}</p>
                    </div>
                  )}
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    required
                    className="form-control"
                    placeholder="ex. name@gmail.com"
                    type="email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <a className="float-end" href="#">
                    Forgot?
                  </a>
                  <input
                    className="form-control"
                    name="password"
                    required
                    minLength={8}
                    maxLength={20}
                    placeholder="******"
                    type="password"
                  />
                </div>

                <button
                  className="btn w-100 btn-primary"
                  type="submit"
                  disabled={navigation.state === "submitting"}
                >
                  Sign in
                </button>
              </Form>

              <p className="text-divider my-4">New to Yunistore?</p>
              <Link to="/signup/enter-email" className="btn w-100 btn-light">
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const res = await fetch("https://api.yunistore.in/auth/signin", {
    method: "post",
    body: formData,
  });

  const result = {
    jwt: "",
    err: "",
  };

  if (res.ok) result.jwt = await res.text();
  else if (res.status == 400) result.err = "invalid email or password";
  else throw res;

  return result;
}
