export const formatToIndonesianRupiah =
  (number: any, type: 'full' | 'simple' = 'full') => {
    let scale = '';
    let scaledNumber = number;

    if (number >= 1e12) {
      scale = type === 'full' ? 'Triliun' : 'T';
      scaledNumber = number / 1e12;
    } else if (number >= 1e9) {
      scale = type === 'full' ? 'Miliar' : 'M';
      scaledNumber = number / 1e9;
    } else if (number >= 1e6) {
      scale = type === 'full' ? 'Juta' : 'J';
      scaledNumber = number / 1e6;
    }

    scaledNumber = Math.round(scaledNumber);

    return scaledNumber + ' ' + scale;
  };
