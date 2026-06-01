interface ButtonProps {
  children: React.ReactNode;
  type: "submit" | "reset" | "button" | undefined;
  disabled: boolean
}

const FormButton = ({ children, type, ...props }: ButtonProps) => {
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
        `}
      {...props}
      type={type}
    >
      {children}
    </button>
  );
};

export default FormButton;
