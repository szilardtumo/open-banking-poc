"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type TRPCError } from "@trpc/server";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";

import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { loginAction } from "~/server/actions/auth";
import { api } from "~/trpc/react";

const FormSchema = z.object({
  secretId: z.string().min(1),
  secretKey: z.string().min(1),
});

type FormFields = z.infer<typeof FormSchema>;

export function LoginForm() {
  const utils = api.useUtils();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      secretId: "",
      secretKey: "",
    },
  });

  const onSubmit = useCallback(
    async (data: FormFields) => {
      try {
        await loginAction(data);
        await utils.auth.invalidate();
        toast.success("Login successful!");
      } catch (err) {
        const error = err as TRPCError;
        toast.error(error.message);
      }
    },
    [utils],
  );

  const onValidationError = useCallback(() => {
    toast.error("The login fields cannot be empty!");
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onValidationError)}
        className="flex w-full justify-end gap-3"
      >
        <FormField
          control={form.control}
          name="secretId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Secret ID" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secretKey"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Secret Key" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Login
        </Button>
      </form>
    </Form>
  );
}
