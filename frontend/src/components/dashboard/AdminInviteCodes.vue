<template>
  <!-- admin panel for generating and managing invite codes -->
  <div class="admin-invites">
    <div class="section-header">
      <div>
        <h2>Invite Codes</h2>
        <p>Generate codes for new tutors to create their accounts</p>
      </div>
      <button class="btn btn-primary" @click="generateCode">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Generate New Code
      </button>
    </div>

    <!-- active codes section -->
    <div class="card" style="margin-bottom: 24px">
      <div class="card-header">
        <h3>Active Codes ({{ activeCodes.length }})</h3>
      </div>
      <div class="card-body">
        <div v-if="activeCodes.length > 0" class="codes-list">
          <div v-for="code in activeCodes" :key="code.code" class="code-item">
            <!-- code badge with copy button -->
            <div class="code-badge">
              <span class="code-text">{{ code.code }}</span>
              <button class="copy-btn" @click="copyCode(code.code)" :title="'Copy code'">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
            <!-- code metadata: role, creation date, expiry -->
            <div class="code-details">
              <div class="code-meta">
                <span class="code-role">{{ code.role }}</span>
                <span class="code-separator">·</span>
                <span class="code-date">Created {{ code.createdAt }}</span>
              </div>
              <div class="code-expires">Expires {{ code.expiresAt }}</div>
            </div>
            <!-- revoke button removes the code -->
            <button class="btn btn-danger-outline btn-sm" @click="revokeCode(code)">
              Revoke
            </button>
          </div>
        </div>
        <!-- empty state when no active codes -->
        <div v-else class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p>No active invite codes</p>
          <button class="btn btn-primary" style="margin-top: 16px" @click="generateCode">Generate Your First Code</button>
        </div>
      </div>
    </div>

    <!-- used codes section - historical record -->
    <div class="card">
      <div class="card-header">
        <h3>Used Codes ({{ usedCodes.length }})</h3>
      </div>
      <div class="card-body">
        <div v-if="usedCodes.length > 0" class="codes-list">
          <div v-for="code in usedCodes" :key="code.code" class="code-item used">
            <!-- greyed out badge for used codes -->
            <div class="code-badge used">
              <span class="code-text">{{ code.code }}</span>
            </div>
            <div class="code-details">
              <div class="code-meta">
                <span class="code-role">{{ code.role }}</span>
                <span class="code-separator">·</span>
                <span class="code-used-by">Used by {{ code.usedBy }}</span>
              </div>
              <div class="code-expires">Used on {{ code.usedAt }}</div>
            </div>
            <span class="status-badge used">Used</span>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No codes have been used yet</p>
        </div>
      </div>
    </div>

    <!-- copy success toast -->
    <div v-if="showCopyToast" class="copy-toast">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      Code copied to clipboard!
    </div>
  </div>
</template>

<script>
import { adminService } from '@/services/admin'

export default {
  name: 'AdminInviteCodes',

  data() {
    return {
      showCopyToast: false,
      codes: []
    }
  },

  computed: {
    activeCodes() { return this.codes.filter(c => c.status === 'active') },
    usedCodes() { return this.codes.filter(c => c.status === 'used') }
  },

  async created() {
    await this.loadCodes()
  },

  methods: {
    async loadCodes() {
      try {
        const data = await adminService.getInviteCodes()
        this.codes = data.map(c => this.formatCode(c))
      } catch (err) {
        console.error('failed to load invite codes:', err)
      }
    },

    // format a raw code object from api for display
    formatCode(c) {
      return {
        id: c.id,
        code: c.code,
        role: c.role,
        status: c.status,
        usedBy: c.usedBy,
        createdAt: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        expiresAt: new Date(c.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        usedAt: c.usedAt ? new Date(c.usedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null
      }
    },

    // generate a new code on the backend
    async generateCode() {
      try {
        const code = await adminService.generateInviteCode('Tutor')
        this.codes.unshift(this.formatCode(code))
      } catch (err) {
        console.error('failed to generate code:', err)
      }
    },

    // revoke a code via api (soft delete - sets status to revoked)
    async revokeCode(codeObj) {
      try {
        await adminService.revokeInviteCode(codeObj.id)
        this.codes = this.codes.filter(c => c.id !== codeObj.id)
      } catch (err) {
        console.error('failed to revoke code:', err)
      }
    },

    // copy invite code to clipboard and show toast
    copyCode(code) {
      navigator.clipboard.writeText(code)
      this.showCopyToast = true
      setTimeout(() => { this.showCopyToast = false }, 2000)
    }
  }
}
</script>

<style scoped>
.section-header {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;
}
.section-header h2 { font-size: 24px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
.section-header p { font-size: 15px; color: var(--gray-600); }

.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 10px;
  font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
  cursor: pointer; transition: all 0.2s ease; border: none;
}
.btn-primary { background: var(--utu-red); color: white; }
.btn-primary:hover { background: var(--utu-red-dark); }
.btn-sm { padding: 8px 16px; font-size: 14px; }

.btn-danger-outline {
  background: transparent; color: #DC2626;
  border: 1px solid rgba(220, 38, 38, 0.3);
}
.btn-danger-outline:hover { background: rgba(220, 38, 38, 0.05); border-color: #DC2626; }

.card {
  background: var(--warm-white); border-radius: 20px;
  border: 1px solid var(--gray-200); overflow: hidden;
}
.card-header {
  padding: 20px 24px; border-bottom: 1px solid var(--gray-200);
  display: flex; justify-content: space-between; align-items: center;
}
.card-header h3 { font-size: 16px; font-weight: 700; color: var(--navy); }
.card-body { padding: 24px; }

/* codes list */
.codes-list { display: flex; flex-direction: column; gap: 12px; }

.code-item {
  display: flex; align-items: center; gap: 16px;
  padding: 20px; background: var(--gray-100); border-radius: 12px;
  transition: all 0.2s ease;
}
.code-item:hover { background: var(--gray-200); }
.code-item.used { opacity: 0.7; }

.code-badge {
  display: flex; align-items: center; gap: 8px;
  background: var(--navy); padding: 10px 16px; border-radius: 8px;
  min-width: 180px;
}
.code-badge.used { background: var(--gray-400); }

.code-text {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 14px; font-weight: 700; color: white;
  letter-spacing: 1px;
}

.copy-btn {
  background: none; border: none; color: rgba(255, 255, 255, 0.6);
  cursor: pointer; padding: 2px; display: flex; margin-left: auto;
}
.copy-btn:hover { color: white; }

.code-details { flex: 1; }
.code-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.code-role { font-size: 14px; font-weight: 600; color: var(--navy); }
.code-separator { color: var(--gray-300); }
.code-date, .code-used-by { font-size: 13px; color: var(--gray-400); }
.code-expires { font-size: 13px; color: var(--gray-400); }

.status-badge {
  padding: 4px 12px; border-radius: 100px;
  font-size: 13px; font-weight: 600;
}
.status-badge.used { background: var(--gray-200); color: var(--gray-600); }

/* empty state */
.empty-state { text-align: center; padding: 48px; color: var(--gray-400); }
.empty-state svg { margin-bottom: 12px; opacity: 0.5; }
.empty-state p { font-size: 14px; }

/* copy toast */
.copy-toast {
  position: fixed; bottom: 32px; right: 32px;
  background: #22C55E; color: white;
  padding: 16px 24px; border-radius: 12px;
  font-size: 15px; font-weight: 600;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
  z-index: 100; animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .section-header { flex-direction: column; gap: 16px; }
  .code-item { flex-direction: column; align-items: flex-start; }
  .code-badge { min-width: auto; }
}
</style>