import { createRef, Component } from 'react';
import ReactDOM from 'react-dom';

interface IProps {
  component: any;
  props: any;
}
export default class Modal extends Component<IProps, {}> {
  rootRef: any;

  constructor(props: IProps | Readonly<IProps>) {
    super(props);
    this.rootRef = createRef();
  }

  _close() {
    const currentEle = this.rootRef.current;
    const divParent = currentEle.parentNode;
    if (divParent.parentNode && divParent) {
      ReactDOM.unmountComponentAtNode(divParent);
      divParent.parentNode.removeChild(divParent);
    }
  }
}
