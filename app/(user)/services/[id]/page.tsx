import Index from "@/app/components/client/service";
import IndexV2 from "@/app/components/client/service/IndexV2";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return id === "bespoke-and-custom-solutions" ? <Index /> : <IndexV2 />;
};

export default Page;
