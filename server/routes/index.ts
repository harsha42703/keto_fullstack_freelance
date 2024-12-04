// src/routes/authRoutes.ts
import { Router, type Response, type Request } from "express";
import {
  approveRegistrationRequest,
  getUserProfile,
  getUserRegisteredExams,
  login,
  register,
  registerForApproval,
  registrationRequests,
  rejectRegistrationRequests,
} from "../controllers/userControllers";
import { authenticateUser } from "../middlewares/authMiddleware";
import {
  approveExam,
  createExam,
  getAllExams,
  getAllQuestions,
  getApprovedQuestions,
  getExamById,
  getUnapprovedQuestions,
  registerForExam,
} from "../controllers/examControllers";

const router = Router();

router.post("/login", login);
router.get("/me", authenticateUser, getUserProfile);
router.post("/register", register);
router.get("/user/exams/all", authenticateUser, getUserRegisteredExams);

//Route to get the exams

router.get("/exams/all", getAllExams);
// Route to create a new exam (for teachers)
router.post("/exam/create", authenticateUser, createExam);
router.get("/exam/:id", getExamById);
router.get("/exams/approved", getApprovedQuestions);
router.get("/exams/unapproved", getUnapprovedQuestions);
router.get("/questions/all", getAllQuestions);
// Route to approve an exam (for admins)
router.patch("/exams/:id/approve", approveExam);
router.get("/", async (req: Request, res: Response) => {
  res.send("Hello World");
});
//routes for approving registration requests
router.get("/registration-requests", registrationRequests);
router.post("/register-for-approval", registerForApproval);
router.post("/registration-requests/:id/approve", approveRegistrationRequest);
router.put("/registration-requests/:id/reject", rejectRegistrationRequests);

//routes for registering the exam
router.post("/user/register-for-exam", registerForExam);
export default router;
