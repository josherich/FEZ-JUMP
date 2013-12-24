var w = c.canvas.width;
var h = c.canvas.height;


function Reward(step) {
  this.size = 16;
  this.r = this.size / 2;
  // The step we are on
  this.step = step;
  // How high we float above that step
  this.gap = 2;
  // The x position on the step we are on,
  // indicates offset of the center of the
  // reward on the step
  this.x = this.step.width - this.size;
  this.x *= Math.random();
  this.x += this.r;
  // Angle will be used to spin the reward
  // as it is dying
  this.angle = 0;
  // How much health the player gets for
  // touching this
  this.strength = 10;
  // How much score the player gets for
  // touching this
  this.reward = 100;

  this.checkPlayerTouch = function() {
    if (this.dying) { return; }
    // Compute if we are overlapping with the
    // player.  If we are, set this.dying
    // to true.
    var x = this.step.getX();
    var y = h - this.step.getY();
    // Adjust x and y to center of reward
    x += this.x;
    y -= this.r + this.gap;
    var x2 = player.x;
    var y2 = h - player.y;
    var diffX = x - x2;
    var diffY = y - y2;
    var dist = Math.sqrt(diffX * diffX +
                         diffY * diffY);
    if (dist < player.r + this.r) {
      this.dying = true;
      player.health += this.strength;
      player.health =
        Math.min(100, player.health);
      player.score += this.reward;
    }
  };

  this.move = function() {
    // Check if we are in contact with the player
    this.checkPlayerTouch();
    // Rewards don't move, do nothing else
  };

  this.draw = function() {
    var x = this.step.getX();
    var y = h - this.step.getY();
    // Adjust x and y to center of reward
    x += this.x;
    y -= this.r + this.gap;
    // Parameters are the left top coordinates
    // of the step we are on
    c.save();
    // Draw the reward as a filled green box
    c.fillStyle = 'green';
    c.translate(x, y);
    c.rotate(this.angle * Math.PI / 180);
    c.fillRect(-this.r, -this.r,
               this.size, this.size);
    c.restore();

    // When the reward is dying, spin it
    // and shrink it
    if (this.dying) {
      this.angle += 10;
      this.size = Math.max(0, this.size - 1);
    }
  };
}

function Enemy(step) {
  this.size = 20;
  this.r = this.size / 2;
  // The step we are on
  this.step = step;
  // How high we float above that step
  this.gap = 2;
  // The x position on the step we are on,
  // indicates offset of the center of the
  // enemy on the step
  this.x = this.step.width - this.size;
  this.x *= Math.random();
  this.x += this.r;
  // Velocity (since the enemies move)
  this.maxVx = 2;
  this.vx = (Math.random() - 0.5);
  this.vx *= this.maxVx * 2;
  // Angle will be used to spin the enemy
  // as it is dying
  this.angle = 0;
  // How much health the player gets for
  // touching this
  this.strength = -20;

  this.checkPlayerTouch = function() {
    if (this.dying) { return; }
    // Compute if we are overlapping with the
    // player.  If we are, set this.dying
    // to true.
    var x = this.step.getX();
    var y = h - this.step.getY();
    // Adjust x and y to center of reward
    x += this.x;
    y -= this.r + this.gap;
    var x2 = player.x;
    var y2 = h - player.y;
    var diffX = x - x2;
    var diffY = y - y2;
    var dist = Math.sqrt(diffX * diffX +
                         diffY * diffY);
    if (dist < player.r + this.r) {
      player.health += this.strength;
      player.health = Math.max(0, player.health);
      this.dying = true;
    }
  };


  this.move = function() {
    // Check if we are in contact with the player
    this.checkPlayerTouch();
    // Move back and forth on the step
    this.x += this.vx;
    if (this.x < this.r) {
      this.x = this.r;
      this.vx = -this.vx;
    }
    var maxX = this.step.width - this.r;
    if (this.x > maxX) {
      this.x = maxX;
      this.vx = -this.vx;
    }
  };

  this.draw = function() {
    var x = this.step.getX();
    var y = h - this.step.getY();
    // Adjust x and y to center of enemy
    x += this.x;
    y -= this.r + this.gap;
    var s = this.size;
    // Parameters are the left top coordinates
    // of the step we are on
    c.save();
    // Draw the enemy as a filled red triangle
    c.strokeStyle = 'red';
    c.lineWidth = 2;
    // Move to the center of the enemy
    c.translate(x, y);
    // Rotate as necessary
    c.rotate(this.angle * Math.PI / 180);
    // Draw a triangle
    c.beginPath();
    c.moveTo(-s / 3, s / 2);
    c.lineTo(0, -s / 2);
    c.lineTo(s / 3, s / 2);
    c.closePath();
    c.stroke();
    c.restore();

    // When the enemy is dying, spin it
    // and shrink it
    if (this.dying) {
      this.angle += 10;
      this.size = Math.max(0, this.size - 1);
    }
  };
}


