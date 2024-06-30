import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import AddPas from './components/AddPas';
import SearchBar from './components/Search';
import PassCard from './components/PassCard';

// ! By @BroKariim
// * Availabel in Github

const queryClient = new QueryClient();

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accs, setAccs] = useState([]);

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
          <div className="contentContainer  py-8 px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {accs.map((acc) => (
              <PassCard key={acc.id} acc={acc} decryptPassword={decryptPassword} />
            ))}
          </div>
        </div>

        {/* Footer here */}
      </main>
    </>
  );
}

// contentContainer isinya dari route = createBrowserRouter

export default App;
