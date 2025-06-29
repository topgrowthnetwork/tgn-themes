import { GlobalSettings } from 'lib/api/types';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

interface SocialMediaLinksProps {
  settings: GlobalSettings;
}

export default function SocialMediaLinks({ settings }: SocialMediaLinksProps) {
  const socialLinks = [
    {
      name: 'Facebook',
      url: settings.facebook_link,
      icon: <Facebook className="h-5 w-5" />
    },
    {
      name: 'Twitter',
      url: settings.twitter_link,
      icon: <Twitter className="h-5 w-5" />
    },
    {
      name: 'Instagram',
      url: settings.instagram_link,
      icon: <Instagram className="h-5 w-5" />
    },
    {
      name: 'YouTube',
      url: settings.youtube_link,
      icon: <Youtube className="h-5 w-5" />
    },
    {
      name: 'LinkedIn',
      url: settings.linkedin_link,
      icon: <Linkedin className="h-5 w-5" />
    }
  ];

  // Filter out social links that don't have URLs
  const validSocialLinks = socialLinks.filter((link) => link.url && link.url.trim() !== '');

  if (validSocialLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {validSocialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
          aria-label={`Follow us on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
