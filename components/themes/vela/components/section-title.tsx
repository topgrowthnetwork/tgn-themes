interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
        {title}
      </h2>
    </div>
  );
}
