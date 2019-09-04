import pinyin from 'chinese-to-pinyin'
import empty from './empty'

export default function chinese2pinyin (text, option) {
  if(!text) {
    return
  }

  if(empty(option)) {
    option = {
      removeTone: true,
      keepRest: true,
    }
  }

  return pinyin(text, option).replace(/\s*/g,"")
}
