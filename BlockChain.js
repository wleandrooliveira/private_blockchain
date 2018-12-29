/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const Block = require('./Block');
const datastorage = require('./DataStorage');


class BlockChain {
    constructor() {
      this.datastorage = new datastorage();
      this.getBlockHeight().then((height) => {
        if (height === -1) {
          this.addBlock(new Block("First block in the chain - Genesis block")).then(() => console.log("Genesis block added!"))
        }
      })
    }
    async addBlock(newBlock) {
      const height = parseInt(await this.getBlockHeight())
  
      newBlock.height = height + 1
      newBlock.time = new Date().getTime().toString().slice(0, -3)
  
      if (newBlock.height > 0) {
        const prevBlock = await this.getBlock(height)
        newBlock.previousBlockHash = prevBlock.hash
        console.log(`Previous hash: ${newBlock.previousBlockHash}`)
      }
  
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()
      console.log(`New hash: ${newBlock.hash}`)
      
      await this.datastorage.addBlockToDATA(newBlock.height, JSON.stringify(newBlock))
    }
    async getBlockHeight() {
      return await this.datastorage.getBlockHeightFromDATA()
    }
  
    async getBlock(blockHeight) {
      return JSON.parse(await this.datastorage.getBlockFromDATA(blockHeight))
    }
    async validateBlock(blockHeight) {
      let block = await this.getBlock(blockHeight);
      let blockHash = block.hash;
      block.hash = '';
      
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
  
      if (blockHash === validBlockHash) {
          return true;
        } else {
          console.log(`Block #${blockHeight} invalid hash: ${blockHash} <> ${validBlockHash}`);
          return false;
        }
    }

    async validateChain() {
      let errorLog = []
      let previousHash = ''
      let isValidBlock = false
  
      const heigh = await this.datastorage.getBlockHeightFromDATA()
  
      for (let i = 0; i < heigh; i++) {
        this.getBlock(i).then((block) => {
          isValidBlock = this.validateBlock(block.height)
  
          if (!isValidBlock) {
            errorLog.push(i)
          } 
  
          if (block.previousBlockHash !== previousHash) {
            errorLog.push(i)
          }
  
          previousHash = block.hash
  
          if (i === (heigh -1)) {
            if (errorLog.length > 0) {
              console.log(`Block errors = ${errorLog.length}`)
              console.log(`Blocks: ${errorLog}`)
            } else {
              console.log('No errors detected')
            }
          }
        })
      }
    }
  }

module.exports = BlockChain;
