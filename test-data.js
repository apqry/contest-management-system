const db = require('./db');

async function insertTestData() {
  try {
    // Add contestants
    await db.run(
      'INSERT INTO contestants (name, birthdate, phone, email) VALUES (?, ?, ?, ?)',
      ['سارة أحمد', '2000-05-15', '0501234567', 'sara@example.com']
    );
    await db.run(
      'INSERT INTO contestants (name, birthdate, phone, email) VALUES (?, ?, ?, ?)',
      ['نورة محمد', '2001-03-20', '0507654321', 'noura@example.com']
    );
    await db.run(
      'INSERT INTO contestants (name, birthdate, phone, email) VALUES (?, ?, ?, ?)',
      ['ريم خالد', '2002-08-10', '0503456789', 'reem@example.com']
    );

    // Add supervisors
    await db.run(
      'INSERT INTO supervisors (name, phone, email) VALUES (?, ?, ?)',
      ['فاطمة العلي', '0551234567', 'fatima@example.com']
    );
    await db.run(
      'INSERT INTO supervisors (name, phone, email) VALUES (?, ?, ?)',
      ['عائشة السالم', '0557654321', 'aisha@example.com']
    );

    // Add competitions
    await db.run(
      'INSERT INTO competitions (name, date, description) VALUES (?, ?, ?)',
      ['مسابقة القرآن الكريم', '2024-01-15', 'مسابقة حفظ وتجويد القرآن الكريم']
    );
    await db.run(
      'INSERT INTO competitions (name, date, description) VALUES (?, ?, ?)',
      ['مسابقة الخط العربي', '2024-02-01', 'مسابقة في فن الخط العربي']
    );

    // Add scores
    await db.run(
      'INSERT INTO scores (contestant_id, competition_id, supervisor_id, score, score_date) VALUES (?, ?, ?, ?, ?)',
      [1, 1, 1, 95, '2024-01-15']
    );
    await db.run(
      'INSERT INTO scores (contestant_id, competition_id, supervisor_id, score, score_date) VALUES (?, ?, ?, ?, ?)',
      [2, 1, 1, 88, '2024-01-15']
    );
    await db.run(
      'INSERT INTO scores (contestant_id, competition_id, supervisor_id, score, score_date) VALUES (?, ?, ?, ?, ?)',
      [3, 1, 2, 92, '2024-01-15']
    );

    console.log('Test data inserted successfully');
  } catch (err) {
    console.error('Error inserting test data:', err);
  }
}

insertTestData();
