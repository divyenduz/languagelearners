import { LanguageMap } from './LanguageMap'

describe('language map', () => {
  it('should map languages to their info', () => {
    const languageMap = new LanguageMap()
    expect(languageMap.getLanguageInfo('en')).toMatchSnapshot()
    expect(languageMap.getName('en')).toMatchSnapshot()
    expect(languageMap.getCode('en')).toMatchSnapshot()
    expect(languageMap.getVoice('en')).toMatchSnapshot()
    expect(languageMap.getCode('de')).toMatchSnapshot()
    expect(languageMap.getVoice('de')).toMatchSnapshot()
  })
})
