const COURSE_NAME = 'foundation-course'
const RATING_MIN = 800
const PLAYER_HEADERS = ['playerKey', 'name', 'rating', 'answered', 'updatedAt', 'pinSecret', 'tokenHash', 'grade', 'className', 'foundationMember', 'unlockedThemes', 'deletedAt', 'deletedBy', 'deleteReason', 'deleteOperationId']
const THEME_UNLOCKS = ['moon', 'crystallium', 'dignity', 'archive', 'eclipse', 'verdant', 'ember', 'aurora']
const ANSWER_HEADERS = ['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt', 'answerId']
const COURSE_PROFILE_HEADERS = ['playerKey', 'course', 'rating', 'answered', 'updatedAt']
const POOL_PROFILE_HEADERS = ['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt']
const ADMIN_AUDIT_HEADERS = ['timestamp', 'adminPlayerKey', 'targetPlayerKey', 'action', 'course', 'poolId', 'beforeValue', 'afterValue', 'reason']
const RATING_POINTS = { starter: 12, standard: 18, advanced: 26 }
const RATING_LOSS = { starter: 7, standard: 11, advanced: 16 }
const ALLOWED_COURSES = ['foundation-course', 'regular-english-practice', 'regular-english-practice-2kimatsu']
const ALLOWED_GRADES = ['1', '2', '3']
const ALLOWED_CLASSES = 'ABCDEFGHIJKLM'.split('')
const FOUNDATION_POOL_ID = 'foundation'
const JAPANESE_INAPPROPRIATE_PATTERNS = [
  /(?:死ね|しね|消えろ|きえろ|殺す|ころす|殺せ|ころせ|だまれ|黙れ|うるせえ|レイプ|れいぷ|強姦|ごうかん|ちんこ|ちんぽ|ちんちん|まんこ|おっぱい|ぱいおつ|セックス|せっくす|えっち|エッチ|エロ|えろ|オナニー|おなにー|自慰|じい|射精|しゃせい|精子|せいし|ペニス|ぺにす|ヴァギナ|ばぎな|アナル|あなる|肛門|こうもん|フェラ|ふぇら|裸|はだか|全裸|ぜんら|乳首|ちくび|パンツ|ぱんつ|うんこ|うんち|ばか(?!り)|馬鹿|バカ(?!り)|アホ|あほ|ブス|ぶす|デブ|でぶ|ハゲ|はげ|チビ|ちび|クズ|くず|ゴミ|ごみ|カス|かす|無能|むのう|キモい|きもい|キショい|きしょい|うざい|ウザい|陰キャ|いんきゃ|チー牛|ちーぎゅう|ガイジ|がいじ|キチガイ|きちがい|池沼|ちしょう|老害|ろうがい|雑魚|ざこ|負け犬|まけいぬ|役立たず|やくたたず|下手くそ|へたくそ)/i,
]
const ENGLISH_INAPPROPRIATE_PATTERN = /(?:^|[^a-z0-9])(motherfucker|fuck(?:ing|ed|er)?|shit(?:head)?|bitch|asshole|dick|pussy|cunt|cock|nigger|faggot|slut|whore|rape|porn(?:ography)?|nude|naked|sex|sexy|masturbat(?:e|ed|ing|ion)|penis|vagina|boobs?|tits?|dildo|jerk|idiot|moron|loser|dumbass|stupid|retard)(?:$|[^a-z0-9])/i
const QUESTION_REGISTRY = {
  "l13-01": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "Our purpose is to help the poor."
    ]
  },
  "l13-02": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "to talk with"
    ]
  },
  "l13-03": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "食べるものがほしい"
    ]
  },
  "l13-04": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "to help"
    ]
  },
  "l14-01": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "服を買うために原宿へ行った"
    ]
  },
  "l14-02": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "told us to go"
    ]
  },
  "l14-03": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "It is not easy to understand others' feelings."
    ]
  },
  "l14-04": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "not to"
    ]
  },
  "l15-01": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "let"
    ]
  },
  "l15-02": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "say"
    ]
  },
  "l15-03": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "to have left"
    ]
  },
  "l15-04": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "Shinji seems to be playing soccer in the park now."
    ]
  },
  "plus-01": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "To tell"
    ]
  },
  "plus-02": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "The French President is to visit Japan next month."
    ]
  },
  "plus-03": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "easy to find"
    ]
  },
  "plus-04": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "where to"
    ]
  },
  "gerund-01": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "reading"
    ]
  },
  "gerund-02": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "talking"
    ]
  },
  "gerund-03": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "helping"
    ]
  },
  "gerund-04": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "Reading English every day is useful."
    ]
  },
  "gerund-05": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "seeing"
    ]
  },
  "gerund-06": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "closing"
    ]
  },
  "gerund-07": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "running"
    ]
  },
  "gerund-08": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "to drink"
    ]
  },
  "gerund-09": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "seeing"
    ]
  },
  "gerund-10": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "to do"
    ]
  },
  "gerund-11": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "Getting up early is good for your health."
    ]
  },
  "gerund-12": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "reading",
      "to be read"
    ]
  },
  "participle-01": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "interesting"
    ]
  },
  "participle-02": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "interested"
    ]
  },
  "participle-03": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "falling"
    ]
  },
  "participle-04": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "The broken window needs to be repaired."
    ]
  },
  "participle-05": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "standing"
    ]
  },
  "participle-06": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "written"
    ]
  },
  "participle-07": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "locked"
    ]
  },
  "participle-08": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "surprising"
    ]
  },
  "participle-09": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "surprised"
    ]
  },
  "participle-10": {
    "course": "foundation-course",
    "difficulty": "standard",
    "accepted": [
      "The man sitting next to me speaks English."
    ]
  },
  "participle-11": {
    "course": "foundation-course",
    "difficulty": "starter",
    "accepted": [
      "crying"
    ]
  },
  "participle-12": {
    "course": "foundation-course",
    "difficulty": "advanced",
    "accepted": [
      "written"
    ]
  },
  "reg27-01": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "will be"
    ]
  },
  "reg27-02": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "should"
    ]
  },
  "reg27-03": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "wouldn't"
    ]
  },
  "reg27-04": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "used to"
    ]
  },
  "reg27-05": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "should have"
    ]
  },
  "reg27-06": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "must be"
    ]
  },
  "reg27-07": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Shall we"
    ]
  },
  "reg27-08": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Don't"
    ]
  },
  "reg27-09": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "don't have to",
      "do not have to"
    ]
  },
  "reg27-10": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Do have to"
    ]
  },
  "reg27-11": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "shouldn't break"
    ]
  },
  "reg27-12": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "We will be able to meet again."
    ]
  },
  "reg27-13": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "He may well win a medal at the Olympics."
    ]
  },
  "reg27-14": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "I would rather die than steal."
    ]
  },
  "reg27-15": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "It is necessary that you should attend the meeting."
    ]
  },
  "reg27-16": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "would"
    ]
  },
  "reg27-17": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Shall"
    ]
  },
  "reg27-18": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Will"
    ]
  },
  "reg27-19": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "may have"
    ]
  },
  "reg27-20": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "cannot have"
    ]
  },
  "reg27-21": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "would like to"
    ]
  },
  "reg27-22": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "may"
    ]
  },
  "reg27-23": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "should feel"
    ]
  },
  "reg27-24": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "should"
    ]
  },
  "reg27-25": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "must have watched"
    ]
  },
  "reg27-26": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "might as well"
    ]
  },
  "reg27-27": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "can"
    ]
  },
  "reg27-28": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "彼はパーティーで私の姉（妹）を負かすことができた。",
      "彼はパーティーで私の姉を負かすことができた。",
      "彼はパーティーで妹を負かすことができた。"
    ]
  },
  "reg27-29": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "彼女は昨夜とても忙しかったのかもしれない。"
    ]
  },
  "reg27-30": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "私たちは以前、将来の夢についてお互いに話したものだ。"
    ]
  },
  "reg27-31": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "私は彼なしで会議を始めることを提案します。"
    ]
  },
  "reg27-32": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "He had to study hard."
    ]
  },
  "reg27-33": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "She must be worried about me."
    ]
  },
  "reg27-34": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "You need not have gone there.",
      "You needn't have gone there."
    ]
  },
  "reg27-35": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "It is natural that they should think so.",
      "It is natural for them to think so."
    ]
  },
  "reg13-01": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Our purpose is to help the poor."
    ]
  },
  "reg13-02": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "We planned to go to Hokkaido by ship."
    ]
  },
  "reg13-03": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "It is very hard to master a foreign language."
    ]
  },
  "reg13-04": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "Tom found it easy to climb the tree."
    ]
  },
  "reg13-05": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to talk with"
    ]
  },
  "reg13-06": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to read"
    ]
  },
  "reg13-07": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to do"
    ]
  },
  "reg13-08": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to live in"
    ]
  },
  "reg13-09": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "彼はうそをつくような人ではありません。"
    ]
  },
  "reg13-10": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "言語を学ぶことは、異なる文化を知ることです。"
    ]
  },
  "reg13-11": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "彼はサッカーチームに入ることを決めました。"
    ]
  },
  "reg13-12": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "私は来週の月曜日に提出する宿題がたくさんあります。"
    ]
  },
  "reg13-13": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "お腹が空きました。何か食べるものが欲しいです。"
    ]
  },
  "reg13-14": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "It is difficult to speak English.",
      "To speak English is very difficult."
    ]
  },
  "reg14-01": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "私は昨日、服を買うために原宿へ行きました。"
    ]
  },
  "reg14-02": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "彼は成長して弁護士になりました。"
    ]
  },
  "reg14-03": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "彼女は親切にも彼らを助けてあげました。"
    ]
  },
  "reg14-04": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "私はその知らせを聞いて悲しかった。"
    ]
  },
  "reg14-05": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "彼はその仕事を得てとても幸せでした。"
    ]
  },
  "reg14-06": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "want him to take",
      "want him to play"
    ]
  },
  "reg14-07": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "told us to go"
    ]
  },
  "reg14-08": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "allowed me to use"
    ]
  },
  "reg14-09": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "advised me to do"
    ]
  },
  "reg14-10": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "It was hard for Anne to move the desk."
    ]
  },
  "reg14-11": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "It is not easy to understand others' feelings."
    ]
  },
  "reg14-12": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I was careless to leave the door unlocked."
    ]
  },
  "reg14-13": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "We decided not to take part in the game."
    ]
  },
  "reg14-14": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I asked her to help me with my homework.",
      "I asked her to help with my homework."
    ]
  },
  "reg15-01": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "have"
    ]
  },
  "reg15-02": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "let"
    ]
  },
  "reg15-03": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "made to go"
    ]
  },
  "reg15-04": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "say"
    ]
  },
  "reg15-05": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "leave"
    ]
  },
  "reg15-06": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "to enter"
    ]
  },
  "reg15-07": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "to be"
    ]
  },
  "reg15-08": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "to be looking"
    ]
  },
  "reg15-09": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "to have left"
    ]
  },
  "reg15-10": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "to have been caught"
    ]
  },
  "reg15-11": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "I heard someone cry out last night."
    ]
  },
  "reg15-12": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I'll have my brother show you the place."
    ]
  },
  "reg15-13": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "I was lucky to have been chosen as their leader."
    ]
  },
  "reg15-14": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "I was sad not to have been invited to the party."
    ]
  },
  "reg15-15": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "Shinji seems to be playing soccer in the park now."
    ]
  },
  "reg15-16": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "My father made me do my homework.",
      "My father made me study."
    ]
  },
  "regplus-01": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "私たちはたまたま知り合った。",
      "私たちはたまたまお互いを知っていた。"
    ]
  },
  "regplus-02": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "サトシはローマにいる間に、イタリア文化を理解するようになった。"
    ]
  },
  "regplus-03": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "The French President is to visit Japan next month."
    ]
  },
  "regplus-04": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "Not a cloud was to be seen in the sky."
    ]
  },
  "regplus-05": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "You are to do your homework before you go out."
    ]
  },
  "regplus-06": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "easy to find"
    ]
  },
  "regplus-07": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "where to"
    ]
  },
  "regplus-08": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "too expensive to"
    ]
  },
  "regplus-09": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "to show"
    ]
  },
  "regplus-10": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "enough to"
    ]
  },
  "regplus-11": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "To be honest"
    ]
  },
  "regplus-12": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "want to"
    ]
  },
  "regplus-13": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "as to"
    ]
  },
  "regplus-14": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "not to"
    ]
  },
  "regplus-15": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "mind"
    ]
  },
  "regplus-16": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "begin with"
    ]
  },
  "reg16-01": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "teaching"
    ]
  },
  "reg16-02": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Walking",
      "Going for a walk"
    ]
  },
  "reg16-03": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "writing"
    ]
  },
  "reg16-04": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "buying"
    ]
  },
  "reg16-05": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "cleaning",
      "to be cleaned"
    ]
  },
  "reg16-06": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "She likes visiting museums alone."
    ]
  },
  "reg16-07": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "He is proud of his daughter being a singer."
    ]
  },
  "reg16-08": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "Not eating vegetables is bad for your health."
    ]
  },
  "reg16-09": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I can't imagine him wearing a suit."
    ]
  },
  "reg16-10": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "making mistakes",
      "having made mistakes"
    ]
  },
  "reg16-11": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "being compared"
    ]
  },
  "reg16-12": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "buying",
      "having bought"
    ]
  },
  "reg16-13": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I enjoyed playing soccer with my friends.",
      "I had fun playing soccer with my friends."
    ]
  },
  "reg17-01": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "forward to going"
    ]
  },
  "reg17-02": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "me from climbing"
    ]
  },
  "reg17-03": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "feel like reading"
    ]
  },
  "reg17-04": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "mind opening"
    ]
  },
  "reg17-05": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "He is used to using sign language."
    ]
  },
  "reg17-06": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "There is no knowing whether it is true or not."
    ]
  },
  "reg17-07": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "It is no use arguing with him any longer."
    ]
  },
  "reg17-08": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "not to eat"
    ]
  },
  "reg17-09": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "playing"
    ]
  },
  "reg17-10": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "smoking"
    ]
  },
  "reg17-11": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "to be"
    ]
  },
  "reg17-12": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "coming"
    ]
  },
  "reg17-13": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "to call"
    ]
  },
  "reg17-14": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "bringing"
    ]
  },
  "reg17-15": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "shaking"
    ]
  },
  "reg17-16": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "I started playing tennis recently.",
      "I started learning tennis recently."
    ]
  },
  "regopt4-01": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "fast runner"
    ]
  },
  "regopt4-02": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "your acceptance",
      "your accepting"
    ]
  },
  "regopt4-03": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "his safety"
    ]
  },
  "regopt4-04": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "made a decision"
    ]
  },
  "regopt4-05": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "late arrival"
    ]
  },
  "regopt4-06": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "The story made her change her way of thinking."
    ]
  },
  "regopt4-07": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "The doctor's advice enabled my grandfather to recover from his illness."
    ]
  },
  "regopt4-08": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "My pride kept me from asking my friends for help."
    ]
  },
  "regopt4-09": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "The accident prevented us from arriving at the station on time."
    ]
  },
  "regopt4-10": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "His letter said that he would visit us in April."
    ]
  },
  "regopt4-11": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "それをちょっと見せてください。"
    ]
  },
  "regopt4-12": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "私の姉（妹）は早起きです。",
      "私の姉は早起きです。",
      "私の妹は早起きです。"
    ]
  },
  "regopt4-13": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "インターネットのおかげで、私たちは多くの情報を得ることができます。"
    ]
  },
  "regopt4-14": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "台風のため、私たちは海へ釣りに行けませんでした。"
    ]
  },
  "regopt4-15": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "このバスで空港へ行けますか。"
    ]
  },
  "regopt7-01": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "at"
    ]
  },
  "regopt7-02": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "at"
    ]
  },
  "regopt7-03": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "on"
    ]
  },
  "regopt7-04": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "in"
    ]
  },
  "regopt7-05": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "on ... in",
      "on the wall in"
    ]
  },
  "regopt7-06": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "from ... to"
    ]
  },
  "regopt7-07": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "during"
    ]
  },
  "regopt7-08": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "for"
    ]
  },
  "regopt7-09": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "for ... in"
    ]
  },
  "regopt7-10": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "Do you know the title of her latest album?"
    ]
  },
  "regopt7-11": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "We cleared the schoolyard of snow."
    ]
  },
  "regopt7-12": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "The dog was sitting by the front door."
    ]
  },
  "regopt7-13": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I saw my teacher with his family at the mall yesterday."
    ]
  },
  "regopt7-14": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "by ... until"
    ]
  },
  "regopt7-15": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "with"
    ]
  },
  "regopt7-16": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "by"
    ]
  }
  // WORKBOOK_QUESTION_REGISTRY_START
  ,
  "workbook-l13-s1-1-1-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "It to learn"
    ]
  },
  "workbook-l13-s1-1-1-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "it to"
    ]
  },
  "workbook-l13-s1-1-1-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "is to win"
    ]
  },
  "workbook-l13-s1-1-1-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "hopes to have",
      "wants to have"
    ]
  },
  "workbook-l13-s1-1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to leave"
    ]
  },
  "workbook-l13-s1-1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to swim"
    ]
  },
  "workbook-l13-s1-1-2-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "To study"
    ]
  },
  "workbook-l13-s1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "something to give"
    ]
  },
  "workbook-l13-s1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "student to arrive"
    ]
  },
  "workbook-l13-s1-2-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "chance to talk",
      "opportunity to talk",
      "chance to speak"
    ]
  },
  "workbook-l13-s1-2-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to play soccer with",
      "to play football with"
    ]
  },
  "workbook-l13-s2-1-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "私は数学を教えてくれる家庭教師が必要だ。",
      "数学を教えてもらうための家庭教師が必要だ。"
    ]
  },
  "workbook-l13-s2-1-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "今日はやらなければならない仕事がたくさんある。",
      "今日はするべき仕事がたくさんある。"
    ]
  },
  "workbook-l13-s2-1-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "成功の鍵は一生懸命練習することだ。",
      "成功するには、熱心に練習することが大切だ。"
    ]
  },
  "workbook-l13-s2-1-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "話の全体を知るのは難しい。",
      "全体の事情を知ることは難しい。"
    ]
  },
  "workbook-l13-s2-2-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Our plan is to leave Osaka in the morning"
    ]
  },
  "workbook-l13-s2-2-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "not easy to get a degree in physics"
    ]
  },
  "workbook-l13-s2-2-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "My dream is to become a doctor like Dr. Kato"
    ]
  },
  "workbook-l13-s2-2-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "We agreed to discuss the matter again next week"
    ]
  },
  "workbook-l13-s2-2-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "I think it a good idea to ask him for advice"
    ]
  },
  "workbook-l13-s2-2-6": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "are looking for a big tree to sleep under"
    ]
  },
  "workbook-l13-s2-2-7": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "music has the power to change the world"
    ]
  },
  "workbook-l13-s2-3-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "it easy to master that skill"
    ]
  },
  "workbook-l13-s2-3-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "time to close the store",
      "time to close the shop"
    ]
  },
  "workbook-l13-s2-3-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "is dangerous to use a smartphone"
    ]
  },
  "workbook-l14-s1-1-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "私は叔父を見送るために空港へ行った。",
      "叔父を見送りに空港へ行った。"
    ]
  },
  "workbook-l14-s1-1-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "彼女は目を覚ますと、自分が病院にいることに気づいた。",
      "目覚めたところ、自分が病院にいるとわかった。"
    ]
  },
  "workbook-l14-s1-1-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "私がそこにいたと知って、彼は驚いた。",
      "私がそこにいると知り、彼は驚いた。"
    ]
  },
  "workbook-l14-s1-1-4": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "私のために誕生日ケーキを作ってくれるとは、彼女は親切だった。",
      "彼女は私に誕生日ケーキを作ってくれるほど親切だった。"
    ]
  },
  "workbook-l14-s1-1-5": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "間違った電車に乗るなんて、あなたは不注意だった。",
      "あなたが間違った電車に乗ったのは不注意だった。"
    ]
  },
  "workbook-l14-s1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I would like you to explain"
    ]
  },
  "workbook-l14-s1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "The doctor advised me to stay"
    ]
  },
  "workbook-l14-s1-2-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "This train enables us to get to"
    ]
  },
  "workbook-l14-s1-3-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "It may be possible for him to lift this big box."
    ]
  },
  "workbook-l14-s1-3-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "It is easy for Katie to get along with everyone."
    ]
  },
  "workbook-l14-s1-3-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "It was brave of you to tell her the truth."
    ]
  },
  "workbook-l14-s1-4-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "not to make careless mistakes"
    ]
  },
  "workbook-l14-s1-4-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "never to spend a lot of money"
    ]
  },
  "workbook-l14-s2-1-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "He was disappointed not to get the job."
    ]
  },
  "workbook-l14-s2-1-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "arrived there to find that he had already left"
    ]
  },
  "workbook-l14-s2-1-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "It was wise of him to refuse the offer."
    ]
  },
  "workbook-l14-s2-1-4": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I was born to make you happy."
    ]
  },
  "workbook-l14-s2-1-5": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "My parents didn’t allow me to work"
    ]
  },
  "workbook-l14-s2-1-6": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "warned everyone not to go out at night"
    ]
  },
  "workbook-l14-s2-2-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "My dog lived to be twenty years old.",
      "My dog lived to be 20."
    ]
  },
  "workbook-l14-s2-2-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "My father always tells me to practice tennis."
    ]
  },
  "workbook-l14-s2-2-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "It is important to eat healthy food.",
      "It’s important to eat healthy food."
    ]
  },
  "workbook-l14-s2-2-4": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "My mother wants me to clean up my room."
    ]
  },
  "workbook-l15-s1-1-1-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "introduce"
    ]
  },
  "workbook-l15-s1-1-1-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "to be"
    ]
  },
  "workbook-l15-s1-1-1-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "made"
    ]
  },
  "workbook-l15-s1-1-1-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "call"
    ]
  },
  "workbook-l15-s1-1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "felt touch",
      "felt touching"
    ]
  },
  "workbook-l15-s1-1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "had cut"
    ]
  },
  "workbook-l15-s1-1-2-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "made change"
    ]
  },
  "workbook-l15-s1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "seems to",
      "appears to"
    ]
  },
  "workbook-l15-s1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "It made"
    ]
  },
  "workbook-l15-s1-3-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "to have passed"
    ]
  },
  "workbook-l15-s1-3-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "be raining"
    ]
  },
  "workbook-l15-s1-3-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "to have eaten"
    ]
  },
  "workbook-l15-s1-3-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "to be invited"
    ]
  },
  "workbook-l15-s2-1-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "The train schedule seemed to have returned to"
    ]
  },
  "workbook-l15-s2-1-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "My mother made me clean the bathroom."
    ]
  },
  "workbook-l15-s2-1-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "My dog appears to be sleeping on"
    ]
  },
  "workbook-l15-s2-1-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "Haruki seems to have been brought up"
    ]
  },
  "workbook-l15-s2-1-5": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "I didn’t notice them enter the room."
    ]
  },
  "workbook-l15-s2-1-6": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "They appeared to understand what was"
    ]
  },
  "workbook-l15-s2-1-7": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "Everyone watched the last runner cross the goal line."
    ]
  },
  "workbook-l15-s2-1-8": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "They were made to wait outside"
    ]
  },
  "workbook-l15-s2-2-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "have a carpenter repair"
    ]
  },
  "workbook-l15-s2-2-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "was heard to criticize her",
      "was heard criticizing her"
    ]
  },
  "workbook-l15-s2-2-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "seems to be waiting for someone"
    ]
  },
  "workbook-l15-s2-2-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "want to be called Nicky",
      "would like to be called Nicky"
    ]
  },
  "workbook-plus-s1-1-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "アリスはパーティーで彼にまた偶然会った。",
      "パーティーで、アリスは彼に再び偶然出会った。"
    ]
  },
  "workbook-plus-s1-1-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "今日は夕食前に帰宅することになっている。",
      "今日は夕食前に帰ってきなさい。"
    ]
  },
  "workbook-plus-s1-1-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "コンサートは午後6時に始まる予定だ。",
      "コンサートは午後6時に始まることになっている。"
    ]
  },
  "workbook-plus-s1-1-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "通りには誰も見当たらなかった。",
      "通りには誰の姿も見えなかった。"
    ]
  },
  "workbook-plus-s1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "was difficult to",
      "was hard to"
    ]
  },
  "workbook-plus-s1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "too to"
    ]
  },
  "workbook-plus-s1-2-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "old enough to"
    ]
  },
  "workbook-plus-s1-2-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "what to buy"
    ]
  },
  "workbook-plus-s1-2-5": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "so to learn",
      "so to study"
    ]
  },
  "workbook-plus-s1-2-6": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "so as to"
    ]
  },
  "workbook-plus-s1-3-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "まず第一に",
      "まず初めに"
    ]
  },
  "workbook-plus-s1-3-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "不思議なことに",
      "奇妙なことに"
    ]
  },
  "workbook-plus-s1-3-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "実を言うと",
      "本当のことを言うと"
    ]
  },
  "workbook-plus-s1-3-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "そうするように言った",
      "ジムに助けを求めるように言った"
    ]
  },
  "workbook-plus-s2-1-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "to be"
    ]
  },
  "workbook-plus-s2-1-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "enough to"
    ]
  },
  "workbook-plus-s2-1-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "order to"
    ]
  },
  "workbook-plus-s2-1-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "easy to"
    ]
  },
  "workbook-plus-s2-1-5": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "too to"
    ]
  },
  "workbook-plus-s2-1-6": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "enough to"
    ]
  },
  "workbook-plus-s2-2-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "My brother doesn’t know how to ride a bike."
    ]
  },
  "workbook-plus-s2-2-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "I kept silent so as not to wake her up.",
      "So as not to wake her up, I kept silent."
    ]
  },
  "workbook-plus-s2-2-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "We are to hand in the report on Friday."
    ]
  },
  "workbook-plus-s2-3-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "is too hot for me to eat"
    ]
  },
  "workbook-plus-s2-3-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "are always difficult to answer"
    ]
  },
  "workbook-plus-s2-3-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "kind enough to tell me the way to the station",
      "kind enough to show me the way to the station"
    ]
  },
  "workbook-l16-s1-1-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Riding"
    ]
  },
  "workbook-l16-s1-1-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "watching"
    ]
  },
  "workbook-l16-s1-1-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "laughing"
    ]
  },
  "workbook-l16-s1-1-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "swimming"
    ]
  },
  "workbook-l16-s1-1-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "repairing",
      "to be repaired"
    ]
  },
  "workbook-l16-s1-1-6": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "playing"
    ]
  },
  "workbook-l16-s1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Do you mind my asking"
    ]
  },
  "workbook-l16-s1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "I don’t like Billy’s talking to me"
    ]
  },
  "workbook-l16-s1-2-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "I can’t imagine living without movies"
    ]
  },
  "workbook-l16-s1-2-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "for not writing back to you sooner"
    ]
  },
  "workbook-l16-s1-3-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "being asked"
    ]
  },
  "workbook-l16-s1-3-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "being criticized"
    ]
  },
  "workbook-l16-s1-3-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "having climbed",
      "climbing"
    ]
  },
  "workbook-l16-s1-3-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "having broken",
      "breaking"
    ]
  },
  "workbook-l16-s1-3-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "being hit"
    ]
  },
  "workbook-l16-s2-1-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "決してあきらめないことはとても大切です。",
      "決してあきらめないことが非常に重要です。"
    ]
  },
  "workbook-l16-s2-1-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "両親は犬を飼わないと言い張っています。",
      "両親は犬を飼わないことにこだわっています。"
    ]
  },
  "workbook-l16-s2-1-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "彼と話すのは時間の無駄でした。",
      "彼と話したのは時間の無駄だった。"
    ]
  },
  "workbook-l16-s2-2-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Turn off the lights before leaving"
    ]
  },
  "workbook-l16-s2-2-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "with the proposal being changed"
    ]
  },
  "workbook-l16-s2-2-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "her not being able to catch"
    ]
  },
  "workbook-l16-s2-2-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "We are disappointed at having lost the game"
    ]
  },
  "workbook-l16-s2-2-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "Finding out the truth will be difficult"
    ]
  },
  "workbook-l16-s2-3-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "having parties",
      "having a party"
    ]
  },
  "workbook-l16-s2-3-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "his coming to the party",
      "him coming to the party"
    ]
  },
  "workbook-l16-s2-3-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "is running ten kilometers in the morning",
      "is running ten kilometres in the morning"
    ]
  },
  "workbook-l16-s2-3-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "My grandmother enjoys swimming"
    ]
  },
  "workbook-l16-s2-3-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "I don’t like being told"
    ]
  },
  "workbook-l17-s1-1-1-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "forward to reading"
    ]
  },
  "workbook-l17-s1-1-1-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "is no telling",
      "is no knowing"
    ]
  },
  "workbook-l17-s1-1-1-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "mind helping",
      "please help"
    ]
  },
  "workbook-l17-s1-1-1-4": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "about going"
    ]
  },
  "workbook-l17-s1-1-1-5": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "no use asking",
      "no good asking"
    ]
  },
  "workbook-l17-s1-1-1-6": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "kept from going",
      "prevented from going",
      "stopped from going"
    ]
  },
  "workbook-l17-s1-1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "accustomed",
      "used"
    ]
  },
  "workbook-l17-s1-1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "about having",
      "about eating"
    ]
  },
  "workbook-l17-s1-1-2-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "like going"
    ]
  },
  "workbook-l17-s1-2-1-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "driving",
      "traveling",
      "travelling"
    ]
  },
  "workbook-l17-s1-2-1-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "traveling",
      "travelling",
      "driving"
    ]
  },
  "workbook-l17-s1-2-1-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "to accept"
    ]
  },
  "workbook-l17-s1-2-1-4": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "to buy"
    ]
  },
  "workbook-l17-s1-2-2-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "訪れたことを覚えていますか",
      "訪れたのを覚えていますか"
    ]
  },
  "workbook-l17-s1-2-2-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "料理を注文しすぎたことを後悔しました",
      "料理を頼みすぎたのを残念に思いました"
    ]
  },
  "workbook-l17-s1-2-2-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "満足させようとしています",
      "満足させるよう努めています"
    ]
  },
  "workbook-l17-s1-2-2-4": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "私に電話をするのを忘れないでください",
      "私に電話することを忘れないでね"
    ]
  },
  "workbook-l17-s2-1-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "It’s no good expecting financial support"
    ]
  },
  "workbook-l17-s2-1-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I don’t feel like playing video games"
    ]
  },
  "workbook-l17-s2-1-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "There is no telling what she will say"
    ]
  },
  "workbook-l17-s2-1-4": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I’m not used to living in big cities"
    ]
  },
  "workbook-l17-s2-1-5": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "kept me from going on the ski trip"
    ]
  },
  "workbook-l17-s2-2-1": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "forget meeting that singer",
      "forget having met that singer"
    ]
  },
  "workbook-l17-s2-2-2": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "Please remember to send her",
      "Remember to send her"
    ]
  },
  "workbook-l17-s2-2-3": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "We wish to reserve a room at a hotel",
      "We wish to reserve a hotel room",
      "We wish to reserve a room in a hotel"
    ]
  },
  "workbook-l17-s2-2-4": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "Can you imagine living in"
    ]
  },
  "workbook-l17-s2-2-5": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "likes reading mystery novels",
      "likes to read mystery novels"
    ]
  },
  "workbook-l17-s2-2-6": {
    "course": "regular-english-practice",
    "difficulty": "standard",
    "accepted": [
      "I tried skiing"
    ]
  },
  "workbook-o4-s1-1-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "arrival"
    ]
  },
  "workbook-o4-s1-1-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "silence"
    ]
  },
  "workbook-o4-s1-1-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "help",
      "assistance"
    ]
  },
  "workbook-o4-s1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "good speaker"
    ]
  },
  "workbook-o4-s1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "decision"
    ]
  },
  "workbook-o4-s1-2-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "have look"
    ]
  },
  "workbook-o4-s1-3-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "台風のせいで、私たちは山でのハイキングをやめた。",
      "台風によって、私たちは山でハイキングを中止した。"
    ]
  },
  "workbook-o4-s1-3-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "高熱のため、私は家にいなければならなかった。",
      "高熱が原因で、私は家にいることを余儀なくされた。"
    ]
  },
  "workbook-o4-s1-3-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "自転車に乗れば、かなりお金を節約できます。",
      "自転車に乗ることは、あなたに多くのお金を節約させてくれる。"
    ]
  },
  "workbook-o4-s1-3-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "けがのため、彼は決勝戦に出られなかった。",
      "彼のけがが原因で、彼は決勝戦でプレーできなかった。"
    ]
  },
  "workbook-o4-s1-3-5": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "彼女の表情から、彼女が私の計画に賛成していないことが分かった。",
      "彼女の顔つきは、彼女が私の計画に同意していないことを示していた。"
    ]
  },
  "workbook-o4-s2-1-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "sorrow",
      "sadness",
      "grief"
    ]
  },
  "workbook-o4-s2-1-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "made"
    ]
  },
  "workbook-o4-s2-1-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "saved"
    ]
  },
  "workbook-o4-s2-1-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "offer"
    ]
  },
  "workbook-o4-s2-1-5": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "enabled",
      "helped",
      "allowed"
    ]
  },
  "workbook-o4-s2-2-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "good guitarist"
    ]
  },
  "workbook-o4-s2-2-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "made"
    ]
  },
  "workbook-o4-s2-2-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "take"
    ]
  },
  "workbook-o4-s2-2-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "give call"
    ]
  },
  "workbook-o4-s2-3-1": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "A strong wind prevented the plane from taking off"
    ]
  },
  "workbook-o4-s2-3-2": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "The plan’s failure surprised us"
    ]
  },
  "workbook-o4-s2-3-3": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "This song reminds me of my childhood"
    ]
  },
  "workbook-o4-s2-3-4": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "Medical advances have allowed us to stay healthy"
    ]
  },
  "workbook-o4-s2-3-5": {
    "course": "regular-english-practice",
    "difficulty": "advanced",
    "accepted": [
      "This street leads you to the post office"
    ]
  },
  "workbook-o7-s1-1-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "at"
    ]
  },
  "workbook-o7-s1-1-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "in"
    ]
  },
  "workbook-o7-s1-1-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "on"
    ]
  },
  "workbook-o7-s1-1-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "on"
    ]
  },
  "workbook-o7-s1-1-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "in"
    ]
  },
  "workbook-o7-s1-1-6": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "at"
    ]
  },
  "workbook-o7-s1-2-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "from"
    ]
  },
  "workbook-o7-s1-2-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to"
    ]
  },
  "workbook-o7-s1-2-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "from to"
    ]
  },
  "workbook-o7-s1-2-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "from"
    ]
  },
  "workbook-o7-s1-2-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "in"
    ]
  },
  "workbook-o7-s1-2-6": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to"
    ]
  },
  "workbook-o7-s1-2-7": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "for"
    ]
  },
  "workbook-o7-s1-2-8": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "during"
    ]
  },
  "workbook-o7-s1-3-1-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "with"
    ]
  },
  "workbook-o7-s1-3-1-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "by"
    ]
  },
  "workbook-o7-s1-3-1-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "until"
    ]
  },
  "workbook-o7-s1-3-1-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "by"
    ]
  },
  "workbook-o7-s1-3-1-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "with"
    ]
  },
  "workbook-o7-s1-3-2-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "You should check the size of the window"
    ]
  },
  "workbook-o7-s1-3-2-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "A thief robbed me of my wallet"
    ]
  },
  "workbook-o7-s2-1-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "on"
    ]
  },
  "workbook-o7-s2-1-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to"
    ]
  },
  "workbook-o7-s2-1-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "to by"
    ]
  },
  "workbook-o7-s2-1-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "on"
    ]
  },
  "workbook-o7-s2-1-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "on"
    ]
  },
  "workbook-o7-s2-1-6": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "on"
    ]
  },
  "workbook-o7-s2-1-7": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "for"
    ]
  },
  "workbook-o7-s2-2-1": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "What did you do during the holidays"
    ]
  },
  "workbook-o7-s2-2-2": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "He will be back in an hour"
    ]
  },
  "workbook-o7-s2-2-3": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "My mother has been working for the company for twenty years"
    ]
  },
  "workbook-o7-s2-2-4": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "I was waiting for you until nine o’clock"
    ]
  },
  "workbook-o7-s2-2-5": {
    "course": "regular-english-practice",
    "difficulty": "starter",
    "accepted": [
      "I’m living with an exchange student from India"
    ]
  },
  // WORKBOOK_QUESTION_REGISTRY_END
  // TERM_FINAL_QUESTION_REGISTRY_START
  "term2k-eg-p51-ex18-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "あなたは公園でバスケットボールをしている男の子たちを知っていますか。"
    ]
  },
  "term2k-eg-p51-ex18-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "通りに停められている車は私のものです。"
    ]
  },
  "term2k-eg-p51-ex18-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "私は彼女の笑顔(ほほえんでいる顔)が大好きです。"
    ]
  },
  "term2k-eg-p51-ex18-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "彼は疲れた声で私にそれを説明した。"
    ]
  },
  "term2k-eg-p51-ex18-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "hoping"
    ]
  },
  "term2k-eg-p51-ex18-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "seated"
    ]
  },
  "term2k-eg-p51-ex18-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "running"
    ]
  },
  "term2k-eg-p51-ex18-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "amused"
    ]
  },
  "term2k-eg-p51-ex18-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I found her crying alone"
    ]
  },
  "term2k-eg-p51-ex18-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "She came running to me when"
    ]
  },
  "term2k-eg-p51-ex18-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He left the computer broken"
    ]
  },
  "term2k-eg-p51-ex18-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "The stolen bicycle was found"
    ]
  },
  "term2k-eg-p53-ex19-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "washed"
    ]
  },
  "term2k-eg-p53-ex19-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "broken"
    ]
  },
  "term2k-eg-p53-ex19-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "working"
    ]
  },
  "term2k-eg-p53-ex19-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "heard"
    ]
  },
  "term2k-eg-p53-ex19-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "chasing"
    ]
  },
  "term2k-eg-p53-ex19-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "祖父母は私がピアノを弾くのを聞くのが好きです。"
    ]
  },
  "term2k-eg-p53-ex19-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "私たちはその選手がテレビで金メダルを授与されるのを見た。",
          "私たちはその選手がテレビで金メダルを与えられるのを見た。"
    ]
  },
  "term2k-eg-p53-ex19-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Opening"
    ]
  },
  "term2k-eg-p53-ex19-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Heated",
          "Being heated"
    ]
  },
  "term2k-eg-p53-ex19-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Walking"
    ]
  },
  "term2k-eg-p53-ex19-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Made",
          "Being made"
    ]
  },
  "term2k-eg-p53-ex19-4-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Not knowing"
    ]
  },
  "term2k-eg-p53-ex19-4-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "listening to the radio"
    ]
  },
  "term2k-eg-p53-ex19-4-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Written in French",
          "Being written in French"
    ]
  },
  "term2k-eg-p55-explus-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "It being"
    ]
  },
  "term2k-eg-p55-explus-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Having seen"
    ]
  },
  "term2k-eg-p55-explus-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "While cleaning"
    ]
  },
  "term2k-eg-p55-explus-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Frankly speaking"
    ]
  },
  "term2k-eg-p55-explus-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Speaking of"
    ]
  },
  "term2k-eg-p55-explus-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Generally speaking"
    ]
  },
  "term2k-eg-p55-explus-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Judging from"
    ]
  },
  "term2k-eg-p55-explus-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "彼女は目を閉じて仕事のことを考えていた。"
    ]
  },
  "term2k-eg-p55-explus-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "彼は目を輝かせて私の話を聞いた。"
    ]
  },
  "term2k-eg-p55-explus-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "グラスにはワインが残っていない。"
    ]
  },
  "term2k-eg-p55-explus-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "ドアのところに見知らぬ人が2人立っていた。"
    ]
  },
  "term2k-eg-p55-explus-4-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "go shopping at",
          "go shopping in"
    ]
  },
  "term2k-eg-p55-explus-4-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "went swimming in",
          "went swimming at"
    ]
  },
  "term2k-eg-p55-explus-4-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "busy washing"
    ]
  },
  "term2k-eg-p56-fe-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "singing"
    ]
  },
  "term2k-eg-p56-fe-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "do"
    ]
  },
  "term2k-eg-p56-fe-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "visiting"
    ]
  },
  "term2k-eg-p56-fe-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to turn"
    ]
  },
  "term2k-eg-p56-fe-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "going"
    ]
  },
  "term2k-eg-p56-fe-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "being"
    ]
  },
  "term2k-eg-p56-fe-1-7": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "cut"
    ]
  },
  "term2k-eg-p56-fe-1-8": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Interested"
    ]
  },
  "term2k-eg-p56-fe-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "where to study"
    ]
  },
  "term2k-eg-p56-fe-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "happened to"
    ]
  },
  "term2k-eg-p56-fe-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "want to study"
    ]
  },
  "term2k-eg-p56-fe-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "about going"
    ]
  },
  "term2k-eg-p56-fe-2-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "is rude of",
          "is impolite of"
    ]
  },
  "term2k-eg-p56-fe-2-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "feel doing"
    ]
  },
  "term2k-eg-p56-fe-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Would you mind my opening the window?"
    ]
  },
  "term2k-eg-p56-fe-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He is used to driving a big car."
    ]
  },
  "term2k-eg-p56-fe-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "She left her dog waiting outside the shop."
    ]
  },
  "term2k-eg-p56-fe-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Do you know that boy running in the park?"
    ]
  },
  "term2k-eg-p56-fe-3-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Kelly is rich enough to buy a house."
    ]
  },
  "term2k-eg-p57-fe-3-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I'm sure of his passing the entrance examination."
    ]
  },
  "term2k-eg-p57-fe-4-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to be shaking"
    ]
  },
  "term2k-eg-p57-fe-4-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to have been"
    ]
  },
  "term2k-eg-p57-fe-4-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "no knowing"
    ]
  },
  "term2k-eg-p57-fe-4-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "with crossed"
    ]
  },
  "term2k-eg-p57-fe-4-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "easy to read"
    ]
  },
  "term2k-eg-p57-fe-4-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to visit"
    ]
  },
  "term2k-eg-p57-fe-6-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "私はうそをつくのは悪いことだと思う。"
    ]
  },
  "term2k-eg-p57-fe-6-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "彼は終電に間に合うように駅まで走った。"
    ]
  },
  "term2k-eg-p57-fe-6-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "言うまでもなく、早起きは大切だ。"
    ]
  },
  "term2k-eg-p57-fe-6-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "それを探そうとしても無駄だ。"
    ]
  },
  "term2k-eg-p59-ex20-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as as"
    ]
  },
  "term2k-eg-p59-ex20-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "get as early as",
          "get so early as"
    ]
  },
  "term2k-eg-p59-ex20-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as much money as"
    ]
  },
  "term2k-eg-p59-ex20-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "twice as high as",
          "twice as tall as"
    ]
  },
  "term2k-eg-p59-ex20-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as as possible"
    ]
  },
  "term2k-eg-p59-ex20-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as as could"
    ]
  },
  "term2k-eg-p59-ex20-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "bigger than",
          "larger than"
    ]
  },
  "term2k-eg-p59-ex20-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "heavier"
    ]
  },
  "term2k-eg-p59-ex20-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "by three centimeters",
          "by 3 centimeters"
    ]
  },
  "term2k-eg-p59-ex20-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "better than"
    ]
  },
  "term2k-eg-p59-ex20-2-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "less"
    ]
  },
  "term2k-eg-p59-ex20-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He is not more popular than this actor."
    ]
  },
  "term2k-eg-p59-ex20-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "That sofa is two hundred dollars more expensive than this one."
    ]
  },
  "term2k-eg-p59-ex20-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Today is far busier than yesterday."
    ]
  },
  "term2k-eg-p61-ex21-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the most beautiful of"
    ]
  },
  "term2k-eg-p61-ex21-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the tallest in"
    ]
  },
  "term2k-eg-p61-ex21-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the very"
    ]
  },
  "term2k-eg-p61-ex21-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the least"
    ]
  },
  "term2k-eg-p61-ex21-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "by far the"
    ]
  },
  "term2k-eg-p61-ex21-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "He is one of the richest people in this city."
    ]
  },
  "term2k-eg-p61-ex21-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "This is the fourth oldest castle in Europe."
    ]
  },
  "term2k-eg-p61-ex21-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "He swims fastest in the swimming club.",
          "In the swimming club he swims fastest."
    ]
  },
  "term2k-eg-p61-ex21-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "She is the youngest of the four."
    ]
  },
  "term2k-eg-p61-ex21-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "higher any other",
          "higher every other"
    ]
  },
  "term2k-eg-p61-ex21-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "No other hotter"
    ]
  },
  "term2k-eg-p61-ex21-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "No fast as"
    ]
  },
  "term2k-eg-p61-ex21-3-4b": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "nothing"
    ]
  },
  "term2k-eg-p61-ex21-3-4c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "anything",
          "everything"
    ]
  },
  "term2k-eg-p63-explus-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "The elder",
          "The older"
    ]
  },
  "term2k-eg-p63-explus-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more more"
    ]
  },
  "term2k-eg-p63-explus-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "superior to"
    ]
  },
  "term2k-eg-p63-explus-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "この秋は，涼しいというよりむしろ寒い。"
    ]
  },
  "term2k-eg-p63-explus-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "彼女は歌手というよりはむしろピアニストだ。"
    ]
  },
  "term2k-eg-p63-explus-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "練習すればするほど，ますます上手に泳げるようになるだろう。"
    ]
  },
  "term2k-eg-p63-explus-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "no less than",
          "no fewer than"
    ]
  },
  "term2k-eg-p63-explus-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "not less than"
    ]
  },
  "term2k-eg-p63-explus-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "not more than"
    ]
  },
  "term2k-eg-p63-explus-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "no more than"
    ]
  },
  "term2k-eg-p63-explus-4-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "The puppy is no bigger than this doll."
    ]
  },
  "term2k-eg-p63-explus-4-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I am no more busy than you are."
    ]
  },
  "term2k-eg-p63-explus-4-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "no less valuable than our own lives are",
          "The lives of animals are no less valuable than our own lives are."
    ]
  },
  "term2k-eg-p64-fe-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "much"
    ]
  },
  "term2k-eg-p64-fe-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the taller"
    ]
  },
  "term2k-eg-p64-fe-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "more"
    ]
  },
  "term2k-eg-p64-fe-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "no more than"
    ]
  },
  "term2k-eg-p64-fe-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to"
    ]
  },
  "term2k-eg-p64-fe-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as friendly a person"
    ]
  },
  "term2k-eg-p64-fe-1-7": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more and more"
    ]
  },
  "term2k-eg-p64-fe-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "The more we practiced, the stronger we became."
    ]
  },
  "term2k-eg-p64-fe-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "The weather was much better than we expected."
    ]
  },
  "term2k-eg-p64-fe-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Tokyo is one of the most crowded cities in the world."
    ]
  },
  "term2k-eg-p64-fe-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I don't drink as much coffee as my father does."
    ]
  },
  "term2k-eg-p64-fe-2-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Nothing is whiter than snow."
    ]
  },
  "term2k-eg-p64-fe-2-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He worked hard not so much for himself as for his family."
    ]
  },
  "term2k-eg-p64-fe-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "could"
    ]
  },
  "term2k-eg-p64-fe-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "inferior to"
    ]
  },
  "term2k-eg-p64-fe-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "than any other",
          "than every other"
    ]
  },
  "term2k-eg-p64-fe-3-4b": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "older"
    ]
  },
  "term2k-eg-p64-fe-3-4c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "less"
    ]
  },
  "term2k-eg-p64-fe-3-4d": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as young as",
          "so young as"
    ]
  },
  "term2k-eg-p65-fe-3-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "better than"
    ]
  },
  "term2k-eg-p65-fe-3-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "no less"
    ]
  },
  "term2k-eg-p65-fe-4-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "least"
    ]
  },
  "term2k-eg-p65-fe-4-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "many books can"
    ]
  },
  "term2k-eg-p65-fe-4-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the fifth tallest"
    ]
  },
  "term2k-eg-p65-fe-4-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "better better"
    ]
  },
  "term2k-eg-p65-fe-4-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "No other beautiful"
    ]
  },
  "term2k-eg-p65-fe-4-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the very"
    ]
  },
  "term2k-eg-p65-fe-5-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He arrived at the station earliest of",
          "He arrived at the station the earliest of"
    ]
  },
  "term2k-eg-p65-fe-5-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as old as Ann",
          "as old as Ann is",
          "as old as she is"
    ]
  },
  "term2k-eg-p65-fe-5-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "three years older than my father",
          "older than my father by three years",
          "three years older than my father is"
    ]
  },
  "term2k-eg-p65-fe-5-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "twice as many watches as I do",
          "twice as many watches as I have",
          "twice as many as I do",
          "two times as many watches as I do",
          "twice as many watches as I"
    ]
  },
  "term2k-eg-p65-fe-6-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "駅に行くのにかかる時間は、せいぜい5分だ。",
          "駅に着くのに多くても5分だ。"
    ]
  },
  "term2k-eg-p65-fe-6-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "私は毎日少なくとも3杯の紅茶を飲む。",
          "私は毎日3杯は紅茶を飲む。"
    ]
  },
  "term2k-eg-p65-fe-6-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "今日はとても暑い。気温は38度もある。"
    ]
  },
  "term2k-eg-p65-fe-6-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "私の携帯電話は卵と同じ程度の重さしかない。",
          "私の携帯電話は卵ほどの重さしかない。"
    ]
  },
  "term2k-wb-p48-l18-s1-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "wearing"
    ]
  },
  "term2k-wb-p48-l18-s1-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "living"
    ]
  },
  "term2k-wb-p48-l18-s1-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "caught"
    ]
  },
  "term2k-wb-p48-l18-s1-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "sleeping"
    ]
  },
  "term2k-wb-p48-l18-s1-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "hidden"
    ]
  },
  "term2k-wb-p48-l18-s1-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "lying"
    ]
  },
  "term2k-wb-p48-l18-s1-1-7": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "boiled"
    ]
  },
  "term2k-wb-p48-l18-s1-1-8": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "taken"
    ]
  },
  "term2k-wb-p48-l18-s1-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "waiting"
    ]
  },
  "term2k-wb-p48-l18-s1-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "closed",
          "shut"
    ]
  },
  "term2k-wb-p48-l18-s1-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "covered"
    ]
  },
  "term2k-wb-p48-l18-s1-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "surrounded"
    ]
  },
  "term2k-wb-p48-l18-s1-2-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "interested in"
    ]
  },
  "term2k-wb-p48-l18-s1-2-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "ringing"
    ]
  },
  "term2k-wb-p49-l18-s2-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "あそこに立っている女の子は私のいとこです。"
    ]
  },
  "term2k-wb-p49-l18-s2-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "フェンスに囲まれたあの家が見えますか。"
    ]
  },
  "term2k-wb-p49-l18-s2-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "医者は私を隣の部屋で待たせておいた。"
    ]
  },
  "term2k-wb-p49-l18-s2-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "割れたグラスはテーブルの上にあります。"
    ]
  },
  "term2k-wb-p49-l18-s2-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "ドアは鍵をかけたままにしておいたほうがよい。"
    ]
  },
  "term2k-wb-p49-l18-s2-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "The price of the camera remained unchanged for a long time."
    ]
  },
  "term2k-wb-p49-l18-s2-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "They stood looking at each other for a moment."
    ]
  },
  "term2k-wb-p49-l18-s2-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "The mayor came surrounded by many reporters.",
          "Surrounded by many reporters, the mayor came."
    ]
  },
  "term2k-wb-p49-l18-s2-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I was satisfied with the special dinner prepared by my mother."
    ]
  },
  "term2k-wb-p49-l18-s2-2-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Add some salt to the boiling water."
    ]
  },
  "term2k-wb-p49-l18-s2-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "standing in the rain"
    ]
  },
  "term2k-wb-p49-l18-s2-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "bought at this store",
          "bought in this store"
    ]
  },
  "term2k-wb-p49-l18-s2-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "running in the park"
    ]
  },
  "term2k-wb-p49-l18-s2-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "exciting news"
    ]
  },
  "term2k-wb-p49-l18-s2-3-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "advanced",
    "accepted": [
          "tomorrow's meeting finished",
          "the meeting finished tomorrow",
          "the meeting tomorrow finished",
          "tomorrow's meeting to be finished",
          "the meeting to be finished tomorrow"
    ]
  },
  "term2k-wb-p50-l19-s1-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "shined"
    ]
  },
  "term2k-wb-p50-l19-s1-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "stolen"
    ]
  },
  "term2k-wb-p50-l19-s1-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "running"
    ]
  },
  "term2k-wb-p50-l19-s1-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "changing"
    ]
  },
  "term2k-wb-p50-l19-s1-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "understood"
    ]
  },
  "term2k-wb-p50-l19-s1-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "called"
    ]
  },
  "term2k-wb-p50-l19-s1-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "watching"
    ]
  },
  "term2k-wb-p50-l19-s1-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Being",
          "being"
    ]
  },
  "term2k-wb-p50-l19-s1-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Made"
    ]
  },
  "term2k-wb-p50-l19-s1-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Not knowing my new address, he asked me for it."
    ]
  },
  "term2k-wb-p51-l19-s1-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Waking up, I heard my mother talking on the phone.",
          "On waking up, I heard my mother talking on the phone.",
          "When waking up, I heard my mother talking on the phone."
    ]
  },
  "term2k-wb-p51-l19-s1-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He had lunch in a hurry, going back to work quickly."
    ]
  },
  "term2k-wb-p51-l19-s1-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Cleaning her room, she found an old picture of her husband.",
          "While cleaning her room, she found an old picture of her husband."
    ]
  },
  "term2k-wb-p51-l19-s1-3-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Climbing slowly, we finally reached the top of Mt. Fuji."
    ]
  },
  "term2k-wb-p51-l19-s1-3-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Born and raised in that area, I often enjoyed winter sports there.",
          "Being born and raised in that area, I often enjoyed winter sports there."
    ]
  },
  "term2k-wb-p51-l19-s2-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "ひとりごとを言いながら、彼は部屋に入ってきた。"
    ]
  },
  "term2k-wb-p51-l19-s2-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "その講義に興味がなかったので、私は眠くなった。"
    ]
  },
  "term2k-wb-p51-l19-s2-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "公園を歩いているとき、その作家は新しい考えをいくつか思いついた。"
    ]
  },
  "term2k-wb-p51-l19-s2-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "さよならを言って、彼女は立ち去った。"
    ]
  },
  "term2k-wb-p51-l19-s2-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I often leave my music playing while I'm reading.",
          "Often I leave my music playing while I'm reading."
    ]
  },
  "term2k-wb-p51-l19-s2-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I heard my sister singing in her room."
    ]
  },
  "term2k-wb-p51-l19-s2-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He had his leg broken in the game."
    ]
  },
  "term2k-wb-p51-l19-s2-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "In the noisy room, I was not able to make myself heard."
    ]
  },
  "term2k-wb-p51-l19-s2-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "She felt her coat pulled",
          "She felt her coat being pulled"
    ]
  },
  "term2k-wb-p51-l19-s2-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "We watched him playing the piano",
          "We watched him play the piano"
    ]
  },
  "term2k-wb-p51-l19-s2-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Mika had lunch brought to her room",
          "Mika had her lunch brought to her room"
    ]
  },
  "term2k-wb-p52-plus-s1-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Having played"
    ]
  },
  "term2k-wb-p52-plus-s1-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Having visited"
    ]
  },
  "term2k-wb-p52-plus-s1-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "having"
    ]
  },
  "term2k-wb-p52-plus-s1-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "studying"
    ]
  },
  "term2k-wb-p52-plus-s1-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Judging from"
    ]
  },
  "term2k-wb-p52-plus-s1-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Generally speaking"
    ]
  },
  "term2k-wb-p52-plus-s1-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Frankly speaking",
          "Speaking frankly",
          "Frankly speaking,"
    ]
  },
  "term2k-wb-p52-plus-s1-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "Speaking of painting",
          "Speaking of paintings",
          "Talking of painting",
          "Talking of paintings"
    ]
  },
  "term2k-wb-p52-plus-s1-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "She felt secure with her brother standing by her."
    ]
  },
  "term2k-wb-p52-plus-s1-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I can't sleep with this noise going on."
    ]
  },
  "term2k-wb-p52-plus-s1-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "My father was listening to music with his eyes closed."
    ]
  },
  "term2k-wb-p53-plus-s1-4-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "There competing"
    ]
  },
  "term2k-wb-p53-plus-s1-4-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "There left"
    ]
  },
  "term2k-wb-p53-plus-s1-4-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "went skating"
    ]
  },
  "term2k-wb-p53-plus-s1-4-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "busy working"
    ]
  },
  "term2k-wb-p53-plus-s2-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Having read the news on the Internet, I know the singer got married."
    ]
  },
  "term2k-wb-p53-plus-s2-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Speaking of the singer, do you know how old she is?"
    ]
  },
  "term2k-wb-p53-plus-s2-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "My sister was sitting on the sofa with her legs crossed."
    ]
  },
  "term2k-wb-p53-plus-s2-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "It being Friday night, I stayed up late."
    ]
  },
  "term2k-wb-p53-plus-s2-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "When fishing at the riverside, I fell into the river."
    ]
  },
  "term2k-wb-p53-plus-s2-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "advanced",
    "accepted": [
          "watched the movie with her eyes shining",
          "saw the movie with her eyes shining"
    ]
  },
  "term2k-wb-p53-plus-s2-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Frankly speaking, I didn't like",
          "Frankly speaking, I did not like",
          "Speaking frankly, I didn't like"
    ]
  },
  "term2k-wb-p53-plus-s2-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I went skiing in Akita"
    ]
  },
  "term2k-wb-p53-plus-s2-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "My brother is busy preparing for",
          "My little brother is busy preparing for",
          "My younger brother is busy preparing for"
    ]
  },
  "term2k-wb-p54-fe-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "talking"
    ]
  },
  "term2k-wb-p54-fe-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "going"
    ]
  },
  "term2k-wb-p54-fe-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to enter"
    ]
  },
  "term2k-wb-p54-fe-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to become"
    ]
  },
  "term2k-wb-p54-fe-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "playing"
    ]
  },
  "term2k-wb-p54-fe-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "my"
    ]
  },
  "term2k-wb-p54-fe-1-7": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "interesting"
    ]
  },
  "term2k-wb-p54-fe-1-8": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "excited"
    ]
  },
  "term2k-wb-p54-fe-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "making"
    ]
  },
  "term2k-wb-p54-fe-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to bake"
    ]
  },
  "term2k-wb-p54-fe-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "seated"
    ]
  },
  "term2k-wb-p54-fe-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "talking"
    ]
  },
  "term2k-wb-p54-fe-2-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "understood"
    ]
  },
  "term2k-wb-p54-fe-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "used to speaking",
          "accustomed to speaking"
    ]
  },
  "term2k-wb-p54-fe-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "forward to visiting"
    ]
  },
  "term2k-wb-p54-fe-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "use talking",
          "good talking"
    ]
  },
  "term2k-wb-p54-fe-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "like taking"
    ]
  },
  "term2k-wb-p54-fe-3-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "happened to meet",
          "happened to see",
          "chanced to meet",
          "chanced to see"
    ]
  },
  "term2k-wb-p54-fe-4-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "of to make"
    ]
  },
  "term2k-wb-p54-fe-4-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to have been"
    ]
  },
  "term2k-wb-p54-fe-4-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "to be feeling"
    ]
  },
  "term2k-wb-p54-fe-4-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as to"
    ]
  },
  "term2k-wb-p54-fe-4-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "too for to"
    ]
  },
  "term2k-wb-p55-fe-5-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I'm sure of Sarah's succeeding as a singer.",
          "I'm sure of Sarah succeeding as a singer.",
          "I'm sure of her succeeding as a singer."
    ]
  },
  "term2k-wb-p55-fe-5-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Being interested in Japanese culture, John has visited Japan several times.",
          "Interested in Japanese culture, John has visited Japan several times."
    ]
  },
  "term2k-wb-p55-fe-5-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He is made to wash the dishes after dinner by his parents.",
          "He is made to wash the dishes by his parents after dinner."
    ]
  },
  "term2k-wb-p55-fe-6-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "My brother wants me to help him with his homework."
    ]
  },
  "term2k-wb-p55-fe-6-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Tom's parents tell him not to bother others."
    ]
  },
  "term2k-wb-p55-fe-6-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I turned down the music in order not to wake my sister up."
    ]
  },
  "term2k-wb-p55-fe-6-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "When I was a little child, I had no friends to play with."
    ]
  },
  "term2k-wb-p55-fe-6-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "You are old enough to decide for yourself."
    ]
  },
  "term2k-wb-p55-fe-6-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Kate saw a stranger running away from the scene of the crime."
    ]
  },
  "term2k-wb-p55-fe-6-7": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Joe's classmates stopped him from leaving school."
    ]
  },
  "term2k-wb-p55-fe-7-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "私は教室に駆け込んだが、結局だれもいなかった。"
    ]
  },
  "term2k-wb-p55-fe-7-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "私たちはこのカーペットをクリーニングしてもらうべきだ。"
    ]
  },
  "term2k-wb-p55-fe-7-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "忘れずにシャンプーを買いましたか。"
    ]
  },
  "term2k-wb-p55-fe-7-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "3か月前にここで私に会ったことを覚えていますか。"
    ]
  },
  "term2k-wb-p56-check-1-1c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "higher"
    ]
  },
  "term2k-wb-p56-check-1-1s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "highest"
    ]
  },
  "term2k-wb-p56-check-1-2c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "shorter"
    ]
  },
  "term2k-wb-p56-check-1-2s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "shortest"
    ]
  },
  "term2k-wb-p56-check-1-3c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "older"
    ]
  },
  "term2k-wb-p56-check-1-3s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "oldest"
    ]
  },
  "term2k-wb-p56-check-1-4c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "longer"
    ]
  },
  "term2k-wb-p56-check-1-4s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "longest"
    ]
  },
  "term2k-wb-p56-check-1-5c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "larger"
    ]
  },
  "term2k-wb-p56-check-1-5s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "largest"
    ]
  },
  "term2k-wb-p56-check-1-6c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "smarter"
    ]
  },
  "term2k-wb-p56-check-1-6s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "smartest"
    ]
  },
  "term2k-wb-p56-check-1-7c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "earlier"
    ]
  },
  "term2k-wb-p56-check-1-7s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "earliest"
    ]
  },
  "term2k-wb-p56-check-1-8c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "colder"
    ]
  },
  "term2k-wb-p56-check-1-8s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "coldest"
    ]
  },
  "term2k-wb-p56-check-1-9c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more tired"
    ]
  },
  "term2k-wb-p56-check-1-9s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "most tired"
    ]
  },
  "term2k-wb-p56-check-1-10c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more surprising"
    ]
  },
  "term2k-wb-p56-check-1-10s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "most surprising"
    ]
  },
  "term2k-wb-p56-check-1-11c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more interested"
    ]
  },
  "term2k-wb-p56-check-1-11s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "most interested"
    ]
  },
  "term2k-wb-p56-check-1-12c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more quickly"
    ]
  },
  "term2k-wb-p56-check-1-12s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "most quickly"
    ]
  },
  "term2k-wb-p56-check-1-13c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more famous"
    ]
  },
  "term2k-wb-p56-check-1-13s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "most famous"
    ]
  },
  "term2k-wb-p56-check-1-14c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more careful"
    ]
  },
  "term2k-wb-p56-check-1-14s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "most careful"
    ]
  },
  "term2k-wb-p56-check-1-15c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "better"
    ]
  },
  "term2k-wb-p56-check-1-15s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "best"
    ]
  },
  "term2k-wb-p56-check-1-16c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more"
    ]
  },
  "term2k-wb-p56-check-1-16s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "most"
    ]
  },
  "term2k-wb-p56-check-1-17c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "better"
    ]
  },
  "term2k-wb-p56-check-1-17s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "best"
    ]
  },
  "term2k-wb-p56-check-1-18c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more"
    ]
  },
  "term2k-wb-p56-check-1-18s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "most"
    ]
  },
  "term2k-wb-p56-check-1-19c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "worse"
    ]
  },
  "term2k-wb-p56-check-1-19s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "worst"
    ]
  },
  "term2k-wb-p56-check-1-20c": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "less"
    ]
  },
  "term2k-wb-p56-check-1-20s": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "least"
    ]
  },
  "term2k-wb-p56-check-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "as large as"
    ]
  },
  "term2k-wb-p56-check-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "as kind as"
    ]
  },
  "term2k-wb-p56-check-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "as slowly as"
    ]
  },
  "term2k-wb-p56-check-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "as hard as"
    ]
  },
  "term2k-wb-p56-check-2-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "as many as"
    ]
  },
  "term2k-wb-p56-check-2-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "as much as"
    ]
  },
  "term2k-wb-p57-check-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "bigger"
    ]
  },
  "term2k-wb-p57-check-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more exciting"
    ]
  },
  "term2k-wb-p57-check-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more interesting"
    ]
  },
  "term2k-wb-p57-check-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "better"
    ]
  },
  "term2k-wb-p57-check-3-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "less"
    ]
  },
  "term2k-wb-p57-check-4-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the most important"
    ]
  },
  "term2k-wb-p57-check-4-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the deepest"
    ]
  },
  "term2k-wb-p57-check-4-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "hardest",
          "the hardest"
    ]
  },
  "term2k-wb-p57-check-4-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "earliest",
          "the earliest"
    ]
  },
  "term2k-wb-p57-check-4-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the most valuable"
    ]
  },
  "term2k-wb-p57-check-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "as difficult as"
    ]
  },
  "term2k-wb-p57-check-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "younger than"
    ]
  },
  "term2k-wb-p57-check-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the widest",
          "the broadest"
    ]
  },
  "term2k-wb-p57-check-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "fastest",
          "the fastest"
    ]
  },
  "term2k-wb-p57-check-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the most popular"
    ]
  },
  "term2k-wb-p58-l20-s1-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as tall"
    ]
  },
  "term2k-wb-p58-l20-s1-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "not young"
    ]
  },
  "term2k-wb-p58-l20-s1-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as much milk"
    ]
  },
  "term2k-wb-p58-l20-s1-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "twice long"
    ]
  },
  "term2k-wb-p58-l20-s1-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "soon can",
          "quickly can"
    ]
  },
  "term2k-wb-p58-l20-s1-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "many movies as"
    ]
  },
  "term2k-wb-p58-l20-s1-1-7": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as easy a test"
    ]
  },
  "term2k-wb-p58-l20-s1-2a-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "better"
    ]
  },
  "term2k-wb-p58-l20-s1-2a-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "faster"
    ]
  },
  "term2k-wb-p58-l20-s1-2a-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "more difficult"
    ]
  },
  "term2k-wb-p58-l20-s1-2a-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "not colder"
    ]
  },
  "term2k-wb-p58-l20-s1-2a-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "not more expensive"
    ]
  },
  "term2k-wb-p58-l20-s1-2b-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Your car is much bigger than mine."
    ]
  },
  "term2k-wb-p58-l20-s1-2b-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "This song is less familiar than the others."
    ]
  },
  "term2k-wb-p59-l20-s1-2b-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "That sumo wrestler looks one hundred kilograms heavier than my son."
    ]
  },
  "term2k-wb-p59-l20-s1-2b-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "His second movie is far more interesting than his first one."
    ]
  },
  "term2k-wb-p59-l20-s1-2b-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Tokyo Skytree is higher than Tokyo Tower by about 300 meters.",
          "Tokyo Skytree is higher by about 300 meters than Tokyo Tower."
    ]
  },
  "term2k-wb-p59-l20-s2-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "You should keep the wound as clean as possible."
    ]
  },
  "term2k-wb-p59-l20-s2-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Reply to the letter as soon as you can.",
          "As soon as you can, reply to the letter."
    ]
  },
  "term2k-wb-p59-l20-s2-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "My new job is not harder than my old one."
    ]
  },
  "term2k-wb-p59-l20-s2-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He is wearing a watch more expensive than mine.",
          "He is wearing a more expensive watch than mine."
    ]
  },
  "term2k-wb-p59-l20-s2-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "My sister drives less carefully than my mother."
    ]
  },
  "term2k-wb-p59-l20-s2-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Japanese history is much more interesting for me than science.",
          "Japanese history is much more interesting than science for me.",
          "For me Japanese history is much more interesting than science."
    ]
  },
  "term2k-wb-p59-l20-s2-1-7": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "My temperature was two degrees higher than usual."
    ]
  },
  "term2k-wb-p59-l20-s2-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "three times as large as that stadium",
          "three times as large as that one",
          "three times as big as that stadium"
    ]
  },
  "term2k-wb-p59-l20-s2-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "is not as popular as",
          "is not so popular as",
          "isn't as popular as",
          "isn't so popular as",
          "is less popular than American"
    ]
  },
  "term2k-wb-p59-l20-s2-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "half as many pictures as",
          "half as many photos as"
    ]
  },
  "term2k-wb-p59-l20-s2-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "is much milder than",
          "is far milder than",
          "is a lot milder than"
    ]
  },
  "term2k-wb-p60-l21-s1-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the tallest in"
    ]
  },
  "term2k-wb-p60-l21-s1-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the shortest of"
    ]
  },
  "term2k-wb-p60-l21-s1-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the most expensive in"
    ]
  },
  "term2k-wb-p60-l21-s1-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the earliest in"
    ]
  },
  "term2k-wb-p60-l21-s1-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the best of"
    ]
  },
  "term2k-wb-p60-l21-s1-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "most fluently of"
    ]
  },
  "term2k-wb-p60-l21-s1-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "much the worst",
          "by far the worst",
          "far the worst"
    ]
  },
  "term2k-wb-p60-l21-s1-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "one of the funniest"
    ]
  },
  "term2k-wb-p60-l21-s1-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the second smallest"
    ]
  },
  "term2k-wb-p60-l21-s1-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the least expensive",
          "the cheapest"
    ]
  },
  "term2k-wb-p61-l21-s1-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "other book thicker"
    ]
  },
  "term2k-wb-p61-l21-s1-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "larger any other"
    ]
  },
  "term2k-wb-p61-l21-s1-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as hard as",
          "so hard as"
    ]
  },
  "term2k-wb-p61-l21-s1-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Nothing"
    ]
  },
  "term2k-wb-p61-l21-s2-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "My mother is the most talkative in my family."
    ]
  },
  "term2k-wb-p61-l21-s2-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Nobody else plays the guitar as well as he does."
    ]
  },
  "term2k-wb-p61-l21-s2-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He said I was the least excited person at the party."
    ]
  },
  "term2k-wb-p61-l21-s2-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Ramen is more popular than any other food among students."
    ]
  },
  "term2k-wb-p61-l21-s2-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "He swims by far the fastest in this class.",
          "He swims the fastest in this class by far."
    ]
  },
  "term2k-wb-p61-l21-s2-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "No other planet is bigger than Jupiter."
    ]
  },
  "term2k-wb-p61-l21-s2-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the most difficult of all",
          "the most difficult of them all",
          "the most difficult"
    ]
  },
  "term2k-wb-p61-l21-s2-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "one of the most successful movies",
          "one of the most successful films"
    ]
  },
  "term2k-wb-p61-l21-s2-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Nothing is better"
    ]
  },
  "term2k-wb-p61-l21-s2-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the third largest lake in Japan",
          "the third-largest lake in Japan"
    ]
  },
  "term2k-wb-p62-plus-s1-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "the larger of"
    ]
  },
  "term2k-wb-p62-plus-s1-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "senior to"
    ]
  },
  "term2k-wb-p62-plus-s1-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "superior"
    ]
  },
  "term2k-wb-p62-plus-s1-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "not so much"
    ]
  },
  "term2k-wb-p62-plus-s1-1b-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "そのニュースは興味深いというよりむしろ衝撃的だった。"
    ]
  },
  "term2k-wb-p62-plus-s1-1b-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "最近、天気はだんだん涼しくなってきている。"
    ]
  },
  "term2k-wb-p62-plus-s1-1b-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "starter",
    "accepted": [
          "ピアノを練習すればするほど、ますます上手になるでしょう。"
    ]
  },
  "term2k-wb-p62-plus-s1-2a-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Today's test was no more difficult than yesterday's."
    ]
  },
  "term2k-wb-p62-plus-s1-2a-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Getting enough rest is no less important than working hard."
    ]
  },
  "term2k-wb-p62-plus-s1-2a-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "This tablet PC is no heavier than a magazine."
    ]
  },
  "term2k-wb-p63-plus-s1-2b-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "no more than"
    ]
  },
  "term2k-wb-p63-plus-s1-2b-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "not more than"
    ]
  },
  "term2k-wb-p63-plus-s1-2b-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "no less than"
    ]
  },
  "term2k-wb-p63-plus-s1-2b-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "not less than"
    ]
  },
  "term2k-wb-p63-plus-s2-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Bob is not so much a singer as a poet."
    ]
  },
  "term2k-wb-p63-plus-s2-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Jimmy's behavior was more childish than bad."
    ]
  },
  "term2k-wb-p63-plus-s2-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "This cell phone is inferior to that one in sound quality."
    ]
  },
  "term2k-wb-p63-plus-s2-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I am no more fluent in English than he is."
    ]
  },
  "term2k-wb-p63-plus-s2-1-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Keita spent no less than 50,000 yen for clothes last month."
    ]
  },
  "term2k-wb-p63-plus-s2-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "I drink not less than three cups of coffee every day."
    ]
  },
  "term2k-wb-p63-plus-s2-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "blowing harder and harder"
    ]
  },
  "term2k-wb-p63-plus-s2-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "The earlier you book, the cheaper",
          "The sooner you book, the cheaper"
    ]
  },
  "term2k-wb-p63-plus-s2-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "no less diligent than the other students",
          "no less diligent than any other student",
          "no less diligent than the others"
    ]
  },
  "term2k-wb-p63-plus-s2-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the more expensive of the two coats",
          "the more expensive coat of the two"
    ]
  },
  "term2k-wb-p64-fe-1-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "cannot as well as",
          "can't as well as",
          "can not as well as",
          "cannot so well as",
          "can't so well as"
    ]
  },
  "term2k-wb-p64-fe-1-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as possible"
    ]
  },
  "term2k-wb-p64-fe-1-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "easier than",
          "simpler than"
    ]
  },
  "term2k-wb-p64-fe-1-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "worst of",
          "poorest of"
    ]
  },
  "term2k-wb-p64-fe-1-5a": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the highest",
          "the tallest"
    ]
  },
  "term2k-wb-p64-fe-1-5b": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the second highest",
          "the second tallest"
    ]
  },
  "term2k-wb-p64-fe-1-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "one of the best",
          "one of the finest",
          "one of the greatest"
    ]
  },
  "term2k-wb-p64-fe-1-7": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the least"
    ]
  },
  "term2k-wb-p64-fe-2-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "thirty minutes earlier"
    ]
  },
  "term2k-wb-p64-fe-2-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "No more than",
          "no more than"
    ]
  },
  "term2k-wb-p64-fe-2-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "no less than"
    ]
  },
  "term2k-wb-p64-fe-2-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "less difficult"
    ]
  },
  "term2k-wb-p64-fe-3-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "No other lake in Japan is as large as Lake Biwa.",
          "No lake in Japan is as large as Lake Biwa.",
          "No other lake in Japan is so large as Lake Biwa.",
          "No lake in Japan is so large as Lake Biwa.",
          "No other lake in Japan is as big as Lake Biwa.",
          "No lake in Japan is as big as Lake Biwa."
    ]
  },
  "term2k-wb-p64-fe-3-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "No other prefecture in Japan is smaller than Kagawa.",
          "No prefecture in Japan is smaller than Kagawa."
    ]
  },
  "term2k-wb-p64-fe-3-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "The Tone River is longer than any other river in the Kanto region."
    ]
  },
  "term2k-wb-p64-fe-3-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Nothing is more important than honesty."
    ]
  },
  "term2k-wb-p64-fe-3-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Today is much hotter than yesterday.",
          "Today is far hotter than yesterday.",
          "Today is a lot hotter than yesterday."
    ]
  },
  "term2k-wb-p64-fe-3-6": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Tokyo Skytree is by far the highest tower in Japan.",
          "Tokyo Skytree is much the highest tower in Japan."
    ]
  },
  "term2k-wb-p65-fe-4-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "My grandmother drinks as much tea as my mother."
    ]
  },
  "term2k-wb-p65-fe-4-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Richie has grown up, and he is not as innocent as he used to be."
    ]
  },
  "term2k-wb-p65-fe-4-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "Children there eat only half as much food as they need."
    ]
  },
  "term2k-wb-p65-fe-4-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "The younger you are, the easier it is to learn a foreign language."
    ]
  },
  "term2k-wb-p65-fe-4-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "This bike is the cheaper of the two."
    ]
  },
  "term2k-wb-p65-fe-5-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "私たちの学校はあなたの学校より古いということはない。"
    ]
  },
  "term2k-wb-p65-fe-5-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "アンは自分の2倍の年齢の人たちと話すのを楽しんだ。"
    ]
  },
  "term2k-wb-p65-fe-5-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "私は紅茶よりコーヒーのほうが好きだ。"
    ]
  },
  "term2k-wb-p65-fe-5-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "世界はますます小さくなってきている。"
    ]
  },
  "term2k-wb-p65-fe-5-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "彼のふるまいは楽しいというよりむしろ愚かだった。"
    ]
  },
  "term2k-wb-p65-fe-6-1": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "the biggest"
    ]
  },
  "term2k-wb-p65-fe-6-2": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "bigger than"
    ]
  },
  "term2k-wb-p65-fe-6-3": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "more crowded than"
    ]
  },
  "term2k-wb-p65-fe-6-4": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "as warm-hearted as"
    ]
  },
  "term2k-wb-p65-fe-6-5": {
    "course": "regular-english-practice-2kimatsu",
    "difficulty": "standard",
    "accepted": [
          "not less than"
    ]
  },
  // TERM_FINAL_QUESTION_REGISTRY_END
}

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {}
  if ((params.action || 'leaderboard') !== 'leaderboard') return json_({ ok: false, reason: 'post-required' }, params.callback)
  return getLeaderboard_(cleanCourse_(params.course) || COURSE_NAME, cleanPoolId_(params.poolId), params.name, params.authToken, params.callback)
}

