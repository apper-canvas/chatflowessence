import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/Layout";
import { routeArray, routes } from "@/config/routes";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {routeArray.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<Navigate to={routes.home} replace />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
        toastClassName="rounded-lg shadow-lg"
        bodyClassName="text-sm font-medium"
        progressClassName="bg-primary"
      />
    </BrowserRouter>
  );
}

export default App;