interface SectionHeaderProps {
  title: string;
  children?: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
}

export default function SectionHeader({
  title,
  description,
  children,
  icon,
}: SectionHeaderProps) {
  return (
    <section className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
      </div>
      <div className="flex gap-3">{children}</div>
    </section>
  );
}
