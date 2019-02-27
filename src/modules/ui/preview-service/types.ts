interface IFramesData {
  framesCount: number;
  qualities: IFramesQuality[];
}

interface IFramesQuality {
  spriteUrlMask: string;
  frameSize: IFrameSize;
  framesInSprite: IMaxFramesInSprite;
}

interface IMaxFramesInSprite {
  vert: number;
  horz: number;
}

interface IFramePositionInSprite {
  vert: number;
  horz: number;
}

interface ITotalFramesInSprite {
  vert: number;
  horz: number;
}

interface IFrameSize {
  width: number;
  height: number;
}

interface INormalizedFramesQuality {
  spriteUrl: string;
  framePositionInSprite: IFramePositionInSprite;
  frameSize: IFrameSize;
  framesInSprite: ITotalFramesInSprite;
}

interface IPreviewService {
  setFramesMap(map: IFramesData): void;
  getAt(second: number): INormalizedFramesQuality[];

  destroy(): void;
}

interface IPreviewAPI {
  setFramesMap?(map: IFramesData): void;
}

export {
  IPreviewAPI,
  IPreviewService,
  IFramesData,
  IFramesQuality,
  INormalizedFramesQuality,
};
