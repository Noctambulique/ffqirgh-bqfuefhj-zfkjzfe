<canvas id="gameCanvas"></canvas>
<script>
// --- Initialisation canvas ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// --- Images des bâtiments ---
const buildingFiles = [
  "DETECTIVE.png",
  "JEUVIDEO.png",
  "ARCHIVE.png",
  "MUSEE.png",
  "VOYAGE.png",
  "MUSIQUE.png",
  "VETEMENT.png",
  "CINEMA.png"
];

const buildings = [];
let imagesLoaded = 0;

// --- Charger les images ---
buildingFiles.forEach((file, index) => {
  const img = new Image();
  img.src = "assets/" + file;
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === buildingFiles.length) {
      setupTown();
      gameLoop();
    }
  };
  buildings.push({ img });
});

// --- Définir la position des bâtiments en cercle ---
function setupTown() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 200;
  const angleStep = (2 * Math.PI) / buildings.length;

  buildings.forEach((b, i) => {
    const angle = i * angleStep;
    b.w = 100;
    b.h = 100;
    b.x = centerX + radius * Math.cos(angle) - b.w / 2;
    b.y = centerY + radius * Math.sin(angle) - b.h / 2;
  });
}

// --- Personnage ---
let player = {
  x: 100,
  y: 100,
  size: 40,
  color: "red",
  speed: 5
};

// --- Entrées clavier ---
let keys = {};
document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

// --- Dessiner une maison ---
function drawBuilding(b) {
  ctx.drawImage(b.img, b.x, b.y, b.w, b.h);
}

// --- Dessiner la ville ---
function drawTown() {
  buildings.forEach(b => drawBuilding(b));
}

// --- Boucle de jeu ---
function gameLoop() {
  // Effacer l’écran (fond vert)
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Déplacement joueur (flèches + ZQSD)
  if (keys["ArrowUp"] || keys["z"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
  if (keys["ArrowLeft"] || keys["q"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  // Dessiner les bâtiments
  drawTown();

  // Dessiner le joueur
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);

  requestAnimationFrame(gameLoop);
}
</script>
