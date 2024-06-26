import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddPas({ onClose, fetchPasswords }) {
  const [title, setTitle] = React.useState('');
  const [password, setPassword] = React.useState('');

  /*
const addPassword = () => {
    Axios.post("http://localhost:3001/addpassword", {
      password: password,
      title: title,
    });
  };
*/

  const addPassword = async () => {
    try {
      const response = await fetch('http://localhost:3001/addpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
          title: title,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text(); // Assuming server responds with 'Success' as plain text
      console.log(data); // Should log 'Success'
      fetchPasswords();
      closeModal(); //tutup modal jika sudah berhasil dikirm
    } catch (error) {
      console.error('Error adding password:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah halaman di-refresh saat form disubmit
    addPassword();
  };

  const closeModal = () => {
    onClose();
  };
  return (
    <>
      <div className="flex fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-y-auto overflow-x-hidden max-w-[500px]   justify-center items-center" id="noteModal">
        <div className="relative p-4 w-full bg-white max-w-2xl">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Create Note</h3>
            <button onClick={closeModal}>
              <X color="#000" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="shadow-none flex flex-col gap-4 border-none bg-white">
            <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900">
              Title
            </label>
            <input type="text" className="placeholder-black bg-transparent border border-black text-black rounded-md" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title..." />
            <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900">
              Note
            </label>
            <input type="password" placeholder="password..." className="placeholder-black text-black bg-transparent border  rounded-md  border-black" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex justify-center items-center">
              <button href="#_" type="submit" class="group relative inline-block overflow-hidden  bg-purple-50 px-5 py-2.5 font-medium text-purple-600">
                <span class="absolute left-0 top-0 mb-0 flex h-0 w-full translate-y-0 transform bg-purple-600 opacity-90 transition-all duration-200 ease-out group-hover:h-full"></span>
                <span class="relative group-hover:text-white">Add note</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
