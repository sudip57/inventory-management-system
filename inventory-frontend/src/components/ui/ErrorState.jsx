import Button from './Button';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <h3>Something went wrong</h3>
      <p className="mt-1 max-w-sm text-sm">{error?.message || 'The request failed.'}</p>
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
