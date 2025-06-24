import clsx from 'clsx';
import { createApi } from 'lib/api';
import { getFullPath } from 'lib/utils';
import Image from 'next/image';

export default async function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  const api = createApi({ language: 'en' });
  const settingsResult = await api.getGlobalSettings();
  if (settingsResult.isErr()) {
    return null;
  }
  const settings = settingsResult.value.data;
  return (
    <div
      className={clsx(
        'flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black',
        {
          'h-[40px] w-[40px] rounded-xl': !size,
          'h-[30px] w-[30px] rounded-lg': size === 'sm'
        }
      )}
    >
      <Image
        src={getFullPath(settings.site_logo.path)}
        alt={settings.site_title}
        width={40}
        height={40}
      />
    </div>
  );
}
