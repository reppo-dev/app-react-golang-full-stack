import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <aside className="w-60 bg-white border-r min-h-screen">
      <nav className="p-4">
        <ul>
          <li>
            <Link to="/dashboard" className="block text-blue-600 font-medium">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/users" className="block text-blue-600 font-medium">
              Users
            </Link>
          </li>
          <li>
            <Link to="/roles" className="block text-blue-600 font-medium">
              Roles
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Menu;
