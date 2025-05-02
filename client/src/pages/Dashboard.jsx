import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/" />;

    return <h1>Welcome to Your Dashboard, {user.displayName}</h1>;
};

export default Dashboard;
