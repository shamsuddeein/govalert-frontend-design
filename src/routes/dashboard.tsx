import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Nav, Footer } from "../components/layout";
import {
  Bookmark,
  Bell,
  User,
  Settings,
  Send,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building,
  Save,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

// Mock Initial Saved Jobs
const initialSavedJobs = [
  {
    id: "8829-GA",
    title: "Graduate Trainee Program (Engineering, 2024)",
    agency: "NNPC Limited",
    agencyShort: "NNPC",
    status: "urgent" as const,
    deadline: "Oct 24, 2024",
  },
  {
    id: "4120-GA",
    title: "Superintendent Cadre Recruitment",
    agency: "Nigeria Customs Service",
    agencyShort: "NCS",
    status: "verified" as const,
    deadline: "Nov 12, 2024",
  },
];

// Mock Notifications
const initialNotifications = [
  {
    id: 1,
    title: "New Recruitment Detected",
    body: "Nigeria Customs Service opened applications for superintendent cadre.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    title: "Vetting Complete",
    body: "NNPC Graduate Trainee portal has been marked 100% verified.",
    time: "1 day ago",
    unread: false,
  },
  {
    id: 3,
    title: "Alert: Portal Issues Reported",
    body: "Intermittent outages detected on CBN recruitment site.",
    time: "3 days ago",
    unread: false,
  },
];

function StatusBadge({ status }: { status: "verified" | "urgent" | "warning" | "closed" }) {
  const styles = {
    verified: "bg-verified/10 text-verified border-verified/20",
    urgent: "bg-closed/10 text-closed border-closed/20",
    warning: "bg-accent/10 text-accent border-accent/20",
    closed: "bg-muted text-muted-foreground border-border",
  };

  const labels = {
    verified: "Verified",
    urgent: "Urgent",
    warning: "Updating",
    closed: "Closed",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"saved" | "notifications" | "profile" | "settings">("saved");
  const [savedJobs, setSavedJobs] = useState(initialSavedJobs);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // Telegram State
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramHandle, setTelegramHandle] = useState("");
  const [pairingCode, setPairingCode] = useState("");
  const [showPairingModal, setShowPairingModal] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "Shamsuddeein Alao",
    email: "shamsuddeein@govalert.ng",
    phone: "+234 812 345 6789",
    state: "Kano",
    qualification: "Bachelor's Degree",
    field: "Software Engineering",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    emailAlerts: true,
    telegramAlerts: false,
    newsletter: true,
    weeklyDigest: false,
  });

  const handleRemoveSaved = (id: string) => {
    setSavedJobs(savedJobs.filter((j) => j.id !== id));
    toast.success("Job removed from saved list");
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      toast.success("Profile details updated successfully!");
    }, 800);
  };

  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      // If turning on Telegram alerts but not connected, prompt connection
      if (key === "telegramAlerts" && updated[key] && !telegramConnected) {
        toast.error("Please connect your Telegram account first!");
        return prev;
      }
      toast.success("Settings preference saved");
      return updated;
    });
  };

  const handleStartTelegramConnection = () => {
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPairingCode(code);
    setShowPairingModal(true);
  };

  const handleCompleteConnection = () => {
    if (!telegramHandle.trim()) {
      toast.error("Please enter your Telegram handle");
      return;
    }
    setTelegramConnected(true);
    setSettings(prev => ({ ...prev, telegramAlerts: true }));
    setShowPairingModal(false);
    toast.success(`Telegram channel connected to @${telegramHandle.replace("@", "")}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Banner/Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-border pb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Applicant Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage saved applications, set alert preferences, and verify contact profiles.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verified opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-verified"></span>
            </span>
            <div className="text-sm font-semibold">
              Live Monitoring Active
            </div>
          </div>
        </div>

        {/* Outer Shell Grid */}
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Navigation Sidebar */}
          <aside className="flex flex-row gap-2 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === "saved"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Bookmark className="size-4" />
              Saved Jobs
              {savedJobs.length > 0 && (
                <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
                  activeTab === "saved" ? "bg-primary-foreground text-primary" : "bg-muted-foreground/15"
                }`}>
                  {savedJobs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Bell className="size-4" />
              Notifications
              {notifications.some(n => n.unread) && (
                <span className="ml-auto size-2 rounded-full bg-closed animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <User className="size-4" />
              My Profile
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === "settings"
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Settings className="size-4" />
              Settings
            </button>
          </aside>

          {/* Active Screen Area */}
          <div className="space-y-6">
            {/* SAVED JOBS SCREEN */}
            {activeTab === "saved" && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">Saved Recruitments</h3>
                  <p className="text-xs text-muted-foreground">
                    You have {savedJobs.length} job(s) bookmarked
                  </p>
                </div>

                {savedJobs.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {savedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 shadow-sm"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <span className="grid size-10 place-items-center rounded bg-muted font-mono text-xs font-semibold text-muted-foreground">
                              {job.agencyShort}
                            </span>
                            <StatusBadge status={job.status} />
                          </div>
                          <h4 className="mt-4 text-sm font-bold text-foreground line-clamp-1">
                            {job.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{job.agency}</p>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="size-3.5" />
                            Deadline: {job.deadline}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRemoveSaved(job.id)}
                              className="p-2 text-muted-foreground hover:text-closed hover:bg-closed/5 rounded-lg transition-colors cursor-pointer"
                              title="Delete bookmark"
                            >
                              <Trash2 className="size-4" />
                            </button>
                            
                            <Link
                              to="/jobs/$jobId"
                              params={{ jobId: job.id }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                            >
                              Details
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                    <Bookmark className="mx-auto size-12 text-muted-foreground" />
                    <h4 className="mt-4 text-base font-semibold">No saved jobs yet</h4>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                      Bookmark openings on the Recruitments Feed to monitor updates and tracking deadlines here.
                    </p>
                    <Link
                      to="/jobs"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/95"
                    >
                      Browse Recruitments
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* NOTIFICATIONS SCREEN */}
            {activeTab === "notifications" && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">Recent Alerts</h3>
                  <button
                    onClick={markAllRead}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>

                {/* Telegram Connection Promotion Banner */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Send className="size-5 text-primary" />
                      <h4 className="font-bold text-sm text-primary">Telegram Push Integration</h4>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xl">
                      Receive critical status alerts, vetting logs, and scam warnings direct to your phone instantly. Bypass email delays.
                    </p>
                  </div>
                  
                  {telegramConnected ? (
                    <div className="flex items-center gap-2 bg-verified/10 border border-verified/20 rounded-xl px-4 py-2 text-xs font-semibold text-verified self-start md:self-auto">
                      <CheckCircle className="size-4" />
                      Connected to @{telegramHandle.replace("@", "")}
                    </div>
                  ) : (
                    <button
                      onClick={handleStartTelegramConnection}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 self-start md:self-auto cursor-pointer"
                    >
                      Connect Alert Bot
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`relative flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                        notif.unread
                          ? "bg-card border-primary/25 shadow-sm"
                          : "bg-card/45 border-border"
                      }`}
                    >
                      {notif.unread && (
                        <span className="absolute left-2 top-2 size-2 rounded-full bg-primary" />
                      )}
                      
                      <div className="mt-0.5 rounded-lg bg-muted p-2 text-muted-foreground">
                        <Bell className="size-4" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className={`text-sm font-semibold ${notif.unread ? "text-foreground" : "text-muted-foreground"}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{notif.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PROFILE SCREEN */}
            {activeTab === "profile" && (
              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Applicant Profile</h3>
                  <p className="text-xs text-muted-foreground">
                    Customize your profile values to receive tailored eligibility warnings.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">State of Origin</label>
                      <input
                        type="text"
                        required
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Highest Qualification</label>
                      <select
                        value={profileForm.qualification}
                        onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                        className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      >
                        <option>Master's Degree</option>
                        <option>Bachelor's Degree</option>
                        <option>HND (Higher National Diploma)</option>
                        <option>OND (Ordinary National Diploma)</option>
                        <option>WASSCE / NECO (O'level)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Field of Study</label>
                      <input
                        type="text"
                        required
                        value={profileForm.field}
                        onChange={(e) => setProfileForm({ ...profileForm, field: e.target.value })}
                        className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="size-4" />
                      {savingProfile ? "Saving Details..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* SETTINGS SCREEN */}
            {activeTab === "settings" && (
              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">System Settings</h3>
                  <p className="text-xs text-muted-foreground">
                    Control how and when you receive intelligence briefings.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h4 className="text-sm font-semibold">Email Alerts</h4>
                      <p className="text-xs text-muted-foreground">Receive instant alerts when a verified portal launches.</p>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("emailAlerts")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.emailAlerts ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                          settings.emailAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h4 className="text-sm font-semibold">Telegram Push Notifications</h4>
                      <p className="text-xs text-muted-foreground">Direct-to-chat bot alerts with zero delivery delay.</p>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("telegramAlerts")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.telegramAlerts ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                          settings.telegramAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h4 className="text-sm font-semibold">Weekly Intelligence Digest</h4>
                      <p className="text-xs text-muted-foreground">A curated digest of the week's scam alerts and portal checks.</p>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("weeklyDigest")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.weeklyDigest ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                          settings.weeklyDigest ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">Newsletter Subscription</h4>
                      <p className="text-xs text-muted-foreground">General articles regarding civil service guidelines and cadet courses.</p>
                    </div>
                    <button
                      onClick={() => handleToggleSetting("newsletter")}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.newsletter ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                          settings.newsletter ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      
      {/* Telegram Pairing Modal */}
      {showPairingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              <Send className="size-5 text-primary" />
              Pair with Telegram Bot
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Connect your account to GovAlert Telegram Bot in three simple steps:
            </p>

            <ol className="space-y-3.5 text-xs text-muted-foreground mb-6 pl-4 list-decimal">
              <li>
                Open Telegram and search for <strong className="text-primary">@GovAlertBot</strong> (or click the link from our channel).
              </li>
              <li>
                Start the bot by tapping <strong className="text-foreground">/start</strong>.
              </li>
              <li>
                Send the following pairing code to the bot:
                <div className="mt-2 bg-muted rounded-xl p-3.5 text-center text-lg font-mono font-bold tracking-widest text-primary border border-border">
                  {pairingCode}
                </div>
              </li>
            </ol>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Enter Your Telegram Handle</label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowPairingModal(false)}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteConnection}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 cursor-pointer"
                >
                  Verify pairing code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
