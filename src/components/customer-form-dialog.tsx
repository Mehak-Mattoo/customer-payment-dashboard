"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  customerFormSchema,
  type CustomerFormSchema,
} from "@/lib/customer-schema";
import type { Customer } from "@/types/customer";

const STATUS_OPTIONS: { value: Customer["status"]; label: string }[] = [
  { value: "Open", label: "Open" },
  { value: "Inactive", label: "Inactive" },
  { value: "Paid", label: "Paid" },
  { value: "Due", label: "Due" },
];

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<Customer>;
  mode: "add" | "update";
  onSubmit: (values: CustomerFormSchema) => void;
  isSubmitting?: boolean;
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  defaultValues,
  mode,
  onSubmit,
  isSubmitting = false,
}: CustomerFormDialogProps) {
  const form = useForm<CustomerFormSchema>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name ?? "",
          description: defaultValues.description ?? "",
          status: defaultValues.status ?? "Open",
          rate: defaultValues.rate ?? 0,
          balance: defaultValues.balance ?? 0,
          deposit: defaultValues.deposit ?? 0,
        }
      : {
          name: "",
          description: "",
          status: "Open",
          rate: 0,
          balance: 0,
          deposit: 0,
        },
  });

  React.useEffect(() => {
    if (open) {
      if (defaultValues) {
        form.reset({
          name: defaultValues.name ?? "",
          description: defaultValues.description ?? "",
          status: defaultValues.status ?? "Open",
          rate: defaultValues.rate ?? 0,
          balance: defaultValues.balance ?? 0,
          deposit: defaultValues.deposit ?? 0,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          status: "Open",
          rate: 0,
          balance: 0,
          deposit: 0,
        });
      }
    }
  }, [open, defaultValues, form]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Customer" : "Update Customer"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} id="customer-form" className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "add" ? "Add" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
