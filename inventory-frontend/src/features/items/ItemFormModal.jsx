import { useState } from 'react';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { itemsApi, imageUrl } from '@/api/items';
import { useCategories } from '@/features/categories/CategoriesContext';
import { toFormValues, toPayload, validateItem } from '@/lib/item';
import ImagePicker from './ImagePicker';

// Used for both "Add item" (item = null) and "Edit item".
export default function ItemFormModal({ item, onClose, onSaved }) {
  const isEdit = Boolean(item);
  const toast = useToast();
  const { categories } = useCategories();

  const [values, setValues] = useState(() => toFormValues(item));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [file, setFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validateItem(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    setFormError('');

    try {
      const payload = toPayload(values);
      let saved;

      if (isEdit) {
        // Image changes use their own endpoints, after the main update.
        saved = await itemsApi.update(item.id, payload);
        if (file) saved = await itemsApi.uploadImage(item.id, file);
        else if (removeImage && item.imageFileName) saved = await itemsApi.deleteImage(item.id);
      } else {
        saved = await itemsApi.create(payload, file);
      }

      toast.success(isEdit ? 'Item updated' : 'Item added');
      onSaved(saved);
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      setFormError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={isEdit ? 'Edit item' : 'Add item'} size="lg" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-col">
        <ModalBody className="space-y-6">
          {formError && <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{formError}</p>}

          <section>
            <h4 className="mb-3">Details</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                className="sm:col-span-2"
                label="Name"
                value={values.name}
                onChange={set('name')}
                error={errors.name}
                autoFocus
              />
              <Input
                label="SKU"
                value={values.sku}
                onChange={set('sku')}
                error={errors.sku}
                className="[&_input]:font-mono"
              />
              <Select label="Category" value={values.categoryId} onChange={set('categoryId')} error={errors.categoryId}>
                <option value="">Uncategorised</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              <Input label="Brand" value={values.brand} onChange={set('brand')} error={errors.brand} />
              <Input label="Model" value={values.model} onChange={set('model')} error={errors.model} />
              <Textarea
                className="sm:col-span-2"
                label="Description"
                value={values.description}
                onChange={set('description')}
                error={errors.description}
              />
            </div>
          </section>

          <section>
            <h4 className="mb-3">Pricing and stock</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={values.price}
                onChange={set('price')}
                error={errors.price}
              />
              <Input
                label="Warranty (months)"
                type="number"
                min="0"
                step="1"
                value={values.defaultWarrantyMonths}
                onChange={set('defaultWarrantyMonths')}
                error={errors.defaultWarrantyMonths}
              />
              <Input
                label={isEdit ? 'Quantity on hand' : 'Opening quantity'}
                type="number"
                min="0"
                step="1"
                value={values.quantity}
                onChange={set('quantity')}
                error={errors.quantity}
                disabled={isEdit}
                hint={isEdit ? 'Use “Adjust stock” to change this.' : undefined}
              />
              <Input
                label="Reorder level"
                type="number"
                min="0"
                step="1"
                value={values.minStockLevel}
                onChange={set('minStockLevel')}
                error={errors.minStockLevel}
                hint="Flagged as low stock at or below this number."
              />
            </div>
          </section>

          <section>
            <ImagePicker
              existingUrl={isEdit ? imageUrl(item) : null}
              file={file}
              removed={removeImage}
              onPick={(f) => {
                setFile(f);
                setRemoveImage(false);
              }}
              onRemove={() => {
                setFile(null);
                setRemoveImage(true);
              }}
            />
          </section>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            {isEdit ? 'Save changes' : 'Add item'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
