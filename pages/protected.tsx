import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Router from "next/router";

const Protected: NextPage = (): React.ReactElement => {
  const { status, data } = useSession();

  if (status === "unauthenticated") Router.replace("/auth/signin");

  if (status === "authenticated") Router.push("/");

  return <div className="text-8xl text-center">Loading...</div>;
};

export default Protected;
