// // import { Helmet } from "react-helmet-async";

// export default function AboutPage() {
//   return (
//     <div className="container mx-auto px-4 py-12 mt-12 ">
//       <Helmet>
//         <title>À propos | Smap Auto Pro</title>
//         <meta
//           name="description"
//           content="Découvrez Smap Auto Pro : notre mission, nos valeurs et nos services."
//         />
//         <link rel="canonical" href="/about" />
//       </Helmet>
//       <h1 className="text-3xl font-bold mb-4 text-secondary-900 dark:text-white">
//         À propos
//       </h1>
//       <p className="text-secondary-700 dark:text-gray-300">
//         Nous sommes engagés à fournir des pièces automobiles de qualité avec un
//         excellent service client.
//       </p>
//     </div>
//   );
// }
// ------------------------- test -----------------------------------
// app/about/page.jsx

export const metadata = {
  title: "À propos | Smap Auto Pro",
  description:
    "Découvrez Smap Auto Pro : notre mission, nos valeurs et nos services.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 mt-12">
      <h1 className="text-3xl font-bold mb-4 text-secondary-900 dark:text-white">
        À propos
      </h1>
      <p className="text-secondary-700 dark:text-gray-300">
        Nous sommes engagés à fournir des pièces automobiles de qualité avec un
        excellent service client.
      </p>
    </div>
  );
}
