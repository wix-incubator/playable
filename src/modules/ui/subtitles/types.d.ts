declare namespace Playable {
  interface IPlayer {
    setSubtitles?(
      subtitles: string | ISubtitleConfig | Array<ISubtitleConfig>,
    ): void;
    setActiveSubtitle?(index: number): void;
  }

  export interface ISubtitleConfig {
    src: string;
    lang?: string;
    label?: string;
  }

  export type ISubtitlesViewStyles = {
    container: string;
    subtitlesContainer: string;
    subtitle: string;
    controlsShown: string;
    hidden: string;
  };

  export interface ISubtitles {
    setSubtitles(
      subtitles: string | ISubtitleConfig | Array<ISubtitleConfig>,
    ): void;

    setActiveSubtitle(index: number): void;

    showSubtitles(): void;
    hideSubtitles(): void;
    removeSubtitles(): void;

    destroy(): void;
  }
}
