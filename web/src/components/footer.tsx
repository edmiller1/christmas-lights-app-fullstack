import { useMediaQuery } from "@/hooks/use-media-query";
import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
} from "@phosphor-icons/react";

export const Footer = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <div className="w-full h-32 px-10 flex items-center justify-between border-t">
        <div className="flex items-center">
          <p className="mr-5 font-semibold">&copy; Christmas Lights App</p>
          <p className="mr-1">Privacy</p>
          &middot;
          <p className="mx-1">Terms</p>
          &middot;
          <p className="ml-1">Sitemap</p>
        </div>
        <div className="flex items-center gap-3">
          <InstagramLogo size={24} />
          <FacebookLogo size={24} />
          <TwitterLogo size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 w-full h-24 flex items-center justify-between border-t">
      <div className="flex flex-col">
        <p className="font-semibold">&copy; Christmas Lights App</p>
        <div className="flex items-center">
          <p className="mr-1">Privacy</p>
          &middot;
          <p className="mx-1">Terms</p>
          &middot;
          <p className="ml-1">Sitemap</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <InstagramLogo size={24} />
        <FacebookLogo size={24} />
        <TwitterLogo size={24} />
      </div>
    </div>
  );
};
