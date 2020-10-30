import moment from 'moment';

export const formatApiDate = (value) => {
  if (!value) {
    return '-';
  }
  return moment(value, 'YYYY-MM-DD').format('ddd DD MMMM');
};

export const formatDate = (value) => {
  if (!value) {
    return '-';
  }
  return moment(value).format('MM/DD/YYYY');
};

export const formatToApiDate = (value) => {
  if (!value) {
    return '-';
  }
  return moment(value).format('YYYY-MM-DD');
};

export const formatNumber = (rawValue) => {
  return rawValue.toFixed(0);
};
