import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/user", {
          withCredentials: true,
        });

        setUser(response.data);

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.post("/logout");

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      <div className="flex gap-5">
        <Link to="/profile">{user?.first_name}</Link>
        <Link to="#" onClick={logout} className="text-sm hover:underline">
          Sign out
        </Link>
      </div>
    </header>
  );
};

export default Nav;
