"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

const FormSchema = z.object({
  inappropriateName: z.boolean().default(false).optional(),
  inappropriateImages: z.boolean().default(false).optional(),
  moreDetails: z.string().optional(),
});

export const ReportDecorationDialog = () => {
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [moreDetails, setMoreDetails] = useState<string | undefined>("");
  const [inappropriateName, setInappropriateName] = useState<boolean>(false);
  const [inappropriateImages, setInappropriateImages] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      inappropriateImages: false,
      inappropriateName: false,
      moreDetails: "",
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    const options: string[] = [];

    if (!values.inappropriateName && !values.inappropriateImages) {
      setSubmitError(true);
    } else if (values.inappropriateName) {
      options.push("Inappropriate Name");
    } else if (values.inappropriateImages) {
      options.push("Inappropriate Images");
    } else {
      setSubmitError(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <span>Report decoration</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Decoration</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="inappropriateName"
              render={() => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={inappropriateName}
                      onCheckedChange={(checked) => {
                        setInappropriateName(checked as boolean);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Inappropriate Name</FormLabel>
                    <FormDescription>
                      Decoration name that includes hateful, threatening
                      content.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inappropriateImages"
              render={() => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={inappropriateImages}
                      onCheckedChange={(checked) => {
                        setInappropriateImages(checked as boolean);
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Inappropriate Images</FormLabel>
                    <FormDescription>
                      Decoration images that are not related to Christmas
                      decorations or display hateful, threatening, sexual or
                      other inappropriate content.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {submitError ? (
              <div className="mb-3">
                <Alert variant="destructive">
                  <TriangleAlert className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Please select at least one option above.
                  </AlertDescription>
                </Alert>
              </div>
            ) : null}

            <FormField
              control={form.control}
              name="moreDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Provide more details..."
                      className="resize-none"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setMoreDetails(e.target.value);
                      }}
                      value={moreDetails}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide additional details that you think might be relevant
                    to the report.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-5 float-right" type="submit">
              Send Report
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
