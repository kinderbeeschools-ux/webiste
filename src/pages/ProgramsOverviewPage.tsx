import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Users, 
  Compass, 
  BookOpen, 
  Cpu, 
  Award, 
  Calendar, 
  X, 
  Briefcase, 
  PhoneCall, 
  School, 
  TrendingUp, 
  ShieldCheck, 
  Target
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SystemSettings } from '../types';

interface ProgramsOverviewPageProps {
  onOpenConsultation: (type?: string) => void;
  settings?: SystemSettings | null;
  setCurrentTab?: (tab: string) => void;
}

export interface ProgramItem {
  id: string;
  category: 'schools' | 'educators';
  title: string;
  badge: string;
  intro: string;
  targetAudience: string;
  durationMode: string;
  keyOutcomesOrServices: string[];
  benefits: string[];
  fullDetails: {
    overview: string;
    deliverablesOrModules: { title: string; desc: string }[];
    certificationOrAccreditation?: string;
    deliverableHighlights: string[];
  };
}

const SCHOOL_SOLUTIONS: ProgramItem[] = [
  {
    id: 'school-dev-partnership',
    category: 'schools',
    title: 'School Development Partnership',
    badge: 'Institutional Growth',
    intro: 'A holistic strategic alliance where Kinderbee partners with institutions from blueprint to daily operational excellence, delivering turnkey academic governance, infrastructure planning, and continuous quality audits.',
    targetAudience: 'Educational societies, trust boards, new school founders, and established school managements seeking comprehensive institutional scale and standardisation.',
    durationMode: 'Multi-Year Strategic Alliance • On-Campus & Dedicated Advisory',
    keyOutcomesOrServices: [
      'Institutional blueprint and master roadmap development',
      'Affiliation & regulatory compliance oversight (State NOC, CBSE SARAS)',
      'Standard Operating Procedures (SOPs) across administration and safety',
      'Teacher recruitment, induction, and continuous academic audit',
      'Long-term admissions and institutional reputation building'
    ],
    benefits: [
      'Reduces setup and stabilization gestation period by over 40%',
      'Predictable student admissions and healthy operating margins',
      'Ensures full compliance with NEP 2020 and national board frameworks',
      'Continuous leadership mentorship from veteran educationists'
    ],
    fullDetails: {
      overview: 'Our School Development Partnership is designed for visionary institutions and edupreneurs who require more than just piecemeal advice. We embed seasoned academic and operational directors into your steering committee to ensure every pillar—infrastructure, human resources, curriculum, student safety, and fiscal governance—operates at benchmark standards.',
      deliverablesOrModules: [
        { title: 'Pillar 1: Vision & Infrastructure Master Plan', desc: 'Architectural vetting, child-friendly zoning, safety compliance, and laboratory procurement.' },
        { title: 'Pillar 2: Academic Governance & Board Filings', desc: 'Statutory board documentation, SARAS affiliation readiness, and academic calendar design.' },
        { title: 'Pillar 3: Human Resource & Faculty Capability', desc: 'Talent sourcing, structured multi-round interviews, competency training, and appraisals.' },
        { title: 'Pillar 4: Systems, SOPs & Quality Assurance', desc: 'Periodic audits across safety, classroom instruction, parent sentiment, and operational efficiencies.' }
      ],
      certificationOrAccreditation: 'KIPS Institutional Partner Certificate & SARAS/Board Alignment Guarantee',
      deliverableHighlights: [
        'Complete 150+ page School Governance SOP Handbook',
        'Quarterly Onsite Academic and Operational Audits',
        'Direct Access to Senior Advisory Council'
      ]
    }
  },
  {
    id: 'new-school-planning',
    category: 'schools',
    title: 'New School Planning and Establishment',
    badge: 'Turnkey Green-field',
    intro: 'End-to-end turnkey advisory for planning, designing, establishing, and launching high-caliber Preschools, K-12 CBSE campuses, or IB World schools from ground zero.',
    targetAudience: 'Real estate developers, first-time edupreneurs, industrial conglomerates, and charitable trusts entering the formal schooling sector.',
    durationMode: '6 to 18 Months Turnkey Project • Onsite & Project PMO',
    keyOutcomesOrServices: [
      'Catchment area survey, demographic analysis, and fee feasibility',
      'Campus architectural planning, spatial design, and child ergonomics',
      'Complete lab, furniture, playground, and IT equipment procurement',
      'Statutory compliance roadmap, land use approval, and board affiliation',
      'Pre-launch branding, prospectus creation, and admissions marketing'
    ],
    benefits: [
      'Prevents costly capital expenditure mistakes and regulatory delays',
      'Complete turnkey readiness before the targeted academic year start',
      'Institutional branding that commands premium positioning from day one',
      'Established operational readiness to greet your inaugural student batch'
    ],
    fullDetails: {
      overview: 'Building a greenfield school requires coordinating municipal permissions, state education departments, architectural blueprints, procurement vendors, and academic recruitment. Kinderbee handles the complete lifecycle, ensuring your campus opens on schedule, within budget, and with immediate student enrollment traction.',
      deliverablesOrModules: [
        { title: 'Phase 1: Feasibility & Regulatory Clearance', desc: 'Demographic catchment mapping, pricing strategy, trust registration, and Land/Building bylaws.' },
        { title: 'Phase 2: Campus Design & Ergonomic Fit-Out', desc: 'Architectural zoning, STEM & Composite labs, sensorial play areas, and acoustic classroom planning.' },
        { title: 'Phase 3: Academic Procurement & Systems Setup', desc: 'Textbooks, learning aids, smart boards, ERP software, and school uniforms.' },
        { title: 'Phase 4: Launch & Inaugural Admissions Campaign', desc: 'Experiential launch events, media PR, counselor coaching, and first 100 student enrollments.' }
      ],
      certificationOrAccreditation: 'National Board (CBSE/ICSE/IB) Turnkey Compliance Assurance',
      deliverableHighlights: [
        'Detailed 5-Year Financial & Admissions Projections Model',
        'Turnkey Equipment & Vendor Procurement Master Roster',
        'Pre-Launch Admissions Funnel & Open House Toolkit'
      ]
    }
  },
  {
    id: 'school-transformation',
    category: 'schools',
    title: 'Existing School Transformation',
    badge: 'Turnaround Advisory',
    intro: 'Strategic turnaround advisory engineered to revitalize established institutions facing plateaued enrollment, aging infrastructure, pedagogical stagnation, or shifting local competition.',
    targetAudience: 'School Management Committees, Principals, and Owners of operating schools seeking rapid academic rejuvenation and financial turnaround.',
    durationMode: '3 to 12 Months Intervention • Intensive Onsite Diagnostic & Execution',
    keyOutcomesOrServices: [
      'Comprehensive 360-degree academic and operational audit',
      'Curriculum modernization and experiential pedagogy infusion',
      'Faculty capability assessment, re-training, and mindset shift',
      'Classroom and administrative tech automation (ERP, LMS, Parent App)',
      'Brand refresh, digital presence revamp, and parent advocacy programs'
    ],
    benefits: [
      'Reverses declining enrollment and boosts fresh admissions by 30–50%',
      'Restores parent satisfaction, trust, and word-of-mouth recommendations',
      'Modernizes classroom delivery to meet contemporary 21st-century standards',
      'Energizes faculty morale and reduces mid-year teacher attrition'
    ],
    fullDetails: {
      overview: 'Many established schools have strong local goodwill but struggle with outdated rote teaching methods, disconnected parents, and aggressive new competition. Our Transformation Protocol injects modern early childhood pedagogy, interactive STEM labs, digital parent communication, and dynamic branding without disrupting existing classes.',
      deliverablesOrModules: [
        { title: 'Step 1: 360° Diagnostic Health Check', desc: 'Classroom observations, parent feedback surveys, financial cost leaks, and teacher competency scorecards.' },
        { title: 'Step 2: Pedagogy & Curriculum Upgrade', desc: 'Transition from rote methods to inquiry-based, NEP 2020 aligned experiential frameworks.' },
        { title: 'Step 3: Staff Culture & Upskilling Bootcamps', desc: 'High-impact weekend workshops on active learning, phonics mastery, and classroom management.' },
        { title: 'Step 4: Admissions & Parent Experience Revamp', desc: 'Rebuilt admission desk protocols, open houses, and vibrant social media storytelling.' }
      ],
      deliverableHighlights: [
        'Executive School Health Audit Report with Actionable Roadmap',
        'Custom Faculty Competency Index & Retraining Modules',
        'Turnaround Admission Conversion Playbook'
      ]
    }
  },
  {
    id: 'curriculum-support',
    category: 'schools',
    title: 'Curriculum and Academic Support',
    badge: 'NEP & NCF Aligned',
    intro: 'Research-backed, culturally rich, and child-centered curricula tailored for Foundational Stage (Ages 2–8) and Primary schooling, aligned seamlessly with NEP 2020 and global best practices.',
    targetAudience: 'Preschools, Daycares, Primary Schools, and K-12 networks seeking structured lesson plans, student workbooks, and experiential teaching resources.',
    durationMode: 'Annual Academic Licensing • Term-wise Delivery + Online Portal',
    keyOutcomesOrServices: [
      'Day-wise structured teacher lesson plans and thematic guides',
      'High-quality student activity workbooks and phonics readers',
      'Continuous, holistic assessment rubrics and progress report cards',
      'Learning kits, flashcards, sensory toys, and classroom manipulatives',
      'Digital teacher resource library with audio-visual classroom aids'
    ],
    benefits: [
      'Eliminates lesson planning burden for teachers, ensuring consistent delivery',
      'Delivers measurable acceleration in Foundational Literacy & Numeracy (FLN)',
      'Provides parents with tangible, transparent evidence of child development',
      'Seamlessly satisfies NEP 2020 Foundational Stage guidelines'
    ],
    fullDetails: {
      overview: 'Our curriculum blends Finnish play-based philosophy, Montessori tactile discovery, and NCERT foundational literacy standards. We provide teachers with everything required for engaging classroom facilitation: scripted day-wise lesson plans, manipulative activity guides, phonics songs, and developmentally appropriate student workbooks.',
      deliverablesOrModules: [
        { title: 'Foundational Literacy & Phonics Module', desc: 'Synthetic phonics, phonemic awareness, vocabulary expansion, and early story decoding.' },
        { title: 'Mathematical & Logical Thinking', desc: 'Concrete-Pictorial-Abstract (CPA) numeracy, spatial reasoning, patterns, and sensory geometry.' },
        { title: 'Experiential & Environmental Discovery', desc: 'Nature observation, science experiments, community helpers, and creative arts.' },
        { title: 'Holistic 360° Progress Cards', desc: 'Rubric-based assessment frameworks tracking physical, emotional, and social milestones.' }
      ],
      certificationOrAccreditation: 'NCF-FS & NEP 2020 Aligned Academic Framework',
      deliverableHighlights: [
        'Comprehensive Teacher Master Manuals for Playgroup, Nursery, LKG & UKG',
        'Complete Term-wise Student Activity Packs',
        'Quarterly Curriculum Coordinator Implementation Support'
      ]
    }
  },
  {
    id: 'school-management-guidance',
    category: 'schools',
    title: 'School Management and Operational Guidance',
    badge: 'Operational Excellence',
    intro: 'Institutional governance protocols, standard operating procedures (SOPs), and operational toolkits to optimize school administration, safety, budget utilization, and regulatory compliance.',
    targetAudience: 'School Directors, Trust Chairpersons, Principals, and Operational Managers overseeing multi-branch or growing educational facilities.',
    durationMode: 'Ongoing Operational Mentorship • Cloud Software & Monthly Review',
    keyOutcomesOrServices: [
      'Operational SOP manual (Child protection, fire safety, transport, sanitation)',
      'Financial fee structuring, recovery management, and expense auditing',
      'Parent communication policies and conflict resolution frameworks',
      'Implementation of modern School ERP & Learning Management Systems (LMS)',
      'Campus safety audits and POCSO/regulatory statutory compliance'
    ],
    benefits: [
      'Streamlines administrative chaos and creates transparent, accountable workflows',
      'Reduces overhead waste and improves institutional operational cash flow',
      'Safeguards the school leadership against regulatory and child safety vulnerabilities',
      'Fosters high trust among parents through responsive, professional service'
    ],
    fullDetails: {
      overview: 'Operational lapses in safety, fee collection, or transport can severely damage a school’s reputation overnight. Kinderbee provides battle-tested governance frameworks that turn school administration into a clockwork engine, allowing academic leaders to focus on teaching and child development.',
      deliverablesOrModules: [
        { title: 'Module 1: Statutory & Child Safety SOPs', desc: 'POCSO compliance, background check protocols, CCTV governance, and emergency evacuation drills.' },
        { title: 'Module 2: Fleet & Transport Logistics', desc: 'GPS tracking protocols, driver screening, route optimization, and safety escorts.' },
        { title: 'Module 3: Finance, Fees & Vendor Contracting', desc: 'Automated digital fee collection, fee structuring benchmarks, and cafeteria/supply audits.' },
        { title: 'Module 4: Parent Relationship Management', desc: 'Transparent reporting systems, dispute resolution, and annual parent feedback loops.' }
      ],
      deliverableHighlights: [
        'Complete Standard Operating Procedures (SOP) Digital Repository',
        'Child Safety & POCSO Readiness Audit Checklist',
        'Executive Operational KPI Dashboard'
      ]
    }
  },
  {
    id: 'teacher-recruitment-dev',
    category: 'schools',
    title: 'Teacher Recruitment and Professional Development',
    badge: 'Talent & Faculty',
    intro: 'End-to-end educator talent acquisition combined with structured, continuous professional development (CPD) to build a motivated, competent, and child-centered faculty.',
    targetAudience: 'Schools facing educator shortages, high teacher turnover, or needing to build a world-class founding faculty team.',
    durationMode: 'Year-Round Talent Pipeline • Quarterly Onsite Workshops + LMS',
    keyOutcomesOrServices: [
      'Talent sourcing, psychometric screening, and teaching demonstration panels',
      'Comprehensive New Teacher Induction Bootcamp',
      'Ongoing quarterly pedagogy enhancement workshops',
      'Performance appraisal rubrics and leadership succession planning',
      'Classroom observation feedback and peer mentoring circles'
    ],
    benefits: [
      'Guarantees passionate, certified educators who align with your school philosophy',
      'Drastically slashes mid-year teacher attrition through structured career pathways',
      'Elevates classroom engagement, minimizing behavioral disruptions',
      'Fulfills national mandatory annual teacher training quotas'
    ],
    fullDetails: {
      overview: 'A school is only as inspiring as the teachers inside its classrooms. Kinderbee leverages its nationwide Nursery Teacher Training network to filter top educator talent, conduct rigorous teaching demos, and provide ongoing continuous professional development that keeps teachers inspired and up-to-date.',
      deliverablesOrModules: [
        { title: 'Talent Acquisition & Demo Screening', desc: 'Three-tiered interview process evaluating communication, child empathy, and lesson delivery.' },
        { title: '7-Day Induction Bootcamp', desc: 'Onboarding on school values, lesson plan execution, positive reinforcement, and parent rapport.' },
        { title: 'Classroom Observation Cycles', desc: 'Constructive peer review and micro-teaching video analysis to refine pedagogical delivery.' },
        { title: 'Leadership Pathways for Senior Teachers', desc: 'Preparing standout educators for Academic Coordinator and Headmistress roles.' }
      ],
      deliverableHighlights: [
        'Pre-vetted Educator Candidate Pipeline with Demo Ratings',
        'Annual 50-Hour Teacher Professional Development Calendar',
        'Teacher Performance & Competency Evaluation Matrix'
      ]
    }
  },
  {
    id: 'branding-admissions-growth',
    category: 'schools',
    title: 'Branding, Admissions and Growth Support',
    badge: 'Enrollment & Marketing',
    intro: 'Strategic educational marketing, digital inquiry campaigns, experiential open-house events, and admission desk training engineered to fill classrooms to target capacity.',
    targetAudience: 'Schools aiming to surpass enrollment targets, expand their campus capacity, launch new branches, or elevate their market perception.',
    durationMode: 'Admission Cycle Engagement (3 to 6 Months) • Omnichannel Campaign',
    keyOutcomesOrServices: [
      'Catchment area competitor analysis and distinctive value proposition',
      'High-converting digital admissions funnels (Meta, Google Search, Maps)',
      'School prospectus, brochure, and experiential campus walk-through design',
      'Parent counselor training: inquiry handling and tour conversion tactics',
      'Community engagement: experiential weekend workshops and baby carnivals'
    ],
    benefits: [
      'Achieves 80–100% capacity enrollment before academic session begins',
      'Lowers customer acquisition cost (CAC) per enrolled student',
      'Transforms casual walk-ins into enrolled students with proven counseling scripts',
      'Builds enduring organic community goodwill and multi-year waitlists'
    ],
    fullDetails: {
      overview: 'Admissions success is not about spam advertising; it is about building authentic emotional connection and demonstrable academic trust with modern parents. We optimize your admission journey from the first digital touchpoint to the campus tour and registration desk.',
      deliverablesOrModules: [
        { title: 'Brand Storytelling & Collateral Suite', desc: 'Premium prospectus, interactive enrollment kits, and social media reels capturing joyful campus moments.' },
        { title: 'Local Catchment Lead Generation', desc: 'Targeted hyper-local social campaigns, Google My Business optimization, and community outreach.' },
        { title: 'Admission Counselor Training', desc: 'Scripted inquiry call techniques, active listening, overcoming fee objections, and closing registrations.' },
        { title: 'Experiential Open Houses & Carnivals', desc: 'Engaging weekend events where children experience play stations while parents meet academic leaders.' }
      ],
      deliverableHighlights: [
        'Turnkey Admission Counselor Playbook with Call Scripts',
        'Customized Local Marketing & Event Campaign Calendar',
        'Real-time Inquiry Tracking & Conversion Dashboard'
      ]
    }
  }
];

