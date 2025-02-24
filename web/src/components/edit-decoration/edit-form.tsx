"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { MapboxSearchResponse, MapboxSuggestion } from "@/lib/types";
import useStore from "@/store/useStore";
import success from "../../lottie/success.json";
import { LottieAnimation } from "../lottie-animation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateDecorationArgs } from "@/api/decoration/updateDecoration/types";
import { updateDecoration } from "@/api/decoration/updateDecoration";

interface Props {
  decorationName: string;
  decorationAddress: string;
  decorationId: string;
}

export const EditForm = ({
  decorationName,
  decorationAddress,
  decorationId,
}: Props) => {
  const { decreaseEditStep, editedImages, deletedImages, setEditDialogOpen } =
    useStore((state) => state);

  const queryClient = useQueryClient();

  const [decorationEdited, setDecorationEdited] = useState<boolean>(false);
  const [decorationLoading, setDecorationLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<unknown[]>([]);
  const [addressId, setAddressId] = useState<string>("");

  const { mutateAsync } = useMutation({
    mutationFn: async (data: UpdateDecorationArgs) => updateDecoration(data),
    onSuccess: () => {
      setDecorationEdited(true);
      toast.success("Decoration updated successfully!");
      setEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get-decoration"] });
      decreaseEditStep(2);
    },
    onError: () => {
      setDecorationLoading(false);
      toast.error("Failed to update decoration, Please try again.");
    },
  });

  const formSchema = z.object({
    name: z.string().min(1, { message: "Decoration name is required" }),
    address: z.string().min(1, { message: "Decoration address is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: decorationName,
      address: decorationAddress,
    },
  });

  const handleAddressSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectAddress = async (suggestion: unknown) => {
    if (
      !suggestion ||
      typeof suggestion !== "object" ||
      !("full_address" in suggestion)
    ) {
      throw new Error("Invalid suggestion format");
    }

    const typedSuggestion = suggestion as MapboxSuggestion;

    setSearchQuery(typedSuggestion.full_address);
    setAddressId(typedSuggestion.mapbox_id);
    setSuggestions([]);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setDecorationLoading(true);
    values.address = searchQuery ? searchQuery : values.address;

    const decorationData = {
      decorationId: decorationId,
      name: values.name,
      address: values.address,
      images: editedImages,
      deletedImageIds: deletedImages,
      addressId,
    };

    try {
      mutateAsync(decorationData);
    } catch (error) {
      setDecorationLoading(false);
      console.error("Failed to update decoration:", error);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0 && searchQuery.length < 25) {
      const getAddressData = setTimeout(async () => {
        const response = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchQuery}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&session_token=0f6c0283-69eb-41d1-88af-83b6da40a6a0&language=en&limit=10&country=nz&types=region%2Cdistrict%2Cpostcode%2Clocality%2Cplace%2Cneighborhood%2Caddress%2Cpoi%2Cstreet%2Ccategory%2Ccountry&proximity=-98%2C%2040`
        );
        const jsonData = (await response.json()) as MapboxSearchResponse;
        setSuggestions(jsonData.suggestions);
      }, 500);

      return () => clearTimeout(getAddressData);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  if (decorationEdited) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Decoration Edited Successfully</DialogTitle>
        </DialogHeader>
        <div className="flex h-64 items-center justify-center">
          <LottieAnimation
            loop={false}
            autoplay={true}
            animationData={success}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {!decorationLoading ? (
        <>
          <DialogHeader>
            <DialogTitle>Decoration Details</DialogTitle>
            <DialogDescription>
              Update the name and address for your decoration
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decoration Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel>Decoration Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleAddressSearch(e);
                        }}
                        value={searchQuery ? searchQuery : field.value}
                        placeholder="Start typing the address..."
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <>
                {suggestions.length > 0 ? (
                  <div className="z-50 h-72 overflow-y-auto rounded-lg border dark:border-zinc-800">
                    <ul>
                      {suggestions.map((suggestion: unknown) => {
                        const typedSuggestion = suggestion as MapboxSuggestion;

                        return (
                          <li
                            key={typedSuggestion.mapbox_id}
                            className="flex cursor-pointer flex-col border-b px-3 py-2 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                            onClick={() => handleSelectAddress(suggestion)}
                          >
                            <strong className="text-sm">
                              {typedSuggestion.name}
                            </strong>
                            <span className="text-xs">
                              {typedSuggestion.full_address}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </>
              <DialogFooter className="mt-8">
                <div className="flex w-full items-center justify-between">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => decreaseEditStep(2)}
                  >
                    Go back
                  </Button>
                  <Button type="submit">Update</Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Updating Decoration...</DialogTitle>
          </DialogHeader>
          <div className="flex h-64 items-center justify-center">
            <LoaderCircle
              className="h-20 w-20 animate-spin"
              strokeWidth={1.5}
            />
          </div>
        </>
      )}
    </>
  );
};
