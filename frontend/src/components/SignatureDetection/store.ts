import create, { State } from "zustand";

export interface Region {
  id: number;
  signed: boolean;
  box: [number, number, number, number];
}

export interface DetectionResult {
  image_size: [number, number];
  regions: Region[];
}

export interface SignatureDetectionState extends State {
  imageFile: File | null;
  isDetecting: boolean;
  detectionResult: DetectionResult | null;
  selectedRegion: Region | null;
  isCanvasOpen: boolean;
  setImageFile: (file: File | null) => void;
  setIsDetecting: (isDetecting: boolean) => void;
  setDetectionResult: (detectionResult: DetectionResult | null) => void;
  setSelectedRegion: (selectedRegion: Region | null) => void;
  setIsCanvasOpen: (isCanvasOpen: boolean) => void;
  removeRegion: (selectedRegion: Region) => void;
}

const useSignatureDetectionStore = create<SignatureDetectionState>((set) => ({
  imageFile: null,
  isDetecting: false,
  detectionResult: null,
  selectedRegion: null,
  isCanvasOpen: false,
  setImageFile: (imageFile: File | null) => set({ imageFile }),
  setIsDetecting: (isDetecting: boolean) => set({ isDetecting }),
  setDetectionResult: (detectionResult: DetectionResult | null) =>
    set({ detectionResult }),
  setSelectedRegion: (selectedRegion: Region | null) => set({ selectedRegion }),
  setIsCanvasOpen: (isCanvasOpen: boolean) => set({ isCanvasOpen }),
  removeRegion: (removedRegion: Region) =>
    set((state) => {
      if (state.detectionResult) {
        const newRegions = state.detectionResult.regions.filter(
          (region) => region.id !== removedRegion.id
        );
        state.detectionResult = {
          ...state.detectionResult,
          regions: newRegions,
        };
      }
    }),
}));

export default useSignatureDetectionStore;
