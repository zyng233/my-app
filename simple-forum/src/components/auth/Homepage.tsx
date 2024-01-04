import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => (
  <div>
    <h1>Welcome to the Simple Web Forum</h1>
    <br />
    <Link to="/login">Login</Link>
    <br />
    <Link to="/signup">Signup</Link>
  </div>
);

export default HomePage;
