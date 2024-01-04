import React, { useState } from "react";
import { useAuth } from "./Auth_status";

const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setErrors(null);

      await signup(username, password, matricNo);
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        // Handle 422 status (Unprocessable Entity)
        const errors = Array.isArray(error.response.data.errors)
          ? error.response.data.errors
          : [error.response.data.errors];

        console.error("Signup failed:", errors);
        setErrors(errors);
      } else {
        console.error("Signup failed:", error.message);
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

      <h2>Signup</h2>
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
      <label htmlFor="matricNo">
        Matric Number:
        <input
          type="text"
          id="matricNo"
          name="matricNo"
          placeholder="Matric Number"
          value={matricNo}
          onChange={(e) => setMatricNo(e.target.value)}
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
      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Signing up..." : "Signup"}
      </button>
    </div>
  );
};

export default SignupPage;
