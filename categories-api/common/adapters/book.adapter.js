export class BookAdapter {
    constructor() {
        this.apiUrl = 'https://api2.isbndb.com/book';
        this.apiKey = '45682_ced86c92d3888f2c148e449d1b42813e';
    }

    async get(parameters) {
        const url = `${this.apiUrl}/${parameters}`;
        const headers = {
            'Authorization': this.apiKey
        };
        console.log('url', url)
        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                return {}
            }
            const data = await response.json();
            // console.log('data', data)
            return data;
        } catch (error) {
            console.error('Failed to fetch book data:', error);
            throw error; // Re-throw the error for further handling
        }
    }
}
