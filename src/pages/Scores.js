import React, { useState, useEffect } from 'react';
import { fetchScores, addScore, fetchContestants, fetchCompetitions, fetchSupervisors, exportData, importData } from '../utils/api';
import SearchInput from '../components/SearchInput';

function Scores() {
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [contestants, setContestants] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [selectedContestantId, setSelectedContestantId] = useState('');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  const [scoreValue, setScoreValue] = useState('');
  const [scoreDate, setScoreDate] = useState('');

  useEffect(() => {
    loadScores();
    loadContestants();
    loadCompetitions();
    loadSupervisors();
  }, []);

  const loadScores = async () => {
    try {
      const response = await fetchScores();
      setScores(response.data);
      setFilteredScores(response.data);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const loadContestants = async () => {
    try {
      const response = await fetchContestants();
      setContestants(response.data);
    } catch (error) {
      console.error('Error fetching contestants:', error);
    }
  };

  const loadCompetitions = async () => {
    try {
      const response = await fetchCompetitions();
      setCompetitions(response.data);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  };

  const loadSupervisors = async () => {
    try {
      const response = await fetchSupervisors();
      setSupervisors(response.data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const handleAddScore = async () => {
    if (!selectedContestantId || !selectedCompetitionId || !selectedSupervisorId || !scoreValue) return;
    try {
      await addScore({
        contestant_id: selectedContestantId,
        competition_id: selectedCompetitionId,
        supervisor_id: selectedSupervisorId,
        score: parseFloat(scoreValue),
        score_date: scoreDate || null,
      });
      setSelectedContestantId('');
      setSelectedCompetitionId('');
      setSelectedSupervisorId('');
      setScoreValue('');
      setScoreDate('');
      loadScores();
    } catch (error) {
      console.error('Error adding score:', error);
    }
  };

  const handleSearch = (e) => {
    const { value, results } = e.target;
    setSearchTerm(value);
    if (!value) {
      setFilteredScores(scores);
    } else if (results) {
      setFilteredScores(results);
    }
  };

  const handleExport = async (format) => {
    try {
      await exportData('scores', format);
    } catch (error) {
      console.error('Error exporting scores:', error);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await importData('scores', file);
      loadScores();
      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error importing scores:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">الدرجات</h1>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ابحث في الدرجات..."
          data={scores}
          searchKeys={['contestant_name', 'competition_name', 'supervisor_name']}
        />
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleExport('excel')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <i className="fas fa-file-excel ml-2"></i>
          تصدير Excel
        </button>
        <button
          onClick={() => handleExport('csv')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <i className="fas fa-file-csv ml-2"></i>
          تصدير CSV
        </button>
        <label className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer">
          <i className="fas fa-file-import ml-2"></i>
          استيراد ملف
          <input
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={handleImport}
          />
        </label>
      </div>

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">إضافة درجة جديدة</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={selectedContestantId}
            onChange={e => setSelectedContestantId(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          >
            <option value="" disabled>اختر المتسابقة</option>
            {contestants.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={selectedCompetitionId}
            onChange={e => setSelectedCompetitionId(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          >
            <option value="" disabled>اختر المسابقة</option>
            {competitions.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={selectedSupervisorId}
            onChange={e => setSelectedSupervisorId(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          >
            <option value="" disabled>اختر المشرفة</option>
            {supervisors.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="الدرجة"
            value={scoreValue}
            onChange={e => setScoreValue(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            min="0"
            max="100"
            dir="rtl"
          />
          <input
            type="date"
            value={scoreDate}
            onChange={e => setScoreDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          />
        </div>
        <button
          onClick={handleAddScore}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          إضافة
        </button>
      </div>

      <table className="w-full bg-white rounded shadow text-right" dir="rtl">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">المتسابقة</th>
            <th className="p-2 border">المسابقة</th>
            <th className="p-2 border">المشرفة</th>
            <th className="p-2 border">الدرجة</th>
            <th className="p-2 border">تاريخ الدرجة</th>
          </tr>
        </thead>
        <tbody>
          {filteredScores.map(s => (
            <tr key={s.id} className="hover:bg-gray-100">
              <td className="p-2 border">{s.contestant_name}</td>
              <td className="p-2 border">{s.competition_name}</td>
              <td className="p-2 border">{s.supervisor_name}</td>
              <td className="p-2 border">{s.score}</td>
              <td className="p-2 border">{s.score_date || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Scores;
