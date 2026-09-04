"use client";

import { useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { Button, FormGrid, Input, Select } from "@/components/frontendUi/index.js";

type BaseFilterProps = {
  fromDate: string;
  toDate: string;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  clearBaseFilters: () => void;
  searchLabel?: string;
};

type SelectOption = string | { label: string; value: string };

type PartyCategoryFilterProps = BaseFilterProps & {
  partyFilter?: string;
  setPartyFilter?: (value: string) => void;
  partyOptions?: SelectOption[];
  categoryFilter?: string;
  setCategoryFilter?: (value: string) => void;
  categoryOptions?: SelectOption[];
};

export function FilterFooter({ onClear }: { onClear: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
      <Button variant="ghost" onClick={onClear}>Clear</Button>
      <Button variant="primary">Search</Button>
    </div>
  );
}

export function DateRangeSearchFilters({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  clearBaseFilters,
  searchLabel = "Search",
}: BaseFilterProps) {
  const endDateRef = useRef<HTMLInputElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <FormGrid cols={3}>
        <Input
          label="Start Date"
          type="date"
          value={fromDate}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setFromDate(event.target.value)}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              endDateRef.current?.focus({ preventScroll: true });
            }
          }}
        />
        <Input
          ref={(node: HTMLInputElement | null) => {
            endDateRef.current = node;
          }}
          label="End Date"
          type="date"
          value={toDate}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setToDate(event.target.value)}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              searchButtonRef.current?.click();
            }
          }}
        />
        <div style={{ display: "flex", alignItems: "end" }}>
          <Button
            ref={(node: HTMLButtonElement | null) => {
              searchButtonRef.current = node;
            }}
            variant="primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {searchLabel}
          </Button>
        </div>
      </FormGrid>
      <FilterFooter onClear={clearBaseFilters} />
    </div>
  );
}

export function DatePartyCategoryFilters({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  clearBaseFilters,
  partyFilter,
  setPartyFilter,
  partyOptions = [],
  categoryFilter,
  setCategoryFilter,
  categoryOptions = [],
}: PartyCategoryFilterProps) {
  const cols = categoryFilter !== undefined && setCategoryFilter ? 4 : 3;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <FormGrid cols={cols}>
        <Input
          label="From"
          type="date"
          value={fromDate}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setFromDate(event.target.value)}
          data-section-entry
        />
        <Input
          label="To"
          type="date"
          value={toDate}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setToDate(event.target.value)}
        />
        {partyFilter !== undefined && setPartyFilter && (
          <Select
            label="Party"
            value={partyFilter}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setPartyFilter(event.target.value)}
            options={partyOptions}
          />
        )}
        {categoryFilter !== undefined && setCategoryFilter && (
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setCategoryFilter(event.target.value)}
            options={categoryOptions}
          />
        )}
      </FormGrid>
      <FilterFooter onClear={clearBaseFilters} />
    </div>
  );
}
