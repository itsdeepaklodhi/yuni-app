import storedp from "../images/storedp.jpg";
import { useNavigate } from "react-router-dom";
export default function StoreList(props) {
  const navigate = useNavigate();

  const goTo = (id) => {
    navigate(`/store/${id}`);
  };

  return (
    <div className="row g-3">
      {props.stores.map((store) => (
        <div className="col-md-6">
          <article
            className=" card card-store-list"
            onClick={() => goTo(store.id)}
          >
            <div className="row g-0">
              <div className="col-3">
                <div className="img-wrap h-100">
                  <img src={store.imageUrl || storedp} />
                </div>
              </div>
              <div className="col-9">
                <div className="card-body h-100 d-flex flex-column justify-content-between ps-0 pe-2 py-3">
                  <div>
                    <p href="#" className="title h5">
                      {store.name}
                    </p>
                    <p className="text-muted">{store.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}

export function Placeholder() {
  return (
    <div className="row g-3">
      {Array.from({ length: 6 }, (store) => (
        <div className="col-md-6">
          <article className=" card card-store-list placeholder-wave">
            <div className="row g-0">
              <div className="col-3">
                <div className="img-wrap placeholder h-100"></div>
              </div>
              <div className="col-9">
                <div className="card-body h-100 d-flex flex-column justify-content-between ps-0 pe-2 py-3">
                  <div className="ps-2">
                    <p href="#" className="title h5 placeholder">
                      Lorem ipsum dolor sit amet consectetur adipis
                    </p>
                    <p className="text-muted placeholder">Lorem ipsum dolor</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
