module.exports = async function runBot() {
  const TARGETS = [
    'https://www.facebook.com/ronnie.ezell.510125/',
  ];

  for (const url of TARGETS) {
    await runForTargetProfile(url);
    await wait(5000, 10000);
  }
};
