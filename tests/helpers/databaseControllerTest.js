const db = require('../../database/config');

const vehicleType = []

class Database {

    constructor() {
        vehicleType.push({
            type_name: 'MOTO',
            maximum_capacity: 5,
            current_capacity: 0
        })
        vehicleType.push({
            type_name: 'CARRO',
            maximum_capacity: 3,
            current_capacity: 0
        })
    }

    async deleteCollection(collectionPath) {
        const collectionRef = db.collection(collectionPath)
        const query = collectionRef
        
        return new Promise((resolve, reject) => {
            this.deleteQueryBatch(query, resolve).catch(reject);
        });
    }
      
    async deleteQueryBatch(query, resolve) {
        const snapshot = await query.get();
      
        const batchSize = snapshot.size;
        if (batchSize === 0) {
          // When there are no documents left, we are done
          resolve();
          return;
        }
      
        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      
        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          this.deleteQueryBatch(query, resolve);
        });
    }

    async createCollection(collectionPath) {
        const collectionRef = db.collection(collectionPath)

        for (let i = 0; i < vehicleType.length; i++) {
            const element = vehicleType[i];
            await collectionRef.add(element)
        }
        
    }

}

module.exports = Database;