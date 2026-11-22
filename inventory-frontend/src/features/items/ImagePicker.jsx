import { useEffect, useRef, useState } from 'react';
import { ImagePlus, ImageOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import { MAX_IMAGE_MB } from '@/config';

// Chooses a new image file and previews it. The existing image (if any)
// is shown until a new file is picked or the user removes it.
export default function ImagePicker({ existingUrl, file, removed, onPick, onRemove }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleChange(e) {
    const picked = e.target.files?.[0];
    e.target.value = '';
    if (!picked) return;

    if (!picked.type.startsWith('image/')) return setError('Please choose an image file.');
    if (picked.size > MAX_IMAGE_MB * 1024 * 1024) return setError(`Image must be ${MAX_IMAGE_MB} MB or smaller.`);

    setError('');
    onPick(picked);
  }

  const shown = preview || (!removed ? existingUrl : null);

  return (
    <div>
      <span className="field-label">Image</span>
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-24 shrink-0 place-items-center overflow-hidden rounded-md border border-ink-200 bg-ink-100 text-ink-400">
          {shown ? (
            <img src={shown} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageOff size={20} strokeWidth={1.5} />
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => inputRef.current?.click()}>
              <ImagePlus size={15} /> {shown ? 'Replace' : 'Choose image'}
            </Button>
            {shown && (
              <Button size="sm" variant="ghost" onClick={onRemove}>
                Remove
              </Button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-ink-500">JPG or PNG, up to {MAX_IMAGE_MB} MB.</p>
        </div>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger-700">{error}</p>}
    </div>
  );
}
