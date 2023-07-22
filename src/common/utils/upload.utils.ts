import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const getUniqueFileName = (originalName: string) => {
  const uniquePart = uuidv4();
  const ext = extname(originalName);
  return `${uniquePart}${ext}`;
};

export const getFileNameWithId = (originalName: string, id: number) => {
  return `${id}-${originalName}`;
};
