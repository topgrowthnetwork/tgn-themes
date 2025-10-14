import SocialMediaLinks from '@shared/components/social-media-links';
import { GlobalSettings } from 'lib/api/types';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ContactInformationProps {
  settings: GlobalSettings;
}

export default function ContactInformation({ settings }: ContactInformationProps) {
  const t = useTranslations('Contact');

  return (
    <div className="rounded-theme border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        {t('contactInfo')}
      </h2>

      <div className="space-y-4">
        {settings.contact_email && (
          <div className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 text-gray-400 dark:text-gray-500">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('email')}</p>
              <a
                href={`mailto:${settings.contact_email}`}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {settings.contact_email}
              </a>
            </div>
          </div>
        )}

        {settings.contact_phone && (
          <div className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 text-gray-400 dark:text-gray-500">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('phone')}</p>
              <a
                href={`tel:${settings.contact_phone}`}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {settings.contact_phone}
              </a>
            </div>
          </div>
        )}

        {settings.contact_address && (
          <div className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 text-gray-400 dark:text-gray-500">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('address')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{settings.contact_address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Social Media Links */}
      <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
        <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">{t('followUs')}</h3>
        <SocialMediaLinks settings={settings} />
      </div>
    </div>
  );
}
