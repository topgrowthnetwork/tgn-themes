'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type JsonViewerProps = {
  data: any;
  initialExpanded?: boolean;
};

function JsonViewer({ data, initialExpanded = false }: JsonViewerProps) {
  const t = useTranslations('Common');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderValue = (value: any, key: string, depth: number = 0) => {
    if (value === null) return <span className="text-gray-500">{t('null')}</span>;
    if (value === undefined) return <span className="text-gray-500">{t('undefined')}</span>;

    if (typeof value === 'object') {
      const isArray = Array.isArray(value);
      const isEmpty = isArray ? value.length === 0 : Object.keys(value).length === 0;
      const isExpanded = expanded[key] ?? initialExpanded;

      if (isEmpty) {
        return <span className="text-gray-500">{isArray ? '[]' : '{}'}</span>;
      }

      return (
        <div className="ms-4">
          <div className="flex cursor-pointer items-center gap-1" onClick={() => toggleExpand(key)}>
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-gray-500">{isArray ? '[' : '{'}</span>
          </div>

          {isExpanded && (
            <>
              {Object.entries(value).map(([k, v], index) => (
                <div key={k} className="ms-4">
                  <span className="text-primary-600">{k}</span>
                  <span className="text-gray-500">: </span>
                  {renderValue(v, `${key}.${k}`, depth + 1)}
                  {index < Object.keys(value).length - 1 && (
                    <span className="text-gray-500">,</span>
                  )}
                </div>
              ))}
              <div className="ms-4">
                <span className="text-gray-500">{isArray ? ']' : '}'}</span>
              </div>
            </>
          )}

          {!isExpanded && (
            <span className="text-gray-500">
              {isArray
                ? `... ${value.length} items]`
                : `... ${Object.keys(value).length} properties}`}
            </span>
          )}
        </div>
      );
    }

    if (typeof value === 'string') {
      return <span className="text-green-600">"{value}"</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-orange-600">{value}</span>;
    }

    if (typeof value === 'boolean') {
      return <span className="text-purple-600">{value.toString()}</span>;
    }

    return <span className="text-gray-500">{String(value)}</span>;
  };

  return (
    <pre className="overflow-auto rounded-theme bg-gray-100 p-4 text-sm">
      {renderValue(data, 'root')}
    </pre>
  );
}

export default JsonViewer;
