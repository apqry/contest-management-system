import React, { useState, useEffect } from 'react';
import { fetchCompetitions, addCompetition, batchAddContestantsToCompetition, fetchContestants, fetchSupervisors, exportData, importData } from '../utils/api';
import SearchInput from '../components/SearchInput';

function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [contestants, setContestants] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
  const [selectedContestants, setSelectedContestants] = useState([]);
  const [scores, setScores] = useState({});
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(null);
  const [scoreDate, setScoreDate] = useState('');

  useEffect(() => {
    loadCompetitions();
    loadContestants();
    loadSupervisors();
  }, []);

  const loadCompetitions = async () => {
    try {
      const response = await fetchCompetitions();
      setCompetitions(response.data);
      setFilteredCompetitions(response.data);
    } catch (error) {
      console.error('Error fetching competitions:', error);
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

  const loadSupervisors = async () => {
    try {
      const response = await fetchSupervisors();
      setSupervisors(response.data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const handleAddCompetition = async () => {
    if (!newName.trim()) return;
    try {
      await addCompetition({
        name: newName,
        date: newDate || null,
        description: newDescription || null,
      });
      setNewName('');
      setNewDate('');
      setNewDescription('');
      loadCompetitions();
    } catch (error) {
      console.error('Error adding competition:', error);
    }
  };

  const handleSearch = (e) => {
    const { value, results } = e.target;
    setSearchTerm(value);
    if (!value) {
      setFilteredCompetitions(competitions);
    } else if (results) {
      setFilteredCompetitions(results);
    }
  };

  const handleExport = async (format) => {
    try {
      await exportData('competitions', format);
    } catch (error) {
      console.error('Error exporting competitions:', error);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await importData('competitions', file);
      loadCompetitions();
      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error importing competitions:', error);
    }
  };

  const toggleContestantSelection = (id) => {
    setSelectedContestants(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleScoreChange = (contestantId, value) => {
    setScores(prev => ({ ...prev, [contestantId]: value }));
  };

  const handleBatchAdd = async () => {
    if (!selectedCompetitionId || selectedContestants.length === 0 || !selectedSupervisorId) return;
    const contestantsData = selectedContestants.map(id => ({
      contestant_id: id,
      score: parseFloat(scores[id]) || 0,
      supervisor_id: selectedSupervisorId,
      score_date: scoreDate || null,
    }));
    try {
      await batchAddContestantsToCompetition(selectedCompetitionId, contestantsData);
      setSelectedContestants([]);
      setScores({});
      setSelectedSupervisorId(null);
      setScoreDate('');
      alert('تمت إضافة المتسابقات إلى المسابقة بنجاح');
    } catch (error) {
      console.error('Error batch adding contestants:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">المسابقات</h1>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ابحث عن مسابقة..."
          data={competitions}
          searchKeys={['name', 'description']}
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
        <h2 className="text-xl font-semibold mb-2">إضافة مسابقة جديدة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="اسم المسابقة"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          />
          <input
            type="date"
            placeholder="تاريخ المسابقة"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          />
          <input
            type="text"
            placeholder="وصف المسابقة"
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          />
        </div>
        <button
          onClick={handleAddCompetition}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          إضافة
        </button>
      </div>

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">إضافة المتسابقات إلى مسابقة</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedCompetitionId || ''}
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
            value={selectedSupervisorId || ''}
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
            type="date"
            value={scoreDate}
            onChange={e => setScoreDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          />
        </div>

        <div className="mt-4 max-h-64 overflow-y-auto border border-gray-300 rounded p-2">
          {contestants.map(c => (
            <div key={c.id} className="flex items-center justify-between mb-2">
              <label className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  checked={selectedContestants.includes(c.id)}
                  onChange={() => toggleContestantSelection(c.id)}
                />
                <span>{c.name}</span>
              </label>
              {selectedContestants.includes(c.id) && (
                <input
                  type="number"
                  placeholder="الدرجة"
                  value={scores[c.id] || ''}
                  onChange={e => handleScoreChange(c.id, e.target.value)}
                  className="w-20 p-1 border border-gray-300 rounded"
                  min="0"
                  max="100"
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleBatchAdd}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          إضافة المتسابقات المحددة
        </button>
      </div>

      <table className="w-full bg-white rounded shadow text-right" dir="rtl">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">اسم المسابقة</th>
            <th className="p-2 border">التاريخ</th>
            <th className="p-2 border">الوصف</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompetitions.map(c => (
            <tr key={c.id} className="hover:bg-gray-100">
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.date || '-'}</td>
              <td className="p-2 border">{c.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Competitions;
