
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link
} from "react-router-dom";

/*******************************************
 * Fake Auth API Call Simulation
 *******************************************/
const fakeAuthApi = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isAuthenticated: true,
        user: {
          name: "Anand",
          role: "user" // change to "admin"
        }
      });
    }, 1500);
  });

/*******************************************
 * Auth Context
 *******************************************/
const AuthContext = createContext();

function AuthProvider({ children }) {
  // FIX 1: loading should start as true
  const [loading, setLoading] = useState(true);

  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fakeAuthApi();

        setAuth({
          isAuthenticated: response.isAuthenticated,
          user: response.user
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    // FIX 2: pass object, not comma operator
    <AuthContext.Provider
      value={{
        ...auth,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/*******************************************
 * Custom Hook
 *******************************************/
function useAuth() {
  return useContext(AuthContext);
}

/*******************************************
 * Protected Route Component
 *******************************************/
function ProtectedRoutes({
  children,
  allowedRoutes = []
}) {
  const {
    loading,
    user,
    isAuthenticated
  } = useAuth();

  // Show loader
  if (loading) {
    return <div>Checking authentication...</div>;
  }

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check authorization
  if (
    allowedRoutes.length > 0 &&
    !allowedRoutes.includes(user.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return children;
}

/*******************************************
 * Pages
 *******************************************/
function Home() {
  return <div>Home</div>;
}

function Login() {
  return <div>Login</div>;
}

function Unauthorized() {
  return (
    <div>
      403 Unauthorized Access
    </div>
  );
}

function Dashboard() {
  return <div>Dashboard</div>;
}

function AdminPanel() {
  return <div>Admin Panel</div>;
}

/*******************************************
 * Navbar
 *******************************************/
function Navbar() {
  const {
    isAuthenticated,
    user
  } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px"
      }}
    >
      <Link to="/">Home</Link>

      {!isAuthenticated && (
        <Link to="/login">
          Login
        </Link>
      )}

      {isAuthenticated && (
        <>
          <Link to="/dashboard">
            Dashboard
          </Link>

          {/* Admin only */}
          {user?.role ===
            "admin" && (
            <Link to="/admin">
              Admin Panel
            </Link>
          )}
        </>
      )}
    </nav>
  );
}

/*******************************************
 * Routes
 *******************************************/
function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes
              allowedRoutes={[
                "admin",
                "user"
              ]}
            >
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        {/* Admin only route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoutes
              allowedRoutes={[
                "admin"
              ]}
            >
              <AdminPanel />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/unauthorized"
          element={
            <Unauthorized />
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
}

/*******************************************
 * App
 *******************************************/
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
