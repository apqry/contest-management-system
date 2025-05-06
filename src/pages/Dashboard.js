import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../utils/api';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [recentCompetitions, setRecentCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetchDashboardData();
        setMetrics(response.data.metrics);
        setRecentCompetitions(response.data.recentCompetitions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          alt="Dashboard Banner"
          className="w-full h-48 object-cover rounded-lg shadow-md"
        />
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-2">المتسابقات</h2>
          <p className="text-4xl font-bold">{metrics.contestants}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-2">المشرفات</h2>
          <p className="text-4xl font-bold">{metrics.supervisors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-2">المسابقات</h2>
          <p className="text-4xl font-bold">{metrics.competitions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-2">الدرجات</h2>
          <p className="text-4xl font-bold">{metrics.scores}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">المسابقات الأخيرة</h2>
        <ul className="space-y-3">
          {recentCompetitions.length === 0 && <li>لا توجد مسابقات حديثة</li>}
          {recentCompetitions.map((comp) => (
            <li key={comp.id} className="bg-white p-4 rounded shadow flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{comp.name}</h3>
                <p className="text-gray-600">{comp.description || 'بدون وصف'}</p>
              </div>
              <time className="text-gray-500">{new Date(comp.date).toLocaleDateString()}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
