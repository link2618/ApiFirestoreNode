const db = require('../../database/config');
const retornarDatos = require('../../helpers/retornar-datos');

const vehicleType = []
const vehicleParking = []

const vehicleTypeRef = db.collection('vehicleType')

class Database {

    constructor() {
        vehicleType.push({
            type_name: 'MOTO',
            maximum_capacity: 5,
            current_capacity: 1
        })
        vehicleType.push({
            type_name: 'CARRO',
            maximum_capacity: 3,
            current_capacity: 3
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

        let data

        switch (collectionPath) {
            case 'vehicleType':
                data = vehicleType
                break;

            case 'vehicleParking':
                const snapType = await vehicleTypeRef.get()
                const types = await retornarDatos(snapType)

                const car = types.filter( item => item.type_name == 'CARRO')
                const mot = types.filter( item => item.type_name == 'MOTO')

                vehicleParking.push({
                    plates_vehicle: "wp58d6q",
                    doc_owner: "12345498798456",
                    name_owner: "Dueño 1",
                    type_vehicle: "CARRO",
                    initial_date: "15-6-2021 00:00:00",
                    id_type_vehicle: car[0].id
                })
                vehicleParking.push({
                    plates_vehicle: "85aw45w",
                    doc_owner: "369852147",
                    name_owner: "Dueño 2",
                    type_vehicle: "CARRO",
                    initial_date: "1-6-2021 00:00:00",
                    id_type_vehicle: car[0].id
                })
                vehicleParking.push({
                    plates_vehicle: "q6w8a52",
                    doc_owner: "852147963",
                    name_owner: "Dueño 3",
                    type_vehicle: "CARRO",
                    initial_date: "18-6-2021 00:00:00",
                    id_type_vehicle: car[0].id
                })
                vehicleParking.push({
                    plates_vehicle: "s5e8d4v",
                    doc_owner: "321654987",
                    name_owner: "Dueño 4",
                    type_vehicle: "MOTO",
                    initial_date: "16-6-2021 00:00:00",
                    id_type_vehicle: mot[0].id
                })

                data = vehicleParking
                break;
        
            default:
                break;
        }

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            await collectionRef.add(element)
        }
        
    }

}

module.exports = Database;