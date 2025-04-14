const Metrics = require("../Models/MetricsModel");

const getDashboardStats = async (req, res) => {
  try {
    const result = await Metrics.aggregate([
      {
        $group: {
          _id: null,
          totalMailsFetched: { $sum: "$mailService.mailsFetched" },
          totalMailsPreprocessed: { $sum: "$mailService.mailsPreprocessed" },
          totalMailsPushed: { $sum: "$mailService.mailsPushed" },
          totalResponsesSent: { $sum: "$mailService.responseSent" },
          totalResponsesGenerated: { $sum: "$responseService.responseGenerated" },
          totalResponsesPushed: { $sum: "$responseService.responsePushed" },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No metrics found" });
    }

    const {
      totalMailsFetched,
      totalMailsPreprocessed,
      totalMailsPushed,
      totalResponsesSent,
      totalResponsesGenerated,
      totalResponsesPushed,
    } = result[0];

    const emailProcessed = totalMailsFetched + totalMailsPreprocessed + totalMailsPushed;
    const repliesSent = totalResponsesSent;
    const pendingReplies = totalMailsPreprocessed - totalResponsesSent;

    return res.json({
      emailProcessed,
      repliesSent,
      pendingReplies: pendingReplies < 0 ? 0 : pendingReplies,
      raw: {
        totalMailsFetched,
        totalMailsPreprocessed,
        totalMailsPushed,
        totalResponsesSent,
        totalResponsesGenerated,
        totalResponsesPushed,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {getDashboardStats};