import "./styles/App.css";
import MainContainer from "./components/MainContainer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Operator from "./components/Operateur/Operator";
import SupportPage from "./components/Support/SupportPage";
import PageNotFound from "./pages/error/PageNotFound";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/auth/LoginPage";
import UserProfile from "./pages/User/UserProfile";
import PrivateRoutes from "./pages/auth/PrivateRoutes";
import SaisieForm from "./components/Saisie/SaisieForm";
import Competence from "./components/Competence/Competence";
import Secteur from "./components/Secteur/Secteur";
import Station from "./components/Station/Station";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const isLoggedIn = localStorage.getItem("isLogged");

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn === "true" ? <MainContainer /> : <LoginPage />}
          />

          <Route element={<PrivateRoutes />}>
            <Route path="/*" element={<PageNotFound />} />
            <Route path="/" element={<MainContainer />}>
              <Route path="home" element={<Home />} />
              <Route path="operateur" element={<Operator />} />
              <Route path="competences" element={<Competence />} />
              <Route path="secteur" element={<Secteur />} />
              <Route path="station" element={<Station />} />
              <Route path="saisie" element={<SaisieForm />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Route>
        </Routes>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
