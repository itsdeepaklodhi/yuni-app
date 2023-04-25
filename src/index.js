import "bootstrap/dist/css/bootstrap.min.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "@tomtom-international/web-sdk-services/";
import "bootstrap/dist/js/bootstrap.bundle";
import "./css/ui.css";
import "./css/responsive.css";
import "./css/custom.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import App from "./App";
import Home, { loader as homeLoader } from "./route/home";
import Search from "./route/search";
import Product from "./route/product";
import Store from "./route/store";
import Profile from "./route/profile";
import ProfileMainEdit, {
  action as profileMainAction,
} from "./component/profilemainedit";
import ProfileStore from "./route/profilestore";
import Signin, { action as signinAction } from "./route/signin";
import EnterEmail from "./route/enteremail";
import EnterOtp from "./route/enterotp";
import Signup from "./route/signup";
import AddStore from "./route/addstore";
import Layout1 from "./layout1";
import Layout2 from "./layout2";
import ProfileMainShow from "./component/profilemainshow";
import UserDetails from "./route/userDetails";
import AddProduct from "./component/addproduct";
import UpdateProduct from "./component/updateproduct";
import ErrorBoundary from "./errorBoundry";
import Categories from "./route/categories";
import { Placeholder } from "./component/storeList";
import { LoadingSpinner } from "./component/loadingSpinner";
import NoStore from "./component/noStore";
import WishList from "./component/wishlist";
import ProfileStoreEdit from "./component/profilestoreedit";
import { StoreEdit } from "./component/storeEdit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <Layout1 />,

        children: [
          { index: true, element: <Home /> },
          { path: "search", element: <Search /> },
          { path: "home", element: <Home /> },
          { path: "place", element: <LoadingSpinner /> },
          { path: "product/:id", element: <Product /> },
          { path: "category", element: <Categories /> },

          { path: "store/:id", element: <Store /> },
          { path: "profile/store", element: <ProfileStore /> },

          {
            path: "profile",
            element: <Profile />,
            children: [
              {
                path: "wishlist",
                element: <WishList />,
              },
              {
                path: "main",
                element: <ProfileMainShow />,
              },
              {
                path: "main/edit",
                element: <ProfileMainEdit />,
                action: profileMainAction,
              },
              {
                path: "store/edit",
                element: <StoreEdit />,
              },
              {
                path: "nostore",
                element: <NoStore />,
              },
            ],
          },
        ],
      },
      {
        element: <Layout2 />,
        children: [
          { path: "signin", element: <Signin />, action: signinAction },
          {
            path: "signup",
            element: <Signup />,
            children: [
              { path: "enter-email", element: <EnterEmail /> },
              { path: "enter-otp", element: <EnterOtp /> },
              { path: "user-details", element: <UserDetails /> },
            ],
          },
          { path: "add-store", element: <AddStore /> },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
