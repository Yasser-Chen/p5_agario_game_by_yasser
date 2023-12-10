//please inisilise thise parameters as u want
var sizeOfCell = 100; // inisial size of player's cell
const bulletSize = 20;
const mapHight = 3500;
const mapWidth = 2000;
const step = 10; // how fast should cell moves per somthing sec or ms
const sizeOfPoint = 10;
const marginToConfirmEating = 0; // how much you need to confirm you eated another cell
const numberOfPoints = 20;// between 0 and your RAM capacity jk just calculate ((mapHight * mapWidth) / sizeOfPoint ) - sizeOfCell  and you ll get the maximum number you can write here :D
var positionX = 100;
var positionY = 100;
const speedReductionRate = 0.07;
const amountOfGrowWhenEatsAPoint = 30;
const bulletStep = step * 2; // must stay bigger than step to prevent instantly eating your bullet
const bulletMass = 10;
//end please

var tabOfPoints = new Array(numberOfPoints);
var tabOfBullets = [];

function setup() {
  createCanvas(mapHight, mapWidth);
  tabOfPoints[0] = [];
  for (var i = 0; i < numberOfPoints; i++) {
    tabOfPoints[i] = [];
    tabOfPoints[i] = drawPoint(random(0, mapHight), random(0, mapWidth), random(0, 255), random(0, 255), random(0, 255));
    tabOfPoints[i][5] = 1;
  }
}
function playerCell() {
  fill(255, 255, 0);
  noStroke();
  ellipse(positionX, positionY, sizeOfCell, sizeOfCell);

}
function drawBullet(Bx, By) {
  fill(255, 255, 255);
  noStroke();
  ellipse(Bx, By, bulletSize, bulletSize);
}

function drawPoint(pointX, pointY, col1, col2, col3) {
  fill(col1, col2, col3);
  noStroke();
  ellipse(pointX, pointY, sizeOfPoint, sizeOfPoint);
  var onePoint = [];
  onePoint[0] = pointX;
  onePoint[1] = pointY;
  onePoint[2] = col1;
  onePoint[3] = col2;
  onePoint[4] = col3;

  return onePoint;
}

function draw() {
  background(0, 0, 255);


  if ((mouseX >= 0 && mouseX <= mapHight) && (mouseY >= 0 && mouseY <= mapWidth)) {
    let d = dist(mouseX, mouseY, positionX, positionY);
    if (d <= step && d >= 0) {
      //do nothing
    } else {
      if ((mouseY > positionY || mouseY < positionY) ^ (mouseX > positionX || mouseX < positionX)) {
        if (mouseY > positionY) {
          positionY += step;
        } else if (mouseY < positionY) {
          positionY -= step;
        }
        if (mouseX > positionX) {
          positionX += step;
        } else if (mouseX < positionX) {
          positionX -= step;
        }
      }
      else {

        let tanAlpha = Math.abs(mouseY - positionY) / Math.abs(mouseX - positionX);
        let alpha = Math.atan(tanAlpha);
        dx = Math.abs(Math.sin(alpha) * step);
        dy = Math.abs(Math.cos(alpha) * step);

        if (mouseY > positionY && mouseX > positionX) {
          positionY += dx;
          positionX += dy;
        } else if (mouseY < positionY && mouseX < positionX) {
          positionX -= dy;
          positionY -= dx;
        }
        else if (mouseY < positionY && mouseX > positionX) {
          positionX += dy;
          positionY -= dx;

        }
        else if (mouseY > positionY && mouseX < positionX) {
          positionX -= dy;
          positionY += dx;
        }


      }

    }
  }
  //points drwing
  for (var i = 0; i < numberOfPoints; i++) {
    if (tabOfPoints[i][5] == 1) {
      var distance = dist(tabOfPoints[i][0], tabOfPoints[i][1], positionX, positionY);
      if (distance < sizeOfCell / 2 + sizeOfPoint / 2 + marginToConfirmEating) {
        sizeOfCell += amountOfGrowWhenEatsAPoint;
        tabOfPoints[i][5] = 0;
      } else {

        drawPoint(tabOfPoints[i][0], tabOfPoints[i][1], tabOfPoints[i][2], tabOfPoints[i][3], tabOfPoints[i][4]);

      }
    }
  }

  playerCell();

  // section is only for bullet spawning
  if (keyCode === 87) {
    keyCode = null;
    const dx = mouseX - positionX;
    const dy = mouseY - positionY;

    // Normalize direction vector
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const normalizedDx = dx / magnitude;
    const normalizedDy = dy / magnitude;

    // Calculate bullet spawn position on border
    const offsetX = normalizedDx * sizeOfCell / 2;
    const offsetY = normalizedDy * sizeOfCell / 2;

    // Initialize bullet properties with initial speed
    const bullet = {
      x: positionX + offsetX,
      y: positionY + offsetY,
      dx: bulletStep * normalizedDx,
      dy: bulletStep * normalizedDy,
      size: bulletSize,
      speedReductionRate: speedReductionRate, // Rate of speed reduction
    };

    tabOfBullets.push(bullet);
    sizeOfCell -= bulletMass;
  }

  //section is for bullet managing 
  for (let i = 0; i < tabOfBullets.length; i++) {
    const bullet = tabOfBullets[i];

    // Update position and direction
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;

    // Reduce speed gradually
    bullet.dx *= (1 - bullet.speedReductionRate);
    bullet.dy *= (1 - bullet.speedReductionRate);

    // Check collision with player and handle growth
    if (sizeOfCell > bulletMass) {
      const d = dist(bullet.x, bullet.y, positionX, positionY);
      if (d < bulletSize / 2 + sizeOfCell / 2 - marginToConfirmEating) {
        tabOfBullets.splice(i, 1);
        sizeOfCell += bulletMass;
      }
    }
    // Draw bullet regardless of animation state
    fill(255, 0, 0, 255);
    ellipse(bullet.x, bullet.y, bullet.size, bullet.size);
  }

}
