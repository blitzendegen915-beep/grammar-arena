import { useEffect, useRef, useState } from 'react'

export default function AdminDeleteAccount({ name, authToken, adminToken, targetName, request, onCancel, onDeleted, onReauthenticate, onBusyChange }) {
  const heading = useRef(null)
  const [preview, setPreview] = useState(null)
  const [revision, setRevision] = useState(0)
  const [confirmationName, setConfirmationName] = useState('')
  const [reason, setReason] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const submitLock = useRef(false)
  useEffect(() => { heading.current?.focus() }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setPreview(null)
    setError('')
    setConfirmationName('')
    setAcknowledged(false)
    request({ action: 'admin-delete-preview', name, authToken, adminToken, targetName }, { timeoutMs: 30000 })
      .then((result) => {
        if (!active) return
        if (result.reason === 'admin-session-required') { setExpired(true); throw new Error('管理者セッションの期限が切れました。再認証してください。') }
        if (!result.ok || !result.student || !result.confirmationToken) throw new Error(result.reason === 'owner-protected' ? '教員アカウントは削除できません。' : 'このアカウントは見つからないか、既に削除されています。')
        setPreview(result)
      })
      .catch((requestError) => { if (active) setError(requestError.message || '対象を確認できませんでした。再試行してください。') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [name, authToken, adminToken, targetName, request, revision])

  const canDelete = Boolean(preview && confirmationName === preview.student.name && reason.trim() && acknowledged && !busy)
  const submit = async (event) => {
    event.preventDefault()
    if (!canDelete || submitLock.current) return
    submitLock.current = true
    setBusy(true)
    onBusyChange(true)
    setError('')
    try {
      const result = await request({ action: 'admin-delete-account', name, authToken, adminToken, targetName: preview.student.name,
        confirmationToken: preview.confirmationToken, confirmName: confirmationName, reason: reason.trim() }, { timeoutMs: 30000 })
      if (result.ok) { onDeleted(preview.student.name); return }
      if (result.reason === 'admin-session-required') { setExpired(true); setPreview(null); setError('管理者セッションの期限が切れました。再認証してください。'); return }
      if (['target-changed', 'delete-confirmation-required'].includes(result.reason)) {
        setPreview(null)
        setError('対象の情報が変わったか、確認の有効期限が切れました。対象を再確認してください。')
        return
      }
      setError(result.reason === 'owner-protected' ? '教員アカウントは削除できません。' : '削除できませんでした。対象を再確認してください。')
    } catch {
      setError('通信結果を確認できませんでした。同じ内容で再試行できます。重複して削除されることはありません。')
    } finally {
      submitLock.current = false
      setBusy(false)
      onBusyChange(false)
    }
  }

  return <section className="admin-delete-panel" aria-labelledby="admin-delete-title" aria-busy={busy || loading}>
    <h3 id="admin-delete-title" ref={heading} tabIndex={-1}>アカウント削除の確認</h3>
    <p className="admin-delete-warning">削除するとログインが失効し、全講座・全プールのランキングから外れます。回答記録と削除理由は管理用に保持します。同じ名前での再登録もできなくなります。</p>
    {loading && <p role="status">サーバーで対象アカウントを確認しています…</p>}
    {error && <div className="admin-error" role="alert">{error}{!preview && !loading && <button type="button" className="secondary-button" onClick={expired ? onReauthenticate : () => setRevision((value) => value + 1)}>{expired ? '管理者認証へ' : '対象を再確認する'}</button>}</div>}
    {preview && <form onSubmit={submit}>
      <dl className="admin-delete-target"><div><dt>ユーザー名</dt><dd>{preview.student.name}</dd></div><div><dt>所属</dt><dd>{preview.student.grade && preview.student.className ? `${preview.student.grade}年${preview.student.className}組` : 'クラス未登録'}{preview.student.foundationMember ? ' ・ 基礎講座受講' : ''}</dd></div><div><dt>削除の対象範囲</dt><dd>このアカウントの全講座・全プール</dd></div></dl>
      <label>削除理由<textarea rows={2} maxLength={240} required value={reason} disabled={busy} onChange={(event) => setReason(event.target.value)} placeholder="例：重複登録の整理" /></label>
      <label>確認のためユーザー名を入力<input value={confirmationName} autoComplete="off" disabled={busy} onChange={(event) => setConfirmationName(event.target.value)} placeholder={preview.student.name} required /></label>
      <label className="admin-delete-acknowledgement"><input type="checkbox" checked={acknowledged} disabled={busy} onChange={(event) => setAcknowledged(event.target.checked)} /><span>この生徒の全講座・全プールでの利用を停止することを確認しました。</span></label>
      <div className="admin-delete-actions"><button type="button" className="secondary-button" disabled={busy} onClick={onCancel}>削除をやめて一覧へ</button><button type="submit" className="admin-danger-button" disabled={!canDelete}>{busy ? '削除を反映しています…' : 'このアカウントを削除する'}</button></div>
    </form>}
    {!preview && <button type="button" className="secondary-button" disabled={busy} onClick={onCancel}>一覧へ戻る</button>}
  </section>
}
