import express from 'express';
const app = express();
import { readFileSync } from 'fs';
const PORT = 8080;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const countryCityList=[];
const data = JSON.parse(readFileSync('C://Users//Fine Computers 62//Downloads//countries.json', 'utf8'));
for(const country in data){
    if(data.hasOwnProperty(country)){
        const cities=data[country];
        const citi_country=cities.map(city => `${city}, ${country}`);
        countryCityList.push(...citi_country);
    }
}
app.get('/cities', (req, res) => {
    res.json(countryCityList);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});