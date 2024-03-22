const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
// import puppeteer from "puppeteer";
const randomUseragent = require("random-useragent");

(async () => {
  const url =
    "https://shopee.co.id/search?keyword=redmi%20note%205a&is_from_login=true";
  //   const url = "https://www.tokopedia.com/search?st=product&q=laptop";
  //   const randomAgent = randomUseragent.getRandom();
  //   const browser = await puppeteer.launch({
  //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //   });
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "/tmp/myChromeSession",
    // executablePath:
    //   "C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
    // args: ["--incognito"],
  });
  const context = await browser.defaultBrowserContext(); //mode penyamaran
  //   const context = await browser.defaultBrowserContext(); //mode penyamaran
  //   const context = await browser.createIncognitoBrowserContext(); //mode penyamaran
  const page = await context.newPage(); //membuat tab baru

  await page.setViewport({ width: 1080, height: 1024 });
  await page.setJavaScriptEnabled(true); //aktifkan javascript
  //   await page.setUserAgent(randomAgent); //setting user agent
  await page.goto(url, { waituntil: "domcontentloaded", timeout: 0 }); //tunggu proses dom/load pagenya selesai
  const body = await page.evaluate(() => {
    // return document.querySelector("body").innerHTML;
    return document.querySelector("#main").innerHTML;
  }); //mendapatkan isi tag html body

  const $ = cheerio.load(body);
  const listItems = $('[class="col-xs-2-4 shopee-search-item-result__item"]');
  var resulst = [];
  listItems.each(function (idx, el) {
    // console.log($('[data-testid="spnSRPProdName"]', el).text());
    // var nama = $('[data-testid="spnSRPProdName"]', el).text();
    // var harga = $('[data-testid="spnSRPProdPrice"]', el).text();
    var link = $("a[href]", el).attr("href");
    // if (harga != null && harga != "") {
    resulst.push({
      //     nama: nama,
      //     harga: harga,
      link: link,
    });
    // }
  });

  //   const $ = cheerio.load(body);
  //   const listItems = $('[data-testid="master-product-card"]');
  //   var resulst = [];
  //   listItems.each(function (idx, el) {
  //     var nama = $('[data-testid="spnSRPProdName"]', el).text();
  //     var harga = $('[data-testid="spnSRPProdPrice"]', el).text();
  //     var link = $("a[href]", el).attr("href");
  //     if (harga != null && harga != "") {
  //       resulst.push({
  //         nama: nama,
  //         harga: harga,
  //         link: link,
  //       });
  //     }
  //   });
  console.dir(resulst);

  console.log(body);

  await browser.close(); //close browser puppeteer jika sudah selesai
})();
