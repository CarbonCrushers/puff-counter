import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  return (
    <div className="flex flex-col grow justify-center items-center">
      <h1 className="text-5xl font-bold text-center">
        Welcome to Puff Counter
      </h1>
      <div className="flex flex-col w-1/3 items-center p-6 space-y-4 mt-32">
        <Input
          className="h-20 border-2 border-black shadow-md"
          type="text"
          placeholder="Email"
        ></Input>
        <Input
          className="h-20 border-2 border-black shadow-md"
          type="password"
          placeholder="Password"
        ></Input>
        <Button className="h-20 w-full" size="default">
          Login
        </Button>
      </div>
    </div>
  );
}
