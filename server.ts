import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Enquiry, BlogPost, FAQItem, SystemSettings } from "./src/types";

// Initialize express app
const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Default Admin Password (can be changed in settings)
let ADMIN_PASSWORD = "admin";

// Lazy-initialize Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Gemini Client initialized successfully.");
    } else {
      console.warn("GEMINI_API_KEY is not defined. AI features will run in Sandbox Simulation Mode.");
    }
  }
  return aiClient;
}

// Database initial seeding
const seedBlogs: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Power of Play-Based Learning: A Nordic Perspective",
    category: "Nordic Education",
    excerpt: "Discover why Finland's early childhood curriculum relies heavily on play and explore its implementation in modern Indian classrooms.",
    content: `## The Power of Play-Based Learning: A Nordic Perspective

In Finland, early childhood education is not about memorization or drills. Instead, it is centered around a simple, powerful concept: **play is the natural way for a child to learn.**

According to research supported by the Finnish Way Academy, structured and free play in early childhood develops critical pathways in a child's brain:
1. **Social & Emotional Intelligence**: Children learn negotiation, turn-taking, and empathy through collaborative games.
2. **Problem Solving**: Setting up a block tower or playing role-play scenarios requires creative reasoning and hypothesis testing.
3. **Resilience**: Experiencing minor set-backs during play (like a tower falling) in a low-stakes environment builds stress-management skills.

### Bringing Finland to India
At KinderBee, we bridge the gap between rigorous academic expectations and healthy child development. By introducing the Nordic-inspired Play-Based Learning framework, we prepare preschoolers for the future of education, fostering lifetime curiosity and compliance with India's NEP 2020 guidelines.

*Want to learn more? Our Finnish Way Academy Teacher Training program equips school staff with practical play strategies.*`,
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800",
    author: "Elina Virtanen (Nordic Curriculum Lead)",
    date: "2026-08-01",
    readTime: "5 min read",
    views: 1420
  },
  {
    id: "blog-2",
    title: "Why Investing in Early Education is India's Smartest Business Move",
    category: "Investment",
    excerpt: "With rising parental awareness and government reforms, the Indian preschool and K-12 market is experiencing unprecedented demand.",
    content: `## Why Investing in Early Education is India's Smartest Business Move

For entrepreneurs and investors, selecting a business sector with sustainable, recurring revenue and low volatility is a high priority. The **Indian Education Market** represents one of the most resilient industries in the country today.

Here are three primary drivers that make education a smart investment:
- **Zero Recessional Vulnerability**: Parents prioritize their children's education over luxury items, making student enrollment highly stable even in economic downturns.
- **NEP 2020 Regulatory Push**: Government reforms are formalizing early childhood care. Standardizing under recognized educational brands creates an immediate competitive advantage.
- **Double-Digit Growth**: The preschool franchise segment in Tier-1, Tier-2, and Tier-3 cities continues to expand at a compound annual growth rate of over 12%.

### The KinderBee Advantage (KIPS)
Unlike traditional educational franchises that charge high royalty fees (often between 15% to 25% of monthly revenues), KIPS operates on a **100% Zero Royalty Model**. This allows franchise partners to reinvest their profits directly into academic quality, ensuring faster ROI (within 18–24 months) and long-term asset value creation.

*Contact our investment advisors to learn more about our tailored financial models.*`,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    author: "Amit Sharma (Chief Financial Strategist)",
    date: "2026-07-28",
    readTime: "4 min read",
    views: 980
  },
  {
    id: "blog-3",
    title: "Implementing NEP 2020: A Guide for School Administrators",
    category: "School Setup",
    excerpt: "National Education Policy 2020 is reshaping school structures. Learn how existing campuses can adapt and upgrade smoothly.",
    content: `## Implementing NEP 2020: A Guide for School Administrators

The National Education Policy (NEP) 2020 introduces a structural shift from the traditional 10+2 system to a new **5+3+3+4 cognitive development framework**.

For existing school administrators, this requires rethinking both physical spaces and academic syllabi:
- **The Foundational Stage (Ages 3-8)**: Encompasses 3 years of preschool plus Grades 1 and 2. It mandates play-based, discovery-active curriculum.
- **The Preparatory Stage (Ages 8-11)**: Integrates textbook learning with interactive, hands-on, and conversational learning.
- **Skills and Coding Integration**: Secondary grades now require vocational training, coding readiness, and multi-disciplinary flexibility.

### Seamless Campus Upgradation
At KinderBee, our School Setup Consultancy provides comprehensive support. We help you transform your current institution with:
1. **Academic Upgradation**: Curriculum and lesson plans aligned with NEP 2020 learning outcomes.
2. **Infrastructure Retrofitting**: Transforming traditional desks into smart, collaborative learning hubs.
3. **Teacher Training**: Equipping existing educators with digital pedagogy and child-centric teaching styles.

*Contact us today to receive a customized Feasibility Study and School Transformation Roadmap.*`,
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    author: "Dr. Rajesh Iyer (Academic Advisor)",
    date: "2026-07-15",
    readTime: "7 min read",
    views: 2150
  }
];

