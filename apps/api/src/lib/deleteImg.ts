import fs from 'fs';
import path from 'path';

export const deleteImg = async (imageUrl: string) => {
  try {
    const imagePath = path.join(__dirname, `../../public${imageUrl}`);
    fs.unlinkSync(imagePath);
  } catch (error) {
    return error;
  }
};
