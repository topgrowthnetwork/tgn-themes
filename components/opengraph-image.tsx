import { createApi } from 'lib/api';
import { getFullPath } from 'lib/utils';
import Image from 'next/image';
import { ImageResponse } from 'next/og';

export type Props = {
  title?: string;
};

export default async function OpengraphImage(props?: Props): Promise<ImageResponse> {
  const api = createApi({ language: 'en' });
  const globalSettingsResponse = await api.getGlobalSettings();
  const globalSettings = globalSettingsResponse.data;

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
        <div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
          <Image
            src={getFullPath(globalSettings.site_logo.path)}
            alt={globalSettings.site_title}
            width={160}
            height={160}
          />
        </div>
        <p tw="mt-12 text-6xl font-bold text-white">{globalSettings.site_title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await fetch(new URL('../fonts/Inter-Bold.ttf', import.meta.url)).then((res) =>
            res.arrayBuffer()
          ),
          style: 'normal',
          weight: 700
        }
      ]
    }
  );
}
