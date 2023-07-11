import { access, constants, rm } from 'fs/promises';

export const deleteFile = async (path: string) => {
  try {
    await rm(path);
  } catch {
    throw new Error('FS operation failed');
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
