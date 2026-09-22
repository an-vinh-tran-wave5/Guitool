import type { LanguageCode } from './languages'

/**
 * i18n, scoped deliberately: this translates the app's global chrome (nav
 * labels, the sidebar title/tagline, the theme/language controls) — not
 * exercise instructions, song data, or other feature content, which stays
 * English for now. Widening this to full-app translation is real future
 * work, not a small follow-up; see the README's "Dark mode & language"
 * section.
 *
 * Translations below are AI-assisted, not reviewed by a native speaker of
 * each language — treat them as a solid starting point, not a final
 * localization pass.
 */
export type TranslationKey =
  | 'nav.home'
  | 'nav.level'
  | 'nav.practice'
  | 'nav.tuner'
  | 'nav.metronome'
  | 'nav.progress'
  | 'nav.library'
  | 'nav.songs'
  | 'nav.tabs'
  | 'nav.chords'
  | 'nav.ampTones'
  | 'nav.more'
  | 'nav.soon'
  | 'app.title'
  | 'app.tagline'
  | 'app.savedNotice'
  | 'theme.toLight'
  | 'theme.toDark'
  | 'language.label'

type Dictionary = Record<TranslationKey, string>

const en: Dictionary = {
  'nav.home': 'Home',
  'nav.level': 'Level',
  'nav.practice': 'Practice',
  'nav.tuner': 'Tuner',
  'nav.metronome': 'Metronome',
  'nav.progress': 'Progress',
  'nav.library': 'Library',
  'nav.songs': 'Songs',
  'nav.tabs': 'Tabs',
  'nav.chords': 'Chords',
  'nav.ampTones': 'Amp & Tone',
  'nav.more': 'More',
  'nav.soon': 'Soon',
  'app.title': 'GUITOOL',
  'app.tagline': 'Practice companion',
  'app.savedNotice': 'Everything is saved on this device.',
  'theme.toLight': 'Switch to light mode',
  'theme.toDark': 'Switch to dark mode',
  'language.label': 'Choose language',
}

const vi: Dictionary = {
  'nav.home': 'Trang chủ',
  'nav.level': 'Trình độ',
  'nav.practice': 'Luyện tập',
  'nav.tuner': 'Lên dây đàn',
  'nav.metronome': 'Máy đếm nhịp',
  'nav.progress': 'Tiến độ',
  'nav.library': 'Thư viện',
  'nav.songs': 'Bài hát',
  'nav.tabs': 'Tab',
  'nav.chords': 'Hợp âm',
  'nav.ampTones': 'Ampli & Âm sắc',
  'nav.more': 'Thêm',
  'nav.soon': 'Sắp có',
  'app.title': 'GUITOOL',
  'app.tagline': 'Bạn đồng hành luyện tập',
  'app.savedNotice': 'Mọi thứ được lưu trên thiết bị này.',
  'theme.toLight': 'Chuyển sang chế độ sáng',
  'theme.toDark': 'Chuyển sang chế độ tối',
  'language.label': 'Chọn ngôn ngữ',
}

const ja: Dictionary = {
  'nav.home': 'ホーム',
  'nav.level': 'レベル',
  'nav.practice': '練習',
  'nav.tuner': 'チューナー',
  'nav.metronome': 'メトロノーム',
  'nav.progress': '進捗',
  'nav.library': 'ライブラリ',
  'nav.songs': '曲',
  'nav.tabs': 'タブ譜',
  'nav.chords': 'コード',
  'nav.ampTones': 'アンプ&トーン',
  'nav.more': 'その他',
  'nav.soon': '近日公開',
  'app.title': 'GUITOOL',
  'app.tagline': '練習パートナー',
  'app.savedNotice': 'すべてこの端末に保存されます。',
  'theme.toLight': 'ライトモードに切り替え',
  'theme.toDark': 'ダークモードに切り替え',
  'language.label': '言語を選択',
}

const zh: Dictionary = {
  'nav.home': '主页',
  'nav.level': '水平',
  'nav.practice': '练习',
  'nav.tuner': '调音器',
  'nav.metronome': '节拍器',
  'nav.progress': '进度',
  'nav.library': '曲库',
  'nav.songs': '歌曲',
  'nav.tabs': '谱',
  'nav.chords': '和弦',
  'nav.ampTones': '音箱与音色',
  'nav.more': '更多',
  'nav.soon': '即将推出',
  'app.title': 'GUITOOL',
  'app.tagline': '练习伙伴',
  'app.savedNotice': '所有数据都保存在本设备上。',
  'theme.toLight': '切换到浅色模式',
  'theme.toDark': '切换到深色模式',
  'language.label': '选择语言',
}

const es: Dictionary = {
  'nav.home': 'Inicio',
  'nav.level': 'Nivel',
  'nav.practice': 'Práctica',
  'nav.tuner': 'Afinador',
  'nav.metronome': 'Metrónomo',
  'nav.progress': 'Progreso',
  'nav.library': 'Biblioteca',
  'nav.songs': 'Canciones',
  'nav.tabs': 'Tablaturas',
  'nav.chords': 'Acordes',
  'nav.ampTones': 'Ampli y tono',
  'nav.more': 'Más',
  'nav.soon': 'Próximamente',
  'app.title': 'GUITOOL',
  'app.tagline': 'Tu compañero de práctica',
  'app.savedNotice': 'Todo se guarda en este dispositivo.',
  'theme.toLight': 'Cambiar a modo claro',
  'theme.toDark': 'Cambiar a modo oscuro',
  'language.label': 'Elegir idioma',
}

export const TRANSLATIONS: Record<LanguageCode, Dictionary> = { en, vi, ja, zh, es }
