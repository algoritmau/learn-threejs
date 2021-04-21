const canvas = document.getElementById('webgl-output')

const init = () => {
  let stats = initStats()

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene()

  // Add fog to the scene
  // scene.fog = new THREE.Fog(0xf2f2f2, 0.015, 100)
  scene.fog = new THREE.FogExp2(0xffffff, 0.01)

  // create a camera, which defines where we're looking at.
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    512,
  )

  // create a render and set the size
  const renderer = new THREE.WebGLRenderer()

  renderer.setClearColor(new THREE.Color(0x080808))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true

  // create the ground plane
  const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xfefefe,
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.receiveShadow = true

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = 0
  plane.position.z = 0

  // add the plane to the scene
  scene.add(plane)

  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 60)
  camera.lookAt(scene.position)

  // add subtle ambient lighting
  const ambientLight = new THREE.AmbientLight(0x3c3c3c)
  scene.add(ambientLight)

  // add spotlight for the shadows
  const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120)
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = true
  scene.add(spotLight)

  // add the output of the renderer to the html element
  canvas.appendChild(renderer.domElement)

  // call the render function
  const step = 0

  const controls = new (function () {
    this.rotationSpeed = 0.02
    this.numberOfObjects = scene.children.length

    this.removeCube = function () {
      const allChildren = scene.children
      const lastObject = allChildren[allChildren.length - 1]

      if (lastObject instanceof THREE.Mesh) {
        scene.remove(lastObject)
        this.numberOfObjects = scene.children.length
      }
    }

    this.addCube = function () {
      const cubeSize = Math.ceil(Math.random() * 3)
      const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
      const cubeMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff,
      })
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.castShadow = true
      cube.name = `cube-${scene.children.length}`

      // position the cube randomly in the scene
      cube.position.x =
        -30 + Math.round(Math.random() * planeGeometry.parameters.width)
      cube.position.y = Math.round(Math.random() * 5)
      cube.position.z =
        -20 + Math.round(Math.random() * planeGeometry.parameters.height)

      // add the cube to the scene
      scene.add(cube)

      // Update the number of objects to show in GUI
      this.numberOfObjects = scene.children.length
    }

    this.outputObjects = function () {
      console.log(scene.children)
    }
  })()

  const gui = new dat.GUI()
  gui.add(controls, 'rotationSpeed', 0, 0.5)
  gui.add(controls, 'addCube')
  gui.add(controls, 'removeCube')
  gui.add(controls, 'outputObjects')
  gui.add(controls, 'numberOfObjects').listen()

  // attach them here, since appendChild needs to be called first
  const trackballControls = initTrackballControls(camera, renderer)
  const clock = new THREE.Clock()

  render()

  function render() {
    trackballControls.update(clock.getDelta())
    stats.update()

    // rotate the cubes around its axes
    scene.traverse((e) => {
      if (e instanceof THREE.Mesh && e != plane) {
        e.rotation.x += controls.rotationSpeed
        e.rotation.y += controls.rotationSpeed
        e.rotation.z += controls.rotationSpeed
      }
    })

    // render using requestAnimationFrame
    requestAnimationFrame(render)
    renderer.render(scene, camera)
  }
}

init()
