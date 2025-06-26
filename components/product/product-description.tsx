import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product, ProductAttributes } from 'lib/api/types';
import { VariantSelector } from './variant-selector';

export function ProductDescription({
  product,
  attributes
}: {
  product: Product;
  attributes: ProductAttributes;
}) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="me-auto w-auto rounded-full bg-primary-600 p-2 text-sm text-white">
          <Price amount={product.final_price.toString()} currencyCode={'EGP'} />
        </div>
      </div>
      <VariantSelector options={attributes} variants={product.variants} />

      {product.description ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.description}
        />
      ) : null}

      <AddToCart variants={product.variants} availableForSale={product.stock > 0} />
    </>
  );
}
