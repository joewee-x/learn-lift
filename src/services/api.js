import { courses, users, enrollments, quizzes, assignments, reviews, notifications, messages, transactions, payouts, flaggedContent, categories, curriculum } from '../data/db';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export const api = {
  // Auth
  async login(email, _password) {
    await delay();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('No account found with that email');
    return { ...user, token: 'mock-token-' + user.id };
  },
  async signup({ name, email, role }) {
    await delay();
    const user = { id: 'u-new', name, email, role, avatar: '', bio: '', joinDate: new Date().toISOString().slice(0, 10), status: 'active' };
    return { ...user, token: 'mock-token-' + user.id };
  },

  // Courses
  async getCourses(filters = {}) {
    await delay();
    let list = [...courses];
    if (filters.status) list = list.filter((c) => c.status === filters.status);
    if (filters.category) list = list.filter((c) => c.category === filters.category);
    if (filters.level) list = list.filter((c) => c.level === filters.level);
    if (filters.price === 'free') list = list.filter((c) => c.price === 0);
    if (filters.price === 'paid') list = list.filter((c) => c.price > 0);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q));
    }
    if (filters.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (filters.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (filters.sort === 'newest') list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    if (filters.sort === 'popular') list.sort((a, b) => b.studentCount - a.studentCount);
    return list;
  },
  async getPublishedCourses() {
    const list = await this.getCourses();
    return list.filter((c) => c.status === 'published');
  },
  async getCourse(id) {
    await delay();
    return courses.find((c) => c.id === id) || null;
  },
  async getCourseByInstructor(instructorId) {
    await delay();
    return courses.filter((c) => c.instructorId === instructorId);
  },

  async getCurriculum(courseId) {
    await delay(100);
    return curriculum[courseId] || [];
  },

  // Instructors / users
  async getInstructors() {
    await delay(100);
    return users.filter((u) => u.role === 'instructor');
  },
  async getUser(id) {
    await delay(50);
    return users.find((u) => u.id === id) || null;
  },

  // Enrollments / progress
  async getEnrollments(studentId) {
    await delay(100);
    return enrollments.filter((e) => e.studentId === studentId);
  },
  async getEnrollment(studentId, courseId) {
    await delay(50);
    return enrollments.find((e) => e.studentId === studentId && e.courseId === courseId) || null;
  },
  async enroll(studentId, courseId, allCourseIds = []) {
    await delay(300);
    const existing = enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
    if (!existing) {
      allCourseIds.forEach((cid) => {
        if (!enrollments.find((e) => e.studentId === studentId && e.courseId === cid)) {
          enrollments.push({ id: 'e-new-' + cid, studentId, courseId: cid, progress: 0, enrolledAt: new Date().toISOString().slice(0, 10), completedLessonIds: [] });
        }
      });
    }
    return true;
  },
  async updateProgress(enrollmentId, completedLessonIds, totalLessons, progress) {
    await delay(50);
    const e = enrollments.find((x) => x.id === enrollmentId);
    if (e) { e.completedLessonIds = completedLessonIds; e.progress = progress; }
    return e;
  },

  // Quizzes
  async getQuiz(lessonId) {
    await delay(100);
    return quizzes[lessonId] || null;
  },

  // Assignments
  async getAssignments() {
    await delay(100);
    return assignments;
  },
  async submitAssignment(assignmentId, _content) {
    await delay(200);
    const a = assignments.find((x) => x.id === assignmentId);
    if (a) a.status = 'submitted';
    return { ok: true };
  },

  // Reviews
  async getReviews(courseId) {
    await delay(100);
    return reviews.filter((r) => r.courseId === courseId);
  },
  async getReviewsForInstructor(instructorId) {
    await delay(100);
    const instructorCourses = courses.filter((c) => c.instructorId === instructorId).map((c) => c.id);
    return reviews.filter((r) => instructorCourses.includes(r.courseId));
  },

  // Notifications
  async getNotifications(userId) {
    await delay(100);
    return notifications.filter((n) => n.userId === userId);
  },

  // Messages
  async getMessages() {
    await delay(100);
    return messages;
  },

  // Certificates
  async getCertificates(studentId) {
    await delay(100);
    const completed = enrollments.filter((e) => e.studentId === studentId && e.progress === 100);
    return completed.map((e) => {
      const course = courses.find((c) => c.id === e.courseId);
      return { courseId: e.courseId, courseTitle: course?.title, completionDate: e.completedAt };
    });
  },

  // Admin
  async getTransactions() {
    await delay(100);
    return transactions;
  },
  async getPayouts() {
    await delay(100);
    return payouts;
  },
  async getFlaggedContent() {
    await delay(100);
    return flaggedContent;
  },
  async getCategories() {
    await delay(100);
    return categories;
  },
  async getUsersIncludingStudents() {
    await delay(100);
    return users;
  },

  // Course lifecycle
  async createCourse(instructorId, data) {
    await delay(200);
    const id = 'course-' + Date.now();
    courses.push({ id, instructorId, ...data, status: 'draft', rating: 0, studentCount: 0, enrolledCount: 0 });
    return id;
  },
  async updateCourse(id, data) {
    await delay(150);
    const c = courses.find((x) => x.id === id);
    Object.assign(c, data);
    return c;
  },
  async setCourseStatus(id, status) {
    await delay(150);
    const c = courses.find((x) => x.id === id);
    if (c) c.status = status;
    return c;
  },
};
