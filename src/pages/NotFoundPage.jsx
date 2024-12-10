import { AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <AlertCircle className="w-20 h-20 text-red-500" />
      <h1 className="mt-4 text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg">Page Not Found</p>
      <p className="mt-1 text-gray-500">The page you’re looking for doesn’t exist.</p>
      <a
        href="/"
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFoundPage;
