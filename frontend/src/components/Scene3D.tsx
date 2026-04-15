import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Scene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = window.innerWidth < 768

    // Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    camera.position.set(0, 0, 6)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // ─────────── STARFIELD ───────────
    const starCount = isMobile ? 1200 : 3000
    const starPos = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 180
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 180
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 180
      // Mostly white, some purple/cyan tints
      const rand = Math.random()
      if (rand < 0.15) {
        starColors[i * 3] = 0.68; starColors[i * 3 + 1] = 0.35; starColors[i * 3 + 2] = 0.97 // purple
      } else if (rand < 0.3) {
        starColors[i * 3] = 0.02; starColors[i * 3 + 1] = 0.71; starColors[i * 3 + 2] = 0.84 // cyan
      } else {
        starColors[i * 3] = 0.9; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 1
      }
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    const starMat = new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity: 0.75, sizeAttenuation: true })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // ─────────── ICOSAHEDRON (left) ───────────
    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1)
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.22 })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    ico.position.set(-5.5, 1.5, -4)
    scene.add(ico)

    // ─────────── TORUS KNOT (right) ───────────
    const torusGeo = new THREE.TorusKnotGeometry(1.4, 0.35, 120, 16)
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.18 })
    const torusKnot = new THREE.Mesh(torusGeo, torusMat)
    torusKnot.position.set(5.5, -1.5, -6)
    scene.add(torusKnot)

    // ─────────── OCTAHEDRON (top) ───────────
    const octaGeo = new THREE.OctahedronGeometry(1.8, 0)
    const octaMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.14 })
    const octa = new THREE.Mesh(octaGeo, octaMat)
    octa.position.set(1, 5, -10)
    scene.add(octa)

    // ─────────── SMALL GLOWING SPHERES ───────────
    const sphereData = [
      { pos: [-2.5, 2.5, -3], color: 0x8b5cf6, size: 0.12 },
      { pos: [3, 3, -5], color: 0x06b6d4, size: 0.09 },
      { pos: [-4, -2, -4], color: 0xa78bfa, size: 0.14 },
      { pos: [2.5, -3.5, -3], color: 0x7c3aed, size: 0.1 },
      { pos: [0, 3.5, -6], color: 0x06b6d4, size: 0.08 },
    ]
    const smallSpheres: THREE.Mesh[] = []
    sphereData.forEach(({ pos, color, size }) => {
      const g = new THREE.SphereGeometry(size, 8, 8)
      const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 })
      const mesh = new THREE.Mesh(g, m)
      mesh.position.set(pos[0], pos[1], pos[2])
      scene.add(mesh)
      smallSpheres.push(mesh)
    })

    // ─────────── GRID PLANE (bottom) ───────────
    const gridHelper = new THREE.GridHelper(30, 30, 0x4c1d95, 0x1e1b4b)
    gridHelper.position.set(0, -5, -5)
    gridHelper.material = new THREE.LineBasicMaterial({ color: 0x4c1d95, transparent: true, opacity: 0.25 })
    scene.add(gridHelper)

    // ─────────── ANIMATION ───────────
    const clock = new THREE.Clock()
    let animId: number

    function animate() {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      stars.rotation.y = t * 0.018
      stars.rotation.x = t * 0.009

      ico.rotation.x = t * 0.28
      ico.rotation.y = t * 0.38

      torusKnot.rotation.x = t * 0.18
      torusKnot.rotation.y = t * 0.12
      torusKnot.rotation.z = t * 0.08

      octa.rotation.x = t * 0.35
      octa.rotation.z = t * 0.22

      // Floating spheres
      smallSpheres.forEach((s, i) => {
        s.position.y = sphereData[i].pos[1] + Math.sin(t * 0.8 + i * 1.2) * 0.3
      })

      // Subtle camera drift
      camera.position.x = Math.sin(t * 0.08) * 0.4
      camera.position.y = Math.cos(t * 0.1) * 0.25
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    // ─────────── RESIZE ───────────
    const handleResize = () => {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      starGeo.dispose(); starMat.dispose()
      icoGeo.dispose(); icoMat.dispose()
      torusGeo.dispose(); torusMat.dispose()
      octaGeo.dispose(); octaMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