function doPost(e) {
  const params = e && e.parameter ? e.parameter : {}
  try {
    const action = params.action || 'leaderboard'
    if (action === 'register') return registerPlayer_(params)
    if (action === 'login') return loginPlayer_(params)
    if (action === 'session') return sessionPlayer_(params)
    if (action === 'update-profile') return updatePlayerProfile_(params)
    if (action === 'unlock-theme') return unlockTheme_(params)
    if (action === 'answer') return recordAnswer_(params)
    if (action === 'admin-auth') return adminAuth_(params)
    if (action === 'admin-search') return adminSearch_(params)
    if (action === 'admin-ranking') return adminRanking_(params)
    if (action === 'admin-delete-preview') return adminDeletePreview_(params)
    if (action === 'admin-delete-account') return adminDeleteAccount_(params)
    if (action === 'admin-set-rating') return adminSetRating_(params)
    return getLeaderboard_(cleanCourse_(params.course) || COURSE_NAME, cleanPoolId_(params.poolId), params.name, params.authToken, params.callback)
  } catch (error) {
    const message = String(error && error.message || error || '')
    const retryable = isTransientBackendError_(message)
    console.error(message)
    return json_({ ok: false, reason: retryable ? 'server-busy' : 'server-error', retryable }, params.callback)
  }
}

