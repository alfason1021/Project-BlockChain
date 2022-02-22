const hexToBinary = require('hex-to-binary');
const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const { cryptoHash }  = require('../util');

// set up an overall test using the keyword describe; with arguments Block and a callback function
describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash'; 
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    difficulty = 1;
    const block = new Block ({timestamp, lastHash, hash, data, nonce, difficulty});

    // write our first test using the it function
    it('has a timestamp, lastHash, hash, and a data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    // TEST FOR GENESIS BLOCK
    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        console.log('genesisBlock', genesisBlock);

        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    // TEST FOR MINE BLOCK
    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({lastBlock, data});

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets the `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        // hash when new block is mined.
        it('creates a SHA-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash).toEqual(
                cryptoHash(
                    minedBlock.timestamp,
                    minedBlock.nonce,
                    minedBlock.difficulty,
                    lastBlock.hash,
                    data));
        });

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
            ).toEqual('0'.repeat(minedBlock.difficulty)
            );
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1];
            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty+1);
        });

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100})).toEqual(block.difficulty-1);
        });

        it('has a lower limit of 1', () => {
            block.difficulty = 0;

            expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
        });
    });
});