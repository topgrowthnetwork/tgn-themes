import clsx from 'clsx';
import { GlobalSettings, Product } from 'lib/api/types';
import { buildProductUrlWithCheapestVariant, getCheapestVariant, getFullPath } from 'lib/utils';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

interface ProductCardProps {
  product: Product;
  settings?: GlobalSettings;
  className?: string;
  imageContainerClassName?: string;
  sizes?: string;
  priority?: boolean;
  currency?: string;
}

export function ProductCard({
  product,
  settings,
  className = '',
  imageContainerClassName = '',
  sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  priority = false,
  currency
}: ProductCardProps) {
  const cheapestVariant = getCheapestVariant(product);
  const currencyCode = currency || settings?.site_global_currency || 'EGP';

  return (
    <Link
      href={buildProductUrlWithCheapestVariant(product)}
      className={clsx('group block', className)}
    >
      <div className={clsx('relative', imageContainerClassName)}>
        <GridTileImage
          alt={product.title}
          label={{
            title: product.title,
            amount: cheapestVariant
              ? cheapestVariant.price.toString()
              : product.final_price.toString(),
            currencyCode: currencyCode
          }}
          src={getFullPath(product.thumbnail?.path)}
          fill
          sizes={sizes}
          priority={priority}
        />
      </div>
    </Link>
  );
}
