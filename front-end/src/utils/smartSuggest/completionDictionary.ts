/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Lightweight, frequency-ordered English dictionary used ONLY for partial-word
 * autocomplete (e.g. `hel` -> `hello`, `mark` -> `market`, `rest` -> `restaurant`).
 *
 * This is intentionally separate from Harper.js (which does not provide its own
 * autocomplete). Words are ordered roughly by common usage so the first match is
 * almost always the word the user is trying to type.
 */

// ~1500 common English words ordered by frequency (common first). A small set of
// everyday chat / business words are placed higher so prefixes like `mark` rank
// `market` before `marked`, and `rest` ranks `restaurant` before `restore`.
export const COMMON_WORDS: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "am", "is", "are", "was", "were", "been", "being", "got", "did",
  "does", "doing", "done", "call", "called", "calling", "talk", "talking", "talked",
  "told", "tell", "telling", "ask", "asked", "asking", "help", "helping", "helped",
  "need", "needs", "needed", "wants", "wanted", "likes", "liked", "loves", "loved",
  "miss", "misses", "missed", "meets", "met", "meetings", "today", "tomorrow", "yesterday",
  "tonight", "morning", "afternoon", "evening", "night", "week", "weekend", "month",
  "happy", "sad", "angry", "excited", "nervous", "worried", "tired", "sleepy",
  "hungry", "thirsty", "busy", "free", "ready", "sure", "okay", "ok", "please",
  "thanks", "thank", "sorry", "welcome", "hello", "hi", "hey", "bye", "goodbye",
  "yes", "yeah", "yep", "nope", "maybe", "perhaps", "probably", "really",
  "very", "too", "also", "quite", "pretty", "almost", "always", "never", "often",
  "sometimes", "usually", "together", "anyway", "anywhere", "everywhere", "somewhere",
  // high-priority completions for the documented examples
  "market", "marketing", "marked", "marks", "restaurant", "restore", "rested",
  "restful", "room", "rooms", "home", "house", "office", "school", "college",
  "university", "hospital", "hotel", "airport", "station", "coffee",
  "breakfast", "lunch", "dinner", "dessert", "vegetarian", "delivery", "package",
  "parcel", "address", "map", "maps", "location", "distance", "travel", "trip",
  "holiday", "vacation", "abroad", "country", "city", "town", "village",
  "street", "road", "avenue", "bridge", "river", "beach", "mountain", "park",
  "garden", "museum", "cinema", "theatre", "theater", "concert", "party", "birthday",
  "wedding", "anniversary", "celebration", "gift", "present", "surprise", "cake",
  "flowers", "cards", "money", "price", "cost", "expensive", "cheap", "cheaper",
  "discount", "sale", "offer", "offers", "shopping", "shop", "store", "buy",
  "bought", "purchase", "sell", "sold", "pay", "paid", "payment", "cash", "card",
  "credit", "debit", "bank", "account", "balance", "transaction", "transfer",
  "send", "sends", "sending", "sent", "receive", "received", "receiving", "resend",
  "receipt", "invoice", "bill", "refund", "return", "order", "orders", "ordered",
  "delivered", "track", "tracking", "cancel", "cancelled", "schedule", "scheduling",
  "appointment", "reservation", "booking", "booked", "book", "books", "read",
  "reading", "write", "writes", "writing", "wrote", "written", "check", "checked",
  "checking", "verify", "verified", "confirm", "confirmed", "confirmation",
  "information", "details", "detail", "list", "lists", "table", "tables", "chair",
  "window", "door", "floor", "wall", "kitchen", "bathroom", "bedroom", "plant",
  "car", "cars", "bus", "train", "plane", "flight", "boat", "ship", "bike",
  "bicycle", "drive", "driving", "drove", "driver", "parking", "traffic",
  "highway", "toll", "fuel", "petrol", "diesel", "charge", "charging", "battery",
  "phone", "phones", "mobile", "laptop", "computer", "desktop", "tablet", "screen",
