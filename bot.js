require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "👋 سلام!\n\n" +
    "به ربات چت ناشناس خوش آمدی.\n\n" +
    "برای شروع، از منوی ربات استفاده کن."
  );
});

bot.command("help", (ctx) => {
  ctx.reply(
    "ℹ️ راهنما\n\n" +
    "این ربات برای پیدا کردن و چت کردن با کاربران دیگر ساخته می‌شود."
  );
});

bot.launch();

console.log("🤖 Anonymous Chat Bot started");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
