
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const url = "https://www.goodreads.com/quotes/tag/google";
const chalk = require('chalk')
category = []
async function scrapeData(){
    try {
        const { data } = await axios.get(url,{xmlMode: true});
        const $ = cheerio.load(data);
        const listItems = $(".listTagsTwoColumn li");
        console.log($(listItems).length)
        listItems.each((id, el) => {
            const quotesMeta = { categoryName: "", id: "", tag:"" };
            const tagText = $(el).find('a').attr('href')
            const index = tagText.lastIndexOf('/');
            const tagName = tagText.substring(index + 1);
            quotesMeta.id = id+1;
            quotesMeta.categoryName = $(el).find('a').text().trim();
            quotesMeta.tag = tagName
            category.push(quotesMeta)
          });
        //   console.log(category)
    fs.writeFile("quyotes_category.json", JSON.stringify(category, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(category.length)} Results exported successfully`))
    });

    } catch{


    }
}
// Invoke the above function
scrapeData();