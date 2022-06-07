export const formatDate = (value: string): string => {
  const values = value.split('/').map((val) => parseInt(val));

  const date = new Date(values[2], values[1], values[0]);

  const dateToString = date
    .toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .replace(',', '');

  return dateToString;
};
