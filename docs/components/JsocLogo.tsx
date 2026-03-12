import jsocSvg from "@/app/icon.svg";
import Image from "next/image";

export function JsocLogo() {
  return (
    <div className="flex items-center gap-1">
      <Image src={jsocSvg} alt="JSOC Logo" className="w-10 h-10" />

      <span className="text-4xl font-semibold font-logo tracking-wide">
        JSOC
      </span>
    </div>
  );
}
