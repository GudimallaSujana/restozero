import Gamification from "../models/Gamification.js";
import { isDbConnected } from "../config/db.js";
import { demoStore } from "../utils/demoStore.js";
import { pointsFromWaste, calculateBadges } from "../utils/gamificationEngine.js";

export async function getPoints(req, res) {
  try {
    if (!isDbConnected()) return res.json(demoStore.gamification);

    const data = await Gamification.findOne({ userId: req.user.id });
    if (!data) return res.json({ points: 0, streak: 0, badges: [] });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updatePoints(req, res) {
  try {
    const { waste = 0, threshold = 15 } = req.body;
    const delta = pointsFromWaste(waste);

    if (!isDbConnected()) {
      demoStore.gamification.points += delta;
      demoStore.gamification.streak = waste < threshold ? demoStore.gamification.streak + 1 : 0;
      demoStore.gamification.badges = calculateBadges(demoStore.gamification.streak, demoStore.gamification.badges);
      return res.json(demoStore.gamification);
    }

    const game = (await Gamification.findOne({ userId: req.user.id })) ||
      (await Gamification.create({ userId: req.user.id, points: 0, streak: 0, badges: [] }));

    game.points += delta;
    game.streak = waste < threshold ? game.streak + 1 : 0;
    game.badges = calculateBadges(game.streak, game.badges);
    await game.save();

    return res.json(game);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
