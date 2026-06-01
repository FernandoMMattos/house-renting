type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
};

const FormField = ({
  label,
  htmlFor,
  children,
  className = "",
}: FormFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      {children}
    </div>
  );
};

export default FormField;
