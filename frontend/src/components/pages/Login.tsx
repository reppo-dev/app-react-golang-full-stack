import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number",
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Login = () => {
  const [password, setPassword] = useState(false);

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
      const response = await axios.post("/login ", {
        email: data.email,
        password: data.password,
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
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>

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
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isSubmitting ? "Login..." : "Sign in"}
        </button>
      </form>
    </main>
  );
};

export default Login;
