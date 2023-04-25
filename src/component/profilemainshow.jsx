import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { JwtContext } from "../App";
import avatar from "../images/avatars/avatar.jpg";
export default function ProfileMainShow(props) {
  const { setNavComp } = useOutletContext();

  const navigate = useNavigate();
  const { jwt } = useContext(JwtContext);

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

  if (!data)
    return (
      <>
        <div
          class="d-flex justify-content-center align-items-center "
          style={{ height: "50vh" }}
        >
          <div class="spinner-border " role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  return (
    <article className="">
      <div className="content-body">
        <div className="d-flex align-items-center">
          <span className="bg-gray icon-md rounded-circle">
            <img src={avatar} className="icon-md rounded-circle" />
          </span>
          <div className="ms-4">
            <h6 className="title fs-4">{data.name}</h6>
          </div>
        </div>
        <hr />

        <div>
          <p>email : {data.email}</p>
          <p>gender : {data.gender}</p>
          <p>date of birth : {data.dob}</p>
        </div>

        <hr />
        <div className="d-flex ">
          <button
            className="btn btn-primary px-4"
            onClick={() => {
              navigate("/profile/main/edit");
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}
