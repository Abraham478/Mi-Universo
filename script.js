// ==========================================
// 1. MOTOR ESPACIAL EN CANVAS 3D (WARP SPEED)
// ==========================================
const canvas = document.getElementById("espacio");
const ctx = canvas ? canvas.getContext("2d") : null;

let ancho, alto, centroX, centroY;
const cantidadEstrellas = 10000; // Alto número de estrellas sin ralentizar
const estrellas = [];

// Parámetros de velocidad
let velocidadBase = 0.5;
let velocidadActual = velocidadBase;
let enViajeEspacial = false;

function redimensionar() {
    if (!canvas) return;
    ancho = canvas.width = window.innerWidth;
    alto = canvas.height = window.innerHeight;
    centroX = ancho / 2;
    centroY = alto / 2;
}

if (canvas) {
    window.addEventListener("resize", redimensionar);
    redimensionar();
}

// Clase Estrella 3D
class Estrella3D {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = (Math.random() - 0.5) * ancho * 2;
        this.y = (Math.random() - 0.5) * alto * 2;
        this.z = Math.random() * ancho;
        this.pz = this.z; // Posición previa z (para dibujar la estela)
        
        // Colores románticos aleatorios para las estrellas
        const colores = ["#ffffff", "#ffb7dc", "#c89bff", "#88ccff"];
        this.color = colores[Math.floor(Math.random() * colores.length)];
    }

    actualizar() {
        this.pz = this.z;
        this.z -= velocidadActual;

        if (this.z <= 0) {
            this.reset();
            this.z = ancho;
            this.pz = this.z;
        }
    }

    dibujar() {
        if (!ctx) return;
        // Proyección 3D a 2D
        const sx = (this.x / this.z) * ancho + centroX;
        const sy = (this.y / this.z) * alto + centroY;

        const px = (this.x / this.pz) * ancho + centroX;
        const py = (this.y / this.pz) * alto + centroY;

        const radio = Math.max(0.1, (1 - this.z / ancho) * 3);

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        // Dibujar estela si va a alta velocidad (Efecto Agujero de Gusano)
        if (velocidadActual > 3) {
            ctx.lineWidth = radio;
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        } else {
            ctx.arc(sx, sy, radio, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Inicializar estrellas si existe el canvas
if (canvas) {
    for (let i = 0; i < cantidadEstrellas; i++) {
        estrellas.push(new Estrella3D());
    }
}

// Bucle principal de renderizado (60 FPS garantizados)
function animarEspacio() {
    if (!ctx) return;

    // Fondo oscuro progresivo para crear trazos de luz suaves
    ctx.fillStyle = enViajeEspacial ? "rgba(3, 0, 10, 0.25)" : "rgba(3, 0, 10, 1)";
    ctx.fillRect(0, 0, ancho, alto);

    // Suavizar cambio de velocidad
    if (enViajeEspacial) {
        velocidadActual = interpolar(velocidadActual, 45, 0.05); // Acelera a Warp Speed
    } else {
        velocidadActual = interpolar(velocidadActual, velocidadBase, 0.02); // Vuelve a normal
    }

    for (let estrella of estrellas) {
        estrella.actualizar();
        estrella.dibujar();
    }

    requestAnimationFrame(animarEspacio);
}

function interpolar(inicio, fin, factor) {
    return inicio + (fin - inicio) * factor;
}

if (canvas) {
    animarEspacio();
}

// ==========================================
// 2. INICIAR VIAJE ESPACIAL Y NAVEGACIÓN
// ==========================================
function iniciarViaje() {
    const portadaContenido = document.querySelector(".contenido");
    const carta = document.getElementById("carta");
    const musica = document.getElementById("musica");

    // 1. Iniciar Música
    if (musica && musica.paused) {
        musica.play().catch(() => {});
    }

    // 2. Animación en el Canvas (Agujero de gusano)
    enViajeEspacial = true;
    if (portadaContenido) {
        portadaContenido.classList.add("desaparecer");
    }

    // 3. Volver a velocidad normal y desplazar a la carta tras 2.2 segundos (SIN abrir el sobre automáticamente)
    setTimeout(() => {
        enViajeEspacial = false;
        if (carta) {
            carta.classList.remove("oculto");
            carta.scrollIntoView({
                behavior: "smooth"
            });
        }
    }, 2200);
}

// ==========================================
// 3. APERTURA DEL SOBRE Y MOSTRAR CARTA (MODAL)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const sobre = document.getElementById("sobre3d") || document.querySelector(".envelope");
    const carta = document.querySelector(".letter");

    if (sobre && carta) {
        // Al hacer clic en el sobre
        sobre.addEventListener("click", (e) => {
            e.stopPropagation();
            sobre.classList.add("open");
            
            // Un pequeño delay para que primero se abra la solapa y luego brote la carta
            setTimeout(() => {
                carta.classList.add("mostrar");
            }, 300);
        });

        // Ocultar carta al hacer clic fuera de ella
        document.addEventListener("click", (e) => {
            if (carta.classList.contains("mostrar") && !carta.contains(e.target) && !sobre.contains(e.target)) {
                carta.classList.remove("mostrar");
                setTimeout(() => {
                    sobre.classList.remove("open");
                }, 200);
            }
        });
    }
});

// ==========================================
// 4. CORAZONES AL HACER CLIC EN LA PANTALLA
// ==========================================
document.addEventListener("click", (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('.envelope')) return;

    const corazon = document.createElement("div");
    corazon.classList.add("corazon-click");
    corazon.innerHTML = "💖";
    corazon.style.left = `${e.clientX}px`;
    corazon.style.top = `${e.clientY}px`;

    document.body.appendChild(corazon);

    setTimeout(() => {
        corazon.remove();
    }, 1200);
});

