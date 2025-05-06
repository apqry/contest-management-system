const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const ExcelJS = require('exceljs');
const fastcsv = require('fast-csv');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(bodyParser.json());

// Serve static files from exports directory
app.use('/exports', express.static(path.join(__dirname, 'exports')));

// Initialize database tables
async function initDb() {
  const createContestantsTable = `
    CREATE TABLE IF NOT EXISTS contestants (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      birthdate DATE,
      phone TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const createSupervisorsTable = `
    CREATE TABLE IF NOT EXISTS supervisors (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const createCompetitionsTable = `
    CREATE TABLE IF NOT EXISTS competitions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      date DATE,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const createScoresTable = `
    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      contestant_id INTEGER NOT NULL,
      competition_id INTEGER NOT NULL,
      supervisor_id INTEGER NOT NULL,
      score REAL NOT NULL,
      score_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (contestant_id) REFERENCES contestants(id) ON DELETE CASCADE,
      FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
      FOREIGN KEY (supervisor_id) REFERENCES supervisors(id) ON DELETE CASCADE
    )
  `;

  const createContestantSupervisorTable = `
    CREATE TABLE IF NOT EXISTS contestant_supervisor (
      contestant_id INTEGER NOT NULL,
      supervisor_id INTEGER NOT NULL,
      PRIMARY KEY (contestant_id, supervisor_id),
      FOREIGN KEY (contestant_id) REFERENCES contestants(id) ON DELETE CASCADE,
      FOREIGN KEY (supervisor_id) REFERENCES supervisors(id) ON DELETE CASCADE
    )
  `;

  try {
    await db.query(createContestantsTable);
    await db.query(createSupervisorsTable);
    await db.query(createCompetitionsTable);
    await db.query(createScoresTable);
    await db.query(createContestantSupervisorTable);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
}

// Export endpoints
app.get('/api/export/:entity', async (req, res) => {
  const { entity } = req.params;
  const { format } = req.query;
  
  try {
    let data;
    switch (entity) {
      case 'contestants':
        data = await db.query('SELECT * FROM contestants ORDER BY id');
        break;
      case 'supervisors':
        data = await db.query('SELECT * FROM supervisors ORDER BY id');
        break;
      case 'competitions':
        data = await db.query('SELECT * FROM competitions ORDER BY id');
        break;
      case 'scores':
        data = await db.query(`
          SELECT s.id, c.name as contestant_name, comp.name as competition_name,
                 sup.name as supervisor_name, s.score, s.score_date
          FROM scores s
          JOIN contestants c ON s.contestant_id = c.id
          JOIN competitions comp ON s.competition_id = comp.id
          JOIN supervisors sup ON s.supervisor_id = sup.id
          ORDER BY s.id
        `);
        break;
      default:
        return res.status(400).json({ error: 'Invalid entity type' });
    }

    const filename = `${entity}_${Date.now()}.${format}`;
    const filepath = path.join(__dirname, 'exports', filename);

    if (format === 'csv') {
      const ws = fs.createWriteStream(filepath);
      fastcsv.write(data.rows, { headers: true })
        .pipe(ws)
        .on('finish', () => {
          res.download(filepath, `${entity}.${format}`, (err) => {
            if (err) {
              console.error('Error downloading file:', err);
              res.status(500).json({ error: 'Error downloading file' });
            }
            // Delete the file after sending
            fs.unlink(filepath, (unlinkErr) => {
              if (unlinkErr) console.error('Error deleting file:', unlinkErr);
            });
          });
        });
    } else if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(entity);
      
      // Add headers
      const headers = Object.keys(data.rows[0] || {});
      worksheet.addRow(headers);
      
      // Add data
      data.rows.forEach(row => {
        worksheet.addRow(Object.values(row));
      });

      await workbook.xlsx.writeFile(filepath);
      res.download(filepath, `${entity}.${format}`, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ error: 'Error downloading file' });
        }
        // Delete the file after sending
        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
      });
    } else {
      res.status(400).json({ error: 'Invalid format type' });
    }
  } catch (err) {
    console.error(`Error exporting ${entity}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Import endpoints
app.post('/api/import/:entity', upload.single('file'), async (req, res) => {
  const { entity } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    let importedCount = 0;
    const isExcel = file.originalname.endsWith('.xlsx');

    if (isExcel) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(file.path);
      const worksheet = workbook.getWorksheet(1);
      const headers = worksheet.getRow(1).values.slice(1); // Remove empty first cell

      for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i).values.slice(1);
        const data = {};
        headers.forEach((header, index) => {
          data[header] = row[index];
        });

        switch (entity) {
          case 'contestants':
            await db.query(
              'INSERT INTO contestants (name, birthdate, phone, email) VALUES ($1, $2, $3, $4)',
              [data.name, data.birthdate, data.phone, data.email]
            );
            break;
          case 'supervisors':
            await db.query(
              'INSERT INTO supervisors (name, phone, email) VALUES ($1, $2, $3)',
              [data.name, data.phone, data.email]
            );
            break;
          case 'competitions':
            await db.query(
              'INSERT INTO competitions (name, date, description) VALUES ($1, $2, $3)',
              [data.name, data.date, data.description]
            );
            break;
        }
        importedCount++;
      }
    } else {
      // CSV import
      const rows = [];
      await new Promise((resolve, reject) => {
        fastcsv.parseFile(file.path, { headers: true })
          .on('data', row => rows.push(row))
          .on('error', reject)
          .on('end', resolve);
      });

      for (const row of rows) {
        switch (entity) {
          case 'contestants':
            await db.query(
              'INSERT INTO contestants (name, birthdate, phone, email) VALUES ($1, $2, $3, $4)',
              [row.name, row.birthdate, row.phone, row.email]
            );
            break;
          case 'supervisors':
            await db.query(
              'INSERT INTO supervisors (name, phone, email) VALUES ($1, $2, $3)',
              [row.name, row.phone, row.email]
            );
            break;
          case 'competitions':
            await db.query(
              'INSERT INTO competitions (name, date, description) VALUES ($1, $2, $3)',
              [row.name, row.date, row.description]
            );
            break;
        }
        importedCount++;
      }
    }

    // Delete the uploaded file
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });

    res.json({ message: `Successfully imported ${importedCount} records` });
  } catch (err) {
    console.error(`Error importing ${entity}:`, err);
    // Delete the uploaded file on error
    fs.unlink(file.path, (unlinkErr) => {
      if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
    });
    res.status(500).json({ error: err.message });
  }
});

