import { Spinner } from "./core/Spinner";

interface SectionLoaderProps {
  placeholder?: string;
}

export default function SectionLoader({ placeholder }: SectionLoaderProps) {
  return (
    <div className="w-full flex flex-col gap-2 items-center justify-center py-8">
      <Spinner />
      {placeholder && <span>{placeholder}</span>}
    </div>
  );
}
