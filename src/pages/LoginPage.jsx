import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import { toast } from "sonner";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      const data = await authService.login(username, password);
      loginUser(data.token);
      toast.success("Login Successfully!");
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="bg-[#1D1C20] p-10 rounded-lg shadow-lg w-full sm:w-96 space-y-8">
        <h2 className="text-3xl font-semibold text-center text-white">Login</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-400 px-4 py-2 rounded text-sm shadow text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 mt-2 border border-orange-300 rounded-lg text-white bg-[#1D1C20] placeholder-orange-400 focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-2 border border-orange-300 rounded-lg text-white bg-[#1D1C20] placeholder-orange-400 focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-white">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-400 font-semibold hover:text-orange-600"
            >
              Register Here
            </Link>
          </p>
          <p className="text-sm text-white">
            Forgot the password?{" "}
            <Link
              to="/forgot-password"
              className="text-orange-400 font-semibold hover:text-blue-600"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
