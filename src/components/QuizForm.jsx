import { useState } from 'react';
import Button from './ui/Button';
import './quizform.css';

export default function QuizForm({ quiz, onSubmit, submitting }) {
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="quiz-confirm">
        <h3 className="text-lg font-bold">{quiz.title}</h3>
        <p className="text-sm text-slate-500">Passing score: {quiz.passingScore}% · {quiz.questions.length} questions</p>
        <p className="text-sm text-slate-600 mt-2">You'll see your score immediately after submitting.</p>
        <div className="mt-4">
          <Button onClick={() => setStarted(true)}>Start Quiz</Button>
        </div>
      </div>
    );
  }

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);
  const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correctOptionIndex).length;
  const score = Math.round((correctCount / quiz.questions.length) * 100);

  return (
    <form
      className="quizform"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(score);
      }}
    >
      {quiz.questions.map((q, qi) => (
        <fieldset key={q.id} className="quizform__q">
          <legend className="quizform__qtitle">
            <span className="quizform__qnum">{qi + 1}</span> {q.text}
          </legend>
          <div className="quizform__options">
            {q.options.map((opt, oi) => (
              <label key={oi} className={`quizform__opt ${answers[q.id] === oi ? 'quizform__opt--selected' : ''}`}>
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === oi}
                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <div className="quizform__submit">
        <Button type="submit" disabled={!allAnswered} loading={submitting}>
          Submit Quiz
        </Button>
        {!allAnswered && <span className="text-xs text-slate-500">Answer all questions to submit.</span>}
      </div>
    </form>
  );
}