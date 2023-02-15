import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "daa3b7a75da543b198451b18d4730a97";
const token =
  "007eJxTYPAv/nBgpzv/nTk9HuuPqZm8FmFSZ2y+/3ZDzhpvs9d/f3sqMKQkJhonmSeam6YkmpoYJxlaWpiYGiYZWqSYmBsbJFqaeyq8SW4IZGQ42PSOkZEBAkF8FobcxMw8BgYAlpcgkQ==";

export const config = {
  mode: "rtc",
  codec: "vp8",
  appId: appId,
  token: token,
};

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
