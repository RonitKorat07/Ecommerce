import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons for show/hide password
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/Userslice';
import toast from 'react-hot-toast';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const dispatch = useDispatch(); // Use dispatch to dispatch actions
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/signin', formData);
      // console.log('Login Response:', response.data);  // 👈 Yaha check karna!
     
      // Store token and user data in Redux
      const { token, user } = response.data; // Assuming the response contains these
      localStorage.setItem('token', token);
        if (token && user) {
          dispatch(setUser({ token, user })); // Dispatch to Redux
          
            // Token aur user ko localStorage me store karo
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));

          // Success notification using React Hot Toast
          toast.success(`Welcome ${user.name}! Logged in as ${user.role}`)
            if (user.role === 'admin') {
              navigate('/admin/product');
            } else{
              navigate('/');
            } 
        } else {
          toast.error('Invalid login response!');
        }

    } catch (error) {
      console.error('Login Error:', error);
      toast.error('Login failed. Please check your credentials.')
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Sign In
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email" // Added name attribute
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility based on state
            name="password" // Added name attribute
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
          <span
            onClick={() => setShowPassword(!showPassword)} // Toggle the showPassword state
            className="absolute right-3 top-9 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;
