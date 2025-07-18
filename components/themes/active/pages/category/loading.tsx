import Grid from '@theme/components/grid';

export default function CategoryLoading() {
  return (
    <Grid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array(12)
        .fill(0)
        .map((_, index) => {
          return (
            <Grid.Item key={index} className="animate-pulse bg-neutral-100 dark:bg-neutral-900" />
          );
        })}
    </Grid>
  );
}
