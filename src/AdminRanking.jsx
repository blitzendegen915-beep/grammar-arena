import { useEffect, useRef, useState } from 'react'

const CLASSES = 'ABCDEFGHIJKLM'.split('')
const UPDATED_TIME = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit' })

export default function AdminRanking({ name, authToken, adminToken, initialCourse, request, onReauthenticate }) {
  const [filters, setFilters] = useState(() => ({ course: initialCourse, grade: '', className: '', query: '' }))
  const [draftQuery, setDraftQuery] = useState('')
  const [page, setPage] = useState(1)
  const [revision, setRevision] = useState(0)
  const [response, setResponse] = useState(null)
  const [failure, setFailure] = useState(null)
  const requestId = useRef(0)
  const data = response?.filters === filters && response?.page === page && response?.revision === revision ? response.data : null
  const error = failure?.filters === filters && failure?.page === page && failure?.revision === revision ? failure : null
  const loading = !data && !error

  useEffect(() => {
    const id = ++requestId.current
    let active = true
    setResponse(null)
    setFailure(null)
    request({ action: 'admin-ranking', name, authToken, adminToken, ...filters, page, pageSize: 50 }, { timeoutMs: 30000 })
      .then((result) => {
        if (!active || id !== requestId.current) return
        if (!result.ok) {
          const expired = result.reason === 'admin-session-required' || result.reason === 'auth-required'
          setFailure({ filters, page, revision, expired, message: expired
            ? '管理者セッションの期限が切れました。再認証してください。'
            : 'ランキングを取得できませんでした。条件を確認して再試行してください。' })
          return
        }
        if (!Array.isArray(result.students) || result.course !== filters.course || !Number.isInteger(result.pageCount)) {
          throw new Error('teacher-backend-update-required')
        }
        setResponse({ filters, page, revision, data: result })
      })
      .catch((requestError) => {
        if (!active || id !== requestId.current) return
        setFailure({ filters, page, revision, expired: false, message: requestError.message === 'teacher-backend-update-required'
          ? 'サーバー側の教員ページが未更新です。更新後に再読み込みしてください。'
          : '通信に失敗しました。接続を確認して再読み込みしてください。' })
      })
    return () => { active = false }
  }, [name, authToken, adminToken, filters, page, revision, request])

  const updateFilters = (changes) => {
    setFilters((current) => ({ ...current, ...changes }))
    setPage(1)
  }
  const search = (event) => {
    event.preventDefault()
    updateFilters({ query: draftQuery.trim() })
  }
  const clear = () => {
    setDraftQuery('')
    updateFilters({ grade: '', className: '', query: '' })
  }

  return <section className="teacher-ranking" aria-labelledby="teacher-ranking-title">
    <div className="teacher-ranking-heading">
      <div><h3 id="teacher-ranking-title">講座別・全体ランキング</h3><p>検索・絞り込み後も、選択した講座の全体順位を表示します。</p></div>
      <button type="button" className="secondary-button" disabled={loading} onClick={() => setRevision((value) => value + 1)}>再読み込み</button>
    </div>
    <form className="teacher-ranking-filters" onSubmit={search}>
      <label>講座<select value={filters.course} onChange={(event) => updateFilters({ course: event.target.value })}>
        <option value="foundation-course">基礎講座</option><option value="regular-english-practice">平常授業</option>
      </select></label>
      <label>学年<select value={filters.grade} onChange={(event) => updateFilters({ grade: event.target.value })}>
        <option value="">全学年</option>{['1', '2', '3'].map((grade) => <option key={grade} value={grade}>{grade}年</option>)}<option value="unassigned">未登録</option>
      </select></label>
      <label>クラス<select value={filters.className} onChange={(event) => updateFilters({ className: event.target.value })}>
        <option value="">全クラス</option>{CLASSES.map((className) => <option key={className} value={className}>{className}組</option>)}<option value="unassigned">未登録</option>
      </select></label>
      <label className="teacher-ranking-query">生徒名・所属で検索<input type="search" maxLength={80} placeholder="例：生徒名、1-A" value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} /></label>
      <button type="submit" className="primary-button">検索</button>
      <button type="button" className="secondary-button" onClick={clear}>条件をクリア</button>
    </form>
    <div className="teacher-ranking-status" role="status" aria-live="polite">
      {loading ? 'ランキングを読み込んでいます…' : data ? <><strong>該当 {data.filteredTotal.toLocaleString()}人</strong><span>講座全体：レート記録あり {data.rankedTotal.toLocaleString()}人 / 登録 {data.total.toLocaleString()}人</span><small>取得 {UPDATED_TIME.format(new Date(data.updatedAt))}（日本時間）</small></> : null}
    </div>
    {error && <div className="admin-error" role="alert"><p>{error.message}</p>{error.expired
      ? <button type="button" className="secondary-button" onClick={onReauthenticate}>管理者認証へ</button>
      : <button type="button" className="secondary-button" onClick={() => setRevision((value) => value + 1)}>再試行</button>}</div>}
    {data && <>
      <div className="teacher-ranking-scroll" role="region" aria-label="全体ランキングの一覧" tabIndex={0}>
        <table className="teacher-ranking-table">
          <caption className="visually-hidden">{filters.course === 'foundation-course' ? '基礎講座' : '平常授業'}の全体順位、学年、クラス、生徒名、レート</caption>
          <thead><tr><th scope="col">全体順位</th><th scope="col">学年</th><th scope="col">クラス</th><th scope="col">ユーザー名</th><th scope="col">レート</th></tr></thead>
          <tbody>{data.students.length ? data.students.map((student) => <tr key={student.name}>
            <td className="teacher-rank">{student.rank === null ? '—' : `${student.rank.toLocaleString()}位`}</td>
            <td>{student.grade ? `${student.grade}年` : '未登録'}</td><td>{student.className ? `${student.className}組` : '未登録'}</td>
            <th scope="row">{student.name}{student.foundationMember && <small className="teacher-member-badge">基礎講座受講</small>}</th>
            <td className="teacher-rate">{student.rating === null ? <span className="teacher-unranked">未参加</span> : <><strong>{student.rating.toLocaleString()}</strong><small>{student.ratingPoolId === 'foundation' ? '基礎講座プール' : student.ratingPoolId === 'legacy' ? '旧講座記録' : student.ratingPoolId}</small></>}</td>
          </tr>) : <tr><td colSpan={5} className="teacher-ranking-empty">条件に一致する生徒はいません。検索条件を変更してください。</td></tr>}</tbody>
        </table>
      </div>
      <div className="teacher-ranking-pagination" aria-label="ランキングのページ切り替え">
        <button type="button" className="secondary-button" disabled={data.page <= 1} onClick={() => setPage(data.page - 1)}>前の50人</button>
        <span>{data.page} / {data.pageCount} ページ</span>
        <button type="button" className="secondary-button" disabled={data.page >= data.pageCount} onClick={() => setPage(data.page + 1)}>次の50人</button>
      </div>
    </>}
    <p className="teacher-ranking-note">同じレートは同順位です。平常授業は所属クラス、基礎講座は基礎講座プールの記録を優先し、未記録の場合は別の所属プール・旧講座記録を参照します。講座の記録がない人は「未参加」と表示します。</p>
  </section>
}