"keyboard", "mouse", "printer", "scanner", "camera", "photo", "photos", "picture",
  "pictures", "image", "images", "video", "videos", "movie", "movies", "song",
  "songs", "music", "audio", "sound", "volume", "mute", "unmute", "play", "pause",
  "stop", "record", "recording", "recorded", "listen", "listening", "watch",
  "watching", "download", "downloading", "downloads", "downloaded", "uploading",
  "uploads", "uploaded", "share", "sharing", "shared", "forwarding", "forwarded",
  "replies", "replied", "message", "messages", "chat", "chats", "chatting", "contact", "contacts",
  "friend", "friends", "group", "groups", "members", "member", "invite",
  "invitation", "invited", "join", "joined", "leave", "left", "add", "added",
  "remove", "removed", "block", "blocked", "unblock", "unblocked", "delete",
  "deleted", "edit", "edited", "copy", "copied", "paste", "pasted", "cut",
  "save", "saved", "saving", "open", "opened", "opening", "close", "closed",
  "closing", "click", "clicked", "clicking", "button", "buttons", "link", "links",
  "page", "pages", "file", "files", "folder", "folders", "document", "documents",
  "report", "reports", "presentation", "spreadsheet", "spreadsheets", "version",
  "update", "updated", "updates", "upgrade", "upgraded", "install", "installed",
  "setup", "setting", "settings", "password", "username", "email", "emails",
  "login", "logged", "logout", "sign", "signup", "register", "registered",
  "profile", "privacy", "security", "forgot", "reset",
  "search", "searched", "searching", "find", "finds", "found", "filter",
  "category", "categories", "option", "options", "select", "selected", "choose",
  "chose", "chosen", "default", "custom", "customised", "customized", "preference",
  "preferences", "language", "languages", "english", "bengali", "translation",
  "translate", "translated", "translator", "meaning", "sentence",
  "sentences", "grammar", "spelling", "spell", "spelled", "pronoun", "pronunciation",
  "phrase", "phrases", "vocabulary", "letter", "letters", "number", "numbers",
  "amount", "total", "sum", "average", "percent", "percentage", "half", "quarter",
  "dozen", "pair", "couple", "few", "several", "many", "much", "more", "most",
  "less", "least", "fewer", "minimum", "maximum", "limit", "limited", "unlimited",
  "extra", "additional", "enough", "plenty", "numerous",
  "second", "third", "fourth", "fifth", "final", "next", "previous",
  "current", "future", "past", "present", "old", "older", "oldest", "new", "newer",
  "newest", "young", "younger", "youngest", "big", "bigger", "biggest", "small",
  "smaller", "smallest", "large", "larger", "largest", "great", "greater", "greatest",
  "better", "worse", "worst", "high", "higher", "highest",
  "low", "lower", "lowest", "fast", "faster", "fastest", "slow", "slower", "slowest",
  "easy", "easier", "easiest", "difficult", "hard", "harder", "hardest", "simple",
  "complex", "complicated", "short", "shorter", "shortest", "long", "longer",
  "longest", "hot", "hotter", "hottest", "cold", "colder", "coldest", "warm", "cool",
  "nice", "beautiful", "pretty", "handsome", "ugly", "clean", "dirty", "bright",
  "dark", "light", "heavy", "soft", "smooth", "rough", "strong", "weak",
  "healthy", "sick", "ill", "fine", "health", "doctor",
  "nurse", "medicine", "medication", "diagnosis", "treatment", "therapy",
];

/** Words/terms that should never be flagged as spelling mistakes or corrected
 *  (app names, brands, technical terms, common names, etc.). */