const seedFAQs: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is the KIPS Zero Royalty model and how does it work?",
    answer: "Unlike traditional franchises that charge 15-25% of your recurring tuition revenues, KinderBee operates on a Zero Royalty Model. Partners pay an upfront, transparent integration/consultancy fee. You keep 100% of your tuition revenues and profits, allowing faster break-even and higher profitability.",
    section: "home"
  },
  {
    id: "faq-2",
    question: "What support does KinderBee provide during school setup?",
    answer: "We provide complete end-to-end support, including site selection guidance, interior layout design, furniture planning, digital classroom setup, teacher recruitment assistance, Finnish Way Academy curriculum and training, admission launch campaigns, and ongoing academic audits.",
    section: "home"
  },
  {
    id: "faq-3",
    question: "Are the teacher certifications accredited?",
    answer: "Yes, FinnishWay Academy certifications are globally recognized and industry-aligned, preparing educators with professional competencies, practical portfolios, and hands-on teaching strategies that meet international and NEP 2020 standards.",
    section: "fwa"
  },
  {
    id: "faq-4",
    question: "What is the minimum land/space requirement for a Preschool?",
    answer: "A preschool franchise typically requires a minimum land area of 2,500 to 5,000 sq. ft. and a built-up area of 1,800 to 3,500 sq. ft., accommodating 6 to 10 classrooms, administrative zones, and play areas.",
    section: "investor"
  },
  {
    id: "faq-5",
    question: "What is the typical investment and ROI timeline?",
    answer: "The typical investment ranges from ₹15 Lakhs to ₹35 Lakhs depending on the city, building state, and local infrastructure requirements. Due to the Zero Royalty structure, most franchise partners achieve break-even and generate positive ROI within 18 to 24 months.",
    section: "investor"
  }
];

const seedSettings: SystemSettings = {
  phone: "+91 99013 32233",
  email: "kinderbeeschools@gmail.com",
  officeAddress: "Opp Vijay Bakery, Old UCO Bank road, Ramamurthy Nagar, Bangalore, 560016",
  whatsappNumber: "+919901332233",
  facebookUrl: "https://facebook.com/kinderbee",
  linkedinUrl: "https://linkedin.com/company/kinderbee-education",
  instagramUrl: "https://instagram.com/kinderbee",
  workingHours: "10 AM - 5 PM",
  popupEnabled: true,
  popupDelay: 4,
  popupScrollTrigger: true,
  popupScrollPercent: 50,
  popupTag: "ADMISSIONS & PARTNERSHIPS OPEN",
  popupTitle: "Start Your Transformation Journey",
  popupSubtitle: "Complete the form and our Academic & Franchise Advisor will contact you shortly.",
  popupImageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
  popupImageAlt: "Kinderbee Education Poster"
};

