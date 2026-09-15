# v259 shared card selection

Based on latest main bb659a18e4bd6a8db0cbac8af2859b7ab674dee3 (v258).

## Migrated entry points

| Entry | Adapter / recommendation source |
| --- | --- |
| Monster box, including filtered bulk selling | monsterPickerConfig / favorites and existing auto-use flags |
| Breeding parent A and B | recommendedParentPool and parentMatchNote; top three eligible candidates |
| Bag / item target | monsterPickerConfig; no pre-existing item recommendation algorithm |
| Dispatch team | chooseSmartDispatchTeam; task, minimum/max power strategy, breeding reservation and locks preserved |
| Roguelike expedition front / middle / back | existing recommendScore, independently of display sort |
| Shipped v194 fallback expedition | existing recommendationScore |
| Automatic breeding strategy | existing option values and change handlers |
| Automatic dispatch mission / power strategy | existing option values and change handlers |
| Skill reroll target, including shiny slot | actual eligible skill pool; target retained by monster + slot |
| Skill catalogue category filter | Buff / Debuff / species and discovered-state facets |

Navigation tabs, map difficulty progression, and one-time gameplay action buttons (purchase, battle/event choices, training, reward claims) remain gameplay controls. They do not represent old sorting or monster-picker systems.

## Contract

picker.js and picker.css are production resources loaded before game.js. Adapters provide item IDs, artwork, eligibility, original ordering, recommendation sets and choose callbacks. UI state is in memory only. No localStorage key or save schema changes.

All card lists have Search / Sort / Filter, clear, recommendation toggle, result count, multi-facet filtering and 48-item incremental rendering. Conditions within a facet are OR; different facets are AND. Sorting never changes the recommendation set. Lists with no gameplay recommendation rule explicitly disable that toggle instead of inventing advice.

Native hidden select elements remain only as value bridges for original gameplay handlers (parent IDs, bag target and automatic settings / skill rerolls). Old text-based sorting/filter controls and their handlers were removed. Skill catalogue preserves undiscovered information hiding.

Popup card lists support close, Escape, focus return and Tab cycling; narrow screens use a single column and controls at least 44px high. Search composition is respected. Filtering does not clear selections. Bag filters never change the item target. Dispatch periodic rendering preserves the focused search and open panels.

## Checks

- npm test: sprite atlas and saved-game compatibility.
- npm run test:pickers: isolated DOM boot of real game sources, 60-monster pagination, OR/AND, filtered bulk selection, recommendation stability, popup lifetime, dispatch refresh/focus, bag target isolation, reroll persistence, skill categories, unique three-member expedition.
- art/picker-review.html embeds the actual game at 390px for visual narrow-layout checks; it uses this browser's normal game save, like opening the game in another tab.
