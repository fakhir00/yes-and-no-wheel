/**
 * Dice Physics using Three.js and Cannon.js
 */

const DICE_SIZE = 2; // Size of the cube

class DicePhysics {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        // Settings
        this.probability = 0.5; // 0.0 to 1.0
        this.isRolling = false;
        
        this.initThree();
        this.initCannon();
        this.createDice();
        this.createEnvironment();
        
        this.animate();
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    initThree() {
        this.scene = new THREE.Scene();
        // Transparent background so it blends with our CSS
        this.scene.background = null; 
        
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
        this.camera.position.set(0, 15, 20);
        this.camera.lookAt(0, 0, 0);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add(dirLight);
    }
    
    initCannon() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -40, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 20;
        
        // Materials
        this.floorMat = new CANNON.Material();
        this.diceMat = new CANNON.Material();
        
        const contactMaterial = new CANNON.ContactMaterial(this.floorMat, this.diceMat, {
            friction: 0.2,
            restitution: 0.6 // Bouncy
        });
        this.world.addContactMaterial(contactMaterial);
    }
    
    createTextDisplay(text, colorHex, bgColorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // bg
        ctx.fillStyle = bgColorHex;
        ctx.fillRect(0, 0, 512, 512);
        
        // border string
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 20;
        ctx.strokeRect(10, 10, 492, 492);
        
        // text
        ctx.fillStyle = colorHex;
        ctx.font = 'bold 160px "Outfit", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 256);
        
        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.1 });
    }
    
    updateDiceFaces(probYes) {
        // We have 6 faces.
        // probYes is between 0.0 and 1.0
        // How many 'Yes' faces?
        let numYes = Math.round(probYes * 6);
        let numNo = 6 - numYes;
        
        const matYes = this.createTextDisplay('YES', '#ffffff', '#10b981'); // Green
        const matNo = this.createTextDisplay('NO', '#ffffff', '#ef4444');  // Red
        
        this.materials = [];
        this.faceAssignments = []; // to track what face index maps to what result
        
        for (let i = 0; i < 6; i++) {
            if (i < numYes) {
                this.materials.push(matYes);
                this.faceAssignments.push('YES');
            } else {
                this.materials.push(matNo);
                this.faceAssignments.push('NO');
            }
        }
        
        // Shuffle the materials so it looks random on the dice
        for (let i = this.materials.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.materials[i], this.materials[j]] = [this.materials[j], this.materials[i]];
            [this.faceAssignments[i], this.faceAssignments[j]] = [this.faceAssignments[j], this.faceAssignments[i]];
        }
        
        if (this.diceMesh) {
            this.diceMesh.material = this.materials;
        }
    }

    createDice() {
        // THREE
        // Soft edges box geometry
        const geometry = new THREE.BoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE);
        
        this.updateDiceFaces(0.5); // Default 50%
        
        this.diceMesh = new THREE.Mesh(geometry, this.materials);
        this.diceMesh.castShadow = true;
        this.diceMesh.receiveShadow = true;
        this.scene.add(this.diceMesh);
        
        // CANNON
        const shape = new CANNON.Box(new CANNON.Vec3(DICE_SIZE/2, DICE_SIZE/2, DICE_SIZE/2));
        this.diceBody = new CANNON.Body({
            mass: 1,
            material: this.diceMat,
            shape: shape
        });
        
        // Start above screen
        this.diceBody.position.set(0, 15, 0);
        this.world.addBody(this.diceBody);
        
        // Initial sync
        this.diceMesh.position.copy(this.diceBody.position);
        this.diceMesh.quaternion.copy(this.diceBody.quaternion);
    }
    
    createEnvironment() {
        // Invisible floor for physics
        const planeShape = new CANNON.Plane();
        const planeBody = new CANNON.Body({ mass: 0, material: this.floorMat });
        planeBody.addShape(planeShape);
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(planeBody);
        
        // Visual floor to receive shadows (invisible otherwise)
        const planeGeom = new THREE.PlaneGeometry(100, 100);
        const planeMat = new THREE.ShadowMaterial({ opacity: 0.3 });
        const planeMesh = new THREE.Mesh(planeGeom, planeMat);
        planeMesh.rotation.x = -Math.PI / 2;
        planeMesh.position.y = 0;
        planeMesh.receiveShadow = true;
        this.scene.add(planeMesh);
        
        // Walls to keep dice in view
        const wMat = new CANNON.Material();
        const wallThickness = 1;
        const w1 = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(10, 10, wallThickness)) });
        w1.position.set(0, 5, -8);
        this.world.addBody(w1);
        
        const w2 = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(10, 10, wallThickness)) });
        w2.position.set(0, 5, 8);
        this.world.addBody(w2);
        
        const w3 = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(wallThickness, 10, 10)) });
        w3.position.set(-8, 5, 0);
        this.world.addBody(w3);
        
        const w4 = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(wallThickness, 10, 10)) });
        w4.position.set(8, 5, 0);
        this.world.addBody(w4);
    }
    
    roll(probabilityYes, callback) {
        if (this.isRolling) return;
        this.isRolling = true;
        
        // Update texture based on probability slider
        this.updateDiceFaces(probabilityYes);
        
        // Reset position to throw
        this.diceBody.position.set(
            (Math.random() - 0.5) * 4,
            12 + Math.random() * 5, 
            (Math.random() - 0.5) * 4
        );
        this.diceBody.velocity.set(
            (Math.random() - 0.5) * 10, 
            -10, 
            (Math.random() - 0.5) * 10
        );
        
        // Random spin
        const spinSpeed = 20;
        this.diceBody.angularVelocity.set(
            Math.random() * spinSpeed,
            Math.random() * spinSpeed,
            Math.random() * spinSpeed
        );

        this.diceBody.quaternion.setFromEuler(
            Math.random() * Math.PI, 
            Math.random() * Math.PI, 
            Math.random() * Math.PI
        );
        
        this.rollCallback = callback;
    }
    
    getTopFace() {
        // The cube normals in local space
        const normals = [
            new THREE.Vector3( 1,  0,  0), // Right
            new THREE.Vector3(-1,  0,  0), // Left
            new THREE.Vector3( 0,  1,  0), // Top
            new THREE.Vector3( 0, -1,  0), // Bottom
            new THREE.Vector3( 0,  0,  1), // Front
            new THREE.Vector3( 0,  0, -1)  // Back
        ];
        
        const diceQuaternion = this.diceMesh.quaternion;
        let maxDot = -Infinity;
        let winningIndex = 0;
        
        const upVector = new THREE.Vector3(0, 1, 0);
        
        normals.forEach((normal, index) => {
            const worldNormal = normal.clone().applyQuaternion(diceQuaternion);
            const dotProduct = worldNormal.dot(upVector);
            
            if (dotProduct > maxDot) {
                maxDot = dotProduct;
                winningIndex = index;
            }
        });
        
        // Match the materials assigning order.
        // Three.js BoxGeometry face material indices are:
        // 0: Right (x+), 1: Left (x-), 2: Top (y+), 3: Bottom (y-), 4: Front (z+), 5: Back (z-)
        return this.faceAssignments[winningIndex];
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.world.step(1 / 60);
        
        this.diceMesh.position.copy(this.diceBody.position);
        this.diceMesh.quaternion.copy(this.diceBody.quaternion);
        
        // Check if stopped
        if (this.isRolling) {
            const v = this.diceBody.velocity.lengthSquared();
            const w = this.diceBody.angularVelocity.lengthSquared();
            
            // Check if settled on floor
            if (v < 0.01 && w < 0.01 && this.diceBody.position.y < DICE_SIZE) {
                this.isRolling = false;
                const result = this.getTopFace();
                if (this.rollCallback) {
                    this.rollCallback(result);
                }
            }
        }
        
        // Slight rotation to the camera or lights for dynamic feel
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
}

// Global hook
window.DiceEngine = DicePhysics;
