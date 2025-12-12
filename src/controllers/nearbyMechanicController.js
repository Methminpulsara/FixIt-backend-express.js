const nearbyService = require("../services/nearbyMechanicService");

exports.getNearbyMechanics = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: "lat & lng required" });
        }

        const result = await nearbyService.getNearbyMechanics(
            { lat: Number(lat), lng: Number(lng) },
            Number(radius) || 5000  // default 5km
        );

        res.json({
            success: true,
            count: result.length,
            mechanics: result
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
