export const users = [
  {
    id: 'u1', name: 'Ava Chen', email: 'ava@example.com', role: 'student',
    avatar: 'https://i.pravatar.cc/100?img=47', bio: 'Passionate about web dev.',
    joinDate: '2024-01-15', status: 'active',
  },
  {
    id: 'u2', name: 'Liam Patel', email: 'liam@example.com', role: 'student',
    avatar: 'https://i.pravatar.cc/100?img=12', bio: 'Learning design.',
    joinDate: '2024-03-02', status: 'active',
  },
  {
    id: 'u3', name: 'Sofia Ortiz', email: 'sofia@example.com', role: 'student',
    avatar: 'https://i.pravatar.cc/100?img=32', bio: 'Data enthusiast.',
    joinDate: '2024-05-20', status: 'active',
  },
  {
    id: 'u4', name: 'Noah Kim', email: 'noah@example.com', role: 'student',
    avatar: 'https://i.pravatar.cc/100?img=53', bio: 'Junior dev.',
    joinDate: '2024-07-11', status: 'suspended',
  },
  {
    id: 'i1', name: 'Prof. Maria Gomez', email: 'maria@learnhub.io', role: 'instructor',
    avatar: 'https://i.pravatar.cc/100?img=44', bio: '10 years teaching programming.',
    joinDate: '2023-11-01', status: 'active', verified: true,
  },
  {
    id: 'i2', name: 'Ravi Singh', email: 'ravi@learnhub.io', role: 'instructor',
    avatar: 'https://i.pravatar.cc/100?img=59', bio: 'UI/UX designer & educator.',
    joinDate: '2024-02-14', status: 'active', verified: true,
  },
  {
    id: 'i3', name: 'Elena Vasquez', email: 'elena@learnhub.io', role: 'instructor',
    avatar: 'https://i.pravatar.cc/100?img=26', bio: 'Data scientist.',
    joinDate: '2024-04-09', status: 'active', verified: false,
  },
  {
    id: 'i4', name: 'Daniel Ross', email: 'daniel@learnhub.io', role: 'instructor',
    avatar: 'https://i.pravatar.cc/100?img=33', bio: 'Marketing strategist.',
    joinDate: '2024-06-18', status: 'active', verified: true,
  },
  {
    id: 'a1', name: 'Admin User', email: 'admin@learnhub.io', role: 'admin',
    avatar: 'https://i.pravatar.cc/100?img=68', bio: 'Platform admin.',
    joinDate: '2023-01-01', status: 'active',
  },
];

export const categories = [
  { id: 'c1', name: 'Web Development', courses: 12 },
  { id: 'c2', name: 'Design', courses: 8 },
  { id: 'c3', name: 'Business', courses: 6 },
  { id: 'c4', name: 'Data Science', courses: 7 },
  { id: 'c5', name: 'Marketing', courses: 5 },
  { id: 'c6', name: 'Photography', courses: 4 },
];

export const curriculum = {
  'course-1': [
    {
      id: 'sec1', title: 'Getting Started', lessons: [
        { id: 'l1', type: 'video', title: 'Welcome to the Course', duration: 240, isPreview: true },
        { id: 'l2', type: 'text', title: 'Course Roadmap', duration: 0, isPreview: true },
        { id: 'l3', type: 'video', title: 'Your Development Environment', duration: 480, isPreview: false },
      ],
    },
    {
      id: 'sec2', title: 'JavaScript Fundamentals', lessons: [
        { id: 'l4', type: 'video', title: 'Variables & Data Types', duration: 600, isPreview: false },
        { id: 'l5', type: 'video', title: 'Functions & Scope', duration: 720, isPreview: false },
        { id: 'l6', type: 'quiz', title: 'JavaScript Basics Quiz', duration: 300, isPreview: false },
      ],
    },
    {
      id: 'sec3', title: 'React Essentials', lessons: [
        { id: 'l7', type: 'video', title: 'Components & Props', duration: 840, isPreview: false },
        { id: 'l8', type: 'assignment', title: 'Build a Component', duration: 0, isPreview: false },
        { id: 'l9', type: 'video', title: 'State & Events', duration: 900, isPreview: false },
        { id: 'l10', type: 'quiz', title: 'React Fundamentals Quiz', duration: 400, isPreview: false },
      ],
    },
  ],
  'course-2': [
    {
      id: 'sec1', title: 'Design Principles', lessons: [
        { id: 'l1', type: 'video', title: 'What is Good Design?', duration: 360, isPreview: true },
        { id: 'l2', type: 'video', title: 'Color Theory', duration: 540, isPreview: false },
      ],
    },
    {
      id: 'sec2', title: 'UI Design', lessons: [
        { id: 'l3', type: 'video', title: 'Typography', duration: 480, isPreview: false },
        { id: 'l4', type: 'assignment', title: 'Design a Landing Page', duration: 0, isPreview: false },
      ],
    },
  ],
  'course-3': [
    {
      id: 'sec1', title: 'Data Fundamentals', lessons: [
        { id: 'l1', type: 'video', title: 'Intro to Data Science', duration: 420, isPreview: true },
        { id: 'l2', type: 'video', title: 'Statistics Basics', duration: 600, isPreview: false },
      ],
    },
  ],
  'course-4': [
    {
      id: 'sec1', title: 'Business Strategy', lessons: [
        { id: 'l1', type: 'video', title: 'Market Analysis', duration: 480, isPreview: true },
      ],
    },
  ],
};

