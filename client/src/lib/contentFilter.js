import EN_WORDS from 'naughty-words/en.json'
import ES_WORDS from 'naughty-words/es.json'
import { cuss } from 'cuss'
import { profanities as ES_PROFANITIES } from 'profanities/es.js'

// Filtro de UX para insultos/lenguaje ofensivo en el formulario de contacto.
// No es una medida de seguridad: alguien puede saltear el frontend y pegarle
// directo a la API. Solo evita que el formulario deje pasar mensajes abusivos
// en el uso normal del sitio.
//
// Fuentes del diccionario:
// - naughty-words (en.json/es.json): fork mantenido de la lista LDNOOBW
//   (https://github.com/LDNOOBW). Su es.json está enfocado en español de
//   España y es corto (68 palabras).
// - cuss (https://github.com/words/cuss): ~1770 palabras en inglés, cada una
//   con un rating de confianza (0 = neutra/de contexto, ej. "hell", "gun",
//   "kill"; 1 = ambigua; 2 = profanidad/insulto claro). Solo se usa rating 2
//   — meter 0/1 bloquearía palabras de uso común sin connotación ofensiva.
// - profanities (https://github.com/words/profanities): ~650 palabras en
//   español, pero compilada de fuentes de slang regional y con muchas
//   entradas que también son palabras de uso corriente sin ninguna carga
//   ofensiva ("caliente", "coger", "leche", "compañero", "trío", "pájaro").
//   Esas se filtran a mano en ES_PROFANITY_EXCLUSIONS antes de sumarlas —
//   son casos ya confirmados con el diccionario real, no una suposición.
const EXTRA_WORDS = [
  'puto',
  'putos',
  'putas',
  'putito',
  'putita',
  'putitos',
  'putitas',
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
  'hijueputas',
  'malparido',
  'malparida',
  'malparidos',
  'malparidas',
  'subnormal',
  'retrasado',
  'retrasada',
  'zorra',
  'perra',
  // Términos de abuso/violencia sexual: no tienen un significado alternativo
  // benigno, así que se agregan directo sin pasar por el filtro de exclusión.
  'pedofilo',
  'pedófilo',
  'pederasta',
  'pederastia',
  'pederastía',
  'abusador',
  'abusadora',
  'pedophile',
  'pedophiles',
  'pedophilia',
  'paedophile',
  'paedophiles',
  'paedophilia',
  'pederast',
  'pederasty',
  'molester',
  'molesters',
]

// Palabras de "profanities/es.js" con un significado literal de uso corriente
// (comida, objetos, verbos comunes) que haría de más si se bloquean tal
// cual: "caliente" (temperatura), "coger" (agarrar, en España), "leche"
// (el lácteo), "compañero" (colega de trabajo), "trío" (grupo de tres),
// "pájaro"/"mariposa" (animales), etc. Confirmadas contra el diccionario
// real antes de excluirlas, no es una lista especulativa.
const ES_PROFANITY_EXCLUSIONS = new Set([
  'acabada', 'afilar', 'agarraderas', 'anda', 'andá', 'aniz', 'argolla',
  'asesinato', 'ayotes', 'bizcocho', 'bolas', 'bollito', 'bollo', 'bombin',
  'bombín', 'boniato', 'borraja', 'brizna', 'brocha', 'butifarra', 'cacha',
  'cachar', 'cachimba', 'cachivache', 'cajeta', 'calamidad', 'caliente',
  'callate', 'cállate', 'cantimplora', 'capullo', 'casquete', 'cebollino',
  'chancay', 'chancla', 'chaqueta', 'chiche', 'chichi', 'chocho', 'cipote',
  'clavar', 'coger', 'cogollo', 'cogote', 'cojido', 'cojieron', 'cojiste',
  'cola', 'colison', 'colisón', 'colon', 'colón', 'comadres', 'come',
  'comer', 'comer bistec', 'compañero', 'compañeros', 'conejo', 'conejos',
  'copa', 'copeton', 'copetón', 'coquimbanos', 'corneta', 'correa',
  'corrida', 'coso', 'cuates', 'cuaresmeño', 'cuca', 'cuchara', 'cuchillo',
  'curtir', 'desgraciarse', 'ensartar', 'estaca', 'estafiate', 'exprimir', 'filiberto',
  'forrar', 'forro', 'gañan', 'gañán', 'gandul', 'gomas', 'gustarle',
  'güebo', 'haciendo el amor', 'heroina', 'heroína', 'hueco', 'huevo',
  'huevon', 'huevos', 'huevón', 'impermeable', 'leche', 'leches',
  'longanizas', 'lolas', 'lumbreras', 'maleton', 'maletón', 'mamar',
  'mameluco', 'mamey', 'mamon', 'mamona', 'manchas', 'martillo',
  'mastuerzo', 'melon', 'melones', 'melón', 'mendrugo', 'merluzo', 'mico',
  'minga', 'mojar', 'montar', 'morfarse', 'nabo', 'no jodas', 'nojoda',
  'ojete', 'ovejo', 'paja', 'pajaro', 'pájaro', 'pájara', 'pajero', 'palo',
  'mariposa', 'pamplinas', 'panocha', 'papafrita', 'papallona', 'papaya', 'papayona',
  'paquete', 'pardillo', 'pargo', 'pata', 'pato', 'pechugas', 'pedazo',
  'pedo', 'pedorro', 'pepa', 'percebe', 'pico', 'pija', 'pijo', 'pinche',
  'pipe', 'pipian', 'pipián', 'pis', 'pisar', 'pistola', 'pito', 'plomo',
  'polla', 'pollas', 'polvazo', 'polvo', 'popa', 'poto', 'puchero',
  'quebracho', 'quebrachon', 'quebrachón', 'raja', 'reata', 'riata',
  'repisas', 'retazo', 'rifle', 'seno', 'senos', 'sexo', 'sobo', 'sonajas',
  'sopladores', 'tarugo', 'tocho', 'tonga', 'tordo', 'tortillera', 'traga',
  'trincar', 'trio', 'trío', 'trola', 'voltearse la rosca',
  'voltearse la tortilla', 'yegua', 'zangano', 'zángano',
])

