import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

function App() {
    const { user } = useAuth();

    return (
        <div>
            <h1>Welcome {user ? user.displayName : "Guest"}</h1>
            {!user && <Login />}
        </div>
    );
}

export default App;
