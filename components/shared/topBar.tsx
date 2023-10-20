import Link from "next/link";
import { InstaTextIcon } from "../../icons/instaTextIcon";

export default function BottomBar() {
  return (
    <div className="hidden max-md:flex flex-row justify-between items-center w-full h-[60px] gap-4 px-4  border-t-2 border-gray-700">
      <InstaTextIcon customColor="white" />
      <Link href="/activity">
        <img
          src="/assets/heart.svg"
          alt="notifications"
          width={24}
          height={24}
        />
      </Link>
    </div>
  );
}
