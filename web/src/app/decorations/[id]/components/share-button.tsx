"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Decoration } from "@/lib/types";
import {
  CopySimple,
  Envelope,
  FacebookLogo,
  MessengerLogo,
  WhatsappLogo,
  XLogo,
} from "@phosphor-icons/react";
import { Share, Star } from "lucide-react";
import {
  FacebookShareButton,
  EmailShareButton,
  WhatsappShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
} from "next-share";
import { toast } from "sonner";

interface Props {
  decoration: Decoration;
}

export const ShareButton = ({ decoration }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`
    );
    toast.success("Link copied to clipboard");
  };

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <Share className="w-4 h-4" />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Share this decoration
            </DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={decoration.images[0].url}
                alt="Christmas decoration"
                className="w-24 h-24 rounded-lg object-center object-cover"
              />
              <div className="flex flex-col pl-5">
                <h3 className="text-lg font-semibold">{decoration.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {decoration.city}, {decoration.country}
                </p>
                {decoration.averageRating !== "0" && (
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 mr-1" fill="currentColor" />
                    <span>{Number(decoration.averageRating).toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            <Separator className="my-5" />
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleCopyLink}
              >
                <CopySimple size={24} className="mr-2" />
                Copy link
              </Button>
              <EmailShareButton
                url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
                subject={"Check out this amazing decoration!!!"}
                body="Check out this decoration on Christmas Lights App!"
              >
                <div
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  <Envelope size={24} className="mr-2" />
                  Email
                </div>
              </EmailShareButton>

              <FacebookShareButton
                url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
                quote={
                  "Check out this amazing decoration on Christmas Lights App!"
                }
                hashtag={"#ChristmasLightsApp"}
              >
                <div
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  <FacebookLogo size={24} className="mr-2" />
                  Facebook
                </div>
              </FacebookShareButton>

              <WhatsappShareButton
                url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
                title={
                  "Check out this amazing decoration on Christmas Lights App!"
                }
                separator=":: "
              >
                <div
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  <WhatsappLogo size={24} className="mr-2" />
                  WhatsApp
                </div>
              </WhatsappShareButton>

              <FacebookMessengerShareButton
                url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
                appId={""}
              >
                <div
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  <MessengerLogo size={24} className="mr-2" />
                  Messenger
                </div>
              </FacebookMessengerShareButton>

              <TwitterShareButton
                url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
                title={
                  "Check out this amazing decoration on Christmas Lights App!"
                }
              >
                <div
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  <XLogo size={24} className="mr-2" />
                  Twitter
                </div>
              </TwitterShareButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost">
          <Share className="w-12 h-12" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">
            Share this decoration
          </DrawerTitle>
        </DrawerHeader>
        <div>
          <div className="flex p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={decoration.images[0].url}
              alt="Christmas decoration"
              className="w-24 h-24 rounded-lg object-center object-cover"
            />
            <div className="flex flex-col pl-5">
              <h3 className="text-lg font-semibold">{decoration.name}</h3>
              <p className="text-sm text-muted-foreground">
                {decoration.city}, {decoration.country}
              </p>
            </div>
          </div>
          <Separator className="my-5" />
          <div className="grid grid-cols-2 gap-3 p-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleCopyLink}
            >
              <CopySimple size={24} className="mr-2" />
              Copy link
            </Button>

            <EmailShareButton
              url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
              subject={"Check out this amazing decoration!!!"}
              body="Check out this decoration on Christmas Lights App!"
            >
              <div
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full",
                })}
              >
                <Envelope size={24} className="mr-2" />
                Email
              </div>
            </EmailShareButton>

            <FacebookShareButton
              url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
              quote={
                "Check out this amazing decoration on Christmas Lights App!"
              }
              hashtag={"#ChristmasLightsApp"}
            >
              <div
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full",
                })}
              >
                <FacebookLogo size={24} className="mr-2" />
                Facebook
              </div>
            </FacebookShareButton>

            <WhatsappShareButton
              url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
              title={
                "Check out this amazing decoration on Christmas Lights App!"
              }
              separator=":: "
            >
              <div
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full",
                })}
              >
                <WhatsappLogo size={24} className="mr-2" />
                WhatsApp
              </div>
            </WhatsappShareButton>

            <FacebookMessengerShareButton
              url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
              appId={""}
            >
              <div
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full",
                })}
              >
                <MessengerLogo size={24} className="mr-2" />
                Messenger
              </div>
            </FacebookMessengerShareButton>

            <TwitterShareButton
              url={`${process.env.NEXT_PUBLIC_APP_URL}/decorations/${decoration.id}`}
              title={
                "Check out this amazing decoration on Christmas Lights App!"
              }
            >
              <div
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full",
                })}
              >
                <XLogo size={24} className="mr-2" />
                Twitter
              </div>
            </TwitterShareButton>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
