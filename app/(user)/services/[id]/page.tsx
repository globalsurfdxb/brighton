import Index from "@/app/components/client/service";
import IndexV2 from "@/app/components/client/service/IndexV2";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  return slug === "bespoke-and-custom-solutions" ? <Index /> : <IndexV2 />;
};

export default Page;
