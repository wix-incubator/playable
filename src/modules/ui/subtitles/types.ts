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

export { ISubtitleConfig, ISubtitlesViewStyles };
