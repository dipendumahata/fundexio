const UserRoles = {
  ADMIN: "ADMIN",
  BUSINESS: "BUSINESS",
  INVESTOR: "INVESTOR",
  BANKER: "BANKER",
  ADVISOR: "ADVISOR",
};

const ProposalStatus = {
  ACTIVE: "ACTIVE",       // ফান্ডিং চলছে
  FUNDED: "FUNDED",       // টাকা জোগাড় হয়ে গেছে
  CLOSED: "CLOSED",       // প্রপোজাল বন্ধ
  REJECTED: "REJECTED",   // অ্যাডমিন বাতিল করেছে
};

const InvestmentStatus = {
  PENDING: "PENDING",     // প্রসেসিং হচ্ছে
  COMPLETED: "COMPLETED", // টাকা ট্রান্সফার সফল
  FAILED: "FAILED",       // ব্যর্থ
};

const AvailableProposalStatus = Object.values(ProposalStatus);
const AvailableInvestmentStatus = Object.values(InvestmentStatus);

const AvailableUserRoles = Object.values(UserRoles);

module.exports = { 
  UserRoles, 
  AvailableUserRoles,
  ProposalStatus,
  AvailableProposalStatus,
  InvestmentStatus,
  AvailableInvestmentStatus
};