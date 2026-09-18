import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Enquiry, BlogPost, FAQItem, SystemSettings, PaymentRecord } from "./src/types";

// Initialize express app
const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Default Admin Password (can be changed in settings)
let ADMIN_PASSWORD = "admin";

// Lazy-initialize Supabase Client
let supabaseClient: SupabaseClient | null = null;
function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL || "https://uvsqqvhjtdtsexfsinvp.supabase.co";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                        process.env.SUPABASE_ANON_KEY || 
                        process.env.SUPABASE_PUBLISHABLE_KEY || 
                        process.env.SUPABASE_SECRET_KEY || 
                        process.env.SUPABASE_KEY;
    if (supabaseKey) {
      try {
        supabaseClient = createClient(supabaseUrl, supabaseKey);
        console.log("Supabase Client initialized successfully.");
      } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
      }
    }
  }
  return supabaseClient;
}

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
    title: "POSITIVE TALK - Parenting Guide: Early Childhood Education",
    category: "Parenting Guide",
    excerpt: "Early childhood education (ECE) plays a crucial role in a child's development, laying the foundation for lifelong learning, behavior, and health. Explore practical insights on positive interactions, supportive environments, and holistic early learning.",
    content: `## Introduction

Early childhood education (ECE) plays a crucial role in a child's development, laying the foundation for lifelong learning, behavior, and health. As parents, nurturing your child's early years with positive interactions, learning experiences, and supportive environments can make a significant impact. This guide offers practical tips and insights to help you support your child's early education journey.

## Understanding Early Childhood Development

1. **Cognitive Development**: Early years are critical for brain development. Activities that stimulate thinking, problem-solving, and memory help build cognitive skills. Simple games, puzzles, and storytelling are excellent for cognitive growth.
2. **Social and Emotional Development**: Children learn to interact with others and manage their emotions during early childhood. Encourage playdates, group activities, and teach empathy and sharing to foster social skills.
3. **Language Development**: Reading to your child, engaging in conversations, and exposing them to a rich vocabulary enhances language skills. Singing songs, playing word games, and encouraging storytelling are effective techniques.
4. **Physical Development**: Physical activity is vital for motor skills and overall health. Provide opportunities for both fine motor (drawing, building blocks) and gross motor (running, jumping) activities.

## Creating a Positive Learning Environment

1. **Safe and Stimulating Space**: Ensure your home is safe and filled with stimulating materials such as books, educational toys, and art supplies.
2. **Consistent Routine**: Establish a daily routine that includes time for play, learning, meals, and rest. Consistency helps children feel secure and understand expectations.
3. **Positive Reinforcement**: Encourage and praise your child's efforts and achievements. Positive reinforcement boosts confidence and motivates learning.

## Engaging Learning Activities

1. **Play-Based Learning**: Children learn best through play. Incorporate educational games, imaginative play, and hands-on activities into their daily routine.
2. **Reading Together**: Make reading a daily habit. Choose age-appropriate books and discuss the stories to develop comprehension and critical thinking.
3. **Creative Arts**: Encourage drawing, painting, music, and dance. Creative arts foster self-expression and fine motor skills.
4. **Nature Exploration**: Outdoor activities and nature exploration promote curiosity and physical health. Simple activities like gardening, nature walks, and observing wildlife can be educational.

## Building Strong Relationships

1. **Active Listening**: Show genuine interest in your child's thoughts and feelings. Active listening builds trust and emotional security.
2. **Quality Time**: Spend quality one-on-one time with your child. Engage in activities they enjoy and show that you value your time together.
3. **Positive Communication**: Use positive language and gentle guidance. Model respectful communication and problem-solving skills.

## Collaborating with Educators

1. **Stay Informed**: Be involved in your child's early education program. Attend parent-teacher meetings, read newsletters, and stay updated on their progress.
2. **Communicate Openly**: Maintain open communication with your child's teachers. Share insights about your child's interests, strengths, and challenges.
3. **Support Learning at Home**: Reinforce what your child learns at school with related activities at home. Consistency between home and school enhances learning.

## Conclusion

Early childhood education is a collaborative effort between parents, educators, and the community. By creating a positive, stimulating, and supportive environment, you can help your child develop a love for learning that will last a lifetime. Celebrate their milestones, nurture their curiosity, and enjoy the journey of early childhood education together.

### Resources

- **Books**: Daniel J. Siegel's *The Whole-Brain Child*, Adele Faber and Elaine Mazlish's *How to Talk So Kids Will Listen & Listen So Kids Will Talk*
- **Websites**: [Zero to Three](https://www.zerotothree.org), [National Association for the Education of Young Children (NAEYC)](https://www.naeyc.org)
- **Local Libraries and Community Centers**: Often offer programs and resources for early childhood education and development.

*Remember, every child is unique. Adapt these guidelines to fit your child's individual needs and enjoy the rewarding experience of nurturing their growth and development.*

**Finnish-way Educare Pvt Ltd**  
[www.kinderbeeschools.com](https://www.kinderbeeschools.com)`,
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200",
    author: "Kinderbee International Preschool",
    date: "2026-09-18",
    readTime: "6 min read",
    views: 1445
  }
];

