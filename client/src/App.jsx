import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import AddPas from './components/AddPas';
import SearchBar from './components/Search';
import PassCard from './components/PassCard';

// Untuk bagian contenConatiner ikutn dive-note aj
const queryClient = new QueryClient();

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accs, setAccs] = useState([]);

  //kita pake fetch data dengan endpoint showpasswords
  // tdiak sekedar show namun kita juga harus decrypt
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

  //nah seperti yg kita tahu di database, password disimpan dalam bentuk decripsi
  // sehingga jika hany fetch yg ditapilkan adalah data encrypt, ini akan membuat pemilikinya tidak bisa melihat
  /// sehingga steelah fetch dengan showpassword kita harus decrypt

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
      <main className="main bg-[#222222] flex text-white ">
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
            <div class=" rounded-xl border max-h-[200px] border-white p-4 flex flex-col items-center ">
              <span class="inline-block rounded-lg p-3">
                <div class="inline-flex align-middle justify-center items-center select-none text-white">
                  <svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="32" width="32">
                    <path
                      d="M8.50141 14.75C8.3114 14.75 8.12141 14.68 7.97141 14.53L5.97141 12.53C5.68141 12.24 5.68141 11.7599 5.97141 11.4699L7.97141 9.46994C8.26141 9.17994 8.7414 9.17994 9.0314 9.46994C9.3214 9.75994 9.3214 10.24 9.0314 10.53L7.5614 12L9.0314 13.4699C9.3214 13.7599 9.3214 14.24 9.0314 14.53C8.8814 14.68 8.69141 14.75 8.50141 14.75Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M16.5014 14.75C16.3114 14.75 16.1214 14.68 15.9714 14.53C15.6814 14.24 15.6814 13.7599 15.9714 13.4699L17.4414 12L15.9714 10.53C15.6814 10.24 15.6814 9.75994 15.9714 9.46994C16.2614 9.17994 16.7414 9.17994 17.0314 9.46994L19.0314 11.4699C19.3214 11.7599 19.3214 12.24 19.0314 12.53L17.0314 14.53C16.8814 14.68 16.6914 14.75 16.5014 14.75Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M12.5 22.75C6.57 22.75 1.75 17.93 1.75 12C1.75 6.07 6.57 1.25 12.5 1.25C18.43 1.25 23.25 6.07 23.25 12C23.25 17.93 18.43 22.75 12.5 22.75ZM12.5 2.75C7.4 2.75 3.25 6.9 3.25 12C3.25 17.1 7.4 21.25 12.5 21.25C17.6 21.25 21.75 17.1 21.75 12C21.75 6.9 17.6 2.75 12.5 2.75Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M11.5021 15.0801C11.4021 15.0801 11.3021 15.0601 11.2121 15.0201C10.8321 14.8601 10.6521 14.4201 10.8221 14.0301L12.8221 9.36004C12.9821 8.98004 13.4221 8.80002 13.8021 8.97002C14.1821 9.13002 14.3621 9.57008 14.1921 9.96008L12.1921 14.6301C12.0721 14.9101 11.7921 15.0801 11.5021 15.0801Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </span>

              <h2 class="mt-2 font-semibold text-base sm:text-lg text-white">For Developers</h2>
              <p class="sm:mt-1 block text-center text-sm sm:text-base text-gray-300"> Prototype ideas online, without depending on your local environment.</p>
            </div>
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
