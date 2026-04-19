import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Menu from "./components/Menu";
import Nav from "./components/Nav";
import axios from "axios";

axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

const App = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await axios.get("/user");
        setIsAuthorized(true);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    checkUser();
  }, [navigate]);

  if (!isAuthorized) {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  return (
    <div className="">
      <Nav />
      <div className="flex">
        <Menu />

        <main className="flex-1 p-6">
          <div className="bg-white shadow rounded">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
