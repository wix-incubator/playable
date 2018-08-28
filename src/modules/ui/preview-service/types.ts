interface IFramesData {
  framesCount: number;
  qualities: IFramesQuality[];
}

interface IFramesQuality {
  spriteNameMask: string;
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
  heigh: number;
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

export {
  IPreviewService,
  IFramesData,
  IFramesQuality,
  INormalizedFramesQuality,
};
