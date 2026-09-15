import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Download, 
  Copy, 
  Check, 
  Users, 
  UserCheck, 
  UserX, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Lock, 
  Sparkles,
  Heart,
  MessageSquare
} from 'lucide-react';
import { RSVP, RSVPStats } from '../types';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [stats, setStats] = useState<RSVPStats>({
    totalResponses: 0,
    attendingCount: 0,
    declinedCount: 0,
    totalCompanionsCount: 0,
    totalGuestsAndCompanions: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'declined'>('all');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch RSVPs from API
  const fetchRSVPs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rsvp');
      if (res.ok) {
        const data = await res.json();
        setRsvps(data.rsvps || []);
        setStats(data.stats || {
          totalResponses: 0,
          attendingCount: 0,
          declinedCount: 0,
          totalCompanionsCount: 0,
          totalGuestsAndCompanions: 0
        });
      }
    } catch (err) {
      console.error('Error fetching RSVPs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRSVPs();
    }
  }, [isOpen]);

  // Auth Handler
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    // Passcode: 29051472
    const clean = passcode.trim().toLowerCase();
    if (clean === '29051472') {
      setIsAuthenticated(true);
      setAuthError(false);
      fetchRSVPs();
    } else {
      setAuthError(true);
    }
  };

  // Delete RSVP
  const handleDeleteRSVP = async (id: string) => {
    try {
      const res = await fetch(`/api/rsvp/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRsvps(prev => prev.filter(r => r.id !== id));
        fetchRSVPs();
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Failed to delete RSVP:', err);
    }
  };

  // Copy WhatsApp Summary
  const handleCopyWhatsAppSummary = () => {
    const attendingList = rsvps.filter(r => r.attending);
    let msg = `🎓 *LISTA DE PRESENÇA - FORMATURA ANA JULIA* 💗\n`;
    msg += `📅 *10 de Outubro de 2026* • Chácara Marista\n\n`;
    msg += `📊 *RESUMO GERAL:*\n`;
    msg += `• Total de Pessoas Confirmadas: *${stats.totalGuestsAndCompanions}*\n`;
    msg += `• Convidados Titulares: *${stats.attendingCount}*\n`;
    msg += `• Acompanhantes: *${stats.totalCompanionsCount}*\n`;
    msg += `• Não comparecerão: *${stats.declinedCount}*\n\n`;
    msg += `📝 *CONFIRMADOS (Titular + Acompanhantes):*\n`;

    attendingList.forEach((r, idx) => {
      msg += `\n${idx + 1}. *${r.guestName}*`;
      if (r.companions && r.companions.length > 0) {
        msg += `\n   ↳ Acomp: ${r.companions.join(', ')}`;
      }
    });

    navigator.clipboard.writeText(msg);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  // Filtered RSVPs
  const filteredRSVPs = rsvps.filter(item => {
    // Search match
    const matchSearch =
      item.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.companions && item.companions.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

    // Status match
    if (!matchSearch) return false;
    if (filterStatus === 'attending') return item.attending;
    if (filterStatus === 'declined') return !item.attending;
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white border border-[#F472B6]/40 shadow-2xl flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FFF5F7] via-[#FFFDF9] to-[#E0F2FE] border-b border-[#F472B6]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#BE185D] text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#831843]">
                Painel da Organizadora
              </h2>
              <p className="font-body text-xs text-[#705869]">
                Gestão e controle de convidados e familiares
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-rose-100 text-stone-600 hover:text-[#BE185D] border border-stone-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Password Gateway if not authenticated */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FCE7F3] text-[#BE185D] flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#831843]">
                Área Restrita da Ana Julia
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#705869]">
                Digite a senha de acesso para visualizar a lista completa de confirmações.
              </p>

              <form onSubmit={handleAuthenticate} className="space-y-3 pt-2">
                <div>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setAuthError(false);
                    }}
                    placeholder="Digite a senha (ex: anajulia2026)"
                    className="w-full px-4 py-3 text-center text-base rounded-xl border border-[#F472B6]/50 focus:border-[#BE185D] focus:ring-2 focus:ring-[#F472B6]/30 outline-hidden bg-[#FFFDF9]"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs font-semibold text-rose-600 mt-1.5">
                      Senha incorreta.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE185D] hover:from-[#BE185D] hover:to-[#9D174D] text-white font-serif font-bold text-base shadow-md cursor-pointer"
                >
                  Entrar no Painel
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {/* Total People */}
                <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#F472B6]/30 text-center">
                  <div className="text-xs font-semibold text-[#8A7182] uppercase tracking-wider mb-1">
                    Total de Pessoas
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-[#BE185D]">
                    {stats.totalGuestsAndCompanions}
                  </div>
                  <div className="text-[11px] text-[#BE185D] mt-0.5">
                    (Titulares + Acompanhantes)
                  </div>
                </div>

                {/* Main Guests */}
                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 text-center">
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                    Titulares Confirmados
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-700">
                    {stats.attendingCount}
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-0.5">
                    Convidados diretos
                  </div>
                </div>

                {/* Companions */}
                <div className="p-4 rounded-2xl bg-[#F0F9FF] border border-sky-200 text-center">
                  <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider mb-1">
                    Acompanhantes
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-sky-700">
                    {stats.totalCompanionsCount}
                  </div>
                  <div className="text-[11px] text-sky-600 mt-0.5">
                    Familiares extras
                  </div>
                </div>

                {/* Declined */}
                <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-center">
                  <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                    Não Poderão Ir
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-700">
                    {stats.declinedCount}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Respostas recebidas
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7182]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome do convidado ou acompanhante..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:border-[#BE185D] outline-hidden bg-[#FFFDF9]"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 shrink-0">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filterStatus === 'all'
                        ? 'bg-white text-[#BE185D] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Todos ({rsvps.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('attending')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filterStatus === 'attending'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Confirmados ({stats.attendingCount})
                  </button>
                  <button
                    onClick={() => setFilterStatus('declined')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filterStatus === 'declined'
                        ? 'bg-white text-stone-800 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Não vão ({stats.declinedCount})
                  </button>
                </div>

                {/* Export & Copy Tools */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyWhatsAppSummary}
                    className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    title="Copiar lista formatada para enviar no WhatsApp"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Copiado!' : 'Copiar p/ Zap'}</span>
                  </button>

                  <a
                    href="/api/rsvp/export"
                    download
                    className="px-3 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                    title="Baixar planilha CSV para o Excel"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar CSV</span>
                  </a>

                  <button
                    onClick={fetchRSVPs}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                    title="Atualizar lista"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Guest Table / Card List */}
              <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-xs">
                {filteredRSVPs.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 font-body text-sm">
                    {searchTerm
                      ? 'Nenhum convidado encontrado com os termos pesquisados.'
                      : 'Nenhuma confirmação registrada ainda.'}
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {filteredRSVPs.map((r) => (
                      <div
                        key={r.id}
                        className="p-4 hover:bg-[#FFFDF9] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base sm:text-lg font-bold text-[#831843]">
                              {r.guestName}
                            </span>
                            {r.attending ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                                <UserCheck className="w-3 h-3" /> Confirmado ({1 + (r.companions?.length || 0)} pess.)
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-semibold flex items-center gap-1">
                                <UserX className="w-3 h-3" /> Não comparecerá
                              </span>
                            )}
                          </div>

                          {/* Companions */}
                          {r.attending && r.companions && r.companions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#52434E] pt-0.5">
                              <span className="font-semibold text-[#BE185D] flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" /> Acompanhantes ({r.companions.length}):
                              </span>
                              {r.companions.map((c, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0369A1] font-medium"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Optional message */}
                          {r.message && (
                            <div className="text-xs text-[#705869] italic bg-[#FFF5F7] p-2 rounded-lg border border-[#F472B6]/20 mt-1 flex items-start gap-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-[#DB2777] shrink-0 mt-0.5" />
                              <span>"{r.message}"</span>
                            </div>
                          )}

                          <div className="text-[10px] text-[#A08899]">
                            Confirmado em: {new Date(r.updatedAt || r.createdAt).toLocaleString('pt-BR')}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="shrink-0 flex items-center gap-2">
                          {deleteConfirmId === r.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteRSVP(r.id)}
                                className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 cursor-pointer"
                              >
                                Confirmar Exclusão
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-stone-200 text-stone-700 text-xs rounded-lg hover:bg-stone-300 cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(r.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover confirmação"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
};
