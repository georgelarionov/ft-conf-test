import { Dispatch, SetStateAction } from 'react';
import _get from 'lodash/get';
import _set from 'lodash/set';

export const toggleOpen =
  (setState: Dispatch<SetStateAction<any>>, key: string, value?: boolean) =>
  () =>
    setState(prev => ({
      ...prev,
      [key]: value === undefined ? !prev[key] : value,
    }));

export const inputOnChange =
  (setState: (d: any) => void, nestedKey?: string, requireValue?: any) =>
  (e: any) => {
    const { value, name, checked, type } = _get(e, 'target', {});
    let actualValue = value;
    if (type === 'checkbox') {
      actualValue = checked;
    }
    if (requireValue) {
      actualValue = requireValue;
    }

    return setState(prev => {
      if (!nestedKey) {
        return { ...prev, [name || 'value']: actualValue };
      }
      return _set(prev, nestedKey, actualValue);
    });
  };