export const courses = [
  {
    id: 'course-1', title: 'Complete React Developer Bootcamp', subtitle: 'Master React from scratch',
    description: 'A comprehensive bootcamp covering everything from JavaScript fundamentals to advanced React patterns and modern tooling.',
    instructorId: 'i1', category: 'c1', level: 'Beginner', price: 89.99, status: 'published',
    thumbnail: 'https://picsum.photos/seed/react/400/225', rating: 4.8, studentCount: 23400,
    enrolledCount: 23400, language: 'English', updatedAt: '2026-08-01', bestseller: true,
    prerequisites: [],
    whatYouLearn: ['Build production-ready React apps', 'Master hooks and state management', 'Understand the component lifecycle'],
  },
  {
    id: 'course-2', title: 'UI/UX Design Masterclass', subtitle: 'Design beautiful, usable interfaces',
    description: 'Learn the principles of great user interface and experience design, from wireframing to polished prototypes.',
    instructorId: 'i2', category: 'c2', level: 'Intermediate', price: 74.99, status: 'published',
    thumbnail: 'https://picsum.photos/seed/design/400/225', rating: 4.6, studentCount: 12800,
    enrolledCount: 12800, language: 'English', updatedAt: '2026-07-20', bestseller: false,
    whatYouLearn: ['Design systems and components', 'Wireframing and prototyping', 'User research fundamentals'],
  },
  {
    id: 'course-3', title: 'Data Science with Python', subtitle: 'From data to insights',
    description: 'Practical data science using Python, pandas, and machine learning. Perfect for aspiring data analysts.',
    instructorId: 'i3', category: 'c4', level: 'Beginner', price: 99.99, status: 'published',
    thumbnail: 'https://picsum.photos/seed/data/400/225', rating: 4.7, studentCount: 9800,
    enrolledCount: 9800, language: 'English', updatedAt: '2026-08-10', bestseller: true,
    whatYouLearn: ['Analyze data with pandas', 'Build ML models with scikit-learn', 'Visualize data insights'],
  },
  {
    id: 'course-4', title: 'Business Strategy 101', subtitle: 'Think like a strategist',
    description: 'A practical introduction to business strategy, market positioning, and growth frameworks.',
    instructorId: 'i2', category: 'c3', level: 'Advanced', price: 54.99, status: 'published',
    thumbnail: 'https://picsum.photos/seed/business/400/225', rating: 4.4, studentCount: 5600,
    enrolledCount: 5600, language: 'English', updatedAt: '2026-06-15', bestseller: false,
    whatYouLearn: ['Strategic frameworks', 'Market positioning', 'Growth strategies'],
  },
  {
    id: 'course-5', title: 'Digital Marketing Fundamentals', subtitle: 'Drive growth online',
    description: 'Learn the core channels of digital marketing — SEO, social, email, and paid advertising.',
    instructorId: 'i3', category: 'c5', level: 'Beginner', price: 0, status: 'published',
    thumbnail: 'https://picsum.photos/seed/marketing/400/225', rating: 4.5, studentCount: 16700,
    enrolledCount: 16700, language: 'English', updatedAt: '2026-05-01', bestseller: false,
    whatYouLearn: ['SEO essentials', 'Social media strategy', 'Email marketing'],
  },
  {
    id: 'course-6', title: 'Advanced JavaScript Patterns', subtitle: 'Level up your JS skills',
    description: 'Deep dive into advanced JavaScript concepts, design patterns, and performance optimization.',
    instructorId: 'i1', category: 'c1', level: 'Advanced', price: 64.99, status: 'published',
    thumbnail: 'https://picsum.photos/seed/js/400/225', rating: 4.9, studentCount: 8900,
    enrolledCount: 8900, language: 'English', updatedAt: '2026-09-01', bestseller: true,
    whatYouLearn: ['Design patterns in JS', 'Async programming mastery', 'Performance tuning'],
  },
  {
    id: 'course-7', title: 'Photography for Beginners', subtitle: 'Capture stunning images',
    description: 'Master your camera, composition, and lighting to take professional-quality photos.',
    instructorId: 'i2', category: 'c6', level: 'Beginner', price: 39.99, status: 'published',
    thumbnail: 'https://picsum.photos/seed/photo/400/225', rating: 4.3, studentCount: 4200,
    enrolledCount: 4200, language: 'English', updatedAt: '2026-04-10', bestseller: false,
    whatYouLearn: ['Camera settings', 'Composition rules', 'Lighting basics'],
  },
  {
    id: 'course-8', title: 'Full-Stack Web Development', subtitle: 'Frontend + backend + deployment',
    description: 'Build complete web applications from frontend to backend to deployment.',
    instructorId: 'i1', category: 'c1', level: 'Intermediate', price: 119.99, status: 'published',
    thumbnail: 'https://picsum.photos/seed/fullstack/400/225', rating: 4.7, studentCount: 15400,
    enrolledCount: 15400, language: 'English', updatedAt: '2026-08-20', bestseller: false,
    whatYouLearn: ['REST APIs', 'Database design', 'DevOps basics'],
  },
  {
    id: 'course-9', title: 'Node.js & Express APIs', subtitle: 'Build scalable backends',
    description: 'Create production-ready REST APIs with Node.js, Express, and MongoDB from design to deployment.',
    instructorId: 'i1', category: 'c1', level: 'Beginner', price: 69.99, status: 'published',
    thumbnail: 'https://picsum.photos/seed/nodejs/400/225', rating: 4.6, studentCount: 11200,
    enrolledCount: 11200, language: 'English', updatedAt: '2026-08-25', bestseller: false,
    whatYouLearn: ['REST API design', 'Express middleware', 'MongoDB integration'],
  },
  {
    id: 'course-draft', title: 'Machine Learning Bootcamp', subtitle: 'From zero to ML engineer',
    description: 'A comprehensive machine learning course covering algorithms, neural networks, and practical projects.',
    instructorId: 'i3', category: 'c4', level: 'Intermediate', price: 129.99, status: 'draft',
    thumbnail: 'https://picsum.photos/seed/ml/400/225', rating: 0, studentCount: 0,
    enrolledCount: 0, language: 'English', updatedAt: '2026-09-05', bestseller: false,
    whatYouLearn: ['Supervised learning', 'Neural networks', 'Model evaluation'],
  },
  {
    id: 'course-pending', title: 'Game Development with Unity', subtitle: 'Build your first game',
    description: 'Learn Unity and C# to build 2D and 3D games from scratch.',
    instructorId: 'i1', category: 'c1', level: 'Beginner', price: 79.99, status: 'pending',
    thumbnail: 'https://picsum.photos/seed/game/400/225', rating: 0, studentCount: 0,
    enrolledCount: 0, language: 'English', updatedAt: '2026-09-06', bestseller: false,
    whatYouLearn: ['Unity fundamentals', 'C# scripting', 'Game physics'],
  },
];

