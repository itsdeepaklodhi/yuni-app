import shoeLady from "../icons/category-svg-blue/shoe-lady.svg";
import shoeMan from "../icons/category-svg-blue/shoe-man.svg";
import watch from "../icons/category-svg-blue/watch.svg";
import sofa from "../icons/category-svg-blue/sofa.svg";
import ball from "../icons/category-svg-blue/ball.svg";
import homeItem from "../icons/category-svg-blue/homeitem.svg";
import music from "../icons/category-svg-blue/music.svg";
import book from "../icons/category-svg-blue/book.svg";
import toy from "../icons/category-svg-blue/toy.svg";
import animal from "../icons/category-svg-blue/animal.svg";
import cpu from "../icons/category-svg-blue/cpu.svg";
import painting from "../icons/category-svg-blue/painting.svg";
import car from "../icons/category-svg-blue/car.svg";
import cutlery from "../icons/food-svg-blue/cutlery.svg";
import fix from "../icons/category-svg-blue/fix.svg";
import { Link } from "react-router-dom";

export default function Categories() {
  return (
    <section className="padding-top">
      <div className="container">
        <nav className="row gy-4 row-cols-xl-8 row-cols-md-6 row-cols-sm-4 row-cols-3">
          <div className="col">
            <Link to="category?id=50636" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={shoeLady} />
              </span>
              <span className="text"> Women's clothing</span>
            </Link>
          </div>

          <div className="col">
            <Link to="/category?id=200053" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={shoeMan} />
              </span>
              <span className="text"> Men’s clothing </span>
            </Link>
          </div>

          <div className="col">
            <Link to="/category?id=222386" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={sofa} />
              </span>
              <span className="text"> Furniture </span>
            </Link>
          </div>

          <div className="col">
            <Link to="category?id=200066" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={ball} />
              </span>
              <span className="text"> Sport and Fitness </span>
            </Link>
          </div>

          <div className="col">
            <Link to="category?id=200087" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={homeItem} />
              </span>
              <span className="text"> Appliances </span>
            </Link>
          </div>

          <div className="col">
            <Link to="/category?id=200681" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={cutlery} />
              </span>
              <span className="text"> Kitchen item's </span>
            </Link>
          </div>

          <div className="col">
            <Link to="category?id=200102" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={car} />
              </span>
              <span className="text"> Automotive </span>
            </Link>
          </div>

          <div className="col">
            <Link to="category?id=225529" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={painting} />
              </span>
              <span className="text"> Artwork & Painting </span>
            </Link>
          </div>

          <div className="col">
            <Link to="category?id=200069" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={toy} />
              </span>
              <span className="text"> Kid's toys </span>
            </Link>
          </div>

          <div className="col">
            <Link to="category?id=200212" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={animal} />
              </span>
              <span className="text"> Pet items </span>
            </Link>
          </div>

          <div className="col">
            <Link to="category?id=200094" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={cpu} />
              </span>
              <span className="text"> Computers & Laptops </span>
            </Link>
          </div>

          <div className="col">
            <Link to="category?id=200051" className="item-link text-center">
              <span className="icon mb-2 icon-md rounded">
                <img width="32" height="32" src={fix} />
              </span>
              <span className="text">Tools & Hardware</span>
            </Link>
          </div>
        </nav>
      </div>
    </section>
  );
}
