import fs from 'fs';

export const db = {
  async readData(filePath) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  },

  async writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
};