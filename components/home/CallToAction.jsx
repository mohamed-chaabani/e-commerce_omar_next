import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag, Truck } from "lucide-react";
import Link from "next/link";
import Button from "../ui/Button.jsx";
// import image from "../../images/63efe8c3703ce5246c1db5cf_Bx4BAwzPMaawyKtcCnxSgPBWQPvtGx4Vh4jLMz1OvQZNu7ubjBMMuf53E7D4V5QNqOHe0_xJs2pt6Rd4sMYl6_c4thKaH_QiaX1znIcWmDWcBHqkFGERi0x8S0xCTEr77Zz_eY6UcZjkj-Age9IHzoY.jpeg";
import image from "../../public/63efe8c3703ce5246c1db5cf_Bx4BAwzPMaawyKtcCnxSgPBWQPvtGx4Vh4jLMz1OvQZNu7ubjBMMuf53E7D4V5QNqOHe0_xJs2pt6Rd4sMYl6_c4thKaH_QiaX1znIcWmDWcBHqkFGERi0x8S0xCTEr77Zz_eY6UcZjkj-Age9IHzoY.jpeg";

const CallToAction = () => {
  const features = [
    {
      icon: <Truck className="w-10 h-10 text-primary-500" />,
      title: "Livraison gratuite",
      description: "Livraison gratuite pour toute commande de plus de 199 TND",
    },
    {
      icon: <Clock className="w-10 h-10 text-primary-500" />,
      title: "Support 24/7",
      description: "Notre équipe est disponible pour vous aider 24/7",
    },
    {
      icon: <Tag className="w-10 h-10 text-primary-500" />,
      title: "Meilleures offres",
      description: "Abonnez-vous pour des offres spéciales et des réductions",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-secondary-900">
      <div className="container mx-auto px-4">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
          >
            <img
              src={image}
              alt="Pièces automobiles de qualité"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </motion.div>

          {/* Content Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
                La performance que
                <br />
                votre véhicule mérite
              </h2>
              <p className="text-lg text-secondary-600 dark:text-gray-400 mb-6">
                Rejoignez des milliers de clients satisfaits qui font confiance
                à nos pièces pour maintenir leurs véhicules en parfait état.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    Explorer nos produits <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-5 bg-gray-50 dark:bg-secondary-800 rounded-lg"
                >
                  {feature.icon}
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mt-3">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-gray-400 mt-2">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
