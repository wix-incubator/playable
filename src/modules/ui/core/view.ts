import Stylable from './stylable';

class View<TStyles = Playable.IStyles> extends Stylable<TStyles>
  implements Playable.IView<TStyles> {}

export default View;
