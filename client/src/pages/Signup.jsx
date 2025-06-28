import React, { useState } from 'react';
import { FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import convertToBase64 from '../utils/imagetobase64';
import axios from 'axios';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fileBase64: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const base64 = await convertToBase64(selectedFile);
        setFormData({
          ...formData,
          fileBase64: base64,
        });
      } catch (error) {
        console.error('Error converting file:', error);
        toast.error('Image conversion failed!');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup:', formData);

    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      console.log('Server Response:', response.data);
      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    } catch (error) {
      console.error('Error sending data:', error);
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded shadow-md relative flex flex-col items-center"
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-blue-400 relative">
            {formData.fileBase64 ? (
              <img
                src={formData.fileBase64}
                alt="Profile Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <FaCamera size={24} />
                <span className="text-xs mt-1">Upload Profile</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute top-0 left-0 w-24 h-24 opacity-0 cursor-pointer"
              title="Choose Profile Image"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h2>

        <div className="mb-4 w-full">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div className="mb-4 w-full">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div className="mb-6 w-full relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-8 right-2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
