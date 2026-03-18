'use client';

import { useState, useEffect, useRef } from 'react';
import { LanguageGroup } from '../data/languages';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageGroup | null;
}

export default function LeadCaptureModal({ isOpen, onClose, language }: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [story, setStory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Pre-fill village with language name
      if (language) {
        setVillage(language.name);
      }
      setTimeout(() => nameRef.current?.focus(), 300);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, language]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, log to console. In production, send to API/webhook
    console.log('Lead captured:', { name, village, whatsapp, story, language: language?.name });
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setName('');
      setVillage('');
      setWhatsapp('');
      setStory('');
      setSubmitted(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/30" onClick={handleClose}>
      <div
        className="modal-content w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto safe-bottom"
        onClick={e => e.stopPropagation()}
      >
        {submitted ? (
          /* ── Success State ── */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-surface-900 mb-2">Tenkyu tru!</h3>
            <p className="text-surface-500 text-sm mb-6 leading-relaxed">
              Thank you for connecting with us. A CORA team member will reach out to you on WhatsApp soon.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-semibold text-sm transition-colors"
            >
              Back to Map
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-0">
              <div>
                <h3 className="text-lg font-bold text-surface-900">Share Your Story</h3>
                <p className="text-surface-400 text-xs mt-0.5">
                  {language ? `Connect with the ${language.name} community` : 'Connect with us'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 -mr-2 text-surface-300 hover:text-surface-600 rounded-full hover:bg-surface-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-surface-600 text-xs font-medium mb-1.5">Your Name</label>
                <input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Joseph Kaia"
                  required
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder-surface-300 transition-all"
                />
              </div>

              {/* Village / Language */}
              <div>
                <label className="block text-surface-600 text-xs font-medium mb-1.5">Village or Language Group</label>
                <input
                  type="text"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  placeholder="e.g. Melpa, Mt. Hagen"
                  required
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder-surface-300 transition-all"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-surface-600 text-xs font-medium mb-1.5">WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-sm">+675</span>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="7XXX XXXX"
                    required
                    className="w-full pl-16 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder-surface-300 transition-all"
                  />
                </div>
              </div>

              {/* Story (optional) */}
              <div>
                <label className="block text-surface-600 text-xs font-medium mb-1.5">
                  Share your family&apos;s Tumbuna Story <span className="text-surface-300 font-normal">(optional)</span>
                </label>
                <textarea
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  placeholder="Tell us a story, legend, or memory passed down in your family..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder-surface-300 transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.108-1.14l-.292-.176-3.044.8.816-2.98-.192-.304A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="currentColor" opacity={0.3}/>
                </svg>
                Connect via WhatsApp
              </button>

              <p className="text-center text-surface-300 text-[10px] leading-relaxed">
                By submitting, you agree to be contacted by the CORA team.
                Your story may be shared (with credit) to preserve PNG&apos;s oral heritage.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
