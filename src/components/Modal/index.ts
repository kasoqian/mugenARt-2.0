import React from 'react';

import Dialog from './Dialog';

import render from './render';

export const dialog = (params: {
  component: React.FunctionComponent<any>;
  props?: any;
}) => {
  const { component, props } = params;
  const RelComponent = React.createElement(Dialog, { component, props }, null);
  render(RelComponent);
};

export default {
  dialog,
};
