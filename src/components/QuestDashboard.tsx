import React, { useState, useEffect } from 'react';
import { ExternalLink, Check, MessageCircle, Heart, Repeat, UserPlus, Link, Wallet, AtSign, PartyPopper, ArrowLeft } from 'lucide-react';
import { Ghost, ghosts, DoodleStar, DoodleHeart } from './MonsterSVG';
import { supabase } from '../lib/supabase';
import type { QuestStep, TaskStatus, Submission } from '../types';

interface QuestDashboardProps {
  onBack: () => void;
}

const QuestDashboard: React.FC<QuestDashboardProps> = ({ onBack }) => {
  const [step, setStep] = useState<QuestStep>('tasks');
  const [tasks, setTasks] = useState<TaskStatus[]>([
    {
      id: 1,
      title: 'Follow on X',
      description: 'Follow the official GHOSTIQ account on X (Twitter)',
      actionLabel: 'Open X Profile',
      actionUrl: 'https://x.com/ghostiq',
      completed: false,
      opened: false,
    },
    {
      id: 2,
      title: 'Like + Repost',
      description: 'Like and repost the pinned quest post on X',
      actionLabel: 'Open Post',
      actionUrl: 'https://x.com/ghostiq',
      completed: false,
      opened: false,
    },
    {
      id: 3,
      title: 'Comment + Tag 2 Friends',
      description: 'Comment on the quest post and tag 2 friends',
      actionLabel: 'Open Post',
      actionUrl: 'https://x.com/ghostiq',
      completed: false,
      opened: false,
    },
  ]);

  const [commentLink, setCommentLink] = useState('');
  const [username, setUsername] = useState('');
  const [wallet, setWallet] = useState('');
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [referralStats, setReferralStats] = useState({ total: 0, successful: 0, points: 0 });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferredBy(ref);
    }
  }, []);

  const completeTask = (taskId: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
  };

  const markOpened = (taskId: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, opened: true } : t));
  };

  const allTasksComplete = tasks.every(t => t.completed);

  const handleSubmitComment = () => {
    if (!commentLink.trim()) {
      setError('Please paste your comment link');
      return;
    }
    if (!commentLink.includes('x.com') && !commentLink.includes('twitter.com')) {
      setError('Please provide a valid X/Twitter comment link');
      return;
    }
    setError('');
    setStep('username');
  };

  const handleSubmitUsername = () => {
    if (!username.trim()) {
      setError('Please enter your X username');
      return;
    }
    const cleanUsername = username.replace('@', '').trim();
    if (!cleanUsername) {
      setError('Please enter a valid username');
      return;
    }
    setUsername(cleanUsername);
    setError('');
    setStep('wallet');
  };

  const handleSubmitWallet = async () => {
    if (!wallet.trim()) {
      setError('Please enter your wallet address');
      return;
    }
    if (!wallet.startsWith('0x') || wallet.length < 10) {
      setError('Please enter a valid wallet address starting with 0x');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const code = username.toLowerCase().replace(/[^a-z0-9]/g, '');
      setReferralCode(code);

      const { data, error: insertError } = await supabase
        .from('submissions')
        .insert({
          x_username: username,
          wallet_address: wallet,
          comment_link: commentLink,
          referral_code: code,
          referred_by: referredBy,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This username has already been submitted!');
        } else {
          setError('Something went wrong. Please try again.');
        }
        setLoading(false);
        return;
      }

      setSubmission(data as Submission);
      setStep('success');

      // Fetch referral stats
      const { count: totalReferrals } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by', code);

      const { count: successfulReferrals } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by', code)
        .eq('status', 'verified');

      setReferralStats({
        total: totalReferrals || 0,
        successful: successfulReferrals || 0,
        points: (successfulReferrals || 0) * 100,
      });
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const taskIcons = [
    <UserPlus key="1" size={24} />,
    <div key="2" className="flex gap-1"><Heart size={20} /><Repeat size={20} /></div>,
    <div key="3" className="flex gap-1"><MessageCircle size={20} />+<UserPlus size={20} /></div>,
  ];

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #2D2D2D 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>
      <Ghost color="#FF6B9D" expression="winky" size={50} className="absolute top-4 right-4 monster-float-1 opacity-30" />
      <Ghost color="#4ECDC4" expression="surprised" size={40} className="absolute bottom-4 left-4 monster-float-2 opacity-30" />
      <DoodleStar className="absolute top-[15%] left-[5%] animate-float opacity-20" size={20} />
      <DoodleHeart className="absolute top-[10%] right-[8%] animate-bounce-slow opacity-20" size={18} />

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="btn-gloob px-4 py-2 text-lg flex items-center gap-2 bg-cream-dark"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="font-cartoon text-2xl sm:text-3xl text-sketch">
            QUEST DASHBOARD
          </h1>
          <Ghost color="#FFE66D" expression="cheeky" size={45} className="monster-float-3" />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 pb-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['tasks', 'comment', 'username', 'wallet', 'success'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                border-2 border-sketch font-hand
                ${step === s ? 'bg-gloob-yellow text-sketch scale-110' :
                  ['tasks', 'comment', 'username', 'wallet', 'success'].indexOf(step) > i ? 'bg-gloob-green text-white' :
                  'bg-white text-sketch-light'}`}
                style={{ borderRadius: '50% 40% 60% 45% / 55% 50% 45% 55%' }}
              >
                {['tasks', 'comment', 'username', 'wallet', 'success'].indexOf(step) > i ? <Check size={16} /> : i + 1}
              </div>
              {i < 4 && (
                <div className={`h-0.5 w-8 sm:w-12 ${['tasks', 'comment', 'username', 'wallet', 'success'].indexOf(step) > i ? 'bg-gloob-green' : 'bg-sketch/20'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Tasks Step */}
        {step === 'tasks' && (
          <div className="space-y-4 animate-sketch-in">
            <h2 className="font-cartoon text-2xl sm:text-3xl text-center text-sketch mb-6">
              Complete These Quests!
            </h2>
            {tasks.map((task, i) => (
              <div key={task.id} className={`task-card p-4 sm:p-5 ${task.completed ? 'bg-gloob-green/10' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gloob-yellow border-2 border-sketch flex items-center justify-center"
                    style={{ borderRadius: '50% 40% 60% 45% / 55% 50% 45% 55%' }}>
                    {taskIcons[i]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-cartoon text-lg sm:text-xl text-sketch">
                      Task {task.id}: {task.title}
                    </h3>
                    <p className="font-hand text-sm text-sketch-light mt-1">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      {task.completed ? (
                        <div className="flex items-center gap-2 text-gloob-green font-hand text-lg">
                          <Check size={20} className="bg-gloob-green text-white rounded-full p-0.5" />
                          Done
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <a
                            href={task.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markOpened(task.id)}
                            className="btn-gloob px-4 py-2 text-sm flex items-center gap-1 bg-gloob-blue/80"
                          >
                            <ExternalLink size={14} />
                            Open Task
                          </a>
                          <button
                            onClick={() => completeTask(task.id)}
                            disabled={!task.opened}
                            className={`btn-gloob-green px-4 py-2 text-sm ${!task.opened ? 'opacity-40 cursor-not-allowed' : ''}`}
                            title={!task.opened ? 'Open the task first!' : ''}
                          >
                            Complete
                          </button>
                        </div>
                      )}
                      {!task.completed && (
                        <span className="font-hand text-sm text-gloob-orange bg-gloob-orange/10 px-3 py-1 rounded-full border border-gloob-orange/30">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {allTasksComplete && (
              <div className="text-center mt-6 animate-pop">
                <p className="font-hand text-lg text-gloob-green mb-3">All quests complete! Proceed to verification.</p>
                <button
                  onClick={() => setStep('comment')}
                  className="btn-gloob-green px-8 py-3 text-xl"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {/* Comment Link Step */}
        {step === 'comment' && (
          <div className="cream-panel p-6 sm:p-8 animate-sketch-in">
            <div className="text-center mb-6">
              <Link size={40} className="mx-auto mb-3 text-gloob-blue" />
              <h2 className="font-cartoon text-2xl sm:text-3xl text-sketch">
                Paste Your Comment Link
              </h2>
              <p className="font-hand text-sketch-light mt-2">
                Share the link to your comment on the quest post
              </p>
            </div>
            <textarea
              value={commentLink}
              onChange={e => { setCommentLink(e.target.value); setError(''); }}
              placeholder="https://x.com/username/status/123456..."
              className="input-gloob w-full p-4 text-lg resize-none"
              rows={3}
            />
            {error && <p className="font-hand text-gloob-pink mt-2 text-center">{error}</p>}
            <div className="mt-4 text-center">
              <button
                onClick={handleSubmitComment}
                className="btn-gloob px-8 py-3 text-xl bg-gloob-blue/90 text-white"
              >
                Verify Comment
              </button>
            </div>
          </div>
        )}

        {/* Username Step */}
        {step === 'username' && (
          <div className="cream-panel p-6 sm:p-8 animate-sketch-in">
            <div className="text-center mb-6">
              <AtSign size={40} className="mx-auto mb-3 text-gloob-purple" />
              <h2 className="font-cartoon text-2xl sm:text-3xl text-sketch">
                X Username
              </h2>
              <p className="font-hand text-sketch-light mt-2">
                Enter your X (Twitter) username
              </p>
            </div>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="@username"
              className="input-gloob w-full p-4 text-lg"
            />
            {error && <p className="font-hand text-gloob-pink mt-2 text-center">{error}</p>}
            <div className="mt-4 text-center">
              <button
                onClick={handleSubmitUsername}
                className="btn-gloob px-8 py-3 text-xl bg-gloob-purple/90 text-white"
              >
                Submit Username
              </button>
            </div>
          </div>
        )}

        {/* Wallet Step */}
        {step === 'wallet' && (
          <div className="cream-panel p-6 sm:p-8 animate-sketch-in">
            <div className="text-center mb-6">
              <Wallet size={40} className="mx-auto mb-3 text-gloob-orange" />
              <h2 className="font-cartoon text-2xl sm:text-3xl text-sketch">
                Wallet Address
              </h2>
              <p className="font-hand text-sketch-light mt-2">
                Enter your Web3 wallet address for rewards
              </p>
            </div>
            <input
              type="text"
              value={wallet}
              onChange={e => { setWallet(e.target.value); setError(''); }}
              placeholder="0x..."
              className="input-gloob w-full p-4 text-lg font-mono"
            />
            {error && <p className="font-hand text-gloob-pink mt-2 text-center">{error}</p>}
            <div className="mt-4 text-center">
              <button
                onClick={handleSubmitWallet}
                disabled={loading}
                className="btn-gloob px-8 py-3 text-xl bg-gloob-orange text-white disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Wallet'}
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && submission && (
          <div className="animate-sketch-in space-y-6">
            {/* Success card */}
            <div className="cream-panel p-6 sm:p-8 text-center">
              <PartyPopper size={50} className="mx-auto mb-4 text-gloob-green" />
              <h2 className="font-cartoon text-2xl sm:text-3xl text-sketch mb-2">
                Quest Completed Successfully!
              </h2>
              <p className="font-hand text-lg text-sketch-light mb-6">
                Your submission has been received.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="sketch-border p-3 flex-1 bg-white">
                  <p className="font-hand text-sm text-sketch-light">X Username</p>
                  <p className="font-cartoon text-lg text-sketch">@{submission.x_username}</p>
                </div>
                <div className="sketch-border p-3 flex-1 bg-white">
                  <p className="font-hand text-sm text-sketch-light">Wallet Address</p>
                  <p className="font-comic text-sm text-sketch break-all">{submission.wallet_address}</p>
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="cream-panel p-6">
              <h3 className="font-cartoon text-xl text-sketch text-center mb-4">
                Your Referral Link
              </h3>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={`${window.location.origin}/?ref=${referralCode}`}
                  className="input-gloob flex-1 p-3 text-sm font-mono"
                />
                <button
                  onClick={copyReferralLink}
                  className={`btn-gloob px-4 py-3 text-sm ${copied ? 'bg-gloob-green text-white' : ''}`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Referral Stats */}
            <div className="cream-panel p-6">
              <h3 className="font-cartoon text-xl text-sketch text-center mb-4">
                Referral Stats
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="sketch-border-sm p-4 text-center bg-white">
                  <p className="font-cartoon text-2xl text-gloob-blue">{referralStats.total}</p>
                  <p className="font-hand text-sm text-sketch-light">Total Referrals</p>
                </div>
                <div className="sketch-border-sm p-4 text-center bg-white">
                  <p className="font-cartoon text-2xl text-gloob-green">{referralStats.successful}</p>
                  <p className="font-hand text-sm text-sketch-light">Successful</p>
                </div>
                <div className="sketch-border-sm p-4 text-center bg-white">
                  <p className="font-cartoon text-2xl text-gloob-yellow">{referralStats.points}</p>
                  <p className="font-hand text-sm text-sketch-light">Reward Points</p>
                </div>
              </div>
            </div>

            {/* Ghost celebration */}
            <div className="flex justify-center gap-3 mt-4">
              {ghosts.slice(0, 5).map((g, i) => (
                <Ghost
                  key={i}
                  color={g.color}
                  expression={g.expression}
                  size={50}
                  className={i % 2 === 0 ? 'monster-float-1' : 'monster-float-2'}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuestDashboard;
