import { ClipLoader } from "react-spinners";

export interface loaderProps {
  color?: string;
  size?: number;
}
export const Loader = (props: loaderProps) => {
  const { color = "rgb(38,38,38)", size = 50 } = props;
  return (
    <div className="h-full w-full flex justify-center items-center">
      <ClipLoader
        color={color}
        loading={true}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};
