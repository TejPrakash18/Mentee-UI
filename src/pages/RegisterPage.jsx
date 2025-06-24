import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../services/authService";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
        const onlyLettersAndSpaces = /^[A-Za-z\s]*$/;
        if (!onlyLettersAndSpaces.test(value)) {
            return; // Block if input contains digits or special characters
        }
    }

    setFormData({
        ...formData,
        [name]: value,
    });
};


const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const result = await authService.register(formData);
        console.log("User Registered:", result);
        alert("Registration successful!");
        navigate('/login');
    } catch (error) {
        console.error("Registration Failed:", error.response?.data || error.message);
        alert("Registration failed. Please try again.");
    }
};


    return (
        <div className="flex items-center justify-center min-h-screen bg-black px-4">
            <div className="bg-[#1D1C20] p-10 rounded-lg shadow-lg w-full sm:w-96 space-y-8">
                <h2 className="text-3xl font-semibold text-center text-white">Register</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div>
                        <label className="block text-sm font-medium text-white">Name</label>
                        <input
    name="name"
    type="text"
    placeholder="Enter your full name"
    value={formData.name}
    onChange={handleChange}
    className="w-full px-4 py-3 mt-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-orange-400 text-white bg-[#1D1C20]"
    required
/>

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Username</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="Enter User name"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 mt-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-orange-400 text-white bg-[#1D1C20]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 mt-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-orange-400 text-white bg-[#1D1C20]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 mt-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-orange-400 text-white bg-[#1D1C20]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition duration-300"
                    >
                        Register
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-white">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-orange-400 font-semibold hover:text-orange-600 hover:underline transform hover:scale-105 transition duration-300 ease-in-out"
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
