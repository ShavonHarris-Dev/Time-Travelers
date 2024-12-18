// start with a class, a blueprint for the object
//IndexedDB is useful for web appls that need to store data locally
// defining a class property will contain functions and logic related to database
class JournalDB{
    // constructor is a special method that is called when the object is created. Like an initializer 
    constructor(){
        // name of database
        this.dbName = 'explorersTimeMachine';   
        // version number of database
        this.dbVersion = 1;
        // initially set to null holds the connection to your database
        this.db = null;
    }

    // thus function is marked as async because it works with promises. Promises allow JS to handle tasks that take time
    async init(){
        // use a promise because opening a database is an async operation (takes time)
        // resolve' if everything works fine, yay!
        // reject if some problem, report it.
        return new Promise((resolve, reject) => {
            // built in function that creates or opens a database
            // takes 2 arguments; name of the database and the version number
            const request = indexedDB.open(this.dbName, this.dbVersion);

            // if something goes wrong when opening the database, we call reject and show the error
            request.onerror = () => {
                reject(`Database error: ${request.error}`);
            };

            //if the database is opened we save a reference to the database and call resolve
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            // runs only if the database is being created for the first time or the version number is increased
               //We get a reference to the database object using event.target.result.
            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // create a new object store; like a table in a database where we save our data
                const entriesStore = db.createObjectStore('entries', {
                    keyPath: 'id',
                    autoIncrement: true
                });

                // indexes to make it faster to search through the data
                // search by timestamp, location and unique:false means that there can be multiple entries with the same timestamp or location
                entriesStore.createIndex('timestamp', 'timestamp', {unique: false});
                entriesStore.createIndex('location', 'location', {unique: false});
            }

        })
    }

    // function to add an entry to the database
    // async function it interacts with the IndexedDB (which takes time)
    // accepts an argument, entry. this is the data you want to add to the database
    //ex: {content: 'Hello World', location: 'Paris'}
    async addEntry(entry){
        // this starts a transaction with the database. Lets you group operations together like reading or writing data
        // [entries] specifies that the transaction will be working with the 'entries' object store
        // 'readwrite' means that the transaction will be able to read and write data
        const transaction = this.db.transaction(['entries'], 'readwrite');

        // once the transaction is started you access the object store you want to work with
        // here entries is the name of the object stor, created earlier in init
        const store = transaction.objectStore('entries');

        return new Promise((resolve, reject) => {
            // this function adds a new object to the entries object store
            const request = store.add({
                // the object being added has three properties
                // content is the text or data you want to save, like a journal note.
                content: entry.content,
                // automatically set to the current date and time
                timestamp: new Date().toISOString(),
                // location where no was created. If no location, null
                location: entry.location || null
            });
            // if add operation succeed we call resolve with request.result
            request.onsuccess = () => resolve(request.result);
            // if add operation fails we call reject with request.error
            request.onerror = () => reject(request.error)
        })
    }

    // function to get all entries from the database
    // async because it takes time to interact with database and get all entries
    //fetch all entries and return them as a result
    async getAllEntries(){
        const transaction = this .db.transaction(['entries'], 'readonly');
        // creates a transaction for interacting with database
        // [entries] specifies which object store the transaction will involve, just the entries object store
        // 'readonly' means that the transaction will only be able to read data

        const store = transaction.objectStore('entries');
        // get access to the entries object store

        const request = store.getAll();
        // retrieves all the data in the entries object store
        // if no data, returns an empty array

        return new Promise((resolve, reject)=> {
            //This event triggers when the getAll() operation successfully retrieves the data.
            //request.result: Contains the array of all entries from the object store.
            //We call resolve(request.result) to pass the data back to the caller
            request.onsuccess = () => resolve(request.result);
            //This event triggers if something goes wrong during the operation.
            //We call reject(request.error) to report the error to the caller.
            request.onerror = () => reject(request.error);
        })
    }

}





