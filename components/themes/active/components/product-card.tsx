import clsx from 'clsx';
import { Product } from 'lib/api/types';
import { buildProductUrlWithCheapestVariant, getFullPath } from 'lib/utils';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

interface ProductCardProps {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
  currency?: string;
}

export function ProductCard({
  product,
  className = '',
  sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  priority = false,
  currency
}: ProductCardProps) {
  const currencyCode = currency || 'EGP';

  return (
    <Link
      href={buildProductUrlWithCheapestVariant(product)}
      className={clsx('group block', className)}
    >
      <GridTileImage
        alt={product.title}
        label={{
          title: product.title,
          amount: product.final_price.toString(),
          currencyCode: currencyCode
        }}
        src={getFullPath(product.thumbnail?.path)}
        fill
        sizes={sizes}
        priority={priority}
      />
    </Link>
  );
}
