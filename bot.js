require("dotenv").config();

const { Telegraf } = require("telegraf");
const http = require("http");

const bot = new Telegraf(process.env.BOT_TOKEN);

// صفحه ساده برای Render
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end("Anonymous Chat Bot is running 🤖");
});

server.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// شروع ربات
bot.start((ctx) => {
  ctx.reply(
    "👋 سلام!\n\n" +
    "به ربات چت ناشناس خوش آمدی.\n\n" +
    "برای شروع، از منوی ربات استفاده کن."
  );
});

// راهنما
bot.command("help", (ctx) => {
  ctx.reply(
    "ℹ️ راهنما\n\n" +
    "این ربات برای پیدا کردن و چت کردن با کاربران دیگر ساخته می‌شود."
  );
});

// اجرای ربات
bot.launch();

console.log("🤖 Anonymous Chat Bot started");

// خاموش شدن صحیح
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
