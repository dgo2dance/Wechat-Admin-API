const superagent = require('superagent');
const cheerio = require('cheerio');
const Subscription = require('egg').Subscription
const moment = require('moment');
class CrawlerConstellation extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            cron: '0 01 0 * * *', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
        }
    }
    constructor(app) {
        super(app)
        this.href = "https://www.xzw.com/fortune/";
        this.pageArr = [
            { key: 'aries', name: '白羊座', data: [] },
            { key: 'taurus', name: '金牛座', data: [] },
            { key: 'gemini', name: '双子座', data: [] },
            { key: 'cancer', name: '巨蟹座', data: [] },
            { key: 'leo', name: '狮子座', data: [] },
            { key: 'virgo', name: '处女座', data: [] },
            { key: 'libra', name: '天秤座', data: [] },
            { key: 'scorpio', name: '天蝎座', data: [] },
            { key: 'sagittarius', name: '射手座', data: [] },
            { key: 'capricorn', name: '摩羯座', data: [] },
            { key: 'aquarius', name: '水瓶座', data: [] },
            { key: 'pisces', name: '双鱼座', data: [] }
        ];
    }


    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        for (let i = 0; i < this.pageArr.length; i++) {
            let link = this.href + this.pageArr[i].key + "/";
            this.pageArr[i].data = await this.getData(link);

        }
        let data = { date: moment().format('YYYY-MM-DD'), data: this.pageArr }
        this.ctx.model.Constellation.create(data)
    }
    getData(link) {
        return new Promise((resolve, reject) => {
            superagent.get(link).set({
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
            }).end(function (req, res) {
                let $ = cheerio.load(res.text);
                let getStar = (index) => {
                    let width = parseInt($("#view").find("dl dd ul li:nth-child(" + index + ") em").attr("style").split(":")[1]) || 0;
                    return width / 16;
                }
                let getIndex = (index) => {
                    let text = $("#view").find("dl dd ul li:nth-child(" + index + ")").text().split("：");
                    return text ? (text[1] ? text[1] : '') : "";
                }
                let getContent = (index) => {
                    return $("#view").find(".c_cont p:nth-child(" + index + ") span").text();
                }
                let data = {
                    total: getContent("1"), //综合运势
                    totalStar: getStar("1"),//综合星数
                    love: getContent("2"), //爱情运势
                    loveStar: getStar("2"),//爱情星数
                    study: getContent("3"),//事业学业
                    studyStar: getStar("3"),//事业学业星数
                    wealth: getContent("4"),//财富运势
                    wealthStar: getStar("4"),//财富星数
                    health: getContent("5"),//健康运势
                    healthIndex: getIndex("5"),//健康指数
                    BusinessIndex: getIndex("6"),//商谈指数
                    luckyColor: getIndex("7"),//幸运颜色
                    luckyNumber: getIndex("8"),//幸运数字
                    match: getIndex("9"),//速配星座
                    intr: getIndex("10"),//短评

                };
                resolve(data);
            });
        })
    }
}

module.exports = CrawlerConstellation