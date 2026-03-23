import { Helmet } from "react-helmet-async";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 mt-12 ">
      <Helmet>
        <title>Conditions d'utilisation | Smap Auto Pro</title>
        <meta
          name="description"
          content="Lisez les conditions d'utilisation de Smap Auto Pro."
        />
        <link rel="canonical" href="/terms" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4 text-secondary-900 dark:text-white">
        Conditions d'utilisation
      </h1>
      <p className="text-secondary-700 dark:text-gray-300">
        Ces conditions régissent votre utilisation de notre site et de nos
        services.
      </p>
    </div>
  );
}
