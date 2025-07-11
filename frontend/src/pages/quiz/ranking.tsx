import { useState, useEffect } from 'react';
import { getRankings, Ranking } from '../../lib/api';

const RankingPage = () => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await getRankings();
        setRankings(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load rankings.');
      }
      setLoading(false);
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Rankings</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Rank</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map(r => (
            <tr key={r.rank}>
              <td className="border p-2 text-center">{r.rank}</td>
              <td className="border p-2">{r.username}</td>
              <td className="border p-2 text-center">{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingPage;
