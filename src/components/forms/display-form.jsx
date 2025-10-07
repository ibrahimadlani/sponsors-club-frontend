"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
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
import { loadSettings, persistSettings } from "@/lib/settings-storage";

const STORAGE_SCOPE = "display";

const items = [
  { id: "recents", label: "Recents" },
  { id: "home", label: "Home" },
  { id: "applications", label: "Applications" },
  { id: "desktop", label: "Desktop" },
  { id: "downloads", label: "Downloads" },
  { id: "documents", label: "Documents" },
];

const displayFormSchema = z.object({
  items: z
    .array(z.string())
    .min(1, { message: "You have to select at least one item." }),
});

const defaultValues = {
  items: ["recents", "home"],
};

export function DisplayForm({ userId }) {
  const form = useForm({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = loadSettings(STORAGE_SCOPE, defaultValues, userId);
    form.reset(stored);
  }, [form, userId]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      persistSettings(STORAGE_SCOPE, data, userId);
      toast.success("Affichage mis à jour.");
    } catch (error) {
      toast.error("Impossible d'enregistrer votre configuration d'affichage.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...(field.value ?? []), item.id]);
                            } else {
                              field.onChange(
                                (field.value ?? []).filter((value) => value !== item.id),
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Mettre à jour"}
        </Button>
      </form>
    </Form>
  );
}
