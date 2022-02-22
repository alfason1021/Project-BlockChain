const Transaction = require('../wallet/transaction');

class TransactionMiner {
    constructor({ blockchain, transactionPool, wallet, pubsub }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;

    }
    
    mineTtansactions() {
        // get the transaction pool's valid transactions
        const validTransactions = this.transactionPool.validTransaction();

        // generate the miner's reward
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );

        // add a block consisting of this transaction to the blockchain
        this.blockchain.addBlock({ data: validTransactions});

        // broadcast
        this.pubsub.broadcastChain();

        // clear the transaction pool
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;