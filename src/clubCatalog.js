export const CLUB_OPTIONS = [
  ...[
    ['iaido', '居合道部'], ['kendo', '剣道部'], ['golf', 'ゴルフ部'], ['soccer', 'サッカー部'], ['judo', '柔道部'], ['softball', 'ソフトボール部'], ['cheer', 'チアリーディング部'], ['soft-tennis-boys', 'ソフトテニス部（男子）'], ['soft-tennis-girls', 'ソフトテニス部（女子）'], ['gymnastics', '体操競技部'], ['table-tennis', '卓球部'], ['tennis', '硬式テニス部'], ['handball', 'ハンドボール部'], ['basketball-boys', '男子バスケットボール部'], ['basketball-girls', '女子バスケットボール部'], ['badminton', 'バドミントン部'], ['volleyball-boys', '男子バレーボール部'], ['volleyball-girls', '女子バレーボール部'], ['baseball', '野球部'], ['rugby', 'ラグビー部'], ['track', '陸上競技部'], ['track-distance', '陸上競技部（長距離）'], ['wandervogel', 'ワンダーフォーゲル部'], ['dance', 'ダンス部'],
  ].map(([id, label]) => ({ id, label, group: '体育局' })),
  ...[
    ['brass-band', '吹奏楽部'], ['music', '音楽部'], ['home-economics', '家庭研究部'], ['drama', '演劇部'], ['art', '美術部'], ['english', '英語部'], ['broadcasting', '放送部'], ['calligraphy', '書道部'], ['photography', '写真部'], ['science', '科学研究部'], ['history', '歴史研究部'], ['literature', '文芸部'], ['flower-arrangement', '華道部'],
  ].map(([id, label]) => ({ id, label, group: '文化局' })),
  { id: 'none', label: '無所属', group: 'その他' },
]

export const clubPoolId = (clubId) => clubId ? `club:${clubId}` : ''
export const getClubLabel = (clubId) => CLUB_OPTIONS.find((club) => club.id === clubId)?.label || ''

export function preferredPoolIdsForProfile({ grade = '', className = '', foundationMember = false, clubId = '' } = {}) {
  const classPool = grade && className ? `${grade}-${className}` : ''
  const pools = foundationMember ? ['foundation', ...(classPool ? [classPool] : [])] : (classPool ? [classPool] : [])
  if (CLUB_OPTIONS.some((club) => club.id === clubId)) pools.push(clubPoolId(clubId))
  return pools
}
