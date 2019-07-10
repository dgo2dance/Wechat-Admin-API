const Subscription = require('egg').Subscription

class WechatAddContact extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1m', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    let queue = this.ctx.app.wechatAddContactQueue
    for (let i = 0; i < queue.length; i++) {
      let item = queue[i];
      if (item.bot.source && item.bot.status === 1 && item.data.length > 0) {
        await item.bot.source.Friendship.add(item.data[0], '很高兴地认识你，哈哈');
        // this.ctx.logger.info(`Wechat add Friend: user ${item.key}   add ${item.data[0].payload.name} success`);
        item.data.shift();
      } else {
        queue.splice(i--, 1);
      }
    }
   
  }
}

module.exports = WechatAddContact