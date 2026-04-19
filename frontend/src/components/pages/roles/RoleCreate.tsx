import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useEffect, useState } from "react";

const registerSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface Permission {
  ID: number;
  name: string;
}

const RoleCreate = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get("/permission");
        setPermissions(response.data);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await axios.post("/roles", {
        name: data.name,
        permissions: data.permissions,
      });

      console.log("Role Created:", response.data);
      navigate("/roles", { replace: true });
    } catch (error) {
      console.error("Role creation failed:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading permissions...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-96 p-6 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Create Role</h1>

        {/* Role Name */}
        <div className="flex flex-col">
          <div className="border p-2 rounded flex items-center">
            <User size={20} className="text-gray-400 mr-2" />
            <input
              {...register("name")}
              type="text"
              placeholder="Role Name"
              className="w-full outline-none bg-transparent"
            />
          </div>
          {errors.name && (
            <span className="text-red-500 text-xs mt-1">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Permissions */}
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium mb-2">
            <Shield size={18} className="text-gray-600 mr-2" />
            Permissions
          </label>
          <div className="border rounded p-3 max-h-48 overflow-y-auto">
            {permissions.map((permission) => (
              <label
                key={permission.ID}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={permission.ID.toString()}
                  {...register("permissions")}
                  className="w-4 h-4"
                />
                <span className="text-sm">{permission.name}</span>
              </label>
            ))}
          </div>
          {errors.permissions && (
            <span className="text-red-500 text-xs mt-1">
              {errors.permissions.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Role"}
        </button>
      </form>
    </div>
  );
};

export default RoleCreate;
