import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 1234;

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "prueba",
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", true);

app.get("/getAlumnos", (req, res) => {
  const sql =
    "SELECT alumnos.*, cursos.* FROM alumnos_cursos INNER JOIN alumnos ON alumnos_cursos.legajo = alumnos.legajo INNER JOIN cursos ON alumnos_cursos.curso_id = cursos.curso_id;";

  conexion.query(sql, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(response);
  });
});

app.get("/getProfesores", (req, res) => {
  const sql =
    "SELECT cursos.curso, materias.materia, profesores.nombre, profesores.apellido FROM profesores_materias_cursos INNER JOIN profesores ON profesores_materias_cursos.profesor_id = profesores.profesor_id INNER JOIN materias ON profesores_materias_cursos.materia_id = materias.materia_id INNER JOIN cursos ON profesores_materias_cursos.curso_id = cursos.curso_id;";

  conexion.query(sql, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(response);
  });
});

app.post("/login", (req, res) => {
  const { correo, legajo } = req.body;
  const sql =
    "SELECT a.legajo, a.correo, a.nombre, a.apellido, c.curso FROM alumnos a JOIN alumnos_cursos ac ON a.legajo = ac.legajo JOIN cursos c ON ac.curso_id = c.curso_id WHERE a.correo = ? AND a.legajo = ?";

  conexion.query(sql, [correo, legajo], (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetchin data");
      return;
    }
    res.redirect("http://127.0.0.1:5500/perfil.html");
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
