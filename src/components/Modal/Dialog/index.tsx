import React from 'react';
import Modal from '../Modal';
import { IntlProvider } from 'umi';

import usConfig from '@/locales/en-US';
import jaConfig from '@/locales/ja-JP';

const messages = {
  'en-US': usConfig,
  'ja-JP': jaConfig,
};

import './index.less';

export default class Dialog extends Modal {
  state: {
    locale: keyof typeof messages;
  } = {
    locale: 'en-US',
  };
  closeDialog = () => {
    this._close();
  };

  componentDidMount() {
    const language =
      localStorage.getItem('MUGEN_LANGUAGE') || navigator.language || 'en-US';
    this.setState({
      locale: language,
    });
  }

  render() {
    const { component: Component, props } = this.props;
    return (
      <IntlProvider
        locale={this.state.locale}
        key={this.state.locale}
        messages={messages[this.state.locale]}
      >
        <div
          className="modal_dialog-wrap"
          ref={this.rootRef}
          onClick={() => this.closeDialog()}
        >
          <div className="modal_dialog-wrap_content">
            <Component {...props} close={this.closeDialog} />
          </div>
        </div>
      </IntlProvider>
    );
  }
}
