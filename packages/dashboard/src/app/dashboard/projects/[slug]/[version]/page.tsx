'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

interface Config {
  version: string;
  config: Record<string, unknown>;
  createdAt: string;
}

export default function ConfigDetailPage() {
  const params = useParams() as { slug: string; version: string };
  const { slug, version } = params;
  const searchParams = useSearchParams();
  const env = searchParams?.get('env') ?? 'production';
  const router = useRouter();

  const [config, setConfig] = useState<Config | null>(null);
  const [jsonData, setJsonData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchConfig(): Promise<void> {
      const token = localStorage.getItem('corev_token');
      if (!token) {
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/configs/${slug}/${version}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-corev-env': env,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          setError(`Failed to fetch config: ${res.status} ${res.statusText} - ${text}`);
          return;
        }

        const data = (await res.json()) as Config;
        setConfig(data);
        setJsonData(data.config);
      } catch {
        setError('Failed to load config.');
      } finally {
        setLoading(false);
      }
    }

    void fetchConfig();
  }, [slug, version, env]);

  const handleSave = async (): Promise<void> => {
    const token = localStorage.getItem('corev_token');
    if (!token) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/configs/${slug}/${version}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-corev-env': env,
        },
        body: JSON.stringify({ config: jsonData }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(`Update failed: ${res.status} ${res.statusText} - ${text}`);
        return;
      }

      alert('Configuration updated successfully!');
    } catch {
      alert('Update failed. Check your connection or JSON.');
    }
  };

  const handleDelete = async (): Promise<void> => {
    const confirmed = confirm(`Delete version ${version}
                                   from project "${slug}"?`);
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('corev_token');
    if (!token) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/configs/${slug}/${version}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-corev-env': env,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        setError(`Delete failed: ${res.status} ${res.statusText} - ${text}`);
        return;
      }

      alert('Config deleted.');
      router.push(`/dashboard/projects/${slug}?env=${env}`);
    } catch {
      alert('Failed to delete config.');
    }
  };

  return (
    <div className="ml-30 mx-auto mt-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Project: <span className="text-[#00b894]">{slug}</span>
        </h1>
        <div className="flex items-center space-x-2 h-[36px] ">
          <div className="h-[36px] text-2xl font-bold px-4 flex items-center justify-center text-[#006b5f]">
            Version: <span className="ml-1 font-bold text-[#00b894]">{version}</span>
          </div>
          <div className="h-[36px] text-2xl font-bold px-4 flex items-center justify-center text-[#006b5f]">
            Environment: <span className="ml-1 font-bold text-[#e17055]">{env}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.back()}
            height="h-[36px]"
            bgColor="bg-[#eeeeee]"
            hoverColor="hover:bg-[#dddddd]"
          >
            ← Back
          </Button>
          <Button
            onClick={handleDelete}
            height="h-[36px]"
            bgColor="bg-[#ffe3e3]"
            hoverColor="hover:bg-[#ffcccc]"
          >
            Delete
          </Button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && config && (
        <div className="bg-white border-2 border-[#333333] h-fit rounded-xl p-6 shadow space-y-4">
          <p className="text-sm text-gray-500">
            Created at: {new Date(config.createdAt).toLocaleString()}
          </p>

          <textarea
            rows={20}
            value={JSON.stringify(jsonData, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setJsonData(parsed);
                setError('');
              } catch {
                setError('Invalid JSON');
              }
            }}
            className="w-full border px-4 py-2 rounded font-mono text-sm"
            style={{ minHeight: '400px' }}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              height="h-[38px]"
              bgColor="bg-[#AEFFDE]"
              hoverColor="hover:bg-[#92f0c6]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
      {!loading && !error && !config && <p>No config found.</p>}
    </div>
  );
}
