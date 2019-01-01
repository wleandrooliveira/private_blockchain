/* ===== Executable Test ==================================
|  Use this file to test induced errors in your project.
|  =========================================================*/

const BlockChain = require('./BlockChain.js');



let myBlockChain = new BlockChain();

setTimeout(function () {
	console.log("Waiting...")
}, 100);


async function induceInvalidHashLink(copyHeight, pasteHeight) {
	let block = await myBlockChain.getBlock(copyHeight);  // get block contents
	myBlockChain.datastorage.addBlockToDATA(parseInt(pasteHeight), JSON.stringify(block));  // put in different position
}

console.log(induceInvalidHashLink(1,3))