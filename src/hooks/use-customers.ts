"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomers,
} from "@/lib/customer-api";
import type { Customer } from "@/types/customer";

const queryKey = ["customers"] as const;

export function useCustomers() {
  return useQuery({
    queryKey,
    queryFn: fetchCustomers,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Customer, "id">) => createCustomer(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Omit<Customer, "id">>;
    }) => updateCustomer(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

export function useDeleteCustomers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => deleteCustomers(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}
