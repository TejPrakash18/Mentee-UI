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
    try {
      const data = await authService.login(username, password);
      loginUser(data.token);
      navigate("/");
      toast.success("Login Successfully!");
    } catch (err) {
      toast.error("login field");
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-[#1D1C20] p-10 rounded-lg shadow-lg w-full sm:w-96 space-y-8">
        <h2 className="text-3xl font-semibold text-center text-white">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-white">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 mt-2 border border-orange-300 rounded-lg text-white bg-[#1D1C20]"
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
              className="w-full px-4 py-3 mt-2 border border-orange-300 rounded-lg text-white bg-[#1D1C20]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
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
