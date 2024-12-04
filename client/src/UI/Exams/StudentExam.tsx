import React, { useState } from 'react';

const StudentExam: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [attemptedExams, setAttemptedExams] = useState<number[]>([]);

  // Sample contests/exams data
  const contests = [
    { id: 1, title: "Math Contest" },
    { id: 2, title: "Science Olympiad" },
    { id: 3, title: "Coding Challenge" },
    { id: 4, title: "Art Competition" },
  ];

  const toggleAttemptExam = (id: number) => {
    setAttemptedExams((prev) =>
      prev.includes(id) ? prev.filter(examId => examId !== id) : [...prev, id]
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contests & Examinations</h1>
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded bg-gray-300 hover:bg-gray-400 transition duration-300"
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>

      <main className="flex flex-col space-y-4">
        {contests.map((contest) => (
          <div 
            key={contest.id} 
            className={`p-4 border rounded-lg transition ${attemptedExams.includes(contest.id) ? 'bg-blue-100' : 'bg-white'} shadow`}
          >
            <p className="font-semibold">{contest.title}</p>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => toggleAttemptExam(contest.id)}
                className={`px-4 py-2 rounded transition duration-300 ${attemptedExams.includes(contest.id) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                {attemptedExams.includes(contest.id) ? 'Unattempt' : 'Attempt'}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default StudentExam;