function Step(index, height) {
  // index is like the x coordinate for
  // steps. The first step, at index 0, would
  // be drawn from 0 to width in x.  The
  // second step, at index 1, would be from
  // x to 2x. Index 2 would be 2x to 3x, and
  // so on.
  this.index = index;
  // height is how high off the ground this
  // step is. On the ground is height 0.
  // the first step off the ground will have
  // a height of 1 and be drawn this.stepDiff
  // pixels off the bottom (so at h -
  // this.stepDiff). Height 2 will be 2 *
  // this.stepDiff off the bottom, and so on.
  this.height = height;
  // Constants
  this.width = w / 5;
  this.stepDiff = 40;


  this.init = function() {
    // Don't allow anything on the first couple
    // steps
    if (this.index < 2) { return; }
    // Randomly add rewards and enemies
    if (Math.random() < (this.height + 1) / 10) {
      // More rewards on higher, harder
      // to get to steps
      this.reward = new Reward(this);
    }
    if (Math.random() <
        player.score / 10000 + 0.1) {
      // Add more enemies the higher the
      // score (increasing the difficulty)
      this.enemy = new Enemy(this);
    }
  };
  this.init();

  this.playerIsOn = function(tolerance) {
    tolerance = tolerance || 1;
    // Returns true if the player is on this
    // step

    // First check if the player is anywhere
    // near this step
    var x = this.getX();
    if (player.x + player.r < x) {
      // Player is way to the left
      return false;
    }
    if (player.x - player.r > x + this.width) {
      // Player is way to the right
      return false;
    }
    var y = this.getY();
    var diffY = player.y - y;
    return (diffY >= 0 && diffY <= tolerance);
  };

  this.playerIsBelow = function(tolerance) {
    tolerance = tolerance || 2;
    // Returns true if the player is immediately
    // below this step

    // First check if the player is anywhere
    // near this step
    var x = this.getX();
    if (player.x + player.r < x) {
      // Player is way to the left
      return false;
    }
    if (player.x - player.r > x + this.width) {
      // Player is way to the right
      return false;
    }
    var y = this.getY();
    var diffY = y - (player.y + player.size);
    return (diffY >= 0 && diffY <= tolerance);
  };

  this.move = function() {
    // If we have a reward or enemy, ask
    // it to move itself
    if (this.reward) {
      this.reward.move();
      if (this.reward.dying &&
          this.reward.size <= 0) {
        // The reward went from dying to dead.
        // Remove it completely.
        this.reward = undefined;
      }
    }
    if (this.enemy) {
      this.enemy.move();
      if (this.enemy.dying &&
          this.enemy.size <= 0) {
        // The enemy went from dying to dead.
        // Remove it completely.
        this.enemy = undefined;
      }
    }
  };

  this.draw = function() {
    var x = this.getX();
    // Stop immediately if we are off the
    // screen
    if (x + this.stepWidth < 0 ||
        x > w) {
      return;
    }
    var y = h - this.getY();
    this.drawLine(x, y, x + this.width, y);
    // If we have a reward or enemy, ask
    // it to draw itself
    if (this.reward) {
      this.reward.draw();
    }
    if (this.enemy) {
      this.enemy.draw();
    }
  };

  this.getX = function() {
    // Returns left position of the step
    var x = this.index * this.width;
    x -= player.p;
    return x;
  };

  this.getY = function() {
    // Returns y position (from bottom, not
    // top of canvas, do (h - this.getY())
    // to get the y position to use for
    // drawing
    var y = this.height * this.stepDiff;
    return y;
  };

  this.drawLine = function(x, y, x2, y2) {
    // Draws a line from (x,y) to (x2, y2)
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x2, y2);
    c.stroke();
  };
}


