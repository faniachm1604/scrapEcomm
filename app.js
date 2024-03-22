const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
// import puppeteer from "puppeteer";
const randomUseragent = require("random-useragent");

(async () => {
  // const url =
  // "https://shopee.co.id/search?keyword=redmi%20note%205a&is_from_login=true";
  //   const url = "https://www.tokopedia.com/search?st=product&q=laptop";
  const url =
    "https://www.bukalapak.com/products?from=omnisearch&from_keyword_history=false&search%5Bkeywords%5D=sepatu&search_source=omnisearch_keyword&source=navbar";
  const randomAgent = randomUseragent.getRandom();
  //   const browser = await puppeteer.launch({
  //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //   });
  const browser = await puppeteer.launch({
    headless: false,
    // userDataDir: "/tmp/myChromeSession",
    // executablePath:
    //   "C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--incognito"],
  });
  // const context = await browser.defaultBrowserContext(); //mode penyamaran
  //   const context = await browser.defaultBrowserContext(); //mode penyamaran
  const context = await browser.createIncognitoBrowserContext(); //mode penyamaran
  const page = await context.newPage(); //membuat tab baru
  // const page = await context.newPage(); //membuat tab baru

  await page.setViewport({ width: 1080, height: 1024 });
  await page.setJavaScriptEnabled(true); //aktifkan javascript
  await page.setUserAgent(randomAgent); //setting user agent
  await page.goto(url, { waituntil: "domcontentloaded", timeout: 0 }); //tunggu proses dom/load pagenya selesai
  const body = await page.evaluate(() => {
    // return document.querySelector("body").innerHTML;
    return document.querySelector(".bl-flex-item.bl-product-list-wrapper")
      .innerHTML;
  }); //mendapatkan isi tag html body

  const $ = cheerio.load(body);
  const listItems = $('[class="te-product-card bl-product-card-new"]');
  var resulst = [];
  listItems.each(function (idx, el) {
    var nama = $(
      ".bl-text.bl-text--body-14.bl-text--secondary.bl-text--ellipsis__2",
      el
    ).text();
    var harga = $(
      ".bl-text.bl-text--semi-bold.bl-text--ellipsis__1.bl-product-card-new__price",
      el
    ).text();
    var link = $("a[href]", el).attr("href");
    if (harga != null && harga != "") {
      resulst.push({
        ecomm: "Bukalapak",
        nama: nama.trim().replace(/[\n\.\+]/g, ""),
        harga: harga.trim().replace(/[\n\.]/g, ""),
        link: link,
      });
    }
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
  // console.dir(listItems);
  console.dir(resulst);

  // console.log(body);

  await browser.close(); //close browser puppeteer jika sudah selesai
})();
