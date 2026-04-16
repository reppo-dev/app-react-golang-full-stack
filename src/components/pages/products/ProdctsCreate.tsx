import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { DollarSign, FileTextIcon, Image, Type } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const registerSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  image: z.string().min(1, "Please pase correct image"),
  price: z.number().min(1, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const ProductCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await axios.post("/products ", {
        title: data.title,
        description: data.description,
        image: data.image,
        price: data.price,
      });

      console.log("Registration Successful:", response.data);

      navigate("/products", { replace: true });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-80"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Create product</h1>

        <div>
          <div className="border p-2 rounded flex items-center">
            <Type size={20} className="text-gray-400 mr-2" />
            <input
              {...register("title")}
              type="text"
              placeholder="Title"
              className="w-full outline-none bg-transparent"
            />
          </div>
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
        </div>

        <div>
          <div className="border p-2 rounded flex items-center">
            <FileTextIcon size={20} className="text-gray-400 mr-2" />
            <input
              {...register("description")}
              type="text"
              placeholder="Description"
              className="w-full outline-none bg-transparent"
            />
          </div>
          {errors.description && (
            <span className="text-red-500 text-xs">
              {errors.description.message}
            </span>
          )}
        </div>

        <div>
          <div className="border p-2 rounded flex items-center">
            <DollarSign size={20} className="text-gray-400 mr-2" />
            <input
              {...register("price", { valueAsNumber: true })}
              type="text"
              placeholder="Price"
              className="w-full outline-none bg-transparent"
            />
          </div>
          {errors.price && (
            <span className="text-red-500 text-xs">{errors.price.message}</span>
          )}
        </div>
        <div>
          <div className="border p-2 rounded flex items-center">
            <Image size={20} className="text-gray-400 mr-2" />
            <input
              {...register("image")}
              type="text"
              placeholder="URL image"
              className="w-full outline-none bg-transparent"
            />
          </div>
          {errors.image && (
            <span className="text-red-500 text-xs">{errors.image.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
