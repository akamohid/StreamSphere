// src/components/RequireAuth.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RequireAuth({ children }) {
  const user = useSelector((s) => s.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return children;
}