export const enrollments = [
  { id: 'e1', studentId: 'u1', courseId: 'course-1', progress: 45, enrolledAt: '2026-07-01', completedLessonIds: ['l1','l2','l3','l4'] },
  { id: 'e2', studentId: 'u1', courseId: 'course-2', progress: 20, enrolledAt: '2026-07-15', completedLessonIds: ['l1'] },
  { id: 'e3', studentId: 'u1', courseId: 'course-5', progress: 0, enrolledAt: '2026-08-20', completedLessonIds: [] },
  { id: 'e4', studentId: 'u2', courseId: 'course-1', progress: 100, enrolledAt: '2026-05-10', completedLessonIds: ['l1','l2','l3','l4','l5','l6','l7','l8','l9','l10'], completedAt: '2026-08-01' },
  { id: 'e5', studentId: 'u2', courseId: 'course-6', progress: 60, enrolledAt: '2026-07-20', completedLessonIds: ['l1','l2','l3','l4'] },
  { id: 'e6', studentId: 'u3', courseId: 'course-3', progress: 75, enrolledAt: '2026-06-01', completedLessonIds: ['l1','l2'] },
];

export const quizzes = {
  'l6': {
    id: 'l6', courseId: 'course-1', title: 'JavaScript Basics Quiz', passingScore: 70,
    questions: [
      { id: 'q1', text: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'const', 'Both let and const'], correctOptionIndex: 3 },
      { id: 'q2', text: 'What type is the value of `typeof [1,2]`?', options: ['array', 'object', 'list', 'undefined'], correctOptionIndex: 1 },
      { id: 'q3', text: 'Which method adds an element to the end of an array?', options: ['unshift', 'push', 'pop', 'append'], correctOptionIndex: 1 },
    ],
  },
  'l10': {
    id: 'l10', courseId: 'course-1', title: 'React Fundamentals Quiz', passingScore: 70,
    questions: [
      { id: 'q1', text: 'What hook manages local state in a component?', options: ['useEffect', 'useState', 'useRef', 'useMemo'], correctOptionIndex: 1 },
      { id: 'q2', text: 'How do you pass data from parent to child?', options: ['state', 'props', 'context', 'refs'], correctOptionIndex: 1 },
      { id: 'q3', text: 'Which hook runs side effects?', options: ['useState', 'useEffect', 'useReducer', 'useLayout'], correctOptionIndex: 1 },
    ],
  },
};

