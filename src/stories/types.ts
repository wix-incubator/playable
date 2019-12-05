import { IPlayerInstance, MEDIA_STREAM_TYPES } from '../index';
import { IPlayerConfig } from '../core/config';

export type StoryProps = IPlayerConfig & {
  videoType: MEDIA_STREAM_TYPES;
  color: string;
  progressBarMode: string;
};

export interface StoryWindow extends Window {
  player: IPlayerInstance;
}
