import { GoogleButton } from "./GoogleButton";

export default async function Login({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams;
  return (
    <div className="max-w-sm mx-auto text-center py-16 space-y-6">
      <h1 className="text-3xl font-black">Sign in</h1>
      {error && <p role="alert" className="text-sm text-red-600">Sign-in failed. Please try again.</p>}
      <GoogleButton next={typeof next === "string" ? next : "/"} />
    </div>
  );
}
