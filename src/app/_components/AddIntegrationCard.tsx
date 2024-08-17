"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Combobox } from "~/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { api } from "~/trpc/react";

const FormSchema = z.object({
  institution: z.string().min(1),
});

type FormFields = z.infer<typeof FormSchema>;

export function AddIntegrationCard() {
  const { data: institutionOptions = [] } =
    api.goCardless.getInstitutions.useQuery(
      {
        country: "hu",
      },
      {
        select: (data) =>
          data.map((item) => ({ label: item.name, value: item.id })),
      },
    );

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      institution: "",
    },
  });

  const onSubmit = useCallback(async (data: FormFields) => {
    try {
      console.log("submit data", data);
    } catch (err) {
      console.log("err", err);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add integration</CardTitle>
        <CardDescription>Add integration with a bank account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="add-integration-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full justify-end gap-3"
          >
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Combobox
                      placeholder="Select institution"
                      options={institutionOptions}
                      onValueChange={field.onChange}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-end border-t px-6 py-4">
        <Button
          form="add-integration-form"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
