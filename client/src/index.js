import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EntriesBrowser from "./components/EntriesBrowser";
import GraphView from "./components/GraphView";

import KnowYourStatsWrapper from "./components/KnowYourStatsWrapper";
import Stopwatches from "./components/Stopwatches";
import LoginPage from "./components/LoginPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <KnowYourStatsWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<Stopwatches />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/stopwatch/:id" element={<EntriesBrowser />} />
          <Route path="/stopwatch/:id/graph" element={<GraphView />} />
        </Routes>
      </Router>
    </KnowYourStatsWrapper>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
