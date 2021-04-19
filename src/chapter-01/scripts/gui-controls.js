const canvas = document.getElementById('webgl-output')

const init = () => {
  let stats = initStats()

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  const renderer = new THREE.WebGLRenderer({
    canvas,
  })
  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true

  const planeGeometry = new THREE.PlaneGeometry(60, 20)
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa,
  })

  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  // Creating a cube
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.castShadow = true
  cube.position.x = -4
  cube.position.y = 4
  cube.position.z = 0
  scene.add(cube)

  // Creating a sphere
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff,
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.castShadow = true
  sphere.position.x = 20
  sphere.position.y = 6
  sphere.position.z = 2
  scene.add(sphere)

  // Position and point the camera to the center of the scene
  camera.position.x = -30
  camera.position.y = 12
  camera.position.z = 30
  camera.lookAt(scene.position)

  // Add spotlight for the shadows
  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(16, 40, 32)

  spotLight.castShadow = true

  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024

  spotLight.shadow.camera.near = 8
  spotLight.shadow.camera.far = 80
  spotLight.shadow.camera.fov = 16

  scene.add(spotLight)

  let step = 0

  // `controls` object that holds the properties we want to change using dat.GUI
  const controls = new (function () {
    this.rotationSpeed = 0.02
    this.bouncingSpeed = 0.03
  })()

  // Next, we pass the `controls` object into a new dat.GUI object and define the range for these two properties
  const gui = new dat.GUI()
  gui.add(controls, 'rotationSpeed', 0, 0.5)
  gui.add(controls, 'bouncingSpeed', 0, 0.5)

  const trackballControls = initTrackballControls(camera, renderer)
  const clock = new THREE.Clock()

  renderScene()

  function renderScene() {
    // Update the stats and the controls
    trackballControls.update(clock.getDelta())
    stats.update()

    // Rotate the cube around its axes
    cube.rotation.x += controls.rotationSpeed
    cube.rotation.y += controls.rotationSpeed
    cube.rotation.z += controls.rotationSpeed

    // Make the sphere bounce
    step += controls.bouncingSpeed
    sphere.position.y = 8 + 2 * Math.cos(step)

    // Render using requestAnimationFrame
    requestAnimationFrame(renderScene)
    renderer.render(scene, camera)
  }

  renderScene()
}

init()
