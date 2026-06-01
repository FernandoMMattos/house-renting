export const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className="p-4 border-2 rounded-xl hover:cursor-pointer flex-1" {...props}>
      {children}
    </button>
  );
};

export default Button;
