import "../../styles/PageNotFound.css";
import erro_img from "../../assets/undraw_404.svg";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <>
      <main className="error-main-container">
        <div className="">
          <img alt="error_404" src={erro_img} className="error-img"></img>
          <h1 className="error-title">Page not found</h1>
          <p className="error-msg-content">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="redirect-links">
            <Link to={"/home"} className="redirect-home">
              Go back home
            </Link>

            <div className="redirect-support">
              <Link to={"/support"}>
                Contact support <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default PageNotFound;
