"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Customer, CustomerStatus } from "@/types/customer";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

const STATUS_VARIANT: Record<CustomerStatus, "open" | "inactive" | "paid" | "due"> = {
  Open: "open",
  Inactive: "inactive",
  Paid: "paid",
  Due: "due",
};

function StatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="capitalize">
      {status}
    </Badge>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function AmountCell({
  value,
  showSign = false,
  className,
}: {
  value: number;
  showSign?: boolean;
  className?: string;
}) {
  const isNegative = value < 0;
  return (
    <div className={cn("flex flex-col items-end", className)}>
      <span
        className={cn(
          "tabular-nums",
          showSign && isNegative && "text-myRed",
          showSign && !isNegative && value > 0 && "text-myGreen",
          showSign && "text-muted-foreground"
        )}
      >
        {showSign && value > 0 ? `+${formatCurrency(value)}` : formatCurrency(value)}
      </span>
      <span className="text-darkTextColor2 text-[11px]">CAD</span>
    </div>
  );
}

interface CustomerTableProps {
  customers: Customer[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onRowClick?: (customer: Customer) => void;
  startRowIndex?: number;
}

export function CustomerTable({
  customers,
  selectedIds,
  onSelectionChange,
  onRowClick,
  startRowIndex = 0,
}: CustomerTableProps) {
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === customers.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(customers.map((c) => c.id)));
    }
  };

  const allSelected =
    customers.length > 0 && selectedIds.size === customers.length;
  const someSelected = selectedIds.size > 0;

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg  py-16 text-center">
        <p className="text-muted-foreground text-md font-semibold">
          No Data Found
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          Add a customer to get started.
        </p>
      </div>
    );
  }

  return (
    <Table >
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={allSelected || (someSelected ? "indeterminate" : false)}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
              #
            </div>
          </TableHead>
          <TableHead className="uppercase tracking-wider text-muted-foreground text-[11px] font-semibold">
            Name
          </TableHead>
          <TableHead className="uppercase tracking-wider text-muted-foreground text-[11px] font-semibold">
            Description
          </TableHead>
          <TableHead className="uppercase tracking-wider text-muted-foreground text-[11px] font-semibold">
            Status
          </TableHead>
          <TableHead className="text-right uppercase tracking-wider text-muted-foreground text-[11px] font-semibold">
            Rate
          </TableHead>
          <TableHead className="text-right uppercase tracking-wider text-muted-foreground text-[11px] font-semibold">
            Balance
          </TableHead>
          <TableHead className="text-right uppercase tracking-wider text-muted-foreground text-[11px] font-semibold">
            Deposit
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((row, index) => (
          <TableRow
            key={row.id}
            data-state={selectedIds.has(row.id) ? "selected" : undefined}
            className={cn(
              "",
              selectedIds.has(row.id) && "bg-muted"
            )}
            onClick={() => onRowClick?.(row)}
          >
            <TableCell
              className="w-14"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedIds.has(row.id)}
                  onCheckedChange={() => toggleOne(row.id)}
                  aria-label={`Select ${row.name}`}
                />
                <span className="text-darkTextColor text-sm">
                  {startRowIndex + index + 1}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-darkTextColor">{row.name}</span>
                <span className="text-darkTextColor2 text-xs font-normal">
                  {row.id.slice(0, 10)}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-wrap max-w-[238px] text-muted-foreground text-sm">
              {row.description}
            </TableCell>
            <TableCell>
              <StatusBadge status={row.status} />
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              <AmountCell value={row.rate}  />
            </TableCell>
            <TableCell className="text-right">
              <AmountCell value={row.balance} showSign />
            </TableCell>
            <TableCell className="text-right">
              <AmountCell value={row.deposit} showSign />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
