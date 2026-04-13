import express from "express";
import client from "../libs/elasticsearch.js";

const router = express.Router();

// GET /api/search/candidates?skill=Java&location=HCMC
router.get("/candidates", async (req, res) => {
    const { skill, location } = req.query;
    try {
        const result = await client.search({
            index: "candidates",
            query: {
                bool: {
                    must: [
                        { match: { skills: skill } },
                        { match: { location } }
                    ]
                }
            }
        });

        res.json(result.hits.hits);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Search error" });
    }
});

export default router;

