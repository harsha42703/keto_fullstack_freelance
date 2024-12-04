// src/controllers/authController.ts
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient";

export interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
}

export const login = async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, reqRole } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
    console.log(user, "this is user");

    if (!user) {
      res.json({ message: "User not found" });
      return;
    }
    if (reqRole && !user.roles.map((role) => role.role).includes(reqRole)) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: reqRole,
      },
      process.env.JWT_SECRET || "keto",
      {
        expiresIn: "2d",
      }
    );

    console.log(token, "this is token");

    res.cookie("ketoToken", token, {
      httpOnly: true,
    });
    res.json({ user: { name: user.name, email: user.email, role: reqRole } });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password, roles } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: req.body.name, // Add the name property
        email,
        password: hashedPassword,
        roles: {
          create: roles.map((role: string) => ({
            role,
          })),
        },
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { id: req.user?.userId },
  });

  res.json({ user, role: req.user.role });
};

export const registrationRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.approvalRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching registration requests:", error);
    res.status(500).json({ message: "Failed to fetch registration requests" });
  }
};

export const registerForApproval = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingRequest = await prisma.approvalRequest.findUnique({
      where: { email },
    });

    if (existingRequest) {
      res.status(400).json({ message: "Request already exists." });
      return;
    }

    const newRequest = await prisma.approvalRequest.create({
      data: {
        name,
        email,
        password, // Ensure to hash the password
        role,
        status: false,
      },
    });

    res
      .status(201)
      .json({ message: "Request submitted successfully.", newRequest });
  } catch (error) {
    console.error("Error registering request:", error);
    res.status(500).json({ message: "Failed to submit registration request." });
  }
};

export const approveRegistrationRequest = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const request = await prisma.approvalRequest.update({
      where: { id: parseInt(id) },
      data: { status: true },
    });

    await prisma.user.create({
      data: {
        name: request.name,
        email: request.email,
        password: request.password,
        roles: {
          create: {
            role: request.role,
          },
        },
      },
    });

    res
      .status(200)
      .json({ message: "Request approved and user created.", request });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Failed to approve request." });
  }
};

export const rejectRegistrationRequests = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    await prisma.approvalRequest.update({
      where: { id: parseInt(id) },
      data: { status: false },
    });

    res.status(200).json({ message: "Request rejected." });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Failed to reject request." });
  }
};

export const getUserRegisteredExams = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { page = 1, limit = 10, search = "" } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const offset = (pageNumber - 1) * limitNumber;
  const user = await prisma.user.findUnique({
    where: { id: req.user?.userId },
    include: {
      registeredExams: {
        where: {
          OR: [
            {
              exam_name: {
                contains: search as string,
              },
            },
          ],
        },
        skip: offset,
        take: limitNumber,
      },
    },
  });

  res.json({ user, role: req.user.role });
};