// ==========================================
// 5. CONTADOR DE TIEMPO
// ==========================================
const fechaInicio = new Date(2026, 4, 11, 0, 0, 0); 

function actualizarContador() {
    const ahora = new Date();
    const diferencia = ahora - fechaInicio;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / 1000 / 60) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    const elDias = document.getElementById("dias");
    const elHoras = document.getElementById("horas");
    const elMinutos = document.getElementById("minutos");
    const elSegundos = document.getElementById("segundos");

    if (elDias) elDias.innerText = dias < 10 ? `0${dias}` : dias;
    if (elHoras) elHoras.innerText = horas < 10 ? `0${horas}` : horas;
    if (elMinutos) elMinutos.innerText = minutos < 10 ? `0${minutos}` : minutos;
    if (elSegundos) elSegundos.innerText = segundos < 10 ? `0${segundos}` : segundos;
}

setInterval(actualizarContador, 1000);
actualizarContador();

// ==========================================
// 6. CONTROL DE MÚSICA DE FONDO
// ==========================================
function toggleMusica() {
    const musica = document.getElementById("musica");
    const btn = document.getElementById("btnMusica");

    if (musica && btn) {
        if (musica.paused) {
            musica.play();
            btn.innerText = "🎵";
        } else {
            musica.pause();
            btn.innerText = "🔇";
        }
    }
}

// ==========================================
// 7. ANIMACIÓN AL HACER SCROLL (INTERSECTION OBSERVER)
// ==========================================
const elementosRevelables = document.querySelectorAll(".revelable");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("activo");
            }
        });
    }, { threshold: 0.2 });

    elementosRevelables.forEach((el) => observer.observe(el));
} else {
    // Fallback manual para navegadores antiguos
    function revelarElementos() {
        const triggerBottom = window.innerHeight * 0.85;
        elementosRevelables.forEach((elemento) => {
            const topElemento = elemento.getBoundingClientRect().top;
            if (topElemento < triggerBottom) {
                elemento.classList.add("activo");
            }
        });
    }
    window.addEventListener("scroll", revelarElementos);
    revelarElementos();
}
function abrirVisor(rutaImagen, titulo, texto) {
    const visor = document.getElementById('visorEstelar');
    document.getElementById('visorImg').src = rutaImagen;
    document.getElementById('visorTitulo').textContent = titulo;
    document.getElementById('visorTexto').textContent = texto;
    
    visor.classList.add('activo');
}

function cerrarVisor(e) {
    // Cierra si hace clic fuera del contenido
    if (e.target.id === 'visorEstelar') {
        document.getElementById('visorEstelar').classList.remove('activo');
    }
}

function cerrarVisorDirecto() {
    document.getElementById('visorEstelar').classList.remove('activo');
}