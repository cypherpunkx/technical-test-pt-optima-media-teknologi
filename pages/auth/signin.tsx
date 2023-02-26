import { useState, FormEventHandler } from "react";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Router from "next/router";

const SignIn: NextPage = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (response?.ok) Router.push("/");
  };

  return (
    <div className="flex flex-col justify-center items-center h-96 bg-white max-w-md  mx-4 lg:mx-auto rounded-2xl">
      <h1 className="text-4xl uppercase font-bold mb-8">trivia app</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="admin@email.com"
          className="outline-none border-black/20 border-b-2 focus:border-blue-500"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="1234"
          className="outline-none border-black/20 border-b-2 focus:border-blue-500"
          required
        />
        <input
          type="submit"
          value="Login"
          className="bg-blue-400 rounded py-1 font-bold text-white"
        />
      </form>
    </div>
  );
};

export default SignIn;
