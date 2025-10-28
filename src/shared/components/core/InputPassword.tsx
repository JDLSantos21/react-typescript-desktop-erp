import { forwardRef, useState } from "react";
import { Input } from "./Input";
import { InputHTMLAttributes } from "react";
import { LuEye, LuEyeClosed, LuLock } from "react-icons/lu";

interface InputPasswordProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled" | "outlined";
  inputSize?: "sm" | "md" | "lg";
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        startIcon={<LuLock className="text-primary" />}
        endIcon={
          <button
            type="button"
            onClick={togglePassword}
            className="cursor-pointer hover:text-text-primary transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <LuEyeClosed /> : <LuEye />}
          </button>
        }
        {...props}
      />
    );
  }
);

InputPassword.displayName = "InputPassword";
