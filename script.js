document.addEventListener("DOMContentLoaded", function () {
    const character = document.querySelector('.character');
    const gameContainer = document.querySelector('.game-container');
    let canJump = true;
    let spikes = [];

    document.addEventListener('click', function () {
        if (canJump) {
            jump();
        }
    });

    function jump() {
        canJump = false;
        character.classList.add('jump');

        setTimeout(function () {
            character.classList.remove('jump');
            canJump = true;
        }, 500);
    }

    function checkCollision() {
        const characterRect = character.getBoundingClientRect();

        for (const spike of spikes) {
            const spikeRect = spike.getBoundingClientRect();

            // If the character is in the air, adjust the hitbox
            const characterBottom = canJump ? characterRect.bottom : characterRect.top;

            // Check for collision between character and spike
            if (
                characterBottom > spikeRect.top &&
                characterRect.top < spikeRect.bottom &&
                characterRect.right > spikeRect.left &&
                characterRect.left < spikeRect.right
            ) {
                gameOver();
            }
        }
    }

    function gameOver() {
        alert('Game Over!');
        resetGame();
    }

    function createSpikes() {
        const distanceBetweenSpikes = 150; // Adjust the distance between spikes
        const lastSpike = spikes[spikes.length - 1];

        if (!lastSpike || window.innerWidth - lastSpike.getBoundingClientRect().right >= distanceBetweenSpikes) {
            const spike = document.createElement('div');
            spike.classList.add('spike');

            gameContainer.appendChild(spike);
            spikes.push(spike);

            // 1 in 10 chance to create another spike next to it
            if (spikes.length > 1 && Math.random() < 0.1) {
                const nextSpike = document.createElement('div');
                nextSpike.classList.add('spike', 'next-to');
                gameContainer.appendChild(nextSpike);
                spikes.push(nextSpike);
            }
        }
    }

    function moveSpikes() {
        for (const spike of spikes) {
            const spikePosition = parseFloat(window.getComputedStyle(spike).left);
            spike.style.left = `${spikePosition - 3}px`; // Adjust the speed (change from 5px to 3px)
        }
    }

    function removeOffScreenSpikes() {
        spikes = spikes.filter(spike => {
            const spikePosition = parseFloat(window.getComputedStyle(spike).left);
            return spikePosition > -parseFloat(window.getComputedStyle(spike).width);
        });
    }

    function resetGame() {
        spikes.forEach(spike => spike.remove());
        spikes = [];
    }

    function update() {
        createSpikes();
        moveSpikes();
        checkCollision();
        removeOffScreenSpikes();

        requestAnimationFrame(update);
    }

    update();
});