function adminPasswordHash_(salt, password) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(salt) + ':' + String(password), Utilities.Charset.UTF_8)
  return Utilities.base64EncodeWebSafe(digest)
}

function adminCacheKey_(token) {
  return 'admin-session:' + String(token || '')
}

function adminCredentialVersion_() {
  const properties = PropertiesService.getScriptProperties()
  const salt = properties.getProperty('ADMIN_PASSWORD_SALT')
  const hash = properties.getProperty('ADMIN_PASSWORD_HASH')
  return salt && hash ? adminPasswordHash_(salt, hash) : ''
}

function adminAuth_(params) {
  const name = cleanName_(params.name)
  const playerToken = String(params.authToken || '')
  const password = String(params.password || '')
  if (!name || !playerToken || password.length < 8 || password.length > 128) return json_({ ok: false, reason: 'invalid-input' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const { players } = getRuntimeSheets_(getBook_())
    const auth = authenticate_(players, name, playerToken)
    if (!auth || auth.playerKey !== keyFor_('おとめ座')) return json_({ ok: false, reason: 'admin-forbidden' }, params.callback)

    const properties = PropertiesService.getScriptProperties()
    const cache = CacheService.getScriptCache()
    const attemptsKey = 'admin-attempts:' + auth.playerKey
    const attempts = Number(cache.get(attemptsKey)) || 0
    if (attempts >= 5) return json_({ ok: false, reason: 'admin-rate-limited' }, params.callback)

    let salt = properties.getProperty('ADMIN_PASSWORD_SALT')
    let storedHash = properties.getProperty('ADMIN_PASSWORD_HASH')
    if (!salt && !storedHash) {
      salt = Utilities.getUuid()
      storedHash = adminPasswordHash_(salt, password)
      properties.setProperties({ ADMIN_PASSWORD_SALT: salt, ADMIN_PASSWORD_HASH: storedHash })
    } else if (!salt || !storedHash) {
      return json_({ ok: false, reason: 'admin-not-configured' }, params.callback)
    } else if (adminPasswordHash_(salt, password) !== storedHash) {
      cache.put(attemptsKey, String(attempts + 1), 600)
      return json_({ ok: false, reason: attempts + 1 >= 5 ? 'admin-rate-limited' : 'admin-password-wrong' }, params.callback)
    }

    cache.remove(attemptsKey)
    const adminToken = Utilities.getUuid()
    cache.put(adminCacheKey_(adminToken), JSON.stringify({ playerKey: auth.playerKey, authHash: tokenHashFor_(playerToken, auth.playerKey), credentialVersion: adminCredentialVersion_() }), 900)
    return json_({ ok: true, adminToken, expiresInSeconds: 900 }, params.callback)
  } finally {
    lock.releaseLock()
  }
}

function authenticatedAdmin_(players, params) {
  const name = cleanName_(params.name)
  const playerToken = String(params.authToken || '')
  const auth = authenticate_(players, name, playerToken)
  if (!auth || auth.playerKey !== keyFor_('おとめ座')) return null
  const cached = CacheService.getScriptCache().get(adminCacheKey_(params.adminToken))
  if (!cached) return null
  try {
    const session = JSON.parse(cached)
    if (session.playerKey !== auth.playerKey || session.authHash !== tokenHashFor_(playerToken, auth.playerKey)) return null
    const credentialVersion = adminCredentialVersion_()
    if (!credentialVersion || session.credentialVersion !== credentialVersion) return null
    return auth
  } catch (error) {
    return null
  }
}

function adminSearch_(params) {
  const book = getBook_()
  const { players, poolProfiles } = getRuntimeSheets_(book)
  const admin = authenticatedAdmin_(players, params)
  if (!admin) return json_({ ok: false, reason: 'admin-session-required', students: [] }, params.callback)
  const query = String(params.query || '').trim().toLowerCase()
  if (query.length < 2) return json_({ ok: false, reason: 'query-too-short', students: [] }, params.callback)

  const playerRows = players.getDataRange().getValues().slice(1)
  const profileRows = poolProfiles.getDataRange().getValues().slice(1)
  const students = playerRows.filter((row) => row[0] && row[1] && !row[11] && [row[0], row[1], row[7], row[8]].some((value) => String(value || '').toLowerCase().includes(query)))
    .slice(0, 25)
    .map((row) => {
      const playerKey = String(row[0])
      const ratings = profileRows.filter((profile) => String(profile[0]) === playerKey).map((profile) => ({
        course: String(profile[1] || ''),
        poolId: String(profile[2] || ''),
        rating: Number(profile[3]) || RATING_MIN,
        answered: Number(profile[4]) || 0,
      }))
      return {
        name: String(row[1]),
        grade: cleanGrade_(row[7]),
        className: cleanClassName_(row[8]),
        foundationMember: String(row[9] || '').toLowerCase() === 'true',
        pools: playerPools_(row),
        ratings,
      }
    })
  return json_({ ok: true, students }, params.callback)
}

// Teacher-only, paginated view. Never use this response in student leaderboards.
function adminRanking_(params) {
  const { players, courseProfiles, poolProfiles } = getRuntimeSheets_(getBook_())
  if (!authenticatedAdmin_(players, params)) return json_({ ok: false, reason: 'admin-session-required', students: [] }, params.callback)
  const course = cleanCourse_(params.course)
  const grade = String(params.grade || '')
  const className = String(params.className || '')
  const query = String(params.query || '').normalize('NFKC').trim().toLowerCase()
  const pageSize = params.pageSize === undefined ? 50 : Number(params.pageSize)
  const requestedPage = params.page === undefined ? 1 : Number(params.page)
  if (!course || query.length > 80 || (grade && grade !== 'unassigned' && !ALLOWED_GRADES.includes(grade)) ||
    (className && className !== 'unassigned' && !ALLOWED_CLASSES.includes(className)) ||
    !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100 || !Number.isInteger(requestedPage) || requestedPage < 1) {
    return json_({ ok: false, reason: 'invalid-input', students: [] }, params.callback)
  }

  const poolRatings = new Map()
  const legacyRatings = new Map()
  const addProfile = (map, key, rawCourse, rawRating) => {
    if (cleanCourse_(rawCourse) !== course || rawRating === '' || rawRating == null) return
    const rating = Number(rawRating)
    if (!Number.isFinite(rating) || rating < RATING_MIN) return
    const canonical = String(rawCourse) === course
    if (!map.has(key) || canonical || !map.get(key).canonical) map.set(key, { rating, canonical })
  }
  poolProfiles.getDataRange().getValues().slice(1).forEach((row) => {
    if (row[0]) addProfile(poolRatings, String(row[0]) + '\u0000' + String(row[2]), row[1], row[3])
  })
  courseProfiles.getDataRange().getValues().slice(1).forEach((row) => {
    if (row[0]) addProfile(legacyRatings, String(row[0]), row[1], row[2])
  })
  const seen = new Set()
  const students = players.getDataRange().getValues().slice(1).filter((row) => {
    const key = String(row[0] || '')
    if (!key || !row[1] || row[11] || seen.has(key)) return false
    seen.add(key)
    return true
  }).map((row) => {
    const playerKey = String(row[0])
    const pools = playerPools_(row)
    // Regular classes use the student's own class first; foundation courses use
    // the foundation pool first. A second membership is a fallback, never a sum.
    const orderedPools = course === 'regular-english-practice'
      ? [...pools.filter((id) => id !== FOUNDATION_POOL_ID), ...pools.filter((id) => id === FOUNDATION_POOL_ID)]
      : pools
    const ratingPoolId = orderedPools.find((id) => poolRatings.has(playerKey + '\u0000' + id)) || ''
    const profile = ratingPoolId ? poolRatings.get(playerKey + '\u0000' + ratingPoolId) : legacyRatings.get(playerKey)
    return {
      name: String(row[1]), grade: cleanGrade_(row[7]), className: cleanClassName_(row[8]),
      foundationMember: String(row[9] || '').toLowerCase() === 'true',
      rating: profile ? profile.rating : null, ratingPoolId: ratingPoolId || (profile ? 'legacy' : ''), rank: null,
    }
  }).sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1) || a.name.localeCompare(b.name, 'ja'))
  let previousRating = null
  let previousRank = null
  students.forEach((student, index) => {
    if (student.rating === null) return
    student.rank = student.rating === previousRating ? previousRank : index + 1
    previousRating = student.rating
    previousRank = student.rank
  })
  // Assign ranks before filtering so searches always show the whole-course rank.
  const terms = query.split(/\s+/).filter(Boolean)
  const filtered = students.filter((student) => {
    if (grade === 'unassigned' ? student.grade : grade && student.grade !== grade) return false
    if (className === 'unassigned' ? student.className : className && student.className !== className) return false
    const haystack = [student.name, student.grade, student.className, student.grade + '-' + student.className,
      student.grade + '年' + student.className + '組'].join(' ').normalize('NFKC').toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(requestedPage, pageCount)
  return json_({
    ok: true, course, total: students.length, rankedTotal: students.filter((student) => student.rank !== null).length,
    filteredTotal: filtered.length, page, pageSize, pageCount, updatedAt: new Date().toISOString(),
    students: filtered.slice((page - 1) * pageSize, page * pageSize),
  }, params.callback)
}

function adminDeleteFingerprint_(row) {
  // Ignore answers/rating changes while confirmation is open, but reject an
  // account replacement, a fresh login, or a changed name/class placement.
  return digest_(JSON.stringify([row[0], row[1], row[5], row[6], row[7], row[8], row[9]]))
}

function adminDeletePreview_(params) {
  const { players } = getRuntimeSheets_(getBook_())
  const admin = authenticatedAdmin_(players, params)
  if (!admin) return json_({ ok: false, reason: 'admin-session-required' }, params.callback)
  const targetKey = keyFor_(cleanName_(params.targetName))
  if (targetKey === admin.playerKey) return json_({ ok: false, reason: 'owner-protected' }, params.callback)
  if (!targetKey) return json_({ ok: false, reason: 'student-not-found' }, params.callback)
  const row = players.getDataRange().getValues().slice(1).find((item) => item[0] === targetKey)
  if (!row || row[11]) return json_({ ok: false, reason: 'student-not-found' }, params.callback)
  const confirmationToken = Utilities.getUuid()
  CacheService.getScriptCache().put('admin-delete:' + confirmationToken, JSON.stringify({
    ownerKey: admin.playerKey, adminHash: tokenHashFor_(String(params.adminToken), admin.playerKey),
    targetKey, fingerprint: adminDeleteFingerprint_(row),
  }), 300)
  return json_({ ok: true, confirmationToken, expiresInSeconds: 300, student: {
    name: String(row[1]), grade: cleanGrade_(row[7]), className: cleanClassName_(row[8]),
    foundationMember: String(row[9] || '').toLowerCase() === 'true',
  } }, params.callback)
}

function adminDeleteAccount_(params) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const { players } = getRuntimeSheets_(book)
    const admin = authenticatedAdmin_(players, params)
    if (!admin) return json_({ ok: false, reason: 'admin-session-required' }, params.callback)
    const targetKey = keyFor_(cleanName_(params.targetName))
    if (targetKey === admin.playerKey) return json_({ ok: false, reason: 'owner-protected' }, params.callback)
    const reason = String(params.reason || '').trim()
    const confirmationToken = String(params.confirmationToken || '')
    if (!targetKey || !reason || reason.length > 240 || !confirmationToken || confirmationToken.length > 128) {
      return json_({ ok: false, reason: 'invalid-input' }, params.callback)
    }
    const cached = CacheService.getScriptCache().get('admin-delete:' + confirmationToken)
    let confirmation
    try { confirmation = JSON.parse(cached || 'null') } catch (error) { confirmation = null }
    if (!confirmation || confirmation.ownerKey !== admin.playerKey || confirmation.targetKey !== targetKey ||
      confirmation.adminHash !== tokenHashFor_(String(params.adminToken), admin.playerKey)) {
      return json_({ ok: false, reason: 'delete-confirmation-required' }, params.callback)
    }
    const rows = players.getDataRange().getValues()
    const index = rows.findIndex((row, rowIndex) => rowIndex > 0 && row[0] === targetKey)
    if (index < 0) return json_({ ok: false, reason: 'student-not-found' }, params.callback)
    const target = rows[index]
    if (String(params.confirmName || '') !== String(target[1])) return json_({ ok: false, reason: 'confirmation-name-mismatch' }, params.callback)
    if (target[11]) return json_({ ok: target[14] === confirmationToken, reason: target[14] === confirmationToken ? '' : 'account-already-deleted', targetName: String(target[1]), alreadyDeleted: true }, params.callback)
    if (confirmation.fingerprint !== adminDeleteFingerprint_(target)) return json_({ ok: false, reason: 'target-changed' }, params.callback)

    // Keep a recoverable record in the private book. Only the account's access
    // and visibility are removed; no rows in other students' history are moved.
    const headers = players.getRange(1, 12, 1, 4).getValues()[0]
    if (headers.some((header, offset) => header && header !== PLAYER_HEADERS[11 + offset])) return json_({ ok: false, reason: 'deletion-columns-conflict' }, params.callback)
    players.getRange(1, 12, 1, 4).setValues([PLAYER_HEADERS.slice(11)])
    const now = new Date()
    const safeText = (value) => /^[=+@-]/.test(value) ? "'" + value : value
    // Record intent before changing access. The row's deletion metadata is the
    // authoritative completion record, including the operation ID for retries.
    adminAuditSheet_(book).appendRow([now, admin.playerKey, safeText(targetKey), 'account-delete-request', 'all', 'all', 'active', confirmationToken, safeText(reason)])
    const updated = Array.from({ length: PLAYER_HEADERS.length }, (_, column) => target[column] ?? '')
    updated[6] = ''
    updated[11] = now
    updated[12] = admin.playerKey
    updated[13] = safeText(reason)
    updated[14] = confirmationToken
    players.getRange(index + 1, 1, 1, updated.length).setValues([updated])
    return json_({ ok: true, targetName: String(target[1]), deleted: true }, params.callback)
  } finally {
    lock.releaseLock()
  }
}

