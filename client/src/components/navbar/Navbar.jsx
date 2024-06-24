const Navbar = () => {
  return (
    <div className="navbar w-full p-5 flex items-center justify-between ">
      <div className="logo flex items-center gap-2 font-bold">
        <img src="logo.svg" alt="" />
        <span>lamadmin</span>
      </div>
      <div className="icons sm:flex items-center gap-5 hidden ">
        <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img src="/expand.svg" alt="" className="icon" />
        <div className="notification relative">
          <img src="/notifications.svg" alt="" />
          <span className="bg-[red] text-[white] w-4 h-4 absolute flex items-center justify-center text-xs rounded-[50%] -right-2 -top-2">1</span>
        </div>
        <div className="user flex items-center gap-2">
          <img className="w-[26px] h-[26px] rounded-md object-cover " src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load" alt="" />
          <span>Jane</span>
        </div>
        <img src="/settings.svg" alt="" className="icon" />
      </div>
    </div>
  );
};

export default Navbar;
