```jsx
// App.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/*******************************************
 * Fake Auth API Simulation
 *******************************************/
const fakeAuthApi = () =>
new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      isAuthenticated: true,
      user: {
        name: "Anand",
        role: "user", // change to "admin"
      },
    });
  }, 1500);
});

/*******************************************
 * Auth Context
 *******************************************/
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    async function checkAuth() {
      const data = await fakeAuthApi();

      setAuthState({
        loading: false,
        isAuthenticated: data.isAuthenticated,
        user: data.user,
      });
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

/*******************************************
 * Protected Route Component
 *******************************************/
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { loading, isAuthenticated, user } = useAuth();

  // Show loader while checking auth
  if (loading) {
    return <div>Checking authentication...</div>;
  }

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

/*******************************************
 * Pages
 *******************************************/
function Home() {
  return <h1>Public Home Page</h1>;
}

function Login() {
  return <h1>Login Page</h1>;
}

function Dashboard() {
  return <h1>User Dashboard</h1>;
}

function AdminPanel() {
  return <h1>Admin Panel</h1>;
}

function Unauthorized() {
  return <h1>403 Unauthorized</h1>;
}

/*******************************************
 * App Routes
 *******************************************/
function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
}

/*******************************************
 * Root App
 *******************************************/
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### Route Flow

1. Public routes (`/`, `/login`) → accessible by anyone
2. Protected routes check authentication first
3. If not logged in → redirect to `/login`
4. If logged in but wrong role → redirect to `/unauthorized`
5. If auth check is still running → show loading state
6. If authorized → render requested page

### Examples

**Case 1: User not logged in**

```text
/admin → Redirect → /login
```

**Case 2: Logged in as user**

```text
/dashboard → Allowed
/admin → Redirect → /unauthorized
```

**Case 3: Logged in as admin**

```text
/dashboard → Allowed
/admin → Allowed
```

### Architecture

```text
Route Request
      ↓
ProtectedRoute
      ↓
Auth Loading Check
      ↓
Authentication Check
      ↓
Role Check
      ↓
Render / Redirect
```

### Time Complexity

```text
Auth Check → O(1)
Role Validation → O(R)  (R = allowed roles)
```
