'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeysPageProps {
  geminiKey: string;
  googleSearchKey: string;
  onSave: (geminiKey: string, googleSearchKey: string) => void;
}

export function ApiKeysPage({ geminiKey, googleSearchKey, onSave }: ApiKeysPageProps) {
  const [currentGeminiKey, setCurrentGeminiKey] = useState(geminiKey);
  const [currentGoogleSearchKey, setCurrentGoogleSearchKey] = useState(googleSearchKey);

  const handleSave = () => {
    console.log('Save button clicked');
    console.log('Gemini Key:', currentGeminiKey);
    console.log('Google Search Key:', currentGoogleSearchKey);
    onSave(currentGeminiKey, currentGoogleSearchKey);
    console.log('onSave function called');
    alert('API Keys saved!'); // Keep the alert for now
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <h2 className="text-2xl font-semibold">API Key Settings</h2>
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="gemini-key">Gemini API Key</Label>
        <Input
          id="gemini-key"
          type="password"
          value={currentGeminiKey}
          onChange={(e) => setCurrentGeminiKey(e.target.value)}
        />
      </div>
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="google-search-key">Google Search API Key</Label>
        <Input
          id="google-search-key"
          type="password"
          value={currentGoogleSearchKey}
          onChange={(e) => setCurrentGoogleSearchKey(e.target.value)}
        />
      </div>
      <Button onClick={handleSave}>Save API Keys</Button>
    </div>
  );
}
