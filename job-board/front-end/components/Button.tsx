interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "success" | "error" | "outline";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  onClick, 
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    error: "btn-error",
    outline: "btn-outline",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${loading ? 'loading' : ''}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}