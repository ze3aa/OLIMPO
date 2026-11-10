(function () {
  'use strict';

  // Menú móvil
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });

  // Horarios por día: [hora, clase, entrenador, cupos]
  var horario = {
    'Lunes':    [['06:00','Funcional','Carlos',12],['08:00','Spinning','Marcela',8],['18:00','Pesas guiado','Andrés',10],['19:30','Yoga','Laura',14]],
    'Martes':   [['06:00','Spinning','Marcela',6],['12:00','Pilates','Laura',9],['18:00','Funcional','Carlos',11],['19:30','Zumba','Paola',20]],
    'Miércoles':[['06:00','Funcional','Carlos',10],['08:00','Yoga','Laura',12],['18:00','Spinning','Marcela',5],['19:30','Pesas guiado','Andrés',9]],
    'Jueves':   [['06:00','Pesas guiado','Andrés',8],['12:00','Zumba','Paola',18],['18:00','Pilates','Laura',10],['19:30','Funcional','Carlos',12]],
    'Viernes':  [['06:00','Spinning','Marcela',7],['08:00','Funcional','Carlos',12],['18:00','Zumba','Paola',16]],
    'Sábado':   [['08:00','Funcional','Carlos',15],['09:30','Spinning','Marcela',10],['11:00','Yoga','Laura',14]]
  };
  var dias = Object.keys(horario);
  var tabs = document.querySelector('.tabs');
  var lista = document.getElementById('lista-clases');
  var hoy = new Date().getDay(); // 0 = domingo
  var activo = hoy >= 1 && hoy <= 6 ? hoy - 1 : 0;

  function pintar() {
    Array.prototype.forEach.call(tabs.children, function (b, i) {
      b.setAttribute('aria-selected', i === activo);
    });
    lista.innerHTML = '';
    horario[dias[activo]].forEach(function (c) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="hora">' + c[0] + '</span>' +
        '<span><strong>' + c[1] + '</strong><br><span class="info">Entrenador/a: ' + c[2] + ' · ' + c[3] + ' cupos</span></span>' +
        '<a class="btn btn-small" href="#contacto">Reservar</a>';
      li.querySelector('a').addEventListener('click', function () {
        document.getElementById('mensaje').value = 'Quiero reservar ' + c[1] + ' el ' + dias[activo] + ' a las ' + c[0] + '.';
      });
      lista.appendChild(li);
    });
  }
  dias.forEach(function (d, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = d;
    b.addEventListener('click', function () { activo = i; pintar(); });
    tabs.appendChild(b);
  });
  pintar();

  // Elegir plan desde las tarjetas
  document.querySelectorAll('[data-plan]').forEach(function (a) {
    a.addEventListener('click', function () { document.getElementById('plan').value = a.dataset.plan; });
  });

  // Galería ampliada
  var visor = document.getElementById('visor');
  var visorImg = visor.querySelector('img');
  document.querySelectorAll('.grid button').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = b.querySelector('img');
      visorImg.src = img.src; visorImg.alt = img.alt;
      visor.showModal();
    });
  });
  visor.querySelector('.cerrar').addEventListener('click', function () { visor.close(); });
  visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });

  // Formulario con validación
  var form = document.getElementById('form');
  var estado = document.getElementById('estado');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (campo) {
      var valido = campo.checkValidity();
      campo.classList.toggle('invalid', !valido);
      if (!valido) ok = false;
    });
    if (!ok) {
      estado.className = 'error';
      estado.textContent = 'Revisa los campos marcados: el teléfono debe tener 10 dígitos y el correo un formato válido.';
      return;
    }
    estado.className = 'ok';
    estado.textContent = '¡Listo, ' + form.nombre.value.split(' ')[0] + '! Recibimos tu solicitud y te contactaremos pronto.';
    form.reset();
  });

  document.getElementById('anio').textContent = new Date().getFullYear();
})();
