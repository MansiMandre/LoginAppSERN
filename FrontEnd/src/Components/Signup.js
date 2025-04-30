import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA component

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null); // Store captcha response
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the button
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if CAPTCHA is completed
    if (!captchaValue) {
      setError('Please verify that you are human.');
      return;
    }

    setLoading(true); // Set loading to true while the request is in progress

    try {
      const response = await axios.post('http://localhost:3001/register', {
        email,
        password,
        captcha: captchaValue, // Send the captcha response along with the form data
      });

      console.log('Response from server:', response); // Log the server response

      if (response.status === 201) {
        console.log('Signup successful, redirecting to login');
        navigate('/login'); // Navigate to login after successful signup
      } else {
        setError('Signup failed. Please try again.'); // Handle failure case
      }
    } catch (err) {
      console.error('Error during signup:', err); // Log the error for debugging
      setError('Signup failed. Please try again.'); // Display error message
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  const handleCaptchaChange = (value) => {
    console.log('Captcha value:', value); // Log the captcha value
    setCaptchaValue(value); // Set captcha response from reCAPTCHA
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add reCAPTCHA */}
          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6LdnSycrAAAAAMouYN_TxyO-57vrZHiZ7jALjuK2" // Replace with your Google reCAPTCHA site key
              onChange={handleCaptchaChange}
            />
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