const seedFAQs: FAQItem[] = [
  {
    id: "faq-1",
    question: "1. What is the Kinderbee Integrated Partnership System (KIPS)?",
    answer: "KIPS is a globally oriented educational partnership system that provides schools with comprehensive academic, operational, branding, and teacher-training support.",
    section: "home"
  },
  {
    id: "faq-2",
    question: "2. Why choose the Kinderbee Preschool Franchise?",
    answer: "The Kinderbee Preschool Franchise offers a well-tested, pilot-run model featuring a Nordic-inspired, play-based curriculum, comprehensive teacher training, 360-degree institutional support, and a no-royalty partnership model—enabling partners to establish and manage a high-quality, child-centred preschool.",
    section: "home"
  },
  {
    id: "faq-3",
    question: "3. What is the process for starting a Kinderbee Preschool?",
    answer: "Begin by submitting a partnership enquiry. The Kinderbee team will then guide you through the initial consultation, location and infrastructure assessment, partnership formalities, preschool setup, curriculum implementation, teacher training, branding, and operational launch.",
    section: "home"
  },
  {
    id: "faq-4",
    question: "4. Who can become a Kinderbee Preschool Partner?",
    answer: "Educators, entrepreneurs, existing school owners, educational institutions, and investors with a commitment to quality early-childhood education can become Kinderbee partners. Prior experience in preschool management is an advantage but not essential, as Kinderbee provides comprehensive training and ongoing institutional support.",
    section: "home"
  },
  {
    id: "faq-5",
    question: "5. What makes the Kinderbee curriculum distinctive?",
    answer: "The Kinderbee curriculum is a Nordic-inspired, play-based learning framework that nurtures the whole child through joyful exploration, creativity, collaboration, and real-world experiences. It combines global educational practices with age-appropriate, child-centred learning.",
    section: "home"
  },
  {
    id: "faq-6",
    question: "6. What ongoing support does Kinderbee provide to its partners?",
    answer: "Kinderbee provides continuous support in curriculum implementation, academic planning, teacher training, branding, marketing, admissions, preschool operations, quality assurance, and institutional development, helping partners maintain consistent educational and service standards.",
    section: "home"
  },
  {
    id: "faq-7",
    question: "7. How does the Kinderbee curriculum align with NEP 2020?",
    answer: "The Kinderbee curriculum reflects the core principles of NEP 2020 through play-based and experiential learning, foundational literacy and numeracy, age-appropriate activities, multilingual exposure, and holistic child development.",
    section: "home"
  },
  {
    id: "faq-8",
    question: "8. What is FinnishWay Academy?",
    answer: "FinnishWay Academy is the professional teacher-training and development wing of the Kinderbee ecosystem. It equips educators with practical expertise in Nordic-inspired, play-based learning, early-childhood education, classroom management, curriculum implementation, and modern pedagogical perspectives and practices.",
    section: "home"
  },
  {
    id: "faq-9",
    question: "9. Is prior experience in education required to become a Kinderbee partner?",
    answer: "No. Prior experience in education is helpful but not mandatory. Kinderbee provides the training, curriculum, operational guidance, and ongoing support required to help committed entrepreneurs establish and manage a quality preschool.",
    section: "home"
  },
  {
    id: "faq-10",
    question: "10. Can I rebrand my existing preschool with Kinderbee?",
    answer: "Yes. Existing preschools can transition to the Kinderbee brand and benefit from its proven partnership model, distinctive curriculum, teacher training, academic systems, branding, marketing, and operational guidance—helping them improve quality, strengthen parent confidence, and accelerate institutional growth.",
    section: "home"
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
function loadDb(): { enquiries: Enquiry[]; blogs: BlogPost[]; faqs: FAQItem[]; settings: SystemSettings; pages: any[]; payments: PaymentRecord[] } {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (!parsed.payments || !Array.isArray(parsed.payments)) {
        parsed.payments = [];
        saveDb(parsed);
      }
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
    pages: seedPages,
    payments: []
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

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

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

  // Sync to Supabase table 'enquiries' if client is initialized
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error: sbError } = await supabase.from("enquiries").insert([
        {
          id: newEnquiry.id,
          type: newEnquiry.type,
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          city: fields.city || null,
          state: fields.state || null,
          budget: fields.budget || null,
          partnership_model: fields.partnershipModel || fields.courseOfInterest || null,
          message: fields.message || null,
          status: newEnquiry.status,
          ai_summary: newEnquiry.aiSummary || null,
          created_at: newEnquiry.createdAt,
          raw_data: fields
        }
      ]);
      if (sbError) {
        console.warn("Supabase Lead Sync Notice:", sbError.message);
      } else {
        console.log("Lead successfully synced to Supabase database:", newEnquiry.id);
      }
    }
  } catch (sbErr) {
    console.error("Supabase sync execution error:", sbErr);
  }

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

