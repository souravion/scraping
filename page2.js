const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk')

const url = 'https://www.goodreads.com/quotes/tag/love'
baseURL = 'https://www.goodreads.com'
const outputFile = 'data.json'
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
        const eachQuotes = { authoName: "", authoImg: "", quote:"" };
    
        const authorQuote = $(el).children('.quoteText').html().replace(/<script.*>.*<\/script>/ims, " "); // we remove the script tag from string
        const authorQuoteText = $(authorQuote).text().replace(/(\r\n|\n|\r)/gm, "").trim()// we remove the new line from string
        if(authorQuoteText.length <=characterLength){
            eachQuotes.authoImg =  $(el).children('a').find('img').attr('src');
            const authoNameText = $(el).children('.quoteText').find('span').text().replace(/(\r\n|\n|\r)/gm, "").trim();// we replace the new like 
            eachQuotes.authoName = authoNameText.replace(/  +/g, ' ') //
            eachQuotes.quote = authorQuoteText.replace(/  +/g, ' ') // replace multiple space with sinlge space
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