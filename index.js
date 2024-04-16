import express from "express"
import bodyParser from "body-parser";
import axios from "axios"
const app = express();
const port = process.env.PORT || 3000;
const URL = "https://api.potterdb.com"

app.use(express.static('public'))

async function fetchAllSpells(numPages) {

    let promises = [];

    for (let page = 1; page <= numPages; page++) {
        promises.push(axios.get(`https://api.potterdb.com/v1/spells?page[number]=${page}`))
    }

    try {
        const results = await Promise.all(promises.map(p => p.catch(e => e)))    
        let allSpells = results.filter(result => !(result instanceof Error)).flatMap(result=> result.data.data )
        return allSpells;
    } catch (error) {
        console.error("Error fetching spells", error)
        return [];
    }
}

function getRandomSpell(max) {
    return Math.floor(Math.random() * max)
}

app.get("/", async (req, res) => {
    try {
        let response = await axios.get(`${URL}/v1/spells`)
        const numPages = response.data.meta.pagination.last;
        const spells = await fetchAllSpells(numPages);

        if (spells.length > 0) {
            const numSpells = spells.length;
            const spell = spells[getRandomSpell(numSpells)];
            const spellData = spell.attributes;
            console.log(spellData)

            res.render("index.ejs", {spellName: spellData.name, image: spellData.image, incantation: spellData.incantation, spellEffect: spellData.effect, category: spellData.category, color: spellData.light})
        } else {
            res.status(500).send("Failed to fetch spells.")
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error fetching spells")
    }
})

app.listen(port, () => { 
    console.log(`Server started on port ${port}`)
})