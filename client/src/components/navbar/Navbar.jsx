import { Bell, Bookmark, Moon } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="navbar w-full p-5 flex items-center justify-between border-b-2   border-black ">
      <div className="logo flex items-center gap-2 font-bold">
        <svg width="40" height="40" viewBox="0 0 114 90" fill="#000" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1904_112)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14 0C6.26801 0 0 6.26801 0 14V76C0 83.732 6.26801 90 14 90H100C107.732 90 114 83.732 114 76V14C114 6.26801 107.732 0 100 0H14ZM18 10.0002C13.5817 10.0002 10 13.5819 10 18.0002C10 22.4185 13.5817 26.0002 18 26.0002C22.4183 26.0002 26 22.4185 26 18.0002C26 13.5819 22.4183 10.0002 18 10.0002ZM32.0003 18.0002C32.0003 13.5819 35.5821 10.0002 40.0003 10.0002C44.4186 10.0002 48.0003 13.5819 48.0003 18.0002C48.0003 22.4185 44.4186 26.0002 40.0003 26.0002C35.5821 26.0002 32.0003 22.4185 32.0003 18.0002ZM62 10.0002C57.5817 10.0002 54 13.5819 54 18.0002C54 22.4185 57.5817 26.0002 62 26.0002C66.4182 26.0002 69.9999 22.4185 69.9999 18.0002C69.9999 13.5819 66.4182 10.0002 62 10.0002Z"
              fill="#000"
            />
          </g>
          <defs>
            <clipPath id="clip0_1904_112">
              <rect width="114" height="90" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <span className='text-lg '>MyPass</span>
      </div>
      <div className="icons sm:flex items-center gap-5 hidden ">
        <div className="rounded-full flex justify-center items-center shadow-[3px_2px_0px_rgb(95,95,99)] border-black border bg-white py-2 px-2">
          <Moon />
        </div>
        <div className="rounded-full flex justify-center items-center shadow-[3px_2px_0px_rgb(95,95,99)] border-black border bg-white py-2 px-2">
          <Bookmark />
        </div>

        <div className=" rounded-full flex justify-center items-center shadow-[3px_2px_0px_rgb(95,95,99)] border-black border bg-white py-2 px-2">
          <Bell />
        </div>
        <div className="user flex items-center gap-2">
          <img className="w-[40px] h-[40px] rounded-full object-cover " src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load" alt="" />
          <span>Jane</span>
        </div>
        <img src="/settings.svg" alt="" className="icon" />
      </div>
    </div>
  );
};

export default Navbar;
