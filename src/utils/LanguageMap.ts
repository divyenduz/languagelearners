// TODO: Make this be in sync with "TargetLanguage" from Prisma Client
export type LanguageCode = LanguageInfo['id']

// https://docs.aws.amazon.com/translate/latest/dg/what-is.html#language-pairs
// https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
// http://www.lingoes.net/en/translator/langcode.htm
type LanguageInfo =
  | LanguageInfoEnglish
  | LanguageInfoGerman
  | LanguageInfoSpanish
  | LanguageInfoDutch
  | LanguageInfoFrench
  | LanguageInfoHindi
  | LanguageInfoItalian
  // | LanguageInfoJapanese
  // | LanguageInfoKorean
  | LanguageInfoRussian
  | LanguageInfoSwedish
  | LanguageInfoPersian

interface LanguageInfoEnglish {
  id: 'en'
  name: 'English'
  code: 'en-US'
  voice: 'Kimberly'
}

interface LanguageInfoGerman {
  id: 'de'
  name: 'German'
  code: 'de-DE'
  voice: 'Vicki'
}

interface LanguageInfoSpanish {
  id: 'es'
  name: 'Spanish'
  code: 'es-ES'
  voice: 'Lucia'
}

interface LanguageInfoDutch {
  id: 'nl'
  name: 'Dutch'
  code: 'nl-NL'
  voice: 'Lotte'
}

interface LanguageInfoFrench {
  id: 'fr'
  name: 'French'
  code: 'fr-FR'
  voice: 'Léa'
}

interface LanguageInfoHindi {
  id: 'hi'
  name: 'Hindi'
  code: 'hi-IN'
  voice: 'Aditi'
}

interface LanguageInfoItalian {
  id: 'it'
  name: 'Italian'
  code: 'it-IT'
  voice: 'Bianca'
}
// interface LanguageInfoJapanese {
//   id: 'jp'
//   name: 'Japanese'
//   code: 'jp-JP'
//   voice: 'Mizuki'
// }
// interface LanguageInfoKorean {
//   id: 'kr'
//   name: 'Korean'
//   code: 'ko-KR'
//   voice: 'Seoyeon'
// }
interface LanguageInfoRussian {
  id: 'ru'
  name: 'Russian'
  code: 'ru-RU'
  voice: 'Tatyana'
}
interface LanguageInfoSwedish {
  id: 'se'
  name: 'Swedish'
  code: 'sv-SE'
  voice: 'Astrid'
}

interface LanguageInfoPersian {
  id: 'fa'
  name: 'Persian (Farsi)'
  code: 'fa-IR'
  voice: ''
}

type ILanguageMap = {
  [key in LanguageCode]: LanguageInfo
} & {
  en: LanguageInfoEnglish
  de: LanguageInfoGerman
  es: LanguageInfoSpanish
  nl: LanguageInfoDutch
  fr: LanguageInfoFrench
  hi: LanguageInfoHindi
  it: LanguageInfoItalian
  // jp: LanguageInfoJapanese
  // kr: LanguageInfoKorean
  ru: LanguageInfoRussian
  se: LanguageInfoSwedish
  fa: LanguageInfoPersian
}

export class LanguageMap {
  private _languageMap: ILanguageMap = {
    en: {
      id: 'en',
      name: 'English',
      code: 'en-US',
      voice: 'Kimberly',
    },
    de: {
      id: 'de',
      name: 'German',
      code: 'de-DE',
      voice: 'Vicki',
    },
    es: {
      id: 'es',
      name: 'Spanish',
      code: 'es-ES',
      voice: 'Lucia',
    },
    nl: {
      id: 'nl',
      name: 'Dutch',
      code: 'nl-NL',
      voice: 'Lotte',
    },
    fr: {
      id: 'fr',
      name: 'French',
      code: 'fr-FR',
      voice: 'Léa',
    },
    hi: {
      id: 'hi',
      name: 'Hindi',
      code: 'hi-IN',
      voice: 'Aditi',
    },
    it: {
      id: 'it',
      name: 'Italian',
      code: 'it-IT',
      voice: 'Bianca',
    },
    // jp: {
    //   id: 'jp',
    //   name: 'Japanese',
    //   code: 'jp-JP',
    //   voice: 'Mizuki',
    // },
    // kr: {
    //   id: 'kr',
    //   name: 'Korean',
    //   code: 'ko-KR',
    //   voice: 'Seoyeon',
    // },
    ru: {
      id: 'ru',
      name: 'Russian',
      code: 'ru-RU',
      voice: 'Tatyana',
    },
    se: {
      id: 'se',
      name: 'Swedish',
      code: 'sv-SE',
      voice: 'Astrid',
    },
    fa: {
      id: 'fa',
      name: 'Persian (Farsi)',
      code: 'fa-IR',
      voice: '',
    },
  }

  getAllLanguageCodes(): LanguageCode[] {
    return Object.keys(this._languageMap) as LanguageCode[]
  }

  getLanguageInfo(identifier: LanguageCode): LanguageInfo {
    return this._languageMap[identifier.toLowerCase()]
  }

  getName(identifier: LanguageCode): LanguageInfo['name'] {
    return this._languageMap[identifier.toLowerCase()].name
  }

  getCode(identifier: LanguageCode): LanguageInfo['code'] {
    return this._languageMap[identifier.toLowerCase()].code
  }

  getVoice(identifier: LanguageCode): LanguageInfo['voice'] {
    console.log(identifier.toLocaleLowerCase())
    console.log(this._languageMap[identifier.toLowerCase()])
    return this._languageMap[identifier.toLowerCase()].voice
  }
}
