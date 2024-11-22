import React, { useState } from 'react';
import { UserCircle2, LogOut, Settings } from 'lucide-react';
import { signOut } from '../services/authService';
import toast from 'react-hot-toast';

interface Props {
  user: any;
  onSignOut: () => void;
}

export default function UserMenu({ user, onSignOut }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error);
    } else {
      toast.success('Successfully signed out!');
      onSignOut();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
      >
        <UserCircle2 className="h-6 w-6" />
        <span className="text-sm hidden md:block">{user.email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-navy-800 rounded-lg shadow-xl border border-purple-500/20 py-1">
          <div className="px-4 py-2 text-sm text-gray-300 border-b border-purple-500/20">
            Signed in as<br />
            <span className="font-medium text-white">{user.email}</span>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-500/10 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}