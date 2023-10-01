"use client";

import ImageUpload from "@/components/GlobalComponents/ImageUpload/ImageUpload";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import CategoryService from "@/lib/services/categoryService";
import ProductService from "@/lib/services/productService";
import { setCategory } from "@/store/Slices/categorySlice";
import { setMyProducts } from "@/store/Slices/productSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const availableCategories = useSelector((state) => state.category.category);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [productForm, setProductForm] = useState({
    name: "",
    pricePerDay: 0,
    description: "",
    categoryId: "",
    price: 0,
    image1: null,
    image2: null,
    image3: null,
    marketPrice: 0,
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("perDayPrice", productForm.pricePerDay);
    formData.append("description", productForm.description);
    formData.append("categoryId", productForm.categoryId);
    formData.append("marketPrice", productForm.marketPrice);
    formData.append("price", productForm.price);
    formData.append("image0", productForm.image1);
    formData.append("image1", productForm.image2);
    formData.append("image2", productForm.image3);
    ProductService.create(formData).then((res) => {
      ProductService.getByUser(user?.id).then((res) => {
        dispatch(setMyProducts(res));
      });
      router.push("/dashboard/owner/products");
      toast.success("Product added successfully");
    });
  };

  useEffect(() => {
    if (availableCategories === null) {
      CategoryService.getAll()
        .then((res) => {
          dispatch(setCategory(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [availableCategories]);

  return (
    <>
      {/* Header add new */}
      <PageHeader
        title="Add New Product"
        description="Add new product here"
        backlink="/dashboard/owner/products"
        actions={[
          {
            name: "Submit",
            type: "submit",
            onClick: () => {
              handleSubmit();
            },
          },
          {
            name: "Reset",
            type: "reset",
            onClick: () => {
              console.log("Reset");
            },
          },
        ]}
      />
      {/* form center */}
      <div className="flex justify-center mt-5 p-5">
        <form className="w-full max-w-lg">
          {/* name */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-name"
              >
                Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                id="grid-name"
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                value={productForm.name}
              />
            </div>
          </div>
          {/* price per day*/}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-price"
              >
                Price per day (in BDT)
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-price"
                type="number"
                placeholder="Price per day"
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    pricePerDay: e.target.value,
                  })
                }
                value={productForm.pricePerDay}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-price"
              >
                Market Price (in BDT)
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-price"
                type="number"
                placeholder="Price per day"
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    marketPrice: e.target.value,
                  })
                }
                value={productForm.marketPrice}
              />
            </div>
          </div>
          {/* base price */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-price"
              >
                Base Price (in BDT)
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-price"
                type="number"
                placeholder="Base Price"
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    price: e.target.value,
                  })
                }
                value={productForm.price}
              />
            </div>
          </div>
          {/* description */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-description"
              >
                Description
              </label>
              <textarea
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-description"
                type="text"
                placeholder="Description"
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                value={productForm.description}
              />
            </div>
          </div>
          {/* category */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-category"
              >
                Category
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-category"
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      categoryId: e.target.value,
                    })
                  }
                  value={productForm.categoryId}
                >
                  <option>Choose Category</option>
                  {availableCategories &&
                    availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          {/* images grid */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-images"
              >
                Images
              </label>
              <div className="flex flex-wrap -mx-3 mb-6 justify-center">
                {/* three images */}
                <div className="grid grid-cols-3 gap-6">
                  <ImageUpload
                    label={"Image*"}
                    onImageChange={(e) =>
                      setProductForm({
                        ...productForm,
                        image1: e,
                      })
                    }
                    currentImage={productForm.image1}
                  />
                  {/* <ImageUpload
                    label={" Image"}
                    onImageChange={(e) =>
                      setProductForm({
                        ...productForm,
                        image2: e,
                      })
                    }
                    currentImage={productForm.image2}
                  />
                  <ImageUpload
                    label={"Image"}
                    onImageChange={(e) =>
                      setProductForm({
                        ...productForm,
                        image3: e,
                      })
                    }
                    currentImage={productForm.image3}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
