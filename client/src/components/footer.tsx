import { LaptopIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  learning: [
    { name: "Number Systems", href: "#" },
    { name: "IP Addressing", href: "#" },
    { name: "Subnetting", href: "#" },
    { name: "Logic Gates", href: "#" },
    { name: "Programming", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Community Forum", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: "📱", href: "#" },
  { name: "Facebook", icon: "📘", href: "#" },
  { name: "Discord", icon: "💬", href: "#" },
  { name: "YouTube", icon: "📺", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <LaptopIcon className="text-white h-5 w-5" />
              </div>
              <div className="text-xl font-bold">ICT Learning Hub</div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Empowering students aged 13-19 to master ICT concepts through interactive learning, 
              games, and hands-on activities.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors p-0"
                  asChild
                >
                  <a href={social.href} aria-label={social.name}>
                    <span className="text-lg">{social.icon}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Learning</h3>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.learning.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
  <p>&copy; 2025 <strong className="text-white">ICT Learning Hub</strong>. All rights reserved.</p>
  <p className="mt-1">Crafted with care by <span className="italic">Pathmanathan Krishogaran</span> 😊</p>
</div>

      </div>
    </footer>
  );
}

