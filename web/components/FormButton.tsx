interface ButtonProps {
  children: React.ReactNode;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  className?: string
}

const FormButton = ({ children, type = "button", className, ...props }: ButtonProps) => {
  return (
    <button
      className={`
        border-0 
        bg-blue-600 
        disabled:bg-gray-200 
        disabled:text-black 
        rounded-lg 
        p-2 
        text-white duration-500
        hover:cursor-pointer
        w-1/2
        place-self-center
        ${className}
        `}
      {...props}
      type={type}
    >
      {children}
    </button>
  );
};

export default FormButton;
