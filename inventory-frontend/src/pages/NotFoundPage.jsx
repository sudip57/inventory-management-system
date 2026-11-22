import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2">Page not found</h1>
      <p className="mt-2 text-sm">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-5 inline-block text-sm font-medium">
        Back to dashboard
      </Link>
    </div>
  );
}
