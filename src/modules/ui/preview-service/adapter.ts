import { IFramesData, IFramesQuality, INormalizedFramesQuality } from './types';

function normalizeFramesQuality(
  framesCount: number,
  quality: IFramesQuality,
  neededFrame: number,
): INormalizedFramesQuality {
  const framesInSprite =
    quality.framesInSprite.vert * quality.framesInSprite.horz;
  const frameNumberInSprite = neededFrame % framesInSprite;
  const spriteNumber = Math.floor(neededFrame / framesInSprite);
  const horzPositionInSprite =
    frameNumberInSprite % quality.framesInSprite.horz;
  const vertPositionInSprite = Math.floor(
    frameNumberInSprite / quality.framesInSprite.vert,
  );

  const url = quality.spriteUrlMask.replace('%d', spriteNumber.toString());

  return {
    frameSize: quality.frameSize,
    framesInSprite:
      (spriteNumber + 1) * framesInSprite <= framesCount
        ? quality.framesInSprite
        : {
            horz: quality.framesInSprite.horz,
            vert: Math.ceil(
              (framesCount % framesInSprite) / quality.framesInSprite.vert,
            ),
          },
    framePositionInSprite: {
      vert: vertPositionInSprite,
      horz: horzPositionInSprite,
    },
    spriteUrl: url,
  };
}

function getAt(
  data: IFramesData,
  second: number,
  duration: number,
): INormalizedFramesQuality[] {
  const { framesCount } = data;
  const neededFrame = Math.floor((second * framesCount) / duration);
  return data.qualities.map(quality =>
    normalizeFramesQuality(framesCount, quality, neededFrame),
  );
}

export { getAt };
