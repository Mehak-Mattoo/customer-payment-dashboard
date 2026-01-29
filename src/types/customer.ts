export type CustomerStatus = "Open" | "Inactive" | "Paid" | "Due";

export interface Customer {
  id: string;
  name: string;
  description: string;
  status: CustomerStatus;
  rate: number;
  balance: number;
  deposit: number;
}

export type CustomerFormValues = Omit<Customer, "id">;
