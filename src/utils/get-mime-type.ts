import { MimeToStreamTypeMap } from '../constants';

const getExtension = (url: string) => {
  if (url.lastIndexOf('.') === -1) {
    return null;
  }
  return url.split('.').pop();
};

const getMimeByType = (type: string | null) => {
  if (type === null) {
    return null;
  }

  const entry = Object.entries(MimeToStreamTypeMap).find(
    x => x[1] === type.toUpperCase(),
  );

  return Array.isArray(entry) ? entry[0] : null;
};

const getMimeByUrl = (url: string) => getMimeByType(getExtension(url));

export { getMimeByType, getMimeByUrl };