// ==========================================
// PAYMENT CONFIRMATION / VERIFICATION ROUTES
// ==========================================

// Submit payment transaction confirmation
app.post("/api/payments", async (req, res) => {
  const { applicantName, admissionNumber, programme, amount, upiRefNumber, payerPhone, payerEmail, notes, paymentDate } = req.body;
  if (!applicantName || !programme || !amount || !upiRefNumber || !payerPhone) {
    return res.status(400).json({ error: "Please fill in all mandatory payment confirmation fields (Name, Programme, Amount, UPI Ref, and Contact Number)." });
  }

  const db = loadDb();
  const newPayment: PaymentRecord = {
    id: `PAY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    applicantName,
    admissionNumber: admissionNumber || "",
    programme,
    amount,
    upiRefNumber,
    payerPhone,
    payerEmail: payerEmail || "",
    paymentDate: paymentDate || new Date().toISOString().split("T")[0],
    notes: notes || "",
    status: "pending_verification",
    createdAt: new Date().toISOString()
  };

  db.payments.unshift(newPayment);
  saveDb(db);

  // Sync to Supabase if available
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from("payments").insert([
        {
          id: newPayment.id,
          applicant_name: applicantName,
          admission_number: admissionNumber || null,
          programme,
          amount: String(amount),
          upi_ref: upiRefNumber,
          payer_phone: payerPhone,
          payer_email: payerEmail || null,
          status: newPayment.status,
          created_at: newPayment.createdAt
        }
      ]);
    }
  } catch (err) {
    console.warn("Supabase payment sync notice:", err);
  }

  res.json({
    success: true,
    paymentRecord: newPayment,
    message: "Payment transaction reference received and recorded for verification."
  });
});

// GET all payments (Admin)
app.get("/api/payments", requireAdmin, (req, res) => {
  const db = loadDb();
  res.json(db.payments || []);
});

// UPDATE payment verification status (Admin)
app.put("/api/payments/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const db = loadDb();
  const idx = db.payments.findIndex(p => p.id === id);
  if (idx !== -1) {
    if (status) db.payments[idx].status = status;
    if (notes !== undefined) db.payments[idx].notes = notes;
    saveDb(db);
    res.json({ success: true, payment: db.payments[idx] });
  } else {
    res.status(404).json({ error: "Payment record not found." });
  }
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

// POST / PUT System Settings
app.post("/api/settings", requireAdmin, (req, res) => {
  const db = loadDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);
  res.json({ success: true, settings: db.settings });
});

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
