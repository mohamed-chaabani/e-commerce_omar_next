import { Helmet } from "react-helmet-async";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 mt-12 ">
      <Helmet>
        <title>Politique de confidentialité | Smap Auto Pro</title>
        <meta
          name="description"
          content="Lisez la politique de confidentialité de Smap Auto Pro."
        />
        <link rel="canonical" href="/privacy" />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4 text-secondary-900 dark:text-white">
        Politique de confidentialité
      </h1>
      <p className="text-secondary-700 dark:text-gray-300">
        Nous accordons une grande importance à votre vie privée. Cette page
        explique comment nous collectons et utilisons les données.
      </p>
    </div>
  );
}