// Routes for contestants
app.get('/api/contestants', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM contestants');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contestants', async (req, res) => {
  const { name, birthdate, phone, email } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO contestants (name, birthdate, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, birthdate, phone, email]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes for supervisors
app.get('/api/supervisors', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM supervisors');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/supervisors', async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO supervisors (name, phone, email) VALUES ($1, $2, $3) RETURNING *',
      [name, phone, email]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes for competitions
app.get('/api/competitions', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM competitions');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/competitions', async (req, res) => {
  const { name, date, description } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO competitions (name, date, description) VALUES ($1, $2, $3) RETURNING *',
      [name, date, description]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes for scores
app.get('/api/scores', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT scores.id, contestants.name AS contestant_name, competitions.name AS competition_name,
             supervisors.name AS supervisor_name, scores.score, scores.score_date
      FROM scores
      JOIN contestants ON scores.contestant_id = contestants.id
      JOIN competitions ON scores.competition_id = competitions.id
      JOIN supervisors ON scores.supervisor_id = supervisors.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scores', async (req, res) => {
  const { contestant_id, competition_id, supervisor_id, score, score_date } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO scores (contestant_id, competition_id, supervisor_id, score, score_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [contestant_id, competition_id, supervisor_id, score, score_date]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Batch add contestants to competition with scores
app.post('/api/competitions/:competitionId/add-contestants', async (req, res) => {
  const competitionId = req.params.competitionId;
  const { contestants } = req.body; // Array of { contestant_id, score, supervisor_id, score_date }
  
  if (!Array.isArray(contestants)) {
    return res.status(400).json({ error: 'contestants must be an array' });
  }
  
  try {
    for (const c of contestants) {
      await db.query(
        'INSERT INTO scores (contestant_id, competition_id, supervisor_id, score, score_date) VALUES ($1, $2, $3, $4, $5)',
        [c.contestant_id, competitionId, c.supervisor_id, c.score, c.score_date]
      );
    }
    res.json({ message: 'Contestants added to competition with scores' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve React app for any other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'حدث خطأ في الخادم' });
});

// Start server
app.listen(port, async () => {
  try {
    await initDb();
    console.log(`Server running on port ${port}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
});