// Mismo criterio para "cuss" (inglés): estas puntúan 2 (profanidad clara)
// pero tienen un uso de negocio/tecnología habitual — "slave"/"triplex" en
// terminología técnica o inmobiliaria, "welfare"/"quickie" en uso llano.
const EN_CUSS_EXCLUSIONS = new Set(['welfare', 'slave', 'triplex', 'quickie'])

const CUSS_EN_WORDS = Object.entries(cuss)
  .filter(([word, rating]) => rating === 2 && !EN_CUSS_EXCLUSIONS.has(word))
  .map(([word]) => word)

const ES_PROFANITY_WORDS = ES_PROFANITIES.filter(
  (word) => !ES_PROFANITY_EXCLUSIONS.has(word.toLowerCase()),
)

// Raíces de insultos que se suelen evadir pegándoles un sufijo o metiendo un
// diminutivo (p. ej. "niggerman", "violando"). Un match exacto de palabra
// completa no las detecta ahí, así que estas además se matchean como
// prefijo. Solo entran acá palabras sin colisión razonable con palabras
// legítimas en español/inglés: quedan afuera cosas como "paki" (prefijo de
// "Pakistan"), "spic" (prefijo de "spice") o una raíz corta como "put"
// (prefijo de "put", poner en inglés).
//
// "viola" cubre viola/violador/violan/violado/violando/violación/violaron —
// toda la familia del verbo "violar". Único falso positivo aceptado: "viola"
// como instrumento musical, un choque de baja probabilidad frente al valor
// de no dejar pasar acusaciones de violación evadidas con una conjugación.
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
  'viola',
]

function escapeForPattern(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
}

const ALL_WORDS = [
  ...new Set([...EN_WORDS, ...ES_WORDS, ...CUSS_EN_WORDS, ...ES_PROFANITY_WORDS, ...EXTRA_WORDS]),
]

// JS's \b solo reconoce [A-Za-z0-9_] como "carácter de palabra": una tilde o
// una ñ cuenta como borde, así que "compañero" se leería como dos palabras
// ("compa" + "ero") y "ero" (sí, está en el diccionario) matchearía. Se usa
// un límite manual con \p{L}/\p{N} (con flag "u") para que cualquier letra
// Unicode —incluidas las acentuadas— cuente como parte de la palabra.
const WORD_BOUNDARY_BEFORE = '(?<![\\p{L}\\p{N}_])'
const WORD_BOUNDARY_AFTER = '(?![\\p{L}\\p{N}_])'

const EXACT_PATTERN = new RegExp(
  `${WORD_BOUNDARY_BEFORE}(${ALL_WORDS.map(escapeForPattern).join('|')})${WORD_BOUNDARY_AFTER}`,
  'iu',
)

const PREFIX_PATTERN = new RegExp(
  `${WORD_BOUNDARY_BEFORE}(${SLUR_ROOTS.map(escapeForPattern).join('|')})[\\p{L}\\p{N}_]*`,
  'iu',
)

export function containsOffensiveContent(text) {
  const normalized = text.normalize('NFC')
  return EXACT_PATTERN.test(normalized) || PREFIX_PATTERN.test(normalized)
}