function adminAuditSheet_(book) {
  return book.getSheetByName('AdminAudit') || getOrCreateSheet_(book, 'AdminAudit', ADMIN_AUDIT_HEADERS)
}

function adminSetRating_(params) {
  const name = cleanName_(params.name)
  const targetName = cleanName_(params.targetName)
  const course = cleanCourse_(params.course)
  const poolId = cleanPoolId_(params.poolId)
  const reason = String(params.reason || '').trim().slice(0, 240)
  const ratingText = String(params.rating || '').trim()
  const rating = /^\d{1,7}$/.test(ratingText) ? Number(ratingText) : NaN
  if (!name || !targetName || !course || !poolId || !reason || !Number.isInteger(rating) || rating < RATING_MIN || rating > 1000000) {
    return json_({ ok: false, reason: 'invalid-input' }, params.callback)
  }

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const { players, courseProfiles, poolProfiles } = getRuntimeSheets_(book)
    const admin = authenticatedAdmin_(players, params)
    if (!admin) return json_({ ok: false, reason: 'admin-session-required' }, params.callback)
    const rows = players.getDataRange().getValues()
    const targetKey = keyFor_(targetName)
    const targetIndex = rows.findIndex((row, index) => index > 0 && String(row[0]) === targetKey)
    if (targetIndex < 0) return json_({ ok: false, reason: 'student-not-found' }, params.callback)
    const target = rows[targetIndex]
    const pools = playerPools_(target)
    if (!pools.includes(poolId)) return json_({ ok: false, reason: 'pool-forbidden' }, params.callback)

    const profile = ensurePoolProfile_(poolProfiles, courseProfiles, targetKey, course, poolId, Number(target[2]) || RATING_MIN, Number(target[3]) || 0)
    const before = profile.rating
    const now = new Date()
    adminAuditSheet_(book).appendRow([now, admin.playerKey, targetKey, 'rating-set', course, poolId, before, rating, reason])
    poolProfiles.getRange(profile.sheetRow, 4, 1, 3).setValues([[rating, profile.answered, now]])
    if (poolId === FOUNDATION_POOL_ID && course === COURSE_NAME) {
      const legacy = ensureCourseProfile_(courseProfiles, targetKey, course, before, profile.answered)
      courseProfiles.getRange(legacy.sheetRow, 3, 1, 3).setValues([[rating, profile.answered, now]])
    }
    if (poolId === pools[0]) players.getRange(targetIndex + 1, 3, 1, 3).setValues([[rating, profile.answered, now]])
    return json_({ ok: true, targetName: String(target[1]), course, poolId, before, rating, answered: profile.answered }, params.callback)
  } finally {
    lock.releaseLock()
  }
}

