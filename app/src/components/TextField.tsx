import { forwardRef, type ChangeEvent, type FocusEvent } from "react";
import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";

export const TextField = forwardRef<
  HTMLDivElement,
  {
    name?: string;
    value?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    onChange?(e: ChangeEvent): void;
    onBlur?(e: FocusEvent): void;
  }
>(
  (
    { name, value, label, placeholder, disabled, helperText, onChange, onBlur },
    ref,
  ) => {
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  },
);
