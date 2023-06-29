import React, { useState } from 'react';
import './Register.css';
const Register = () => {
  const [organization, setOrganization] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'organization':
        setOrganization(value);
        break;
      case 'adminName':
        setAdminName(value);
        break;
      case 'adminUsername':
        setAdminUsername(value);
        break;
      case 'adminEmail':
        setAdminEmail(value);
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

    // Perform form submission logic here
    console.log('Form submitted');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-FC95B4 to-FFCE62 register__page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-FFFAE5 mb-8 font-clash-display">
          Register your organization
        </h1>
        <p className="text-FFFAE5 text-center mb-8">
          Already registered? <a href="/" className="text-FFFAE5 underline">Login</a>
        </p>
        <form className="max-w-md mx-auto bg-transparent/25 rounded-lg shadow-lg p-8" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="organization"
              className="block mb-2 text-lg text-FFFAE5 font-semibold"
            >
              Organization Name
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={organization}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-b border-FFFAE5 bg-transparent text-gray-900 focus:outline-none focus:border-EB7B26 focus:ring-2 focus:ring-EB7B26"
              placeholder="Enter your organization name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="adminName" className="block mb-2 text-lg text-FFFAE5 font-semibold">
              Admin Name
            </label>
            <input
              type="text"
              id="adminName"
              name="adminName"
              value={adminName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-b border-FFFAE5 bg-transparent text-gray-900 focus:outline-none focus:border-EB7B26 focus:ring-2 focus:ring-EB7B26"
              placeholder="Enter your admin name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="adminUsername" className="block mb-2 text-lg text-FFFAE5 font-semibold">
              Admin Username
            </label>
            <input
              type="text"
              id="adminUsername"
              name="adminUsername"
              value={adminUsername}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-b border-FFFAE5 bg-transparent text-gray-900 focus:outline-none focus:border-EB7B26 focus:ring-2 focus:ring-EB7B26"
              placeholder="Enter your admin username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="adminEmail" className="block mb-2 text-lg text-FFFAE5 font-semibold">
              Admin Email Address
            </label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              value={adminEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border-b border-FFFAE5 bg-transparent text-gray-900 focus:outline-none focus:border-EB7B26 focus:ring-2 focus:ring-EB7B26"
              placeholder="Enter your admin email address"
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
