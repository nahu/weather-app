import { Toast } from 'native-base';

const makeToast = (config) => {
  Toast.show({
    duration: 6000,
    type: 'default',
    position: 'top',
    textStyle: {
      textAlign: 'center',
    },
    style: {
      marginTop: 20,
    },
    ...config,
  });
};

export default {
  success: (text, config) =>
    makeToast({
      text,
      type: 'success',
      ...config,
    }),
  danger: (text, config) =>
    makeToast({
      text,
      type: 'danger',
      ...config,
    }),
  default: (text, config) =>
    makeToast({
      text,
      type: 'default',
      ...config,
    }),
  warning: (text, config) =>
    makeToast({
      text,
      type: 'warning',
      ...config,
    }),
};
