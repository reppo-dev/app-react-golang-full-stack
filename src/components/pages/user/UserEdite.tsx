import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff, Mail, User, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const editSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    role_id: z
      .number("Please select a role")
      .int()
      .positive("You must select a valid role"),
    password: z
      .literal("")
      .or(
        z
          .string()
          .min(6, "Password must be at least 6 characters")
          .regex(
            /^(?=.*[a-zA-Z])(?=.*\d).+$/,
            "Password must contain at least one letter and one number",
          ),
      )
      .optional(),
    passwordConfirm: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== "") {
        return data.password === data.passwordConfirm;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    },
  );

type EditFormData = z.infer<typeof editSchema>;

interface UpdateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  password?: string;
}

interface RoleType {
  ID: number;
  name: string;
}

const UserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role_id: undefined,
      password: "",
      passwordConfirm: "",
    },
  });

  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesRes, userRes] = await Promise.all([
          axios.get<RoleType[]>("/roles"),
          id ? axios.get(`/users/${id}`) : Promise.resolve(null),
        ]);

        setRoles(rolesRes.data);

        if (userRes && userRes.data) {
          const user = userRes.data;

          const parsedRoleId =
            user.role_id && Number(user.role_id) > 0
              ? Number(user.role_id)
              : undefined;

          reset({
            firstName: user.first_name || "",
            lastName: user.last_name || "",
            email: user.email || "",
            role_id: parsedRoleId,
            password: "",
            passwordConfirm: "",
          });
        }
      } catch (error) {
        console.error("[ERROR] fetching initial data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchInitialData();
  }, [id, reset]);

  const onSubmit = async (data: EditFormData) => {
    console.log("[SUBMIT] raw form data:", data);

    const payload: UpdateUserPayload = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      role_id: data.role_id,
    };

    if (data.password && data.password !== "") {
      payload.password = data.password;
    }

    console.log("[SUBMIT] payload being sent to server:", payload);

    if (!payload.role_id || payload.role_id <= 0) {
      console.error(
        "[BLOCKED] role_id is invalid, request NOT sent:",
        payload.role_id,
      );
      return;
    }

    try {
      const response = await axios.put(`/users/${id}`, payload);
      console.log("[SUCCESS] server response:", response.data);
      navigate("/users", { replace: true });
    } catch (error) {
      console.error("[ERROR] update failed:", error);
    }
  };

  if (loadingUser) {
    return <div className="text-center mt-10">Loading user...</div>;
  }

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Edit User</h1>

        <div>
          <div className="border p-2 rounded flex items-center">
            <User size={20} className="text-gray-400 mr-2" />
            <input
              {...register("firstName")}
              type="text"
              placeholder="First Name"
              className="w-full outline-none bg-transparent"
            />
          </div>
          {errors.firstName && (
            <span className="text-red-500 text-xs">
              {errors.firstName.message}
            </span>
          )}
        </div>

        <div>
          <div className="border p-2 rounded flex items-center">
            <User size={20} className="text-gray-400 mr-2" />
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last Name"
              className="w-full outline-none bg-transparent"
            />
          </div>
          {errors.lastName && (
            <span className="text-red-500 text-xs">
              {errors.lastName.message}
            </span>
          )}
        </div>

        <div>
          <div className="border p-2 rounded flex items-center">
            <Mail size={20} className="text-gray-400 mr-2" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full outline-none bg-transparent"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div>
          <div className="border p-2 rounded flex items-center">
            <UserCog size={20} className="text-gray-400 mr-2" />
            <select
              {...register("role_id", { valueAsNumber: true })}
              className="w-full outline-none bg-transparent"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.ID} value={role.ID}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          {errors.role_id && (
            <span className="text-red-500 text-xs">
              {errors.role_id.message}
            </span>
          )}
        </div>

        <div>
          <div className="border p-2 rounded flex items-center">
            <input
              {...register("password")}
              type={passwordVisible ? "text" : "password"}
              placeholder="New Password (optional)"
              className="w-full outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <div className="border p-2 rounded flex items-center">
            <input
              {...register("passwordConfirm")}
              type={confirmVisible ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => setConfirmVisible(!confirmVisible)}
            >
              {confirmVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.passwordConfirm && (
            <span className="text-red-500 text-xs">
              {errors.passwordConfirm.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isSubmitting ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
};

export default UserEdit;
