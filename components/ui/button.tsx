import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, loading, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#15803D] focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
