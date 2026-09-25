import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET all users, optionally filtered by name and/or job
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  userService
    .getUsers(name, job)
    .then((users) => res.send({ users_list: users }))
    .catch((error) => res.status(500).send(error.message));
});

// GET one user by MongoDB _id
app.get("/users/:id", (req, res) => {
  userService
    .findUserById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("Resource not found.");
      }

      res.send(user);
    })
    .catch((error) => res.status(500).send(error.message));
});

// POST a new user
app.post("/users", (req, res) => {
  const { name, job } = req.body;

  if (!name || !job) {
    return res.status(400).send("name and job are required.");
  }

  userService
    .addUser({ name, job })
    .then((addedUser) => res.status(201).send(addedUser))
    .catch((error) => res.status(400).send(error.message));
});

// DELETE a user by MongoDB _id
app.delete("/users/:id", (req, res) => {
  userService
    .removeUser(req.params.id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send("Resource not found.");
      }

      res.status(204).send();
    })
    .catch((error) => res.status(500).send(error.message));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
