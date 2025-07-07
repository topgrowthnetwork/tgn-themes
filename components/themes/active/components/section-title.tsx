interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        {title}
      </h2>
      <div className="h-1 w-16 bg-primary-600"></div>
    </div>
  );
}
