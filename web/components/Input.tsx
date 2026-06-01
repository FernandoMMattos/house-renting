const Input = ({
  className,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`border-2 rounded-2xl p-2 border-gray-800 focus:outline-0 w-full ${className}`}
      {...props}
      type={type}
    />
  );
};

export default Input;
