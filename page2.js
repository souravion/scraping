/*
css backgroud : #dfe6e9
font color : #00cec9
https://codepen.io/himais/pen/eYOzrzJ
https://codepen.io/_Sabine/pen/daNzdP
https://codepen.io/KY64/pen/jJdwBp
https://codepen.io/kira-code/pen/eYWPQwK
https://codepen.io/JavaScriptJunkie/pen/jvRGZy
https://codepen.io/alishahab/pen/ZGozqW
https://codepen.io/vivekiscoding/pen/mdejqee
*/

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk')

const url = 'https://www.goodreads.com/quotes/tag/love'
baseURL = 'https://www.goodreads.com'
const outputFile = 'love.json'
const parsedResults = []
let pageCounter = 0
const pageLimit = 100
const characterLength = 200;

console.log(chalk.yellow.bgBlue(`\n  Scraping of ${chalk.underline.bold(url)} initiated...\n`))

const getWebsiteContent = async (url) => {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const listItems = $(".quoteDetails");
    listItems.each((idx, el) => {
        const eachQuotes = { authoName: "", authoImg: "", quote:"", category_id:'', isFavorite :'', id:'' };
    
        const authorQuote = $(el).children('.quoteText').html().replace(/<script.*>.*<\/script>/ims, " "); // we remove the script tag from string
        const authorQuoteText = $(authorQuote).text().replace(/(\r\n|\n|\r)/gm, "").trim()// we remove the new line from string
        // starting point 
        // Question why we are doing like this because am getting a string 
        //like this “We accept the love we think we deserve.”    ―      Stephen Chbosky
        // but i need only We accept the love we think we deserve this text to scrap thats why appying below technique
        // here we replace to special character quote with normal quotes eg.“We accept the love we think we deserve.”
        // result - would be like this "We accept the love we think we deserve.”
        const replaceStartingQuotation = authorQuoteText.replace('“', '"')
        // here we replace to special character quote with normal quotes eg."We accept the love we think we deserve.”
        // result - would be like this "We accept the love we think we deserve."
        const replaceEndingQuotation = replaceStartingQuotation.replace('”', '"')
        // below we split the string to get text inside double quote eg ."We accept the love we think we deserve."
        // result weould be like this We accept the love we think we deserve.
        const finalAuthorQuoteText = replaceEndingQuotation.split('"')[1]
        // end point
        if(finalAuthorQuoteText.length <=characterLength){

            eachQuotes.authoImg =  $(el).children('a').find('img').attr('src');
            // we replace the new like 
            let authoNameText = $(el).children('.quoteText').find('span').text().replace(/(\r\n|\n|\r)/gm, "").trim();
             // we get the index of a string when comma is occur 
            const indexofString = authoNameText.indexOf(',')
            if(indexofString > -1){
              // grab substring before a specified character eg. Stephen Chbosky, The Perks of Being a Wallflower
              //Output would be like this  Stephen Chbosky
              authoNameText = authoNameText.substring(0, authoNameText.indexOf(','));
            }
            // replace multiple space with sinlge space
            eachQuotes.authoName = authoNameText.replace(/  +/g, ' ') 
            // replace multiple space with sinlge space
            eachQuotes.quote = finalAuthorQuoteText.replace(/  +/g, ' ') 
            eachQuotes.category_id = 1
            eachQuotes.isFavorite = false;
            eachQuotes.id = idx+1;

            parsedResults.push(eachQuotes)
        }
      });
    
    const lestDivElement = $('.leftContainer').children('div').last()
    const eachLink = $(lestDivElement).find('.next_page').attr('href')

    const newLinkForNextPage = baseURL + eachLink

    console.log(chalk.cyan(`  Scraping: ${newLinkForNextPage}`))
    
    pageCounter++

    if (pageCounter === pageLimit) {
      exportResults(parsedResults)
      return false
    }

    getWebsiteContent(newLinkForNextPage)
  } catch (error) {
    exportResults(parsedResults)
    console.error(error)
  }
}

const exportResults = (parsedResults) => {
  fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), (err) => {
    if (err) {
      console.log(err)
    }
    console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
  })
}

getWebsiteContent(url)