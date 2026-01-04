'use client';

import { Dialog, Transition } from '@headlessui/react';
import { useMediaQuery } from '@uidotdev/usehooks';
import clsx from 'clsx';
import { GlobalSettings, Product, ProductAttributes } from 'lib/api/types';
import { Fragment, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { QuickViewContent } from './quick-view-content';

interface ProductQuickViewModalProps {
  product: Product;
  images: Array<{ path: string; title: string }>;
  attributes: ProductAttributes;
  settings: GlobalSettings;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickViewModal({
  product,
  images,
  attributes,
  settings,
  isOpen,
  onClose
}: ProductQuickViewModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Manage variant selection locally within the modal
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    // Initialize with first available variant's attributes
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      const attrs: Record<string, string> = {};
      firstVariant?.attribute_values.forEach((av) => {
        attrs[av.attribute.name.toLowerCase()] = av.value;
      });
      return attrs;
    }
    return {};
  });

  // Find the selected variant based on selected attributes
  const selectedVariant =
    product.variants?.find((variant) =>
      variant.attribute_values.every(
        (av) => selectedAttributes[av.attribute.name.toLowerCase()] === av.value
      )
    ) || (product.variants?.length ? product.variants[0] : null);

  const handleAttributeChange = (attribute: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attribute.toLowerCase()]: value
    }));
  };

  // Desktop: Use Dialog
  if (isDesktop) {
    return (
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={onClose} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          {/* Modal panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  'relative max-h-[90vh] w-full max-w-3xl overflow-y-auto',
                  'rounded-lg border border-neutral-200 bg-white shadow-2xl',
                  'dark:border-neutral-700 dark:bg-neutral-900'
                )}
              >
                <QuickViewContent
                  product={product}
                  images={images}
                  attributes={attributes}
                  settings={settings}
                  selectedVariant={selectedVariant}
                  selectedAttributes={selectedAttributes}
                  onClose={onClose}
                  onAttributeChange={handleAttributeChange}
                  showCloseButton={true}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  }

  // Mobile: Use Drawer
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[96vh] border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Product Quick View</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <QuickViewContent
            product={product}
            images={images}
            attributes={attributes}
            settings={settings}
            selectedVariant={selectedVariant}
            selectedAttributes={selectedAttributes}
            onClose={onClose}
            onAttributeChange={handleAttributeChange}
            showCloseButton={false}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
