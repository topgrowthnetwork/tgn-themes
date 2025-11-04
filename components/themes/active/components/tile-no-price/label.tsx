import clsx from 'clsx';

const Label = ({
  title,
  position = 'bottom'
}: {
  title: string;
  position?: 'bottom' | 'center';
}) => {
  return (
    <div
      className={clsx('absolute bottom-0 left-0 flex w-full', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex w-full flex-col gap-2 border bg-white/70 px-2 py-1 text-sm font-semibold text-black backdrop-blur-md sm:flex-row sm:items-center sm:gap-0 sm:py-2">
        <h3 className="m:me-2 line-clamp-1 flex-grow sm:line-clamp-2">{title}</h3>
      </div>
    </div>
  );
};

export default Label;
