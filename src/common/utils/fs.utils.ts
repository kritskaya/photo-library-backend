import { rm } from 'fs/promises';

export const deleteFile = async (path: string) => {
  try {
    await rm(path);
  } catch {
    throw new Error('FS operation failed');
  }
};
