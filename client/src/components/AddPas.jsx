import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddPas({ onClose, fetchPasswords }) {
  const [title, setTitle] = React.useState('');
  const [password, setPassword] = React.useState('');

  const addPassword = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:3001/addpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
          title: title,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text(); // Assuming server responds with 'Success' as plain text
      console.log(data); // Should log 'Success'
      await fetchPasswords(userId); // Fetch updated data
      closeModal();
    } catch (error) {
      console.error('Error adding password:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit

    try {
      await addPassword();
    } catch (error) {
      console.error('Error adding password:', error);
      // You can display an error message to the user here if needed
      alert('An error occurred while adding the password. Please try again.');
    }
  };

  const closeModal = () => {
    onClose();
  };
  return (
    <>
      <div className="flex fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-y-auto overflow-x-hidden max-w-[500px]   justify-center items-center" id="noteModal">
        <div className="relative border-black border-2 rounded-md  p-4 w-full bg-white max-w-2xl">
          <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Password Manager</h3>
            <button onClick={closeModal}>
              <X color="#000" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="shadow-none flex flex-col gap-4 border-none bg-white">
            <label htmlFor="title" className="block  text-sm font-medium text-gray-900">
              Platform
            </label>
            <input id="title" type="text" className="py-2 px-3 placeholder-black bg-transparent border border-black text-black rounded-md" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Platform..." />
            <label htmlFor="password" className="block  text-sm font-medium text-gray-900">
              Password
            </label>
            <input id="password" type="password" placeholder="password..." className="py-2 px-3 placeholder-black text-black bg-transparent border  rounded-md  border-black" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex justify-center items-center">
              <button href="#_" type="submit" className="group relative inline-block overflow-hidden  bg-purple-50 px-5 py-3 font-medium text-purple-600">
                <span className="absolute left-0 top-0 mb-0 flex h-0 w-full translate-y-0 transform bg-purple-600 opacity-90 transition-all duration-200 ease-out group-hover:h-full"></span>
                <span className="relative group-hover:text-white">Add</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
