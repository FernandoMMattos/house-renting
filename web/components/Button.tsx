export const Button = ({
  children,
  type = "button",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`p-4 border-2 rounded-xl hover:cursor-pointer ${className}`}
      {...props}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
