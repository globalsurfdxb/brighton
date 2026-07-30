import { heroData } from "../data";
import CustomButton from "../../common/CustomButton";

export default function Hero() {
  return (
    // <section className="relative h-svh w-full overflow-hidden">
    <section className="fixed inset-0 h-svh w-full overflow-hidden z-0">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heroData.video}
        poster={heroData.poster}
        autoPlay
        muted
        loop
        playsInline
      />

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 21.13%, rgba(0, 0, 0, 0.7) 83.59%)",
        }}
        className="absolute inset-0"
      />

      <div className="relative z-10 flex h-full flex-col justify-end container pb-130">
        <h1 className="hero-title text-cream-background mb-5 max-w-[19ch]">
          {heroData.title}
        </h1>
        <div className="w-full flex flex-col lg:flex-row justify-between lg:items-end gap-5">
          <p className="text-description text-secondary max-w-[77ch]">
            {heroData.description}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {heroData.buttons.map((button, index) => (
              <CustomButton
                key={index}
                text={button.text}
                link={button.link}
                btnClass="w-fit"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
