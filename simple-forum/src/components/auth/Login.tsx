import React, { useState } from "react";
import { useAuth } from "./Auth_status";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrors(null);

      await login(username, password);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 422) {
          // Handle 422 status (Unprocessable Entity)
          // Ensure users fill in both username and passsword fields
          const errors = Array.isArray(error.response.data.errors)
            ? error.response.data.errors
            : [error.response.data.errors];

          console.error("Login failed:", errors);
          setErrors(errors);
        } else if (error.response.status === 401) {
          // Invalid username or password
          console.error("Login failed: Invalid username or password");
          setErrors(["Invalid username or password"]);
        }
      } else {
        console.error("Login failed:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {errors && (
        <div>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <h2>Login</h2>
      <label htmlFor="username">
        Username:
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label htmlFor="password">
        Password:
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "LogIn"}
      </button>
    </div>
  );
};

export default LoginPage;
