<script lang="ts">
	/**
	 * LumiMascot
	 *
	 * A friendly glowing orb character representing Lumi.
	 * Features a soft coral gradient, simple face, and gentle floating animation.
	 */

	interface Props {
		size?: number
	}

	let { size = 64 }: Props = $props()
</script>

<div class="mascot-wrapper" style="--size: {size}px">
	<svg
		width={size}
		height={size}
		viewBox="0 0 64 64"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="mascot"
	>
		<defs>
			<radialGradient id="orbGradient" cx="30%" cy="30%" r="70%">
				<stop offset="0%" stop-color="#FFD4C4" />
				<stop offset="50%" stop-color="#F59E8C" />
				<stop offset="100%" stop-color="#E8857A" />
			</radialGradient>
		</defs>

		<!-- Main orb body -->
		<circle cx="32" cy="32" r="28" fill="url(#orbGradient)" />

		<!-- Left eye -->
		<circle cx="24" cy="28" r="3" fill="#4A4A4A" />

		<!-- Right eye -->
		<circle cx="40" cy="28" r="3" fill="#4A4A4A" />

		<!-- Eye highlights -->
		<circle cx="25" cy="27" r="1" fill="white" />
		<circle cx="41" cy="27" r="1" fill="white" />

		<!-- Smile -->
		<path
			d="M24 38 Q32 44 40 38"
			stroke="#4A4A4A"
			stroke-width="2.5"
			stroke-linecap="round"
			fill="none"
		/>

		<!-- Cheek blush (left) -->
		<ellipse cx="18" cy="35" rx="4" ry="2.5" fill="#FFCDB2" opacity="0.6" />

		<!-- Cheek blush (right) -->
		<ellipse cx="46" cy="35" rx="4" ry="2.5" fill="#FFCDB2" opacity="0.6" />
	</svg>
</div>

<style>
	.mascot-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--size);
		height: var(--size);
		filter: drop-shadow(0 0 12px rgba(245, 158, 140, 0.5));
		animation: float 4s ease-in-out infinite;
	}

	.mascot {
		width: 100%;
		height: 100%;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}
</style>
