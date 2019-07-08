const Subscription = require('egg').Subscription;

class WechatAddContact extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '1m', // 1 分钟间隔
            type: 'all', // 指定所有的 worker 都需要执行
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        let key = this.ctx.state.userid;
        let members = this.ctx.app.wechatAddContactQueue[key];
        let bot = this.ctx.app.wechatQueue[key];
        console.log(this.ctx.app);
        if (members && members.length > 0) {
            let member = members.splice(0, 1);
            console.log(member);
            let status = await bot.Friendship.add(member, '很高兴地认识你，哈哈');
            console.log(status);
        }else{
            console.log('success');
        }

    }
}

module.exports = WechatAddContact;