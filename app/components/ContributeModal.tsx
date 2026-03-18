'use client';

import { useState, useEffect, useRef } from 'react';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContributeCategory = 'food' | 'medicine' | 'story';

const CATEGORIES: { key: ContributeCategory; label: string; icon: string; desc: string }[] = [
  { key: 'food', label: 'Traditional Food', icon: '🍲', desc: 'A recipe, ingredient, or cooking method from your area' },
  { key: 'medicine', label: 'Traditional Medicine', icon: '🌿', desc: 'A plant, remedy, or healing practice from your community' },
  { key: 'story', label: 'Tumbuna Story', icon: '📖', desc: 'An oral history, legend, or cultural practice passed down' },
];

export default function ContributeModal({ isOpen, onClose }: ContributeModalProps) {
  const [step, setStep] = useState<'category' | 'form' | 'success'>('category');
  const [category, setCategory] = useState<ContributeCategory | null>(null);
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [contact, setContact] = useState('');
  const [contactType, setContactType] = useState<'whatsapp' | 'email'>('whatsapp');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (step === 'form') {
      setTimeout(() => nameRef.current?.focus(), 200);
    }
  }, [step]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('category');
      setCategory(null);
      setName('');
      setVillage('');
      setContact('');
      setTitle('');
      setDescription('');
    }, 300);
  };

  const handleSelectCategory = (cat: ContributeCategory) => {
    setCategory(cat);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contribution submitted:', { category, name, village, contact, contactType, title, description });
    setStep('success');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/30" onClick={handleClose}>
      <div
        className="modal-content w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto safe-bottom"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Category Selection ── */}
        {step === 'category' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-surface-900">Contribute Knowledge</h3>
                <p className="text-surface-400 text-xs mt-0.5">Help preserve PNG&apos;s cultural heritage</p>
              </div>
              <button onClick={handleClose} className="p-2 -mr-2 text-surface-300 hover:text-surface-600 rounded-full hover:bg-surface-50 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <p className="text-surface-500 text-sm mb-4">What would you like to share?</p>

            <div className="space-y-2.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => handleSelectCategory(cat.key)}
                  className="w-full p-4 bg-surface-50 hover:bg-surface-100 active:bg-surface-200 border border-surface-100 hover:border-surface-200 rounded-2xl text-left flex items-center gap-4 transition-colors group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-surface-800 font-semibold text-sm">{cat.label}</p>
                    <p className="text-surface-400 text-xs mt-0.5">{cat.desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-surface-300 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Submission Form ── */}
        {step === 'form' && category && (
          <form onSubmit={handleSubmit}>
            <div className="p-5">
              {/* Back + header */}
              <div className="flex items-center gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setStep('category')}
                  className="p-2 -ml-2 text-surface-400 hover:text-surface-600 rounded-full hover:bg-surface-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-surface-900">
                    {CATEGORIES.find(c => c.key === category)?.label}
                  </h3>
                  <p className="text-surface-400 text-xs">Share your knowledge with the community</p>
                </div>
                <button type="button" onClick={handleClose} className="p-2 -mr-2 text-surface-300 hover:text-surface-600 rounded-full hover:bg-surface-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-surface-600 text-xs font-medium mb-1.5">Your Name</label>
                  <input
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Maria Kila"
                    required
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder-surface-300 transition-all"
                  />
                </div>

                {/* Village */}
                <div>
                  <label className="block text-surface-600 text-xs font-medium mb-1.5">Village / Province</label>
                  <input
                    type="text"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    placeholder="e.g. Goroka, Eastern Highlands"
                    required
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder-surface-300 transition-all"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-surface-600 text-xs font-medium mb-1.5">Contact</label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setContactType('whatsapp')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        contactType === 'whatsapp'
                          ? 'bg-green-50 border border-green-300 text-green-700'
                          : 'bg-surface-50 border border-surface-200 text-surface-400'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactType('email')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        contactType === 'email'
                          ? 'bg-blue-50 border border-blue-300 text-blue-700'
                          : 'bg-surface-50 border border-surface-200 text-surface-400'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                      Email
                    </button>
                  </div>
                  <input
                    type={contactType === 'email' ? 'email' : 'tel'}
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder={contactType === 'whatsapp' ? '+675 7XXX XXXX' : 'your@email.com'}
                    required
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder-surface-300 transition-all"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-surface-600 text-xs font-medium mb-1.5">
                    {category === 'food' ? 'Food / Recipe Name' : category === 'medicine' ? 'Plant / Remedy Name' : 'Story Title'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={category === 'food' ? 'e.g. Mumu' : category === 'medicine' ? 'e.g. Wild Ginger' : 'e.g. The Crocodile Spirit'}
                    required
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder-surface-300 transition-all"
                  />
                </div>

                {/* Description / Story */}
                <div>
                  <label className="block text-surface-600 text-xs font-medium mb-1.5">
                    Tell Us More <span className="text-surface-300 font-normal">(the story, recipe, or how it&apos;s used)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Share as much detail as you like. This knowledge is precious..."
                    rows={4}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder-surface-300 transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                  Submit Contribution
                </button>

                <p className="text-center text-surface-300 text-[10px] leading-relaxed">
                  Your contribution helps preserve PNG&apos;s living heritage. A CORA team member may contact you for verification.
                </p>
              </div>
            </div>
          </form>
        )}

        {/* ── Success ── */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-surface-900 mb-2">Tenkyu tru!</h3>
            <p className="text-surface-500 text-sm mb-1 leading-relaxed">
              Your knowledge has been submitted for review.
            </p>
            <p className="text-surface-400 text-xs mb-6">
              A CORA team member will verify and add it to the map.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-semibold text-sm transition-colors"
            >
              Back to Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
