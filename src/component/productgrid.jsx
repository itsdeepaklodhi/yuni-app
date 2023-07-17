import { useNavigate } from "react-router-dom";
export default function ProductGrid(props) {
  const data = props.products;

  const navigate = useNavigate();

  const goTo = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="row g-2 g-sm-3">
      {data.map((product) => {
        return (
          <div className="col-lg-3 col-md-4 col-6" key={product.id}>
            <figure
              className="card card-product-grid d-flex"
              onClick={() => goTo(product.id)}
            >
              <div className="img-wrap bg-white">
                <img src={product.imageUrl} alt="product" />
              </div>
              <figcaption className="info-wrap border-top">
                <p className="title limit-2lines">{product.title}</p>
                <div className="price-wrap mt-2">
                  <strong className="price">₹ {product.price}</strong>
                  <del className="price-old">₹ {product.mrp}</del>
                </div>
              </figcaption>
            </figure>
          </div>
        );
      })}
    </div>
  );
}

export function Placeholder(props) {
  return (
    <div className="container my-4">
      <div className="row ">
        {Array.from({ length: props.length }, (_, i) => (
          <div className="col-lg-3 col-md-4 col-6 " key={i}>
            <figure className="card card-product-grid placeholder-wave d-flex">
              <div className="img-wrap placeholder "></div>
              <figcaption className="info-wrap border-top">
                <p className="title limit-2lines placeholder">
                  Lorem ipsum dolor, sit amet consectetur
                </p>
                <div className="price-wrap  mt-2">
                  <strong className="price placeholder">Lorem ipsum</strong>
                  <del className="price-old placeholder">Lorem</del>
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}
