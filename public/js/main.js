// Three.js Scene Setup
let scene, camera, renderer;
let shapes = [];
let animationEnabled = true;
let clock;

// Initialize the Three.js scene
function init() {
    // Hide loading screen
    document.getElementById('loading').style.display = 'none';

    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1e3c72, 10, 50);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 5, 8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    document.getElementById('container').appendChild(renderer.domElement);

    // Initialize clock
    clock = new THREE.Clock();

    // Setup lighting
    setupLighting();

    // Create 3D objects
    createObjects();

    // Setup controls
    setupControls();

    // Start animation loop
    animate();
}

function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point light
    const pointLight = new THREE.PointLight(0xff6b6b, 0.8, 50);
    pointLight.position.set(-10, 10, -10);
    scene.add(pointLight);

    // Store point light for animation
    window.pointLight = pointLight;
}

function createObjects() {
    // Materials
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0xff6b6b, shininess: 100 }),
        new THREE.MeshLambertMaterial({ color: 0x4ecdc4 }),
        new THREE.MeshPhongMaterial({ color: 0xffe66d, shininess: 30 }),
        new THREE.MeshPhongMaterial({ color: 0xa8e6cf, shininess: 80 })
    ];

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(cubeGeometry, materials[0]);
    cube.position.set(-4, 0, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    shapes.push(cube);

    // Sphere
    const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sphere = new THREE.Mesh(sphereGeometry, materials[1]);
    sphere.position.set(0, 0, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    shapes.push(sphere);

    // Torus
    const torusGeometry = new THREE.TorusGeometry(1.2, 0.4, 16, 100);
    const torus = new THREE.Mesh(torusGeometry, materials[2]);
    torus.position.set(4, 0, 0);
    torus.castShadow = true;
    torus.receiveShadow = true;
    scene.add(torus);
    shapes.push(torus);

    // Cylinder
    // const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
    // const cylinder = new THREE.Mesh(cylinderGeometry, materials[3]);
    // cylinder.position.set(0, 4, -3);
    // cylinder.castShadow = true;
    // cylinder.receiveShadow = true;
    // scene.add(cylinder);
    // shapes.push(cylinder);

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x2c3e50,
        transparent: true,
        opacity: 0.8
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -3;
    plane.receiveShadow = true;
    scene.add(plane);

    // Particles
    createParticles();
}

function createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 50;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (animationEnabled) {
        // Animate shapes
        const [cube, sphere, torus] = shapes;

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        sphere.rotation.y += 0.005;
        sphere.position.y = Math.sin(elapsedTime * 0.5) * 0.5;

        torus.rotation.x += 0.02;
        torus.rotation.y += 0.01;

        // cylinder.rotation.y += 0.015;
        // cylinder.position.y = 4 + Math.cos(elapsedTime * 0.3) * 0.3;

        // Animate point light
        if (window.pointLight) {
            window.pointLight.position.x = Math.cos(elapsedTime * 0.5) * 10;
            window.pointLight.position.z = Math.sin(elapsedTime * 0.5) * 10;
        }
    }

    renderer.render(scene, camera);
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Export functions for controls
window.toggleAnimation = function () {
    animationEnabled = !animationEnabled;
};

window.changeColors = function () {
    shapes.forEach(shape => {
        shape.material.color.setHex(Math.random() * 0xffffff);
    });
};

window.resetCamera = function () {
    camera.position.set(8, 5, 8);
    camera.lookAt(0, 0, 0);
};

// Initialize when page loads
window.addEventListener('load', init);
window.addEventListener('resize', onWindowResize);