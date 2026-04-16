import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Product = {
  ID: number;
  title: string;
  description: string;
  image: string;
  price: number;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/products?page=${page}`);

        setProducts(response.data.data);
        setLastPage(response.data.meta.last_page);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [page]);

  const next = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };

  const previous = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const del = async (id: number) => {
    if (window.confirm("Are you sure want to delete this user?")) {
      await axios.delete(`/products/${id}`);

      setProducts(products.filter((u: Product) => u.ID !== id));
    }
  };

  return (
    <div>
      <div className="m-4 pt-4">
        <Link
          to="/products/create"
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
              <th className="p-3 text-sm font-semibold">Image</th>
              <th className="p-3 text-sm font-semibold">Title</th>
              <th className="p-3 text-sm font-semibold">Description</th>
              <th className="p-3 text-sm font-semibold">Price</th>
              <th className="p-3 text-sm font-semibold">Active</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product: Product) => (
              <tr key={product.ID} className="mt-2">
                <td>{product.ID}</td>
                <td>
                  <img
                    src={product.image}
                    alt="image"
                    width={100}
                    height={100}
                  />
                </td>
                <td>{product.title}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>
                  <div className="flex gap-2 items-center">
                    <Link
                      to={`/products/${product.ID}/edit`}
                      className="cursor-pointer items-center hover:scale-105 p-2 h-7 hover:bg-gray-300 rounded w-10 transition-all duration-200 text-xs bg-gray-200"
                    >
                      Edit
                    </Link>
                    <button
                      className="cursor-pointer hover:scale-105 h-8 hover:bg-gray-300 rounded w-10 transition-all duration-200 text-xs bg-gray-200"
                      onClick={() => del(product.ID)}
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
      <div className="flex justify-between p-2 mx-2">
        <button
          className="cursor-pointer hover:scale-105 h-7 hover:bg-gray-300 rounded w-16 transition-all duration-200 text-xs bg-gray-200"
          onClick={previous}
        >
          Previous
        </button>
        <button
          className="cursor-pointer hover:scale-105 h-7 hover:bg-gray-300 rounded w-10 transition-all duration-200 text-xs bg-gray-200"
          onClick={next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
