/* =========================================================
   ROJGAR SETU — script.js
   Plain JavaScript, no frameworks, no backend.
   All data (jobs, accounts, applications) lives in this
   browser's localStorage so the demo works once it's hosted
   on GitHub Pages or opened directly as a file.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. CONSTANTS & SEED DATA
  --------------------------------------------------------- */
  const STORAGE_KEYS = {
    jobs: "rs_jobs",
    users: "rs_users",
    applications: "rs_applications",
    currentUser: "rs_current_user",
    pendingSearch: "rs_pending_search"
  };

  const CATEGORIES = [
    "Technology", "Marketing", "Design", "Sales",
    "Finance", "Customer Support", "Human Resources", "Operations"
  ];

  const CATEGORY_ICONS = {
    "Technology": '<path d="M8 6L3 12l5 6M16 6l5 6-5 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    "Marketing": '<path d="M3 10v4h3l5 4V6l-5 4H3z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M16 9a3 3 0 010 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    "Design": '<path d="M3 21l4-1 11-11-3-3L4 17l-1 4z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M14 6l3 3" stroke="currentColor" stroke-width="2"/>',
    "Sales": '<path d="M3 17l5-5 4 4 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 9h5v5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    "Finance": '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 9h5M9 12h6M9 15h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    "Customer Support": '<path d="M4 13a8 8 0 1116 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="2" y="13" width="4" height="6" rx="1" stroke="currentColor" stroke-width="2" fill="none"/><rect x="18" y="13" width="4" height="6" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>',
    "Human Resources": '<circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="16" cy="8" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M2 20c0-3 2.7-5 6-5s6 2 6 5M12 20c0-3 2.7-5 6-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    "Operations": '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  };

  const SEED_JOBS = [
    { id: 1, title: "Frontend Developer", company: "NimbusTech Solutions", category: "Technology", location: "Bengaluru, Karnataka", type: "Remote", experience: "1-3 years", salaryMin: 6, salaryMax: 10, postedDaysAgo: 2,
      description: "Build and maintain the customer-facing dashboard used by over 40,000 small businesses. You'll work closely with design and backend teams to ship features every two weeks.",
      requirements: ["2+ years building production web apps with HTML, CSS and JavaScript", "Comfortable with a modern framework such as React or Vue", "Can read a Figma file and turn it into responsive markup", "Writes clear pull request descriptions and reviews others' code"] },
    { id: 2, title: "Backend Developer (Node.js)", company: "NimbusTech Solutions", category: "Technology", location: "Bengaluru, Karnataka", type: "Full-time", experience: "3-5 years", salaryMin: 9, salaryMax: 14, postedDaysAgo: 5,
      description: "Own the API layer that powers our mobile and web clients. You'll design database schemas, write integration tests and help keep response times under 200ms.",
      requirements: ["3+ years with Node.js and a relational database such as PostgreSQL", "Experience designing REST or GraphQL APIs", "Understands authentication, rate limiting and basic security practices", "Has deployed and monitored a service in production"] },
    { id: 3, title: "Digital Marketing Executive", company: "Skyline Retail", category: "Marketing", location: "Pune, Maharashtra", type: "Full-time", experience: "1-3 years", salaryMin: 3.5, salaryMax: 5, postedDaysAgo: 1,
      description: "Plan and run paid campaigns across Google and Meta for our 30+ retail stores, and report weekly on cost per lead and conversion rate.",
      requirements: ["1-3 years running Google Ads or Meta Ads campaigns", "Comfortable reading analytics dashboards and pulling weekly reports", "Basic copywriting skills for ad creatives", "Knows how to use Canva or a similar design tool"] },
    { id: 4, title: "Social Media Manager", company: "BrightWave Media", category: "Marketing", location: "Mumbai, Maharashtra", type: "Full-time", experience: "1-3 years", salaryMin: 4, salaryMax: 6.5, postedDaysAgo: 6,
      description: "Plan a monthly content calendar across Instagram, LinkedIn and YouTube for three client brands, and manage a small team of freelance creators.",
      requirements: ["Managed a brand's social channels for at least a year", "Comfortable briefing designers and video editors", "Tracks engagement metrics and adjusts strategy monthly", "Available for occasional shoot days on weekends"] },
    { id: 5, title: "UI/UX Designer", company: "PixelCraft Studio", category: "Design", location: "Hyderabad, Telangana", type: "Full-time", experience: "1-3 years", salaryMin: 5, salaryMax: 8, postedDaysAgo: 3,
      description: "Design end-to-end flows for fintech and healthtech clients, from low-fidelity wireframes through to a polished, developer-ready Figma file.",
      requirements: ["A portfolio showing at least two shipped products", "Strong command of Figma, including components and auto-layout", "Can run a basic usability test and act on the findings", "Comfortable presenting design decisions to non-designers"] },
    { id: 6, title: "Graphic Designer", company: "PixelCraft Studio", category: "Design", location: "Hyderabad, Telangana", type: "Part-time", experience: "Fresher", salaryMin: 2.4, salaryMax: 3.6, postedDaysAgo: 8,
      description: "Produce social posts, brochures and presentation decks for our marketing team, working roughly 20 hours a week with flexible hours.",
      requirements: ["A short portfolio of poster, social or print design work", "Working knowledge of Adobe Photoshop or Illustrator", "Can take feedback and turn around revisions within a day", "Open to freshers — training is provided"] },
    { id: 7, title: "Field Sales Executive", company: "Skyline Retail", category: "Sales", location: "Indore, Madhya Pradesh", type: "Full-time", experience: "Fresher", salaryMin: 2.5, salaryMax: 4, postedDaysAgo: 0,
      description: "Visit local kirana stores and small retailers to onboard them onto our supply ordering app, with a daily target of eight store visits.",
      requirements: ["Comfortable with daily travel within the city", "Basic spoken Hindi and English", "Owns a two-wheeler with a valid licence", "No prior experience required — incentives paid on top of fixed salary"] },
    { id: 8, title: "Business Development Associate", company: "Vantage Finserv", category: "Sales", location: "Delhi, Delhi", type: "Full-time", experience: "1-3 years", salaryMin: 4, salaryMax: 6, postedDaysAgo: 4,
      description: "Generate and close leads for our SME lending product, working a monthly pipeline target alongside a team of six.",
      requirements: ["1+ years in a B2B sales or lending role", "Comfortable making 30+ calls a day", "Tracks pipeline accurately in a CRM", "Good written English for proposal emails"] },
    { id: 9, title: "Accounts Executive", company: "Vantage Finserv", category: "Finance", location: "Delhi, Delhi", type: "Full-time", experience: "1-3 years", salaryMin: 3.6, salaryMax: 5, postedDaysAgo: 7,
      description: "Handle day-to-day bookkeeping, vendor payments and GST filings for the Delhi office, reporting to the finance manager.",
      requirements: ["B.Com or equivalent with 1-3 years of accounting experience", "Working knowledge of Tally or Zoho Books", "Understands GST filing and basic TDS rules", "Comfortable with Excel, including pivot tables"] },
    { id: 10, title: "Financial Analyst", company: "Meridian Capital", category: "Finance", location: "Mumbai, Maharashtra", type: "Full-time", experience: "3-5 years", salaryMin: 8, salaryMax: 12, postedDaysAgo: 9,
      description: "Build financial models and valuation reports for mid-market companies, working directly with two senior analysts on live deals.",
      requirements: ["3-5 years in equity research, investment banking or FP&A", "Strong Excel modelling skills, including DCF and comparables", "CFA Level 1 or equivalent preferred but not required", "Comfortable presenting findings to clients"] },
    { id: 11, title: "Customer Support Associate", company: "HelpDesk India", category: "Customer Support", location: "Indore, Madhya Pradesh", type: "Full-time", experience: "Fresher", salaryMin: 2.2, salaryMax: 3.2, postedDaysAgo: 1,
      description: "Answer chat and phone queries for an e-commerce client, aiming to resolve most tickets within one conversation.",
      requirements: ["Clear spoken and written English and Hindi", "Comfortable working rotational shifts, including some weekends", "Basic computer literacy — typing speed of 30+ wpm", "Patient, calm tone even with frustrated customers"] },
    { id: 12, title: "HR Generalist", company: "Skyline Retail", category: "Human Resources", location: "Pune, Maharashtra", type: "Full-time", experience: "1-3 years", salaryMin: 4, salaryMax: 6, postedDaysAgo: 5,
      description: "Manage recruitment, onboarding and employee queries for our Pune retail cluster of around 150 staff.",
      requirements: ["1-3 years in an HR generalist or recruitment role", "Comfortable running interviews and reference checks", "Familiar with basic labour law and leave policy", "Organised — can manage onboarding for multiple hires at once"] },
    { id: 13, title: "Operations Coordinator", company: "HelpDesk India", category: "Operations", location: "Hyderabad, Telangana", type: "Full-time", experience: "1-3 years", salaryMin: 3.8, salaryMax: 5.5, postedDaysAgo: 2,
      description: "Coordinate daily scheduling between support agents and clients, and maintain the reporting sheet used in weekly reviews.",
      requirements: ["1-3 years in an operations or coordination role", "Strong Excel or Google Sheets skills", "Comfortable juggling multiple priorities in a day", "Clear written communication for client-facing updates"] }
  ];

  /* ---------------------------------------------------------
     2. STORAGE HELPERS
  --------------------------------------------------------- */
  function loadJobs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.jobs);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore corrupt data */ }
    localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(SEED_JOBS));
    return SEED_JOBS.slice();
  }
  function saveJobs() { localStorage.setItem(STORAGE_KEYS.jobs, JSON.stringify(jobs)); }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || []; }
    catch (e) { return []; }
  }
  function saveUsers(u) { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(u)); }

  function loadApplications() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.applications)) || []; }
    catch (e) { return []; }
  }
  function saveApplications(a) { localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(a)); }

  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.currentUser)); }
    catch (e) { return null; }
  }
  function setCurrentUser(u) {
    if (u) localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEYS.currentUser);
  }

  let jobs = loadJobs();
  let users = loadUsers();
  let applications = loadApplications();

  const activeFilters = { category: new Set(), jobtype: new Set(), experience: new Set(), location: "", keyword: "" };
  let currentModalJobId = null;

  /* ---------------------------------------------------------
     3. SMALL HELPERS
  --------------------------------------------------------- */
  function qs(sel, scope) { return (scope || document).querySelector(sel); }
  function qsa(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }
  function on(el, evt, fn) { if (el) el.addEventListener(evt, fn); }

  function initials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function formatSalary(job) {
    if (job.salaryDisplay) return job.salaryDisplay;
    if (job.salaryMin && job.salaryMax) return "\u20B9" + job.salaryMin + "\u2013" + job.salaryMax + " LPA";
    if (job.salaryMin) return "From \u20B9" + job.salaryMin + " LPA";
    return "Salary not disclosed";
  }

  function formatPosted(days) {
    if (days === 0) return "Posted today";
    if (days === 1) return "Posted yesterday";
    return "Posted " + days + " days ago";
  }

  function cityOf(location) {
    return (location || "").split(",")[0].trim();
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  /* ---------------------------------------------------------
     4. TOASTS
  --------------------------------------------------------- */
  function showToast(message, type) {
    const container = qs("#toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast" + (type ? " " + type : "");
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = "0";
      setTimeout(function () { toast.remove(); }, 200);
    }, 3200);
  }

  /* ---------------------------------------------------------
     5. NAVIGATION (simple show/hide router)
  --------------------------------------------------------- */
  function navigateTo(pageName) {
    qsa(".page").forEach(function (p) { p.classList.remove("active"); });
    const target = qs("#page-" + pageName);
    if (target) target.classList.add("active");

    qsa(".nav-link").forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("data-nav") === pageName);
    });

    qs("#nav-links").classList.remove("open");
    qs("#hamburger-btn").setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "auto" });

    if (pageName === "jobs") {
      applyPendingSearch();
      renderJobsList();
    }
    if (pageName === "post-job") {
      resetPostJobForm();
    }
  }

  function applyPendingSearch() {
    let pending = null;
    try { pending = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.pendingSearch)); } catch (e) { /* ignore */ }
    if (!pending) return;
    sessionStorage.removeItem(STORAGE_KEYS.pendingSearch);
    activeFilters.keyword = pending.keyword || "";
    activeFilters.location = "";
    qs("#jobs-keyword").value = pending.keyword || "";
    qs("#jobs-keyword-location").value = pending.location || "";
    if (pending.location) {
      const loc = qsa("#filter-location option").find(function (o) {
        return o.value.toLowerCase() === pending.location.toLowerCase();
      });
      if (loc) { qs("#filter-location").value = loc.value; activeFilters.location = loc.value; }
    }
  }

  /* ---------------------------------------------------------
     6. RENDER: CATEGORIES
  --------------------------------------------------------- */
  function categoryCount(cat) { return jobs.filter(function (j) { return j.category === cat; }).length; }

  function renderCategoriesGrid() {
    const grid = qs("#categories-grid");
    if (!grid) return;
    grid.innerHTML = CATEGORIES.map(function (cat) {
      const icon = CATEGORY_ICONS[cat] || "";
      return '<button type="button" class="category-tile" data-category="' + escapeHtml(cat) + '">' +
        '<span class="category-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' + icon + '</svg></span>' +
        '<span class="category-name">' + escapeHtml(cat) + '</span>' +
        '<span class="category-count">' + categoryCount(cat) + ' open roles</span>' +
        '</button>';
    }).join("");
  }

  function renderFilterCategoryList() {
    const list = qs("#filter-category-list");
    if (!list) return;
    list.innerHTML = CATEGORIES.map(function (cat) {
      const checked = activeFilters.category.has(cat) ? " checked" : "";
      return '<label class="checkbox-row"><input type="checkbox" name="category" value="' + escapeHtml(cat) + '"' + checked + '> ' + escapeHtml(cat) + ' (' + categoryCount(cat) + ')</label>';
    }).join("");
  }

  /* ---------------------------------------------------------
     7. RENDER: JOB CARDS / ROWS
  --------------------------------------------------------- */
  function jobCardHTML(job) {
    const newTag = job.postedDaysAgo <= 1 ? '<span class="new-tag">New</span>' : "";
    return '<article class="job-card">' +
      '<div class="job-card-top">' +
        '<div class="job-badge">' + escapeHtml(initials(job.company)) + '</div>' +
        '<div><h3 class="job-title">' + escapeHtml(job.title) + '</h3>' +
        '<div class="job-company">' + escapeHtml(job.company) + '</div></div>' +
      '</div>' +
      '<div class="job-meta">' +
        '<span class="meta-pill type">' + escapeHtml(job.type) + '</span>' +
        '<span class="meta-pill">' + escapeHtml(job.location) + '</span>' +
        '<span class="meta-pill">' + escapeHtml(job.experience) + '</span>' +
      '</div>' +
      '<div class="job-salary">' + formatSalary(job) + '</div>' +
      '<div class="job-bottom">' +
        '<span class="job-posted">' + formatPosted(job.postedDaysAgo) + newTag + '</span>' +
        '<button type="button" class="btn btn-outline btn-sm" data-open-job="' + job.id + '">View role</button>' +
      '</div>' +
    '</article>';
  }

  function jobRowHTML(job) {
    const newTag = job.postedDaysAgo <= 1 ? '<span class="new-tag">New</span>' : "";
    return '<article class="job-row">' +
      '<div class="job-badge">' + escapeHtml(initials(job.company)) + '</div>' +
      '<div class="job-row-main">' +
        '<h3 class="job-title">' + escapeHtml(job.title) + '</h3>' +
        '<div class="job-company">' + escapeHtml(job.company) + '</div>' +
        '<div class="job-meta" style="margin-top:8px;">' +
          '<span class="meta-pill type">' + escapeHtml(job.type) + '</span>' +
          '<span class="meta-pill">' + escapeHtml(job.location) + '</span>' +
          '<span class="meta-pill">' + escapeHtml(job.experience) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="job-row-actions">' +
        '<div class="job-salary">' + formatSalary(job) + '</div>' +
        '<span class="job-posted">' + formatPosted(job.postedDaysAgo) + newTag + '</span>' +
        '<button type="button" class="btn btn-primary btn-sm" data-open-job="' + job.id + '">View &amp; apply</button>' +
      '</div>' +
    '</article>';
  }

  function renderFeaturedJobs() {
    const grid = qs("#featured-jobs-grid");
    if (!grid) return;
    const featured = jobs.slice().sort(function (a, b) { return a.postedDaysAgo - b.postedDaysAgo; }).slice(0, 3);
    grid.innerHTML = featured.map(jobCardHTML).join("");
  }

  /* ---------------------------------------------------------
     8. JOBS PAGE: FILTERING, SORTING, RENDERING
  --------------------------------------------------------- */
  function populateLocationFilter() {
    const select = qs("#filter-location");
    if (!select) return;
    const cities = Array.from(new Set(jobs.map(function (j) { return cityOf(j.location); }))).sort();
    select.innerHTML = '<option value="">All locations</option>' +
      cities.map(function (c) { return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>'; }).join("");
  }

  function getFilteredJobs() {
    const keyword = (activeFilters.keyword || "").toLowerCase().trim();
    let list = jobs.filter(function (job) {
      if (activeFilters.category.size && !activeFilters.category.has(job.category)) return false;
      if (activeFilters.jobtype.size && !activeFilters.jobtype.has(job.type)) return false;
      if (activeFilters.experience.size && !activeFilters.experience.has(job.experience)) return false;
      if (activeFilters.location && cityOf(job.location) !== activeFilters.location) return false;
      if (keyword) {
        const haystack = (job.title + " " + job.company + " " + job.description).toLowerCase();
        if (haystack.indexOf(keyword) === -1) return false;
      }
      return true;
    });

    const sortVal = qs("#sort-jobs") ? qs("#sort-jobs").value : "newest";
    list = list.slice().sort(function (a, b) {
      if (sortVal === "salary-high") return (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0);
      if (sortVal === "salary-low") return (a.salaryMin || a.salaryMax || 0) - (b.salaryMin || b.salaryMax || 0);
      return a.postedDaysAgo - b.postedDaysAgo;
    });
    return list;
  }

  function renderJobsList() {
    const listEl = qs("#jobs-list");
    const emptyEl = qs("#jobs-empty");
    const countEl = qs("#results-count");
    if (!listEl) return;
    const filtered = getFilteredJobs();

    countEl.innerHTML = "Showing <b>" + filtered.length + "</b> of " + jobs.length + " jobs";

    if (filtered.length === 0) {
      listEl.style.display = "none";
      emptyEl.style.display = "block";
    } else {
      listEl.style.display = "flex";
      emptyEl.style.display = "none";
      listEl.innerHTML = filtered.map(jobRowHTML).join("");
    }
  }

  function clearAllFilters() {
    activeFilters.category.clear();
    activeFilters.jobtype.clear();
    activeFilters.experience.clear();
    activeFilters.location = "";
    activeFilters.keyword = "";
    qsa('input[name="jobtype"], input[name="experience"], input[name="category"]').forEach(function (i) { i.checked = false; });
    if (qs("#filter-location")) qs("#filter-location").value = "";
    if (qs("#jobs-keyword")) qs("#jobs-keyword").value = "";
    if (qs("#jobs-keyword-location")) qs("#jobs-keyword-location").value = "";
    renderFilterCategoryList();
    bindCategoryCheckboxes();
    renderJobsList();
  }

  function bindCategoryCheckboxes() {
    qsa('#filter-category-list input[name="category"]').forEach(function (cb) {
      on(cb, "change", function () {
        if (cb.checked) activeFilters.category.add(cb.value); else activeFilters.category.delete(cb.value);
        renderJobsList();
      });
    });
  }

  /* ---------------------------------------------------------
     9. MODAL: JOB DETAILS + APPLY
  --------------------------------------------------------- */
  function openJobModal(jobId) {
    const job = jobs.find(function (j) { return j.id === jobId; });
    if (!job) return;
    currentModalJobId = jobId;

    qs("#modal-job-title").textContent = job.title;
    qs("#modal-job-company").textContent = job.company + " \u2014 " + job.location;
    qs("#modal-job-meta").innerHTML =
      '<span class="meta-pill type">' + escapeHtml(job.type) + '</span>' +
      '<span class="meta-pill">' + escapeHtml(job.category) + '</span>' +
      '<span class="meta-pill">' + escapeHtml(job.experience) + '</span>';
    qs("#modal-job-salary").textContent = formatSalary(job) + " \u00B7 " + formatPosted(job.postedDaysAgo);
    qs("#modal-job-description").textContent = job.description;
    qs("#modal-job-requirements").innerHTML = (job.requirements || []).map(function (r) {
      return "<li>" + escapeHtml(r) + "</li>";
    }).join("");

    qs("#apply-section").style.display = "block";
    qs("#apply-form").style.display = "none";
    qs("#apply-success").classList.remove("show");
    qs("#apply-form").reset();

    const me = getCurrentUser();
    if (me) {
      qs("#apply-name").value = me.name || "";
      qs("#apply-email").value = me.email || "";
    }

    qs("#job-modal").classList.add("show");
    qs("#modal-close-btn").focus();
  }

  function closeJobModal() {
    qs("#job-modal").classList.remove("show");
    currentModalJobId = null;
  }

  /* ---------------------------------------------------------
     10. AUTH: NAV STATE, LOGIN, REGISTER, LOGOUT
  --------------------------------------------------------- */
  function updateNavForAuth() {
    const me = getCurrentUser();
    const actions = qs("#nav-actions");
    if (!actions) return;

    if (me) {
      actions.innerHTML =
        '<div class="nav-user">' +
          '<div class="nav-avatar">' + escapeHtml(initials(me.name)) + '</div>' +
          '<div><span class="nav-user-name">' + escapeHtml(me.name) + '</span><span class="nav-user-role">' + escapeHtml(me.role) + '</span></div>' +
        '</div>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="logout-btn">Log out</button>' +
        '<a href="#" class="btn btn-primary btn-sm" data-nav="post-job">Post a job</a>';
      on(qs("#logout-btn"), "click", function () {
        setCurrentUser(null);
        updateNavForAuth();
        showToast("Logged out successfully", "success");
        navigateTo("home");
      });
    } else {
      actions.innerHTML =
        '<a href="#" class="btn btn-ghost btn-sm" data-nav="login">Log in</a>' +
        '<a href="#" class="btn btn-outline btn-sm" data-nav="register">Register</a>' +
        '<a href="#" class="btn btn-primary btn-sm" data-nav="post-job">Post a job</a>';
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    const email = qs("#login-email").value.trim().toLowerCase();
    const password = qs("#login-password").value;
    const errorEl = qs("#login-error");

    const match = users.find(function (u) { return u.email.toLowerCase() === email && u.password === password; });
    if (!match) {
      errorEl.textContent = "No account matches that email and password. Check your details or create an account.";
      errorEl.classList.add("show");
      return;
    }
    errorEl.classList.remove("show");
    setCurrentUser({ name: match.name, email: match.email, role: match.role });
    updateNavForAuth();
    showToast("Welcome back, " + match.name.split(" ")[0] + "!", "success");
    qs("#login-form").reset();
    navigateTo("home");
  }

  function handleRegister(e) {
    e.preventDefault();
    const name = qs("#reg-name").value.trim();
    const email = qs("#reg-email").value.trim().toLowerCase();
    const password = qs("#reg-password").value;
    const confirm = qs("#reg-confirm").value;
    const role = qs('input[name="role"]:checked').value;
    const errorEl = qs("#register-error");

    function fail(msg) { errorEl.textContent = msg; errorEl.classList.add("show"); }

    if (password.length < 6) { fail("Use a password with at least 6 characters."); return; }
    if (password !== confirm) { fail("Those passwords don't match. Try again."); return; }
    if (users.some(function (u) { return u.email.toLowerCase() === email; })) {
      fail("An account with this email already exists. Try logging in instead.");
      return;
    }

    errorEl.classList.remove("show");
    users.push({ name: name, email: email, password: password, role: role });
    saveUsers(users);
    setCurrentUser({ name: name, email: email, role: role });
    updateNavForAuth();
    showToast("Account created \u2014 welcome, " + name.split(" ")[0] + "!", "success");
    qs("#register-form").reset();
    navigateTo("home");
  }

  /* ---------------------------------------------------------
     11. POST A JOB FORM
  --------------------------------------------------------- */
  function resetPostJobForm() {
    qs("#post-job-form").style.display = "block";
    qs("#post-job-success").classList.remove("show");
    qsa("#post-job-form .form-group").forEach(function (g) { g.classList.remove("invalid"); });
  }

  function markField(inputEl, isValid) {
    const group = inputEl.closest(".form-group");
    if (group) group.classList.toggle("invalid", !isValid);
    return isValid;
  }

  function handlePostJob(e) {
    e.preventDefault();
    const company = qs("#pj-company");
    const title = qs("#pj-title");
    const category = qs("#pj-category");
    const location = qs("#pj-location");
    const type = qs("#pj-type");
    const experience = qs("#pj-experience");
    const description = qs("#pj-description");
    const email = qs("#pj-email");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = true;
    valid = markField(company, company.value.trim() !== "") && valid;
    valid = markField(title, title.value.trim() !== "") && valid;
    valid = markField(category, category.value !== "") && valid;
    valid = markField(location, location.value.trim() !== "") && valid;
    valid = markField(type, type.value !== "") && valid;
    valid = markField(experience, experience.value !== "") && valid;
    valid = markField(description, description.value.trim() !== "") && valid;
    valid = markField(email, emailPattern.test(email.value.trim())) && valid;

    if (!valid) {
      showToast("Check the highlighted fields and try again.", "error");
      return;
    }

    const skillsRaw = qs("#pj-skills").value.trim();
    const requirements = skillsRaw ? skillsRaw.split(",").map(function (s) { return s.trim(); }).filter(Boolean).map(function (s) { return "Comfortable with " + s; }) : [];
    const salaryMin = parseFloat(qs("#pj-salary-min").value) || null;
    const salaryMax = parseFloat(qs("#pj-salary-max").value) || null;

    const newJob = {
      id: Date.now(),
      title: title.value.trim(),
      company: company.value.trim(),
      category: category.value,
      location: location.value.trim(),
      type: type.value,
      experience: experience.value,
      salaryMin: salaryMin,
      salaryMax: salaryMax,
      postedDaysAgo: 0,
      description: description.value.trim(),
      requirements: requirements,
      contactEmail: email.value.trim()
    };

    jobs.unshift(newJob);
    saveJobs();

    renderCategoriesGrid();
    renderFeaturedJobs();
    populateLocationFilter();
    renderFilterCategoryList();
    bindCategoryCheckboxes();
    updateStats();

    qs("#post-job-form").reset();
    qs("#post-job-form").style.display = "none";
    qs("#post-job-success").classList.add("show");
    showToast("Job posted successfully!", "success");
  }

  /* ---------------------------------------------------------
     12. APPLY FORM (inside modal)
  --------------------------------------------------------- */
  function handleApplySubmit(e) {
    e.preventDefault();
    const job = jobs.find(function (j) { return j.id === currentModalJobId; });
    if (!job) return;

    const name = qs("#apply-name").value.trim();
    const email = qs("#apply-email").value.trim();
    const phone = qs("#apply-phone").value.trim();
    const note = qs("#apply-note").value.trim();

    if (!name || !email || !phone) {
      showToast("Fill in your name, email and phone to apply.", "error");
      return;
    }

    applications.push({
      jobId: job.id, jobTitle: job.title, company: job.company,
      name: name, email: email, phone: phone, note: note,
      appliedAt: new Date().toISOString()
    });
    saveApplications(applications);

    qs("#apply-form").style.display = "none";
    qs("#apply-success").classList.add("show");
    showToast("Application submitted!", "success");
  }

  /* ---------------------------------------------------------
     13. CONTACT FORM (About page)
  --------------------------------------------------------- */
  function handleContactSubmit(e) {
    e.preventDefault();
    const name = qs("#contact-name").value.trim();
    const email = qs("#contact-email").value.trim();
    const message = qs("#contact-message").value.trim();
    if (!name || !email || !message) {
      showToast("Fill in every field before sending.", "error");
      return;
    }
    showToast("Message received \u2014 we'll write back soon.", "success");
    qs("#contact-form").reset();
  }

  /* ---------------------------------------------------------
     14. STATS + BRIDGE COUNTER
  --------------------------------------------------------- */
  function animateCount(el, to) {
    const from = 0;
    const duration = 700;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(from + (to - from) * progress);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function updateStats(animate) {
    const companies = new Set(jobs.map(function (j) { return j.company; })).size;
    const cities = new Set(jobs.map(function (j) { return cityOf(j.location); })).size;

    if (animate) {
      animateCount(qs("#stat-jobs"), jobs.length);
      animateCount(qs("#stat-companies"), companies);
      animateCount(qs("#stat-cities"), cities);
    } else {
      qs("#stat-jobs").textContent = jobs.length;
      qs("#stat-companies").textContent = companies;
      qs("#stat-cities").textContent = cities;
    }
    qs("#bridge-count").textContent = jobs.length + " jobs crossing today";
  }

  /* ---------------------------------------------------------
     15. EVENT WIRING
  --------------------------------------------------------- */
  function wireEvents() {
    // Global nav (delegated, covers links added dynamically too)
    document.addEventListener("click", function (e) {
      const navTarget = e.target.closest("[data-nav]");
      if (navTarget) {
        e.preventDefault();
        navigateTo(navTarget.getAttribute("data-nav"));
        return;
      }
      const openBtn = e.target.closest("[data-open-job]");
      if (openBtn) {
        openJobModal(parseInt(openBtn.getAttribute("data-open-job"), 10));
        return;
      }
      const catTile = e.target.closest("[data-category]");
      if (catTile) {
        const cat = catTile.getAttribute("data-category");
        activeFilters.category = new Set([cat]);
        navigateTo("jobs");
        renderFilterCategoryList();
        bindCategoryCheckboxes();
        renderJobsList();
      }
    });

    // Hamburger menu
    on(qs("#hamburger-btn"), "click", function () {
      const nav = qs("#nav-links");
      const isOpen = nav.classList.toggle("open");
      qs("#hamburger-btn").setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Hero search -> jobs page
    on(qs("#hero-search-form"), "submit", function (e) {
      e.preventDefault();
      sessionStorage.setItem(STORAGE_KEYS.pendingSearch, JSON.stringify({
        keyword: qs("#hero-keyword").value.trim(),
        location: qs("#hero-location").value.trim()
      }));
      navigateTo("jobs");
    });

    // Jobs page search
    on(qs("#jobs-search-form"), "submit", function (e) {
      e.preventDefault();
      activeFilters.keyword = qs("#jobs-keyword").value.trim();
      const typed = qs("#jobs-keyword-location").value.trim();
      if (typed) {
        const match = qsa("#filter-location option").find(function (o) { return o.value.toLowerCase() === typed.toLowerCase(); });
        activeFilters.location = match ? match.value : "";
        qs("#filter-location").value = activeFilters.location;
      }
      renderJobsList();
    });

    // Filter checkboxes for job type / experience (static in HTML)
    qsa('input[name="jobtype"]').forEach(function (cb) {
      on(cb, "change", function () {
        if (cb.checked) activeFilters.jobtype.add(cb.value); else activeFilters.jobtype.delete(cb.value);
        renderJobsList();
      });
    });
    qsa('input[name="experience"]').forEach(function (cb) {
      on(cb, "change", function () {
        if (cb.checked) activeFilters.experience.add(cb.value); else activeFilters.experience.delete(cb.value);
        renderJobsList();
      });
    });
    on(qs("#filter-location"), "change", function () {
      activeFilters.location = qs("#filter-location").value;
      renderJobsList();
    });
    on(qs("#sort-jobs"), "change", renderJobsList);
    on(qs("#clear-filters-btn"), "click", clearAllFilters);
    on(qs("#empty-clear-btn"), "click", clearAllFilters);

    // Modal
    on(qs("#modal-close-btn"), "click", closeJobModal);
    on(qs("#job-modal"), "click", function (e) { if (e.target.id === "job-modal") closeJobModal(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && qs("#job-modal").classList.contains("show")) closeJobModal();
    });
    on(qs("#show-apply-form-btn"), "click", function () {
      qs("#apply-section").style.display = "none";
      qs("#apply-form").style.display = "block";
    });
    on(qs("#cancel-apply-btn"), "click", function () {
      qs("#apply-form").style.display = "none";
      qs("#apply-section").style.display = "block";
    });
    on(qs("#apply-form"), "submit", handleApplySubmit);

    // Forms
    on(qs("#post-job-form"), "submit", handlePostJob);
    on(qs("#post-job-view-btn"), "click", function () { navigateTo("jobs"); });
    on(qs("#login-form"), "submit", handleLogin);
    on(qs("#register-form"), "submit", handleRegister);
    on(qs("#contact-form"), "submit", handleContactSubmit);

    // Radio pill highlight (register page)
    qsa(".radio-pill input").forEach(function (input) {
      on(input, "change", function () {
        qsa(".radio-pill").forEach(function (label) { label.classList.remove("checked"); });
        input.closest(".radio-pill").classList.add("checked");
      });
      if (input.checked) input.closest(".radio-pill").classList.add("checked");
    });
  }

  /* ---------------------------------------------------------
     16. INIT
  --------------------------------------------------------- */
  function init() {
    renderCategoriesGrid();
    renderFeaturedJobs();
    populateLocationFilter();
    renderFilterCategoryList();
    bindCategoryCheckboxes();
    renderJobsList();
    updateNavForAuth();
    wireEvents();
    updateStats(true);
  }

  document.addEventListener("DOMContentLoaded", init);
})();