
type LangFild = {
  'rus': string;
  'eng': string;
}
type LangText = {
  [prop: string]: LangFild;
}

type Lang = keyof LangFild;

const LANGTEXT = {
  'sendButton': {
    'rus': 'Отправить',
    'eng': 'Send',
  },
  'deleteButton': {
    'rus': 'Удалить',
    'eng': 'Delete',
  },
}

type LangNameElement = keyof typeof LANGTEXT;

export {LANGTEXT, Lang, LangNameElement};