export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  image?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "AI-Powered Sentiment Analyzer",
    description:
      "A machine learning pipeline that analyzes social media sentiment in real-time using NLP techniques, built with Python, Scikit-learn, and a React dashboard for visualization.",
    tags: ["Python", "Scikit-learn", "React", "NLP", "Flask"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: 2,
    title: "Smart Campus Dashboard",
    description:
      "A full-stack web dashboard for monitoring campus resources — attendance, library, canteen — with real-time data visualization and role-based authentication.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Chart.js", "Tailwind"],
    link: "https://example.com",
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: 3,
    title: "Neural Style Transfer App",
    description:
      "Deep learning application that applies artistic styles to photographs using convolutional neural networks. Built with TensorFlow and deployed via Streamlit.",
    tags: ["TensorFlow", "Python", "CNN", "Streamlit"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: 4,
    title: "Portfolio Website",
    description:
      "This very website — a premium, motion-rich portfolio built with Next.js, Framer Motion, and Tailwind CSS. Features smooth scroll, glassmorphism, and micro-animations.",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1481481156828-984bb3a0bcf5?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    id: 5,
    title: "Data Pipeline Automator",
    description:
      "An ETL pipeline tool that automates data ingestion, cleaning, and transformation from multiple sources into a unified data warehouse format.",
    tags: ["Python", "Pandas", "Airflow", "SQL", "Docker"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    id: 6,
    title: "Chat with PDF — RAG Application",
    description:
      "A Retrieval-Augmented Generation app that lets users upload PDFs and ask questions about the content, powered by LangChain and OpenAI embeddings.",
    tags: ["LangChain", "OpenAI", "FAISS", "Streamlit", "Python"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
];

export interface Skill {
  name: string;
  category: "languages" | "frameworks" | "tools" | "data";
  proficiency: number; // 0-100
}

export const skills: Skill[] = [
  // Languages
  { name: "Python", category: "languages", proficiency: 90 },
  { name: "JavaScript", category: "languages", proficiency: 85 },
  { name: "TypeScript", category: "languages", proficiency: 80 },
  { name: "C/C++", category: "languages", proficiency: 70 },
  { name: "SQL", category: "languages", proficiency: 85 },
  { name: "HTML/CSS", category: "languages", proficiency: 90 },

  // Frameworks
  { name: "React", category: "frameworks", proficiency: 85 },
  { name: "Next.js", category: "frameworks", proficiency: 80 },
  { name: "Node.js", category: "frameworks", proficiency: 75 },
  { name: "Flask", category: "frameworks", proficiency: 70 },
  { name: "Tailwind CSS", category: "frameworks", proficiency: 90 },
  { name: "Framer Motion", category: "frameworks", proficiency: 75 },

  // Data Science & ML
  { name: "Pandas", category: "data", proficiency: 85 },
  { name: "NumPy", category: "data", proficiency: 85 },
  { name: "Scikit-learn", category: "data", proficiency: 75 },
  { name: "TensorFlow", category: "data", proficiency: 65 },
  { name: "Matplotlib", category: "data", proficiency: 80 },
  { name: "Power BI", category: "data", proficiency: 70 },

  // Tools
  { name: "Git & GitHub", category: "tools", proficiency: 85 },
  { name: "VS Code", category: "tools", proficiency: 95 },
  { name: "Docker", category: "tools", proficiency: 60 },
  { name: "Linux", category: "tools", proficiency: 70 },
  { name: "Figma", category: "tools", proficiency: 65 },
  { name: "Jupyter", category: "tools", proficiency: 90 },
];

export interface Experience {
  id: number;
  title: string;
  organization: string;
  period: string;
  description: string;
  type: "education" | "experience";
}

export const experiences: Experience[] = [
  {
    id: 1,
    title: "B.Tech CSE — Data Science",
    organization: "Acropolis Institute of Technology & Research, Indore",
    period: "2025 — Present",
    description:
      "Pursuing Bachelor of Technology in Computer Science & Engineering with specialization in Data Science. Building strong foundations in algorithms, data structures, machine learning, and full-stack development.",
    type: "education",
  },
  {
    id: 2,
    title: "BS in Data Science & Application",
    organization: "Indian Institute of Technology Madras (Online)",
    period: "2025 — Present",
    description:
      "Currently in the Foundation Level of the BS degree program. Studying mathematics, statistics, computational thinking, and Python programming through IIT Madras's rigorous online curriculum.",
    type: "education",
  },
];
