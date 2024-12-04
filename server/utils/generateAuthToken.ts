import jwt from "jsonwebtoken";

const generateAuthToken = (userId: string): string => {
  const payload = {
    userId,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "keto", {
    expiresIn: "2d",
  });

  return token;
};

export default generateAuthToken;