const seedEnquiries: Enquiry[] = [
  {
    id: "enq-1",
    type: "franchise",
    fields: {
      name: "Suresh Mehra",
      email: "suresh.mehra@gmail.com",
      phone: "+91 98234 56789",
      city: "Pune",
      state: "Maharashtra",
      budget: "₹25 Lakhs - ₹30 Lakhs",
      partnershipModel: "Preschool Franchise",
      message: "I own a 3,000 sq ft property in an upscale residential area of Pune. Interested in starting a premium Finnish-inspired preschool. Please call me."
    },
    status: "pending",
    notes: "Property verified. Ready for initial call on Friday.",
    aiSummary: "🌟 High Interest Lead: Entrepreneur owns a prime 3,000 sq ft property in Pune with a budget matching the ₹15L-₹35L requirement. Strongly recommended to highlight the Zero Royalty benefit during the call to secure the contract.",
    createdAt: "2026-08-05T14:30:00Z"
  },
  {
    id: "enq-2",
    type: "investor",
    fields: {
      name: "Anjali Deshmukh",
      email: "anjali@deshmukhtrust.org",
      phone: "+91 91234 88812",
      organization: "Deshmukh Educational Trust",
      city: "Nagpur",
      state: "Maharashtra",
      investmentInterest: "CBSE School Setup",
      budget: "₹1.5 Crores - ₹2 Crores",
      message: "Our trust wants to establish a new CBSE K-12 school in Nagpur. We need end-to-end guidance from land approvals to curriculum."
    },
    status: "reviewed",
    notes: "Emailed corporate presentation. Scheduled presentation with Director on Monday.",
    aiSummary: "💎 Elite Lead: Large budget educational trust exploring CBSE setup. Needs comprehensive operational and compliance support. Excellent candidate for KIPS multi-year project consulting.",
    createdAt: "2026-08-04T09:15:00Z"
  }
];

const seedPages = [
  {
    id: "home",
    title: "Build the Future of Education with KIPS",
    subtitle: "The KinderBee Integrated Partnership System (KIPS) is India's leading complete educational ecosystem. We don't just sell franchises—we help entrepreneurs plan, establish, launch, and operate highly successful, world-class schools with absolute local authority.",
    metaTitle: "KinderBee - Finnish-Inspired Zero Royalty Preschool Franchise & School Setup",
    metaDescription: "Discover KinderBee, India's leading Finnish-inspired preschool franchise system. 100% Zero Royalty model, NEP-aligned curriculum, teacher training, and school setup consultancy.",
    keywords: "preschool franchise, school setup india, finnish education, zero royalty franchise, nep 2020 school setup, preschool business",
    badgeText: "Zero Royalty. Lifetime Support. Global Standards.",
    content1: "India's Zero Royalty Education Franchise & School Development Partner"
  },
  {
    id: "about",
    title: "Empowering Educators & Entrepreneurs",
    subtitle: "KinderBee is on a mission to democratize premium international education across India, eliminating royalty burdens and providing school owners with elite world-class tools.",
    metaTitle: "About KinderBee - Global Standards, Nordic Pedagogy",
    metaDescription: "Learn about KinderBee's mission, values, and our partnership with Finnish Way Academy to deliver top-tier education with Zero Royalty benefits across India.",
    keywords: "kinderbee curriculum, finnish school franchise, nep preschool india, play-based early learning",
    badgeText: "OUR JOURNEY & CORE MISSION",
    content1: "Democratic Education with Zero Franchise Royalties"
  },
  {
    id: "partnerships",
    title: "Our Collaborative Education Models",
    subtitle: "From high-profit Preschool Franchises to comprehensive CBSE School Setup and existing school upgrades, explore our zero-royalty partnership pathways.",
    metaTitle: "Education Partnerships - School Setup & Upgrades | KinderBee",
    metaDescription: "Explore KinderBee educational models. Get comprehensive assistance for CBSE/IB school setups, play school franchise systems, and existing school transformation with zero royalties.",
    keywords: "cbse school setup, preschool franchise cost, school setup consultant, school rebranding",
    badgeText: "Strategic Association Portfolios",
    content1: "Custom Solutions Tailored to Your Property and Vision"
  },
  {
    id: "fwa",
    title: "Finnish Way Academy Teacher Training",
    subtitle: "Unlock globally acclaimed pedagogical expertise. Empower your teaching staff with active, play-based learning frameworks certified by Finnish childhood education experts.",
    metaTitle: "Finnish Way Academy - Early Educator Certifications | KinderBee",
    metaDescription: "Acquire international early childhood teacher diplomas and certifications. Finnish-inspired pedagogy, active play-based teacher training programs.",
    keywords: "teacher training diploma, preschool teacher course, finnish education training, ntt course online",
    badgeText: "Acclaimed Pedagogical Certifications",
    content1: "Globally Accredited Teacher Professional Development"
  },
  {
    id: "investors",
    title: "High ROI Educational Investment Opportunities",
    subtitle: "Invest in one of India's most resilient and expanding sectors. Benefit from rapid capital recovery, zero recurring royalties, and complete operational guidance.",
    metaTitle: "Investors Hub - High ROI Preschool Investment | KinderBee",
    metaDescription: "Explore premium preschool franchise investment options. Highly resilient cash flows, fast ROI within 18-24 months, and a 100% Zero Royalty setup.",
    keywords: "education investment, preschool franchise roi, profitable school franchise, education business opportunity",
    badgeText: "Capital Appreciation & Enterprise Growth",
    content1: "Robust Multi-Year Fiscal Security in Indian K-12 Spaces"
  },
  {
    id: "contact",
    title: "Connect with our Central Advisors",
    subtitle: "Speak directly with our school planning consultants to map out your educational project feasibility, site criteria, and budget expectations.",
    metaTitle: "Contact Us - KinderBee School Setup Advisory",
    metaDescription: "Contact KinderBee corporate office today. Schedule a phone consultation or offline visit to discuss school franchise or consulting requirements.",
    keywords: "contact school franchise, kinderbee office phone, preschool setup consulting call",
    badgeText: "Get In Touch Today",
    content1: "Strategic Project Blueprint Session"
  }
];

