import React from "react";
import {
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from "react-router-dom";


// export default class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     console.log("in the error boundary");
//     return { hasError: true };
//   }

//   componentDidCatch(error, info) {
//     // Example "componentStack":
//     //   in ComponentThatThrows (created by App)
//     //   in ErrorBoundary (created by App)
//     //   in div (created by App)
//     //   in App
//     // logErrorToMyService(error, info.componentStack);
//   }

//   render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       // return this.props.fallback;
//     }

//     return this.props.children;
//   }
// }

export default function ErrorBoundary() {
  let error = useRouteError();
  const navigate = useNavigate();
  
  
  // Uncaught ReferenceError: path is not defined
  // Uncaught ReferenceError: path is not defined
  if (isRouteErrorResponse(error) || error instanceof Response) {
      // console.log(error.data);
      // error.json().then(console.log);
    let msg = "";
    switch (error.status) {
      case 400:
        msg =
          "The Server is not able to process the request due to client error";
        break;
      case 401:
        msg = (
          <p>
            You are not Authorized, Please <Link to={"/signin"}>Signin</Link>{" "}
            and try again
          </p>
        );
        break;
      case 404:
        msg = "We are not able to find the resource you requested";
        break;
      case 405:
        msg = "This Method  is Not Allowed for this resource ";
        break;
      case 408:
        msg = "Request Timeout";
        break;
      case 410:
        msg = "The resource you are looking for is gone";
        break;
      case 412:
        msg = "Preconditons failed";
        break;
      case 415:
        msg =
          "The media format of the requested data is not supported by the server";
        break;
      case 428:
        msg = "Precondtions are required by the Server to process this request";
        break;
      case 500:
        msg = "Internal Server Error";
        break;
      case 403:
        msg = "Service Unavailable at this point of time";
        break;

      default:
        msg = "Sorry for the inconvinience, We will fix it very soon";
    }

    return (
      <div className="wrapper row2">
        <div id="container" className="clear">
          <section
            id="fof"
            className="clear d-block w-100 text-center"
            style={{
              padding: "150px 0",
              lineHeight: "1.6em",
            }}
          >
            <div className="hgroup mb-2">
              <h1 className="mb-2 fs-1 text-uppercase">
                Something Just Went Wrong !
              </h1>
              <h2
                className="d-inline-block mt-2 text-lowercase border-top border-bottom border-1 border-dark"
                style={{
                  fontSize: "80px",
                }}
              >
                {error.status + " error"}
              </h2>
            </div>
            <p className="d-block m-0 p-0 fs-6">{msg}</p>

            <p className="d-block p-0 fs-6 mt-2">
              Go <Link onClick={() => navigate(-1)}>Back</Link> or{" "}
              <Link to="/">Home</Link>
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper row2">
      <div id="container" className="clear">
        <section
          id="fof"
          className="clear d-block w-100 text-center"
          style={{
            padding: "200px 0",
            lineHeight: "1.6em",
          }}
        >
          <div className="hgroup mb-2">
            <h1 className="mb-2 fs-1 text-uppercase">
              Something Just Went Wrong !
            </h1>
          </div>
          <p className="d-inline-block m-0 py-2 fs-6 border-top border-bottom border-1 border-dark">
            For Some Reason Your Request Could Not Be Completed
          </p>
          <p className="d-block p-0 fs-6 mt-3">
            Go <Link onClick={() => navigate(-1)}>Back</Link> or{" "}
            <Link to="/">Home</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
