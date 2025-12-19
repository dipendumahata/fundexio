const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { Proposal } = require("../models/proposal.model");
const { Investment } = require("../models/investment.model");
const { LoanApplication, LoanProduct } = require("../models/loan.model");
const { AdvisoryBooking, AdvisoryService } = require("../models/advisory.model");
const { Notification } = require("../models/notification.model");
const { UserRoles } = require("../constants");

const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  
  // 🟢 1. Common Data (সবার জন্য এক)
  // সব ইউজারকে তার নাম এবং আনরিড নোটিফিকেশন কাউন্ট পাঠানো হবে
  const unreadNotifications = await Notification.countDocuments({ 
    recipient: userId, 
    isRead: false 
  });
  
  let dashboardData = {
    user: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: role,
        avatar: req.user.avatar || "",
    },
    common: {
        unreadNotifications,
        profileComplete: req.user.bio ? true : false, // বায়ো না থাকলে প্রোফাইল ইনকমপ্লিট
    },
    roleSpecific: {} // এটা নিচে ফিলাপ হবে
  };

  // 🟡 2. Role Specific Data Logic
  switch (role) {
    case UserRoles.BUSINESS:
        // কতগুলো প্রপোজাল দিয়েছে, কত টাকা পেয়েছে, লোন নিয়েছে কি না
        const myProposals = await Proposal.find({ createdBy: userId });
        const myLoans = await LoanApplication.find({ applicant: userId });
        
        dashboardData.roleSpecific = {
            totalProposals: myProposals.length,
            totalFundingReceived: myProposals.reduce((acc, curr) => acc + curr.totalFunded, 0),
            activeLoans: myLoans.filter(l => l.status === "APPROVED").length,
            recentActivity: myProposals.slice(0, 3) // লাস্ট ৩টা প্রপোজাল
        };
        break;

        

    case UserRoles.INVESTOR:
        // কত ইনভেস্ট করেছে, কতগুলো ডিল করেছে
        const myInvestments = await Investment.find({ investor: userId }).populate("proposal", "title");
        
        dashboardData.roleSpecific = {
            totalInvested: myInvestments.reduce((acc, curr) => acc + curr.amount, 0),
            numberOfDeals: myInvestments.length,
            portfolioSummary: myInvestments.slice(0, 5) // লাস্ট ৫টা ইনভেস্টমেন্ট
        };
        break;

    case UserRoles.BANKER:
        // কতগুলো লোন প্রোডাক্ট বানিয়েছে, কতগুলো পেন্ডিং অ্যাপ্লিকেশন আছে
        const myProducts = await LoanProduct.find({ banker: userId }).select("_id");
        const productIds = myProducts.map(p => p._id);
        const pendingApps = await LoanApplication.countDocuments({ 
            loanProduct: { $in: productIds }, 
            status: "PENDING" 
        });

        dashboardData.roleSpecific = {
            activeLoanProducts: myProducts.length,
            pendingApplications: pendingApps,
            totalApplications: await LoanApplication.countDocuments({ loanProduct: { $in: productIds } })
        };
        break;

    case UserRoles.ADVISOR:
        const myServices = await AdvisoryService.find({ advisor: userId });
        // Populate service title too
        const myBookings = await AdvisoryBooking.find({ advisor: userId })
            .populate("client", "firstName lastName email")
            .populate("service", "title duration"); // Service title লাগবে
        
        // 🛠️ Modified Logic: Separate Pending & Upcoming
        const pendingSessions = myBookings.filter(b => b.status === "PENDING");
        const upcomingSessions = myBookings.filter(b => b.status === "CONFIRMED" && new Date(b.scheduledAt) > new Date());

        dashboardData.roleSpecific = {
            activeServices: myServices.length,
            totalBookings: myBookings.length,
            pendingSessions: pendingSessions, // ✅ New: For approval list
            upcomingSessions: upcomingSessions, // ✅ Existing: For schedule
            nextSession: upcomingSessions[0] || null
        };
        break;
    
    
  }

  return res.status(200).json(new ApiResponse(200, dashboardData, "Dashboard data fetched"));
});

module.exports = { getStats };