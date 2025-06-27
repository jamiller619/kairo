import { ChromeStorage, LocalStorage } from '@/options/Storage'
import defaultOptions from './defaultOptions'

const storage = new (window.chrome.storage ? ChromeStorage : LocalStorage)(defaultOptions)

export default storage
