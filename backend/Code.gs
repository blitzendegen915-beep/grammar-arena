const COURSE_NAME = 'foundation-course'
const RATING_MIN = 800
const PLAYER_HEADERS = ['playerKey', 'name', 'rating', 'answered', 'updatedAt', 'pinSecret', 'tokenHash', 'grade', 'className', 'foundationMember']
const ANSWER_HEADERS = ['playerKey', 'course', 'questionId', 'correct', 'delta', 'answeredAt']
const COURSE_PROFILE_HEADERS = ['playerKey', 'course', 'rating', 'answered', 'updatedAt']
const POOL_PROFILE_HEADERS = ['playerKey', 'course', 'poolId', 'rating', 'answered', 'updatedAt']
const RATING_POINTS = { starter: 12, standard: 18, advanced: 26 }
const RATING_LOSS = { starter: 7, standard: 11, advanced: 16 }
const ALLOWED_COURSES = ['foundation-course', 'regular-english-practice']
const ALLOWED_GRADES = ['1', '2', '3']
const ALLOWED_CLASSES = 'ABCDEFGHIJKLM'.split('')
const FOUNDATION_POOL_ID = 'foundation'
const JAPANESE_INAPPROPRIATE_PATTERNS = [
  /(?:死ね|しね|消えろ|きえろ|殺す|ころす|殺せ|ころせ|レイプ|強姦|ちんこ|ちんぽ|まんこ|おっぱい|セックス|えっち|オナニー|自慰|精子|ペニス|ヴァギナ|アナル|肛門|フェラ|裸|ばか(?!り)|馬鹿|バカ(?!り)|アホ|あほ|ブス|デブ|ハゲ|クズ|ゴミ|カス|無能|キモい|きもい|うざい)/i,
]
const ENGLISH_INAPPROPRIATE_PATTERN = /(?:^|[^a-z0-9])(fuck(?:ing|ed|er)?|shit|bitch|asshole|dick|pussy|cunt|cock|nigger|faggot|slut|whore|rape)(?:$|[^a-z0-9])/i
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
      "Do have to",
      "Do I have to"
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
      "May"
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
      "to live in",
      "to live in it"
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
      "To begin with"
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
      "as not to"
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
      "being compared",
      "being compared with"
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
}

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {}
  if ((params.action || 'leaderboard') !== 'leaderboard') return json_({ ok: false, reason: 'post-required' }, params.callback)
  return getLeaderboard_(cleanCourse_(params.course) || COURSE_NAME, cleanPoolId_(params.poolId), params.name, params.authToken, params.callback)
}

function doPost(e) {
  const params = e && e.parameter ? e.parameter : {}
  const action = params.action || 'leaderboard'
  if (action === 'register') return registerPlayer_(params)
  if (action === 'login') return loginPlayer_(params)
  if (action === 'session') return sessionPlayer_(params)
  if (action === 'update-profile') return updatePlayerProfile_(params)
  if (action === 'answer') return recordAnswer_(params)
  return getLeaderboard_(cleanCourse_(params.course) || COURSE_NAME, cleanPoolId_(params.poolId), params.name, params.authToken, params.callback)
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
    const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
    const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
    const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
    const poolProfiles = getOrCreateSheet_(book, 'PoolProfiles', POOL_PROFILE_HEADERS)
    const rows = players.getDataRange().getValues()
    const playerIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey)
    const now = new Date()
    const token = Utilities.getUuid()
    const pinSecret = pinSecretFor_(pinHash, playerKey)
    if (playerIndex >= 0) {
      if (String(rows[playerIndex][5] || '')) return json_({ ok: false, reason: 'already-registered' }, params.callback)
      const rating = Number(rows[playerIndex][2]) || 1240
      const answered = Number(rows[playerIndex][3]) || 0
      players.getRange(playerIndex + 1, 2, 1, 9).setValues([[name, rating, answered, now, pinSecret, tokenHashFor_(token, playerKey), grade, className, foundationMember]])
      return json_(profile_(players, answers, courseProfiles, poolProfiles, playerIndex, playerKey, course, token, cleanPoolId_(params.poolId)), params.callback)
    }
    players.appendRow([playerKey, name, 1240, 0, now, pinSecret, tokenHashFor_(token, playerKey), grade, className, foundationMember])
    const newIndex = players.getLastRow() - 1
    return json_(profile_(players, answers, courseProfiles, poolProfiles, newIndex, playerKey, course, token, cleanPoolId_(params.poolId)), params.callback)
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
    const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
    const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
    const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
    const poolProfiles = getOrCreateSheet_(book, 'PoolProfiles', POOL_PROFILE_HEADERS)
    const rows = players.getDataRange().getValues()
    const playerIndex = rows.findIndex((row, index) => index > 0 && row[0] === playerKey)
    if (playerIndex < 0) return json_({ ok: false, reason: 'not-found' }, params.callback)
    if (!String(rows[playerIndex][5] || '')) return json_({ ok: false, reason: 'not-registered' }, params.callback)
    if (String(rows[playerIndex][5]) !== pinSecretFor_(pinHash, playerKey)) return json_({ ok: false, reason: 'wrong-pin' }, params.callback)

    const token = Utilities.getUuid()
    const now = new Date()
    players.getRange(playerIndex + 1, 5).setValue(now)
    players.getRange(playerIndex + 1, 7).setValue(tokenHashFor_(token, playerKey))
    return json_(profile_(players, answers, courseProfiles, poolProfiles, playerIndex, playerKey, course, token, cleanPoolId_(params.poolId)), params.callback)
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
    const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
    const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
    const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
    const poolProfiles = getOrCreateSheet_(book, 'PoolProfiles', POOL_PROFILE_HEADERS)
    const auth = authenticate_(players, name, token)
    if (!auth) return json_({ ok: false, reason: 'invalid-session' }, params.callback)
    return json_(profile_(players, answers, courseProfiles, poolProfiles, auth.playerIndex, auth.playerKey, course, token, cleanPoolId_(params.poolId)), params.callback)
  } finally {
    lock.releaseLock()
  }
}

