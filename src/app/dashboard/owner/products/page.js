"use client";
import CommonTable from "@/components/GlobalComponents/CommonTable";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import ProductService from "@/lib/services/productService";
import { setMyProducts } from "@/store/Slices/productSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const router = useRouter();
  const products = useSelector((state) => state.product.myProducts);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const handleRestrict = (e, id) => {
    ProductService.restrict(id)
      .then((res) => {
        toast.success("Product restricted successfully");
        ProductService.getByUser(user?.id).then((res) => {
          dispatch(setMyProducts(res));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!products && user) {
      ProductService.getByUser(user?.id).then((res) => {
        dispatch(setMyProducts(res));
      });
    }
  }, [products, user, dispatch]);

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your products here"
        actions={[
          {
            name: "Add New",
            type: "addNew",
            href: "/dashboard/owner/products/add",
          },
        ]}
      />
      {/* Products Table */}
      <CommonTable
        columns={[
          "image",
          "name",
          "basePrice",
          "perDayPrice",
          "status",
          "description",
        ]}
        data={
          products &&
          products.map((product) => {
            return {
              image: product.image1,
              name: product.name,
              basePrice: product.basePrice,
              perDayPrice: product.perDayPrice,
              status: product.status,
              description: product.description,
            };
          })
        }
        actions={
          [
            // {
            //   name: "Delete",
            //   type: "delete",
            //   onClick: (e, id) => {
            //     handleRestrict(e, id);
            //   },
            // },
          ]
        }
      />
    </>
  );
};

export default Page;
