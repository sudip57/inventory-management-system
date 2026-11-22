import { useState } from 'react';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { categoriesApi } from '@/api/categories';

export default function CategoryFormModal({ category, onClose, onSaved }) {
  const isEdit = Boolean(category);
  const toast = useToast();
  const [values, setValues] = useState({
    name: category?.name ?? '',
    description: category?.description ?? '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();

    const found = {};
    if (!values.name.trim()) found.name = 'Name is required';
    else if (values.name.length > 100) found.name = 'Name must be 100 characters or fewer';
    if (values.description.length > 500) found.description = 'Description must be 500 characters or fewer';
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    setFormError('');
    const payload = { name: values.name.trim(), description: values.description.trim() || null };

    try {
      const saved = isEdit
        ? await categoriesApi.update(category.id, payload)
        : await categoriesApi.create(payload);
      toast.success(isEdit ? 'Category updated' : 'Category added');
      onSaved(saved);
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      setFormError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={isEdit ? 'Edit category' : 'New category'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-col">
        <ModalBody className="space-y-4">
          {formError && <p className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700">{formError}</p>}
          <Input label="Name" value={values.name} onChange={set('name')} error={errors.name} autoFocus />
          <Textarea
            label="Description"
            hint="Optional"
            value={values.description}
            onChange={set('description')}
            error={errors.description}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            {isEdit ? 'Save changes' : 'Add category'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
