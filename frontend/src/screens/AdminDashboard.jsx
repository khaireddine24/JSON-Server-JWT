import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLogin from "./AdminLogin";
import AdminHeader from "../components/Header";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get("http://localhost:5000/admin");
          setAdmin({
            id: response.data.id,
            username: response.data.username,
            name: response.data.name
          });
        } catch (error) {
          console.error("Auth verification failed:", error);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
  
    useEffect(() => {
      checkAuthStatus();
    }, []);
  
    const handleLogin = (adminData) => {
      setAdmin(adminData);
    };
  
    const handleLogout = () => {
      setAdmin(null);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    };
  
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="d-flex flex-column min-vh-100">
        {!admin ? (
          <div className="flex-grow-1">
            <AdminLogin onLogin={handleLogin} />
          </div>
        ) : (
          <div className="flex-grow-1">
            <AdminHeader admin={admin} onLogout={handleLogout} />
            <ProductList />
          </div>
        )}
        <Footer />
      </div>
    );
};

export default AdminDashboard;