// Helper to load database
function loadDb(): { enquiries: Enquiry[]; blogs: BlogPost[]; faqs: FAQItem[]; settings: SystemSettings; pages: any[] } {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (!parsed.settings || parsed.settings.email === "partner@kinderbee.in" || parsed.settings.phone === "+91 91500 48800") {
        parsed.settings = seedSettings;
        saveDb(parsed);
      }
      if (parsed.blogs && Array.isArray(parsed.blogs)) {
        let updated = false;
        parsed.blogs.forEach((b: BlogPost) => {
          if (b.views === undefined) {
            const seed = seedBlogs.find(sb => sb.id === b.id);
            b.views = seed?.views ?? 150;
            updated = true;
          }
        });
        if (updated) saveDb(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error loading database:", err);
  }

  // Seeding initial data if not found
  const initialData = {
    enquiries: seedEnquiries,
    blogs: seedBlogs,
    faqs: seedFAQs,
    settings: seedSettings,
    pages: seedPages
  };
  saveDb(initialData);
  return initialData;
}

// Helper to save database
function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database:", err);
  }
}

// Ensure database is initialized on startup
loadDb();

// ==========================================
// API ROUTES
// ==========================================

// Authenticate Admin
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: "admin-secret-token-kips-2026" });
  } else {
    res.status(401).json({ success: false, error: "Invalid administrator password" });
  }
});

// Submit Enquiry (Form Submissions)
app.post("/api/enquiries", async (req, res) => {
  const { type, fields } = req.body;
  if (!type || !fields || !fields.name || !fields.email || !fields.phone) {
    return res.status(400).json({ error: "Missing required contact fields" });
  }

  const db = loadDb();
  const newEnquiry: Enquiry = {
    id: `enq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type,
    fields,
    status: "pending",
    notes: "",
    createdAt: new Date().toISOString()
  };

  // Generate AI Lead Score & Strategic Assessment using Gemini
  const key = process.env.GEMINI_API_KEY;
  if (key && key !== "MY_GEMINI_API_KEY") {
    try {
      const ai = getGeminiClient();
      if (ai) {
        const leadContext = `
        Lead Name: ${fields.name}
        Lead Email: ${fields.email}
        Lead Phone: ${fields.phone}
        Enquiry Type: ${type}
        City/State: ${fields.city || "Not Provided"}, ${fields.state || "Not Provided"}
        Budget: ${fields.budget || "Not Specified"}
        Partnership/Course: ${fields.partnershipModel || fields.courseOfInterest || "General Enquiry"}
        Message: ${fields.message || "None"}
        `;

        const prompt = `You are a strategic business development assistant for KinderBee Integrated Partnership System (KIPS), an Indian educational network offering Zero Royalty school setups and teacher training.
        Analyze this incoming lead context and provide a highly useful strategic lead card for the administrator.
        The card MUST start with an emoji indicator (e.g. 🌟 for high fit, 💎 for enterprise/large trusts, 📚 for educators/courses, 📞 for standard contact).
        Then provide a concise, maximum 2-sentence summary detailing:
        1. Lead quality assessment (High, Medium, Low based on budget, property details or credentials).
        2. Key tactical point to bring up during the sales call (e.g., highlighting zero royalties, support, or curriculum).
        Keep it sharp, professional, and practical. Do not include markdown headers or extra text.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt + "\n\nLead Info:\n" + leadContext,
        });

        if (response && response.text) {
          newEnquiry.aiSummary = response.text.trim();
        }
      }
    } catch (aiError) {
      console.error("Gemini Lead Analysis failed:", aiError);
      newEnquiry.aiSummary = "⚠️ AI lead indexing skipped due to API timeout. Lead processed successfully.";
    }
  } else {
    // Sandbox default scoring
    const isHighEnd = fields.budget?.includes("Crore") || fields.budget?.includes("35 Lakhs") || fields.message?.toLowerCase().includes("property") || fields.message?.toLowerCase().includes("acres");
    newEnquiry.aiSummary = isHighEnd 
      ? "💎 Premium Lead (Sandbox scored): Strategic fit indicates a highly viable educational project. We recommend prioritizing local feasibility maps and highlighting the 100% Zero Royalty benefits immediately."
      : "🌟 Standard Lead (Sandbox scored): Viable target interest. Suggested action is to email the brochure package and schedule an introduction call to assess space availability.";
  }

  db.enquiries.unshift(newEnquiry);
  saveDb(db);

  res.json({ success: true, enquiryId: newEnquiry.id, aiSummary: newEnquiry.aiSummary });
});

