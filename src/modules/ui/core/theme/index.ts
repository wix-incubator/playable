import { IThemeConfig, ICSSRules } from './types';
import transperentizeColor from './utils/transperentizeColor';
import ThemeService, {
  IThemeAPI,
  IThemeService,
  DEFAULT_THEME_CONFIG,
} from './theme-service';

export {
  IThemeAPI,
  transperentizeColor,
  DEFAULT_THEME_CONFIG,
  IThemeConfig,
  IThemeService,
  ICSSRules,
};

export default ThemeService;
