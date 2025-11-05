const Book = require('../models/Book.model');

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livre non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du livre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, available } = req.body;

    const titleTrimmed = title ? String(title).trim() : '';
    const authorTrimmed = author ? String(author).trim() : '';

    if (!titleTrimmed || !authorTrimmed) {
      const missingFields = [];
      if (!titleTrimmed) missingFields.push('titre');
      if (!authorTrimmed) missingFields.push('auteur');
      
      return res.status(400).json({
        success: false,
        message: `Le(s) champ(s) suivant(s) sont requis : ${missingFields.join(', ')}`,
        received: {
          title: title || null,
          author: author || null
        }
      });
    }

    const book = await Book.create(titleTrimmed, authorTrimmed, available !== undefined ? available : true);
    res.status(201).json({
      success: true,
      message: 'Livre créé avec succès',
      data: book
    });
  } catch (error) {
    console.error('Erreur lors de la création du livre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, available } = req.body;

    const titleTrimmed = title ? String(title).trim() : '';
    const authorTrimmed = author ? String(author).trim() : '';

    if (!titleTrimmed || !authorTrimmed) {
      const missingFields = [];
      if (!titleTrimmed) missingFields.push('titre');
      if (!authorTrimmed) missingFields.push('auteur');
      
      return res.status(400).json({
        success: false,
        message: `Le(s) champ(s) suivant(s) sont requis : ${missingFields.join(', ')}`,
        received: {
          title: title || null,
          author: author || null
        }
      });
    }

    const book = await Book.update(id, titleTrimmed, authorTrimmed, available !== undefined ? available : true);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livre non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Livre mis à jour avec succès',
      data: book
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du livre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.delete(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livre non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Livre supprimé avec succès',
      data: book
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du livre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