function Steps() {
  // Steps should be a unique ordered list,
  // sorted by index, subsorted by height. So,
  // if the last step in the list is
  // at index 5 and height 3, the next step
  // added has to be at least index 5 and
  // height 4 (but could also be index 6
  // and height 0, or anything else above index
  // 5 and height 3)
  this.steps = [];
  // Likelihood of a step being added at each
  // opportunity to add a step
  this.stepChance = 0.5;

  this.addNeeded = function() {
    var len = this.steps.length;
    var lastStep = this.steps[len - 1];
    var maxIndex = lastStep.index;
    var prevHeight = lastStep.height;

    // Given the last step, figure out
    // how high maxIndex should be
    var minNeeded = (w + player.p) /
                    lastStep.width;
    minNeeded = Math.ceil(minNeeded) - 1;
    if (maxIndex < minNeeded) {
      var newIndex = maxIndex + 1;
      // Every index has a step at 0 (bottom)
      this.steps.push(new Step(newIndex, 0));
      // Find the ceiling
      var maxHeight = h / lastStep.stepDiff;
      maxHeight = Math.floor(maxHeight) - 1;
      // Randomly add a step above the bottom
      for (var i = 1; i >= -1; i--) {
        if (i + prevHeight > 0 &&
            i + prevHeight < maxHeight &&
            Math.random() < this.stepChance) {
          // Create a new step at this height
          this.steps.push(new Step(newIndex,
                              i + prevHeight));
          // Once we create a step, stop
          // creating any more at this index
          // (there will be at most two steps
          // per index)
          break;
        }
      }
      // Call ourselves again to add any more
      // steps that are still needed
      this.addNeeded();
    }
  };

  this.init = function() {
    // Start with a couple steps just at
    // ground level
    this.steps.push(new Step(0, 0));
    this.steps.push(new Step(1, 0));
    // Automatically add any more needed steps
    this.addNeeded();
  };
  this.init();

  this.playerIsOnAnyStep = function(tolerance) {
    tolerance = tolerance || 1;
    for (var i = 0; i < this.steps.length; i++) {
      if (this.steps[i].playerIsOn(tolerance)) {
        return true;
      }
    }
    return false;
  };

  this.playerIsBelowAnyStep =
    function(tolerance) {
    tolerance = tolerance || 2;
    for (var i = 0; i < this.steps.length; i++) {
      var s = this.steps[i];
      if (s.playerIsBelow(tolerance)) {
        return true;
      }
    }
    return false;
  };

  this.move = function() {
    for (var i = 0; i < this.steps.length; i++) {
      this.steps[i].move();
    }
  };

  this.draw = function() {
    for (var i = 0; i < this.steps.length; i++) {
      this.steps[i].draw();
    }
  };
}

