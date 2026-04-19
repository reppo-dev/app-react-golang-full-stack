import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Role = {
  ID: number;
  name: string;
};

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/roles`);

        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const del = async (id: number) => {
    if (window.confirm("Are you sure want to delete this user?")) {
      await axios.delete(`/roles/${id}`);

      setRoles(roles.filter((u: Role) => u.ID !== id));
    }
  };

  return (
    <div>
      <div className="m-4 pt-4">
        <Link
          to="/roles/create"
          className="cursor-pointer hover:scale-105 p-2 h-7 hover:bg-gray-300 rounded w-16 transition-all duration-200 text-xs bg-gray-200"
        >
          Add
        </Link>
      </div>
      <div className="ml-4">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-sm font-semibold">#</th>
              <th className="p-3 text-sm font-semibold">Role</th>
              <th className="p-3 text-sm font-semibold">Active</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role: Role) => (
              <tr key={role.ID} className="mt-2">
                <td>{role.ID}</td>
                <td>{role.name}</td>
                <td>
                  <div className="flex gap-2 items-center">
                    <Link
                      to={`/roles/${role.ID}/edit`}
                      className="cursor-pointer items-center hover:scale-105 p-2 h-7 hover:bg-gray-300 rounded w-10 transition-all duration-200 text-xs bg-gray-200"
                    >
                      Edit
                    </Link>
                    <button
                      className="cursor-pointer hover:scale-105 h-8 hover:bg-gray-300 rounded w-10 transition-all duration-200 text-xs bg-gray-200"
                      onClick={() => del(role.ID)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;
