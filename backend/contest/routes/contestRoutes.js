import { Router } from "express";
import contestController from "../controllers/contestController.js";

const router = Router();

// GET route for contests
router.get("/", async (req, res) => {
  try {
    // Support both 'platform' (new) and 'host' (legacy) query parameters
    let platform = req.query.platform || req.query.host;
    let vanity = req.query.vanity;

    if (platform) {
      platform = platform.toLowerCase();
    }

    if (vanity) {
      vanity = vanity.toLowerCase();
    }

    const platformArray = platform ? platform.split(",") : [];
    // const vanityArray = vanity ? vanity.split(",") : [];

    const contests = await contestController.getContestList();

    if (vanity) {
      const contestByVanity =
        await contestController.getContestByVanity(vanity);
      if (contestByVanity) {
        res.status(200).json({
          total: 1,
          results: [contestByVanity],
        });
      } else {
        res.status(200).json({
          total: 0,
          results: [],
        });
      }
    } else if (platform) {
      const filteredContests = contests.filter((contest) => {
        return platformArray.includes(contest.host);
      });

      res.status(200).json({
        total: filteredContests.length,
        results: filteredContests,
      });
    } else {
      res.status(200).json({
        total: contests.length,
        results: contests,
      });
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: "Internal server error",
    });
  }
});

export default router;
