import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import ErrorPage from "../pages/ErrorPage";
import Header from "../components/Header";

function PageRoutes() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default PageRoutes;
