import { useRouter } from "next/navigation";

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
  const router = useRouter();
  return (
    <form onSubmit={onSubmit} className={className} {...props}>
        {title && (
          <div className="justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="block cursor-pointer mt-3 text-sm text-gray-500 hover:text-gray-800 "
            >
              ← Back
            </button>
            <h1 className="block justify-center text-3xl font-bold">{title}</h1>
          </div>
        )}
      {children}
    </form>
  );
};

export default Form;
