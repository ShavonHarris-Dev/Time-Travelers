class App {
    constructor() {
        // initialize any properties or methods here
        this.db = new JournalDB();
        this.form = document.getElementById('entry-form');
        this.entriesList = document.getElementById('entries-list');
    }

    async init(){
        // initialization logic
        try{
            await this.db.init();
            this.setupEventListeners();
            await this.loadEntries();
        } catch (error){
            console.error('Failed to initialize app:', error);
        }
    }

    setupEventListeners(){
        this.form.addEventListener('submit', async(e) =>{
            // handle form submission
            // e.preventDefault();
            const content = document.getElementById('entry-content').value;

            try {
                await this.db.addEntry({content});
                this.form.reset();
                await this.loadEntries();

            } catch(error){
                console.error('Failed to save entry:', error);
            }
            });
        }
    
        async loadEntries() {
            try {
                const entries = await this.db.getAllEntries();
                this.renderEntries(entries);
            } catch (error) {
                console.error('Failed to load entries:', error);
            }
        }
    
        renderEntries(entries) {
            this.entriesList.innerHTML = entries
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(entry => `
                    <article class="entry">
                        <p>${entry.content}</p>
                        <small>${new Date(entry.timestamp).toLocaleString()}</small>
                    </article>
                `)
                .join('');
        }
    }
console.log('Script loaded');
// initialize  the app
// waits for the HTML document to finish loading before starting the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    // creates a new instance of the App class
    const app = new App();
    // calls the init method to initialize the app and load entries
    app.init();
})