export const assignments = [
  {
    id: 'a1', courseId: 'course-1', lessonId: 'l8', title: 'Build a Component',
    instructions: 'Create a reusable card component in React with props for title and description.',
    submissionType: 'file', dueDate: '2026-09-20', status: 'open', courseTitle: 'Complete React Developer Bootcamp',
  },
  {
    id: 'a2', courseId: 'course-2', lessonId: 'l4', title: 'Design a Landing Page',
    instructions: 'Design a landing page for a fictional product using your preferred tool.',
    submissionType: 'file', dueDate: '2026-09-25', status: 'submitted', submittedAt: '2026-09-05', courseTitle: 'UI/UX Design Masterclass',
  },
  {
    id: 'a3', courseId: 'course-1', lessonId: 'l8', title: 'Build a Component (Retake)',
    instructions: 'Redo the component with better prop validation.',
    submissionType: 'text', dueDate: '2026-09-30', status: 'graded', grade: 92, feedback: 'Great use of prop types!', courseTitle: 'Complete React Developer Bootcamp',
  },
];

export const submissions = [
  { id: 's1', assignmentId: 'a2', studentId: 'u1', content: 'landing-page.fig', fileUrl: '#', submittedAt: '2026-09-05' },
  { id: 's2', assignmentId: 'a3', studentId: 'u1', content: 'My revised component handles edge cases with PropTypes.', submittedAt: '2026-09-01', grade: 92, feedback: 'Great use of prop types!' },
];

export const reviews = [
  { id: 'r1', courseId: 'course-1', studentId: 'u2', studentName: 'Liam Patel', rating: 5, comment: 'Excellent course, very engaging!', createdAt: '2026-08-05' },
  { id: 'r2', courseId: 'course-1', studentId: 'u3', studentName: 'Sofia Ortiz', rating: 4, comment: 'Great content but could use more exercises.', createdAt: '2026-07-28' },
  { id: 'r3', courseId: 'course-1', studentId: 'u4', studentName: 'Noah Kim', rating: 5, comment: 'Best React course I have taken.', createdAt: '2026-07-15' },
  { id: 'r4', courseId: 'course-2', studentId: 'u1', studentName: 'Ava Chen', rating: 5, comment: 'Loved the design systems section!', createdAt: '2026-08-10' },
];