function Player() {
  // Constants
  this.r = 10;
  this.size = this.r * 2;
  this.x = w * 0.2;
  this.jumpSpeed = 8;
  this.moveSpeed = 2;
  this.maxMove = 8;
  this.gravity = -0.6;
  this.bounce = 0.2;
  this.friction = 0.8;
  // Position
  // Only the height is variable, x is
  // constant.  The height is the height of
  // the center off the bottom (so, the center
  // of the player is at h - r - y in screen
  // coordinates)
  this.y = 0;
  this.vy = 0;
  // p is the location of the player in the
  // world after moving left or right.
  // The player is always drawn at x, but
  // the rest of the world, all other objects,
  // should use player.p to adjust where they
  // are drawn.
  this.p = 0;
  // vp is the velocity of the player (change
  // in p)
  this.vp = 0;
  // Score starts at 0, Health at 100
  this.score = 0;
  this.health = 100;
  // Hunger is a cost to health charged every
  // frame, the cost of staying alive
  this.hunger = 0.03;

  this.move = function() {
    // Was a jump requested? Can we jump?
    if (this.jump && this.canJump()) {
      // Jump!
      this.vy = this.jumpSpeed;
    }
    if (this.right) {
      this.vp += this.moveSpeed;
      this.vp = Math.min(this.maxMove,
                         this.vp);
    }
    if (this.left) {
      this.vp -= this.moveSpeed;
      this.vp = Math.max(-this.maxMove,
                          this.vp);
    }
    this.y += this.vy;
    this.vy += this.gravity;
    this.p += this.vp;
    this.p = Math.max(this.p, 0);
    this.vp *= this.friction;

    // Are we on a step?
    var tolerance = Math.max(-player.vy, 1);
    if (this.vy < 0 &&
        steps.playerIsOnAnyStep(tolerance)) {
      // Bounce off a step
      this.vy = this.bounce * -this.vy;
    }
    // Are we right below a step?
    tolerance = Math.max(player.vy, 1);
    if (this.vy > 0 &&
        steps.playerIsBelowAnyStep(tolerance)) {
      // Hit the ceiling with a thud
      this.vy = 0;
    }

    // Slowly reduce player health over time
    this.health -= this.hunger;
    this.health = Math.max(0, this.health);
    if (this.health <= 0) {
      this.gameOver = true;
    }
  };

  this.canJump = function() {
    // This should check to make sure we are
    // on top of a solid surface we can jump
    // off of
    var tolerance = Math.max(-player.vy, 8);
    return steps.playerIsOnAnyStep(tolerance);
  };

  this.draw = function() {
    // The player is a simple circle
    c.beginPath();
    c.arc(this.x, h - this.y - this.r, this.r,
          0, 2 * Math.PI);
    c.stroke();
  };
}

// Track keyboard events on the canvas.
// The canvas doesn't normally respond to
// keyboard events, but it will if we make
// the content editable (or set the tabIndex)
c.canvas.contentEditable = true;
c.canvas.onkeydown = function(evt) {
  if (evt.keyCode == 38 || evt.keyCode == 87) {
    // Up arrow or 'w' means jump
    player.jump = true;
    evt.preventDefault();
  }
  if (evt.keyCode == 37 || evt.keyCode == 65) {
    // Left arrow or 'a' means left
    player.left = true;
    evt.preventDefault();
  }
  if (evt.keyCode == 39 || evt.keyCode == 68) {
    // Right arrow or 'd' means right
    player.right = true;
    evt.preventDefault();
  }
};
c.canvas.onkeyup = function(evt) {
  if (evt.keyCode == 38 || evt.keyCode == 87) {
    // Up arrow or 'w' means jump
    player.jump = false;
    evt.preventDefault();
  }
  if (evt.keyCode == 37 || evt.keyCode == 65) {
    // Left arrow or 'a' means left
    player.left = false;
    evt.preventDefault();
  }
  if (evt.keyCode == 39 || evt.keyCode == 68) {
    // Right arrow or 'd' means right
    player.right = false;
    evt.preventDefault();
  }
};


var player = new Player();
var steps = new Steps();

function drawAllText() {
  // Display score and health
  c.fillText('Score: ' + player.score,
             w * 0.8, 20);
  c.fillText('Health: ' +
             Math.ceil(player.health),
             w * 0.05, 20);
  // If the game is over, display game over
  // text
  if (player.gameOver) {
    c.save();
    c.font = '48pt sans-serif';
    c.textAlign = 'center';
    c.fillStyle = 'red';
    c.textBaseline = 'middle';
    c.fillText('GAME OVER', w / 2, h / 2);
    c.restore();
  }
}

// Animation loop
var cmTID;
var timeStep = 50;  // milliseconds
var frameRate = 1000 / timeStep;
function updateAll() {
  // Move everything
  player.move();
  steps.move();
  steps.addNeeded();
  // Redraw everything
  c.clearRect(0, 0, w, h);
  player.draw();
  steps.draw();
  drawAllText();

  // Do everything again in a little bit
  clearTimeout(cmTID);
  if (!player.gameOver) {
    cmTID = setTimeout(updateAll, timeStep);
  }
}
updateAll();