import { Dialog } from "@mui/material";
import { FadeLoader } from "react-spinners";

interface updateLoaderProps {
  color?: string;
  height?: number;
  width?: number;
  radius?: number;
  speed?: number;
}
export const UpdateLoader = (props: updateLoaderProps) => {
  const {
    color = "white",
    height = 15,
    width = 5,
    radius = 15,
    speed = 1,
  } = props;
  return (
    <Dialog
      open={true}
      className="updateLoader"
      classes={{ paper: "bg-transparent" }}
    >
      <FadeLoader
        color={color}
        radius={radius}
        height={height}
        width={width}
        speedMultiplier={speed}
      />
    </Dialog>
  );
};
