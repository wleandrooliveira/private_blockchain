const level = require('level');
const chainDB = './chaindata';

class DataStorage {
  // Declaring the class constructor
  constructor(){
      this.db = level(chainDB);
  }

  addBlockToDATA(key, value) {
      let self = this;
      return new Promise((resolve, reject) => {
        self.db.put(key, value, (error) => {
          if (error) {
            reject(error)
          }

          console.log(`Added block #${key}`)
          resolve(`Added block #${key}`)
        })
      })
    }

    getBlockFromDATA(key) {
      let self = this;
      return new Promise((resolve, reject) => {
        self.db.get(key, (error, value) => {
          if (error) {
            reject(error)
          }

          resolve(value)
        })
      })
    }

    getBlockHeightFromDATA() {
      let self = this;
      return new Promise((resolve, reject) => {
        let height = -1;

        self.db.createReadStream().on('data', (data) => {
          height++
        }).on('error', (error) => {
          reject(error)
        }).on('close', () => {
          resolve(height)
        })
      })
    }
}

module.exports = DataStorage;