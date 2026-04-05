import { Link, useNavigate } from "@tanstack/react-router";
import type { SubmitEventHandler } from "react";
import type { DbClient } from "#/dal/db/client"; //yes no?
import * as users from '../dal/userService'
import { authClient } from "#/dal/db/authClient";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    if (mode === "signup") {
      const name = formData.get("fullName") as string;

      const res = await authClient.signUp.email({ email, password, name });
      console.log("SIGNUP RESPONSE:", res);

      if (res.data?.user) {
        navigate({ to: "/" });
      } else {
        alert(res.error?.message || "Signup failed");
      }
    } else {
      const res = await authClient.signIn.email({ email, password });
      console.log("SIGNIN RESPONSE:", res);

      if (res.data?.user) {
        navigate({ to: "/" });
      } else {
        alert(res.error?.message || "Signin failed");
      }
    }
  } catch (err: any) {
    console.error("Auth error:", err);
    alert(err.message || "Authentication failed");
  }
};

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-(--line) bg-[#fffdf8] p-6 shadow-[0_14px_30px_rgba(126,88,42,0.12)] sm:p-7">
      <h1 className="m-0 font-(--font-display) text-3xl leading-tight text-[#2f2518]">
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-2 text-sm text-(--ink-soft)">
        {mode === "signin"
          ? "Welcome back. Continue where you left off."
          : "Join DevJokes and save your favorite punchlines."}
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <div className="grid gap-1.5">
            <label
              className="text-sm font-semibold text-[#4f3f2e]"
              htmlFor="fullName"
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full rounded-xl border border-[#e2d7c4] bg-[#fffdfa] px-3.5 py-2.5 text-(--ink-strong) placeholder:text-[#a89276] focus:border-[rgba(221,107,32,0.55)] focus:outline-none focus:ring-2 focus:ring-[rgba(221,107,32,0.17)]"
              placeholder="Ada Lovelace"
            />
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <label
            className="text-sm font-semibold text-[#4f3f2e]"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-[#e2d7c4] bg-[#fffdfa] px-3.5 py-2.5 text-(--ink-strong) placeholder:text-[#a89276] focus:border-[rgba(221,107,32,0.55)] focus:outline-none focus:ring-2 focus:ring-[rgba(221,107,32,0.17)]"
            placeholder="you@company.com"
          />
        </div>

        <div className="grid gap-1.5">
          <label
            className="text-sm font-semibold text-[#4f3f2e]"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-[#e2d7c4] bg-[#fffdfa] px-3.5 py-2.5 text-(--ink-strong) placeholder:text-[#a89276] focus:border-[rgba(221,107,32,0.55)] focus:outline-none focus:ring-2 focus:ring-[rgba(221,107,32,0.17)]"

          />
        </div>

        <button
          type="submit"
          className="mt-1 inline-flex w-full items-center justify-center rounded-xl border-0 bg-[linear-gradient(180deg,#dd6b20_0%,#b45309_100%)] px-4 py-2.5 font-semibold text-[#fffaf2] shadow-[0_8px_16px_rgba(180,83,9,0.24)] transition-[transform,box-shadow] duration-150 ease-in-out hover:-translate-y-px hover:shadow-[0_10px_20px_rgba(180,83,9,0.3)]"
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-[#7a6750]">
        {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          to={mode === "signin" ? "/signup" : "/signin"}
          className="font-semibold text-[#b45309] no-underline hover:text-[#8f3f08]"
        >
          {mode === "signin" ? "Create one" : "Sign in"}
        </Link>
      </p>
    </section>
  );
}
