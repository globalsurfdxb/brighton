import AnimatedTitle from "../../client/animations/AnimatedTitle";
import SectionDescription from "../../client/animations/SectionDescription";

const Welcome = () => {
  return (
    <div className="h-full min-h-[60vh] w-full flex justify-center items-center flex-col gap-6">
      <AnimatedTitle
        text="Welcome to the Brighton Dashboard"
        className="text-subtitle"
        skipIntroWait
      />
      <SectionDescription
        direction="y"
        text="Use this dashboard to manage and update your website content."
        className="text-description-4 text-description-color"
      />
    </div>
  );
};

export default Welcome;
