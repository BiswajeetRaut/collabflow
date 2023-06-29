import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform login logic here
    console.log('Login submitted');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-FC95B4 to-FFCE62 login__page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-FFFAE5 mb-8 font-clash-display">
          Login to your account
        </h1>
        <p className="text-FFFAE5 text-center mb-5 ">
          Not registered yet? <a className="text-EB7B26 underline">Register</a>
        </p>
        <form className="max-w-md mx-auto bg-transparent rounded-lg shadow-lg p-8" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-lg text-FFFAE5 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-b border-FFFAE5 bg-transparent text-gray-900 focus:outline-none focus:border-EB7B26 focus:ring-2 focus:ring-EB7B26"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-lg text-FFFAE5 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-b border-FFFAE5 bg-transparent text-gray-900 focus:outline-none focus:border-EB7B26 focus:ring-2 focus:ring-EB7B26"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full border border-gray-400 hover:border-black text-gray-900 hover:text-white bg-transparent hover:bg-black py-3 px-6 rounded-lg font-bold text-lg transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
