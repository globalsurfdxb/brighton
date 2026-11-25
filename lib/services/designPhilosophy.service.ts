import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import DesignPhilosophy from "@/app/models/DesignPhilosophy";
import type { DesignPhilosophyDoc } from "@/app/types/designPhilosophy";

export const getDesignPhilosophyPage = unstable_cache(
  async (): Promise<DesignPhilosophyDoc | null> => {
    await connectDB();
    const doc = await DesignPhilosophy.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as DesignPhilosophyDoc) : null;
  },
  ["design-philosophy-page"],
  { tags: ["DesignPhilosophy"], revalidate: 3600 },
);
