interface IPictureInPicture {
  enterPictureInPicture(): void;
  exitPictureInPicture(): void;
  disablePictureInPicture(): void;
  enablePictureInPicture(): void;
  isInPictureInPicture: boolean;
  isEnabled: boolean;
  destroy(): void;
}

interface IPictureInPictureHelper {
  isInPictureInPicture: boolean;
  isEnabled: boolean;
  request(): void;
  exit(): void;
  destroy(): void;
}

interface IPictureInPictureAPI {
  enterPictureInPicture?(): void;
  exitPictureInPicture?(): void;
  disablePictureInPicture?(): void;
  enablePictureInPicture?(): void;
  isInPictureInPicture?: boolean;
}

export { IPictureInPictureAPI, IPictureInPicture, IPictureInPictureHelper };
