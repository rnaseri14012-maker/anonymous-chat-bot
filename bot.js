require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");
const http = require("http");
const fs = require("fs");

const bot = new Telegraf(process.env.BOT_TOKEN);

const PORT = process.env.PORT || 3000;
const USERS_FILE = "./users.json";

// ====================
// Web Server برای Render
// ====================

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end("Anonymous Chat Bot is running 🤖");
});

server.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// ====================
// مدیریت کاربران
// ====================

function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch (error) {
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(users, null, 2),
    "utf8"
  );
}

// ====================
// /start
// ====================

bot.start((ctx) => {
  const users = loadUsers();
  const id = String(ctx.from.id);

  // اگر قبلاً ثبت‌نام کرده
  if (users[id]) {
    ctx.reply(
      "👋 دوباره خوش آمدی!\n\n" +
      "شما قبلاً در ربات ثبت‌نام کرده‌ای.",
      Markup.keyboard([
        ["🔎 پیدا کردن نفر"],
        ["👤 پروفایل من"],
        ["ℹ️ راهنما"]
      ]).resize()
    );

    return;
  }

  // ثبت کاربر جدید
  users[id] = {
    telegramId: ctx.from.id,
    firstName: ctx.from.first_name || "",
    username: ctx.from.username || "",
    registeredAt: new Date().toISOString()
  };

  saveUsers(users);

  ctx.reply(
    "🎉 ثبت‌نام با موفقیت انجام شد!\n\n" +
    `👤 نام: ${ctx.from.first_name || "ثبت نشده"}\n` +
    `🆔 شناسه کاربر: ${ctx.from.id}\n\n` +
    "حالا می‌توانیم وارد مرحله پیدا کردن یک نفر برای چت ناشناس شویم.",
    Markup.keyboard([
      ["🔎 پیدا کردن نفر"],
      ["👤 پروفایل من"],
      ["ℹ️ راهنما"]
    ]).resize()
  );
});

// ====================
// پروفایل
// ====================

bot.hears("👤 پروفایل من", (ctx) => {
  const users = loadUsers();
  const id = String(ctx.from.id);

  if (!users[id]) {
    return ctx.reply("❌ ابتدا با /start ثبت‌نام کن.");
  }

  const user = users[id];

  ctx.reply(
    "👤 پروفایل شما\n\n" +
    `نام: ${user.firstName || "ثبت نشده"}\n` +
    `Username: ${user.username ? "@" + user.username : "ندارد"}\n` +
    `تاریخ ثبت‌نام: ${user.registeredAt}`
  );
});

// ====================
// راهنما
// ====================

bot.command("help", (ctx) => {
  ctx.reply(
    "ℹ️ راهنما\n\n" +
    "🔎 پیدا کردن نفر: پیدا کردن یک کاربر برای چت ناشناس\n" +
    "👤 پروفایل من: نمایش اطلاعات ثبت‌نام\n\n" +
    "در مراحل بعد سیستم چت ناشناس را اضافه می‌کنیم."
  );
});

// ====================
// اجرای ربات
// ====================

bot.launch();

console.log("🤖 Anonymous Chat Bot started");

// خاموش شدن صحیح
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
