import clsx from 'clsx';
import { createApi } from 'lib/api';
import { getFullPath } from 'lib/utils';
import Image from 'next/image';

// TODO: Add size prop
export default async function LogoSquare({
  size = 'sm',
  isFooter = false
}: {
  size?: string;
  isFooter?: boolean;
}) {
  const api = createApi({ language: 'en' });
  const settingsResult = await api.getGlobalSettings();

  const [logoPath, logoTitle] = (function getLogoData() {
    if (settingsResult.isOk() && settingsResult.value.data.site_logo) {
      const path = isFooter
        ? settingsResult.value.data.footer_logo?.path
        : settingsResult.value.data.site_logo.path;
      const title = isFooter
        ? settingsResult.value.data.footer_title
        : settingsResult.value.data.site_title;
      return [getFullPath(path), title];
    }

    return ['https://placehold.co/600x400.png', 'Logo'];
  })();

  return (
    <div>
      <Image
        src={logoPath}
        alt={logoTitle}
        width={0}
        height={0}
        className={clsx('h-16 w-auto object-contain')}
        sizes="7rem"
        priority
      />
    </div>
  );
}
