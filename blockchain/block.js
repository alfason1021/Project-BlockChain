const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const { cryptoHash } = require('../util');


class Block {

    // every class has a constructor methods and the arguments listed in the brackets
    // the arguments are the unique values of the block
    constructor ({timestamp, lastHash, hash, data, nonce, difficulty}) {
        // this is use to create instance property of the class. It refers to any individaul instance of the class when there's an interaction
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis() {
        return new Block(GENESIS_DATA);
    }

    static mineBlock({lastBlock, data}) {
        // const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let  { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({timestamp, lastHash, data, difficulty, nonce, hash});
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
    }
}

// This allows the file shareable with other files.
module.exports = Block;

// create a new instance, assign it to a variable
// const block1 = new Block({
//     timestamp: '01/01/01', 
//     lastHash: 'foo-lastHash', 
//     hash: 'foo-hash', 
//     data: 'foo-data'});

// console.log('block1', block1);
