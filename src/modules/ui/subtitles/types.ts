interface ISubtitleConfig {
  src: string;
  lang?: string;
  label?: string;
}

type ISubtitlesViewStyles = {
  container: string;
  subtitlesContainer: string;
  subtitle: string;
  controlsShown: string;
  hidden: string;
};

interface ISubtitles {
  setSubtitles(
    subtitles: string | ISubtitleConfig | Array<ISubtitleConfig>,
  ): void;

  setActiveSubtitle(index: number): void;

  showSubtitles(): void;
  hideSubtitles(): void;
  removeSubtitles(): void;

  destroy(): void;
}

export { ISubtitles, ISubtitleConfig, ISubtitlesViewStyles };
