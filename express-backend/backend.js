import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());


const users = {
  users_list: [
    { id: "xyz789", name: "Charlie", job: "Janitor" },
    { id: "abc123", name: "Mac", job: "Bouncer" },
    { id: "ppp222", name: "Mac", job: "Professor" },
    { id: "yat999", name: "Dee", job: "Aspiring actress" },
    { id: "zap555", name: "Dennis", job: "Bartender" },
  ],
};

const findUserById = (id) =>
  users.users_list.find((user) => user.id === id);

const addUser = (user) => {
  users.users_list.push(user);
  return user;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET all users, by name, or by name + job
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  let result = users.users_list;

  if (name !== undefined) {
    result = result.filter((user) => user.name === name);
  }

  if (job !== undefined) {
    result = result.filter((user) => user.job === job);
  }

  res.send({ users_list: result });
});

// GET one user by ID
app.get("/users/:id", (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).send("Resource not found.");
  }

  res.send(user);
});

const generateId = () => {
  return Math.random().toString(36).slice(2, 8);
};

// POST a new user
app.post("/users", (req, res) => {
  const { name, job } = req.body;

  if (!name || !job) {
    return res.status(400).send("name and job are required.");
  }

  let id = generateId();

  while (findUserById(id)) {
    id = generateId();
  }

  const addedUser = addUser({ id, name, job });

  res.status(201).send(addedUser);
});

// DELETE a user by ID
app.delete("/users/:id", (req, res) => {
  const index = users.users_list.findIndex(
    (user) => user.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).send("Resource not found.");
  }

  users.users_list.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
