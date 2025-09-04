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
  experience: [
    {
      role: "Full Stack Developer",
      company: "Freelance Projects",
      period: "2022 — Present",
      summary: "Developing web applications using .NET Framework, Angular, and modern database technologies. Focus on clean architecture and scalable solutions."
    },
    {
      role: "Computer Science Student",
      company: "Academic Projects",
      period: "2020 — 2024",
      summary: "Completed various projects in software engineering, database design, and web development. Strong foundation in algorithms and data structures."
    }
  ],
  contact: {
    blurb: "Open to opportunities and collaborations."
  }
};

  // Log successful initialization
  console.log('Portfolio data initialized successfully');
})();

