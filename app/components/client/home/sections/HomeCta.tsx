export default function HomeCta() {
  return (
    <section className="bg-primary py-100 3xl:min-h-[330px]">
      <div className="container">
        <div className="flex flex-row items-center justify-between max-w-[92%] 3xl:max-w-[75.13%]">
          <div className="flex flex-col gap-30">
            <h2 className="section-title text-white">Let's Talk Lighting</h2>
            <p className="text-description text-secondary">
              Discuss your project, technical requirements, or product selection
              with our specialists.
            </p>
          </div>

          <div className="mb-2">
            <button className="max-h-[80px] rounded-[50px] border border-secondary px-12.5 py-[29px] transition-colors duration-500 hover:bg-white group w-full">
              <span className="text-subtitle !leading-none text-white max-h-[21px] group-hover:text-primary">Connect With Us</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
