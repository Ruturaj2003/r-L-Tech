import { DarkModeToggle } from "@/components/darkModeToggle";
import { Button } from "@/components/ui/button";

const OtherMasterPage = () => {
  return (
    <div className="">
      <DarkModeToggle></DarkModeToggle>
      <Button>Hello</Button>

      <div className="h-50 w-50 bg-primary"></div>
    </div>
  );
};

export default OtherMasterPage;
