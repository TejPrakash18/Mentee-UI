import { useEffect, useState } from "react";
import { Pencil, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import userService from "../services/userService";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdSchool, MdLocationOn, MdBusiness } from "react-icons/md";
import tejAvatar from "/profile5.png";

/* ============= Profile Card ============= */
const SidebarProfile = () => {
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      const username = localStorage.getItem("username");
      const data = await userService.getProfile();
      setProfile(data);
      if (username) {
        const avatar = await userService.getAvatar(username);
        setAvatarUrl(avatar);
      }
    })();
  }, []);

  const toggleSkill = (skill) =>
    setProfile((prev) => {
      if (!skill) return prev;
      const s = skill.trim();
      const exists = (prev.skills || []).some(
        (x) => x.toLowerCase() === s.toLowerCase()
      );
      return exists
        ? {
            ...prev,
            skills: prev.skills.filter(
              (x) => x.toLowerCase() !== s.toLowerCase()
            ),
          }
        : { ...prev, skills: [...(prev.skills || []), s] };
    });

  if (!profile) return <p className="text-white p-5">Loading…</p>;

  return (
    <aside className="rounded-2xl text-white flex flex-col space-y-6 min-h-[32rem]">
      {/* header */}
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl || tejAvatar}
          onError={(e) => (e.currentTarget.src = tejAvatar)}
          className="w-16 h-16 rounded-full border-1 border-orange-700 bg-amber-400"
        />
        <div>
          <h2 className="font-bold text-xl">{profile.name}</h2>
          <p className="text-sm text-gray-400">@{profile.username}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="ml-auto p-2 hover:bg-[#2a2b30] rounded"
        >
          <Pencil size={18} />
        </button>
      </div>

      {/* skills */}
      <section>
        <h3 className="text-sky-400 font-semibold mb-2">Skills</h3>
        <motion.div layout className="flex flex-wrap gap-2">
          {(profile.skills || []).map((s) => (
            <motion.span
              key={s}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="bg-sky-600/20 text-sky-300 px-3 py-1 text-xs rounded"
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      </section>
<section className="space-y-4 text-sm leading-relaxed flex-grow">
  <h3 className="text-sky-400 font-semibold text-base border-b border-sky-800 pb-1">
    Profile Information
  </h3>

  {/* Card container */}
  <div className="bg-sky-600/20 rounded-xl p-4 shadow-inner space-y-4">
    {/* Personal Info */}
    <div className="space-y-2 divide-y divide-[#334155]">
      <Info label="Email" value={profile.email} />
      <Info label="College" value={profile.college} />
      <Info label="Education" value={profile.education} />
      <Info label="Location" value={profile.location} />
    </div>

    {/* Social Links */}
    <div className="space-y-2 pt-2 border-t border-[#334155]">
      {profile.github && (
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:bg-[#334155] transition-colors duration-200 px-4 py-2 rounded-md text-white"
        >
          <FaGithub className="text-lg text-white" />
          <span className="truncate text-sky-400 font-medium">
            {profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
          </span>
        </a>
      )}
      {profile.linkedin && (
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:bg-[#334155] transition-colors duration-200 px-4 py-2 rounded-md text-white"
        >
          <FaLinkedin className="text-lg text-sky-400" />
          <span className="truncate text-sky-400 font-medium">
            {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
          </span>
        </a>
      )}
    </div>
  </div>
</section>


      {/* modal */}
      <AnimatePresence>
        {showModal && (
          <ModalShell onClose={() => setShowModal(false)}>
            <EditModal
              profile={profile}
              setProfile={setProfile}
              toggleSkill={toggleSkill}
              onClose={() => setShowModal(false)}
            />
          </ModalShell>
        )}
      </AnimatePresence>
    </aside>
  );
};

/* helpers */ 
const Info = ({ label, value, isLink = false }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-2 text-sm text-white">
    <span className="text-gray-400 min-w-[90px]">{label}</span>
    {value ? (
      isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:underline text-right break-words"
        >
          {value.replace(/^https?:\/\/(www\.)?/, "")}
        </a>
      ) : (
        <span className="text-right break-words">{value}</span>
      )
    ) : (
      <span className="text-gray-500 text-right">—</span>
    )}
  </div>
);


/* modal shell */
const ModalShell = ({ children, onClose }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </motion.div>
);

/* edit modal */
const EditModal = ({ profile, setProfile, toggleSkill, onClose }) => {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    toggleSkill(skillInput);
    setSkillInput("");
  };

  const chosen = profile.skills || [];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="w-full max-w-3xl bg-[#18181b] text-white rounded-2xl shadow-2xl ring-1 ring-[#2c2c2f] overflow-hidden"
    >
      {/* header */}
      <div className="flex justify-between items-center bg-[#1f1f22] px-6 py-4 border-b border-[#2c2c2f]">
        <h2 className="text-xl font-semibold text-sky-400">Edit Profile</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[#2a2b2e] rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* body */}
      <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
        <div className="grid gap-8 md:grid-cols-2">
          {/* left */}
          <div className="space-y-5">
            <Field
              label="Name"
              value={profile.name}
              placeholder="Enter you name"
              onChange={(v) => setProfile({ ...profile, name: v })}
            />
            <Field
              label="College"
              value={profile.college}
              placeholder="College Name"
              onChange={(v) => setProfile({ ...profile, college: v })}
            />
            <Field
              label="Education"
              value={profile.education}
              placeholder="Enter you education"
              onChange={(v) => setProfile({ ...profile, education: v })}
            />
            <Field
              label="Location"
              value={profile.location}
              placeholder="Add your location"
              onChange={(v) => setProfile({ ...profile, location: v })}
            />
            <Field
              label="GitHub URL"
              value={profile.github || ""}
              placeholder="Enter your Github URL"
              onChange={(v) => setProfile({ ...profile, github: v })}
            />
            <Field
              label="LinkedIn URL"
              value={profile.linkedin || ""}
              placeholder="Enter your Linkedin URL"
              onChange={(v) => setProfile({ ...profile, linkedin: v })}
            />
          </div>

          {/* right */}
          <div className="space-y-4">
            <label className="text-sm text-gray-400">Add a skill</label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Type a skill & press Enter"
                className="w-full bg-[#232326] px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-sky-600"
              />
              <button
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className="px-3 py-2 bg-sky-600 disabled:bg-sky-600/40 rounded-md"
              >
                <Check size={16} />
              </button>
            </div>

            {chosen.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {chosen.map((sk) => (
                  <button
                    key={sk}
                    onClick={() => toggleSkill(sk)}
                    className="flex items-center gap-1 bg-sky-600 text-white text-xs rounded-full pl-3 pr-2 py-1"
                  >
                    {sk}
                    <X size={12} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="flex justify-end gap-4 bg-[#1f1f22] px-6 py-4 border-t border-[#2c2c2f]">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-gray-600/70 hover:bg-gray-500/80 rounded"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            await userService.updateProfile(profile);
            onClose();
          }}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded shadow"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

/* reusable input control */
const Field = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-400">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#232326] px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-sky-600"
    />
  </div>
);

export default SidebarProfile;
