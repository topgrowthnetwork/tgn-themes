import Container from '@theme/components/container';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container>
        <div className="flex flex-col gap-8">{children}</div>
      </Container>
    </>
  );
}
