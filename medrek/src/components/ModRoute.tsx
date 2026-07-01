import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communitiesAPI } from '../lib/api';

interface ModRouteProps {
  children: React.ReactNode;
}

export const ModRoute: React.FC<ModRouteProps> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const [isMod, setIsMod] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      setIsMod(false);
      return;
    }
    communitiesAPI.getMyModerated()
      .then((comms: any[]) => {
        setIsMod(comms.length > 0);
      })
      .catch(() => setIsMod(false));
  }, [isLoggedIn, loading]);

  if (isMod === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F2E9DF]">
        <p className="text-sm text-[#9C836A]">Checking access...</p>
      </div>
    );
  }

  if (!isMod) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
