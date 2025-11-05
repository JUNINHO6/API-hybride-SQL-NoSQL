const Profile = require('../models/Profile.model');
const User = require('../models/User.model');

const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const profile = await Profile.findOne({ userId: parseInt(userId) });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profil non trouvé pour cet utilisateur'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

const createProfile = async (req, res) => {
  try {
    const { userId, preferences, history } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID utilisateur est requis'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const existingProfile = await Profile.findOne({ userId: parseInt(userId) });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Un profil existe déjà pour cet utilisateur'
      });
    }

    const profile = new Profile({
      userId: parseInt(userId),
      preferences: preferences || { genres: [], authors: [] },
      history: history || []
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Profil créé avec succès',
      data: profile
    });
  } catch (error) {
    console.error('Erreur lors de la création du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences, history } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const updateData = {
      updatedAt: Date.now()
    };

    if (preferences) {
      updateData.preferences = preferences;
    }

    const updateQuery = { $set: updateData };

    if (history) {
      updateQuery.$push = {
        history: { $each: Array.isArray(history) ? history : [history] }
      };
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: parseInt(userId) },
      updateQuery,
      { new: true, upsert: false }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profil non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: profile
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

const addHistoryEntry = async (req, res) => {
  try {
    const { userId } = req.params;
    const { book, rating, comment } = req.body;

    if (!book) {
      return res.status(400).json({
        success: false,
        message: 'Le nom du livre est requis'
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: parseInt(userId) },
      {
        $push: {
          history: {
            book,
            rating: rating || null,
            comment: comment || '',
            dateRead: new Date()
          }
        },
        $set: { updatedAt: Date.now() }
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profil non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Entrée ajoutée à l\'historique avec succès',
      data: profile
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout à l\'historique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

const getUserFull = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const profile = await Profile.findOne({ userId: parseInt(id) });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        profile: profile ? {
          preferences: profile.preferences,
          history: profile.history
        } : null
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données complètes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

module.exports = {
  getProfileByUserId,
  createProfile,
  updateProfile,
  addHistoryEntry,
  getUserFull
};
