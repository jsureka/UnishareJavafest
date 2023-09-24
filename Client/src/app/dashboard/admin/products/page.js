"use client";

import CommonTable from "@/components/GlobalComponents/CommonTable";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import ProductService from "@/lib/services/productService";
import { setProduct } from "@/store/Slices/productSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Product List

const Page = () => {
  const { product } = useSelector((state) => state.product);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!product) {
      ProductService.getAll()
        .then((res) => {
          dispatch(setProduct(res));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [product, dispatch]);

  return (
    <div>
      <PageHeader
        title="Products"
        description={`Total ${product && product.length} products`}
      />
      <CommonTable
        columns={["productId", "name", "description", "baseprice", "status"]}
        data={
          product &&
          product.map((item) => {
            return {
              productId: item.productId,
              name: item.name,
              description: item.description,
              baseprice: item.baseprice,
              status: item.status,
            };
          })
        }
        actions={[
          {
            name: "Restrict",
            type: "block",
            onClick: (e, id) => {
              console.log("Resticted");
            },
          },
        ]}
      />
    </div>
  );
};

export default Page;
