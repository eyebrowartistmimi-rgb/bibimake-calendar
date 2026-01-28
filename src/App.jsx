import React, { useState, createContext, useContext } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Calendar, LogIn, LogOut, Eye, Edit3, Trash2, Clock, MapPin, ExternalLink } from 'lucide-react';

const APP_CONFIG = { schoolName: 'BIBIMAKE', tagline: 'アートメイクスクール' };
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const initialEvents = [
  { id: '1', title: '【初級】眉アートメイク基礎講座', date: '2026-02-01', time: '10:00', endTime: '17:00', location: 'オンライン', instructor: 'MIMI先生', description: '眉アートメイクの基礎技術を学びます。', bookingUrl: 'https://example.com/booking/1', isPublic: true },
  { id: '2', title: '【中級】リップアートメイク実技', date: '2026-02-05', time: '13:00', endTime: '18:00', location: '東京オフィス', instructor: 'MIMI先生', description: 'リップアートメイクの実技練習。', bookingUrl: 'https://example.com/booking/2', isPublic: true },
  { id: '3', title: '月例オンラインQ&A', date: '2026-02-10', time: '20:00', endTime: '21:30', location: 'Zoom', instructor: 'MIMI先生', description: '生徒さんからの質問にお答えします。', bookingUrl: 'https://example.com/booking/3', isPublic: true },
  { id: '4', title: '【スタッフ】運営ミーティング', date: '2026-02-03', time: '09:00', endTime: '10:00', location: 'オンライン', instructor: '', description: 'スタッフ向け運営会議', bookingUrl: '', isPublic: false },
];

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const signIn = () => setUser({ displayName: 'MIMI', isAdmin: true });
  const signOut = () => setUser(null);
  return <AuthContext.Provider value={{ user, signIn, signOut, isAdmin: user?.isAdmin }}>{children}</AuthContext.Provider>;
}

function Header() {
  const { user, signIn, signOut, isAdmin } = useAuth();
  return (
    <header className="bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow text-xl">💄</div>
          <div><h1 className="text-xl font-bold">{APP_CONFIG.schoolName}</h1><p className="text-pink-100 text-xs">{APP_CONFIG.tagline}</p></div>
        </div>
        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">{user.displayName[0]}</div>
              <span className="text-sm">{user.displayName}</span>
              {isAdmin && <span className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-bold">管理者</span>}
            </div>
            <button onClick={signOut} className="p-2 hover:bg-white/20 rounded-full"><LogOut className="w-4 h-4" /></button>
          </div>
        ) : (
          <button onClick={signIn} className="flex items-center gap-2 bg-white text-pink-600 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-pink-50 shadow"><LogIn className="w-4 h-4" />スタッフログイン</button>
        )}
      </div>
    </header>
  );
}

function EventDetailModal({ event, onClose, isAdmin, onEdit, onDelete }) {
  if (!event) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="p-5 text-white relative bg-gradient-to-r from-pink-500 to-purple-500">
          <button onClick={onClose} className="absolute top-3 right-3 p-2 hover:bg-white/20 rounded-full"><X className="w-5 h-5" /></button>
          <h2 className="text-lg font-bold pr-8">{event.title}</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4"><div className="text-xs text-gray-500 mb-1">日時</div><div className="font-bold text-gray-800">{new Date(event.date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}</div><div className="text-sm text-gray-600">{event.time} - {event.endTime}</div></div>
            <div className="bg-gray-50 rounded-xl p-4"><div className="text-xs text-gray-500 mb-1">場所</div><div className="font-bold text-gray-800">{event.location || '未定'}</div></div>
          </div>
          {event.instructor && <div className="bg-gray-50 rounded-xl p-4"><div className="text-xs text-gray-500 mb-1">講師</div><div className="font-bold text-gray-800">{event.instructor}</div></div>}
          {event.description && <div><div className="text-xs text-gray-500 mb-2">詳細</div><p className="text-gray-700 whitespace-pre-line">{event.description}</p></div>}
          {!isAdmin && event.bookingUrl && <a href={event.bookingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg"><ExternalLink className="w-5 h-5" />予約する</a>}
          {isAdmin && event.bookingUrl && <div className="bg-blue-50 rounded-xl p-4"><div className="text-xs text-blue-600 mb-1">予約リンク</div><a href={event.bookingUrl} target="_blank" className="text-blue-600 text-sm underline break-all">{event.bookingUrl}</a></div>}
        </div>
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          {isAdmin ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit(event)} className="flex-1 flex items-center justify-center gap-2 bg-pink-500 text-white py-3 rounded-xl font-medium"><Edit3 className="w-4 h-4" />編集</button>
              <button onClick={() => onDelete(event.id)} className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="w-5 h-5" /></button>
            </div>
          ) : <button onClick={onClose} className="w-full py-3 text-gray-600 hover:bg-gray-200 rounded-xl">閉じる</button>}
        </div>
      </div>
    </div>
  );
}

