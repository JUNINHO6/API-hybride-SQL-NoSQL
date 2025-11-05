const { pool } = require('../config/db.postgres');

class Book {
  static async findAll() {
    const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(title, author, available = true) {
    const result = await pool.query(
      'INSERT INTO books (title, author, available) VALUES ($1, $2, $3) RETURNING *',
      [title, author, available]
    );
    return result.rows[0];
  }

  static async update(id, title, author, available) {
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, available = $3 WHERE id = $4 RETURNING *',
      [title, author, available, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Book;
