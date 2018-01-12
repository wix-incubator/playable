import Stylable from './stylable';
import { IView, IStyles } from './types';

class View<TStyles = IStyles> extends Stylable<TStyles>
  implements IView<TStyles> {}

export default View;
