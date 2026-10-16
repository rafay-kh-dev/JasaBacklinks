import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { FALLBACK_BLOGS } from "./Blog";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const DEFAULT_CATEGORIES = [
  { id: "cat-1", name: "PBN Strategy", color: "blue" },
  { id: "cat-2", name: "Regional .ID SEO", color: "red" },
  { id: "cat-3", name: "EDU & GOV Authority", color: "purple" },
  { id: "cat-4", name: "Case Studies", color: "green" },
];

const DEFAULT_MEDIA = [
  {
    id: "media-1",
    name: "SEO Analytics Dashboard",
    alt: "DA DR 50+ PBN SEO Analytics Dashboard",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    uploadedAt: "2026-10-12",
  },
  {
    id: "media-2",
    name: "Regional .ID SERP Growth",
    alt: "Indonesian Regional .ID Backlink Growth Chart",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    uploadedAt: "2026-10-14",
  },
  {
    id: "media-3",
    name: "Academic EDU Authority",
    alt: "High Trust EDU and GOV Backlink Infrastructure",
    url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
    uploadedAt: "2026-10-16",
  },
];

// Client-Side Image Compressor for Direct Laptop Uploads
function compressImageFile(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminBlog() {
  // --- SECURITY & AUTHENTICATION STATES ---
  const [authToken, setAuthToken] = useState(
    () => sessionStorage.getItem("jasa_admin_token") || ""
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [lockoutUntil, setLockoutUntil] = useState(() => {
    const saved = localStorage.getItem("jasa_admin_lockout");
    return saved ? Number(saved) : 0;
  });
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState(0);

  // --- WORKSPACE TAB STATE ---
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'articles' | 'media' | 'categories'

  // --- DATA STORE STATES ---
  const [blogs, setBlogs] = useState(FALLBACK_BLOGS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [mediaLibrary, setMediaLibrary] = useState(DEFAULT_MEDIA);

  // --- ARTICLE COMPOSER & SEO STATES ---
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [tagsInput, setTagsInput] = useState("DA/DR 50+, PBN Links, SEO");
  const [category, setCategory] = useState("PBN Strategy");
  const [author, setAuthor] = useState("SeoHub Technical Team");
  const [authorRole, setAuthorRole] = useState("Senior Link Strategist");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published");
  const [featured, setFeatured] = useState(false);
  const [serpDevice, setSerpDevice] = useState("desktop");
  const [previewMode, setPreviewMode] = useState(false);

  // --- CATEGORY & MEDIA UPLOAD STATES ---
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("blue");
  const [mediaUploadName, setMediaUploadName] = useState("");
  const [mediaUploadAlt, setMediaUploadAlt] = useState("");
  const [mediaExternalUrl, setMediaExternalUrl] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalTarget, setMediaModalTarget] = useState("featured"); // 'featured' | 'content'

  // --- UI FEEDBACK STATES ---
  const [statusBanner, setStatusBanner] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [openSeoGroup, setOpenSeoGroup] = useState({
    basic: true,
    additional: true,
    titleReadability: false,
    contentReadability: false,
  });

  const contentRef = useRef(null);

  // Live Lockout Countdown Timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const rem = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutSecondsLeft(rem);
      if (rem <= 0) {
        setLockoutUntil(0);
        localStorage.removeItem("jasa_admin_lockout");
        setAttemptsLeft(5);
        setAuthError("");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Verify token & load CMS data on mount
  const fetchCmsData = async (tokenToUse) => {
    const headers = { Authorization: `Bearer ${tokenToUse || authToken}` };
    try {
      const [blogsRes, catsRes, mediaRes] = await Promise.allSettled([
        axios.get(`${BACKEND_URL}/api/blogs`, { headers }),
        axios.get(`${BACKEND_URL}/api/categories`, { headers }),
        axios.get(`${BACKEND_URL}/api/media`, { headers }),
      ]);

      if (blogsRes.status === "fulfilled" && Array.isArray(blogsRes.value.data)) {
        setBlogs(blogsRes.value.data);
        localStorage.setItem(
          "jasa_blogs_cache",
          JSON.stringify(blogsRes.value.data)
        );
      }
      if (catsRes.status === "fulfilled" && Array.isArray(catsRes.value.data)) {
        setCategories(catsRes.value.data);
      }
      if (mediaRes.status === "fulfilled" && Array.isArray(mediaRes.value.data)) {
        setMediaLibrary(mediaRes.value.data);
      }
    } catch {
      // Fallback to local cache if offline
    }
  };

  useEffect(() => {
    if (!authToken) return;
    axios
      .get(`${BACKEND_URL}/api/admin/verify`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then(() => {
        setIsAuthenticated(true);
        fetchCmsData(authToken);
      })
      .catch(() => {
        sessionStorage.removeItem("jasa_admin_token");
        setAuthToken("");
        setIsAuthenticated(false);
      });
  }, [authToken]);

  // --- SECURE LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (lockoutSecondsLeft > 0) return;
    setAuthError("");

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/admin/login`, {
        password: passwordInput,
      });
      if (data && data.token) {
        sessionStorage.setItem("jasa_admin_token", data.token);
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setPasswordInput("");
        fetchCmsData(data.token);
      }
    } catch (err) {
      const resp = err.response?.data || {};
      if (resp.lockedUntil) {
        setLockoutUntil(resp.lockedUntil);
        localStorage.setItem("jasa_admin_lockout", String(resp.lockedUntil));
        setLockoutSecondsLeft(
          resp.remainingSeconds ||
            Math.ceil((resp.lockedUntil - Date.now()) / 1000)
        );
      }
      if (typeof resp.attemptsLeft === "number") {
        setAttemptsLeft(resp.attemptsLeft);
      }
      setAuthError(
        resp.error ||
          "Unauthorised access attempt blocked. Verify your ADMIN_PASSWORD."
      );
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/admin/logout`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } catch {
      // Ignore network error on logout
    }
    sessionStorage.removeItem("jasa_admin_token");
    setAuthToken("");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  // --- RANK MATH REAL-TIME SEO SCORING ENGINE (0 - 100) ---
  const seoAnalysis = useMemo(() => {
    const plainText = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = plainText ? plainText.split(" ") : [];
    const wordCount = words.length;
    const estimatedReadMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const kw = focusKeyword.trim().toLowerCase();
    const effectiveTitle = (seoTitle || title).trim();
    const titleLower = effectiveTitle.toLowerCase();
    const descLower = excerpt.trim().toLowerCase();
    const slugLower = slug.trim().toLowerCase();
    const kwSlug = kw.replace(/[^a-z0-9]+/g, "-");
    const plainLower = plainText.toLowerCase();

    // Keyword occurrences & density
    let kwCount = 0;
    if (kw && plainLower) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matches = plainLower.match(new RegExp(escaped, "gi"));
      kwCount = matches ? matches.length : 0;
    }
    const density =
      wordCount > 0 && kw
        ? Number(((kwCount * kw.split(" ").length) / wordCount) * 100).toFixed(2)
        : 0;

    // First 10% check
    const first10PercentText = words
      .slice(0, Math.max(40, Math.ceil(wordCount * 0.15)))
      .join(" ")
      .toLowerCase();
    const kwInFirst10 = Boolean(kw && first10PercentText.includes(kw));

    // Subheadings H2 / H3 check
    const subheadingMatches =
      content.match(/<h[23][^>]*>(.*?)<\/h[23]>/gi) || [];
    const subheadingsText = subheadingMatches.join(" ").toLowerCase();
    const kwInSubheadings = Boolean(kw && subheadingsText.includes(kw));

    // Links & Media check
    const hasInternalLink = /href=["'](\/|https?:\/\/(www\.)?jasabacklinks)/i.test(
      content
    );
    const hasExternalLink = /href=["']https?:\/\/(?!.*jasabacklinks)/i.test(
      content
    );
    const hasImageOrFeatured = Boolean(image.trim()) || /<img /i.test(content);
    const hasKeywordInAlt = Boolean(
      kw &&
        (imageAlt.toLowerCase().includes(kw) ||
          new RegExp(`alt=["'][^"']*${kw}`, "i").test(content))
    );

    // Readability checks
    const hasNumberInTitle = /\d+/.test(effectiveTitle);
    const powerWords = [
      "guide",
      "ultimate",
      "how",
      "proven",
      "scale",
      "authority",
      "case study",
      "dominate",
      "complete",
      "strategy",
      "boost",
      "fast",
    ];
    const hasPowerWord = powerWords.some((pw) => titleLower.includes(pw));
    const kwStartsTitle = Boolean(
      kw && titleLower.indexOf(kw) >= 0 && titleLower.indexOf(kw) <= 25
    );
    const hasListsOrQuotes = /<(ul|ol|blockquote)/i.test(content);

    const basicChecks = [
      {
        label: "Focus Keyword in SEO Title",
        passed: Boolean(kw && titleLower.includes(kw)),
        points: 12,
        hint: kw
          ? "Include your exact Focus Keyword inside the SEO Title."
          : "Enter a Focus Keyword above to start scoring.",
      },
      {
        label: "Focus Keyword inside SEO Meta Description",
        passed: Boolean(kw && descLower.includes(kw)),
        points: 10,
        hint: "Mention the Focus Keyword naturally in your Meta Description.",
      },
      {
        label: "Focus Keyword used in URL Slug",
        passed: Boolean(kwSlug && slugLower.includes(kwSlug)),
        points: 8,
        hint: "Keep your URL slug short and include the Focus Keyword.",
      },
      {
        label: "Focus Keyword appears in first 10% of content",
        passed: kwInFirst10,
        points: 8,
        hint: "Introduce your Focus Keyword in your opening paragraph.",
      },
      {
        label: `Content length (${wordCount} words — Target: 300+ words)`,
        passed: wordCount >= 300,
        points: 12,
        hint: "Write at least 300–600 words for strong topical authority.",
      },
    ];

    const additionalChecks = [
      {
        label: "Focus Keyword used in H2 or H3 Subheading",
        passed: kwInSubheadings,
        points: 8,
        hint: "Place your Focus Keyword inside at least one <h2> subheading.",
      },
      {
        label: `Keyword Density (${density}% — Ideal: 0.5% to 2.5%, Found ${kwCount}x)`,
        passed: kwCount >= 2 && Number(density) >= 0.4 && Number(density) <= 3.0,
        points: 8,
        hint: "Use your Focus Keyword 2–6 times naturally across the article.",
      },
      {
        label: "Featured Image & Keyword in Image Alt Text",
        passed: hasImageOrFeatured && hasKeywordInAlt,
        points: 6,
        hint: "Select a Featured Image and include the Focus Keyword in Alt Text.",
      },
      {
        label: "Internal Link to Jasa Backlinks Service Page",
        passed: hasInternalLink,
        points: 6,
        hint: "Link to at least one internal page (e.g. /services/homepage-post).",
      },
      {
        label: "Outbound Authority Reference Link",
        passed: hasExternalLink,
        points: 4,
        hint: "Add at least one external reference link to a trusted authority site.",
      },
      {
        label: `Meta Description length (${excerpt.trim().length} / 160 chars)`,
        passed:
          excerpt.trim().length >= 90 && excerpt.trim().length <= 165,
        points: 4,
        hint: "Keep your Meta Description between 90 and 160 characters.",
      },
    ];

    const titleChecks = [
      {
        label: "Focus Keyword near the beginning of SEO Title",
        passed: kwStartsTitle,
        points: 4,
        hint: "Place your primary keyword within the first half of the title.",
      },
      {
        label: `SEO Title length (${effectiveTitle.length} / 60 chars) & Power Word`,
        passed:
          effectiveTitle.length >= 30 &&
          effectiveTitle.length <= 65 &&
          hasPowerWord,
        points: 4,
        hint: "Keep title between 35–60 chars and include a power word (Guide, How, Scale).",
      },
      {
        label: "Number or Data Point in Title (e.g. 50+, 2026)",
        passed: hasNumberInTitle,
        points: 3,
        hint: "Numbers in headlines increase organic CTR in Google SERPs.",
      },
    ];

    const contentChecks = [
      {
        label: "Uses H2 Subheadings to structure sections",
        passed: subheadingMatches.length >= 2,
        points: 2,
        hint: "Use at least two <h2> headings for scannability.",
      },
      {
        label: "Uses Bullet Lists (<ul>) or Callout Blockquotes",
        passed: hasListsOrQuotes,
        points: 1,
        hint: "Break up walls of text with bullet lists or callout boxes.",
      },
    ];

    const allChecks = [
      ...basicChecks,
      ...additionalChecks,
      ...titleChecks,
      ...contentChecks,
    ];
    const totalScore = allChecks.reduce(
      (sum, item) => sum + (item.passed ? item.points : 0),
      0
    );

    return {
      score: Math.min(100, totalScore),
      wordCount,
      estimatedReadMinutes: `${estimatedReadMinutes} min read`,
      kwCount,
      density,
      basicChecks,
      additionalChecks,
      titleChecks,
      contentChecks,
    };
  }, [
    title,
    seoTitle,
    slug,
    focusKeyword,
    excerpt,
    content,
    image,
    imageAlt,
  ]);

  // Auto-generate slug & default SEO title when typing main title
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
    if (!seoTitle) {
      setSeoTitle(val);
    }
  };

  // Rich Content Formatting Toolbar Helper
  const insertTag = (openTag, closeTag = "", defaultText = "Your text here") => {
    const textarea = contentRef.current;
    if (!textarea) {
      setContent((prev) => `${prev}\n${openTag}${defaultText}${closeTag}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || defaultText;
    const replacement = `${openTag}${selected}${closeTag}`;
    const updated =
      content.substring(0, start) + replacement + content.substring(end);
    setContent(updated);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSeoTitle("");
    setSlug("");
    setFocusKeyword("");
    setTagsInput("DA/DR 50+, PBN Links, SEO");
    setCategory(categories[0]?.name || "PBN Strategy");
    setAuthor("SeoHub Technical Team");
    setAuthorRole("Senior Link Strategist");
    setImage("");
    setImageAlt("");
    setExcerpt("");
    setContent("");
    setStatus("published");
    setFeatured(false);
  };

  // --- SAVE / PUBLISH ARTICLE ---
  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    setStatusBanner(null);

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      seoTitle: (seoTitle || title).trim(),
      slug:
        slug.trim() ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      focusKeyword: focusKeyword.trim(),
      category,
      readTime: seoAnalysis.estimatedReadMinutes,
      author,
      authorRole,
      image:
        image ||
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      imageAlt: imageAlt || focusKeyword || title,
      excerpt:
        excerpt.trim() ||
        content.replace(/<[^>]+>/g, "").slice(0, 155) + "...",
      content,
      tags: parsedTags,
      status,
      featured,
      seoScore: seoAnalysis.score,
    };

    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      if (editingId) {
        await axios.put(`${BACKEND_URL}/api/blogs/${editingId}`, payload, {
          headers,
        });
        setStatusBanner({
          type: "success",
          text: `✓ Article updated! Rank Math SEO Score: ${seoAnalysis.score}/100`,
        });
      } else {
        await axios.post(`${BACKEND_URL}/api/blogs`, payload, { headers });
        setStatusBanner({
          type: "success",
          text: `✓ New article published live! Rank Math SEO Score: ${seoAnalysis.score}/100`,
        });
      }
      await fetchCmsData(authToken);
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatusBanner({
        type: "error",
        text:
          err.response?.data?.error ||
          "Failed to publish article. Check your admin session or backend server.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (post) => {
    setEditingId(post.id);
    setTitle(post.title || "");
    setSeoTitle(post.seoTitle || post.title || "");
    setSlug(post.slug || "");
    setFocusKeyword(post.focusKeyword || "");
    setTagsInput(
      Array.isArray(post.tags) ? post.tags.join(", ") : "DA/DR 50+, PBN Links"
    );
    setCategory(post.category || "PBN Strategy");
    setAuthor(post.author || "SeoHub Technical Team");
    setAuthorRole(post.authorRole || "Senior Link Strategist");
    setImage(post.image || "");
    setImageAlt(post.imageAlt || post.title || "");
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");
    setStatus(post.status || "published");
    setFeatured(Boolean(post.featured));
    setActiveTab("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Permanently delete this article?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await fetchCmsData(authToken);
      setStatusBanner({ type: "success", text: "✓ Article deleted." });
    } catch {
      setStatusBanner({ type: "error", text: "Could not delete article." });
    }
  };

  // --- CATEGORIES MANAGEMENT HANDLERS ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/categories`,
        { name: newCategoryName.trim(), color: newCategoryColor },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (data.categories) setCategories(data.categories);
      setCategory(newCategoryName.trim());
      setNewCategoryName("");
      setStatusBanner({
        type: "success",
        text: `✓ Category "${newCategoryName.trim()}" added!`,
      });
    } catch (err) {
      setStatusBanner({
        type: "error",
        text: err.response?.data?.error || "Could not create category.",
      });
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (categories.length <= 1) {
      alert("At least one category must remain.");
      return;
    }
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      const { data } = await axios.delete(
        `${BACKEND_URL}/api/categories/${encodeURIComponent(catId)}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (data.categories) setCategories(data.categories);
      setStatusBanner({
        type: "success",
        text: `✓ Category "${catName}" removed.`,
      });
    } catch {
      setStatusBanner({ type: "error", text: "Could not delete category." });
    }
  };

  // --- MEDIA LIBRARY UPLOAD HANDLERS ---
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMedia(true);
    try {
      const compressedDataUrl = await compressImageFile(file);
      const cleanName =
        mediaUploadName.trim() || file.name.replace(/\.[^/.]+$/, "");
      const cleanAlt =
        mediaUploadAlt.trim() || focusKeyword || cleanName;

      const { data } = await axios.post(
        `${BACKEND_URL}/api/media`,
        { name: cleanName, alt: cleanAlt, url: compressedDataUrl },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (data.media) setMediaLibrary(data.media);
      setMediaUploadName("");
      setMediaUploadAlt("");
      setStatusBanner({
        type: "success",
        text: `✓ Image "${cleanName}" uploaded and optimised to Media Library!`,
      });
    } catch {
      setStatusBanner({
        type: "error",
        text: "Failed to upload image file.",
      });
    } finally {
      setIsUploadingMedia(false);
      e.target.value = "";
    }
  };

  const handleExternalMediaSave = async (e) => {
    e.preventDefault();
    if (!mediaExternalUrl.trim()) return;
    setIsUploadingMedia(true);
    try {
      const cleanName = mediaUploadName.trim() || "External SEO Image";
      const cleanAlt = mediaUploadAlt.trim() || focusKeyword || cleanName;
      const { data } = await axios.post(
        `${BACKEND_URL}/api/media`,
        { name: cleanName, alt: cleanAlt, url: mediaExternalUrl.trim() },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (data.media) setMediaLibrary(data.media);
      setMediaExternalUrl("");
      setMediaUploadName("");
      setMediaUploadAlt("");
      setStatusBanner({
        type: "success",
        text: "✓ Image added to Media Library!",
      });
    } catch {
      setStatusBanner({ type: "error", text: "Could not save image URL." });
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (id) => {
    try {
      const { data } = await axios.delete(`${BACKEND_URL}/api/media/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (data.media) setMediaLibrary(data.media);
    } catch {
      // Ignore error
    }
  };

  const handleSelectMediaItem = (item) => {
    if (mediaModalTarget === "featured") {
      setImage(item.url);
      setImageAlt(item.alt || item.name);
    } else {
      insertTag(
        `<figure class="my-6">\n  <img src="${item.url}" alt="${
          item.alt || item.name
        }" class="w-full rounded-[16px] border border-[#e8eaed]" />\n  <figcaption class="text-center text-[12px] text-[#5f6368] mt-2">`,
        `</figcaption>\n</figure>\n`,
        item.alt || item.name
      );
    }
    setIsMediaModalOpen(false);
  };

  // Score Ring Colour Helper
  const scoreColor =
    seoAnalysis.score >= 80
      ? {
          ring: "#34a853",
          bg: "bg-[#e6f4ea]",
          text: "text-[#1e8e3e]",
          label: "Great (Rank Ready)",
        }
      : seoAnalysis.score >= 55
        ? {
            ring: "#fbbc04",
            bg: "bg-[#fef7e0]",
            text: "text-[#b06000]",
            label: "Good (Needs Polish)",
          }
        : {
            ring: "#ea4335",
            bg: "bg-[#fce8e6]",
            text: "text-[#d93025]",
            label: "Needs Optimisation",
          };

  // ============================================================================
  // VIEW 1: BULLETPROOF ADMIN LOGIN GATE WITH BRUTE-FORCE LOCKOUT PROTECTION
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <main className="w-full min-h-[90vh] bg-[#f8f9fa] flex items-center justify-center px-4 pt-[76px] pb-12">
        <div className="w-full max-w-[440px] bg-white rounded-[26px] border border-[#dadce0] shadow-[0_20px_60px_rgba(60,64,67,0.10)] overflow-hidden">
          <div className="grid grid-cols-4 h-[4px] w-full">
            <div className="bg-[#4285F4]" />
            <div className="bg-[#EA4335]" />
            <div className="bg-[#FBBC04]" />
            <div className="bg-[#34A853]" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[11.5px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
                256-Bit Encrypted Admin Gate
              </span>
              <span className="text-[11px] font-medium text-[#5f6368] bg-[#f8f9fa] px-2.5 py-1 rounded-full border border-[#e8eaed]">
                Max 5 Attempts
              </span>
            </div>

            <h2 className="gw-font-display text-[24px] sm:text-[26px] font-medium text-[#202124] mb-1">
              SeoHub Ltd CMS Login
            </h2>
            <p className="text-[13px] text-[#5f6368] mb-6 leading-relaxed">
              Protected by automated IP rate-limiting. Unauthorised publishing
              is strictly blocked at the server level.
            </p>

            {lockoutSecondsLeft > 0 ? (
              <div className="p-4 rounded-[16px] bg-[#fce8e6] border border-[#fad2cf] text-center space-y-2 mb-4">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-[#d93025] text-white px-2.5 py-0.5 rounded-full">
                  Security Lockout Active
                </span>
                <h2 className="gw-font-display text-[18px] font-medium text-[#d93025]">
                  Too Many Failed Attempts
                </h2>
                <p className="text-[12.5px] text-[#3c4043]">
                  Your IP address is temporarily locked. Please wait{" "}
                  <strong className="font-mono text-[#d93025]">
                    {Math.floor(lockoutSecondsLeft / 60)}m{" "}
                    {lockoutSecondsLeft % 60}s
                  </strong>{" "}
                  before trying again.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[12.5px] font-medium text-[#3c4043]">
                      Administrator Master Password *
                    </label>
                    <span className="text-[11px] font-semibold text-[#1e8e3e]">
                      {attemptsLeft} / 5 attempts left
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter ADMIN_PASSWORD"
                      className="w-full pl-3.5 pr-16 py-3 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[12px] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-[14px] text-[#202124]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11.5px] font-semibold text-[#5f6368] hover:text-[#1a73e8] cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-[12px] bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-[12px] font-medium">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="gw-font-display w-full h-[50px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-[14.5px] shadow-[0_6px_20px_rgba(26,115,232,0.25)] transition-all cursor-pointer"
                >
                  Authenticate & Unlock Studio →
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ============================================================================
  // VIEW 2: FULL ENTERPRISE CMS, MEDIA LIBRARY & RANK MATH SEO SUITE
  // ============================================================================
  return (
    <main className="w-full bg-[#f8f9fa] min-h-screen pt-[74px] pb-20 px-3.5 sm:px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* --- TOP ADMIN COMMAND HEADER & NAVIGATION TABS --- */}
        <div className="bg-white rounded-[22px] border border-[#dadce0] p-4 sm:p-5 mb-6 shadow-[0_4px_20px_rgba(60,64,67,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[14px] bg-[#e8f0fe] text-[#1a73e8] font-bold text-[15px] flex items-center justify-center shrink-0">
              CMS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1e8e3e] bg-[#e6f4ea] px-2.5 py-0.5 rounded-full">
                  ● Token Verified
                </span>
                <span className="text-[11px] text-[#5f6368]">
                  SeoHub Ltd Publishing Suite
                </span>
              </div>
              <h2 className="gw-font-display text-[20px] sm:text-[23px] font-medium text-[#202124]">
                Jasa Backlinks Editorial & Rank Math Studio
              </h2>
            </div>
          </div>

          {/* 4 Workspace Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#f8f9fa] p-1.5 rounded-[16px] border border-[#e8eaed]">
            {[
              { id: "editor", label: "1. Article & Rank Math Studio" },
              { id: "articles", label: `2. Articles (${blogs.length})` },
              { id: "media", label: `3. Media Library (${mediaLibrary.length})` },
              { id: "categories", label: `4. Categories (${categories.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-[12px] text-[12px] sm:text-[12.5px] font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#1a73e8] text-white shadow-xs font-semibold"
                    : "text-[#5f6368] hover:text-[#202124] hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/blog"
              target="_blank"
              className="px-3.5 py-2 rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[12px] font-medium text-[#202124]"
            >
              Live Blog ↗
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-full bg-[#fce8e6] hover:bg-[#fad2cf] text-[#d93025] text-[12px] font-semibold cursor-pointer"
            >
              Lock Session
            </button>
          </div>
        </div>

        {/* Status Alert Banner */}
        {statusBanner && (
          <div
            className={`mb-6 p-4 rounded-[16px] border text-[13.5px] font-medium flex items-center justify-between ${
              statusBanner.type === "error"
                ? "bg-[#fce8e6] border-[#fad2cf] text-[#d93025]"
                : "bg-[#e6f4ea] border-[#ceead6] text-[#137333]"
            }`}
          >
            <span>{statusBanner.text}</span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-[12px] underline cursor-pointer ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ====================================================================
            TAB 1: ARTICLE STUDIO + RANK MATH REAL-TIME SEO DETECTOR
            ==================================================================== */}
        {activeTab === "editor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT 7 COLUMNS: ARTICLE COMPOSER & SERP SNIPPET EDITOR */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-[24px] border border-[#dadce0] shadow-xs overflow-hidden">
                <div className="grid grid-cols-4 h-[4px] w-full">
                  <div className="bg-[#4285F4]" />
                  <div className="bg-[#EA4335]" />
                  <div className="bg-[#FBBC04]" />
                  <div className="bg-[#34A853]" />
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#e8eaed]">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] block">
                        {editingId ? "Editing Existing Article" : "New SEO Article"}
                      </span>
                      <h2 className="gw-font-display text-[20px] font-medium text-[#202124]">
                        Content & Metadata Composer
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="px-3.5 py-1.5 rounded-full bg-[#f8f9fa] border border-[#dadce0] text-[12px] font-medium text-[#202124] hover:bg-[#e8f0fe] hover:text-[#1a73e8] cursor-pointer"
                      >
                        {previewMode ? "← Edit HTML" : "👁 Live Preview"}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="text-[12px] font-semibold text-[#d93025] hover:underline cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSavePost} className="space-y-4">
                    {/* Article H1 Headline */}
                    <div>
                      <label className="block text-[12.5px] font-medium text-[#3c4043] mb-1">
                        Article Headline (H1 Title) *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. How DA/DR 50+ Homepage PBN Backlinks Drive Page-1 Rankings in 2026"
                        className="w-full px-3.5 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[12px] text-[14.5px] font-medium text-[#202124] focus:outline-none focus:border-[#1a73e8]"
                      />
                    </div>

                    {/* Category, Status & Author Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[12.5px] font-medium text-[#3c4043]">
                            Category *
                          </label>
                          <button
                            type="button"
                            onClick={() => setActiveTab("categories")}
                            className="text-[11px] font-semibold text-[#1a73e8] hover:underline cursor-pointer"
                          >
                            + Manage
                          </button>
                        </div>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[10px] text-[13px] text-[#202124]"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12.5px] font-medium text-[#3c4043] mb-1">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-[10px] text-[13px]"
                        />
                      </div>

                      <div>
                        <label className="block text-[12.5px] font-medium text-[#3c4043] mb-1">
                          Publish Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-[10px] text-[13px]"
                        >
                          <option value="published">Published (Live)</option>
                          <option value="draft">Draft (Hidden)</option>
                        </select>
                      </div>
                    </div>

                    {/* Featured Image + Media Library Picker + Alt Text */}
                    <div className="p-4 rounded-[16px] bg-[#f8fbff] border border-[#d2e3fc] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-[12.5px] font-semibold text-[#1a73e8]">
                          Featured Cover Image & SEO Alt Attribute
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setMediaModalTarget("featured");
                            setIsMediaModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-full bg-[#1a73e8] text-white text-[11.5px] font-medium hover:bg-[#1557b0] cursor-pointer"
                        >
                          🖼 Choose / Upload from Media Library
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="Paste image URL or select from Media Library..."
                          className="w-full px-3 py-2 bg-white border border-[#dadce0] rounded-[10px] text-[12.5px]"
                        />
                        <input
                          type="text"
                          value={imageAlt}
                          onChange={(e) => setImageAlt(e.target.value)}
                          placeholder="Image Alt Text (Include Focus Keyword)..."
                          className="w-full px-3 py-2 bg-white border border-[#dadce0] rounded-[10px] text-[12.5px]"
                        />
                      </div>

                      {image && (
                        <div className="flex items-center gap-3 pt-1">
                          <img
                            src={image}
                            alt={imageAlt || "Preview"}
                            className="w-20 h-14 object-cover rounded-[8px] border border-[#dadce0]"
                          />
                          <div className="text-[11.5px] text-[#5f6368]">
                            <p className="font-semibold text-[#202124]">
                              Alt: {imageAlt || "No alt text set"}
                            </p>
                            <button
                              type="button"
                              onClick={() => setImage("")}
                              className="text-[#d93025] hover:underline cursor-pointer"
                            >
                              Remove Image
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Rich Formatting Toolbar & Content Editor */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <label className="text-[12.5px] font-medium text-[#3c4043]">
                          Article Content ({seoAnalysis.wordCount} words •{" "}
                          {seoAnalysis.estimatedReadMinutes}) *
                        </label>
                        <div className="flex flex-wrap items-center gap-1 bg-[#f1f3f4] p-1 rounded-[10px]">
                          <button
                            type="button"
                            onClick={() =>
                              insertTag(
                                "<h2>",
                                "</h2>\n",
                                focusKeyword
                                  ? `Why ${focusKeyword} Drive Rankings`
                                  : "Section Subheading"
                              )
                            }
                            className="px-2.5 py-1 rounded bg-white text-[11px] font-semibold text-[#202124] hover:bg-[#e8f0fe] hover:text-[#1a73e8] cursor-pointer"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTag("<h3>", "</h3>\n", "Key Takeaway")
                            }
                            className="px-2.5 py-1 rounded bg-white text-[11px] font-semibold text-[#202124] hover:bg-[#e8f0fe] cursor-pointer"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTag("<p>", "</p>\n")}
                            className="px-2.5 py-1 rounded bg-white text-[11px] font-medium text-[#202124] hover:bg-[#e8f0fe] cursor-pointer"
                          >
                            Paragraph
                          </button>
                          <button
                            type="button"
                            onClick={() => insertTag("<strong>", "</strong>")}
                            className="px-2.5 py-1 rounded bg-white text-[11px] font-bold text-[#202124] hover:bg-[#e8f0fe] cursor-pointer"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTag(
                                "<ul>\n  <li><strong>Point 1:</strong> ",
                                "</li>\n  <li><strong>Point 2:</strong> High authority placement</li>\n</ul>\n"
                              )
                            }
                            className="px-2.5 py-1 rounded bg-white text-[11px] font-medium text-[#202124] hover:bg-[#e8f0fe] cursor-pointer"
                          >
                            • List
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTag("<blockquote>", "</blockquote>\n")
                            }
                            className="px-2.5 py-1 rounded bg-white text-[11px] font-medium text-[#202124] hover:bg-[#e8f0fe] cursor-pointer"
                          >
                            Quote
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTag(
                                '<a href="/services/homepage-post">',
                                "</a>",
                                "DA/DR 50+ Homepage Post service"
                              )
                            }
                            className="px-2.5 py-1 rounded bg-white text-[11px] font-medium text-[#1a73e8] hover:bg-[#e8f0fe] cursor-pointer"
                          >
                            + Internal Link
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertTag(
                                '<a href="https://developers.google.com/search" target="_blank" rel="noopener noreferrer">',
                                "</a>",
                                "Google Search Central"
                              )
                            }
                            className="px-2.5 py-1 rounded bg-white text-[11px] font-medium text-[#1e8e3e] hover:bg-[#e6f4ea] cursor-pointer"
                          >
                            + External Link
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMediaModalTarget("content");
                              setIsMediaModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-white text-[11px] font-medium text-[#9334e6] hover:bg-[#f3e8fd] cursor-pointer"
                          >
                            + Image
                          </button>
                        </div>
                      </div>

                      {previewMode ? (
                        <div
                          className="p-5 rounded-[14px] bg-[#fcfcfc] border border-[#dadce0] min-h-[260px] prose max-w-none text-[14.5px] leading-relaxed space-y-3"
                          dangerouslySetInnerHTML={{
                            __html:
                              content ||
                              "<p class='text-[#9aa0a6]'>Nothing to preview yet...</p>",
                          }}
                        />
                      ) : (
                        <textarea
                          ref={contentRef}
                          rows="12"
                          required
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write your SEO article here using the formatting buttons above..."
                          className="w-full px-3.5 py-3 bg-[#f8f9fa] focus:bg-white border border-[#dadce0] rounded-[12px] text-[13.5px] font-mono leading-relaxed focus:outline-none focus:border-[#1a73e8]"
                        />
                      )}
                    </div>

                    {/* Article Topic Tags */}
                    <div>
                      <label className="block text-[12.5px] font-medium text-[#3c4043] mb-1">
                        Article Topic Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="DA/DR 50+, Homepage Links, Google.co.id"
                        className="w-full px-3.5 py-2 bg-[#f8f9fa] border border-[#dadce0] rounded-[10px] text-[13px]"
                      />
                    </div>

                    {/* Rank Math SERP Snippet Editor Box */}
                    <div className="p-4 sm:p-5 rounded-[18px] bg-[#f8f9fa] border border-[#e8eaed] space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] block">
                            Rank Math Snippet Editor
                          </span>
                          <h2 className="gw-font-display text-[16px] font-medium text-[#202124]">
                            Google SERP Preview
                          </h2>
                        </div>
                        <div className="inline-flex rounded-full bg-white p-0.5 border border-[#dadce0]">
                          {["desktop", "mobile"].map((dev) => (
                            <button
                              key={dev}
                              type="button"
                              onClick={() => setSerpDevice(dev)}
                              className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize cursor-pointer ${
                                serpDevice === dev
                                  ? "bg-[#1a73e8] text-white"
                                  : "text-[#5f6368]"
                              }`}
                            >
                              {dev}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Google SERP Preview Card */}
                      <div
                        className={`bg-white p-4 rounded-[14px] border border-[#dadce0] shadow-2xs ${
                          serpDevice === "mobile" ? "max-w-[360px]" : "w-full"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-[12px] text-[#202124] mb-1">
                          <span className="w-6 h-6 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-bold text-[11px] flex items-center justify-center">
                            J
                          </span>
                          <div className="truncate">
                            <span className="font-medium block leading-none">
                              Jasa Backlinks
                            </span>
                            <span className="text-[11px] text-[#5f6368]">
                              https://jasabacklinks.com › blog ›{" "}
                              {slug || "article-slug"}
                            </span>
                          </div>
                        </div>
                        <h2 className="text-[18px] text-[#1a0dab] font-normal leading-snug hover:underline truncate">
                          {seoTitle ||
                            title ||
                            "Your SEO Title Will Appear Here | Jasa Backlinks"}
                        </h2>
                        <p className="text-[13px] text-[#4d5156] line-clamp-2 mt-1 leading-snug">
                          {excerpt ||
                            content.replace(/<[^>]+>/g, "").slice(0, 155) ||
                            "Write a compelling meta description containing your Focus Keyword to maximise organic click-through rate in Google search."}
                        </p>
                      </div>

                      {/* SEO Title, Slug & Meta Description Inputs with Character Progress Bars */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[12px] mb-1">
                            <span className="font-medium text-[#3c4043]">
                              SEO Title
                            </span>
                            <span
                              className={`font-semibold ${
                                (seoTitle || title).length > 60
                                  ? "text-[#d93025]"
                                  : "text-[#1e8e3e]"
                              }`}
                            >
                              {(seoTitle || title).length} / 60 chars
                            </span>
                          </div>
                          <input
                            type="text"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            placeholder="Custom SEO Title..."
                            className="w-full px-3 py-2 bg-white border border-[#dadce0] rounded-[10px] text-[13px]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[12px] mb-1">
                            <span className="font-medium text-[#3c4043]">
                              Permalink Slug *
                            </span>
                            <span className="text-[#5f6368] text-[11px]">
                              /blog/{slug || "your-slug"}
                            </span>
                          </div>
                          <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#dadce0] rounded-[10px] text-[12.5px] font-mono"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[12px] mb-1">
                            <span className="font-medium text-[#3c4043]">
                              Meta Description / Excerpt *
                            </span>
                            <span
                              className={`font-semibold ${
                                excerpt.length > 160
                                  ? "text-[#d93025]"
                                  : excerpt.length >= 90
                                    ? "text-[#1e8e3e]"
                                    : "text-[#f29900]"
                              }`}
                            >
                              {excerpt.length} / 160 chars
                            </span>
                          </div>
                          <textarea
                            rows="2"
                            required
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Write a 120–155 character summary including your Focus Keyword..."
                            className="w-full px-3 py-2 bg-white border border-[#dadce0] rounded-[10px] text-[13px]"
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 accent-[#1a73e8]"
                      />
                      <span className="text-[13px] font-medium text-[#3c4043]">
                        Pin as Flagship Featured Article on /blog
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="gw-font-display w-full h-[52px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-[15px] shadow-[0_6px_20px_rgba(26,115,232,0.25)] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSaving
                        ? "Publishing to Live Website..."
                        : editingId
                          ? `Update Article (SEO Score: ${seoAnalysis.score}/100) →`
                          : `Publish Article Live (SEO Score: ${seoAnalysis.score}/100) →`}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLUMNS: RANK MATH SEO DETECTOR & SCORING ENGINE */}
            <aside className="lg:col-span-5 lg:sticky lg:top-[84px] space-y-5">
              <div className="bg-white rounded-[24px] border border-[#dadce0] shadow-[0_8px_30px_rgba(60,64,67,0.06)] overflow-hidden">
                <div className="grid grid-cols-4 h-[4px] w-full">
                  <div className="bg-[#4285F4]" />
                  <div className="bg-[#EA4335]" />
                  <div className="bg-[#FBBC04]" />
                  <div className="bg-[#34A853]" />
                </div>

                <div className="p-5 sm:p-6">
                  {/* Top Score Gauge Header */}
                  <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-[#e8eaed]">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] block">
                        Real-Time SEO Detector
                      </span>
                      <h2 className="gw-font-display text-[20px] font-medium text-[#202124]">
                        Rank Math SEO Score
                      </h2>
                      <span
                        className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-1 ${scoreColor.bg} ${scoreColor.text}`}
                      >
                        {scoreColor.label}
                      </span>
                    </div>

                    {/* Circular Score Gauge */}
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#f1f3f4]"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          stroke={scoreColor.ring}
                          strokeWidth="3.5"
                          strokeDasharray={`${seoAnalysis.score}, 100`}
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="gw-font-display text-[20px] font-bold text-[#202124] leading-none">
                          {seoAnalysis.score}
                        </span>
                        <span className="text-[9.5px] text-[#5f6368] font-semibold">
                          / 100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Focus Keyword Input Box */}
                  <div className="mb-4 p-3.5 rounded-[14px] bg-[#f8fbff] border border-[#d2e3fc]">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[12px] font-semibold text-[#1a73e8]">
                        Focus Keyword *
                      </label>
                      <span className="text-[11px] text-[#5f6368]">
                        Density:{" "}
                        <strong className="text-[#202124]">
                          {seoAnalysis.density}%
                        </strong>{" "}
                        ({seoAnalysis.kwCount}x)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g. homepage pbn backlinks"
                      className="w-full px-3 py-2 bg-white border border-[#dadce0] rounded-[10px] text-[13px] font-medium text-[#202124] focus:outline-none focus:border-[#1a73e8]"
                    />
                  </div>

                  {/* Quick Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="p-2.5 rounded-[12px] bg-[#f8f9fa] border border-[#e8eaed]">
                      <span className="block text-[10px] uppercase text-[#5f6368]">
                        Words
                      </span>
                      <span className="gw-font-display text-[15px] font-bold text-[#202124]">
                        {seoAnalysis.wordCount}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-[12px] bg-[#f8f9fa] border border-[#e8eaed]">
                      <span className="block text-[10px] uppercase text-[#5f6368]">
                        Read Time
                      </span>
                      <span className="gw-font-display text-[14px] font-bold text-[#1a73e8]">
                        {seoAnalysis.estimatedReadMinutes}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-[12px] bg-[#f8f9fa] border border-[#e8eaed]">
                      <span className="block text-[10px] uppercase text-[#5f6368]">
                        Checks Passed
                      </span>
                      <span className="gw-font-display text-[15px] font-bold text-[#1e8e3e]">
                        {
                          [
                            ...seoAnalysis.basicChecks,
                            ...seoAnalysis.additionalChecks,
                            ...seoAnalysis.titleChecks,
                            ...seoAnalysis.contentChecks,
                          ].filter((c) => c.passed).length
                        }{" "}
                        / 16
                      </span>
                    </div>
                  </div>

                  {/* 4 Collapsible Rank Math Audit Groups */}
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {[
                      {
                        key: "basic",
                        title: "Basic SEO",
                        items: seoAnalysis.basicChecks,
                      },
                      {
                        key: "additional",
                        title: "Additional SEO",
                        items: seoAnalysis.additionalChecks,
                      },
                      {
                        key: "titleReadability",
                        title: "Title Readability",
                        items: seoAnalysis.titleChecks,
                      },
                      {
                        key: "contentReadability",
                        title: "Content Readability",
                        items: seoAnalysis.contentChecks,
                      },
                    ].map((group) => {
                      const failedCount = group.items.filter(
                        (i) => !i.passed
                      ).length;
                      const isOpen = openSeoGroup[group.key];
                      return (
                        <div
                          key={group.key}
                          className="rounded-[14px] border border-[#e8eaed] overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenSeoGroup((prev) => ({
                                ...prev,
                                [group.key]: !prev[group.key],
                              }))
                            }
                            className="w-full px-3.5 py-2.5 bg-[#f8f9fa] flex items-center justify-between text-left cursor-pointer"
                          >
                            <span className="gw-font-display text-[13px] font-medium text-[#202124]">
                              {group.title}
                            </span>
                            <span
                              className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${
                                failedCount === 0
                                  ? "bg-[#e6f4ea] text-[#1e8e3e]"
                                  : "bg-[#fce8e6] text-[#d93025]"
                              }`}
                            >
                              {failedCount === 0
                                ? "✓ All Passed"
                                : `${failedCount} Errors`}
                            </span>
                          </button>

                          {isOpen && (
                            <div className="p-3 bg-white space-y-2.5 divide-y divide-[#f1f3f4]">
                              {group.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="pt-2 first:pt-0 flex items-start gap-2.5"
                                >
                                  <span
                                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                      item.passed
                                        ? "bg-[#e6f4ea] text-[#1e8e3e]"
                                        : "bg-[#fce8e6] text-[#d93025]"
                                    }`}
                                  >
                                    {item.passed ? "✓" : "✕"}
                                  </span>
                                  <div>
                                    <p className="text-[12px] font-medium text-[#202124] leading-snug">
                                      {item.label}
                                    </p>
                                    {!item.passed && (
                                      <p className="text-[11px] text-[#5f6368] mt-0.5">
                                        {item.hint}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ====================================================================
            TAB 2: PUBLISHED & DRAFT ARTICLES MANAGER
            ==================================================================== */}
        {activeTab === "articles" && (
          <div className="bg-white rounded-[24px] border border-[#dadce0] p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#e8eaed]">
              <div>
                <h2 className="gw-font-display text-[20px] font-medium text-[#202124]">
                  All Articles ({blogs.length})
                </h2>
                <p className="text-[13px] text-[#5f6368]">
                  Manage, edit, or delete published and draft SEO articles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab("editor");
                }}
                className="px-5 py-2.5 rounded-full bg-[#1a73e8] text-white text-[13px] font-medium cursor-pointer"
              >
                + Write New Article
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogs.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[18px] border border-[#e8eaed] bg-[#f8f9fa] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-[150px] w-full bg-[#e8eaed] relative">
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-white/95 text-[#1a73e8] text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="absolute top-2.5 right-2.5 bg-[#1e8e3e] text-white text-[10.5px] font-bold px-2.5 py-0.5 rounded-full">
                        SEO: {item.seoScore || 90}/100
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-[11px] text-[#5f6368] block mb-1">
                        {item.publishedAt} • {item.readTime}
                      </span>
                      <h2 className="gw-font-display text-[15.5px] font-medium text-[#202124] line-clamp-2 mb-2">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-white border-t border-[#e8eaed] flex items-center justify-between text-[12px]">
                    <Link
                      to={`/blog/${item.slug}`}
                      target="_blank"
                      className="text-[#5f6368] hover:text-[#1a73e8] font-medium"
                    >
                      View Live ↗
                    </Link>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditClick(item)}
                        className="font-semibold text-[#1a73e8] hover:underline cursor-pointer"
                      >
                        Edit in Studio
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(item.id)}
                        className="font-semibold text-[#d93025] hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: MEDIA LIBRARY & IMAGE UPLOADER
            ==================================================================== */}
        {activeTab === "media" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Columns: Upload From Computer or External URL */}
            <div className="lg:col-span-5 bg-white rounded-[24px] border border-[#dadce0] p-5 sm:p-6 space-y-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] block">
                  Auto-Compressed Uploader
                </span>
                <h2 className="gw-font-display text-[20px] font-medium text-[#202124]">
                  Upload to Media Library
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#3c4043] mb-1">
                    Image Title / File Label
                  </label>
                  <input
                    type="text"
                    value={mediaUploadName}
                    onChange={(e) => setMediaUploadName(e.target.value)}
                    placeholder="e.g. Ahrefs DR 50+ Proof Screenshot"
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#dadce0] rounded-[10px] text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#3c4043] mb-1">
                    SEO Alt Text (Recommended)
                  </label>
                  <input
                    type="text"
                    value={mediaUploadAlt}
                    onChange={(e) => setMediaUploadAlt(e.target.value)}
                    placeholder="e.g. homepage pbn backlinks dr 50 growth"
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#dadce0] rounded-[10px] text-[13px]"
                  />
                </div>

                {/* Direct File Dropzone */}
                <label className="block border-2 border-dashed border-[#1a73e8] bg-[#f8fbff] hover:bg-[#e8f0fe]/60 rounded-[16px] p-6 text-center cursor-pointer transition-colors">
                  <span className="block gw-font-display text-[14px] font-medium text-[#1a73e8] mb-1">
                    {isUploadingMedia
                      ? "Compressing & Uploading..."
                      : "📁 Click to Upload Image from Computer"}
                  </span>
                  <span className="block text-[11.5px] text-[#5f6368]">
                    PNG, JPG, WebP (Auto-optimised to 1200px HD)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <form
                onSubmit={handleExternalMediaSave}
                className="pt-4 border-t border-[#e8eaed] space-y-3"
              >
                <label className="block text-[12px] font-medium text-[#3c4043]">
                  Or Import Image via Direct URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={mediaExternalUrl}
                    onChange={(e) => setMediaExternalUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-[#f8f9fa] border border-[#dadce0] rounded-[10px] text-[13px]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-[10px] bg-[#202124] text-white text-[12.5px] font-medium cursor-pointer"
                  >
                    Save URL
                  </button>
                </div>
              </form>
            </div>

            {/* Right 7 Columns: Media Gallery Grid */}
            <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#dadce0] p-5 sm:p-6">
              <h2 className="gw-font-display text-[19px] font-medium text-[#202124] mb-4">
                Saved Media Assets ({mediaLibrary.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mediaLibrary.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[16px] border border-[#e8eaed] overflow-hidden bg-[#f8f9fa] flex flex-col justify-between"
                  >
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="w-full h-[150px] object-cover bg-white"
                    />
                    <div className="p-3.5">
                      <p className="text-[13px] font-semibold text-[#202124] truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#5f6368] truncate mb-3">
                        Alt: {item.alt}
                      </p>
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#e8eaed]">
                        <button
                          type="button"
                          onClick={() => {
                            setImage(item.url);
                            setImageAlt(item.alt);
                            setActiveTab("editor");
                          }}
                          className="text-[11.5px] font-semibold text-[#1a73e8] hover:underline cursor-pointer"
                        >
                          Use as Featured
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(item.id)}
                          className="text-[11.5px] font-semibold text-[#d93025] hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: CATEGORIES & TAXONOMY MANAGER
            ==================================================================== */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-white rounded-[24px] border border-[#dadce0] p-6">
              <h2 className="gw-font-display text-[20px] font-medium text-[#202124] mb-1">
                Create New Category
              </h2>
              <p className="text-[13px] text-[#5f6368] mb-5">
                Add new blog categories to organise your SEO guides and case
                studies.
              </p>

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#3c4043] mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Technical SEO & AI Search"
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-[10px] text-[13.5px]"
                  />
                </div>

                <div>
                  <label className="block text-[12.5px] font-medium text-[#3c4043] mb-1">
                    Accent Colour Theme
                  </label>
                  <select
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-[10px] text-[13.5px]"
                  >
                    <option value="blue">Google Blue (#1a73e8)</option>
                    <option value="red"> Regional Red (#ea4335)</option>
                    <option value="purple">Institutional Purple (#9334e6)</option>
                    <option value="green">Verified Green (#34a853)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="gw-font-display w-full h-[46px] rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-medium cursor-pointer"
                >
                  + Add Category
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#dadce0] p-6">
              <h2 className="gw-font-display text-[20px] font-medium text-[#202124] mb-4">
                Active Blog Categories ({categories.length})
              </h2>

              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3.5 rounded-[14px] bg-[#f8f9fa] border border-[#e8eaed]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#1a73e8]" />
                      <span className="gw-font-display text-[15px] font-medium text-[#202124]">
                        {cat.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="text-[12px] font-semibold text-[#d93025] hover:bg-[#fce8e6] px-3 py-1 rounded-full cursor-pointer"
                    >
                      Delete Category
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- QUICK MEDIA PICKER MODAL FOR EDITOR --- */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#202124]/60 backdrop-blur-xs"
            onClick={() => setIsMediaModalOpen(false)}
          />
          <div className="relative w-full max-w-[720px] max-h-[88vh] overflow-y-auto bg-white rounded-[24px] border border-[#dadce0] p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8eaed]">
              <h2 className="gw-font-display text-[19px] font-medium text-[#202124]">
                Select or Upload Image (
                {mediaModalTarget === "featured"
                  ? "Featured Cover"
                  : "Insert into Article"}
                )
              </h2>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="text-[#5f6368] hover:text-[#202124] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <label className="block mb-5 border-2 border-dashed border-[#1a73e8] bg-[#f8fbff] rounded-[14px] p-4 text-center cursor-pointer">
              <span className="text-[13.5px] font-semibold text-[#1a73e8]">
                {isUploadingMedia
                  ? "Uploading & Optimising..."
                  : "+ Upload New Image from Computer"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {mediaLibrary.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectMediaItem(item)}
                  className="group cursor-pointer rounded-[14px] border border-[#e8eaed] hover:border-[#1a73e8] overflow-hidden bg-[#f8f9fa]"
                >
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-[110px] object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-2.5">
                    <p className="text-[12px] font-semibold text-[#202124] truncate">
                      {item.name}
                    </p>
                    <span className="text-[11px] text-[#1a73e8] font-medium">
                      Click to Select →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}