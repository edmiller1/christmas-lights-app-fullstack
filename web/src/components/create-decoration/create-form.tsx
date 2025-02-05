"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

import {
  MapboxResponse,
  MapboxSearchResponse,
  MapboxSuggestion,
} from "@/lib/types";
import useStore from "@/store/useStore";
import success from "../../lottie/success.json";
import { LottieAnimation } from "../lottie-animation";

export const CreateForm = () => {
  const router = useRouter();
  const { decreaseStep, decorationImages } = useStore((state) => state);

  const [decorationCreated, setDecorationCreated] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<unknown[]>([]);
  const [locationInfo, setLocationInfo] = useState<{
    latitude: number | undefined;
    longitude: number | undefined;
    country: string | undefined;
    region: string | undefined;
    city: string | undefined;
  }>({ latitude: 0, longitude: 0, country: "", region: "", city: "" });

  // const createDecoration = api.decoration.createDecoration.useMutation({
  //   onSuccess: ({ id }) => {
  //     setDecorationCreated(true);
  //     toast.success("Decoration created successfully!");
  //     setTimeout(() => {
  //       // Navigate to the new decoration
  //       router.push(`/decorations/${id}`);
  //     }, 1500);
  //   },
  //   onError: (error) => {
  //     // Handle error (show toast, etc)
  //     toast.error("Failed to create decoration, Please try again.");
  //     console.error("Failed to create decoration:", error);
  //   },
  // });

  const formSchema = z.object({
    name: z.string().min(1, { message: "Decoration name is required" }),
    address: z.string().min(1, { message: "Decoration address is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const getLocation = async (suggestion: unknown) => {
    // Type guard to check if suggestion has mapbox_id
    if (
      !suggestion ||
      typeof suggestion !== "object" ||
      !("mapbox_id" in suggestion)
    ) {
      throw new Error("Invalid suggestion format");
    }

    const typedSuggestion = suggestion as MapboxSuggestion;

    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${typedSuggestion.mapbox_id}?session_token=0f6c0283-69eb-41d1-88af-83b6da40a6a0&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
    );

    const jsonData = (await response.json()) as MapboxResponse;
    const data = jsonData.features[0];

    const latitude = data?.properties.coordinates.latitude;
    const longitude = data?.properties.coordinates.longitude;
    const country = data?.properties.context.country.name;
    const region = data?.properties.context.region.name;
    const city = data?.properties.context.place.name;

    return {
      latitude,
      longitude,
      country,
      region,
      city,
    };
  };

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
    setLocationInfo(await getLocation(suggestion));
    setSuggestions([]);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    values.address = searchQuery;

    const decorationData = {
      name: values.name,
      address: values.address,
      images: decorationImages.map((img) => ({
        index: img.index,
        base64Value: img.base64Value,
      })),
      latitude: locationInfo.latitude!,
      longitude: locationInfo.longitude!,
      city: locationInfo.city!,
      region: locationInfo.region!,
      country: locationInfo.country!,
    };

    try {
      //createDecoration.mutate(decorationData);
    } catch (error) {
      console.error("Failed to create decoration:", error);
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

  if (decorationCreated) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Decoration Created Successfully</DialogTitle>
        </DialogHeader>
        <div className="flex h-64 items-center justify-center">
          <LottieAnimation
            loop={false}
            autoplay={true}
            animationData={success}
          />
        </div>
        <LoaderCircle className="h-64 w-64 animate-spin" />
      </>
    );
  }

  return (
    <>
      {true ? (
        <>
          <DialogHeader>
            <DialogTitle>Decoration Details</DialogTitle>
            <DialogDescription>
              Add the name and address for your decoration
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
                        value={searchQuery}
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
                  <Button variant="secondary" onClick={() => decreaseStep(3)}>
                    Go back
                  </Button>
                  <Button>Create</Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Creating Decoration...</DialogTitle>
          </DialogHeader>
          <div className="flex h-64 items-center justify-center">
            <LoaderCircle
              className="h-40 w-40 animate-spin"
              strokeWidth={1.5}
            />
          </div>
        </>
      )}
    </>
  );
};
