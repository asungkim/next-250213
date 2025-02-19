import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div>메인 페이지입니다.</div>
      <Button className="bg-blue-500">버튼</Button>
    </>
  );
}
