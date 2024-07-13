import { useState, useEffect, useContext } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';

import AddPas from './components/AddPas';
import SearchBar from './components/Search';
import PassCard from './components/PassCard';
import { AuthContext } from './components/context/authContext';
import { useGoogleLogin } from '@react-oauth/google';
import { DeleteModal } from './components/Modal';

// ! By @BroKariim
// * Availabel in Github

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [accs, setAccs] = useState([]);
  const { isLoggedIn, setIsLoggedIn, setUserName } = useContext(AuthContext);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const token = response.access_token;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      await handleLoginSuccess(token); // Pass token to handleLoginSuccess
    },
    onError: (errorResponse) => console.error('Login failed:', errorResponse),
  });

  const handleLoginSuccess = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/auth/google/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          localStorage.setItem('google_user_id', data.googleUserId); // Simpan google_user_id di localStorage
          setUserName(data.name);
          fetchPasswords();
        }
      } else {
        console.error(`Error: ${response.status} - ${await response.text()}`);
      }
    } catch (error) {
      console.error('Error handling login success:', error);
    }
  };

  // fetch password note
  const fetchPasswords = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Log token di klien
    try {
      const response = await fetch('http://localhost:3001/passwords/show', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAccs(data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };
  //show real passowrd note
  const decryptPassword = async (encryption) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/passwords/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: encryption.id,
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

  //delete password notes
  const handleDelete = async () => {
    try {
    const token = localStorage.getItem('token');
    console.log('Selected ID:', selectedId);
    console.log('Token:', token);

    const response = await fetch(`http://localhost:3001/passwords/delete/${selectedId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Password deleted successfully');

      // Setelah penghapusan berhasil, lakukan tindakan yang diperlukan, seperti memuat ulang data
      setIsModalShow(false);
      // Perbarui state atau data yang sesuai untuk menghapus card yang sudah dihapus
      setAccs((prevAccs) => prevAccs.filter((acc) => acc.id !== selectedId));
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    if (token && userName) {
      setIsLoggedIn(true);
      setUserName(userName);
    }
  }, [setIsLoggedIn, setUserName]);

  const openDeleteModal = (id) => {
    setSelectedId(id);
    console.log('Opening delete Modal');
    setIsModalShow(true);
  };
  const closeDeleteModal = () => {
    setIsModalShow(false);
  };

  const openCreateModal = () => {
    console.log('Opening Modal');
    setIsModalOpen(true);
  };
  const closeCreateModal = () => {
    setIsModalOpen(false);
    // setSelectedColor(null);
  };
  console.log('isModalOpen:', isModalOpen);
  return (
    <>
      <main className="main bg-white flex text-black ">
        <div className="menuContainer flex ">
          <Sidebar openCreateModal={openCreateModal} />
        </div>
        {/* add todo */}
        <div className="relative">{isModalOpen && <AddPas onClose={closeCreateModal} fetchPasswords={fetchPasswords} />}</div>

        <div className="flex-1">
          <Navbar />
          <div className="px-2 py-4">
            <SearchBar />
          </div>
          {!isLoggedIn ? (
            <div className=" w-full  flex items-center justify-center my-auto ">
              <button className="bg-white hover:bg-slate-200 border rounded-full flex items-center gap-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-2" onClick={() => login()}>
                <svg width="20px" height="20px" viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs>{' '}
                    <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      {' '}
                      <g id="Color-" transform="translate(-401.000000, -860.000000)">
                        {' '}
                        <g id="Google" transform="translate(401.000000, 860.000000)">
                          {' '}
                          <path
                            d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                            id="Fill-1"
                            fill="#FBBC05"
                          >
                            {' '}
                          </path>{' '}
                          <path
                            d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                            id="Fill-2"
                            fill="#EB4335"
                          >
                            {' '}
                          </path>{' '}
                          <path
                            d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                            id="Fill-3"
                            fill="#34A853"
                          >
                            {' '}
                          </path>{' '}
                          <path
                            d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                            id="Fill-4"
                            fill="#4285F4"
                          >
                            {' '}
                          </path>{' '}
                        </g>{' '}
                      </g>{' '}
                    </g>{' '}
                  </g>
                </svg>{' '}
                Need Google Login
              </button>
            </div>
          ) : (
            <div className="contentContainer  py-8 px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {accs.map((acc) => (
                <PassCard key={acc.id} onTrashClick={closeDeleteModal} acc={acc} decryptPassword={decryptPassword} openDeleteModal={openDeleteModal} />
              ))}
              <div className="relative ">{isModalShow && <DeleteModal onClose={closeDeleteModal} onDelete={handleDelete} />}</div>
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
