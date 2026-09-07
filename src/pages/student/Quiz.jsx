import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizForm from '../../components/QuizForm';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import './quiz.css';

export default function Quiz() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.getQuiz(lessonId).then((q) => { setQuiz(q); setLoading(false); });
  }, [lessonId]);

  if (loading) {
    return (
      <div className="page page--narrow">
        <Skeleton className="h-10 w-1/2 mt-8" />
        <Skeleton className="h-64 mt-6" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="page page--narrow">
        <h1 className="page-title mt-6">Quiz not found</h1>
        <p className="text-slate-500">This quiz doesn't exist.</p>
        <Button onClick={() => navigate(`/learn/${courseId}`)}>Back to course</Button>
      </div>
    );
  }

  const submitted = (score) => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setResult(score);
    }, 800);
  };

  if (result !== null) {
    const passed = result >= quiz.passingScore;
    return (
      <div className="page page--narrow">
        <div className="quiz-result">
          <div className={`quiz-result__badge ${passed ? 'quiz-result__badge--pass' : 'quiz-result__badge--fail'}`}>
            <Icon name={passed ? 'checkCircle' : 'x'} size={44} />
          </div>
          <Badge tone={passed ? 'green' : 'red'}>{passed ? 'Passed' : 'Not passed'}</Badge>
          <h1 className="text-2xl font-extrabold mt-3">{result}%</h1>
          <p className="text-slate-500 text-sm">
            {passed
              ? 'Great job! You passed the quiz. You can mark this lesson complete.'
              : `You need ${quiz.passingScore}% to pass. Review the material and try again.`}
          </p>
          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            {passed ? (
              <>
                <Button onClick={() => navigate(`/learn/${courseId}`)}>Back to course</Button>
                <Button variant="secondary" onClick={() => setResult(null)}>Retake quiz</Button>
              </>
            ) : (
              <Button onClick={() => setResult(null)}>Retake quiz</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--narrow">
      <div className="flex items-center justify-between mt-6 mb-4">
        <div>
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Quiz</p>
          <h1 className="text-xl font-extrabold">{quiz.title}</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate(`/learn/${courseId}`)}>
          <Icon name="arrowLeft" size={14} /> Exit quiz
        </Button>
      </div>
      <QuizForm quiz={quiz} onSubmit={submitted} submitting={submitting} />
    </div>
  );
}