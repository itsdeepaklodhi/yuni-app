import StoreProductGrid from "../component/storeproductgrid";
import storedp from "../images/storedp.jpg";
import UpdateProduct from "../component/updateproduct";
import tt from "@tomtom-international/web-sdk-maps";
import { useState, useEffect, useContext } from "react";
import { redirect, useNavigate, Link } from "react-router-dom";
import { JwtContext } from "../App";
import AddProduct from "../component/addproduct";
import { Modal } from "bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import { useMemo } from "react";
import { useRef } from "react";

export default function ProfileStore() {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [store, setstore] = useState(null);
  const [editProductId, setEditId] = useState(null);
  const [updateModal, setUpdateModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  const navigate = useNavigate();
  const { jwt } = useContext(JwtContext);
  const mapContainer = useRef(null);

  const [error, setError] = useState(undefined);
  if (error) throw error;

  useEffect(() => {
    if (!jwt) {
      navigate("/signin");
      return;
    }
    fetchStore();
  }, []);

  useEffect(() => {
    if (!store) return;
    const storeLocation = [store.lng, store.ltd];
    // const current = [77.733788, 24.5701017];
    var map = tt.map({
      key: "p5U8MxTf8OGcluRN9TD3POVGMLtGAiis",
      container: mapContainer.current,
      center: storeLocation,
      zoom: 13,
      dragPan: true,
    });
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());

    let popup = new tt.Popup().setHTML(`<h6>${store.name}</h6>`).setOffset(30);
    new tt.Marker().setLngLat(storeLocation).setPopup(popup).addTo(map);
    // .togglePopup();
  }, [store]);

  useEffect(() => {
    return () => {
      if (addModal && updateModal) {
        addModal.hide();
        updateModal.hide();
      }
    };
  }, [addModal, updateModal]);

  const fetchStore = () => {
    fetch(`https://api.yunistore.in/user/store`, {
      headers: { Authorization: "Bearer " + jwt },
    })
      .then((res) => {
        if (res.status === 404) {
          navigate("/profile/nostore");
          return;
        }
        if (!res.ok) throw res;

        return res.json();
      })
      .then((store) => setstore(store))
      .catch((err) => setError(err));
  };

  const getProducts = async () => {
    return fetch(
      `https://api.yunistore.in/user/store/products?page=${page}`,
      {
        headers: { Authorization: "Bearer " + jwt },
      }
    )
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        setPage(page + 1);
        let arr = [...products, ...data.content];
        setProducts([...arr]);
        setHasMore(!data.last);
        // console.log(data.last);
        // console.log(page);
        return arr;
      })
      .catch((err) => setError(err));
  };

  const addProduct = (product) => {
    setProducts([product, ...products]);
  };

  const updateProduct = (product) => {
    setProducts(
      products.map((p) => {
        if (p.id === product.id) return product;
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    const product = products.find((p) => p.id === id);
    const index = products.indexOf(product);
    if (index > -1) products.splice(index, 1);
    setProducts([...products]);
  };

  if (!store)
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
    <>
      <div className="py-3 ">
        {/************************* HEADER OF STORE *******************************/}
        <div className="mb-3">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 col-lg-6">
                <div className="row">
                  <aside className="col-5 store bg-light">
                    <a href="#" className="img-wrap">
                      <img src={store.imageUrl || storedp} />
                    </a>
                  </aside>
                  <div className="col-7">
                    <div className="p-1 pt-2 h-100 position-relative">
                      <h4>{store.name}</h4>
                      <p>{store.category}</p>

                      <a href={`tel:${store.contact}`}>{store.contact}</a>
                      <br />
                      <Link
                        to="/profile/store/edit"
                        className="btn btn-secondary py-0 "
                      >
                        Edit details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-3 d-md-none"></div>
              <div
                className="col-md-6 col-lg-6 p-0"
                ref={mapContainer}
                style={{ height: "170px" }}
              ></div>
            </div>
          </div>
        </div>
        {/****************************END OF HEADER  *******************************/}
        <div className="bg-light p-0 mb-4 py-2 ">
          <div className="container d-flex align-items-center justify-content-between">
            <strong className="d-block py-2">Products </strong>

            <button
              className="btn btn-primary py-1 m-0"
              onClick={() => addModal.show()}
            >
              Add Product
            </button>
          </div>
        </div>
        {/**************************END OF NAV *****************************/}
        <InfiniteScroll
          pageStart={0}
          loadMore={getProducts}
          hasMore={hasMore}
          loader={
            <>
              <div
                class="d-flex justify-content-center align-items-center "
                style={{ height: "250px" }}
              >
                <div class="spinner-border " role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </>
          }
        >
          <div className="container">
            <StoreProductGrid
              {...{
                setEditId,
                addModal,
                updateModal,
                products,
              }}
            />
          </div>
        </InfiniteScroll>
      </div>
      <UpdateProduct
        {...{
          updateModal,
          setUpdateModal,
          editProductId,
          fetchStore,
          updateProduct,
          deleteProduct,
        }}
      />
      <AddProduct {...{ addModal, setAddModal, fetchStore, addProduct }} />
      {/* <ProfileStoreEdit /> */}
    </>
  );
}
