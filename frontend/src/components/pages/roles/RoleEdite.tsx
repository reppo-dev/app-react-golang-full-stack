import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useEffect, useState } from "react";

const editSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

type EditFormData = z.infer<typeof editSchema>;

interface Permission {
  ID: number;
  name: string;
}

interface RoleType {
  ID: number;
  name: string;
  permission: Permission[];
}

const RoleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleRes, permRes] = await Promise.all([
          axios.get(`/roles/${id}`),
          axios.get(`/permission`),
        ]);

        const role: RoleType = roleRes.data;

        setPermissions(permRes.data);

        const selectedPermissions =
          role.permission?.map((p) => p.ID.toString()) || [];

        reset({
          name: role.name,
          permissions: selectedPermissions,
        });
      } catch (err) {
        console.error("Failed loading role:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: EditFormData) => {
    try {
      const permissionIds = data.permissions.map((id) => Number(id));

      await axios.put(`/roles/${id}`, {
        name: data.name,
        permissions: permissionIds,
      });

      navigate("/roles", { replace: true });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-96 bg-white p-6 rounded shadow"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Edit Role</h1>

        {/* Name */}
        <div>
          <div className="border p-2 rounded flex items-center">
            <User size={20} className="text-gray-400 mr-2" />
            <input
              {...register("name")}
              type="text"
              className="w-full outline-none bg-transparent"
              placeholder="Role name"
            />
          </div>
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name.message}</span>
          )}
        </div>

        {/* Permissions */}
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium mb-2">
            <Shield size={18} className="text-gray-600 mr-2" />
            Permissions
          </label>

          <div className="border rounded p-3 max-h-48 overflow-y-auto">
            {permissions.map((p) => (
              <label
                key={p.ID}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  value={p.ID.toString()}
                  {...register("permissions")}
                  className="w-4 h-4"
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>

          {errors.permissions && (
            <span className="text-red-500 text-xs">
              {errors.permissions.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Updating..." : "Update Role"}
        </button>
      </form>
    </div>
  );
};

export default RoleEdit;
