import { Outlet } from "react-router-dom";
import Menu from "./components/Menu";
import Nav from "./components/Nav";

const App = () => {
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
