"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerTable } from "@/components/customer-table";
import { CustomerFormDialog } from "@/components/customer-form-dialog";
import { TablePagination } from "@/components/table-pagination";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomers,
} from "@/hooks/use-customers";
import type { Customer } from "@/types/customer";
import type { CustomerFormSchema } from "@/lib/customer-schema";
import { Trash2, UserPlus, Pencil, Search, Filter, Plus } from "lucide-react";

const ROWS_PER_PAGE_DEFAULT = 10;

function filterCustomers(customers: Customer[], query: string): Customer[] {
  if (!query.trim()) return customers;
  const q = query.trim().toLowerCase();
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
  );
}

export default function Home() {
  const { data: customers = [], isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomers = useDeleteCustomers();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWS_PER_PAGE_DEFAULT);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<"add" | "update">("add");
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(
    null
  );

  const filteredCustomers = React.useMemo(
    () => filterCustomers(customers, searchQuery),
    [customers, searchQuery]
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / rowsPerPage)
  );
  const paginatedCustomers = React.useMemo(
    () =>
      filteredCustomers.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
      ),
    [filteredCustomers, page, rowsPerPage]
  );

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const selectedCount = selectedIds.size;
  const singleSelected =
    selectedCount === 1 ? customers.find((c) => selectedIds.has(c.id)) : null;

  const handleAdd = () => {
    setEditingCustomer(null);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    if (singleSelected) {
      setEditingCustomer(singleSelected);
      setDialogMode("update");
      setDialogOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    deleteCustomers.mutate(ids, {
      onSuccess: () => setSelectedIds(new Set()),
    });
  };

  const handleRowClick = (customer: Customer) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(customer.id)) next.delete(customer.id);
      else next.add(customer.id);
      return next;
    });
  };

  const handleFormSubmit = (values: CustomerFormSchema) => {
    if (dialogMode === "add") {
      createCustomer.mutate(values);
    } else if (editingCustomer) {
      updateCustomer.mutate({
        id: editingCustomer.id,
        payload: values,
      });
    }
  };

  const isSubmitting =
    createCustomer.isPending || updateCustomer.isPending;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Looooaaaadddding...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b  backdrop-blur ">
      
      </header>
      <main className="container border border-gray-200 rounded-xl ">
        <div className=" bg-lightBlue p-3 flex flex-wrap items-center rounded-t-xl justify-between gap-3 ">
       <div className="flex items-center gap-2">  

        {selectedCount===0 ?
        <>
             <Button
            variant="outline"
            size="icon"
            className="h-8 w-10 shrink-0 rounded-md"
            aria-label="Filter"
          >
            <Filter className="h-3 w-3 text-muted-foreground fill-muted-foreground" />
          </Button>
          <div className="relative flex-1 min-w-[200px]  max-w-xs bg-white rounded-md">
            <Search className="text-muted-foreground/50 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </>: (
          <>
             <span className="text-xs font-medium text-muted-foreground">
            {selectedCount > 0 ? `${selectedCount} selected` : ""}</span>
            {selectedCount > 0 && (
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                disabled={deleteCustomers.isPending}
              >
                <Trash2 className=" h-4 w-4 fill-myRed text-white" />
              
              </Button>
            )}
          </>
        )
        } 
   
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={singleSelected ? handleUpdate : handleAdd} size="sm">
              {singleSelected ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
           {singleSelected ? "Update customer" : "Add customer"}  
            </Button>
           
         
          </div>
        </div>
        <div className="rounded-b-xl  bg-card">
          <CustomerTable
            customers={paginatedCustomers}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={handleRowClick}
            startRowIndex={(page - 1) * rowsPerPage}
          />
          {filteredCustomers.length > 0 && (
            <TablePagination
              totalRows={filteredCustomers.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          )}
        </div>
      </main>
      <CustomerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingCustomer ?? undefined}
        mode={dialogMode}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
