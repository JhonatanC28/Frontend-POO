const BASE = "http://localhost:4000";

/* ================= LOGIN ================= */
document.getElementById("formLogin")?.addEventListener("submit", async e => {
  e.preventDefault();
  const email = login_email.value, password = login_pass.value;
  try {
    const r = await fetch(BASE + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await r.json();
    if (data.ok) {
      localStorage.setItem("usuario", JSON.stringify(data.user));
      msgLogin.className = "msg success";
      msgLogin.textContent = "✅ Sesión iniciada correctamente";
      setTimeout(() => {
        if (data.user.rol === "estudiante") window.location = "estudiantes.html";
        else window.location = "profesores.html";
      }, 1000);
    } else {
      msgLogin.className = "msg error";
      msgLogin.textContent = data.error;
    }
  } catch {
    msgLogin.className = "msg error";
    msgLogin.textContent = "❌ Error en la conexión";
  }
});

/* ================= REGISTRO ================= */
document.getElementById("formRegistro")?.addEventListener("submit", async e => {
  e.preventDefault();
  const nombre = reg_nombre.value, email = reg_email.value,
        password = reg_pass.value, rol = reg_rol.value;
  try {
    const r = await fetch(BASE + "/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, rol })
    });
    const data = await r.json();
    if (data.ok) {
      msgRegistro.className = "msg success";
      msgRegistro.textContent = "✅ Registro exitoso. Ahora puedes iniciar sesión.";
      setTimeout(() => window.location = "login.html", 1500);
    } else {
      msgRegistro.className = "msg error";
      msgRegistro.textContent = data.error;
    }
  } catch {
    msgRegistro.className = "msg error";
    msgRegistro.textContent = "❌ Error en la conexión";
  }
});

/* ================= PROFESOR ================= */
function mostrarForm(id) {
  document.querySelectorAll("main form").forEach(f => f.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
  resultProf.innerHTML = "";
}

// 👉 Cargar cursos
async function cargarCursos() {
  try {
    const r = await fetch(BASE + "/cursos");
    const cursos = await r.json();

    if (typeof notaCurso !== "undefined" && notaCurso) {
      notaCurso.innerHTML = '<option value="">-- Seleccione curso --</option>';
      cursos.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nombre;
        notaCurso.appendChild(opt);
      });
    }
    if (typeof asigCurso !== "undefined" && asigCurso) {
      asigCurso.innerHTML = '<option value="">-- Seleccione curso --</option>';
      cursos.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nombre;
        asigCurso.appendChild(opt);
      });
    }
    if (typeof horCurso !== "undefined" && horCurso) {
      horCurso.innerHTML = '<option value="">-- Seleccione curso --</option>';
      cursos.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nombre;
        horCurso.appendChild(opt);
      });
    }
  } catch (err) {
    console.error("❌ Error cargando cursos", err);
  }
}
if (window.location.pathname.includes("profesores.html")) {
  cargarCursos();
}

// 👉 Registrar nota
async function enviarNota(e) {
  e.preventDefault();
  const id_estudiante = notaEst.value.trim();
  const id_curso = notaCurso.value.trim();
  const nota = notaValor.value.trim();

  const r = await fetch(BASE + "/profesores/notas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_estudiante, id_curso, nota })
  });

  const data = await r.json();
  resultProf.className = data.ok ? "msg success" : "msg error";
  resultProf.textContent = data.ok ? "✅ Nota registrada" : data.error;
}

// 👉 Registrar falta
async function enviarFalta(e) {
  e.preventDefault();
  const id_estudiante = faltaEst.value.trim();
  const fecha = faltaFecha.value.trim();
  const motivo = faltaMotivo.value.trim();
  const r = await fetch(BASE + "/profesores/faltas", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_estudiante, fecha, motivo })
  });
  const data = await r.json();
  resultProf.className = data.ok ? "msg success" : "msg error";
  resultProf.textContent = data.ok ? "✅ Falta registrada" : data.error;
}

// 👉 Asignar curso
async function asignarCurso(e) {
  e.preventDefault();
  const id_estudiante = asigEst.value.trim();
  const id_curso = asigCurso.value.trim();
  const r = await fetch(BASE + "/profesores/asignar", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_estudiante, id_curso })
  });
  const data = await r.json();
  resultProf.className = data.ok ? "msg success" : "msg error";
  resultProf.textContent = data.ok ? "✅ Estudiante asignado" : data.error || data.msg;
}

