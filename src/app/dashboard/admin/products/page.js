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
  const [pagination, setPagination] = useState({
    currentPage: 0,
    postsPerPage: 5,
    currentElements: 0,
    totalPosts: 0,
  });

  const paginateBack = () => {
    if (pagination.currentPage <= 0) return;
    else
      ProductService.getPaginated(
        pagination.currentPage - 1,
        pagination.postsPerPage
      )
        .then((res) => {
          dispatch(setProduct(res.data));
          setPagination({
            ...pagination,
            totalPosts: res.totalElements,
            currentPage: res.currentPage,
            currentElements: res.currentElements,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const paginateFront = () => {
    const totalPages = Math.ceil(
      pagination.totalPosts / pagination.postsPerPage
    );
    if (pagination.currentPage >= totalPages - 1) return;
    else
      ProductService.getPaginated(
        pagination.currentPage + 1,
        pagination.postsPerPage
      )
        .then((res) => {
          dispatch(setProduct(res.data));
          setPagination({
            ...pagination,
            totalPosts: res.totalElements,
            currentPage: res.currentPage,
            currentElements: res.currentElements,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const handleRestrict = (e, id) => {
    e.preventDefault();
    ProductService.restrict(id)
      .then((res) => {
        toast.success("Product restricted successfully");
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
  };

  const getProducts = () => {
    ProductService.getPaginated(pagination.currentPage, pagination.postsPerPage)
      .then((res) => {
        dispatch(setProduct(res.data));
        setPagination({
          ...pagination,
          totalPosts: res.totalElements,
          currentPage: res.currentPage,
          currentElements: res.currentElements,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!product) {
      getProducts();
    }
  }, [product, dispatch]);

  return (
    <div>
      <PageHeader
        title="Products"
        description={`Total ${product && product.length} products`}
      />
      <CommonTable
        columns={["productId", "name", "description", "basePrice", "status"]}
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
        startIndex={pagination.currentPage * pagination.postsPerPage + 1}
        endIndex={
          pagination.currentPage * pagination.postsPerPage +
          pagination.currentElements
        }
        postsPerPage={pagination.postsPerPage}
        totalPosts={pagination.totalPosts}
        paginateBack={paginateBack}
        paginateFront={paginateFront}
      />
    </div>
  );
};

export default Page;
