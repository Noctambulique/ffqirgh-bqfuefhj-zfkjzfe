// --- Initialisation canvas ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// --- Définition de la carte (ville) ---
const town = {
  houses: [
    { id: "house1", x: 300, y: 200, w: 80, h: 80, door: { x: 330, y: 260, w: 20, h: 20 } },
    { id: "house2", x: 500, y: 350, w: 100, h: 100, door: { x: 540, y: 420, w: 24, h: 22 } }
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
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// --- Dessiner la carte ---
function drawTown() {
    town.houses.forEach(house => {
        // Maison (rectangle gris)
        ctx.fillStyle = "lightgray";
        ctx.fillRect(house.x, house.y, house.w, house.h);

        // Porte (rectangle marron)
        ctx.fillStyle = "saddlebrown";
        ctx.fillRect(house.door.x, house.door.y, house.door.w, house.door.h);
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

    // Dessiner la ville
    drawTown();

    // Dessiner le joueur
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);


  // Charger l'image de maison
const houseImg = new Image();
houseImg.src = "20250822_1305_Centre d'archives nocturne_simple_compose_01k38q6wp3endsa7d41y0w1wke-Photoroom.png";

// Dessiner une maison
function drawHouse(house) {
    if (houseImg.complete) {
        ctx.drawImage(houseImg, house.x, house.y, house.w, house.h);
    }
}


    requestAnimationFrame(gameLoop);
}

// Lancer le jeu
gameLoop();
