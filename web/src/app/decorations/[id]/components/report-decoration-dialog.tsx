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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, TriangleAlert } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { reportDecoration } from "@/api/decoration";
import { toast } from "sonner";

const FormSchema = z.object({
  inappropriateName: z.boolean().default(false).optional(),
  inappropriateImages: z.boolean().default(false).optional(),
  moreDetails: z.string().optional(),
});

interface Props {
  decorationId: string;
  decorationName: string;
}

export const ReportDecorationDialog = ({
  decorationId,
  decorationName,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);

  const { mutate: reportCurrentDecoration, isPending: isReporting } =
    useMutation({
      mutationFn: (data: { reasons: string[]; additionalInfo: string }) =>
        reportDecoration({
          decorationId,
          reasons: data.reasons,
          additionalInfo: data.additionalInfo,
        }),
      onSuccess: () => {
        toast.success("Decoration reported successfully");
        setOpen(false);
      },
      onError: (error: { response?: { data?: { error?: string } } }) => {
        const errorMessage =
          error?.response?.data?.error || "Failed to report decoration";
        toast.error(errorMessage);
      },
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      inappropriateImages: false,
      inappropriateName: false,
      moreDetails: "",
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    if (!values.inappropriateName && !values.inappropriateImages) {
      setSubmitError(true);
      return;
    }

    const reasons = [];
    if (values.inappropriateName) reasons.push("INAPPROPRIATE_NAME");
    if (values.inappropriateImages) reasons.push("INAPPROPRIATE_IMAGES");

    reportCurrentDecoration({
      reasons,
      additionalInfo: values.moreDetails || "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <span>Report decoration</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Decoration</DialogTitle>
          <DialogDescription>
            You are reporting the decoration <strong>{decorationName}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="inappropriateName"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isReporting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Inappropriate Name</FormLabel>
                    <FormDescription>
                      Decoration name that includes hateful, threatening or
                      sexual content.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inappropriateImages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isReporting}
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
                      disabled={isReporting}
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
            <Button
              className="mt-5 float-right"
              type="submit"
              disabled={isReporting}
            >
              {isReporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />{" "}
                  <span>Sending report...</span>
                </>
              ) : (
                "Send Report"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
