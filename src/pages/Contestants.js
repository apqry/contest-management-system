import React, { useState, useEffect } from 'react';
import { fetchContestants, addContestant, exportData, importData } from '../utils/api';
import SearchInput from '../components/SearchInput';

function Contestants() {
  const [contestants, setContestants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContestants, setFilteredContestants] = useState([]);
  const [newName, setNewName] = useState('');
  const [newBirthdate, setNewBirthdate] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    loadContestants();
  }, []);

  const loadContestants = async () => {
    try {
      const response = await fetchContestants();
      setContestants(response.data);
      setFilteredContestants(response.data);
    } catch (error) {
      console.error('Error fetching contestants:', error);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await addContestant({
        name: newName,
        birthdate: newBirthdate || null,
        phone: newPhone || null,
        email: newEmail || null,
      });
      setNewName('');
      setNewBirthdate('');
      setNewPhone('');
      setNewEmail('');
      loadContestants();
    } catch (error) {
      console.error('Error adding contestant:', error);
    }
  };

  const handleSearch = (e) => {
    const { value, results } = e.target;
    setSearchTerm(value);
    if (!value) {
      setFilteredContestants(contestants);
    } else if (results) {
      setFilteredContestants(results);
    }
  };

  const handleExport = async (format) => {
    try {
      await exportData('contestants', format);
    } catch (error) {
      console.error('Error exporting contestants:', error);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await importData('contestants', file);
      loadContestants();
      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error importing contestants:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">المتسابقات</h1>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ابحث عن متسابقة..."
          data={contestants}
          searchKeys={['name', 'email', 'phone']}
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
        <h2 className="text-xl font-semibold mb-2">إضافة متسابقة جديدة</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="الاسم"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          />
          <input
            type="date"
            placeholder="تاريخ الميلاد"
            value={newBirthdate}
            onChange={e => setNewBirthdate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          />
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={newPhone}
            onChange={e => setNewPhone(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            dir="rtl"
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          إضافة
        </button>
      </div>

      <table className="w-full bg-white rounded shadow text-right" dir="rtl">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">الاسم</th>
            <th className="p-2 border">تاريخ الميلاد</th>
            <th className="p-2 border">رقم الهاتف</th>
            <th className="p-2 border">البريد الإلكتروني</th>
          </tr>
        </thead>
        <tbody>
          {filteredContestants.map(c => (
            <tr key={c.id} className="hover:bg-gray-100">
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.birthdate || '-'}</td>
              <td className="p-2 border">{c.phone || '-'}</td>
              <td className="p-2 border">{c.email || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Contestants;
