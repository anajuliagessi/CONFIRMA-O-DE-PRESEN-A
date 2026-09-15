import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Check, 
  User, 
  Users, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  AlertCircle,
  Share2,
  CheckCircle2,
  XCircle,
  Edit3
} from 'lucide-react';
import { RSVP, StepState } from '../types';

interface RSVPFormProps {
  onRSVPSubmitted?: (rsvp: RSVP) => void;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onRSVPSubmitted }) => {
  // Form State
  const [step, setStep] = useState<StepState>('start');
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [hasCompanions, setHasCompanions] = useState<boolean | null>(null);
  const [currentCompanionInput, setCurrentCompanionInput] = useState('');
  const [companionsList, setCompanionsList] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  
  // Submission & Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedRSVP, setSubmittedRSVP] = useState<RSVP | null>(null);
  const [existingRecord, setExistingRecord] = useState<RSVP | null>(null);
  const [showExistingNotice, setShowExistingNotice] = useState(false);

  // Check if guest name already RSVP'd when leaving step 1
  const checkDuplicateName = async (nameToCheck: string) => {
    try {
      const res = await fetch(`/api/rsvp/check?name=${encodeURIComponent(nameToCheck.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.exists && data.rsvp) {
          setExistingRecord(data.rsvp);
          setShowExistingNotice(true);
        } else {
          setExistingRecord(null);
          setShowExistingNotice(false);
        }
      }
    } catch {
      // Ignore network errors on check
    }
  };

  const handleUseExisting = (record: RSVP) => {
    setGuestName(record.guestName);
    setAttending(record.attending);
    setHasCompanions(record.hasCompanions);
    setCompanionsList(record.companions || []);
    setMessage(record.message || '');
    setShowExistingNotice(false);
    setStep('presence_choice');
  };

  // Step 1: Proceed from Name input
  const handleProceedFromName = async () => {
    const trimmed = guestName.trim();
    if (!trimmed || trimmed.length < 3) {
      setErrorMessage('Por favor, digite seu nome completo (pelo menos 3 caracteres).');
      return;
    }
    setErrorMessage('');
    await checkDuplicateName(trimmed);
    setStep('presence_choice');
  };

  // Step 2: Handle Presence Choice
  const handlePresenceChoice = (choice: boolean) => {
    setAttending(choice);
    setErrorMessage('');
    if (choice) {
      setStep('companions_choice');
    } else {
      setHasCompanions(false);
      setCompanionsList([]);
      setStep('review');
    }
  };

  // Step 3: Handle Companion Choice
  const handleCompanionChoice = (choice: boolean) => {
    setHasCompanions(choice);
    setErrorMessage('');
    if (choice) {
      setStep('companions_list');
    } else {
      setCompanionsList([]);
      setStep('review');
    }
  };

  // Add a companion to the list
  const handleAddCompanion = () => {
    const trimmed = currentCompanionInput.trim();
    if (!trimmed) {
      setErrorMessage('Digite o nome completo do acompanhante.');
      return;
    }
    if (trimmed.toLowerCase() === guestName.trim().toLowerCase()) {
      setErrorMessage('O nome do acompanhante não pode ser igual ao seu nome.');
      return;
    }
    if (companionsList.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage('Este acompanhante já foi adicionado na lista.');
      return;
    }
    
    setCompanionsList([...companionsList, trimmed]);
    setCurrentCompanionInput('');
    setErrorMessage('');
  };

  // Remove a companion
  const handleRemoveCompanion = (index: number) => {
    setCompanionsList(companionsList.filter((_, i) => i !== index));
  };

  // Proceed from companion list to review
  const handleProceedFromCompanions = () => {
    if (currentCompanionInput.trim() && !companionsList.includes(currentCompanionInput.trim())) {
      setCompanionsList([...companionsList, currentCompanionInput.trim()]);
      setCurrentCompanionInput('');
    }

    if (companionsList.length === 0 && !currentCompanionInput.trim()) {
      setErrorMessage('Por favor, adicione pelo menos um acompanhante ou selecione que irá sozinho(a).');
      return;
    }

    setErrorMessage('');
    setStep('review');
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      guestName: guestName.trim(),
      attending: Boolean(attending),
      hasCompanions: Boolean(hasCompanions && companionsList.length > 0),
      companions: attending ? companionsList : [],
      message: message.trim() || undefined
    };

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao enviar confirmação.');
      }

      const result = await response.json();
      setSubmittedRSVP(result.rsvp);

      if (onRSVPSubmitted) {
        onRSVPSubmitted(result.rsvp);
      }

      if (attending) {
        setStep('confirmed_yes');
        triggerConfetti();
      } else {
        setStep('confirmed_no');
      }
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMessage(e.message || 'Houve uma falha ao registrar sua resposta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger celebration confetti in vibrant colors
  const triggerConfetti = () => {
    try {
      const count = 220;
      const defaults = {
        origin: { y: 0.6 },
        colors: ['#FF007F', '#FF1493', '#FF5500', '#FF7700', '#FFA500', '#E11D48', '#FF4500']
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }
  };

  const handleEditAgain = () => {
    setStep('start');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Oi Ana Julia! Acabei de confirmar minha presença na sua festa de formatura! Parabéns por essa conquista maravilhosa! 💗🎉🎓`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section id="confirmar" className="relative w-full py-12 px-4 sm:px-6 scroll-mt-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-50 to-orange-50 border border-[#FF4D8D]/30 text-[#E11D48] text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-[#FF1493] text-[#FF1493]" />
            <span className="bg-gradient-to-r from-[#FF007F] to-[#FF5500] bg-clip-text text-transparent font-bold">
              Confirmação de Presença
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] bg-clip-text text-transparent italic tracking-tight mb-3">
            Você vem comemorar comigo?
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#705869] max-w-lg mx-auto leading-relaxed">
            Confirme sua presença e só adicione o nome do seu acompanhante caso ele tenha sido convidado pela formanda.
          </p>
        </div>

        {/* Main Interactive Form Card */}
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-white/95 backdrop-blur-md shadow-2xl shadow-pink-200/50 p-6 sm:p-10 border border-[#FF4D8D]/20">
          
          {/* Vibrant Watercolor Corner Stains (No flowers) */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-bl from-[#FF5500]/40 to-[#FFA500]/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-gradient-to-tr from-[#FF007F]/45 to-[#FF2E93]/25 blur-2xl pointer-events-none" />

          {/* Progress Indicator */}
          {step !== 'confirmed_yes' && step !== 'confirmed_no' && (
            <div className="mb-8 relative z-10">
              <div className="flex items-center justify-between text-xs font-medium text-[#E11D48] mb-2">
                <span className="font-serif italic text-sm text-[#52434E]">
                  {step === 'start' && 'Etapa 1 de 3: Identificação'}
                  {step === 'presence_choice' && 'Etapa 2 de 3: Sua Presença'}
                  {step === 'companions_choice' && 'Etapa 2 de 3: Acompanhantes'}
                  {step === 'companions_list' && 'Etapa 2 de 3: Nomes dos Acompanhantes'}
                  {step === 'review' && 'Etapa 3 de 3: Conferência e Envio'}
                </span>
                <span className="font-bold bg-gradient-to-r from-[#FF007F] to-[#FF5500] bg-clip-text text-transparent">
                  {step === 'start' && '33%'}
                  {step === 'presence_choice' && '50%'}
                  {step === 'companions_choice' && '65%'}
                  {step === 'companions_list' && '80%'}
                  {step === 'review' && '100%'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-gradient-to-r from-pink-50 to-orange-50 rounded-full overflow-hidden border border-pink-100">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] transition-all duration-500 rounded-full"
                  style={{
                    width:
                      step === 'start' ? '33%' :
                      step === 'presence_choice' ? '50%' :
                      step === 'companions_choice' ? '65%' :
                      step === 'companions_list' ? '80%' : '100%'
                  }}
                />
              </div>
            </div>
          )}

          {/* Error Message Toast */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 relative z-10">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Existing RSVP Notice */}
          {showExistingNotice && existingRecord && step === 'presence_choice' && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-950 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs relative z-10">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-950">Já encontramos uma resposta para este nome!</p>
                  <p className="text-xs text-amber-800">
                    Status atual: {existingRecord.attending ? '✅ Presença Confirmada' : '❌ Não comparecerá'}.
                    {existingRecord.companions?.length > 0 && ` (${existingRecord.companions.length} acompanhante(s))`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleUseExisting(existingRecord)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7700] to-[#FF5500] text-white transition-all shadow-xs whitespace-nowrap cursor-pointer hover:opacity-90"
              >
                Carregar meus dados para editar
              </button>
            </div>
          )}

          {/* FORM STEPS WITH MOTION */}
          <AnimatePresence mode="wait">
            
            {/* ETAPA 1: SEU NOME */}
            {step === 'start' && (
              <motion.div
                key="step-start"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 relative z-10"
              >
                <div>
                  <label htmlFor="guest-name-input" className="block text-xs uppercase tracking-widest text-[#8C7A87] font-bold mb-2">
                    Seu nome completo
                  </label>
                  <p className="font-body text-xs sm:text-sm text-[#705869] mb-4">
                    Informe seu nome para localizarmos seu convite na lista oficial.
                  </p>
                  
                  <div className="relative">
                    <User className="absolute left-1 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF1493]" />
                    <input
                      id="guest-name-input"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleProceedFromName();
                        }
                      }}
                      placeholder="Ex.: Ana Julia Gessi"
                      className="w-full pl-9 pr-4 py-3 text-lg sm:text-xl font-medium text-[#2D2328] border-b-2 border-[#FFCCD5] focus:border-[#FF1493] outline-none bg-transparent transition-colors placeholder:text-gray-300"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    id="btn-next-name"
                    type="button"
                    onClick={handleProceedFromName}
                    className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] hover:from-[#E11D48] hover:to-[#EA580C] text-white font-serif text-base sm:text-lg font-bold shadow-lg shadow-[#FF1493]/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>CONTINUAR</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 2: VOCÊ ESTARÁ PRESENTE? */}
            {step === 'presence_choice' && (
              <motion.div
                key="step-presence"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 relative z-10"
              >
                <div className="text-center">
                  <div className="inline-block p-2 rounded-full bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100 text-[#E11D48] mb-2 font-serif text-sm">
                    Olá, <strong className="font-semibold text-[#FF1493]">{guestName}</strong>!
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Você estará presente na comemoração?
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#705869]">
                    Sua presença tornará esse dia inesquecível!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Opção SIM */}
                  <button
                    id="btn-presence-yes"
                    type="button"
                    onClick={() => handlePresenceChoice(true)}
                    className="bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] text-white py-5 px-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-[#FF1493]/30 hover:shadow-xl hover:shadow-[#FF5500]/30 transition-transform active:scale-95 text-center flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="text-xl">💗</span>
                    <span>SIM, ESTAREI PRESENTE!</span>
                  </button>

                  {/* Opção NÃO */}
                  <button
                    id="btn-presence-no"
                    type="button"
                    onClick={() => handlePresenceChoice(false)}
                    className="bg-stone-50 hover:bg-stone-100 text-stone-500 py-5 px-4 rounded-2xl font-bold text-sm border border-stone-200 transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="text-xl">🤍</span>
                    <span>NÃO PODEREI IR</span>
                  </button>
                </div>

                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setStep('start')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E11D48] hover:text-[#BE123C] underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Corrigir meu nome</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 3: VIRÁ ACOMPANHADO? */}
            {step === 'companions_choice' && (
              <motion.div
                key="step-companions-choice"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 relative z-10"
              >
                <div className="text-center">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Você virá acompanhado(a)?
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#705869]">
                    Familiar ou acompanhante que irá comemorar junto com você.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-pink-50/70 to-orange-50/70 p-6 rounded-2xl border border-pink-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col text-center sm:text-left">
                    <span className="text-xs uppercase tracking-widest text-[#FF5500] font-bold mb-1">Acompanhantes</span>
                    <p className="text-gray-700 italic font-serif text-sm"><strong>É proibido levar acompanhantes que não tenham sido convidados!</strong></p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      id="btn-has-companion-yes"
                      type="button"
                      onClick={() => handleCompanionChoice(true)}
                      className="px-6 py-2 bg-gradient-to-r from-[#FF007F] to-[#FF5500] text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
                    >
                      SIM
                    </button>
                    <button
                      id="btn-has-companion-no"
                      type="button"
                      onClick={() => handleCompanionChoice(false)}
                      className="px-6 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      NÃO
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setStep('presence_choice')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E11D48] hover:text-[#BE123C] underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 4: LISTA DE FAMILIARES / ACOMPANHANTES */}
            {step === 'companions_list' && (
              <motion.div
                key="step-companions-list"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 relative z-10"
              >
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FF007F] to-[#FF5500] bg-clip-text text-transparent mb-1">
                    E quem vem com você?
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#705869] mb-4">
                    Informe o nome completo de cada familiar ou acompanhante para organizarmos a lista de entrada.
                  </p>

                  {/* Input field + Add button */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF1493]" />
                      <input
                        id="companion-name-input"
                        type="text"
                        value={currentCompanionInput}
                        onChange={(e) => setCurrentCompanionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCompanion();
                          }
                        }}
                        placeholder="Digite o nome completo do acompanhante"
                        className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-medium text-gray-800 bg-[#FFFDF9] rounded-2xl border border-pink-200 focus:border-[#FF1493] outline-none transition-all placeholder:text-gray-400"
                        autoFocus
                      />
                    </div>
                    <button
                      id="btn-add-companion"
                      type="button"
                      onClick={handleAddCompanion}
                      className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#FF007F] to-[#FF5500] hover:from-[#E11D48] hover:to-[#EA580C] text-white font-serif text-sm font-bold shadow-md shadow-[#FF1493]/25 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ADICIONAR</span>
                    </button>
                  </div>
                </div>

                {/* Visual List of Guests and Companions */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-pink-50/50 to-orange-50/50 border border-pink-100 shadow-xs space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#E11D48] flex items-center justify-between pb-2 border-b border-pink-100">
                    <span>Lista de Pessoas ({1 + companionsList.length})</span>
                    <span className="text-[11px] font-normal text-[#8C7A87]">Entrada garantida na lista</span>
                  </div>

                  {/* Main Guest */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-pink-200 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF007F] to-[#E11D48] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        1
                      </div>
                      <div>
                        <div className="font-serif font-bold text-gray-800 text-base">
                          {guestName}
                        </div>
                        <div className="text-[11px] font-medium text-[#E11D48]">
                          Convidado(a) Principal
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Titular
                    </span>
                  </div>

                  {/* Companions */}
                  {companionsList.map((comp, idx) => (
                    <div
                      key={`comp-${idx}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-orange-200 shadow-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FFA000] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 2}
                        </div>
                        <div>
                          <div className="font-serif font-semibold text-gray-800 text-base">
                            {comp}
                          </div>
                          <div className="text-[11px] font-medium text-[#EA580C]">
                            Acompanhante {idx + 1}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCompanion(idx)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remover acompanhante"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {companionsList.length === 0 && (
                    <p className="text-center text-xs text-gray-400 italic py-2">
                      Nenhum acompanhante adicionado ainda. Digite o nome acima e clique em "Adicionar".
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep('companions_choice')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E11D48] hover:text-[#BE123C] underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    id="btn-next-companions"
                    type="button"
                    onClick={handleProceedFromCompanions}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] hover:from-[#E11D48] hover:to-[#EA580C] text-white font-serif text-base font-bold shadow-md shadow-[#FF1493]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>AVANÇAR PARA O RESUMO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 5: RESUMO ANTES DE CONFIRMAR */}
            {step === 'review' && (
              <motion.div
                key="step-review"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 relative z-10"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-50 to-orange-50 text-[#E11D48] text-xs font-semibold mb-2 border border-pink-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Revisão Final</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    Confira sua confirmação
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#705869]">
                    Está tudo certo com as informações abaixo?
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-pink-50/40 to-orange-50/40 border border-pink-200/80 shadow-xs space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                    <span className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Presença
                    </span>
                    {attending ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SIM, ESTAREI PRESENTE!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-stone-700 text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Infelizmente não poderei ir
                      </span>
                    )}
                  </div>

                  {/* Convidado */}
                  <div>
                    <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                      Nome do Convidado
                    </span>
                    <div className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#FF007F] to-[#FF5500] bg-clip-text text-transparent">
                      {guestName}
                    </div>
                  </div>

                  {/* Acompanhantes */}
                  {attending && (
                    <div>
                      <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Acompanhante(s)
                      </span>
                      {companionsList.length > 0 ? (
                        <ul className="space-y-1.5">
                          {companionsList.map((comp, i) => (
                            <li key={i} className="font-serif text-base font-medium text-gray-800 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
                              <span>{comp}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="font-body text-sm text-gray-500 italic">
                          Nenhum acompanhante informado (irá sozinho/a).
                        </p>
                      )}
                    </div>
                  )}

                  {/* Total de Pessoas */}
                  {attending && (
                    <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-700">
                      <span>Total de Pessoas Confirmadas:</span>
                      <span className="text-base font-serif font-bold text-[#E11D48] px-3 py-0.5 rounded-full bg-white border border-pink-200">
                        {1 + companionsList.length} pessoa(s)
                      </span>
                    </div>
                  )}

                  {/* Optional Message Field */}
                  <div className="pt-2">
                    <label htmlFor="rsvp-message" className="block text-xs font-semibold text-gray-700 mb-1">
                      Deixe um recado carinhoso para a Ana Julia (opcional):
                    </label>
                    <textarea
                      id="rsvp-message"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ex.: Parabéns pela formatura! Muito orgulho de você! 🎓💗"
                      className="w-full p-3 text-xs sm:text-sm font-medium text-gray-800 bg-white rounded-xl border border-pink-200 focus:border-[#FF1493] outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-3">
                  <button
                    id="btn-final-confirm"
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] hover:from-[#E11D48] hover:to-[#EA580C] disabled:opacity-50 text-white font-serif text-lg font-bold shadow-lg shadow-[#FF1493]/30 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Salvando confirmação...
                      </span>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 fill-white" />
                        <span>SIM, CONFIRMAR PRESENÇA</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(attending ? (hasCompanions ? 'companions_list' : 'companions_choice') : 'presence_choice')}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#E11D48] hover:text-[#BE123C] hover:bg-pink-50/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>VOLTAR E EDITAR</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 6A: SUCESSO - PRESENÇA CONFIRMADA (SIM) */}
            {step === 'confirmed_yes' && (
              <motion.div
                key="step-confirmed-yes"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-6 space-y-6 relative z-10"
              >
                {/* Top Celebration Badge */}
                <div className="relative inline-block">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-[#FF007F] via-[#E11D48] to-[#FF5500] text-white flex items-center justify-center text-4xl shadow-xl shadow-pink-200 animate-breeze">
                    💗
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#FF007F] via-[#E11D48] to-[#FF5500] bg-clip-text text-transparent">
                    Presença confirmada! 💗
                  </h3>
                  <p className="font-serif text-lg sm:text-xl italic text-gray-700">
                    “Obrigada por fazer parte desse momento tão especial da minha vida.”
                  </p>
                  <p className="font-body text-sm sm:text-base text-[#705869] pt-2">
                    Mal posso esperar para comemorar com você!
                  </p>
                </div>

                {/* Confirmed Details Pill */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-pink-50/60 to-orange-50/60 border border-pink-200 shadow-xs max-w-md mx-auto text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#E11D48] mb-2 flex items-center justify-between">
                    <span>Resumo Registrado</span>
                    <span>10 de Outubro • 09h às 19h</span>
                  </div>
                  <p className="font-serif font-bold text-base text-gray-900">
                    {submittedRSVP?.guestName || guestName}
                  </p>
                  {submittedRSVP?.companions && submittedRSVP.companions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-pink-100 text-xs text-gray-600">
                      <span className="font-semibold text-[#E11D48]">Acompanhante(s): </span>
                      {submittedRSVP.companions.join(', ')}
                    </div>
                  )}
                </div>

                {/* Action Buttons: Add to Calendar & WhatsApp Share */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Avisar a Ana no WhatsApp</span>
                  </button>

                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Festa+de+Formatura+da+Ana+Julia+Gessi&dates=20261010T120000Z/20261010T220000Z&details=Comemora%C3%A7%C3%A3o+da+Formatura+da+Ana+Julia!+Trazer+roupa+de+banho,+toalha+e+protetor+solar.&location=Ch%C3%A1cara+Marista"
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FFA000] hover:opacity-90 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Salvar na Agenda</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleEditAgain}
                    className="text-xs font-semibold text-[#E11D48] hover:text-[#BE123C] underline cursor-pointer"
                  >
                    Precisa fazer alguma alteração? Clique aqui
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 6B: SUCESSO - NÃO COMPARECERÁ */}
            {step === 'confirmed_no' && (
              <motion.div
                key="step-confirmed-no"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-6 space-y-5 relative z-10"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-3xl shadow-md">
                  🤍
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-800">
                    Resposta registrada com carinho! 💗
                  </h3>
                  <p className="font-serif text-base sm:text-lg italic text-[#E11D48]">
                    “Sentiremos muito a sua falta nesse dia tão especial!”
                  </p>
                  <p className="font-body text-xs sm:text-sm text-stone-600">
                    Agradeço imensamente por avisar com antecedência. Seu carinho e torcida significam o mundo para mim!
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleEditAgain}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF007F] to-[#FF5500] hover:from-[#E11D48] hover:to-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Mudei de ideia! Quero confirmar presença 💗
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
