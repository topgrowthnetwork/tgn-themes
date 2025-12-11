'use client';

import { useGlobalSettings } from 'lib/hooks/api';
import { getFullPath } from 'lib/utils';
import { useEffect } from 'react';

export function DynamicMetadataClient() {
  const { data: settings } = useGlobalSettings();

  useEffect(() => {
    if (settings) {
      // Update document title
      document.title = settings.site_title || '';

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settings.site_description || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = settings.site_description || '';
        document.head.appendChild(meta);
      }

      // Update favicon
      if (settings.site_favicon?.path) {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = getFullPath(settings.site_favicon.path);
        } else {
          const link = document.createElement('link');
          link.rel = 'icon';
          link.href = getFullPath(settings.site_favicon.path);
          document.head.appendChild(link);
        }
      }
    }
  }, [settings]);

  return null;
}

