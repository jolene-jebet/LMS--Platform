const STORAGE_KEY = 'learnhub_progress';

let courses = loadCoursesFromStorage();
let currentCourseId = null;

function loadCoursesFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return JSON.parse(JSON.stringify(coursesData));
        }
    }
    return JSON.parse(JSON.stringify(coursesData));
}

function saveCoursesToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

function calculateProgress(course) {
    const completedCount = course.lessons.filter(l => l.completed).length;
    return Math.round((completedCount / course.lessons.length) * 100);
}

function showHomePage() {
    document.getElementById('homepage').classList.remove('hidden');
    document.getElementById('coursePage').classList.add('hidden');
    currentCourseId = null;
    renderCourseGrid();
}

function showCoursePage(courseId) {
    currentCourseId = courseId;
    document.getElementById('homepage').classList.add('hidden');
    document.getElementById('coursePage').classList.remove('hidden');
    renderCoursePage();
}

function renderCourseGrid() {
    const grid = document.getElementById('courseGrid');
    grid.innerHTML = '';

    courses.forEach(course => {
        const card = createCourseCard(course);
        grid.appendChild(card);
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.onclick = () => showCoursePage(course.id);

    card.innerHTML = `
        <div class="course-card-progress-bar">
            <div class="course-card-progress-fill" style="width: ${course.progress}%"></div>
        </div>
        <div class="course-card-content">
            <h3 class="course-card-title">${course.title}</h3>
            <p class="course-card-description">${course.description}</p>
            <div class="course-card-meta">
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>${course.instructor}</span>
                </div>
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${course.duration}</span>
                </div>
                <div class="meta-item">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <span>${course.lessonsCount} lessons</span>
                </div>
            </div>
            <div class="course-card-status">
                ${course.progress > 0
                    ? `<span class="status-progress">${course.progress}%</span> completed`
                    : 'Not started'
                }
            </div>
        </div>
    `;

    return card;
}

function renderCoursePage() {
    const course = courses.find(c => c.id === currentCourseId);
    if (!course) return;

    const courseHeader = document.getElementById('courseHeader');
    courseHeader.innerHTML = `
        <h1>${course.title}</h1>
        <p class="course-description">${course.description}</p>
        <div class="course-meta">
            <div class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>${course.instructor}</span>
            </div>
            <div class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${course.duration}</span>
            </div>
            <div class="meta-item">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>${course.lessonsCount} lessons</span>
            </div>
        </div>
    `;

    renderProgressCard(course);
    renderLessonsList(course);
}

function renderProgressCard(course) {
    const progressCard = document.getElementById('progressCard');
    const completedLessons = course.lessons.filter(l => l.completed).length;
    const allCompleted = completedLessons === course.lessons.length;

    progressCard.innerHTML = `
        <div class="progress-header">
            <div class="progress-info">
                <h2>Your Progress</h2>
                <p class="progress-text">${completedLessons} of ${course.lessons.length} lessons completed</p>
            </div>
            <div class="progress-percentage">${course.progress}%</div>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
        </div>
        ${allCompleted ? `
            <button class="complete-button" onclick="markCourseComplete()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 15l-3-3m0 0l-3 3m3-3v12m6-9h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
                Mark Course as Complete
            </button>
        ` : ''}
    `;
}

function renderLessonsList(course) {
    const lessonsList = document.getElementById('lessonsList');
    lessonsList.innerHTML = '';

    course.lessons.forEach(lesson => {
        const lessonItem = createLessonItem(lesson);
        lessonsList.appendChild(lessonItem);
    });
}

function createLessonItem(lesson) {
    const item = document.createElement('div');
    item.className = 'lesson-item';

    item.innerHTML = `
        <div class="lesson-content">
            <div class="lesson-checkbox ${lesson.completed ? 'checked' : 'unchecked'}"
                 onclick="toggleLesson(${lesson.id})">
                ${lesson.completed
                    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                         <polyline points="22 4 12 14.01 9 11.01"></polyline>
                       </svg>`
                    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <circle cx="12" cy="12" r="10"></circle>
                       </svg>`
                }
            </div>
            <div class="lesson-details">
                <h3 class="lesson-title ${lesson.completed ? 'completed' : ''}">${lesson.title}</h3>
                <p class="lesson-description">${lesson.content}</p>
                <div class="lesson-duration">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${lesson.duration}</span>
                </div>
            </div>
        </div>
    `;

    return item;
}

function toggleLesson(lessonId) {
    const course = courses.find(c => c.id === currentCourseId);
    if (!course) return;

    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    lesson.completed = !lesson.completed;
    course.progress = calculateProgress(course);

    saveCoursesToStorage();
    renderCoursePage();
}

function markCourseComplete() {
    const course = courses.find(c => c.id === currentCourseId);
    if (!course) return;

    const allCompleted = course.lessons.every(l => l.completed);
    if (!allCompleted) return;

    alert(`Congratulations! You've completed "${course.title}"!`);
}

document.getElementById('backButton').addEventListener('click', showHomePage);

showHomePage();