// Admin Check: Auth Middleware
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer admin-secret-token-kips-2026") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin authorization required." });
  }
};

// GET all enquiries for Admin
app.get("/api/enquiries", requireAdmin, (req, res) => {
  const db = loadDb();
  res.json(db.enquiries);
});

// UPDATE enquiry status/notes
app.put("/api/enquiries/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const db = loadDb();
  
  const idx = db.enquiries.findIndex(e => e.id === id);
  if (idx !== -1) {
    if (status) db.enquiries[idx].status = status;
    if (notes !== undefined) db.enquiries[idx].notes = notes;
    saveDb(db);
    res.json({ success: true, enquiry: db.enquiries[idx] });
  } else {
    res.status(404).json({ error: "Enquiry record not found" });
  }
});

// DELETE an enquiry
app.delete("/api/enquiries/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  const filtered = db.enquiries.filter(e => e.id !== id);
  db.enquiries = filtered;
  saveDb(db);
  res.json({ success: true });
});

// GET all public blogs
app.get("/api/blogs", (req, res) => {
  const db = loadDb();
  res.json(db.blogs);
});

// Record / Increment Blog View Count (Public)
app.post("/api/blogs/:id/view", (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  const idx = db.blogs.findIndex(b => b.id === id);
  if (idx !== -1) {
    db.blogs[idx].views = (db.blogs[idx].views || 0) + 1;
    saveDb(db);
    res.json({ success: true, views: db.blogs[idx].views });
  } else {
    res.status(404).json({ error: "Blog post not found" });
  }
});

// BLOG CRUD
app.post("/api/blogs", requireAdmin, (req, res) => {
  const db = loadDb();
  const newBlog: BlogPost = {
    id: `blog-${Date.now()}`,
    ...req.body,
    views: req.body.views !== undefined ? Number(req.body.views) : 0,
    date: new Date().toISOString().split("T")[0]
  };
  db.blogs.unshift(newBlog);
  saveDb(db);
  res.json({ success: true, blog: newBlog });
});

app.put("/api/blogs/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  const idx = db.blogs.findIndex(b => b.id === id);
  if (idx !== -1) {
    db.blogs[idx] = { 
      ...db.blogs[idx], 
      ...req.body,
      views: req.body.views !== undefined ? Number(req.body.views) : (db.blogs[idx].views || 0)
    };
    saveDb(db);
    res.json({ success: true, blog: db.blogs[idx] });
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
});

