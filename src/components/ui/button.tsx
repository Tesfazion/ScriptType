import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-control font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "button-primary",
        secondary: "button-secondary",
        quiet: "button-quiet",
        mission: "button-mission",
        outline: "inline-flex min-h-11 items-center gap-1.5 rounded-control border border-border bg-card px-4 text-sm font-semibold hover:bg-muted hover:text-foreground",
        ghost: "inline-flex min-h-11 items-center gap-1.5 rounded-control px-4 text-sm font-semibold hover:bg-muted hover:text-foreground",
        destructive: "inline-flex min-h-11 items-center gap-1.5 rounded-control border border-destructive/20 bg-destructive/10 px-4 text-sm font-semibold text-destructive hover:bg-destructive/20",
        link: "inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "min-h-8 px-2.5 text-xs",
        sm: "min-h-9 px-3 text-sm",
        default: "min-h-11 px-4 text-sm",
        lg: "min-h-12 px-5 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }