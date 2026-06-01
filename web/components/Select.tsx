const Select = ({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className={`focus:outline-none w-full cursor-pointer ${className ?? ""}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;