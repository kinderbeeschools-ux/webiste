import React, { useState } from 'react';
import { Sparkles, Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { SystemSettings } from '../types';

interface ContactPageProps {
  settings: SystemSettings | null;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiSummaryResult, setAiSummaryResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          fields: {
            name,
            email,
            phone,
            city,
            message,
            partnershipModel: 'General Contact Enquiry'
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setAiSummaryResult(data.aiSummary || 'Enquiry successfully recorded.');
      } else {
        alert(data.error || 'Failed to submit enquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while submitting enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-stone-900 to-stone-950 text-white py-20 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E1007A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#E1007A]/20 border border-[#E1007A]/40 text-pink-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#E1007A]" />
            <span>Get In Touch Today</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
            Connect with our Central Advisors
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Speak directly with our school planning consultants to map out your educational project feasibility, site criteria, and budget expectations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <div className="text-[#E1007A] font-bold text-xs uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full inline-block">
              Corporate Headquarters
            </div>
            <h2 className="text-3xl font-display font-extrabold text-[#1C1917]">
              We Are Here to Support Your School Project
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Whether you are an individual educator looking to launch a preschool franchise or an educational trust planning a CBSE campus, our team is ready to assist.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E1007A] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-stone-900 text-sm mb-1">Office Address</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{settings?.officeAddress || 'Ramamurthy Nagar, Bangalore, 560016'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-stone-900 text-sm mb-1">Phone Enquiries</h4>
                <a href={`tel:${settings?.phone}`} className="text-xs text-stone-600 hover:text-[#E1007A] transition font-medium">{settings?.phone || '+91 99013 32233'}</a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-stone-900 text-sm mb-1">Email Support</h4>
                <a href={`mailto:${settings?.email}`} className="text-xs text-stone-600 hover:text-[#E1007A] transition font-medium">{settings?.email || 'kinderbeeschools@gmail.com'}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-lg">
          {submitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-stone-900">Message Sent Successfully!</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-stone-900">{name}</span>. Our central team will respond via phone or email within 24 hours.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-[#1C1917] hover:bg-stone-800 text-white font-medium px-8 py-3 rounded-xl text-sm transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-bold text-stone-900">Send Us a Direct Enquiry</h3>
                <p className="text-xs text-stone-500">Fill in your requirements and our advisor will call you promptly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 99013 32233"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="rahul@gmail.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">City / Location *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Bangalore"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">Your Message or Query *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us about your franchise or school setup goals..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E1007A]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#E1007A] to-pink-600 hover:from-pink-700 hover:to-pink-800 text-white font-medium py-3.5 rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending Message...' : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Advisory Team</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

      </section>

    </div>
  );
};
