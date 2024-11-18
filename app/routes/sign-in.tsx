import { SignIn } from "@clerk/remix";

export default function Page() {
  return (
    <div className="flex justify-center py-24">

      Please sign in.
      <SignIn />
    </div>
  );
}
