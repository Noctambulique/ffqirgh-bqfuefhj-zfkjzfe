// --- Initialisation canvas ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// --- Charger les images ---
const houseImg = new Image();
houseImg.src = "assets/house.png"; // ✅ Mets ton image dans /assets/

// --- Définition de la carte (ville) ---
const town = {
  houses: [
    { id: "house1", x: 300, y: 200, w: 80, h: 80 },
    { id: "house2", x: 500, y: 350, w: 100, h: 100 }
  ]
};

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

// Charger l'image de maison
const houseImg = new Image();
houseImg.src = "assets/20250822_1738_Boutique de Jeux Éclairée_simple_compose_01k396sywzfjzsxzfxm2wj11zg-Photoroom (1).png";

// Dessiner une maison
function drawHouse(house) {
    if (houseImg.complete) {
        ctx.drawImage(houseImg, house.x, house.y, house.w, house.h);
    }
}

// --- Dessiner la ville ---
function drawTown() {
    town.houses.forEach(house => {
        drawHouse(house);
    });
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

   function drawTown() {
    town.houses.forEach(house => {
        drawHouse(house);

        // Porte (rectangle marron au-dessus de l'image si tu veux la garder)
        ctx.fillStyle = "saddlebrown";
        ctx.fillRect(house.door.x, house.door.y, house.door.w, house.door.h);
    });
}

    // Dessiner le joueur
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    requestAnimationFrame(gameLoop);
}

// Lancer le jeu seulement quand l’image est chargée
houseImg.onload = () => {
    gameLoop();
};
