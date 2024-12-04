import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { Timer } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

interface ExamKey {
  id: string;
  key: string;
  correctkey: boolean;
}

interface ExamQuestion {
  id: string;
  question_code: string;
  question: string;
  timeinsec: number;
  keys: ExamKey[];
}

interface ExamData {
  id: string;
  exam_name: string;
  duration: number;
  questions: ExamQuestion[];
}

const ExamAttempt: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [examCompleted, setExamCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [viewBack, setViewBack] = useState<boolean>(false);

  // Fetch Exam Data
  useEffect(() => {
    const getExamData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/exam/${id}`);
        if (!response.ok) throw new Error("Failed to fetch exam data");
        const data: ExamData & { viewBack: boolean } = await response.json();
        setExamData(data);
        setViewBack(data.viewBack || false); // Enable/Disable "Previous" button
        setTimeRemaining(data.duration * 60);
        document.documentElement.requestFullscreen(); // Force full-screen
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };
    getExamData();

    // Exit full-screen auto-submit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleSubmitExam();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [id]);

  // Timer Logic
  useEffect(() => {
    if (timeRemaining > 0 && !examCompleted) {
      const timer = setTimeout(() => setTimeRemaining((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitExam();
    }
  }, [timeRemaining, examCompleted]);

  // Handle Answer Selection
  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [examData?.questions[currentQuestionIndex].id as string]: answerId,
    }));
  };

  // Navigation Handlers
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (examData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (viewBack && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Submit Exam
  const handleSubmitExam = async () => {
    if (!examData) return;

    let calculatedScore = 0;
    examData.questions.forEach((question) => {
      const selectedAnswerId = selectedAnswers[question.id];
      const correctAnswer = question.keys.find((key) => key.correctkey);
      if (selectedAnswerId === correctAnswer?.id) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setExamCompleted(true);

    try {
      await fetch("http://localhost:3000/api/save-exam-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: examData.id,
          score: calculatedScore,
          totalQuestions: examData.questions.length,
          selectedAnswers,
        }),
      });
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
    alert("Exam submitted successfully!");
    navigate("/exam-summary");
  };

  // Render Loading State
  if (!examData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Render Mobile Restriction
  if (window.innerWidth < 1024) {
    return (
      <Alert>
        <span>This exam is only accessible on desktop. Please switch to a desktop device.</span>
      </Alert>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const questionProgress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-lg font-bold capitalize">{examData.exam_name}</h1>
        <div className="flex items-center font-bold gap-2">
          <Timer size={20} />
          <span>{`${Math.floor(timeRemaining / 60)}:${
            timeRemaining % 60 < 10 ? "0" : ""
          }${timeRemaining % 60}`}</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="p-4">
        <Progress value={currentQuestion} />
        <p className="text-sm text-gray-500 text-center mt-2">
          Question {currentQuestionIndex + 1} of {examData.questions.length}
        </p>
      </div>

      {/* Main Content */}
      <main className="flex flex-grow">
        {/* Question */}
        <div className="w-1/2 p-4 border-r border-gray-300 mb-8">
          <h2 className="font-bold text-cyan-700 text-2xl ml-6 mb-2">Question {`${currentQuestionIndex + 1}`}</h2>
          <Card className="h-full border-none shadow-none">
            <CardHeader>
              <CardTitle>
              {`${currentQuestion.question}`}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Options */}
        <div className="w-1/2 p-4">
          <Card className="h-full border-none shadow-none p-4">
            <h2 className="font-bold text-cyan-700 text-2xl ml-6 mb-8">Choose One :</h2>
            <CardContent>
              {currentQuestion.keys.map((answer) => (
                <Button
                  key={answer.id}
                  className={`w-full mb-2 ${
                    selectedAnswers[currentQuestion.id] === answer.id
                      ? "bg-cyan-800 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleAnswerSelect(answer.id)}
                >
                  {answer.key}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-between p-4 bg-white shadow">
        <Button
          className="bg-gray-300"
          onClick={handlePreviousQuestion}
          disabled={!viewBack || currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          className="bg-gray-300 border-cyan-800 border shadow"
          onClick={
            currentQuestionIndex < examData.questions.length - 1
              ? handleNextQuestion
              : handleSubmitExam
          }
          disabled={!selectedAnswers[currentQuestion.id]}
        >
          {currentQuestionIndex < examData.questions.length - 1 ? "Next" : "Submit"}
        </Button>
      </footer>
    </div>
  );
};

export default ExamAttempt;
