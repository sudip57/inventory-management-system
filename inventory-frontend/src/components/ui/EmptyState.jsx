export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <h3>{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
