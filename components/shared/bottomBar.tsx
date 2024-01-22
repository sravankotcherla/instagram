import { barOptionInterface } from "../../constants/barOptions";
import Image from "next/image";

export default function BottomBar(props: { options: barOptionInterface[] }) {
  const { options } = props;
  return (
    <div className="hidden max-md:flex flex-row justify-around w-full gap-4 p-4 bottom-0 absolute border-t-2 border-gray-700">
      {options.map((option) => (
        <div
          className=" flex flex-col items-center justify-content"
          key={option.label}
          onClick={option.onClick}
        >
          <Image
            src={option.imgURL}
            alt={option.label}
            width={24}
            height={24}
          />
          <p className="hidden ml-2 xl:flex">{option.label}</p>
        </div>
      ))}
    </div>
  );
}
