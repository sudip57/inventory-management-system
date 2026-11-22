import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import clsx from 'clsx';
import { imageUrl } from '@/api/items';

const sizes = {
  sm: 'h-10 w-10 rounded',
  lg: 'aspect-[4/3] w-full rounded-lg',
};

export default function ItemThumb({ item, size = 'sm' }) {
  const src = imageUrl(item);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <div
      className={clsx(
        'grid shrink-0 place-items-center overflow-hidden border border-ink-200 bg-ink-100 text-ink-400',
        sizes[size]
      )}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={item.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <ImageOff size={size === 'lg' ? 28 : 16} strokeWidth={1.5} />
      )}
    </div>
  );
}
