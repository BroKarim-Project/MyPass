import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import AddPas from './components/AddPas';
import SearchBar from './components/Search';
import PassCard from './components/PassCard';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

// ! By @BroKariim
// * Availabel in Github

const queryClient = new QueryClient();

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accs, setAccs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkLogin(token);
    }
  }, []);
  const checkLogin = async (token) => {
    console.log('Checking login status with token:', token);
    try {
      const response = await fetch('http://localhost:3001/api/checkLogin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Login status response:', data);
      setIsLoggedIn(data.isLoggedIn);
      if (data.isLoggedIn) {
        fetchPasswords(token);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const fetchPasswordsGoogle = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/api/passwords', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAccs(data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const token = response.access_token;
      localStorage.setItem('token', token);
      await handleLoginSuccess(token);
    },
    onError: (errorResponse) => console.error('Login failed:', errorResponse),
  });

  const handleLoginSuccess = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/auth/google/callback', {
        method: 'POST', // Specify the HTTP method
        headers: { 'Content-Type': 'application/json' }, // Set content type header
        body: JSON.stringify({ token }), // Stringify data for POST request
      });

      if (response.ok) {
        // Check for successful response (2xx status code)
        const data = await response.json(); // Parse JSON response data
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          fetchPasswordsGoogle(token);
        }
      } else {
        console.error(`Error: ${response.status} - ${await response.text()}`); // Handle non-2xx status codes
      }
    } catch (error) {
      console.error('Error handling login success:', error);
    }
  };

  const fetchPasswords = async () => {
    try {
      const response = await fetch('http://localhost:3001/showpasswords');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAccs(data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const decryptPassword = async (encryption) => {
    try {
      const response = await fetch('http://localhost:3001/decryptpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: encryption.password,
          iv: encryption.iv,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const decryptedData = await response.text();
      setAccs((prevAccs) => prevAccs.map((val) => (val.id === encryption.id ? { ...val, decryptedPassword: decryptedData } : val)));
    } catch (error) {
      console.error('Error decrypting password:', error);
    }
  };

  const openModal = () => {
    console.log('Opening Modal');
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    // setSelectedColor(null);
  };
  console.log('isModalOpen:', isModalOpen);
  return (
    <>
      <main className="main bg-white flex text-black ">
        <div className="menuContainer flex ">
          <Sidebar openModal={openModal} />
        </div>
        {/* add todo */}
        <div className="relative">{isModalOpen && <AddPas onClose={closeModal} fetchPasswords={fetchPasswords} />}</div>
        <div className="flex-1">
          <Navbar />
          <div className="px-2 py-4">
            <SearchBar />
          </div>
          {!isLoggedIn ? (
            <button className="bg-slate-300 p-2" onClick={() => login()}>
              Login with Google
            </button>
          ) : (
            <div className="contentContainer  py-8 px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {accs.map((acc) => (
                <PassCard key={acc.id} acc={acc} decryptPassword={decryptPassword} />
              ))}
            </div>
          )}
        </div>

        {/* Footer here */}
      </main>
    </>
  );
}

// contentContainer isinya dari route = createBrowserRouter

export default App;