function isTransientBackendError_(message) {
  return /lock|simultaneous|too many|timed out|timeout|quota|service invoked too many|try again/i.test(String(message || ''))
}

function setup() {
  const props = PropertiesService.getScriptProperties()
  if (!props.getProperty('SHEET_ID')) {
    const book = SpreadsheetApp.create('Grammar Arena Scores')
    props.setProperty('SHEET_ID', book.getId())
  }
  const book = getBook_()
  const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
  const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
  const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
  const poolProfiles = getOrCreateSheet_(book, 'PoolProfiles', POOL_PROFILE_HEADERS)
  return { spreadsheetUrl: book.getUrl(), players: players.getName(), answers: answers.getName(), courseProfiles: courseProfiles.getName(), poolProfiles: poolProfiles.getName() }
}

// Repair only answer rows that are already stored in Answers but were not
// reflected in a profile. This is intentionally additive: it never lowers a
// student's current rating when the profile has more attempts than the ledger,
// and it does not guess about old retries that were rejected before being saved.
function repairRatingsFromAnswers() {
  const lock = LockService.getScriptLock()
  lock.waitLock(30000)
  try {
    const book = getBook_()
    const { players, answers, courseProfiles, poolProfiles } = getRuntimeSheets_(book)
    const playerRows = players.getDataRange().getValues()
    const answerRows = answers.getDataRange().getValues().slice(1).map((row, index) => ({
      row,
      index,
      playerKey: String(row[0] || '').trim(),
      course: cleanCourse_(row[1]),
      questionId: String(row[2] || '').trim(),
      delta: Number(row[4]) || 0,
      answeredAt: row[5] instanceof Date ? row[5].getTime() : index,
    })).filter((item) => item.playerKey && item.course && item.questionId)

    const playersByKey = new Map(playerRows.slice(1).filter((row) => row[0]).map((row) => [String(row[0]), row]))
    const answersByPlayer = new Map()
    answerRows.forEach((item) => {
      if (!answersByPlayer.has(item.playerKey)) answersByPlayer.set(item.playerKey, [])
      answersByPlayer.get(item.playerKey).push(item)
    })
    answersByPlayer.forEach((items) => items.sort((left, right) => left.answeredAt - right.answeredAt || left.index - right.index))

    const report = {
      playersChecked: 0,
      profilesChecked: 0,
      profilesRepaired: 0,
      recoveredAttempts: 0,
      recoveredDelta: 0,
      overcountProfiles: 0,
      missingPlayers: 0,
    }

    // Ensure every current pool represented by an existing answer has a
    // profile row before reconciling it. This also covers students who first
    // answered before PoolProfiles was introduced.
    playerRows.slice(1).forEach((row) => {
      const playerKey = String(row[0] || '').trim()
      if (!playerKey) return
      report.playersChecked += 1
      const poolIds = playerPools_(row)
      const courses = [...new Set((answersByPlayer.get(playerKey) || []).map((item) => item.course))]
      courses.forEach((course) => poolIds.forEach((poolId) => {
        ensurePoolProfile_(poolProfiles, courseProfiles, playerKey, course, poolId, Number(row[2]) || 1240, Number(row[3]) || 0)
      }))
    })

    const poolRows = poolProfiles.getDataRange().getValues()
    poolRows.slice(1).forEach((row, index) => {
      const playerKey = String(row[0] || '').trim()
      const profileCourse = cleanCourse_(row[1])
      if (!playerKey || !profileCourse || !playersByKey.has(playerKey)) {
        if (playerKey && !playersByKey.has(playerKey)) report.missingPlayers += 1
        return
      }
      report.profilesChecked += 1
      const relevant = (answersByPlayer.get(playerKey) || []).filter((item) => {
        if (profileCourse === 'foundation-course') return rankingCourses_(profileCourse).includes(item.course)
        return item.course === profileCourse
      })
      const applied = Math.max(0, Number(row[4]) || 0)
      if (relevant.length <= applied) {
        if (relevant.length < applied) report.overcountProfiles += 1
        return
      }
      const missing = relevant.slice(applied)
      const recoveredDelta = missing.reduce((sum, item) => sum + item.delta, 0)
      const currentRating = Number(row[3]) || 1240
      const repairedRating = Math.max(RATING_MIN, currentRating + recoveredDelta)
      const repairedAnswered = applied + missing.length
      const sheetRow = index + 2
      poolProfiles.getRange(sheetRow, 4, 1, 3).setValues([[repairedRating, repairedAnswered, new Date()]])
      report.profilesRepaired += 1
      report.recoveredAttempts += missing.length
      report.recoveredDelta += recoveredDelta
    })

    // Keep the legacy aggregate rows in sync so older clients and the all-pool
    // leaderboard see the same repaired values as PoolProfiles.
    const courseRows = courseProfiles.getDataRange().getValues()
    courseRows.slice(1).forEach((row, index) => {
      const playerKey = String(row[0] || '').trim()
      const course = cleanCourse_(row[1])
      const player = playersByKey.get(playerKey)
      if (!playerKey || !course || !player) return
      const primaryPool = playerPools_(player)[0]
      if (!primaryPool) return
      const poolRow = poolRows.find((profile, profileIndex) => profileIndex > 0 && String(profile[0]) === playerKey && String(profile[1]) === course && String(profile[2]) === primaryPool)
      if (!poolRow) return
      courseProfiles.getRange(index + 2, 3, 1, 3).setValues([[Number(poolRow[3]) || 1240, Number(poolRow[4]) || 0, new Date()]])
    })

    console.log(JSON.stringify(report))
    return report
  } finally {
    lock.releaseLock()
  }
}

