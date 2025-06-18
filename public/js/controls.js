// Mouse and keyboard controls for the Three.js scene

let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let isMouseDown = false;

function setupControls() {
    // Mouse controls
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('wheel', onMouseWheel);

    // Touch controls for mobile
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchmove', onTouchMove);

    // Button controls
    document.getElementById('toggleAnimation').addEventListener('click', window.toggleAnimation);
    document.getElementById('changeColors').addEventListener('click', window.changeColors);
    document.getElementById('resetCamera').addEventListener('click', window.resetCamera);
}

function onMouseDown(event) {
    isMouseDown = true;
    updateMousePosition(event.clientX, event.clientY);
}

function onMouseUp(event) {
    isMouseDown = false;
}

function onMouseMove(event) {
    if (isMouseDown) {
        updateMousePosition(event.clientX, event.clientY);
        updateCameraPosition();
    }
}

function onMouseWheel(event) {
    if (window.camera) {
        window.camera.position.multiplyScalar(1 + event.deltaY * 0.001);
        window.camera.position.clampLength(3, 50);
    }
}

// Touch events for mobile
function onTouchStart(event) {
    if (event.touches.length === 1) {
        isMouseDown = true;
        updateMousePosition(event.touches[0].clientX, event.touches[0].clientY);
    }
}

function onTouchEnd(event) {
    isMouseDown = false;
}

function onTouchMove(event) {
    event.preventDefault();
    if (isMouseDown && event.touches.length === 1) {
        updateMousePosition(event.touches[0].clientX, event.touches[0].clientY);
        updateCameraPosition();
    }
}

function updateMousePosition(clientX, clientY) {
    mouseX = (clientX / window.innerWidth) * 2 - 1;
    mouseY = -(clientY / window.innerHeight) * 2 + 1;
    targetX = mouseX * 0.01;
    targetY = mouseY * 0.01;
}

function updateCameraPosition() {
    if (window.camera && isMouseDown) {
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(window.camera.position);
        spherical.theta += targetX;
        spherical.phi += targetY;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        window.camera.position.setFromSpherical(spherical);
        window.camera.lookAt(0, 0, 0);
    }
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'Space':
            event.preventDefault();
            window.toggleAnimation();
            break;
        case 'KeyC':
            window.changeColors();
            break;
        case 'KeyR':
            window.resetCamera();
            break;
    }
});