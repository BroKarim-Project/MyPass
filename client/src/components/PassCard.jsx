import React, { useState } from 'react';
import getSvgIconPath from '../lib/getSVG';

export default function PassCard({ handleDelete, acc, decryptPassword }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    decryptPassword(acc);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const svgIconPath = getSvgIconPath(acc.title);
  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} class=" rounded-xl border max-h-[200px] border-white p-4 flex flex-col items-center ">
        <span class="inline-block rounded-lg p-3">
          <div class="inline-flex align-middle justify-center items-center select-none text-white">
            <img className='w-16 h-16' src={svgIconPath} alt={acc.title} />
          </div>
        </span>
        {/* disini bakal nerima acc.titel */}
        <h2 class="mt-2 font-semibold text-base sm:text-lg text-white">{acc.title}</h2>
        {/* disini bakal nerima acc.password */}
        <p class="sm:mt-1 block text-center text-sm cursor-pointer sm:text-base text-gray-300"> {isHovered ? acc.decryptedPassword : acc.password} </p>
      </div>
    </>
  );
}
