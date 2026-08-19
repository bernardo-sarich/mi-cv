import EN_WORDS from 'naughty-words/en.json'
import ES_WORDS from 'naughty-words/es.json'

// Filtro de UX para insultos/lenguaje ofensivo en el formulario de contacto.
// No es una medida de seguridad: alguien puede saltear el frontend y pegarle
// directo a la API. Solo evita que el formulario deje pasar mensajes abusivos
// en el uso normal del sitio.
//
// Diccionario base: naughty-words (en.json/es.json), un fork mantenido de la
// lista LDNOOBW (https://github.com/LDNOOBW). El es.json de esa lista está
// enfocado en español de España y no cubre insultos rioplatenses comunes, así
// que se suman a mano en EXTRA_WORDS.
const EXTRA_WORDS = [
  'boludo',
  'boluda',
  'boludos',
  'boludas',
  'pelotudo',
  'pelotuda',
  'pelotudos',
  'pelotudas',
  'conchetumadre',
  'hijueputa',
  'malparido',
  'malparida',
  'subnormal',
  'retrasado',
  'retrasada',
  'zorra',
  'perra',
]

// Raíces de insultos que se suelen evadir pegándoles un sufijo (p. ej.
// "niggerman"). Un match exacto de palabra completa no las detecta ahí, así
// que estas además se matchean como prefijo. Solo entran acá palabras sin
// colisión razonable con palabras legítimas en español/inglés: quedan afuera
// cosas como "paki" (prefijo de "Pakistan") o "spic" (prefijo de "spice").
const SLUR_ROOTS = [
  'nigger',
  'kike',
  'faggot',
  'wetback',
  'beaner',
  'bulldyke',
  'coon',
  'tranny',
  'rape',
  'rapist',
]

function escapeForPattern(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
}

const ALL_WORDS = [...new Set([...EN_WORDS, ...ES_WORDS, ...EXTRA_WORDS])]

const EXACT_PATTERN = new RegExp(`\\b(${ALL_WORDS.map(escapeForPattern).join('|')})\\b`, 'i')

const PREFIX_PATTERN = new RegExp(`\\b(${SLUR_ROOTS.map(escapeForPattern).join('|')})\\w*`, 'i')

export function containsOffensiveContent(text) {
  const normalized = text.normalize('NFC')
  return EXACT_PATTERN.test(normalized) || PREFIX_PATTERN.test(normalized)
}