function getBook_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID')
  if (!id) {
    setup()
    return getBook_()
  }
  return SpreadsheetApp.openById(id)
}

function getOrCreateSheet_(book, name, headers) {
  const sheet = book.getSheetByName(name) || book.insertSheet(name)
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers])
  const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0]
  headers.forEach((header, index) => {
    if (String(currentHeaders[index] || '') !== header) sheet.getRange(1, index + 1).setValue(header)
  })
  return sheet
}

// Operational requests already run after setup. Avoid rereading and validating
// every header four times for every student request; only create a sheet when a
// legacy deployment has not created it yet.
function getRuntimeSheets_(book) {
  const get = (name, headers) => book.getSheetByName(name) || getOrCreateSheet_(book, name, headers)
  const players = get('Players', PLAYER_HEADERS)
  if (String(players.getRange(1, 11).getValue() || '') !== 'unlockedThemes') players.getRange(1, 11).setValue('unlockedThemes')
  return {
    players,
    answers: get('Answers', ANSWER_HEADERS),
    courseProfiles: get('CourseProfiles', COURSE_PROFILE_HEADERS),
    poolProfiles: get('PoolProfiles', POOL_PROFILE_HEADERS),
  }
}

function registerPlayer_(params) {
  const name = cleanName_(params.name)
  const playerKey = keyFor_(name)
  const pinHash = cleanPinHash_(params.pinHash)
  const course = cleanCourse_(params.course) || COURSE_NAME
  const grade = cleanGrade_(params.grade)
  const className = cleanClassName_(params.className)
  const foundationMember = cleanBoolean_(params.foundationMember)
  if (!name || !playerKey || !pinHash) return json_({ ok: false, reason: 'invalid-input' }, params.callback)
  if (isInappropriateContent_(name)) return json_({ ok: false, reason: 'inappropriate-content' }, params.callback)
  if (!grade || !className) return json_({ ok: false, reason: 'placement-required' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const { players, answers, courseProfiles, poolProfiles } = getRuntimeSheets_(book)
    const rows = players.getDataRange().getValues()
    const playerIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey)
    const now = new Date()
    const token = Utilities.getUuid()
    const pinSecret = pinSecretFor_(pinHash, playerKey)
    if (playerIndex >= 0) {
      if (rows[playerIndex][11]) return json_({ ok: false, reason: 'account-deleted' }, params.callback)
      if (String(rows[playerIndex][5] || '')) {
        if (String(rows[playerIndex][5]) !== pinSecret) return json_({ ok: false, reason: 'already-registered' }, params.callback)
        // A lost response can make a successful registration look failed in
        // the browser. Treat the same name + PIN as an idempotent reconnect,
        // but preserve the stored class/pool placement.
        players.getRange(playerIndex + 1, 5).setValue(now)
        players.getRange(playerIndex + 1, 7).setValue(tokenHashFor_(token, playerKey))
        return json_(profile_(players, answers, courseProfiles, poolProfiles, playerIndex, playerKey, course, token, cleanPoolId_(params.poolId), { includePlayers: false, includeAnsweredIds: true }), params.callback)
      }
      const rating = Number(rows[playerIndex][2]) || 1240
      const answered = Number(rows[playerIndex][3]) || 0
      players.getRange(playerIndex + 1, 2, 1, 9).setValues([[name, rating, answered, now, pinSecret, tokenHashFor_(token, playerKey), grade, className, foundationMember]])
      return json_(profile_(players, answers, courseProfiles, poolProfiles, playerIndex, playerKey, course, token, cleanPoolId_(params.poolId), { includePlayers: false, includeAnsweredIds: true }), params.callback)
    }
    players.appendRow([playerKey, name, 1240, 0, now, pinSecret, tokenHashFor_(token, playerKey), grade, className, foundationMember])
    const newIndex = players.getLastRow() - 1
    return json_(profile_(players, answers, courseProfiles, poolProfiles, newIndex, playerKey, course, token, cleanPoolId_(params.poolId), { includePlayers: false, includeAnsweredIds: false }), params.callback)
  } finally {
    lock.releaseLock()
  }
}

