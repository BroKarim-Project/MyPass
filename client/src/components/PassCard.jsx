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
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className=" rounded-xl shadow-[8px_8px_0px_rgba(0,0,0,1)] max-h-[200px] bg-[white] border-black border-2 p-4 flex flex-col items-center ">
        <span className="inline-block rounded-lg p-3">
          <div className="inline-flex align-middle justify-center items-center select-none text-black">
            <img className="w-16 h-16" src={svgIconPath} alt={acc.title} />
          </div>
        </span>
        {/* disini bakal nerima acc.titel */}
        <h2 className="mt-2 font-semibold text-base sm:text-lg text-black">{acc.title}</h2>
        {/* disini bakal nerima acc.password */}
        <p className="sm:mt-1 block text-center text-sm cursor-pointer sm:text-base text-black"> {isHovered ? acc.decryptedPassword : acc.password} </p>
      </div>
    </>
  );
}
