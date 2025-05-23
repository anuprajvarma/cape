import React from "react";

const NavBar = () => {
  return (
    <div className="w-full p-4 text-black border-t border-black fixed bottom-0">
      <div className="w-full h-[2rem] flex justify-between">
        <div className="flex flex-col">
          <p>Contact Me</p>
          <div className="flex gap-2">
            <p>i</p>
            <p>i</p>
            <p>i</p>
            <p>i</p>
          </div>
        </div>
        <div className="flex flex-col">
          <p>Contribute</p>
          <div className="flex gap-2">
            <p>cape</p>
            <p>i</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
