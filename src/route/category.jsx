import "bootstrap/js/dist/dropdown";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {  LocationContext } from "../App";
import ProductGrid, { Placeholder } from "../component/productgrid";
import Pagination from "../component/pagination";
import { useMemo } from "react";
import Distance from "../component/distance";

export default function Category(props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { location } = useContext(LocationContext);
  const [productLoading, setproductLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [category, setCategory] = useState(undefined);
  const [products, setProducts] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(undefined);
  if (error) throw error;


  const id = searchParams.get("id");
  const page = searchParams.get("page") || 1;
  const distance = searchParams.get("distance") || 10;

  const changeDistance = (newDistance)=>{
    navigate(`/category?id=${id}&distance=${newDistance}`)
  }

  const selected = useMemo(() => {
    if (!category) return null;
    if (!category.name) return [null];
    return [...category.name.split("/"), null];
  }, [category]);

  useEffect(() => {
    const fill = async () => {
      setCategoryLoading(true);

      let category;
      if (id) category = await getCategory(id);
      else category = { parentID: null, id: 0, name: null };

      let length = category.name ? category.name.split("/").length : 0;
      let parentId = category.id;

      for (let i = length; i >= 0; i--) {
        getChilds(parentId).then((childs) => {
          let mapped = childs.map((child) => ({
            ...child,
            name: child.name.split("/").at(-1),
          }));
          childs.current = { ...childs.current, parentId: mapped };
          categories[i] = mapped;
          setCategories([...categories]);
        });

        if (!parentId) break;

        let cat = await getCategory(parentId);
        parentId = cat.parentId || 0;
      }

      setCategory(category);
      setCategoryLoading(false);
    };
    fill();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setproductLoading(true);
    getProducts(id, page,  location).then((products) => {
      setProducts(products);
      setproductLoading(false);
    });
  }, [id, page, distance, location]);


  // useEffect(() => console.log(categories), [categories]);

  const getCategory = (id) =>
    fetch(`https://api.yunistore.in/public/categories/${id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .catch((err) => setError(err));
  const getChilds = (id) =>
    fetch(`https://api.yunistore.in/public/categories/${id}/firstchilds`)
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .catch((err) => setError(err));

  const getProducts = (id, page, location) => {
    const pageSize = 20;
    const formData = new FormData();
    formData.append("id", id);
    formData.append("size", pageSize);
    formData.append("page", page - 1);
    formData.append("distance", distance);
    
    // formData.append("ltd", 24.5701017);
    formData.append("ltd", location.latitude);
    // formData.append("lng", 77.733788);
    formData.append("lng", location.longitude);

    return fetch(`https://api.yunistore.in/public/products/bycategory`, {
      method: "post",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw res;

        return res.json();
      })
      .catch((err) => setError(err));
  };

  const categoryNav = () => (
    <div className="bg-primary">
      <div className="container mb-1">
        <nav className="d-flex flex-wrap  py-2 ">
          {categoryLoading ? (
            <div className="text-white">Loading...</div>
          ) : (
            selected.map((cat, i) => (
              <>
                {categories[i] && (categories[i].length || "") && (
                  <>
                    {!i || <div className="text-white px-1">/</div>}
                    <div className="dropdown" key={i}>
                      <span
                        className="text-white dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {cat || "select"}
                      </span>
                      {
                        <ul
                          className="dropdown-menu"
                          style={{ overflow: "auto", maxHeight: "75vh" }}
                        >
                          {categories[i].sort().map((category, index) => (
                            <li className="" key={index}>
                              <span
                                className="dropdown-item"
                                onClick={() => {
                                  navigate(`/category?id=${category.id}&distance=${distance}`);
                                }}
                              >
                                {category.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      }
                    </div>
                  </>
                )}
              </>
            ))
          )}
        </nav>
      </div>
    </div>
  );

  // useEffect(() => console.log(products), [products]);

  return (
    <>
      {categoryNav()}
      {productLoading ? (
        <>
          <header className="bg-primary mb-4  text-white">
            <div className="container d-flex align-items-center justify-content-between">
              <span className="d-block py-2">Loading...</span>
            </div>
          </header>

          <div className="container">
            <Placeholder length="12" />
          </div>
        </>
      ) : (
        products && (
          <>
            <header className="bg-primary mb-4  text-white">
              <div className="container d-flex align-items-center justify-content-between">
                <div>

                <span className="d-block  py-2">
                  {products.totalElements}
                  {products.totalElements > 1 ? " Product's Found" : " Product Found"}
                </span>
                </div>
                <div>
                  <Distance distance = {distance} changeDistance={changeDistance}/>
                </div>
              </div>
            </header>
            {products.totalElements ? (
              <>
                <div className="container">
                  <ProductGrid products={products.content} />
                </div>
                <Pagination
                  currentPage={page}
                  changeCurrentPage={(pageNo) =>
                    navigate(`/category?id=${id}&page=${pageNo}&distance=${distance}`)
                  }
                  totalPages={products.totalPages}
                />
              </>
            ) : (
              <div
                className="d-flex align-items-center flex-column justify-content-center"
                style={{ height: "60vh" }}
              >
                <h3 className="">Sorry, no results found!</h3>
                <p className="fw-lighter fs-6 text-center">
                  Please select another category or try searching for something
                  else
                </p>
              </div>
            )}
          </>
        )
      )}
    </>
  );
}
