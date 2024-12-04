import { PrismaClient, type blf_catalogue_questions } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import type { AuthenticatedRequest } from "./userControllers";
import { generateUniqueId } from "../utils/generateUniqueQueCode";

export const createExam = async (req: AuthenticatedRequest, res: Response) => {
  const {
    examCode,
    examName,
    timeBased,
    viewBack,
    duration,
    createdBy,
    questions,
  } = req.body;
  console.log(req.body, "this is req body");
  try {
    if (!req.user) {
      res.status(401).json("unauthorised");
      return;
    }
    await prisma.$transaction(async (prisma) => {
      const exam = await prisma.exam_catalogue.create({
        data: {
          exam_code: examCode,
          exam_name: examName,
          timebased: timeBased,
          viewback: viewBack,
          duration,
          createdByUser: { connect: { id: req.user?.userId } },
        },
      });

      for (const q of questions) {
        const question = await prisma.blf_catalogue_questions.create({
          data: {
            question_code: generateUniqueId(),
            question: q.question,
            timeinsec: q.timeInSec || 0,
            created_by: "lokesh@katari.com",
            exams: { connect: { id: exam.id } },
            last_updated_by: "lokesh@katari.com",
          },
        });
        console.log(question, "this is question");

        await prisma.blf_catalogue_key.createMany({
          data: q.options.map((opt: any, index: number) => ({
            key: opt,
            correctkey: index === q.answerIndex,
            question_id: question.id,
            created_by: "lokesh@katari.com",
          })),
        });
      }
    });

    res.status(201).json({ message: "Exam created and awaiting approval" });
  } catch (error) {
    res.status(500).json({ error: "Error creating exam", errori: error });
  }
};

export const approveExam = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id, "this is id f");

  try {
    const approvedExam = await prisma.exam_catalogue.update({
      where: { id },
      data: { isApproved: true },
    });
    res.status(200).json({ message: "Exam approved", approvedExam });
  } catch (error) {
    res.status(500).json({ error: "Error approving exam" });
  }
};

export const getExamById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const exam = await prisma.exam_catalogue.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            keys: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!exam) {
      res.status(404).json({ message: "Exam not found" });
      return;
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the exam" });
  }
};

export const getApprovedQuestions = async (req: Request, res: Response) => {
  try {
    const approvedQuestions = await prisma.exam_catalogue.findMany({
      where: {
        isApproved: true,
      },
      include: {
        questions: {
          include: {
            keys: true,
          },
        },
      },
    });

    res.status(200).json(approvedQuestions);
  } catch (error) {
    console.error("Error fetching approved questions:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching approved questions" });
  }
};

export const getUnapprovedQuestions = async (req: Request, res: Response) => {
  try {
    const unapprovedQuestions = await prisma.exam_catalogue.findMany({
      where: {
        isApproved: false,
      },
      include: {
        questions: {
          include: {
            keys: true,
          },
        },
      },
    });

    res.status(200).json(unapprovedQuestions);
  } catch (error) {
    console.error("Error fetching unapproved questions:", error);
    res.status(500).json({
      message: "An error occurred while fetching unapproved questions",
    });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  const { examId } = req.params;

  try {
    const exam = await prisma.exam_catalogue.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    await prisma.exam_catalogue.delete({
      where: { id: examId },
    });

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ message: "Failed to delete exam" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const { questionId } = req.params;

  try {
    const question = await prisma.blf_catalogue_questions.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await prisma.blf_catalogue_questions.delete({
      where: { id: questionId },
    });

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Failed to delete question" });
  }
};

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const offset = (pageNumber - 1) * limitNumber;
    const questions = await prisma.blf_catalogue_questions.findMany({
      where: {
        OR: [
          {
            question: {
              contains: search as string,
            },
          },
        ],
      },
      include: {
        keys: true,
      },
      skip: offset,
      take: limitNumber,
    });

    const totalQuestions = await prisma.blf_catalogue_questions.count({
      where: {
        OR: [
          {
            question: {
              contains: search as string,
            },
          },
        ],
      },
    });

    res.json({
      questions,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalQuestions / limitNumber),
      totalQuestions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching questions." });
  }
};

export const getAllExams = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const offset = (pageNumber - 1) * limitNumber;
    const exams = await prisma.exam_catalogue.findMany({
      where: {
        OR: [
          {
            exam_name: {
              contains: search as string,
            },
          },
        ],
      },
      include: {
        questions: true,
      },
      skip: offset,
      take: limitNumber,
    });

    const totalExams = await prisma.exam_catalogue.count({
      where: {
        OR: [
          {
            exam_name: {
              contains: search as string,
            },
          },
        ],
      },
    });

    res.json({
      exams,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalExams / limitNumber),
      totalExams,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching questions." });
  }
};

export const registerForExam = async (req: Request, res: Response) => {
  const { userId, examId } = req.body;
  console.log(userId, examId, "this si asfasf");

  try {
    if (!userId || !examId) {
      res.status(400).json({ message: "User ID and Exam ID are required." });
      return;
    }

    const exam = await prisma.exam_catalogue.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      res.status(404).json({ message: "Exam not found." });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { registeredExams: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const isAlreadyRegistered = user.registeredExams.some(
      (e) => e.id === examId
    );
    if (isAlreadyRegistered) {
      res
        .status(400)
        .json({ message: "User is already registered for this exam." });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        registeredExams: {
          connect: { id: examId },
        },
      },
    });
    res
      .status(200)
      .json({ message: "User successfully registered for the exam." });
  } catch (error) {
    console.error("Error registering for exam:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

export const getAllRegisteredExams = async (res: Response, req: Request) => {};
