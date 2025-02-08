/* 
   爬取古诗文网诗文
*/
const jsdom = require("jsdom");
const md5 = require("md5");
const { JSDOM } = jsdom;
const { writeFileSync } = require("fs");

const targets = [
   { type: "list", url: "https://so.gushiwen.cn/gushi/gaozhong.aspx" },
   { type: "list", url: "https://so.gushiwen.cn/gushi/chuzhong.aspx" },
   { type: "list", url: "https://so.gushiwen.cn/gushi/xiaoxue.aspx" }
];

const getPoem = (url) => {
   return new Promise(async (resolve, reject) => {
      const page = new JSDOM(await (await fetch(url)).text());
      // OnBeisong230427('0595b5ed9fb4','http://so.gushiwen.cn/shiwenv.aspx?id=0595b5ed9fb4','9F6A8A70ADA4BB9D069A82988B89AD55')
      // => a = 230407, b = 9F6A8A70ADA4BB9D069A82988B89AD55
      // => GET https://so.gushiwen.cn/nocdn/ajaxshiwencont[a].aspx?id=[b]&value=yizhu
      const a = page.window.document
            .querySelectorAll('img[id*="btnBeisong"]')
            .item(0)
            .getAttribute("onClick")
            .match(/(?<=(OnBeisong))[0-9]+/g)[0],
         b = page.window.document
            .querySelectorAll('img[id*="btnBeisong"]')
            .item(0)
            .getAttribute("onClick")
            .match(/(?<=')[^']*(?='\))/g)[0];
      const purePage = new JSDOM(
         await (
            await fetch(
               `https://so.gushiwen.cn/nocdn/ajaxshiwencont${a}.aspx?id=${b}`
            )
         ).text()
      );
      const title = purePage.window.document
            .querySelectorAll("body > h1")
            .item(0)?.innerHTML,
         author = purePage.window.document
            .querySelectorAll(".source")
            .item(0)
            ?.innerHTML.replaceAll(/\<[^\>]*\>|\n| /g, "");
      let content = [];
      if (purePage.window.document.querySelectorAll(".contson > p").length) {
         purePage.window.document
            .querySelectorAll(".contson > p")
            .forEach((p) => {
               content.push(p.innerHTML.replaceAll(/\<br\/?\>/g, "\n"));
            });
      } else {
         content.push(
            purePage.window.document
               .querySelectorAll(".contson")
               .item(0)
               .innerHTML.replaceAll(/\<br\/?\>/g, "\n")
         );
      }
      resolve({
         title,
         author,
         content,
         id: md5(content.join('\n\n'))
      });
   }).catch((e) => console.log(e));
};

let results = [];

targets.forEach(async (target) => {
   if (target.type === "list") {
      fetch(target.url)
         .then((res) => res.text())
         .then((html) => {
            const page = new JSDOM(html);
            page.window.document
               .querySelectorAll(".typecont a")
               .forEach(async (e, i) => {
                  let url = e.href;
                  let poem = await getPoem(url);
                  if (!results.includes(poem)) results.push(poem);
                  console.log(`${url} Done.`);
               });
         });
   } else {
      let poem = await getPoem(target.url);
      if (!results.includes(poem)) results.push(poem);
      console.log(`${target.url} Done.`);
   }
});

process.on("exit", () => {
   console.log(`Done, ${results.length} Total.`);
   writeFileSync("data.json", JSON.stringify(results));
});
