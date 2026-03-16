const menuIcon = document.getElementById('menuIcon');
const sidebar = document.getElementById('sidebar');

if (menuIcon && sidebar) {
    menuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        menuIcon.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
    });

    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuIcon.textContent = '☰';
        });
    });
}


const track = document.getElementById('track');
const slides = document.getElementsByClassName('carousel-slide');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let currentPos = 0;
let targetPos = 0;
let isMoving = false;
let lastTime = 0;

const autoPlaySpeed = 60;
const lerpFactor = 0.1; // Increased slightly for snappier response
const gap = 30;

function animate(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // We measure the width every frame in case of window resize
    const sw = slides[0].offsetWidth + gap;

    if (!isMoving) {
        currentPos -= autoPlaySpeed * deltaTime;
        targetPos = currentPos;
    } else {
        currentPos += (targetPos - currentPos) * lerpFactor;
        // If we are within 0.5px of target, stop manual move
        if (Math.abs(targetPos - currentPos) < 0.5) {
            isMoving = false;
        }
    }

    // --- FLICKER FIX: SEAMLESS RECYCLING ---
    // When the first slide is fully out of view
    if (currentPos <= -sw) {
        // 1. Move the DOM element
        track.appendChild(track.firstElementChild);
        // 2. Adjust coordinates immediately to compensate for the layout shift
        currentPos += sw;
        targetPos += sw;
    }
    // When moving backwards and space opens up at the start
    else if (currentPos >= 0) {
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        currentPos -= sw;
        targetPos -= sw;
    }

    track.style.transform = `translateX(${currentPos}px)`;
    updateActiveState(sw);

    requestAnimationFrame(animate);
}

function updateActiveState(sw) {
    const centerX = window.innerWidth / 2;
    // We convert to array to use forEach safely
    const slidesArray = Array.from(slides);

    slidesArray.forEach(slide => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        // A slide is active if its center is within 25% of the screen center
        const isCentered = Math.abs(centerX - slideCenter) < (sw * 0.4);
        slide.classList.toggle('active', isCentered);
    });
}

// --- Smooth Arrow Controls ---
nextBtn.addEventListener('click', () => {
    const sw = slides[0].offsetWidth + gap;
    isMoving = true;
    targetPos -= sw;
});

prevBtn.addEventListener('click', () => {
    const sw = slides[0].offsetWidth + gap;
    isMoving = true;
    targetPos += sw;
});

// --- Mobile Touch (Drift-corrected) ---
let startX = 0;
track.addEventListener('touchstart', (e) => {
    isMoving = true;
    startX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener('touchmove', (e) => {
    const x = e.touches[0].clientX;
    const deltaX = x - startX;
    targetPos += deltaX;
    startX = x;
}, { passive: true });

// Initial Kickoff
requestAnimationFrame(animate);