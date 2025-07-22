const request = require("supertest");
const express = require("express");
const userRoutes = require("../../routes/userRoutes");
const userController = require("../../controllers/userController");
jest.mock("../../middleware/authMiddleware", () =>
  jest.fn((req, res, next) => next())
);
jest.mock("../../middleware/adminMiddleware", () =>
  jest.fn((req, res, next) => next())
);
jest.mock("../../controllers/userController");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/users/register", () => {
    it("should register a new user", async () => {
      userController.registerUser.mockImplementation((req, res) =>
        res.status(201).json({ message: "User registered successfully" })
      );
      const response = await request(app).post("/api/users/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
    });
  });

  describe("POST /api/users/login", () => {
    it("should login a user", async () => {
      userController.loginUser.mockImplementation((req, res) =>
        res
          .status(200)
          .json({ message: "Login successful", token: "fake-token" })
      );
      const response = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "password123",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Login successful");
    });
  });

  describe("GET /api/users/profile", () => {
    it("should get user profile", async () => {
      userController.getUserProfile.mockImplementation((req, res) =>
        res
          .status(200)
          .json({ id: "1", name: "Test User", email: "test@example.com" })
      );
      const response = await request(app).get("/api/users/profile");
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe("Test User");
    });
  });

  describe("PUT /api/users/profile", () => {
    it("should update user profile", async () => {
      userController.updateUserProfile.mockImplementation((req, res) =>
        res.status(200).json({ message: "Profile updated successfully" })
      );
      const response = await request(app).put("/api/users/profile").send({
        name: "Updated User",
        email: "updated@example.com",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Profile updated successfully");
    });
  });

  describe("GET /api/users", () => {
    it("should get all users (admin only)", async () => {
      userController.getAllUsers.mockImplementation((req, res) =>
        res.status(200).json([{ id: "1", name: "Test User" }])
      );
      const response = await request(app).get("/api/users");
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user (admin only)", async () => {
      userController.updateUser.mockImplementation((req, res) =>
        res.status(200).json({ message: "User updated successfully" })
      );
      const response = await request(app).put("/api/users/123").send({
        name: "Updated User",
        email: "updated@example.com",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("User updated successfully");
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user (admin only)", async () => {
      userController.deleteUser.mockImplementation((req, res) =>
        res.status(200).json({ message: "User deleted successfully" })
      );
      const response = await request(app).delete("/api/users/123");
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("User deleted successfully");
    });
  });

  describe("POST /api/users/reset-password", () => {
    it("should request password reset", async () => {
      userController.requestPasswordReset.mockImplementation((req, res) =>
        res.status(200).json({ message: "Password reset email sent" })
      );
      const response = await request(app)
        .post("/api/users/reset-password")
        .send({
          email: "test@example.com",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Password reset email sent");
    });
  });

  describe("POST /api/users/reset-password/:token", () => {
    it("should reset password with token", async () => {
      userController.resetPassword.mockImplementation((req, res) =>
        res.status(200).json({ message: "Password reset successful" })
      );
      const response = await request(app)
        .post("/api/users/reset-password/fake-token")
        .send({
          password: "newpassword123",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Password reset successful");
    });
  });
});
