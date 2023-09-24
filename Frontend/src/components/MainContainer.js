import "../styles/MainContainer.css";
import logo_se_white from "../assets/logo/logo_se_white_screen.png";
import { SideBarLinks } from "./SideBarLinks";
import ProfileBar from "./ProfileBar";
import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";

function Sidebar() {
  //const { setLogged } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 920);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 920);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect(() => {
  //   checkLogin();
  //   //navigate("/home");
  // });

  // const checkLogin = () => {
  //   if (localStorage.getItem("logged") === true) {
  //     setLogged(true);
  //     console.log("You are already connected");
  //   }
  // };

  return (
    <>
      <div className="container">
        {/* SIDEBAR */}
        <nav className="sidebar-container">
          {isMobile ? (
            <div className="sidebar-links">
              {SideBarLinks.map((link) => {
                return (
                  <div className="sidebar-only-icon">
                    <li className={link.cName} key={link.path}>
                      <Link to={link.path}>
                        <span className="sidebar-icon">{link.icon}</span>
                      </Link>
                    </li>
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <div className="container-logo-sidebar">
                <img
                  className="logo-se-white-sidebar"
                  src={logo_se_white}
                  alt="Logo_se_white"
                />
                <hr className="hr-logo"></hr>
              </div>
              <div className="sidebar-links">
                {SideBarLinks.map((link) => {
                  return (
                    <li className={link.cName} key={link.path}>
                      <Link to={link.path}>
                        <span className="sidebar-icon">{link.icon}</span>
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        {/* MAINCONTENT */}
        <div className="main-content">
          <ProfileBar></ProfileBar>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
      <div />
    </>
  );
}

export default Sidebar;
