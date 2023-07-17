
export default function StoreProductGrid(props) {
  const products = props.products;

  return (
    <div className="row g-1">
      {products.map((product) => (
        <div className="col-lg-3 col-md-4 col-6" key={product.id}>
          <figure
            className="card card-product-grid mb-0"
            onClick={() => {
              props.setEditId(product.id);
              props.updateModal.show();
            }}
          >
            <div className="postion-relative">
              <div className="img-wrap bg-white">
                <img src={product.imageUrl} alt="product" />
              </div>
              <div className="d-flex w-100 px-2 py-1 justify-content-between position-absolute bottom-0 bg-trasparent d-none">
                <button className="btn btn-light px-3 py-0">View</button>
                <button className="btn btn-light px-3 py-0">Edit</button>
              </div>
            </div>
          </figure>
        </div>
      ))}
    </div>
  );
}
