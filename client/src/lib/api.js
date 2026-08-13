import cvData from '../data/cv-data.json'

export async function getCVData(lang) {
  return cvData[lang]
}
