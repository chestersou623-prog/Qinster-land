# Relic icons v230

The previous relic-icons.webp has no image header. relic-icons-v229.webp is truncated (1746 bytes vs RIFF length 28734) and declares 64×64, while CSS assumes a 448×256 sheet. Both fail Pillow decoding.

Production now loads assets/relics/<stable relic ID>.png using img, with explicit dimensions and no sprite positioning. All 28 IDs have a 64×64 PNG; duplicate counts are merged before rendering. A separate select button prevents mobile detail taps from claiming a relic. Click outside / Escape closes details; Enter / Space toggles them. Desktop hover and narrow-screen fixed detail panels remain supported.

art/relic-review.html uses the production renderer and resources, covers all 28 icons, x2/x3 stacks, and an embedded 390px viewport. It never accesses game storage.

Artwork: built-in image generation; normalized sheet saved in art/source/relics-v230.webp. Prompt: a single original retro pixel RPG sheet, seven columns and four rows, centered silhouettes, no labels or frames; red fang, shell, boots, clover crystal, heart, amulet, glass sword, gate stone, pot, lantern, coin, star mirror, instructor medal, sandbag, incense burner, sacred page, thorn bracer, iron pendant, feather, bone die, horn, compass, ration pouch, fate weight, blood crown, wind dice, pact scroll, cracked glass heart. The generated RGBA sheet is 1659×948 (237px cells). Each cell was extracted and nearest-neighbor resized to 64px; alpha preserved. Both legacy WebP paths now contain a valid lossless 448×256 atlas but production does not depend on it.
