// used by admins to create registration codes for new tutors

// ============================================================
//SHOW ON VIDEO
// show how the code is randomly generated in UTU-XXXXX format
// ============================================================
const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'UTU-'
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

module.exports = generateInviteCode
