import { useContext } from "react";
import Link from "next/link";

import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

import logo from "../../images/blanc.png";
import logo_2 from "../../images/logo smap.png";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className="bg-gray-100 dark:bg-secondary-900 text-gray-800 dark:text-white pt-16 pb-8">
      <div className="relative z-[5] container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-xl mb-4">
              <img
                src={theme === "dark" ? logo : logo_2}
                alt="logo"
                className=" h-8 lg:h-10 w-auto object-contain"
              />
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Société spécialisée dans la vente et la distribution de pièces
              détachées automobiles, proposant également un service de vente en
              ligne.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/omar.chaabanii"
                target="_blank"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@dr_moteur"
                target="_blank"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <i className="fa-brands fa-tiktok"></i>
              </a>
              <a
                href="https://www.instagram.com/omar_chaabanii"
                target="_blank"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-xl mb-4">Contactez-nous</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 text-primary-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  El Agba Denden, Route du Kef
                  <br />
                  {/* San Francisco, CA 94107 */}
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-primary-400" />
                <a
                  href="tel:+21655515331"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  +216 55.515.331
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-primary-400" />
                <a
                  href="mailto:contact@zhpieceauto.com"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  contact@zhpieceauto.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4">Notre emplacement</h3>
            <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-secondary-800">
              <iframe
                title="Smap Auto Pro Location"
                className="w-full h-56 md:h-64 lg:h-72"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={
                  "https://www.google.com/maps?q=" +
                  encodeURIComponent("Q4X3+34 Tunis, Tunisia") +
                  "&z=17&hl=fr&output=embed"
                }
              />
            </div>
            <a
              href="https://maps.app.goo.gl/zHBbqiuNW8oaXJwU7?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-primary-600 dark:text-primary-400 hover:underline"
            >
              Voir sur Google Maps
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Smap Auto Pro . Tous droits
            réservés.
          </p>
          <nav className="mt-3 space-x-4 text-sm">
            <Link
              to="/about"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:underline"
            >
              À propos
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/terms"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:underline"
            >
              Conditions
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/privacy"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:underline"
            >
              Confidentialité
            </Link>
          </nav>
          <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">
            Created by{" "}
            <a
              href="https://www.facebook.com/hama.chaabeni/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors hover:underline"
            >
              Mohamed Chaabani
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
