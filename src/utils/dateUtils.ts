export function formatToReadableDate(isoDateString: string) {
  const date = createdDateStringToDate(isoDateString);
  const readableDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readableTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return `${readableDate} ${readableTime}`;
}

export function formatToGraphDate(date: Date) {
  const graphDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }); 

  return graphDate;
}

export function parseGraphDate(graphDate: string) {
  return new Date(`${graphDate}, ${new Date().getFullYear()}`).getTime();
}

export function isCreateDateToday(created: string) {
  return new Date().toLocaleDateString() === createdDateStringToDate(created).toLocaleDateString();
}

export function createdDateStringToDate(created: string) {
  return new Date(`${created.replace(' ', 'T')}Z`);
}

export function formatDateForDatabase(localeDate: Date) {
  const formattedDate = localeDate.toISOString().replace('T', ' ');
  return formattedDate.substring(0, formattedDate.indexOf('.'));
}