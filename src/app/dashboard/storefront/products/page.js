"use client";
import ProductService from "@/lib/services/productService";
import { setProduct } from "@/store/Slices/productSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const products = useSelector((state) => state.product.product);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/dashboard/storefront/products/${id}`);
  };

  useEffect(() => {
    if (!products && user) {
      ProductService.getAll().then((res) => {
        dispatch(setProduct(res.data));
      });
    }
  }, [products, user, dispatch]);

  return (
    <div className="bg-white my-5">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {products?.map((product) => (
            <a
              onClick={() => handleProductClick(product.productId)}
              key={product.productId}
              className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
            >
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                <img
                  src={product.image1}
                  alt={product.image}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="pb-4 pt-10 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  <p href={product.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </p>
                </h3>
                <div className="mt-3 flex flex-col items-center">
                  <span className="text-sm text-gray-500">
                    {product.location}
                  </span>
                </div>
                <p className="mt-4 text-base font-medium text-gray-900">
                  TK. {product.perDayPrice} / Day
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
