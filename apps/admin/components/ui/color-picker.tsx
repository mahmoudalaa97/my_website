"use client";

import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  label,
  className,
  disabled,
}: ColorPickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="h-10 w-14 cursor-pointer rounded-md border border-input bg-transparent p-1"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          disabled={disabled}
          className="flex-1 font-mono"
        />
      </div>
    </div>
  );
}

