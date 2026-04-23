import React from "react";
// import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import TopBar from "./TopBar";
import AnimatedBackground from "../ui/AnimatedBackground";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-secondary-900 mt-18 ">
      <TopBar />
      <AnimatedBackground
        preferImageIcons={true}
        useLucide={false}
        count={35}
        minSize={50}
        maxSize={72}
      />
      {/* <Header /> */}
      <section className="flex-grow">
        {/* <Outlet /> */}
        {children}
      </section>
      <Footer />

      {/* WhatsApp Fixed Button */}
      <a
        href="https://wa.me/55515331"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Contact us on WhatsApp"
      >
        <i
          className="fa-brands fa-whatsapp text-white text-2xl"
          aria-hidden="true"
          title="WhatsApp"
        ></i>
      </a>
    </div>
  );
};

export default MainLayout;
