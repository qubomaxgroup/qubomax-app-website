function initEmptyData() {
  return {
    version: 1,
    organizations: [],
    leads: [],
    quoteThreads: [],
    gmailConnections: [],
  };
}

module.exports = {
  initEmptyData,
  defaultDatabase: initEmptyData,
};

