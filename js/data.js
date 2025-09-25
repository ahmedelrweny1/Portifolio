// Initialize portfolio data
(function() {
  'use strict';
  
  // Make sure we're in a browser environment
  if (typeof window === 'undefined') {
    console.error('Not in browser environment');
    return;
  }

  window.PORTFOLIO_DATA = {
  meta: {
    siteTitle: "Ahmed Elrweny — Full Stack Developer",
    favicon: ""
  },
  basics: {
    name: "Ahmed Elrweny",
    role: "Full Stack Developer",
    location: "Kafr EL-Sheikh, Egypt",
    email: "elrwenyahmed05@gmail.com",
    resumeUrl: "assets/Resume.pdf",
    profileImage: "assets/Personal2.jpg",
    about: "I'm Ahmed, a full-stack developer who traded the safety of traditional Engineering for the creative chaos of Computer Science.\n\nI thrive in the space between \"that won’t work\" and \"how did you do that?\"\nChess player ♞ | Football striker ⚽ | Gamer 🎮 | Problem-solver 🔧\nRoutine code makes me twitch. Unsolved puzzles make me smile.\nIf you're looking for someone who follows instructions, keep scrolling.\nIf you want someone who rewrites them — we should talk.",
    ctaPrimaryText: "View Projects",
    ctaSecondaryText: "Contact Me"
  },
  social: [
    { label: "GitHub", url: "https://github.com/ahmedelrweny1" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/ahmed-elrweny/" }
  ],
  skillCategories: [
    {
      name: "Backend",
      skills: [
        { name: "C#/.NET", level: "Advanced" },
        { name: "ASP.NET MVC", level: "Advanced" },
        { name: "ASP.NET Core", level: "Advanced" },
        { name: "Entity Framework", level: "Advanced" },
        { name: "REST APIs", level: "Advanced" },
        { name: "PHP", level: "Intermediate" }
      ]
    },
    {
      name: "Frontend",
      skills: [
        { name: "Angular", level: "Advanced" },
        { name: "JavaScript", level: "Advanced" },
        { name: "TypeScript", level: "Intermediate" },
        { name: "HTML5", level: "Advanced" },
        { name: "CSS3", level: "Advanced" },
        { name: "Bootstrap", level: "Advanced" }
      ]
    },
    {
      name: "Database",
      skills: [
        { name: "SQL Server", level: "Advanced" },
        { name: "MySQL", level: "Advanced" },
        { name: "Database Design", level: "Advanced" }
      ]
    },
    {
      name: "Tools & Other",
      skills: [
        { name: "Git", level: "Advanced" },
        { name: "Visual Studio", level: "Advanced" },
        { name: "VS Code", level: "Advanced" },
        { name: "Problem Solving", level: "Advanced" },
        { name: "Software Architecture", level: "Intermediate" }
      ]
    }
  ],
  projects: [
    {
      title: "Task Management System",
      description: "Full-stack MVC application for task management with role-based access control and real-time updates.",
      tech: ["C#", "ASP.NET MVC", "SQL Server", "Entity Framework"],
      url: "https://github.com/ahmedelrweny1",
      image: "assets/MainPage.png"
    },
    {
      title: "Job Simulation Platform",
      description: "Interactive platform for simulating real-world job scenarios and skill assessments.",
      tech: ["C#", ".NET Core", "SQL Server", "REST APIs"],
      url: "https://github.com/ahmedelrweny1",
      image: "assets/MainPage2.png"
    },
    {
      title: "Library Management System",
      description: "Web-based library management system with book tracking, user management, and rental functionality.",
      tech: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript"],
      url: "https://github.com/ahmedelrweny1"
    }
  ],
  certificates: [
    { title: "ACPC", image: "assets/certificates/ACPC.jpg", description: "Arab Collegiate Programming Contest participation and problem-solving achievement." },
    { title: "ALA", image: "assets/certificates/ALA.jpg", description: "ALX/ALA program certificate highlighting leadership and technology growth." },
    { title: "IEEE", image: "assets/certificates/IEEE.jpg", description: "IEEE certificate recognizing contributions and engagement in engineering community." }
  ],
  experience: [
    {
      role: "Summer Intern",
      company: "Digital Egypt Pioneers Initiative (DEPI)",
      period: "Jun 2025 — Present",
      summary: "Full‑stack .NET internship (hybrid, Alexandria). Building skills in .NET Framework and freelancing workflows while working on real‑world solutions and expanding professional connections."
    },
    {
      role: "ALA Program Attendant",
      company: "African Leadership Academy",
      period: "Jun 2025 — Jun 2025",
      summary: "Led a team under the BUILD slogan (Believe, Understand, Innovate, Deliver) to tackle digital device addiction. Proposed a software/mobile app solution and presented it. Presentation: <a href=\"https://www.canva.com/design/DAGtyVcDDEs/1UeMHq9iv_BVZCLvGRQJ3A/edit?ui=eyJIIjp7IkEiOnRydWV9fQ\" target=\"_blank\" rel=\"noopener\">Canva link</a>."
    },
    {
      role: "Backend .NET Member",
      company: "IEEE",
      period: "Oct 2024 — Feb 2025",
      summary: "Built an ASP.NET MVC company task management app with a team. Stack: ASP.NET MVC, Entity Framework, LINQ, C#, SQL Server, HTML5, CSS3, Bootstrap. Features covered admin CRUD, task assignment and tracking, supervisors oversight, and employee task delivery."
    }
  ],
  education: [
    {
      school: "Kafr El-Sheikh University",
      degree: "B.Sc. in Computer Science",
      period: "2020 — 2024",
      summary: "Focused on software engineering, web development, and algorithms.",
      skills: ["Data Structures", "Algorithms", "OOP", "Database Design", "Web Development"]
    }
  ],
  contact: {
    blurb: "Open to opportunities and collaborations."
  }
};

  // Log successful initialization
  console.log('Portfolio data initialized successfully');
})();

