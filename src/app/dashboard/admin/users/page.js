"use client";

import CommonTable from "@/components/GlobalComponents/CommonTable";
import Pagination from "@/components/GlobalComponents/Pagination";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import UserService from "@/lib/services/userService";
import { setUsers } from "@/store/Slices/userSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// User List

const Page = () => {
  const { users } = useSelector((state) => state.user);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    postsPerPage: 5,
    currentElements: 0,
    totalPosts: 0,
  });
  const dispatch = useDispatch();
  const paginateBack = () => {
    if (pagination.currentPage <= 0) return;
    else
      UserService.getPaginated(
        pagination.currentPage - 1,
        pagination.postsPerPage
      )
        .then((res) => {
          dispatch(setUsers(res.data));
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
      UserService.getPaginated(
        pagination.currentPage + 1,
        pagination.postsPerPage
      )
        .then((res) => {
          dispatch(setUsers(res.data));
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

  const handleBLock = (e, id) => {
    e.preventDefault();
    UserService.block(id)
      .then((res) => {
        toast.success("User restricted successfully");
        UserService.getPaginated(
          pagination.currentPage,
          pagination.postsPerPage
        )
          .then((res) => {
            dispatch(setUsers(res.data));
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    UserService.getPaginated(pagination.currentPage, pagination.postsPerPage)
      .then((res) => {
        dispatch(setUsers(res.data));
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
  }, []);

  return (
    <div>
      <PageHeader
        title="Users"
        description={`Total ${users && users.length} users`}
      />
      <CommonTable
        columns={["id", "fullName", "email", "profilePicture"]}
        data={
          users &&
          users.map((item) => {
            return {
              id: item.id,
              fullName: item.fullName,
              email: item.email,
              profilePicture: item.profilePicture,
            };
          })
        }
        actions={[
          {
            name: "Restrict",
            type: "block",
            onClick: (e, id) => {
              handleBLock(e, id);
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
        postsPerPage={10}
        totalPosts={users && pagination.totalPosts}
        paginateFront={() => {
          paginateFront();
        }}
        paginateBack={() => {
          paginateBack();
        }}
      />
    </div>
  );
};
export default Page;
