#!/bin/bash

# Create directories for all 30 new card designs
designs=(
  "bauhaus-architect"
  "perfumer"
  "brutalist-gallerist"
  "master-woodworker"
  "cyber-hacker"
  "victorian-typographer"
  "metaverse-architect"
  "vinyl-producer-70s"
  "streetwear-tokyo"
  "sommelier-minimal"
  "aerospace-engineer"
  "fashion-avant-garde"
  "analog-photographer"
  "wealth-manager"
  "ai-artist-generative"
  "ceramic-master"
  "sound-architect"
  "textile-weaver"
  "stained-glass"
  "topographical-mapper"
  "paper-engineer"
  "cyanotype-botanist"
  "arcade-developer"
  "celestial-navigator"
  "kinetic-sculptor"
  "optician"
  "thermal-imager"
  "cinema-ticket"
  "cryptographer"
  "neon-sculptor"
)

for design in "${designs[@]}"; do
  mkdir -p "src/components/businesscard/designs/$design"
  echo "Created directory for $design"
done

echo "All directories created successfully!"
