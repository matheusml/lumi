import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { join } from 'path'

const STATIC_DIR = join(import.meta.dirname, '..', 'static')

// Lumi icon with full orange background (no transparent areas)
// This prevents iOS from adding a black background
const createIconSvg = (size) => {
	const scale = size / 512
	const faceScale = 0.9 // Face takes up 90% of the icon
	const cx = size / 2
	const cy = size / 2

	// Scale factors for facial features relative to face size
	const eyeRadius = 18 * scale * faceScale
	const eyeY = cy - 20 * scale * faceScale
	const eyeOffsetX = 50 * scale * faceScale
	const cheekRx = 30 * scale * faceScale
	const cheekRy = 20 * scale * faceScale
	const cheekY = cy + 30 * scale * faceScale
	const cheekOffsetX = 90 * scale * faceScale
	const smileY = cy + 50 * scale * faceScale
	const smileWidth = 50 * scale * faceScale
	const smileDepth = 25 * scale * faceScale
	const strokeWidth = 15 * scale * faceScale

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <!-- Full orange background -->
  <rect width="${size}" height="${size}" fill="#F59E8C"/>

  <!-- Left cheek -->
  <ellipse cx="${cx - cheekOffsetX}" cy="${cheekY}" rx="${cheekRx}" ry="${cheekRy}" fill="#FFCDB2" opacity="0.7"/>

  <!-- Right cheek -->
  <ellipse cx="${cx + cheekOffsetX}" cy="${cheekY}" rx="${cheekRx}" ry="${cheekRy}" fill="#FFCDB2" opacity="0.7"/>

  <!-- Left eye -->
  <circle cx="${cx - eyeOffsetX}" cy="${eyeY}" r="${eyeRadius}" fill="#4A4A4A"/>

  <!-- Right eye -->
  <circle cx="${cx + eyeOffsetX}" cy="${eyeY}" r="${eyeRadius}" fill="#4A4A4A"/>

  <!-- Smile -->
  <path d="M ${cx - smileWidth} ${smileY} Q ${cx} ${smileY + smileDepth} ${cx + smileWidth} ${smileY}" stroke="#4A4A4A" stroke-width="${strokeWidth}" stroke-linecap="round" fill="none"/>
</svg>`
}

// Favicon SVG (circular face for browser tabs - these don't have the black border issue)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Main face circle -->
  <circle cx="32" cy="32" r="30" fill="#F59E8C"/>

  <!-- Left cheek -->
  <ellipse cx="14" cy="38" rx="6" ry="4" fill="#FFCDB2" opacity="0.7"/>

  <!-- Right cheek -->
  <ellipse cx="50" cy="38" rx="6" ry="4" fill="#FFCDB2" opacity="0.7"/>

  <!-- Left eye -->
  <circle cx="22" cy="28" r="3.5" fill="#4A4A4A"/>

  <!-- Right eye -->
  <circle cx="42" cy="28" r="3.5" fill="#4A4A4A"/>

  <!-- Smile -->
  <path d="M 22 40 Q 32 50 42 40" stroke="#4A4A4A" stroke-width="3" stroke-linecap="round" fill="none"/>
</svg>`

async function generateIcons() {
	console.log('Generating PWA icons...')

	// Generate app icons with full orange background
	const sizes = [
		{ name: 'icon-192.png', size: 192 },
		{ name: 'icon-512.png', size: 512 },
		{ name: 'icon-maskable-512.png', size: 512 },
		{ name: 'apple-touch-icon.png', size: 180 }
	]

	for (const { name, size } of sizes) {
		const svg = createIconSvg(size)
		const outputPath = join(STATIC_DIR, name)

		await sharp(Buffer.from(svg)).png().toFile(outputPath)

		console.log(`Generated ${name} (${size}x${size})`)
	}

	// Write the favicon SVG (circular version for browser tabs)
	writeFileSync(join(STATIC_DIR, 'favicon.svg'), faviconSvg)
	console.log('Generated favicon.svg')

	console.log('Done!')
}

generateIcons().catch(console.error)
