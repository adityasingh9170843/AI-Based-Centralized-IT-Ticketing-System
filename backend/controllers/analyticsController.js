import Ticket from "../models/ticketModel.js";

export const getAnalytics = async (req, res) => {
  try {
   
    const totalTickets = await Ticket.countDocuments();

    
    const openTickets = await Ticket.countDocuments({ status: "open" });
    const resolvedTickets = await Ticket.countDocuments({ status: "resolved" });

    
    const resolved = await Ticket.find({ status: "resolved" });
    let avgResolutionTime = 0;

    if (resolved.length > 0) {
      const totalTime = resolved.reduce((sum, t) => {
        const created = new Date(t.createdAt);
        const resolvedAt = new Date(t.updatedAt);
        return sum + (resolvedAt - created);
      }, 0);
      avgResolutionTime = totalTime / resolved.length / (1000 * 60 * 60); // in hours
    }

  
    const engineerStats = await Ticket.aggregate([
      { $match: { status: "resolved" } },
      { $group: { _id: "$assignedTo", resolvedCount: { $sum: 1 } } },
      { $sort: { resolvedCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "engineer",
        },
      },
      { $unwind: "$engineer" },
      {
        $project: {
          name: "$engineer.name",
          email: "$engineer.email",
          resolvedCount: 1,
        },
      },
    ]);

    res.json({
      totalTickets,
      openTickets,
      resolvedTickets,
      avgResolutionTime: avgResolutionTime.toFixed(2),
      topEngineers: engineerStats,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
