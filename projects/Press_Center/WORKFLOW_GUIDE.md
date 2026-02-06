# Token-Efficient Editorial Workflow Guide

This guide helps you process articles from Notion to Korean translation while minimizing API token usage.

---

## 📥 Step 1: Export from Notion

1. Open your Notion page with the article
2. Click the `•••` menu (top right)
3. Select **Export**
4. Choose format: **Markdown & CSV**
5. Click **Export**
6. Save the downloaded `.md` file to `Press_Center/` folder

**Token Cost: 0** ✅

---

## 📝 Step 2: Review the Exported File

1. Open the exported `.md` file in your editor
2. Check if the content is complete and properly formatted
3. Note the total line count (you'll use this for chunked translation)

**Token Cost: 0** ✅

---

## 🌐 Step 3: Translation Strategy

Choose one of these approaches based on article length:

### Option A: Small Articles (< 100 lines)
**Best for:** Short news pieces, brief updates

**Instructions:**
- Ask me: "Translate this entire file to Korean using the master prompt"
- I'll process it in one go

**Token Cost: ~3,000-5,000 tokens**

---

### Option B: Medium Articles (100-300 lines)
**Best for:** Feature articles, interviews

**Instructions:**
1. Ask me: "Translate lines 1-100 to Korean"
2. After I finish, ask: "Translate lines 101-200 to Korean"
3. Continue in chunks until complete
4. I'll append each translation to a new Korean file

**Token Cost: ~2,000-3,000 tokens per chunk**

---

### Option C: Large Articles (300+ lines)
**Best for:** Long-form features, in-depth profiles

**Instructions:**
1. Use external tool (DeepL/Papago) for initial translation
2. Save the machine translation as `[filename]_korean_draft.md`
3. Ask me: "Polish lines 1-50 of the Korean draft, remove translationese"
4. Continue in small chunks for quality control

**Token Cost: ~1,000-2,000 tokens per chunk** (most efficient!)

---

## ✨ Step 4: Quality Check

After translation is complete:

1. Ask me: "Review the Korean translation for broadcast quality"
2. I'll check for:
   - Translationese patterns
   - Unnatural phrasing
   - Broadcast-appropriate tone
3. Make targeted fixes only where needed

**Token Cost: ~1,000-2,000 tokens**

---

## 📁 Step 5: File Organization

1. Keep both English and Korean versions in `Press_Center/`
2. Use clear naming:
   - `article_name.md` (English original)
   - `article_name_korean.md` (Korean translation)
3. Update the Press Center README if needed

**Token Cost: ~500 tokens**

---

## 💡 Pro Tips

### Minimize Token Usage
- ✅ Export from Notion directly (don't ask me to retrieve)
- ✅ Translate in chunks for long articles
- ✅ Use external tools for first draft, I polish
- ❌ Don't ask me to retrieve full articles from URLs
- ❌ Don't ask me to re-translate entire files

### When to Use Me
- ✅ Removing translationese from drafts
- ✅ Polishing specific sections
- ✅ Converting to broadcast-quality Korean
- ✅ File organization and workflow setup

### When to Use External Tools
- ✅ Initial translation of very long articles
- ✅ Quick rough drafts
- ✅ Simple content that doesn't need broadcast quality

---

## 📊 Token Usage Reference

| Task | Estimated Tokens | Efficiency |
|------|-----------------|------------|
| Export from Notion | 0 | ⭐⭐⭐⭐⭐ |
| Translate 100 lines | 2,000-3,000 | ⭐⭐⭐⭐ |
| Polish 50 lines | 1,000-2,000 | ⭐⭐⭐⭐⭐ |
| Retrieve full article | 15,000-35,000 | ⭐ |
| Full translation (300+ lines) | 10,000-15,000 | ⭐⭐ |

---

## 🔄 Example Workflow

**For a 200-line article:**

1. Export from Notion → `eileen_gu.md` (0 tokens)
2. "Translate lines 1-100 to Korean" (2,500 tokens)
3. "Translate lines 101-200 to Korean" (2,500 tokens)
4. "Quick quality check on the Korean file" (1,000 tokens)

**Total: ~6,000 tokens** vs. 35,000+ tokens for full retrieval!

---

## 📞 Quick Commands

Copy and paste these as needed:

```
Translate lines [X-Y] of [filename].md to Korean using the master prompt
```

```
Polish lines [X-Y] of [filename]_korean.md to remove translationese
```

```
Review [filename]_korean.md for broadcast quality
```

---

**Last Updated:** January 23, 2026
