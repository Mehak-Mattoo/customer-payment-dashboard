import type { Customer } from "@/types/customer";

const STORAGE_KEY = "customer-payment-dashboard";

function getStored(): Customer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Customer[];
  } catch {
    return [];
  }
}

function setStored(data: Customer[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Simulate network delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchCustomers(): Promise<Customer[]> {
  await delay(300);
  return getStored();
}

export async function createCustomer(
  payload: Omit<Customer, "id">
): Promise<Customer> {
  await delay(200);
  const list = getStored();
  const id = crypto.randomUUID();
  const customer: Customer = { ...payload, id };
  setStored([...list, customer]);
  return customer;
}

export async function updateCustomer(
  id: string,
  payload: Partial<Omit<Customer, "id">>
): Promise<Customer> {
  await delay(200);
  const list = getStored();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Customer not found");
  const customer: Customer = { ...list[index], ...payload, id };
  const next = [...list];
  next[index] = customer;
  setStored(next);
  return customer;
}

export async function deleteCustomers(ids: string[]): Promise<void> {
  await delay(200);
  const set = new Set(ids);
  const list = getStored().filter((c) => !set.has(c.id));
  setStored(list);
}
