import Image from 'next/image';

export function WhatsAppWidget() {
  const phone = '966133611124';
  const href = `https://wa.me/${phone}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 end-6 z-50 flex items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 hover:scale-110 hover:shadow-xl"
    >
      <Image
        src="/image/icons/whatsapp-colored.svg"
        alt="WhatsApp"
        width={50}
        height={50}
        aria-hidden="true"
      />
    </a>
  );
}
