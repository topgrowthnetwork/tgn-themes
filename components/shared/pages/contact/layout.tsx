import Container from '@theme/components/container';

interface ContactLayoutProps {
  children: React.ReactNode;
}

export default function ContactLayout({ children }: ContactLayoutProps) {
  return (
    <>
      <Container>
        <div className="flex flex-col gap-8">{children}</div>
      </Container>
    </>
  );
}
