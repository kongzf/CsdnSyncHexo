const { csdn, output, base,overrideFiles,getFirstPage } = require("./config");
const fetch = require("node-fetch");
const cheerio = require('cheerio');
const generate = require('./generate')
const { execSync } = require('child_process');
const main = async () => {
    const articleList = [];

    var maxPage = 100;
    if (getFirstPage) {
        maxPage = 1;
    }
    for (let i = 0; i < maxPage; i++) {
        const res = await fetch(`${csdn}/article/list/${i}`);
        const html = await res.text();
        const $ = cheerio.load(html)
        const list = $('.article-item-box');
        if (list.length > 0) {
            $('.article-item-box').each(function () {
                // 获取当页文章连接
                articleList.push($('a', this).attr('href'))
            });
        } else {
            break;
        }
    }
    console.log('正在生成文件....')
    const p = articleList.map(link => generate(link, output,overrideFiles));

    await Promise.all(p)
    console.log('生成完成.....准备进行hexo部署')
    try {
        //execSync('hexo g', { cwd: base })
        //console.log('生成静态文件成功....')
        //execSync('hexo d', { cwd: base })
        //console.log('部署成功....')
    } catch (e) {
        console.log(e)
    }
    
}

main()
