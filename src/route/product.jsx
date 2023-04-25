import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState, useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import tt from "@tomtom-international/web-sdk-maps";
import { services } from "@tomtom-international/web-sdk-services";
import { JwtContext, LocationContext, ToastContext } from "../App";
import { Modal } from "bootstrap";

import storedp from "../images/storedp.jpg";

export default function Product() {
  const [product, setProduct] = useState(undefined);
  const [liked, setLiked] = useState(false);
  const { jwt } = useContext(JwtContext);
  const { notify } = useContext(ToastContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState(undefined);
  if (error) throw error;

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.yunistore.in/public/products/${id}`)
      .then((res) => {
        if (!res.ok) throw res;

        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    if (jwt) {
      fetch(`https://api.yunistore.in/user/wishlist/exist?id=${id}`, {
        headers: { Authorization: "Bearer " + jwt },
      })
        .then((res) => {
          if (res.status === 200) setLiked(true);
          else if (res.status === 404) setLiked(false);
          else throw res;
        })
        .catch((err) => setError(err));
    }
  }, [id]);

  useEffect(() => {
    return () => {
      if (modal) modal.hide();
    };
  }, [modal]);

  const addToWishlist = () => {
    const form = new FormData();
    form.append("id", id);
    fetch(`https://api.yunistore.in/user/wishlist`, {
      method: "post",
      body: form,
      headers: { Authorization: "Bearer " + jwt },
    })
      .then((res) => {
        if (!res.ok) throw res;
        setLiked(true);
        notify("added to wishList");
      })
      .catch((err) => setError(err));
  };

  const deleteFromWishlist = () => {
    const form = new FormData();
    form.append("id", id);
    fetch(`https://api.yunistore.in/user/wishlist`, {
      method: "delete",
      body: form,
      headers: { Authorization: "Bearer " + jwt },
    })
      .then((res) => {
        if (!res.ok) throw res;
        setLiked(false);
        notify("removed from wishlist");
      })
      .catch((err) => setError(err));
  };

  if (loading)
    return (
      <>
        <div
          class="d-flex justify-content-center align-items-center "
          style={{ height: "90vh" }}
        >
          <div class="spinner-border " role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );

  return (
    <section className="py-3 py-sm-4">
      <div className="container">
        <div className="row">
          <aside className="col-lg-6">
            <article className="gallery-wrap gallery-vertical">
              <div className="img-big-wrap img-thumbnail">
                {/* <div className="" style={{ height: "500px ", overflow: "clip" }}> */}
                <img src={product.imageUrls[0]} id="main-img" />
              </div>
              {/*********************  img-big-wrap***************************/}
              <div className="thumbs-wrap">
                {product.imageUrls.map((imgUrl) => (
                  <div
                    className="item-thumb"
                    onClick={() =>
                      (document.querySelector("#main-img").src = imgUrl)
                    }
                  >
                    <img width="60" height="60" src={imgUrl} />
                  </div>
                ))}
              </div>
              {/**************  thumbs-wrap*****************************/}
            </article>
            {/***************<!-- gallery-wrap .end// -->*********************/}
          </aside>
          <main className="col-lg-6">
            <div className="p-0">
              <div className="titte">
                <h4>
                  {product.title}
                  <br />
                </h4>
              </div>
              <div>
                <hr />
              </div>
              <div className="mt-1 text-secondary">
                <h6 className="mb-1 fs-7">
                  MRP -&nbsp;₹{product.mrp}
                  <br />
                </h6>
              </div>
              <div className="mt-1 text-primary">
                <h6 className="mb-1">Price -&nbsp;₹{product.price}</h6>
              </div>
              <div className="size"></div>
              <div>
                {product.quantity ? (
                  <h5 className="text-success">Instock</h5>
                ) : (
                  <h5 className="text-danger">Out of Stock</h5>
                )}
              </div>

              {/****************  STORE CARD   ********************/}
              <Link
                to={`/store/${product.store.id}`}
                className="card card-store-list mt-3"
              >
                <div className="row g-0">
                  <div className="col-4">
                    <div className="img-wrap" style={{ height: "100px" }}>
                      <img
                        src={product.store.imageUrl || storedp}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = storedp;
                        }}
                      />
                    </div>
                  </div>

                  {/***************<!-- col.// -->*****************/}
                  <div className="col-8">
                    <div className="card-body h-100 d-flex flex-column justify-content-between ps-0 pe-2 py-3">
                      <div>
                        <p href="#" className="title h5">
                          {product.store.name}
                        </p>
                        <p className="text-muted">{product.store.category}</p>
                      </div>
                    </div>
                    {/******************<!-- card-body.// -->**********************/}
                  </div>
                  {/****************<!-- col.// -->****************/}

                  {/****************<!-- col.// -->*****************/}
                </div>
                {/***************<!-- row.// -->****************/}
              </Link>

              <div className="d-flex justify-content-center direction mt-2">
                <button
                  className="btn btn-primary w-100"
                  type="button"
                  onClick={() => modal.show()}
                >
                  Get Directions
                </button>
              </div>

              <div className="d-flex justify-content-center direction mt-2">
                <button
                  className="btn btn-primary w-100"
                  type="button"
                  onClick={() => {
                    if (jwt) liked ? deleteFromWishlist() : addToWishlist();
                    else {
                      notify("please Login");
                      navigate("/signin");
                    }
                  }}
                >
                  {liked ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              <div className="specs mt-4">
                <h5 className="mb-0">Specification-</h5>
                <div className="row gy-2 specs-row m-0">
                  {Object.keys(product.specs).map((key) => (
                    <>
                      <div className="col col-6 col-md-4 spec-col ">
                        <div className="border-bottom h-100">
                          <p className="m-0 spec fw-bold">{key}</p>
                          <p className="value mb-0">{product.specs[key]}</p>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>

              <div className="mt-4 pb-2 border-bottom">
                <h5>Category-</h5>
                <p className="mb-0">{product.category}</p>
              </div>

              <div className="desc mt-4 pb-2 border-bottom">
                <h5>Description -</h5>
                <p className="">{product.description}</p>
              </div>
            </div>

            {/************   <!-- product-info-aside .// -->********/}
          </main>

          {/******************  <!-- col.// --> ********************/}
        </div>
        {/*********************<!-- row.// -->********************/}
      </div>
      {/*********************<!-- container .//  -->********************/}
      <MapModal
        {...{
          modal,
          setModal,
          store: product.store,
        }}
      />
    </section>
  );
}

function MapModal(props) {
  const mapContainer = useRef(null);
  const mode = useRef({
    street:
      "https://api.tomtom.com/style/1/style/21.1.0-*?map=basic_main&traffic_incidents=incidents_day&traffic_flow=flow_relative0&poi=poi_main&key=p5U8MxTf8OGcluRN9TD3POVGMLtGAiis",
    satellite:
      "https://api.tomtom.com/style/1/style/*?map=2/basic_street-satellite&traffic_incidents=incidents_day&traffic_flow=flow_relative0&poi=2/poi_satellite&key=p5U8MxTf8OGcluRN9TD3POVGMLtGAiis",
  });
  const [mapMode, setMapMode] = useState("street");
  const routeGeojson = useRef(null);
  const ttMap = useRef(null);
  const mapModal = useRef(null);
  const { location } = useContext(LocationContext);

  useEffect(() => {
    mapModal.current.addEventListener("show.bs.modal", (event) => {
      loadMap();
    });
    props.setModal(new Modal(mapModal.current));
  }, []);

  const loadMap = () => {
    const current = [location.longitude, location.latitude];
    const storeLocation = [props.store.lng, props.store.ltd];
    // const current = [77.733788, 24.5701017];
    var map = tt.map({
      key: "p5U8MxTf8OGcluRN9TD3POVGMLtGAiis",
      container: mapContainer.current,
      dragPan: true,
    });
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());
    const geolocateControl = new tt.GeolocateControl({
      trackUserLocation: true,
      showAccuracyCircle: false,
      positionOptions: { enableHighAccuracy: true },
    });
    map.addControl(geolocateControl);

    ttMap.current = map;

    mapModal.current.addEventListener("shown.bs.modal", (event) => {
      map.resize();
    });

    const addMarkers = (feature) => {
      var startPoint, endPoint;
      if (feature.geometry.type === "MultiLineString") {
        startPoint = feature.geometry.coordinates[0][0]; //get first point from first line
        endPoint = feature.geometry.coordinates.slice(-1)[0].slice(-1)[0]; //get last point from last line
      } else {
        startPoint = feature.geometry.coordinates[0];
        endPoint = feature.geometry.coordinates.slice(-1)[0];
      }

      // new tt.Marker({ element: createMarkerElement("start") })
      //   .setLngLat(startPoint)
      //   .addTo(map);
      // new tt.Marker({ element: createMarkerElement("finish") })
      let popup = new tt.Popup()
        .setHTML(`<h6>${props.store.name}</h6>`)
        .setOffset(30);
      new tt.Marker().setLngLat(endPoint).setPopup(popup).addTo(map);
      // .togglePopup();
    };

    const findFirstBuildingLayerId = () => {
      var layers = map.getStyle().layers;
      for (var index in layers) {
        if (layers[index].type === "fill-extrusion") {
          return layers[index].id;
        }
      }

      throw new Error(
        "Map style does not contain any layer with fill-extrusion type."
      );
    };

    map.once("load", () => {
      services
        .calculateRoute({
          key: "p5U8MxTf8OGcluRN9TD3POVGMLtGAiis",
          traffic: false,
          locations: `${current[0]},${current[1]}:${storeLocation[0]},${storeLocation[1]}`,
        })
        .then((response) => {
          var geojson = response.toGeoJson();
          routeGeojson.current = geojson;
          map.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: geojson,
            },
            paint: {
              "line-color": "#4a90e2",
              "line-width": 8,
            },
          });

          addMarkers(geojson.features[0]);

          geolocateControl.trigger();
          var bounds = new tt.LngLatBounds();
          geojson.features[0].geometry.coordinates.forEach(function (point) {
            bounds.extend(tt.LngLat.convert(point));
          });
          map.fitBounds(bounds, { duration: 0, padding: 50 });
        });

      map.on("styledata", () => {
        if (map.getLayer("route")) return;
        if (!routeGeojson.current) return;
        let geojson = routeGeojson.current;
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: geojson,
          },
          paint: {
            "line-color": "#4a90e2",
            "line-width": 8,
          },
        });
      });
    });
  };

  return (
    <div
      className="modal fade"
      id="locationModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref={mapModal}
      data-bs-backdrop="static"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content" style={{ height: "90vh" }}>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              TomTom
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body position-relative p-0">
            <div className="w-100" style={{ height: "70vh" }}>
              <div ref={mapContainer} className="h-100 w-100"></div>
            </div>
            <button
              className="btn btn-light text-capitalize m-1 position-absolute top-0 start-0"
              onClick={() => {
                let style = mapMode === "street" ? "satellite" : "street";
                ttMap.current.setStyle(mode.current[style]);

                setMapMode(style);
              }}
            >
              {mapMode + " mode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
