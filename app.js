const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
// import puppeteer from "puppeteer";
const randomUseragent = require("random-useragent");

(async () => {
  var namaEcomm = "Tokopedia";
  var url = "";

  switch (namaEcomm) {
    case "Bukalapak":
      InspectMasterProduct = ".bl-flex-item.bl-product-list-wrapper";
      InspectMasterListProduct =
        '[class="te-product-card bl-product-card-new"]';
      InspectNamaProduct =
        ".bl-text.bl-text--body-14.bl-text--secondary.bl-text--ellipsis__2";
      InspectHargaProduct =
        ".bl-text.bl-text--semi-bold.bl-text--ellipsis__1.bl-product-card-new__price";
      InspectLinkProduct = "a[href]";
      url =
        "https://www.bukalapak.com/products?from=omnisearch&from_keyword_history=false&search%5Bkeywords%5D=sepatu&search_source=omnisearch_keyword&source=navbar";
      break;
    case "Tokopedia":
      InspectMasterProduct = "body";
      InspectMasterListProduct = '[data-testid="master-product-card"]';
      InspectNamaProduct = "[data-testid='spnSRPProdName']";
      InspectHargaProduct = "[data-testid='spnSRPProdPrice']";
      InspectLinkProduct = "a[href]";
      url = "https://www.tokopedia.com/search?st=product&q=laptop";
      break;
  }
  const randomAgent = randomUseragent.getRandom();
  //   const browser = await puppeteer.launch({
  //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //   });
  const browser = await puppeteer.launch({
    headless: false,
    // userDataDir: "/tmp/myChromeSession",
    executablePath:
      "C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
    // args: ["--incognito"],
  });
  const page = await browser.newPage(); //membuat tab baru
  // const page = await context.newPage(); //membuat tab baru
  await page.setViewport({ width: 1080, height: 1024 });
  await page.setJavaScriptEnabled(true); //aktifkan javascript
  await page.setUserAgent(randomAgent); //setting user agent

  // console.log(InspetMasterProduct);

  try {
    await page.goto(url, {
      waituntil: "domcontentloaded",
      timeout: 10000,
    });
  } catch (e) {
    console.log("Closed");
    console.error("Timeout error", error);
  }

  // InspectMasterProduct = "123";
  const body = await page.evaluate(() => {
    return document.querySelector("body").innerHTML;
  });

  const $ = cheerio.load(body);
  const listItems = $(InspectMasterListProduct);
  var resulst = [];
  listItems.each(function (idx, el) {
    var nama = $(InspectNamaProduct, el).text();
    var harga = $(InspectHargaProduct, el).text();
    var link = $(InspectLinkProduct, el).attr("href");
    if (harga != null && harga != "") {
      resulst.push({
        ecomm: namaEcomm,
        nama: nama.trim().replace(/[\n\.\+]/g, ""),
        harga: harga.trim().replace(/[\n\.]/g, ""),
        link: link,
      });
    }
  });

  console.dir(resulst);

  await browser.close(); //close browser puppeteer jika sudah selesai
})();
