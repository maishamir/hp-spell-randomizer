import express from "express"
import bodyParser from "body-parser";
import axios from "axios"
const app = express();
const port = 3000;
const URL = "https://api.potterdb.com"

async function fetchAllSpells(numPages) {

    let promises = [];

    for (let page = 1; page <= numPages; page++) {
        promises.push(axios.get(`http://api.potterdb.com/v1/spells?page[number]=${page}`))
    }

    try {
        const results = await Promise.all(promises.map(p => p.catch(e => e)))    
        let allSpells = results.filter(result => !(result instanceof Error)).flatMap(result=> result )
        return allSpells;
    } catch (error) {
        console.error("Error fetching spells", error)
    }
}

function getRandomSpell(max) {
    return Math.floor(Math.random() * max)
}

app.get("/", async(req, res) => {
    let response = await axios.get(`${URL}/v1/spells`)
    const numPages = response.data.meta.pagination.last;
    const spells = await fetchAllSpells(numPages);
    const numSpells = spells.length;

    const spell = spells[getRandomSpell(numSpells)];
    const spellData = spell.attributes;
    res.render("index.ejs", {spellName: spellData.name, image: spellData.image, incantation: spellData.incantation, spellEffect: spellData.effect, movement: spellData.hand})

})

app.listen(port, () => { 
    console.log(`Server started on port ${port}`)
})