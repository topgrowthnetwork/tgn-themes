import clsx from 'clsx';
import type { FunctionComponent } from 'react';

interface TextProps {
  html: string;
  className?: string;
}

const Prose: FunctionComponent<TextProps> = ({ html, className }) => {
  return (
    <div
      className={clsx(
        'prose mx-auto max-w-6xl text-base leading-6 text-black prose-headings:mb-2 prose-headings:mt-4 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-black prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-p:my-2 prose-p:leading-6 prose-a:text-black prose-a:underline hover:prose-a:text-neutral-300 prose-strong:text-black prose-ol:mb-4 prose-ol:mt-4 prose-ol:list-decimal prose-ol:ps-6 prose-ul:mb-4 prose-ul:mt-4 prose-ul:list-disc prose-ul:ps-6 prose-li:my-1 dark:text-white dark:prose-headings:text-white dark:prose-a:text-white dark:prose-strong:text-white',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html as string }}
    />
  );
};

export default Prose;