const EDUCATOR_PROGRAMS: ProgramItem[] = [
  {
    id: 'nursery-teacher-training',
    category: 'educators',
    title: 'Nursery Teacher Training (NTT)',
    badge: 'Flagship Diploma',
    intro: 'India’s foremost early childhood educator diploma, blending child psychology, play-based instructional techniques, sensorial apparatus design, and hands-on classroom internship.',
    targetAudience: 'Aspiring preschool teachers, high school graduates, degree holders, career switchers, and mothers seeking a respected career in education.',
    durationMode: '1 Year Comprehensive Diploma • Hybrid (Live Virtual + Campus Practicum) or Full Classroom',
    keyOutcomesOrServices: [
      'Foundational child psychology and cognitive milestone tracking',
      'Synthetic phonics, storytelling, puppetry, and rhyme facilitation',
      'Preschool lesson planning, circle time management, and learning corners',
      'Art, craft, and recycled learning resource development',
      'Mandatory 60-hour guided classroom internship in accredited partner schools'
    ],
    benefits: [
      'Recognized diploma certificate enabling employment in top preschools and primary schools',
      '100% placement support and campus interview opportunities',
      'Transforms shy candidates into confident, articulate early years educators',
      'Lifelong access to lesson plans, printable resources, and pedagogical updates'
    ],
    fullDetails: {
      overview: 'The Kinderbee NTT Diploma goes far beyond conventional theory. Trainees spend extensive hours in simulation classrooms mastering positive discipline, sensory play tables, phonetic sound articulation, and child safety. You graduate not just with a certificate, but with complete classroom confidence.',
      deliverablesOrModules: [
        { title: 'Module 1: Principles of Child Development (0–6 Years)', desc: 'Brain development, physical and socio-emotional milestones, and observing behavioral patterns.' },
        { title: 'Module 2: Methods & Materials of Nursery Education', desc: 'Montessori, Froebel, and Reggio Emilia approaches adapted to modern schools.' },
        { title: 'Module 3: Foundational Language, Literacy & Phonics', desc: 'Phonics sounds, blending, sight words, storytelling, and early writing readiness.' },
        { title: 'Module 4: Early Math, Science & Sensory Discovery', desc: 'Pre-math concepts, counting manipulatives, kitchen science experiments, and nature play.' },
        { title: 'Module 5: Practical Classroom Internship & Viva', desc: 'Live teaching practice, mentor observations, portfolio preparation, and final viva.' }
      ],
      certificationOrAccreditation: 'Nationally Recognized Kinderbee NTT Professional Diploma',
      deliverableHighlights: [
        'Comprehensive 5-Volume Trainee Study Package',
        'Practical Teaching Kit (Flashcards, Rhyme Charts, Puppetry Basics)',
        'Guaranteed Internship Placement in Reputed Preschools'
      ]
    }
  },
  {
    id: 'advanced-diploma-ecce',
    category: 'educators',
    title: 'Advanced Diploma in Early Childhood Care and Education (ECCE)',
    badge: "Teachers' Day Offer • 90% OFF",
    intro: 'An elite professional qualification covering infant-to-primary child psychology, neurodevelopment, inclusive special education, and early childhood center leadership. Special Teachers’ Day Mega Offer: ₹4,999 only (90% discount, valid until 5 October 2026).',
    targetAudience: 'Experienced teachers, preschool center heads, academic coordinators, daycare founders, and educators seeking senior leadership positions.',
    durationMode: '3 Months (120 Course Hours) • Blended Intensive (10 Hours/Week: Masterclasses, Practical Labs & Action Research)',
    keyOutcomesOrServices: [
      'Neuroscience of early brain architecture and executive functions',
      'Early identification and classroom accommodation of learning differences (SEN)',
      'Design of foundational stage school curriculum and assessment matrices',
      'Staff supervision, teacher mentoring, and professional coaching skills',
      'Child rights, safety laws, POCSO guidelines, and parent counseling'
    ],
    benefits: [
      'Elevates career trajectory to Academic Coordinator, Headmistress, or Center Director',
      'Substantial salary enhancement potential in premium international & CBSE schools',
      'Provides practical acumen to design and run an independent early learning center',
      'Mentorship from veteran child development psychologists and school leaders'
    ],
    fullDetails: {
      overview: 'Modern early education requires leaders who understand the intersection of child development, brain science, and school leadership. This Advanced Diploma prepares you to lead academic teams, counsel anxious parents, design curriculum frameworks, and manage preschool centers with authority. Rephrased as a 3-month intensive program comprising 120 calculated course hours (approx. 10 hours/week over 12 weeks).',
      deliverablesOrModules: [
        { title: 'Advanced Developmental Neurobiology (30 Hours)', desc: 'Executive function development, sensory integration, and impact of trauma/stress on early learning.' },
        { title: 'Inclusive Education & Differentiated Instruction (30 Hours)', desc: 'ADHD, autism spectrum, speech delays, and creating accessible, empathetic classrooms.' },
        { title: 'Curriculum Architecture & Assessment Design (30 Hours)', desc: 'NCF-FS alignment, portfolio-based assessments, and rubric development.' },
        { title: 'Center Leadership & Practical Practicum (30 Hours)', desc: 'Observation techniques, conflict resolution, teacher recruitment, classroom simulation, and capstone project.' }
      ],
      certificationOrAccreditation: 'Finnish-way Academy Advanced ECCE Executive Credential (by Kinderbee)',
      deliverableHighlights: [
        '3 Months • 120 Total Course Hours (~10 Hours/Week Calculated Schedule)',
        'Teachers’ Day Mega Offer: ₹4,999 only (90% Off regular fee, valid until 5 October 2026)',
        'Capstone Action-Research Project on Classroom Innovation',
        'Preschool Center Director Operational Toolkit',
        'Direct Admission & Inquiries: Call 81223 44040 | kinderbeeschools@gmail.com'
      ]
    }
  },
  {
    id: 'play-based-training',
    category: 'educators',
    title: 'Play-Based Teacher Training',
    badge: 'Nordic Pedagogy',
    intro: 'An immersive specialization program mastering Nordic play pedagogy, loose-parts exploration, inquiry-based provocations, and the elimination of rote memorization in early years.',
    targetAudience: 'Preschool teachers, kindergarten educators, daycare facilitators, and homeschooling parents eager to adopt international child-centred methods.',
    durationMode: '3 Months Intensive • Online Interactive Sessions + 4 In-Person Simulation Labs',
    keyOutcomesOrServices: [
      'Setting up engaging classroom learning stations and invitations to play',
      'Utilizing natural and loose-parts materials to stimulate mathematical and spatial thinking',
      'Facilitating child-led inquiry without teacher micromanagement',
      'Outdoor and risk-benefit play facilitation for physical confidence',
      'Documenting learning through pedagogical photos, quotes, and learning stories'
    ],
    benefits: [
      'Transforms chaotic or boring classrooms into joyful, deeply engaged learning sanctuaries',
      'Significant reduction in child behavioral outbursts through purposeful play',
      'Earning a distinctive "Certified Play Practitioner" credential highly sought by premium schools',
      'Access to 200+ ready-to-use play provocations across language, math, and science'
    ],
    fullDetails: {
      overview: 'Play is not a break from learning—it IS the way children learn. Inspired by Finnish early childhood practices and the Reggio Emilia philosophy, this course trains educators to step back from lecturing and step into the role of an intentional environment designer and observant co-explorer.',
      deliverablesOrModules: [
        { title: 'The Anatomy of Play & Brain Architecture', desc: 'How free play builds emotional resilience, problem-solving, and synaptic connections.' },
        { title: 'Loose Parts & Sensorial Environments', desc: 'Transforming cardboard, pinecones, fabric, and clay into powerful STEM manipulatives.' },
        { title: 'Inquiry-Based Provocations', desc: 'Designing tables that provoke curiosity: light tables, water discovery, and balance scales.' },
        { title: 'Pedagogical Documentation', desc: 'Capturing the thinking process of young children through photo essays and portfolios.' }
      ],
      certificationOrAccreditation: 'Kinderbee Certified Play-Based Learning Practitioner',
      deliverableHighlights: [
        '200+ Play Provocations Recipe Book with Printable Guides',
        'Loose Parts Sourcing and Safety Guide',
        'Classroom Environment Makeover Blueprint'
      ]
    }
  },
  {
    id: 'ai-enhanced-training',
    category: 'educators',
    title: 'AI-Enhanced Preschool Teacher Training',
    badge: 'Future-Ready Educator',
    intro: 'A cutting-edge masterclass preparing modern educators to ethically leverage Artificial Intelligence tools to automate lesson preparation, generate captivating visual stories, and personalize learning.',
    targetAudience: 'Tech-forward preschool and primary educators, coordinators, and school trainers who want to reclaim hours of prep time and lead the digital curve.',
    durationMode: '6 Weeks Fast-Track • 100% Live Online + Interactive AI Sandbox Labs',
    keyOutcomesOrServices: [
      'Prompt engineering for early years educators: generating personalized phonics stories in seconds',
      'Creating culturally diverse visual teaching aids, flashcards, and coloring books with AI',
      'Automating individualized student progress summaries and parent observation updates',
      'Generating differentiated math puzzles, rhyming games, and thematic lesson outlines',
      'Ethical AI, digital safety, and screen-time balance in early childhood education'
    ],
    benefits: [
      'Saves 6 to 10 hours every week on mundane lesson planning and documentation paperwork',
      'Equips you with distinct high-tech competencies that stand out in international school interviews',
      'Enables effortless creation of custom-illustrated storybooks tailored to your classroom themes',
      'Awards an exclusive "AI-Enabled Early Childhood Educator" digital credential'
    ],
    fullDetails: {
      overview: 'Artificial intelligence is revolutionizing education, but young children still need high-touch, human, empathetic connection. This masterclass shows teachers how to use AI behind the scenes as a supercharged assistant—cutting administrative prep work so they can spend more quality, heart-centered time engaging with children.',
      deliverablesOrModules: [
        { title: 'AI Foundations & Prompt Crafting for Educators', desc: 'Mastering conversational prompts to produce engaging phonics rhymes and level-appropriate questions.' },
        { title: 'Multimodal Visuals & Custom Learning Aids', desc: 'Generating bespoke flashcards, puppet templates, and visual schedule cards.' },
        { title: 'Automated Documentation & Parent Reporting', desc: 'Transforming bullet-point classroom notes into eloquent, encouraging milestone summaries.' },
        { title: 'Ethical Guidelines & Human-First Pedagogy', desc: 'Maintaining emotional warmth, screen-free classroom environments, and student privacy.' }
      ],
      certificationOrAccreditation: 'Kinderbee AI-Enabled Educator Professional Certificate',
      deliverableHighlights: [
        '100+ Ready-to-Use AI Prompts for Early Years Teaching',
        'Classroom Visual Asset Generator Toolset',
        'Time-Saving Automation Workflows for Parent Newsletters'
      ]
    }
  },
  {
    id: 'short-term-certificates',
    category: 'educators',
    title: 'Short-Term Certificate Courses',
    badge: 'Micro-Credentials',
    intro: 'Bite-sized, modular certificate programs focusing on high-demand classroom skills including Jolly Phonics Mastery, Early Math Manipulatives, Storytelling & Puppetry, and Classroom Behavior Management.',
    targetAudience: 'Working educators seeking immediate upskilling, teacher assistants, homeschool parents, and student teachers wanting targeted skill badges.',
    durationMode: '2 to 4 Weeks per Course • Self-Paced Virtual LMS + Live Weekend Doubt Clinics',
    keyOutcomesOrServices: [
      'Mastery of 42 synthetic phonics sounds, blending rules, and alternative spellings',
      'Voice modulation, dramatic pacing, character voices, and interactive puppetry',
      'Hands-on number sense, tens frames, unifix cubes, and measurement activities',
      'Gentle positive discipline techniques for de-escalating toddler meltdowns',
      'Creation of take-home teaching kits and thematic flashcards'
    ],
    benefits: [
      'Rapid completion with zero disruption to your current teaching schedule',
      'Affordable, high-impact skill upgrades directly applicable to tomorrow’s class',
      'Stackable credits that can be applied toward the full NTT or Advanced ECCE Diploma',
      'Immediate boost to teacher confidence and resume credentials'
    ],
    fullDetails: {
      overview: 'Rather than committing to a full-year course, educators can choose specific competencies they want to elevate immediately. Each short-term course is hyper-focused on actionable classroom techniques that you can implement in your classroom the very next morning.',
      deliverablesOrModules: [
        { title: 'Course Option A: Synthetic Phonics & Reading Readiness', desc: '42 basic sounds, digraphs, segmenting, blending tricks, and decoding fluency.' },
        { title: 'Course Option B: Art of Storytelling & Puppetry', desc: 'Glove puppets, shadow theatre, vocal pacing, and transforming stories into moral lessons.' },
        { title: 'Course Option C: Hands-On Math Manipulatives', desc: 'Concrete math through counters, sorting, patterns, and foundational arithmetic.' },
        { title: 'Course Option D: Positive Behavior Management', desc: 'Navigating biting, separation anxiety, sharing conflicts, and active calm-down corners.' }
      ],
      certificationOrAccreditation: 'Kinderbee Certificate of Pedagogical Competence',
      deliverableHighlights: [
        'Downloadable Activity Sheets & Phonics Audio Pronunciation Guides',
        'Direct Access to Faculty Discussion Forums',
        'Digital Verified Certificate with QR Verification'
      ]
    }
  },
  {
    id: 'workshops-cpd',
    category: 'educators',
    title: 'Workshops and Continuing Professional Development (CPD)',
    badge: 'Accredited CPD',
    intro: 'Dynamic, interactive masterclasses and weekend intensive workshops aligning with mandatory NEP 2020 annual CPD hours for school faculties, early educators, and school leaders.',
    targetAudience: 'School faculties, educator collectives, cluster schools, and individual teachers requiring accredited annual professional development hours.',
    durationMode: '1-Day to 3-Day Intensive Workshops • Onsite at Your Campus or Live Interactive Webinar',
    keyOutcomesOrServices: [
      'Socio-Emotional Learning (SEL) and mindfulness in early childhood',
      'NEP 2020 Foundational Stage (NCF-FS) implementation strategies',
      'Holistic Progress Card (HPC) rubric design and observational evaluation',
      'Designing inclusive, trauma-informed learning spaces',
      'Collaborative teacher peer observation and action research circles'
    ],
    benefits: [
      'Fulfills national regulatory requirements for mandatory 50-hour annual teacher CPD',
      'Energizes faculty morale and introduces fresh, joyful teaching practices to your school',
      'Customized workshop themes mapped directly to your school’s unique improvement areas',
      'Provides practical toolkits, printable rubrics, and activity sheets for all attendees'
    ],
    fullDetails: {
      overview: 'Teaching methods cannot remain frozen while the world evolves. Our CPD workshops bring vibrant, high-energy, experiential professional training directly to your campus or virtual screen, led by certified master educators who have trained thousands of teachers across India.',
      deliverablesOrModules: [
        { title: 'Theme 1: Socio-Emotional Competence & Mindfulness', desc: 'Emotion wheels, calm corners, gratitude journals, and guiding children through big feelings.' },
        { title: 'Theme 2: NCF-FS Implementation in Action', desc: 'Panchakosha five-fold child development model translated into daily classroom routines.' },
        { title: 'Theme 3: Assessment Without Anxiety', desc: 'Anecdotal records, learning checklists, and creating stress-free observational portfolios.' },
        { title: 'Theme 4: Parent-Teacher Synergy & Communication', desc: 'Conducting constructive PTMs, handling demanding parents, and building collaborative partnerships.' }
      ],
      certificationOrAccreditation: 'Kinderbee CPD Certificate of Attendance (Accredited Hours)',
      deliverableHighlights: [
        'Printed Workshop Handbook with Activity Blueprints',
        'Post-Workshop Implementation Assessment & Support',
        'Institutional CPD Compliance Certificate for Schools'
      ]
    }
  }
];

