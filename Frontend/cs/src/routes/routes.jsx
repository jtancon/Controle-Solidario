import { useContext } from "react";
import { AuthGoogleContext } from "../context/authGoogle";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
    const { signed, loading } = useContext(AuthGoogleContext);

    if (loading) return null;
    
    return signed ? <Outlet /> : <Navigate to="/Login" replace />;    
};
