import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "../ui/Button.jsx";

const Hero = () => {
  return (
    <section
     className="relative h-[80vh] min-h-[600px] bg-secondary-900 overflow-hidden"
    //  className="relative h-[80vh] min-h-[600px] bg-white dark:bg-secondary-900 overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Produits technologiques de qualité supérieure"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900 via-secondary-900/90 to-secondary-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-6"
          >
            Le futur de la technologie est ici
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Découvrez la technologie premium pour une vie moderne
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl"
          >
            Améliorez votre expérience numérique avec des appareils de pointe
            qui allient innovation, design et performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/products">
              <Button
                size="lg"
                variant="primary"
                className="flex items-center gap-2"
              >
                Acheter maintenant <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                Voir les catégories
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
