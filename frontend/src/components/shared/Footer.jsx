import { BriefcaseBusiness, Globe2, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-cyan-200/15 bg-slate-950/80 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link
            to="/"
            className="mb-4 flex w-fit items-center gap-2 text-white"
          >
            <span className="flex size-10 items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-400/15 text-cyan-300">
              <BriefcaseBusiness className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold">
              Job <span className="text-orange-500">Hunter</span>
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-6 text-slate-400">
            Find meaningful work, discover ambitious teams, and build the next
            chapter of your career with confidence.
          </p>
          <a
            href="mailto:hello@jobhunter.com"
            className="mt-5 flex w-fit items-center gap-2 text-sm text-cyan-300 transition-colors hover:text-cyan-200"
          >
            <Mail className="size-4" aria-hidden="true" />
            hello@jobhunter.com
          </a>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
            Explore
          </h2>
          <nav className="flex flex-col items-start gap-3 text-sm">
            <Link to="/" className="transition-colors hover:text-cyan-300">
              Home
            </Link>
            <Link to="/jobs" className="transition-colors hover:text-cyan-300">
              Jobs
            </Link>
            <Link
              to="/browse"
              className="transition-colors hover:text-cyan-300"
            >
              Browse jobs
            </Link>
            <Link
              to="/signup"
              className="transition-colors hover:text-cyan-300"
            >
              Create account
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
            Connect
          </h2>
          <p className="mb-4 text-sm leading-6 text-slate-400">
            Follow Job Hunter for career tips and new opportunities.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              aria-label="GitHub"
              className="rounded-full border border-slate-700 p-2 transition-colors hover:border-cyan-300 hover:text-cyan-300"
            >
              <Globe2 className="size-4" aria-hidden="true" />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="rounded-full border border-slate-700 p-2 transition-colors hover:border-cyan-300 hover:text-cyan-300"
            >
              <Globe2 className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-6 py-5 text-center text-xs text-slate-500">
        Copyright 2026 Job Hunter. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
