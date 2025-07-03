import clsx from 'clsx';
import { createApi } from 'lib/api';
import { getFullPath } from 'lib/utils';
import Image from 'next/image';

export default async function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  const api = createApi({ language: 'en' });
  const settingsResult = await api.getGlobalSettings();

  const [logoPath, logoTitle] = (function getLogoData() {
    if (settingsResult.isOk() && settingsResult.value.data.site_logo) {
      return [
        getFullPath(settingsResult.value.data.site_logo.path),
        settingsResult.value.data.site_title
      ];
    }

    return ['https://placehold.co/600x400.png', 'Logo'];
  })();

  return (
    <div
      className={clsx(
        'flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black',
        {
          'h-[40px] w-[40px] rounded-xl': !size,
          'h-[30px] w-[30px] rounded-theme': size === 'sm'
        }
      )}
    >
      <Image src={logoPath} alt={logoTitle} width={40} height={40} />
    </div>
  );
}
