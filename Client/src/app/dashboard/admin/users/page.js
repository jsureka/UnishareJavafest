"use client";

import CommonTable from "@/components/GlobalComponents/CommonTable";
import PageHeader from "@/components/OwnerComponents/PageHeader";
import UserService from "@/lib/services/userService";
import { setUsers } from "@/store/Slices/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// User List

const Page = () => {
  const { users } = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!users) {
      UserService.getAll()
        .then((res) => {
          dispatch(setUsers(res));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [users, dispatch]);

  return (
    <div>
      <PageHeader
        title="Users"
        description={`Total ${users && users.length} users`}
      />
      <CommonTable
        columns={["id", "fullName", "email", "profilePictureUrl"]}
        data={
          users &&
          users.map((item) => {
            return {
              id: item.id,
              fullName: item.fullName,
              email: item.email,
              profilePictureUrl: item.profilePictureUrl,
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
