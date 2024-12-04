import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import axios from "axios";
import { QuestionPreview } from "./QuestionPreview";
const generateExamCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const ExamCreation = () => {
  const [examCode] = useState(generateExamCode());
  const [examName, setExamName] = useState("");
  const [timeBased, setTimeBased] = useState(false);
  const [viewBack, setViewBack] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [createdDate] = useState(new Date().toLocaleDateString());
  const [createdBy, setCreatedBy] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [lastUpdatedBy, setLastUpdatedBy] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionImage, setNewQuestionImage] = useState<string | null>(null);
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string | "">("");
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | -1>(-1);
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("keto");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setExamName(parsedData.examName || "");
      setTimeBased(parsedData.timeBased || false);
      setViewBack(parsedData.viewBack || false);
      setDuration(parsedData.duration || null);
      setCreatedBy(parsedData.createdBy || "");
      setLastUpdated(parsedData.lastUpdated || "");
      setLastUpdatedBy(parsedData.lastUpdatedBy || "");
      setQuestions(parsedData.questions || []);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const dataToSave = {
        examCode,
        examName,
        timeBased,
        viewBack,
        duration,
        createdBy,
        lastUpdated,
        lastUpdatedBy,
        questions,
      };
      localStorage.setItem("keto", JSON.stringify(dataToSave));
    }, 30000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [
    examCode,
    examName,
    timeBased,
    viewBack,
    duration,
    createdBy,
    lastUpdated,
    lastUpdatedBy,
    questions,
  ]);

  // Submit data to the backend API
  const handleSubmit = async () => {
    const payload = {
      examCode,
      examName,
      timeBased,
      viewBack,
      duration,
      createdDate,
      createdBy,
      lastUpdated,
      lastUpdatedBy,
      questions: questions.map((q) => ({
        question: q.text,
        options: q.options,
        answer: q.answer,
        image: q.image,
        answerIndex: q.answerIndex,
      })),
    };

    try {
      console.log(payload, "asdfasdfas");

      await axios.post("http://localhost:3000/api/exam/create", payload, {
        withCredentials: true,
      });
      alert("Exam submitted successfully");
      localStorage.removeItem("keto");
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Error submitting exam. Please try again.");
    }
  };

  const addOption = () => {
    if (newOptions.length < 6) {
      setNewOptions([...newOptions, ""]);
    }
  };

  const addOrUpdateQuestion = () => {
    if (
      !newQuestionText ||
      !correctAnswer ||
      newOptions.some((opt) => opt === "")
    ) {
      alert("Please fill in all fields for the question and options.");
      return;
    }

    const question = {
      id: editingId || uuidv4(),
      text: newQuestionText,
      image: newQuestionImage,
      options: [...newOptions],
      answer: correctAnswer,
      answerIndex: correctAnswerIndex,
    };
    console.log(question, "question");
    // return;

    setQuestions((prev) =>
      editingId
        ? prev.map((q) => (q.id === editingId ? question : q))
        : [question, ...prev]
    );
    resetNewQuestionFields();
  };

  const resetNewQuestionFields = () => {
    setNewQuestionText("");
    setNewQuestionImage(null);
    setNewOptions(["", ""]);
    setCorrectAnswer("");
    setEditingId(null);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const editQuestion = (id: string) => {
    const question = questions.find((q) => q.id === id);
    if (question) {
      setNewQuestionText(question.text);
      setNewQuestionImage(question.image);
      setNewOptions([...question.options]);
      setCorrectAnswer(question.answer);
      setEditingId(id);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedQuestions = Array.from(questions);
    const [movedItem] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedItem);
    setQuestions(reorderedQuestions);
  };

  const deleteOption = (index: number) => {
    const updatedOptions = newOptions.filter((_, i) => i !== index);
    setNewOptions(updatedOptions);
  };

  return (
    <div className="p-8 bg-white rounded-lg w-[100%] sm:w-[72vw] md:w-[72vw] lg:w-[72vw] shadow-md py-6 mt-24 sm:mt-0 md:mt-0 lg:mt-0 mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-700">
        Exam Creation
      </h2>

      {/* Exam Header */}
      <div className="grid gap-6 mb-6 bg-slate-100 p-6 border-slate-200 border rounded-lg lg:grid-cols-2">
        <div>
          <label className="block text-gray-600 font-medium">Exam Code</label>
          <input
            type="text"
            value={examCode}
            readOnly
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">Exam Name</label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
        <div className="flex items-center">
          <label>Time-Based</label>
          <input
            type="checkbox"
            checked={timeBased}
            onChange={() => setTimeBased(!timeBased)}
            className="ml-2"
          />
          {timeBased && (
            <input
              type="number"
              placeholder="Duration (mins)"
              value={duration || ""}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="border rounded-lg px-3 py-2 w-full ml-4"
            />
          )}
        </div>
        <div className="flex items-center">
          <label>Allow View Back</label>
          <input
            type="checkbox"
            checked={viewBack}
            onChange={() => setViewBack(!viewBack)}
            className="ml-2"
          />
        </div>
        <div>
          <label>Created Date:</label>
          <input
            type="text"
            value={createdDate}
            readOnly
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
        <div>
          <label>Created By:</label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
        <div>
          <label>Last Updated:</label>
          <input
            type="text"
            value={lastUpdated}
            readOnly
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
        <div>
          <label>Last Updated By:</label>
          <input
            type="text"
            value={lastUpdatedBy}
            onChange={(e) => setLastUpdatedBy(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
      </div>
      <div>
        <QuestionPreview
          onAddQuestions={addOrUpdateQuestion}
          setCorrectAnswer={setCorrectAnswer}
          setNewOptions={setNewOptions}
          setNewQuestion={setNewQuestionText}
        />
        {/* {filteredQuestions.length > 0 && (
          <div className="border p-2 rounded-md bg-gray-100 max-h-48 overflow-y-auto">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                onClick={() => handleQuestionSelect(q)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {q.question}
              </div>
            ))} */}
        {/* </div>
        )} */}
      </div>

      {/* Question Adding */}
      <div className="mb-6 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {editingId ? "Edit" : "Add"} Question
        </h3>
        <input
          type="text"
          placeholder="Question text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full mb-4"
        />
        {/* <input type="file" onChange={handleImageUpload} className="mb-4" /> */}

        {/* options */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {newOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...newOptions];
                  updatedOptions[index] = e.target.value;
                  setNewOptions(updatedOptions);
                }}
                className="border rounded-lg px-3 py-2 w-full"
              />
              {newOptions.length > 2 && (
                <button
                  onClick={() => deleteOption(index)}
                  className="text-red-500 hover:text-red-700 p-2 border border-red-700 bg-red-50 rounded-lg"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
        {newOptions.length < 6 && (
          <button
            onClick={addOption}
            className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md mb-4"
          >
            Add Option
          </button>
        )}

        <select
          value={correctAnswer}
          onChange={(e) => {
            const selectedAlphabet = e.target.value;
            const index = selectedAlphabet.charCodeAt(0) - 97;
            setCorrectAnswer(selectedAlphabet);
            setCorrectAnswerIndex(index);
          }}
          className="border rounded-lg px-3 py-2 w-full mt-4"
        >
          <option value="">Select Correct Answer</option>
          {newOptions.map((_, index) => (
            <option key={index} value={String.fromCharCode(97 + index)}>
              {String.fromCharCode(65 + index)}
            </option>
          ))}
        </select>

        <button
          onClick={addOrUpdateQuestion}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {editingId ? "Update" : "Add"} Question
        </button>
      </div>

      <button
        onClick={() => setIsDragEnabled(!isDragEnabled)}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        {isDragEnabled ? "Disable" : "Enable"} Drag to Reorder
      </button>

      {/* Question List */}
      {isDragEnabled ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {questions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 border rounded-lg capitalize flex justify-between items-center bg-white shadow-sm"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">{`Q${
                            index + 1
                          }. ${question.text}`}</p>
                          {question.image && (
                            <img
                              src={question.image}
                              alt="question"
                              className="w-20 h-20 mt-2"
                            />
                          )}
                          <div className="flex space-x-2 mt-2">
                            {question.options.map((opt, optIndex) => (
                              <span
                                key={optIndex}
                                className={`px-2 ${
                                  question.answer ===
                                  String.fromCharCode(97 + optIndex)
                                    ? "bg-green-200 rounded-lg px-2"
                                    : ""
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}: {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => editQuestion(question.id)}
                            className="text-blue-500 px-4 py-1 bg-blue-50 rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="text-red-500 px-4 py-1 bg-red-50 rounded-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="p-4 border-2 border-cyan-600 rounded-lg flex justify-between items-center bg-white shadow-sm"
            >
              <div>
                <p className="font-semibold capitalize text-gray-800">{`Q${
                  index + 1
                }. ${question.text}`}</p>
                {question.image && (
                  <img
                    src={question.image}
                    alt="question"
                    className="w-20 h-20 mt-2"
                  />
                )}
                <div className="flex space-x-2 mt-2">
                  {question.options.map((opt, optIndex) => (
                    <span
                      key={optIndex}
                      className={`px-3 py-1 capitalize ${
                        question.answer === String.fromCharCode(97 + optIndex)
                          ? "bg-green-200 rounded-lg text-green-900"
                          : ""
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}: {opt}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => editQuestion(question.id)}
                  className="text-blue-500 px-4 py-1 bg-blue-50 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="text-red-500 px-4 py-1 bg-red-50 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 mt-6 rounded-lg"
      >
        Send For Approval
      </button>
    </div>
  );
};

export default ExamCreation;
