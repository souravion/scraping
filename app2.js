
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const url = "https://www.oberlo.in/blog/motivational-quotes";

async function scrapeData(){
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $(".single-post ol li");
        const quoteDetails = [];
        listItems.map((idx, el) => {
            const eachQuotes = {quote:"" };

            // eachQuotes.authoImg =  $(el).children('a').find('img').attr('src');
            eachQuotes.quote = $(el).children('span').text().replace(/(\r\n|\n|\r)/gm, "").trim();
            
            quoteDetails.push(eachQuotes)
            
            // country.content = $(el).children('.quoteText').text();
            // console.log(country.content)

            // var text = test.text();
            // console.log(country)
            // Populate countries array with country data
            // countries.push(quoteDetails);
          });
          console.dir(quoteDetails);
    } catch{


    }
}
// Invoke the above function
scrapeData();