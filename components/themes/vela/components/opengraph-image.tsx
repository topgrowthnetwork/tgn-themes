import { createApi } from 'lib/api';
import { getFullPath } from 'lib/utils';
import { ImageResponse } from 'next/og';

export type Props = {
  title?: string;
};

export default async function OpengraphImage(props?: Props): Promise<ImageResponse> {
  const api = createApi({ language: 'en' });
  const globalSettingsResult = await api.getGlobalSettings();

  if (globalSettingsResult.isErr() || !globalSettingsResult.value.data.site_logo) {
    return new ImageResponse(
      (
        <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
          <p tw="text-6xl font-bold text-white">No logo found</p>
        </div>
      )
    );
  }

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
        <div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
          <img
            src={getFullPath(globalSettingsResult.value.data.site_logo.path)}
            alt={globalSettingsResult.value.data.site_title}
            width={160}
            height={160}
          />
        </div>
        <p tw="mt-12 text-6xl font-bold text-white">{globalSettingsResult.value.data.site_title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
