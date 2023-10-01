"use client";

import CommonTable from "@/components/GlobalComponents/CommonTable";
import Pagination from "@/components/GlobalComponents/Pagination";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import ProductService from "@/lib/services/productService";
import { setProduct } from "@/store/Slices/productSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Product List

const Page = () => {
  const { product } = useSelector((state) => state.product);
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = product?.slice(indexOfFirstPost, indexOfLastPost);

  const paginateFront = () => {
    const totalPages = Math.ceil(product?.length / postsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginateBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRestrict = (e, id) => {
    e.preventDefault();
    ProductService.restrict(id)
      .then((res) => {
        toast.success("Product restricted successfully");
        ProductService.getAll()
          .then((res) => {
            dispatch(setProduct(res.data));
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  };

  useEffect(() => {
    if (!product) {
      ProductService.getAll()
        .then((res) => {
          dispatch(setProduct(res.data));
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
              handleRestrict(e, id);
            },
          },
        ]}
      />
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={product?.length}
        paginateBack={paginateBack}
        paginateFront={paginateFront}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Page;
