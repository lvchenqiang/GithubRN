import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'

/**
 * 主题变更
 * @param theme
 * @returns {{type: string, theme: *}}
 */
export function onThemeChange(theme) {
    return {type: Types.THEME_CHANGE, theme: theme}
}