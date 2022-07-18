
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const url = "https://www.inc.com/lolly-daskal/100-motivational-quotes-that-will-inspire-you-to-succeed.html";

async function scrapeData(){
    try {
        const { data } = await axios.get(url);
        
        const $ = cheerio.load(data);
        const listItems = $(".standardText");
        console.log(listItems.length)
        const quoteDetails = [];
        listItems.each((idx,ele)=>{
           
            const eachQuotes = { quote:"" };
            // console.log($(ele).children('p').text())
             eachQuotes.quote =  $(ele).children('p').text();
             quoteDetails.push(eachQuotes);
             
        })
        console.dir(quoteDetails);
        // const quoteDetails = [];
        // listItems.map((idx, el) => {
        //     const eachQuotes = {quote:"" };

        //     // eachQuotes.authoImg =  $(el).children('a').find('img').attr('src');
        //     // eachQuotes.quote = $(el).text();
        //     console.log("Test",$(el).children('a').attr('src'));
        //     // quoteDetails.push(eachQuotes)
            
        //     // country.content = $(el).children('.quoteText').text();
        //     // console.log(country.content)

        //     // var text = test.text();
        //     // console.log(country)
        //     // Populate countries array with country data
        //     // countries.push(quoteDetails);
        //   });
         
    } catch{


    }
}
// Invoke the above function
scrapeData();