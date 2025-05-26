import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="text-red-500 text-2xl">
      <Input type="text" placeholder="Enter text" value="Hello World" />
      <Button>Click me</Button>
    </div>
  );
}
