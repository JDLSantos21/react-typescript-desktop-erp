import { Spinner } from "./core/Spinner";

interface SectionLoaderProps {
  placeholder?: string;
  className?: string;
}

export default function SectionLoader({
  placeholder,
  className,
}: SectionLoaderProps) {
  return (
    <div
      className={`w-full flex flex-col gap-2 items-center justify-center py-8 ${className}`}
    >
      <Spinner />
      {placeholder && (
        <span className="text-gray-600">
          {placeholder}
          <span className="inline-block animate-pulse">...</span>
        </span>
      )}
    </div>
  );
}
