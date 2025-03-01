"use client";

import { getDecoration } from "@/api/decoration";
import { LottieAnimation } from "@/components/lottie-animation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import christmasLoader from "../../../lottie/christmas-loader.json";
import { useState } from "react";
import { Files } from "@phosphor-icons/react";
import Image from "next/image";
import { getFileBase64 } from "@/lib/helpers";
import { NotFound } from "@/components/not-found";
import { Button } from "@/components/ui/button";
import { submitDecorationVerification } from "@/api/decoration/submitVerification";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { AlreadySubmittedDialog } from "./components/already-submitted-dialog";

const VerifyDecorationPage = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();

  const id = params.id as string;

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string>("");
  const [base64Value, setBase64Value] = useState<string>("");

  const {
    data: decoration,
    isLoading: getDecorationLoading,
    error: getDecorationError,
  } = useQuery({
    queryKey: ["get-decoration"],
    queryFn: async () => getDecoration(id),
  });

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    setFileName(e.target.files[0].name);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    const base64String = await getFileBase64(e.target.files[0]);
    setBase64Value(base64String);
  };

  const { mutate: submitDecoration, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      await submitDecorationVerification(id, base64Value);
    },
    onSuccess: () => {
      toast.success("Decoration verification submitted");
      router.push(`/decorations/${id}`);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage =
        error?.response?.data?.error || "Failed to submit verification";
      toast.error(errorMessage);
    },
  });

  if (decoration?.verificationSubmitted || decoration?.verified) {
    return <AlreadySubmittedDialog decorationId={id} />;
  }

  if (getDecorationError) {
    return <NotFound />;
  }

  if (getDecorationLoading) {
    return (
      <div className="min-h-screen md:min-h-[90vh] flex justify-center items-center">
        <LottieAnimation animationData={christmasLoader} autoplay loop />
      </div>
    );
  }

  if (!decoration || decoration.userId !== user?.id) {
    return <NotFound />;
  }

  if (isDesktop) {
    return (
      <div className="flex pt-20 space-x-10 md:mx-16 lg:mx-32 xl:mx-52 2xl:mx-72">
        <div className="w-1/2 h-[60vh]">
          <h1 className="pb-5 text-3xl font-extrabold">Verify Decoration</h1>
          <div className="text-base">
            <p className="py-2">
              Before your decoration can be publicly available, you will have to
              verify the decoration&apos;s address.
            </p>
            <p className="py-2">
              This is to ensure that the decoration is located in the correct
              area and is not located in a prohibited area.
            </p>
            <p className="py-2">
              In order to verify a decoration, you will have to upload a
              document that includes your <strong>name</strong> (as it is
              displayed in your profile) and the <strong>address</strong> of the
              decoration you wish to have verified.
            </p>
            <div className="relative flex flex-col items-center justify-center w-full py-6 mt-5 text-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer h-72 hover:border-gray-400">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={uploadFile}
                />
                {filePreview ? (
                  <Image
                    src={filePreview}
                    alt="file preview"
                    className="object-cover h-60 w-full m-auto mb-2 rounded-lg"
                    width={100}
                    height={100}
                  />
                ) : (
                  <Files size={96} color="#6b7280" weight="thin" />
                )}
              </label>
              {fileName ? (
                <span className="text-gray-400">{fileName}</span>
              ) : (
                <>
                  <span className="text-sm text-gray-400">
                    JPEG or PNG only
                  </span>
                  <span className="text-sm text-gray-400">Max size: 2MB</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-1/2 h-[80vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={decoration.images[0].url}
            alt="Christmas Decoration"
            className="object-cover w-full h-[50vh] rounded-t-lg"
          />
          <div className="flex flex-col w-full items-start px-3 py-3 border-b border-l border-r border-gray-400 rounded-bl-lg rounded-br-lg">
            <span className="font-semibold">{decoration.name}</span>
            <span className="text-xs">{decoration.address}</span>
          </div>
          <div className="flex items-end justify-end w-full">
            <Button
              disabled={!file}
              className="mt-4"
              onClick={() => submitDecoration()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      <div className="mx-5 mb-20 mt-10">
        <h1 className="pb-5 text-3xl font-extrabold">Verify Decoration</h1>
        <div className="text-base">
          <p className="py-2">
            Before your decoration can be publicly available, you will have to
            verify the decoration&apos;s address.
          </p>
          <p className="py-2">
            This is to ensure that the decoration is located in the correct area
            and is not located in a prohibited area.
          </p>
          <p className="py-2">
            In order to verify a decoration, you will have to upload a document
            that includes your <strong>name</strong> (as it is displayed in your
            profile) and the <strong>address</strong> of the decoration you wish
            to have verified.
          </p>
          <div className="relative flex flex-col items-center justify-center w-full py-6 mt-5 text-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer h-72 hover:border-gray-400">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={uploadFile}
              />
              {filePreview ? (
                <Image
                  src={filePreview}
                  alt="file preview"
                  className="object-cover h-60 w-full m-auto mb-2 rounded-lg"
                  width={100}
                  height={100}
                />
              ) : (
                <Files size={96} color="#6b7280" weight="thin" />
              )}
            </label>
            {fileName ? (
              <span className="text-gray-400">{fileName}</span>
            ) : (
              <>
                <span className="text-sm text-gray-400">JPEG or PNG only</span>
                <span className="text-sm text-gray-400">Max size: 2MB</span>
              </>
            )}
          </div>
        </div>
        <div className="mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={decoration.images[0].url}
            alt="Christmas Decoration"
            className="object-cover w-full h-[50vh] rounded-t-lg"
          />
          <div className="flex flex-col w-full items-start px-3 py-3 border-b border-l border-r border-gray-400 rounded-bl-lg rounded-br-lg">
            <span className="font-semibold">{decoration.name}</span>
            <span className="text-xs">{decoration.address}</span>
          </div>
          <div className="flex items-end justify-end w-full">
            <Button
              disabled={!file}
              className="mt-4"
              onClick={() => submitDecoration()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyDecorationPage;
