import { useEffect, useRef } from 'react';

function ParallaxPage({ imageUrl, reducedMotion = false }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return undefined;

    let animationId;
    let disposed = false;

    const loadThree = async () => {
      const THREE = await import('three');
      if (disposed || !canvasRef.current || !containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = 240;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const loader = new THREE.TextureLoader();
      loader.load(imageUrl, (texture) => {
        const aspect = texture.image.width / texture.image.height;
        const planeHeight = 2.2;
        const planeWidth = planeHeight * aspect;

        const layers = [
          { z: -0.8, opacity: 0.35, scale: 1.08 },
          { z: 0, opacity: 1, scale: 1 },
          { z: 0.4, opacity: 0.5, scale: 1.04 },
        ];

        layers.forEach((layer) => {
          const geo = new THREE.PlaneGeometry(planeWidth * layer.scale, planeHeight * layer.scale);
          const mat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: layer.opacity,
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.z = layer.z;
          scene.add(mesh);
        });

        let t = 0;
        const animate = () => {
          if (disposed) return;
          t += 0.008;
          if (!reducedMotion) {
            camera.position.x = Math.sin(t) * 0.15;
            camera.position.y = Math.cos(t * 0.7) * 0.05;
            camera.lookAt(0, 0, 0);
          }
          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        };
        animate();
      });
    };

    loadThree();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
    };
  }, [imageUrl, reducedMotion]);

  if (!imageUrl) {
    return (
      <div className="baby-book-parallax-canvas baby-book-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
        <span style={{ color: 'var(--book-twilight-text-muted)', fontSize: '0.85rem' }}>Add album photos for parallax</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="baby-book-parallax-canvas">
      <canvas ref={canvasRef} aria-label="Parallax photo preview" />
    </div>
  );
}

export default ParallaxPage;
