const QUESTIONS_API_BASE_URL = './data/questions.json';
const SUBMISSIONS_API_BASE_URL = './data/submissions.json';

fetchAndAppendQuestions();

async function  fetchAndAppendQuestions() {
    const [questionsResp, submissionsResp] = await fetchQuestionsAndSubmissions();
    console.log({questionsResp, submissionsResp});
    const questionsByCategory = getQuestionsByCategory(questionsResp);
    const submissionsById = getSubmissionsById(submissionsResp);

    const wrapper = document.getElementById('wrapper');

    for (const [category, questions] of Object.entries(questionsByCategory)) {
        const categoryDiv = createCategory(category, questions, submissionsById);
        wrapper.append(categoryDiv);
    }
}

function createCategory(category, questions, submissions) {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');

    let correctCount = 0;

    questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const statusDiv = document.createElement('div');
        statusDiv.classList.add('status');
        const status = submissions[question.uid] ?? 'unattempted';
        const statusClass = status.toLowerCase().replace('_', '-');
        questionDiv.title = statusClass.charAt(0).toUpperCase() + statusClass.substring(1);
        statusDiv.classList.add(statusClass);

        if(submissions[question.uid] === "CORRECT") {
            correctCount++;
        }

        const questionNameH3 = document.createElement('h3');
        questionNameH3.classList.add('question-name')
        questionNameH3.textContent = question.name;


        const questionSpan = document.createElement('span');
        questionSpan.classList.add('question-drag');

        questionDiv.append(statusDiv);
        questionDiv.append(questionNameH3);
        questionDiv.append(questionSpan);
        categoryDiv.append(questionDiv);
    })
    
    const categoryH2 = document.createElement('h2');
    categoryH2.classList.add('category-title')
    categoryH2.textContent = `${category} - ${correctCount} / ${questions.length}`;

    categoryDiv.prepend(categoryH2);

    return categoryDiv;
}

async function fetchQuestionsAndSubmissions() {
    const [questionsResp, submissionsResp] = await Promise.all([
        fetch(QUESTIONS_API_BASE_URL),
        fetch(SUBMISSIONS_API_BASE_URL)
    ])

    return await Promise.all([
        questionsResp.json(), 
        submissionsResp.json(),
    ]);
}

function getQuestionsByCategory(questions) {
    const questionsByCategory = {};

    questions.forEach(question => {
        if(questionsByCategory.hasOwnProperty(question.category)) {
            questionsByCategory[question.category].push(question);
        } else {
            questionsByCategory[question.category] = [question];
        }
    })

    return questionsByCategory;
}

function getSubmissionsById(submissions) {
    const submissionsById = {};

    submissions.forEach(submission => {
        submissionsById[submission.questionId] = submission.status;
    });

    return submissionsById;
}