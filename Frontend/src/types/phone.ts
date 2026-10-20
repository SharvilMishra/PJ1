import type { PreferenceCategory } from "../auth/UserPreferencesProvider";

export interface Phone {
  id: string;
  brand: string;
  model: string;
  name: string;
  rating: number | null;
  price: number | null;
  categories: PreferenceCategory[];
  cameraMainMp: number | null;
  displayType: string | null;
  ramGb: number | null;
  storageGb: number | null;
  batteryMah: number | null;
  displaySizeIn: number | null;
  weightG: number | null;
  processor: string | null;
  os: string | null;
  imageUrl: string | null;
}
