"use client";

import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  router.push("/dashboard/owner");
  return null;
};

export default Page;
