import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, CheckCircle, XCircle, ArrowLeft, Shield, Users, Wallet, Link2, Calendar, Award, RefreshCw } from 'lucide-react';
import { Ghost, DoodleStar } from './MonsterSVG';
import { supabase } from '../lib/supabase';
import type { Submission } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchWallet, setSearchWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = 'ghostiq2024';

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('submissions')
        .select('*')
        .order('submission_date', { ascending: false });

      if (searchUsername.trim()) {
        query = query.ilike('x_username', `%${searchUsername.trim()}%`);
      }
      if (searchWallet.trim()) {
        query = query.ilike('wallet_address', `%${searchWallet.trim()}%`);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setSubmissions((data as Submission[]) || []);
    } catch {
      setError('Failed to fetch submissions');
    }
    setLoading(false);
  }, [searchUsername, searchWallet]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated, fetchSubmissions]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Wrong password!');
    }
  };

  const updateStatus = async (id: string, status: 'verified' | 'rejected') => {
    try {
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, status } : s)
      );
    } catch {
      setError('Failed to update status');
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'X Username', 'Wallet Address', 'Comment Link', 'Referral Code', 'Referred By', 'Submission Date', 'Status'];
    const rows = submissions.map(s => [
      s.id,
      s.x_username,
      s.wallet_address,
      s.comment_link,
      s.referral_code,
      s.referred_by || '',
      s.submission_date,
      s.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ghostiq_submissions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getReferralCount = (referralCode: string) => {
    return submissions.filter(s => s.referred_by === referralCode).length;
  };

  const totalSubmissions = submissions.length;
  const verifiedCount = submissions.filter(s => s.status === 'verified').length;
  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, #2D2D2D 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }} />
        </div>
        <Ghost color="#FF8C42" expression="cheeky" size={60} className="absolute top-8 right-8 monster-float-1 opacity-30" />
        <Ghost color="#A78BFA" expression="spooky" size={50} className="absolute bottom-8 left-8 monster-float-2 opacity-30" />

        <button
          onClick={onBack}
          className="absolute top-4 left-4 btn-gloob px-4 py-2 text-lg bg-cream-dark flex items-center gap-2 z-20"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="cream-panel p-8 w-full max-w-md mx-4 animate-sketch-in">
          <div className="text-center mb-6">
            <Shield size={50} className="mx-auto mb-3 text-sketch" />
            <h2 className="font-cartoon text-3xl text-sketch">Admin Access</h2>
            <p className="font-hand text-sketch-light mt-2">Enter admin password to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={adminPassword}
              onChange={e => { setAdminPassword(e.target.value); setError(''); }}
              placeholder="Password"
              className="input-gloob w-full p-4 text-lg mb-3"
            />
            {error && <p className="font-hand text-gloob-pink text-center mb-3">{error}</p>}
            <button type="submit" className="btn-gloob w-full py-3 text-xl">
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #2D2D2D 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <header className="relative z-10 p-4 sm:p-6 border-b-2 border-sketch/10 bg-cream/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="btn-gloob px-3 py-2 text-sm bg-cream-dark flex items-center gap-1">
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="font-cartoon text-xl sm:text-2xl text-sketch flex items-center gap-2">
              <Shield size={22} />
              ADMIN
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchSubmissions} className="btn-gloob px-3 py-2 text-sm bg-gloob-blue/80 text-white flex items-center gap-1">
              <RefreshCw size={14} />
              Refresh
            </button>
            <button onClick={exportCSV} className="btn-gloob px-3 py-2 text-sm bg-gloob-green text-white flex items-center gap-1">
              <Download size={14} />
              CSV
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="sketch-border-sm p-4 bg-white text-center">
            <Users size={20} className="mx-auto mb-1 text-gloob-blue" />
            <p className="font-cartoon text-2xl text-gloob-blue">{totalSubmissions}</p>
            <p className="font-hand text-sm text-sketch-light">Total</p>
          </div>
          <div className="sketch-border-sm p-4 bg-white text-center">
            <CheckCircle size={20} className="mx-auto mb-1 text-gloob-green" />
            <p className="font-cartoon text-2xl text-gloob-green">{verifiedCount}</p>
            <p className="font-hand text-sm text-sketch-light">Verified</p>
          </div>
          <div className="sketch-border-sm p-4 bg-white text-center">
            <DoodleStar size={20} className="mx-auto mb-1" />
            <p className="font-cartoon text-2xl text-gloob-orange">{pendingCount}</p>
            <p className="font-hand text-sm text-sketch-light">Pending</p>
          </div>
        </div>

        {/* Search */}
        <div className="cream-panel p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sketch-light" />
              <input
                type="text"
                value={searchUsername}
                onChange={e => setSearchUsername(e.target.value)}
                placeholder="Search by username..."
                className="input-gloob w-full pl-9 p-3 text-sm"
              />
            </div>
            <div className="flex-1 relative">
              <Wallet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sketch-light" />
              <input
                type="text"
                value={searchWallet}
                onChange={e => setSearchWallet(e.target.value)}
                placeholder="Search by wallet..."
                className="input-gloob w-full pl-9 p-3 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {error && <p className="font-hand text-gloob-pink text-center mb-4">{error}</p>}

        {/* Submissions list */}
        {loading ? (
          <div className="text-center py-12">
            <Ghost color="#4ECDC4" expression="surprised" size={60} className="mx-auto monster-float-1" />
            <p className="font-hand text-sketch-light mt-4">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12">
            <Ghost color="#FF6B9D" expression="happy" size={60} className="mx-auto monster-float-2" />
            <p className="font-hand text-sketch-light mt-4">No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub, i) => (
              <div
                key={sub.id}
                className="task-card p-4 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-cartoon text-lg text-sketch">@{sub.x_username}</span>
                      <span className={`font-hand text-xs px-2 py-0.5 rounded-full border
                        ${sub.status === 'verified' ? 'bg-gloob-green/10 border-gloob-green/30 text-gloob-green' :
                          sub.status === 'rejected' ? 'bg-gloob-pink/10 border-gloob-pink/30 text-gloob-pink' :
                          'bg-gloob-yellow/10 border-gloob-yellow/30 text-gloob-orange'}`}>
                        {sub.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 font-hand text-xs text-sketch-light">
                      <span className="flex items-center gap-1 truncate">
                        <Wallet size={12} /> {sub.wallet_address}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <Link2 size={12} /> {sub.comment_link}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award size={12} /> Ref: {sub.referral_code}
                        {sub.referred_by && <span className="text-gloob-purple">(by: {sub.referred_by})</span>}
                        {getReferralCount(sub.referral_code) > 0 && (
                          <span className="text-gloob-green ml-1">[{getReferralCount(sub.referral_code)} referrals]</span>
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(sub.submission_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {sub.status !== 'verified' && (
                      <button
                        onClick={() => updateStatus(sub.id, 'verified')}
                        className="btn-gloob-green px-3 py-1.5 text-sm flex items-center gap-1"
                      >
                        <CheckCircle size={14} /> Verify
                      </button>
                    )}
                    {sub.status !== 'rejected' && (
                      <button
                        onClick={() => updateStatus(sub.id, 'rejected')}
                        className="btn-gloob px-3 py-1.5 text-sm bg-gloob-pink text-white flex items-center gap-1"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
