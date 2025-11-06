CREATE DATABASE IF NOT EXISTS cipa;
USE cipa;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  rol ENUM('estudiante','profesor') NOT NULL
);

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  carrera VARCHAR(100),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS profesores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  departamento VARCHAR(100),
  materia VARCHAR(100),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS carreras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cupos_totales INT DEFAULT 30,
  cupos_disponibles INT DEFAULT 30
);

INSERT INTO carreras (nombre, cupos_totales, cupos_disponibles) VALUES
('Ingeniería de Sistemas', 30, 30),
('Ingeniería Industrial', 25, 25),
('Ingeniería Civil', 20, 20),
('Ingeniería Electrónica', 15, 15),
('Ingeniería Mecánica', 25, 25),
('Ingeniería Química', 20, 20),
('Ingeniería Ambiental', 15, 15),
('Ingeniería Biomédica', 10, 10),
('Ingeniería de Petróleos', 15, 15),
('Ingeniería de Software', 30, 30);

CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  id_profesor INT,
  cupos_max INT DEFAULT 10,
  cupos_ocupados INT DEFAULT 0,
  FOREIGN KEY (id_profesor) REFERENCES profesores(id)
);

CREATE TABLE IF NOT EXISTS inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_estudiante INT,
  id_curso INT,
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id),
  FOREIGN KEY (id_curso) REFERENCES cursos(id)
);

CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_estudiante INT,
  curso VARCHAR(100),
  nota DECIMAL(5,2),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);

CREATE TABLE IF NOT EXISTS faltas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_estudiante INT,
  fecha DATE,
  motivo VARCHAR(200),
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id)
);
