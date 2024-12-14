import React, { useEffect, useState } from "react";
import axios from "axios";
import ExamFeedback from "./ExamFeedback";

type Question = {
  question: string;
  options: string[];
  answer: string;
  image: string | null;
};

type Exam = {
  examId: string;
  examCode: string;
  examName: string;
  timeBased: boolean;
  viewBack: boolean;
  duration: number;
  createdDate: string;
  createdBy: string;
  lastUpdated: string;
  questions: Question[];
};

const  ExamApprove: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const handleApprove = async (examCode: string) => {
    console.log(`Approved exam with code: ${examCode}`);

    const response = await axios.patch(
      `http://localhost:3000/api/exams/${examCode}/approve`
    );
    if (response.status === 200) {
      setExams((prevExams) =>
        prevExams.filter((exam) => exam.examId !== examCode)
      );
      alert("Exam approved successfully");
    } else {
      alert("Error approving exam");
    }
  };

  const handleDisapprove = (examCode: string) => {
    console.log(`Disapproved exam with code: ${examCode}`);
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data }: { data: any[] } = await axios.get(
          "http://localhost:3000/api/exams/unapproved"
        );
        console.log(data, "this is data");

        const formattedExams = data.map((exam: any) => ({
          examId: exam.id,
          examCode: exam.exam_code,
          examName: exam.exam_name,
          timeBased: exam.timebased,
          viewBack: exam.viewback,
          duration: exam.duration,
          createdDate: exam.created_date,
          createdBy: exam.createdBy,
          lastUpdated: exam.last_updated_date,
          questions: exam.questions.map((q: any) => ({
            question: q.question,
            options: q.keys.map((key: any) => key.key),
            answer: q.keys.find((key: any) => key.correctkey)?.key || "",
            image: null, // Assuming no image is provided
          })),
        }));

        setExams(formattedExams);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  const handlePreview = (exam: Exam) => {
    setSelectedExam(exam);
  };

  return (
    <div className="p-4 bg-gray-100 h-[90vh] rounded-lg">
      <div className="h-[100%] w-[100%] mb-2 flex-col flex items-justify-center">
        {exams.map((exam) => (
          <div
            key={exam.examCode}
            className="bg-white w-[70vw] shadow-md mb-3 rounded-lg p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl text-cyan-800 font-bold mb-2 capitalize">
                {exam.examName}
              </h3>
              <p className="text-gray-700 capitalize">
                <strong>Exam Code:</strong> {exam.examCode}
              </p>
              <p className="text-gray-700 capitalize">
                <strong>Duration:</strong> {exam.duration} mins
              </p>
              <p className="text-gray-700 capitalize">
                <strong>Time Based:</strong> {exam.timeBased ? "Yes" : "No"}
              </p>
              <p className="text-gray-700 capitalize">
                <strong>View Back:</strong>{" "}
                {exam.viewBack ? "Enabled" : "Disabled"}
              </p>
              <p className="text-gray-700 capitalize">
                <strong>Created By:</strong> {exam.createdBy}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleApprove(exam.examId)}
                className="flex-1 bg-green-200 border border-green-700 text-green-800 px-3 font-semibold py-2 rounded  hover:text-white hover:bg-green-600 transition"
              >
                Approve
              </button>
              <button
                onClick={handleOpenModal}
                className="flex-1 bg-red-200 border border-red-700 text-red-800 px-3 font-semibold py-2 rounded  hover:text-white hover:bg-red-600 transition"
              >
                Disapprove
              </button>
              <button
                onClick={() => handlePreview(exam)}
                className="flex-1 bg-blue-200 border border-blue-700 text-blue-800 font-semibold px-3 py-2 rounded hover:text-white hover:bg-blue-600 transition"
              >
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg md:max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh] relative">
            <button
              onClick={() => setSelectedExam(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Exam Preview: {selectedExam.examName}
            </h3>
            <p>
              <strong>Exam Code:</strong> {selectedExam.examCode}
            </p>
            <p>
              <strong>Duration:</strong> {selectedExam.duration} mins
            </p>
            <p>
              <strong>Created By:</strong> {selectedExam.createdBy}
            </p>

            <div className="mt-4 space-y-4">
              {selectedExam.questions.map((question, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg">
                  <p>
                    <strong>Q{index + 1}:</strong> {question.question}
                  </p>
                  {question.image && (
                    <img
                      src={question.image}
                      alt="question"
                      className="mt-2 w-full max-w-xs h-auto"
                    />
                  )}
                  <div className="mt-2 space-y-1">
                    {question.options.map((option, i) => (
                      <p
                        key={i}
                        className={
                          question.answer === option
                            ? "font-bold text-green-700"
                            : ""
                        }
                      >
                        {String.fromCharCode(65 + i)}. {option}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <ExamFeedback
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmitFeedback={handleDisapprove}
      />
    </div>
  );
};

export default ExamApprove;
