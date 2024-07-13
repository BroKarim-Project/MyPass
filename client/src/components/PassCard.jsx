import { useState } from 'react';
import getSvgIconPath from '../lib/getSVG';
import { Trash } from 'lucide-react';


export default function PassCard({ acc, decryptPassword, openDeleteModal }) {
  const [showPass, setShowPass] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  // const [showModal, setShowModal] = useState(false);

  const handleTrashClick = () => {
    openDeleteModal(acc.id);
  };

  // const handleModalClose = () => {
  //   setShowModal(false);
  // };

  const handleMouseEnterBox1 = () => {
    setShowTrash(true);
  };
  const handleMouseLeaveBox1 = () => {
    setShowTrash(false);
  };
  const handleMouseEnterBox2 = () => {
    setShowPass(true);
    decryptPassword(acc);
  };

  const handleMouseLeaveBox2 = () => {
    setShowPass(false);
  };

  const svgIconPath = getSvgIconPath(acc.title);
  return (
    <>
      <div id="box2" onMouseEnter={handleMouseEnterBox1} onMouseLeave={handleMouseLeaveBox1} className=" rounded-xl relative shadow-[8px_8px_0px_rgba(0,0,0,1)] max-h-[200px] bg-[white] border-black border-2 p-4 flex flex-col items-center ">
        <div className="absolute right-2">
          {showTrash && <Trash onClick={handleTrashClick} />}
          {/* {showModal && <DeleteModal onClose={handleModalClose} />} */}
        </div>

        <span className="inline-block rounded-lg p-3">
          <div className="inline-flex align-middle justify-center items-center select-none text-black">
            <img className="w-16 h-16" src={svgIconPath} alt={acc.title} />
          </div>
        </span>

        <div id="box2" onMouseEnter={handleMouseEnterBox2} onMouseLeave={handleMouseLeaveBox2} className="flex flex-col items-center">
          <h2 className="mt-2 font-semibold text-base sm:text-lg text-black">{acc.title}</h2>
          <p className="sm:mt-1 block text-center text-sm cursor-pointer sm:text-base text-black"> {showPass ? acc.decryptedPassword : acc.password} </p>
        </div>
      </div>
    </>
  );
}