app.delete("/api/blogs/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.blogs = db.blogs.filter(b => b.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// GET all public FAQs
app.get("/api/faqs", (req, res) => {
  const db = loadDb();
  res.json(db.faqs);
});

// FAQ CRUD
app.post("/api/faqs", requireAdmin, (req, res) => {
  const db = loadDb();
  const newFaq: FAQItem = {
    id: `faq-${Date.now()}`,
    ...req.body
  };
  db.faqs.push(newFaq);
  saveDb(db);
  res.json({ success: true, faq: newFaq });
});

app.put("/api/faqs/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  const idx = db.faqs.findIndex(f => f.id === id);
  if (idx !== -1) {
    db.faqs[idx] = { ...db.faqs[idx], ...req.body };
    saveDb(db);
    res.json({ success: true, faq: db.faqs[idx] });
  } else {
    res.status(404).json({ error: "FAQ item not found" });
  }
});

app.delete("/api/faqs/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.faqs = db.faqs.filter(f => f.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// GET System Settings
app.get("/api/settings", (req, res) => {
  const db = loadDb();
  res.json(db.settings);
});

// PUT System Settings
app.put("/api/settings", requireAdmin, (req, res) => {
  const db = loadDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);
  res.json({ success: true, settings: db.settings });
});

// GET All Pages Configurations
app.get("/api/pages", (req, res) => {
  const db = loadDb();
  res.json(db.pages || []);
});

// GET Single Page Configuration
app.get("/api/pages/:id", (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  const page = (db.pages || []).find(p => p.id === id);
  if (page) {
    res.json(page);
  } else {
    res.status(404).json({ error: "Page configuration not found" });
  }
});

// PUT Update Page Configuration (Admin required)
app.put("/api/pages/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  if (!db.pages) db.pages = [];
  const idx = db.pages.findIndex(p => p.id === id);
  if (idx !== -1) {
    db.pages[idx] = { ...db.pages[idx], ...req.body };
    saveDb(db);
    res.json({ success: true, page: db.pages[idx] });
  } else {
    const newPage = { id, ...req.body };
    db.pages.push(newPage);
    saveDb(db);
    res.json({ success: true, page: newPage });
  }
});

// Change Admin Password
app.put("/api/settings/password", requireAdmin, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters long." });
  }
  ADMIN_PASSWORD = newPassword;
  res.json({ success: true });
});

// GET dashboard metrics / analytics
app.get("/api/analytics", requireAdmin, (req, res) => {
  const db = loadDb();
  const enquiries = db.enquiries;

  const totalLeads = enquiries.length;
  const pendingLeads = enquiries.filter(e => e.status === "pending").length;
  const reviewedLeads = enquiries.filter(e => e.status === "reviewed").length;
  const contactedLeads = enquiries.filter(e => e.status === "contacted").length;
  const closedLeads = enquiries.filter(e => e.status === "closed").length;

  // Calculate potential commercial pipeline
  let totalPotentialLakhs = 0;
  enquiries.forEach(e => {
    const budgetStr = e.fields.budget || "";
    if (budgetStr.includes("1.5 Crores") || budgetStr.includes("2 Crores")) {
      totalPotentialLakhs += 175;
    } else if (budgetStr.includes("₹15 Lakhs") || budgetStr.includes("35 Lakhs")) {
      totalPotentialLakhs += 25;
    } else if (budgetStr.includes("Lakhs")) {
      const match = budgetStr.match(/(\d+)/);
      if (match) totalPotentialLakhs += parseInt(match[1]);
    } else {
      totalPotentialLakhs += 10; // baseline estimation for general leads
    }
  });

  const typesMap: Record<string, number> = {
    "Preschool Franchise": 0,
    "School Setup & CBSE/IB": 0,
    "Teacher Certification": 0,
    "Investors": 0,
    "General / Contact": 0
  };

  enquiries.forEach(e => {
    if (e.type === "franchise" || e.fields.partnershipModel?.includes("Preschool")) {
      typesMap["Preschool Franchise"]++;
    } else if (e.type === "investor" || e.fields.partnershipModel?.includes("School Setup") || e.fields.investmentInterest?.includes("CBSE")) {
      typesMap["Investors"]++;
    } else if (e.type === "fwa_course" || e.fields.courseOfInterest) {
      typesMap["Teacher Certification"]++;
    } else if (e.fields.partnershipModel?.includes("CBSE") || e.fields.partnershipModel?.includes("IB")) {
      typesMap["School Setup & CBSE/IB"]++;
    } else {
      typesMap["General / Contact"]++;
    }
  });

  const leadsByType = Object.keys(typesMap).map(name => ({
    name,
    value: typesMap[name]
  }));

  res.json({
    totalLeads,
    pendingLeads,
    reviewedLeads,
    contactedLeads,
    closedLeads,
    totalBlogs: db.blogs.length,
    estimatedRevenuePotential: `₹${totalPotentialLakhs} Lakhs`,
    leadsByType
  });
});