export const PROTECTED_TERMS: Set<string> = new Set([
  "whatsapp", "facebook", "instagram", "messenger", "telegram", "snapchat",
  "twitter", "x", "tiktok", "linkedin", "youtube", "wechat", "signal",
  "discord", "slack", "zoom", "skype", "gmail", "yahoo", "outlook",
  "hotmail", "icq", "viber", "imo", "line",
  "google", "chrome", "firefox", "safari", "edge", "opera", "android",
  "apple", "iphone", "ipad", "macbook", "windows", "linux", "microsoft",
  "amazon", "flipkart", "daraz", "ebay", "alibaba", "paypal", "visa",
  "mastercard", "bikash", "nagad", "rocket", "upay", "dbbl", "bkash", "nogod",
  "bangladesh", "dhaka", "chittagong", "khulna", "rajshahi", "sylhet", "barishal",
  "rangpur", "mymensingh", "cox", "bazar", "bangla", "bengali", "urdu", "hindi",
  "harper", "javascript", "typescript", "react", "redux", "vue", "angular",
  "svelte", "node", "nodejs", "express", "nest", "nextjs", "mongodb", "mongoose",
  "postgres", "postgresql", "mysql", "sqlite", "redis", "docker", "kubernetes",
  "github", "gitlab", "bitbucket", "git", "vercel", "netlify", "heroku",
  "cloudinary", "aws", "azure", "firebase", "supabase",
  "html", "css", "sass", "scss", "json", "api", "apis", "rest",
  "graphql", "websocket", "socketio", "prisma", "orm", "http", "https",
  "url", "pdf", "docx", "xlsx", "pptx", "txt", "csv", "png", "jpg",
  "jpeg", "gif", "webp", "svg", "emoji", "emojis", "meme", "memes",
  "bitcoin", "crypto", "blockchain", "solana", "ethereum", "tron",
  "mrp", "gst", "vat", "emi", "otp", "pin", "kpi", "roi", "sop",
  "co", "ltd", "llc", "pvt", "inc", "corp", "dr", "mr", "mrs", "ms",
  "miss", "prof", "st", "ave", "rd", "blvd", "apt", "dept",
  "unicode", "dpi", "ips", "lcd", "led", "oled",
  "cpu", "gpu", "ram", "ssd", "hdd", "hdmi", "vga", "voip",
  "sms", "mms", "cdn", "dns", "vpn", "ui", "ux",
  "seo", "php", "python", "java", "cplusplus", "cpp", "kotlin", "swift",
  "ruby", "go", "rust", "dart", "flutter", "laravel", "django", "flask",
  "springboot", "oracle", "sql", "nosql", "devops", "ci", "cd",
  "jsx", "tsx", "eslint", "prettier", "vite", "webpack", "babel", "npm",
  "yarn", "pnpm", "node_modules", "bootstrap", "tailwind", "material",
  "mui", "antdesign", "chakra", "framer", "zustand", "jotai",
  "reactquery", "axios", "lodash", "moment", "dayjs", "sentry",
  "rayhan", "rahim", "karim", "jamal", "kamal", "tania",
  "nusrat", "sumaiya", "sadia", "runa", "shihab", "tanvir", "niaz", "ratul",
  "rifat", "emran", "arif", "sohel", "shakil", "mamun", "monir", "rakib",
  "sabbir", "salman", "polash", "mehedi", "mahadi", "sajid", "saiful", "nayeem",
]);
export interface CompletionCandidate {
  word: string;
  /** how the suggestion should look in the popup (respects the typed casing) */
  display: string;
}

/**
 * Return up to `limit` words that start with `prefix` (case-insensitive).
 * The exact typed word is never returned (that is not a useful completion).
 */
export const getCompletions = (
  prefix: string,
  limit = 5
): CompletionCandidate[] => {
  const lower = prefix.toLowerCase().trim();
  if (!lower || lower.length < 1) return [];

  const results: CompletionCandidate[] = [];
  const seen = new Set<string>();
  const upperFirst =
    prefix[0] === prefix[0].toUpperCase() && prefix[0] !== prefix[0].toLowerCase();

  for (const word of COMMON_WORDS) {
    if (results.length >= limit) break;
    const wl = word.toLowerCase();
    if (!wl.startsWith(lower)) continue;
    if (wl === lower) continue; // exact word is not a completion
    if (seen.has(wl)) continue;
    seen.add(wl);
    results.push({
      word: wl,
      display: upperFirst ? wl.charAt(0).toUpperCase() + wl.slice(1) : wl,
    });
  }
  return results;
};