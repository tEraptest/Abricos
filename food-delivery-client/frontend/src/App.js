import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home"; // Import the Home component

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Ваши маршруты */}
        <Route path="/" element={<Home />} />
        {/* ...other routes... */}
      </Routes>
    </div>
  );
}

export default App;
