import clsx from 'clsx';
import { Product } from 'lib/api/types';
import { Link } from 'lib/i18n/navigation';
import { buildProductUrlWithCheapestVariant, getCheapestVariant, getFullPath } from 'lib/utils';
import { GridTileImage } from './grid/tile';

interface ProductCardProps {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
  currency?: string;
  isInteractive?: boolean;
}

export function ProductCard({
  product,
  className = '',
  sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  priority = false,
  currency,
  isInteractive = true
}: ProductCardProps) {
  const currencyCode = currency || 'EGP';
  const cheapestVariant = getCheapestVariant(product);

  return (
    <Link
      href={buildProductUrlWithCheapestVariant(product)}
      className={clsx('group block', className)}
      data-testid="product-card-link"
    >
      <GridTileImage
        alt={product.title}
        isInteractive={isInteractive}
        label={{
          title: product.title,
          amount: cheapestVariant
            ? cheapestVariant.final_price.toString()
            : product.final_price.toString(),
          currencyCode: currencyCode,
          originalAmount: cheapestVariant
            ? cheapestVariant.price.toString()
            : product.price.toString()
        }}
        src={getFullPath(product.thumbnail?.path)}
        fill
        sizes={sizes}
        priority={priority}
      />
    </Link>
  );
}