// 👉 Definir horario
async function definirHorario(e) {
  e.preventDefault();
  const id_curso = horCurso.value.trim();
  const dia = horDia.value.trim();
  const hora = horHora.value.trim();
  const r = await fetch(BASE + "/profesores/horarios", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_curso, dia, hora })
  });
  const data = await r.json();
  resultProf.className = data.ok ? "msg success" : "msg error";
  resultProf.textContent = data.ok ? "✅ Horario guardado" : data.error;
  if (data.ok) consultarHorarios(id_curso);
}

async function consultarHorarios(id_curso) {
  try {
    const r = await fetch(BASE + "/profesores/horarios/" + id_curso);
    const data = await r.json();
    if (Array.isArray(data) && data.length > 0) {
      tablaHorarios.innerHTML = `
        <h3>Horarios del curso ${id_curso}</h3>
        <table><tr><th>Día</th><th>Hora</th></tr>
        ${data.map(h => `<tr><td>${h.dia}</td><td>${h.hora}</td></tr>`).join("")}
        </table>`;
    } else {
      tablaHorarios.innerHTML = "<p>⚠ No hay horarios registrados</p>";
    }
  } catch {
    tablaHorarios.innerHTML = "<p>❌ Error cargando horarios</p>";
  }
}

// 👉 Ver cupos
async function verCupos() {
  try {
    const r = await fetch(BASE + "/carreras/cupos");
    const data = await r.json();
    if (Array.isArray(data) && data.length > 0) {
      resultProf.innerHTML = `<h3>Cupos disponibles</h3>
        <table><tr><th>Carrera</th><th>Cupos Totales</th><th>Cupos Disponibles</th></tr>
        ${data.map(c => `<tr><td>${c.nombre}</td><td>${c.cupos_totales}</td><td>${c.cupos_disponibles}</td></tr>`).join("")}
        </table>`;
    } else {
      resultProf.innerHTML = "<p>No hay carreras registradas.</p>";
    }
  } catch {
    resultProf.innerHTML = "<p>❌ Error cargando cupos.</p>";
  }
}

/* ================= ESTUDIANTE ================= */
function mostrarSeccion(id) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function getUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

function registroCarrera() {
  mostrarSeccion("secRegistro");
}

