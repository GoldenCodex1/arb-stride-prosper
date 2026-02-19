import { Link } from "react-router-dom";

export default function HomepageFooter() {
  return (
    <footer className="border-t border-border/30 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/auth" className="hover:text-foreground transition-colors">Login</Link></li>
              <li><Link to="/auth" className="hover:text-foreground transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Social</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="glow-line mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-[10px]">A</span>
            </div>
            <span className="font-display font-bold text-sm">ArbAI</span>
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ArbAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
