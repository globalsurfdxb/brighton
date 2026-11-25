export interface RingItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export type LabToLaunchData = {
  title: string;
  items: RingItem[];
};

export type EngineeredSystemData = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
};

export type PerformanceSpecifyData = {
  title: string;
  items: { title: string; description: string; icon: string; iconAlt: string }[];
};

export type ScienceConsistencyData = {
  title: string;
  items: { title: string; description: string; image: string; imageAlt: string }[];
};
