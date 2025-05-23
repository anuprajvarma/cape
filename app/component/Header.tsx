import React from "react";

const Header = () => {
  return (
    <div className="w-full py-2 px-4 text-black border-b border-black">
      <div className="w-full flex justify-between font-medium items-center">
        <p className="font-bold cursor-pointer">Cape</p>
        <div className="flex gap-12">
          <p className="cursor-pointer">Courses</p>
          <p className="cursor-pointer">Bookmark</p>
          <p className="cursor-pointer">Dashboard</p>
        </div>
        <div>
          <div className="flex gap-4">
            <button className="cursor-pointer">Login</button>
            <button className="border border-black px-3 py-1 rounded-[6px] cursor-pointer">
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