function loginPlayer_(params) {
  const name = cleanName_(params.name)
  const playerKey = keyFor_(name)
  const pinHash = cleanPinHash_(params.pinHash)
  const course = cleanCourse_(params.course) || COURSE_NAME
  if (!name || !playerKey || !pinHash) return json_({ ok: false, reason: 'invalid-input' }, params.callback)
  if (isInappropriateContent_(name)) return json_({ ok: false, reason: 'inappropriate-content' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const { players, answers, courseProfiles, poolProfiles } = getRuntimeSheets_(book)
    const rows = players.getDataRange().getValues()
    const playerIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey)
    if (playerIndex < 0) return json_({ ok: false, reason: 'not-found' }, params.callback)
    if (rows[playerIndex][11]) return json_({ ok: false, reason: 'account-deleted' }, params.callback)
    if (!String(rows[playerIndex][5] || '')) return json_({ ok: false, reason: 'not-registered' }, params.callback)
    if (String(rows[playerIndex][5]) !== pinSecretFor_(pinHash, playerKey)) return json_({ ok: false, reason: 'wrong-pin' }, params.callback)

    const token = Utilities.getUuid()
    const now = new Date()
    players.getRange(playerIndex + 1, 5).setValue(now)
    players.getRange(playerIndex + 1, 7).setValue(tokenHashFor_(token, playerKey))
    return json_(profile_(players, answers, courseProfiles, poolProfiles, playerIndex, playerKey, course, token, cleanPoolId_(params.poolId), { includePlayers: false }), params.callback)
  } finally {
    lock.releaseLock()
  }
}

function sessionPlayer_(params) {
  const name = cleanName_(params.name)
  const course = cleanCourse_(params.course) || COURSE_NAME
  const token = String(params.authToken || '')
  if (!name || !token) return json_({ ok: false, reason: 'invalid-session' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const { players, answers, courseProfiles, poolProfiles } = getRuntimeSheets_(book)
    const auth = authenticate_(players, name, token)
    if (!auth) return json_({ ok: false, reason: 'invalid-session' }, params.callback)
    return json_(profile_(players, answers, courseProfiles, poolProfiles, auth.playerIndex, auth.playerKey, course, token, cleanPoolId_(params.poolId), { includePlayers: false }), params.callback)
  } finally {
    lock.releaseLock()
  }
}

function themeUnlocksFromRow_(row) {
  try {
    const parsed = JSON.parse(String(row[10] || '[]'))
    return Array.isArray(parsed) ? [...new Set(parsed.filter((themeId) => THEME_UNLOCKS.includes(String(themeId))))] : []
  } catch (error) {
    return []
  }
}

function maxPlayerRating_(players, courseProfiles, poolProfiles, playerIndex, playerKey) {
  const playerRow = players.getDataRange().getValues()[playerIndex] || []
  const legacyRatings = courseProfiles.getDataRange().getValues().slice(1)
    .filter((row) => String(row[0] || '') === playerKey)
    .map((row) => Number(row[2]))
    .filter((rating) => Number.isFinite(rating))
  const poolRatings = poolProfiles.getDataRange().getValues().slice(1)
    .filter((row) => String(row[0] || '') === playerKey)
    .map((row) => Number(row[3]))
    .filter((rating) => Number.isFinite(rating))
  return Math.max(Number(playerRow[2]) || RATING_MIN, ...legacyRatings, ...poolRatings)
}

function eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, playerIndex, playerKey, answers) {
  const row = players.getDataRange().getValues()[playerIndex] || []
  const unlocks = themeUnlocksFromRow_(row)
  if (playerKey === keyFor_('おとめ座')) {
    THEME_UNLOCKS.forEach((themeId) => { if (!unlocks.includes(themeId)) unlocks.push(themeId) })
  }
  if (maxPlayerRating_(players, courseProfiles, poolProfiles, playerIndex, playerKey) >= 10000 && !unlocks.includes('crystallium')) {
    unlocks.push('crystallium')
  }
  const answerRows = Array.isArray(answers) ? answers : answers && answers.getDataRange ? answers.getDataRange().getValues() : []
  const attempts = answerRows.slice(1).filter((answer) => String(answer[0] || '') === playerKey)
  const questionKey = (answer) => String(answer[1] || '') + '::' + String(answer[2] || '')
  const isCorrect = (answer) => answer[3] === true || String(answer[3] || '').toLowerCase() === 'true' || Number(answer[3]) === 1
  const attemptedQuestions = new Set(attempts.map(questionKey))
  const correctQuestions = new Set(attempts.filter(isCorrect).map(questionKey))
  const unitsWithCorrectAnswers = new Set(attempts.filter(isCorrect).map((answer) => {
    const course = String(answer[1] || '')
    const questionId = String(answer[2] || '')
    const unit = questionId.replace(/-[^-]+$/, '')
    return course + '::' + unit
  }))
  const recoveredQuestions = new Set()
  const previouslyMissed = new Set()
  attempts.forEach((answer) => {
    const key = questionKey(answer)
    if (isCorrect(answer)) {
      if (previouslyMissed.has(key)) recoveredQuestions.add(key)
    } else {
      previouslyMissed.add(key)
    }
  })
  const latestTen = attempts.slice(-10)
  if (attemptedQuestions.size >= 50 && !unlocks.includes('archive')) unlocks.push('archive')
  if (latestTen.length === 10 && latestTen.every(isCorrect) && !unlocks.includes('eclipse')) unlocks.push('eclipse')
  if (correctQuestions.size >= 30 && !unlocks.includes('verdant')) unlocks.push('verdant')
  if (recoveredQuestions.size >= 5 && !unlocks.includes('ember')) unlocks.push('ember')
  if (correctQuestions.size >= 20 && unitsWithCorrectAnswers.size >= 3 && !unlocks.includes('aurora')) unlocks.push('aurora')
  if (JSON.stringify(themeUnlocksFromRow_(row)) !== JSON.stringify(unlocks)) players.getRange(playerIndex + 1, 11).setValue(JSON.stringify(unlocks))
  return unlocks
}

function unlockTheme_(params) {
  const name = cleanName_(params.name)
  const token = String(params.authToken || '')
  const themeId = String(params.themeId || '').trim()
  const course = cleanCourse_(params.course) || COURSE_NAME
  if (!name || !token || !THEME_UNLOCKS.includes(themeId)) return json_({ ok: false, reason: 'invalid-input' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const { players, answers, courseProfiles, poolProfiles } = getRuntimeSheets_(book)
    const auth = authenticate_(players, name, token)
    if (!auth) return json_({ ok: false, reason: 'invalid-session' }, params.callback)
    const playerRows = players.getDataRange().getValues()
    const row = playerRows[auth.playerIndex] || []
    const answerRows = answers.getDataRange().getValues()
    const unlocks = eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, auth.playerIndex, auth.playerKey, answerRows)
    if (themeId === 'crystallium' && !unlocks.includes('crystallium')) return json_({ ok: false, reason: 'rating-threshold', unlockedThemes: unlocks }, params.callback)
    if (themeId === 'dignity' && !unlocks.includes('dignity') && String(params.pdfSaved || '') !== 'true') return json_({ ok: false, reason: 'pdf-required', unlockedThemes: unlocks }, params.callback)
    if (themeId === 'moon' && !unlocks.includes('moon') && String(params.secretTapSequence || '') !== 'brand-spaced-4') return json_({ ok: false, reason: 'criteria-not-met', unlockedThemes: unlocks }, params.callback)
    if (!unlocks.includes(themeId) && themeId !== 'dignity' && themeId !== 'moon') return json_({ ok: false, reason: 'criteria-not-met', unlockedThemes: unlocks }, params.callback)
    if (!unlocks.includes(themeId)) {
      unlocks.push(themeId)
      players.getRange(auth.playerIndex + 1, 11).setValue(JSON.stringify(unlocks))
    }
    return json_(profile_(players, answers, courseProfiles, poolProfiles, auth.playerIndex, auth.playerKey, course, token, cleanPoolId_(params.poolId), { includePlayers: false, answerRows }), params.callback)
  } finally {
    lock.releaseLock()
  }
}

function profile_(players, answers, courseProfiles, poolProfiles, playerIndex, playerKey, course, token, requestedPool, options = {}) {
  const includePlayers = options.includePlayers !== false
  const includeAnsweredIds = options.includeAnsweredIds !== false
  const row = players.getDataRange().getValues()[playerIndex]
  const answerRows = Array.isArray(options.answerRows) ? options.answerRows : answers.getDataRange().getValues()
  const unlockedThemes = eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, playerIndex, playerKey, answerRows)
  const poolIds = playerPools_(row)
  const profiles = poolIds.map((poolId) => ({
    poolId,
    ...ensurePoolProfile_(poolProfiles, courseProfiles, playerKey, course, poolId, Number(row[2]) || 1240, Number(row[3]) || 0),
  }))
  const activePool = poolIds.includes(requestedPool) ? requestedPool : poolIds[0] || ''
  const activeProfile = profiles.find((profile) => profile.poolId === activePool) || profiles[0] || {
    rating: Number(row[2]) || 1240,
    answered: Number(row[3]) || 0,
  }
  const ratings = Object.fromEntries(profiles.map((profile) => [profile.poolId, { rating: profile.rating, answered: profile.answered }]))
  return {
    ok: true,
    name: String(row[1]),
    rating: activeProfile.rating,
    answered: activeProfile.answered,
    answeredIds: includeAnsweredIds ? answeredIds_(answers, playerKey, course, answerRows) : [],
    authToken: token,
    grade: cleanGrade_(row[7]),
    className: cleanClassName_(row[8]),
    foundationMember: String(row[9] || '').toLowerCase() === 'true',
    unlockedThemes,
    needsPlacement: !cleanGrade_(row[7]) || !cleanClassName_(row[8]),
    poolId: activePool,
    poolIds,
    ratings,
    players: includePlayers && activePool ? leaderboard_(players, courseProfiles, poolProfiles, course, activePool, playerKey) : [],
  }
}

