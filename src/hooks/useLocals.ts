import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

function useLocals(isDialog?: boolean): any {
  const intl = useIntl();

  if (isDialog) {
    return function (name: string): string {
      const result = intl.formatMessage({
        id: name,
      });

      return result;
    };
  }

  const localText = intl.messages;
  const { language } = useModel('language', (model) => ({
    language: model.language,
  }));

  return { localText, language };
}

export default useLocals;
