import Link from "next/link";

export const metadata = {
  title: "Page non trouvée",
};

export default function NotFound() {
  return (
    <div className="bg-white dark:bg-secondary-900 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-secondary-900 dark:text-white mb-4">
          404
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-400 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
