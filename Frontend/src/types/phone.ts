export interface Phone {
  id: string;
  brand: string;
  model: string;
  price: number | null;
  category: string[];
  ramGb: number | null;
  storageGb: number | null;
  batteryMah: number | null;
  displaySizeIn: number | null;
  refreshRateHz: number | null;
  cameraMainMp: number | null;
  processor: string | null;
  os: string | null;
  imageUrl: string | null;
}
