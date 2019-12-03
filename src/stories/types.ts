import { MEDIA_STREAM_TYPES } from '../';
import { IPlayerConfig } from '../core/config';

export type StoryProps = IPlayerConfig &
  Partial<{
    videoType: MEDIA_STREAM_TYPES;
    color: string;
    progressBarMode: string;
  }>;
