import { Button } from "@/components/ui/button";
import RotatingText from "./RotatingText";

import "./hero-section.css";


const companies = [
  { icon: "/images/Clients-logo/swagify.png", name: "Swagify — Client of Next Innovation Systems" },
  { icon: "/images/Clients-logo/efxpro.png", name: "EFX Pro — Client of Next Innovation Systems" },
  { icon: "/images/Clients-logo/ducorr.png", name: "Ducorr — Client of Next Innovation Systems" },
  { icon: "/images/Clients-logo/alladin.png", name: "Aladdin Catering — Client of Next Innovation Systems" },
  { icon: "/images/Clients-logo/sparkdoc.png", name: "SparkDoc — Client of Next Innovation Systems" },
  { icon: "/images/Clients-logo/eventxpro.svg", name: "EventXPro — Client of Next Innovation Systems" },
  { icon: "/images/Clients-logo/cardeye.svg", name: "CardEye — Client of Next Innovation Systems" },
  { icon: "/images/Clients-logo/eolas.png", name: "Eolas — Client of Next Innovation Systems" },
];

const ArrowRight = () => (
  <svg
    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const Play = () => (
  <svg
    className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
  </svg>
);


const CompanyIcon = ({ icon, name }: { icon: string; name: string }) => {
  return (
    <div className="w-24 h-8 flex items-center justify-center flex-shrink-0">
      <img
        src={icon}
        alt={name}
        width={96}
        height={32}
        decoding="async"
        loading="lazy"
        className="max-h-full max-w-full object-contain brightness-0 invert opacity-50 pointer-events-none"
      />
    </div>
  );
};

export function HeroSection() {
  const CompanyList = () => (
    <div className="flex items-center gap-14 whitespace-nowrap flex-shrink-0 pr-14">
      {companies.map((company, index) => (
        <div key={index} className="flex items-center">
          <CompanyIcon icon={company.icon} name={company.name} />
        </div>
      ))}
    </div>
  );

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-hero">
        {/* Badge */}
        <div className="inline-block mb-8 mt-12 animate-fade-in-badge">
          <div className="badge-wrapper">
            <div className="snake-border-layer"></div>
            <div className="badge-content-glass px-4 py-2 flex items-center shadow-[0_0_20px_rgba(0,0,0,0.2)]">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse shrink-0"></span>
              <span className="text-white text-sm font-medium tracking-wide">
                Transforming Businesses Since 2020
              </span>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-8 flex flex-col items-center gap-4 w-full">
          <span className="text-white drop-shadow-md tracking-tight">
            Elevate your business
          </span>
          <div className="relative w-full max-w-[320px] sm:max-w-md md:max-w-xl mx-auto group mt-2">
            <div className="absolute inset-0 bg-[#00ff88]/20 blur-xl rounded-2xl group-hover:bg-[#00ff88]/40 transition-all duration-700"></div>
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-white overflow-hidden backdrop-blur-sm min-h-[5.5rem] sm:min-h-[7rem] lg:min-h-[8.5rem] flex items-center justify-center">
              <RotatingText
                texts={[
                  "Business Growth",
                  "Digital Transformation",
                  "Cloud Scale",
                  "AI Innovation",
                  "Operational Excellence",
                ]}
                mainClassName="w-full flex items-center justify-center text-black py-4 sm:py-6 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                rotationInterval={2500}
              />
            </div>
          </div>
        </h1>

        <p className="text-md sm:text-xl md:text-2xl text-white w-full max-w-sm sm:max-w-xl md:max-w-3xl mx-auto mb-12 font-light px-4 sm:px-6 text-center leading-relaxed">
          We deliver cutting-edge technology solutions that drive innovation and
          accelerate your digital journey.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-buttons">
          <Button
            size="lg"
            className="bg-white text-black rounded-full px-8 py-4 text-lg font-medium hover:bg-white transition-all group"
          >
            <div className="flex justify-center align-items-center items-center">
              Start Your Project <ArrowRight />
            </div>
          </Button>
          <a href="#case-studies">
            <Button
              size="lg"
              className="rounded-full px-8 py-4 text-lg font-medium border border-white/20 text-white bg-transparent hover:bg-emerald-600 hover:border-emerald-600 transition-all hover:scale-105 group"
            >
              <div className="flex justify-center align-items-center items-center">
                <Play /> View Our Work
              </div>
            </Button>
          </a>
        </div>

     
        <div className="text-center px-4 hidden sm:block overflow-hidden">
          <p className="text-md text-white/50 mb-8 font-medium uppercase tracking-widest text-xs">
            Trusted by innovative companies worldwide
          </p>
          <div className="relative w-full mx-auto overflow-hidden pointer-events-none">
            <div className="flex w-max animate-slide-left">
              <CompanyList />
              <CompanyList />
            </div>
          </div>
        </div>

        {/* Mobile Trust Indicators */}
        <div className="text-center px-4 mb-8 sm:hidden overflow-hidden">
          <p className="text-xs text-white/50 mb-6 uppercase tracking-widest">
            Trusted by companies
          </p>
          <div className="relative overflow-hidden w-full pointer-events-none">
            <div className="flex w-max animate-slide-left-mobile">
              <CompanyList />
              <CompanyList />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}