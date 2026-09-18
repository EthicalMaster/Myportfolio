// ─── About Section Data ──────────────────────────────────────────────────────
// Single source of truth for all About content.
// Edit this file to update education, skills, certifications, interests, etc.
// The UI reads from these exports — no component changes needed.

export interface Education {
  title: string;
  institution: string;
  period: string;
  description: string;
  accent: boolean;
}

export const education: Education[] = [
  {
    title: "B.Tech CSE — Data Science",
    institution: "Acropolis Institute of Technology & Research, Indore",
    period: "2025 — Present",
    description:
      "Pursuing Bachelor of Technology in Computer Science & Engineering with specialization in Data Science. Building strong foundations in algorithms, data structures, machine learning, and full-stack development.",
    accent: true,
  },
  {
    title: "BS in Data Science & Application",
    institution: "Indian Institute of Technology Madras (Online)",
    period: "2025 — Present",
    description:
      "Currently in the Foundation Level of the BS degree program. Studying mathematics, statistics, computational thinking, and Python programming through IIT Madras's rigorous online curriculum.",
    accent: false,
  },
];

export interface SkillCategory {
  label: string;
  items: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    label: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "C/C++", "SQL", "HTML/CSS"],
  },
  {
    label: "Frameworks",
    items: ["React", "Next.js", "Node.js", "Flask", "Tailwind CSS", "Framer Motion"],
  },
  {
    label: "Data & ML",
    items: ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Matplotlib", "Power BI"],
  },
  {
    label: "Tools",
    items: ["Git & GitHub", "VS Code", "Docker", "Linux", "Figma", "Jupyter"],
  },
];

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  image?: string;
  credentialUrl?: string;
}

// Section renders automatically when this array has entries, hidden when empty.
export const certifications: Certification[] = [];

export interface CurrentProject {
  title: string;
  description: string;
  status: string;
  year: string;
  tags: string[];
}

export const currentlyBuilding: CurrentProject = {
  title: "AI-Powered Sentiment Analyzer",
  description:
    "A machine learning pipeline that analyzes social media sentiment in real-time using NLP techniques, built with Python, Scikit-learn, and a React dashboard for visualization.",
  status: "In Development",
  year: "2026",
  tags: ["Python", "Scikit-learn", "React", "NLP", "Flask"],
};

export const interests: string[] = [
  "AI systems & Data-driven applications",
  "Software products & Developer tools",
  "Creative technology",
];

// Social profiles — paste your URLs here. Empty strings are hidden from the UI.
export const socialLinks = {
  instagram: "https://www.instagram.com/taher.saifee87?stkn=MXFzaXQ2YTJ3YmV0dQ==",
  linkedin: "https://www.linkedin.com/in/taher-saifee",
};