export const notifications = [
  { id: 'n1', userId: 'u1', type: 'grade', message: 'Your assignment was graded: 92%', isRead: false, createdAt: '2026-09-06' },
  { id: 'n2', userId: 'u1', type: 'announcement', message: 'New announcement in Complete React Bootcamp', isRead: false, createdAt: '2026-09-05' },
  { id: 'n3', userId: 'u1', type: 'price', message: 'Data Science with Python dropped in price!', isRead: true, createdAt: '2026-09-02' },
  { id: 'n4', userId: 'u1', type: 'enrollment', message: 'You enrolled in Digital Marketing Fundamentals', isRead: true, createdAt: '2026-08-20' },
];

export const messages = [
  { id: 'm1', courseId: 'course-1', courseTitle: 'Complete React Developer Bootcamp', type: 'announcement', title: 'Welcome to the course!', body: 'Glad to have you on board. Please watch the intro video first.', from: 'Prof. Maria Gomez', createdAt: '2026-07-02' },
  { id: 'm2', courseId: 'course-1', courseTitle: 'Complete React Developer Bootcamp', type: 'qa', title: 'Question about hooks', body: 'Can someone explain the difference between useEffect and useLayoutEffect?', from: 'Sofia Ortiz', createdAt: '2026-08-12' },
  { id: 'm3', courseId: 'course-2', courseTitle: 'UI/UX Design Masterclass', type: 'announcement', title: 'New design resources uploaded', body: 'Check the resources tab for new Figma files.', from: 'Ravi Singh', createdAt: '2026-08-25' },
];

export const transactions = [
  { id: 't1', studentId: 'u1', studentName: 'Ava Chen', courseId: 'course-1', amount: 89.99, date: '2026-07-01', status: 'paid' },
  { id: 't2', studentId: 'u1', studentName: 'Ava Chen', courseId: 'course-2', amount: 74.99, date: '2026-07-15', status: 'paid' },
  { id: 't3', studentId: 'u2', studentName: 'Liam Patel', courseId: 'course-6', amount: 64.99, date: '2026-07-20', status: 'paid' },
  { id: 't4', studentId: 'u3', studentName: 'Sofia Ortiz', courseId: 'course-3', amount: 99.99, date: '2026-06-01', status: 'paid' },
  { id: 't5', studentId: 'u2', studentName: 'Liam Patel', courseId: 'course-1', amount: 89.99, date: '2026-05-10', status: 'refunded' },
  { id: 't6', studentId: 'u4', studentName: 'Noah Kim', courseId: 'course-1', amount: 89.99, date: '2026-08-15', status: 'paid' },
];

export const payouts = [
  { id: 'p1', instructorId: 'i1', amount: 1540.75, date: '2026-08-01', status: 'paid' },
  { id: 'p2', instructorId: 'i2', amount: 820.40, date: '2026-07-01', status: 'paid' },
  { id: 'p3', instructorId: 'i1', amount: 3200.00, date: '2026-08-25', status: 'pending' },
  { id: 'p4', instructorId: 'i3', amount: 610.20, date: '2026-08-30', status: 'pending' },
];

export const flaggedContent = [
  { id: 'f1', type: 'review', target: 'Review on Complete React Bootcamp', reason: 'Inappropriate language', reportedBy: 'Sofia Ortiz', createdAt: '2026-09-01', status: 'open' },
  { id: 'f2', type: 'qa', target: 'Question in UI/UX Design Masterclass', reason: 'Spam', reportedBy: 'Ravi Singh', createdAt: '2026-08-28', status: 'open' },
  { id: 'f3', type: 'course', target: 'Machine Learning Bootcamp', reason: 'Copyright concern on thumbnail', reportedBy: 'System', createdAt: '2026-09-03', status: 'resolved' },
];

export const certificateData = {
  'course-1': { courseTitle: 'Complete React Developer Bootcamp', completionDate: '2026-08-01', studentName: 'Liam Patel' },
};
