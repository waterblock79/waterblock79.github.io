// @ts-nocheck
import fs from "fs";
import path from "path";
import yaml from "yaml";
import ejs from "ejs";
import dayjs from "dayjs";
import { marked } from "marked";

const texPreprocess = (text) => {
   /*
   let matches = text.match(/\${2}.+\${2}/g);
   matches && matches.map((match) => {
      // 修复双反斜杠 \\ 换行会被转义掉的问题
      text = text.replace(match, match.replaceAll('\\\\', '\\\\\\\\'));
   });
   */
   return text.replaceAll("\\\\", "\\\\\\\\");
};

const extractMarkdown = (rf) => {
   let matchMetadata = rf.match(/-{3,}[\s\S]+?-{3,}/g)[0];
   let metadata = yaml.parse(matchMetadata.replace(/-{3,}/g, ""));
   let content = rf.replace(matchMetadata, "");
   return { metadata, content };
}

const colorText = {
   blue: (text) => `\x1B[34m${text}\x1B[0m`,
   blueBg: (text) => `\x1B[44m${text}\x1B[0m`,
   green: (text) => `\x1B[32m${text}\x1B[0m`,
   greenBg: (text) => `\x1B[42m${text}\x1B[0m`,
   red: (text) => `\x1B[31m${text}\x1B[0m`,
   redBg: (text) => `\x1B[41m${text}\x1B[0m`,
   grey: (text) => `\x1B[37m${text}\x1B[0m`,
   yellow: (text) => `\x1B[33m${text}\x1B[0m`,
   yellowBg: (text) => `\x1B[43m${text}\x1B[0m`,
};

const templates = {
   post: ejs.compile(
      fs.readFileSync("template/post.ejs", { encoding: "utf-8" })
   ),
   index: ejs.compile(
      fs.readFileSync("template/index.ejs", { encoding: "utf-8" })
   ),
};

const url = 'https://waterblock79.github.io/';

let posts = [];
let sitemap = [];

try {
   fs.rmSync("docs", { recursive: true, force: true });
   fs.mkdirSync("docs");
} catch (e) {
   if (fs.existsSync("docs")) {
      fs.readdirSync("docs").forEach((files) => {
         fs.rmSync(`docs/${files}`, { recursive: true, force: true });
      });
   } else {
      throw new Error();
   }
}
fs.mkdirSync("docs/posts");

// 读取文章
fs.readdirSync("sources", {
   withFileTypes: true,
}).map((file) => {
   let filePath = path.join("sources", file.name).toString();
   if (file.isFile()) { 
      let ext = extractMarkdown(fs.readFileSync(filePath, { encoding: "utf-8" }));
      let postMetadata = ext.metadata, postContent = ext.content;
      if (postMetadata.hide == true) return;
      posts.push({
         title: postMetadata.title,
         excerpt: postMetadata.excerpt,
         date: new Date(postMetadata.date),
         dateString: dayjs(postMetadata.date).format("YYYY-MM-DD"),
         datetimeString: dayjs(postMetadata.date).format("YYYY-MM-DD HH:mm"),
         tags: postMetadata.tags || [],
         id: postMetadata.id,
         image: postMetadata.image,
      });
      fs.writeFileSync(
         `docs/posts/${postMetadata.id}.html`,
         templates.post({
            title: postMetadata.title,
            date: new Date(postMetadata.date),
            dateString: dayjs(postMetadata.date).format("YYYY-MM-DD"),
            datetimeString: dayjs(postMetadata.date).format("YYYY-MM-DD HH:mm"),
            tags: postMetadata.tags || [],
            description: postMetadata.excerpt,
            content: marked.parse(texPreprocess(postContent), {
               mangle: false,
               headerIds: false,
            })
         })
      );
      sitemap.push(`posts/${postMetadata.id}.html`);
   }
});

// 写入主页
posts = posts.sort((a, b) => b.date.getTime() - a.date.getTime());
const recently = fs.existsSync('./recently.md') ? (extractMarkdown(fs.readFileSync('./recently.md', 'utf-8'))) : false;
const recentlyDisplay = !!recently && recently.metadata.display;
fs.writeFileSync(`docs/index.html`, templates.index({
   posts,
   updateDateString: dayjs().format("YYYY-MM-DD"),
   recentlyDisplay,
   recently: recentlyDisplay ? marked.parse(recently.content) : '',
   recentlyDate: recentlyDisplay ? dayjs(recently.metadata.date).format("YYYY-MM-DD") : ''
}));
sitemap.push('');

// 复制 assets
fs.cpSync("template/assets", "docs/assets", { recursive: true });

// 复制 404 页
fs.cpSync("template/404.html", "docs/404.html");

// 复制文章资源
fs.readdirSync("sources", {
   withFileTypes: true,
}).map((item) => {
   if (item.isDirectory()) {
      fs.cpSync(`sources/${item.name}`, `docs/posts/${item.name}`, { recursive: true });
   }
})

// 复制 CNAME
fs.cpSync("template/CNAME", "docs/CNAME");

// 写入 Sitemap
fs.writeFileSync(`docs/sitemap.txt`, sitemap.map(x => url + x).join('\n'));