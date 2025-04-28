// Ensure Three.js is loaded
if (typeof THREE === 'undefined') {
    console.error("Three.js library not found. Make sure it's included before this script.");
} else {

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    // PerspectiveCamera(Field of View, Aspect Ratio, Near Clipping Plane, Far Clipping Plane)
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 3; // Move camera back so we can see the cube

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable antialiasing for smoother edges
    renderer.setSize( window.innerWidth, window.innerHeight ); // Set size to full window
    renderer.setPixelRatio(window.devicePixelRatio); // Adjust for high-dpi displays
    document.body.appendChild( renderer.domElement ); // Add the renderer's canvas element to the HTML body

    // 4. Texture Loading
    const textureLoader = new THREE.TextureLoader();
    const cubeTexture = textureLoader.load(
        'B.jpg', // Path to your image file
        () => {
             console.log('Texture B.jpg loaded successfully.');
             // Start animation loop ONLY after texture is loaded
             animate();
        },
        undefined, // onProgress callback not needed here
        (error) => {
            // onError callback
            console.error( 'An error occurred loading the texture B.jpg:', error );
            // Optionally, create a fallback cube or show an error message
             const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
             cube = new THREE.Mesh( geometry, fallbackMaterial );
             scene.add(cube);
             animate(); // Start animation even with fallback
        }
    );

    // 5. Geometry and Material
    // BoxGeometry(width, height, depth)
    const geometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5 ); // Create cube geometry (size 1.5x1.5x1.5)
    // MeshBasicMaterial doesn't react to lights, just shows the texture
    const material = new THREE.MeshBasicMaterial( { map: cubeTexture } );

    // 6. Create Mesh (The Cube)
    // A mesh takes geometry and applies a material to it
    let cube = new THREE.Mesh( geometry, material ); // Use 'let' because it might be reassigned in error callback
    scene.add( cube ); // Add the cube to the scene

    // 7. Animation Loop
    function animate() {
        // Request the browser to run this function again on the next frame
        requestAnimationFrame( animate );

        // Rotate the cube on its X and Y axes
        if (cube) { // Make sure cube exists before rotating
             cube.rotation.x += 0.005;
             cube.rotation.y += 0.007; // Slightly different speed for more visual interest
        }

        // Render the scene from the perspective of the camera
        renderer.render( scene, camera );
    }

    // 8. Handle Window Resizing
    function onWindowResize() {
        // Update camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix(); // Apply the changes

        // Update renderer size
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setPixelRatio(window.devicePixelRatio); // Update pixel ratio too
    }

    // Add event listener for window resize
    window.addEventListener( 'resize', onWindowResize, false );

    // Note: The initial call to animate() is now inside the textureLoader's success callback (or error callback)
    // This ensures we don't try to render/animate before the texture (or fallback) is ready.
}