function profile_(players, answers, courseProfiles, poolProfiles, playerIndex, playerKey, course, token, requestedPool) {
  const row = players.getDataRange().getValues()[playerIndex]
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
    answeredIds: answeredIds_(answers, playerKey, course),
    authToken: token,
    grade: cleanGrade_(row[7]),
    className: cleanClassName_(row[8]),
    foundationMember: String(row[9] || '').toLowerCase() === 'true',
    needsPlacement: !cleanGrade_(row[7]) || !cleanClassName_(row[8]),
    poolId: activePool,
    poolIds,
    ratings,
    players: activePool ? leaderboard_(players, courseProfiles, poolProfiles, course, activePool, playerKey) : [],
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
    const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
    const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
    const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
    const poolProfiles = getOrCreateSheet_(book, 'PoolProfiles', POOL_PROFILE_HEADERS)
    const auth = authenticate_(players, name, token)
    if (!auth) return json_({ ok: false, reason: 'invalid-session' }, params.callback)
    const foundationMember = cleanBoolean_(params.foundationMember)
    players.getRange(auth.playerIndex + 1, 8, 1, 3).setValues([[grade, className, foundationMember]])
    const course = cleanCourse_(params.course) || COURSE_NAME
    return json_(profile_(players, answers, courseProfiles, poolProfiles, auth.playerIndex, auth.playerKey, course, token, cleanPoolId_(params.poolId)), params.callback)
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
  const grade = cleanGrade_(row[7])
  const className = cleanClassName_(row[8])
  if (String(row[9] || '').toLowerCase() === 'true') return [FOUNDATION_POOL_ID]
  if (!grade || !className) return []
  return [grade + '-' + className]
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
  if (playerIndex < 0 || !token || String(rows[playerIndex][6] || '') !== tokenHashFor_(token, playerKey)) return null
  return { playerKey, playerIndex }
}

function recordAnswer_(params) {
  const name = cleanName_(params.name)
  const course = cleanCourse_(params.course)
  const questionId = String(params.questionId || '')
  const question = questionFor_(course, questionId)
  const requestedPool = cleanPoolId_(params.poolId)
  if (!name || !course || !questionId || !question) return json_({ ok: false, reason: 'invalid-question' }, params.callback)

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const book = getBook_()
    const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
    const answers = getOrCreateSheet_(book, 'Answers', ANSWER_HEADERS)
    const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
    const poolProfiles = getOrCreateSheet_(book, 'PoolProfiles', POOL_PROFILE_HEADERS)
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
    const duplicate = rows.slice(1).some((row) => row[0] === playerKey && rankingCourses_(course).includes(String(row[1])) && row[2] === questionId)
    // A retry may follow a lost response. Return the authoritative rating without scoring twice.
    if (duplicate) return json_({ ok: false, reason: 'already-answered', rating: activeProfile.rating, delta: 0, poolId: activePool, ratings: ratingsFromProfiles_(profiles) }, params.callback)
    // New clients send the answer text. Older queued answers only have the
    // browser's result, so retain a temporary compatibility path for them.
    const serverValidated = submittedAnswer.length > 0
    const correct = serverValidated ? isAnswerCorrect_(question, submittedAnswer) : params.legacyCorrect === 'true' || params.correct === 'true'
    const safeDelta = serverValidated
      ? (correct ? RATING_POINTS[question.difficulty] : -RATING_LOSS[question.difficulty])
      : Math.max(-50, Math.min(50, Number(params.delta || 0)))
    const now = new Date()
    answers.appendRow([playerKey, course, questionId, correct, safeDelta, now])
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
    const result = { ok: true, rating: activeUpdated.rating, delta: safeDelta, correct, serverValidated, poolId: activePool, ratings: ratingsFromProfiles_(updatedProfiles) }
    if (String(params.compact) !== 'true') result.players = leaderboard_(players, courseProfiles, poolProfiles, course, activePool, playerKey)
    return json_(result, params.callback)
  } finally {
    lock.releaseLock()
  }
}

function getLeaderboard_(course, poolId, name, authToken, callback) {
  course = cleanCourse_(course) || COURSE_NAME
  const book = getBook_()
  const players = getOrCreateSheet_(book, 'Players', PLAYER_HEADERS)
  const courseProfiles = getOrCreateSheet_(book, 'CourseProfiles', COURSE_PROFILE_HEADERS)
  const poolProfiles = getOrCreateSheet_(book, 'PoolProfiles', POOL_PROFILE_HEADERS)
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
  const playerRows = playersSheet.getDataRange().getValues().slice(1).filter((row) => row[0] && row[1])
  const rankingCourses = rankingCourses_(course)
  if (poolId === 'all') {
    const profileRows = courseProfilesSheet.getDataRange().getValues().slice(1)
      .filter((row) => row[0] && rankingCourses.includes(String(row[1])))
    const names = new Map(playerRows.map((row) => [String(row[0]), String(row[1])]))
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
  const compact = original.replace(/[\s\p{P}\p{S}]+/gu, '')
  return JAPANESE_INAPPROPRIATE_PATTERNS.some((pattern) => pattern.test(original) || pattern.test(compact)) || ENGLISH_INAPPROPRIATE_PATTERN.test(original)
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

function answeredIds_(sheet, playerKey, course) {
  return sheet.getDataRange().getValues().slice(1)
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
