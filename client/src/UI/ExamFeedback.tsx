import React, { useState } from "react";

interface ExamFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: string) => void;
}

const ExamFeedback: React.FC<ExamFeedbackProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmitFeedback(feedback); // Pass feedback to parent function
    setFeedback(""); // Clear feedback input
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null; // Do not render if modal is closed

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-11/12 sm:w-1/3 p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamFeedback;
