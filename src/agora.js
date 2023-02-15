import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "daa3b7a75da543b198451b18d4730a97";
const token =
  "007eJxTYLjJf+y9C5tt27RF023SBHJO71xw0+B1/AeFe7ubGBfZL/iswJCSmGicZJ5obpqSaGpinGRoaWFiaphkaJFiYm5skGhpPoP1bXJDICMDv9A1ZkYGCATxWRhyEzPzGBgAisAfsw==";

export const config = {
  mode: "rtc",
  codec: "vp8",
  appId: appId,
  token: token,
};

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