function EventEditModal({ event, onClose, onSave }) {
  const [form, setForm] = useState({ title: event?.title || '', date: event?.date || new Date().toISOString().split('T')[0], time: event?.time || '10:00', endTime: event?.endTime || '17:00', location: event?.location || '', instructor: event?.instructor || 'MIMI先生', description: event?.description || '', bookingUrl: event?.bookingUrl || '', isPublic: event?.isPublic ?? true });
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-bold">{event ? '予定を編集' : '新しい予定'}</h2><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button></div>
        <div className="p-4 space-y-4">
          <div><label className="block text-sm font-medium mb-1">タイトル *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 border rounded-xl" placeholder="【初級】眉アートメイク基礎講座" /></div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="block text-sm font-medium mb-1">日付</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-2 py-3 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-1">開始</label><input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-2 py-3 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-1">終了</label><input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className="w-full px-2 py-3 border rounded-xl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-sm font-medium mb-1">場所</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full px-4 py-3 border rounded-xl" placeholder="東京オフィス" /></div>
            <div><label className="block text-sm font-medium mb-1">講師</label><input value={form.instructor} onChange={e => setForm({...form, instructor: e.target.value})} className="w-full px-4 py-3 border rounded-xl" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">詳細</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-3 border rounded-xl resize-none" /></div>
          <div><label className="block text-sm font-medium mb-1">予約リンク</label><input value={form.bookingUrl} onChange={e => setForm({...form, bookingUrl: e.target.value})} className="w-full px-4 py-3 border rounded-xl" placeholder="https://..." /></div>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div><div className="font-medium">生徒に公開</div><div className="text-sm text-gray-500">オフ=スタッフのみ</div></div>
            <button onClick={() => setForm({...form, isPublic: !form.isPublic})} className={`w-14 h-8 rounded-full relative ${form.isPublic ? 'bg-pink-500' : 'bg-gray-300'}`}><div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow ${form.isPublic ? 'right-1' : 'left-1'}`} /></button>
          </div>
        </div>
        <div className="p-4 border-t flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 text-gray-600 hover:bg-gray-100 rounded-xl">キャンセル</button>
          <button onClick={() => form.title && onSave(form)} disabled={!form.title} className="flex-1 py-3 bg-pink-500 disabled:bg-gray-300 text-white rounded-xl font-medium">保存</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState('calendar');
  
  const isAdmin = user?.isAdmin;
  const visibleEvents = events.filter(e => isAdmin || e.isPublic);
  const formatDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const today = formatDate(new Date());
  
  const getDays = () => {
    const y = currentDate.getFullYear(), m = currentDate.getMonth();
    const first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
    const days = [], prevLast = new Date(y, m, 0).getDate();
    for (let i = first.getDay() - 1; i >= 0; i--) days.push({ date: new Date(y, m - 1, prevLast - i), curr: false });
    for (let i = 1; i <= last.getDate(); i++) days.push({ date: new Date(y, m, i), curr: true });
    while (days.length < 42) days.push({ date: new Date(y, m + 1, days.length - last.getDate() - first.getDay() + 1), curr: false });
    return days;
  };
  
  const handleSave = form => {
    if (editingEvent) setEvents(events.map(e => e.id === editingEvent.id ? {...e, ...form} : e));
    else setEvents([...events, {...form, id: Date.now().toString()}]);
    setEditModal(false); setEditingEvent(null);
  };
  
  const openEdit = (e = null) => { setEditingEvent(e); setEditModal(true); setSelectedEvent(null); };
  const upcoming = visibleEvents.filter(e => e.date >= today).sort((a,b) => a.date.localeCompare(b.date));

  return (
    <AuthContext.Provider value={{ user, signIn: () => setUser({ displayName: 'MIMI', isAdmin: true }), signOut: () => setUser(null), isAdmin }}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-white rounded-xl shadow-sm border p-3 mb-4 flex items-center justify-between">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'calendar' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600'}`}><Calendar className="w-4 h-4 inline mr-1" />カレンダー</button>
              <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'list' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600'}`}><Eye className="w-4 h-4 inline mr-1" />リスト</button>
            </div>
            {isAdmin && <button onClick={() => openEdit()} className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg font-medium shadow"><Plus className="w-5 h-5" />予定を追加</button>}
          </div>
          
          {view === 'calendar' ? (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                <h2 className="text-xl font-bold">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-7 border-b">
                {['日','月','火','水','木','金','土'].map((d,i) => <div key={d} className={`py-3 text-center text-sm font-medium ${i===0?'text-red-500':i===6?'text-blue-500':'text-gray-600'}`}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7">
                {getDays().map((day, i) => {
                  const ds = formatDate(day.date), evts = visibleEvents.filter(e => e.date === ds), isToday = ds === today, dow = day.date.getDay();
                  return (
                    <div key={i} className={`min-h-[90px] border-b border-r border-gray-100 p-1.5 ${!day.curr ? 'bg-gray-50' : ''}`}>
                      <span className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${isToday ? 'bg-pink-500 text-white font-bold' : !day.curr ? 'text-gray-300' : dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : ''}`}>{day.date.getDate()}</span>
                      <div className="mt-1 space-y-1">
                        {evts.slice(0,2).map(e => <div key={e.id} onClick={() => setSelectedEvent(e)} className="text-xs px-1.5 py-1 rounded bg-pink-500 text-white truncate cursor-pointer">{e.title}</div>)}
                        {evts.length > 2 && <div className="text-xs text-gray-500">+{evts.length-2}件</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">今後の予定</h2>
              {upcoming.length ? upcoming.map(e => (
                <div key={e.id} onClick={() => setSelectedEvent(e)} className="bg-white rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md">
                  <div className="text-sm text-gray-500 mb-1">{new Date(e.date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}</div>
                  <h3 className="font-bold text-gray-800">{e.title}</h3>
                  <div className="flex gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{e.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{e.location}</span>
                  </div>
                </div>
              )) : <div className="text-center py-12 text-gray-500">予定はありません</div>}
            </div>
          )}
        </main>
        {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} isAdmin={isAdmin} onEdit={openEdit} onDelete={id => { setEvents(events.filter(e => e.id !== id)); setSelectedEvent(null); }} />}
        {editModal && <EventEditModal event={editingEvent} onClose={() => { setEditModal(false); setEditingEvent(null); }} onSave={handleSave} />}
        <footer className="bg-white border-t mt-8 py-6 text-center text-sm text-gray-500">© 2026 {APP_CONFIG.schoolName}<br /><span className="text-pink-500">{isAdmin ? '✓ 管理者モード' : '生徒用閲覧モード'}</span></footer>
      </div>
    </AuthContext.Provider>
  );
}