// Draft Professional AI Email response using Gemini
app.post("/api/ai/suggest-reply", requireAdmin, async (req, res) => {
  const { enquiryId } = req.body;
  if (!enquiryId) {
    return res.status(400).json({ error: "Missing enquiryId" });
  }

  const db = loadDb();
  const enquiry = db.enquiries.find(e => e.id === enquiryId);
  if (!enquiry) {
    return res.status(404).json({ error: "Enquiry record not found" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (key && key !== "MY_GEMINI_API_KEY") {
    try {
      const ai = getGeminiClient();
      if (ai) {
        const leadContext = `
        Lead Name: ${enquiry.fields.name}
        Lead Email: ${enquiry.fields.email}
        Enquiry Type: ${enquiry.type}
        City/State: ${enquiry.fields.city || "Not Provided"}
        Budget: ${enquiry.fields.budget || "Not Specified"}
        Partnership/Course: ${enquiry.fields.partnershipModel || enquiry.fields.courseOfInterest || "General Enquiry"}
        Message: ${enquiry.fields.message || "None"}
        `;

        const prompt = `You are the Business Development Director for KinderBee Integrated Partnership System (KIPS) and FinnishWay Academy.
        Write a highly polished, professional, and warm email response to this interested lead.
        Address them by their name (${enquiry.fields.name}).
        In the email, make sure to:
        1. Acknowledge their specific interest in ${enquiry.fields.partnershipModel || enquiry.fields.courseOfInterest || "collaborating with KinderBee"}.
        2. Strategically mention the 100% Zero Royalty Model (if they are franchise/investor leads) or Finnish-inspired global learning frameworks (if they are school setups or course leads).
        3. Suggest scheduling a 15-minute consultation callback.
        4. Sign off professionally as "The KinderBee Partnership Team".
        Keep the tone encouraging, premium, and trustworthy. Avoid generic clichés. Return ONLY the complete email text (Subject and Body). Do not include any meta-text or wrapper.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt + "\n\nLead context:\n" + leadContext,
        });

        if (response && response.text) {
          return res.json({ success: true, emailDraft: response.text.trim() });
        }
      }
    } catch (aiError) {
      console.error("Gemini Response Generation failed:", aiError);
    }
  }

  // Fallback Professional Mock Draft
  const modelStr = enquiry.fields.partnershipModel || enquiry.fields.courseOfInterest || "collaborating with KIPS";
  const mockSubject = `Subject: KinderBee Partnership Enquiry - Next Steps for ${enquiry.fields.name}`;
  const mockBody = `Dear ${enquiry.fields.name},

Thank you for reaching out to the KinderBee Integrated Partnership System (KIPS). We have received your query regarding starting a ${modelStr} in ${enquiry.fields.city || "your city"}.

Your interest aligns perfectly with our vision of building future-ready, high-standard educational institutions across India. Since KIPS operates on a 100% Zero Royalty Franchise Model, our partners retain all of their recurring tuition revenues, allowing for much faster capital recovery and highly sustainable local growth.

Our expert education consultants are currently compiling a customized feasibility analysis for ${enquiry.fields.city || "your area"} based on your budget preference of ${enquiry.fields.budget || "₹15 - ₹35 Lakhs"}.

Would you be available for a brief, 15-minute introductory consultation call this week? Please let us know your preferred date and time.

Looking forward to building the future of education together.

Warm regards,

The KinderBee Partnership Team
${db.settings.phone} | ${db.settings.email}`;

  res.json({ success: true, emailDraft: `${mockSubject}\n\n${mockBody}` });
});


// ==========================================
// VITE DEV SERVER & PRODUCTION MIDDLEWARE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite Development Middleware mounted.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static files from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(`  KIPS Full-Stack Server running on port ${PORT}`);
    console.log(`  Access the app at http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

startServer();
