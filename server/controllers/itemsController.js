import { prisma } from '../lib/prisma.js'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 24

// trigger meaning per item_template.spelltrigger_N: 0=Use, 1=Equip (passive),
// 2=Chance on Hit, 4=Soulstone. Other trigger values are left unhandled rather
// than guessed at.
const SPELL_TRIGGER_LABELS = { 0: 'Use', 1: 'Equip', 2: 'Chance on Hit', 4: 'Soulstone' }
const MAX_DROP_SOURCES = 5

// Best-effort $-token substitution for spell description/auraDescription text.
// Only $s1/$s2/$s3 (effect base points) are resolved; everything else ($d,
// $x1, cross-spell refs, etc.) is left alone. If unresolved tokens remain
// after substitution, the caller falls back to the spell's plain name rather
// than showing a garbled string.
function resolveSpellText(spell, rawText) {
  if (!rawText) return null

  const substituted = rawText.replace(/\$s([123])/g, (_match, slot) => {
    const basePoints = spell[`effectBasePoints${slot}`] ?? 0
    return String(basePoints + 1)
  })

  if (substituted.includes('$')) {
    return spell.name || null
  }

  return substituted
}

async function buildSpellEffects(item) {
  const effects = []

  for (let slot = 1; slot <= 5; slot++) {
    const spellId = item[`spellid_${slot}`]
    const trigger = item[`spelltrigger_${slot}`]
    if (!spellId) continue

    const label = SPELL_TRIGGER_LABELS[trigger]
    if (!label) continue

    const spell = await prisma.spell_template.findFirst({
      where: { entry: spellId },
      orderBy: { build: 'desc' },
    })
    if (!spell) continue

    const rawText =
      trigger === 1 && spell.auraDescription?.trim() ? spell.auraDescription : spell.description

    let text = resolveSpellText(spell, rawText)
    if (!text) continue

    // spellppmrate is 0 when the spell's own procChance is a flat percentage
    // instead of a proc-per-minute rate — surface that as a small annotation.
    if (trigger === 2 && item[`spellppmrate_${slot}`] === 0 && spell.procChance > 0) {
      text += ` (Proc chance: ${spell.procChance}%)`
    }

    effects.push({ trigger, label, text })
  }

  return effects
}

async function buildDroppedBy(entry) {
  // A negative ChanceOrQuestChance marks a quest-conditional drop, not a real
  // percentage (mangos-family loot convention) — excluded rather than shown
  // as a nonsensical negative drop chance.
  const lootRows = await prisma.creature_loot_template.findMany({
    where: { item: entry, ChanceOrQuestChance: { gt: 0 } },
    orderBy: { ChanceOrQuestChance: 'desc' },
  })
  if (lootRows.length === 0) return []

  const seenCreatures = new Set()
  const topRows = []
  for (const row of lootRows) {
    if (seenCreatures.has(row.entry)) continue
    seenCreatures.add(row.entry)
    topRows.push(row)
    if (topRows.length >= MAX_DROP_SOURCES) break
  }

  const creatures = await Promise.all(
    topRows.map((row) =>
      prisma.creature_template.findFirst({
        where: { entry: row.entry },
        orderBy: { patch: 'desc' },
        select: { name: true },
      }),
    ),
  )

  return topRows
    .map((row, index) => ({ creature: creatures[index]?.name, chance: row.ChanceOrQuestChance }))
    .filter((source) => Boolean(source.creature))
}

function parseOptionalInt(raw) {
  if (raw === undefined || raw === '') return undefined
  const parsed = parseInt(raw, 10)
  return isNaN(parsed) ? null : parsed
}

export async function getItems(req, res) {
  const rawPage = parseOptionalInt(req.query.page)
  const rawLimit = parseOptionalInt(req.query.limit)

  if (rawPage === null || rawLimit === null) {
    return res.status(400).json({ message: 'Invalid pagination parameters' })
  }

  const page = rawPage ?? 1
  const limit = rawLimit ?? DEFAULT_LIMIT

  if (page < 1 || limit < 1) {
    return res.status(400).json({ message: 'Invalid pagination parameters' })
  }

  const cappedLimit = Math.min(limit, MAX_LIMIT)

  // GM/dev test items clutter results and aren't real game data — always excluded.
  const where = { NOT: { name: { contains: 'Test' } } }

  if (typeof req.query.name === 'string' && req.query.name.trim() !== '') {
    where.name = { contains: req.query.name.trim() }
  }

  const quality = parseOptionalInt(req.query.quality)
  const itemClass = parseOptionalInt(req.query.itemClass)
  const subclass = parseOptionalInt(req.query.subclass)
  const inventoryType = parseOptionalInt(req.query.inventoryType)
  const requiredLevelMin = parseOptionalInt(req.query.requiredLevelMin)
  const requiredLevelMax = parseOptionalInt(req.query.requiredLevelMax)

  if (
    [quality, itemClass, subclass, inventoryType, requiredLevelMin, requiredLevelMax].some(
      (value) => value === null,
    )
  ) {
    return res.status(400).json({ message: 'Invalid filter parameters' })
  }

  if (quality !== undefined) where.quality = quality
  if (itemClass !== undefined) where.class = itemClass
  if (subclass !== undefined) where.subclass = subclass
  if (inventoryType !== undefined) where.inventory_type = inventoryType

  if (requiredLevelMin !== undefined || requiredLevelMax !== undefined) {
    where.required_level = {}
    if (requiredLevelMin !== undefined) where.required_level.gte = requiredLevelMin
    if (requiredLevelMax !== undefined) where.required_level.lte = requiredLevelMax
  }

  try {
    const [data, total] = await prisma.$transaction([
      prisma.item_template.findMany({
        where,
        select: {
          entry: true,
          patch: true,
          name: true,
          quality: true,
          class: true,
          subclass: true,
          inventory_type: true,
          item_level: true,
          required_level: true,
        },
        orderBy: [{ item_level: 'desc' }, { entry: 'asc' }],
        skip: (page - 1) * cappedLimit,
        take: cappedLimit,
      }),
      prisma.item_template.count({ where }),
    ])

    res.json({
      data,
      page,
      limit: cappedLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / cappedLimit)),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function getItemDetail(req, res) {
  const entry = parseInt(req.params.entry, 10)

  if (isNaN(entry) || entry <= 0) {
    return res.status(400).json({ message: 'Invalid item entry' })
  }

  try {
    const item = await prisma.item_template.findFirst({
      where: { entry },
      orderBy: { patch: 'desc' },
    })

    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    const [spellEffects, droppedBy] = await Promise.all([
      buildSpellEffects(item),
      buildDroppedBy(entry),
    ])

    res.json({ ...item, spellEffects, droppedBy })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}
