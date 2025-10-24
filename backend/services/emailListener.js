
import Imap from "imap";
import { simpleParser } from "mailparser";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

console.log("📧 Email listener loaded");


const imapConfig = {
  user: process.env.MAIL_USER,      
  password: process.env.MAIL_PASS,  
  host: "imap.gmail.com",           
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

const imap = new Imap(imapConfig);

function openInbox(cb) {
  imap.openBox("INBOX", false, cb);
}


cron.schedule("*/2 * * * *", () => {
  console.log("⏳ Checking inbox for new emails...");

  imap.once("ready", () => {
    openInbox((err, box) => {
      if (err) {
        console.error("Error opening inbox:", err);
        return;
      }

      imap.search(["UNSEEN"], (err, results) => {
        if (err) {
          console.error("Search error:", err);
          imap.end()
          return;
        }

        if (!results.length) {
          console.log("No new emails found.");
          imap.end();
          return;
        }

        const fetcher = imap.fetch(results, { bodies: "" });

        fetcher.on("message", (msg) => {
          msg.on("body", async (stream) => {
            try {
              const parsed = await simpleParser(stream);
              const subject = parsed.subject || "No Subject";
              const body = parsed.text || parsed.html || "No Content";

              console.log("\n📩 New Email Received!");
              console.log("Subject:", subject);
              console.log("Body:", body.slice(0, 300)); 
            } catch (err) {
              console.error("Error parsing email:", err);
            }
          });
        });

        fetcher.once("end", () => {
          console.log("All unread emails processed.\n");
          imap.end();
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP error:", err);
  });

  imap.once("end", () => {
    console.log("🔚 IMAP connection closed.");
  });

  imap.connect();
});
