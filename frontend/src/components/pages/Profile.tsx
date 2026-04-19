import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { KeyRoundIcon, LockIcon, Mail, User, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const accountInformation = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

const changePassword = z
  .object({
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

type AccountInformationData = z.infer<typeof accountInformation>;
type ChangePasswordData = z.infer<typeof changePassword>;

const Profile = () => {
  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    reset,
    formState: { errors: infoErrors, isSubmitting: infoSubmitting },
  } = useForm<AccountInformationData>({
    resolver: zodResolver(accountInformation),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePassword),
    mode: "onTouched",
  });

  useEffect(() => {
    const info = async () => {
      const data = await axios.get(`/user`);
      reset({
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        email: data.data.email,
      });
    };

    info();
  }, [reset]);

  const infoSubmit = async (e: AccountInformationData) => {
    await axios.put("/user/info", {
      first_name: e.firstName,
      last_name: e.lastName,
      email: e.email,
    });
  };

  const passwordSubmit = async (e: ChangePasswordData) => {
    await axios.put("/user/password", {
      password: e.password,
      password_confirm: e.passwordConfirm,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="mb-2">Account Information</h1>{" "}
        <div className="flex flex-col border-t-4 border-r-0 border-0 border-gray-600 border-l-4 rounded-lg">
          <div className="p-2 bg-gray-200 rounded-lg">
            <form onSubmit={handleSubmitInfo(infoSubmit)}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label>First Name</label>
                  <div className="p-2 border rounded flex items-center">
                    <input
                      {...registerInfo("firstName")}
                      type="text"
                      placeholder="First Name"
                      className="w-full outline-none bg-transparent"
                    />
                    <User size={20} />
                  </div>
                  {infoErrors.firstName && (
                    <span className="text-red-500 text-xs mt-1">
                      {infoErrors.firstName.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label>Last Name</label>
                  <div className="p-2 border rounded flex items-center">
                    <input
                      {...registerInfo("lastName")}
                      placeholder="Last Name"
                      type="text"
                      className="w-full outline-none bg-transparent"
                    />
                    <UserRound size={20} />
                  </div>
                  {infoErrors.lastName && (
                    <span className="text-red-500 text-xs mt-1">
                      {infoErrors.lastName.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label>Email</label>
                  <div className="p-2 border rounded flex items-center">
                    <input
                      {...registerInfo("email")}
                      placeholder="Email"
                      type="text"
                      className="w-full outline-none bg-transparent"
                    />
                    <Mail size={20} />
                  </div>
                  {infoErrors.email && (
                    <span className="text-red-500 text-xs mt-1">
                      {infoErrors.email.message}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={infoSubmitting}
                  className="mt-2 w-12 h-8 bg-gray-400 rounded hover:scale-105 cursor-pointer transition-all duration-200"
                >
                  {infoSubmitting ? "Updating..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <h1 className="my-2">Change Password</h1>
        <div className="flex flex-col border-t-4 border-r-0 border-0 border-blue-600 border-l-4 rounded-lg">
          <div className="p-2 bg-gray-200 rounded-lg">
            <form onSubmit={handleSubmitPassword(passwordSubmit)}>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label>Password</label>
                  <div className="p-2 border rounded flex items-center">
                    <input
                      {...registerPassword("password")}
                      type="password"
                      placeholder="Password"
                      className="w-full outline-none bg-transparent"
                    />
                    <KeyRoundIcon size={20} />
                  </div>
                  {passwordErrors.password && (
                    <span className="text-red-500 text-xs mt-1">
                      {passwordErrors.password.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label>Password Confim</label>
                  <div className="p-2 border rounded flex items-center">
                    <input
                      {...registerPassword("passwordConfirm")}
                      placeholder="Password Confim"
                      type="password"
                      className="w-full outline-none bg-transparent"
                    />
                    <LockIcon size={20} />
                  </div>
                  {passwordErrors.passwordConfirm && (
                    <span className="text-red-500 text-xs mt-1">
                      {passwordErrors.passwordConfirm.message}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="mt-2 w-12 h-8 bg-gray-400 rounded hover:scale-105 cursor-pointer transition-all duration-200"
                >
                  {passwordSubmitting ? "Updating..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
