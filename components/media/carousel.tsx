import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface MediaCarouselProps {
  media: { fileName: string; type: string }[];
}
export const MediaCarousel = (props: MediaCarouselProps) => {
  const { media } = props;
  return (
    <Carousel
      showStatus={false}
      showIndicators={media.length > 1}
      showThumbs={false}
      className="carouselMain"
    >
      {media.map((item: { fileName: string; type: string }, index) => {
        return item.type === "image" ? (
          <div key={index} className="carouselItem">
            <img src={item.fileName} className="carouselImg" alt="postImg" />
          </div>
        ) : (
          <div key={index} className="carouselItem">
            <video width={500} height={300} src={item.fileName} controls />
          </div>
        );
      })}
    </Carousel>
  );
};
