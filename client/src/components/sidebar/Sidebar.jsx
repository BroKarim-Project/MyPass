import React, { useState } from 'react';
import { Plus, House } from 'lucide-react';
import { menu } from '../../data';

const Sidebar = ({ openModal }) => {
  const handleColorClick = () => {
    openModal();
  };
  return (
    <div className="flex h-screen w-24 items-center flex-col px-2 bg-transparent pt-4 px border-r border-[#383838]">
      <div className="inline-flex h-16 w-16 items-center justify-center " style={{ marginBottom: 20 }}>
        <span className="grid h-10 w-10 place-content-center  text-lg font-semibold text-black">Dice</span>
      </div>

      <div className="flex flex-col h-16 w-16 px-4 bg-[#383838] rounded-md items-center justify-center" style={{ marginBottom: 20 }}>
        <House color="#ffff" strokeWidth={1.25} />
        <span className="grid place-content-center  text-lg   text-white">Home</span>
      </div>
      <div className="inline-flex h-16 w-16 items-center justify-center">
        <button href="" className="group relative flex flex-col items-center justify-center rounded px-2 py-1.5 text-[#556067]  " onClick={handleColorClick}>
          <Plus color="#556067" />
          Create
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
