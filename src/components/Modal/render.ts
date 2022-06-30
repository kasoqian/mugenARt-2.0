import ReactDom from 'react-dom';
import { ReactComponentElement } from 'react';

export default function (component: ReactComponentElement<any>) {
  setTimeout(() => {
    const divEle = document.createElement('div');
    document.body.appendChild(divEle);
    ReactDom.render(component, divEle);
  });
}
