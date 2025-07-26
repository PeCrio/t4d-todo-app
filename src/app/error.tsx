'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {

  useEffect(() => {
    toast.error(error.message || "An unexpected error occurred.");
  }, [error, reset]);

  return (
    <div className="hidden" />
  );
}
