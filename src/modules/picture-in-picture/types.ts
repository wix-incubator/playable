interface IPictureInPicture {
  enterPictureInPicture(): void;
  exitPictureInPicture(): void;
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

export { IPictureInPicture, IPictureInPictureHelper };
