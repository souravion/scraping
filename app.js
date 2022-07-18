
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const url = "https://www.goodreads.com/quotes/tag/faith?page=2";

async function scrapeData(){
    try {
        const { data } = await axios.get(url,{xmlMode: true});
        const $ = cheerio.load(data);
        const listItems = $(".quoteDetails");
        const quoteDetails = [];

        listItems.each((idx, el) => {
            const eachQuotes = { authoName: "", authoImg: "", quote:"" };
           
            const authorQuote = $(el).children('.quoteText').html().replace(/<script.*>.*<\/script>/ims, " "); // we remove the script tag from string
            const authorQuoteText = $(authorQuote).text().replace(/(\r\n|\n|\r)/gm, "").trim()// we remove the new line from string
            if(authorQuoteText.length <=200){
                eachQuotes.authoImg =  $(el).children('a').find('img').attr('src');
                const authoNameText = $(el).children('.quoteText').find('span').text().replace(/(\r\n|\n|\r)/gm, "").trim();// we replace the new like 
                eachQuotes.authoName = authoNameText.replace(/  +/g, ' ') //
                eachQuotes.quote = authorQuoteText.replace(/  +/g, ' ') // replace multiple space with sinlge space
                quoteDetails.push(eachQuotes)
            }
          });
    fs.appendFile("sanjib.json", JSON.stringify(quoteDetails, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data to file");
    });

    } catch{


    }
}
// Invoke the above function
scrapeData();