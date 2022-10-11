import React from "react";

import { Route, Routes, BrowserRouter } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/register" element={RegisterPage()} />
          <Route exact path="/login" element={LoginPage()} />
          <Route exact path="/" element={LandingPage()} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
