import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="mt-10">
      <div className="text-red-500 text-2xl flex">
        <Input type="text" placeholder="Enter text" defaultValue="Hello World" />
        <Button>Click me</Button>
      </div>
    </div>
  );
}