export const ProgramsOverviewPage: React.FC<ProgramsOverviewPageProps> = ({ 
  onOpenConsultation, 
  settings, 
  setCurrentTab 
}) => {
  const [activePathway, setActivePathway] = useState<'all' | 'schools' | 'educators'>('all');
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  const displayedSchools = activePathway === 'educators' ? [] : SCHOOL_SOLUTIONS;
  const displayedEducators = activePathway === 'schools' ? [] : EDUCATOR_PROGRAMS;

  return (
    <div className="bg-[#FAF9F6] text-[#1C1917] min-h-screen pb-24">
      <SEOHead
        title="Programs & Solutions | Kinderbee Integrated Partnership System"
        description="Comprehensive educational development pathways: School Development, New Campus Setup, Transformation, Curriculum, NTT Nursery Teacher Training, and Advanced ECCE Diplomas."
        keywords="school development partnership, new school setup, preschool franchise, NTT teacher training, ECCE diploma, play based training, school consultancy"
        settings={settings}
      />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#220214] via-[#14010C] to-[#1F0214] text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-pink-950/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#E1007A_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,0,122,0.3),transparent_65%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,212,0,0.15),transparent_55%)]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 bg-stone-900/80 border border-[#E1007A]/50 text-pink-200 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
            <span>KIPS INTEGRATED PARTNERSHIP ECOSYSTEM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
            Programs &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-pink-300 to-[#E1007A]">Solutions Directory</span>
          </h1>

          <p className="text-stone-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Choose your pathway to institutional excellence and professional mastery. Explore our two comprehensive verticals designed to build future-ready schools and empower visionary educators.
          </p>

          {/* Pathway Filter Switcher */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActivePathway('all')}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm ${
                activePathway === 'all'
                  ? 'bg-white text-stone-950 shadow-lg scale-102 ring-2 ring-white/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Compass className="w-4 h-4 text-[#E1007A]" />
              <span>All Programs &amp; Solutions (13)</span>
            </button>

            <button
              onClick={() => setActivePathway('schools')}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm ${
                activePathway === 'schools'
                  ? 'bg-[#E1007A] text-white shadow-lg shadow-pink-900/40 scale-102 ring-2 ring-pink-400/40'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#FFD400]" />
              <span>For Schools &amp; Entrepreneurs (7)</span>
            </button>

            <button
              onClick={() => setActivePathway('educators')}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm ${
                activePathway === 'educators'
                  ? 'bg-[#A3001D] text-white shadow-lg shadow-red-950/40 scale-102 ring-2 ring-red-400/40'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#FFD400]" />
              <span>For Aspiring &amp; Working Educators (6)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 space-y-20">

        {/* Pathway 1: For Schools and Educational Entrepreneurs */}
        {displayedSchools.length > 0 && (
          <section id="schools-pathway" className="space-y-8">
            <div className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#E1007A] bg-pink-50 border border-pink-200 px-3.5 py-1 rounded-full">
                  <Building2 className="w-3.5 h-3.5 text-[#E1007A]" />
                  <span>PATHWAY 1 • INSTITUTIONAL ADVANCEMENT</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
                  For Schools and Educational Entrepreneurs
                </h2>
                <p className="text-stone-600 text-sm sm:text-base max-w-3xl">
                  Turnkey consulting, strategic planning, regulatory compliance, teacher staffing, and operational frameworks to establish or transform high-performing educational institutions.
                </p>
              </div>

              <div className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto">
                Showing {displayedSchools.length} Solutions
              </div>
            </div>

            {/* Grid of School Solutions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedSchools.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  <div className="p-6 sm:p-7 space-y-5">
                    {/* Header Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider bg-pink-50 text-[#E1007A] border border-pink-200 px-3 py-1 rounded-full">
                        {item.badge}
                      </span>
                      <span className="text-stone-400 text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Advisory</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900 group-hover:text-[#E1007A] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Brief Introduction */}
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {item.intro}
                    </p>

                    {/* Target Audience (Who it is for) */}
                    <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 text-xs space-y-1">
                      <div className="font-bold text-stone-800 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#E1007A]" />
                        <span>Who it is for:</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed pl-5">
                        {item.targetAudience}
                      </p>
                    </div>

                    {/* Duration and Mode */}
                    <div className="text-xs text-stone-600 flex items-start gap-2 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#E1007A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-stone-800">Duration &amp; Mode: </span>
                        <span>{item.durationMode}</span>
                      </div>
                    </div>

                    {/* Key Services Checklist */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                        Key Services &amp; Deliverables:
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-600">
                        {item.keyOutcomesOrServices.slice(0, 3).map((service, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits Tag */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900">
                      <span className="font-bold">Key Benefit: </span>
                      <span>{item.benefits[0]}</span>
                    </div>
                  </div>

                  {/* Actions Footer: View Details & Speak to Advisor */}
                  <div className="p-6 pt-0 space-y-2.5">
                    <button
                      onClick={() => setSelectedProgram(item)}
                      className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenConsultation(item.title)}
                      className="w-full bg-white hover:bg-pink-50 text-[#E1007A] font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 border border-pink-200 hover:border-pink-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Speak to an Advisor</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pathway 2: For Aspiring and Working Educators */}
        {displayedEducators.length > 0 && (
          <section id="educators-pathway" className="space-y-8 pt-8">
            <div className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#A3001D] bg-red-50 border border-red-200 px-3.5 py-1 rounded-full">
                  <GraduationCap className="w-3.5 h-3.5 text-[#A3001D]" />
                  <span>PATHWAY 2 • TEACHER TRAINING &amp; CERTIFICATION</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
                  For Aspiring and Working Educators
                </h2>
                <p className="text-stone-600 text-sm sm:text-base max-w-3xl">
                  Accredited early childhood diplomas, play-based pedagogical certificates, AI-enabled teaching masterclasses, and continuing professional development (CPD) programs.
                </p>
              </div>

              <div className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto">
                Showing {displayedEducators.length} Programmes
              </div>
            </div>

            {/* Grid of Educator Programs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedEducators.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  <div className="p-6 sm:p-7 space-y-5">
                    {/* Header Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider bg-red-50 text-[#A3001D] border border-red-200 px-3 py-1 rounded-full">
                        {item.badge}
                      </span>
                      <span className="text-stone-400 text-xs font-medium flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Certified</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900 group-hover:text-[#A3001D] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Brief Introduction */}
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {item.intro}
                    </p>

                    {/* Target Audience (Who it is for) */}
                    <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 text-xs space-y-1">
                      <div className="font-bold text-stone-800 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#A3001D]" />
                        <span>Who it is for:</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed pl-5">
                        {item.targetAudience}
                      </p>
                    </div>

                    {/* Duration and Mode */}
                    <div className="text-xs text-stone-600 flex items-start gap-2 pt-1">
                      <Clock className="w-3.5 h-3.5 text-[#A3001D] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-stone-800">Duration &amp; Mode: </span>
                        <span>{item.durationMode}</span>
                      </div>
                    </div>

                    {/* Key Learning Outcomes */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                        Key Learning Outcomes:
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-600">
                        {item.keyOutcomesOrServices.slice(0, 3).map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Programme Benefits */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950">
                      <span className="font-bold text-emerald-900">Programme Benefit: </span>
                      <span>{item.benefits[0]}</span>
                    </div>
                  </div>

                  {/* Actions Footer: View Details & Speak to Advisor */}
                  <div className="p-6 pt-0 space-y-2.5">
                    <button
                      onClick={() => setSelectedProgram(item)}
                      className="w-full bg-[#A3001D] hover:bg-[#850017] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenConsultation(item.title)}
                      className="w-full bg-white hover:bg-red-50 text-[#A3001D] font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 border border-red-200 hover:border-red-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Speak to an Advisor</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Interactive "View Details" Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProgram(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Header Badge & Category */}
              <div>
                <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full border ${
                  selectedProgram.category === 'schools'
                    ? 'bg-pink-50 text-[#E1007A] border-pink-200'
                    : 'bg-red-50 text-[#A3001D] border-red-200'
                }`}>
                  {selectedProgram.badge} • {selectedProgram.category === 'schools' ? 'Institutional Pathway' : 'Educator Training'}
                </span>
                
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 mt-2">
                  {selectedProgram.title}
                </h3>
              </div>

              {/* Extended Overview */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                  Comprehensive Overview
                </h4>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {selectedProgram.fullDetails.overview}
                </p>
              </div>

              {/* Target Audience & Mode Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/70 text-xs">
                <div>
                  <span className="font-bold text-stone-900 block mb-1">Target Audience / Who it is for:</span>
                  <span className="text-stone-600 leading-relaxed">{selectedProgram.targetAudience}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 block mb-1">Duration &amp; Delivery Mode:</span>
                  <span className="text-stone-600 leading-relaxed">{selectedProgram.durationMode}</span>
                </div>
              </div>

              {/* Modules or Deliverables */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                  {selectedProgram.category === 'schools' ? 'Implementation Pillars & Deliverables' : 'Curriculum Modules & Practicum'}
                </h4>
                <div className="space-y-2.5">
                  {selectedProgram.fullDetails.deliverablesOrModules.map((item, idx) => (
                    <div key={idx} className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60">
                      <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-stone-600 text-xs mt-1 pl-6 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Benefits List */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                  Measurable Programme Benefits
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                  {selectedProgram.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlights & Accreditations */}
              {selectedProgram.fullDetails.deliverableHighlights && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-xs">
                  <span className="font-bold text-amber-950 block">Deliverables &amp; Recognition Included:</span>
                  <ul className="space-y-1 text-amber-900">
                    {selectedProgram.fullDetails.deliverableHighlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal CTAs */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const title = selectedProgram.title;
                    setSelectedProgram(null);
                    onOpenConsultation(title);
                  }}
                  className="flex-1 bg-[#E1007A] hover:bg-pink-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Speak to an Advisor About {selectedProgram.title}</span>
                </button>

                <button
                  onClick={() => setSelectedProgram(null)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3.5 px-6 rounded-xl text-sm transition cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Ready to Consult Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        <div className="bg-gradient-to-br from-pink-50 via-amber-50 to-red-50 text-stone-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-pink-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900">
              Need Help Choosing the Right Pathway?
            </h3>
            <p className="text-stone-600 text-sm sm:text-base max-w-xl">
              Connect directly with our senior institutional directors and educator training advisors to craft a personalized roadmap for your school or professional career.
            </p>
          </div>

          <button
            onClick={() => onOpenConsultation('Institutional & Educator Pathway Advice')}
            className="bg-[#A3001D] hover:bg-[#850017] text-white font-bold px-8 py-4 rounded-xl text-sm sm:text-base transition duration-200 shadow-lg shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Speak to a Senior Advisor</span>
          </button>
        </div>
      </section>

    </div>
  );
};
