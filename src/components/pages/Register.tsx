import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      const response = await axios.post("http://localhost:8000/api/register ", {
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
          <input
            {...register("firstName")}
            type="text"
            placeholder="First Name"
            className="border p-2 rounded focus:outline-blue-500"
          />
          {errors.firstName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </span>
          )}
        </div>
        {/* Last Name */}
        <div className="flex flex-col">
          <input
            {...register("lastName")}
            type="text"
            placeholder="Last Name"
            className="border p-2 rounded focus:outline-blue-500"
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </span>
          )}
        </div>
        {/* Email */}
        <div className="flex flex-col">
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="border p-2 rounded focus:outline-blue-500"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </span>
          )}
        </div>
        {/* Password */}
        <div className="flex flex-col">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="border p-2 rounded focus:outline-blue-500"
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </span>
          )}
        </div>
        {/* Password Confirm */}
        <div className="flex flex-col">
          <input
            {...register("passwordConfirm")}
            type="password"
            placeholder="Password Confirm"
            className="border p-2 rounded focus:outline-blue-500"
          />
          {errors.passwordConfirm && (
            <span className="text-red-500 text-xs mt-1">
              {errors.passwordConfirm.message}
            </span>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
};

export default Register;