// 👉 Cargar carreras
async function cargarCarreras() {
  if (!document.getElementById("carreraSelect")) return;
  try {
    const r = await fetch(BASE + "/carreras/cupos");
    const data = await r.json();
    if (Array.isArray(data)) {
      carreraSelect.innerHTML = '<option value="">-- Seleccione carrera --</option>';
      data.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.nombre} (${c.cupos_disponibles} cupos)`;
        carreraSelect.appendChild(opt);
      });
    }
  } catch {
    carreraSelect.innerHTML = '<option value="">❌ Error cargando carreras</option>';
  }
}
cargarCarreras();

// 👉 Registro a carrera
document.getElementById("formCarrera")?.addEventListener("submit", async e => {
  e.preventDefault();
  const user = getUsuario();
  if (!user) return alert("⚠ Debes iniciar sesión");
  const id_usuario = user.id;
  const id_carrera = carreraSelect.value;
  try {
    const r = await fetch(BASE + "/estudiantes/asignar-carrera", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario, id_carrera })
    });
    const data = await r.json();
    msgCarrera.className = data.ok ? "msg success" : "msg error";
    msgCarrera.textContent = data.ok ? "✅ Inscripción exitosa" : data.error;
  } catch {
    msgCarrera.className = "msg error";
    msgCarrera.textContent = "❌ Error en la conexión";
  }
});

// 👉 Consultar notas
async function consultarNotas() {
  mostrarSeccion("secNotas");
  const user = getUsuario();
  if (!user) return alert("⚠ Debes iniciar sesión");
  try {
    const r = await fetch(BASE + "/estudiantes/datos/" + user.id);
    const data = await r.json();
    resultNotas.innerHTML = (data.ok && data.notas?.length)
      ? `<table><tr><th>Curso</th><th>Nota</th></tr>
         ${data.notas.map(n => `<tr><td>${n.curso}</td><td>${n.nota}</td></tr>`).join("")}
         </table>`
      : "<p>No hay notas registradas.</p>";
  } catch {
    resultNotas.innerHTML = "<p>❌ Error cargando notas.</p>";
  }
}

// 👉 Consultar faltas
async function consultarFaltas() {
  mostrarSeccion("secFaltas");
  const user = getUsuario();
  if (!user) return alert("⚠ Debes iniciar sesión");
  try {
    const r = await fetch(BASE + "/estudiantes/datos/" + user.id);
    const data = await r.json();
    resultFaltas.innerHTML = (data.ok && data.faltas?.length)
      ? `<table><tr><th>Fecha</th><th>Motivo</th></tr>
         ${data.faltas.map(f => `<tr><td>${f.fecha}</td><td>${f.motivo}</td></tr>`).join("")}
         </table>`
      : "<p>No hay faltas registradas.</p>";
  } catch {
    resultFaltas.innerHTML = "<p>❌ Error cargando faltas.</p>";
  }
}

// 👉 Consultar horarios de la carrera
async function consultarHorariosCarrera() {
  mostrarSeccion("secHorarios");
  const user = getUsuario();
  if (!user) return alert("⚠ Debes iniciar sesión");
  const id_carrera = carreraSelect?.value || user.id_carrera;
  if (!id_carrera) {
    resultHorarios.innerHTML = "<p>⚠ Primero inscríbete en una carrera</p>";
    return;
  }
  try {
    const r = await fetch(BASE + "/carreras/" + id_carrera + "/horarios");
    const data = await r.json();
    resultHorarios.innerHTML = (data.length > 0)
      ? `<table><tr><th>Curso</th><th>Día</th><th>Hora</th></tr>
         ${data.map(h => `<tr><td>${h.curso}</td><td>${h.dia}</td><td>${h.hora}</td></tr>`).join("")}
         </table>`
      : "<p>No hay horarios registrados.</p>";
  } catch {
    resultHorarios.innerHTML = "<p>❌ Error cargando horarios.</p>";
  }
}
// 👉 Consultar carrera y cursos
async function consultarCarrera() {
  mostrarSeccion("secCarrera"); // ahora abre la sección
  const user = getUsuario();
  if (!user) return alert("⚠ Debes iniciar sesión");

  try {
    const r = await fetch(BASE + "/estudiantes/carrera/" + user.id);
    const data = await r.json();

    resultCarrera.innerHTML = data.carrera
      ? `<h4>🎓 Carrera: ${data.carrera}</h4>
         <table>
           <tr><th>Cursos</th></tr>
           ${data.cursos.map(c => `<tr><td>${c.nombre}</td></tr>`).join("")}
         </table>`
      : "<p>⚠ No estás registrado en ninguna carrera.</p>";
  } catch {
    resultCarrera.innerHTML = "<p>❌ Error consultando carrera.</p>";
  }
}


// 👉 Borrar carrera
async function borrarCarrera() {
  const user = getUsuario();
  if (!user) return alert("⚠ Debes iniciar sesión");

  if (!confirm("¿Seguro que deseas eliminar tu carrera registrada?")) return;

  try {
    const r = await fetch(BASE + "/estudiantes/borrar-carrera/" + user.id, {
      method: "DELETE"
    });
    const data = await r.json();

    if (data.ok) {
      alert("🗑 Carrera eliminada con éxito.");
      if (carreraSelect) carreraSelect.value = "";
    } else {
      alert("⚠ " + (data.error || "No se pudo borrar la carrera."));
    }
  } catch {
    alert("❌ Error al borrar la carrera.");
  }
}

/* ================= CERRAR SESIÓN ================= */
function logout() {
  localStorage.removeItem("usuario");
  window.location = "login.html";
}
document.getElementById("btnLogout")?.addEventListener("click", logout);

/* ================= EVENTOS PROFESOR ================= */
document.getElementById("btnNota")?.addEventListener("click", () => mostrarForm("formNota"));
document.getElementById("btnFalta")?.addEventListener("click", () => mostrarForm("formFalta"));
document.getElementById("btnAsignar")?.addEventListener("click", () => mostrarForm("formAsignar"));
document.getElementById("btnHorario")?.addEventListener("click", () => mostrarForm("formHorario"));
document.getElementById("btnCupos")?.addEventListener("click", verCupos);

document.getElementById("formNota")?.addEventListener("submit", enviarNota);
document.getElementById("formFalta")?.addEventListener("submit", enviarFalta);
document.getElementById("formAsignar")?.addEventListener("submit", asignarCurso);
document.getElementById("formHorario")?.addEventListener("submit", definirHorario);

/* ================= EVENTOS ESTUDIANTE ================= */
document.getElementById("btnRegistroCarrera")?.addEventListener("click", registroCarrera);
document.getElementById("btnNotas")?.addEventListener("click", consultarNotas);
document.getElementById("btnFaltas")?.addEventListener("click", consultarFaltas);
document.getElementById("btnHorarios")?.addEventListener("click", consultarHorariosCarrera);
document.getElementById("btnCarrera")?.addEventListener("click", consultarCarrera);
document.getElementById("btnBorrarCarrera")?.addEventListener("click", borrarCarrera);
