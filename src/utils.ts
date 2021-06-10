export const curencyFormat = (value: number, prefix = 'Rp. ') => {
  var newValue = '';
  var formatValue = value.toString().split('').reverse().join('');
  for (var i = 0; i < formatValue.length; i++) {
    if (i % 3 === 0) {
      newValue += formatValue.substr(i, 3) + '.';
    }
  }
  return (
    prefix +
    newValue
      .split('', newValue.length - 1)
      .reverse()
      .join('')
  );
};

export const formatStrDate = (strDate: string | undefined) => {
  return strDate;
};
