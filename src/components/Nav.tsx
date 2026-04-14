import React from "react";

const Nav = () => {
  return (
    <header className="bg-gray-800 text-white flex items-center justify-between px-6 py-3">
      <div className="text-lg font-semibold">Company name</div>

      <div className="flex items-center space-x-4 w-1/2">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-3 py-1 rounded bg-gray-200 text-black focus:outline-none"
        />
      </div>

      <button className="text-sm hover:underline">Sign out</button>
    </header>
  );
};

export default Nav;
