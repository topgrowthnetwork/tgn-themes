import Container from '@theme/components/container';

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <div className="mx-auto max-w-4xl py-8">{children}</div>
    </Container>
  );
}
