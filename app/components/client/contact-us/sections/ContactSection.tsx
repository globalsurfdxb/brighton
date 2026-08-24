import { contactData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="w-full top-spacing pb-100">
      <div className="container">
        <AnimatedTitle
          text={contactData.title}
          className="hero-title mb-5 md:mb-100"
        />

        {/* Row 2 - address/phone/email + description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[1fr_895px] gap-30 lg:gap-0 mb-50">
          <div className="flex flex-col gap-3 md:gap-7.5">
            <p
              className="text-description-4 text-description-color"
              dangerouslySetInnerHTML={{ __html: contactData.address }}
            />
            <div className="text-description-4 text-primary">
              <p>Phone: {contactData.phone}</p>
              <p>Email: {contactData.email}</p>
            </div>
          </div>

          <p className="text-subtitle text-description-color max-w-[47ch] xl:mr-60 min-[1900px]:mr-[154px]">
            {contactData.description}
          </p>
        </div>

        {/* Row 3 - map + form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[1fr_895px] items-end gap-100 lg:gap-0">
          <div className="w-full min-h-[280px] lg:w-[80%] aspect-[741/466] 3xl:w-[741px] rounded-[10px] overflow-hidden">
            <iframe
              src={contactData.mapLink}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
