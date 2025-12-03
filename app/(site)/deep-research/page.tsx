"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeepResearchPage() {
  const [topic, setTopic] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [results, setResults] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`/api/deep-research?jobId=${jobId}`);
        const data = await response.json();

        setStatus(`Job Status: ${data.status}`);

        if (data.status === 'done') {
          setResults(data.results || 'Research complete, but no content was extracted.');
          setIsLoading(false);
          setJobId(null); // Stop polling
          clearInterval(intervalId);
        } else if (data.status === 'error') {
          setResults('An error occurred during the research process.');
          setIsLoading(false);
          setJobId(null); // Stop polling
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Failed to poll for job status:", error);
        setResults('Failed to get research status.');
        setIsLoading(false);
        setJobId(null); // Stop polling
        clearInterval(intervalId);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults('');
    setStatus('Submitting research job...');

    try {
      const response = await fetch('/api/deep-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (response.ok) {
        setJobId(data.jobId);
        setStatus(`Research job created with ID: ${data.jobId}. Waiting for results...`);
      } else {
        throw new Error(data.error || 'Failed to start research job.');
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center text-white">Deep Research</h1>
      <p className="text-lg text-gray-300 mb-8 text-center">
        Submit a topic to begin a deep research analysis.
      </p>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Research Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your research topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Researching...' : 'Start Research'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {(status || results) && (
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Research Status & Results</CardTitle>
          </CardHeader>
          <CardContent>
            {status && <p className="text-sm text-gray-400 mb-4">{status}</p>}
            <Textarea
              readOnly
              value={results}
              placeholder="Research results will appear here..."
              className="min-h-[300px] bg-gray-900 text-white"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}