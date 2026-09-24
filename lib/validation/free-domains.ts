// lib/validation/free-domains.ts
// Comprehensive free email domain blocklist

const FREE_DOMAINS = new Set([
  "gmail.com","googlemail.com","yahoo.com","yahoo.co.in","yahoo.co.uk","yahoo.com.au",
  "yahoo.fr","yahoo.de","yahoo.es","yahoo.it","yahoo.ca","yahoo.co.jp","ymail.com",
  "outlook.com","outlook.in","outlook.co.uk","outlook.fr","outlook.de","outlook.es",
  "hotmail.com","hotmail.co.uk","hotmail.fr","hotmail.de","hotmail.es","hotmail.it",
  "hotmail.ca","hotmail.co.jp","live.com","live.co.uk","live.fr","live.de","live.in",
  "msn.com","icloud.com","me.com","mac.com","aol.com","proton.me","protonmail.com",
  "pm.me","rediffmail.com","zoho.com","gmx.com","gmx.de","gmx.net","mail.com",
  "yandex.com","yandex.ru","tutanota.com","fastmail.com","hey.com","inbox.com",
]);

export function isFreeDomain(email: string): boolean {
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  if (FREE_DOMAINS.has(domain)) return true;
  // TLD variants: yahoo.*, hotmail.*, outlook.*, live.*
  const prefix = domain.split(".")[0];
  return ["yahoo","hotmail","outlook","live"].includes(prefix);
}
