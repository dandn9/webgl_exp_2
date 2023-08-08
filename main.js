import * as THREE from 'https://cdn.skypack.dev/three@0.136'

class Main {
	constructor() {}

	async initialize() {
		this.threejs_ = new THREE.WebGLRenderer()
		document.body.appendChild(this.threejs_.domElement)

		window.addEventListener(
			'resize',
			() => {
				this.onWindowResize_()
			},
			false
		)

		this.scene_ = new THREE.Scene()

		this.camera_ = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000)
		this.camera_.position.set(0, 0, 1)

		await this.setupProject_()

		this.onWindowResize_()
		this.raf_()
	}

	async setupProject_() {
		const vsh = await fetch('./shaders/vertex-shader.glsl')
		const fsh = await fetch('./shaders/fragment-shader.glsl')

		const loader = new THREE.TextureLoader()
		const cat = loader.load('./textures/cat.jpg')

		cat.wrapS = THREE.MirroredRepeatWrapping
		cat.wrapT = THREE.MirroredRepeatWrapping
		cat.magFilter = THREE.NearestFilter

		const material = new THREE.ShaderMaterial({
			uniforms:{

				resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)}

			},
			vertexShader: await vsh.text(),
			fragmentShader: await fsh.text(),
		})
		this.material_ = material;

		const colors = [
			new THREE.Color(0xff0000),
			new THREE.Color(0x222222),
			new THREE.Color(0x00bb22),
			new THREE.Color(0x00bbaa),
		]

		const colorFloats = colors.map((c) => c.toArray()).flat()

		const geometry = new THREE.PlaneGeometry(1, 1)
		geometry.setAttribute(
			'dandnColor',
			new THREE.Float32BufferAttribute(colorFloats, 3)
		)

		const plane = new THREE.Mesh(geometry, material)
		plane.position.set(0.5, 0.5, 0)
		console.log('LOG', material, geometry, plane, this.camera_, THREE)
		this.scene_.add(plane)
	}

	onWindowResize_() {
		this.threejs_.setSize(window.innerWidth, window.innerHeight)
		this.material_.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
	}

	raf_() {
		requestAnimationFrame((t) => {
			this.threejs_.render(this.scene_, this.camera_)
			this.raf_()
		})
	}
}

let APP_ = null

window.addEventListener('DOMContentLoaded', async () => {
	APP_ = new Main()
	await APP_.initialize()
})
