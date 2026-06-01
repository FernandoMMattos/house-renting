type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  title?: string;
  className?: string;
};

const Form = ({
  children,
  onSubmit,
  title,
  className = "",
  ...props
}: FormProps) => {
  return (
    <div className="flex min-h-screen justify-center py-10 px-4">
      <div className="w-full max-w-5xl">
        <form onSubmit={onSubmit} className={className} {...props}>
          <div className="md:col-span-2 flex justify-center">
            {title && (
              <h1 className="mb-4 text-center text-3xl font-bold">{title}</h1>
            )}
          </div>
          {children}
        </form>
      </div>
    </div>
  );
};

export default Form;
