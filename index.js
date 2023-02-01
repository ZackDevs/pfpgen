const puppeteer = require("puppeteer");
const Cheerio = require("cheerio");
const fs = require('fs');
const Axios = require('axios');


async function downloadImage(url, filepath) {
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath)); 
    });
}
async function test() {
    let browser = await puppeteer.launch({headless:false});
    console.log("[Info] - Getting the Year of the image.")
    let page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto('https://www.avogado6.com/',
        { waitUntil: 'networkidle0', }
    );
    let html = await page.evaluate(() => {
        return document.documentElement.outerHTML
    })
    let $ = Cheerio.load(html)
    let Years = {}
    $('span[class="M3I7Z2"]').each(function (index, element) {
            let Year = $(element).text()
            let url = $(element).parent().attr("href")
            if (/[0-9]{4}/g.test(Year)) {
                 Years[Year] = url
            }
        })
    let RandomYear = Years[Object.keys(Years)[Math.floor(Math.random() * Object.keys(Years).length)]]
    console.log("[Info] - Got the year: " + RandomYear)
    console.log("[Info] - Getting a new image. This will close when it's complete.")
    await page.goto(RandomYear ? RandomYear : "https://www.avogado6.com/",
        { waitUntil: 'networkidle0', }
    );
    html = await page.evaluate(() => {
        return document.documentElement.outerHTML
    })
    $ = Cheerio.load(html)
    let Images = []
    $('wow-image[id="img_undefined"]').each(function (index, element) {
        Img = $(element).attr('data-src')
        if (Img.endsWith(".jpg")) {
            Images.push(Img)
        }
    })
    if (!Images.length) throw "No images found"
    console.log("[Info] - Got the Images") 
    let RandomImage = Images[Math.floor(Math.random() * Images.length)]
    console.log("[Info] - Downloading "+ RandomImage) 
    ID_IMG = RandomImage.split("/")[4]
    await downloadImage(`https://static.wixstatic.com/media/${ID_IMG}`, "../../../../Downloads/image.png")
    await browser.close();
    return
}
test()

process.on('uncaughtException', (err, origin) => {
    fs.writeSync(
      process.stderr.fd,
      `Caught exception: ${err}\n` +
      `Exception origin: ${origin}`
    );
  });