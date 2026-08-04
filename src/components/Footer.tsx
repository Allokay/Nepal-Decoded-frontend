import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              About
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Nepal Decoded is a neutral news aggregator. We group and index headlines from publicly available RSS feeds to provide multiple perspectives on news in Nepal.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:contact@nepaldecoded.com"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              Follow Us
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/16pLXztG5n/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              Disclaimer
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              We only index headlines and link to original publishers. All content and advertisements belong to their respective publishers. Nepal Decoded does not claim ownership or endorsement.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6">
          <p className="text-center text-xs text-slate-500">
            © 2026 Nepal Decoded. All rights reserved. Made in Nepal.
          </p>
        </div>
      </div>
    </footer>
  );
}
