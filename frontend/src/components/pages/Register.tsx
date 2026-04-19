import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { useState } from "react";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d).+$/,
        "Password must contain at least one letter and one number",
      ),
    passwordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await axios.post("/register ", {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        password_confirm: data.passwordConfirm,
      });

      console.log("Registration Successful:", response.data);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Please register</h1>
        <div className="flex flex-col">
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
            <span className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <div className="border rounded flex items-center p-2">
            <User size={20} className="text-gray-400 mr-2" />
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last Name"
              className="outline-none bg-transparent w-full"
            />
          </div>
          {errors.lastName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <div className="border p-2 rounded focus:outline-blue-500 flex items-center">
            <Mail size={20} className="text-gray-400 mr-2" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="outline-none bg-transparent w-full"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="border p-2 rounded flex items-center">
            <input
              {...register("password")}
              type={password ? "text" : "password"}
              placeholder="Password"
              className="outline-none bg-transparent w-full"
            />
            <button type="button" onClick={() => setPassword(!password)}>
              {password ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <div className="border p-2 rounded flex items-center">
            <input
              {...register("passwordConfirm")}
              type={confirmPassword ? "text" : "password"}
              placeholder="Password Confirm"
              className="outline-none bg-transparent w-full"
            />
            <button
              type="button"
              onClick={() => setConfirmPassword(!confirmPassword)}
            >
              {confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.passwordConfirm && (
            <span className="text-red-500 text-xs mt-1">
              {errors.passwordConfirm.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isSubmitting ? "Login..." : "Submit"}
        </button>
      </form>
    </main>
  );
};

export default Register;
