import { access, constants, rm, stat } from 'fs/promises';

export const deleteFile = async (path: string) => {
  try {
    await rm(path);
  } catch {
    console.log('FS operation failed');
  }
};

export const fileExists = async (path: string) => {
  try {
    await access(path, constants.F_OK);
  } catch {
    return false;
  }
  return true;
}

export const getFileSize = async (path: string) => {
  try {
    const stats = await stat(path);
    return stats.size;
  } catch {
    console.log('FS operation failed');
  }
}