function updatePlayerProfile_(params) {
  const name = cleanName_(params.name)
  const token = String(params.authToken || '')
  const grade = cleanGrade_(params.grade)
  const className = cleanClassName_(params.className)
  if (!name || !token || !grade || !className) return json_({ ok: false, reason: 'placement-required' }, params.callback)
  if (isInappropriateContent_(name)) return json_({ ok: false, reason: 'inappropriate-content' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const { players, answers, courseProfiles, poolProfiles } = getRuntimeSheets_(book)
    const auth = authenticate_(players, name, token)
    if (!auth) return json_({ ok: false, reason: 'invalid-session' }, params.callback)
    const foundationMember = cleanBoolean_(params.foundationMember)
    players.getRange(auth.playerIndex + 1, 8, 1, 3).setValues([[grade, className, foundationMember]])
    const course = cleanCourse_(params.course) || COURSE_NAME
    return json_(profile_(players, answers, courseProfiles, poolProfiles, auth.playerIndex, auth.playerKey, course, token, cleanPoolId_(params.poolId), { includePlayers: false }), params.callback)
  } finally {
    lock.releaseLock()
  }
}

function rankingCourses_(course) {
  const value = String(course || COURSE_NAME)
  if (value === 'foundation-course') return ['foundation-course', 'foundation-infinitive', 'foundation-gerund', 'foundation-participles']
  return [value]
}

function playerPools_(row) {
  if (row[11]) return []
  const grade = cleanGrade_(row[7])
  const className = cleanClassName_(row[8])
  const classPool = grade && className ? grade + '-' + className : ''
  const foundationMember = String(row[9] || '').toLowerCase() === 'true'
  if (foundationMember) return classPool ? [FOUNDATION_POOL_ID, classPool] : [FOUNDATION_POOL_ID]
  return classPool ? [classPool] : []
}

function ensurePoolProfile_(poolSheet, legacySheet, playerKey, course, poolId, fallbackRating, fallbackAnswered) {
  const rows = poolSheet.getDataRange().getValues()
  const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey && row[1] === course && row[2] === poolId)
  if (rowIndex >= 0) {
    return {
      sheetRow: rowIndex + 1,
      rating: Number(rows[rowIndex][3]) || 1240,
      answered: Number(rows[rowIndex][4]) || 0,
    }
  }
  const legacyRows = legacySheet.getDataRange().getValues()
  const legacy = legacyRows.find((row, index) => index > 0 && row[0] === playerKey && row[1] === course)
  const rating = legacy ? Number(legacy[2]) || 1240 : Number(fallbackRating) || 1240
  const answered = legacy ? Number(legacy[3]) || 0 : Number(fallbackAnswered) || 0
  poolSheet.appendRow([playerKey, course, poolId, rating, answered, new Date()])
  return { sheetRow: poolSheet.getLastRow(), rating, answered }
}

function ensureCourseProfile_(sheet, playerKey, course, fallbackRating, fallbackAnswered) {
  const rows = sheet.getDataRange().getValues()
  const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey && row[1] === course)
  if (rowIndex >= 0) {
    return {
      sheetRow: rowIndex + 1,
      rating: Number(rows[rowIndex][2]) || 1240,
      answered: Number(rows[rowIndex][3]) || 0,
    }
  }
  const rating = course === 'foundation-course' ? Number(fallbackRating) || 1240 : 1240
  const answered = course === 'foundation-course' ? Number(fallbackAnswered) || 0 : 0
  sheet.appendRow([playerKey, course, rating, answered, new Date()])
  return { sheetRow: sheet.getLastRow(), rating, answered }
}

function authenticate_(players, name, token) {
  const playerKey = keyFor_(name)
  const rows = players.getDataRange().getValues()
  const playerIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey)
  if (playerIndex < 0 || rows[playerIndex][11] || !token || String(rows[playerIndex][6] || '') !== tokenHashFor_(token, playerKey)) return null
  return { playerKey, playerIndex }
}

function recordAnswer_(params) {
  const name = cleanName_(params.name)
  const course = cleanCourse_(params.course)
  const questionId = String(params.questionId || '')
  const answerId = String(params.answerId || '').trim()
  const question = questionFor_(course, questionId)
  const requestedPool = cleanPoolId_(params.poolId)
  if (!name || !course || !questionId || !question) return json_({ ok: false, reason: 'invalid-question' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const { players, answers, courseProfiles, poolProfiles } = getRuntimeSheets_(book)
    const auth = authenticate_(players, name, String(params.authToken || ''))
    if (!auth) return json_({ ok: false, reason: 'invalid-session' }, params.callback)
    const playerKey = auth.playerKey
    const playerRows = players.getDataRange().getValues()
    const playerIndex = auth.playerIndex
    const playerRow = playerRows[playerIndex]
    const poolIds = playerPools_(playerRow)
    if (!poolIds.length) return json_({ ok: false, reason: 'placement-required' }, params.callback)
    const profiles = poolIds.map((poolId) => ({
      poolId,
      ...ensurePoolProfile_(poolProfiles, courseProfiles, playerKey, course, poolId, Number(playerRow[2]) || 1240, Number(playerRow[3]) || 0),
    }))
    const activePool = poolIds.includes(requestedPool) ? requestedPool : poolIds[0]
    const activeProfile = profiles.find((profile) => profile.poolId === activePool) || profiles[0]
    const submittedAnswer = String(params.answer || '')
    if (isInappropriateContent_(submittedAnswer)) return json_({ ok: false, reason: 'inappropriate-content', rating: activeProfile.rating, delta: 0, poolId: activePool, ratings: ratingsFromProfiles_(profiles) }, params.callback)
    const rows = answers.getDataRange().getValues()
    const duplicate = rows.slice(1).some((row) => {
      const sameQuestion = row[0] === playerKey && rankingCourses_(course).includes(String(row[1])) && row[2] === questionId
      if (!sameQuestion) return false
      // New clients identify each attempt. Retries of that attempt are
      // idempotent, while a new attempt on the same question is scoreable.
      // Legacy clients without an attempt ID retain the old one-question rule.
      return answerId ? String(row[6] || '') === answerId : true
    })
    // A retry may follow a lost response. Return the authoritative rating without scoring twice.
    if (duplicate) {
      const unlockedThemes = eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, playerIndex, playerKey, rows)
      return json_({ ok: false, reason: 'already-answered', rating: activeProfile.rating, delta: 0, poolId: activePool, ratings: ratingsFromProfiles_(profiles), unlockedThemes }, params.callback)
    }
    // New clients send the answer text. Older queued answers only have the
    // browser's result, so retain a temporary compatibility path for them.
    const serverValidated = submittedAnswer.length > 0
    const correct = serverValidated ? isAnswerCorrect_(question, submittedAnswer) : params.legacyCorrect === 'true' || params.correct === 'true'
    const safeDelta = serverValidated
      ? (correct ? RATING_POINTS[question.difficulty] : -RATING_LOSS[question.difficulty])
      : Math.max(-50, Math.min(50, Number(params.delta || 0)))
    const now = new Date()
    const savedAnswer = [playerKey, course, questionId, correct, safeDelta, now, answerId]
    answers.appendRow(savedAnswer)
    rows.push(savedAnswer)
    const updatedProfiles = profiles.map((profile) => {
      const rating = Math.max(RATING_MIN, profile.rating + safeDelta)
      poolProfiles.getRange(profile.sheetRow, 4, 1, 3).setValues([[rating, profile.answered + 1, now]])
      return { ...profile, rating, answered: profile.answered + 1 }
    })
    const foundationProfile = updatedProfiles.find((profile) => profile.poolId === FOUNDATION_POOL_ID)
    const legacyProfile = ensureCourseProfile_(courseProfiles, playerKey, course, Number(playerRow[2]) || 1240, Number(playerRow[3]) || 0)
    if (foundationProfile) courseProfiles.getRange(legacyProfile.sheetRow, 3, 1, 3).setValues([[foundationProfile.rating, foundationProfile.answered, now]])
    players.getRange(playerIndex + 1, 2).setValue(name)
    const primaryProfile = updatedProfiles[0]
    players.getRange(playerIndex + 1, 3, 1, 2).setValues([[primaryProfile.rating, primaryProfile.answered]])
    players.getRange(playerIndex + 1, 5).setValue(now)
    const activeUpdated = updatedProfiles.find((profile) => profile.poolId === activePool) || primaryProfile
    const unlockedThemes = eligibleThemeUnlocks_(players, courseProfiles, poolProfiles, playerIndex, playerKey, rows)
    const result = { ok: true, rating: activeUpdated.rating, delta: safeDelta, correct, serverValidated, poolId: activePool, ratings: ratingsFromProfiles_(updatedProfiles), unlockedThemes }
    if (String(params.compact) !== 'true') result.players = leaderboard_(players, courseProfiles, poolProfiles, course, activePool, playerKey)
    return json_(result, params.callback)
  } finally {
    lock.releaseLock()
  }
}

function getLeaderboard_(course, poolId, name, authToken, callback) {
  course = cleanCourse_(course) || COURSE_NAME
  const book = getBook_()
  const { players, courseProfiles, poolProfiles } = getRuntimeSheets_(book)
  const auth = authenticate_(players, cleanName_(name), String(authToken || ''))
  if (!auth) return json_({ ok: false, reason: 'auth-required', players: [] }, callback)
  const memberPools = playerPools_(players.getDataRange().getValues()[auth.playerIndex])
  const activePool = cleanPoolId_(poolId) || memberPools[0] || ''
  if (!activePool || !memberPools.includes(activePool)) return json_({ ok: false, reason: 'pool-forbidden', poolId: activePool, allowedPoolId: memberPools[0] || '', players: [] }, callback)
  return json_({ ok: true, course, poolId: activePool, players: leaderboard_(players, courseProfiles, poolProfiles, course, activePool, auth.playerKey) }, callback)
}

function ratingsFromProfiles_(profiles) {
  return Object.fromEntries(profiles.map((profile) => [profile.poolId, { rating: profile.rating, answered: profile.answered }]))
}

function leaderboard_(playersSheet, courseProfilesSheet, poolProfilesSheet, course, poolId = 'all', viewerPlayerKey = '') {
  const playerRows = playersSheet.getDataRange().getValues().slice(1).filter((row) => row[0] && row[1] && !row[11])
  const rankingCourses = rankingCourses_(course)
  if (poolId === 'all') {
    const names = new Map(playerRows.map((row) => [String(row[0]), String(row[1])]))
    const profileRows = courseProfilesSheet.getDataRange().getValues().slice(1)
      .filter((row) => row[0] && rankingCourses.includes(String(row[1])) && names.has(String(row[0])))
    return profileRows.map((row) => {
      const playerKey = String(row[0])
      const player = { name: names.get(playerKey) || playerKey, rating: Number(row[2]) || 1240 }
      if (playerKey === String(viewerPlayerKey || '')) player.answered = Number(row[3]) || 0
      return player
    }).sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name, 'ja'))
  }
  const profileRows = poolProfilesSheet.getDataRange().getValues().slice(1)
    .filter((row) => row[0] && rankingCourses.includes(String(row[1])) && String(row[2]) === poolId)
  const profiles = new Map(profileRows.map((row) => [String(row[0]), { rating: Number(row[3]) || 1240, answered: Number(row[4]) || 0 }]))
  const ranked = playerRows
    .filter((row) => playerPools_(row).includes(poolId))
    .map((row) => {
      const profile = profiles.get(String(row[0]))
      const playerKey = String(row[0])
      const player = { name: String(row[1]), rating: profile?.rating ?? (poolId === FOUNDATION_POOL_ID ? Number(row[2]) || 1240 : 1240) }
      if (playerKey === String(viewerPlayerKey || '')) player.answered = profile?.answered ?? (poolId === FOUNDATION_POOL_ID ? Number(row[3]) || 0 : 0)
      return player
    })
  return ranked
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name, 'ja'))
}

function cleanName_(value) {
  return String(value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20)
}

function isInappropriateContent_(value) {
  const original = String(value || '').normalize('NFKC').toLowerCase().trim()
  if (!original) return false
  const compact = normalizeModerationText_(original)
  const kanaFolded = toHiraganaModeration_(original)
  const kanaCompact = toHiraganaModeration_(compact)
  const japaneseCandidates = [original, compact, kanaFolded, kanaCompact]
  if (JAPANESE_INAPPROPRIATE_PATTERNS.some((pattern) => japaneseCandidates.some((candidate) => pattern.test(candidate)))) return true
  const englishCandidates = [original, compact, normalizeLatinConfusables_(original), normalizeLatinConfusables_(compact)]
  return englishCandidates.some((candidate) => ENGLISH_INAPPROPRIATE_PATTERN.test(candidate))
}

function normalizeModerationText_(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[\s\p{P}\p{S}]+/gu, '')
}

function toHiraganaModeration_(value) {
  return String(value || '').replace(/[\u30A1-\u30F6]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60))
}

function normalizeLatinConfusables_(value) {
  return String(value || '')
    .replace(/[@＠]/g, 'a')
    .replace(/[$＄]/g, 's')
    .replace(/[０]/g, 'o')
    .replace(/[１]/g, 'i')
    .replace(/[３]/g, 'e')
    .replace(/[４]/g, 'a')
    .replace(/[５]/g, 's')
    .replace(/[７]/g, 't')
}

function cleanCourse_(value) {
  const course = String(value || '').trim()
  if (['foundation-infinitive', 'foundation-gerund', 'foundation-participles'].includes(course)) return 'foundation-course'
  return ALLOWED_COURSES.includes(course) ? course : ''
}

function cleanGrade_(value) {
  const grade = String(value || '').trim()
  return ALLOWED_GRADES.includes(grade) ? grade : ''
}

function cleanClassName_(value) {
  const className = String(value || '').trim().toUpperCase()
  return ALLOWED_CLASSES.includes(className) ? className : ''
}

function cleanPoolId_(value) {
  const poolId = String(value || '').trim().toLowerCase()
  if (poolId === FOUNDATION_POOL_ID || poolId === 'all') return poolId
  const match = poolId.match(/^([1-3])-([a-m])$/)
  return match ? match[1] + '-' + match[2].toUpperCase() : ''
}

function cleanBoolean_(value) {
  return String(value || '').toLowerCase() === 'true'
}

function questionFor_(course, questionId) {
  const question = QUESTION_REGISTRY[String(questionId || '')]
  return question && question.course === course ? question : null
}

function isAnswerCorrect_(question, submittedAnswer) {
  const answer = normalizeAnswer_(submittedAnswer)
  return (question.accepted || []).some((candidate) => normalizeAnswer_(candidate) === answer)
}

function normalizeAnswer_(value) {
  return String(value || '').trim().toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[。．,，!！?？、「」]/g, '')
    .replace(/\s+/g, ' ')
}

function cleanPinHash_(value) {
  const hash = String(value || '').trim().toLowerCase()
  return /^[a-f0-9]{64}$/.test(hash) ? hash : ''
}

function pinSecretFor_(pinHash, playerKey) {
  return digest_(pinHash + ':' + playerKey)
}

function tokenHashFor_(token, playerKey) {
  return digest_(token + ':' + playerKey)
}

function digest_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map((byte) => ('0' + ((byte + 256) % 256).toString(16)).slice(-2))
    .join('')
}

function answeredIds_(sheet, playerKey, course, answerRows) {
  const rows = Array.isArray(answerRows) ? answerRows : sheet.getDataRange().getValues()
  return rows.slice(1)
    .filter((row) => row[0] === playerKey && rankingCourses_(course).includes(String(row[1])) && row[2])
    .map((row) => String(row[2]))
}

function keyFor_(name) {
  return name.toLowerCase()
}

function json_(payload, callback = '') {
  callback = String(callback || '')
  const body = JSON.stringify(payload).replace(/</g, '\\u003c')
  if (callback && /^[a-zA-Z_$][\w$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + body + ')').setMimeType(ContentService.MimeType.JAVASCRIPT)
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON)
}
