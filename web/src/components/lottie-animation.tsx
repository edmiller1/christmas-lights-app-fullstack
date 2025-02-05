"use client";

import Lottie from "lottie-react";

interface Props {
  loop: boolean;
  autoplay: boolean;
  animationData: any;
}

export const LottieAnimation = ({ loop, autoplay, animationData }: Props) => {
  return (
    <div className="w-[200px]">
      <Lottie animationData={animationData} loop={loop} autoplay={autoplay} />
    </div>
  );
};
