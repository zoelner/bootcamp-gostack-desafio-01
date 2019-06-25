const express = require("express");

const server = express();

server.use(express.json());

let projects = [];
let numberOfRequests = 0;

function increaseNumberOfRequests(req, res, next) {
  numberOfRequests++;

  console.log(`${numberOfRequests} requisições foram realizadas.`);
  next();
}

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(project => project.id === id);
  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }
  next();
}

server.use(increaseNumberOfRequests);

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const data = { id, title, tasks: [] };
  projects.push(data);

  return res.json(data);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(project => project.id === id);
  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  projects = projects.filter(project => project.id !== id);

  return res.send();
});

server.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);
  project.tasks.push(title);
  return res.json(project);
});

server.listen(3000);
