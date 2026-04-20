import clsx from 'clsx';
import { Banner } from 'lib/api/types';
import { getFullPath } from 'lib/utils';
import Image from 'next/image';

function ThreeBannerGridItem({
  item,
  size,
  priority
}: {
  item: Banner;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  const sizes =
    size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw';

  if (!item.img) return null;

  const alt = item.title || item.img.title || 'Banner';
  const isInteractive = Boolean(item.link);

  const tile = (
    <div
      className={clsx(
        'group relative flex aspect-[6/5] h-full w-full items-center justify-center overflow-hidden rounded-theme border bg-white dark:bg-black',
        'border-neutral-200 dark:border-neutral-800',
        isInteractive && 'hover:border-primary-600 dark:hover:border-primary-600'
      )}
    >
      {item.mob_img ? (
        <Image
          src={getFullPath(item.mob_img.path)}
          alt={alt}
          fill
          className={clsx(
            'object-contain p-2 md:hidden',
            isInteractive && 'transition duration-300 ease-in-out group-hover:scale-105'
          )}
          sizes={sizes}
          priority={priority}
        />
      ) : null}
      <Image
        src={getFullPath(item.img.path)}
        alt={alt}
        fill
        className={clsx(
          'object-contain p-2',
          item.mob_img ? 'hidden md:block' : '',
          isInteractive && 'transition duration-300 ease-in-out group-hover:scale-105'
        )}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );

  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      {item.link ? (
        <a
          href={item.link}
          className="block h-full w-full"
          target={item.open_in_new_tab === 1 ? '_blank' : undefined}
          rel={item.open_in_new_tab === 1 ? 'noopener noreferrer' : undefined}
        >
          {tile}
        </a>
      ) : (
        <div className="block h-full w-full">{tile}</div>
      )}
    </div>
  );
}

export function ThreeBannerGrid({ banners }: { banners: Banner[] }) {
  if (!banners[0]?.img || !banners[1]?.img || !banners[2]?.img) return null;

  const [first, second, third] = banners;

  return (
    <section className="grid gap-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeBannerGridItem size="full" item={first} priority={true} />
      <ThreeBannerGridItem size="half" item={second} priority={true} />
      <ThreeBannerGridItem size="half" item={third} />
    </section>
  );
}
